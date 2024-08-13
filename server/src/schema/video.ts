import { z } from "zod";

export const updateVideo = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  visibility: z.enum(["public", "private"]).optional(),
});
