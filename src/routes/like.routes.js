import { Router } from "express";

import {
  getLikedVideos,
  toggleCommentLike,
  toggleVideoLike,
  toggleTweetLike,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateVideoId } from "../middlewares/video.middleware.js";
import { validateCommentId } from "../middlewares/comment.middleware.js";
import { validateTweetId } from "../middlewares/tweet.middleware.js";
import { validateToggleLike } from "../middlewares/like.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/toggle/v/:videoId")
  .post(validateVideoId, validateToggleLike, toggleVideoLike);
router
  .route("/toggle/c/:commentId")
  .post(validateCommentId, validateToggleLike, toggleCommentLike);
router
  .route("/toggle/t/:tweetId")
  .post(validateTweetId, validateToggleLike, toggleTweetLike);
router.route("/videos").get(getLikedVideos);

export default router;
