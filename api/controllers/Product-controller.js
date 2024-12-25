import AsyncHandler from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Product } from "../models/product-model.js";
import uploadFileOnCloudinary from "../utils/Cloudinary.js";
import { User } from "../models/user-model.js";
import mongoose from "mongoose";
import ApiFeature from "../utils/apiFeature.js";

const createProduct = AsyncHandler(async(req, res) => {
    const {name, category, description, price} = req.body;

    let fields = [name, category, description, price]

    if (fields && fields.some((field) => field?.trim() === "")) {
        throw new ApiError(400, "all field must be fullfild")
    }

    let localFilePath = req.file?.path

    let uploadedFile = await uploadFileOnCloudinary(localFilePath)

    if (!uploadedFile) {
        throw new ApiError(509, "server error. file couldn't be uploaded on cloudinary!")
    }
   
   let user = await User.findById(req.user?._id);

    if(!user){
        throw new ApiError(500, "user not found!")
    }

    let productDetail = {
        name,
        price,
        category,
        description,
        shopId : user?.shopId,
        image : uploadedFile.url,
    }

    const product = await Product.create(productDetail);

    if (!product) {
        throw new ApiError(505, "server error. product couldn't be created!")
    }

    return res
    .status(200)
    .json({
        product,
        message : "Product is created successfully!"
    })
})

const getProductByProductId = AsyncHandler(async(req, res) => {
    const { productId } = req.params;

    if (!productId) {
        throw new ApiError(404, "product id not found!")
    }

    const product = await Product.findById(productId)

    if (!product) {
        throw new ApiError(505, "Product not found")
    }

    return res
    .status(200)
    .json({
        product,
        message : "product fetched successfully!"
    })
})

const searchProduct = AsyncHandler(async(req, res) => {
    const apiFeature = new ApiFeature ( Product.find(), {keyword : req.query.keyword})

    apiFeature.search();

    let product = await apiFeature.query;

    if (!product) {
        throw new ApiError(505, "Product not found")
    }

    return res
    .status(200)
    .json({
        product,
        message : "product fetched successfully!"
    })
})

const getAllProducts = AsyncHandler(async(req, res) => {
    const { shopId } = req.params;
    const products = await Product.aggregate([
        {
            $match : {
                shopId : shopId
            }
        }
    ]);

    if (!products) {
        throw new ApiError(404, "products not found")
    }

    return res
    .status(200)
    .json({
        products,
        message : "Products fetched successfully!"
    })
})

const updateProduct = AsyncHandler(async(req, res) => {
    console.log("working")
    const { productId } = req.params;
    const { name, description, price, category } = req.body; 

    let fields = [name, description, price, category]

    if (fields.some((field) => field?.trim === "")) {
        throw new ApiError(400, "all field must be fullfild")
    }

    let localPathUrl = req.file?.path;
    let file = await uploadFileOnCloudinary(localPathUrl);

    let updatedData = {
        name,
        description,
        price,
        category,
        image : file?.url
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData)

    if (!updatedProduct) {
        throw new ApiError(505, "server error. product couldn't be updated!")
    }

    return res
    .status(200)
    .json({
        updatedProduct,
        message : "Item updated successfully!"
    })
})

const deleteProduct = AsyncHandler(async(req, res) => {
    const { productId } = req.params;

    let deletedProduct = await Product.findByIdAndDelete(productId)

    if (!deletedProduct) {
        throw new ApiError(504, "server error. product couldn't delete!")
    }
    return res
    .status(200)
    .json({
        deletedProduct,
        message : "Product deleted successfully!"
    })
})

export {
    createProduct,
    getProductByProductId,
    searchProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
}