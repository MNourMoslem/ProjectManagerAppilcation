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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProjectStore, Task, ProjectMember } from '../../store/projectStore';
import TaskCard, { Task as TaskCardTask } from '../tasks/TaskCard';
import TaskForm, { TaskFormData } from '../forms/TaskForm';
import { Picker } from '@react-native-picker/picker';

interface TasksTabProps {
  projectId: string;
}

type TaskStatus = 'all' | 'todo' | 'in-progress' | 'done' | 'cancelled';
type TaskPriority = 'all' | 'no-priority' | 'low' | 'medium' | 'high' | 'urgent';

const TasksTab: React.FC<TasksTabProps> = ({ projectId }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const {
    tasks,
    members,
    fetchProjectTasks,
    fetchProjectMembers,
    createTask,
    updateTask,
    deleteTask,
    tasksLoading,
    tasksError,
  } = useProjectStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    fetchProjectTasks(projectId);
    fetchProjectMembers(projectId);
  }, [projectId, fetchProjectTasks, fetchProjectMembers]);

  const handleCreateTask = async (taskData: TaskFormData) => {
    try {
      await createTask({
        ...taskData,
        projectId,
        status: 'todo',
      });
      setShowCreateModal(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData: TaskFormData) => {
    if (!editingTask) return;
    
    try {
      await updateTask(editingTask._id, {
        ...taskData,
        projectId,
      });
      setEditingTask(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(taskId);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  // Convert store Task to TaskCard Task format
  const convertTaskToCardFormat = (task: Task): TaskCardTask => {
    return {
      _id: task._id,
      title: task.title,
      description: task.description,
      status: task.status === 'cancelled' ? 'todo' : task.status,
      priority: task.priority,
      dueDate: task.dueDate || null,
      assignedTo: task.assignedTo ? [task.assignedTo] : [],
      tags: [], // Store doesn't have tags yet
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    };
  };

  const filteredTasks = tasks
    .filter(task => {
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      return matchesStatus && matchesPriority;
    })
    .map(convertTaskToCardFormat);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priority' },
    { value: 'no-priority', label: 'No Priority' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  // Convert ProjectMember to User format for TaskForm
  const membersForForm = members.map(member => ({
    _id: member._id,
    name: member.name,
    email: member.email,
    avatar: undefined,
  }));

  if (tasksLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.loadingText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
          Loading tasks...
        </Text>
      </View>
    );
  }

  if (tasksError) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.errorText, { color: '#ef4444' }]}>
          Error loading tasks: {tasksError}
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: isDark ? '#374151' : '#f3f4f6' }]}
          onPress={() => fetchProjectTasks(projectId)}
        >
          <Text style={[styles.retryButtonText, { color: isDark ? '#f9fafb' : '#374151' }]}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#f9fafb' }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#f9fafb' : '#111827' }]}>
          Tasks ({filteredTasks.length})
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: isDark ? '#6366f1' : '#6366f1' }]}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={[styles.filterGroup, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
          <Text style={[styles.filterLabel, { color: isDark ? '#d1d5db' : '#374151' }]}>
            Status
          </Text>
          <View style={[styles.pickerContainer, { borderColor: isDark ? '#374151' : '#d1d5db' }]}>
            <Picker
              selectedValue={statusFilter}
              onValueChange={setStatusFilter}
              style={[
                styles.picker,
                { 
                  color: isDark ? '#f9fafb' : '#111827',
                  backgroundColor: isDark ? '#374151' : '#ffffff',
                },
              ]}
              itemStyle={{
                color: isDark ? '#f9fafb' : '#111827',
                backgroundColor: isDark ? '#374151' : '#ffffff',
              }}
            >
              {statusOptions.map(option => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={[styles.filterGroup, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
          <Text style={[styles.filterLabel, { color: isDark ? '#d1d5db' : '#374151' }]}>
            Priority
          </Text>
          <View style={[styles.pickerContainer, { borderColor: isDark ? '#374151' : '#d1d5db' }]}>
            <Picker
              selectedValue={priorityFilter}
              onValueChange={setPriorityFilter}
              style={[
                styles.picker,
                { 
                  color: isDark ? '#f9fafb' : '#111827',
                  backgroundColor: isDark ? '#374151' : '#ffffff',
                },
              ]}
              itemStyle={{
                color: isDark ? '#f9fafb' : '#111827',
                backgroundColor: isDark ? '#374151' : '#ffffff',
              }}
            >
              {priorityOptions.map(option => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Tasks List */}
      <ScrollView style={styles.tasksList} showsVerticalScrollIndicator={false}>
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="checkmark-circle-outline"
              size={48}
              color={isDark ? '#6b7280' : '#9ca3af'}
            />
            <Text style={[styles.emptyText, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
              No tasks found
            </Text>
            <Text style={[styles.emptySubtext, { color: isDark ? '#6b7280' : '#9ca3af' }]}>
              Create your first task to get started
            </Text>
          </View>
        ) : (
          filteredTasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={() => setEditingTask(tasks.find(t => t._id === task._id) || null)}
              onDelete={() => handleDeleteTask(task._id)}
            />
          ))
        )}
      </ScrollView>

      {/* Create Task Modal */}
      {showCreateModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#f9fafb' : '#111827' }]}>
                Create New Task
              </Text>
              <TouchableOpacity
                onPress={() => setShowCreateModal(false)}
                style={styles.closeButton}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={isDark ? '#9ca3af' : '#6b7280'}
                />
              </TouchableOpacity>
            </View>
            <TaskForm
              projectId={projectId}
              members={membersForForm}
              onSubmit={handleCreateTask}
            />
          </View>
        </View>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: isDark ? '#1f2937' : '#ffffff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? '#f9fafb' : '#111827' }]}>
                Edit Task
              </Text>
              <TouchableOpacity
                onPress={() => setEditingTask(null)}
                style={styles.closeButton}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={isDark ? '#9ca3af' : '#6b7280'}
                />
              </TouchableOpacity>
            </View>
            <TaskForm
              projectId={projectId}
              members={membersForForm}
              initialData={{
                title: editingTask.title,
                description: editingTask.description,
                priority: editingTask.priority,
                dueDate: editingTask.dueDate || null,
                assignedTo: editingTask.assignedTo ? [editingTask.assignedTo._id] : [],
                tags: [], // Store doesn't have tags yet
              }}
              onSubmit={handleUpdateTask}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterGroup: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
  },
  tasksList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  loadingText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    width: '90%',
    maxHeight: '90%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
});

export default TasksTab; 