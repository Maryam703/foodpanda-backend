import AsyncHandler from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Order } from "../models/order-model.js";

const createOrder = AsyncHandler(async (req, res) => {
    const { Items, shopId, shopName, orderBy, adress, contact, price, status } = req.body;

    let order = {
        Items,
        shopId,
        shopName,
        orderBy,
        adress,
        contact,
        price,
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

    const order = await Order.findById(orderId)

    if (!order) {
        throw new ApiError(404, "searchedOrder not found!")
    }

    return res
        .status(200)
        .json({
            order,
            message: "searchedOrder found successfully!"
        })
})

const getAllOrders = AsyncHandler(async (req, res) => {
    const orders = await Order.find()

    if (!orders) {
        throw new ApiError(404, "orders not found!")
    }

    return res
        .status(200)
        .json({
            orders,
            message: "All orders fetched successfully!"
        })
})

const getShopOrders = AsyncHandler(async (req, res) => {
    const { shopId } = req.params;

    if (!shopId) {
        throw new ApiError(404, "shopId not found!")
    }

    const orders = await Order.aggregate([
        {
            $match : {
                shopId : shopId
            }
        }
    ])

    if (!orders) {
        throw new ApiError(404, "orders not found!")
    }

    return res
        .status(200)
        .json({
            orders,
            message: "All shop orders fetched successfully!"
        })
})

const updateOrderStatus = AsyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    console.log(orderId, status)

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
    getShopOrders,
    updateOrderStatus,
    deleteOrder
}