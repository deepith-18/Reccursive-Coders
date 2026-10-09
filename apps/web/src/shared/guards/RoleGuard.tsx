import React from 'react';
import { Navigate, useLocation, Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { ChangePasswordModal } from '@/features/auth/ChangePasswordModal';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: Array<'STUDENT' | 'TRAINER' | 'ADMIN'>;
  children?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-muted-foreground font-medium">Verifying access...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Force change password blocker
  if (user.forcePasswordChange) {
    return <ChangePasswordModal />;
  }

  // Check role authorization
  if (!allowedRoles.includes(user.role as 'STUDENT' | 'TRAINER' | 'ADMIN')) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl glass-card border border-rose-500/20 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/20">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Access Denied</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your current account role (<strong className="text-white">{user.role}</strong>) does not have authorization to view this area.
        </p>
        <div className="pt-2">
          <Link
            to={user.role === 'ADMIN' ? '/admin' : user.role === 'TRAINER' ? '/trainer' : '/student'}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-white text-xs font-semibold border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to My Portal</span>
          </Link>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};
