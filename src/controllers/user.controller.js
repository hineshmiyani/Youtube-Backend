import jwt from "jsonwebtoken";
import { fromZodError } from "zod-validation-error";
import { COOKIE_OPTIONS } from "../constants/index.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { userSchema } from "../utils/validations/index.js";

/* Steps for register user */
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

/* Steps for login user */
// get user details from frontend (email or username, password)
// check if user already exists (find the user): username, email
// password validation
// generate AccessToken and RefreshToken
// send tokens in the secure cookies

/**
 * Generates access and refresh tokens for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<{accessToken: string, refreshToken: string}>} - The generated access and refresh tokens.
 * @throws {ApiError} - If something goes wrong while generating the tokens.
 */
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({
      validateBeforeSave: false,
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token!"
    );
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required!");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(400, "User does not exist!");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Please enter a valid password!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user?._id
  );

  const { password: tempA, refreshToken: tempB, ...loggedInUser } = user?._doc;

  return res
    .status(200)
    .cookie("accessToken", accessToken, COOKIE_OPTIONS)
    .cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", COOKIE_OPTIONS)
    .clearCookie("refreshToken", COOKIE_OPTIONS)
    .json(new ApiResponse(200, {}, "User logged out successfully!"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request!");
  }

  try {
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      ENV.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedRefreshToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token!");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used!");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user?._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, COOKIE_OPTIONS)
      .cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed successfully!"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token!");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const userId = req.user?._id;

  const user = await User.findById(userId);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({
    validateBeforeSave: false,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully!"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: user,
      },
      "Current user fetched successfully!"
    )
  );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(404, "All fields are required!");
  }

  const userId = req.user?._id;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        fullName,
        email,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  return res.stauts(200).json(
    new ApiResponse(
      200,
      {
        user: updatedUser,
      },
      "User details updated successfully!"
    )
  );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing!");
  }

  const avatarLiveUrl = (await uploadOnCloudinary(avatarLocalPath))?.secure_url;

  if (!avatarLiveUrl) {
    throw new ApiError(400, "Unable to upload avatar image to Cloudinary");
  }

  const userId = req.user._id;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        avatar: avatarLiveUrl,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: updatedUser },
        "Avatar image updated successfully!"
      )
    );
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing!");
  }

  const coverImageLiveUrl = (await uploadOnCloudinary(coverImageLocalPath))
    ?.secure_url;

  if (!coverImageLiveUrl) {
    throw new ApiError(400, "Unable to upload cover image to Cloudinary");
  }

  const userId = req.user._id;
  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        coverImage: coverImageLiveUrl,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: updatedUser },
        "Cover image updated successfully!"
      )
    );
});

export {
  isUserExist,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  validateUser,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
};
