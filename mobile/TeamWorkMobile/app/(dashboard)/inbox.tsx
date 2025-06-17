import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import MailCard from '../../components/mail/MailCard';
import MailDetailModal from '../../components/mail/MailDetailModal';
import FilterModal from '../../components/mail/FilterModal';
import { Mail } from '@/interfaces/interfaces';
import { mailAPI } from '../../api/projectApi';

export default function InboxScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // State
  const [mails, setMails] = useState<Mail[]>([]);
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [filterType, setFilterType] = useState('all');
  const [sortType, setSortType] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showMailDetail, setShowMailDetail] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch mails from API
  const fetchMails = async () => {
    try {
      setLoading(true);
      
      // Fetch mails based on active tab
      const response = activeTab === 'received' 
        ? await mailAPI.getReceived()
        : await mailAPI.getSent();
      
      if (response.success) {
        setMails(response.mails || []);
        
        // Calculate unread count for received mails
        if (activeTab === 'received') {
          const unread = (response.mails || []).filter((mail: Mail) => !mail.read).length;
          setUnreadCount(unread);
        }
      } else {
        Alert.alert('Error', response.message || 'Failed to fetch mails');
      }
    } catch (error) {
      console.error('Error fetching mails:', error);
      Alert.alert('Error', 'Failed to fetch mails. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh mail list
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMails();
    setRefreshing(false);
  };

  // Mark mail as read
  const handleMarkAsRead = async (mailId: string) => {
    try {
      const response = await mailAPI.markAsRead(mailId);
      
      if (response.success) {
        // Update local state
        setMails(prevMails =>
          prevMails.map(mail =>
            mail._id === mailId ? { ...mail, read: true } : mail
          )
        );
        
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
        
        // Close detail modal
        setShowMailDetail(false);
        setSelectedMail(null);
      } else {
        Alert.alert('Error', response.message || 'Failed to mark mail as read');
      }
    } catch (error) {
      console.error('Error marking mail as read:', error);
      Alert.alert('Error', 'Failed to mark mail as read');
    }
  };

  // Handle mail click
  const handleMailPress = async (mail: Mail) => {
    setSelectedMail(mail);
    setShowMailDetail(true);
    
    // Mark as read if unread and it's a received mail
    if (!mail.read && activeTab === 'received') {
      await handleMarkAsRead(mail._id);
    }
  };

  // Handle accept invite
  const handleAcceptInvite = async (mailId: string) => {
    try {
      const response = await mailAPI.acceptInvite(mailId);
      
      if (response.success) {
        // Update local state
        setMails(prevMails =>
          prevMails.map(mail =>
            mail._id === mailId ? { ...mail, status: 'accepted' } : mail
          )
        );
        
        // Close detail modal
        setShowMailDetail(false);
        setSelectedMail(null);
        
        Alert.alert('Success', 'Invitation accepted successfully');
      } else {
        Alert.alert('Error', response.message || 'Failed to accept invitation');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      Alert.alert('Error', 'Failed to accept invitation');
    }
  };

  // Handle decline invite
  const handleDeclineInvite = async (mailId: string) => {
    try {
      const response = await mailAPI.declineInvite(mailId);
      
      if (response.success) {
        // Update local state
        setMails(prevMails =>
          prevMails.map(mail =>
            mail._id === mailId ? { ...mail, status: 'declined' } : mail
          )
        );
        
        // Close detail modal
        setShowMailDetail(false);
        setSelectedMail(null);
        
        Alert.alert('Success', 'Invitation declined');
      } else {
        Alert.alert('Error', response.message || 'Failed to decline invitation');
      }
    } catch (error) {
      console.error('Error declining invitation:', error);
      Alert.alert('Error', 'Failed to decline invitation');
    }
  };

  // Handle delete mail
  const handleDeleteMail = async (mailId: string) => {
    try {
      const response = await mailAPI.delete(mailId);
      
      if (response.success) {
        // Update local state
        setMails(prevMails => prevMails.filter(mail => mail._id !== mailId));
        
        // Update unread count if mail was unread
        const deletedMail = mails.find(mail => mail._id === mailId);
        if (deletedMail && !deletedMail.read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        
        // Close detail modal
        setShowMailDetail(false);
        setSelectedMail(null);
        
        Alert.alert('Success', 'Mail deleted successfully');
      } else {
        Alert.alert('Error', response.message || 'Failed to delete mail');
      }
    } catch (error) {
      console.error('Error deleting mail:', error);
      Alert.alert('Error', 'Failed to delete mail');
    }
  };

  // Apply filters and sorting
  const handleApplyFilter = (newFilterType: string, newSortType: string) => {
    setFilterType(newFilterType);
    setSortType(newSortType);
  };

  // Filter and sort mails
  const getFilteredAndSortedMails = () => {
    let filteredMails = [...mails];

    // Apply filter
    switch (filterType) {
      case 'unread':
        filteredMails = filteredMails.filter(mail => !mail.read);
        break;
      case 'invitations':
        filteredMails = filteredMails.filter(mail => mail.type === 'invite');
        break;
      case 'notifications':
        filteredMails = filteredMails.filter(mail => mail.type === 'notification');
        break;
      case 'messages':
        filteredMails = filteredMails.filter(mail => mail.type === 'custom');
        break;
      default:
        break;
    }

    // Apply sorting
    switch (sortType) {
      case 'newest':
        filteredMails.sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime());
        break;
      case 'oldest':
        filteredMails.sort((a, b) => new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime());
        break;
      case 'sender':
        filteredMails.sort((a, b) => a.sender.name.localeCompare(b.sender.name));
        break;
      case 'subject':
        filteredMails.sort((a, b) => a.subject.localeCompare(b.subject));
        break;
      default:
        break;
    }

    return filteredMails;
  };

  // Load mails on mount and when tab changes
  useEffect(() => {
    fetchMails();
  }, [activeTab]);

  const filteredMails = getFilteredAndSortedMails();

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-4 text-gray-600 dark:text-gray-400">Loading mails...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color={isDark ? '#ffffff' : '#000000'} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black dark:text-white">Inbox</Text>
        <View className="flex-row items-center space-x-2">
          {unreadCount > 0 && activeTab === 'received' && (
            <View className="bg-red-500 rounded-full px-2 py-1">
              <Text className="text-white text-xs font-bold">{unreadCount}</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => setShowFilterModal(true)}
            className="p-2"
            activeOpacity={0.7}
          >
            <Ionicons name="filter" size={20} color={isDark ? '#ffffff' : '#000000'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row border-b border-gray-200 dark:border-gray-700">
        <TouchableOpacity
          onPress={() => setActiveTab('received')}
          className={`flex-1 py-3 items-center ${
            activeTab === 'received'
              ? 'border-b-2 border-blue-500'
              : ''
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`font-medium ${
              activeTab === 'received'
                ? 'text-blue-500'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Received
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('sent')}
          className={`flex-1 py-3 items-center ${
            activeTab === 'sent'
              ? 'border-b-2 border-blue-500'
              : ''
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`font-medium ${
              activeTab === 'sent'
                ? 'text-blue-500'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Sent
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mail List */}
      <FlatList
        data={filteredMails}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <MailCard
            mail={item}
            onPress={() => handleMailPress(item)}
            onMarkAsRead={() => handleMarkAsRead(item._id)}
            onAcceptInvite={() => handleAcceptInvite(item._id)}
            onDeclineInvite={() => handleDeclineInvite(item._id)}
            onDelete={() => handleDeleteMail(item._id)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="mail-open" size={64} color="#9ca3af" />
            <Text className="text-gray-500 dark:text-gray-400 text-lg mt-4">
              No mails found
            </Text>
            <Text className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              {activeTab === 'received' ? 'No received mails' : 'No sent mails'}
            </Text>
          </View>
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />

      {/* Mail Detail Modal */}
      <MailDetailModal
        visible={showMailDetail}
        mail={selectedMail}
        onClose={() => {
          setShowMailDetail(false);
          setSelectedMail(null);
        }}
        onMarkAsRead={handleMarkAsRead}
        onAcceptInvite={handleAcceptInvite}
        onDeclineInvite={handleDeclineInvite}
        onDelete={handleDeleteMail}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterType={filterType}
        sortType={sortType}
        onApplyFilter={handleApplyFilter}
      />
    </SafeAreaView>
  );
} 