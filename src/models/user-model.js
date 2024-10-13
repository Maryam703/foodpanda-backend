import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase:true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (this.isModified) {
        await bcrypt.hash(this.password, 8);
        next()
    } else {
        return next()
    }
})

userSchema.method.isPasswordCorrect = async function (password) {
    await bcrypt.compare(password, this.password)
}

userSchema.method.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expireIn: process.env.ACCESS_TOKEN_SECRET_EXPIRY
        })
}

userSchema.method.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expireIn: process.env.REFRESH_TOKEN_SECRET_EXPIRY
        })
}

export const User = mongoose.model("User", userSchema)