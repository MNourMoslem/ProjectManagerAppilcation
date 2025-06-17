import { useState, useEffect, useMemo } from 'react';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import { Card, StatCard } from '../components/cards';
import { SecondaryButton } from '../components/buttons';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';
import { Task } from '../interfaces/interfaces';

const WorkspaceAnalyticsPage = () => {
  const { projects, tasks, projectsWithDetails, fetchAllUserTasks, fetchProjectsWithDetails } = useProjectStore();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const [isLoading, setIsLoading] = useState(true);

  const user = useAuthStore(state => state.user);  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      console.log("⏳ Starting to fetch analytics data...");
      try {
        await Promise.all([
          fetchAllUserTasks(),
          fetchProjectsWithDetails()
        ]);
        console.log("✅ Successfully fetched analytics data");
      } catch (error) {
        console.error("❌ Error loading analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };    
    loadData();
  }, [fetchAllUserTasks, fetchProjectsWithDetails]);
  // Calculate activity metrics from existing data
  const metrics = useMemo(() => {
    console.log("🔄 Running metrics calculation, isLoading:", isLoading, "tasks length:", tasks?.length || 0);
    
    if (isLoading || !tasks || tasks.length === 0) {
      console.log("⚠️ Cannot calculate metrics - data not ready");
      return null;
    }

    console.log("📊 Calculating metrics with", tasks.length, "tasks");

    // Calculate task completion rate
    const completedTasks = tasks.filter(task => task.status === 'done' && task.submitionMessage?.member._id === user?._id).length;
    const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    // Calculate tasks by priority
    const tasksByPriority = {
      urgent: tasks.filter(task => task.priority === 'urgent').length,
      high: tasks.filter(task => task.priority === 'high').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      low: tasks.filter(task => task.priority === 'low').length,
      noPriority: tasks.filter(task => task.priority === 'no-priority').length,
    };

    // Calculate tasks by status
    const tasksByStatus = {
      todo: tasks.filter(task => task.status === 'todo').length,
      inProgress: tasks.filter(task => task.status === 'in-progress').length,
      done: completedTasks,
    };

    // Find most active project (project with most tasks)
    const projectTaskCounts = projects.map(project => {
      const projectTasks = tasks.filter(task => task.project === project._id);
      return { 
        project, 
        taskCount: projectTasks.length,
        completedCount: projectTasks.filter(task => task.status === 'done' && task.submitionMessage?.member._id === user?._id).length
      };
    });

    const mostActiveProject = projectTaskCounts.sort((a, b) => b.taskCount - a.taskCount)[0];

    return {
      completionRate,
      tasksByPriority,
      tasksByStatus,
      mostActiveProject
    };
  }, [isLoading, tasks, projects, user?._id]);

  // Create weekly activity chart data
  const weeklyData = useMemo(() => {
    if (isLoading || !tasks) return [];

    const today = new Date();
    const startDay = startOfWeek(today, { weekStartsOn: 1 });
    const endDay = endOfWeek(today, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDay, end: endDay });

    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayStr = format(day, 'EEE');
      
      // Count tasks created on this day
      const tasksCreated = tasks ? tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return format(taskDate, 'yyyy-MM-dd') === dateStr;
      }).length : 0;
      
      // Count tasks completed on this day
      const tasksCompleted = tasks ? tasks.filter(task => {
        const taskDate = new Date(task.updatedAt);
        return format(taskDate, 'yyyy-MM-dd') === dateStr && task.status === 'done';
      }).length : 0;
      
      return { day: dayStr, date: dateStr, tasksCreated, tasksCompleted };
    });
  }, [isLoading, tasks]);

  // Get upcoming deadlines
  const upcomingDeadlines = useMemo(() => {
    if (isLoading || !tasks) return [];
    
    const upcoming = tasks
      .filter(task => task.status !== 'done' && task.dueDate)
      .sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      })
      .slice(0, 5);
    
    return upcoming.map(task => {
      const project = projects.find(p => p._id === task.project);
      return {
        ...task,
        projectName: project?.name || 'Unknown Project'
      };
    });
  }, [isLoading, tasks, projects]);

  // Get recent activity
  const recentActivity = useMemo(() => {
    if (isLoading || !tasks) return [];
    
    // Sort tasks by most recently updated
    return tasks
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map(task => {
        const project = projects.find(p => p._id === task.project);
        return {
          ...task,
          projectName: project?.name || 'Unknown Project',
          timeAgo: formatDistance(new Date(task.updatedAt), new Date(), { addSuffix: true })
        };
      });
  }, [isLoading, tasks, projects]);

  // Get team productivity
  const teamProductivity = useMemo(() => {
    if (isLoading || !tasks || !projects) return [];
    
    // Get unique team members from all projects
    const teamMembers = new Set();
    projects.forEach(project => {
      project.members?.forEach(member => {
        teamMembers.add(member._id);
      });
    });
    
    // Calculate productivity for each team member
    const productivity = Array.from(teamMembers).map(memberId => {
      const memberTasks = tasks.filter(task => 
        task.assignedTo?.some(user => user._id === memberId)
      );
      
      const completedTasks = memberTasks.filter(task => task.status === 'done').length;
      const inProgressTasks = memberTasks.filter(task => task.status === 'in-progress').length;
      const pendingTasks = memberTasks.filter(task => task.status === 'todo').length;
      
      // Find member details from any project
      let memberDetails = null;
      for (const project of projects) {
        const member = project.members?.find(m => m._id === memberId);
        if (member) {
          memberDetails = member;
          break;
        }
      }
      
      return {
        memberId,
        name: memberDetails?.name || 'Unknown User',
        completedTasks,
        inProgressTasks,
        pendingTasks,
        totalTasks: memberTasks.length,
        completionRate: memberTasks.length > 0 
          ? Math.round((completedTasks / memberTasks.length) * 100) 
          : 0
      };
    });
    
    // Sort by completion rate descending
    return productivity.sort((a, b) => b.completionRate - a.completionRate);
  }, [isLoading, tasks, projects]);

  // Function to get max value for chart scaling
  const maxChartValue = useMemo(() => {
    if (!weeklyData) return 10;
    const maxCreated = Math.max(...weeklyData.map(d => d.tasksCreated));
    const maxCompleted = Math.max(...weeklyData.map(d => d.tasksCompleted));
    return Math.max(maxCreated, maxCompleted, 5); // Minimum of 5 for scaling
  }, [weeklyData]);

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Workspace Analytics</h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
            Track team performance and project progress
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <SecondaryButton 
            text="Week" 
            size="sm" 
            onClick={() => setTimeframe('week')}
            className={timeframe === 'week' ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300' : ''}
          />
          <SecondaryButton 
            text="Month" 
            size="sm" 
            onClick={() => setTimeframe('month')}
            className={timeframe === 'month' ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300' : ''}
          />
          <SecondaryButton 
            text="Year" 
            size="sm" 
            onClick={() => setTimeframe('year')}
            className={timeframe === 'year' ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300' : ''}
          />
        </div>
      </div>
      { isLoading && tasks && tasks.length > 0? (
        <div className="flex flex-col justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Loading analytics data...</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Please wait while we fetch your workspace information</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Task Completion Rate"
              value={`${metrics?.completionRate || 0}%`}
              icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>}
              trend={metrics?.completionRate && metrics.completionRate > 50 ? 
                { value: metrics.completionRate - 50, isPositive: true } : 
                { value: 50 - (metrics?.completionRate || 0), isPositive: false }}
            />
            <StatCard
              label="Tasks in Progress"
              value={metrics?.tasksByStatus.inProgress?.toString() || '0'}
              icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>}
            />
            <StatCard
              label="High Priority Tasks"
              value={(metrics ? (metrics.tasksByPriority.urgent + metrics.tasksByPriority.high) : 0).toString()}
              icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>}
              trend={metrics?.tasksByPriority.urgent && metrics.tasksByPriority.urgent > 0 ? 
                { value: metrics.tasksByPriority.urgent, isPositive: false } : undefined}
            />
            <StatCard
              label="Completed Tasks"
              value={metrics?.tasksByStatus.done?.toString() || '0'}
              icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 13l4 4L19 7" />
              </svg>}
              trend={metrics?.tasksByStatus.done && metrics.tasksByStatus.done > 0 ? 
                { value: metrics.tasksByStatus.done, isPositive: true } : undefined}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Weekly Activity Chart */}
            <Card title="Weekly Activity" className="lg:col-span-2">
              <div className="pt-2 pb-6">
                <div className="flex justify-between mb-2 px-3 text-xs text-gray-500 dark:text-gray-400">
                  <div>Created</div>
                  <div>Completed</div>
                </div>
                <div className="flex h-48 items-end space-x-2">
                  {weeklyData.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      {/* Created tasks bar */}
                      <div className="w-full flex flex-col items-center justify-end">
                        <div 
                          className="w-full bg-blue-500 dark:bg-blue-600 rounded-t" 
                          style={{ 
                            height: `${(day.tasksCreated / maxChartValue) * 100}%`,
                            minHeight: day.tasksCreated > 0 ? '4px' : '0'
                          }}
                        ></div>
                        <div 
                          className="w-full bg-green-500 dark:bg-green-600 rounded-t mt-1" 
                          style={{ 
                            height: `${(day.tasksCompleted / maxChartValue) * 100}%`,
                            minHeight: day.tasksCompleted > 0 ? '4px' : '0'
                          }}
                        ></div>
                      </div>
                      
                      {/* Day label */}
                      <div className="text-xs mt-2 text-gray-500 dark:text-gray-400">{day.day}</div>
                      {/* Task count tooltips would go here in a real implementation */}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Team Productivity */}
            <Card title="Team Productivity">
              <div className="space-y-4 py-2">
                {teamProductivity.slice(0, 5).map((member, index) => (
                  <div key={index} className="px-3">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-xs md:text-sm font-medium flex items-center">
                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs mr-2">
                          {member.name.charAt(0)}
                        </div>
                        <span>{member.name}</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {member.completedTasks}/{member.totalTasks} tasks
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full" 
                        style={{ width: `${member.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                {teamProductivity.length === 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No team productivity data available
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Project Status */}
            <Card title="Project Status" footer={
              <Link to="/app/projects" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                View all projects →
              </Link>
            }>
              <div className="space-y-4 py-2">
                {projectsWithDetails.slice(0, 5).map((project, index) => (
                  <div key={index} className="px-3">
                    <div className="flex justify-between items-center mb-1">
                      <Link to={`/app/projects/${project._id}`} className="text-xs md:text-sm font-medium hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                        {project.name}
                      </Link>
                      <div className="text-xs">
                        <span className={`px-2 py-0.5 rounded-full ${
                          project.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                          project.status === 'completed' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                          'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <div>Progress</div>
                      <div>
                        {Math.round(
                          (project.details.taskCounts.done || 0) / 
                          ((project.details.taskCounts.todo || 0) + 
                          (project.details.taskCounts['in-progress'] || 0) + 
                          (project.details.taskCounts.done || 0)) * 100
                        ) || 0}%
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full flex rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-500" 
                          style={{ 
                            width: `${(project.details.taskCounts['in-progress'] || 0) / 
                              ((project.details.taskCounts.todo || 0) + 
                              (project.details.taskCounts['in-progress'] || 0) + 
                              (project.details.taskCounts.done || 0)) * 100}%` 
                          }}
                        ></div>
                        <div 
                          className="bg-green-500" 
                          style={{ 
                            width: `${(project.details.taskCounts.done || 0) / 
                              ((project.details.taskCounts.todo || 0) + 
                              (project.details.taskCounts['in-progress'] || 0) + 
                              (project.details.taskCounts.done || 0)) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
                {projectsWithDetails.length === 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No projects available
                  </div>
                )}
              </div>
            </Card>

            {/* Task Distribution */}
            <Card title="Task Distribution">
              <div className="flex justify-center items-center py-4">
                {metrics && tasks.length > 0 ? (
                  <div className="w-48 h-48 relative">
                    {/* Simple donut chart implementation */}
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                      {/* Circle background */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                      
                      {/* Todo segment */}
                      {metrics.tasksByStatus.todo > 0 && (
                        <circle 
                          cx="18" 
                          cy="18" 
                          r="15.915" 
                          fill="none" 
                          stroke="#cbd5e1" 
                          strokeWidth="3" 
                          strokeDasharray={`${metrics.tasksByStatus.todo / tasks.length * 100} 100`}
                          strokeDashoffset="25"
                          strokeLinecap="round"
                          transform="rotate(-90 18 18)"
                        />
                      )}
                      
                      {/* In Progress segment */}
                      {metrics.tasksByStatus.inProgress > 0 && (
                        <circle 
                          cx="18" 
                          cy="18" 
                          r="15.915" 
                          fill="none" 
                          stroke="#6366f1" 
                          strokeWidth="3" 
                          strokeDasharray={`${metrics.tasksByStatus.inProgress / tasks.length * 100} 100`}
                          strokeDashoffset={`${100 - (metrics.tasksByStatus.todo / tasks.length * 100)}`}
                          strokeLinecap="round"
                          transform="rotate(-90 18 18)"
                        />
                      )}
                      
                      {/* Done segment */}
                      {metrics.tasksByStatus.done > 0 && (
                        <circle 
                          cx="18" 
                          cy="18" 
                          r="15.915" 
                          fill="none" 
                          stroke="#22c55e" 
                          strokeWidth="3" 
                          strokeDasharray={`${metrics.tasksByStatus.done / tasks.length * 100} 100`}
                          strokeDashoffset={`${100 - ((metrics.tasksByStatus.todo + metrics.tasksByStatus.inProgress) / tasks.length * 100)}`}
                          strokeLinecap="round"
                          transform="rotate(-90 18 18)"
                        />
                      )}
                    </svg>
                    
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <div className="text-xl font-bold">{tasks.length}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Total Tasks</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    No task data available
                  </div>
                )}
              </div>
              
              {/* Legend */}
              {metrics && (
                <div className="flex justify-center space-x-4 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 mr-1"></div>
                    <span>To Do ({metrics.tasksByStatus.todo})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 dark:bg-indigo-600 mr-1"></div>
                    <span>In Progress ({metrics.tasksByStatus.inProgress})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-600 mr-1"></div>
                    <span>Done ({metrics.tasksByStatus.done})</span>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card title="Recent Activity" footer={
              <Link to="/app/tasks" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                View all tasks →
              </Link>
            }>
              <div className="space-y-4 py-2">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-2 px-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-indigo-500 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-xs md:text-sm">
                        <Link to={`/app/tasks/${activity._id}`} className="font-medium hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                          {activity.title}
                        </Link>
                        <span className="text-gray-500 dark:text-gray-400"> in </span>
                        <Link to={`/app/projects/${activity.project}`} className="font-medium hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                          {activity.projectName}
                        </Link>
                      </p>
                      <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        <span className={`inline-block px-1.5 py-0.5 rounded mr-1 ${
                          activity.status === 'done' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                          activity.status === 'in-progress' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' :
                          'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}>
                          {activity.status === 'todo' ? 'To Do' : 
                           activity.status === 'in-progress' ? 'In Progress' : 'Done'}
                        </span>
                        Updated {activity.timeAgo}
                      </p>
                    </div>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No recent activity
                  </div>
                )}
              </div>
            </Card>

            {/* Upcoming Deadlines */}
            <Card title="Upcoming Deadlines" footer={
              <Link to="/app/tasks" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                View all deadlines →
              </Link>
            }>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0 px-3">
                    <div>
                      <Link to={`/app/tasks/${deadline._id}`} className="text-xs md:text-sm font-medium hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                        {deadline.title}
                      </Link>
                      <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">{deadline.projectName}</p>
                    </div>
                    <div className="text-xs md:text-sm text-orange-500 dark:text-orange-400 font-medium">
                      {deadline.dueDate ? format(new Date(deadline.dueDate), 'MMM d, yyyy') : 'No date'}
                    </div>
                  </div>
                ))}
                {upcomingDeadlines.length === 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No upcoming deadlines
                  </div>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkspaceAnalyticsPage;
