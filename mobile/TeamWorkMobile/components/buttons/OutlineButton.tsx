import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';
import type { BaseButtonProps } from './ButtonBase';
import LoadingSpinner from './LoadingSpinner';
import { Ionicons } from '@expo/vector-icons';

interface ExtendedButtonProps extends BaseButtonProps {
  iconName?: any; // Ionicons name
  iconPosition?: 'left' | 'right';
  color?: 'default' | 'blue' | 'green' | 'red';
}

const OutlineButton: React.FC<ExtendedButtonProps> = ({ 
  icon, 
  iconName,
  iconPosition = 'left',
  text, 
  onPress, 
  disabled = false, 
  loading = false,
  size = 'md',
  fullWidth = false, // Default to false to prevent full-width
  className = '',
  color = 'default',
  children
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Map button size to NativeWind classes
  const sizeClasses = {
    'xs': 'py-1 px-2',
    'sm': 'py-2 px-3',
    'md': 'py-2.5 px-4',
    'lg': 'py-3 px-5',
  };

  // Map button size to text size
  const textSizeClasses = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'md': 'text-base',
    'lg': 'text-lg',
  };
  
  // Map button size to spinner size
  const spinnerSizeMap = {
    'xs': 'xs',
    'sm': 'xs',
    'md': 'sm',
    'lg': 'sm'
  } as const;

  // Map button size to icon size
  const iconSizeMap = {
    'xs': 14,
    'sm': 16,
    'md': 18,
    'lg': 20
  };

  // Color maps for border and text
  const colorClasses = {
    default: {
      border: isDark ? 'border-gray-600' : 'border-gray-300',
      text: isDark ? 'text-white' : 'text-gray-800'
    },
    blue: {
      border: isDark ? 'border-blue-500' : 'border-blue-600',
      text: isDark ? 'text-blue-400' : 'text-blue-600'
    },
    green: {
      border: isDark ? 'border-green-500' : 'border-green-600',
      text: isDark ? 'text-green-400' : 'text-green-600'
    },
    red: {
      border: isDark ? 'border-red-500' : 'border-red-600',
      text: isDark ? 'text-red-400' : 'text-red-600'
    }
  };

  // Get icon color based on button color
  const getIconColor = () => {
    switch(color) {
      case 'blue': return isDark ? '#93c5fd' : '#2563eb';
      case 'green': return isDark ? '#86efac' : '#16a34a';
      case 'red': return isDark ? '#fca5a5' : '#dc2626';
      default: return isDark ? '#ffffff' : '#1f2937';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        rounded-xl justify-center items-center border
        ${colorClasses[color].border}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : 'self-start'}
        ${(disabled || loading) ? 'opacity-50' : 'opacity-100'}
        ${className}
      `}
    >
      <View className="flex-row items-center justify-center">
        {loading ? (
          <LoadingSpinner 
            size={spinnerSizeMap[size]} 
            color={getIconColor()} 
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && <View className="mr-2">{icon}</View>}
            {iconName && iconPosition === 'left' && (
              <Ionicons 
                name={iconName} 
                size={iconSizeMap[size]} 
                color={getIconColor()} 
                style={{ marginRight: 8 }} 
              />
            )}
            
            {text && (
              <Text 
                className={`
                  font-semibold
                  ${textSizeClasses[size]}
                  ${colorClasses[color].text}
                `}
              >
                {text}
              </Text>
            )}
            
            {icon && iconPosition === 'right' && <View className="ml-2">{icon}</View>}
            {iconName && iconPosition === 'right' && (
              <Ionicons 
                name={iconName} 
                size={iconSizeMap[size]} 
                color={getIconColor()} 
                style={{ marginLeft: 8 }} 
              />
            )}
            
            {children}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default OutlineButton;
