import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ENV_VARS } from "../config/envVars.js";

export const protectRoute = async (request, response, next) => {
  try {
    // get token from cookie that is setted when user is signup or logged in
    const token = request.cookies["jwt-netflix"];

    if (!token) {
      return response
        .status(401)
        .json({
          success: false,
          message: "Unauthorized - No Token Provided",
          token,
        });
    }
    // verify token if exists using jtw secret
    const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);

    if (!decoded) {
      return response
        .status(401)
        .json({ success: false, message: "Unauthorized - Invalid Token" });
    }
    // after decoding token, find user by usedId that is setted on token
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return response
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    request.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
