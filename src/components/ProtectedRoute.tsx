import { Navigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  user: User | null;
  loading: boolean;
  children: React.ReactNode;
}

export function ProtectedRoute({ user, loading, children }: ProtectedRouteProps) {
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
