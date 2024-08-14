import { z } from "zod";

const videoVisibility = z.enum(["public", "private"]);
export enum VideoVisibility {
  Public = "public",
  Private = "private",
}

export const validateVideo = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  url: z.string(),
  likes: z.number(),
  dislikes: z.number(),
  views: z.number(),
  visibility: videoVisibility,
  uploadedAt: z.string().transform((val) => new Date(val)),
  updatedAt: z.string().transform((val) => new Date(val)),
  isAuthor: z.boolean(),
});

export type Video = z.infer<typeof validateVideo>;
