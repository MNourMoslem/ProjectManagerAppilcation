import { useNavigate } from 'react-router-dom'
import { Column } from './Table'
import TableWithPagination from './TableWithPagination'
import { format } from 'date-fns'
import { Task } from '../../interfaces/interfaces'
import { IconButton } from '../buttons'

interface TasksTableProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onEditCondition?: (task: Task) => boolean;
  onDelete?: (task: Task) => void;
  onDeleteCondition?: (task: Task) => boolean;
}

function TasksTable({ tasks, onEdit, onEditCondition, onDelete, onDeleteCondition }: TasksTableProps) {
    const navigate = useNavigate();

    const taskColumns: Column<Task>[] = [    {
      id: 'title',
      header: 'Task',
      accessor: (task) => (
        <div>
          <div 
            className="font-medium text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer"
            onClick={() => navigate(`/app/tasks/${task._id}`)}
          >
            {task.title}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{task.description}</div>
        </div>
      ),
      sortable: true,
      sortFn: (a, b) => a.title.localeCompare(b.title),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (task) => {        const statusStyles = {
          'todo': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
          'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          'done': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          'cancelled' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        };
        
        const statusLabels = {
          'todo': 'To Do',
          'in-progress': 'In Progress',
          'done': 'Done',
          'cancelled' : 'Cancelled'
        };
        
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[task.status]}`}>
            {statusLabels[task.status]}
          </span>
        );
      },
      sortable: true,
      sortFn: (a, b) => a.status.localeCompare(b.status),
      width: '120px',
    },
    {
      id: 'priority',
      header: 'Priority',
      accessor: (task) => {
        const priorityStyles = {
          'no-priority': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
          'low': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
          'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
          'urgent': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        };
        
        const priorityLabels = {
          'no-priority': 'None',
          'low': 'Low',
          'medium': 'Medium',
          'high': 'High',
          'urgent': 'Urgent'
        };
        
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyles[task.priority]}`}>
            {priorityLabels[task.priority]}
          </span>
        );
      },
      sortable: true,
      sortFn: (a, b) => a.priority.localeCompare(b.priority),
      width: '100px',
    },
    {
      id: 'dueDate',
      header: 'Due Date',
      accessor: (task) => {
        if (!task.dueDate) return <span className="text-xs text-gray-500">No due date</span>;
        
        const dueDate = task.dueDate;
        const today = new Date();
        const isPast = dueDate < today && task.status !== 'done';
        
        return (
          <span className={`text-xs ${isPast ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-gray-300'}`}>
            {format(dueDate, 'MMM d, yyyy')}
          </span>
        );
      },
      sortable: true,
      sortFn: (a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      },
      width: '120px',
    },
    {
      id: 'assignedTo',
      header: 'Assigned',
      accessor: (task) => {
        if (task.assignedTo.length === 0) {
          return <span className="text-xs text-gray-500 dark:text-gray-400">Unassigned</span>;
        }
        
        return (
          <div className="flex -space-x-1">
            {task.assignedTo.slice(0, 3).map((member) => (
              <div 
                key={member._id} 
                className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-medium border border-white dark:border-gray-900"
                title={member.name}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {task.assignedTo.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-medium border border-white dark:border-gray-900">
                +{task.assignedTo.length - 3}
              </div>
            )}
          </div>
        );
      },
      width: '100px',
    },
    // Add actions column if callbacks are provided
    ...(onEdit || onDelete ? [{
      id: 'actions',
      header: 'Actions',
      accessor: (task : Task) => (
        <div className="flex items-center space-x-2">
          {(onEditCondition ? onEditCondition(task) : true) && onEdit && (
            <IconButton
              icon={<svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>}
              onClick={() => onEdit(task)}
              size="sm"
              aria-label="Edit task"
            />
          )}
          
          {(onDeleteCondition ? onDeleteCondition(task) : true) && onDelete && (
            <IconButton
              icon={<svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>}
              onClick={() => onDelete(task)}
              size="sm"
              variant="danger"
              aria-label="Delete task"
            />
          )}
        </div>
      ),
      width: '100px',
    }] : []),
  ];

  return (
    <TableWithPagination
        columns={taskColumns}
        data={tasks}
        itemsPerPage={10}
    />
  )
}

export default TasksTable