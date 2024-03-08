import mongoose, { isValidObjectId } from "mongoose";

import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  //✅ TODO: toggle like on video

  const isVideoLikeExist = await Like.findOne(req?.body);

  if (isVideoLikeExist) {
    const removedVideoLike = await Like.findByIdAndDelete(
      isVideoLikeExist?._id
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          removedVideoLike,
          "Video like removed successfully!"
        )
      );
  }

  const addedVideoLike = await Like.create(req?.body);

  res
    .status(200)
    .json(new ApiResponse(200, addedVideoLike, "Video liked successfully!"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  //✅ TODO: toggle like on comment
  const isCommentLikeExist = await Like.findOne(req?.body);

  if (isCommentLikeExist) {
    const removedCommentLike = await Like.findByIdAndDelete(
      isCommentLikeExist?._id
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          removedCommentLike,
          "Comment like removed successfully!"
        )
      );
  }

  const addedCommentLike = await Like.create(req?.body);

  res
    .status(200)
    .json(
      new ApiResponse(200, addedCommentLike, "Comment liked successfully!")
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  //✅ TODO: toggle like on tweet
  const isTweetLikeExist = await Like.findOne(req?.body);

  if (isTweetLikeExist) {
    const removedTweetLike = await Like.findByIdAndDelete(
      isTweetLikeExist?._id
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          removedTweetLike,
          "Tweet like removed successfully!"
        )
      );
  }

  const addedTweetLike = await Like.create(req?.body);

  res
    .status(200)
    .json(new ApiResponse(200, addedTweetLike, "Tweet liked successfully!"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //✅ TODO: get all liked videos

  const userId = req.user?._id;

  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId),
        video: { $exists: true },
      },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Like Videos fetched successfully!")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
