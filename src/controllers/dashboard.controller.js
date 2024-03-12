import mongoose from "mongoose";

import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // ✅ TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const totalSubscribers = await Subscription.countDocuments({
    channel: req.user?._id,
  });

  const totalVideos = await Video.countDocuments({
    owner: req.user?._id,
  });

  const totalVideoViews = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" },
      },
    },
  ]);

  const totalLikes = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $addFields: {
        numberOfLikes: { $size: { $ifNull: ["$likes", []] } },
      },
    },
    {
      $group: {
        _id: null,
        totalLikes: { $sum: "$numberOfLikes" },
      },
    },
    {
      $project: {
        _id: 0,
        totalLikes: 1,
      },
    },
  ]);

  const channelStats = {
    totalSubscribers: totalSubscribers,
    totalVideos: totalVideos,
    totalVideoViews:
      totalVideoViews?.length > 0 ? totalVideoViews?.[0]?.totalViews : 0,
    totalLikes: totalLikes?.length > 0 ? totalLikes?.[0]?.totalLikes : 0,
  };

  res
    .status(200)
    .json(
      new ApiResponse(200, channelStats, "Channel stats fetched successfully!")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // ✅ TODO: Get all the videos uploaded by the channel

  const channelVideos = await Video.find({
    owner: req.user?._id,
  });

  if (!channelVideos) {
    return res.status(404).json(new ApiError(404, "Channel videos not found!"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, channelVideos, "Channel videos fetched!"));
});

export { getChannelStats, getChannelVideos };
