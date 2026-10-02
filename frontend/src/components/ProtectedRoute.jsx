import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../services/authService.js';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  return isAuthenticated() ? children : <Navigate to="/login" replace state={{ from: location }} />;
}
