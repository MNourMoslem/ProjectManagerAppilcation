import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface SearchSuggestion {
  id: string | number;
  label: string;
  value: string;
  icon?: React.ReactNode;
  userData?: any;
}

export interface SearchBarProps {
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
  fullWidth?: boolean;
  style?: any;
  
  // Icons
  showSearchIcon?: boolean;
  showClearIcon?: boolean;
  iconPosition?: 'left' | 'right';
  
  // Suggestions / autocomplete
  suggestions?: SearchSuggestion[];
  showSuggestions?: boolean;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  maxSuggestions?: number;
  highlightMatches?: boolean;
  loadingSuggestions?: boolean;
  noSuggestionsMessage?: string;
  renderSuggestion?: (suggestion: SearchSuggestion, isActive: boolean, query: string) => React.ReactNode;
  
  // Advanced features
  debounceTime?: number;
  searchOnEnterOnly?: boolean;
  
  // Events
  onFocus?: () => void;
  onBlur?: () => void;
  onEnter?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
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
  fullWidth = false,
  style,
  
  // Icons
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
  searchOnEnterOnly = false,
  
  // Events
  onFocus,
  onBlur,
  onEnter,
}) => {
  const [internalValue, setInternalValue] = useState<string>(externalValue || '');
  const [showSuggestionsList, setShowSuggestionsList] = useState<boolean>(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);
  const [timerId, setTimerId] = useState<ReturnType<typeof setTimeout> | null>(null);
  
  // Refs
  const inputRef = useRef<TextInput>(null);
  
  // Controlled component handling
  useEffect(() => {
    if (externalValue !== undefined && externalValue !== internalValue) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  // Handle autofocus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Input change handler with debounce
  const handleChange = useCallback((text: string) => {
    setInternalValue(text);
    
    // For uncontrolled component
    if (externalValue === undefined) {
      if (onChange) onChange(text);
      
      // Only debounce search if not searchOnEnterOnly
      if (!searchOnEnterOnly) {
        // Clear existing timer
        if (timerId) {
          clearTimeout(timerId);
        }
        
        // Set new timer
        const newTimerId = setTimeout(() => {
          if (onSearch) onSearch(text);
        }, debounceTime);
        
        setTimerId(newTimerId);
      }
    } else {
      // For controlled component
      if (onChange) onChange(text);
    }
    
    // Show suggestions if applicable
    if (showSuggestions) {
      setShowSuggestionsList(true);
      setActiveSuggestionIndex(-1);
    }
  }, [externalValue, onChange, onSearch, searchOnEnterOnly, timerId, debounceTime, showSuggestions]);

  // Handle search submit
  const handleSearchSubmit = useCallback(() => {
    if (onSearch) onSearch(internalValue);
    setShowSuggestionsList(false);
    Keyboard.dismiss();
  }, [onSearch, internalValue]);

  // Handle clear button click
  const handleClear = useCallback(() => {
    setInternalValue('');
    if (inputRef.current) inputRef.current.focus();
    
    if (externalValue === undefined) {
      if (onChange) onChange('');
      if (onSearch) onSearch('');
    } else {
      if (onChange) onChange('');
    }
    
    if (onClear) onClear();
  }, [externalValue, onChange, onSearch, onClear]);

  // Handle suggestion selection
  const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
    setInternalValue(suggestion.value);
    
    if (externalValue === undefined) {
      if (onChange) onChange(suggestion.value);
      if (onSearch) onSearch(suggestion.value);
    } else {
      if (onChange) onChange(suggestion.value);
    }
    
    if (onSuggestionSelect) onSuggestionSelect(suggestion);
    setShowSuggestionsList(false);
    Keyboard.dismiss();
  }, [externalValue, onChange, onSearch, onSuggestionSelect]);

  // Handle keyboard navigation for suggestions
  const handleKeyPress = useCallback((e: any) => {
    if (showSuggestionsList && suggestions.length > 0) {
      // Arrow down
      if (e.nativeEvent.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < Math.min(suggestions.length, maxSuggestions) - 1 ? prev + 1 : 0
        );
      }
      // Arrow up
      else if (e.nativeEvent.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : Math.min(suggestions.length, maxSuggestions) - 1
        );
      }
      // Enter
      else if (e.nativeEvent.key === 'Enter') {
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
    } else if (e.nativeEvent.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
      // If searchOnEnterOnly, trigger search here
      if (searchOnEnterOnly && onSearch) {
        onSearch(internalValue);
      }
      if (onEnter) onEnter(internalValue);
    }
  }, [showSuggestionsList, suggestions, maxSuggestions, activeSuggestionIndex, handleSuggestionClick, handleSearchSubmit, searchOnEnterOnly, onSearch, onEnter, internalValue]);

  // Focus handlers
  const handleFocus = useCallback(() => {
    // Show suggestions on focus if showSuggestions is enabled
    if (showSuggestions && (suggestions.length > 0 || internalValue.trim())) {
      setShowSuggestionsList(true);
    }
    if (onFocus) onFocus();
  }, [showSuggestions, suggestions.length, internalValue, onFocus]);

  const handleBlur = useCallback(() => {
    if (onBlur) onBlur();
    // Don't hide suggestions immediately - let user click on them
  }, [onBlur]);

  // Size classes
  const getSizeStyles = () => {
    switch (size) {
      case 'xs':
        return { height: 32, fontSize: 12, paddingHorizontal: 8 };
      case 'sm':
        return { height: 36, fontSize: 14, paddingHorizontal: 12 };
      case 'lg':
        return { height: 48, fontSize: 16, paddingHorizontal: 16 };
      default: // md
        return { height: 40, fontSize: 16, paddingHorizontal: 14 };
    }
  };

  // Variant classes
  const getVariantStyles = () => {
    const baseStyles = {
      borderWidth: 1,
      borderRadius: 8,
    };

    switch (variant) {
      case 'filled':
        return {
          ...baseStyles,
          backgroundColor: '#f3f4f6',
          borderColor: '#f3f4f6',
        };
      case 'outlined':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderColor: '#d1d5db',
        };
      case 'minimal':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderBottomWidth: 1,
          borderBottomColor: '#d1d5db',
          borderRadius: 0,
        };
      default: // default
        return {
          ...baseStyles,
          backgroundColor: '#ffffff',
          borderColor: '#d1d5db',
        };
    }
  };

  // Icon size
  const getIconSize = () => {
    switch (size) {
      case 'xs':
        return 14;
      case 'sm':
        return 16;
      case 'lg':
        return 20;
      default: // md
        return 18;
    }
  };

  // Calculate padding based on icons
  const getInputPadding = () => {
    const basePadding = getSizeStyles().paddingHorizontal;
    const iconSize = getIconSize();
    const iconPadding = iconSize + 8; // icon size + some spacing

    if (iconPosition === 'left' && showSearchIcon) {
      return { paddingLeft: iconPadding, paddingRight: basePadding };
    } else if (showClearIcon && internalValue) {
      return { paddingLeft: basePadding, paddingRight: iconPadding };
    }
    return { paddingHorizontal: basePadding };
  };

  // Filtered suggestions based on maxSuggestions
  const filteredSuggestions = suggestions.slice(0, maxSuggestions);

  // Highlight matches in suggestions
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? (
        <Text key={i} style={styles.highlightedText}>
          {part}
        </Text>
      ) : (
        <Text key={i}>{part}</Text>
      )
    );
  };

  // Render suggestion item
  const renderSuggestionItem = ({ item, index }: { item: SearchSuggestion; index: number }) => {
    const isActive = index === activeSuggestionIndex;
    
    return (
      <TouchableOpacity
        style={[
          styles.suggestionItem,
          isActive && styles.activeSuggestionItem,
        ]}
        onPress={() => handleSuggestionClick(item)}
      >
        {renderSuggestion ? (
          renderSuggestion(item, isActive, internalValue)
        ) : (
          <View style={styles.suggestionContent}>
            {item.icon && (
              <View style={styles.suggestionIcon}>
                {item.icon}
              </View>
            )}
            <Text style={[styles.suggestionText, isActive && styles.activeSuggestionText]}>
              {highlightMatch(item.label, internalValue)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, fullWidth && styles.fullWidth, style]}>
      {/* Main input with icon */}
      <View style={[styles.inputContainer, getVariantStyles(), getSizeStyles()]}>
        {/* Left icon */}
        {iconPosition === 'left' && showSearchIcon && (
          <View style={styles.leftIcon}>
            <Ionicons name="search" size={getIconSize()} color="#6b7280" />
          </View>
        )}
        
        <TextInput
          ref={inputRef}
          value={internalValue}
          onChangeText={handleChange}
          onKeyPress={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          editable={!disabled && !readOnly}
          style={[
            styles.input,
            getInputPadding(),
            { fontSize: getSizeStyles().fontSize },
          ]}
          autoFocus={autoFocus}
        />
        
        {/* Right icon or Clear button */}
        {((showClearIcon && internalValue) || (iconPosition === 'right' && showSearchIcon)) && (
          <View style={styles.rightIcon}>
            {internalValue && showClearIcon ? (
              <TouchableOpacity
                onPress={handleClear}
                style={styles.clearButton}
                disabled={disabled || readOnly}
              >
                <Ionicons name="close-circle" size={getIconSize()} color="#6b7280" />
              </TouchableOpacity>
            ) : iconPosition === 'right' && showSearchIcon ? (
              <Ionicons name="search" size={getIconSize()} color="#6b7280" />
            ) : null}
          </View>
        )}
      </View>

      {/* Suggestions dropdown */}
      {showSuggestionsList && showSuggestions && (
        <View style={styles.suggestionsContainer}>
          {loadingSuggestions ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#6b7280" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : filteredSuggestions.length > 0 ? (
            <FlatList
              data={filteredSuggestions}
              renderItem={renderSuggestionItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.suggestionsList}
              keyboardShouldPersistTaps="handled"
            />
          ) : (
            <View style={styles.noSuggestionsContainer}>
              <Text style={styles.noSuggestionsText}>{noSuggestionsMessage}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    minWidth: 200,
  },
  fullWidth: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    color: '#1f2937',
  },
  leftIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
  },
  clearButton: {
    padding: 2,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activeSuggestionItem: {
    backgroundColor: '#f3f4f6',
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionIcon: {
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  activeSuggestionText: {
    color: '#1f2937',
    fontWeight: '500',
  },
  highlightedText: {
    backgroundColor: '#fef3c7',
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  noSuggestionsContainer: {
    padding: 12,
    alignItems: 'center',
  },
  noSuggestionsText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default SearchBar; 