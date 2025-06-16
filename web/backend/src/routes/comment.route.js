import express from 'express';
import {
    createComment,
    getComments,
    getCommentById,
    updateComment,
    deleteComment
} from '../controllers/comment.controller.js';

import { userPartOfProjectByComment, userPartOfProjectByTask } from '../middleware/userPartOfProject.js';

const router = express.Router();

router.post  ('/'                , createComment      , userPartOfProjectByTask);
router.get   ('/'                , getComments        , userPartOfProjectByTask);
router.get   ('/:commentId'      , getCommentById     , userPartOfProjectByComment);
router.put   ('/:commentId'      , updateComment      ); // needs to be the owner of the comment
router.delete('/:commentId'      , deleteComment      ); // needs to be the owner of the comment

export default router;