import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import { Issue } from "../models/issue.model.js";
import { Comment } from "../models/comment.model.js";


import {
    isUserPartOfProject,
    isUserPartOfProjectByTask,
    isUserPartOfProjectByIssue,
    isUserPartOfProjectByComment,
} from "../utils/userHasAccess.js";


export const userPartOfProject = async (req, res, next) => {
    const { projectId } = req.params;
    const userId = req.userId;

    if (!projectId || !userId) {
        return res.status(400).json({ success: false, message: "Project ID and User ID are required" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const hasAccess = await isUserPartOfProject(user, project);
        if (!hasAccess) {
            return res.status(403).json({ success: false, message: "User is not part of the project" });
        }
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const userPartOfProjectByTask = async (req, res, next) => {
    const { taskId } = req.params;
    const userId = req.userId;

    if (!taskId || !userId) {
        return res.status(400).json({ success: false, message: "Task ID and User ID are required" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
    
        const hasAccess = await isUserPartOfProjectByTask(user, task);
        if (!hasAccess) {
            return res.status(403).json({ success: false, message: "User is not part of the project" });
        }
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const userPartOfProjectByIssue = async (req, res, next) => {
    const { issueId } = req.params;
    const userId = req.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const issue = await Issue.findById(issueId);
        if (!issue) {
            return res.status(404).json({ success: false, message: "Issue not found" });
        }

        const hasAccess = await isUserPartOfProjectByIssue(user, issue);
        if (!hasAccess) {
            return res.status(403).json({ success: false, message: "User is not part of the project" });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


export const userPartOfProjectByComment = async (req, res, next) => {
    const { commentId } = req.params;
    const userId = req.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        const hasAccess = await isUserPartOfProjectByComment(user, comment);
        if (!hasAccess) {
            return res.status(403).json({ success: false, message: "User is not part of the project" });
        }
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}