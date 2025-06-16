import mongoose from "mongoose";


const mailSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        sentAt: {
            type: Date,
            default: null,
        },

        errorMessage: {
            type: String,
            default: null,
        },

        type: {
            type: String,
            enum: ["welcome", "notification", "reminder", "custom", "invite"],
            required: true,
            default: "custom",
        },


        // For invite mails
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            default: null,
        },

        projectRole: {
            type: String,
            enum: ["admin", "member"],
            default: "member",
        },

        invitationStatus: {
            type: String,
            enum: ["pending", "accepted", "declined"],
            default: "pending",
        },
        
        
        // Whether the mail has been read by the recipient
        read: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);


export const Mail = mongoose.model("Mail", mailSchema);