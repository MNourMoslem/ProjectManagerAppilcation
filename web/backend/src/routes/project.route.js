import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  removeMemberFromProject,
  updateMemberRole,
  getProjectMembers,
  getUnDoneTasksOnly,
  inviteMemberToProject,
  deleteProject,
  getUserRoleInProject,
  getProjectDetails,
  getProjectWithDetails,
  getAllProjectsWithDetails,
  leaveProject
} from "../controllers/project.controller.js";

import { userPartOfProject } from "../middleware/userPartOfProject.js";

const router = express.Router();

router.post  ("/"                                 , createProject                                 );
router.get   ("/"                                 , getProjects                                   );
router.get   ("/with-details"                     , getAllProjectsWithDetails                     );
// needs to be part of the project because here we are getting the project by its ID
router.get   ("/:projectId"                       , userPartOfProject     , getProjectById        );
router.get   ("/:projectId/details"               , userPartOfProject     , getProjectDetails     ); 
router.get   ("/:projectId/with-details"          , userPartOfProject     , getProjectWithDetails ); 
router.put   ("/:projectId"                       , updateProject                                 );
router.delete("/:projectId"                       , deleteProject                                 );
router.delete("/:projectId/members/:memberId"     , removeMemberFromProject                       );
router.put   ("/:projectId/members/:memberId/role", updateMemberRole                              );
router.get   ("/:projectId/members"               , userPartOfProject      , getProjectMembers    );
router.get   ("/:projectId/undone-tasks"          , userPartOfProject      , getUnDoneTasksOnly   );
router.post  ("/:projectId/members"               , userPartOfProject      , inviteMemberToProject);
router.get   ("/:projectId/role"                  , userPartOfProject      , getUserRoleInProject );
router.post  ("/:projectId/leave"                 , userPartOfProject      , leaveProject         );

export default router;