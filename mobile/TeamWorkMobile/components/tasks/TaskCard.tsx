import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {User, Task} from "@/interfaces/interfaces"

interface TaskCardProps {
  task: Task;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (status: Task['status']) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#ef4444';
      case 'high':
        return '#f97316';
      case 'medium':
        return '#eab308';
      case 'low':
        return '#22c55e';
      default:
        return isDark ? '#6b7280' : '#9ca3af';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return '#22c55e';
      case 'review':
        return '#3b82f6';
      case 'in-progress':
        return '#f97316';
      case 'todo':
      default:
        return isDark ? '#6b7280' : '#9ca3af';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in-progress':
        return 'In Progress';
      case 'review':
        return 'Review';
      case 'done':
        return 'Done';
      default:
        return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'no-priority':
        return 'No Priority';
      case 'low':
        return 'Low';
      case 'medium':
        return 'Medium';
      case 'high':
        return 'High';
      case 'urgent':
        return 'Urgent';
      default:
        return priority;
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    const now = new Date();
    const taskDate = new Date(date);
    const diffTime = taskDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Overdue', color: '#ef4444' };
    } else if (diffDays === 0) {
      return { text: 'Due today', color: '#f97316' };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', color: '#eab308' };
    } else if (diffDays <= 7) {
      return { text: `Due in ${diffDays} days`, color: '#22c55e' };
    } else {
      return { text: taskDate.toLocaleDateString(), color: isDark ? '#9ca3af' : '#6b7280' };
    }
  };

  const dateInfo = formatDate(task.dueDate || null);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          borderColor: isDark ? '#374151' : '#e5e7eb',
        },
      ]}
      onPress={onPress}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              { color: isDark ? '#f9fafb' : '#111827' },
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>
        </View>
        
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onEdit}
            >
              <Ionicons
                name="pencil"
                size={16}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onDelete}
            >
              <Ionicons
                name="trash"
                size={16}
                color={isDark ? '#9ca3af' : '#6b7280'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Description */}
      {task.description && (
        <Text
          style={[
            styles.description,
            { color: isDark ? '#d1d5db' : '#6b7280' },
          ]}
          numberOfLines={2}
        >
          {task.description}
        </Text>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {task.tags.slice(0, 3).map((tag: string, index: number) => (
            <View
              key={index}
              style={[
                styles.tag,
                {
                  backgroundColor: isDark ? '#374151' : '#f3f4f6',
                },
              ]}
            >
              <Text
                style={[
                  styles.tagText,
                  { color: isDark ? '#d1d5db' : '#374151' },
                ]}
              >
                {tag}
              </Text>
            </View>
          ))}
          {task.tags.length > 3 && (
            <Text
              style={[
                styles.moreTags,
                { color: isDark ? '#9ca3af' : '#6b7280' },
              ]}
            >
              +{task.tags.length - 3}
            </Text>
          )}
        </View>
      )}

      {/* Status and Priority */}
      <View style={styles.metaRow}>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(task.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusLabel(task.status)}
            </Text>
          </View>
        </View>

        <View style={styles.priorityContainer}>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(task.priority) },
            ]}
          >
            <Text style={styles.priorityText}>
              {getPriorityLabel(task.priority)}
            </Text>
          </View>
        </View>
      </View>

      {/* Assigned Members */}
      {task.assignedTo && task.assignedTo.length > 0 && (
        <View style={styles.membersContainer}>
          <Text
            style={[
              styles.membersLabel,
              { color: isDark ? '#9ca3af' : '#6b7280' },
            ]}
          >
            Assigned to:
          </Text>
          <View style={styles.membersList}>
            {task.assignedTo.map((member: User, index: number) => {
              return (
                <View
                  key={index}
                  style={[
                    styles.memberAvatar,
                    { backgroundColor: isDark ? '#6366f1' : '#6366f1' },
                  ]}
                >
                  <Text style={styles.memberAvatarText}>
                    {member?.name?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
            )})}
            {task.assignedTo.length > 3 && (
              <Text
                style={[
                  styles.moreMembers,
                  { color: isDark ? '#9ca3af' : '#6b7280' },
                ]}
              >
                +{task.assignedTo.length - 3}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Due Date */}
      {dateInfo && (
        <View style={styles.dateContainer}>
          <Ionicons
            name="calendar-outline"
            size={14}
            color={dateInfo.color}
          />
          <Text
            style={[
              styles.dateText,
              { color: dateInfo.color },
            ]}
          >
            {dateInfo.text}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreTags: {
    fontSize: 12,
    fontWeight: '500',
    alignSelf: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusContainer: {
    flex: 1,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  priorityContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  membersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  membersLabel: {
    fontSize: 12,
    marginRight: 8,
  },
  membersList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  memberAvatarText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  moreMembers: {
    fontSize: 12,
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default TaskCard; 