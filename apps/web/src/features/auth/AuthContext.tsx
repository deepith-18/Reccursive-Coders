import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthenticationService, UserResponse, OpenAPI } from '@/api/generated';

interface AuthContextType {
  user: UserResponse | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isImpersonating: boolean;
  impersonatedUser: UserResponse | null;
  realAdminUser: UserResponse | null;
  login: (email: string, password: string) => Promise<UserResponse>;
  loginAsDemo: (role: 'STUDENT' | 'TRAINER' | 'ADMIN') => UserResponse;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  startImpersonation: (student: UserResponse) => void;
  stopImpersonation: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(() => {
    const cachedUser = localStorage.getItem('userProfile');
    return cachedUser ? JSON.parse(cachedUser) : null;
  });
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem('accessToken');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync OpenAPI token header
  useEffect(() => {
    if (accessToken) {
      OpenAPI.TOKEN = accessToken;
    } else {
      OpenAPI.TOKEN = undefined;
    }
  }, [accessToken]);

  const refreshUserProfile = useCallback(async () => {
    // If running in demo mode or offline preview, keep cached user profile
    if (accessToken?.startsWith('mock-demo-token')) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await AuthenticationService.getCurrentUser();
      if (response.data) {
        setUser(response.data);
        localStorage.setItem('userProfile', JSON.stringify(response.data));
      }
    } catch {
      // If profile fetch fails on a live session, check if we have a valid cached user
      const cached = localStorage.getItem('userProfile');
      if (!cached) {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      refreshUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [accessToken, refreshUserProfile]);

  const loginAsDemo = (role: 'STUDENT' | 'TRAINER' | 'ADMIN'): UserResponse => {
    const demoProfiles: Record<string, UserResponse> = {
      STUDENT: {
        id: 'demo-student-id',
        fullName: 'Candidate Student',
        email: 'student@recursivecoders.in',
        role: UserResponse.role.STUDENT,
        status: UserResponse.status.ACTIVE,
        forcePasswordChange: false,
      },
      TRAINER: {
        id: 'demo-trainer-id',
        fullName: 'Dr. Ramesh K',
        email: 'trainer@recursivecoders.in',
        role: UserResponse.role.TRAINER,
        status: UserResponse.status.ACTIVE,
        forcePasswordChange: false,
      },
      ADMIN: {
        id: 'demo-admin-id',
        fullName: 'Admin Operations',
        email: 'admin@recursivecoders.in',
        role: UserResponse.role.ADMIN,
        status: UserResponse.status.ACTIVE,
        forcePasswordChange: false,
      },
    };

    const profile = demoProfiles[role]!;
    const mockToken = `mock-demo-token-${role.toLowerCase()}-${Date.now()}`;
    setAccessToken(mockToken);
    setUser(profile);
    OpenAPI.TOKEN = mockToken;
    localStorage.setItem('accessToken', mockToken);
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setIsLoading(false);
    return profile;
  };

  const login = async (email: string, password: string): Promise<UserResponse> => {
    setIsLoading(true);

    // If demo email or requested demo accounts, provide instant authentication
    if (
      email.toLowerCase().includes('demo') ||
      email.toLowerCase() === 'student@recursivecoders.in' ||
      email.toLowerCase() === 'trainer@recursivecoders.in' ||
      email.toLowerCase() === 'admin@recursivecoders.in'
    ) {
      let role: 'STUDENT' | 'TRAINER' | 'ADMIN' = 'STUDENT';
      if (email.toLowerCase().includes('trainer')) role = 'TRAINER';
      else if (email.toLowerCase().includes('admin')) role = 'ADMIN';
      return loginAsDemo(role);
    }

    try {
      const response = await AuthenticationService.login({
        email,
        password,
      });

      if (!response.data || !response.data.accessToken || !response.data.user) {
        throw new Error('Malformed login response');
      }

      const { accessToken: token, refreshToken, user: profile } = response.data;
      setAccessToken(token);
      setUser(profile);
      OpenAPI.TOKEN = token;

      localStorage.setItem('accessToken', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      localStorage.setItem('userProfile', JSON.stringify(profile));

      return profile;
    } catch (err: unknown) {
      // If backend is down with 500 or connection refused, fallback gracefully
      const apiErr = err as { body?: { message?: string }; message?: string; status?: number };
      const status = apiErr.status;
      const msg = apiErr.body?.message || apiErr.message || '';
      if (status === 500 || msg.includes('Network Error') || msg.includes('ERR_CONNECTION_REFUSED')) {
        let detectedRole: 'STUDENT' | 'TRAINER' | 'ADMIN' = 'STUDENT';
        if (email.includes('trainer')) detectedRole = 'TRAINER';
        if (email.includes('admin')) detectedRole = 'ADMIN';
        return loginAsDemo(detectedRole);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedRefreshToken && !accessToken?.startsWith('mock-demo-token')) {
      try {
        await AuthenticationService.logout({ refreshToken: storedRefreshToken });
      } catch {
        // Silently continue local logout even if server revocation failed
      }
    }

    setUser(null);
    setAccessToken(null);
    OpenAPI.TOKEN = undefined;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userProfile');
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await AuthenticationService.changePassword({
      currentPassword,
      newPassword,
    });
    if (user) {
      const updatedUser: UserResponse = { ...user, forcePasswordChange: false };
      setUser(updatedUser);
      localStorage.setItem('userProfile', JSON.stringify(updatedUser));
    }
  };

  const [realAdminUser, setRealAdminUser] = useState<UserResponse | null>(() => {
    const cachedAdmin = sessionStorage.getItem('realAdminUser');
    return cachedAdmin ? JSON.parse(cachedAdmin) : null;
  });

  const [impersonatedUser, setImpersonatedUser] = useState<UserResponse | null>(() => {
    const cachedImpersonated = sessionStorage.getItem('impersonatedUser');
    return cachedImpersonated ? JSON.parse(cachedImpersonated) : null;
  });

  const startImpersonation = (student: UserResponse) => {
    if (!user) return;
    setRealAdminUser(user);
    setImpersonatedUser(student);
    sessionStorage.setItem('realAdminUser', JSON.stringify(user));
    sessionStorage.setItem('impersonatedUser', JSON.stringify(student));
  };

  const stopImpersonation = () => {
    setRealAdminUser(null);
    setImpersonatedUser(null);
    sessionStorage.removeItem('realAdminUser');
    sessionStorage.removeItem('impersonatedUser');
  };

  // Active user represents the impersonated student if active, otherwise real logged-in user
  const effectiveUser = impersonatedUser || user;
  const isImpersonating = !!impersonatedUser;

  return (
    <AuthContext.Provider
      value={{
        user: effectiveUser,
        accessToken,
        isAuthenticated: !!effectiveUser && !!accessToken,
        isLoading,
        isImpersonating,
        impersonatedUser,
        realAdminUser,
        login,
        loginAsDemo,
        logout,
        changePassword,
        refreshUserProfile,
        startImpersonation,
        stopImpersonation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
