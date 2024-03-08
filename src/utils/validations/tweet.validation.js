import { z } from "zod";

const createTweetSchema = z.object({
  owner: z.string(),
  content: z.string().trim().min(1).max(200),
});

const tweetIdSchema = z.string({
  required_error: "TweetId is required",
  invalid_type_error: "TweetId is required and must be a string.",
});

const updateTweetSchema = z.object({
  owner: z.string(),
  content: z.string().trim().min(1).max(200),
});

export { createTweetSchema, tweetIdSchema, updateTweetSchema };
