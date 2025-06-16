import { Comment } from '../models/comment.model.js';
import { User } from '../models/user.model.js';
import { Task } from '../models/task.model.js';

import { removeCommentFromDB } from '../utils/removeingFromDB.js';

export const createComment = async (req, res) => {
    const { taskId, content, files } = req.body;
    const userId = req.userId;
    try {
        if (!taskId || !content) {
            throw new Error("Task ID and content are required");
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const comment = new Comment({
            task: taskId,
            user: userId,
            content,
            files
        });

        await comment.save();

        res.status(201).json({
            success: true,
            message: "Comment created successfully",
            comment
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


export const getComments = async (req, res) => {
    const { taskId } = req.query;
    try {
        if (!taskId) {
            throw new Error("Task ID is required");
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        const comments = await Comment.find({ task: taskId }).populate('user', 'name email').populate('files');

        if (!comments || comments.length === 0) {
            return res.status(404).json({ success: false, message: "No comments found for this task" });
        }

        res.status(200).json({
            success: true,
            message: "Comments retrieved successfully",
            comments
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    try {
        removeCommentFromDB(commentId);
        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { content, files } = req.body;
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }
        if (content) {
            comment.content = content;
        }
        if (files) {
            comment.files = files;
        }
        await comment.save();
        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            comment
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


export const getCommentById = async (req, res) => {
    const { commentId } = req.params;
    try {
        const comment = await Comment
            .findById(commentId)
            .populate('user', 'name email')
            .populate('files');
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }
        res.status(200).json({
            success: true,
            message: "Comment retrieved successfully",
            comment
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}