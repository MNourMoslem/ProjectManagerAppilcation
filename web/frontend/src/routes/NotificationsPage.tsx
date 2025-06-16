import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/cards';
import { format, formatDistanceToNow } from 'date-fns';
import { useNotificationStore } from '../store/notificationStore';
import type { Notification } from '../store/notificationStore';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    totalCount,
    isLoading, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotificationStore();
  
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  // Initial fetch
  useEffect(() => {
    if (activeTab === 'all') {
      fetchNotifications(20, 0, false);
    } else {
      fetchNotifications(20, 0, true);
    }
  }, [activeTab, fetchNotifications]);
  
  // Handle notification click
  const handleNotificationClick = (notificationId: string, actionUrl?: string) => {
    markAsRead(notificationId);
    
    if (actionUrl) {
      navigate(actionUrl);
    }
  };
  
  // Group notifications by date
  const groupNotificationsByDate = () => {
    const groups: { [key: string]: Notification[] } = {};
    
    notifications.forEach(notification => {
      const date = format(new Date(notification.createdAt), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });
    
    return Object.entries(groups).map(([date, notifications]) => ({
      date,
      formattedDate: format(new Date(date), 'MMMM d, yyyy'),
      notifications
    }));
  };
  
  const groupedNotifications = groupNotificationsByDate();
  
  // Get notification icon based on type
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'task_assigned':
      case 'task_status_changed':
        return (
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-500 dark:text-blue-300">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        );
      case 'task_completed':
        return (
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-500 dark:text-green-300">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'project_update':
      case 'project_invite':
      case 'project_removed':
        return (
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-500 dark:text-purple-300">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
        );
      case 'comment_added':
        return (
          <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center text-yellow-500 dark:text-yellow-300">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        );
      case 'deadline_approaching':
        return (
          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-500 dark:text-orange-300">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'issue_created':
      case 'issue_resolved':
        return (
          <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center text-red-500 dark:text-red-300">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
            Stay updated with project activities and system updates
          </p>
        </div>
        <button 
          onClick={() => markAllAsRead()}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
        >
          Mark all as read
        </button>
      </div>
        
      {/* Notification tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 text-sm font-medium relative ${
              activeTab === 'all'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            All Notifications
            <span className="ml-2 text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
              {totalCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`py-2 px-1 text-sm font-medium relative ${
              activeTab === 'unread'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Unread
            <span className="ml-2 text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
              {unreadCount}
            </span>
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          {notifications.length === 0 ? (
            <Card>
              <div className="py-16 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No notifications</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  {activeTab === 'all' 
                    ? "You don't have any notifications yet. They will appear here when they arrive."
                    : "You don't have any unread notifications."}
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-8">
              {groupedNotifications.map(group => (
                <div key={group.date}>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-3">{group.formattedDate}</h3>
                  <Card>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      {group.notifications.map(notification => (
                        <div 
                          key={notification._id}
                          className={`flex items-start p-4 ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        >
                          {getNotificationIcon(notification.type)}
                          <div className="ml-4 flex-1">
                            <div className="flex items-start justify-between">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{notification.description}</p>
                            {notification.actionUrl && (
                              <button 
                                onClick={() => handleNotificationClick(notification._id, notification.actionUrl)}
                                className="mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                              >
                                View details
                              </button>
                            )}
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full ml-2 mt-2"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationsPage;
