import { Router } from "express";
import isUserAuthenticated from "../middleware/auth-middelware.js";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductByProductId,
    updateProduct
} from "../controllers/Product-controller.js";
import { upload } from "../middleware/multer-middleware.js";

const router = Router();

router.route("/create-new-product").post(isUserAuthenticated, upload.single("image") , createProduct);
router.route("/get-product/:productId").get( getProductByProductId);
router.route("/get-all-products/:shopId").get(getAllProducts);
router.route("/update-product/:productId").patch(isUserAuthenticated, upload.single("image"), updateProduct);
router.route("/delete-product/:productId").delete(isUserAuthenticated, deleteProduct)

export default router;