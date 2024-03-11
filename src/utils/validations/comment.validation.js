import { isValidObjectId } from "mongoose";
import { z } from "zod";

import { userIdSchema } from "./user.validation.js";

const addCommentSchema = z.object({
  content: z.string().trim(),
  video: z.string(),
  owner: userIdSchema,
});

const videoCommentsQueryParamsSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

const commentIdSchema = z.string().refine((val) => isValidObjectId(val), {
  message: "CommentId is required and must be a valid MongoDB ObjectId.",
});

const updateCommentSchema = addCommentSchema.pick({
  content: true,
  owner: true,
});

export {
  addCommentSchema,
  videoCommentsQueryParamsSchema,
  commentIdSchema,
  updateCommentSchema,
};
