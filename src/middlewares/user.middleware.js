import { fromZodError } from "zod-validation-error";

import { asyncHandler } from "../utils/asyncHandler.js";
import { userIdSchema } from "../utils/validations/user.validation.js";
import { ApiError } from "../utils/ApiError.js";

const validateUserId = asyncHandler((req, res, next) => {
  const { userId } = req.params;

  const payload = userIdSchema.safeParse(userId);

  if (!payload?.success) {
    const errorMessage = fromZodError(payload?.error)?.message;
    return res.json(400).json(new ApiError(400, errorMessage));
  }

  req.params = { ...req.params, userId: payload?.data };
  next();
});

export { validateUserId };
