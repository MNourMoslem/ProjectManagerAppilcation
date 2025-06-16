import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useProjectStore } from '../store/projectStore';
import { Card } from '../components/cards';
import { 
  PrimaryButton, 
  SecondaryButton,
  IconButton,
  OutlineButton
} from '../components/buttons';
import { 
  FloatingDropdown
} from '../components/dropdowns';
import Modal from '../components/modals/Modal';
import { TaskForm, TaskFormData } from '../components/forms/TaskForm';
import { FormField, Textarea } from '../components/forms/FormField';
import { Project, Task, Comment, Issue } from '../interfaces/interfaces';
import { useAuthStore } from '../store/authStore';

// Component to display comments
const CommentItem = ({ comment }: { comment: Comment }) => {
  return (
    <div className="p-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="flex items-start">
        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-medium mr-3 shrink-0">
          {comment.user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="font-medium text-sm">{comment.user.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
            </div>
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
            {comment.content}
          </div>
        </div>
      </div>
    </div>
  );
};

// Component to display issues
const IssueItem = ({ 
  issue, 
  canManageIssue, 
  onStatusChange 
}: { 
  issue: Issue, 
  canManageIssue: boolean, 
  onStatusChange: (id: string, status: 'open' | 'in-progress' | 'resolved' | 'closed') => void 
}) => {
  const statusColors = {
    'open': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'resolved': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'closed': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
  };

  const statusLabels = {
    'open': 'Open',
    'in-progress': 'In Progress',
    'resolved': 'Resolved',
    'closed': 'Closed',
  };
  
  return (
    <div className="p-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="flex items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">{issue.title}</div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[issue.status]}`}>
                {statusLabels[issue.status]}
              </span>
              
              {canManageIssue && (
                <FloatingDropdown
                  trigger={<IconButton icon="⋯" variant="ghost" size="xs" />}
                  items={[
                    { text: 'Mark as Open', onClick: () => onStatusChange(issue._id, 'open') },
                    { text: 'Mark as In Progress', onClick: () => onStatusChange(issue._id, 'in-progress') },
                    { text: 'Mark as Resolved', onClick: () => onStatusChange(issue._id, 'resolved') },
                    { text: 'Mark as Closed', onClick: () => onStatusChange(issue._id, 'closed') },
                  ]}
                  align="right"
                  size="xs"
                />
              )}
            </div>
          </div>
          
          {issue.description && (
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-wrap break-words">
              {issue.description}
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div>Reported by {issue.owner.name}</div>
            <div>{format(new Date(issue.createdAt), 'MMM d, yyyy')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Task Page Component
const TaskPage = () => {
  const { taskId } = useParams<{ taskId: string}>();
  const navigate = useNavigate();
  
  // State
  const [projectId, setProjectId] = useState<string>("");
  const [project, setProject] = useState<Project | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'owner' | 'admin' | 'member' | null>('member');
  
  // Comment state
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  
  // Submission state
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Issue state
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueDescription, setNewIssueDescription] = useState('');
  const [isAddingIssue, setIsAddingIssue] = useState(false);
  
  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isAddIssueModalOpen, setIsAddIssueModalOpen] = useState(false);
  const [isAddCommentModalOpen, setIsAddCommentModalOpen] = useState(false);
  
  const {
    user
  } = useAuthStore();

  const isUserOwnerOrAdmin = () => userRole === 'owner' || userRole === 'admin';
  const isUserPartOfTask = () => {
    if (!task?.assignedTo || task.assignedTo.length === 0)
      return true;

    return task.assignedTo.some(responsibleUser => responsibleUser._id === user?._id);
  };
  const isTaskOpen = () => task?.status === 'todo' || task?.status === 'in-progress';

  // Get task management functions from the store
  const {
    currentProject,

    fetchTaskById,
    fetchProjectById,
    updateTask,
    changeTaskStatus,
    createComment,
    createIssue,
    updateIssueStatus,
    submitTask,
    rejectTask,
    startWorkingOnTask,
    getUserRole,
    getTaskComments,
    getTaskIssues
  } = useProjectStore();
  
  
  // Load task data
  useEffect(() => {
    if (taskId) {
      setLoading(true);
      fetchTaskById(taskId)
        .then(taskData => {
          setTask(taskData);
          setProjectId(taskData.project);
        })
        .then(() => {
          return Promise.all([
              getTaskComments(taskId),
              getTaskIssues(taskId),
          ]);
        })
        .then(([taskComments, taskIssues]) => {
            setComments(taskComments);
            setIssues(taskIssues);
        })
        .catch(err => {
          setError(err.message || 'Failed to load task details');
        })
    }
    else
    {
      setError("Invalid Task Id");
      setLoading(false);
    }
  }, [taskId, fetchTaskById]);

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId)
        .then(() => {
          setProject(currentProject);
        })
        .then(async () => {
          const role = await getUserRole(projectId);
          setUserRole(role as 'owner' | 'admin' | 'member' | null);
        })
        .catch(err => {
          setError(err.message || 'Failed to load project details');
        }).finally(() => {
          setLoading(false)
        });
    }
    console.log("Project ID:", projectId);
  }, [projectId]);
  
  // Handle comment submission
  // Update handleAddComment function (around line 245)
  const handleAddComment = () => {
    if (!newComment.trim() || !taskId) return;
    
    setSubmittingComment(true);
    createComment(taskId, newComment)
      .then(updatedTask => {
        setTask(updatedTask ?? null);
        setNewComment('');
        setIsAddCommentModalOpen(false); // Close modal after comment is added
      })
      .then(() => getTaskComments(taskId)) // Refresh comments
      .then(taskComments => {
        setComments(taskComments);
      })
      .finally(() => {
        setSubmittingComment(false);
      });
  };
  
  // Handle issue submission
  const handleAddIssue = () => {
    if (!newIssueTitle.trim() || !taskId) return;
    
    setIsSubmitting(true);
    createIssue(taskId, {
      title: newIssueTitle,
      description: newIssueDescription
    })
      .then(updatedTask => {
        setTask(updatedTask);
        setNewIssueTitle('');
        setNewIssueDescription('');
        setIsAddIssueModalOpen(false);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  
  // Handle issue status change
  const handleIssueStatusChange = (issueId: string, status: 'open' | 'in-progress' | 'resolved' | 'closed') => {
    if (!taskId) return;
    
    updateIssueStatus(taskId, issueId, status)
      .then(updatedTask => {
        setTask(updatedTask);
      });
  };
  
  // Handle task start (set to in-progress)
  const handleStartWork = () => {
    if (!taskId) return;
    
    setIsSubmitting(true);
    startWorkingOnTask(taskId)
      .then(updatedTask => {
        setTask(updatedTask);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  
  // Handle task submission
  const handleSubmitTask = () => {
    if (!taskId) return;
    
    setIsSubmitting(true);
    submitTask(taskId, submissionMessage)
      .then(updatedTask => {
        setTask(updatedTask);
        setSubmissionMessage('');
        setIsSubmitModalOpen(false);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  
  // Handle task rejection
  const handleRejectTask = () => {
    if (!taskId) return;
    
    setIsSubmitting(true);
    rejectTask(taskId, submissionMessage)
      .then(updatedTask => {
        setTask(updatedTask);
        setSubmissionMessage('');
        setIsRejectModalOpen(false);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  
  // Handle task edit
  const handleEditTask = (data: TaskFormData) => {
    if (!taskId) return;
    
    setIsSubmitting(true);
    updateTask(taskId, data)
      .then(updatedTask => {
        setTask(updatedTask ?? null);
        setIsEditModalOpen(false);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  
  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-[70vh]">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-indigo-600 animate-spin mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading task details...</p>
      </div>
    );
  }
  
  if (error || !task) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div className="flex">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Error loading task</h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                {error || 'Task not found or access denied. Please try again later.'}
              </p>
              <div className="mt-4">
                <OutlineButton
                  text="Back to Project"
                  size="sm"
                  onClick={() => navigate(`/app/projects/${projectId}`)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Status color indicators
  const statusColors = {
    'todo': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'done': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  
  const priorityColors = {
    'no-priority': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    'low': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    'urgent': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  
  const priorityLabels = {
    'no-priority': 'No Priority',
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
    'urgent': 'Urgent',
  };
  
  const statusLabels = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done',
    'cancelled': 'Cancelled',
  };
  
  return (
    <div className="p-6">
      {/* Header with task title and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button 
              onClick={() => navigate(`/app/projects/${projectId}`)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">{currentProject?.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{task.title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {isUserOwnerOrAdmin() && (
            <SecondaryButton
              text="Edit Task"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
            />
          )}
          
          {/* Task Actions */}
          {isUserPartOfTask() && task.status === 'todo' && (
            <PrimaryButton
              text="Start Working"
              size="sm"
              onClick={handleStartWork}
              loading={isSubmitting}
            />
          )}
          
          {isUserPartOfTask() && task.status === 'in-progress' && (
            <div className="flex items-center gap-2">
              <OutlineButton
                text="Reject"
                size="sm"
                onClick={() => setIsRejectModalOpen(true)}
                disabled={isSubmitting}
              />
              <PrimaryButton
                text="Submit"
                size="sm"
                onClick={() => setIsSubmitModalOpen(true)}
                loading={isSubmitting}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Task details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Task info */}
          <Card className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-medium">Task Details</h2>
              <div className="flex gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                  {statusLabels[task.status]}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                  {priorityLabels[task.priority]}
                </span>
              </div>
            </div>
            
            {/* Task description */}
            <div className="mb-6">
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Description</h3>
              <div className="text-sm whitespace-pre-wrap">
                {task.description || <span className="text-gray-500 dark:text-gray-400 italic">No description provided</span>}
              </div>
            </div>
            
            {/* Task details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Due Date</h3>
                <p className="text-sm">
                  {task.dueDate 
                    ? format(new Date(task.dueDate), 'MMMM d, yyyy')
                    : <span className="text-gray-500 dark:text-gray-400 italic">No due date</span>
                  }
                </p>
              </div>
              
              <div>
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Assigned To</h3>
                {task.assignedTo.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {task.assignedTo.map(user => (
                      <div 
                        key={user._id}
                        className="flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-xs"
                      >
                        <div className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[8px] font-medium mr-1">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{user.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">Not assigned</p>
                )}
              </div>
              
              <div>
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Created</h3>
                <p className="text-sm">
                  {format(new Date(task.createdAt), 'MMMM d, yyyy')}
                </p>
              </div>
              
              <div>
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Last Updated</h3>
                <p className="text-sm">
                  {format(new Date(task.updatedAt), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
            
            {/* Submission details if task is done */}
            {task.status === 'done' && task.submitionMessage && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-md">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-400 mb-2">Submission Details</h3>
                <div className="flex items-center mb-2">
                  {task.submitionMessage.member && (
                    <>
                      <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-[10px] font-medium mr-2">
                        {task.submitionMessage.member.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-green-800 dark:text-green-400 mr-2">
                        {task.submitionMessage.member.name}
                      </span>
                    </>
                  )}
                  <span className="text-xs text-green-600 dark:text-green-500">
                    {format(new Date(task.updatedAt), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                {task.submitionMessage.massege && (
                  <p className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">
                    {task.submitionMessage.massege}
                  </p>
                )}
              </div>
            )}
            
            {/* Rejection details if task was rejected */}
            {task.status === 'in-progress' && task.submitionMessage && task.submitionMessage.type === 'rejection' && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-md">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">Last Rejection</h3>
                <div className="flex items-center mb-2">
                  {task.submitionMessage.member && (
                    <>
                      <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-[10px] font-medium mr-2">
                        {task.submitionMessage.member.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-red-800 dark:text-red-400 mr-2">
                        {task.submitionMessage.member.name}
                      </span>
                    </>
                  )}
                  <span className="text-xs text-red-600 dark:text-red-500">
                    {format(new Date(task.updatedAt), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
                {task.submitionMessage.massege && (
                  <p className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap">
                    {task.submitionMessage.massege}
                  </p>
                )}
              </div>
            )}
          </Card>
          
          {/* Issues section */}
          <Card className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Issues {issues.length > 0 && `(${issues.length})`}</h2>
              {isTaskOpen() && <div className="flex items-center gap-2">
                <PrimaryButton
                  text="Report Issue"
                  size="xs"
                  onClick={() => setIsAddIssueModalOpen(true)}
                />
              </div>}
            </div>
            
            {issues.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p>No issues reported for this task</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {issues.map(issue => (
                  <IssueItem 
                    key={issue._id} 
                    issue={issue} 
                    canManageIssue={isUserOwnerOrAdmin()} 
                    onStatusChange={handleIssueStatusChange} 
                  />
                ))}
              </div>
            )}
          </Card>
          
          {/* Comments section */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Comments {comments.length > 0 && `(${comments.length})`}</h2>
              {isTaskOpen() && (
                <PrimaryButton
                  text="Add Comment"
                  size="xs"
                  onClick={() => setIsAddCommentModalOpen(true)}
                />
              )}
            </div>
            
            {/* Comment list */}
            {comments.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {comments.map(comment => (
                  <CommentItem key={comment._id} comment={comment} />
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>No comments</p>
              </div>
            )}
          </Card>
        </div>
        
        <div>
          {/* Activity Timeline (to be implemented) */}
          <Card className="mb-6">
            <h2 className="text-lg font-medium mb-4">Activity Timeline</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              The activity timeline will show changes to the task, including status changes, assignments, and comments.
            </p>
          </Card>
          
          {/* Related Items */}
          <Card>
            <h2 className="text-lg font-medium mb-4">Related Items</h2>
            {/* This section can be implemented to show related tasks or other items */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This section will display other tasks that are related to this task.
            </p>
          </Card>
        </div>
      </div>
      
      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Task"
        primaryAction={{
          text: "Save Changes",
          onClick: () => document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })),
          loading: isSubmitting
        }}
        secondaryAction={{
          text: "Cancel",
          onClick: () => setIsEditModalOpen(false)
        }}
      >
        {project && (
          <TaskForm 
            projectId={project._id}
            members={project.members}
            initialData={{
              title: task.title,
              description: task.description,
              priority: task.priority,
              dueDate: task.dueDate,
              tags: task.tags || [],
              assignedTo: task.assignedTo.map(user => user._id),
            }}
            onSubmit={handleEditTask}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>
      
      {/* Submit Task Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Task"
        primaryAction={{
          text: "Submit",
          onClick: handleSubmitTask,
          loading: isSubmitting
        }}
        secondaryAction={{
          text: "Cancel",
          onClick: () => setIsSubmitModalOpen(false)
        }}
      >
        <div className="p-4">
          <FormField
            label="Submission Message"
            htmlFor="submissionMessage"
            hint="Provide any relevant details about your work on this task"
          >
            <Textarea
              id="submissionMessage"
              value={submissionMessage}
              onChange={(e) => setSubmissionMessage(e.target.value)}
              placeholder="Enter submission details..."
              rows={4}
            />
          </FormField>
        </div>
      </Modal>
      
      {/* Reject Task Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Task"
        primaryAction={{
          text: "Reject",
          onClick: handleRejectTask,
          loading: isSubmitting
        }}
        secondaryAction={{
          text: "Cancel",
          onClick: () => setIsRejectModalOpen(false)
        }}
      >
        <div className="p-4">
          <FormField
            label="Rejection Reason"
            htmlFor="rejectionMessage"
            hint="Explain why this task is being rejected"
            required
          >
            <Textarea
              id="rejectionMessage"
              value={submissionMessage}
              onChange={(e) => setSubmissionMessage(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
            />
          </FormField>
        </div>
      </Modal>
      
      {/* Add Issue Modal */}
      <Modal
        isOpen={isAddIssueModalOpen}
        onClose={() => setIsAddIssueModalOpen(false)}
        title="Report Issue"
        primaryAction={{
          text: "Report Issue",
          onClick: handleAddIssue,
          loading: isSubmitting,
          disabled: !newIssueTitle.trim()
        }}
        secondaryAction={{
          text: "Cancel",
          onClick: () => setIsAddIssueModalOpen(false)
        }}
      >
        <div className="p-4">
          <FormField
            label="Issue Title"
            htmlFor="issueTitle"
            required
          >
            <input
              id="issueTitle"
              type="text"
              value={newIssueTitle}
              onChange={(e) => setNewIssueTitle(e.target.value)}
              placeholder="Enter issue title..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </FormField>
          
          <FormField
            label="Issue Description"
            htmlFor="issueDescription"
            className="mt-4"
          >
            <Textarea
              id="issueDescription"
              value={newIssueDescription}
              onChange={(e) => setNewIssueDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={4}
            />
          </FormField>
        </div>
      </Modal>

      {/* Add Comment Modal */}
      <Modal
        isOpen={isAddCommentModalOpen}
        onClose={() => setIsAddCommentModalOpen(false)}
        title="Add Comment"
        primaryAction={{
          text: "Post Comment",
          onClick: handleAddComment,
          loading: submittingComment,
          disabled: !newComment.trim()
        }}
        secondaryAction={{
          text: "Cancel",
          onClick: () => setIsAddCommentModalOpen(false)
        }}
      >
        <div className="p-4">
          <FormField
            label="Your Comment"
            htmlFor="newComment"
          >
            <Textarea
              id="newComment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment..."
              rows={4}
            />
          </FormField>
        </div>
      </Modal>
    </div>
  );
};

export default TaskPage;
