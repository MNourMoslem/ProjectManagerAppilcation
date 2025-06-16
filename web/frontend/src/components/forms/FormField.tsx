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

interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  error?: boolean;
  value: string | null;
  onChange: (e : React.ChangeEvent<HTMLInputElement>) => void;
  placeholderText?: string;
  formatDisplay?: boolean;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ 
    className = '', 
    error, 
    value, 
    onChange, 
    disabled = false,
    placeholderText = 'Select a date',
    formatDisplay = false,
    ...props   }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    
    // Combine the forwarded ref with our local ref
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // Format date for display
    const formatDate = (dateString: string | null): string => {
      if (!dateString) return '';
      if (!formatDisplay) return dateString;
      
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      } catch (e) {
        return dateString;
      }
    };

    // Format date for input value (yyyy-MM-dd)
    const getInputValue = (): string => {
      if (!value) return '';
      try {
        const date = new Date(value);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch (e) {
        return value;
      }
    };

    return (
      <div className="relative">
        <div className={`relative flex items-center ${disabled ? 'opacity-60' : ''}`}>
          <input
            ref={inputRef}
            type="date"
            className={`w-full px-3 py-2 text-xs border rounded-md 
              ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500'} 
              focus:border-transparent focus:outline-none focus:ring-1
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
              ${formatDisplay ? 'opacity-0 absolute inset-0 z-10' : ''}
              ${className}`}
            value={getInputValue()}
            onChange={onChange}
            disabled={disabled}
            {...props}
          />
          
          {formatDisplay && (
            <div 
              className={`w-full px-3 py-2 text-xs border rounded-md flex items-center justify-between
                ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
            >
              <span className={value ? '' : 'text-gray-400 dark:text-gray-500'}>
                {value ? formatDate(value) : placeholderText}
              </span>
              <div className="flex items-center">
                {value && (
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 mr-1"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';

// Add useState import
import { useState, useRef, useImperativeHandle } from 'react';
