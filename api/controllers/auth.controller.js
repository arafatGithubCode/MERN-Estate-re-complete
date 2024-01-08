import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  try {
    //check if the username or email already exist
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      let existingUserErrMsg = null;

      if (existingUser.username === username) {
        existingUserErrMsg = "this username already exists!";
      } else if (existingUser.email === email) {
        existingUserErrMsg = "this email already exists!";
      }

      return res
        .status(400)
        .json({ success: false, message: existingUserErrMsg });
    }
    //if Not, create a new user
    const newUser = await User({ username, email, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "A user is created successfully",
      userInfo: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "user not found!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(405, "Wrong Credentials!"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY);
    const { password: pass, ...rest } = validUser._doc;
    res.cookie("access_key", token, { httpOnly: true }).status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
