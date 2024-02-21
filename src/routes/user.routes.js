import { Router } from "express";
import {
  isUserExist,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  validateUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

const fileUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);

router
  .route("/register")
  .post(fileUpload, isUserExist, validateUser, registerUser);

router.route("/login").post(loginUser);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
