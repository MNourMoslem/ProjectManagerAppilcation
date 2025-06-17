import { create } from 'zustand';
import { projectAPI, taskAPI } from '../api/projectApi';
import { User, Project, ProjectDetails, Task, ProjectMember, Issue, Comment } from '@/interfaces/interfaces';


interface ProjectState {
  // Projects
  projects: Project[];
  projectsWithDetails: ProjectDetails[];
  currentProject: Project | null;
  currentProjectWithDetails: ProjectDetails | null;
  projectsLoading: boolean;
  projectsError: string | null;
  
  // Tasks
  tasks: Task[];
  userTasks: Task[];
  tasksLoading: boolean;
  tasksError: string | null;
  
  // Members
  members: ProjectMember[];
  membersLoading: boolean;
  membersError: string | null;
  
  // Actions
  fetchProjects: () => Promise<void>;
  fetchProjectsWithDetails: () => Promise<void>;
  fetchProjectById: (id: string) => Promise<void>;
  fetchProjectWithDetails: (id: string) => Promise<void>;
  fetchProjectDetails: (id: string) => Promise<ProjectDetails | undefined>;
  createProject: (data: any) => Promise<void>;
  updateProject: (id: string, data: any) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  fetchProjectMembers: (projectId: string) => Promise<void>;
  inviteUserToProject: (projectId: string, userEmail: string, role?: 'admin' | 'member') => Promise<void>;
  acceptProjectInvite: (projectId: string) => Promise<void>;
  declineProjectInvite: (projectId: string) => Promise<void>;
  removeProjectMember: (projectId: string, memberId: string) => Promise<void>;
  updateMemberRole: (projectId: string, memberId: string, role: 'admin' | 'member') => Promise<void>;
  leaveProject: (projectId: string) => Promise<boolean>;
  getUserRole: (projectId: string) => Promise<string>;
  fetchProjectTasks: (projectId: string) => Promise<void>;
  fetchUndoneTasks: (projectId: string) => Promise<void>;
  fetchAllUserTasks: () => Promise<void>;
  fetchUserTasks: (options: {
    from?: number;
    to?: number;
    status?: 'todo' | 'in-progress' | 'done' | 'cancelled';
    priority?: 'no-priority' | 'low' | 'medium' | 'high' | 'urgent';
    projectId?: string;
  }) => Promise<void>;
  createTask: (data: any) => Promise<void>;
  updateTask: (id: string, data: any) => Promise<Task | undefined>;
  deleteTask: (id: string) => Promise<void>;
  assignTask: (taskId: string, userId: string) => Promise<void>;
  changeTaskStatus: (taskId: string, status: 'todo' | 'in-progress' | 'done' | 'cancelled') => Promise<void>;
  
  // Task-specific actions
  fetchTaskById: (taskId: string) => Promise<Task>;
  startWorkingOnTask: (taskId: string) => Promise<Task>;
  submitTask: (taskId: string, message: string) => Promise<Task>;
  rejectTask: (taskId: string, message: string) => Promise<Task>;
  
  // Comment actions
  getTaskComments: (taskId: string) => Promise<Comment[]>;
  createComment: (taskId: string, content: string) => Promise<Task>;
  
  // Issue actions
  getTaskIssues: (taskId: string) => Promise<Issue[]>;
  createIssue: (taskId: string, issueData: { title: string; description: string }) => Promise<Task>;
  updateIssueStatus: (taskId: string, issueId: string, status: string) => Promise<Task>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  // Initial state
  projects: [],
  projectsWithDetails: [],
  currentProject: null,
  currentProjectWithDetails: null,
  projectsLoading: false,
  projectsError: null,
  
  tasks: [],
  userTasks: [],
  tasksLoading: false,
  tasksError: null,
  
  members: [],
  membersLoading: false,
  membersError: null,
  
  // Project actions
  fetchProjects: async () => {
    set({ projectsLoading: true, projectsError: null });
    try {
      const response = await projectAPI.getAll();
      if (response.success) {
        set({ projects: response.projects, projectsLoading: false });
      } else {
        set({ projectsError: 'Failed to fetch projects', projectsLoading: false });
      }
    } catch (error) {
      set({ projectsError: (error as Error).message, projectsLoading: false });
    }
  },
  
  fetchProjectsWithDetails: async () => {
    set({ projectsLoading: true, projectsError: null });
    try {
      const response = await projectAPI.getAllWithDetails();
      if (response.success) {
        set({ projectsWithDetails: response.projects, projectsLoading: false });
      } else {
        set({ projectsError: 'Failed to fetch projects with details', projectsLoading: false });
      }
    } catch (error) {
      set({ projectsError: (error as Error).message, projectsLoading: false });
    }
  },
    
  fetchProjectById: async (id: string) => {
    set({ projectsLoading: true, projectsError: null });
    try {
      const response = await projectAPI.getById(id);
      if (response.success) {
        set({ currentProject: response.project, projectsLoading: false });
        // Also fetch members and tasks
        get().fetchProjectMembers(id);
        get().fetchProjectTasks(id);
      } else {
        set({ projectsError: 'Failed to fetch project', projectsLoading: false });
      }
    } catch (error) {
      set({ projectsError: (error as Error).message, projectsLoading: false });
    }
  },
  
  fetchProjectWithDetails: async (id: string) => {
    set({ projectsLoading: true, projectsError: null });
    try {
      const response = await projectAPI.getWithDetails(id);
      if (response.success) {
        set({ currentProjectWithDetails: response.project, projectsLoading: false });
        // Also fetch members and tasks
        get().fetchProjectMembers(id);
        get().fetchProjectTasks(id);
      } else {
        set({ projectsError: 'Failed to fetch project with details', projectsLoading: false });
      }
    } catch (error) {
      set({ projectsError: (error as Error).message, projectsLoading: false });
    }
  },
  
  fetchProjectDetails: async (id: string) => {
    set({ projectsLoading: true, projectsError: null });
    try {
      console.log("Fetching Project Details for ID:", id);
      const response = await projectAPI.getDetails(id);
      if (response.success) {
        return response.details;
      } else {
        set({ projectsError: 'Failed to fetch project details', projectsLoading: false });
        return undefined;
      }
    } catch (error) {
      set({ projectsError: (error as Error).message, projectsLoading: false });
      return undefined;
    } finally {
      set({ projectsLoading: false });
    }
  },
  
  createProject: async (data: any) => {
    set({ projectsLoading: true, projectsError: null });
    try {
      const response = await projectAPI.create(data);
      if (response.success) {
        // Add the new project to the list instead of refreshing
        const newProject = response.project;
        set(state => ({
          projects: [...state.projects, newProject],
          projectsLoading: false
        }));
        
        // Also update projectsWithDetails if we have it
        if (newProject.details) {
          set(state => ({
            projectsWithDetails: [...state.projectsWithDetails, newProject],
            projectsLoading: false
          }));
        }
      } else {
        set({ projectsError: 'Failed to create project', projectsLoading: false });
      }
    } catch (error) {
      set({ projectsError: (error as Error).message, projectsLoading: false });
    }
  },
  
  updateProject: async (id: string, data: any) => {
    set({ projectsLoading: true, projectsError: null });
    try {
      const response = await projectAPI.update(id, data);
      if (response.success) {
        // If we're updating the current project, update it
        const currentProject = get().currentProject;
        if (currentProject && currentProject._id === id) {
          set({ currentProject: response.project });
        }
        
        // Refresh the projects list
        get().fetchProjects();
      } else {
        set({ projectsError: 'Failed to update project', projectsLoading: false });
      }
    } catch (error) {
      set({ projectsError: (error as Error).message, projectsLoading: false });
    }
  },
  
  deleteProject: async (id: string) => {
    set({ projectsLoading: true, projectsError: null });
    try {
      const response = await projectAPI.delete(id);
      if (response.success) {
        // If we're deleting the current project, clear it
        const currentProject = get().currentProject;
        if (currentProject && currentProject._id === id) {
          set({ currentProject: null });
        }
        
        // Refresh the projects list
        get().fetchProjects();
      } else {
        set({ projectsError: 'Failed to delete project', projectsLoading: false });
      }
    } catch (error) {
      set({ projectsError: (error as Error).message, projectsLoading: false });
    }
  },
  
  // Member actions
  fetchProjectMembers: async (projectId: string) => {
    set({ membersLoading: true, membersError: null });
    try {
      const response = await projectAPI.getMembers(projectId);
      if (response.success) {
        set({ members: response.members, membersLoading: false });
      } else {
        set({ membersError: 'Failed to fetch project members', membersLoading: false });
      }
    } catch (error) {
      set({ membersError: (error as Error).message, membersLoading: false });
    }
  },
  
  inviteUserToProject: async (projectId: string, userEmail: string, role = 'member') => {
    set({ membersLoading: true, membersError: null });
    try {
      const response = await projectAPI.inviteUser(projectId, userEmail, role);
      if (response.success) {
        // Refresh the members list
        get().fetchProjectMembers(projectId);
      } else {
        set({ membersError: 'Failed to invite user to project', membersLoading: false });
      }
    } catch (error) {
      set({ membersError: (error as Error).message, membersLoading: false });
    }
  },

  acceptProjectInvite: async (projectId: string) => {
    set({ membersLoading: true, membersError: null });
    try {
      // Note: This would need to be implemented in the backend
      // For now, we'll just refresh the projects list
      get().fetchProjects();
    } catch (error) {
      set({ membersError: (error as Error).message, membersLoading: false });
    }
  },

  declineProjectInvite: async (projectId: string) => {
    set({ membersLoading: true, membersError: null });
    try {
      // Note: This would need to be implemented in the backend
      // For now, we'll just refresh the projects list
      get().fetchProjects();
    } catch (error) {
      set({ membersError: (error as Error).message, membersLoading: false });
    }
  },
  
  removeProjectMember: async (projectId: string, memberId: string) => {
    set({ membersLoading: true, membersError: null });
    try {
      const response = await projectAPI.removeMember(projectId, memberId);
      if (response.success) {
        // Refresh the members list
        get().fetchProjectMembers(projectId);
      } else {
        set({ membersError: 'Failed to remove project member', membersLoading: false });
      }
    } catch (error) {
      set({ membersError: (error as Error).message, membersLoading: false });
    }
  },
  
  updateMemberRole: async (projectId: string, memberId: string, role: 'owner' | 'admin' | 'member') => {
    set({ membersLoading: true, membersError: null });
    try {
      const response = await projectAPI.updateMemberRole(projectId, memberId, role);
      if (response.success) {
        // Refresh the members list
        get().fetchProjectMembers(projectId);
      } else {
        set({ membersError: 'Failed to update member role', membersLoading: false });
      }
    } catch (error) {
      set({ membersError: (error as Error).message, membersLoading: false });
    }
  },
  
  // Leave the project (current user)
  leaveProject: async (projectId: string) => {
    set({ membersLoading: true, membersError: null });
    try {
      const response = await projectAPI.leaveProject(projectId);
      if (response.success) {
        // Remove the project from the current list and reset the current project
        const updatedProjects = get().projects.filter(p => p._id !== projectId);
        set({ 
          projects: updatedProjects,
          currentProject: null 
        });
        return true;
      } else {
        set({ membersError: 'Failed to leave project', membersLoading: false });
        return false;
      }
    } catch (error) {
      set({ membersError: (error as Error).message, membersLoading: false });
      return false;
    } finally {
      set({ membersLoading: false });
    }
  },

  getUserRole: async (projectId: string) => {
    set({ membersLoading: true, membersError: null });
    try {
      const response = await projectAPI.getUserRole(projectId);
      if (response.success) {
        return response.role;
      } else {
        set({ membersError: 'Failed to fetch user role', membersLoading: false });
        return '';
      }
    } catch (error) {
      set({ membersError: (error as Error).message, membersLoading: false });
      return '';
    } finally {
      set({ membersLoading: false });
    }
  },
  
  // Task actions
  fetchProjectTasks: async (projectId: string) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await taskAPI.getAllForProject(projectId);
      if (response.success) {
        set({ tasks: response.tasks, tasksLoading: false });
      } else {
        set({ tasksError: 'Failed to fetch tasks', tasksLoading: false });
      }
    } catch (error) {
      set({ tasksError: (error as Error).message, tasksLoading: false });
    }
  },
  
  fetchUndoneTasks: async (projectId: string) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await projectAPI.getUndoneTasks(projectId);
      if (response.success) {
        set({ tasks: response.tasks, tasksLoading: false });
      } else {
        set({ tasksError: 'Failed to fetch undone tasks', tasksLoading: false });
      }
    } catch (error) {
      set({ tasksError: (error as Error).message, tasksLoading: false });
    }
  },
  
  fetchAllUserTasks: async () => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await taskAPI.getAllUserTasks();
      if (response.success) {
        set({ userTasks: response.tasks, tasksLoading: false });
      } else {
        set({ tasksError: 'Failed to fetch user tasks', tasksLoading: false });
      }
    } catch (error) {
      set({ tasksError: (error as Error).message, tasksLoading: false });
    }
  },
  
  fetchUserTasks: async (options: {
    from?: number;
    to?: number;
    status?: 'todo' | 'in-progress' | 'done' | 'cancelled';
    priority?: 'no-priority' | 'low' | 'medium' | 'high' | 'urgent';
    projectId?: string;
  }) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await taskAPI.getUserTasks(options);
      if (response.success) {
        set({ userTasks: response.tasks, tasksLoading: false });
      } else {
        set({ tasksError: 'Failed to fetch user tasks', tasksLoading: false });
      }
    } catch (error) {
      set({ tasksError: (error as Error).message, tasksLoading: false });
    }
  },
  
  createTask: async (data: any) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await taskAPI.create(data);
      if (response.success) {
        // Refresh the tasks list
        const projectId = data.projectId;
        get().fetchProjectTasks(projectId);
      } else {
        set({ tasksError: 'Failed to create task', tasksLoading: false });
      }
    } catch (error) {
      set({ tasksError: (error as Error).message, tasksLoading: false });
    }
  },
  
  updateTask: async (id: string, data: any) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await taskAPI.update(id, data);
      if (response.success) {
        // Refresh the tasks list using the current project
        const currentProject = get().currentProject;
        if (currentProject) {
          get().fetchProjectTasks(currentProject._id);
        }
        return get().fetchTaskById(id);
      } else {
        set({ tasksError: 'Failed to update task', tasksLoading: false });
      }
    } catch (error) {
      set({ tasksError: (error as Error).message, tasksLoading: false });
    }
  },
  
  deleteTask: async (id: string) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await taskAPI.delete(id);
      if (response.success) {
        // Refresh the tasks list using the current project
        const currentProject = get().currentProject;
        if (currentProject) {
          get().fetchProjectTasks(currentProject._id);
        }
      } else {
        set({ tasksError: 'Failed to delete task', tasksLoading: false });
      }
    } catch (error) {
      set({ tasksError: (error as Error).message, tasksLoading: false });
    }
  },
  
  assignTask: async (taskId: string, userId: string) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await taskAPI.assign(taskId, userId);
      if (response.success) {
        // Refresh the tasks list using the current project
        const currentProject = get().currentProject;
        if (currentProject) {
          get().fetchProjectTasks(currentProject._id);
        }
      } else {
        set({ tasksError: 'Failed to assign task', tasksLoading: false });
      }
    } catch (error) {
      set({ tasksError: (error as Error).message, tasksLoading: false });
    }
  },
  
  changeTaskStatus: async (taskId: string, status: 'todo' | 'in-progress' | 'done' | 'cancelled') => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await taskAPI.changeStatus(taskId, status);
      if (response.success) {
        // Refresh the tasks list using the current project
        const currentProject = get().currentProject;
        if (currentProject) {
          get().fetchProjectTasks(currentProject._id);
        }
      } else {
        set({ tasksError: 'Failed to change task status', tasksLoading: false });
      }
    } catch (error) {
      set({ tasksError: (error as Error).message, tasksLoading: false });
    }
  },
  
  // Task-specific actions
  fetchTaskById: async (taskId: string) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await taskAPI.getById(taskId);
      if (response.success) {
        return response.task;
      } else {
        set({ tasksError: 'Failed to fetch task', tasksLoading: false });
        throw new Error('Failed to fetch task');
      }
    } catch (error) {
      set({ tasksError: (error as Error).message, tasksLoading: false });
      throw error;
    } finally {
      set({ tasksLoading: false });
    }
  },
  
  startWorkingOnTask: async (taskId: string) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await taskAPI.changeStatus(taskId, 'in-progress');
      if (response.success) {
        return response.task;
      } else {
        set({ tasksError: 'Failed to start working on task', tasksLoading: false });
        throw new Error('Failed to start working on task');
      }
    } catch (error) {
      set({ tasksError: (error as Error).message, tasksLoading: false });
      throw error;
    } finally {
      set({ tasksLoading: false });
    }
  },
  
  submitTask: async (taskId: string, message: string) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await taskAPI.submitTask(taskId, message);
      if (response.success) {
        return response.task;
      } else {
        set({ tasksError: 'Failed to submit task', tasksLoading: false });
        throw new Error('Failed to submit task');
      }
    } catch (error) {
      set({ tasksError: (error as Error).message, tasksLoading: false });
      throw error;
    } finally {
      set({ tasksLoading: false });
    }
  },
  
  rejectTask: async (taskId: string, message: string) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await taskAPI.rejectTask(taskId, message);
      if (response.success) {
        return response.task;
      } else {
        set({ tasksError: 'Failed to reject task', tasksLoading: false });
        throw new Error('Failed to reject task');
      }
    } catch (error) {
      set({ tasksError: (error as Error).message, tasksLoading: false });
      throw error;
    } finally {
      set({ tasksLoading: false });
    }
  },
  
  // Comment actions
  getTaskComments: async (taskId: string) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await taskAPI.getComments(taskId);
      if (response.success) {
        return response.comments;
      } else {
        set({ tasksError: 'Failed to fetch comments', tasksLoading: false });
        throw new Error('Failed to fetch comments');
      }
    } catch (error) {
      set({ tasksError: (error as Error).message, tasksLoading: false });
      throw error;
    } finally {
      set({ tasksLoading: false });
    }
  },

  createComment: async (taskId: string, content: string) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await taskAPI.addComment(taskId, content);
      if (response.success) {
        return response.task;
      } else {
        set({ tasksError: 'Failed to add comment', tasksLoading: false });
        throw new Error('Failed to add comment');
      }
    } catch (error) {
      set({ tasksError: (error as Error).message, tasksLoading: false });
      throw error;
    } finally {
      set({ tasksLoading: false });
    }
  },
  
  // Issue actions
  getTaskIssues: async (taskId: string) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await taskAPI.getIssues(taskId);
      if (response.success) {
        return response.issues;
      } else {
        set({ tasksError: 'Failed to fetch issues', tasksLoading: false });
        throw new Error('Failed to fetch issues');
      }
    } catch (error) {
      set({ tasksError: (error as Error).message, tasksLoading: false });
      throw error;
    } finally {
      set({ tasksLoading: false });
    }
  },

  createIssue: async (taskId: string, issueData: { title: string; description: string }) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await taskAPI.addIssue(taskId, issueData);
      if (response.success) {
        return response.task;
      } else {
        set({ tasksError: 'Failed to add issue', tasksLoading: false });
        throw new Error('Failed to add issue');
      }
    } catch (error) {
      set({ tasksError: (error as Error).message, tasksLoading: false });
      throw error;
    } finally {
      set({ tasksLoading: false });
    }
  },
  
  updateIssueStatus: async (taskId: string, issueId: string, status: string) => {
    set({ tasksLoading: true, tasksError: null });
    try {
      const response = await taskAPI.updateIssueStatus(taskId, issueId, status);
      if (response.success) {
        return response.task;
      } else {
        set({ tasksError: 'Failed to update issue status', tasksLoading: false });
        throw new Error('Failed to update issue status');
      }
    } catch (error) {
      set({ tasksError: (error as Error).message, tasksLoading: false });
      throw error;
    } finally {
      set({ tasksLoading: false });
    }
  },
})); 