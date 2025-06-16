import { Project } from '../models/project.model.js';
import { Task } from '../models/task.model.js';

export const isUserPartOfProject = async (user, project) => {
    if (!user || !project) {
        throw new Error("User and Project are required");
    }
    const userId = user._id || "";
    return project.members.some(member => member._id.toString() === userId.toString());
}

export const isUserPartOfProjectByTask = async (user, task) => {
    const project = await Project.findById(task.project);
    if (!project) {
        throw new Error("Project not found");
    }

    return isUserPartOfProject(user, project);
}

export const isUserPartOfProjectByIssue = async (user, issue) => {
    const task = await Task.findById(issue.task);
    if (!task) {
        throw new Error("Task not found");
    }
    return isUserPartOfProjectByTask(user, task);
}

export const isUserPartOfProjectByComment = async (user, comment) => {
    const task = await Task.findById(comment.task);
    if (!task) {
        throw new Error("Task not found");
    }
    return isUserPartOfProjectByTask(user, task);
}

export const isUserAdminOrOwner = async (user, project) => {
    if (!user || !project) {
        throw new Error("User and Project are required");
    }
    const userId = user._id || "";
    return project.members.some(member => 
        member._id.toString() === userId && (member.role === 'owner' || member.role === 'admin')
    );
}

export const isUserOwner = async (user, project) => {
    if (!user || !project) {
        throw new Error("User and Project are required");
    }
    const userId = user._id || "";
    return project.members.some(member => member._id.toString() === userId && member.role === 'owner');
}
