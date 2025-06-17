import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  error?: boolean | string;
  hint?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onToggle,
  disabled = false,
  error = false,
  hint,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="mb-2">
      <TouchableOpacity
        className="flex-row items-center"
        onPress={onToggle}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <View
          className={`
            w-4 h-4 border rounded mr-2 justify-center items-center
            ${checked 
              ? (isDark ? 'bg-white' : 'bg-black') 
              : 'bg-transparent'}
            ${typeof error === 'boolean' && error
              ? 'border-red-500'
              : checked
              ? (isDark ? 'border-white' : 'border-black')
              : isDark
              ? 'border-gray-600'
              : 'border-gray-300'}
            ${disabled ? 'opacity-50' : 'opacity-100'}
          `}
        >
          {checked && (
            <Ionicons
              name="checkmark"
              size={12}
              color={isDark ? 'black' : 'white'}
            />
          )}
        </View>
        <Text
          className={`
            text-sm
            ${isDark ? 'text-gray-300' : 'text-gray-700'}
            ${disabled ? 'opacity-50' : 'opacity-100'}
          `}
        >
          {label}
        </Text>
      </TouchableOpacity>
      
      {hint && (
        <Text
          className={`
            text-xs ml-6 mt-0.5
            ${isDark ? 'text-gray-400' : 'text-gray-500'}
          `}
        >
          {hint}
        </Text>
      )}

      {error && typeof error === 'string' && (
        <Text className="text-xs text-red-500 ml-6 mt-0.5">
          {error}
        </Text>
      )}
    </View>
  );
};

export default Checkbox;
