import { useState, useEffect } from 'react';
import { FormField, Input, Textarea, Select, DateInput, TagInput } from './FormField';
import { MemberSelection, Member } from '../members';

export interface TaskFormData {
  projectId: string;
  title: string;
  description: string;
  priority: 'no-priority' | 'low' | 'medium' | 'high' | 'urgent';
  dueDate: Date | null;
  assignedTo: string[];
  tags?: string[];
}

interface TaskFormProps {
  projectId: string;
  members: Member[];
  initialData?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => void;
  isSubmitting?: boolean;
}

export const TaskForm = ({ 
  projectId,
  members = [],
  initialData = {}, 
  onSubmit, 
  isSubmitting = false
}: TaskFormProps) => {
  const [formData, setFormData] = useState<TaskFormData>({
    projectId : projectId,
    title: '',
    description: '',
    priority: 'medium',
    dueDate: null,
    assignedTo: [],
    tags: [],
    ...initialData
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});
  
  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      // Convert any complex assignedTo objects to just their IDs
      let formattedData = { ...initialData };
      // if (initialData.assignedTo && Array.isArray(initialData.assignedTo)) {
      //   formattedData.assignedTo = initialData.assignedTo.map(user => 
      //     typeof user === 'string' ? user : user._id || user
      //   );
      // }
      setFormData(prev => ({ ...prev, ...formattedData }));
    }
  }, [initialData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when changed
    if (errors[name as keyof TaskFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleTagsChange = (tags: string[]) => {
    setFormData(prev => ({ ...prev, tags }));
  };
  
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };  
  return (
    <form onSubmit={handleSubmit} className="w-full overflow-hidden">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-4">
        {/* Basic Info Section - Always visible */}
        <div className="grid grid-cols-1 gap-4">
          <FormField 
            label="Task Title" 
            htmlFor="title"
            required
            error={errors.title}
          >
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              disabled={isSubmitting}
              error={!!errors.title}
            />
          </FormField>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField 
              label="Priority" 
              htmlFor="priority"
            >
              <Select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={isSubmitting}
                options={[
                  { value: 'no-priority', label: 'No Priority' },
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'urgent', label: 'Urgent' }
                ]}
              />
            </FormField>

            <FormField 
              label="Due Date" 
              htmlFor="dueDate"
            >
              <DateInput
                id="dueDate"
                name="dueDate"
                value={formData.dueDate ? formData.dueDate.toString() : ''}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </FormField>

            <FormField 
              label="Tags" 
              htmlFor="tags"
            >
              <TagInput
                id="tags"
                value={formData.tags || []}
                onChange={handleTagsChange}
                placeholder="Add tags..."
                disabled={isSubmitting}
              />
            </FormField>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Description Section */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 h-64">
          <FormField 
            label="Description" 
            htmlFor="description"
          >
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows={7}
              disabled={isSubmitting}
              className="h-48"
            />
          </FormField>
        </div>
        
        {/* Assigned To Section */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 h-64">
          <FormField 
            label="Assigned To" 
            htmlFor="assignedTo"
          >
            <MemberSelection
              members={members}
              selectedMemberIds={formData.assignedTo}
              onMemberSelectionChange={(selectedIds) => {
                setFormData(prev => ({ ...prev, assignedTo: selectedIds }));
              }}
              disabled={isSubmitting}
            />
          </FormField>
        </div>
      </div>
    </form>
  );
};
