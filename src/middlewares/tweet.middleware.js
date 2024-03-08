import { fromZodError } from "zod-validation-error";

import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createTweetSchema,
  tweetIdSchema,
  updateTweetSchema,
} from "../utils/validations/tweet.validation.js";
import { ApiError } from "../utils/ApiError.js";

const validateCreateTweet = asyncHandler((req, res, next) => {
  const { content } = req.body;

  const data = {
    owner: req.user?.id,
    content,
  };

  const payload = createTweetSchema.safeParse(data);

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message;
    return res.status(400).json(new ApiError(400, errorMessage));
  }

  req.body = payload?.data;
  next();
});

const validateTweetId = asyncHandler((req, res, next) => {
  const { tweetId } = req.params;

  const payload = tweetIdSchema.safeParse(tweetId);

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message;
    return res.json(400).json(new ApiError(400, errorMessage));
  }

  req.params = { ...req.params, tweetId: payload?.data };
  next();
});

const validateUpdateTweet = asyncHandler((req, res, next) => {
  const { content } = req.body;

  const data = {
    content,
    owner: req.user?.id,
  };

  const payload = updateTweetSchema.safeParse(data);

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message;
    return res.status(400).json(new ApiError(400, errorMessage));
  }

  req.body = payload?.data;
  next();
});

export { validateCreateTweet, validateTweetId, validateUpdateTweet };
