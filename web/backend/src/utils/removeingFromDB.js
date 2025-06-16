import { Issue } from "../models/issue.model.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import { Comment } from "../models/comment.model.js";


export const removeIssueFromDB = async (issueId) => {
    try {
        const issue = await Issue.findById(issueId);
        if (!issue) {
            throw new Error("Issue not found");
        };

        await issue.remove();
    }
    catch (error) {
        throw new Error(`Error finding issue: ${error.message}`);
    }
}

export const removeFileFromDB = async (fileId) => {
    try {
        const file = await File.findById(fileId);
        if (!file) {
            throw new Error("File not found");
        }
        await file.remove();
    }
    catch (error) {
        throw new Error(`Error finding file: ${error.message}`);
    }
}

export const removeCommentFromDB = async (commentId) => {
    try {
        const comment = await Comment
            .findById(commentId)
            .populate("task");
        if (!comment) {
            throw new Error("Comment not found");
        }
        await comment.remove();
        // Remove comment from task comments array
        const task = await Task.findById(comment.task._id);
        if (task) {
            task.comments = task.comments.filter(id => id.toString() !== commentId);
            await task.save();
        }

        // remove all files associated with the comment
        for (const fileId of comment.files) {
            await removeFileFromDB(fileId);
        }
    }
    catch (error) {
        throw new Error(`Error finding comment: ${error.message}`);
    }
}

export const removeTaskFromDB = async (taskId) => {
    try {
        const task = await Task
            .findById(taskId)
            .populate("project")
            .populate("assignedTo")
            .populate("files");
        if (!task) {
            throw new Error("Task not found");
        }

        // Remove all issues associated with the task
        for (const issueId of task.issues) {
            await removeIssueFromDB(issueId);
        }

        // Remove all comments associated with the task
        for (const commentId of task.comments) {
            await removeCommentFromDB(commentId);
        }

        // Remove all files associated with the task
        for (const fileId of task.files) {
            await removeFileFromDB(fileId);
        }

        // Remove task from project tasks array
        if (task.project) {
            const project = await Project.findById(task.project._id);
            if (project) {
                project.tasks = project.tasks.filter(id => id.toString() !== taskId);
                await project.save();
            }
        }

        await task.remove();
    }
    catch (error) {
        throw new Error(`Error finding task: ${error.message}`);
    }
}

export const removeProjectFromDB = async (projectId, newOwnerId) => {
    try {
        const project = await Project
            .findById(projectId)
            .populate("tasks")
            .populate("users");
        if (!project) {
            throw new Error("Project not found");
        }

        // Check if project has multiple users
        if (project.users.length > 1 && newOwnerId) {
            // If the project has other users and a new owner is specified,
            // transfer ownership instead of removing the project
            
            // Find the new owner
            const newUserOwner = newOwnerId ? await User.findById(newOwnerId) : null;
            if (newUserOwner) {
                project.owner = newUserOwner._id;
                
                // Check if new owner already has a role, if not, add owner role
                const hasRole = project.memberRoles.some(role => role.user.toString() === newOwnerId);
                if (!hasRole) {
                    project.memberRoles.push({ user: newUserOwner._id, role: "owner" });
                } else {
                    // Update existing role to owner
                    for (const role of project.memberRoles) {
                        if (role.user.toString() === newOwnerId) {
                            role.role = "owner";
                            break;
                        }
                    }
                }
                
                await project.save();
                return;
            } else {
                // If no valid new owner, assign to first member
                const firstMember = project.members.find(member => member.user.toString() !== project.owner.toString());
                if (firstMember) {
                    project.owner = firstMember.user;
                    
                    // Update role to owner
                    for (const role of project.memberRoles) {
                        if (role.user.toString() === firstMember.user.toString()) {
                            role.role = "owner";
                            break;
                        }
                    }
                    
                    await project.save();
                    return;
                }
            }
        }

        // If no valid new owner or only one user, proceed with full project removal
        
        // Remove all tasks associated with the project
        for (const task of project.tasks) {
            await removeTaskFromDB(task._id);
        }

        // Remove all users associated with the project
        for (const userId of project.users) {
            const user = await User.findById(userId);
            if (user) {
                user.projects = user.projects.filter(id => id.toString() !== projectId);
                await user.save();
            }
        }

        await project.remove();
    }
    catch (error) {
        throw new Error(`Error finding project: ${error.message}`);
    }
}


export const removeUserFromDB = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Handle user's projects
        for (const projectId of user.projects) {
            await removeProjectFromDB(projectId, null);
        }

        await user.remove();
    }
    catch (error) {
        throw new Error(`Error finding user: ${error.message}`);
    }
}