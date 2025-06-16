import express from 'express';
import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    assignTaskToUser,
    unassignTaskFromUser,
    changeTaskStatus,
    submitTask,
    rejectTask,
    addComment,
    addIssue,
    updateIssueStatus,
    getTaskIssues,
    getTaskComments,
    getAllTasksOfUser,
    getTasksOfUser,
} from "../controllers/task.controller.js";

import {
    userPartOfProject,
    userPartOfProjectByTask,
} from "../middleware/userPartOfProject.js";

import { userAdminOrOwner } from '../middleware/projectAccess.js';

const router = express.Router();

router.post  ('/'                          , createTask          , userPartOfProject      , userAdminOrOwner);
router.put   ('/:taskId'                   , updateTask          , userPartOfProjectByTask, userAdminOrOwner);
router.delete('/:taskId'                   , deleteTask          , userPartOfProjectByTask, userAdminOrOwner);
router.get   ('/'                          , getTasks            , userPartOfProject                        );
router.get   ('/user/all'                  , getAllTasksOfUser                                              );
router.get   ('/user'                      , getTasksOfUser                                                 );
router.get   ('/:taskId'                   , getTaskById         , userPartOfProjectByTask                  );
router.get   ('/:taskId/issues'            , getTaskIssues       , userPartOfProjectByTask                  );
router.get   ('/:taskId/comments'          , getTaskComments     , userPartOfProjectByTask                  );
router.post  ('/:taskId/assign'            , assignTaskToUser    , userPartOfProjectByTask                  );
router.post  ('/:taskId/unassign'          , unassignTaskFromUser, userPartOfProjectByTask                  );
router.post  ('/:taskId/status'            , changeTaskStatus    , userPartOfProjectByTask                  );
router.post  ('/:taskId/submit'            , submitTask          , userPartOfProjectByTask                  );
router.post  ('/:taskId/reject'            , rejectTask          , userPartOfProjectByTask                  );
router.post  ('/:taskId/comments'          , addComment          , userPartOfProjectByTask                  );
router.post  ('/:taskId/issues'            , addIssue            , userPartOfProjectByTask                  );
router.put   ('/:taskId/issues/:issueId/status', updateIssueStatus , userPartOfProjectByTask                );

export default router;