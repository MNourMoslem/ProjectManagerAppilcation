import { PrimaryButton } from '../components/buttons';
import { Link, useNavigate } from 'react-router-dom';
import { Card, StatCard } from '../components/cards';
import { useEffect, useState } from 'react';
import { projectAPI, taskAPI } from '../api/projectApi';
import { Project, Task } from '../interfaces/interfaces';
import { format, formatDistanceToNow, isBefore, addDays, isAfter } from 'date-fns';
import { useAuthStore } from '../store/authStore';
import Modal from '../components/modals/Modal';
import { ProjectForm, ProjectFormData } from '../components/forms/ProjectForm';
import { useProjectStore } from '../store/projectStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // State variables for dashboard data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    activeTasks: 0,
    overdueTasks: 0,
    upcomingDeadlines: 0
  });
  const [urgentTasks, setUrgentTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [recentActivity, setRecentActivity] = useState<{
    task: Task;
    action: string;
    time: string;
  }[]>([]);
  
  // Project creation modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get priority color for tasks
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-500 dark:text-red-400';
      case 'high':
        return 'text-orange-500 dark:text-orange-400';
      case 'medium':
        return 'text-yellow-500 dark:text-yellow-400';
      case 'low':
        return 'text-green-500 dark:text-green-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  // Fetch data from the backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all user tasks
        const tasksResponse = await taskAPI.getAllUserTasks();
        const userTasks: Task[] = tasksResponse.tasks || [];
        
        // Fetch all projects
        const projectsResponse = await projectAPI.getAll();
        const userProjects: Project[] = projectsResponse.projects || [];
        
        setTasks(userTasks);
        setProjects(userProjects);
        
        // Process the data for dashboard display
        processData(userTasks, userProjects);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Process the data to get statistics and relevant information
  const processData = (userTasks: Task[], userProjects: Project[]) => {
    const now = new Date();
    
    // Count active projects
    const activeProjects = userProjects?.filter(project => 
      project.status === 'active'
    ).length;
    
    // Count active tasks (todo and in-progress)
    const activeTasks = userTasks?.filter(task => 
      task.status === 'todo' || task.status === 'in-progress'
    ).length;
    
    // Count overdue tasks
    const overdueTasks = userTasks?.filter(task => 
      task.dueDate && 
      isBefore(new Date(task.dueDate), now) && 
      (task.status === 'todo' || task.status === 'in-progress')
    ).length;
    
    // Count upcoming deadlines (due in the next 7 days)
    const nextWeek = addDays(now, 7);
    const upcomingDeadlines = userTasks?.filter(task => 
      task.dueDate && 
      isAfter(new Date(task.dueDate), now) && 
      isBefore(new Date(task.dueDate), nextWeek) && 
      (task.status === 'todo' || task.status === 'in-progress')
    ).length;
    
    // Set overall stats
    setStats({
      activeProjects,
      activeTasks,
      overdueTasks,
      upcomingDeadlines
    });
    
    // Get urgent tasks (high priority or urgent)
    const urgent = userTasks
      .filter(task => 
        (task.priority === 'high' || task.priority === 'urgent') && 
        (task.status === 'todo' || task.status === 'in-progress')
      )
      .sort((a, b) => {
        // Sort by priority first (urgent > high)
        if (a.priority !== b.priority) {
          return a.priority === 'urgent' ? -1 : 1;
        }
        // Then by due date if available
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        return 0;
      })
      .slice(0, 5); // Take the top 5
    
    setUrgentTasks(urgent);
    
    // Get upcoming tasks (due in the next 7 days)
    const upcoming = userTasks
      .filter(task => 
        task.dueDate && 
        isAfter(new Date(task.dueDate), now) && 
        isBefore(new Date(task.dueDate), nextWeek) && 
        (task.status === 'todo' || task.status === 'in-progress')
      )
      .sort((a, b) => 
        new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
      )
      .slice(0, 5); // Take the top 5
    
    setUpcomingTasks(upcoming);
    
    // Get recent activity based on task updates
    const recentActivityData = userTasks
      .filter(task => task.updatedAt)
      .sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 5) // Take the most recent 5
      .map(task => {
        let action = 'updated';
        
        if (task.status === 'done') {
          action = 'completed';
        } else if (task.createdAt === task.updatedAt) {
          action = 'created';
        }
        
        return {
          task,
          action,
          time: formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })
        };
      });
    
    setRecentActivity(recentActivityData);
  };  // Handle project creation
  const handleCreateProject = (data: ProjectFormData) => {
    setIsSubmitting(true);
    
    projectAPI.create(data)
      .then(() => {
        setIsCreateModalOpen(false);
        // Refresh projects data
        return projectAPI.getAll();
      })
      .then((response) => {
        setProjects(response.data || []);
        // Reprocess data with new projects
        processData(tasks, response.data || []);
      })
      .catch((err) => {
        console.error('Error creating project:', err);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Format for stat cards
  const formattedStats = [
    { 
      label: 'Active Projects', 
      value: stats.activeProjects.toString(),
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    },
    { 
      label: 'Active Tasks', 
      value: stats.activeTasks.toString(),
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    },
    { 
      label: 'Overdue Tasks', 
      value: stats.overdueTasks.toString(),
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>,
      trend: stats.overdueTasks > 0 ? { value: stats.overdueTasks, isPositive: false } : undefined
    },
    { 
      label: 'Upcoming Deadlines', 
      value: stats.upcomingDeadlines.toString(),
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, {user?.name || 'User'}. Here's an overview of your workspace.
          </p>
        </div>        <div className="flex gap-2">
          <PrimaryButton 
            text="New Project"
            icon={<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 4v16m8-8H4" /></svg>}
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
          />
        </div>
      </div>

      {/* Project Creation Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
        primaryAction={{
          text: "Create Project",
          onClick: () => document.getElementById('project-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })),
          loading: isSubmitting,
          disabled: isSubmitting
        }}
        secondaryAction={{
          text: "Cancel",
          onClick: () => setIsCreateModalOpen(false),
          disabled: isSubmitting
        }}
      >
        <div id="project-form">
          <ProjectForm
            onSubmit={handleCreateProject}
            isSubmitting={isSubmitting}
          />
        </div>
      </Modal>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {formattedStats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        <Card title="Recent Activity" footer={
          <Link to="/app/tasks" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            View all tasks →
          </Link>
        }>
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Loading activity...</p>
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-6 h-6 mt-0.5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">
                    {activity.task.assignedTo && activity.task.assignedTo.length > 0 && typeof activity.task.assignedTo[0] === 'object' 
                      ? activity.task.assignedTo[0].name.charAt(0) 
                      : 'U'}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs md:text-sm">
                      <span className="font-medium">
                        {activity.task.assignedTo && activity.task.assignedTo.length > 0 && typeof activity.task.assignedTo[0] === 'object'
                          ? activity.task.assignedTo[0].name
                          : 'User'}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400"> {activity.action} </span>
                      <span 
                        className="font-medium cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
                        onClick={() => navigate(`/app/tasks/${activity.task._id}`)}
                      >
                        {activity.task.title}
                      </span>
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-500">No recent activity found.</p>
            </div>
          )}
        </Card>

        {/* Upcoming Deadlines */}
        <Card title="Upcoming Deadlines" footer={
          <Link to="/app/tasks" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            View all deadlines →
          </Link>
        }>
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Loading deadlines...</p>
            </div>
          ) : upcomingTasks.length > 0 ? (
            <div className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => navigate(`/app/tasks/${task._id}`)}
                >
                  <div>
                    <p className="text-xs md:text-sm font-medium">{task.title}</p>
                    <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                      {projects.find(p => p._id === task.project)?.name || 'Unknown Project'}
                    </p>
                  </div>
                  <div className="text-xs md:text-sm text-orange-500 dark:text-orange-400 font-medium">
                    {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'No due date'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-500">No upcoming deadlines found.</p>
            </div>
          )}
        </Card>
      </div>

      {/* Urgent Tasks */}
      <Card title="High Priority Tasks" className="mb-8" footer={
        <Link to="/app/tasks" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          View all tasks →
        </Link>
      }>
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading urgent tasks...</p>
          </div>
        ) : urgentTasks.length > 0 ? (
          <div className="space-y-3">
            {urgentTasks.map((task, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => navigate(`/app/tasks/${task._id}`)}
              >
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${task.priority === 'urgent' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                  <div>
                    <p className="text-xs md:text-sm font-medium">{task.title}</p>
                    <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
                      {projects.find(p => p._id === task.project)?.name || 'Unknown Project'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`text-xs font-medium ${getPriorityColor(task.priority)} mr-3`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                  {task.dueDate && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Due {format(new Date(task.dueDate), 'MMM dd')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-sm text-gray-500">No urgent tasks found.</p>
          </div>
        )}
      </Card>

      {/* Project Overview */}
      <Card title="Project Overview" className="mb-8" footer={
        <Link to="/app/projects" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          View all projects →
        </Link>
      }>
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading projects...</p>
          </div>
        ) : projects.length > 0 ? (
          <div className="space-y-4">
            {projects.filter(p => p.status === 'active').slice(0, 3).map((project, index) => (
              <div 
                key={index} 
                className="p-3 border border-gray-100 dark:border-gray-800 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => navigate(`/app/projects/${project._id}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm md:text-base font-medium">{project.name}</h3>
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                    {project.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">
                  {project.shortDescription || 'No description provided'}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {project.members?.length || 0} members
                  </div>
                  {project.targetDate && (
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Target: {format(new Date(project.targetDate), 'MMM dd, yyyy')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-sm text-gray-500">No active projects found.</p>
            <Link 
              to="/app/projects/new"
              className="mt-2 inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 4v16m8-8H4" />
              </svg>
              Create a new project
            </Link>
          </div>
        )}
      </Card>

      {/* Quick Links */}
      <Card title="Quick Links">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/app/projects" className="flex flex-col items-center justify-center p-4 border border-gray-100 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span className="text-xs md:text-sm font-medium">Projects</span>
          </Link>
          <Link to="/app/tasks" className="flex flex-col items-center justify-center p-4 border border-gray-100 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span className="text-xs md:text-sm font-medium">Tasks</span>
          </Link>
          <Link to="/app/inbox" className="flex flex-col items-center justify-center p-4 border border-gray-100 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs md:text-sm font-medium">Inbox</span>
          </Link>
          <Link to="/app/tasks" className="flex flex-col items-center justify-center p-4 border border-gray-100 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs md:text-sm font-medium">My Tasks</span>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
