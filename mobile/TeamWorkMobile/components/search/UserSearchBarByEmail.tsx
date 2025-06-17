import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LibrarySearchBar, { LibrarySearchBarSuggestion } from './LibrarySearchBar';
import { userAPI } from '../../api/projectApi';
import { User } from '../../store/projectStore';

interface UserSearchBarByEmailProps {
  onUserSelect: (user: User) => void;
  placeholder?: string;
  variant?: 'default' | 'filled' | 'outlined' | 'minimal';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showRecentSearches?: boolean;
  style?: any;
  selectedUsers?: User[];
  onUserRemove?: (userId: string) => void;
}

const UserSearchBarByEmail: React.FC<UserSearchBarByEmailProps> = ({
  onUserSelect,
  placeholder = 'Search users by email...',
  variant = 'default',
  size = 'md',
  showRecentSearches = true,
  style = {},
  selectedUsers = [],
  onUserRemove,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [recentSearches, setRecentSearches] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Fetch recent searches on component mount
  useEffect(() => {
    if (showRecentSearches) {
      fetchRecentSearches();
    }
  }, [showRecentSearches]);

  const fetchRecentSearches = useCallback(async () => {
    try {
      const data = await userAPI.getLastSearchedUsers();
      if (data.success) {
        setRecentSearches(data.lastSearchedUsers);
      }
    } catch (error) {
      console.error('Error fetching recent searches:', error);
    }
  }, []);

  const searchUsers = useCallback(async (email: string) => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!email.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    // Create a new abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoading(true);
    setHasSearched(true);

    try {
      console.log('Searching for users with email:', email);
      const data = await userAPI.getByEmail(email);
      console.log('Search response:', data);
      
      if (data.success) {
        setSearchResults(data.users || []);
      } else {
        setSearchResults([]);
        console.error('Error from API:', data.message);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error searching users:', error);
        setSearchResults([]);
      }
    } finally {
      if (abortControllerRef.current === abortController) {
        setIsLoading(false);
      }
    }
  }, []);

  const handleUserSelect = useCallback((user: User) => {
    onUserSelect(user);
    setSearchTerm(user.email);
    setSearchResults([]);
    
    // Refresh recent searches after selection
    if (showRecentSearches) {
      setTimeout(() => {
        fetchRecentSearches();
      }, 500);
    }
  }, [onUserSelect, showRecentSearches, fetchRecentSearches]);

  // Format suggestions for the searchbar
  const formatSuggestions = useCallback((): LibrarySearchBarSuggestion[] => {
    if (searchTerm.trim() === '') {
      const recentSuggestions = showRecentSearches ? recentSearches.map(user => ({
        id: user._id,
        label: `${user.name} (${user.email})`,
        value: user.email,
        userData: user
      })) : [];
      console.log('Recent suggestions:', recentSuggestions);
      return recentSuggestions;
    }

    const searchSuggestions = searchResults.map(user => ({
      id: user._id,
      label: `${user.name} (${user.email})`,
      value: user.email,
      userData: user
    }));
    console.log('Search suggestions:', searchSuggestions);
    return searchSuggestions;
  }, [searchResults, recentSearches, searchTerm, showRecentSearches]);

  // Custom render function for suggestions
  const renderSuggestion = useCallback((suggestion: LibrarySearchBarSuggestion) => {
    const user = suggestion.userData as User;
    
    return (
      <View style={styles.userSuggestion}>
        <View style={styles.userAvatar}>
          <Text style={styles.avatarText}>
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user.name}
          </Text>
          <Text style={styles.userEmail}>
            {user.email}
          </Text>
        </View>
      </View>
    );
  }, []);

  const handleSearch = useCallback((value: string) => {
    console.log('Search triggered with value:', value);
    searchUsers(value);
  }, [searchUsers]);

  const handleSuggestionSelect = useCallback((suggestion: LibrarySearchBarSuggestion) => {
    handleUserSelect(suggestion.userData as User);
  }, [handleUserSelect]);

  return (
    <View style={[styles.container, style]}>
      <LibrarySearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        onSearch={handleSearch}
        suggestions={formatSuggestions()}
        loading={isLoading}
        placeholder={placeholder}
        onSuggestionSelect={handleSuggestionSelect}
        renderSuggestion={renderSuggestion}
      />
      
      {/* Display selected users if any */}
      {selectedUsers && selectedUsers.length > 0 && (
        <View style={styles.selectedUsersContainer}>
          {selectedUsers.map(user => (
            <View key={user._id} style={styles.selectedUserCard}>
              <View style={styles.selectedUserAvatar}>
                <Text style={styles.selectedAvatarText}>
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <View style={styles.selectedUserInfo}>
                <Text style={styles.selectedUserName}>{user.name}</Text>
                <Text style={styles.selectedUserEmail}>{user.email}</Text>
              </View>
              {onUserRemove && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => onUserRemove(user._id)}
                >
                  <Ionicons name="close-circle" size={16} color="#ef4444" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  userSuggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  userEmail: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 1,
  },
  selectedUsersContainer: {
    marginTop: 12,
  },
  selectedUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedUserAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedAvatarText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  selectedUserInfo: {
    flex: 1,
  },
  selectedUserName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1e40af',
  },
  selectedUserEmail: {
    fontSize: 11,
    color: '#3b82f6',
    marginTop: 1,
  },
  removeButton: {
    padding: 4,
  },
});

export default UserSearchBarByEmail; 