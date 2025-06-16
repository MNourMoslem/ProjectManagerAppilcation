import React, { useState } from 'react';
import { MemberCard } from './MemberCard';
import './members.css';

// Icons for toggle
const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

export interface Member {
  _id: string;
  avatar?: string | null;
  name: string;
  email: string;
  role?: string;
}

interface MemberSelectionProps {
  members: Member[];
  selectedMemberIds: string[];
  onMemberSelectionChange: (selectedIds: string[]) => void;
  disabled?: boolean;
}

type ViewMode = 'grid' | 'list';

export const MemberSelection: React.FC<MemberSelectionProps> = ({
  members,
  selectedMemberIds,
  onMemberSelectionChange,
  disabled = false
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const handleSelectMember = (memberId: string, selected: boolean) => {
    if (selected) {
      // Add member to selection
      onMemberSelectionChange([...selectedMemberIds, memberId]);
    } else {
      // Remove member from selection
      onMemberSelectionChange(selectedMemberIds.filter(id => id !== memberId));
    }
  };

  return (
    <div className="flex flex-col">      <div className="flex justify-end mb-2">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 text-xs font-medium rounded-l-lg ${
              viewMode === 'grid'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            } border border-gray-200 dark:border-gray-600 focus:z-10 focus:ring-2 focus:ring-indigo-500`}
          >
            <GridIcon />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 text-xs font-medium rounded-r-lg ${
              viewMode === 'list'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            } border border-gray-200 dark:border-gray-600 focus:z-10 focus:ring-2 focus:ring-indigo-500`}
          >
            <ListIcon />
          </button>
        </div>
      </div>
      <div className="border rounded-md h-40 overflow-y-auto dark:bg-gray-800 dark:border-gray-700 custom-scrollbar">
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-1 p-2" : "flex flex-col gap-1 p-2"}>
          {members.map(member => (
            <MemberCard
              key={member._id}
              id={member._id}
              avatar={member.avatar}
              name={member.name}
              email={member.email}
              role={member.role}
              isSelected={selectedMemberIds.includes(member._id)}
              onSelect={handleSelectMember}
              disabled={disabled}
            />
          ))}
        </div>
        
        {members.length === 0 && (
          <p className="text-center py-3 text-sm text-gray-500 dark:text-gray-400">
            No members available to assign
          </p>
        )}
      </div>
    </div>
  );
};
