import { fromZodError } from "zod-validation-error";

import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createPlaylistSchema,
  playlistIdSchema,
  updatePlaylistSchema,
} from "../utils/validations/playlist.validation.js";
import { ApiError } from "../utils/ApiError.js";

const validatePlaylistId = asyncHandler((req, res, next) => {
  const { playlistId } = req.params;

  const payload = playlistIdSchema.safeParse(playlistId);

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message;
    return res.status(400).json(new ApiError(400, errorMessage));
  }

  req.params = { ...req.params, playlistId: payload?.data };
  next();
});

const validateCreatePlaylist = asyncHandler((req, res, next) => {
  const { name, description } = req.body;

  const data = {
    name,
    description,
    owner: req.user?.id,
  };

  const payload = createPlaylistSchema.safeParse(data);

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message;
    return res.status(400).json(new ApiError(400, errorMessage));
  }

  req.body = payload?.data;
  next();
});

const validateUpdatePlaylist = asyncHandler((req, res, next) => {
  const { name, description } = req.body;

  const data = {
    name,
    description,
  };

  const payload = updatePlaylistSchema.safeParse(data);

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message;
    return res.status(400).json(new ApiError(400, errorMessage));
  }

  req.body = payload?.data;
  next();
});

export { validatePlaylistId, validateCreatePlaylist, validateUpdatePlaylist };
