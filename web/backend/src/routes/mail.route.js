import express from "express";
import {
    sendCustomMail,
    sendInviteMail,
    acceptInviteMail,
    declineInvitation,
    updateCustomMail,
    getSentMails,
    getReceivedMails,
    deleteMail,
    markMailAsRead
} from "../controllers/mail.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

// Mails are not realted to a project, so no need for userPartOfProject middleware

const router = express.Router();

router.post  ('/send-custom'          , verifyToken, sendCustomMail   );
router.post  ('/send-invite'          , verifyToken, sendInviteMail   );
router.post  ('/accept-invite'        , verifyToken, acceptInviteMail );
router.post  ('/decline-invite'       , verifyToken, declineInvitation);
router.put   ('/update-custom/:mailId', verifyToken, updateCustomMail );
router.get   ('/sent'                 , verifyToken, getSentMails     );
router.get   ('/received'             , verifyToken, getReceivedMails );
router.patch ('/read/:mailId'         , verifyToken, markMailAsRead   );
router.delete('/:mailId'              , verifyToken, deleteMail       );

export default router;