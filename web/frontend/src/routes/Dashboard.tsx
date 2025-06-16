import { PrimaryButton } from '../components/buttons';
import { Link } from 'react-router-dom';
import { Card, StatCard } from '../components/cards';

const Dashboard = () => {
  // Sample stats data
  const stats = [
    { 
      label: 'Total Projects', 
      value: '6',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>,
      trend: { value: 12, isPositive: true }
    },
    { 
      label: 'Active Tasks', 
      value: '18',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>,
      trend: { value: 8, isPositive: true }
    },
    { 
      label: 'Team Members', 
      value: '12',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    },
    { 
      label: 'Upcoming Deadlines', 
      value: '4',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>,
      trend: { value: 3, isPositive: false }
    },
  ];

  // Sample recent activities
  const activities = [
    { user: 'Alex Johnson', action: 'completed task', target: 'Update user authentication flow', time: '2 hours ago' },
    { user: 'Sarah Miller', action: 'commented on', target: 'Fix dashboard loading performance', time: '4 hours ago' },
    { user: 'David Wilson', action: 'created project', target: 'API Integration', time: '1 day ago' },
    { user: 'Emily Brown', action: 'assigned', target: 'Critical security patch', time: '1 day ago' },
    { user: 'Nour User', action: 'completed task', target: 'Write API documentation', time: '2 days ago' },
  ];

  // Sample upcoming deadlines
  const deadlines = [
    { project: 'Website Redesign', task: 'Finalize homepage design', dueDate: 'Jun 15, 2025' },
    { project: 'API Integration', task: 'Connect payment gateway', dueDate: 'Jun 18, 2025' },
    { project: 'Mobile App Development', task: 'Complete user authentication', dueDate: 'Jun 20, 2025' },
    { project: 'Website Redesign', task: 'Implement responsive design', dueDate: 'Jun 22, 2025' },
  ];

  return (
    <div className="p-6">      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, Nour. Here's an overview of your workspace.
          </p>
        </div>
        <div className="flex gap-2">
          <PrimaryButton 
            text="New Project"
            icon={<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 4v16m8-8H4" /></svg>}
            size="sm"
          />
        </div>
      </div>      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
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
            View all activity →
          </Link>
        }>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-6 h-6 mt-0.5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">
                  {activity.user.charAt(0)}
                </div>                <div className="flex-1">
                  <p className="text-xs md:text-sm">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-gray-500 dark:text-gray-400"> {activity.action} </span>
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>        {/* Upcoming Deadlines */}
        <Card title="Upcoming Deadlines" footer={
          <Link to="/app/tasks" className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            View all deadlines →
          </Link>
        }>
          <div className="space-y-3">
            {deadlines.map((deadline, index) => (              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                <div>
                  <p className="text-xs md:text-sm font-medium">{deadline.task}</p>
                  <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">{deadline.project}</p>
                </div>
                <div className="text-xs md:text-sm text-orange-500 dark:text-orange-400 font-medium">
                  {deadline.dueDate}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>      {/* Quick Links */}
      <Card title="Quick Links" className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/app/projects" className="flex flex-col items-center justify-center p-4 border border-gray-100 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">            <svg className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span className="text-xs md:text-sm font-medium">Projects</span>
          </Link>
          <Link to="/app/tasks" className="flex flex-col items-center justify-center p-4 border border-gray-100 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">            <svg className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span className="text-xs md:text-sm font-medium">Tasks</span>
          </Link>
          <Link to="/app/inbox" className="flex flex-col items-center justify-center p-4 border border-gray-100 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">            <svg className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs md:text-sm font-medium">Inbox</span>
          </Link>
          <div className="flex flex-col items-center justify-center p-4 border border-gray-100 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">            <svg className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-xs md:text-sm font-medium">Team</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
