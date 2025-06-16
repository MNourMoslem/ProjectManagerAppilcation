import { useState, useEffect } from 'react';
import { FormField, Select } from './FormField';
import { UserSearchBarByEmail } from '../search';
import LoadingSpinner from '../buttons/LoadingSpinner';

export interface MemberFormData {
  email: string;
  role: 'admin' | 'member';
}

interface User {
  _id: string;
  email: string;
  name: string;
}

interface MemberFormProps {
  initialData?: Partial<MemberFormData>;
  onSubmit: (data: MemberFormData) => void;
  isSubmitting?: boolean;
}

export const MemberForm = ({ 
  initialData = {}, 
  onSubmit, 
  isSubmitting = false
}: MemberFormProps) => {
  const [formData, setFormData] = useState<MemberFormData>({
    email: '',
    role: 'member',
    ...initialData
  });
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof MemberFormData, string>>>({});
  const [success, setSuccess] = useState<string | null>(null);
  
  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);
  // Update form when isSubmitting changes from true to false (submission completed)
  useEffect(() => {
    if (!isSubmitting && formData.email) {
      // Set success message when submission completes
      setSuccess(`Invitation sent to ${formData.email} successfully!`);
    }
  }, [isSubmitting, formData.email]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when changed
    if (errors[name as keyof MemberFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setFormData(prev => ({ ...prev, email: user.email }));
    
    // Clear email error if it exists
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MemberFormData, string>> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      setSuccess(null);
      onSubmit(formData);
      // We don't clear the form here since isSubmitting will be controlled by the parent
      // and we want to show loading state
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-md text-sm">
          {success}
        </div>
      )}
      
      <FormField 
        label="Email Address" 
        htmlFor="email"
        required
        error={errors.email}
        hint="Search for a user by email to add to the project"
      >
        <UserSearchBarByEmail
          onUserSelect={handleUserSelect}
          placeholder="Search users by email..."
          variant="outlined"
          showRecentSearches={true}
          searchOnEnterOnly={false}
          className="w-full"
        />
      </FormField>
      
      <FormField 
        label="Role" 
        htmlFor="role"
      >
        <Select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          disabled={isSubmitting}
          options={[
            { value: 'member', label: 'Member' },
            { value: 'admin', label: 'Admin' },
          ]}
        />
      </FormField>
      
      <div className="pt-2 flex justify-end">
        {isSubmitting ? (
          <div className="flex items-center space-x-2 text-gray-500">
            <LoadingSpinner size="sm" color="gray" />
            <span>Sending invitation...</span>
          </div>
        ) : (
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            disabled={isSubmitting}
          >
            Add Member
          </button>
        )}
      </div>
    </form>
  );
};
