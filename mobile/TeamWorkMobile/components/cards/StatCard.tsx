import React from 'react';
import { View, Text } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

interface StatCardProps {
  label: string;
  value: number;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 border border-gray-200 dark:border-gray-700">
      <View className="flex-row items-center justify-between mb-2">
        {icon && (
          <View className="bg-gray-200 dark:bg-gray-700 p-2 rounded-md">
            <Ionicons name={icon as any} size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
          </View>
        )}
        {trend && (
          <View className="flex-row items-center">
            <Ionicons 
              name={trend.isPositive ? "trending-up" : "trending-down"} 
              size={16} 
              color={trend.isPositive ? '#10b981' : '#ef4444'} 
            />
            <Text className={`text-xs font-medium ml-1 ${
              trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {trend.value}%
            </Text>
          </View>
        )}
      </View>
      
      <Text className="text-2xl font-bold text-black dark:text-white">
        {value}
      </Text>
      
      <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {label}
      </Text>
    </View>
  );
};

export default StatCard; 