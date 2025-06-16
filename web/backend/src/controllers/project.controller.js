import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import { Mail } from "../models/mail.model.js";
import { Task } from "../models/task.model.js";

import { addMemberToProject as relevantAddMemberFromProject, removeMemberFromProject as relevantRemoveMemberFromProject} from "../utils/projectUtils.js";
import { isUserPartOfProject } from "../utils/userHasAccess.js";

export const createProject = async (req, res) => {
    const { name, shortDescription, description, targetDate } = req.body;

    try {
        if (!name) {
            throw new Error("Project name is required");
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const project = new Project({
            owner: req.userId,
            name,
            shortDescription: shortDescription || "",
            description: description || "",
            targetDate: targetDate || null,
        });

        // Add the owner as the first member of the project
        relevantAddMemberFromProject(project, user, "owner");

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            project,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getProjects = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Step 1: Get the full project documents from the Project collection
        const projectIds = user.projects.map(p => p._id); // assuming they are stored as objects with _id
        const projects = await Project.find({ _id: { $in: projectIds } })

        // Step 2: Map to desired format (optional)
        const formattedProjects = projects.map(project => ({
            _id: project._id,
            name: project.name,
            shortDescription: project.shortDescription,
            description: project.description,
            targetDate: project.targetDate,
            status: project.status,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        }));

        res.status(200).json({
            success: true,
            projects: formattedProjects,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getProjectById = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId)
            .populate("owner", "name email")
            .populate("members", "name email")
            .populate("memberRoles", "user role")
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        res.status(200).json({
            success: true,
            project,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const updateProject = async (req, res) => {
    const { projectId } = req.params;
    const { name, shortDescription, description, targetDate, status } = req.body;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        if (project.owner.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "Forbidden - you do not own this project" });
        }
        project.name = name || project.name;
        project.shortDescription = shortDescription || project.shortDescription;
        project.description = description || project.description;
        project.targetDate = targetDate || project.targetDate;
        project.status = status || project.status;
        await project.save();
        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const removeMemberFromProject = async (req, res) => {
    const { projectId, memberId } = req.params;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const member = await User.findById(memberId);
        if (!member) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        relevantRemoveMemberFromProject(project, member);

        // delete project ID from user's projects array
        member.projects = member.projects.filter(p => p.toString() !== projectId);

        // sent a notification email to the member
        const mail = new Mail({
            sender: req.userId,
            recipient: memberId,
            subject: "Removed from Project",
            body: `You have been removed from the project "${project.name}".`,
            type: "notification",
            projectId: project._id,
        });

        res.status(200).json({
            success: true,
            message: "Member removed from project successfully",
            project,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const updateMemberRole = async (req, res) => {
    const { projectId, memberId } = req.params;
    const { role } = req.body;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const member = await User.findById(memberId);
        if (!member) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!isUserPartOfProject(project, member)) {
            return res.status(403).json({ success: false, message: "Forbidden - user is not part of this project" });
        }

        if (project.memberRoles[memberId] !== role) {
            project.memberRoles[memberId] = role;
            await project.save();
        }

        res.status(200).json({
            success: true,
            message: "Member role updated successfully",
            project,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getProjectMembers = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId)
            .populate("members", "name email")
            .populate("memberRoles");

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        // Combine members with their roles
        const membersWithRoles = project.members.map(member => {
            const memberRole = project.memberRoles.find(mr => mr.user.toString() === member._id.toString());
            return {
                _id: member._id,
                name: member.name,
                email: member.email,
                role: memberRole ? memberRole.role : 'member'
            };
        });

        res.status(200).json({
            success: true,
            members: membersWithRoles
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getUnDoneTasksOnly = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId);
        
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        // Get all tasks that are not done
        const tasks = await Task.find({ 
            project: projectId,
            status: { $ne: 'done' } 
        })
        .populate("assignedTo", "name email")
        .sort({ priority: -1 });

        res.status(200).json({
            success: true,
            tasks
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const inviteMemberToProject = async (req, res) => {
    const { projectId } = req.params;
    const { userEmail, role = 'member' } = req.body;

    try {
        const project = await Project.findById(projectId);
        
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        // Check if the user exists
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const userId = user._id;

        // Check if the user is already a member of the project
        if (project.members.some(member => member.toString() === userId)) {
            return res.status(400).json({ success: false, message: "User is already a member of this project" });
        }

        // now let's make the invitation mail
        const mail = new Mail({
            sender: req.userId,
            recipient: userId,
            subject: `Invitation to join project "${project.name}"`,
            body: `You have been invited to join the project "${project.name}" as a ${role}. Please accept the invitation to become a member.`,
            type: "invite",
            projectId: project._id,
        });

        await mail.save();

        res.status(200).json({
            success: true,
            message: "Member has been invited to the project successfully",
            project
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const deleteProject = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        // Check if the user is the owner of the project
        if (project.owner.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "Forbidden - you do not own this project" });
        }

        // Delete all tasks associated with this project
        // This will handle cascading deletes for tasks, issues, comments, files
        // We would need additional clean-up in a real-world application
        
        // Remove the project from all members' projects arrays
        for (const memberId of project.members) {
            const member = await User.findById(memberId);
            if (member) {
                member.projects = member.projects.filter(p => p.toString() !== projectId);
                await member.save();
            }
        }

        // Delete the project
        await Project.findByIdAndDelete(projectId);

        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getUserRoleInProject = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId)
            .populate("memberRoles.user", "name email");
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        const userRole = project.memberRoles.find(role => role.user._id.toString() === req.userId);
        if (!userRole) {
            return res.status(404).json({ success: false, message: "User not found in project" });
        }

        res.status(200).json({
            success: true,
            role: userRole.role,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


export const getProjectDetails = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
    
        // Get number of tasks from each status
        const taskCounts = await Task.aggregate([
            { $match: { project: projectId } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Convert taskCounts to a more usable format
        const taskCountMap = {};
        taskCounts.forEach(task => {
            taskCountMap[task._id] = task.count;
        });

        // That's it for now, we can add more details later
        res.status(200).json({
            success: true,
            details: {
                taskCounts: taskCountMap
            }
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getProjectWithDetails = async (req, res) => {
    const { projectId } = req.params;

    try {
        // Get the project first
        const project = await Project.findById(projectId)
            .populate("owner", "name email")
            .populate("members", "name email")
            .populate("memberRoles", "user role");

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        // Get task counts
        const taskCounts = await Task.aggregate([
            { $match: { project: project._id } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Convert taskCounts to a more usable format
        const taskCountMap = {};
        taskCounts.forEach(task => {
            taskCountMap[task._id] = task.count;
        });

        // Combine project and details
        const projectWithDetails = {
            ...project._doc,
            details: {
                taskCounts: taskCountMap
            }
        };

        res.status(200).json({
            success: true,
            project: projectWithDetails
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const getAllProjectsWithDetails = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Get the project IDs from the user
        const projectIds = user.projects.map(p => p._id);
        
        // Get all projects
        const projects = await Project.find({ _id: { $in: projectIds } })
            .populate("owner", "name email")
            .populate("members", "name email")
            .populate("memberRoles", "user role");

        // Get task counts for all projects
        const projectsWithDetails = await Promise.all(projects.map(async (project) => {
            const taskCounts = await Task.aggregate([
                { $match: { project: project._id } },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]);

            // Convert taskCounts to a more usable format
            const taskCountMap = {};
            taskCounts.forEach(task => {
                taskCountMap[task._id] = task.count;
            });

            // Combine project and details
            return {
                ...project._doc,
                details: {
                    taskCounts: taskCountMap
                }
            };
        }));

        res.status(200).json({
            success: true,
            projects: projectsWithDetails
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const leaveProject = async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // if user is the owner of the project, they cannot leave the project
        if (project.owner.toString() === req.userId) {
            return res.status(403).json({ success: false, message: "You cannot leave a project you own" });
        }


        // Remove the user from the project members
        relevantRemoveMemberFromProject(project, user);
        // Remove the project from user's projects
        user.projects = user.projects.filter(p => p.toString() !== projectId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "You have left the project successfully",
            project
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}