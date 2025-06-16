import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Task, Project } from '../../interfaces/interfaces';

interface TaskCardProps {
  task: Task & { project?: Project | string };
  loading?: boolean;
}

const TaskCard: FC<TaskCardProps> = ({ task, loading = false }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="h-2 w-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="p-5">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-indigo-600 animate-spin mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading task...</p>
          </div>
        </div>
      </div>
    );
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'done':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Format date if exists
  const formattedDate = task.dueDate 
    ? format(new Date(task.dueDate), 'PP') 
    : 'No due date';
  // Calculate whether task is overdue
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  
  // Handle navigation to task details
  const navigateToTask = () => {
    navigate(`/app/tasks/${task._id}`);
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={navigateToTask}
    >
      <div className={`h-2 w-full ${getPriorityColor(task.priority)}`}></div>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">{task.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(task.status)}`}>
            {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </div>        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {task.description || 'No description provided'}
        </p>
          {task.project && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/app/projects/${typeof task.project === 'string' ? task.project : task.project?._id}`);
            }}
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block"
          >
            {typeof task.project === 'object' && task.project?.name ? task.project.name : 'View Project'}
          </button>
        )}
        
        {!task.project && task.projectId && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/app/projects/${task.projectId}`);
            }}
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block"
          >
            View Project
          </button>
        )}
        
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={isOverdue ? 'text-red-500 dark:text-red-400 font-medium' : ''}>
              {formattedDate}
              {isOverdue && ' (Overdue)'}
            </span>
          </div>
            {task.assignedTo && task.assignedTo.length > 0 && (
            <div className="flex -space-x-2 overflow-hidden">
              {task.assignedTo.slice(0, 3).map((user) => (
                <div 
                  key={typeof user === 'string' ? user : user._id} 
                  className="flex h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-200 dark:bg-gray-700 text-xs items-center justify-center overflow-hidden"
                >
                  {typeof user === 'object' && user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} />
                  ) : (
                    <span>{typeof user === 'object' ? user.name.charAt(0) : 'U'}</span>
                  )}
                </div>
              ))}
              {task.assignedTo.length > 3 && (
                <div className="flex h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-200 dark:bg-gray-700 text-xs items-center justify-center">
                  +{task.assignedTo.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
