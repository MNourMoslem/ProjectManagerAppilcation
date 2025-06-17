import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filterType: string;
  sortType: string;
  onApplyFilter: (filterType: string, sortType: string) => void;
}

export default function FilterModal({
  visible,
  onClose,
  filterType,
  sortType,
  onApplyFilter,
}: FilterModalProps) {
  const [selectedFilter, setSelectedFilter] = useState(filterType);
  const [selectedSort, setSelectedSort] = useState(sortType);

  const filterOptions = [
    { id: 'all', label: 'All Mail', icon: 'mail' },
    { id: 'unread', label: 'Unread', icon: 'mail-unread' },
    { id: 'invitations', label: 'Invitations', icon: 'mail-open' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'messages', label: 'Messages', icon: 'chatbubble' },
  ];

  const sortOptions = [
    { id: 'newest', label: 'Newest First', icon: 'arrow-down' },
    { id: 'oldest', label: 'Oldest First', icon: 'arrow-up' },
    { id: 'sender', label: 'By Sender', icon: 'person' },
    { id: 'subject', label: 'By Subject', icon: 'text' },
  ];

  const handleApply = () => {
    onApplyFilter(selectedFilter, selectedSort);
    onClose();
  };

  const handleReset = () => {
    setSelectedFilter('all');
    setSelectedSort('newest');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white dark:bg-gray-900">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <TouchableOpacity onPress={onClose} className="p-2">
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-black dark:text-white">
            Filter & Sort
          </Text>
          <TouchableOpacity onPress={handleReset} className="p-2">
            <Text className="text-blue-500 font-medium">Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Filter Options */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-black dark:text-white mb-4">
              Filter by Type
            </Text>
            <View className="space-y-2">
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setSelectedFilter(option.id)}
                  className={`flex-row items-center p-3 rounded-lg border ${
                    selectedFilter === option.id
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700'
                      : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  }`}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={20}
                    color={
                      selectedFilter === option.id
                        ? '#3b82f6'
                        : '#6b7280'
                    }
                  />
                  <Text
                    className={`ml-3 flex-1 ${
                      selectedFilter === option.id
                        ? 'text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {option.label}
                  </Text>
                  {selectedFilter === option.id && (
                    <Ionicons name="checkmark" size={20} color="#3b82f6" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sort Options */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-black dark:text-white mb-4">
              Sort by
            </Text>
            <View className="space-y-2">
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setSelectedSort(option.id)}
                  className={`flex-row items-center p-3 rounded-lg border ${
                    selectedSort === option.id
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700'
                      : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  }`}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={20}
                    color={
                      selectedSort === option.id
                        ? '#3b82f6'
                        : '#6b7280'
                    }
                  />
                  <Text
                    className={`ml-3 flex-1 ${
                      selectedSort === option.id
                        ? 'text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {option.label}
                  </Text>
                  {selectedSort === option.id && (
                    <Ionicons name="checkmark" size={20} color="#3b82f6" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View className="p-4 border-t border-gray-200 dark:border-gray-700">
          <TouchableOpacity
            onPress={handleApply}
            className="bg-blue-500 p-4 rounded-lg items-center"
            activeOpacity={0.7}
          >
            <Text className="text-white font-semibold text-lg">
              Apply Filters
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
} 