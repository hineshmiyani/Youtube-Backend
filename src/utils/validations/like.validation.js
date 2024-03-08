import { z } from "zod";

const baseLikeSchema = z.object({
  likedBy: z.string(),
});

const videoLikeSchema = baseLikeSchema.extend({
  video: z.string(),
});

const commentLikeSchema = baseLikeSchema.extend({
  comment: z.string(),
});

const tweetLikeSchema = baseLikeSchema.extend({
  tweet: z.string(),
});

export { videoLikeSchema, commentLikeSchema, tweetLikeSchema };
