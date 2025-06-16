import { useState } from 'react';
import { 
  FloatingDropdown, 
  ExpandingDropdown, 
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  CheckboxDropdownItem
} from '../components/dropdowns';
import type { DropdownItemProps } from '../components/dropdowns';
import { IconButton, PrimaryButton, SecondaryButton } from '../components/buttons';

function DropdownShowcase() {
  // Sample items for dropdowns
  const sampleItems: DropdownItemProps[] = [
    { text: 'Edit', icon: '✏️', onClick: () => console.log('Edit clicked') },
    { text: 'Duplicate', icon: '📋', onClick: () => console.log('Duplicate clicked') },
    { text: 'Archive', icon: '📦', onClick: () => console.log('Archive clicked') },
    { text: 'Delete', icon: '🗑️', danger: true, onClick: () => console.log('Delete clicked') },
  ];

  const sampleItemsWithShortcuts: DropdownItemProps[] = [
    { text: 'Cut', rightText: '⌘X', onClick: () => console.log('Cut clicked') },
    { text: 'Copy', rightText: '⌘C', onClick: () => console.log('Copy clicked') },
    { text: 'Paste', rightText: '⌘V', onClick: () => console.log('Paste clicked') },
  ];  
  
  const sampleNestedItems: DropdownItemProps[] = [
    { text: 'Edit', icon: '✏️', onClick: () => console.log('Edit clicked') },
    { 
      text: 'Share', 
      icon: '🔗', 
      isSubmenu: true, 
      submenu: (
        <div className="py-1">
          <DropdownItem 
            text="Copy link" 
            icon="🔗" 
            onClick={() => console.log('Copy link clicked')} 
          />
          <DropdownItem 
            text="Email" 
            icon="📧" 
            onClick={() => console.log('Email clicked')} 
          />
          <DropdownItem 
            text="More options" 
            icon="⋯" 
            isSubmenu={true} 
            submenu={
              <div className="py-1">
                <DropdownItem 
                  text="Slack" 
                  icon="💬" 
                  onClick={() => console.log('Slack clicked')} 
                />
                <DropdownItem 
                  text="Teams" 
                  icon="👥" 
                  onClick={() => console.log('Teams clicked')} 
                />
              </div>
            }
          />
        </div>
      )
    },
    { text: 'Delete', icon: '🗑️', danger: true, onClick: () => console.log('Delete clicked') },
  ];

  // For demonstration of state
  const [activeFilter, setActiveFilter] = useState('All');
  const filterOptions = ['All', 'Active', 'Completed', 'Archived'];

  return (
    <div className="py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-semibold mb-4">Dropdown Components</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          Linear-inspired dropdown menus and buttons with multiple styles, sizes, and configurations.
        </p>
      </div>

      <div className="space-y-16">
        {/* Floating Dropdowns */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Floating Dropdowns
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Dropdowns that float above their container with higher z-index.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Basic Dropdown */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Basic Dropdown</h3>
              <div>
                <FloatingDropdown
                  trigger={<DropdownButton text="Options" />}
                  items={sampleItems}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Simple dropdown with icon and text in each item
              </div>
            </div>

            {/* Dropdown with Right Text */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">With Shortcuts</h3>
              <div>
                <FloatingDropdown
                  trigger={<DropdownButton text="Edit" variant="primary" />}
                  items={sampleItemsWithShortcuts}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Items with right-aligned text for keyboard shortcuts
              </div>
            </div>

            {/* Nested Dropdown */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Nested Dropdown</h3>
              <div>
                <FloatingDropdown
                  trigger={<DropdownButton text="Actions" variant="secondary" />}
                  items={sampleNestedItems}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Dropdown with nested submenus that appear on hover
              </div>
            </div>
          </div>

          {/* Icon Trigger Dropdowns */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Icon Only Trigger</h3>
              <div>
                <FloatingDropdown
                  trigger={<IconButton icon="⋯" />}
                  items={sampleItems}
                  align="left"
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Dropdown triggered by an icon button
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Custom Alignment</h3>
              <div className="text-right">
                <FloatingDropdown
                  trigger={<DropdownButton text="Right Aligned" showCaret={false} icon="↓" />}
                  items={sampleItems}
                  align="right"
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Dropdown aligned to the right edge of the trigger
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Different Sizes</h3>
              <div className="flex space-x-2">
                <FloatingDropdown
                  trigger={<DropdownButton text="XS" size="xs" />}
                  items={sampleItems.slice(0, 2)}
                  size="xs"
                />
                <FloatingDropdown
                  trigger={<DropdownButton text="SM" size="sm" />}
                  items={sampleItems.slice(0, 2)}
                  size="sm"
                />
                <FloatingDropdown
                  trigger={<DropdownButton text="MD" size="md" />}
                  items={sampleItems.slice(0, 2)}
                  size="md"
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Dropdowns in different sizes
              </div>
            </div>
          </div>
        </section>

        {/* Expanding Dropdowns */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Expanding Dropdowns
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Dropdowns that expand within their container, ideal for accordion-like interfaces.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Expanding Dropdown */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Basic Expanding Menu</h3>
              <div>
                <ExpandingDropdown
                  trigger={
                    <div className="px-3 py-2 flex justify-between items-center">
                      <span>Filter Options</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  }
                  items={[
                    { text: 'All Tasks', onClick: () => console.log('All selected') },
                    { text: 'My Tasks', onClick: () => console.log('My Tasks selected') },
                    { text: 'Assigned to me', onClick: () => console.log('Assigned selected') },
                  ]}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Simple expanding dropdown with basic items
              </div>
            </div>

            {/* Filter Example */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Stateful Filter Example</h3>
              <div>
                <ExpandingDropdown
                  trigger={
                    <div className="px-3 py-2 flex justify-between items-center">
                      <span>Status: <strong>{activeFilter}</strong></span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  }
                  items={filterOptions.map(option => ({
                    text: option,
                    icon: activeFilter === option ? '✓' : undefined,
                    onClick: () => setActiveFilter(option)
                  }))}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Expanding dropdown that maintains selected state
              </div>
            </div>
          </div>
        </section>

        {/* Real-World Examples */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Real-World Examples
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Common dropdown patterns used in application interfaces.
          </p>

          {/* Project Card Example */}
          <div className="max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm mb-8">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium">Website Redesign</h3>
              <FloatingDropdown
                trigger={<IconButton icon="⋯" variant="ghost" size="xs" />}
                items={sampleItems}
                align="right"
                size="sm"
              />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Progress</span>
                <span>60%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div className="bg-black dark:bg-white h-1.5 rounded-full w-3/5"></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                12 of 20 tasks completed
              </div>
              <FloatingDropdown
                trigger={<DropdownButton text="Status" size="xs" variant="ghost" />}
                items={[
                  { text: 'In Progress', icon: '🔄' },
                  { text: 'On Hold', icon: '⏸️' },
                  { text: 'Completed', icon: '✅' },
                ]}
                align="right"
                size="sm"
              />
            </div>
          </div>

          {/* Toolbar Example */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-sm mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FloatingDropdown
                  trigger={<DropdownButton text="File" size="xs" variant="ghost" showCaret={false} />}
                  items={[
                    { text: 'New', rightText: '⌘N' },
                    { text: 'Open', rightText: '⌘O' },
                    { text: 'Save', rightText: '⌘S' },
                    { text: 'Export', isSubmenu: true, submenu: (
                      <div>
                        {[
                          { text: 'PDF' },
                          { text: 'PNG' },
                          { text: 'SVG' },
                        ].map((item, i) => (
                          <DropdownItem key={i} {...item} />
                        ))}
                      </div>
                    )},
                  ]}
                  size="xs"
                />
                <FloatingDropdown
                  trigger={<DropdownButton text="Edit" size="xs" variant="ghost" showCaret={false} />}
                  items={sampleItemsWithShortcuts}
                  size="xs"
                />
                <FloatingDropdown
                  trigger={<DropdownButton text="View" size="xs" variant="ghost" showCaret={false} />}
                  items={[
                    { text: 'Zoom In', rightText: '⌘+' },
                    { text: 'Zoom Out', rightText: '⌘-' },
                    { text: 'Reset Zoom', rightText: '⌘0' },
                  ]}
                  size="xs"
                />
              </div>
              <div>
                <FloatingDropdown
                  trigger={<IconButton icon="👤" size="xs" />}
                  items={[
                    { text: 'Profile', icon: '👤' },
                    { text: 'Settings', icon: '⚙️' },
                    { text: 'Log Out', icon: '🚪' },
                  ]}
                  align="right"
                  size="xs"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Checkbox Dropdown Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">
            Checkbox Dropdowns
          </h2>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Multi-Select with Checkboxes</h3>
              
              <CheckboxDropdownExample />
              
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Dropdown with items that can be checked independently (stays open when clicking items)
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

// Example component to demonstrate checkbox dropdown functionality
function CheckboxDropdownExample() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
  const options = [
    { id: 'option1', label: 'Option 1' },
    { id: 'option2', label: 'Option 2' },
    { id: 'option3', label: 'Option 3' },
    { id: 'option4', label: 'Option 4' }
  ];
  
  const handleCheckChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions(prev => [...prev, optionId]);
    } else {
      setSelectedOptions(prev => prev.filter(id => id !== optionId));
    }
  };
  
  // Get the display text for the dropdown button
  const getDisplayText = () => {
    if (selectedOptions.length === 0) return "Select options";
    if (selectedOptions.length === 1) {
      return options.find(opt => opt.id === selectedOptions[0])?.label || "1 selected";
    }
    return `${selectedOptions.length} selected`;
  };
  
  return (
    <div>
      <FloatingDropdown
        trigger={
          <DropdownButton 
            text={getDisplayText()} 
            variant={selectedOptions.length > 0 ? "secondary" : "default"}
            size="md"
            icon={selectedOptions.length > 0 ? 
              <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg> : undefined
            }
            iconPosition={selectedOptions.length > 0 ? "right" : "left"}
            onClick={selectedOptions.length > 0 ? () => setSelectedOptions([]) : undefined}
          />
        }
        items={options.map(option => ({
          text: option.label,
          isCheckbox: true,
          checked: selectedOptions.includes(option.id),
          onCheckChange: (checked) => handleCheckChange(option.id, checked)
        }))}
        align="left"
      />
      
      {selectedOptions.length > 0 && (
        <div className="mt-4 text-sm">
          <div>Selected: {selectedOptions.map(id => 
            options.find(opt => opt.id === id)?.label).join(", ")}
          </div>
        </div>
      )}
    </div>
  );
}


export default DropdownShowcase;
