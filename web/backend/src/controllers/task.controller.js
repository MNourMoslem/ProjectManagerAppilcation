import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import { Comment } from "../models/comment.model.js";
import { Issue } from "../models/issue.model.js";
import { User } from "../models/user.model.js";
import { removeTaskFromDB } from "../utils/removeingFromDB.js";
import { isUserAdminOrOwner } from "../utils/userHasAccess.js";
import { 
    notifyTaskAssigned, 
    notifyTaskStatusChanged, 
    notifyTaskCompleted,
    notifyCommentAdded,
    notifyIssueCreated,
    notifyIssueResolved
} from "./notification.controller.js";

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
        });        await task.save();

        // Add task ID to project's tasks array
        project.tasks.push(task._id);
        await project.save();

        // Send notifications to assigned users
        console.log("Task created successfully, now sending notifications");
        console.log("assignedTo:", assignedTo);
        console.log("req.userId:", req.userId);
        
        if (assignedTo && assignedTo.length > 0) {
            console.log(`Sending notifications to ${assignedTo.length} users`);
            for (const userId of assignedTo) {
                console.log(`Sending notification to user ${userId}`);
                try {
                    await notifyTaskAssigned(task, userId, req.userId);
                } catch (notifyError) {
                    console.error(`Error sending notification to user ${userId}:`, notifyError);
                }
            }
        }

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task,
        });
    } catch (error) {
        console.error("Error in createTask:", error);
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
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }   

        // Tasks that the user are responsible for are:
        // 1. Assigned to them
        // 2. Not assigned to anyone but the user is part of the project
        const tasks = await Task.find({
            $or: [
                { assignedTo: userId }, // Tasks assigned to the user
                { assignedTo: { $size: 0 }, project: { $in: user.projects } } // Tasks not assigned to anyone but user is part of the project
            ]
        });
        
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

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
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
        
        // Tasks that the user are responsible for are:
        // 1. Assigned to them
        // 2. Not assigned to anyone but the user is part of the project
        query.$or = [
            { assignedTo: userId }, // Tasks assigned to the user
            { assignedTo: { $size: 0 }, project: { $in: user.projects } } // Tasks not assigned to anyone but user is part of the project
        ];

        // Fetch tasks with pagination
        const tasks = await Task.find(query)
            .skip(parseInt(from))
            .limit(parseInt(to))
            .sort({createdAt : -1})
            .populate("project", "name description")
            .populate("assignedTo", "name email");
        
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
    const { title, description, assignedTo, status, priority, dueDate, tags } = req.body;

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
        }        // Check if the user is owner or admin in the project
        const project = await Project.findById(task.project);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        if (!isUserAdminOrOwner(user, project)) {
            return res.status(403).json({ success: false, message: "User does not have permission to update this task" });
        }

        // Store original state to detect changes
        const originalStatus = task.status;
        const originalAssignedTo = [...task.assignedTo];

        // Update task fields
        task.title = title || task.title;
        task.description = description || task.description;
        task.assignedTo = assignedTo || task.assignedTo;
        task.status = status || task.status;        task.priority = priority || task.priority;
        task.dueDate = dueDate || task.dueDate;
        task.tags = tags || task.tags;

        await task.save();

        // Send notifications for changes
        // 1. Status change notification
        if (status && originalStatus !== status) {
            await notifyTaskStatusChanged(task, req.userId);
            
            // Special notification for task completion
            if (status === "done" && originalStatus !== "done") {
                await notifyTaskCompleted(task, req.userId);
            }
        }
        
        // 2. New assignment notifications
        if (assignedTo) {
            const newAssignees = assignedTo.filter(
                id => !originalAssignedTo.map(id => id.toString()).includes(id.toString())
            );
            
            for (const userId of newAssignees) {
                await notifyTaskAssigned(task, userId, req.userId);
            }
        }

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
            .populate("submitionMessage.member", "name email")

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
    const { message, type, files = [] } = req.body;

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
        task.status = type === 'submition' ? "done" : "cancelled";
        task.submitionMessage = {
            member: req.userId,
            type: type,
            massege: message || "",
            files: files || []
        };

        await task.save();

        // Return the updated task with populated fields
        const updatedTask = await Task.findById(taskId)
            .populate("assignedTo", "name email")
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