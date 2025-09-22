import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth'; // ADDED: Import useAuth

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth(); // ADDED: Get user from auth hook

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Events', href: '/events', icon: CalendarIcon },
    { name: 'Participants', href: '/participants', icon: UserGroupIcon },
    { name: 'Vendors', href: '/vendors', icon: BuildingStorefrontIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  return (
    <div className="w-64 bg-gray-900 min-h-screen">
      <div className="p-6">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="ml-3 text-xl font-semibold text-white">EventEase</span>
        </div>
      </div>

      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.href); // Use startsWith for active links
            
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
        {/* FIXED: Use user object from useAuth, not localStorage */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {user?.firstName?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;