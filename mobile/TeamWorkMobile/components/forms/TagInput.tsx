import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: any;
}

const TagInput: React.FC<TagInputProps> = ({
  value = [],
  onChange,
  placeholder = 'Add tags...',
  disabled = false,
  style,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    tag = tag.trim();
    if (tag && !value.includes(tag)) {
      const newTags = [...value, tag];
      onChange(newTags);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = value.filter(tag => tag !== tagToRemove);
    onChange(newTags);
  };

  const handleSubmitEditing = () => {
    addTag(inputValue);
  };

  const handleBlur = () => {
    if (inputValue) {
      addTag(inputValue);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={[
        styles.inputContainer,
        {
          backgroundColor: isDark ? '#374151' : '#ffffff',
          borderColor: isDark ? '#4b5563' : '#d1d5db',
        },
      ]}>
        {/* Tags */}
        <View style={styles.tagsContainer}>
          {value.map(tag => (
            <View
              key={tag}
              style={[
                styles.tag,
                {
                  backgroundColor: isDark ? '#4b5563' : '#f3f4f6',
                },
              ]}
            >
              <Text style={[
                styles.tagText,
                { color: isDark ? '#d1d5db' : '#374151' },
              ]}>
                {tag}
              </Text>
              <TouchableOpacity
                onPress={() => removeTag(tag)}
                disabled={disabled}
                style={styles.removeButton}
              >
                <Ionicons 
                  name="close-circle" 
                  size={14} 
                  color={isDark ? '#9ca3af' : '#6b7280'} 
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Input */}
        <TextInput
          style={[
            styles.input,
            {
              color: isDark ? '#f9fafb' : '#111827',
            },
          ]}
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleSubmitEditing}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
          editable={!disabled}
          returnKeyType="done"
        />
      </View>
      
      <Text style={[
        styles.hint,
        { color: isDark ? '#9ca3af' : '#6b7280' },
      ]}>
        Press Enter to add a tag
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    minHeight: 44,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 4,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  removeButton: {
    marginLeft: 4,
    padding: 2,
  },
  input: {
    fontSize: 16,
    paddingVertical: 4,
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default TagInput; 