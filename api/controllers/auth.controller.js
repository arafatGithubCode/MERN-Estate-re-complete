import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

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
