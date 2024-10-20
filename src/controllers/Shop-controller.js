import AsyncHandler from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user-model.js";
import { Shop } from "../models/shop-model.js";
import uploadFileOnCloudinary from "../utils/Cloudinary.js"

const createShop = AsyncHandler(async (req, res) => {
    const { name, email, password, adress, city, contact, role } = req.body;

    let emptyField = [name, email, password, adress, city, contact, role].some((field) => field?.trim() === "")

    if (emptyField) {
        throw new ApiError(404, "all fields are required")
    }

    let localPathUrl = req.file?.path;

    let file = await uploadFileOnCloudinary(localPathUrl)

    let shopData = {
        name,
        avatar: file?.url || null,
        adress,
        city,
        contact
    }

    const createdShop = await Shop.create(shopData);

    if (!createdShop) {
        throw new ApiError(500, "Server Error! shop does not created!")
    }

    if (!email?.includes("@")) {
        throw new ApiError(404, "email must include special character @!")
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        throw new ApiError(402, "email already exist!")
    }

    let userData = {
        shopId: createdShop._id,
        email,
        password,
        role: "shopadmin"
    }

    const createdUser = await User.create(userData);

    if (!createdUser) {
        throw new ApiError(500, "Server Error! user does not created!")
    }

    return res
        .status(200)
        .json({
            createShop,
            createdUser,
            message: "user created successfully!"
        })
})

const getShopById = AsyncHandler(async (req, res) => {
    const { shopId } = req.params;
    let shop = await Shop.findById(shopId)

    if (!shop) {
        throw new ApiError(500, "shop not found!")
    }

    return res
        .status(200)
        .json({
            shop,
            message: "shop fetched successfully!"
        })
})

const getAllShops = AsyncHandler(async (req, res) => {
    let shops = await Shop.find()

    if (!shops) {
        throw new ApiError(500, "shop not found!")
    }

    return res
        .status(200)
        .json({
            shops,
            message: "shops fetched successfully!"
        })
})

const updateShopAvatar = AsyncHandler(async (req, res) => {

    let localPathUrl = req.file?.path;

    let newFile = await uploadFileOnCloudinary(localPathUrl)
    console.log(newFile)

    if (!newFile) {
        throw new ApiError(500, "Server Error! file couldn't uploaded!")
    }

    const updatedShopAvatar = await Shop.findByIdAndUpdate(req.user?.shopId, { avatar: newFile.url });

    if (!updatedShopAvatar) {
        throw new ApiError(500, "Server Error! file couldn't not updated!")
    }

    return res
        .status(200)
        .json({
            message: "avatar updated successfully!"
        })
})

const updateShopDetails = AsyncHandler(async (req, res) => {
    const { name, adress, city, contact } = req.body;

    let fields = [name, adress, city, contact]

    if (fields.some((field) => field?.trim() === "")) {
        throw new ApiError(404, "all fields are required")
    }

    let updatedShop = await Shop.findByIdAndUpdate(req.user?.shopId,
        {
            name: name,
            adress: adress,
            city: city,
            contact: contact,
        },
        { new: true });

    if (!updatedShop) {
        throw new ApiError(500, "Server Error! shop not created!")
    }

    return res
        .status(200)
        .json({
            updatedShop,
            message: "user updated successfully!"
        })
})
const deleteShop = AsyncHandler(async (req, res) => {
    const { shopId } = req.params;

    let deletedShop = await Shop.findByIdAndDelete(shopId);

    if (!deletedShop) {
        throw new ApiError(500, "Server Error! shop couldn't deleted!")
    }

    return res
        .status(200)
        .json({
            message: "shop deleted successfully!"
        })
})

export {
    createShop,
    getShopById,
    getAllShops,
    updateShopAvatar,
    updateShopDetails,
    deleteShop
}