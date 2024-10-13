import AsyncHandler from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Order } from "../models/order-model.js";
import uploadFileOnCloudinary from "../utils/Cloudinary.js";

const createOrder = AsyncHandler(async() => {
    const {title, quantity, price, adress, contact, status, orderedBy, estimatedTime, estimatedDC} = req.body;

    if (title.trim() || price.trim() || quantity.trim() || adress.trim() || contact.trim() || status.trim() || orderedBy.trim() || estimatedTime.trim() || estimatedDC.trim() === "") {
        throw ApiError(400, "all field must be fullfild")
    }

    let localPathUrl = req.files?.image?.[0]?.path;

    let uploadedFile = await uploadFileOnCloudinary(localPathUrl)

    if (!uploadedFile) {
        throw ApiError(504, "server error! file couldn't be uploaded on cloudinary!")
    }

    let order = {
        title,
        image : uploadedFile.url,
        price,
        quantity,
        adress,
        status,
        orderedBy,
        estimatedTime,
        estimatedDC
    }

    const createdOrder = Order.create(order)

    return res
    .status(200)
    .json({
        createdOrder,
        message : "order created successfully!"
    })
})

const getOrderByOrderId = AsyncHandler(async() => {
    const { orderId } = req.params;

    if (!orderId) {
        throw ApiError(404, "orderId not found!")
    }

    const searchedOrder = await Order.findById(orderId)

    if (!searchedOrder) {
        throw ApiError(404, "searchedOrder not found!")
    }

    return res
    .status(200)
    .json({
        searchedOrder,
        message : "searchedOrder found successfully!"
    })
})

const getAllOrders = AsyncHandler(async() => {
    const allOrders = await Order.find()

    if (allOrders) {
        throw ApiError(404, "orders not found!")
    }

    return res
    .status(200)
    .json({
        allOrders,
        message : "All orders fetched successfully!"
    })
})

const updateOrderStatus = AsyncHandler(async() => {
    const { orderId } = req.params;
    const { status } = req.body; 

    const updatedOrderStatus = await Restaurant.findByIdAndUpdate(orderId, {status : status})

    if (!updatedOrderStatus) {
        throw ApiError(500, "Server error, Order status couldn't updated!")
    }

    return res
    .status(200)
    .json({
        updatedOrderStatus,
        message : "order status updated successfully!"
    })
})

const deleteOrder = AsyncHandler(async() => {
    const { orderId } = req.params;

    await Order.findByIdAndDelete(orderId)

    return res
    .status(200)
    .json({
        message : "order deleted successfully!"
    })
})

export {
    createOrder,
    getOrderByOrderId,
    getAllOrders,
    updateOrderStatus,
    deleteOrder
}