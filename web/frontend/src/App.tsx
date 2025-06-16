import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { IconButton, PrimaryButton } from "./components/buttons";
import { FloatingDropdown, DropdownButton } from "./components/dropdowns";
import type { DropdownItemProps } from "./components/dropdowns";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { ToastProvider } from "./components/notifications";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  
  // Set dark mode based on user preference when component mounts
  useEffect(() => {
    if (user?.darkMode) {
      document.documentElement.classList.add('dark');
    } else if (user !== null) {
      document.documentElement.classList.remove('dark');
    }
  }, [user?.darkMode]);
  
  function handleToggleMode() {
    const isDarkMode = document.documentElement.classList.contains("dark");
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      console.log("Light mode enabled");
      // Update user preference if logged in
      if (user) {
        useAuthStore.getState().updateUser({ darkMode: false });
      }
    } else {
      document.documentElement.classList.add("dark");
      console.log("Dark mode enabled");
      // Update user preference if logged in
      if (user) {
        useAuthStore.getState().updateUser({ darkMode: true });
      }
    }
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Dropdown items for showcases
  const showcaseItems: DropdownItemProps[] = [
    { text: 'Buttons', onClick: () => navigate('/button-showcase') },
    { text: 'Dropdowns', onClick: () => navigate('/dropdown-showcase') },
    { text: 'Tables', onClick: () => navigate('/table-showcase') },
    { text: 'Progress', onClick: () => navigate('/progress-showcase') },
    { text: 'Counters', onClick: () => navigate('/counters-showcase') },
    { text: 'Forms', onClick: () => navigate('/forms-showcase') },
    { text: 'Containers', onClick: () => navigate('/containers-showcase') },
    { text: 'Searchbar', onClick: () => navigate('/searchbar-showcase') },
    { text: 'UI Components', onClick: () => navigate('/ui-components-showcase') },
    { text: 'Page 2', onClick: () => navigate('/page2') },
  ];

  // Profile menu items
  const profileMenuItems: DropdownItemProps[] = [
    { text: 'Profile', onClick: () => navigate('/app/profile') },
    { text: 'Dashboard', onClick: () => navigate('/app') },
    { text: 'Logout', onClick: handleLogout },
  ];

  return (
    <ToastProvider position="top-right" maxToasts={5}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
        {/* Header with navigation */}
        <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-10">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            {/* Logo and app name */}
            <div className="flex items-center space-x-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black dark:text-white">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              </svg>
              <h1 className="text-lg font-medium tracking-tight">TeamWork</h1>
            </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/app"
              className="px-3 py-2 text-sm rounded-md transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Website
            </Link>
            <FloatingDropdown
              trigger={
                <DropdownButton 
                  text="Showcases" 
                  variant="ghost" 
                  size="sm"
                />
              }
              items={showcaseItems}
              align="left"
            />
            <Link 
              to="/app" 
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                location.pathname.startsWith("/app") 
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white" 
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              App
            </Link>
          </nav>
          
          {/* Right-side actions */}
          <div className="flex items-center space-x-3">
            <IconButton
              icon={document.documentElement.classList.contains("dark") ? "☀️" : "🌙"}
              onClick={handleToggleMode}
              aria-label="Toggle dark mode"
              size="sm"
            />
            
            {isAuthenticated ? (
              <FloatingDropdown
                trigger={
                  <button 
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    {user?.name.charAt(0).toUpperCase()}
                  </button>
                }
                items={profileMenuItems}
                align="right"
              />
            ) : (
              <Link to="/login" className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                Login
              </Link>
            )}
            
            <PrimaryButton 
              text="New Project" 
              size="sm"
              icon="+"
              onClick={() => isAuthenticated ? navigate('/app/projects') : navigate('/login')}
            />
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2025 TeamWork. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/terms" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </ToastProvider>
  );
}

export default App;