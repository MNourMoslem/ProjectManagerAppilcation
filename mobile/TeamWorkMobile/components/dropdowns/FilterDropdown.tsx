import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  options: FilterOption[];
  selectedValue?: string;
  placeholder?: string;
  onSelect: (value: string) => void;
  onClear?: () => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  options,
  selectedValue,
  placeholder = "Filter",
  onSelect,
  onClear
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const selectedOption = options.find(option => option.value === selectedValue);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const handleClear = () => {
    onClear?.();
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        className={`flex-row items-center px-3 py-2 rounded-md border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Ionicons 
          name="filter-outline" 
          size={16} 
          color={isDark ? '#9ca3af' : '#6b7280'} 
        />
        <Text className={`ml-2 text-sm ${
          selectedValue 
            ? 'text-black dark:text-white font-medium' 
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          {selectedOption?.label || placeholder}
        </Text>
        {selectedValue && (
          <TouchableOpacity
            onPress={handleClear}
            className="ml-2"
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
          </TouchableOpacity>
        )}
        <Ionicons 
          name="chevron-down" 
          size={16} 
          color={isDark ? '#9ca3af' : '#6b7280'} 
          style={{ marginLeft: 'auto' }}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View className="flex-1 justify-center items-center px-6">
            <View className={`w-full max-w-sm rounded-md border ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <View className="p-4 border-b border-gray-200 dark:border-gray-700">
                <Text className="text-lg font-bold text-black dark:text-white">
                  {placeholder}
                </Text>
              </View>
              
              <View className="max-h-64">
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    className={`p-4 border-b border-gray-100 dark:border-gray-700 ${
                      selectedValue === option.value 
                        ? 'bg-gray-50 dark:bg-gray-700' 
                        : ''
                    }`}
                    onPress={() => handleSelect(option.value)}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className={`text-base ${
                        selectedValue === option.value
                          ? 'text-black dark:text-white font-medium'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {option.label}
                      </Text>
                      {selectedValue === option.value && (
                        <Ionicons name="checkmark" size={20} color={isDark ? '#ffffff' : '#000000'} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              
              {selectedValue && onClear && (
                <TouchableOpacity
                  className="p-4 border-t border-gray-200 dark:border-gray-700"
                  onPress={handleClear}
                  activeOpacity={0.7}
                >
                  <Text className="text-center text-red-600 dark:text-red-400 font-medium">
                    Clear Filter
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default FilterDropdown; 