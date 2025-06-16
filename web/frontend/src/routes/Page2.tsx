import { IconButton, PrimaryButton, SecondaryButton } from '../components/buttons';

function Page2() {
  // Sample project data
  const projects = [
    { id: 1, name: 'Website Redesign', status: 'In Progress', tasks: 12, completed: 5 },
    { id: 2, name: 'Mobile App Development', status: 'Planning', tasks: 24, completed: 0 },
    { id: 3, name: 'Backend API Integration', status: 'Review', tasks: 8, completed: 6 },
  ];

  return (
    <div className="py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-semibold mb-4">Projects</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          Demo page showing how our buttons can be used in a real project management interface.
        </p>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {projects.map((project) => (
          <div 
            key={project.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium">{project.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                project.status === 'In Progress' 
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                  : project.status === 'Review'
                  ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                  : 'bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {project.status}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>{Math.round((project.completed / project.tasks) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-black dark:bg-white h-1.5 rounded-full" 
                  style={{ width: `${(project.completed / project.tasks) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              {project.completed} of {project.tasks} tasks completed
            </div>
            
            <div className="flex space-x-2">
              <SecondaryButton 
                text="Details" 
                size="xs"
              />
              <PrimaryButton
                text="Open"
                size="xs"
              />
            </div>
          </div>
        ))}
        
        {/* Add New Project Card */}
        <div className="border border-gray-200 dark:border-gray-700 border-dashed rounded-lg p-5 flex flex-col items-center justify-center text-center h-full">
          <div className="mb-3">
            <IconButton
              icon="+"
              variant="primary"
              size="md"
            />
          </div>
          <h3 className="text-sm font-medium mb-1">New Project</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Start a new project from scratch
          </p>
          <PrimaryButton
            text="Create Project"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}

export default Page2;