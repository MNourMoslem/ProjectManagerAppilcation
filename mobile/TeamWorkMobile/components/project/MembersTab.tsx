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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProjectStore, ProjectMember } from '../../store/projectStore';
import MemberCard from '../members/MemberCard';
import MemberForm, { MemberFormData } from '../forms/MemberForm';

interface MembersTabProps {
  projectId: string;
}

const MembersTab: React.FC<MembersTabProps> = ({ projectId }) => {
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loadingText}>Loading members...</Text>
      </View>
    );
  }

  if (membersError) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text style={styles.errorText}>Failed to load members</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchProjectMembers(projectId)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Add Member button */}
      <View style={styles.header}>
        <Text style={styles.title}>Project Members</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>Add Member</Text>
        </TouchableOpacity>
      </View>

      {/* Members count */}
      <Text style={styles.membersCount}>
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
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color="#9ca3af" />
          <Text style={styles.emptyTitle}>No members yet</Text>
          <Text style={styles.emptyText}>
            Start by adding members to your project
          </Text>
          <TouchableOpacity
            style={styles.emptyAddButton}
            onPress={() => setIsAddModalVisible(true)}
          >
            <Text style={styles.emptyAddButtonText}>Add First Member</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add Member Modal */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Member</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsAddModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#6b7280" />
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
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
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
    color: '#ef4444',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#000000',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  membersCount: {
    padding: 16,
    fontSize: 14,
    color: '#6b7280',
    backgroundColor: '#ffffff',
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
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyAddButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyAddButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
});

export default MembersTab; 