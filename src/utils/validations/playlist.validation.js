import { isValidObjectId } from "mongoose";
import { z } from "zod";

import { userIdSchema } from "./user.validation.js";

const playlistIdSchema = z.string().refine((val) => isValidObjectId(val), {
  message: "PlaylistId is required and must be a valid MongoDB ObjectId.",
});

const createPlaylistSchema = z.object({
  name: z.string(),
  description: z.string(),
  owner: userIdSchema,
});

const updatePlaylistSchema = createPlaylistSchema.omit({
  owner: true,
});

export { playlistIdSchema, createPlaylistSchema, updatePlaylistSchema };
