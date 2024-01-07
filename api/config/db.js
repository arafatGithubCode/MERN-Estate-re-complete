import mongoose from "mongoose";
import config from "./config.js";

const dbUrl = config.db.url;

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("Mongo Atlas db is connected");
  } catch (error) {
    console.log("Mongo Atlas db is not connected");
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
