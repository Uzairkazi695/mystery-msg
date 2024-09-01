import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters long.")
  .max(20, "Username cannot exceed 20 characters.")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain alphanumeric characters and underscores."
  );

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Email is not valid." }),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});
