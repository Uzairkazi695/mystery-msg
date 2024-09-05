import { z } from "zod";

export const sendMessageSchema = z.object({
  username: z.string(),
  content: z.string(),
});