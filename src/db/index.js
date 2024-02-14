import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import ENV from "../env/index.js";

const MONGODB_URL = ENV.MONGODB_URL;

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected!! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MONGODB connection failed: ", error);
    process.exit(1);
  }
};

export default connectDB;
