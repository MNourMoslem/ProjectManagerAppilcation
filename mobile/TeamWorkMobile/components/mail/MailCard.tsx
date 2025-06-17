import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { Mail } from '../../interfaces/interfaces';

interface MailCardProps {
  mail: Mail;
  onPress: () => void;
  onMarkAsRead?: () => void;
  onAcceptInvite?: () => void;
  onDeclineInvite?: () => void;
  onDelete?: () => void;
  isSelected?: boolean;
}

const MailCard: React.FC<MailCardProps> = ({
  mail,
  onPress,
  onMarkAsRead,
  onAcceptInvite,
  onDeclineInvite,
  onDelete,
  isSelected = false
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getMailIcon = (type: string) => {
    switch (type) {
      case 'invite':
        return 'mail-unread';
      case 'custom':
        return 'mail';
      case 'notification':
        return 'notifications';
      case 'reminder':
        return 'time';
      case 'welcome':
        return 'person-add';
      default:
        return 'mail';
    }
  };

  const getMailIconColor = (type: string) => {
    switch (type) {
      case 'invite':
        return '#3b82f6'; // blue
      case 'custom':
        return '#6b7280'; // gray
      case 'notification':
        return '#f59e0b'; // amber
      case 'reminder':
        return '#ef4444'; // red
      case 'welcome':
        return '#10b981'; // green
      default:
        return '#6b7280';
    }
  };

  const getStatusBadge = () => {
    if (mail.type === 'invite') {
      if (mail.status === 'accepted') {
        return (
          <View className="bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
            <Text className="text-green-700 dark:text-green-400 text-xs font-medium">
              Accepted
            </Text>
          </View>
        );
      } else if (mail.status === 'declined') {
        return (
          <View className="bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded-full">
            <Text className="text-red-700 dark:text-red-400 text-xs font-medium">
              Declined
            </Text>
          </View>
        );
      }
    }
    return null;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`p-4 border-b border-gray-200 dark:border-gray-700 ${
        isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      } ${!mail.read ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start">
        {/* Mail Icon */}
        <View className="mt-1 mr-3">
          <Ionicons 
            name={getMailIcon(mail.type) as any} 
            size={20} 
            color={getMailIconColor(mail.type)} 
          />
        </View>

        {/* Mail Content */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text 
              className={`text-sm font-medium ${
                !mail.read 
                  ? 'text-black dark:text-white font-semibold' 
                  : 'text-gray-900 dark:text-gray-100'
              }`}
              numberOfLines={1}
            >
              {mail.sender.name}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(mail.createdAt || "").toLocaleString()}
            </Text>
          </View>

          <Text 
            className={`text-sm mb-1 ${
              !mail.read 
                ? 'text-black dark:text-white font-semibold' 
                : 'text-gray-900 dark:text-gray-100'
            }`}
            numberOfLines={1}
          >
            {mail.subject}
          </Text>

          <Text 
            className="text-sm text-gray-600 dark:text-gray-400 mb-2"
            numberOfLines={2}
          >
            {mail.body}
          </Text>

          {/* Status Badge and Actions */}
          <View className="flex-row items-center justify-between">
            {getStatusBadge()}
            
            <View className="flex-row items-center">
              {/* Mark as Read Button */}
              {!mail.read && onMarkAsRead && (
                <TouchableOpacity
                  onPress={onMarkAsRead}
                  className="p-1 mr-2"
                  activeOpacity={0.7}
                >
                  <Ionicons name="checkmark-circle-outline" size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
                </TouchableOpacity>
              )}

              {/* Invitation Actions */}
              {mail.type === 'invite' && mail.status === 'pending' && (
                <>
                  <TouchableOpacity
                    onPress={onAcceptInvite}
                    className="bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded mr-2"
                    activeOpacity={0.7}
                  >
                    <Text className="text-green-700 dark:text-green-400 text-xs font-medium">
                      Accept
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onDeclineInvite}
                    className="bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded mr-2"
                    activeOpacity={0.7}
                  >
                    <Text className="text-red-700 dark:text-red-400 text-xs font-medium">
                      Decline
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Delete Button */}
              {onDelete && (
                <TouchableOpacity
                  onPress={onDelete}
                  className="p-1"
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View className="flex-row items-center mt-2">
            <View className="bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded-full mr-2">
              <Text className="text-blue-800 dark:text-blue-200 text-xs font-medium">
                {mail.type}
              </Text>
            </View>
            <Text className="text-gray-500 dark:text-gray-400 text-xs">
              {mail.sender.email}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MailCard; 