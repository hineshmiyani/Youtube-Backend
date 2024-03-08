import mongoose, { isValidObjectId } from "mongoose";

import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //✅ TODO: create tweet

  const tweet = await Tweet.create(req.body);

  res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet created successfully!"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // ✅ TODO: get user tweets
  const { userId } = req.params;

  const tweets = await Tweet.find({
    owner: userId,
  });

  if (!tweets) {
    return res.status(404).json(new ApiError(404, "Tweets not found!"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully!"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //✅ TODO: update tweet

  const { tweetId } = req.params;
  const { content, owner } = req.body;

  const updatedTweet = await Tweet.findOneAndUpdate(
    {
      _id: tweetId,
      owner,
    },
    {
      $set: { content },
    },
    { new: true }
  );

  if (!updatedTweet) {
    return res.status(404).json(new ApiError(404, "Tweet not found!"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully!"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //✅ TODO: delete tweet

  const { tweetId } = req.params;

  const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

  if (!deletedTweet) {
    return res.status(404).json(new ApiError(404, "Tweet not found!"));
  }

  res.status(200).json(new ApiResponse(200, {}, "Tweet deleted successfully!"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
