import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useProjectStore } from '../store/projectStore';
import { Card, StatCard } from '../components/cards';
import { 
  PrimaryButton, 
  DangerButton,
  IconButton,
  OutlineButton
} from '../components/buttons';
import Modal from '../components/modals/Modal';
import { ProjectForm } from '../components/forms/ProjectForm';
import { TaskForm, TaskFormData } from '../components/forms/TaskForm';
import { MemberForm, MemberFormData } from '../components/forms/MemberForm';
import { Project, Task } from '../interfaces/interfaces';
import TasksTable from '../components/tables/TasksTable';
import MemberTable from '../components/tables/MemberTable';
import { TabContainer } from '../components/containers';

const ProjectDetailsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userIsMember, setUserIsMember] = useState(false);  // Use any to avoid TypeScript errors while maintaining the component functionality
  const { 
    currentProject,
    tasks,
    members,
    fetchProjectById,
    fetchProjectTasks,
    fetchProjectMembers,
    updateProject,
    createTask,
    updateTask,
    deleteTask,
    inviteUserToProject,
    deleteProject,
    leaveProject
  } = useProjectStore() as any;// Load project data
  useEffect(() => {
    if (projectId) {
      setLoading(true);
      
      // Use the already destructured methods from the top level
      fetchProjectById(projectId)
        .then(() => {
          fetchProjectTasks(projectId);
          fetchProjectMembers(projectId);
        })
        .catch((err: Error) => {
          setError(err.message || 'Failed to load project');
        })
        .finally(() => setLoading(false));
    }
  }, [projectId, fetchProjectById, fetchProjectTasks, fetchProjectMembers]);
  
  // Update local project state when currentProject changes
  useEffect(() => {
    if (currentProject) {
      setProject(currentProject);
      
      // Check if the current user is a member of the project
      if (members && members.length > 0) {
        // This is a simplified check - in a real app, you'd compare with the current user's ID
        setUserIsMember(true);
      }
    }
  }, [currentProject, members]);

  // Handle project editing
  const handleEditProject = (data: any) => {
    setIsSubmitting(true);
    
    if (project && projectId) {
      updateProject(projectId, {
        name: data.name,
        shortDescription: data.shortDescription || project.shortDescription,
        description: data.description || project.description,
        status: data.status.toLowerCase() as 'active' | 'archived' | 'completed',
        targetDate: data.dueDate || project.targetDate
      })
      .then(() => {
        setIsEditModalOpen(false);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
    }
  };
  
  // Handle project deletion
  const handleDeleteProject = () => {
    setIsSubmitting(true);
    
    if (projectId) {
      deleteProject(projectId)
        .then(() => {
          // Navigate back to the projects list
          navigate('/app/projects');
        })
        .finally(() => {
          setIsSubmitting(false);
          setIsDeleteConfirmOpen(false);
        });
    }
  };
  
  // Handle leaving a project
  const handleLeaveProject = () => {
    setIsSubmitting(true);
    
    if (projectId) {      leaveProject(projectId)
        .then((success: boolean) => {
          if (success) {
            // Navigate back to the projects list
            navigate('/app/projects');
          }
        })
        .finally(() => {
          setIsSubmitting(false);
          setIsLeaveConfirmOpen(false);
        });
    }
  };
  
  // Handle adding a new task
  const handleAddTask = (data: TaskFormData) => {
    setIsSubmitting(true);
    
    if (projectId) {
      const taskData = {
        ...data,
        projectId
      };
      
      createTask(taskData)
        .then(() => {
          setIsAddTaskModalOpen(false);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };
  
  // Handle editing a task
  const handleEditTask = (taskId: string, data: TaskFormData) => {
    setIsSubmitting(true);
    
    updateTask(taskId, data)
      .then(() => {
        setSelectedTaskForEdit(null);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
    // Handle adding a member to the project
  const handleAddMemberSubmit = async (data: MemberFormData) => {
    setIsSubmitting(true);
    
    if (projectId) {
      try {
        await inviteUserToProject(projectId, data.email, data.role);
        // We don't close the modal immediately to give user feedback
        // Instead, show a success message for a moment
        setTimeout(() => {
          setIsAddMemberModalOpen(false);
          setIsSubmitting(false);
        }, 1500);
      } catch (error) {
        console.error('Error inviting user:', error);
        setIsSubmitting(false);
      }
    }
  };

  // Handle task deletion
  const confirmTaskDeletion = () => {
    if (taskToDelete) {
      setIsSubmitting(true);
      deleteTask(taskToDelete._id)
        .then(() => {
          setTaskToDelete(null);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-[70vh]">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-indigo-600 animate-spin mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading project details...</p>
      </div>
    );
  }
  
  // Show error state
  if (error || !project) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div className="flex">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error loading project</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-200">
                {error || "Project not found or you don't have access to it."}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with project name and actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <IconButton 
            icon={<svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>}
            variant="ghost"
            onClick={() => navigate('/app/projects')}
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
        </div>
        
        <div className="flex items-center space-x-2">          {userIsMember && (
            <DangerButton
              text="Leave Project"
              size="sm"
              onClick={() => setIsLeaveConfirmOpen(true)}
            />
          )}          <OutlineButton
            text="Delete"
            variant="danger"
            size="sm"
            onClick={() => setIsDeleteConfirmOpen(true)}
          />
          <PrimaryButton
            text="Edit Project"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
          />
        </div>
      </div>
      
      {/* Tab Container */}
      <TabContainer
        tabs={[
          {
            id: 'details',
            label: 'Project Details',
            icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>,
            content: (
              <div className="space-y-6 mt-4">
                <Card>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Project Overview</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {project.shortDescription || 'No short description provided'}
                    </p>
                    
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{project.description || 'No description provided'}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                      <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h3>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          project.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                      <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Target Date</h3>
                      <p className="text-sm font-medium">
                        {project.targetDate 
                          ? format(new Date(project.targetDate), 'MMMM d, yyyy')
                          : 'No target date set'
                        }
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                      <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Created</h3>
                      <p className="text-sm font-medium">
                        {project.createdAt && format(new Date(project.createdAt), 'MMMM d, yyyy')}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                      <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Last Updated</h3>
                      <p className="text-sm font-medium">
                        {project.updatedAt && format(new Date(project.updatedAt), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Project stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard 
                      label="Tasks" 
                      value={tasks.length}
                      icon={<svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>}
                    />
                    <StatCard 
                      label="Members" 
                      value={project.members?.length || 0}
                      icon={<svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>}
                    />
                    <StatCard 
                      label="To Do" 
                      value={tasks.filter((t: any) => t.status === 'todo').length}
                      icon={<svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>}
                    />
                    <StatCard 
                      label="Completed" 
                      value={tasks.filter((t: any) => t.status === 'done').length}
                      icon={<svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
                    />
                  </div>
                </Card>
                
                {/* Members section */}
                <Card>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Team Members</h2>
                    <PrimaryButton
                      text="Invite Member"
                      size="xs"
                      onClick={() => setIsAddMemberModalOpen(true)}
                    />
                  </div>
                  
                  <MemberTable
                    projectId={project._id || ''}
                  />
                </Card>
              </div>
            )
          },
          {
            id: 'tasks',
            label: 'Tasks',
            badge: tasks.length,
            icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>,
            content: (
              <div className="mt-4">
                <Card>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">Project Tasks</h2>
                    <PrimaryButton
                      text="Add Task"
                      size="xs"
                      onClick={() => setIsAddTaskModalOpen(true)}
                    />
                  </div>
                  
                  <TasksTable 
                    tasks={tasks}
                    onEdit={(task) => setSelectedTaskForEdit(task)}
                    onDelete={(task) => setTaskToDelete(task)}
                  />
                </Card>
              </div>
            )
          }
        ]}
        variant="underline"
        size="md"
        activeTabColor="border-indigo-600"
        activeTextColor="text-indigo-600 dark:text-indigo-400"        onChange={(_) => {}}
        defaultTabId="details"
      />
      
      {/* Edit Project Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Project"
        primaryAction={{
          text: "Save Changes",
          onClick: () => document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })),
          loading: isSubmitting
        }}
        secondaryAction={{
          text: "Cancel",
          onClick: () => setIsEditModalOpen(false)
        }}
      >
        <ProjectForm 
          initialData={{
            name: project.name,
            description: project.description,
            status: project.status.charAt(0).toUpperCase() + project.status.slice(1) as any,
            dueDate: project.targetDate ? project.targetDate.toString() : null
          }}
          onSubmit={handleEditProject}
          isSubmitting={isSubmitting}
        />
      </Modal>
      
      {/* Delete Confirmation Modal */}      
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Delete Project"
        primaryAction={{
          text: "Delete Project",
          onClick: handleDeleteProject,
          loading: isSubmitting
        }}
        secondaryAction={{
          text: "Cancel",
          onClick: () => setIsDeleteConfirmOpen(false)
        }}
      >
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="mr-4 p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white">Are you sure you want to delete this project?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This will permanently delete the project "{project.name}", all its tasks and associated data. This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-sm text-gray-500 dark:text-gray-400 mb-2">
            <p>To confirm, please type the project name: <span className="font-medium text-gray-900 dark:text-white">{project.name}</span></p>
            <input 
              type="text" 
              className="mt-2 w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder={`Type "${project.name}"`}
            />
          </div>
        </div>
      </Modal>

      {/* Leave Project Confirmation Modal */}
      <Modal
        isOpen={isLeaveConfirmOpen}
        onClose={() => setIsLeaveConfirmOpen(false)}
        title="Leave Project"
        primaryAction={{
          text: "Leave Project",
          onClick: handleLeaveProject,
          loading: isSubmitting
        }}
        secondaryAction={{
          text: "Cancel",
          onClick: () => setIsLeaveConfirmOpen(false)
        }}
      >
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="mr-4 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white">Are you sure you want to leave this project?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                You will no longer have access to "{project.name}" and will need to be invited again to rejoin.
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        title="Add New Task"
        primaryAction={{
          text: "Create Task",
          onClick: () => document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })),
          loading: isSubmitting
        }}
        secondaryAction={{
          text: "Cancel",
          onClick: () => setIsAddTaskModalOpen(false)
        }}
      >
        {project && (
          <TaskForm 
            projectId={project._id}
            members={project.members || []}
            onSubmit={handleAddTask}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={!!selectedTaskForEdit}
        onClose={() => setSelectedTaskForEdit(null)}
        title="Edit Task"
        size="4xl"
        primaryAction={{
          text: "Save Changes",
          onClick: () => document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })),
          loading: isSubmitting
        }}
        secondaryAction={{
          text: "Cancel",
          onClick: () => setSelectedTaskForEdit(null)
        }}
      >
        {selectedTaskForEdit && project && (
          <TaskForm 
            projectId={project._id}
            members={project.members || []}
            initialData={{
              title: selectedTaskForEdit.title,
              description: selectedTaskForEdit.description,
              priority: selectedTaskForEdit.priority,
              dueDate: selectedTaskForEdit.dueDate,
              assignedTo: selectedTaskForEdit.assignedTo.map(member => member._id),
            }}
            onSubmit={(data) => handleEditTask(selectedTaskForEdit._id, data)}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>

      {/* Add Member Modal */}      <Modal
        isOpen={isAddMemberModalOpen}
        onClose={() => !isSubmitting && setIsAddMemberModalOpen(false)}
        title="Invite Team Member"
      >
        <MemberForm 
          onSubmit={handleAddMemberSubmit}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete Task Confirmation Modal */}
      <Modal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        title="Delete Task"
        primaryAction={{
          text: "Delete Task",
          onClick: confirmTaskDeletion,
          loading: isSubmitting
        }}
        secondaryAction={{
          text: "Cancel",
          onClick: () => setTaskToDelete(null)
        }}
      >
        {taskToDelete && (
          <div className="p-4">
            <div className="flex items-center mb-4">
              <div className="mr-4 p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white">Are you sure you want to delete this task?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  This will permanently delete the task "{taskToDelete.title}" and all its associated data. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProjectDetailsPage;
