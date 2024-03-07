import { Router } from "express";

import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  validateAllVideoQueryParams,
  validatePublishVideo,
  validateUpdateVideo,
  validateVideoId,
} from "../middlewares/video.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/")
  .get(validateAllVideoQueryParams, getAllVideos)
  .post(
    upload.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    validatePublishVideo,
    publishAVideo
  );

router
  .route("/:videoId")
  .get(validateVideoId, getVideoById)
  .delete(validateVideoId, deleteVideo)
  .patch(
    upload.single("thumbnail"),
    validateVideoId,
    validateUpdateVideo,
    updateVideo
  );

router
  .route("/toggle/publish/:videoId")
  .patch(validateVideoId, togglePublishStatus);

export default router;
