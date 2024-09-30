import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils//generateToken.js";

export const signup = async (request, response) => {
  try {
    const { email, password, username } = request.body;
    if (!email || !password || !username) {
      return response
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // check if email is in form of email
    if (!emailRegex.test(email)) {
      return response
        .status(400)
        .json({ success: false, message: "Invalid email" });
    }

    if (password.length < 6) {
      return response.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUserByEmail = await User.findOne({ email: email });
    if (existingUserByEmail) {
      return response
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const existingUserByUsername = await User.findOne({ username: username });
    if (existingUserByUsername) {
      return response
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const PROFILE_PICS = ["/avatar1.png", "/avatar2.jpg", "/avatar3.png"];
    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      image,
    });

    generateTokenAndSetCookie(newUser._id, response);
    await newUser.save();
    // remove password from response
    response
      .status(201)
      .json({ success: true, user: { ...newUser._doc, password: "" } });

    //
  } catch (error) {
    console.log("Error in signup controller ", error.message);
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const login = async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return response
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return response
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    generateTokenAndSetCookie(user._id, response);
    response
      .status(200)
      .json({ success: true, user: { ...user._doc, password: "" } });
  } catch (error) {
    console.log("Error in login controller ", error.message);
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const logout = async (request, response) => {
  try {
    response.clearCookie("jwt-netflix");
    response
      .status(200)
      .json({ success: true, message: "Logged out successfuly" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    response
      .status(500)
      .json({ seccess: false, message: "Internal server error" });
  }
};
export const authCheck = async (request, response) => {
  try {
    response.status(200).json({ success: true, user: request.user });
  } catch (error) {
    console.log("Error in authCheck controller: ", error.message);
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
