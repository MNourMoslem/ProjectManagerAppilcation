import React from 'react';
import { View, Modal } from 'react-native';
import { useColorScheme } from 'nativewind';
import { ProjectForm, ProjectFormData } from '../forms';

interface ProjectModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  isSubmitting?: boolean;
  initialData?: Partial<ProjectFormData>;
  title?: string;
  mode?: 'create' | 'edit';
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialData,
  title,
  mode = 'create'
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <ProjectForm
          onSubmit={onSubmit}
          onCancel={handleClose}
          isSubmitting={isSubmitting}
          initialData={initialData}
          title={title || (mode === 'create' ? 'Create New Project' : 'Edit Project')}
          mode={mode}
          showCancelButton={true}
        />
      </View>
    </Modal>
  );
};

export default ProjectModal; 