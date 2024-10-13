import { Router } from "express";
import isUserAuthenticated from "../middleware/auth-middelware.js";
import {
    createOrder,
    deleteOrder,
    getAllOrders,
    getOrderByOrderId,
    updateOrderStatus
} from "../controllers/Order-controller.js";
import { upload } from "../middleware/multer-middleware.js";

const router = Router();

router.route("/create-new-order").post(isUserAuthenticated, upload.single("image"), createOrder)
router.route("/get-order").get(isUserAuthenticated, getOrderByOrderId);
router.route("/get-all-orders").get(isUserAuthenticated, getAllOrders);
router.route("/update-order-status").patch(isUserAuthenticated, updateOrderStatus);
router.route("/delete-order").delete(isUserAuthenticated, deleteOrder);

export default router;