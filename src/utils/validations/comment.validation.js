import { z } from "zod";

const addCommentSchema = z.object({
  content: z.string().trim(),
  video: z.string(),
  owner: z.string(),
});

const videoCommentsQueryParamsSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

const commentIdSchema = z.string({
  required_error: "CommentId is required",
  invalid_type_error: "CommentId is required and must be a string.",
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
