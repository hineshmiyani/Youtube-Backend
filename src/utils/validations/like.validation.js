import { z } from "zod";

import { userIdSchema } from "./user.validation.js";
import { videoIdSchema } from "./video.validation.js";
import { commentIdSchema } from "./comment.validation.js";
import { tweetIdSchema } from "./tweet.validation.js";

const baseLikeSchema = z.object({
  likedBy: userIdSchema,
});

const videoLikeSchema = baseLikeSchema.extend({
  video: videoIdSchema,
});

const commentLikeSchema = baseLikeSchema.extend({
  comment: commentIdSchema,
});

const tweetLikeSchema = baseLikeSchema.extend({
  tweet: tweetIdSchema,
});

export { videoLikeSchema, commentLikeSchema, tweetLikeSchema };
