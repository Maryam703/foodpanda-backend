import mongoose, { Schema } from "mongoose";

const shopSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    avatar:{
        type: String,
        required: true
    },
    adress:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    contact:{
        type: Number,
        required: true
    },
}, {timestamps: true})

export const Shop = mongoose.model("Shop", shopSchema)