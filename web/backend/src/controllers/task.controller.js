import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import { Comment } from "../models/comment.model.js";
import { Issue } from "../models/issue.model.js";
import { User } from "../models/user.model.js";
import { removeTaskFromDB } from "../utils/removeingFromDB.js";

export const createTask = async (req, res) => {
    const { projectId, title, description, assignedTo, priority, dueDate, tags } = req.body;

    try {
        if (!projectId || !title) {
            throw new Error("Project ID and task title are required");
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const task = new Task({
            project: projectId,
            title,
            description: description || "",
            assignedTo: assignedTo || [],
            status: "todo",
            priority: priority || "no-priority",
            dueDate: dueDate || null,
            tags: tags || [],
        });

        await task.save();

        // Add task ID to project's tasks array
        project.tasks.push(task._id);
        await project.save();

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getTasks = async (req, res) => {
    const { projectId } = req.query;

    try {
        if (!projectId) {
            throw new Error("Project ID is required");
        }

        const tasks = await Task.find({ project: projectId })
            .populate("assignedTo", "name email")

        res.status(200).json({
            success: true,
            tasks,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getAllTasksOfUser = async (req, res) => {
    try {
        const userId = req.userId; // Get user ID from the auth middleware
        
        // Find all tasks assigned to the user and populate project information
        const tasks = await Task.find({ assignedTo: userId })
            .populate('project', 'name') // Populate only the project name and ID
            .sort({ createdAt: -1 }); // Sort by creation date, newest first
        
        res.status(200).json({
            success: true,
            tasks,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getTasksOfUser = async (req, res) => {
    try {
        const userId = req.userId; // Get user ID from the auth middleware
        const { from = 0, to = 10, status, priority, projectId } = req.query;
        
        // Build the query
        const query = { assignedTo: userId };
        
        // Add filters if provided
        if (status) {
            // Handle multiple status values (comma-separated)
            if (status.includes(',')) {
                const statusValues = status.split(',');
                query.status = { $in: statusValues };
            } else {
                query.status = status;
            }
        }
        
        if (priority) {
            // Handle multiple priority values (comma-separated)
            if (priority.includes(',')) {
                const priorityValues = priority.split(',');
                query.priority = { $in: priorityValues };
            } else {
                query.priority = priority;
            }
        }
        
        if (projectId) {
            // Handle multiple project IDs (comma-separated)
            if (projectId.includes(',')) {
                const projectIds = projectId.split(',');
                query.project = { $in: projectIds };
            } else {
                query.project = projectId;
            }
        }
        
        // Find tasks with the built query
        const tasks = await Task.find(query)
            .populate('project', 'name') // Populate only the project name and ID
            .populate('assignedTo', 'name email') // Populate assigned users
            .sort({ createdAt: -1 }) // Sort by creation date, newest first
            .skip(parseInt(from)) // Skip the specified number of tasks
            .limit(parseInt(to) - parseInt(from)); // Limit to the specified range
        
        res.status(200).json({
            success: true,
            tasks,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { title, description, assignedTo, status, priority, dueDate } = req.body;

    try {
        if (!taskId) {
            throw new Error("Task ID is required");
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const User = await User.findById(req.userId);
        if (!User) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if the user is owner or admin in the project
        const project = await Project.findById(task.project);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        let isAdminOrOwner = false;
        for (const member of project.members) {
            if (member.toString() === User._id.toString() && (member.role === 'owner' || member.role === 'admin')) {
                isAdminOrOwner = true;
                break;
            }
        }

        if (!isAdminOrOwner) {
            return res.status(403).json({ success: false, message: "User does not have permission to update this task" });
        }

        // Gather updated fields for activity log
        const updatedFields = [];
        if (title && title !== task.title) updatedFields.push("title");
        if (description && description !== task.description) updatedFields.push("description");
        if (status && status !== task.status) updatedFields.push("status");
        if (priority && priority !== task.priority) updatedFields.push("priority");
        if (dueDate && dueDate !== task.dueDate) updatedFields.push("dueDate");
        if (assignedTo && JSON.stringify(assignedTo) !== JSON.stringify(task.assignedTo)) updatedFields.push("assignedTo");

        // Update task fields
        task.title = title || task.title;
        task.description = description || task.description;
        task.assignedTo = assignedTo || task.assignedTo;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        task.dueDate = dueDate || task.dueDate;

        await task.save();

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const deleteTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        if (!taskId) {
            throw new Error("Task ID is required");
        }

        // Get task details for activity logging before deletion
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        // Log deletion event in a system log (since task will be removed)
        console.log(`Task ${taskId} (${task.title}) deleted by ${req.userId} at ${new Date().toISOString()}`);
        
        await removeTaskFromDB(taskId);

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getTaskById = async (req, res) => {
    const { taskId } = req.params;

    try {
        if (!taskId) {
            throw new Error("Task ID is required");
        }

        const task = await Task.findById(taskId)
            .populate("assignedTo", "name email")

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        res.status(200).json({
            success: true,
            task,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const assignTaskToUser = async (req, res) => {
    const { taskId } = req.params;
    const { userId } = req.body;

    try {
        if (!taskId || !userId) {
            throw new Error("Task ID and User ID are required");
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Add user to task's assignedTo array
        if (!task.assignedTo.includes(userId)) {
            task.assignedTo.push(userId);
            await task.save();
        }
        // Add task to user's tasks array
        if (!user.tasks.includes(taskId)) {
            user.tasks.push(taskId);
            await user.save();
        }
        res.status(200).json({
            success: true,
            message: "Task assigned to user successfully",
            task,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


export const unassignTaskFromUser = async (req, res) => {
    const { taskId } = req.params;
    const { userId } = req.body;

    try {
        if (!taskId || !userId) {
            throw new Error("Task ID and User ID are required");
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const user = await User.findById(userId);
        
        // Remove user from task's assignedTo array
        task.assignedTo = task.assignedTo.filter(id => id.toString() !== userId);
        
        await task.save();
        
        // Remove task from user's tasks array
        if (user) {
            user.tasks = user.tasks.filter(id => id.toString() !== taskId);
            await user.save();
        }
        res.status(200).json({
            success: true,
            message: "Task unassigned from user successfully",
            task,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


export const changeTaskStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;

    try {
        if (!taskId || !status) {
            throw new Error("Task ID and status are required");
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const oldStatus = task.status;
        task.status = status;
        
        await task.save();

        res.status(200).json({
            success: true,
            message: "Task status updated successfully",
            task,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const submitTask = async (req, res) => {
    const { taskId } = req.params;
    const { message } = req.body;

    try {
        if (!taskId) {
            throw new Error("Task ID is required");
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if the user can submit this task
        const project = await Project.findById(task.project);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        // User can submit if:
        // 1. They are owner/admin, or
        // 2. Task is assigned to them, or
        // 3. Task is not assigned to anyone
        let canSubmit = false;
        
        // Check if user is owner or admin
        const userRole = project.memberRoles.find(mr => mr.user.toString() === req.userId);
        if (userRole && (userRole.role === 'owner' || userRole.role === 'admin')) {
            canSubmit = true;
        }
        
        // Check if task is assigned to user or not assigned to anyone
        if (!canSubmit) {
            if (task.assignedTo.length === 0) {
                // Not assigned to anyone, any member can submit
                if (project.members.includes(req.userId)) {
                    canSubmit = true;
                }
            } else if (task.assignedTo.includes(req.userId)) {
                // Assigned to this user
                canSubmit = true;
            }
        }

        if (!canSubmit) {
            return res.status(403).json({ 
                success: false, 
                message: "You don't have permission to submit this task" 
            });
        }

        // Update task status and submission message
        const oldStatus = task.status;
        task.status = "done";
        task.submitionMessage = {
            member: req.userId,
            type: "submition",
            massege: message || "",
            files: []
        };

        await task.save();

        // Return the updated task with populated fields
        const updatedTask = await Task.findById(taskId)
            .populate("assignedTo", "name email")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "name email"
                }
            })
            .populate({
                path: "issues",
                populate: {
                    path: "owner lastStatusChangedBy",
                    select: "name email"
                }
            })
            .populate("submitionMessage.member", "name email");

        res.status(200).json({
            success: true,
            message: "Task submitted successfully",
            task: updatedTask,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const rejectTask = async (req, res) => {
    const { taskId } = req.params;
    const { message } = req.body;

    try {
        if (!taskId) {
            throw new Error("Task ID is required");
        }

        if (!message) {
            throw new Error("Rejection message is required");
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if the user can reject this task (only owner/admin)
        const project = await Project.findById(task.project);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        // Check if user is owner or admin
        const userRole = project.memberRoles.find(mr => mr.user.toString() === req.userId);
        if (!userRole || (userRole.role !== 'owner' && userRole.role !== 'admin')) {
            return res.status(403).json({ 
                success: false, 
                message: "Only project owners and admins can reject tasks" 
            });
        }

        // Update task with rejection message
        task.submitionMessage = {
            member: req.userId,
            type: "rejection",
            massege: message,
            files: []
        };

        await task.save();

        // Return the updated task with populated fields
        const updatedTask = await Task.findById(taskId)
            .populate("assignedTo", "name email")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "name email"
                }
            })
            .populate({
                path: "issues",
                populate: {
                    path: "owner lastStatusChangedBy",
                    select: "name email"
                }
            })
            .populate("submitionMessage.member", "name email");

        res.status(200).json({
            success: true,
            message: "Task rejected successfully",
            task: updatedTask,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const addComment = async (req, res) => {
    const { taskId } = req.params;
    const { content } = req.body;

    try {
        if (!taskId) {
            throw new Error("Task ID is required");
        }

        if (!content) {
            throw new Error("Comment content is required");
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        // Create new comment
        const comment = new Comment({
            task: taskId,
            user: req.userId,
            content,
            files: []
        });

        await comment.save();

        // Add comment to task
        task.comments.push(comment._id);
        
        await task.save();

        // Return the updated task with populated fields
        const updatedTask = await Task.findById(taskId)
            .populate("assignedTo", "name email")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "name email"
                }
            })
            .populate({
                path: "issues",
                populate: {
                    path: "owner lastStatusChangedBy",
                    select: "name email"
                }
            })
            .populate("submitionMessage.member", "name email");

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            task: updatedTask,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const addIssue = async (req, res) => {
    const { taskId } = req.params;
    const { title, description } = req.body;

    try {
        if (!taskId) {
            throw new Error("Task ID is required");
        }

        if (!title) {
            throw new Error("Issue title is required");
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        // Create new issue
        const issue = new Issue({
            owner: req.userId,
            task: taskId,
            title,
            description: description || "",
            status: "open",
            lastStatusChangedBy: req.userId
        });

        await issue.save();

        // Add issue to task
        task.issues.push(issue._id);
        
        await task.save();

        // Return the updated task with populated fields
        const updatedTask = await Task.findById(taskId)
            .populate("assignedTo", "name email")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "name email"
                }
            })
            .populate({
                path: "issues",
                populate: {
                    path: "owner lastStatusChangedBy",
                    select: "name email"
                }
            })
            .populate("submitionMessage.member", "name email");

        res.status(201).json({
            success: true,
            message: "Issue added successfully",
            task: updatedTask,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const updateIssueStatus = async (req, res) => {
    const { taskId, issueId } = req.params;
    const { status } = req.body;

    try {
        if (!taskId || !issueId) {
            throw new Error("Task ID and Issue ID are required");
        }

        if (!status || !['open', 'in-progress', 'resolved', 'closed'].includes(status)) {
            throw new Error("Valid status is required (open, in-progress, resolved, closed)");
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const issue = await Issue.findById(issueId);
        if (!issue) {
            return res.status(404).json({ success: false, message: "Issue not found" });
        }

        // Check if the issue belongs to the task
        if (issue.task.toString() !== taskId) {
            return res.status(400).json({ success: false, message: "Issue does not belong to the specified task" });
        }

        // Update issue status
        issue.status = status;
        issue.lastStatusChangedBy = req.userId;
        await issue.save();

        // Return the updated task with populated fields
        const updatedTask = await Task.findById(taskId)
            .populate("assignedTo", "name email")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "name email"
                }
            })
            .populate({
                path: "issues",
                populate: {
                    path: "owner lastStatusChangedBy",
                    select: "name email"
                }
            })
            .populate("submitionMessage.member", "name email");

        res.status(200).json({
            success: true,
            message: "Issue status updated successfully",
            task: updatedTask,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getTaskIssues = async (req, res) => {
    const { taskId } = req.params;

    try {
        if (!taskId) {
            throw new Error("Task ID is required");
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const issues = await Issue.find({ task: taskId })
            .populate("owner", "name email")
            .populate("lastStatusChangedBy", "name email");

        res.status(200).json({
            success: true,
            issues,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getTaskComments = async (req, res) => {
    const { taskId } = req.params;

    try {
        if (!taskId) {
            throw new Error("Task ID is required");
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const comments = await Comment.find({ task: taskId })
            .populate("user", "name email")
            .populate("files");

        res.status(200).json({
            success: true,
            comments,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}