import { useState } from 'react';
import { TableWithPagination, Column } from '../components/tables';
import { 
  PrimaryButton, 
  SecondaryButton, 
  IconButton, 
  DangerButton 
} from '../components/buttons';
import { 
  FloatingDropdown, 
  DropdownButton 
} from '../components/dropdowns';

// Sample data types
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  projects: number;
}

interface Project {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on hold' | 'archived';
  members: number;
  progress: number;
  dueDate: Date;
}

function TableShowcase() {
  // Sample users data
  const users: User[] = [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'Admin', status: 'active', createdAt: new Date('2023-01-15'), projects: 8 },
    { id: 2, name: 'Sarah Miller', email: 'sarah@example.com', role: 'Developer', status: 'active', createdAt: new Date('2023-02-21'), projects: 5 },
    { id: 3, name: 'David Wilson', email: 'david@example.com', role: 'Designer', status: 'inactive', createdAt: new Date('2023-03-10'), projects: 3 },
    { id: 4, name: 'Emily Brown', email: 'emily@example.com', role: 'Manager', status: 'active', createdAt: new Date('2023-01-05'), projects: 10 },
    { id: 5, name: 'James Davis', email: 'james@example.com', role: 'Developer', status: 'pending', createdAt: new Date('2023-04-18'), projects: 4 },
    { id: 6, name: 'Olivia Smith', email: 'olivia@example.com', role: 'Designer', status: 'active', createdAt: new Date('2023-02-14'), projects: 7 },
    { id: 7, name: 'William Jones', email: 'william@example.com', role: 'Developer', status: 'inactive', createdAt: new Date('2023-03-22'), projects: 2 },
    { id: 8, name: 'Sophia Taylor', email: 'sophia@example.com', role: 'Admin', status: 'active', createdAt: new Date('2023-01-30'), projects: 9 },
    { id: 9, name: 'Michael Brown', email: 'michael@example.com', role: 'Manager', status: 'pending', createdAt: new Date('2023-04-05'), projects: 6 },
    { id: 10, name: 'Emma Wilson', email: 'emma@example.com', role: 'Developer', status: 'active', createdAt: new Date('2023-02-08'), projects: 5 },
    { id: 11, name: 'Daniel Moore', email: 'daniel@example.com', role: 'Designer', status: 'inactive', createdAt: new Date('2023-03-15'), projects: 3 },
    { id: 12, name: 'Ava Martinez', email: 'ava@example.com', role: 'Developer', status: 'active', createdAt: new Date('2023-01-20'), projects: 7 },
    { id: 13, name: 'Ryan Lee', email: 'ryan@example.com', role: 'Admin', status: 'pending', createdAt: new Date('2023-04-12'), projects: 4 },
    { id: 14, name: 'Ella Garcia', email: 'ella@example.com', role: 'Manager', status: 'active', createdAt: new Date('2023-02-28'), projects: 8 },
    { id: 15, name: 'Noah Rodriguez', email: 'noah@example.com', role: 'Developer', status: 'inactive', createdAt: new Date('2023-03-05'), projects: 2 },
  ];

  // Sample projects data
  const projects: Project[] = [
    { id: 1, name: 'Website Redesign', description: 'Redesign the company website', status: 'active', members: 5, progress: 75, dueDate: new Date('2023-07-15') },
    { id: 2, name: 'Mobile App Development', description: 'Develop a new mobile app', status: 'active', members: 8, progress: 40, dueDate: new Date('2023-09-30') },
    { id: 3, name: 'Database Migration', description: 'Migrate to a new database system', status: 'completed', members: 3, progress: 100, dueDate: new Date('2023-04-10') },
    { id: 4, name: 'Marketing Campaign', description: 'Launch a new marketing campaign', status: 'on hold', members: 4, progress: 20, dueDate: new Date('2023-08-01') },
    { id: 5, name: 'API Integration', description: 'Integrate with third-party APIs', status: 'active', members: 2, progress: 60, dueDate: new Date('2023-06-15') },
    { id: 6, name: 'Security Audit', description: 'Perform a security audit', status: 'completed', members: 3, progress: 100, dueDate: new Date('2023-03-25') },
    { id: 7, name: 'UI/UX Improvements', description: 'Improve user interface and experience', status: 'active', members: 4, progress: 50, dueDate: new Date('2023-07-05') },
    { id: 8, name: 'Performance Optimization', description: 'Optimize system performance', status: 'on hold', members: 2, progress: 30, dueDate: new Date('2023-08-20') },
    { id: 9, name: 'Content Creation', description: 'Create content for the new website', status: 'active', members: 6, progress: 65, dueDate: new Date('2023-06-30') },
    { id: 10, name: 'User Testing', description: 'Conduct user testing sessions', status: 'archived', members: 3, progress: 90, dueDate: new Date('2023-05-15') },
  ];

  // Column definitions for the users table
  const userColumns: Column<User>[] = [
    {
      id: 'name',
      header: 'Name',
      accessor: 'name',
      sortable: true,
      sortFn: (a, b) => a.name.localeCompare(b.name),
    },
    {
      id: 'email',
      header: 'Email',
      accessor: 'email',
      sortable: true,
      sortFn: (a, b) => a.email.localeCompare(b.email),
    },
    {
      id: 'role',
      header: 'Role',
      accessor: 'role',
      sortable: true,
      sortFn: (a, b) => a.role.localeCompare(b.role),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (user) => {
        const statusStyles = {
          active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500',
          inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
          pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500',
        };
        
        return (
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${statusStyles[user.status]}`}>
            {user.status}
          </span>
        );
      },
      sortable: true,
      sortFn: (a, b) => a.status.localeCompare(b.status),
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessor: (user) => user.createdAt.toLocaleDateString(),
      sortable: true,
      sortFn: (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    },
    {
      id: 'projects',
      header: 'Projects',
      accessor: 'projects',
      align: 'center',
      sortable: true,
      sortFn: (a, b) => a.projects - b.projects,
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (user) => (
        <div className="flex items-center space-x-1 justify-end">
          <IconButton 
            icon={<svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>} 
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              console.log(`Edit user: ${user.name}`);
            }}
            variant="ghost"
          />
          <DangerButton 
            icon={<svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>} 
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              console.log(`Delete user: ${user.name}`);
            }}
            // variant="ghost"
          />
        </div>
      ),
      width: '80px',
      align: 'right',
    },
  ];

  // Column definitions for the projects table
  const projectColumns: Column<Project>[] = [
    {
      id: 'name',
      header: 'Project Name',
      accessor: (project) => (
        <div>
          <div className="font-medium">{project.name}</div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{project.description}</div>
        </div>
      ),
      sortable: true,
      sortFn: (a, b) => a.name.localeCompare(b.name),
    },
    {
      id: 'status',
      header: 'Status',
      accessor: (project) => {
        const statusStyles = {
          active: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500',
          completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500',
          'on hold': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500',
          archived: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
        };
        
        return (
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${statusStyles[project.status]}`}>
            {project.status}
          </span>
        );
      },
      sortable: true,
      sortFn: (a, b) => a.status.localeCompare(b.status),
    },
    {
      id: 'members',
      header: 'Members',
      accessor: (project) => (
        <div className="flex -space-x-1">
          {[...Array(Math.min(project.members, 3))].map((_, i) => (
            <div key={i} className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[9px] ring-1 ring-white dark:ring-gray-900">
              {String.fromCharCode(65 + i)}
            </div>
          ))}
          {project.members > 3 && (
            <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[9px] ring-1 ring-white dark:ring-gray-900">
              +{project.members - 3}
            </div>
          )}
        </div>
      ),
      sortable: true,
      sortFn: (a, b) => a.members - b.members,
    },
    {
      id: 'progress',
      header: 'Progress',
      accessor: (project) => (
        <div className="w-full">
          <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-1">
            <span>{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1">
            <div 
              className="h-1 rounded-full" 
              style={{ 
                width: `${project.progress}%`, 
                backgroundColor: 
                  project.progress < 30 ? '#f87171' : 
                  project.progress < 70 ? '#facc15' : 
                  '#34d399'
              }}
            ></div>
          </div>
        </div>
      ),
      sortable: true,
      sortFn: (a, b) => a.progress - b.progress,
    },
    {
      id: 'dueDate',
      header: 'Due Date',
      accessor: (project) => {
        const today = new Date();
        const dueDate = new Date(project.dueDate);
        const isPast = dueDate < today && project.progress < 100;
        
        return (
          <span className={`${isPast ? 'text-red-500 dark:text-red-400' : ''}`}>
            {dueDate.toLocaleDateString()}
          </span>
        );
      },
      sortable: true,
      sortFn: (a, b) => a.dueDate.getTime() - b.dueDate.getTime(),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (project) => (
        <FloatingDropdown
          trigger={<IconButton icon="⋯" variant="ghost" size="xs" />}
          items={[
            { text: 'Edit', icon: <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>, onClick: () => console.log(`Edit project: ${project.name}`) },
            { text: 'Archive', icon: <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>, onClick: () => console.log(`Archive project: ${project.name}`) },
            { text: 'Delete', icon: <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>, danger: true, onClick: () => console.log(`Delete project: ${project.name}`) },
          ]}
          align="right"
          size="xs"
        />
      ),
      width: '50px',
      align: 'right',
    },
  ];

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  
  const handleUserRowClick = (user: User) => {
    console.log(`User selected: ${user.name}`);
  };

  const handleProjectRowClick = (project: Project) => {
    setSelectedProjectId(project.id === selectedProjectId ? null : project.id);
  };

  return (
    <div className="py-8">
      <div className="mb-12">
        <h1 className="text-3xl font-semibold mb-4">Table Components</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          Modern, flexible tables with sorting, pagination, and custom cell rendering capabilities.
        </p>
      </div>

      <div className="space-y-16">
        {/* Basic Table Example */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            User Management Table
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            A table with sortable columns, custom status indicators, and action buttons.
          </p>
          
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-md overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-medium">Users</h3>
              <PrimaryButton 
                text="Add User"
                icon={<svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}
                size="xs"
              />
            </div>
            <TableWithPagination
              columns={userColumns}
              data={users}
              itemsPerPage={5}
              keyExtractor={(user) => user.id}
              onRowClick={handleUserRowClick}
              compact={true}
              paginationClassName="py-3"
              emptyState={
                <div className="flex flex-col items-center py-6">
                  <svg className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 010 7.75"></path>
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-400">No users found</p>
                  <SecondaryButton 
                    text="Add User"
                    className="mt-3"
                    size="xs"
                  />
                </div>
              }
            />
          </div>
        </section>

        {/* Project Table Example */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Project Dashboard Table
          </h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            A more complex table with progress bars, member avatars, and dropdown menus.
          </p>
          
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-md overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-medium">Projects</h3>
              <div className="flex items-center space-x-2">
                <FloatingDropdown
                  trigger={<DropdownButton text="Filter" size="xs" />}
                  items={[
                    { text: 'All Projects', onClick: () => console.log('All Projects') },
                    { text: 'Active', onClick: () => console.log('Active Projects') },
                    { text: 'Completed', onClick: () => console.log('Completed Projects') },
                    { text: 'On Hold', onClick: () => console.log('On Hold Projects') },
                    { text: 'Archived', onClick: () => console.log('Archived Projects') },
                  ]}
                  size="xs"
                />
                <PrimaryButton 
                  text="New Project"
                  icon={<svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>}
                  size="xs"
                />
              </div>
            </div>
            <TableWithPagination
              columns={projectColumns}
              data={projects}
              itemsPerPage={5}
              keyExtractor={(project) => project.id}
              onRowClick={handleProjectRowClick}
              compact={true}
              paginationClassName="py-3"
            />
          </div>
        </section>

        {/* Custom Table Features */}
        <section>
          <h2 className="text-xl font-medium mb-6 pb-2 border-b border-gray-200 dark:border-gray-800">
            Table Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800 rounded-md">
              <div className="text-sm font-medium mb-2">Sorting</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                All columns can be made sortable with custom sort functions. Click on column headers to sort.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800 rounded-md">
              <div className="text-sm font-medium mb-2">Pagination</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Built-in pagination with customizable items per page and responsive pagination controls.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800 rounded-md">
              <div className="text-sm font-medium mb-2">Custom Components</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Each cell can render custom components like buttons, dropdowns, progress bars, etc.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800 rounded-md">
              <div className="text-sm font-medium mb-2">Row Selection</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Rows can be made selectable with custom click handlers for interactive tables.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800 rounded-md">
              <div className="text-sm font-medium mb-2">Empty States</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Custom empty state rendering for when no data is available in the table.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800 rounded-md">
              <div className="text-sm font-medium mb-2">Responsive Design</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tables are responsive with horizontal scrolling for small screens and compact modes.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TableShowcase;
