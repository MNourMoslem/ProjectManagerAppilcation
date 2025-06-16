import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        content: {
            type: String,
            required: true,
            trim: true
        },

        files: [{
            type: String,
            default: ""
        }],
    },
    { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);