import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole: 'Admin' | 'Customer' | 'Technician';
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const role = sessionStorage.getItem('userRole');
  const email = sessionStorage.getItem('userEmail');

  if (!email || role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
