import { createClient } from "redis";
import { jobCommand } from "./typs";
import { uploadVideo } from "./video";

import dotenv from "dotenv";
dotenv.config();

const client = createClient();

async function pocessVideo(submission: string) {
  const res = jobCommand.safeParse(JSON.parse(submission));

  if (!res.success) {
    return console.error("Invalid submission:", submission);
  }

  const obj = res.data;

  obj.payload.videoPath = process.env.UPLOADS_DIR + "/" + obj.payload.videoPath;

  uploadVideo(obj);
}

async function startWorker() {
  try {
    await client.connect();
    console.log("Worker connected to Redis.");
    while (true) {
      try {
        const submission = await client.brPop("video:operation", 0);
        if (!submission) continue;
        await pocessVideo(submission.element);
      } catch (error) {
        console.error("Error processing submission:", error);
      }
    }
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  }
}
startWorker();
