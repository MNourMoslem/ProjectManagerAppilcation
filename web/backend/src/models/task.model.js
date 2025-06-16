import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        assignedTo: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],

        status: {
            type: String,
            enum: ["todo", "in-progress", "done", "cancelled"],
            default: "todo"
        },

        priority: {
            type: String,
            enum: ["no-priority" ,"low", "medium", "high", "urgent"],
            default: "medium"
        },

        tags: [{
            type: String,
            trim: true
        }],

        dueDate: {
            type: Date,
            default: null
        },

        submitionMessage: {
            member : {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null
            },
            type : {
                type: String,
                enum: ["submition", "rejection"],
                default: "submition"
            },
            massege : {
                type: String,
                default: ""
            },
            files : [{
                type: String,
                default: ""
            }],
        },
    },
    { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);