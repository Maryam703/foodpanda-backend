import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    productName:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    orderedBy:{
        type: String,
        required : true
    },
    adress:{
        type: String,
        required: true
    },
    contact:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum : ["pending", "Ready to deliver", "on the way", "delivered"],
        required: true
    }
}, {timestamps: true})

export const Order = mongoose.model("Order", orderSchema)