import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface MemberSelectionProps {
  members: User[];
  selectedMemberIds: string[];
  onMemberSelectionChange: (selectedIds: string[]) => void;
  disabled?: boolean;
}

const MemberSelection: React.FC<MemberSelectionProps> = ({
  members,
  selectedMemberIds,
  onMemberSelectionChange,
  disabled = false,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSelectMember = (memberId: string, selected: boolean) => {
    if (selected) {
      // Add member to selection
      onMemberSelectionChange([...selectedMemberIds, memberId]);
    } else {
      // Remove member from selection
      onMemberSelectionChange(selectedMemberIds.filter(id => id !== memberId));
    }
  };

  const getSelectedMemberNames = () => {
    if (selectedMemberIds.length === 0) return 'Unassigned';
    if (selectedMemberIds.length === 1) {
      const member = members.find(m => m._id === selectedMemberIds[0]);
      return member ? member.name : 'Unknown User';
    }
    return `${selectedMemberIds.length} members selected`;
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.selectionContainer,
        {
          backgroundColor: isDark ? '#374151' : '#ffffff',
          borderColor: isDark ? '#4b5563' : '#d1d5db',
        },
      ]}>
        <Text style={[
          styles.selectionText,
          { color: isDark ? '#f9fafb' : '#111827' },
        ]}>
          {getSelectedMemberNames()}
        </Text>
        <Ionicons 
          name="chevron-down" 
          size={16} 
          color={isDark ? '#9ca3af' : '#6b7280'} 
        />
      </View>

      <View style={[
        styles.membersContainer,
        {
          backgroundColor: isDark ? '#374151' : '#ffffff',
          borderColor: isDark ? '#4b5563' : '#d1d5db',
        },
      ]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Unassigned option */}
          <TouchableOpacity
            style={[
              styles.memberItem,
              selectedMemberIds.length === 0 && {
                backgroundColor: isDark ? '#ffffff' : '#000000',
              },
            ]}
            onPress={() => {
              onMemberSelectionChange([]);
            }}
            disabled={disabled}
          >
            <View style={styles.memberInfo}>
              <View style={[
                styles.memberAvatar,
                { backgroundColor: isDark ? '#6b7280' : '#9ca3af' },
              ]}>
                <Text style={styles.memberAvatarText}>U</Text>
              </View>
              <View style={styles.memberDetails}>
                <Text style={[
                  styles.memberName,
                  selectedMemberIds.length === 0 && {
                    color: isDark ? '#000000' : '#ffffff',
                  },
                  { color: isDark ? '#d1d5db' : '#374151' },
                ]}>
                  Unassigned
                </Text>
                <Text style={[
                  styles.memberEmail,
                  selectedMemberIds.length === 0 && {
                    color: isDark ? '#000000' : '#ffffff',
                  },
                  { color: isDark ? '#9ca3af' : '#6b7280' },
                ]}>
                  No one assigned
                </Text>
              </View>
            </View>
            {selectedMemberIds.length === 0 && (
              <Ionicons 
                name="checkmark" 
                size={16} 
                color={isDark ? '#000000' : '#ffffff'} 
              />
            )}
          </TouchableOpacity>

          {/* Member options */}
          {members.map(member => {
            const isSelected = selectedMemberIds.includes(member._id);
            return (
              <TouchableOpacity
                key={member._id}
                style={[
                  styles.memberItem,
                  isSelected && {
                    backgroundColor: isDark ? '#ffffff' : '#000000',
                  },
                ]}
                onPress={() => handleSelectMember(member._id, !isSelected)}
                disabled={disabled}
              >
                <View style={styles.memberInfo}>
                  <View style={[
                    styles.memberAvatar,
                    { backgroundColor: isDark ? '#6366f1' : '#6366f1' },
                  ]}>
                    <Text style={styles.memberAvatarText}>
                      {member.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.memberDetails}>
                    <Text style={[
                      styles.memberName,
                      isSelected && {
                        color: isDark ? '#000000' : '#ffffff',
                      },
                      { color: isDark ? '#d1d5db' : '#374151' },
                    ]}>
                      {member.name}
                    </Text>
                    <Text style={[
                      styles.memberEmail,
                      isSelected && {
                        color: isDark ? '#000000' : '#ffffff',
                      },
                      { color: isDark ? '#9ca3af' : '#6b7280' },
                    ]}>
                      {member.email}
                    </Text>
                  </View>
                </View>
                {isSelected && (
                  <Ionicons 
                    name="checkmark" 
                    size={16} 
                    color={isDark ? '#000000' : '#ffffff'} 
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {members.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={[
              styles.emptyText,
              { color: isDark ? '#9ca3af' : '#6b7280' },
            ]}>
              No members available to assign
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  selectionText: {
    fontSize: 16,
  },
  membersContainer: {
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
  },
  scrollView: {
    maxHeight: 200,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberAvatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '500',
  },
  memberEmail: {
    fontSize: 12,
    marginTop: 1,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default MemberSelection; 