import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ENV from "../env";

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File is uploaded on cloudinary!", response.url);

    return response;
  } catch (error) {
    // Remove the locally saved temporary file as the the upload operation got failed.
    fs.unlinkSync(localFilePath);
    return null;
  }
};
