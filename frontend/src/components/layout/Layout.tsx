import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { getProfile } from '../../store/slices/authSlice';
import Header from './Header';
// import Sidebar from './Sidebar';
import LoadingSpinner from '../common/LoadingSpinner';

const Layout: React.FC = () => {
  // ADDED: Logic to fetch user profile on app load
  const { isAuthenticated, user, isLoading } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getProfile() as any);
    }
  }, [isAuthenticated, user, dispatch]);

  // Show a loading screen while fetching initial profile
  if (isLoading && isAuthenticated && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading your session...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* The Header is now only rendered if authenticated */}
      <Header />
      <div className="flex">
        {/* <Sidebar /> */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;