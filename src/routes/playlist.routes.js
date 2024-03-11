import { Router } from "express";

import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  validateCreatePlaylist,
  validatePlaylistId,
  validateUpdatePlaylist,
} from "../middlewares/playlist.middleware.js";
import { validateUserId } from "../middlewares/user.middleware.js";
import { validateVideoId } from "../middlewares/video.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(validateCreatePlaylist, createPlaylist);

router
  .route("/:playlistId")
  .get(validatePlaylistId, getPlaylistById)
  .patch(validatePlaylistId, validateUpdatePlaylist, updatePlaylist)
  .delete(validatePlaylistId, deletePlaylist);

router
  .route("/add/:videoId/:playlistId")
  .patch(validateVideoId, validatePlaylistId, addVideoToPlaylist);
router
  .route("/remove/:videoId/:playlistId")
  .patch(validateVideoId, validatePlaylistId, removeVideoFromPlaylist);

router.route("/user/:userId").get(validateUserId, getUserPlaylists);

export default router;
