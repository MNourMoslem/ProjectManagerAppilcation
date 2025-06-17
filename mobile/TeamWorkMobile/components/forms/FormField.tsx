import React, { forwardRef, ReactNode } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

// FormField component
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
  hint?: string;
  icon?: string;
}

export const FormField = forwardRef<View, FormFieldProps>(
  ({ label, error, required = false, className = '', children, hint, icon }, ref) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
      <View 
        ref={ref} 
        className={`mb-4 ${className}`}
      >
        <Text 
          className={`text-xs font-medium mb-1.5 tracking-tight ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
        >
          {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
        
        {children}
        
        {hint && (
          <Text 
            className={`text-xs mt-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          >
            {hint}
          </Text>
        )}
        
        {error && (
          <View className="flex-row items-center mt-1.5">
            <Ionicons name="alert-circle-outline" size={12} color="#ef4444" style={{ marginRight: 3 }} />
            <Text className="text-xs text-red-500">
              {error}
            </Text>
          </View>
        )}
      </View>
    );
  }
);

FormField.displayName = 'FormField';

// Input component
interface InputProps extends TextInputProps {
  error?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  fullWidth?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ error, className, leftIcon, rightIcon, onRightIconPress, fullWidth = false, ...props }, ref) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    return (
      <View className={`relative ${fullWidth ? 'w-full' : ''}`}>
        {leftIcon && (
          <View className="absolute left-3 top-0 bottom-0 justify-center z-10">
            <Ionicons 
              name={leftIcon as any} 
              size={18} 
              color={isDark ? '#9ca3af' : '#6b7280'} 
            />
          </View>
        )}
        
        <TextInput
          ref={ref}
          className={`
            p-3 text-sm rounded-md border transition-all duration-150
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-200'}
            ${error 
              ? 'border-red-500' 
              : isDark ? 'border-gray-700' : 'border-gray-200'}
            ${className || ''}
          `}
          placeholderTextColor={isDark ? '#9ca3af' : '#9ca3af'}
          {...props}
        />
        
        {rightIcon && (
          <TouchableOpacity 
            className="absolute right-3 top-0 bottom-0 justify-center z-10"
            onPress={onRightIconPress}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={rightIcon as any} 
              size={18} 
              color={isDark ? '#9ca3af' : '#6b7280'} 
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

export default { FormField, Input };
