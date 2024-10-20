import { Router } from "express";
import isUserAuthenticated from "../middleware/auth-middelware.js";
import {
    createOrder,
    deleteOrder,
    getAllOrders,
    getShopOrders,
    getOrderByOrderId,
    updateOrderStatus
} from "../controllers/Order-controller.js";

const router = Router();

router.route("/create-new-order").post(isUserAuthenticated, createOrder)
router.route("/get-order/:orderId").get(isUserAuthenticated, getOrderByOrderId);
router.route("/get-all-orders").get(isUserAuthenticated, getAllOrders);
router.route("/get-shop-orders/:shopId").get(isUserAuthenticated, getShopOrders);
router.route("/update-order-status/:orderId").patch(isUserAuthenticated, updateOrderStatus);
router.route("/delete-order/:orderId").delete(isUserAuthenticated, deleteOrder);

export default router;