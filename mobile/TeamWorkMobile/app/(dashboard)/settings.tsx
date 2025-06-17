import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { getUser, storeUser } from '../../api/apiUtils';
import { updateUser, changePassword, logout } from '../../api/authApi';

interface User {
  _id: string;
  name: string;
  email: string;
  lastLogin: string;
  isVerified: boolean;
  darkMode: boolean;
  numUnreadMails?: number;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // State
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPasswordLoading, setIsChangingPasswordLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    darkMode: false,
  });

  // Password form data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Error and success messages
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Load user data
  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await getUser();
      if (userData) {
        setUser(userData);
        setFormData({
          name: userData.name || '',
          darkMode: userData.darkMode || false,
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    if (!user) return;

    try {
      setIsUpdating(true);
      setUpdateError('');
      setUpdateSuccess('');

      const response = await updateUser({
        name: formData.name,
        darkMode: formData.darkMode,
      });

      if (response.success) {
        // Update local user data
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);
        await storeUser(updatedUser);

        // Note: Dark mode will be handled by the system automatically
        // through the nativewind configuration, so we don't need to manually set it

        setUpdateSuccess('Profile updated successfully!');
        setIsEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setUpdateSuccess(''), 3000);
      } else {
        setUpdateError(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateError('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (!user) return;

    // Validation
    if (!passwordData.currentPassword) {
      setPasswordError('Current password is required');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      setIsChangingPasswordLoading(true);
      setPasswordError('');
      setPasswordSuccess('');

      const response = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (response.success) {
        setPasswordSuccess('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setIsChangingPassword(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setPasswordSuccess(''), 3000);
      } else {
        setPasswordError(response.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError('Failed to change password. Please try again.');
    } finally {
      setIsChangingPasswordLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Logout error:', error);
              // Still navigate to login even if API call fails
              router.replace('/(auth)/login');
            }
          },
        },
      ]
    );
  };

  // Get user initials
  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-1 items-center justify-center p-4">
          <Ionicons name="person-circle-outline" size={64} color="#9ca3af" />
          <Text className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">
            User not found
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-center">
            Please log in to view your profile.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login')}
            className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-medium">Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color={isDark ? '#ffffff' : '#000000'} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black dark:text-white">Settings</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Profile Section */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-semibold text-black dark:text-white">
              Profile Information
            </Text>
            {!isEditing ? (
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="bg-blue-500 px-4 py-2 rounded-lg"
                activeOpacity={0.7}
              >
                <Text className="text-white font-medium">Edit</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Profile Avatar */}
          <View className="items-center mb-6">
            <View className="relative">
              <View className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shadow-lg">
                <Text className="text-3xl font-bold text-blue-600 dark:text-blue-300">
                  {getInitials(user.name)}
                </Text>
              </View>
              <View className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${
                user.isVerified ? 'bg-green-400' : 'bg-yellow-400'
              }`} />
            </View>
            <Text className="text-lg font-semibold text-black dark:text-white mt-2">
              {user.name}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              {user.email}
            </Text>
            <View className="flex-row items-center mt-2">
              {user.isVerified ? (
                <View className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full">
                  <Text className="text-green-800 dark:text-green-200 text-xs font-medium">
                    Verified
                  </Text>
                </View>
              ) : (
                <View className="bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-full">
                  <Text className="text-yellow-800 dark:text-yellow-200 text-xs font-medium">
                    Not Verified
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Name Input */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </Text>
            {isEditing ? (
              <TextInput
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
                placeholder="Enter your name"
                placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
              />
            ) : (
              <Text className="text-black dark:text-white text-lg font-medium">
                {user.name}
              </Text>
            )}
          </View>

          {/* Email (Read-only) */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </Text>
            <Text className="text-black dark:text-white text-lg font-medium">
              {user.email}
            </Text>
          </View>

          {/* Dark Mode Toggle */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dark Mode
            </Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-black dark:text-white">Enable dark mode</Text>
              <Switch
                value={formData.darkMode}
                onValueChange={(value) => setFormData({ ...formData, darkMode: value })}
                disabled={!isEditing}
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                thumbColor={formData.darkMode ? '#ffffff' : '#ffffff'}
              />
            </View>
          </View>

          {/* Success/Error Messages */}
          {updateSuccess && (
            <View className="bg-green-100 dark:bg-green-900/20 border border-green-400 p-3 rounded-lg mb-4">
              <Text className="text-green-800 dark:text-green-200 text-sm">
                {updateSuccess}
              </Text>
            </View>
          )}
          {updateError && (
            <View className="bg-red-100 dark:bg-red-900/20 border border-red-400 p-3 rounded-lg mb-4">
              <Text className="text-red-800 dark:text-red-200 text-sm">
                {updateError}
              </Text>
            </View>
          )}

          {/* Edit Actions */}
          {isEditing && (
            <View className="flex-row justify-end">
              <TouchableOpacity
                onPress={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user.name || '',
                    darkMode: user.darkMode || false,
                  });
                  setUpdateError('');
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mr-3"
                activeOpacity={0.7}
              >
                <Text className="text-gray-700 dark:text-gray-300 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleProfileUpdate}
                className="bg-blue-500 px-4 py-2 rounded-lg"
                activeOpacity={0.7}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text className="text-white font-medium">Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Password Change Section */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-semibold text-black dark:text-white">
              Security
            </Text>
            {!isChangingPassword ? (
              <TouchableOpacity
                onPress={() => setIsChangingPassword(true)}
                className="bg-blue-500 px-4 py-2 rounded-lg"
                activeOpacity={0.7}
              >
                <Text className="text-white font-medium">Change Password</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {isChangingPassword && (
            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </Text>
                <TextInput
                  value={passwordData.currentPassword}
                  onChangeText={(text) => setPasswordData({ ...passwordData, currentPassword: text })}
                  secureTextEntry
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
                  placeholder="Enter current password"
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </Text>
                <TextInput
                  value={passwordData.newPassword}
                  onChangeText={(text) => setPasswordData({ ...passwordData, newPassword: text })}
                  secureTextEntry
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
                  placeholder="Enter new password"
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </Text>
                <TextInput
                  value={passwordData.confirmPassword}
                  onChangeText={(text) => setPasswordData({ ...passwordData, confirmPassword: text })}
                  secureTextEntry
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white"
                  placeholder="Confirm new password"
                  placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                />
              </View>

              {/* Password Success/Error Messages */}
              {passwordSuccess && (
                <View className="bg-green-100 dark:bg-green-900/20 border border-green-400 p-3 rounded-lg">
                  <Text className="text-green-800 dark:text-green-200 text-sm">
                    {passwordSuccess}
                  </Text>
                </View>
              )}
              {passwordError && (
                <View className="bg-red-100 dark:bg-red-900/20 border border-red-400 p-3 rounded-lg">
                  <Text className="text-red-800 dark:text-red-200 text-sm">
                    {passwordError}
                  </Text>
                </View>
              )}

              {/* Password Change Actions */}
              <View className="flex-row justify-end">
                <TouchableOpacity
                  onPress={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                    setPasswordError('');
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mr-3"
                  activeOpacity={0.7}
                >
                  <Text className="text-gray-700 dark:text-gray-300 font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handlePasswordChange}
                  className="bg-blue-500 px-4 py-2 rounded-lg"
                  activeOpacity={0.7}
                  disabled={isChangingPasswordLoading}
                >
                  {isChangingPasswordLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text className="text-white font-medium">Change Password</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Account Actions Section */}
        <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <Text className="text-xl font-semibold text-black dark:text-white mb-4">
            Account Actions
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            You can log out or manage your account here.
          </Text>
          
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-gray-200 dark:bg-gray-700 px-4 py-3 rounded-lg flex-row items-center justify-center"
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={20} color={isDark ? '#ffffff' : '#374151'} />
            <Text className="text-gray-700 dark:text-white font-medium ml-2">Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 