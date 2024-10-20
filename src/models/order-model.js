import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema({
    _id:{
        type: String
    },
    name:{
        type: String
    },
    category:{
        type: String
    },
    image:{
        type: String
    },
    price:{
        type: Number
    },
    quantity:{
        type: String
    },
    description:{
        type: String
    },
    shopId:{
        type: String
    },
    createdAt:{
        type: String
    },
    updatedAt:{
        type: String
    }
})

const orderSchema = new Schema({
    Items:[
        { type: itemSchema } 
    ],
    shopId:{
        type: String,
        required : true
    },
    shopName:{
        type: String,
        required : true
    },
    orderBy:{
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
    price:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        required: true
    }
}, {timestamps: true})

export const Order = mongoose.model("Order", orderSchema)