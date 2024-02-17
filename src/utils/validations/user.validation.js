import { z } from "zod";

const userSchema = z.object({
  username: z.string().transform((val) => val.toLowerCase().trim()),
  email: z
    .string()
    .email()
    .transform((val) => val.toLowerCase().trim()),
  fullName: z.string().transform((val) => val.trim()),
  avatar: z.string().or(z.string().url()),
  coverImage: z.string().or(z.string().url()).optional(),
  password: z.string({ message: "Password is required!" }),
});

export default userSchema;
