export interface User
{
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    profilePicture?: string; // URL to the user's profile picture
}

export interface ProjectMember extends User
{
    role: 'owner' | 'admin' | 'member'; // Role in the project
}

export interface Project
{
    _id: string;
    owner: User;
    name: string;
    shortDescription?: string; // Short description of the project
    description?: string;
    members: ProjectMember[];
    memberRoles: [{
        user : User;
        role: 'owner' | 'admin' | 'member'; // Role in the project
    }];
    status: "active" | "archived" | "completed"; // Project status
    targetDate?: Date;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectDetails
{
    taskCounts: {
        [status in 'todo' | 'in-progress' | 'done']?: number;
    };
}

export interface ProjectWithDetails extends Project {
    details: ProjectDetails;
}

export interface Issue
{
    _id: string;
    owner: User; // User ID of the issue owner
    task: string; // ID of the task this issue is related to
    title: string;
    description?: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed'; // Issue status
    lastStatusChangedBy: string; // User ID of the last person who changed the status
    createdAt: string;
    updatedAt: string;
}

export interface Comment
{
    _id: string;
    user: User; // User ID of the commenter
    taskId: string; // ID of the task this comment belongs to
    content: string;
    files?: string[]; // Array of file URLs
    createdAt: string;
    updatedAt: string;
}

export interface SumbitionMessage
{
    member : User; // User ID of the member who sent the message
    type : "submition" | "rejection",
    massege: string; // The massege content
    files?: string[]; // Array of file URLs
}

export interface Task
{
    _id: string;
    project: string; // ID of the project this task belongs to
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'done'; // Task status
    priority: "low" | "medium" | "high" | "no-priority" | "urgent"; // Task priority
    dueDate?: Date; // ISO date string
    assignedTo: User[]; // Array of user IDs assigned to this task
    tags?: string[]; // Array of tag names
    submitionMessage?: SumbitionMessage; // Submission message
    createdAt: string;
    updatedAt: string;
}

export interface Mail {
  _id: string;
  sender: {
    _id: string;
    email: string;
    name: string;
  };
  recipient: {
    _id: string;
    email: string;
    name: string;
  };  subject: string;
  body: string;
  status: 'pending' | 'sent' | 'failed' | 'accepted' | 'declined';
  sentAt: string | null;
  type: 'welcome' | 'notification' | 'reminder' | 'custom' | 'invite';
  read: boolean;
  inviteData?: {
    projectId: string;
    projectName: string;
  };
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}