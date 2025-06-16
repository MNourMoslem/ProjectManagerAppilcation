import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        type: {
            type: String,
            enum: [
                "task_assigned", 
                "task_completed", 
                "task_status_changed",
                "project_invite", 
                "project_update", 
                "project_removed",
                "deadline_approaching", 
                "comment_added",
                "issue_created",
                "issue_resolved",
                "system"
            ],
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        read: {
            type: Boolean,
            default: false
        },
        // References
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        },
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        },
        issueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Issue"
        },
        commentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        },
        // For actionable notifications
        actionUrl: {
            type: String
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
);

// Index for efficient queries
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
