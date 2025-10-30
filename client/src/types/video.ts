import { z } from "zod";

const videoVisibility = z.enum(["public", "private"]);
export enum VideoVisibility {
  Public = "public",
  Private = "private",
}

export const validateComment = z.object({
  id: z.number(),
  content: z.string(),
  createdAt: z.string().transform((val) => new Date(val)),
  user: z.object({
    id: z.string(),
    username: z.string(),
  }),
  isAuthor: z.boolean(),
});

export type Comment = z.infer<typeof validateComment>;

export const validateVideo = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  url: z.string(),
  thumbnail: z.string(),
  likes: z.number(),
  dislikes: z.number(),
  views: z.number(),
  visibility: videoVisibility,
  uploadedAt: z.string().transform((val) => new Date(val)),
  updatedAt: z.string().transform((val) => new Date(val)),
  isAuthor: z.boolean(),
  comments: z.array(validateComment),
});

export type Video = z.infer<typeof validateVideo>;
