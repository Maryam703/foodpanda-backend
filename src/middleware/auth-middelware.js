import AsyncHandler from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user-model.js";

const isUserAuthenticated = AsyncHandler(async() => {
  try {
      const token = req.cookie?.accessToken || req.headers("Authorization")?.replace("Bearer ", "");
  
      if (!token) {
          throw ApiError(502, "token is required!")
      }
  
      let veifiedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  
      if (!veifiedToken) {
          throw ApiError(402, "token is invalid!")
      }
  
      let loggedInUser = await User.findById(veifiedToken?._id);
  
      if (!loggedInUser) {
          throw ApiError(402, "user not found!")
      }
  
      req.user = loggedInUser;
  
      next();
      
      return res
      .status(200)
      .json({
          message : "user saved successfully!"
      })
  } catch (error) {
    throw ApiError(500, "user verification failed!")
  }
})

export default isUserAuthenticated