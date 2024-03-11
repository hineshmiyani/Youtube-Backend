import { isValidObjectId } from "mongoose";
import { z } from "zod";

import { userIdSchema } from "./user.validation.js";

const allVideoQueryParamsSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  query: z.string(),
  sortBy: z.string().default("createdAt"),
  sortType: z.coerce.number().default(1),
  userId: userIdSchema,
});

const publishVideoSchema = z.object({
  title: z.string().trim(),
  description: z.string().trim(),
  videoFile: z.string().url({
    message: "Invalid video file URL.",
  }),
  thumbnail: z.string().url({
    message: "Invalid thumbnail URL.",
  }),
  duration: z.number().positive(),
  views: z.number().nonnegative().default(0),
  isPublished: z.boolean().default(true),
  owner: userIdSchema,
});

const videoIdSchema = z.string().refine((val) => isValidObjectId(val), {
  message: "VideoId is required and must be a valid MongoDB ObjectId.",
});

const updateVideoSchema = publishVideoSchema.pick({
  title: true,
  description: true,
  thumbnail: true,
});

export {
  allVideoQueryParamsSchema,
  publishVideoSchema,
  videoIdSchema,
  updateVideoSchema,
};
