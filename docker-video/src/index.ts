import { uploadDirectory, uploadObject } from "./aws/functions";
import { VIDEO_FILE_PATH } from "./constants";
import { transCodeVideo } from "./ffmpeg";
import { v4 as uuid } from "uuid";
import { exec } from "child_process";

const main = async () => {
  const id = uuid();
  console.log("Transcoding started");
  const playlists = await transCodeVideo(VIDEO_FILE_PATH);
  return console.log("Transcoding finished", playlists);
  await uploadDirectory(id);
  exec(`rm -rf "output"`);
};

main();
