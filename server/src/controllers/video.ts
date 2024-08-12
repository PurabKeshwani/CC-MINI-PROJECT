import { Request, Response } from "express";
import { redisClient } from "../lib/redis";
import {
  AWS_ACCESS_KEY_ID,
  AWS_BUCKET_NAME,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  UPLOADS_DIR,
} from "../lib/constants";
import prisma from "../lib/prisma";

export async function handleUploadVideo(req: Request, res: Response) {
  const { user } = res.locals;
  console.log("User", user);

  const { fileNameComputed, fileName } = req.body;
  console.log("File Name", fileNameComputed, fileName);

  if (!req.file || !fileNameComputed) {
    return res.status(400).json({ message: "File not uploaded" });
  }

  const video = await prisma.video.create({
    data: {
      userId: user.id,
    },
  });

  const params = {
    command: "upload",
    payload: {
      videoPath: UPLOADS_DIR + "/" + fileNameComputed,
      accessKey: AWS_ACCESS_KEY_ID,
      secretKey: AWS_SECRET_ACCESS_KEY,
      region: AWS_REGION,
      outputName: user.username + "/" + video.id,
      bucketName: AWS_BUCKET_NAME,
    },
  };

  await redisClient.lPush("video:operation", JSON.stringify(params));
  res.status(200).json({ message: "Image processing started", id: video.id });
}
