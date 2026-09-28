import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFCFA] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-xl bg-[#1F3A34] text-white flex items-center justify-center font-heading font-bold text-xl mb-4 animate-pulse">
          TS
        </div>
        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-[#C2801F] animate-ping"></span>
          Verifying TrialSetu Role Credentials...
        </div>
      </div>
    );
  }

  // If user is not authenticated, bounce to /login
  if (!isAuthenticated || !role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Real RBAC Check: if allowedRoles is specified, check if current user's role is in the list
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to 403 page with context
    return (
      <Navigate
        to="/403"
        state={{
          currentRole: role,
          attemptedPath: location.pathname,
          requiredRoles: allowedRoles,
        }}
        replace
      />
    );
  }

  return <>{children}</>;
};
