import { Router } from "express";

import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  validateCreateTweet,
  validateTweetId,
  validateUpdateTweet,
} from "../middlewares/tweet.middleware.js";
import { validateUserId } from "../middlewares/user.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(validateCreateTweet, createTweet);
router.route("/user/:userId").get(validateUserId, getUserTweets);
router
  .route("/:tweetId")
  .patch(validateTweetId, validateUpdateTweet, updateTweet)
  .delete(validateTweetId, deleteTweet);

export default router;
