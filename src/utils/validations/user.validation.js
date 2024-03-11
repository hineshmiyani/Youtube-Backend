import { isValidObjectId } from "mongoose";
import { z } from "zod";

const userSchema = z.object({
  username: z.string().toLowerCase().trim(),
  email: z.string().email().toLowerCase().trim(),
  fullName: z.string().trim(),
  avatar: z.string().or(z.string().url()),
  coverImage: z.string().or(z.string().url()).optional(),
  password: z.string({ message: "Password is required!" }),
});

const userIdSchema = z.string().refine((val) => isValidObjectId(val), {
  message: "UserId is required and must be a valid MongoDB ObjectId.",
});

export { userSchema, userIdSchema };
