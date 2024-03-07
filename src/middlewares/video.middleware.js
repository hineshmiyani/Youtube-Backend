import { fromZodError } from "zod-validation-error";

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {
  allVideoQueryParamsSchema,
  publishVideoSchema,
  updateVideoSchema,
  videoIdSchema,
} from "../utils/validations/video.validation.js";

const validateAllVideoQueryParams = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = 1,
    userId,
  } = req.query;

  const params = {
    page,
    limit,
    query,
    sortBy,
    sortType,
    userId,
  };

  const payload = allVideoQueryParamsSchema.safeParse(params);

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message;
    return res.status(400).json(new ApiError(400, errorMessage));
  }

  req.query = { ...req.query, ...payload?.data };
  next();
});

const validatePublishVideo = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;
  const videoFileLocalPath = req.files?.["videoFile"]?.[0]?.path;
  const thumbnailLocalPath = req.files?.["thumbnail"]?.[0]?.path;

  const videoFile = videoFileLocalPath
    ? await uploadOnCloudinary(videoFileLocalPath)
    : null;
  const thumbnail = thumbnailLocalPath
    ? await uploadOnCloudinary(thumbnailLocalPath)
    : null;

  const data = {
    title,
    description,
    videoFile: videoFile?.secure_url,
    thumbnail: thumbnail?.secure_url,
    duration: videoFile?.duration, // in seconds
    isPublished: true,
    views: 0,
    owner: req.user?.id,
  };

  const payload = publishVideoSchema.safeParse(data);

  if (!payload?.success) {
    const errorMessage = fromZodError(payload.error).message;
    return res.status(400).json(new ApiError(400, errorMessage));
  }

  req.body = payload?.data;
  next();
});

const validateVideoId = asyncHandler((req, res, next) => {
  const { videoId } = req.params;

  const payload = videoIdSchema.safeParse(videoId);

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message;
    return res.status(400).json(new ApiError(400, errorMessage));
  }

  req.params = { ...req.params, videoId: payload?.data };
  next();
});

const validateUpdateVideo = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;
  const thumbnailLocalPath = req.file?.path;

  const thumbnail = thumbnailLocalPath
    ? await uploadOnCloudinary(thumbnailLocalPath)
    : null;

  const data = {
    title,
    description,
    thumbnail: thumbnail?.secure_url,
  };

  const payload = updateVideoSchema.safeParse(data);

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message;
    return res.status(400).json(new ApiError(400, errorMessage));
  }

  req.body = payload?.data;
  next();
});

export {
  validateAllVideoQueryParams,
  validatePublishVideo,
  validateVideoId,
  validateUpdateVideo,
};
