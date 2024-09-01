import { z } from "zod";

export const verifySchema = z.object({
  code: z.string().length(6, "verify code length should be 6 digits"),
});
