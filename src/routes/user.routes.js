import { Router } from "express";
import {
  isUserExist,
  registerUser,
  validateUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

const fileUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);

router
  .route("/register")
  .post(fileUpload, isUserExist, validateUser, registerUser);

export default router;
