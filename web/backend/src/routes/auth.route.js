import express from "express";
import {
	login,
	logout,
	signup,
	verifyEmail,
	forgotPassword,
	resetPassword,
	checkAuth,
	getUserWithUnreadMails,
	updateProfile,
	changePassword,
	getUserByEmail,
	getUsersLastSearchedUsers
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get ("/check-auth"           , verifyToken   , checkAuth);
router.get ("/user-with-mails"      , verifyToken   , getUserWithUnreadMails);
router.post("/signup"               , signup                   );
router.post("/login"                , login                    );
router.post("/logout"               , logout                   );
router.post("/verify-email"         , verifyEmail              );
router.post("/forgot-password"      , forgotPassword           );
router.post("/reset-password/:token", resetPassword            );
router.put ("/profile"              , verifyToken   , updateProfile);
router.put ("/change-password"      , verifyToken   , changePassword);
router.get ("/search-user"          , verifyToken   , getUserByEmail);
router.get ("/last-searched-users"  , verifyToken   , getUsersLastSearchedUsers);

export default router;