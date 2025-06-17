import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProjectMember } from '../../store/projectStore';

interface MemberCardProps {
  member: ProjectMember;
  onRemove?: (memberId: string) => void;
  canRemove?: boolean;
  isOwner?: boolean;
}

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  onRemove,
  canRemove = false,
  isOwner = false,
}) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return '#dc2626'; // red
      case 'admin':
        return '#7c3aed'; // purple
      case 'member':
        return '#059669'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Owner';
      case 'admin':
        return 'Admin';
      case 'member':
        return 'Member';
      default:
        return role;
    }
  };

  console.log("member:", member);

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {member?.name?.charAt(0).toUpperCase() || 'U'}
        </Text>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.name}>{member?.name}</Text>
        <Text style={styles.email}>{member?.email}</Text>
        <View style={styles.roleContainer}>
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor(member.role) }]}>
            <Text style={styles.roleText}>{getRoleLabel(member.role)}</Text>
          </View>
          {isOwner && (
            <View style={styles.ownerBadge}>
              <Text style={styles.ownerText}>You</Text>
            </View>
          )}
        </View>
      </View>
      
      {canRemove && onRemove && member.role !== 'owner' && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(member._id)}
        >
          <Ionicons name="trash-outline" size={18} color="#ef4444" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  ownerBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  ownerText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6b7280',
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default MemberCard; 