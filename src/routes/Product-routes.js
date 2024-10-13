import { Router } from "express";
import isUserAuthenticated from "../middleware/auth-middelware.js";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductByProductId,
    updateProduct
} from "../controllers/Product-controller.js";

const router = Router();

router.route("/create-new-product").post(isUserAuthenticated, createProduct);
router.route("/get-product").get(isUserAuthenticated, getProductByProductId);
router.route("/get-all-product").get(isUserAuthenticated, getAllProducts);
router.route("/update-product-details").patch(isUserAuthenticated, updateProduct);
router.route("/delete-product").delete(isUserAuthenticated, deleteProduct)

export default router;