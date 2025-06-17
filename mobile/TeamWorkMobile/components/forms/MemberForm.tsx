import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserSearchBarByEmail from '../search/UserSearchBarByEmail';
import { User } from '../../store/projectStore';

export interface MemberFormData {
  email: string;
  role: 'admin' | 'member';
}

interface MemberFormProps {
  initialData?: Partial<MemberFormData>;
  onSubmit: (data: MemberFormData) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export const MemberForm: React.FC<MemberFormProps> = ({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  onCancel,
}) => {
  const [formData, setFormData] = useState<MemberFormData>({
    email: '',
    role: 'member',
    ...initialData,
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof MemberFormData, string>>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  // Update form when isSubmitting changes from true to false (submission completed)
  useEffect(() => {
    if (!isSubmitting && hasSubmitted && formData.email) {
      // Set success message when submission completes
      setSuccess(`Invitation sent to ${formData.email} successfully!`);
      // Reset the form after showing success
      setTimeout(() => {
        setFormData({ email: '', role: 'member' });
        setSelectedUser(null);
        setSuccess(null);
        setHasSubmitted(false);
      }, 2000);
    }
  }, [isSubmitting, hasSubmitted, formData.email]);

  const handleChange = (field: keyof MemberFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field when changed
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setFormData(prev => ({ ...prev, email: user.email }));

    // Clear email error if it exists
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }

    // Clear any existing success message when user selects someone new
    if (success) {
      setSuccess(null);
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MemberFormData, string>> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    } else if (!selectedUser) {
      // If we have an email but no selected user from search results
      // This means the user typed an email but didn't select a user from the results
      // or the email wasn't found in the system
      console.log('No user selected from search results');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      setSuccess(null);
      setHasSubmitted(true);
      onSubmit(formData);
      // We don't clear the form here since isSubmitting will be controlled by the parent
      // and we want to show loading state
    }
  };

  return (
    <View style={styles.container}>
      {success && (
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          <Text style={styles.successText}>{success}</Text>
        </View>
      )}

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Email Address <Text style={styles.required}>*</Text>
        </Text>
        <Text style={styles.hint}>Search for a user by email to add to the project</Text>
        <UserSearchBarByEmail
          onUserSelect={handleUserSelect}
          placeholder="Search users by email..."
          variant="outlined"
          showRecentSearches={true}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email}</Text>
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Role</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              formData.role === 'member' && styles.roleButtonActive,
            ]}
            onPress={() => handleChange('role', 'member')}
            disabled={isSubmitting}
          >
            <Text
              style={[
                styles.roleButtonText,
                formData.role === 'member' && styles.roleButtonTextActive,
              ]}
            >
              Member
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.roleButton,
              formData.role === 'admin' && styles.roleButtonActive,
            ]}
            onPress={() => handleChange('role', 'admin')}
            disabled={isSubmitting}
          >
            <Text
              style={[
                styles.roleButtonText,
                formData.role === 'admin' && styles.roleButtonTextActive,
              ]}
            >
              Admin
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {isSubmitting ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#6b7280" />
            <Text style={styles.loadingText}>Sending invitation...</Text>
          </View>
        ) : (
          <View style={styles.buttonRow}>
            {onCancel && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onCancel}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>Invite Member</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#065f46',
    flex: 1,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  required: {
    color: '#ef4444',
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  roleButtonTextActive: {
    color: '#ffffff',
  },
  buttonContainer: {
    marginTop: 24,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
});

export default MemberForm; 