import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '@/interfaces/interfaces';

interface TinyTaskCardProps {
  task: Task;
  onPress?: () => void;
  onSubmit?: () => void;
  onReject?: () => void;
}

const TinyTaskCard: React.FC<TinyTaskCardProps> = ({
  task,
  onPress,
  onSubmit,
  onReject,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#ef4444';
      case 'high':
        return '#f97316';
      case 'medium':
        return '#eab308';
      case 'low':
        return '#22c55e';
      default:
        return isDark ? '#6b7280' : '#9ca3af';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return '#22c55e';
      case 'in-progress':
        return '#f97316';
      case 'todo':
      default:
        return isDark ? '#6b7280' : '#9ca3af';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in-progress':
        return 'In Progress';
      case 'done':
        return 'Done';
      default:
        return status;
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    const now = new Date();
    const taskDate = new Date(date);
    const diffTime = taskDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Overdue', color: '#ef4444' };
    } else if (diffDays === 0) {
      return { text: 'Due today', color: '#f97316' };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', color: '#eab308' };
    } else if (diffDays <= 7) {
      return { text: `Due in ${diffDays} days`, color: '#22c55e' };
    } else {
      return { text: taskDate.toLocaleDateString(), color: isDark ? '#9ca3af' : '#6b7280' };
    }
  };

  const dateInfo = formatDate(task.dueDate || null);

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`p-4 rounded-xl border ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
      activeOpacity={0.7}
    >
      {/* Header with title and priority */}
      <View className="flex-row items-start justify-between mb-2">
        <Text
          className={`flex-1 font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        <View className="flex-row mt-2">
          <View className="bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded-full mr-2">
            <Text className="text-blue-800 dark:text-blue-200 text-xs font-medium">
              {task.priority}
            </Text>
          </View>
          <View className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            <Text className="text-gray-700 dark:text-gray-300 text-xs">
              {task.status}
            </Text>
          </View>
        </View>
      </View>

      {/* Project name */}
      {task.project && typeof task.project === 'object' && 'name' in task.project && (
        <View className="flex-row items-center mb-2">
          <Ionicons name="folder-outline" size={12} color={isDark ? '#9ca3af' : '#6b7280'} />
          <Text className="text-xs text-gray-600 dark:text-gray-300 ml-1">
            {(task.project as any).name}
          </Text>
        </View>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <View className="flex-row flex-wrap mb-3">
          {task.tags.slice(0, 2).map((tag, index) => (
            <View
              key={index}
              className={`px-2 py-1 rounded-full mr-1 mb-1 ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}
            >
              <Text className="text-xs text-gray-600 dark:text-gray-300">
                {tag}
              </Text>
            </View>
          ))}
          {task.tags.length > 2 && (
            <View
              className={`px-2 py-1 rounded-full mr-1 mb-1 ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}
            >
              <Text className="text-xs text-gray-600 dark:text-gray-300">
                +{task.tags.length - 2}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Footer with due date and actions */}
      <View className="flex-row items-center justify-between">
        {/* Due date */}
        {dateInfo && (
          <Text
            className="text-xs font-medium"
            style={{ color: dateInfo.color }}
          >
            {dateInfo.text}
          </Text>
        )}

        {/* Action buttons for in-progress tasks */}
        {task.status === 'in-progress' && (
          <View className="flex-row">
            <TouchableOpacity
              onPress={onReject}
              className="p-1.5 rounded-full bg-red-100 dark:bg-red-900/30 mr-2"
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={14} color="#ef4444" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSubmit}
              className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30"
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark" size={14} color="#22c55e" />
            </TouchableOpacity>
          </View>
        )}

        {/* Status indicator for other statuses */}
        {task.status !== 'in-progress' && (
          <View
            className="px-2 py-1 rounded-full"
            style={{ backgroundColor: `${getStatusColor(task.status)}20` }}
          >
            <Text
              className="text-xs font-medium"
              style={{ color: getStatusColor(task.status) }}
            >
              {getStatusLabel(task.status)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default TinyTaskCard; 