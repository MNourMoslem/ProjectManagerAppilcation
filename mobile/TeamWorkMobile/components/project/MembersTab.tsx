import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProjectStore } from '../../store/projectStore';
import  { ProjectMember } from "@/interfaces/interfaces"
import MemberCard from '../members/MemberCard';
import MemberForm, { MemberFormData } from '../forms/MemberForm';

interface MembersTabProps {
  projectId: string;
}

const MembersTab: React.FC<MembersTabProps> = ({ projectId }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const {
    members,
    membersLoading,
    membersError,
    fetchProjectMembers,
    removeProjectMember,
    inviteUserToProject,
  } = useProjectStore();

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProjectMembers(projectId);
  }, [projectId]);

  const handleAddMember = async (data: MemberFormData) => {
    setIsSubmitting(true);
    try {
      await inviteUserToProject(projectId, data.email, data.role);
      setIsAddModalVisible(false);
      // Refresh members list
      fetchProjectMembers(projectId);
    } catch (error) {
      Alert.alert('Error', 'Failed to invite member. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    Alert.alert(
      'Remove Member',
      'Are you sure you want to remove this member from the project?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeProjectMember(projectId, memberId);
              // Refresh members list
              fetchProjectMembers(projectId);
            } catch (error) {
              Alert.alert('Error', 'Failed to remove member. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderMember = ({ item }: { item: ProjectMember }) => (
    <MemberCard
      member={item}
      onRemove={handleRemoveMember}
      canRemove={true} // You might want to check user permissions here
      isOwner={item.role === 'owner'}
    />
  );

  if (membersLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#1f2937' : '#f9fafb' }]}>
        <ActivityIndicator size="large" color={isDark ? '#ffffff' : '#000000'} />
        <Text style={[styles.loadingText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>Loading members...</Text>
      </View>
    );
  }

  if (membersError) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: isDark ? '#1f2937' : '#f9fafb' }]}>
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text style={[styles.errorText, { color: isDark ? '#fca5a5' : '#ef4444' }]}>Failed to load members</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: isDark ? '#ffffff' : '#000000' }]}
          onPress={() => fetchProjectMembers(projectId)}
        >
          <Text style={[styles.retryButtonText, { color: isDark ? '#000000' : '#ffffff' }]}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1f2937' : '#f9fafb' }]}>
      {/* Header with Add Member button */}
      <View style={[styles.header, { 
        backgroundColor: isDark ? '#374151' : '#ffffff',
        borderBottomColor: isDark ? '#4b5563' : '#e5e7eb'
      }]}>
        <Text style={[styles.title, { color: isDark ? '#f9fafb' : '#111827' }]}>Project Members</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: isDark ? '#ffffff' : '#000000' }]}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Ionicons name="add" size={20} color={isDark ? '#000000' : '#ffffff'} />
          <Text style={[styles.addButtonText, { color: isDark ? '#000000' : '#ffffff' }]}>Add Member</Text>
        </TouchableOpacity>
      </View>

      {/* Members count */}
      <Text style={[styles.membersCount, { 
        color: isDark ? '#9ca3af' : '#6b7280',
        backgroundColor: isDark ? '#374151' : '#ffffff'
      }]}>
        {members.length} member{members.length !== 1 ? 's' : ''}
      </Text>

      {/* Members list */}
      {members.length > 0 ? (
        <FlatList
          data={members}
          renderItem={renderMember}
          keyExtractor={(item) => item._id}
          style={styles.membersList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={[styles.emptyContainer, { backgroundColor: isDark ? '#1f2937' : '#f9fafb' }]}>
          <Ionicons name="people-outline" size={64} color={isDark ? '#6b7280' : '#9ca3af'} />
          <Text style={[styles.emptyTitle, { color: isDark ? '#d1d5db' : '#374151' }]}>No members yet</Text>
          <Text style={[styles.emptyText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
            Start by adding members to your project
          </Text>
          <TouchableOpacity
            style={[styles.emptyAddButton, { backgroundColor: isDark ? '#ffffff' : '#000000' }]}
            onPress={() => setIsAddModalVisible(true)}
          >
            <Text style={[styles.emptyAddButtonText, { color: isDark ? '#000000' : '#ffffff' }]}>Add First Member</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add Member Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
          <View style={[styles.modalHeader, { 
            borderBottomColor: isDark ? '#4b5563' : '#e5e7eb'
          }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#f9fafb' : '#111827' }]}>Add Member</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsAddModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
          </View>
          
          <MemberForm
            onSubmit={handleAddMember}
            isSubmitting={isSubmitting}
            onCancel={() => setIsAddModalVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  membersCount: {
    padding: 16,
    fontSize: 14,
  },
  membersList: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyAddButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyAddButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
});

export default MembersTab; 