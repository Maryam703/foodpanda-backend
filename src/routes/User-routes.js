import { Router } from "express";
import {
    createUser,
    loginUser,
    logoutUser,
    updateUser,
    updateUserAvatar,
    updatePassword,
    refreshAccesToken
} from "../controllers/User-controller.js";
import { upload } from "../middleware/multer-middleware.js"
import isUserAuthenticated from "../middleware/auth-middelware.js"

const router = Router()

router.route("/sign-up").post(upload.single("avatar"), createUser);
router.route("/login-user").get(loginUser);
router.route("/logout-user").post(isUserAuthenticated, logoutUser);
router.route("/update-user-info").patch(isUserAuthenticated, updateUser);
router.route("/update-user-avatar").patch(isUserAuthenticated, upload.single("avatar"), updateUserAvatar);
router.route("/refresh-access-token").get(isUserAuthenticated, refreshAccesToken);
router.route("/update-password").patch(isUserAuthenticated, updatePassword);

export default router;