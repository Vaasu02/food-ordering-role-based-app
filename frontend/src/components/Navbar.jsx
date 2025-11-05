import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { selectCurrentUser } from '../store/slices/authSlice';
import { apiSlice } from '../store/api/apiSlice';
import { FaUtensils, FaShoppingCart, FaReceipt, FaCreditCard, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    // Reset API cache on logout
    dispatch(apiSlice.util.resetApiState());
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-500';
      case 'Manager':
        return 'bg-blue-500';
      case 'Member':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center space-x-4 md:space-x-8">
            <Link 
              to="/restaurants" 
              className="flex items-center space-x-2 text-xl font-bold text-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaUtensils className="text-orange-500" />
              <span className="hidden sm:inline">FoodOrder</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-4">
              <Link
                to="/restaurants"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaUtensils />
                <span>Restaurants</span>
              </Link>

              <Link
                to="/orders"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaShoppingCart />
                <span>Orders</span>
              </Link>

              {user.role === 'Admin' && (
                <Link
                  to="/admin/payments"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaCreditCard />
                  <span>Payments</span>
                </Link>
              )}
            </div>
          </div>

          {/* Desktop User Info and Logout */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <div className="flex items-center space-x-1 lg:space-x-2 flex-wrap">
              <span className="hidden lg:inline text-sm text-gray-600">Welcome,</span>
              <span className="text-sm font-semibold text-gray-800 truncate max-w-[100px] lg:max-w-none">
                {user.name}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>
              {user.country && (
                <span className="hidden lg:inline text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {user.country}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 lg:px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              <FaSignOutAlt />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Navigation Links */}
              <Link
                to="/restaurants"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaUtensils />
                <span>Restaurants</span>
              </Link>

              <Link
                to="/orders"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaShoppingCart />
                <span>Orders</span>
              </Link>

              {user.role === 'Admin' && (
                <Link
                  to="/admin/payments"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FaCreditCard />
                  <span>Payments</span>
                </Link>
              )}

              {/* Mobile User Info */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-gray-600">Welcome,</span>
                    <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                  </div>
                  {user.country && (
                    <div className="mb-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {user.country}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

