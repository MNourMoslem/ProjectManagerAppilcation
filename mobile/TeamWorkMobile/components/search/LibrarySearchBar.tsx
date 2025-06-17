import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';

export interface LibrarySearchBarSuggestion {
  id: string | number;
  label: string;
  value: string;
  userData?: any;
}

interface LibrarySearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  suggestions: LibrarySearchBarSuggestion[];
  loading?: boolean;
  placeholder?: string;
  onSuggestionSelect?: (suggestion: LibrarySearchBarSuggestion) => void;
  renderSuggestion?: (suggestion: LibrarySearchBarSuggestion) => React.ReactNode;
  style?: any;
}

const LibrarySearchBar: React.FC<LibrarySearchBarProps> = ({
  value,
  onChange,
  onSearch,
  suggestions,
  loading = false,
  placeholder = 'Search...',
  onSuggestionSelect,
  renderSuggestion,
  style,
}) => {
  const [query, setQuery] = useState(value);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Show results when suggestions change and there are suggestions
  useEffect(() => {
    setShowResults(suggestions.length > 0);
  }, [suggestions]);

  const handleChange = (text: string) => {
    setQuery(text);
    onChange(text);
    setShowResults(false);
  };

  const handleSelect = (item: LibrarySearchBarSuggestion) => {
    setQuery(item.value);
    onChange(item.value);
    setShowResults(false);
    if (onSuggestionSelect) onSuggestionSelect(item);
  };

  return (
    <View style={[styles.container, style]}>
      <Autocomplete
        data={showResults ? suggestions : []}
        value={query}
        onChangeText={handleChange}
        placeholder={placeholder}
        flatListProps={{
          keyExtractor: (item) => item.id.toString(),
          renderItem: ({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)}>
              {renderSuggestion ? (
                renderSuggestion(item)
              ) : (
                <Text style={styles.suggestionText}>{item.label}</Text>
              )}
            </TouchableOpacity>
          ),
          ListEmptyComponent: loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#6b7280" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : null,
        }}
        inputContainerStyle={styles.inputContainer}
        listContainerStyle={styles.listContainer}
        autoCapitalize="none"
        autoCorrect={false}
        onBlur={() => setShowResults(false)}
        onFocus={() => setShowResults(suggestions.length > 0)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  listContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginTop: 2,
    zIndex: 1000,
  },
  suggestionText: {
    padding: 12,
    fontSize: 15,
    color: '#374151',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
});

export default LibrarySearchBar; 