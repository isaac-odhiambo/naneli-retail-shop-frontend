import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut, BookMarked, User2 } from 'lucide-react';
import { logout, selectCurrentRole, selectCurrentUser } from '../store/slices/authSlice'; // Adjust path as needed

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Extract user and role from Redux store
  const user = useSelector(selectCurrentUser);
  const role = useSelector(selectCurrentRole);

  // Handle user logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      dispatch(logout());
      navigate('/login'); // Redirect to login page
    }
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Home Link */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookMarked className="h-8 w-8" />
              <span className="ml-4 text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium">
                Retail System
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Conditional Links Based on Role */}
                <Link
                  to="/dashboard"
                  className="text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                {role === 'admin' && (
                  <Link
                    to="/users"
                    className="text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Manage Users
                  </Link>
                )}
                {(role === 'admin' || role === 'manager') && (
                  <Link
                    to="/inventory"
                    className="text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Inventory
                  </Link>
                )}
                {(role === 'admin' || role === 'cashier') && (
                  <Link
                    to="/pos"
                    className="text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    POS
                  </Link>
                )}
                <Link
                  to="/sales"
                  className="text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sales
                </Link>

                {/* User Info Section */}
                <div className="flex items-center space-x-2 bg-indigo-700 px-3 py-2 rounded-md">
                  <User2 className="h-6 w-6 text-white" />
                  <div className="text-sm text-white">
                    <span className="font-semibold">{user.username}</span>
                    <span className="text-xs block text-indigo-200">
                      Role: {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* Login and Register Links for Unauthenticated Users */}
                <Link
                  to="/login"
                  className="text-white hover:text-indigo-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-500 text-white hover:bg-indigo-400 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
