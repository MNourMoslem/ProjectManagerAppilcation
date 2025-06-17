import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton, SecondaryButton } from '../../../components/buttons';
import { useProjectStore, Project } from '../../../store/projectStore';
import { ProjectForm, ProjectFormData } from '../../../components/forms';
import MembersTab from '../../../components/project/MembersTab';
import TasksTab from '../../../components/project/TasksTab';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Project store
  const { 
    currentProject,
    projectsLoading, 
    projectsError, 
    fetchProjectById,
    updateProject,
    deleteProject,
    leaveProject
  } = useProjectStore();

  // Local state
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'tasks'>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch project data
  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchProjectById(id)
        .then(() => {
          console.log("Project fetched successfully");
        })
        .catch((error: Error) => {
          console.error("Error fetching project:", error);
        });
    }
  }, [id, fetchProjectById]);

  // Format date
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'No date';
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Status color
  const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    archived: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  };

  // Handle project editing
  const handleEditProject = (data: ProjectFormData) => {
    if (!currentProject) return;
    
    setIsSubmitting(true);
    
    const projectData = {
      name: data.name,
      description: data.description,
      status: data.status.toLowerCase(),
      targetDate: data.dueDate
    };
    
    updateProject(currentProject._id, projectData)
      .then(() => {
        setIsEditModalOpen(false);
      })
      .catch((error: Error) => {
        Alert.alert('Error', 'Failed to update project. Please try again.');
        console.error('Error updating project:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Handle project deletion
  const handleDeleteProject = () => {
    if (!currentProject) return;
    
    deleteProject(currentProject._id)
      .then(() => {
        router.back();
      })
      .catch((error: Error) => {
        Alert.alert('Error', 'Failed to delete project. Please try again.');
        console.error('Error deleting project:', error);
      });
  };

  // Handle leaving project
  const handleLeaveProject = () => {
    if (!currentProject) return;
    
    leaveProject(currentProject._id)
      .then((success: boolean) => {
        if (success) {
          router.back();
        }
      })
      .catch((error: Error) => {
        Alert.alert('Error', 'Failed to leave project. Please try again.');
        console.error('Error leaving project:', error);
      });
  };

  // Render Overview Tab
  const renderOverviewTab = () => (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="px-6 py-8">
        {/* Project Name & Status */}
        <View className="flex-row items-center mb-4">
          <Text className="text-2xl font-bold text-black dark:text-white flex-1" numberOfLines={1}>
            {currentProject?.name}
          </Text>
          <View className={`px-2 py-1 rounded-full ${statusColors[currentProject?.status as keyof typeof statusColors]}`}>
            <Text className="text-xs font-medium">
              {currentProject?.status ? currentProject.status.charAt(0).toUpperCase() + currentProject.status.slice(1) : ''}
            </Text>
          </View>
        </View>

        {/* Short Description */}
        <Text className="text-gray-600 dark:text-gray-300 text-base mb-4">
          {currentProject?.shortDescription || 'No short description provided'}
        </Text>

        {/* Details */}
        <View className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 border border-gray-200 dark:border-gray-700 mb-4">
          <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</Text>
          <Text className="text-sm text-black dark:text-white">
            {currentProject?.description || 'No description provided'}
          </Text>
        </View>

        <View className="flex-row space-x-4 mb-4">
          <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-md p-4 border border-gray-200 dark:border-gray-700">
            <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</Text>
            <Text className="text-sm font-medium text-black dark:text-white">
              {currentProject?.status ? currentProject.status.charAt(0).toUpperCase() + currentProject.status.slice(1) : ''}
            </Text>
          </View>
          <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-md p-4 border border-gray-200 dark:border-gray-700">
            <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Target Date</Text>
            <Text className="text-sm font-medium text-black dark:text-white">
              {formatDate(currentProject?.targetDate)}
            </Text>
          </View>
        </View>

        <View className="flex-row space-x-4 mb-4">
          <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-md p-4 border border-gray-200 dark:border-gray-700">
            <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Created</Text>
            <Text className="text-sm font-medium text-black dark:text-white">
              {formatDate(currentProject?.createdAt)}
            </Text>
          </View>
          <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-md p-4 border border-gray-200 dark:border-gray-700">
            <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Members</Text>
            <Text className="text-sm font-medium text-black dark:text-white">
              {currentProject?.members?.length || 0}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row space-x-3 mt-6">
          <PrimaryButton
            text="Edit Project"
            iconName="pencil"
            onPress={() => setIsEditModalOpen(true)}
            size="md"
            fullWidth
          />
          <SecondaryButton
            text="Delete"
            iconName="trash"
            onPress={() => setIsDeleteConfirmOpen(true)}
            size="md"
            fullWidth
          />
        </View>

        <View className="mt-3">
          <SecondaryButton
            text="Leave Project"
            iconName="exit"
            onPress={() => setIsLeaveConfirmOpen(true)}
            size="md"
            fullWidth
          />
        </View>
      </View>
    </ScrollView>
  );

  // Show error if there's one
  if (projectsError) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-row items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} color={isDark ? 'white' : 'black'} />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black dark:text-white ml-4 flex-1" numberOfLines={1}>
            Project Details
          </Text>
        </View>
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle" size={48} color={isDark ? '#ef4444' : '#dc2626'} />
          <Text className="text-lg font-semibold text-black dark:text-white mt-4 text-center">
            Error Loading Project
          </Text>
          <Text className="text-gray-600 dark:text-gray-300 mt-2 text-center">
            {projectsError}
          </Text>
          <TouchableOpacity
            onPress={() => id && typeof id === 'string' ? fetchProjectById(id) : null}
            className="mt-4 bg-black dark:bg-white px-6 py-3 rounded-lg"
          >
            <Text className="text-white dark:text-black font-semibold text-center">
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={isDark ? 'white' : 'black'} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black dark:text-white ml-4 flex-1" numberOfLines={1}>
          {currentProject?.name || 'Project Details'}
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200 dark:border-gray-700">
        <TouchableOpacity
          className={`flex-1 py-3 px-2 ${activeTab === 'overview' ? 'border-b-2 border-black dark:border-white' : ''}`}
          onPress={() => setActiveTab('overview')}
        >
          <Text className={`text-center font-medium text-xs ${activeTab === 'overview' ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 px-2 ${activeTab === 'tasks' ? 'border-b-2 border-black dark:border-white' : ''}`}
          onPress={() => setActiveTab('tasks')}
        >
          <Text className={`text-center font-medium text-xs ${activeTab === 'tasks' ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            Tasks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 px-2 ${activeTab === 'members' ? 'border-b-2 border-black dark:border-white' : ''}`}
          onPress={() => setActiveTab('members')}
        >
          <Text className={`text-center font-medium text-xs ${activeTab === 'members' ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            Members
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {projectsLoading ? (
        <View className="flex-1 justify-center items-center py-12">
          <Ionicons name="reload" size={32} color={isDark ? '#6b7280' : '#9ca3af'} />
          <Text className="text-gray-600 dark:text-gray-300 mt-2">Loading project...</Text>
        </View>
      ) : !currentProject ? (
        <View className="mx-6 my-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <View className="flex-row items-center">
            <Ionicons name="alert-circle-outline" size={20} color="#ef4444" style={{ marginRight: 8 }} />
            <Text className="text-red-700 dark:text-red-400 flex-1">
              Project not found or you don't have access to it.
            </Text>
          </View>
        </View>
      ) : (
        <>
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'tasks' && <TasksTab projectId={currentProject._id} />}
          {activeTab === 'members' && <MembersTab projectId={currentProject._id} />}
        </>
      )}

      {/* Edit Project Modal */}
      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
          <ProjectForm
            onSubmit={handleEditProject}
            onCancel={() => setIsEditModalOpen(false)}
            isSubmitting={isSubmitting}
            title="Edit Project"
            mode="edit"
            initialData={currentProject ? {
              name: currentProject.name,
              description: currentProject.description || '',
              status: currentProject.status.charAt(0).toUpperCase() + currentProject.status.slice(1),
              dueDate: currentProject.targetDate ? new Date(currentProject.targetDate).toISOString().split('T')[0] : ''
            } : undefined}
          />
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <View className="absolute inset-0 bg-black/50 flex justify-center items-center px-6">
          <View className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
            <Text className="text-lg font-bold text-black dark:text-white mb-2">
              Delete Project
            </Text>
            <Text className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
            </Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 px-4 py-3 rounded-lg"
              >
                <Text className="text-center font-medium text-black dark:text-white">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsDeleteConfirmOpen(false);
                  handleDeleteProject();
                }}
                className="flex-1 bg-red-500 px-4 py-3 rounded-lg"
              >
                <Text className="text-center font-medium text-white">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Leave Confirmation Modal */}
      {isLeaveConfirmOpen && (
        <View className="absolute inset-0 bg-black/50 flex justify-center items-center px-6">
          <View className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
            <Text className="text-lg font-bold text-black dark:text-white mb-2">
              Leave Project
            </Text>
            <Text className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to leave this project? You will lose access to it.
            </Text>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setIsLeaveConfirmOpen(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 px-4 py-3 rounded-lg"
              >
                <Text className="text-center font-medium text-black dark:text-white">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsLeaveConfirmOpen(false);
                  handleLeaveProject();
                }}
                className="flex-1 bg-orange-500 px-4 py-3 rounded-lg"
              >
                <Text className="text-center font-medium text-white">
                  Leave
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
} 