import { useState, useEffect } from 'react';
import { FormField, Input, Textarea, Select, DateInput } from './FormField';

export interface ProjectFormData {
  name: string;
  description: string;
  status: 'Active' | 'Completed' | 'On Hold' | 'Archived';
  dueDate: string | null;
}

interface ProjectFormProps {
  initialData?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => void;
  isSubmitting?: boolean;
}

export const ProjectForm = ({ initialData = {}, onSubmit, isSubmitting = false }: ProjectFormProps) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    status: 'Active',
    dueDate: null,
    ...initialData
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});
  
  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when changed
    if (errors[name as keyof ProjectFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField 
        label="Project Name" 
        htmlFor="name"
        required
        error={errors.name}
      >
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter project name"
          disabled={isSubmitting}
          error={!!errors.name}
        />
      </FormField>
      
      <FormField 
        label="Description" 
        htmlFor="description"
      >
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter project description"
          rows={4}
          disabled={isSubmitting}
        />
      </FormField>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField 
          label="Status" 
          htmlFor="status"
        >
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={isSubmitting}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Completed', label: 'Completed' },
              { value: 'On Hold', label: 'On Hold' },
              { value: 'Archived', label: 'Archived' }
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
            value={formData.dueDate || ''}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </FormField>
      </div>
    </form>
  );
};
