import { isValidObjectId } from "mongoose";
import { z } from "zod";

import { userIdSchema } from "./user.validation.js";

const createTweetSchema = z.object({
  owner: userIdSchema,
  content: z.string().trim().min(1).max(200),
});

const tweetIdSchema = z.string().refine((val) => isValidObjectId(val), {
  message: "TweetId is required and must be a valid MongoDB ObjectId.",
});

const updateTweetSchema = z.object({
  owner: userIdSchema,
  content: z.string().trim().min(1).max(200),
});

export { createTweetSchema, tweetIdSchema, updateTweetSchema };
