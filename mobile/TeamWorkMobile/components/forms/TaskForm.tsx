import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import TagInput from './TagInput';
import DatePicker from './DatePicker';
import MemberSelection from '../members/MemberSelection';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface TaskFormData {
  projectId: string;
  title: string;
  description: string;
  priority: 'no-priority' | 'low' | 'medium' | 'high' | 'urgent';
  dueDate: Date | null;
  assignedTo: string[];
  tags: string[];
}

interface TaskFormProps {
  projectId: string;
  members: User[];
  initialData?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  projectId,
  members = [],
  initialData = {},
  onSubmit,
  isSubmitting = false,
  onCancel,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [formData, setFormData] = useState<TaskFormData>({
    projectId,
    title: '',
    description: '',
    priority: 'medium',
    dueDate: null,
    assignedTo: [],
    tags: [],
    ...initialData,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (field: keyof TaskFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field when changed
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
    }
  };

  const priorityOptions = [
    { value: 'no-priority', label: 'No Priority' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Basic Info Section */}
      <View style={[
        styles.section,
        {
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          borderColor: isDark ? '#374151' : '#e5e7eb',
        },
      ]}>
        <Text style={[
          styles.sectionTitle,
          { color: isDark ? '#f9fafb' : '#111827' },
        ]}>
          Basic Information
        </Text>

        {/* Task Title */}
        <View style={styles.field}>
          <Text style={[
            styles.label,
            { color: isDark ? '#d1d5db' : '#374151' },
          ]}>
            Task Title *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#374151' : '#ffffff',
                borderColor: errors.title ? '#ef4444' : (isDark ? '#4b5563' : '#d1d5db'),
                color: isDark ? '#f9fafb' : '#111827',
              },
            ]}
            value={formData.title}
            onChangeText={(value) => handleChange('title', value)}
            placeholder="Enter task title"
            placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
            editable={!isSubmitting}
          />
          {errors.title && (
            <Text style={styles.errorText}>{errors.title}</Text>
          )}
        </View>

        {/* Priority, Due Date, Tags Row */}
        <View style={styles.row}>
          {/* Priority */}
          <View style={[styles.field, styles.halfField]}>
            <Text style={[
              styles.label,
              { color: isDark ? '#d1d5db' : '#374151' },
            ]}>
              Priority
            </Text>
            <View style={[
              styles.pickerContainer,
              {
                backgroundColor: isDark ? '#374151' : '#ffffff',
                borderColor: isDark ? '#4b5563' : '#d1d5db',
              },
            ]}>
              <Picker
                selectedValue={formData.priority}
                onValueChange={(value: string) => handleChange('priority', value)}
                enabled={!isSubmitting}
                style={[
                  styles.picker,
                  { 
                    color: isDark ? '#f9fafb' : '#111827',
                    backgroundColor: isDark ? '#374151' : '#ffffff',
                  },
                ]}
                itemStyle={{
                  color: isDark ? '#f9fafb' : '#111827',
                  backgroundColor: isDark ? '#374151' : '#ffffff',
                }}
              >
                {priorityOptions.map(option => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Due Date */}
          <View style={[styles.field, styles.halfField]}>
            <Text style={[
              styles.label,
              { color: isDark ? '#d1d5db' : '#374151' },
            ]}>
              Due Date
            </Text>
            <DatePicker
              value={formData.dueDate}
              onChange={(date) => handleChange('dueDate', date)}
              placeholder="Select a date"
              disabled={isSubmitting}
            />
          </View>
        </View>

        {/* Tags */}
        <View style={styles.field}>
          <Text style={[
            styles.label,
            { color: isDark ? '#d1d5db' : '#374151' },
          ]}>
            Tags
          </Text>
          <TagInput
            value={formData.tags}
            onChange={(tags) => handleChange('tags', tags)}
            placeholder="Add tags..."
            disabled={isSubmitting}
          />
        </View>
      </View>

      {/* Description and Assignment Section */}
      <View style={styles.row}>
        {/* Description */}
        <View style={[
          styles.section,
          styles.halfSection,
          {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderColor: isDark ? '#374151' : '#e5e7eb',
          },
        ]}>
          <Text style={[
            styles.sectionTitle,
            { color: isDark ? '#f9fafb' : '#111827' },
          ]}>
            Description
          </Text>
          <TextInput
            style={[
              styles.textarea,
              {
                backgroundColor: isDark ? '#374151' : '#ffffff',
                borderColor: isDark ? '#4b5563' : '#d1d5db',
                color: isDark ? '#f9fafb' : '#111827',
              },
            ]}
            value={formData.description}
            onChangeText={(value) => handleChange('description', value)}
            placeholder="Enter task description"
            placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            editable={!isSubmitting}
          />
        </View>

        {/* Assigned To */}
        <View style={[
          styles.section,
          styles.halfSection,
          {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderColor: isDark ? '#374151' : '#e5e7eb',
          },
        ]}>
          <Text style={[
            styles.sectionTitle,
            { color: isDark ? '#f9fafb' : '#111827' },
          ]}>
            Assigned To
          </Text>
          <MemberSelection
            members={members}
            selectedMemberIds={formData.assignedTo}
            onMemberSelectionChange={(selectedIds) => handleChange('assignedTo', selectedIds)}
            disabled={isSubmitting}
          />
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          {
            backgroundColor: isSubmitting ? (isDark ? '#6b7280' : '#9ca3af') : '#6366f1',
          },
        ]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Saving...' : 'Save Task'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 120,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  halfSection: {
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TaskForm; 