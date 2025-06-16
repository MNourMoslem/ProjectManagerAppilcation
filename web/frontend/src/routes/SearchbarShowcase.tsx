import { useState, useEffect } from 'react';
import { Searchbar, UserSearchBarByEmail } from '../components/search';
import { UserCard } from '../components/cards';

function SearchbarShowcase() {
  const [basicSearchValue, setBasicSearchValue] = useState('');
  const [debounceSearchValue, setDebounceSearchValue] = useState('');
  const [debounceResult, setDebounceResult] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  // Mock API call simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debounceSearchValue) {
        setDebounceResult(`Results for: ${debounceSearchValue}`);
      } else {
        setDebounceResult('');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [debounceSearchValue]);

  // Mock suggestions
  const mockSuggestions = [
    { id: 1, label: 'React', value: 'react' },
    { id: 2, label: 'React Router', value: 'react-router' },
    { id: 3, label: 'Redux', value: 'redux' },
    { id: 4, label: 'TypeScript', value: 'typescript' },
    { id: 5, label: 'Tailwind CSS', value: 'tailwind' },
    { id: 6, label: 'Node.js', value: 'nodejs' },
    { id: 7, label: 'Express', value: 'express' },
    { id: 8, label: 'MongoDB', value: 'mongodb' },
  ];

  // Mock user suggestions with icons
  const userSuggestions = [
    { id: 1, label: 'John Doe', value: 'john', icon: '👨' },
    { id: 2, label: 'Jane Smith', value: 'jane', icon: '👩' },
    { id: 3, label: 'Robert Johnson', value: 'robert', icon: '👨' },
    { id: 4, label: 'Emily Davis', value: 'emily', icon: '👩' },
  ];

  // Handle user selection for the real UserSearchBarByEmail
  const handleUserSelect = (user: any) => {
    if (!selectedUsers.find(u => u._id === user._id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleUserRemove = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(u => u._id !== userId));
  };

  return (
    <div className="py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-semibold mb-4">Searchbar Component</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          A highly customizable searchbar component that supports various features like suggestions,
          debouncing, different sizes and styles, icons, and more.
        </p>
      </div>

      <div className="space-y-16">
        {/* Basic Searchbars */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Basic Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Default</h3>
              <div className="w-full">
                <Searchbar 
                  value={basicSearchValue}
                  onChange={setBasicSearchValue}
                  placeholder="Search..."
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Filled</h3>
              <div className="w-full">
                <Searchbar 
                  variant="filled"
                  placeholder="Search..."
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Outlined</h3>
              <div className="w-full">
                <Searchbar 
                  variant="outlined"
                  placeholder="Search..."
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Minimal</h3>
              <div className="w-full">
                <Searchbar 
                  variant="minimal"
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Sizes */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Sizes
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Extra Small</h3>
              <div className="w-full">
                <Searchbar 
                  size="xs"
                  placeholder="Extra small searchbar"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Small</h3>
              <div className="w-full">
                <Searchbar 
                  size="sm"
                  placeholder="Small searchbar"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Medium (Default)</h3>
              <div className="w-full">
                <Searchbar 
                  size="md"
                  placeholder="Medium searchbar"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Large</h3>
              <div className="w-full">
                <Searchbar 
                  size="lg"
                  placeholder="Large searchbar"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Colors */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Colors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Primary</h3>
              <div className="w-full">
                <Searchbar 
                  color="primary"
                  placeholder="Primary color"
                  variant="filled"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Secondary</h3>
              <div className="w-full">
                <Searchbar 
                  color="secondary"
                  placeholder="Secondary color"
                  variant="filled"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Success</h3>
              <div className="w-full">
                <Searchbar 
                  color="success"
                  placeholder="Success color"
                  variant="filled"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Danger</h3>
              <div className="w-full">
                <Searchbar 
                  color="danger"
                  placeholder="Danger color"
                  variant="filled"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Warning</h3>
              <div className="w-full">
                <Searchbar 
                  color="warning"
                  placeholder="Warning color"
                  variant="filled"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Info</h3>
              <div className="w-full">
                <Searchbar 
                  color="info"
                  placeholder="Info color"
                  variant="filled"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Border Radius */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Border Radius
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">None</h3>
              <div className="w-full">
                <Searchbar 
                  borderRadius="none"
                  placeholder="No border radius"
                  variant="outlined"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Small</h3>
              <div className="w-full">
                <Searchbar 
                  borderRadius="sm"
                  placeholder="Small border radius"
                  variant="outlined"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Medium</h3>
              <div className="w-full">
                <Searchbar 
                  borderRadius="md"
                  placeholder="Medium border radius"
                  variant="outlined"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Large</h3>
              <div className="w-full">
                <Searchbar 
                  borderRadius="lg"
                  placeholder="Large border radius"
                  variant="outlined"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full</h3>
              <div className="w-full">
                <Searchbar 
                  borderRadius="full"
                  placeholder="Full border radius"
                  variant="outlined"
                />
              </div>
            </div>
          </div>
        </section>

        {/* With Icons */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            With Icons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Search Icon</h3>
              <div className="w-full">
                <Searchbar 
                  showSearchIcon={true}
                  placeholder="With search icon"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">No Search Icon</h3>
              <div className="w-full">
                <Searchbar 
                  showSearchIcon={false}
                  placeholder="Without search icon"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Custom Search Icon</h3>
              <div className="w-full">
                <Searchbar 
                  searchIcon="🔍"
                  placeholder="Custom search icon"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Clear Icon</h3>
              <div className="w-full">
                <Searchbar 
                  showClearIcon={true}
                  placeholder="With clear icon"
                  value="Type to see clear icon"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Custom Clear Icon</h3>
              <div className="w-full">
                <Searchbar 
                  clearIcon="❌"
                  placeholder="Custom clear icon"
                  value="Type to see custom clear icon"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Custom Left & Right Icons</h3>
              <div className="w-full">
                <Searchbar 
                  leftIcon="👋"
                  rightIcon="🚀"
                  placeholder="Custom left and right icons"
                  showSearchIcon={false}
                  showClearIcon={false}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Features */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Advanced Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">With Debounce</h3>
              <div className="w-full">
                <Searchbar 
                  onChange={setDebounceSearchValue}
                  placeholder="Type to search with debounce..."
                  debounceTime={500}
                />
                {debounceResult && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {debounceResult}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">With Suggestions</h3>
              <div className="w-full">
                <Searchbar 
                  placeholder="Type to see suggestions..."
                  suggestions={mockSuggestions}
                  showSuggestions={true}
                  onSuggestionSelect={(suggestion) => setSelectedSuggestion(suggestion.label)}
                  highlightMatches={true}
                />
                {selectedSuggestion && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Selected: {selectedSuggestion}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">With Icons in Suggestions</h3>
              <div className="w-full">
                <Searchbar 
                  placeholder="Search users..."
                  suggestions={userSuggestions}
                  showSuggestions={true}
                  onSuggestionSelect={(suggestion) => setSelectedSuggestion(`${suggestion.icon} ${suggestion.label}`)}
                  highlightMatches={true}
                />
                {selectedSuggestion && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Selected: {selectedSuggestion}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Disabled State</h3>
              <div className="w-full">
                <Searchbar 
                  placeholder="This searchbar is disabled"
                  disabled={true}
                />
              </div>
            </div>
          </div>
        </section>        {/* Full Width */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Width Control
          </h2>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Width Searchbar</h3>
              <Searchbar 
                placeholder="This searchbar takes up the full width"
                fullWidth={true}
                variant="outlined"
                suggestions={mockSuggestions}
                showSuggestions={true}
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Auto Width Searchbars (inline)</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Searchbar 
                  placeholder="Auto width"
                  variant="default"
                  suggestions={mockSuggestions}
                  showSuggestions={true}
                />
                <Searchbar 
                  placeholder="Another auto width"
                  variant="filled"
                  color="secondary"
                  suggestions={userSuggestions}
                  showSuggestions={true}
                />
                <span className="text-gray-600 dark:text-gray-400">These are inline</span>
              </div>
            </div>
          </div>
        </section>

        {/* Different Input Types */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Different Input Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Search Type</h3>
              <div className="w-full">
                <Searchbar 
                  type="search"
                  placeholder="Search type input"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Type</h3>
              <div className="w-full">
                <Searchbar 
                  type="email"
                  placeholder="Search for emails"
                  searchIcon="✉️"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tel Type</h3>
              <div className="w-full">
                <Searchbar 
                  type="tel"
                  placeholder="Search for phone numbers"
                  searchIcon="📞"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">URL Type</h3>
              <div className="w-full">
                <Searchbar 
                  type="url"
                  placeholder="Search for URLs"
                  searchIcon="🔗"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Custom Suggestion Rendering */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Custom Suggestion Rendering
          </h2>
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">User Search with Custom Cards</h3>
              <div className="w-full">
                <UserSearchBarByEmail
                  onUserSelect={handleUserSelect}
                  placeholder="Search for users by email..."
                  variant="outlined"
                  showRecentSearches={true}
                  selectedUsers={selectedUsers}
                  onUserRemove={handleUserRemove}
                />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  This demonstrates custom suggestion rendering with user cards that include avatars and details.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">User Search (Enter to Search)</h3>
              <div className="w-full">
                <UserSearchBarByEmail
                  onUserSelect={(user: any) => console.log('Selected user (Enter only):', user)}
                  placeholder="Type email and press Enter to search..."
                  variant="filled"
                  showRecentSearches={true}
                  searchOnEnterOnly={true}
                />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  This version only searches when you press Enter, useful for compose email scenarios.
                </p>
              </div>
            </div>

            {/* Test Searches Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Test Searches</h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Try these test searches to see the searchbar in action:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Type "john" to see user suggestions</li>
                  <li>• Type "jane@example.com" to search by email</li>
                  <li>• Type "nonexistent@test.com" to see "no results" message</li>
                  <li>• Leave empty to see recent searches (if any)</li>
                </ul>
              </div>
              
              <div className="w-full">
                <Searchbar
                  placeholder="Try typing 'react' or 'javascript'..."
                  suggestions={mockSuggestions}
                  showSuggestions={true}
                  onSuggestionSelect={(suggestion) => setSelectedSuggestion(`Test: ${suggestion.label}`)}
                  highlightMatches={true}
                  noSuggestionsMessage="No programming languages found"
                />
                {selectedSuggestion && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {selectedSuggestion}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Empty Results Example</h3>
              <div className="w-full">
                <Searchbar
                  placeholder="Type something that won't be found..."
                  suggestions={[]} // Empty suggestions to demonstrate no results
                  showSuggestions={true}
                  noSuggestionsMessage="🔍 No results found. Try a different search term."
                  highlightMatches={true}
                />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  This searchbar has no suggestions to demonstrate the "no results" message.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">UserCard Component Examples</h3>
              <div className="space-y-3">
                <UserCard
                  id="1"
                  name="John Doe"
                  email="john.doe@example.com"
                  size="sm"
                  variant="default"
                />
                <UserCard
                  id="2"
                  name="Jane Smith"
                  email="jane.smith@example.com"
                  size="md"
                  variant="outlined"
                />
                <UserCard
                  id="3"
                  name="Robert Johnson"
                  email="robert.johnson@example.com"
                  size="lg"
                  variant="filled"
                  removable={true}
                  onRemove={() => console.log('Remove user 3')}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SearchbarShowcase;
