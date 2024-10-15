import { Router } from "express";
import {
    createUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    updateUser,
    updateUserAvatar,
    updatePassword,
    refreshAccesToken,
    forgetPassword
} from "../controllers/User-controller.js";
import { upload } from "../middleware/multer-middleware.js"
import isUserAuthenticated from "../middleware/auth-middelware.js"

const router = Router()

router.route("/sign-up").post(upload.single("avatar"), createUser);
router.route("/login-user").post(loginUser);
router.route("/get-user").get(isUserAuthenticated, getCurrentUser)
router.route("/logout").post(isUserAuthenticated, logoutUser);
router.route("/update-user-info").patch(isUserAuthenticated, updateUser);
router.route("/update-user-avatar").patch(isUserAuthenticated, upload.single("avatar"), updateUserAvatar);
router.route("/refresh-access-token").get(isUserAuthenticated, refreshAccesToken);
router.route("/update-user-password").patch(isUserAuthenticated, updatePassword);
router.route("/forget-password").get(forgetPassword)

export default router;