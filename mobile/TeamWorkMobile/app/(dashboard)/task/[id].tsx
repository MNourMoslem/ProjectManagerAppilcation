import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { useProjectStore } from '../../../store/projectStore';
import { Task, Comment, Issue } from '../../../interfaces/interfaces';
import { SecondaryButton, PrimaryButton } from '../../../components/buttons';

export default function TaskDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Project store
  const { 
    fetchTaskById,
    getTaskComments,
    getTaskIssues,
    changeTaskStatus,
    createComment,
    createIssue,
    updateIssueStatus,
    submitTask,
    rejectTask,
    startWorkingOnTask
  } = useProjectStore();
  
  // Local state
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Issue state
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueDescription, setNewIssueDescription] = useState('');
  const [isAddIssueModalOpen, setIsAddIssueModalOpen] = useState(false);
  const [isAddingIssue, setIsAddingIssue] = useState(false);

  // Submission state
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // Load task data
  useEffect(() => {
    if (id) {
      loadTaskData();
    }
  }, [id]);

  const loadTaskData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const taskData = await fetchTaskById(id);
      setTask(taskData);
      
      // Load comments and issues
      const [taskComments, taskIssues] = await Promise.all([
        getTaskComments(id),
        getTaskIssues(id)
      ]);
      
      setComments(taskComments);
      setIssues(taskIssues);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: Task['status']) => {
    if (!task) return;
    
    try {
      await changeTaskStatus(task._id, newStatus);
      setTask(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      Alert.alert('Error', 'Failed to update task status');
    }
  };

  const handleAddComment = async () => {
    if (!task || !newComment.trim()) return;
    
    try {
      setSubmittingComment(true);
      await createComment(task._id, newComment.trim());
      setNewComment('');
      // Reload comments
      const updatedComments = await getTaskComments(task._id);
      setComments(updatedComments);
    } catch (err) {
      Alert.alert('Error', 'Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleAddIssue = async () => {
    if (!task || !newIssueTitle.trim()) return;
    
    try {
      setIsAddingIssue(true);
      await createIssue(task._id, {
        title: newIssueTitle.trim(),
        description: newIssueDescription.trim()
      });
      setNewIssueTitle('');
      setNewIssueDescription('');
      setIsAddIssueModalOpen(false);
      // Reload issues
      const updatedIssues = await getTaskIssues(task._id);
      setIssues(updatedIssues);
    } catch (err) {
      Alert.alert('Error', 'Failed to create issue');
    } finally {
      setIsAddingIssue(false);
    }
  };

  const handleIssueStatusChange = async (issueId: string, status: 'open' | 'in-progress' | 'resolved' | 'closed') => {
    if (!task) return;
    
    try {
      await updateIssueStatus(task._id, issueId, status);
      // Reload issues
      const updatedIssues = await getTaskIssues(task._id);
      setIssues(updatedIssues);
    } catch (err) {
      Alert.alert('Error', 'Failed to update issue status');
    }
  };

  const handleStartWork = async () => {
    if (!task) return;
    
    try {
      await startWorkingOnTask(task._id);
      setTask(prev => prev ? { ...prev, status: 'in-progress' } : null);
    } catch (err) {
      Alert.alert('Error', 'Failed to start working on task');
    }
  };

  const handleSubmitTask = async () => {
    if (!task) return;
    
    try {
      setIsSubmitting(true);
      await submitTask(task._id, submissionMessage || 'Task completed');
      setTask(prev => prev ? { ...prev, status: 'done' } : null);
      setSubmissionMessage('');
      setIsSubmitModalOpen(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to submit task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectTask = async () => {
    if (!task) return;
    
    try {
      setIsSubmitting(true);
      await rejectTask(task._id, submissionMessage || 'Task rejected');
      setTask(prev => prev ? { ...prev, status: 'todo' } : null);
      setSubmissionMessage('');
      setIsRejectModalOpen(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to reject task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return '#22c55e';
      case 'in-progress':
        return '#f97316';
      case 'todo':
      default:
        return isDark ? '#6b7280' : '#9ca3af';
    }
  };

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in-progress':
        return 'In Progress';
      case 'done':
        return 'Done';
      case 'cancelled':
        return 'Cancelled';
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

  const getIssueStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#eab308';
      case 'in-progress':
        return '#3b82f6';
      case 'resolved':
        return '#22c55e';
      case 'closed':
        return '#6b7280';
      default:
        return isDark ? '#6b7280' : '#9ca3af';
    }
  };

  const getIssueStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'in-progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      case 'closed':
        return 'Closed';
      default:
        return status;
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-1 justify-center items-center">
          <Ionicons name="reload" size={32} color={isDark ? '#6b7280' : '#9ca3af'} />
          <Text className="text-gray-600 dark:text-gray-300 mt-2">
            Loading task...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !task) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle" size={48} color={isDark ? '#ef4444' : '#dc2626'} />
          <Text className="text-lg font-semibold text-black dark:text-white mt-4 text-center">
            Error Loading Task
          </Text>
          <Text className="text-gray-600 dark:text-gray-300 mt-2 text-center">
            {error || 'Task not found'}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 bg-black dark:bg-white px-6 py-3 rounded-lg"
          >
            <Text className="text-white dark:text-black font-semibold text-center">
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 -ml-2"
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#ffffff' : '#000000'} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black dark:text-white">
          Task Details
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Task Header */}
        <View className="px-6 py-6">
          <View className="flex-row items-start justify-between mb-4">
            <Text className="text-2xl font-bold text-black dark:text-white flex-1 mr-4">
              {task.title}
            </Text>
            <View className="flex-row items-center space-x-2">
              <View 
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: `${getStatusColor(task.status)}20` }}
              >
                <Text 
                  className="text-xs font-medium"
                  style={{ color: getStatusColor(task.status) }}
                >
                  {getStatusLabel(task.status)}
                </Text>
              </View>
              <View 
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: `${getPriorityColor(task.priority)}20` }}
              >
                <Text 
                  className="text-xs font-medium"
                  style={{ color: getPriorityColor(task.priority) }}
                >
                  {getPriorityLabel(task.priority)}
                </Text>
              </View>
            </View>
          </View>

          {task.description && (
            <Text className="text-gray-700 dark:text-gray-300 mb-4 leading-6">
              {task.description}
            </Text>
          )}

          {/* Task Meta */}
          <View className="space-y-3 mb-6">
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
              <Text className="text-gray-600 dark:text-gray-300 ml-2">
                Due: {formatDate(task.dueDate)}
              </Text>
            </View>
            
            {task.assignedTo && task.assignedTo.length > 0 && (
              <View className="flex-row items-center">
                <Ionicons name="people-outline" size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
                <Text className="text-gray-600 dark:text-gray-300 ml-2">
                  Assigned to: {task.assignedTo.map(user => user.name).join(', ')}
                </Text>
              </View>
            )}

            {task.tags && task.tags.length > 0 && (
              <View className="flex-row items-center flex-wrap">
                <Ionicons name="pricetag-outline" size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
                <View className="flex-row flex-wrap ml-2">
                  {task.tags.map((tag, index) => (
                    <View
                      key={index}
                      className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full mr-2 mb-1"
                    >
                      <Text className="text-xs text-gray-700 dark:text-gray-300">
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-3 mb-6">
            {task.status === 'todo' && (
              <PrimaryButton
                text="Start Work"
                onPress={handleStartWork}
                iconName="play"
              />
            )}
            
            {task.status === 'in-progress' && (
              <PrimaryButton
                text="Submit Task"
                onPress={() => setIsSubmitModalOpen(true)}
                iconName="checkmark"
              />
            )}

            {task.status === 'in-progress' && (
              <SecondaryButton
                text="Reject Task"
                onPress={() => setIsRejectModalOpen(true)}
                iconName="close"
              />
            )}

            <SecondaryButton
              text="Change Status"
              onPress={() => {
                Alert.alert(
                  'Change Status',
                  'Select new status:',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'To Do', onPress: () => handleStatusChange('todo') },
                    { text: 'In Progress', onPress: () => handleStatusChange('in-progress') },
                    { text: 'Done', onPress: () => handleStatusChange('done') }
                  ]
                );
              }}
              iconName="options"
            />

            <SecondaryButton
              text="Report Issue"
              onPress={() => setIsAddIssueModalOpen(true)}
              iconName="warning"
            />
          </View>
        </View>

        {/* Comments Section */}
        <View className="px-6 pb-6">
          <Text className="text-lg font-semibold text-black dark:text-white mb-4">
            Comments ({comments.length})
          </Text>

          {/* Add Comment */}
          <View className="flex-row space-x-2 mb-4">
            <View className="flex-1">
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Add a comment..."
                placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                className={`p-3 rounded-lg border ${
                  isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-black'
                }`}
                multiline
              />
            </View>
            <TouchableOpacity
              onPress={handleAddComment}
              disabled={!newComment.trim() || submittingComment}
              className={`p-3 rounded-lg ${
                newComment.trim() && !submittingComment
                  ? 'bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={newComment.trim() && !submittingComment ? '#ffffff' : (isDark ? '#9ca3af' : '#6b7280')} 
              />
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          <View className="space-y-4">
            {comments.map((comment) => (
              <View key={comment._id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-medium text-black dark:text-white">
                    {comment.user.name}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text className="text-gray-700 dark:text-gray-300">
                  {comment.content}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Issues Section */}
        <View className="px-6 pb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-black dark:text-white">
              Issues ({issues.length})
            </Text>
          </View>
          
          {issues.length === 0 ? (
            <View className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <Text className="text-gray-600 dark:text-gray-300 text-center">
                No issues reported for this task
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {issues.map((issue) => (
                <View key={issue._id} className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="font-medium text-black dark:text-white">
                      {issue.title}
                    </Text>
                    <View className="flex-row items-center space-x-2">
                      <View 
                        className="px-2 py-1 rounded-full"
                        style={{ backgroundColor: `${getIssueStatusColor(issue.status)}20` }}
                      >
                        <Text 
                          className="text-xs font-medium"
                          style={{ color: getIssueStatusColor(issue.status) }}
                        >
                          {getIssueStatusLabel(issue.status)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            'Update Issue Status',
                            'Select new status:',
                            [
                              { text: 'Cancel', style: 'cancel' },
                              { text: 'Open', onPress: () => handleIssueStatusChange(issue._id, 'open') },
                              { text: 'In Progress', onPress: () => handleIssueStatusChange(issue._id, 'in-progress') },
                              { text: 'Resolved', onPress: () => handleIssueStatusChange(issue._id, 'resolved') },
                              { text: 'Closed', onPress: () => handleIssueStatusChange(issue._id, 'closed') }
                            ]
                          );
                        }}
                      >
                        <Ionicons name="ellipsis-vertical" size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {issue.description && (
                    <Text className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                      {issue.description}
                    </Text>
                  )}
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      Reported by {issue.owner.name}
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Submit Modal */}
      <Modal
        visible={isSubmitModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsSubmitModalOpen(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className={`bg-white dark:bg-gray-800 rounded-t-3xl p-6 max-h-[80%]`}>
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-black dark:text-white">
                Submit Task
              </Text>
              <TouchableOpacity
                onPress={() => setIsSubmitModalOpen(false)}
                className="p-2"
              >
                <Ionicons name="close" size={24} color={isDark ? '#ffffff' : '#000000'} />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
              <View className="space-y-4">
                <View>
                  <Text className="text-sm font-medium text-black dark:text-white mb-2">
                    Message *
                  </Text>
                  <TextInput
                    value={submissionMessage}
                    onChangeText={setSubmissionMessage}
                    placeholder="Enter your message..."
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                    className={`p-3 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-black'
                    }`}
                  />
                </View>
              </View>
            </ScrollView>

            <View className="flex-row space-x-3 mt-6">
              <SecondaryButton
                text="Cancel"
                onPress={() => setIsSubmitModalOpen(false)}
                className="flex-1"
              />
              <PrimaryButton
                text="Submit"
                onPress={handleSubmitTask}
                loading={isSubmitting}
                disabled={!submissionMessage.trim()}
                className="flex-1"
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Reject Modal */}
      <Modal
        visible={isRejectModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsRejectModalOpen(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className={`bg-white dark:bg-gray-800 rounded-t-3xl p-6 max-h-[80%]`}>
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-black dark:text-white">
                Reject Task
              </Text>
              <TouchableOpacity
                onPress={() => setIsRejectModalOpen(false)}
                className="p-2"
              >
                <Ionicons name="close" size={24} color={isDark ? '#ffffff' : '#000000'} />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
              <View className="space-y-4">
                <View>
                  <Text className="text-sm font-medium text-black dark:text-white mb-2">
                    Rejection Reason *
                  </Text>
                  <TextInput
                    value={submissionMessage}
                    onChangeText={setSubmissionMessage}
                    placeholder="Explain why this task is being rejected..."
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                    className={`p-3 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-black'
                    }`}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>
            </ScrollView>

            <View className="flex-row space-x-3 mt-6">
              <SecondaryButton
                text="Cancel"
                onPress={() => setIsRejectModalOpen(false)}
                className="flex-1"
              />
              <PrimaryButton
                text="Reject"
                onPress={handleRejectTask}
                loading={isSubmitting}
                disabled={!submissionMessage.trim()}
                className="flex-1"
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Issue Modal */}
      <Modal
        visible={isAddIssueModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddIssueModalOpen(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className={`bg-white dark:bg-gray-800 rounded-t-3xl p-6 max-h-[80%]`}>
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-black dark:text-white">
                Report Issue
              </Text>
              <TouchableOpacity
                onPress={() => setIsAddIssueModalOpen(false)}
                className="p-2"
              >
                <Ionicons name="close" size={24} color={isDark ? '#ffffff' : '#000000'} />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
              <View className="space-y-4">
                <View>
                  <Text className="text-sm font-medium text-black dark:text-white mb-2">
                    Issue Title *
                  </Text>
                  <TextInput
                    value={newIssueTitle}
                    onChangeText={setNewIssueTitle}
                    placeholder="Enter issue title..."
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                    className={`p-3 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-black'
                    }`}
                  />
                </View>

                <View>
                  <Text className="text-sm font-medium text-black dark:text-white mb-2">
                    Issue Description
                  </Text>
                  <TextInput
                    value={newIssueDescription}
                    onChangeText={setNewIssueDescription}
                    placeholder="Describe the issue in detail..."
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                    className={`p-3 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-black'
                    }`}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>
            </ScrollView>

            <View className="flex-row space-x-3 mt-6">
              <SecondaryButton
                text="Cancel"
                onPress={() => setIsAddIssueModalOpen(false)}
                className="flex-1"
              />
              <PrimaryButton
                text="Report Issue"
                onPress={handleAddIssue}
                loading={isAddingIssue}
                disabled={!newIssueTitle.trim()}
                className="flex-1"
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
} 