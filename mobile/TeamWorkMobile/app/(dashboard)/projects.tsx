import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { ProjectCard, StatCard } from '../../components/cards';
import { FilterDropdown } from '../../components/dropdowns';
import { ProjectModal } from '../../components/modals';
import { PrimaryButton } from '../../components/buttons';
import { useProjectStore, ProjectWithDetails } from '../../store/projectStore';
import { ProjectFormData } from '../../components/forms';

export default function ProjectsScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Project store
  const { 
    projectsWithDetails, 
    projectsLoading, 
    projectsError, 
    fetchProjectsWithDetails,
    createProject,
    updateProject,
    deleteProject
  } = useProjectStore();
  
  // Local state
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch projects with details on component mount
  useEffect(() => {
    fetchProjectsWithDetails()
      .then(() => {
        console.log("Projects with details fetched successfully");
      })
      .catch((error: Error) => {
        console.error("Error fetching projects:", error);
      });
  }, [fetchProjectsWithDetails]);

  // Apply filters
  const filteredProjects = projectsWithDetails.filter((project: ProjectWithDetails) => {
    if (statusFilter && project.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Calculate stats
  const stats = {
    totalProjects: projectsWithDetails.length,
    activeProjects: projectsWithDetails.filter((p: ProjectWithDetails) => p.status === 'active').length,
    completedProjects: projectsWithDetails.filter((p: ProjectWithDetails) => p.status === 'completed').length,
    totalTasks: projectsWithDetails.reduce((sum: number, project: ProjectWithDetails) => sum + (project.details?.totalTasks || 0), 0)
  };

  // Handle project creation
  const handleCreateProject = (data: ProjectFormData) => {
    setIsSubmitting(true);
    
    const projectData = {
      name: data.name,
      description: data.description,
      status: data.status.toLowerCase(),
      targetDate: data.dueDate
    };
    
    createProject(projectData)
      .then(() => {
        setIsCreateModalOpen(false);
      })
      .catch((error: Error) => {
        Alert.alert('Error', 'Failed to create project. Please try again.');
        console.error('Error creating project:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Handle project editing
  const handleEditProject = (data: ProjectFormData) => {
    if (!editingProject) return;
    
    setIsSubmitting(true);
    
    const projectData = {
      name: data.name,
      description: data.description,
      status: data.status.toLowerCase(),
      targetDate: data.dueDate
    };
    
    updateProject(editingProject._id, projectData)
      .then(() => {
        setIsEditModalOpen(false);
        setEditingProject(null);
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
  const handleDeleteProject = (projectId: string) => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteProject(projectId)
              .catch((error: Error) => {
                Alert.alert('Error', 'Failed to delete project. Please try again.');
                console.error('Error deleting project:', error);
              });
          }
        }
      ]
    );
  };

  // Open edit modal
  const openEditModal = (project: ProjectWithDetails) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  // Filter options
  const filterOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
    { label: 'Archived', value: 'archived' }
  ];

  // Show error if there's one
  if (projectsError) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle" size={48} color={isDark ? '#ef4444' : '#dc2626'} />
          <Text className="text-lg font-semibold text-black dark:text-white mt-4 text-center">
            Error Loading Projects
          </Text>
          <Text className="text-gray-600 dark:text-gray-300 mt-2 text-center">
            {projectsError}
          </Text>
          <TouchableOpacity
            onPress={() => fetchProjectsWithDetails()}
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
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <View>
          <Text className="text-2xl font-bold text-black dark:text-white tracking-tight">
            Projects
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Manage and track your team's projects
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsCreateModalOpen(true)}
          className="bg-black dark:bg-white p-3 rounded-full"
        >
          <Ionicons name="add" size={20} color={isDark ? '#000' : '#fff'} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View className="px-6 py-6">
          <Text className="text-lg font-semibold text-black dark:text-white mb-4">
            Overview
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <StatCard
              label="Total Projects"
              value={stats.totalProjects}
              icon="folder-outline"
            />
            <StatCard
              label="Active Projects"
              value={stats.activeProjects}
              icon="play-circle-outline"
            />
            <StatCard
              label="Completed"
              value={stats.completedProjects}
              icon="checkmark-circle-outline"
            />
            <StatCard
              label="Total Tasks"
              value={stats.totalTasks}
              icon="list-outline"
            />
          </View>
        </View>

        {/* Filters and Projects */}
        <View className="px-6 pb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-black dark:text-white">
              All Projects
            </Text>
            <FilterDropdown
              options={filterOptions}
              selectedValue={statusFilter || undefined}
              onSelect={setStatusFilter}
              placeholder="Filter by status"
            />
          </View>

          {projectsLoading ? (
            <View className="flex-1 justify-center items-center py-12">
              <Ionicons name="reload" size={32} color={isDark ? '#6b7280' : '#9ca3af'} />
              <Text className="text-gray-600 dark:text-gray-300 mt-2">Loading projects...</Text>
            </View>
          ) : filteredProjects.length === 0 ? (
            <View className="flex-1 justify-center items-center py-12">
              <Ionicons name="folder-open" size={48} color={isDark ? '#6b7280' : '#9ca3af'} />
              <Text className="text-lg font-semibold text-black dark:text-white mt-4">
                No projects found
              </Text>
              <Text className="text-gray-600 dark:text-gray-300 mt-2 text-center">
                {statusFilter ? 'No projects match your filter.' : 'Get started by creating your first project.'}
              </Text>
              {!statusFilter && (
                <TouchableOpacity
                  onPress={() => setIsCreateModalOpen(true)}
                  className="mt-4 bg-black dark:bg-white px-6 py-3 rounded-lg"
                >
                  <Text className="text-white dark:text-black font-semibold text-center">
                    Create Project
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View className="space-y-4">
              {filteredProjects.map((project: ProjectWithDetails) => (
                <View key={project._id} className="relative">
                  <ProjectCard
                    project={project}
                    details={{
                      taskCounts: {
                        todo: project.details?.pendingTasks || 0,
                        'in-progress': project.details?.totalTasks - (project.details?.completedTasks || 0) - (project.details?.pendingTasks || 0) || 0,
                        done: project.details?.completedTasks || 0
                      }
                    }}
                    onPress={() => router.push(`/(dashboard)/project/${project._id}` as any)}
                  />
                  
                  {/* Action buttons */}
                  <View className="absolute top-2 right-2 flex-row space-x-1">
                    <TouchableOpacity
                      onPress={() => openEditModal(project)}
                      className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm"
                      activeOpacity={0.7}
                    >
                      <Ionicons name="pencil" size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteProject(project._id)}
                      className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm"
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Create Project Modal */}
      <ProjectModal
        isVisible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
        isSubmitting={isSubmitting}
        title="Create New Project"
        mode="create"
      />

      {/* Edit Project Modal */}
      <ProjectModal
        isVisible={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProject(null);
        }}
        onSubmit={handleEditProject}
        isSubmitting={isSubmitting}
        title="Edit Project"
        mode="edit"
        initialData={editingProject ? {
          name: editingProject.name,
          description: editingProject.description || '',
          status: editingProject.status.charAt(0).toUpperCase() + editingProject.status.slice(1),
          dueDate: editingProject.targetDate ? new Date(editingProject.targetDate).toISOString().split('T')[0] : ''
        } : undefined}
      />
    </SafeAreaView>
  );
} 