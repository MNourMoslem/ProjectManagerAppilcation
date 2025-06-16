import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent, ReactNode, CSSProperties } from 'react';

export interface SearchbarProps {
  // Core functionality
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  
  // Visual customization
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined' | 'minimal';
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'gray' | string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  fullWidth?: boolean;
  className?: string;
  style?: CSSProperties;
  
  // Icons
  searchIcon?: ReactNode;
  clearIcon?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  showSearchIcon?: boolean;
  showClearIcon?: boolean;
  iconPosition?: 'left' | 'right';
    // Suggestions / autocomplete
  suggestions?: Array<{ id: string | number; label: string; value: string; icon?: ReactNode }>;
  showSuggestions?: boolean;
  onSuggestionSelect?: (suggestion: { id: string | number; label: string; value: string; icon?: ReactNode }) => void;
  maxSuggestions?: number;
  highlightMatches?: boolean;
  loadingSuggestions?: boolean;
  noSuggestionsMessage?: string;
  renderSuggestion?: (suggestion: any, isActive: boolean, query: string) => ReactNode;
  // Advanced features
  debounceTime?: number;
  type?: 'text' | 'search' | 'email' | 'tel' | 'url';
  name?: string;
  id?: string;
  form?: string;
  required?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  showResultsCount?: boolean;
  resultsCount?: number;
  searchOnEnterOnly?: boolean;
  
  // Events
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onEscape?: () => void;
  onEnter?: (value: string) => void;
}

const Searchbar: React.FC<SearchbarProps> = ({
  // Core functionality
  value: externalValue,
  onChange,
  onSearch,
  onClear,
  placeholder = 'Search...',
  autoFocus = false,
  disabled = false,
  readOnly = false,
  
  // Visual customization
  size = 'md',
  variant = 'default',
  color = 'primary',
  borderRadius = 'md',
  fullWidth = false,
  className = '',
  style,
  
  // Icons
  searchIcon,
  clearIcon,
  leftIcon,
  rightIcon,
  showSearchIcon = true,
  showClearIcon = true,
  iconPosition = 'left',
    // Suggestions / autocomplete
  suggestions = [],
  showSuggestions = false,
  onSuggestionSelect,
  maxSuggestions = 5,
  highlightMatches = true,
  loadingSuggestions = false,
  noSuggestionsMessage = 'No suggestions found',
  renderSuggestion,
    // Advanced features
  debounceTime = 300,
  type = 'search',
  name,
  id,
  form,
  required = false,
  pattern,
  minLength,
  maxLength,
  showResultsCount = false,
  resultsCount,
  searchOnEnterOnly = false,
  
  // Events
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
  onEscape,
  onEnter,
}) => {  // State for controlled or uncontrolled input
  const [internalValue, setInternalValue] = useState<string>(externalValue || '');
  const [showSuggestionsList, setShowSuggestionsList] = useState<boolean>(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);
  const [timerId, setTimerId] = useState<ReturnType<typeof setTimeout> | null>(null);
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Controlled component handling
  useEffect(() => {
    if (externalValue !== undefined && externalValue !== internalValue) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  // Debounced search
  useEffect(() => {
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [timerId]);

  // Click outside handler for suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestionsList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle autofocus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  // Input change handler with debounce
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    
    // For uncontrolled component
    if (externalValue === undefined) {
      if (onChange) onChange(newValue);
      
      // Only debounce search if not searchOnEnterOnly
      if (!searchOnEnterOnly) {
        // Debounce search
        if (timerId) clearTimeout(timerId);
        
        const newTimerId = setTimeout(() => {
          if (onSearch) onSearch(newValue);
        }, debounceTime);
        
        setTimerId(newTimerId);
      }
    } else {
      // For controlled component
      if (onChange) onChange(newValue);
    }    // Show suggestions if applicable
    if (showSuggestions) {
      // Always show suggestions list when showSuggestions is true
      // This handles cases with suggestions, empty suggestions (for "no results"), or recent searches
      setShowSuggestionsList(true);
      setActiveSuggestionIndex(-1);
    }
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    if (onSearch) onSearch(internalValue);
    setShowSuggestionsList(false);
  };

  // Handle clear button click
  const handleClear = () => {
    setInternalValue('');
    if (inputRef.current) inputRef.current.focus();
    
    if (externalValue === undefined) {
      if (onChange) onChange('');
      if (onSearch) onSearch('');
    } else {
      if (onChange) onChange('');
    }
    
    if (onClear) onClear();
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: { id: string | number; label: string; value: string; icon?: ReactNode }) => {
    setInternalValue(suggestion.value);
    
    if (externalValue === undefined) {
      if (onChange) onChange(suggestion.value);
      if (onSearch) onSearch(suggestion.value);
    } else {
      if (onChange) onChange(suggestion.value);
    }
    
    if (onSuggestionSelect) onSuggestionSelect(suggestion);
    setShowSuggestionsList(false);
  };

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) onKeyDown(e);
    
    if (showSuggestionsList && suggestions.length > 0) {
      // Arrow down
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < Math.min(suggestions.length, maxSuggestions) - 1 ? prev + 1 : 0
        );
      }
      // Arrow up
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : Math.min(suggestions.length, maxSuggestions) - 1
        );
      }      // Enter
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
          handleSuggestionClick(suggestions[activeSuggestionIndex]);
        } else {
          handleSearchSubmit();
          // If searchOnEnterOnly, trigger search here
          if (searchOnEnterOnly && onSearch) {
            onSearch(internalValue);
          }
        }
        
        if (onEnter) onEnter(internalValue);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
      // If searchOnEnterOnly, trigger search here
      if (searchOnEnterOnly && onSearch) {
        onSearch(internalValue);
      }
      if (onEnter) onEnter(internalValue);
    }
    
    // Escape
    if (e.key === 'Escape') {
      setShowSuggestionsList(false);
      if (onEscape) onEscape();
    }
  };  // Focus handlers
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Show suggestions on focus if showSuggestions is enabled and either we have suggestions
    // or we want to show "no results" message for empty suggestions with text
    if (showSuggestions && (suggestions.length > 0 || (suggestions.length === 0 && internalValue.trim()))) {
      setShowSuggestionsList(true);
    }
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) onBlur(e);
    // Don't hide suggestions immediately - handled by click outside
  };

  // Size classes
  const sizeClasses = {
    xs: 'h-6 text-xs px-2',
    sm: 'h-8 text-sm px-3',
    md: 'h-10 text-base px-4',
    lg: 'h-12 text-lg px-5',
  };
  // Variant and color classes
  const getVariantClasses = () => {
    // Base classes
    let classes = 'transition-all duration-200 focus:outline-none focus:ring-2 ';
    
    // Add size
    classes += sizeClasses[size] + ' ';
    
    // Add width - always use w-full since the parent container controls the width
    classes += 'w-full ';
    
    // Add border radius
    switch (borderRadius) {
      case 'none':
        classes += 'rounded-none ';
        break;
      case 'sm':
        classes += 'rounded-sm ';
        break;
      case 'md':
        classes += 'rounded-md ';
        break;
      case 'lg':
        classes += 'rounded-lg ';
        break;
      case 'full':
        classes += 'rounded-full ';
        break;
    }
    
    // Add variant-specific styles
    const colorMap: Record<string, { bg: string, border: string, text: string, ring: string, hover: string, focusBg: string }> = {
      primary: {
        bg: 'bg-indigo-50 dark:bg-indigo-900/20',
        border: 'border-indigo-300 dark:border-indigo-700',
        text: 'text-gray-800 dark:text-gray-200',
        ring: 'focus:ring-indigo-500/40 dark:focus:ring-indigo-500/30',
        hover: 'hover:border-indigo-400 dark:hover:border-indigo-600',
        focusBg: 'focus:bg-white dark:focus:bg-gray-900',
      },
      secondary: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-300 dark:border-purple-700',
        text: 'text-gray-800 dark:text-gray-200',
        ring: 'focus:ring-purple-500/40 dark:focus:ring-purple-500/30',
        hover: 'hover:border-purple-400 dark:hover:border-purple-600',
        focusBg: 'focus:bg-white dark:focus:bg-gray-900',
      },
      success: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-300 dark:border-green-700',
        text: 'text-gray-800 dark:text-gray-200',
        ring: 'focus:ring-green-500/40 dark:focus:ring-green-500/30',
        hover: 'hover:border-green-400 dark:hover:border-green-600',
        focusBg: 'focus:bg-white dark:focus:bg-gray-900',
      },
      danger: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-300 dark:border-red-700',
        text: 'text-gray-800 dark:text-gray-200',
        ring: 'focus:ring-red-500/40 dark:focus:ring-red-500/30',
        hover: 'hover:border-red-400 dark:hover:border-red-600',
        focusBg: 'focus:bg-white dark:focus:bg-gray-900',
      },
      warning: {
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        border: 'border-amber-300 dark:border-amber-700',
        text: 'text-gray-800 dark:text-gray-200',
        ring: 'focus:ring-amber-500/40 dark:focus:ring-amber-500/30',
        hover: 'hover:border-amber-400 dark:hover:border-amber-600',
        focusBg: 'focus:bg-white dark:focus:bg-gray-900',
      },
      info: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-300 dark:border-blue-700',
        text: 'text-gray-800 dark:text-gray-200',
        ring: 'focus:ring-blue-500/40 dark:focus:ring-blue-500/30',
        hover: 'hover:border-blue-400 dark:hover:border-blue-600',
        focusBg: 'focus:bg-white dark:focus:bg-gray-900',
      },
      gray: {
        bg: 'bg-gray-50 dark:bg-gray-800/50',
        border: 'border-gray-300 dark:border-gray-700',
        text: 'text-gray-800 dark:text-gray-200',
        ring: 'focus:ring-gray-400/40 dark:focus:ring-gray-500/30',
        hover: 'hover:border-gray-400 dark:hover:border-gray-600',
        focusBg: 'focus:bg-white dark:focus:bg-gray-900',
      },
    };
    
    // Use the color map or default to gray
    const colorStyle = colorMap[color] || colorMap.gray;
    
    switch (variant) {
      case 'filled':
        classes += `${colorStyle.bg} ${colorStyle.text} ${colorStyle.ring} `;
        if (!disabled) classes += `hover:${colorStyle.focusBg} `;
        break;
      case 'outlined':
        classes += `bg-transparent border ${colorStyle.border} ${colorStyle.text} ${colorStyle.ring} `;
        if (!disabled) classes += `${colorStyle.hover} focus:${colorStyle.focusBg} `;
        break;
      case 'minimal':
        classes += `bg-transparent ${colorStyle.text} ${colorStyle.ring} `;
        if (!disabled) classes += `hover:bg-gray-100 dark:hover:bg-gray-800 `;
        break;
      default: // default variant
        classes += `bg-white dark:bg-gray-800 border ${colorStyle.border} ${colorStyle.text} ${colorStyle.ring} `;
        if (!disabled) classes += `${colorStyle.hover} `;
    }
    
    // Add disabled styles
    if (disabled) {
      classes += 'opacity-60 cursor-not-allowed ';
    }
    
    return classes;
  };

  // Icon size based on searchbar size
  const getIconSize = () => {
    switch (size) {
      case 'xs':
        return 'w-3 h-3';
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  };

  // Default search icon
  const defaultSearchIcon = (
    <svg 
      className={`${getIconSize()} text-gray-500 dark:text-gray-400`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );

  // Default clear icon
  const defaultClearIcon = (
    <svg 
      className={`${getIconSize()} text-gray-500 dark:text-gray-400`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
  
  // Highlight matches in suggestions
  const highlightMatch = (text: string, query: string) => {
    if (!highlightMatches || !query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <span key={i} className="bg-yellow-200 dark:bg-yellow-700 font-medium">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  // Calculate padding based on icons
  const getInputPadding = () => {
    const basePadding = {
      left: iconPosition === 'left' && (showSearchIcon || leftIcon) ? 'pl-10' : '',
      right: (showClearIcon && internalValue) || rightIcon ? 'pr-10' : '',
    };
    
    // If both left and right icons are present, add additional padding
    if (
      iconPosition === 'left' && 
      (showSearchIcon || leftIcon) && 
      ((showClearIcon && internalValue) || rightIcon)
    ) {
      return `${basePadding.left} ${basePadding.right}`;
    }
    
    return `${basePadding.left} ${basePadding.right}`;
  };

  // Render the search and clear icons
  const renderIcons = () => {
    return (
      <>
        {/* Left icon */}
        {iconPosition === 'left' && (showSearchIcon || leftIcon) && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {leftIcon || (showSearchIcon && (searchIcon || defaultSearchIcon))}
          </div>
        )}
        
        {/* Right icon or Clear button */}
        {((showClearIcon && internalValue) || rightIcon) && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {internalValue && showClearIcon ? (
              <button
                type="button"
                onClick={handleClear}
                className="focus:outline-none hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="Clear search"
                disabled={disabled || readOnly}
              >
                {clearIcon || defaultClearIcon}
              </button>
            ) : rightIcon || null}
          </div>
        )}
        
        {/* Right search icon (if iconPosition is right) */}
        {iconPosition === 'right' && showSearchIcon && !(showClearIcon && internalValue) && !rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {searchIcon || defaultSearchIcon}
          </div>
        )}
      </>
    );
  };

  // Filtered suggestions based on maxSuggestions
  const filteredSuggestions = suggestions.slice(0, maxSuggestions);  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'inline-block min-w-[200px]'}`}>
      {/* Main input with icon */}
      <div className="relative w-full">
        <input
          ref={inputRef}
          type={type}
          value={internalValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={onKeyUp}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={`${getVariantClasses()} ${getInputPadding()} ${className}`}
          style={style}
          autoFocus={autoFocus}
          name={name}
          id={id}
          form={form}
          required={required}
          pattern={pattern}
          minLength={minLength}
          maxLength={maxLength}
          aria-autocomplete={showSuggestions ? 'list' : 'none'}
          aria-controls={showSuggestions ? 'search-suggestions' : undefined}
          aria-expanded={showSuggestionsList}
          role="searchbox"
        />
        
        {renderIcons()}
        
        {/* Results count badge */}
        {showResultsCount && resultsCount !== undefined && (
          <div className="absolute right-0 -top-1 -translate-y-full mb-1">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {resultsCount} result{resultsCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && showSuggestionsList && (
        <div
          ref={suggestionsRef}
          id="search-suggestions"
          className={`absolute z-10 left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto ${
            borderRadius === 'none' ? 'rounded-none' : 
            borderRadius === 'sm' ? 'rounded-sm' : 
            borderRadius === 'lg' ? 'rounded-lg' : 
            borderRadius === 'full' ? 'rounded-lg' : 'rounded-md'
          }`}
          role="listbox"
        >
          {loadingSuggestions ? (
            <div className="p-3 text-center text-gray-500 dark:text-gray-400">
              <svg 
                className="animate-spin h-5 w-5 mx-auto mb-1" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading suggestions...
            </div>
          ) : filteredSuggestions.length > 0 ? (
            <ul className="py-1">
              {filteredSuggestions.map((suggestion, index) => (                <li
                  key={suggestion.id}
                  className={`px-3 py-2 cursor-pointer ${
                    index === activeSuggestionIndex
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  role="option"
                  aria-selected={index === activeSuggestionIndex}
                >
                  {renderSuggestion ? (
                    renderSuggestion(suggestion, index === activeSuggestionIndex, internalValue)
                  ) : (
                    <>
                      {suggestion.icon && (
                        <span className="mr-2 flex-shrink-0">{suggestion.icon}</span>
                      )}
                      <span className="truncate">
                        {highlightMatch(suggestion.label, internalValue)}
                      </span>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-center text-gray-500 dark:text-gray-400">
              {noSuggestionsMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
