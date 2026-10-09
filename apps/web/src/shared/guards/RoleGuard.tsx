import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface RoleGuardProps {
  allowedRoles: Array<'STUDENT' | 'TRAINER' | 'ADMIN'>;
  children?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  // In Phase 0 Foundation, simulate or allow access to explore all 3 shells
  // In Phase 1 Auth, this will pull from JWT / authContext
  const currentRole = (localStorage.getItem('userRole') || 'ADMIN') as 'STUDENT' | 'TRAINER' | 'ADMIN';

  // Allow bypass for Phase 0 demonstration preview
  const isPhase0Preview = true;

  if (!isPhase0Preview && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
