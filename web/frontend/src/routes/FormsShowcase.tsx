import { useState } from 'react';
import { Card } from '../components/cards';
import { ProjectForm, TaskForm } from '../components/forms';
import type { ProjectFormData } from '../components/forms/ProjectForm';
import type { TaskFormData } from '../components/forms/TaskForm';
import { PrimaryButton, SecondaryButton } from '../components/buttons';
import Modal from '../components/modals/Modal';

// Sample users for assignee dropdown
const users = [
  { _id: "1", name: 'Alex Johnson', email: "Alex256@gmail.com", role: "member"},
  { _id: "2", name: 'Sarah Miller', email: "SaMiller123@gmail.com", role: "member" },
  { _id: "3", name: 'David Wilson', email: "wilsonDavid@gmail.com", role: "owner" },
  { _id: "4", name: 'Emily Brown', email: "emily_brown_000@gmail.com", role: "member" },
  { _id: "5", name: 'Olivia Smith', email: "olivia777@gmail.com", role: "admin" },
];

export default function FormsShowcase() {
  // State for form data and modal display
  const [projectData, setProjectData] = useState<ProjectFormData | null>(null);
  const [taskData, setTaskData] = useState<TaskFormData | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handler for project form submission
  const handleProjectSubmit = (data: ProjectFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setProjectData(data);
      setIsSubmitting(false);
      setIsProjectModalOpen(false);
    }, 1000);
  };
  
  // Handler for task form submission
  const handleTaskSubmit = (data: TaskFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setTaskData(data);
      setIsSubmitting(false);
      setIsTaskModalOpen(false);
    }, 1000);
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Form Components</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Project Form</h2>
            <PrimaryButton 
              text="Create Project" 
              size="sm"
              onClick={() => setIsProjectModalOpen(true)}
            />
          </div>
          
          {projectData ? (
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                <h3 className="font-medium mb-2">Last Submitted Data:</h3>
                <pre className="text-xs overflow-auto p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {JSON.stringify(projectData, null, 2)}
                </pre>
              </div>
              <SecondaryButton 
                text="Reset" 
                size="xs"
                onClick={() => setProjectData(null)}
              />
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Create a project to see the form data here.
            </p>
          )}
        </Card>
        
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Task Form</h2>
            <PrimaryButton 
              text="Create Task" 
              size="sm"
              onClick={() => setIsTaskModalOpen(true)}
            />
          </div>
          
          {taskData ? (
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                <h3 className="font-medium mb-2">Last Submitted Data:</h3>
                <pre className="text-xs overflow-auto p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                  {JSON.stringify(taskData, null, 2)}
                </pre>
              </div>
              <SecondaryButton 
                text="Reset" 
                size="xs"
                onClick={() => setTaskData(null)}
              />
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Create a task to see the form data here.
            </p>
          )}
        </Card>
      </div>
      
      {/* Project Modal */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="New Project"
        primaryAction={{
          text: "Create Project",
          onClick: () => document.querySelector('#project-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })),
          loading: isSubmitting
        }}
        secondaryAction={{
          text: "Cancel",
          onClick: () => setIsProjectModalOpen(false)
        }}
      >
        <div id="project-form">
          <ProjectForm 
            onSubmit={handleProjectSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </Modal>      {/* Task Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="New Task"
        size="4xl"
        contentClassName="overflow-auto"
        primaryAction={{
          text: "Create Task",
          onClick: () => document.querySelector('#task-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })),
          loading: isSubmitting
        }}
        secondaryAction={{
          text: "Cancel",
          onClick: () => setIsTaskModalOpen(false)
        }}
      >
        <div id="task-form">
          <TaskForm
            projectId=''
            members={users}
            onSubmit={handleTaskSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </Modal>
    </div>
  );
}
