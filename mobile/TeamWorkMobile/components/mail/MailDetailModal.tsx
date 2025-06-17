import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Mail } from '@/interfaces/interfaces';

interface MailDetailModalProps {
  visible: boolean;
  mail: Mail | null;
  onClose: () => void;
  onMarkAsRead: (mailId: string) => void;
  onAcceptInvite: (mailId: string) => void;
  onDeclineInvite: (mailId: string) => void;
  onDelete: (mailId: string) => void;
}

export default function MailDetailModal({
  visible,
  mail,
  onClose,
  onMarkAsRead,
  onAcceptInvite,
  onDeclineInvite,
  onDelete,
}: MailDetailModalProps) {
  if (!mail) return null;

  const handleMarkAsRead = () => {
    if (!mail.read) {
      onMarkAsRead(mail._id);
    }
  };

  const handleAcceptInvite = () => {
    Alert.alert(
      'Accept Invitation',
      'Are you sure you want to accept this invitation?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Accept', onPress: () => onAcceptInvite(mail._id) },
      ]
    );
  };

  const handleDeclineInvite = () => {
    Alert.alert(
      'Decline Invitation',
      'Are you sure you want to decline this invitation?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Decline', onPress: () => onDeclineInvite(mail._id) },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Mail',
      'Are you sure you want to delete this mail?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(mail._id) },
      ]
    );
  };

  const getMailIcon = () => {
    switch (mail.type) {
      case 'invite':
        return 'mail-open';
      case 'notification':
        return 'notifications';
      case 'custom':
        return 'chatbubble';
      default:
        return 'mail';
    }
  };

  const getStatusColor = () => {
    switch (mail.status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
            Mail Details
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Mail Header */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <View className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full items-center justify-center mr-3">
                <Ionicons name={getMailIcon()} size={24} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-black dark:text-white mb-1">
                  {mail.subject}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  From: {mail.sender.name}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(mail.createdAt || "").toLocaleString()}
              </Text>
              {mail.status && (
                <View className={`px-3 py-1 rounded-full ${getStatusColor()}`}>
                  <Text className="text-xs font-medium capitalize">
                    {mail.status}
                  </Text>
                </View>
              )}
            </View>

            {!mail.read && (
              <View className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                <Text className="text-sm text-blue-800 dark:text-blue-200">
                  This is an unread message
                </Text>
              </View>
            )}
          </View>

          {/* Mail Content */}
          <View className="mb-6">
            <Text className="text-base text-black dark:text-white leading-6">
              {mail.body}
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="space-y-3">
            {!mail.read && (
              <TouchableOpacity
                onPress={handleMarkAsRead}
                className="flex-row items-center justify-center p-3 bg-blue-500 rounded-lg"
                activeOpacity={0.7}
              >
                <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                <Text className="text-white font-medium ml-2">Mark as Read</Text>
              </TouchableOpacity>
            )}

            {mail.type === 'invite' && mail.status === 'pending' && (
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={handleAcceptInvite}
                  className="flex-1 flex-row items-center justify-center p-3 bg-green-500 rounded-lg"
                  activeOpacity={0.7}
                >
                  <Ionicons name="checkmark" size={20} color="#ffffff" />
                  <Text className="text-white font-medium ml-2">Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDeclineInvite}
                  className="flex-1 flex-row items-center justify-center p-3 bg-red-500 rounded-lg"
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={20} color="#ffffff" />
                  <Text className="text-white font-medium ml-2">Decline</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={handleDelete}
              className="flex-row items-center justify-center p-3 bg-red-500 rounded-lg"
              activeOpacity={0.7}
            >
              <Ionicons name="trash" size={20} color="#ffffff" />
              <Text className="text-white font-medium ml-2">Delete Mail</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
} 