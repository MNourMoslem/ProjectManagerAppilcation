import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} from "../mailtrap/emails.js";
import { User } from "../models/user.model.js";
import { Mail } from "../models/mail.model.js";

export const signup = async (req, res) => {
	const { email, password, name } = req.body;

	try {
		if (!email || !password || !name) {
			throw new Error("All fields are required");
		}

		const userAlreadyExists = await User.findOne({ email });
		console.log("userAlreadyExists", userAlreadyExists);

		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		const user = new User({
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
		});

		await user.save();

		const token = generateTokenAndSetCookie(res, user._id);

		await sendVerificationEmail(user.email, verificationToken);

		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
			token
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		const token = generateTokenAndSetCookie(res, user._id);

		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
			token
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Get number of unread mails
		const unreadMailsCount = await Mail.countDocuments({ 
			recipient: req.userId,
			read: { $ne: true }
		});

		// Add numUnreadMails to user object
		const userWithMailCount = {
			...user.toObject(),
			numUnreadMails: unreadMailsCount
		};

		res.status(200).json({ success: true, user: userWithMailCount });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const getUserWithUnreadMails = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Get unread mails for the user
		const unreadMails = await Mail.find({ 
			recipient: req.userId,
			read: { $ne: true } // Not marked as read
		})
		.populate('sender', 'name email')
		.populate('projectId', 'name')
		.sort({ createdAt: -1 });

		res.status(200).json({ 
			success: true, 
			user,
			unreadMailsCount: unreadMails.length,
			unreadMails
		});
	} catch (error) {
		console.log("Error in getUserWithUnreadMails ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { name, darkMode } = req.body;
    if (name) user.name = name;
    if (typeof darkMode === 'boolean') user.darkMode = darkMode;
    await user.save();
    res.status(200).json({ success: true, user: { ...user._doc, password: undefined } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' });
    }
    const isMatch = await bcryptjs.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }    user.password = await bcryptjs.hash(newPassword, 10);
    await user.save();
    
    // Generate new token after password change
    const token = generateTokenAndSetCookie(res, user._id);
    
    res.status(200).json({ 
      success: true, 
      message: 'Password updated successfully',
      token
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// User search by email functionality
export const getUserByEmail = async (req, res) => {
    const { email } = req.query;
    const userId = req.userId;

    try {
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        // Find the user by email pattern match (case insensitive)
        const users = await User.find({ 
            email: { $regex: email, $options: 'i' },
            _id: { $ne: userId } // Exclude the current user
        }).select('email name _id');

		console.log("Found users:", users);

        if (users.length === 0) {
            return res.status(200).json({ success: true, users: [] });
        }

        // If a single user is found, add it to the current user's lastSearchedUsers
        if (users.length === 1) {
            const currentUser = await User.findById(userId);
            
            // Check if user already exists in lastSearchedUsers
            const existingIndex = currentUser.lastSearchedUsers.findIndex(
                item => item.userId.toString() === users[0]._id.toString()
            );

            if (existingIndex !== -1) {
                // Remove the existing entry
                currentUser.lastSearchedUsers.splice(existingIndex, 1);
            }

            // Add to the beginning of the array
            currentUser.lastSearchedUsers.unshift({ 
                userId: users[0]._id,
                timestamp: new Date()
            });

            // Limit the array to 10 entries
            if (currentUser.lastSearchedUsers.length > 10) {
                currentUser.lastSearchedUsers = currentUser.lastSearchedUsers.slice(0, 10);
            }

            await currentUser.save();
        }

        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getUsersLastSearchedUsers = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Populate the lastSearchedUsers with user details
        await user.populate('lastSearchedUsers.userId', 'email name');

        // Format the response to have clean user objects
        const lastSearchedUsers = user.lastSearchedUsers.map(item => ({
            ...item.userId._doc,
            searchTimestamp: item.timestamp
        }));

        res.status(200).json({
            success: true,
            lastSearchedUsers
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};