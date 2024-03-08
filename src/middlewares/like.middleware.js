import { fromZodError } from "zod-validation-error";

import { asyncHandler } from "../utils/asyncHandler.js";
import {
  commentLikeSchema,
  tweetLikeSchema,
  videoLikeSchema,
} from "../utils/validations/like.validation.js";
import { ApiError } from "../utils/ApiError.js";

const likeTypeMappings = {
  "/v/": { key: "video", schema: videoLikeSchema },
  "/c/": { key: "comment", schema: commentLikeSchema },
  "/t/": { key: "tweet", schema: tweetLikeSchema },
};

/**
 * Retrieves the like schema and ID based on the provided path.
 *
 * This function iterates through the `likeTypeMappings` object to find a matching path key.
 * Once a match is found, it returns an object containing the key (type of like),
 * the corresponding ID (based on the type), and the schema associated with that type.
 *
 * @param {string} path - The path that determines the type of like (e.g., video, comment, tweet).
 * @param {string} videoId - The unique identifier for a video, if applicable.
 * @param {string} commentId - The unique identifier for a comment, if applicable.
 * @param {string} tweetId - The unique identifier for a tweet, if applicable.
 * @returns {Object} An object containing the `key` (type of like), `id` (unique identifier for the like),
 *                   and `schema` (the schema associated with the type of like).
 */
const getLikeSchemaAndId = (path, videoId, commentId, tweetId) => {
  for (const [pathKey, { key, schema }] of Object.entries(likeTypeMappings)) {
    if (path.includes(pathKey)) {
      return {
        key,
        id: { video: videoId, comment: commentId, tweet: tweetId }[key],
        schema,
      };
    }
  }
};

const validateToggleLike = asyncHandler((req, res, next) => {
  const { videoId, commentId, tweetId } = req.params || {};

  const likeSchemaAndId = getLikeSchemaAndId(
    req.path,
    videoId,
    commentId,
    tweetId
  );

  const data = {
    [likeSchemaAndId?.key]: likeSchemaAndId?.id,
    likedBy: req.user?.id,
  };

  const payload = likeSchemaAndId?.schema?.safeParse(data);

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message;
    return res.status(400).json(new ApiError(400, errorMessage));
  }

  req.body = payload?.data;
  next();
});

export { validateToggleLike };
