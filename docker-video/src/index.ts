import { uploadDirectory, uploadObject } from "./aws/functions";
import { VIDEO_FILE_PATH } from "./constants";
import { transCodeVideo } from "./ffmpeg";
import { v4 as uuid } from "uuid";
import { exec } from "child_process";
import { OUTPUT_NAME } from "./constants";

const main = async () => {
  const id = OUTPUT_NAME ? OUTPUT_NAME.split(".")[0] : uuid();
  console.log("Transcoding started");
  const playlists = await transCodeVideo(VIDEO_FILE_PATH);
  console.log("Transcoding finished", playlists);
  await uploadDirectory(id);
  exec(`rm -rf "output"`);
};

main();
