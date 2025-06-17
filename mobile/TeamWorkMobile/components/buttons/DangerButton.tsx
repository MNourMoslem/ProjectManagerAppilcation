import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';
import type { BaseButtonProps } from './ButtonBase';
import LoadingSpinner from './LoadingSpinner';

const DangerButton: React.FC<BaseButtonProps> = ({ 
  icon, 
  text, 
  onPress, 
  disabled = false, 
  loading = false,
  size = 'md',
  fullWidth = false,
  className = '',
  children
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Map button size to padding values
  const paddingMap = {
    'xs': { vertical: 2, horizontal: 6 },
    'sm': { vertical: 4, horizontal: 8 },
    'md': { vertical: 6, horizontal: 10 },
    'lg': { vertical: 8, horizontal: 12 }
  };
  
  // Map button size to font size
  const fontSizeMap = {
    'xs': 10,
    'sm': 12,
    'md': 14,
    'lg': 16
  };
  
  // Map button size to spinner size
  const spinnerSizeMap = {
    'xs': 'xs',
    'sm': 'xs',
    'md': 'sm',
    'lg': 'sm'
  } as const;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: isDark ? '#8B0000' : '#ef4444',
          paddingVertical: paddingMap[size].vertical,
          paddingHorizontal: paddingMap[size].horizontal,
          opacity: (disabled || loading) ? 0.5 : 1,
          width: fullWidth ? '100%' : undefined
        }
      ]}
      className={className}
    >
      <View style={styles.contentContainer}>
        {loading ? (
          <LoadingSpinner 
            size={spinnerSizeMap[size]} 
            color="#fff" 
          />
        ) : (
          <>
            {icon && <View style={styles.icon}>{icon}</View>}
            {text && (
              <Text 
                style={[
                  styles.text, 
                  { 
                    fontSize: fontSizeMap[size],
                    color: 'white'
                  }
                ]}
              >
                {text}
              </Text>
            )}
            {children}
          </>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '500',
    letterSpacing: -0.3,
  },
  icon: {
    marginRight: 6,
  }
});

export default DangerButton;
