import { apiRequest } from './apiUtils';

// Project API calls - matching the web frontend structure
export const projectAPI = {
  // Get all projects
  getAll: async () => {
    return apiRequest('/projects');
  },
  
  // Get all projects with details
  getAllWithDetails: async () => {
    return apiRequest('/projects/with-details');
  },
  
  // Get a single project
  getById: async (id: string) => {
    return apiRequest(`/projects/${id}`);
  },

  // Get project details
  getDetails: async (id: string) => {
    return apiRequest(`/projects/${id}/details`);
  },
  
  // Get a project with its details
  getWithDetails: async (id: string) => {
    return apiRequest(`/projects/${id}/with-details`);
  },
  
  // Create a new project
  create: async (data: any) => {
    return apiRequest('/projects', 'POST', data);
  },
  
  // Update a project
  update: async (id: string, data: any) => {
    return apiRequest(`/projects/${id}`, 'PUT', data);
  },
  
  // Delete a project
  delete: async (id: string) => {
    return apiRequest(`/projects/${id}`, 'DELETE');
  },
  
  // Get project members
  getMembers: async (id: string) => {
    return apiRequest(`/projects/${id}/members`);
  },
  
  // Remove a member from a project
  removeMember: async (projectId: string, memberId: string) => {
    return apiRequest(`/projects/${projectId}/members/${memberId}`, 'DELETE');
  },
  
  // Leave a project (current user)
  leaveProject: async (projectId: string) => {
    return apiRequest(`/projects/${projectId}/leave`, 'POST');
  },
  
  // Update a member's role in a project
  updateMemberRole: async (projectId: string, memberId: string, role: 'owner' | 'admin' | 'member') => {
    return apiRequest(`/projects/${projectId}/members/${memberId}/role`, 'PUT', { role });
  },
  
  // Get undone tasks for a project
  getUndoneTasks: async (id: string) => {
    return apiRequest(`/projects/${id}/undone-tasks`);
  },

  // Get user role in a project
  getUserRole: async (projectId: string) => {
    return apiRequest(`/projects/${projectId}/role`);
  },

  // Invite user to project
  inviteUser: async (projectId: string, userEmail: string, role: 'admin' | 'member') => {
    return apiRequest(`/projects/${projectId}/invite`, 'POST', { userEmail, role });
  }
};

// Task API calls
export const taskAPI = {
  // Get all tasks for a project
  getAllForProject: async (projectId: string) => {
    return apiRequest(`/tasks?projectId=${projectId}`);
  },
  
  // Get all tasks assigned to the current user
  getAllUserTasks: async () => {
    return apiRequest('/tasks/user/all');
  },
  
  // Get filtered tasks assigned to the current user
  getUserTasks: async (options: {
    from?: number;
    to?: number;
    status?: string | string[];
    priority?: string | string[];
    projectId?: string | string[];
  }) => {
    const queryParams = new URLSearchParams();
    
    if (options.from !== undefined) queryParams.append('from', options.from.toString());
    if (options.to !== undefined) queryParams.append('to', options.to.toString());
    
    if (options.status) {
      if (Array.isArray(options.status)) {
        queryParams.append('status', options.status.join(','));
      } else {
        queryParams.append('status', options.status);
      }
    }
    
    if (options.priority) {
      if (Array.isArray(options.priority)) {
        queryParams.append('priority', options.priority.join(','));
      } else {
        queryParams.append('priority', options.priority);
      }
    }
    
    if (options.projectId) {
      if (Array.isArray(options.projectId)) {
        queryParams.append('projectId', options.projectId.join(','));
      } else {
        queryParams.append('projectId', options.projectId);
      }
    }
    
    return apiRequest(`/tasks/user?${queryParams.toString()}`);
  },
  
  // Get a single task
  getById: async (id: string) => {
    return apiRequest(`/tasks/${id}`);
  },
  
  // Create a new task
  create: async (data: any) => {
    return apiRequest('/tasks', 'POST', data);
  },
  
  // Update a task
  update: async (id: string, data: any) => {
    return apiRequest(`/tasks/${id}`, 'PUT', data);
  },
  
  // Delete a task
  delete: async (id: string) => {
    return apiRequest(`/tasks/${id}`, 'DELETE');
  },
  
  // Assign a task to a user
  assign: async (taskId: string, userId: string) => {
    return apiRequest(`/tasks/${taskId}/assign`, 'POST', { userId });
  },
  
  // Unassign a task from a user
  unassign: async (taskId: string, userId: string) => {
    return apiRequest(`/tasks/${taskId}/unassign`, 'POST', { userId });
  },
  
  // Change a task's status
  changeStatus: async (taskId: string, status: 'todo' | 'in-progress' | 'done' | 'cancelled') => {
    return apiRequest(`/tasks/${taskId}/status`, 'POST', { status });
  },
  
  // Submit a task (mark as done with submission message)
  submitTask: async (taskId: string, message: string, files?: string[]) => {
    return apiRequest(`/tasks/${taskId}/submit`, 'POST', { message, type: 'submition', files });
  },
  
  // Reject a task (keep as in-progress with rejection message)
  rejectTask: async (taskId: string, message: string, files?: string[]) => {
    return apiRequest(`/tasks/${taskId}/submit`, 'POST', { message, type: 'rejection', files });
  },

  // Get comments for a task
  getComments: async (taskId: string) => {
    return apiRequest(`/tasks/${taskId}/comments`);
  },

  // Add a comment to a task
  addComment: async (taskId: string, content: string) => {
    return apiRequest(`/tasks/${taskId}/comments`, 'POST', { content });
  },
  
  // Get Issues for a task
  getIssues: async (taskId: string) => {
    return apiRequest(`/tasks/${taskId}/issues`);
  },

  // Add an issue to a task
  addIssue: async (taskId: string, issueData: { title: string, description: string }) => {
    return apiRequest(`/tasks/${taskId}/issues`, 'POST', issueData);
  },
  
  // Update an issue status
  updateIssueStatus: async (taskId: string, issueId: string, status: string) => {
    return apiRequest(`/tasks/${taskId}/issues/${issueId}/status`, 'PUT', { status });
  },
};

// User API calls - matching the web frontend structure
export const userAPI = {
  // Get user by email
  getByEmail: async (email: string) => {
    return apiRequest(`/auth/search-user?email=${encodeURIComponent(email)}`);
  },
  
  // Get last searched users
  getLastSearchedUsers: async () => {
    return apiRequest('/auth/last-searched-users');
  },
}; 