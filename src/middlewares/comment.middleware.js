import { fromZodError } from "zod-validation-error";

import { asyncHandler } from "../utils/asyncHandler.js";
import {
  videoCommentsQueryParamsSchema,
  addCommentSchema,
  commentIdSchema,
  updateCommentSchema,
} from "../utils/validations/comment.validation.js";
import { ApiError } from "../utils/ApiError.js";

const validateAddComment = asyncHandler((req, res, next) => {
  const { content } = req.body;
  const { videoId } = req.params;

  const userId = req.user?.id;

  const data = {
    content,
    video: videoId,
    owner: userId,
  };

  const payload = addCommentSchema.safeParse(data);

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message;
    return res.status(400).json(new ApiError(400, errorMessage));
  }

  req.body = payload?.data;
  next();
});

const validateVideoCommentsQueryParams = asyncHandler((req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const data = {
    page,
    limit,
  };

  const payload = videoCommentsQueryParamsSchema.safeParse(data);

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message;
    return res.status(400).json(new ApiError(400, errorMessage));
  }

  req.query = { ...req.query, ...payload.data };
  next();
});

const validateCommentId = asyncHandler((req, res, next) => {
  const { commentId } = req.params;

  const payload = commentIdSchema.safeParse(commentId);

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message;
    return res.status(400).json(new ApiError(400, errorMessage));
  }

  req.params = { ...req.params, commentId: payload?.data };
  next();
});

const validateUpdateComment = asyncHandler((req, res, next) => {
  const { content } = req.body;

  const data = {
    content,
    owner: req.user?.id,
  };

  const payload = updateCommentSchema.safeParse(data);

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message;
    return res.status(400).json(new ApiError(400, errorMessage));
  }

  req.body = payload?.data;
  next();
});

export {
  validateAddComment,
  validateVideoCommentsQueryParams,
  validateCommentId,
  validateUpdateComment,
};
