export const addMemberToProject = async (project, user, role = "member") => {
    if (!project || !user) {
        throw new Error("Project and user are required");
    }

    // Check if the user is already a member
    if (project.members.includes(user._id)) {
        throw new Error("User is already a member of the project");
    }

    // Add user to project members
    project.members.push(user._id);
    project.memberRoles.push({ user: user._id, role });

    user.projects.push(project._id);

    await user.save();
    await project.save();
}

export const removeMemberFromProject = async (project, user) => {
    if (!project || !user) {
        throw new Error("Project and user are required");
    }

    // Check if the user is a member
    if (!project.members.includes(user._id)) {
        throw new Error("User is not a member of the project");
    }

    // Remove user from project members
    project.members = project.members.filter(member => member.toString() !== user._id.toString());
    delete project.memberRoles[user._id];

    await project.save();
}