import React, { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from './LoadingSpinner';

export interface BaseButtonProps {
  icon?: ReactNode;
  text?: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  children?: ReactNode;
}

// Common button style configurations - matching web design
export const buttonSizes = {
  xs: 'py-0.5 px-1.5',
  sm: 'py-1 px-2',
  md: 'py-1.5 px-2.5',
  lg: 'py-2 px-3',
};

// Common focus and disabled states
export const buttonStates = {
  focus: 'focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-400 dark:focus:ring-gray-600',
  disabled: 'opacity-50',
};

// Font styling for that tiny, fancy look inspired by Linear
export const buttonFont = 'font-medium tracking-tight';

// Text sizes matching web design
export const buttonTextSizes = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

interface ExtendedButtonProps extends BaseButtonProps {
  iconName?: any; // Ionicons name
  iconPosition?: 'left' | 'right';
  variant?: 'solid' | 'outline' | 'ghost';
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
}

const ButtonBase: React.FC<ExtendedButtonProps> = ({
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
  variant = 'solid',
  color = 'primary',
  children
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

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

  // Color configurations
  const colorConfig = {
    primary: {
      solid: {
        bg: isDark ? 'bg-blue-500' : 'bg-blue-600',
        text: 'text-white',
        iconColor: 'white'
      },
      outline: {
        bg: 'bg-transparent',
        border: isDark ? 'border-blue-500' : 'border-blue-600',
        text: isDark ? 'text-blue-400' : 'text-blue-600',
        iconColor: isDark ? '#93c5fd' : '#2563eb'
      },
      ghost: {
        bg: isDark ? 'bg-blue-900/20' : 'bg-blue-50',
        text: isDark ? 'text-blue-400' : 'text-blue-600',
        iconColor: isDark ? '#93c5fd' : '#2563eb'
      }
    },
    secondary: {
      solid: {
        bg: isDark ? 'bg-gray-600' : 'bg-gray-700',
        text: 'text-white',
        iconColor: 'white'
      },
      outline: {
        bg: 'bg-transparent',
        border: isDark ? 'border-gray-500' : 'border-gray-600',
        text: isDark ? 'text-gray-300' : 'text-gray-700',
        iconColor: isDark ? '#e5e7eb' : '#374151'
      },
      ghost: {
        bg: isDark ? 'bg-gray-800/40' : 'bg-gray-100',
        text: isDark ? 'text-gray-300' : 'text-gray-700',
        iconColor: isDark ? '#e5e7eb' : '#374151'
      }
    },
    success: {
      solid: {
        bg: isDark ? 'bg-green-500' : 'bg-green-600',
        text: 'text-white',
        iconColor: 'white'
      },
      outline: {
        bg: 'bg-transparent',
        border: isDark ? 'border-green-500' : 'border-green-600',
        text: isDark ? 'text-green-400' : 'text-green-600',
        iconColor: isDark ? '#86efac' : '#16a34a'
      },
      ghost: {
        bg: isDark ? 'bg-green-900/20' : 'bg-green-50',
        text: isDark ? 'text-green-400' : 'text-green-600',
        iconColor: isDark ? '#86efac' : '#16a34a'
      }
    },
    danger: {
      solid: {
        bg: isDark ? 'bg-red-500' : 'bg-red-600',
        text: 'text-white',
        iconColor: 'white'
      },
      outline: {
        bg: 'bg-transparent',
        border: isDark ? 'border-red-500' : 'border-red-600',
        text: isDark ? 'text-red-400' : 'text-red-600',
        iconColor: isDark ? '#fca5a5' : '#dc2626'
      },
      ghost: {
        bg: isDark ? 'bg-red-900/20' : 'bg-red-50',
        text: isDark ? 'text-red-400' : 'text-red-600',
        iconColor: isDark ? '#fca5a5' : '#dc2626'
      }
    },
    warning: {
      solid: {
        bg: isDark ? 'bg-amber-500' : 'bg-amber-600',
        text: 'text-white',
        iconColor: 'white'
      },
      outline: {
        bg: 'bg-transparent',
        border: isDark ? 'border-amber-500' : 'border-amber-600',
        text: isDark ? 'text-amber-400' : 'text-amber-600',
        iconColor: isDark ? '#fcd34d' : '#d97706'
      },
      ghost: {
        bg: isDark ? 'bg-amber-900/20' : 'bg-amber-50',
        text: isDark ? 'text-amber-400' : 'text-amber-600',
        iconColor: isDark ? '#fcd34d' : '#d97706'
      }
    },
    info: {
      solid: {
        bg: isDark ? 'bg-sky-500' : 'bg-sky-600',
        text: 'text-white',
        iconColor: 'white'
      },
      outline: {
        bg: 'bg-transparent',
        border: isDark ? 'border-sky-500' : 'border-sky-600',
        text: isDark ? 'text-sky-400' : 'text-sky-600',
        iconColor: isDark ? '#7dd3fc' : '#0284c7'
      },
      ghost: {
        bg: isDark ? 'bg-sky-900/20' : 'bg-sky-50',
        text: isDark ? 'text-sky-400' : 'text-sky-600',
        iconColor: isDark ? '#7dd3fc' : '#0284c7'
      }
    }
  };
  const selectedStyle = colorConfig[color][variant];
  const borderClass = variant === 'outline' ? 'border ' + (selectedStyle as any).border : '';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        rounded-xl justify-center items-center
        ${selectedStyle.bg}
        ${borderClass}
        ${buttonSizes[size]}
        ${fullWidth ? 'w-full' : 'self-start'} 
        ${(disabled || loading) ? 'opacity-50' : 'opacity-100'}
        ${className}
      `}
    >
      <View className="flex-row items-center justify-center">
        {loading ? (
          <LoadingSpinner 
            size={spinnerSizeMap[size]} 
            color={variant === 'solid' ? 'white' : selectedStyle.iconColor} 
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && <View className="mr-2">{icon}</View>}
            {iconName && iconPosition === 'left' && (
              <Ionicons 
                name={iconName} 
                size={iconSizeMap[size]} 
                color={variant === 'solid' ? 'white' : selectedStyle.iconColor} 
                style={{ marginRight: 8 }} 
              />
            )}
            
            {text && (
              <Text 
                className={`
                  font-semibold
                  ${textSizeClasses[size]}
                  ${selectedStyle.text}
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
                color={variant === 'solid' ? 'white' : selectedStyle.iconColor} 
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

export default ButtonBase;
