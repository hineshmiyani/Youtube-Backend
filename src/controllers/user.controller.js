import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { userSchema } from "../utils/validations/index.js";
import { fromZodError } from "zod-validation-error";

/* Steps */
// get user details from frontend
// validation - not empty
// check if user already exists: username, email
// check for cover image, check for avatar
// upload them to cloudinary
// create a user object - create entry in db
// remove password and refresh token field from response
// check for user creation

const isUserExist = asyncHandler(async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser?._id) {
    throw new ApiError(409, "User with email and username already exists!");
  } else {
    next();
  }
});

const validateUser = asyncHandler(async (req, res, next) => {
  const avatarLocalPath = req.files?.["avatar"]?.[0]?.path;
  const coverImageLocalPath = req.files?.["coverImage"]?.[0]?.path;

  const payload = {
    ...req.body,
    avatar: avatarLocalPath,
    coverImage: coverImageLocalPath,
  };

  const result = userSchema.safeParse(payload);

  if (!result.success) {
    const errorMessage = fromZodError(result.error).message;
    throw new ApiError(400, errorMessage);
  }

  const avatarLiveUrl = avatarLocalPath
    ? (await uploadOnCloudinary(avatarLocalPath))?.secure_url
    : "";
  const coverImageLiveUrl = coverImageLocalPath
    ? (await uploadOnCloudinary(coverImageLocalPath))?.secure_url
    : "";

  if (!avatarLiveUrl) {
    throw new ApiError(400, "Unable to upload avatar image to Cloudinary");
  }

  req.body = {
    ...result.data,
    avatar: avatarLiveUrl,
    coverImage: coverImageLiveUrl,
  };

  next();
});

const registerUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user!");
  }

  res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User registered successfully!"));
});

export { isUserExist, validateUser, registerUser };
