import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './store/slices/authSlice';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Restaurants from './pages/Restaurants';
import Orders from './pages/Orders';
import AdminPayments from './pages/AdminPayments';

const App = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <Navbar />}
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/restaurants" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/restaurants" replace /> : <Register />}
          />

          {/* Protected Routes */}
          <Route
            path="/restaurants"
            element={
              <ProtectedRoute>
                <Restaurants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Admin Only Routes */}
          <Route
            path="/admin/payments"
            element={
              <RoleProtectedRoute allowedRoles={['Admin']}>
                <AdminPayments />
              </RoleProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? '/restaurants' : '/login'} replace />}
          />

          {/* Catch all - 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
