import { useState, useRef, useEffect } from 'react';
import { Searchbar } from '../search';
import { UserCard } from '../cards';
import { userAPI } from '../../api/projectApi';

interface User {
  _id: string;
  email: string;
  name: string;
  searchTimestamp?: Date;
}

interface UserSearchBarByEmailProps {
  onUserSelect: (user: User) => void;
  placeholder?: string;
  variant?: 'default' | 'filled' | 'outlined' | 'minimal';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showRecentSearches?: boolean;
  className?: string;
  selectedUsers?: User[];
  onUserRemove?: (userId: string) => void;
}

const UserSearchBarByEmail: React.FC<UserSearchBarByEmailProps> = ({
  onUserSelect,  placeholder = 'Search users by email...',
  variant = 'default',
  size = 'md',
  showRecentSearches = true,
  className = '',
  selectedUsers = [],
  onUserRemove,
}) => {const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [recentSearches, setRecentSearches] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Store formatted suggestions in a state to prevent regeneration on every render
  const [formattedSuggestions, setFormattedSuggestions] = useState<any[]>([]);

  // Fetch recent searches on component mount
  useEffect(() => {
    if (showRecentSearches) {
      fetchRecentSearches();
    }
  }, [showRecentSearches]);
  const fetchRecentSearches = async () => {
    try {
      const data = await userAPI.getLastSearchedUsers();
      if (data.success) {
        setRecentSearches(data.lastSearchedUsers);
      }
    } catch (error) {
      console.error('Error fetching recent searches:', error);
    }
  };  const searchUsers = async (email: string) => {
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
      console.log('Searching for users with email:', email); // Debug log
      const data = await userAPI.getByEmail(email);
      console.log('Search response:', data); // Debug log
      
      if (data.success) {
        setSearchResults(data.users || []);
      } else {
        setSearchResults([]);
        console.error('Error from API:', data.message);
      }
    } catch (error) {
      // Type narrowing for the error
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error searching users:', error);
        setSearchResults([]);
      }
      // If it's an AbortError, don't log it as it's expected
    } finally {
      // Only set loading to false if this is still the current request
      if (abortControllerRef.current === abortController) {
        setIsLoading(false);
      }
    }
  };

  const handleUserSelect = (user: User) => {
    onUserSelect(user);
    setSearchTerm(user.email);
    setSearchResults([]);
    
    // Refresh recent searches after selection
    if (showRecentSearches) {
      setTimeout(() => {
        fetchRecentSearches();
      }, 500);
    }
  };  // Format suggestions for the searchbar
  const formatSuggestions = () => {
    if (searchTerm.trim() === '') {
      const recentSuggestions = showRecentSearches ? recentSearches.map(user => ({
        id: user._id,
        label: `${user.name} (${user.email})`,
        value: user.email,
        userData: user // Store the full user object
      })) : [];
      console.log('Recent suggestions:', recentSuggestions); // Debug log
      return recentSuggestions;
    }

    const searchSuggestions = searchResults.map(user => ({
      id: user._id,
      label: `${user.name} (${user.email})`,
      value: user.email,
      userData: user // Store the full user object
    }));
    console.log('Search suggestions:', searchSuggestions); // Debug log
    return searchSuggestions;
  };

  // Update formatted suggestions when search results or recent searches change
  useEffect(() => {
    setFormattedSuggestions(formatSuggestions());
  }, [searchResults, recentSearches, searchTerm]);
  // Custom render function for suggestions
  const renderSuggestion = (suggestion: any, isActive: boolean, _query: string) => {
    const user = suggestion.userData;
    
    return (
      <div className="flex items-center w-full">
        <UserCard
          id={user._id}
          name={user.name}
          email={user.email}
          size="sm"
          variant={isActive ? "filled" : "default"}
          selected={isActive}
          className="w-full"
        />
      </div>
    );
  };
  return (
    <div className={className}>      <Searchbar
        value={searchTerm}
        onChange={(value) => {
          setSearchTerm(value);
          // When value changes, we will not automatically search
        }}
        onSearch={(value) => {
          // This gets called after debounce or on Enter
          searchUsers(value);
        }}
        placeholder={placeholder}
        variant={variant}
        size={size}
        showSearchIcon={true}
        debounceTime={300}
        suggestions={formattedSuggestions}
        showSuggestions={true}
        loadingSuggestions={isLoading}
        noSuggestionsMessage={hasSearched ? "No users found" : (searchTerm.trim() ? "Type email and press Enter to search" : "Type to search users")}
        onSuggestionSelect={(suggestion: any) => handleUserSelect(suggestion.userData)}
        highlightMatches={true}
        renderSuggestion={renderSuggestion}
        searchOnEnterOnly={true} // Always use Enter to search to avoid partial email searches
        onEnter={(value) => {
          console.log('Enter pressed with value:', value);
          searchUsers(value);
        }}
      />
      
      {/* Display selected users if any */}
      {selectedUsers && selectedUsers.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedUsers.map(user => (
            <UserCard
              key={user._id}
              id={user._id}
              name={user.name}
              email={user.email}
              size="sm"
              variant="outlined"
              className="bg-blue-50 dark:bg-blue-900/20"
              removable={!!onUserRemove}
              onRemove={onUserRemove ? () => onUserRemove(user._id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearchBarByEmail;
