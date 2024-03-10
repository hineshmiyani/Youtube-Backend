import { Router } from "express";

import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  validateParamsId,
  validateToggleSubscription,
} from "../middlewares/subscription.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/c/:channelId")
  .get(validateParamsId, getUserChannelSubscribers)
  .post(validateToggleSubscription, toggleSubscription);

router.route("/u/:subscriberId").get(validateParamsId, getSubscribedChannels);

export default router;
