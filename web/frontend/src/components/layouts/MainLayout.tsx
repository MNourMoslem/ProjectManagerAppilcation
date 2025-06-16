import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { FloatingDropdown } from '../dropdowns';
import NotificationBell from '../notifications/NotificationBell';
import type { DropdownItemProps } from '../dropdowns';

function MainLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');  // Update page title based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/app/projects')) {
      setPageTitle('Projects');
    } else if (path.includes('/app/tasks')) {
      setPageTitle('Tasks');
    } else if (path.includes('/app/profile')) {
      setPageTitle('Profile');
    } else if (path.includes('/app/inbox')) {
      setPageTitle('Inbox');
    } else if (path.includes('/app/analytics')) {
      setPageTitle('Workspace Analytics');
    } else if (path.includes('/app/team')) {
      setPageTitle('Team Members');
    } else {
      setPageTitle('Dashboard');
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const profileMenuItems: DropdownItemProps[] = [
    { text: 'Profile', onClick: () => navigate('/app/profile') },
    { text: 'Settings', onClick: () => navigate('/app/profile') },
    { text: 'Logout', onClick: handleLogout },
  ];

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-10">
          <div className="px-6 py-3 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{pageTitle}</h1>
              {/* User profile */}
            <div className="flex items-center space-x-4">
              <NotificationBell />
              
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {user?.name}
              </div>
              
              <FloatingDropdown
                trigger={
                  <button 
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    {user?.name.charAt(0).toUpperCase()}
                  </button>
                }
                items={profileMenuItems}
                align="right"
              />
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto text-sm md:text-base font-medium">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
