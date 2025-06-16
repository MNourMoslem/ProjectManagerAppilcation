import { useState, useEffect } from 'react';
import { 
  PrimaryButton, 
  SecondaryButton 
} from '../components/buttons';
import { 
  FloatingDropdown, 
  DropdownButton 
} from '../components/dropdowns';
import { Card, StatCard } from '../components/cards';
import Modal from '../components/modals/Modal';
import { ProjectForm } from '../components/forms/ProjectForm';
import ProjectCard from '../components/cards/ProjectCard';
import type { ProjectFormData } from '../components/forms/ProjectForm';
import { useProjectStore } from '../store/projectStore';
import { ProjectWithDetails } from '../interfaces/interfaces'

const ProjectsPage = () => {
  // Project store
  const { 
    projectsWithDetails, 
    projectsLoading, 
    projectsError, 
    fetchProjectsWithDetails,
    createProject,
    updateProject,
    deleteProject
  } = useProjectStore();
  // Local state
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch projects with details on component mount
  useEffect(() => {
    fetchProjectsWithDetails()
      .then(() => {
        console.log("Projects with details fetched successfully");
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchProjectsWithDetails]);

  // Apply filters
  const filteredProjects = projectsWithDetails.filter(project => {
    if (statusFilter && project.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Handle project deletion
  const handleDeleteProject = (projectId: string) => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      deleteProject(projectId);
    }
  };

  // Handle project form submission
  const handleCreateProject = (data: ProjectFormData) => {
    setIsSubmitting(true);
    
    const projectData = {
      name: data.name,
      description: data.description,
      status: data.status.toLowerCase(),
      targetDate: data.dueDate
    };
    
    createProject(projectData)
      .then(() => {
        setIsCreateModalOpen(false);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  
  const handleEditProject = (data: ProjectFormData) => {
    if (!editingProject) return;
    
    setIsSubmitting(true);
    
    const projectData = {
      name: data.name,
      description: data.description,
      status: data.status.toLowerCase(),
      targetDate: data.dueDate
    };
    
    updateProject(editingProject._id, projectData)
      .then(() => {
        setIsEditModalOpen(false);
        setEditingProject(null);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  
  const openEditModal = (project: ProjectWithDetails) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
            Manage and track your team's projects
          </p>
        </div>
        <PrimaryButton 
          text="New Project"
          icon={<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 4v16m8-8H4" /></svg>}
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
        />
      </div>      
      
      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          label="Total Projects" 
          value={projectsWithDetails.length}
          icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>}
        />
        <StatCard 
          label="Active Projects" 
          value={projectsWithDetails.filter((p: ProjectWithDetails) => p.status === 'active').length}
          icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            <path d="M9 12l2 2 4-4" />
          </svg>}
          trend={{ value: 20, isPositive: true }}
        />
        <StatCard 
          label="Completed Projects" 
          value={projectsWithDetails.filter((p: ProjectWithDetails) => p.status === 'completed').length}
          icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>}
        />
        <StatCard 
          label="Archived Projects" 
          value={projectsWithDetails.filter((p: ProjectWithDetails) => p.status === 'archived').length}
          icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>}
        />
      </div>      
      
      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <FloatingDropdown
          trigger={
            <DropdownButton 
              text={statusFilter || "Status"} 
              variant={statusFilter ? "secondary" : "secondary"}
              size="xs"
              icon={statusFilter && <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 18L18 6M6 6l12 12" /></svg>}
              iconPosition={statusFilter ? "right" : "left"}
              onClick={statusFilter ? () => setStatusFilter(null) : undefined}
            />
          }
          items={[
            { text: 'Active', onClick: () => setStatusFilter('active') },
            { text: 'Completed', onClick: () => setStatusFilter('completed') },
            { text: 'Archived', onClick: () => setStatusFilter('archived') },
          ]}
          align="left"
          size="xs"
        />
        
        {statusFilter && (
          <SecondaryButton
            text="Clear Filters"
            size="xs"
            onClick={() => setStatusFilter(null)}
          />
        )}
      </div>

      {/* Loading State */}
      {projectsLoading && (
        <div className="flex justify-center my-8">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-indigo-600 animate-spin"></div>
        </div>
      )}

      {/* Error State */}
      {projectsError && (
        <Card className="my-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center text-red-700 dark:text-red-400">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p>Failed to load projects. {projectsError}</p>
          </div>
        </Card>
      )}

      {/* Projects Grid */}
      {!projectsLoading && !projectsError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <div key={project._id} className="relative group">
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <FloatingDropdown
                    trigger={
                      <button className="p-1 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    }
                    items={[
                      { text: 'Edit', icon: <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>, onClick: () => openEditModal(project) },
                      { text: 'Delete', icon: <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>, danger: true, onClick: () => handleDeleteProject(project._id) },
                    ]}
                    align="right"
                    size="xs"
                  />
                </div>
                <ProjectCard 
                  project={project}
                  details={project.details}
                  loading={false}
                />
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <Card noPadding className="overflow-hidden">
                <div className="flex flex-col items-center py-12">
                  <svg className="w-16 h-16 text-gray-200 dark:text-gray-700 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">No projects found</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mb-6 text-center max-w-sm">
                    {statusFilter 
                      ? "Try clearing your filter to see all projects."
                      : "Create your first project to get started."}
                  </p>
                  <PrimaryButton
                    text="New Project"
                    icon={<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 4v16m8-8H4" /></svg>}
                    size="sm"
                    onClick={() => setIsCreateModalOpen(true)}
                  />
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="New Project"
        primaryAction={{
          text: "Create Project",
          onClick: () => document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })),
          loading: isSubmitting
        }}
        secondaryAction={{
          text: "Cancel",
          onClick: () => setIsCreateModalOpen(false)
        }}
      >
        <ProjectForm 
          onSubmit={handleCreateProject}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Project"
        primaryAction={{
          text: "Save Changes",
          onClick: () => document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })),
          loading: isSubmitting
        }}
        secondaryAction={{
          text: "Cancel",
          onClick: () => setIsEditModalOpen(false)
        }}
      >
        {editingProject && (
          <ProjectForm 
            initialData={{
              name: editingProject.name,
              description: editingProject.description,
              status: editingProject.status?.charAt(0).toUpperCase() + editingProject.status.slice(1) as any,
              dueDate: editingProject.targetDate?.toString() || ''
            }}
            onSubmit={handleEditProject}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>
    </div>
  );
};

export default ProjectsPage;
