import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    title:{
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
        required: true
    },
    orderedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orderedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

export const Order = mongoose.model("Order", orderSchema)