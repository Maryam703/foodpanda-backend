import AsyncHandler from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user-model.js";
import uploadFileOnCloudinary from "../utils/Cloudinary.js"
import jwt from "jsonwebtoken";
import { sendMailResetPassword } from "../utils/nodeMailer.js";

const createUser = AsyncHandler(async (req, res) => {
    const { name, email, password, adress, city, contact, role } = req.body;

    let emptyField = [name, email, password, adress, city, contact, role].some((field) => field?.trim() === "")

    if (emptyField) {
        throw new ApiError(404, "all fields are required")
    }

    if (!email.includes("@")) {
        throw new ApiError(404, "email must include special character @!")
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        throw new ApiError(402, "email already exist!")
    }

    let localPathUrl = req.file?.path;

    let file = await uploadFileOnCloudinary(localPathUrl)

    let userData = {
        name,
        email,
        password,
        avatar: file?.url || null,
        adress,
        city,
        contact,
        role
    }


    const user = await User.create(userData);

    if (!user) {
        throw new ApiError(500, "Server Error! user not created!")
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    await user.save({
        validateBeforeSave: false
    });

    const options = {
        httpOnly: true,
        sameSite: 'strict', 
        expires: new Date(Date.now() + 900000)
    }

    return res
        .status(200)
        .header('Access-Control-Allow-Credentials', true)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            user,
            message: "user created successfully!"
        })
})

const loginUser = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)

    if (email?.trim() === "") {
        throw new ApiError(404, "All fields are required")
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(500, "enter valid email!")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(500, "you entered incorrect password!")
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    await user.save({
        validateBeforeSave: false
    });

    const options = {
        httpOnly: true,
        sameSite: 'strict', 
        expires: new Date(Date.now() + 900000)
    }

    return res
        .status(200)
        .header('Access-Control-Allow-Credentials', true)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            user,
            message: "user fetched successfully!"
        })
})

const getCurrentUser = AsyncHandler(async (req, res) => {
    let user = await User.findById(req.user?._id)

    console.log(user)

    if (!user) {
        throw new ApiError(500, "user not found!")
    }

    return res
        .status(200)
        .json({
            user,
            message: "user fetched successfully!"
        })
})

const getAllUsers = AsyncHandler(async (req, res) => {
    let user = await User.find()

    if (!user) {
        throw new ApiError(500, "user not found!")
    }

    return res
        .status(200)
        .json({
            user,
            message: "all users fetched successfully!"
        })
})

const logoutUser = AsyncHandler(async (req, res) => {

    let resetUserToken = await User.findByIdAndUpdate(req.user?._id, {
        $unset: {
            refreshToken: 1,
            accessToken : 1
        }
    })

    if (!resetUserToken) {
        throw new ApiError(505, "server error! user not logged out!")
    }

    let options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            message: "user logged out successfully!"
        })
})

const refreshAccesToken = AsyncHandler(async (req, res) => {
    const incomingToken = req.cookies?.refreshToken;

    if (!incomingToken) {
        throw new ApiError(404, "refreshToken required!")
    }

    const verifyJwt = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);

    if (!verifyJwt) {
        throw new ApiError(404, "incomming token in not verified!")
    }

    let user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "user not found!")
    }

    if (user?.refreshToken !== incomingToken) {
        throw new ApiError(404, "incommingToken is not valid!")
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            message: "token refreshed successfully!"
        })
})

const updateUserAvatar = AsyncHandler(async (req, res) => {

    let localPathUrl = req.file?.path;

    let newFile = await uploadFileOnCloudinary(localPathUrl)
    console.log(newFile)

    if (!newFile) {
        throw new ApiError(500, "Server Error! file couldn't uploaded!")
    }

    const updatedUser = await User.findByIdAndUpdate(req.user?._id, { avatar: newFile.url });

    if (!updatedUser) {
        throw new ApiError(500, "Server Error! file couldn't not updated!")
    }

    return res
        .status(200)
        .json({
            message: "avatar updated successfully!"
        })
})

const updateUser = AsyncHandler(async (req, res) => {
    const { name, adress, city, contact } = req.body;

    let fields = [name, adress, city, contact]

    if (fields.some((field) => field?.trim() === "")) {
        throw new ApiError(404, "all fields are required")
    }

    let updatedUser = await User.findByIdAndUpdate(req.user?._id, {
        name: name,
        adress: adress,
        city: city,
        contact: contact
    },
        {
            new: true
        });

    if (!updatedUser) {
        throw new ApiError(500, "Server Error! user not created!")
    }

    return res
        .status(200)
        .json({
            updatedUser,
            message: "user updated successfully!"
        })
})

const updatePassword = AsyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    let fields = [oldPassword, newPassword, confirmNewPassword]

    if (fields.some((field) => field?.trim() === "")) {
        throw new ApiError(404, "All fields are required")
    }

    let user = await User.findById(req.user?._id)

    if (!user) {
        throw new ApiError(500, "user not found!")
    }

    let isPasswordValid = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordValid) {
        throw new ApiError(500, "you entered incorrect Password!")
    }

    if (newPassword !== confirmNewPassword) {
        throw new ApiError(500, "enter correct confirm newPassword!")
    }

    user.password = newPassword;
    user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json({
            message: "password updated successfully!"
        })
})

const forgetPassword = AsyncHandler(async (req, res) => {
    // const { email } = req.body;

    // let user = await User.findOne({ email })

    // if (!user) {
    //     throw new ApiError(400, "user not found on given email!")
    // }

    // let emailSent = await sendMailResetPassword(email)

    // if (!emailSent) {
    //     throw new ApiError(500, "server error. email couldn't sent!")
    // }

    return res
        .status(200)
        .json({
            message: `email sent on ${user?.email}`
        })
})

export {
    createUser,
    loginUser,
    getCurrentUser,
    getAllUsers,
    logoutUser,
    updateUser,
    updateUserAvatar,
    updatePassword,
    refreshAccesToken,
    forgetPassword
}
