import React, { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import LoadingSpinner from './LoadingSpinner';

interface IconButtonProps {
  icon: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  disabled = false,
  loading = false,
  size = 'md',
  variant = 'ghost',
  className = '',
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Map button size to dimensions
  const sizeMap = {
    'xs': 24,
    'sm': 28,
    'md': 32,
    'lg': 40
  };

  // Map button size to spinner size
  const spinnerSizeMap = {
    'xs': 'xs',
    'sm': 'xs',
    'md': 'sm',
    'lg': 'sm'
  } as const;

  // Get background color based on variant and theme
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return isDark ? 'white' : 'black';
      case 'secondary':
        return isDark ? '#333' : '#f3f4f6';
      case 'outline':
        return 'transparent';
      case 'ghost':
      default:
        return 'transparent';
    }
  };

  // Get icon color based on variant and theme
  const getIconColor = () => {
    if (variant === 'primary') {
      return isDark ? 'black' : 'white';
    }
    return isDark ? 'white' : 'black';
  };

  // Get border styling for outline variant
  const getBorderStyle = () => {
    if (variant === 'outline') {
      return {
        borderWidth: 1,
        borderColor: isDark ? '#555' : '#d1d5db',
      };
    }
    return {};
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          width: sizeMap[size],
          height: sizeMap[size],
          backgroundColor: getBackgroundColor(),
          opacity: (disabled || loading) ? 0.5 : 1,
          ...getBorderStyle()
        }
      ]}
      className={className}
    >
      <View style={styles.contentContainer}>
        {loading ? (
          <LoadingSpinner 
            size={spinnerSizeMap[size]} 
            color={getIconColor()} 
          />
        ) : (
          <View style={{ 
            opacity: variant === 'ghost' ? 0.7 : 1 
          }}>
            {icon}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default IconButton;
