import { uploadDirectory, uploadObject } from "./aws/functions";
import { PROCESS, VIDEO_FILE_PATH } from "./constants";
import { transCodeVideo } from "./ffmpeg";
import { v4 as uuid } from "uuid";
import { exec } from "child_process";
import { OUTPUT_NAME } from "./constants";
import fs from "fs";

const transcode = async (upload = false) => {
  const id = OUTPUT_NAME ? OUTPUT_NAME.split(".")[0] : uuid();
  console.log("Transcoding started");
  const playlists = await transCodeVideo(VIDEO_FILE_PATH);
  console.log("Transcoding finished", playlists);
  if (upload) {
    const path = await uploadDirectory(id);
    if (!path) {
      throw new Error("No output generated to upload");
    }
    console.log("Uploaded", path);
  }
  exec(`rm -rf "output"`);
};

const upload = async () => {
  const id = OUTPUT_NAME ? OUTPUT_NAME.split(".")[0] : uuid();
  if (!fs.existsSync(VIDEO_FILE_PATH)) {
    throw new Error(`File not found: ${VIDEO_FILE_PATH}`);
  }
  const fileStream = fs.createReadStream(VIDEO_FILE_PATH);
  await uploadObject(fileStream, id);
};

const run = async () => {
  try {
    switch (PROCESS) {
      case "transcode&upload":
        await transcode(true);
        break;

      case "transcode":
        await transcode();
        break;

      case "upload":
        await upload();
        break;

      case "test":
        console.log("Test");
        break;

      default:
        throw new Error("Invalid process");
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
