import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserRole, selectIsAuthenticated } from '../store/slices/authSlice';

const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/restaurants" replace />;
  }

  return children;
};

export default RoleProtectedRoute;

