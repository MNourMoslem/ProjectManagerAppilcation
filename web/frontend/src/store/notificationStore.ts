import { create } from 'zustand';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5000/api';

export interface Notification {
  _id: string;
  type: 'task_assigned' | 'task_completed' | 'task_status_changed' | 
         'project_invite' | 'project_update' | 'project_removed' |
         'deadline_approaching' | 'comment_added' | 
         'issue_created' | 'issue_resolved' | 'system';
  title: string;
  description: string;
  read: boolean;
  projectId?: string;
  taskId?: string;
  issueId?: string;
  commentId?: string;
  actionUrl?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  totalCount: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchNotifications: (limit?: number, offset?: number, unreadOnly?: boolean) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  totalCount: 0,
  isLoading: false,
  error: null,
  fetchNotifications: async (limit = 20, offset = 0, unreadOnly = false) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      console.log('Fetching notifications with params:', { limit, offset, unreadOnly });
      const response = await axios.get(`${API_URL}/notifications`, {
        params: { limit, offset, unreadOnly },
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Notification API response:', response.data);
      
      if (response.data.success) {
        set({ 
          notifications: response.data.notifications,
          unreadCount: response.data.unreadCount,
          totalCount: response.data.total,
          isLoading: false 
        });
      } else {
        set({ error: 'Failed to fetch notifications', isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch notifications', 
        isLoading: false 
      });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(`${API_URL}/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        set({ unreadCount: response.data.unreadCount });
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.put(
        `${API_URL}/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Update the notification in the store
        set(state => ({
          notifications: state.notifications.map(notification =>
            notification._id === notificationId 
              ? { ...notification, read: true } 
              : notification
          ),
          unreadCount: Math.max(0, state.unreadCount - 1)
        }));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.put(
        `${API_URL}/notifications/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Update all notifications in the store
        set(state => ({
          notifications: state.notifications.map(notification => ({ 
            ...notification, 
            read: true 
          })),
          unreadCount: 0
        }));
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  },

  deleteNotification: async (notificationId: string) => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.delete(
        `${API_URL}/notifications/${notificationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Remove the notification from the store
        const notification = get().notifications.find(n => n._id === notificationId);
        const wasUnread = notification && !notification.read;
        
        set(state => ({
          notifications: state.notifications.filter(notification => 
            notification._id !== notificationId
          ),
          unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
          totalCount: Math.max(0, state.totalCount - 1)
        }));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }
}));
