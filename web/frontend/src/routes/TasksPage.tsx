import { useState, useEffect } from 'react';
import { useProjectStore } from '../store/projectStore';
import { TaskCard } from '../components/cards';
import { PaginatedGridContainer } from '../components/containers';
import { ViewMode } from '../components/containers/GridRowContainer';
import { SecondaryButton } from '../components/buttons';
import DropdownButton from '../components/dropdowns/DropdownButton';
import FloatingDropdown from '../components/dropdowns/FloatingDropdown';
import { CheckboxDropdownItem } from '../components/dropdowns';

// Filter options for tasks
type TaskStatus = 'todo' | 'in-progress' | 'done' | 'cancelled';
type TaskPriority = 'no-priority' | 'low' | 'medium' | 'high' | 'urgent';

const TasksPage = () => {
  const { 
    userTasks, 
    tasksLoading, 
    tasksError, 
    fetchAllUserTasks, 
    fetchUserTasks,
    projects,
    projectsLoading,
    fetchProjects
  } = useProjectStore();
  
  // Local state for filters
  const [statusFilters, setStatusFilters] = useState<TaskStatus[]>([]);
  const [priorityFilters, setPriorityFilters] = useState<TaskPriority[]>([]);
  const [projectFilters, setProjectFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [isFilteringActive, setIsFilteringActive] = useState(false);
  
  const ITEMS_PER_PAGE = 12;
  // Fetch all user tasks on component mount
  useEffect(() => {
    fetchAllUserTasks();
    fetchProjects();
  }, [fetchAllUserTasks, fetchProjects]);
  
  // Apply filters when they change
  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
    
    // Set filtering active state
    setIsFilteringActive(true);
    
    // Apply filters or fetch all tasks
    const options: Record<string, any> = {};
    
    if (statusFilters.length > 0) {
      options.status = statusFilters;
    }
    
    if (priorityFilters.length > 0) {
      options.priority = priorityFilters;
    }
    
    if (projectFilters.length > 0) {
      options.projectId = projectFilters;
    }
    
    // If no filters are applied, fetch all tasks
    // Otherwise, apply the filters
    if (Object.keys(options).length === 0) {
      fetchAllUserTasks();
    } else {
      fetchUserTasks(options);
    }
  }, [statusFilters, priorityFilters, projectFilters, fetchAllUserTasks, fetchUserTasks]);

  // When tasks are loaded, update the total count
  useEffect(() => {
    if (!tasksLoading && userTasks) {
      setTotalTasks(userTasks.length);
      setIsFilteringActive(false);
    }
  }, [userTasks, tasksLoading]);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };
    const handlePageChange = (page: number, from: number, to: number) => {
    setCurrentPage(page);
    setIsFilteringActive(true);
    
    // Always use pagination with the current filters
    const options: Record<string, any> = {
      from,
      to
    };
    
    if (statusFilters.length > 0) {
      options.status = statusFilters;
    }
    
    if (priorityFilters.length > 0) {
      options.priority = priorityFilters;
    }
    
    if (projectFilters.length > 0) {
      options.projectId = projectFilters;
    }
    
    fetchUserTasks(options);
  };
    const clearFilters = () => {
    setStatusFilters([]);
    setPriorityFilters([]);
    setProjectFilters([]);
    setCurrentPage(1);
    setIsFilteringActive(true);
    fetchAllUserTasks();
  };
    
  // Get displayed tasks based on current page
  const getVisibleTasks = () => {
    if (!userTasks) return [];
    
    return userTasks.map((task) => <TaskCard key={task._id} task={task} />);
  };
    // Status labels and options
  const statusOptions = [
    { value: 'todo', label: 'To Do', color: 'bg-blue-100 dark:bg-blue-900/30' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { value: 'done', label: 'Done', color: 'bg-green-100 dark:bg-green-900/30' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 dark:bg-red-900/30' }
  ];
  
  // Priority labels and options
  const priorityOptions = [
    { value: 'no-priority', label: 'No Priority', color: 'bg-gray-100 dark:bg-gray-800' },
    { value: 'low', label: 'Low', color: 'bg-blue-100 dark:bg-blue-900/30' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { value: 'high', label: 'High', color: 'bg-orange-100 dark:bg-orange-900/30' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 dark:bg-red-900/30' }
  ];
  
  // Project labels and options
  const projectOptions = projects.map(project => ({
    value: project._id,
    label: project.name
  }));
  
  // Get status filter text
  const getStatusFilterText = () => {
    if (statusFilters.length === 0) return "Status";
    if (statusFilters.length === 1) {
      return statusOptions.find(opt => opt.value === statusFilters[0])?.label || 'Status';
    }
    return `${statusFilters.length} Statuses`;
  };
  
  // Get priority filter text
  const getPriorityFilterText = () => {
    if (priorityFilters.length === 0) return "Priority";
    if (priorityFilters.length === 1) {
      return priorityOptions.find(opt => opt.value === priorityFilters[0])?.label || 'Priority';
    }
    return `${priorityFilters.length} Priorities`;
  };
  
  // Get project filter text
  const getProjectFilterText = () => {
    if (projectFilters.length === 0) return "Project";
    if (projectFilters.length === 1) {
      return projectOptions.find(opt => opt.value === projectFilters[0])?.label || 'Project';
    }
    return `${projectFilters.length} Projects`;
  };

  return (
    <div className="container mx-auto px-4 py-8">      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Tasks</h1>
          <p className="text-gray-600 dark:text-gray-300">
            View and manage all your tasks across different projects
          </p>
        </div>
        
        {/* Add task button would go here if needed */}
      </div>
      
      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Filter by:</span><FloatingDropdown
          trigger={
            <DropdownButton 
              text={getStatusFilterText()} 
              variant={statusFilters.length > 0 ? "secondary" : "default"}
              size="xs"
              icon={statusFilters.length > 0 ? 
                <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg> : undefined
              }
              iconPosition={statusFilters.length > 0 ? "right" : "left"}
              onClick={statusFilters.length > 0 ? () => setStatusFilters([]) : undefined}
              loading={isFilteringActive && statusFilters.length > 0}
            />
          }          items={statusOptions.map(option => ({
            text: option.label,
            isCheckbox: true,
            checked: statusFilters.includes(option.value as TaskStatus),
            color: option.color,
            onCheckChange: (checked) => {
              if (checked) {
                setStatusFilters(prev => [...prev, option.value as TaskStatus]);
              } else {
                setStatusFilters(prev => prev.filter(status => status !== option.value));
              }
            }
          }))}
          align="left"
          size="xs"
        />
          <FloatingDropdown
          trigger={
            <DropdownButton 
              text={getPriorityFilterText()} 
              variant={priorityFilters.length > 0 ? "secondary" : "default"}
              size="xs"
              icon={priorityFilters.length > 0 ? 
                <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg> : undefined
              }
              iconPosition={priorityFilters.length > 0 ? "right" : "left"}
              onClick={priorityFilters.length > 0 ? () => setPriorityFilters([]) : undefined}
              loading={isFilteringActive && priorityFilters.length > 0}
            />
          }          items={priorityOptions.map(option => ({
            text: option.label,
            isCheckbox: true,
            checked: priorityFilters.includes(option.value as TaskPriority),
            color: option.color,
            onCheckChange: (checked) => {
              if (checked) {
                setPriorityFilters(prev => [...prev, option.value as TaskPriority]);
              } else {
                setPriorityFilters(prev => prev.filter(priority => priority !== option.value));
              }
            }
          }))}
          align="left"
          size="xs"
        />
          <FloatingDropdown
          trigger={
            <DropdownButton 
              text={getProjectFilterText()} 
              variant={projectFilters.length > 0 ? "secondary" : "default"}
              size="xs"
              icon={projectFilters.length > 0 ? 
                <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg> : undefined
              }
              iconPosition={projectFilters.length > 0 ? "right" : "left"}
              onClick={projectFilters.length > 0 ? () => setProjectFilters([]) : undefined}
              loading={isFilteringActive && projectFilters.length > 0}
            />
          }          items={projectOptions.map(option => ({
            text: option.label,
            isCheckbox: true,
            checked: projectFilters.includes(option.value),
            onCheckChange: (checked) => {
              if (checked) {
                setProjectFilters(prev => [...prev, option.value]);
              } else {
                setProjectFilters(prev => prev.filter(id => id !== option.value));
              }
            }
          }))}
          align="left"
          size="xs"
        />
          {(statusFilters.length > 0 || priorityFilters.length > 0 || projectFilters.length > 0) && (
          <SecondaryButton
            text="Clear Filters"
            size="xs"
            onClick={clearFilters}
            loading={isFilteringActive}
          />
        )}
      </div>      {/* Tasks Container */}
      {tasksError ? (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-md mb-6">
          Error loading tasks: {tasksError}
        </div>
      ) : (
        <PaginatedGridContainer
          initialViewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          emptyMessage={
            (statusFilters.length > 0 || priorityFilters.length > 0 || projectFilters.length > 0) 
              ? "No tasks found matching your filters" 
              : "You don't have any tasks yet"
          }
          title={`Your Tasks ${totalTasks > 0 ? `(${totalTasks})` : ''}`}
          gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          rowClassName="flex flex-col gap-4"
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={totalTasks}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          loading={tasksLoading || isFilteringActive}
        >
          {!tasksLoading && !isFilteringActive && getVisibleTasks()}
        </PaginatedGridContainer>
      )}
    </div>
  );
};

export default TasksPage;
