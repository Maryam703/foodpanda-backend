import { Router } from "express";
import isUserAuthenticated from "../middleware/auth-middelware.js";
import {
    createShop,
    getShopById,
    getAllShops,
    updateShopAvatar,
    updateShopDetails,
    deleteShop,
    searchShop
} from "../controllers/Shop-controller.js";
import { upload } from "../middleware/multer-middleware.js";

const router = Router();

router.route("/create-new-shop").post(upload.single("avatar") , createShop);
router.route("/search-shop").get(searchShop)
router.route("/get-shop/:shopId").get(getShopById)
router.route("/get-all-shops").get( getAllShops);
router.route("/update-shop-avatar").patch(isUserAuthenticated, upload.single("avatar"), updateShopAvatar);
router.route("/update-shop-details").patch(isUserAuthenticated, updateShopDetails);
router.route("/delete-shop/:shopId").delete(isUserAuthenticated, deleteShop)

export default router;
