import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
	
		projects : [{
			type : mongoose.Schema.Types.ObjectId,
			ref: "Project",
			default: []
		}],
		
		// User settings
		emailNotifications: {
			type: Boolean,
			default: true
		},
		darkMode: {
			type: Boolean,
			default: false
		},

		// Storing recently searched users for quick access
		lastSearchedUsers: [{
			userId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			},
			timestamp: {
				type: Date,
				default: Date.now
			}
		}],

		// Projects
		projects : [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Project"
		}],
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);