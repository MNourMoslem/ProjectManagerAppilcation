import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { FormField, Input } from './index';
import { PrimaryButton, SecondaryButton } from '../buttons';

export interface ProjectFormData {
  name: string;
  description: string;
  status: string;
  dueDate: string;
}

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<ProjectFormData>;
  title?: string;
  submitText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
  mode?: 'create' | 'edit';
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  initialData,
  title,
  submitText,
  cancelText,
  showCancelButton = true,
  mode = 'create'
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [formData, setFormData] = useState<ProjectFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    status: initialData?.status || 'Active',
    dueDate: initialData?.dueDate || ''
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        name: initialData.name || prev.name,
        description: initialData.description || prev.description,
        status: initialData.status || prev.status,
        dueDate: initialData.dueDate || prev.dueDate
      }));
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    // Validate date format if provided
    if (formData.dueDate.trim()) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.dueDate)) {
        newErrors.dueDate = 'Date must be in YYYY-MM-DD format';
      } else {
        const date = new Date(formData.dueDate);
        if (isNaN(date.getTime())) {
          newErrors.dueDate = 'Invalid date';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    onCancel?.();
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <View className="flex-1">
      {/* Header */}
      {title && (
        <View className={`flex-row items-center justify-between p-4 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <Text className="text-lg font-bold text-black dark:text-white">
            {title}
          </Text>
        </View>
      )}

      {/* Form */}
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <View className="space-y-6">
          <FormField
            label="Project name"
            error={errors.name}
            required
          >
            <Input
              placeholder="Enter project name"
              value={formData.name}
              onChangeText={(text) => {
                setFormData(prev => ({ ...prev, name: text }));
                clearError('name');
              }}
              error={!!errors.name}
              fullWidth
            />
          </FormField>

          <FormField
            label="Description"
            error={errors.description}
            required
          >
            <Input
              placeholder="Enter project description"
              value={formData.description}
              onChangeText={(text) => {
                setFormData(prev => ({ ...prev, description: text }));
                clearError('description');
              }}
              error={!!errors.description}
              multiline
              numberOfLines={4}
              fullWidth
            />
          </FormField>

          <FormField
            label="Status"
            required
          >
            <View className="flex-row space-x-2">
              {['Active', 'Completed', 'Archived'].map((status) => (
                <TouchableOpacity
                  key={status}
                  className={`flex-1 py-2 px-3 rounded-md border ${
                    formData.status === status
                      ? 'bg-black dark:bg-white border-black dark:border-white'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                  onPress={() => setFormData(prev => ({ ...prev, status }))}
                  activeOpacity={0.7}
                >
                  <Text className={`text-center text-sm font-medium ${
                    formData.status === status
                      ? 'text-white dark:text-black'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </FormField>

          <FormField
            label="Due date (optional)"
            error={errors.dueDate}
          >
            <Input
              placeholder="YYYY-MM-DD"
              value={formData.dueDate}
              onChangeText={(text) => {
                setFormData(prev => ({ ...prev, dueDate: text }));
                clearError('dueDate');
              }}
              error={!!errors.dueDate}
              fullWidth
            />
            {errors.dueDate && (
              <Text className="text-xs text-red-500 mt-1">
                {errors.dueDate}
              </Text>
            )}
          </FormField>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className={`p-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <View className="space-y-3">
          <PrimaryButton
            text={submitText || (mode === 'create' ? 'Create Project' : 'Update Project')}
            iconName={mode === 'create' ? 'add' : 'save'}
            onPress={handleSubmit}
            disabled={isSubmitting}
            size="lg"
            fullWidth
          />
          
          {showCancelButton && (
            <SecondaryButton
              text={cancelText || 'Cancel'}
              iconName="close"
              onPress={handleCancel}
              disabled={isSubmitting}
              size="lg"
              fullWidth
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default ProjectForm; 