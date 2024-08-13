import { z } from "zod";

export const AvailableCommands = z.enum(["upload", "transcode"]);

export const jobCommand = z.object({
  command: AvailableCommands,
  payload: z.object({
    videoPath: z.string(),
    accessKey: z.string(),
    secretKey: z.string(),
    region: z.string(),
    outputName: z.string().optional(),
    bucketName: z.string(),
    videoID: z.string(),
  }),
});

export type JobCommand = z.infer<typeof jobCommand>;
