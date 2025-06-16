import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";

// Create notification helper function
export const createNotification = async (data) => {
    try {
        console.log("Creating notification with data:", JSON.stringify(data, null, 2));
        const notification = new Notification(data);
        
        console.log("Saving notification to database...");
        const savedNotification = await notification.save();
        console.log("Notification saved successfully:", savedNotification._id);
        
        return savedNotification;
    } catch (error) {
        console.error("Error creating notification:", error);
        return null;
    }
};

// Task notification helpers
export const notifyTaskAssigned = async (task, assignedToUserId, assignedByUserId) => {
    try {
        console.log("notifyTaskAssigned called with:", {
            taskId: task._id,
            taskTitle: task.title,
            assignedToUserId,
            assignedByUserId
        });
        
        if (!assignedToUserId || assignedToUserId === assignedByUserId) {
            console.log("Skipping notification: user assigned to self or null assignee");
            return null;
        }
        
        const project = await Project.findById(task.project);
        if (!project) {
            console.log("Skipping notification: project not found");
            return null;
        }
        
        const notification = await createNotification({
            userId: assignedToUserId,
            type: "task_assigned",
            title: "New task assigned to you",
            description: `You have been assigned to task "${task.title}" in project "${project.name}"`,
            read: false,
            projectId: task.project,
            taskId: task._id,
            actionUrl: `/app/tasks/${task._id}`,
            createdBy: assignedByUserId
        });
        
        console.log("Task assignment notification created:", notification);
        return notification;
    } catch (error) {
        console.error("Error creating task assigned notification:", error);
        return null;
    }
};

export const notifyTaskStatusChanged = async (task, updatedByUserId) => {
    try {
        // Notify assigned users (except the one who updated the task)
        const project = await Project.findById(task.project);
        if (!project) return;
        
        // Send notifications to users assigned to the task
        const promises = task.assignedTo.map(async (userId) => {
            // Don't notify the user who updated the task
            if (userId.toString() === updatedByUserId.toString()) return null;
            
            return await createNotification({
                userId,
                type: "task_status_changed",
                title: "Task status updated",
                description: `Task "${task.title}" status has been changed to ${task.status}`,
                read: false,
                projectId: task.project,
                taskId: task._id,
                actionUrl: `/app/tasks/${task._id}`,
                createdBy: updatedByUserId
            });
        });
        
        await Promise.all(promises);
    } catch (error) {
        console.error("Error creating task status notification:", error);
    }
};

export const notifyTaskCompleted = async (task, completedByUserId) => {
    try {
        const project = await Project.findById(task.project);
        if (!project) return;
        
        // Notify project owner and admins
        const memberRoles = project.memberRoles || [];
        const adminIds = memberRoles
            .filter(member => ["owner", "admin"].includes(member.role))
            .map(member => member.user.toString());
        
        // Deduplicate and filter out the user who completed the task
        const uniqueAdminIds = [...new Set(adminIds)]
            .filter(id => id !== completedByUserId.toString());
        
        const promises = uniqueAdminIds.map(async (adminId) => {
            return await createNotification({
                userId: adminId,
                type: "task_completed",
                title: "Task completed",
                description: `Task "${task.title}" in project "${project.name}" has been marked as complete`,
                read: false,
                projectId: task.project,
                taskId: task._id,
                actionUrl: `/app/tasks/${task._id}`,
                createdBy: completedByUserId
            });
        });
        
        await Promise.all(promises);
    } catch (error) {
        console.error("Error creating task completion notification:", error);
    }
};

// Project notification helpers
export const notifyProjectInvite = async (project, invitedUserId, invitedByUserId) => {
    try {
        return await createNotification({
            userId: invitedUserId,
            type: "project_invite",
            title: "Project invitation",
            description: `You have been invited to join project "${project.name}"`,
            read: false,
            projectId: project._id,
            actionUrl: `/app/projects/${project._id}`,
            createdBy: invitedByUserId
        });
    } catch (error) {
        console.error("Error creating project invite notification:", error);
        return null;
    }
};

export const notifyProjectUpdate = async (project, updatedByUserId, updateType) => {
    try {
        // Notify all project members except the one who made the update
        const memberIds = project.members
            .map(member => member.toString())
            .filter(id => id !== updatedByUserId.toString());
        
        const promises = memberIds.map(async (memberId) => {
            return await createNotification({
                userId: memberId,
                type: "project_update",
                title: "Project updated",
                description: `Project "${project.name}" has been updated: ${updateType}`,
                read: false,
                projectId: project._id,
                actionUrl: `/app/projects/${project._id}`,
                createdBy: updatedByUserId
            });
        });
        
        await Promise.all(promises);
    } catch (error) {
        console.error("Error creating project update notification:", error);
    }
};

export const notifyProjectRemoved = async (userId, projectName, removedByUserId) => {
    try {
        return await createNotification({
            userId,
            type: "project_removed",
            title: "Removed from project",
            description: `You have been removed from project "${projectName}"`,
            read: false,
            actionUrl: `/app/inbox`,
            createdBy: removedByUserId
        });
    } catch (error) {
        console.error("Error creating project removal notification:", error);
        return null;
    }
};

// Comment notification helpers
export const notifyCommentAdded = async (task, comment, commentedByUserId) => {
    try {
        const project = await Project.findById(task.project);
        if (!project) return;
        
        // Notify task assignees and project owner
        const notifyUserIds = new Set([
            ...task.assignedTo.map(id => id.toString()),
            project.owner.toString()
        ]);
        
        // Remove the commenter from notification recipients
        notifyUserIds.delete(commentedByUserId.toString());
        
        const promises = Array.from(notifyUserIds).map(async (userId) => {
            return await createNotification({
                userId,
                type: "comment_added",
                title: "New comment on task",
                description: `New comment on task "${task.title}" in project "${project.name}"`,
                read: false,
                projectId: task.project,
                taskId: task._id,
                commentId: comment._id,
                actionUrl: `/app/tasks/${task._id}`,
                createdBy: commentedByUserId
            });
        });
        
        await Promise.all(promises);
    } catch (error) {
        console.error("Error creating comment notification:", error);
    }
};

// Issue notification helpers
export const notifyIssueCreated = async (task, issue, createdByUserId) => {
    try {
        const project = await Project.findById(task.project);
        if (!project) return;
        
        // Notify project admins and owner
        const memberRoles = project.memberRoles || [];
        const adminIds = memberRoles
            .filter(member => ["owner", "admin"].includes(member.role))
            .map(member => member.user.toString());
        
        // Deduplicate and filter out the user who created the issue
        const uniqueAdminIds = [...new Set(adminIds)]
            .filter(id => id !== createdByUserId.toString());
        
        const promises = uniqueAdminIds.map(async (adminId) => {
            return await createNotification({
                userId: adminId,
                type: "issue_created",
                title: "New issue reported",
                description: `New issue reported for task "${task.title}" in project "${project.name}"`,
                read: false,
                projectId: task.project,
                taskId: task._id,
                issueId: issue._id,
                actionUrl: `/app/tasks/${task._id}`,
                createdBy: createdByUserId
            });
        });
        
        await Promise.all(promises);
    } catch (error) {
        console.error("Error creating issue notification:", error);
    }
};

export const notifyIssueResolved = async (task, issue, resolvedByUserId) => {
    try {
        const project = await Project.findById(task.project);
        if (!project) return;
        
        // Notify issue creator
        if (issue.owner.toString() !== resolvedByUserId.toString()) {
            await createNotification({
                userId: issue.owner,
                type: "issue_resolved",
                title: "Issue resolved",
                description: `Your issue for task "${task.title}" has been resolved`,
                read: false,
                projectId: task.project,
                taskId: task._id,
                issueId: issue._id,
                actionUrl: `/app/tasks/${task._id}`,
                createdBy: resolvedByUserId
            });
        }
    } catch (error) {
        console.error("Error creating issue resolution notification:", error);
    }
};

// Deadline notification
export const notifyDeadlineApproaching = async () => {
    try {
        // Find tasks with deadlines approaching within the next 24 hours
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const today = new Date();
        
        const tasks = await Task.find({
            dueDate: { $gte: today, $lte: tomorrow },
            status: { $ne: "done" }
        }).populate("project");
        
        for (const task of tasks) {
            if (!task.assignedTo || task.assignedTo.length === 0) continue;
            
            // Create notifications for all assigned users
            const promises = task.assignedTo.map(async (userId) => {
                return await createNotification({
                    userId,
                    type: "deadline_approaching",
                    title: "Task deadline approaching",
                    description: `Task "${task.title}" in project "${task.project.name}" is due soon`,
                    read: false,
                    projectId: task.project._id,
                    taskId: task._id,
                    actionUrl: `/app/tasks/${task._id}`
                });
            });
            
            await Promise.all(promises);
        }
    } catch (error) {
        console.error("Error creating deadline notifications:", error);
    }
};

// Notification Controller API endpoints
export const getNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        const { limit = 20, offset = 0, unreadOnly = false } = req.query;
        
        const query = { userId };
        if (unreadOnly === 'true') {
            query.read = false;
        }
        
        const total = await Notification.countDocuments(query);
        
        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .populate("createdBy", "name email")
            .populate("projectId", "name")
            .populate("taskId", "title");
        
        res.status(200).json({
            success: true,
            notifications,
            unreadCount: await Notification.countDocuments({ userId, read: false }),
            total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch notifications"
        });
    }
};

export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.userId;
        const count = await Notification.countDocuments({ userId, read: false });
        
        res.status(200).json({
            success: true,
            unreadCount: count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch unread count"
        });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.userId;
        
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            { read: true },
            { new: true }
        );
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }
        
        res.status(200).json({
            success: true,
            notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to mark notification as read"
        });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.userId;
        
        await Notification.updateMany(
            { userId, read: false },
            { read: true }
        );
        
        res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to mark all notifications as read"
        });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.userId;
        
        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            userId
        });
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Notification deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete notification"
        });
    }
};
