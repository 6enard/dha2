import React from 'react';
import { Bell, Search, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { currentUser } = useAuth();

  const handleBackToRoleSelection = () => {
    window.location.reload(); // Simple way to reset the app state
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4 ml-12 lg:ml-4">
          <button
            onClick={handleBackToRoleSelection}
            className="hidden sm:flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Role Selection</span>
          </button>
          <button
            onClick={handleBackToRoleSelection}
            className="sm:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden md:flex flex-1 max-w-lg mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search applications, candidates..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="hidden sm:block relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-2 sm:space-x-3 border-l border-gray-200 pl-2 sm:pl-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block text-sm">
              <p className="font-medium text-gray-900">{currentUser?.displayName || 'HR Manager'}</p>
              <p className="text-gray-500 truncate max-w-32">{currentUser?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;