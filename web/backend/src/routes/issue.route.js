import express from 'express';
import {
    createIssue,
    getIssues,
    getIssueById,
    updateIssue,
    deleteIssue,
    updateIssueStatus,
} from '../controllers/issue.controller.js';

import { userPartOfProjectByIssue, userPartOfProjectByTask } from '../middleware/userPartOfProject.js';

const router = express.Router();

router.post  ('/'               , createIssue      , userPartOfProjectByTask );
router.get   ('/'               , getIssues        , userPartOfProjectByTask );
router.get   ('/:issueId'       , getIssueById     , userPartOfProjectByIssue);
router.put   ('/:issueId/status', updateIssueStatus, userPartOfProjectByIssue);

router.put   ('/:issueId'       , updateIssue                                ); // needs to be the owner of the issue
router.delete('/:issueId'       , deleteIssue                                ); // needs to be the owner of the issue

export default router;