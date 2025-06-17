import React, { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { useColorScheme } from 'nativewind';

interface TextareaProps extends TextInputProps {
  error?: boolean;
}

export const Textarea = forwardRef<TextInput, TextareaProps>(
  ({ error, className, ...props }, ref) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
      <TextInput
        ref={ref}
        className={`
          w-full min-h-[100px] p-2.5 text-sm rounded-md border
          ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}
          ${error 
            ? 'border-red-500' 
            : isDark ? 'border-gray-600' : 'border-gray-300'}
          ${className || ''}
        `}
        placeholderTextColor={isDark ? '#9ca3af' : '#9ca3af'}
        multiline
        textAlignVertical="top"
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
