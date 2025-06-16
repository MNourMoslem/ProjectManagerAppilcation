import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";

import { isUserAdminOrOwner } from "../utils/userHasAccess.js";

export const userAdminOrOwner = async (req, res, next) => {
    const { projectId } = req.params;
    const userId = req.userId;

    if (!projectId || !userId) {
        return res.status(400).json({ success: false, message: "Project ID and User ID are required" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const isAOO = await isUserAdminOrOwner(user, project);
        if (!isAOO) {
            return res.status(403).json({ success: false, message: "User is not an admin or owner of the project" });
        }

        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}