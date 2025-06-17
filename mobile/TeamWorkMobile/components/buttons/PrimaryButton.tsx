import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';
import type { BaseButtonProps } from './ButtonBase';
import { buttonSizes, buttonStates, buttonFont, buttonTextSizes } from './ButtonBase';
import LoadingSpinner from './LoadingSpinner';
import { Ionicons } from '@expo/vector-icons';

interface ExtendedButtonProps extends BaseButtonProps {
  iconName?: any; // Ionicons name
  iconPosition?: 'left' | 'right';
  elevation?: boolean;
}

const PrimaryButton: React.FC<ExtendedButtonProps> = ({ 
  icon, 
  iconName,
  iconPosition = 'left',
  text, 
  onPress, 
  disabled = false, 
  loading = false,
  size = 'md',
  fullWidth = false,
  className = '',
  elevation = false,
  children
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
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

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        ${buttonFont}
        ${buttonSizes[size]}
        ${buttonStates.focus}
        ${(disabled || loading) ? buttonStates.disabled : ''}
        ${fullWidth ? 'w-full' : ''}
        bg-white text-black 
        dark:bg-gray-800 dark:text-white
        border border-gray-200 dark:border-gray-700
        rounded-md
        ${className}
      `}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center justify-center space-x-1.5">
        {loading ? (
          <LoadingSpinner 
            size={spinnerSizeMap[size]} 
            color={isDark ? "#ffffff" : "#000000"} 
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && <View className="flex-shrink-0">{icon}</View>}
            {iconName && iconPosition === 'left' && (
              <Ionicons 
                name={iconName} 
                size={iconSizeMap[size]} 
                color={isDark ? "#ffffff" : "#000000"} 
                style={{ marginRight: 6 }} 
              />
            )}
            
            {text && (
              <Text 
                className={`
                  ${buttonTextSizes[size]}
                  leading-tight
                  ${isDark ? 'text-white' : 'text-black'}
                `}
              >
                {text}
              </Text>
            )}
            
            {icon && iconPosition === 'right' && <View className="flex-shrink-0">{icon}</View>}
            {iconName && iconPosition === 'right' && (
              <Ionicons 
                name={iconName} 
                size={iconSizeMap[size]} 
                color={isDark ? "#ffffff" : "#000000"} 
                style={{ marginLeft: 6 }} 
              />
            )}
            
            {children}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
