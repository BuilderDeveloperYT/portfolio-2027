import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../services/auth';

export default function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }
  return <Outlet />;
}
