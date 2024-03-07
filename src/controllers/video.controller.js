import mongoose from "mongoose";

import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllVideos = asyncHandler(async (req, res) => {
  //✅ TODO: get all videos based on query, sort, pagination
  const { page, limit, query, sortBy, sortType, userId } = req.query;

  const options = {
    page: page,
    limit: limit,
  };

  let regex = new RegExp(query, "i");

  const videoAggregate = Video.aggregate([
    {
      $match: {
        ...(query
          ? {
              $or: [{ title: regex }, { description: regex }],
            }
          : {}),
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $sort: {
        [sortBy]: sortType,
      },
    },
  ]);

  try {
    const results = await Video.aggregatePaginate(videoAggregate, options);
    res
      .status(200)
      .json(new ApiResponse(200, results, "Videos fetched successfully!"));
  } catch (error) {
    return res.status(404).json(new ApiError(404, error?.message || error));
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  // ✅ TODO: get video, upload to cloudinary, create video

  const video = await Video.create(req.body);
  res
    .status(200)
    .json(new ApiResponse(200, video, "Video published successfully!"));
});

const getVideoById = asyncHandler(async (req, res) => {
  //✅ TODO: get video by id
  const { videoId } = req.params;

  const video = (await Video.findById(videoId))?._doc;

  if (!video) {
    return res.status(404).json(new ApiError(404, "Video not found!"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully!"));
});

const updateVideo = asyncHandler(async (req, res) => {
  //✅ TODO: update video details like title, description, thumbnail
  const { videoId } = req.params;
  const { title, description, thumbnail } = req.body;

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail,
      },
    },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully!"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  //✅ TODO: delete video
  const { videoId } = req.params;

  await Video.findByIdAndDelete(videoId);

  res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully!"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // First, find the document to get the current value of isPublished
  const video = await Video.findById(videoId);

  if (!video) {
    return res.status(404).json(new ApiError(404, "Video not found!"));
  }

  // Then, toggle the isPublished value in JavaScript
  const toggleIsPublished = !video.isPublished;

  // Finally, update the document with the new value
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished: toggleIsPublished,
      },
    },
    { new: true }
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedVideo,
        "Video publish status toggled successfully!"
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
