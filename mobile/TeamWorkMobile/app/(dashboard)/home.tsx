import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { useProjectStore } from '../../store/projectStore';
import TinyTaskCard from '../../components/tasks/TinyTaskCard';
import TaskSubmitModal from '../../components/modals/TaskSubmitModal';
import { Task } from '../../interfaces/interfaces';

export default function HomeScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Project store
  const { 
    userTasks, 
    projectsWithDetails,
    tasksLoading, 
    projectsLoading,
    fetchAllUserTasks, 
    fetchProjectsWithDetails,
    submitTask,
    rejectTask
  } = useProjectStore();
  
  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [topTasks, setTopTasks] = useState<Task[]>([]);

  // Modal state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Load all data
  const loadData = async () => {
    try {
      await Promise.all([
        fetchAllUserTasks(),
        fetchProjectsWithDetails()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Get top tasks sorted by due date
  useEffect(() => {
    if (userTasks.length > 0) {
      const sortedTasks = [...userTasks]
        .filter(task => task.status !== 'done')
        .sort((a, b) => {
          // Tasks with due dates come first
          if (a.dueDate && !b.dueDate) return -1;
          if (!a.dueDate && b.dueDate) return 1;
          if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          }
          // Then sort by priority
          const priorityOrder = { 'urgent': 5, 'high': 4, 'medium': 3, 'low': 2, 'no-priority': 1 };
          const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          return bPriority - aPriority;
        })
        .slice(0, 5);
      
      setTopTasks(sortedTasks);
    }
  }, [userTasks]);

  // Calculate statistics
  const stats = {
    totalTasks: userTasks.length,
    todoTasks: userTasks.filter(task => task.status === 'todo').length,
    inProgressTasks: userTasks.filter(task => task.status === 'in-progress').length,
    doneTasks: userTasks.filter(task => task.status === 'done').length,
    urgentTasks: userTasks.filter(task => task.priority === 'urgent' && task.status !== 'done').length,
    overdueTasks: userTasks.filter(task => {
      if (!task.dueDate || task.status === 'done') return false;
      return new Date(task.dueDate) < new Date();
    }).length
  };

  // Handle task submission
  const handleSubmitTask = (task: Task) => {
    setSelectedTask(task);
    setIsSubmitModalOpen(true);
  };

  // Handle task rejection
  const handleRejectTask = (task: Task) => {
    setSelectedTask(task);
    setIsRejectModalOpen(true);
  };

  // Handle modal submission
  const handleModalSubmit = async (message: string) => {
    if (!selectedTask) return;
    
    try {
      setIsSubmitting(true);
      if (isSubmitModalOpen) {
        await submitTask(selectedTask._id, message);
      } else {
        await rejectTask(selectedTask._id, message);
      }
      // Refresh data
      await loadData();
      // Close modals
      setIsSubmitModalOpen(false);
      setIsRejectModalOpen(false);
      setSelectedTask(null);
    } catch (err) {
      Alert.alert('Error', `Failed to ${isSubmitModalOpen ? 'submit' : 'reject'} task`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsSubmitModalOpen(false);
    setIsRejectModalOpen(false);
    setSelectedTask(null);
  };

  // Handle task press
  const handleTaskPress = (task: Task) => {
    router.push(`/(dashboard)/task/${task._id}` as any);
  };
  
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="px-6 py-6">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-3xl font-bold text-black dark:text-white">
            Dashboard
          </Text>
          <View className="flex-row items-center space-x-2">
            <TouchableOpacity
              onPress={() => router.push('/(dashboard)/inbox' as any)}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full relative"
              activeOpacity={0.7}
            >
              <Ionicons name="mail" size={20} color={isDark ? '#ffffff' : '#000000'} />
              {/* Unread mail count badge - you can get this from user data */}
              {/* <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs font-bold">3</Text>
              </View> */}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(dashboard)/settings' as any)}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"
              activeOpacity={0.7}
            >
              <Ionicons name="settings" size={20} color={isDark ? '#ffffff' : '#000000'} />
            </TouchableOpacity>
          </View>
        </View>
        <Text className="text-gray-600 dark:text-gray-300">
          Welcome back! Here's what's happening today.
        </Text>
      </View>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? '#ffffff' : '#000000'}
          />
        }
      >
        {/* Quick Stats */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-black dark:text-white mb-4">
            Overview
          </Text>
          <View className="grid grid-cols-2 gap-3">
            <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.totalTasks}
                  </Text>
                  <Text className="text-sm text-blue-700 dark:text-blue-300">
                    Total Tasks
                  </Text>
                </View>
                <Ionicons name="document-text" size={24} color={isDark ? '#60a5fa' : '#3b82f6'} />
              </View>
            </View>

            <View className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {stats.inProgressTasks}
                  </Text>
                  <Text className="text-sm text-orange-700 dark:text-orange-300">
                    In Progress
                  </Text>
                </View>
                <Ionicons name="play-circle" size={24} color={isDark ? '#fb923c' : '#f97316'} />
              </View>
            </View>
            
            <View className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {stats.urgentTasks}
                  </Text>
                  <Text className="text-sm text-red-700 dark:text-red-300">
                    Urgent
                  </Text>
                </View>
                <Ionicons name="warning" size={24} color={isDark ? '#f87171' : '#ef4444'} />
              </View>
            </View>

            <View className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.doneTasks}
                  </Text>
                  <Text className="text-sm text-green-700 dark:text-green-300">
                    Completed
                  </Text>
                </View>
                <Ionicons name="checkmark-circle" size={24} color={isDark ? '#4ade80' : '#22c55e'} />
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-black dark:text-white mb-4">
            Quick Actions
          </Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={() => router.push('/(dashboard)/projects' as any)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Ionicons name="folder" size={20} color="#ffffff" />
                <Text className="text-white font-semibold ml-2">Projects</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(dashboard)/tasks' as any)}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Ionicons name="list" size={20} color="#ffffff" />
                <Text className="text-white font-semibold ml-2">Tasks</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Top Tasks */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-black dark:text-white">
              Top Tasks
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(dashboard)/tasks' as any)}
              className="flex-row items-center"
            >
              <Text className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                View All
              </Text>
              <Ionicons name="chevron-forward" size={16} color={isDark ? '#60a5fa' : '#3b82f6'} />
            </TouchableOpacity>
          </View>
          
          {tasksLoading ? (
            <View className="flex-row items-center justify-center py-8">
              <Ionicons name="reload" size={24} color={isDark ? '#6b7280' : '#9ca3af'} />
              <Text className="text-gray-600 dark:text-gray-300 ml-2">Loading tasks...</Text>
            </View>
          ) : topTasks.length === 0 ? (
            <View className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl">
              <View className="items-center">
                <Ionicons name="checkmark-circle" size={48} color={isDark ? '#6b7280' : '#9ca3af'} />
                <Text className="text-lg font-semibold text-black dark:text-white mt-4 text-center">
                  All caught up!
                </Text>
                <Text className="text-gray-600 dark:text-gray-300 mt-2 text-center">
                  You have no pending tasks. Great job!
                </Text>
              </View>
            </View>
          ) : (
            <View className="space-y-3">
              {topTasks.map((task) => (
                <TinyTaskCard
                  key={task._id}
                  task={task}
                  onPress={() => handleTaskPress(task)}
                  onSubmit={() => handleSubmitTask(task)}
                  onReject={() => handleRejectTask(task)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Recent Activity */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-black dark:text-white mb-4">
            Recent Activity
          </Text>
          <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
            <View className="flex-row items-center mb-3">
              <Ionicons name="time-outline" size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
              <Text className="text-gray-600 dark:text-gray-300 ml-2 text-sm">
                Last 7 days
              </Text>
            </View>
            
            {stats.overdueTasks > 0 && (
              <View className="flex-row items-center mb-2">
                <View className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                <Text className="text-sm text-gray-700 dark:text-gray-300">
                  {stats.overdueTasks} task{stats.overdueTasks !== 1 ? 's' : ''} overdue
                </Text>
              </View>
            )}
            
            <View className="flex-row items-center mb-2">
              <View className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
              <Text className="text-sm text-gray-700 dark:text-gray-300">
                {stats.inProgressTasks} task{stats.inProgressTasks !== 1 ? 's' : ''} in progress
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-green-500 rounded-full mr-3" />
              <Text className="text-sm text-gray-700 dark:text-gray-300">
                {stats.doneTasks} task{stats.doneTasks !== 1 ? 's' : ''} completed
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Tips */}
        <View className="px-6 pb-6">
          <Text className="text-lg font-semibold text-black dark:text-white mb-4">
            Quick Tips
          </Text>
          <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
            <View className="flex-row items-start">
              <Ionicons name="bulb-outline" size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
              <View className="ml-3 flex-1">
                <Text className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Pro Tip
                </Text>
                <Text className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Use the submit/reject buttons on in-progress tasks to quickly update their status without opening the full task details.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Task Submit Modal */}
      <TaskSubmitModal
        visible={isSubmitModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        type="submit"
        loading={isSubmitting}
      />

      {/* Task Reject Modal */}
      <TaskSubmitModal
        visible={isRejectModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        type="reject"
        loading={isSubmitting}
      />
    </SafeAreaView>
  );
}
