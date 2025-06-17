import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useAuth } from '../../contexts/AuthContext';
import { PrimaryButton, SecondaryButton } from '../../components/buttons';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      // Navigation to login will be handled by the index.tsx redirects
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <View className="flex-row items-center">
          <Image
            source={require('../../assets/images/react-logo.png')}
            className="w-8 h-8 mr-3"
            resizeMode="contain"
          />
          <Text className="text-xl font-bold text-black dark:text-white tracking-tight">
            TeamWork
          </Text>
        </View>
        <TouchableOpacity 
          onPress={handleLogout}
          className="p-2 rounded-md bg-gray-100 dark:bg-gray-800"
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Welcome section */}
        <View className="px-6 py-8">
          <Text className="text-2xl font-bold text-black dark:text-white mb-1 tracking-tight">
            Welcome back,
          </Text>
          <Text className="text-lg text-gray-600 dark:text-gray-300">
            {user?.name || 'User'}
          </Text>
        </View>

        {/* Quick stats */}
        <View className="px-6 mb-8">
          <View className="flex-row space-x-4">
            <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-md p-4 border border-gray-200 dark:border-gray-700">
              <View className="flex-row items-center justify-between mb-2">
                <Ionicons name="folder-outline" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
                <Text className="text-xs text-gray-500 dark:text-gray-400">Projects</Text>
              </View>
              <Text className="text-2xl font-bold text-black dark:text-white">0</Text>
            </View>
            
            <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-md p-4 border border-gray-200 dark:border-gray-700">
              <View className="flex-row items-center justify-between mb-2">
                <Ionicons name="checkmark-circle-outline" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
                <Text className="text-xs text-gray-500 dark:text-gray-400">Tasks</Text>
              </View>
              <Text className="text-2xl font-bold text-black dark:text-white">0</Text>
            </View>
          </View>
        </View>

        {/* Recent Projects */}
        <View className="px-6 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-black dark:text-white tracking-tight">
              Recent projects
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-sm text-black dark:text-white font-medium">
                View all
              </Text>
            </TouchableOpacity>
          </View>
          
          <View className="bg-gray-50 dark:bg-gray-800 rounded-md p-6 border border-gray-200 dark:border-gray-700">
            <View className="items-center py-4">
              <View className="bg-gray-200 dark:bg-gray-700 p-3 rounded-md mb-4">
                <Ionicons name="folder-open-outline" size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
              </View>
              <Text className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4 max-w-xs">
                No projects yet. Create your first project to get started.
              </Text>
              <PrimaryButton
                text="Create project"
                onPress={() => {
                  // We'll implement this later
                  console.log('Create project');
                }}
                size="md"
                iconName="add-outline"
              />
            </View>
          </View>
        </View>

        {/* Today's Tasks */}
        <View className="px-6 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-black dark:text-white tracking-tight">
              Today's tasks
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-sm text-black dark:text-white font-medium">
                View all
              </Text>
            </TouchableOpacity>
          </View>
          
          <View className="bg-gray-50 dark:bg-gray-800 rounded-md p-6 border border-gray-200 dark:border-gray-700">
            <View className="items-center py-4">
              <View className="bg-gray-200 dark:bg-gray-700 p-3 rounded-md mb-4">
                <Ionicons name="list-outline" size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
              </View>
              <Text className="text-sm text-gray-600 dark:text-gray-300 text-center max-w-xs">
                No tasks for today. Great job!
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View className="h-20" />
      </ScrollView>

      {/* Bottom navigation */}
      <View className="flex-row items-center justify-around bg-white dark:bg-gray-900 py-4 border-t border-gray-200 dark:border-gray-700">
        <TouchableOpacity className="items-center px-4" activeOpacity={0.7}>
          <Ionicons name="home" size={24} color={isDark ? '#ffffff' : '#000000'} />
          <Text className="text-xs mt-1 text-black dark:text-white font-medium">Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="items-center px-4" activeOpacity={0.7} onPress={() => router.push('/projects')}>
          <Ionicons name="folder-outline" size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
          <Text className="text-xs mt-1 text-gray-500 dark:text-gray-400">Projectsss</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="items-center px-4" activeOpacity={0.7}>
          <Ionicons name="list-outline" size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
          <Text className="text-xs mt-1 text-gray-500 dark:text-gray-400">Tasks</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="items-center px-4" activeOpacity={0.7}>
          <Ionicons name="notifications-outline" size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
          <Text className="text-xs mt-1 text-gray-500 dark:text-gray-400">Alerts</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
