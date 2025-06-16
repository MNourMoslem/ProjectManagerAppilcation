import { FC } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Project, ProjectDetails } from '../../interfaces/interfaces';
import LoadingIndicator from '../progress/LoadingIndicator';

interface ProjectCardProps
{
  project?: Project;
  details?: ProjectDetails;
  loading?: boolean;
}

const ProjectCard: FC<ProjectCardProps> = ({
  project, 
  details,
  loading = false
}) => {  // Show skeleton loader when loading is true
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="h-2 w-full bg-gray-300 dark:bg-gray-600"></div>
        <div className="p-5">
          <div className="flex flex-col items-center justify-center py-8">
            <LoadingIndicator type="spinner" size="lg" variant="primary" className="mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // If not loading but project data is not available, show empty state
  if (!project || !details) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-5 text-center">
          <p className="text-gray-500 dark:text-gray-400">Project information unavailable</p>
        </div>
      </div>
    );
  }

  // Calculate progress percentage
  const { _id, name, shortDescription, status, targetDate } = project;
  
  const membersCount = project.members?.length || 0;
  
  const tasksCount = Object.values(details.taskCounts || {}).reduce((acc, count) => acc + (count || 0), 0);
  const completedTasksCount = details.taskCounts?.['done'] || 0;
  const progress = tasksCount > 0 ? Math.round((completedTasksCount / tasksCount) * 100) : 0;
  
  // Determine status color
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
    completed: 'bg-blue-100 text-blue-800',
  };
  
  // Format target date if exists
  const formattedDate = targetDate ? format(new Date(targetDate), 'PP') : 'No target date';
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className={`h-2 w-full ${status === 'active' ? 'bg-indigo-500' : status === 'completed' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">{name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[status]}`}>
            {status?.charAt(0).toUpperCase() + status?.slice(1)}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {shortDescription || 'No description provided'}
        </p>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <div 
            className="bg-indigo-600 h-2 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            {completedTasksCount}/{tasksCount} tasks
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {membersCount} members
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600">
        <Link 
          to={`/app/projects/${_id}`}
          className="w-full inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          View Project
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
