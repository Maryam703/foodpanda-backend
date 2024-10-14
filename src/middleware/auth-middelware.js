import AsyncHandler from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user-model.js";
import jwt from "jsonwebtoken"

const isUserAuthenticated = AsyncHandler(async(req, res, next) => {
  try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
          throw new ApiError(502, "token is required!")
      }
  
      let veifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
     
      if (!veifiedToken) {
          throw new ApiError(402, "token is invalid!")
      }
  
      let loggedInUser = await User.findById(veifiedToken?._id);
  
      if (!loggedInUser) {
          throw new ApiError(402, "user not found!")
      }
  
      req.user = loggedInUser;
  
      next();

  } catch (error) {
    throw new ApiError(500, "user verification failed!")
  }
})

export default isUserAuthenticated