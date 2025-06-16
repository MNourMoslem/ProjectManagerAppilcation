import { Issue } from "../models/issue.model.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";

export const createIssue = async (req, res) => {
    const { taskId, title, description } = req.body;
    const userId = req.userId;

    try {
        if (!title || !description) {
            throw new Error("Title and description are required");
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const issue = new Issue({
            owner: userId,
            task: taskId,
            title,
            description,
        });

        await issue.save();

        res.status(201).json({
            success: true,
            message: "Issue created successfully",
            issue,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getIssues = async (req, res) => {
    
    try {
        const { taskId } = req.query;
        if (!taskId) {
            throw new Error("Task ID is required");
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const issues = await Issue.find({ task: taskId })
            .populate("owner", "name email")
            .populate("task", "title description")
            .populate("lastStatusChangedBy", "name email");

        res.status(200).json({
            success: true,
            issues: issues,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


export const updateIssue = async (req, res) => {
    const userId = req.userId;
    const { issueId } = req.params;
    const { title, description } = req.body;

    try {
        if (!title || !description) {
            throw new Error("Title and description are required");
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const issue = await Issue.findById(issueId);
        if (!issue) {
            return res.status(404).json({ success: false, message: "Issue not found" });
        }

        if (issue.owner.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized to update this issue" });
        }

        issue.title = title;
        issue.description = description;

        await issue.save();

        res.status(200).json({
            success: true,
            message: "Issue updated successfully",
            issue,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


export const deleteIssue = async (req, res) => {
    const userId = req.userId;
    const { issueId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const issue = await Issue.findById(issueId);
        if (!issue) {
            return res.status(404).json({ success: false, message: "Issue not found" });
        }

        if (issue.owner.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this issue" });
        }

        await issue.remove();

        res.status(200).json({
            success: true,
            message: "Issue deleted successfully",
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const updateIssueStatus = async (req, res) => {
    const userId = req.userId;
    const { issueId } = req.params;
    const { status } = req.body;

    try {
        if (!status) {
            throw new Error("Status is required");
        }

        const issue = await Issue.findById(issueId);
        if (!issue) {
            return res.status(404).json({ success: false, message: "Issue not found" });
        }

        issue.status = status;
        issue.lastStatusChangedBy = userId; // Update the last status changed by field

        await issue.save();

        res.status(200).json({
            success: true,
            message: "Issue status updated successfully",
            issue,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getIssueById = async (req, res) => {
    const { issueId } = req.params;

    try {
        const issue = await Issue.findById(issueId)
            .populate("owner", "name email")
            .populate("task", "title description")
            .populate("lastStatusChangedBy", "name email");
        if (!issue) {
            return res.status(404).json({ success: false, message: "Issue not found" });
        }
        res.status(200).json({
            success: true,
            issue,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}