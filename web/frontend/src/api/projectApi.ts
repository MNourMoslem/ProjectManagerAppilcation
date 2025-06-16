import { ProjectFormData } from '../components/forms/ProjectForm';
import { TaskFormData } from '../components/forms/TaskForm';
import { apiCall } from './apiUtils';

export const userAPI = {
  // Get user by email
  getByEmail: async (email: string) => {
    return apiCall(`/auth/search-user?email=${encodeURIComponent(email)}`);
  },
  
  // Get last searched users
  getLastSearchedUsers: async () => {
    return apiCall('/auth/last-searched-users');
  },
}

// Project API calls
export const projectAPI = {
  // Get all projects
  getAll: async () => {
    return apiCall('/projects');
  },
  
  // Get all projects with details
  getAllWithDetails: async () => {
    return apiCall('/projects/with-details');
  },
  
  // Get a single project
  getById: async (id: string) => {
    return apiCall(`/projects/${id}`);
  },

  // Get project details
  getDetails: async (id: string) => {
    return apiCall(`/projects/${id}/details`);
  },
  
  // Get a project with its details
  getWithDetails: async (id: string) => {
    return apiCall(`/projects/${id}/with-details`);
  },
  
  // Create a new project
  create: async (data: ProjectFormData) => {
    return apiCall('/projects', 'POST', data);
  },
  
  // Update a project
  update: async (id: string, data: ProjectFormData) => {
    return apiCall(`/projects/${id}`, 'PUT', data);
  },
  
  // Delete a project
  delete: async (id: string) => {
    return apiCall(`/projects/${id}`, 'DELETE');
  },
  
  // Get project members
  getMembers: async (id: string) => {
    return apiCall(`/projects/${id}/members`);
  },
  
  // Remove a member from a project
  removeMember: async (projectId: string, memberId: string) => {
    return apiCall(`/projects/${projectId}/members/${memberId}`, 'DELETE');
  },
  
  // Leave a project (current user)
  leaveProject: async (projectId: string) => {
    return apiCall(`/projects/${projectId}/leave`, 'POST');
  },
  
  // Update a member's role in a project
  updateMemberRole: async (projectId: string, memberId: string, role: 'owner' | 'admin' | 'member') => {
    return apiCall(`/projects/${projectId}/members/${memberId}/role`, 'PUT', { role });
  },
  
  // Get undone tasks for a project
  getUndoneTasks: async (id: string) => {
    return apiCall(`/projects/${id}/undone-tasks`);
  },

  // Get user role in a project
  getUserRole: async (projectId: string) => {
    return apiCall(`/projects/${projectId}/role`);
  },
};

// Task API calls
export const taskAPI = {
  // Get all tasks for a project
  getAllForProject: async (projectId: string) => {
    return apiCall(`/tasks?projectId=${projectId}`);
  },
  
  // Get all tasks assigned to the current user
  getAllUserTasks: async () => {
    return apiCall('/tasks/user/all');
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
    
    return apiCall(`/tasks/user?${queryParams.toString()}`);
  },
  
  // Get a single task
  getById: async (id: string) => {
    return apiCall(`/tasks/${id}`);
  },
  
  // Create a new task
  create: async (data: TaskFormData & { projectId: string }) => {
    return apiCall('/tasks', 'POST', data);
  },
  
  // Update a task
  update: async (id: string, data: Partial<TaskFormData>) => {
    return apiCall(`/tasks/${id}`, 'PUT', data);
  },
  
  // Delete a task
  delete: async (id: string) => {
    return apiCall(`/tasks/${id}`, 'DELETE');
  },
  
  // Assign a task to a user
  assign: async (taskId: string, userId: string) => {
    return apiCall(`/tasks/${taskId}/assign`, 'POST', { userId });
  },
  
  // Unassign a task from a user
  unassign: async (taskId: string, userId: string) => {
    return apiCall(`/tasks/${taskId}/unassign`, 'POST', { userId });
  },
  
  // Change a task's status
  changeStatus: async (taskId: string, status: 'todo' | 'in-progress' | 'done' | 'cancelled') => {
    return apiCall(`/tasks/${taskId}/status`, 'POST', { status });
  },
  
  // Submit a task (mark as done with submission message)
  submitTask: async (taskId: string, message: string) => {
    return apiCall(`/tasks/${taskId}/submit`, 'POST', { message });
  },
  
  // Reject a task (keep as in-progress with rejection message)
  rejectTask: async (taskId: string, message: string) => {
    return apiCall(`/tasks/${taskId}/reject`, 'POST', { message });
  },

  // Get comments for a task
  getComments: async (taskId: string) => {
    return apiCall(`/tasks/${taskId}/comments`);
  },

  // Add a comment to a task
  addComment: async (taskId: string, content: string) => {
    return apiCall(`/tasks/${taskId}/comments`, 'POST', { content });
  },
  
  // Get Issues for a task
  getIssues: async (taskId: string) => {
    return apiCall(`/tasks/${taskId}/issues`);
  },

  // Add an issue to a task
  addIssue: async (taskId: string, issueData: { title: string, description: string }) => {
    return apiCall(`/tasks/${taskId}/issues`, 'POST', issueData);
  },
  
  // Update an issue status
  updateIssueStatus: async (taskId: string, issueId: string, status: string) => {
    return apiCall(`/tasks/${taskId}/issues/${issueId}/status`, 'PUT', { status });
  },
};


export const mailApi = {
  // Send a test email  // Send a test email
  sendTestEmail: async (email: string) => {
    return apiCall('/mails/test', 'POST', { email });
  },

  // Send an email to a user
  sendEmailToUser: async (userId: string, subject: string, content: string) => {
    return apiCall(`/mails/user/${userId}`, 'POST', { subject, content });
  },
    // Get received mails
  getReceived: async () => {
    return apiCall('/mails/received');
  },
  
  // Get sent mails
  getSent: async () => {
    return apiCall('/mails/sent');
  },
  
  // Mark mail as read
  markAsRead: async (mailId: string) => {
    return apiCall(`/mails/read/${mailId}`, 'PATCH');
  },
  
  // Accept invitation
  acceptInvite: async (mailId: string) => {
    return apiCall('/mails/accept-invite', 'POST', { mailId });
  },

  // Reject invitation
  declineInvite: async (mailId: string) => {
    return apiCall('/mails/decline-invite', 'POST', { mailId });
  },
  
  // Delete mail
  delete: async (mailId: string) => {
    return apiCall(`/mails/${mailId}`, 'DELETE');
  },
  
  // Send custom email
  sendCustom: async (emailData: {
    recipients: string[];
    subject: string;
    body: string;
    type: string;
    projectId?: string;
  }) => {
    return apiCall('/mails/send-custom', 'POST', emailData);
  },
  
  // Send invite email
  sendInvite: async (projectId : String, userEmail : String, role : String) => {
    return apiCall('/mails/send-invite', 'POST', { projectId, userEmail, role });
  },
  
  // Update custom mail
  updateCustom: async (mailId: string, emailData: {
    subject: string;
    body: string;
  }) => {
    return apiCall(`/mails/update-custom/${mailId}`, 'PUT', emailData);
  },
  
  // Send an email to multiple users
  sendEmailToUsers: async (userIds: string[], subject: string, content: string) => {
    return apiCall('/mails/users', 'POST', { userIds, subject, content });
  }
};