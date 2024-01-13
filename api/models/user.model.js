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
        25,
        "Maximum length of username should be lower then 25 characters.",
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
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);
export default User;
