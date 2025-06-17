import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import TaskCard from '../../components/tasks/TaskCard';
import { MultiSelectFilterDropdown } from '../../components/dropdowns';
import { SecondaryButton } from '../../components/buttons';
import { useProjectStore } from '../../store/projectStore';
import { Task, Project } from '../../interfaces/interfaces';

type TaskStatus = 'todo' | 'in-progress' | 'done' | 'cancelled';
type TaskPriority = 'no-priority' | 'low' | 'medium' | 'high' | 'urgent';
type SortOption = 'dueDate' | 'priority' | 'status' | 'createdAt';

export default function TasksScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Project store
  const { 
    userTasks, 
    tasksLoading, 
    tasksError, 
    fetchAllUserTasks, 
    fetchUserTasks,
    projects,
    fetchProjects
  } = useProjectStore();
  
  // Local state
  const [statusFilters, setStatusFilters] = useState<TaskStatus[]>([]);
  const [priorityFilters, setPriorityFilters] = useState<TaskPriority[]>([]);
  const [projectFilters, setProjectFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [refreshing, setRefreshing] = useState(false);
  const [isFilteringActive, setIsFilteringActive] = useState(false);

  // Fetch tasks and projects on component mount
  useEffect(() => {
    fetchAllUserTasks();
    fetchProjects();
  }, [fetchAllUserTasks, fetchProjects]);

  // Apply filters when they change
  useEffect(() => {
    setIsFilteringActive(true);
    
    const options: Record<string, any> = {};
    
    if (statusFilters.length > 0) {
      options.status = statusFilters;
    }
    
    if (priorityFilters.length > 0) {
      options.priority = priorityFilters;
    }
    
    if (projectFilters.length > 0) {
      options.projectId = projectFilters;
    }
    
    if (Object.keys(options).length === 0) {
      fetchAllUserTasks().then(() => setIsFilteringActive(false));
    } else {
      fetchUserTasks(options).then(() => setIsFilteringActive(false));
    }
  }, [statusFilters, priorityFilters, projectFilters, fetchAllUserTasks, fetchUserTasks]);

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAllUserTasks();
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Sort tasks
  const getSortedTasks = () => {
    if (!userTasks) return [];
    
    return [...userTasks].sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortBy) {
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          break;
        case 'priority':
          const priorityOrder = { 'urgent': 5, 'high': 4, 'medium': 3, 'low': 2, 'no-priority': 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          break;
        case 'status':
          const statusOrder = { 'todo': 1, 'in-progress': 2, 'done': 3, 'cancelled': 4 };
          aValue = statusOrder[a.status as keyof typeof statusOrder] || 0;
          bValue = statusOrder[b.status as keyof typeof statusOrder] || 0;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  };

  const sortedTasks = getSortedTasks();

  // Clear all filters
  const clearFilters = () => {
    setStatusFilters([]);
    setPriorityFilters([]);
    setProjectFilters([]);
    setIsFilteringActive(true);
    fetchAllUserTasks();
  };

  // Handle task press
  const handleTaskPress = (task: Task) => {
    // Navigate to task detail page
    router.push(`/(dashboard)/task/${task._id}` as any);
  };

  // Handle task status change
  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    // This would be implemented in the store
    console.log('Status change:', taskId, status);
  };

  // Filter options
  const statusOptions = [
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Done', value: 'done' },
    { label: 'Cancelled', value: 'cancelled' }
  ];
  
  const priorityOptions = [
    { label: 'No Priority', value: 'no-priority' },
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' }
  ];
  
  const projectOptions = projects.map(project => ({
    label: project.name,
    value: project._id
  }));

  const sortOptions = [
    { label: 'Due Date', value: 'dueDate' },
    { label: 'Priority', value: 'priority' },
    { label: 'Status', value: 'status' },
    { label: 'Created Date', value: 'createdAt' }
  ];

  // Get filter text
  const getStatusFilterText = () => {
    if (statusFilters.length === 0) return "Status";
    if (statusFilters.length === 1) {
      return statusOptions.find(opt => opt.value === statusFilters[0])?.label || 'Status';
    }
    return `${statusFilters.length} Statuses`;
  };
  
  const getPriorityFilterText = () => {
    if (priorityFilters.length === 0) return "Priority";
    if (priorityFilters.length === 1) {
      return priorityOptions.find(opt => opt.value === priorityFilters[0])?.label || 'Priority';
    }
    return `${priorityFilters.length} Priorities`;
  };
  
  const getProjectFilterText = () => {
    if (projectFilters.length === 0) return "Project";
    if (projectFilters.length === 1) {
      return projectOptions.find(opt => opt.value === projectFilters[0])?.label || 'Project';
    }
    return `${projectFilters.length} Projects`;
  };

  // Calculate stats
  const stats = {
    totalTasks: userTasks.length,
    todoTasks: userTasks.filter(task => task.status === 'todo').length,
    inProgressTasks: userTasks.filter(task => task.status === 'in-progress').length,
    doneTasks: userTasks.filter(task => task.status === 'done').length,
    urgentTasks: userTasks.filter(task => task.priority === 'urgent').length
  };

  // Show error if there's one
  if (tasksError) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle" size={48} color={isDark ? '#ef4444' : '#dc2626'} />
          <Text className="text-lg font-semibold text-black dark:text-white mt-4 text-center">
            Error Loading Tasks
          </Text>
          <Text className="text-gray-600 dark:text-gray-300 mt-2 text-center">
            {tasksError}
          </Text>
          <TouchableOpacity
            onPress={() => fetchAllUserTasks()}
            className="mt-4 bg-black dark:bg-white px-6 py-3 rounded-lg"
          >
            <Text className="text-white dark:text-black font-semibold text-center">
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <View>
          <Text className="text-2xl font-bold text-black dark:text-white tracking-tight">
            My Tasks
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            View and manage all your tasks
          </Text>
        </View>
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
        {/* Stats Section */}
        <View className="px-6 py-6">
          <Text className="text-lg font-semibold text-black dark:text-white mb-4">
            Overview
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <View className="bg-blue-100 dark:bg-blue-900/30 px-4 py-3 rounded-lg flex-1 min-w-[120px]">
              <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalTasks}
              </Text>
              <Text className="text-sm text-blue-700 dark:text-blue-300">
                Total Tasks
              </Text>
            </View>
            <View className="bg-yellow-100 dark:bg-yellow-900/30 px-4 py-3 rounded-lg flex-1 min-w-[120px]">
              <Text className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.todoTasks}
              </Text>
              <Text className="text-sm text-yellow-700 dark:text-yellow-300">
                To Do
              </Text>
            </View>
            <View className="bg-orange-100 dark:bg-orange-900/30 px-4 py-3 rounded-lg flex-1 min-w-[120px]">
              <Text className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {stats.inProgressTasks}
              </Text>
              <Text className="text-sm text-orange-700 dark:text-orange-300">
                In Progress
              </Text>
            </View>
            <View className="bg-green-100 dark:bg-green-900/30 px-4 py-3 rounded-lg flex-1 min-w-[120px]">
              <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.doneTasks}
              </Text>
              <Text className="text-sm text-green-700 dark:text-green-300">
                Done
              </Text>
            </View>
          </View>
        </View>

        {/* Filters Section */}
        <View className="px-6 pb-4">
          <Text className="text-lg font-semibold text-black dark:text-white mb-4">
            Filters & Sort
          </Text>
          
          {/* Filter Row */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            <MultiSelectFilterDropdown
              title={getStatusFilterText()}
              options={statusOptions}
              selectedValues={statusFilters}
              onSelectionChange={(values: string[]) => setStatusFilters(values as TaskStatus[])}
              placeholder="Filter by status"
            />
            
            <MultiSelectFilterDropdown
              title={getPriorityFilterText()}
              options={priorityOptions}
              selectedValues={priorityFilters}
              onSelectionChange={(values: string[]) => setPriorityFilters(values as TaskPriority[])}
              placeholder="Filter by priority"
            />
            
            <MultiSelectFilterDropdown
              title={getProjectFilterText()}
              options={projectOptions}
              selectedValues={projectFilters}
              onSelectionChange={setProjectFilters}
              placeholder="Filter by project"
            />
          </View>

          {/* Sort Row */}
          <View className="flex-row items-center gap-3 mb-4">
            <Text className="text-sm text-gray-600 dark:text-gray-300">
              Sort by:
            </Text>
            <MultiSelectFilterDropdown
              title={sortOptions.find(opt => opt.value === sortBy)?.label || 'Sort'}
              options={sortOptions}
              selectedValues={[sortBy]}
              onSelectionChange={(values: string[]) => setSortBy(values[0] as SortOption)}
              placeholder="Sort by"
              singleSelection
            />
            <TouchableOpacity
              onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg"
            >
              <Ionicons 
                name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} 
                size={16} 
                color={isDark ? '#ffffff' : '#000000'} 
              />
            </TouchableOpacity>
          </View>

          {/* Clear Filters Button */}
          {(statusFilters.length > 0 || priorityFilters.length > 0 || projectFilters.length > 0) && (
            <SecondaryButton
              text="Clear Filters"
              onPress={clearFilters}
              loading={isFilteringActive}
            />
          )}
        </View>

        {/* Tasks Section */}
        <View className="px-6 pb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-black dark:text-white">
              Tasks {sortedTasks.length > 0 ? `(${sortedTasks.length})` : ''}
            </Text>
          </View>

          {tasksLoading || isFilteringActive ? (
            <View className="flex-1 justify-center items-center py-12">
              <Ionicons name="reload" size={32} color={isDark ? '#6b7280' : '#9ca3af'} />
              <Text className="text-gray-600 dark:text-gray-300 mt-2">
                Loading tasks...
              </Text>
            </View>
          ) : sortedTasks.length === 0 ? (
            <View className="flex-1 justify-center items-center py-12">
              <Ionicons name="document-text" size={48} color={isDark ? '#6b7280' : '#9ca3af'} />
              <Text className="text-lg font-semibold text-black dark:text-white mt-4 text-center">
                {statusFilters.length > 0 || priorityFilters.length > 0 || projectFilters.length > 0 
                  ? "No tasks found matching your filters" 
                  : "You don't have any tasks yet"}
              </Text>
              <Text className="text-gray-600 dark:text-gray-300 mt-2 text-center">
                {statusFilters.length > 0 || priorityFilters.length > 0 || projectFilters.length > 0
                  ? "Try adjusting your filters or create a new task"
                  : "Tasks will appear here once they're assigned to you"}
              </Text>
            </View>
          ) : (
            <View className="space-y-4">
              {sortedTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onPress={() => handleTaskPress(task)}
                  onStatusChange={(status: TaskStatus) => handleStatusChange(task._id, status)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 