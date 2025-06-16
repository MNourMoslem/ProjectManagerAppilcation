import { useState } from 'react';
import { GridRowContainer, PaginatedGridContainer, TabContainer } from '../components/containers';
import { ViewMode } from '../components/containers/GridRowContainer';
import { PrimaryButton, SecondaryButton } from '../components/buttons';

const ContainersShowcase = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Sample data for cards
  const cards = [
    {
      id: 1,
      title: 'Simple Card',
      content: 'This is a basic card with minimal styling and content.',
      color: 'bg-blue-500',
    },
    {
      id: 2,
      title: 'Feature Card',
      content: 'This card could showcase a feature or highlight important information.',
      color: 'bg-green-500',
    },
    {
      id: 3,
      title: 'Info Card',
      content: 'Use this type of card to present information in a clear, contained manner.',
      color: 'bg-purple-500',
    },
    {
      id: 4,
      title: 'Promotional Card',
      content: 'Perfect for promotional content or special offers that need attention.',
      color: 'bg-yellow-500',
    },
    {
      id: 5,
      title: 'Alert Card',
      content: 'Can be used for important alerts or notifications that require user attention.',
      color: 'bg-red-500',
    },
    {
      id: 6,
      title: 'Stats Card',
      content: 'Present key metrics or statistics in a concise, visual format.',
      color: 'bg-indigo-500',
    },
    {
      id: 7,
      title: 'Dashboard Card',
      content: 'Ideal for dashboard interfaces where you need to display data at a glance.',
      color: 'bg-blue-500',
    },
    {
      id: 8,
      title: 'Profile Card',
      content: 'Display user profile information or team member details.',
      color: 'bg-green-500',
    },
    {
      id: 9,
      title: 'Project Card',
      content: 'Summarize project details, progress, and key information.',
      color: 'bg-purple-500',
    },
    {
      id: 10,
      title: 'Task Card',
      content: 'Represent a task or to-do item with its details and status.',
      color: 'bg-yellow-500',
    },
    {
      id: 11,
      title: 'Event Card',
      content: 'Show details about upcoming events, workshops, or meetings.',
      color: 'bg-red-500',
    },
    {
      id: 12,
      title: 'Article Card',
      content: 'Present a summary of an article, blog post, or news item.',
      color: 'bg-indigo-500',
    },
    {
      id: 13,
      title: 'Product Card',
      content: 'Display product information with pricing, features, and actions.',
      color: 'bg-blue-500',
    },
    {
      id: 14,
      title: 'Service Card',
      content: 'Highlight services offered with brief descriptions and pricing.',
      color: 'bg-green-500',
    },
    {
      id: 15,
      title: 'Testimonial Card',
      content: 'Feature customer testimonials and reviews for social proof.',
      color: 'bg-purple-500',
    },
  ];
  
  // Function to generate sample content for grid/row demonstration
  const renderSampleCard = (card: typeof cards[0]) => (
    <div key={card.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className={`h-2 w-full ${card.color}`}></div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{card.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{card.content}</p>
        <div className="flex justify-end">
          <PrimaryButton size="sm">View Details</PrimaryButton>
        </div>
      </div>
    </div>
  );
  
  // Get paginated cards
  const getPaginatedCards = (page: number, itemsPerPage: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return cards.slice(startIndex, endIndex).map(renderSampleCard);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Container Components</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Showcase of reusable container components that provide layout options
        </p>
      </div>
      
      <div className="space-y-12">
        {/* GridRowContainer Demo */}
        <section>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Grid/Row Container</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This container allows switching between grid and row layouts. The toggle controls in the top-right corner
              let users choose their preferred view.
            </p>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">External Controls</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You can also control the view mode externally:
              </p>
              <div className="flex gap-2 mb-6">
                <SecondaryButton 
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}
                >
                  Grid View
                </SecondaryButton>
                <SecondaryButton 
                  onClick={() => setViewMode('row')}
                  className={viewMode === 'row' ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}
                >
                  Row View
                </SecondaryButton>
              </div>
            </div>
          </div>
          
          <GridRowContainer
            initialViewMode={viewMode}
            onViewModeChange={setViewMode}
            title="Basic Grid/Row Container"
            gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            rowClassName="flex flex-col gap-4"
          >
            {cards.slice(0, 6).map(renderSampleCard)}
          </GridRowContainer>
        </section>
        
        {/* PaginatedGridContainer Demo */}
        <section className="mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Paginated Grid Container</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This container extends the basic grid/row container with pagination capabilities. 
              Perfect for displaying large collections of items that need to be paginated.
            </p>
          </div>
          
          <PaginatedGridContainer
            initialViewMode={viewMode}
            onViewModeChange={setViewMode}
            title="Paginated Items"
            gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            rowClassName="flex flex-col gap-4"
            itemsPerPage={6}
            totalItems={cards.length}
            currentPage={currentPage}
            onPageChange={(page) => handlePageChange(page)}
          >
            {getPaginatedCards(currentPage, 6)}
          </PaginatedGridContainer>
        </section>
        
        {/* Empty State Demo */}
        <section>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Empty State Handling</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The container handles empty states gracefully with customizable messages:
            </p>
          </div>
            <GridRowContainer
            emptyMessage="This is a custom empty state message. No items were found to display."
            title="Empty Container"
          >
            {[]}
          </GridRowContainer>
        </section>
        
        {/* TabContainer Demo */}
        <section>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">TabContainer Component</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              A versatile multi-tab container with different variants, sizes, and customization options.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Default Style</h3>
              <TabContainer 
                tabs={[
                  {
                    id: 'tab1',
                    label: 'Details',
                    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>,
                    content: <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">This is the content for the Details tab.</p>
                    </div>
                  },
                  {
                    id: 'tab2',
                    label: 'Tasks',
                    badge: 5,
                    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>,
                    content: <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">This is the content for the Tasks tab with 5 tasks.</p>
                    </div>
                  },
                  {
                    id: 'tab3',
                    label: 'Members',
                    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>,
                    content: <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">This is the content for the Members tab.</p>
                    </div>
                  }
                ]}
              />
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pills Style</h3>
              <TabContainer 
                variant="pills"
                tabs={[
                  {
                    id: 'pill1',
                    label: 'Overview',
                    content: <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">This is the content for the Overview tab.</p>
                    </div>
                  },
                  {
                    id: 'pill2',
                    label: 'Analytics',
                    content: <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">This is the content for the Analytics tab.</p>
                    </div>
                  },
                  {
                    id: 'pill3',
                    label: 'Settings',
                    content: <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">This is the content for the Settings tab.</p>
                    </div>
                  }
                ]}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Underline Style with Custom Colors</h3>
              <TabContainer 
                variant="underline"
                activeTabColor="border-blue-600"
                activeTextColor="text-blue-600 dark:text-blue-400"
                tabs={[
                  {
                    id: 'underline1',
                    label: 'Profile',
                    content: <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">This is the content for the Profile tab.</p>
                    </div>
                  },
                  {
                    id: 'underline2',
                    label: 'Account',
                    content: <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">This is the content for the Account tab.</p>
                    </div>
                  },
                  {
                    id: 'underline3',
                    label: 'Security',
                    content: <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">This is the content for the Security tab.</p>
                    </div>
                  }
                ]}
                alignment="center"
              />
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Enclosed Style with Full Width</h3>
              <TabContainer 
                variant="enclosed"
                tabs={[
                  {
                    id: 'enclosed1',
                    label: 'Documents',
                    content: <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">This is the content for the Documents tab.</p>
                    </div>
                  },
                  {
                    id: 'enclosed2',
                    label: 'Images',
                    content: <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">This is the content for the Images tab.</p>
                    </div>
                  },
                  {
                    id: 'enclosed3',
                    label: 'Videos',
                    content: <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">This is the content for the Videos tab.</p>
                    </div>
                  }
                ]}
                fullWidth={true}
                size="lg"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContainersShowcase;
