import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useColorScheme } from 'nativewind';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'sm',
  color
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Map our custom sizes to React Native's ActivityIndicator sizes
  const sizeMap = {
    'xs': 'small',
    'sm': 'small',
    'md': 'small',
    'lg': 'large'
  };

  // Determine color based on props or theme
  const spinnerColor = color || (isDark ? '#fff' : '#000');

  return (
    <View className="flex items-center justify-center">
      <ActivityIndicator 
        size={sizeMap[size] as 'small' | 'large'} 
        color={spinnerColor} 
      />
    </View>
  );
};

export default LoadingSpinner;
