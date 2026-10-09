import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthenticationService, UserResponse, OpenAPI } from '@/api/generated';

interface AuthContextType {
  user: UserResponse | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UserResponse>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
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
    try {
      const response = await AuthenticationService.getCurrentUser();
      if (response.data) {
        setUser(response.data);
        localStorage.setItem('userProfile', JSON.stringify(response.data));
      }
    } catch {
      // If profile fetch fails (e.g. expired token), clean up
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userProfile');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      refreshUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [accessToken, refreshUserProfile]);

  const login = async (email: string, password: string): Promise<UserResponse> => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedRefreshToken) {
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

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        isLoading,
        login,
        logout,
        changePassword,
        refreshUserProfile,
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
