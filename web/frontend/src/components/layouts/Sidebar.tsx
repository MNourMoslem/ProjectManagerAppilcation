import { Link, useNavigate } from 'react-router-dom';
import { 
  FloatingDropdown, 
  ExpandingDropdown,
  DropdownItem
} from '../dropdowns';
import { PrimaryButton } from '../buttons';
import type { DropdownItemProps } from '../dropdowns';
import { useAuthStore } from '../../store/authStore';
import { useEffect } from 'react';

function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Set dark mode based on user preference when component mounts
  useEffect(() => {
    if (user?.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user?.darkMode]);

  // Profile dropdown items
  const profileItems: DropdownItemProps[] = [
    { text: 'Profile', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, onClick: () => navigate('/app/profile') },
    { text: 'Settings', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, onClick: () => navigate('/app/profile') },    { 
      text: 'Theme', 
      icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h12a2 2 0 012 2v12a4 4 0 01-4 4H7z" /></svg>, 
      isSubmenu: true, 
      submenu: (
        <div className="py-1">
          <DropdownItem 
            text="Light" 
            icon={<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} 
            onClick={() => {
              document.documentElement.classList.remove('dark');
              console.log('Light mode enabled');
              // Update user preference in the store
              if (user) {
                useAuthStore.getState().updateUser({ darkMode: false });
              }
            }} 
          />
          <DropdownItem 
            text="Dark" 
            icon={<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>} 
            onClick={() => {
              document.documentElement.classList.add('dark');
              console.log('Dark mode enabled');
              // Update user preference in the store
              if (user) {
                useAuthStore.getState().updateUser({ darkMode: true });
              }
            }} 
          />
        </div>
      )
    },
    { text: 'Logout', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>, danger: true, onClick: () => {
      logout();
      navigate('/login');
    } },
  ];  // Workspace items
  const workspaceItems = [
    {
      text: 'Dashboard',
      icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 5a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 14a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1v-5zM14 14a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1h-4a1 1 0 01-1-1v-5z" /></svg>,
      onClick: () => navigate('/app')
    },
    { 
      text: 'Projects', 
      icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>, 
      onClick: () => navigate('/app/projects') 
    },
    { 
      text: 'Tasks', 
      icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>, 
      onClick: () => navigate('/app/tasks') 
    },
  ];

  return (
    <div className="w-56 h-screen flex-shrink-0 border-r border-gray-100 dark:border-gray-800 flex flex-col bg-white dark:bg-gray-900">      {/* Sidebar header with profile dropdown */}
      <div className="p-3 border-b border-gray-100 dark:border-gray-800">
        <FloatingDropdown
          trigger={
            <div className="w-full flex items-center space-x-2.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 py-1.5 transition-colors">              <div className="flex-shrink-0 w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-xs font-medium">
                {user?.name.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 truncate">
                <div className="text-xs md:text-sm font-medium tracking-tight">{user?.name || 'User'}</div>
                <div className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500">{user?.email || 'user@example.com'}</div>
              </div>
              <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          }
          items={profileItems}
          align="left"
          width="w-48"
          size="xs"
        />
      </div>

      {/* Sidebar content */}
      <div className="flex-1 overflow-y-auto py-3">
        <div className="px-2 space-y-1">
          {/* Inbox button */}          <Link 
            to="/app/inbox"
            className="flex items-center space-x-2.5 px-2 py-1.5 text-xs md:text-sm rounded text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="tracking-tight">Inbox</span>
          </Link>
          
          {/* Workspace dropdown (expanding) */}
          <div className="mt-1">
            <ExpandingDropdown
              trigger={                <div className="flex items-center justify-between px-2 py-1.5 text-xs md:text-sm rounded text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2.5">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="tracking-tight">Workspace</span>
                  </div>
                  <svg 
                    className="w-3 h-3" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              }
              items={workspaceItems}
              className="border-none"
              size="xs"
            />
          </div>
        </div>
      </div>      {/* Sidebar footer with create button */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <PrimaryButton 
          text="New"
          icon={<svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}
          className="w-full text-xs py-1"
          size="xs"
          onClick={() => navigate('/app/projects/new')}
        />
      </div>
    </div>
  );
}

export default Sidebar;
