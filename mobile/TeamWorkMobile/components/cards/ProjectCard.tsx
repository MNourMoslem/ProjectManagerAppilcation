import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { ProjectWithDetails } from '../../store/projectStore';

interface ProjectDetails {
  taskCounts: {
    [status in 'todo' | 'in-progress' | 'done']?: number;
  };
}

interface Project {
  _id: string;
  name: string;
  shortDescription?: string;
  status: "active" | "archived" | "completed";
  targetDate?: string;
  members?: any[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectCardProps {
  project?: Project | ProjectWithDetails;
  details?: ProjectDetails;
  loading?: boolean;
  onPress?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  details,
  loading = false,
  onPress
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Show skeleton loader when loading is true
  if (loading) {
    return (
      <View className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <View className="h-1 w-full bg-gray-300 dark:bg-gray-600" />
        <View className="p-4">
          <View className="flex-row items-center justify-center py-6">
            <View className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-black dark:border-t-white rounded-full animate-spin mr-3" />
            <Text className="text-gray-500 dark:text-gray-400">Loading project...</Text>
          </View>
        </View>
      </View>
    );
  }

  // If not loading but project data is not available, show empty state
  if (!project || !details) {
    return (
      <View className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <View className="p-4 text-center">
          <Text className="text-gray-500 dark:text-gray-400">Project information unavailable</Text>
        </View>
      </View>
    );
  }

  // Calculate progress percentage
  const { _id, name, shortDescription, status, targetDate } = project;
  
  const membersCount = project.members?.length || 0;
  
  const tasksCount = Object.values(details.taskCounts || {}).reduce((acc, count) => acc + (count || 0), 0);
  const completedTasksCount = details.taskCounts?.['done'] || 0;
  const progress = tasksCount > 0 ? Math.round((completedTasksCount / tasksCount) * 100) : 0;
  
  // Determine status color
  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    archived: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  };

  // Format target date if exists
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'No target date';
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return 'Invalid date';
    }
  };

  const formattedDate = formatDate(targetDate);

  return (
    <TouchableOpacity 
      className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden"
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Status indicator bar */}
      <View className={`h-1 w-full ${
        status === 'active' ? 'bg-black dark:bg-white' : 
        status === 'completed' ? 'bg-gray-400' : 'bg-gray-500'
      }`} />
      
      <View className="p-4">
        {/* Header */}
        <View className="flex-row justify-between items-start mb-3">
          <Text className="text-lg font-bold text-black dark:text-white flex-1 mr-2" numberOfLines={1}>
            {name}
          </Text>
          <View className={`px-2 py-1 rounded-full ${statusColors[status]}`}>
            <Text className="text-xs font-medium">
              {status?.charAt(0).toUpperCase() + status?.slice(1)}
            </Text>
          </View>
        </View>
        
        {/* Description */}
        <Text className="text-gray-600 dark:text-gray-300 text-sm mb-4" numberOfLines={2}>
          {shortDescription || 'No description provided'}
        </Text>
        
        {/* Progress bar */}
        <View className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4">
          <View 
            className="bg-black dark:bg-white h-1.5 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </View>
        
        {/* Stats */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="checkmark-circle-outline" size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
            <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              {completedTasksCount}/{tasksCount} tasks
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons name="people-outline" size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
            <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              {membersCount} members
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
            <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1" numberOfLines={1}>
              {formattedDate}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Action button */}
      <View className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <View className="w-full bg-black dark:bg-white rounded-md py-2">
          <Text className="text-center text-sm font-medium text-white dark:text-black">
            View Project
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProjectCard; 