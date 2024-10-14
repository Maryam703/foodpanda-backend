import AsyncHandler from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Order } from "../models/order-model.js";
import uploadFileOnCloudinary from "../utils/Cloudinary.js";

const createOrder = AsyncHandler(async (req, res) => {
    const { productName, quantity, price, orderedBy, adress, contact, status } = req.body;

    let fields = [productName, quantity, price, orderedBy, adress, contact, status]

    if (fields.some((field) => field?.trim() === "")) {
        throw new ApiError(400, "all fields are required!")
    }
    
    let localPathUrl = req.file?.path;

    let uploadedFile = await uploadFileOnCloudinary(localPathUrl)

    if (!uploadedFile) {
        throw new ApiError(504, "server error! file couldn't be uploaded on cloudinary!")
    }

    let order = {
        productName,
        image : uploadedFile.url,
        quantity,
        price,
        orderedBy,
        adress,
        contact,
        status,
    }

    const createdOrder = await Order.create(order)

    return res
        .status(200)
        .json({
            createdOrder,
            message: "order created successfully!"
        })
})

const getOrderByOrderId = AsyncHandler(async (req, res) => {
    const { orderId } = req.params;

    if (!orderId) {
        throw new ApiError(404, "orderId not found!")
    }

    const searchedOrder = await Order.findById(orderId)

    if (!searchedOrder) {
        throw new ApiError(404, "searchedOrder not found!")
    }

    return res
        .status(200)
        .json({
            searchedOrder,
            message: "searchedOrder found successfully!"
        })
})

const getAllOrders = AsyncHandler(async (req, res) => {
    const allOrders = await Order.find()

    if (!allOrders) {
        throw new ApiError(404, "orders not found!")
    }

    return res
        .status(200)
        .json({
            allOrders,
            message: "All orders fetched successfully!"
        })
})

const updateOrderStatus = AsyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrderStatus = await Order.findByIdAndUpdate(orderId, { status: status })

    if (!updatedOrderStatus) {
        throw ApiError(500, "Server error, Order status couldn't updated!")
    }

    return res
        .status(200)
        .json({
            updatedOrderStatus,
            message: "order status updated successfully!"
        })
})

const deleteOrder = AsyncHandler(async (req, res) => {
    const { orderId } = req.params;

    await Order.findByIdAndDelete(orderId)

    return res
        .status(200)
        .json({
            message: "order deleted successfully!"
        })
})

export {
    createOrder,
    getOrderByOrderId,
    getAllOrders,
    updateOrderStatus,
    deleteOrder
}