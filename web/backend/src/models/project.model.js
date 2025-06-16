import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        shortDescription: {
            type: String,
            trim: true,
            default: ""
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },


        members: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],

        memberRoles: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            role: {
                type: String,
                enum: ["owner", "admin", "member"],
                default: "member"
            }
        }],

        status: {
            type: String,
            enum: ["active", "archived", "completed"],
            default: "active"
        },


        targetDate: {
            type: Date,
            default: null
        },
    },
    { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);