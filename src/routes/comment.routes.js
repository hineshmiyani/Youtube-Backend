import { Router } from "express";

import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  validateAddComment,
  validateCommentId,
  validateUpdateComment,
  validateVideoCommentsQueryParams,
} from "../middlewares/comment.middleware.js";
import { validateVideoId } from "../middlewares/video.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route("/:videoId")
  .get(validateVideoId, validateVideoCommentsQueryParams, getVideoComments)
  .post(validateVideoId, validateAddComment, addComment);
router
  .route("/c/:commentId")
  .delete(validateCommentId, deleteComment)
  .patch(validateCommentId, validateUpdateComment, updateComment);

export default router;
