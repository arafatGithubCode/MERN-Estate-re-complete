import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: [
        2,
        "Minimum length of username should be greater then 2 characters.",
      ],
      maxlength: [
        15,
        "Maximum length of username should be lower then 15 characters.",
      ],
      required: [true, "username is required"],
      unique: [true, "this username already exists!"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "this email already exists!"],
      validate: {
        validator: (v) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => {
          `${props.value} is not a valid email address`;
        },
      },
    },
    password: {
      type: String,
      required: [true, "password is required."],
    },
    avatar: {
      type: String,
      default: "/img/default.jpg",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);
export default User;