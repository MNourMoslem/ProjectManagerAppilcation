import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
  error?: boolean | string;
  disabled?: boolean;
  direction?: 'vertical' | 'horizontal';
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  selectedValue,
  onValueChange,
  error = false,
  disabled = false,
  direction = 'vertical',
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View>
      <View 
        className={`
          my-1
          ${direction === 'horizontal' ? 'flex-row flex-wrap' : ''}
        `}
      >
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            className={`
              flex-row items-center mb-2
              ${direction === 'horizontal' ? 'mr-4' : ''}
            `}
            onPress={() => onValueChange(option.value)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <View
              className={`
                w-[18px] h-[18px] rounded-full border-2 mr-2 justify-center items-center
                ${typeof error === 'boolean' && error
                  ? 'border-red-500'
                  : isDark
                  ? 'border-gray-600'
                  : 'border-gray-300'}
                ${disabled ? 'opacity-50' : 'opacity-100'}
              `}
            >
              {selectedValue === option.value && (
                <View
                  className={`
                    w-2.5 h-2.5 rounded-full
                    ${isDark ? 'bg-white' : 'bg-black'}
                  `}
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
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error && typeof error === 'string' && (
        <Text className="text-xs text-red-500 mt-0.5">
          {error}
        </Text>
      )}
    </View>
  );
};

export default RadioGroup;
