import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

interface FilterOption {
  label: string;
  value: string;
}

interface MultiSelectFilterDropdownProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
  singleSelection?: boolean;
}

const MultiSelectFilterDropdown: React.FC<MultiSelectFilterDropdownProps> = ({
  title,
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Filter",
  singleSelection = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSelect = (value: string) => {
    if (singleSelection) {
      onSelectionChange([value]);
      setIsOpen(false);
    } else {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
      onSelectionChange(newValues);
    }
  };

  const handleClear = () => {
    onSelectionChange([]);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return title;
    if (selectedValues.length === 1) {
      const option = options.find(opt => opt.value === selectedValues[0]);
      return option?.label || title;
    }
    return `${selectedValues.length} selected`;
  };

  return (
    <>
      <TouchableOpacity
        className={`flex-row items-center px-3 py-2 rounded-md border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } ${selectedValues.length > 0 ? 'border-blue-500 dark:border-blue-400' : ''}`}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Ionicons 
          name="filter-outline" 
          size={16} 
          color={selectedValues.length > 0 ? (isDark ? '#60a5fa' : '#3b82f6') : (isDark ? '#9ca3af' : '#6b7280')} 
        />
        <Text className={`ml-2 text-sm ${
          selectedValues.length > 0 
            ? 'text-blue-600 dark:text-blue-400 font-medium' 
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          {getDisplayText()}
        </Text>
        {selectedValues.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            className="ml-2"
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={16} color={isDark ? '#60a5fa' : '#3b82f6'} />
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
                  {title}
                </Text>
              </View>
              
              <ScrollView className="max-h-64">
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    className={`p-4 border-b border-gray-100 dark:border-gray-700 ${
                      selectedValues.includes(option.value) 
                        ? 'bg-blue-50 dark:bg-blue-900/30' 
                        : ''
                    }`}
                    onPress={() => handleSelect(option.value)}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center justify-between">
                      <Text className={`text-base ${
                        selectedValues.includes(option.value)
                          ? 'text-blue-600 dark:text-blue-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {option.label}
                      </Text>
                      {selectedValues.includes(option.value) && (
                        <Ionicons name="checkmark" size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              {selectedValues.length > 0 && (
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

export default MultiSelectFilterDropdown; 