import { ReactNode, forwardRef } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
  hint?: string;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, htmlFor, error, required = false, className = '', children, hint }, ref) => {
    return (
      <div className={`mb-4 ${className}`} ref={ref}>
        <label 
          htmlFor={htmlFor} 
          className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        {children}
        
        {hint && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {hint}
          </p>
        )}
        
        {error && (
          <p className="mt-1 text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-3 py-2 text-xs border rounded-md 
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'} 
          focus:border-transparent focus:outline-none focus:ring-1
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
          ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full px-3 py-2 text-xs border rounded-md 
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'} 
          focus:border-transparent focus:outline-none focus:ring-1
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
          ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: Array<{value: string, label: string}>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error, options, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full px-3 py-2 text-xs border rounded-md appearance-none
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'} 
          focus:border-transparent focus:outline-none focus:ring-1
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
          ${className}`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = 'Select';

interface TagInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string[];
  onChange: (tags: string[]) => void;
  error?: boolean;
}

export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
  ({ className = '', value = [], onChange, error, ...props }, ref) => {
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
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addTag(inputValue);
      }
    };
    
    return (
      <div className="w-full">
        <div className="flex flex-wrap gap-1 p-1 border rounded-md bg-white dark:bg-gray-800 mb-1">
          {value.map(tag => (
            <div 
              key={tag} 
              className="flex items-center bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 text-xs"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                &times;
              </button>
            </div>
          ))}
          <input
            ref={ref}
            className={`flex-grow border-none outline-none bg-transparent text-xs p-1 ${className}`}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => inputValue && addTag(inputValue)}
            {...props}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Press Enter or comma to add a tag
        </p>
      </div>
    );
  }
);

TagInput.displayName = 'TagInput';

interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="date"
        className={`w-full px-3 py-2 text-xs border rounded-md 
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'} 
          focus:border-transparent focus:outline-none focus:ring-1
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
          ${className}`}
        {...props}
      />
    );
  }
);

DateInput.displayName = 'DateInput';

// Add useState import
import { useState } from 'react';
