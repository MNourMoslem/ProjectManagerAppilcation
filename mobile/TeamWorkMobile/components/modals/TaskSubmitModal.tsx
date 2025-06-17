import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton, SecondaryButton } from '../buttons';

interface TaskSubmitModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
  type: 'submit' | 'reject';
  loading?: boolean;
}

const TaskSubmitModal: React.FC<TaskSubmitModalProps> = ({
  visible,
  onClose,
  onSubmit,
  type,
  loading = false
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim()) {
      onSubmit(message.trim());
      setMessage('');
    }
  };

  const handleClose = () => {
    setMessage('');
    onClose();
  };

  const isSubmit = type === 'submit';
  const title = isSubmit ? 'Submit Task' : 'Reject Task';
  const placeholder = isSubmit 
    ? 'Add a message about your submission...' 
    : 'Explain why this task is being rejected...';
  const buttonText = isSubmit ? 'Submit' : 'Reject';
  const iconName = isSubmit ? 'checkmark-circle' : 'close-circle';
  const iconColor = isSubmit ? '#22c55e' : '#ef4444';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className={`w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl`}>
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <View 
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${iconColor}20` }}
              >
                <Ionicons name={iconName as any} size={24} color={iconColor} />
              </View>
              <Text className="text-xl font-bold text-black dark:text-white">
                {title}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              className="p-2 -mr-2"
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
          </View>

          {/* Message Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-black dark:text-white mb-2">
              Message *
            </Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder={placeholder}
              placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
              className={`p-4 rounded-xl border text-base ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-black'
              }`}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              autoFocus
            />
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-3">
            <SecondaryButton
              text="Cancel"
              onPress={handleClose}
              className="flex-1"
            />
            <PrimaryButton
              text={buttonText}
              onPress={handleSubmit}
              loading={loading}
              disabled={!message.trim()}
              className="flex-1"
              iconName={isSubmit ? 'checkmark' : 'close'}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TaskSubmitModal; 