import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "Message content is too short")
    .max(300, "Message content is too long"),
});
