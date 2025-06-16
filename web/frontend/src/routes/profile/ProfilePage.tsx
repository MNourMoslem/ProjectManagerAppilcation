import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

const getInitials = (name: string) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const ProfilePage = () => {
  const { user, updateUser, changePassword, error, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    darkMode: user?.darkMode ?? false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        darkMode: user.darkMode ?? false,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateSuccess(false);
    try {
      await updateUser({
        name: formData.name,
        darkMode: formData.darkMode,
      });
      setIsEditing(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    if (!currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    
    if (password.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    
    if (password !== password2) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    try {
      await changePassword(currentPassword, password);
      setCurrentPassword('');
      setPassword('');
      setPassword2('');
      setPasswordSuccess('Password changed successfully!');
    } catch (err) {
      setPasswordError(error || 'Failed to change password');
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User not found</h1>
          <p className="text-gray-600 dark:text-gray-400">Please log in to view your profile.</p>
        </div>
      </div>
    );  }  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-1/3 flex flex-col items-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-fade-in">
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-4xl font-bold text-indigo-600 dark:text-indigo-300 shadow-lg">
              {getInitials(user.name)}
            </div>
            <span className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${user.isVerified ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</h2>
            <p className="text-gray-500 dark:text-gray-300 text-sm mb-2">{user.email}</p>
            <div className="flex items-center justify-center gap-2 mb-2">
              {user.isVerified ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  Not Verified
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500">Last login: {new Date(user.lastLogin).toLocaleString()}</div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8 animate-fade-in-up">          {/* Personal Info Card */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h3>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                  Edit
                </button>
              ) : null}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                ) : (
                  <div className="text-gray-900 dark:text-white text-lg font-medium">{user.name}</div>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <div className="text-gray-900 dark:text-white text-lg font-medium">{user.email}</div>
              </div>
            </div>
            {updateSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative mt-2">
                Profile updated successfully!
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mt-2">
                {error}
              </div>
            )}
            {isEditing && (
              <div className="flex gap-3 justify-end">
                <button
                  type="button"                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user.name,
                      email: user.email,
                      darkMode: user.darkMode,
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>

          {/* Preferences Card */}          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Preferences</h3>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="darkMode"
                  name="darkMode"
                  checked={formData.darkMode}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="darkMode" className="block text-sm text-gray-700 dark:text-gray-300">
                  Dark mode
                </label>
              </div>
              {user.numUnreadMails !== undefined && (
                <div className="flex items-center gap-3">
                  <span className="block text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{user.numUnreadMails}</span> unread {user.numUnreadMails === 1 ? 'mail' : 'mails'}
                  </span>
                </div>
              )}
            </div>
          </div>{/* Security Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Security</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="currentPassword"
                  name="currentPassword"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  minLength={6}
                  required
                />
              </div>
              <div>
                <label htmlFor="password2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password2"
                  name="password2"
                  value={password2}
                  onChange={e => setPassword2(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  minLength={6}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="showPassword" className="text-sm text-gray-700 dark:text-gray-300">
                  Show password
                </label>
              </div>
              {passwordError && (
                <div className="text-sm text-red-600">{passwordError}</div>
              )}
              {passwordSuccess && (
                <div className="text-sm text-green-600">{passwordSuccess}</div>
              )}
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                disabled={isLoading}
              >
                {isLoading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          </div>          {/* Account Actions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Account Actions</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">You can log out or delete your account here.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => useAuthStore.getState().logout()}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition"
              >
                Log Out
              </button>
              <button 
                onClick={() => window.confirm('Are you sure you want to delete your account? This action cannot be undone.') && alert('Account deletion is not implemented yet.')}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
