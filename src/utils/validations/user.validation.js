import { z } from "zod";

const userSchema = z.object({
  username: z.string().toLowerCase().trim(),
  email: z.string().email().toLowerCase().trim(),
  fullName: z.string().trim(),
  avatar: z.string().or(z.string().url()),
  coverImage: z.string().or(z.string().url()).optional(),
  password: z.string({ message: "Password is required!" }),
});

const userIdSchema = z.string({
  required_error: "UserId is required",
  invalid_type_error: "UserId is required and must be a string.",
});

export { userSchema, userIdSchema };
