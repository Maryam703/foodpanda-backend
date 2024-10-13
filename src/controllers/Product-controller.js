import AsyncHandler from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Product } from "../models/product-model.js";

const createProduct = AsyncHandler(async() => {
    const {title, category, description, price, estimatedTime, estimatedDC} = req.body;

    if (title.trim() || price.trim() || category.trim() || description.trim() || estimatedTime.trim() || estimatedDC.trim() === "") {
        throw ApiError(400, "all field must be fullfild")
    }

    let localFilePath = req.files?.image?.[0]?.path

    let uploadedFile = await uploadFileOnCloudinary(localFilePath)

    if (!uploadedFile) {
        throw ApiError(509, "server error. file couldn't be uploaded on cloudinary!")
    }

    let productDetail = {
        title,
        image : uploadedFile.url,
        price,
        category,
        description,
        estimatedTime,
        estimatedDC
    }

    const createdProduct = await Product.create(productDetail);

    if (!createdProduct) {
        throw ApiError(505, "server error. product couldn't be created!")
    }

    return res
    .status(200)
    .json({
        createdProduct,
        message : "Product is created successfully!"
    })
})

const getProductByProductId = AsyncHandler(async() => {
    const { productId } = req.params;

    if (!productId) {
        throw ApiError(404, "product id not found!")
    }

    const product = await Product.findById(productId)

    if (!product) {
        throw ApiError(505, "Product not found")
    }

    return res
    .status(200)
    .json({
        product,
        message : "product fetched successfully!"
    })
})

const getAllProducts = AsyncHandler(async() => {
    const Products = await Product.find()

    if (!Products) {
        throw ApiError(505, "products not found")
    }

    return res
    .status(200)
    .json({
        Products,
        message : "Products fetched successfully!"
    })
})

const updateProduct = AsyncHandler(async() => {
    const { productId } = req.params;
    const { title, description, price } = req.body; 


    if (title.trim() || price.trim() || description.trim()  === "") {
        throw ApiError(400, "all field must be fullfild")
    }

    let updatedData = {
        title,
        descriptionn,
        price
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData)

    if (!updatedProduct) {
        throw ApiError(505, "server error. product couldn't be updated!")
    }

    return res
    .status(200)
    .json({
        updatedProduct,
        message : "Item updated successfully!"
    })
})

const deleteProduct = AsyncHandler(async() => {
    const { productId } = req.params;

    let deletedProduct = await Product.findByIdAndDelete(productId)

    if (!deletedProduct) {
        throw ApiError(504, "server error. product couldn't delete!")
    }
    return res
    .status(200)
    .json({
        message : "Product deleted successfully!"
    })
})

export {
    createProduct,
    getProductByProductId,
    getAllProducts,
    updateProduct,
    deleteProduct
}