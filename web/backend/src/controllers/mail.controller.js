import { Mail } from '../models/mail.model.js';
import { User } from '../models/user.model.js';
import { Project } from '../models/project.model.js';
import { addMemberToProject } from '../utils/projectUtils.js';


export const sendInviteMail = async (req, res) => {
    const { projectId, userEmail, role } = req.body;
    const userId = req.userId;

    try {
        if (!projectId || !userEmail) {
            throw new Error("Project ID and email are required");
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const invitedUser = await User.findOne({ email: userEmail });
        if (!invitedUser) {
            return res.status(404).json({ success: false, message: "Invited user not found" });
        }

        // Check if the user is the owner of the project
        if (project.owner.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized to invite users to this project" });
        }

        // Check if the invited user is already a member of the project
        if (project.members.includes(invitedUser._id)) {
            return res.status(400).json({ success: false, message: "User is already a member of this project" });
        }

        // if role is owner we return an error
        if (role && role === 'owner') {
            return res.status(400).json({ success: false, message: "You cannot invite a user as an owner" });
        }

        const mail = new Mail({
            project: projectId,
            sender: userId,
            recipient: invitedUser._id,
            type: 'invite',
            projectRole: role || 'member', // Default to 'member' if no role is provided
            subject: `Invitation to join project ${project.name}`,
            body: `You have been invited to join the project "${project.name}" as a ${role}. Please accept the invitation to become a member.`,
        });
        await mail.save();

        res.status(201).json({
            success: true,
            message: "Invitation mail created successfully",
            mail
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const acceptInviteMail = async (req, res) => {
    const { mailId } = req.body;
    const userId = req.userId;

    try {
        const mail = await Mail.findById(mailId);
        if (!mail) {
            return res.status(404).json({ success: false, message: "Mail not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (mail.type !== 'invite') {
            return res.status(400).json({ success: false, message: "This mail is not an invitation" });
        }

        if (mail.recipient.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized to accept this invitation" });
        }

        // if the mail is already accepted or declined, return an error
        if (mail.invitationStatus !== 'pending') {
            return res.status(400).json({ success: false, message: "This invitation has already been accepted or declined" });
        }

        const project = await Project.findById(mail.project);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        try {
            addMemberToProject(project, user, mail.projectRole);
        }
        catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }

        // Update mail status to accepted
        mail.invitationStatus = 'accepted';
        mail.read = true; // Mark the mail as read
        mail.sentAt = new Date();
        await mail.save();
        res.status(200).json({
            success: true,
            message: "Invitation accepted successfully",
            project,
            mail
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const declineInvitation = async (req, res) => {
    const { mailId } = req.body;
    const userId = req.userId;
    try {
        const mail = await Mail.findById(mailId);
        if (!mail) {
            return res.status(404).json({ success: false, message: "Mail not found" });
        }

        if (mail.type !== 'invite') {
            return res.status(400).json({ success: false, message: "This mail is not an invitation" });
        }

        if (mail.recipient.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized to decline this invitation" });
        }

        // if the mail is already accepted or declined, return an error
        if (mail.invitationStatus !== 'pending') {
            return res.status(400).json({ success: false, message: "This invitation has already been accepted or declined" });
        }

        // Update mail status to declined
        mail.invitationStatus = 'declined';
        mail.read = true; // Mark the mail as read
        mail.sentAt = new Date();
        await mail.save();
 
        res.status(200).json({
            success: true,
            message: "Invitation declined successfully",
            mail
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const sendCustomMail = async (req, res) => {
    const { projectId, recipientEmail, subject, body } = req.body;
    const userId = req.userId;

    try {
        if (!projectId || !recipientEmail || !subject || !body) {
            throw new Error("Project ID, recipient email, subject, and body are required");
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const recipient = await User.findOne({ email: recipientEmail });
        if (!recipient) {
            return res.status(404).json({ success: false, message: "Recipient not found" });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const mail = new Mail({
            project : projectId,
            sender : userId,
            recipient : recipient._id,
            subject,
            body,
            type: 'custom',
        });

        await mail.save();

        res.status(201).json({
            success: true,
            message: "Custom mail created successfully",
            mail
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getSentMails = async (req, res) => {
    const userId = req.userId;

    try {
        const mails = await Mail.find({ sender: userId })
            .populate('project', 'name')
            .populate('recipient', 'name email');

        res.status(200).json({
            success: true,
            mails
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getReceivedMails = async (req, res) => {
    const userId = req.userId;
    try {
        const mails = await Mail.find({ recipient: userId })
            .populate('project', 'name')
            .populate('sender', 'name email');

        res.status(200).json({
            success: true,
            mails
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const deleteMail = async (req, res) => {
    const { mailId } = req.params;

    try {
        const mail = await Mail.findById(mailId);
        if (!mail) {
            return res.status(404).json({ success: false, message: "Mail not found" });
        }

        await Mail.findByIdAndDelete(mailId);

        res.status(200).json({
            success: true,
            message: "Mail deleted successfully",
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const updateCustomMail = async (req, res) => {
    const { mailId } = req.params;
    const { subject, body } = req.body;

    try {
        const mail = await Mail.findById(mailId);
        if (!mail) {
            return res.status(404).json({ success: false, message: "Mail not found" });
        }

        // check if mail type is custom
        if (mail.type !== 'custom') {
            return res.status(400).json({ success: false, message: "Only custom mails can be updated" });
        }

        if (subject) {
            mail.subject = subject;
        }
        if (body) {
            mail.body = body;
        }
        await mail.save();
        res.status(200).json({
            success: true,
            message: "Mail updated successfully",
            mail
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const markMailAsRead = async (req, res) => {
    const { mailId } = req.params;
    const userId = req.userId;

    try {
        const mail = await Mail.findById(mailId);
        if (!mail) {
            return res.status(404).json({ success: false, message: "Mail not found" });
        }

        // Check if the user is the recipient of this mail
        if (mail.recipient.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized to mark this mail as read" });
        }

        mail.read = true; // Mark the mail as read
        await mail.save();
        
        res.status(200).json({
            success: true,
            message: "Mail marked as read",
            mail
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}