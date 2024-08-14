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
import { updateVideo } from "../schema/video";
import { deleteFolder, s3Client } from "../lib/s3Client";
import { validateToken } from "../middleware";

export async function handleGetVideos(req: Request, res: Response) {
  const videos = await prisma.video.findMany({
    where: {
      visibility: "public",
    },
    orderBy: {
      uploadedAt: "desc",
    },
  });

  const { token } = req.cookies;

  const videosResp: any[] = [];

  for (const video of videos) {
    const key = video.key.split(AWS_BUCKET_NAME + "/")[1];
    let isAuthor = false;
    if (token) {
      const userExists = await validateToken(token);
      if (userExists && userExists.id === video.userId) {
        isAuthor = true;
      }
    }
    videosResp.push({
      id: video.id,
      title: video.title,
      description: video.description,
      url: `https://${AWS_BUCKET_NAME}.s3.amazonaws.com/${key}/index.m3u8`,
      likes: video.likes,
      dislikes: video.dislikes,
      views: video.views,
      visibility: video.visibility,
      uploadedAt: video.uploadedAt,
      updatedAt: video.updatedAt,
      isAuthor,
    });
  }

  res.status(200).json({
    videos: videosResp,
  });
}

export async function handleGetVideo(req: Request, res: Response) {
  const { id } = req.params;

  const video = await prisma.video.findUnique({
    where: {
      id,
    },
  });

  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  const { token } = req.cookies;
  let isAuthor = false;

  if (token) {
    const userExists = await validateToken(token);
    if (userExists && userExists.id === video.userId) {
      isAuthor = true;
    }
  }

  if (video.visibility === "private") {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userExists = await validateToken(token);
    if (!userExists) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (userExists.id !== video.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  const key = video.key.split(AWS_BUCKET_NAME + "/")[1];
  console.log("Key", key);
  res.status(200).json({
    video: {
      id: video.id,
      title: video.title,
      description: video.description,
      url: `https://${AWS_BUCKET_NAME}.s3.amazonaws.com/${key}/index.m3u8`,
      likes: video.likes,
      dislikes: video.dislikes,
      views: video.views,
      visibility: video.visibility,
      uploadedAt: video.uploadedAt,
      updatedAt: video.updatedAt,
      isAuthor,
    },
  });
}

export async function handleUploadVideo(req: Request, res: Response) {
  const { user } = res.locals;

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

  const key = AWS_BUCKET_NAME + "/" + user.username + "/" + video.id;

  await prisma.video.update({
    where: {
      id: video.id,
    },
    data: {
      key,
      title: fileName,
    },
  });

  const params = {
    command: "upload",
    payload: {
      videoID: video.id,
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

export async function handleUpdateVideo(req: Request, res: Response) {
  const { id } = req.params;
  const { user } = res.locals;
  const params = updateVideo.safeParse(req.body);

  if (!params.success) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const video = await prisma.video.findUnique({
    where: {
      id,
    },
  });

  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  if (video.userId !== user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title, description, visibility } = params.data;

  const updatedVid = await prisma.video.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      visibility,
      updatedAt: new Date(),
    },
  });

  res
    .status(200)
    .json({ message: "Video updated", updatedAt: updatedVid.updatedAt });
}

export async function handleDeleteVideo(req: Request, res: Response) {
  const { id } = req.params;
  const { user } = res.locals;

  const video = await prisma.video.findUnique({
    where: {
      id,
    },
  });

  if (!video) {
    return res.status(404).json({ message: "Video not found" });
  }

  if (video.userId !== user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const deleteRes = await deleteFolder(video.key);

  if (!deleteRes) {
    return res.status(500).json({ message: "Failed to delete video" });
  }

  await prisma.video.delete({
    where: {
      id,
    },
  });

  res.status(200).json({ message: "Video deleted" });
}
