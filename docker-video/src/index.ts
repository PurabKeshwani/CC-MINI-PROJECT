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

switch (PROCESS) {
  case "transcode&upload":
    transcode(true);
    break;

  case "transcode":
    transcode();
    break;

  case "upload":
    upload();
    break;

  case "test":
    console.log("Test");
    break;

  default:
    throw new Error("Invalid process");
}
