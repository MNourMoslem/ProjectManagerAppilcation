import React, { useState, forwardRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  selectedValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
}

export const Select = forwardRef<View, SelectProps>(
  ({ options, selectedValue, onValueChange, placeholder = 'Select an option', error, disabled = false }, ref) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const selectedOption = options.find(option => option.value === selectedValue);

    const handleSelect = (value: string) => {
      if (onValueChange) {
        onValueChange(value);
      }
      setModalVisible(false);
    };

    return (
      <View ref={ref}>
        <TouchableOpacity
          className={`
            flex-row items-center justify-between w-full p-2.5 border rounded-md h-10
            ${isDark ? 'bg-gray-800' : 'bg-white'}
            ${error 
              ? 'border-red-500' 
              : isDark ? 'border-gray-600' : 'border-gray-300'}
            ${disabled ? 'opacity-50' : 'opacity-100'}
          `}
          onPress={() => !disabled && setModalVisible(true)}
          disabled={disabled}
        >
          <Text
            className={`
              text-sm
              ${selectedOption
                ? (isDark ? 'text-white' : 'text-black')
                : 'text-gray-400'}
            `}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color={isDark ? '#9ca3af' : '#6b7280'}
          />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable 
            className="flex-1 justify-end bg-black/50"
            onPress={() => setModalVisible(false)}
          >
            <View 
              className={`
                rounded-t-xl max-h-[70%] pb-5 border border-b-0
                ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'}
              `}
            >
              <View className={`
                flex-row items-center justify-between p-4 border-b
                ${isDark ? 'border-gray-700' : 'border-gray-200'}
              `}>
                <Text 
                  className={`text-base font-semibold ${isDark ? 'text-white' : 'text-black'}`}
                >
                  {placeholder}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={isDark ? 'white' : 'black'}
                  />
                </TouchableOpacity>
              </View>

              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className={`
                      flex-row items-center justify-between p-4 border-b
                      ${isDark ? 'border-gray-700' : 'border-gray-200'}
                      ${selectedValue === item.value ? 
                        (isDark ? 'bg-gray-700' : 'bg-gray-100') : ''}
                    `}
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text 
                      className={`text-sm ${isDark ? 'text-white' : 'text-black'}`}
                    >
                      {item.label}
                    </Text>
                    {selectedValue === item.value && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color="#10b981"
                      />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </Pressable>
        </Modal>
      </View>
    );
  }
);

Select.displayName = 'Select';

export default Select;
