import exec, { spawn } from "child_process";
import { JobCommand } from "./typs";

export function uploadVideo({
  payload: {
    accessKey,
    secretKey,
    region,
    bucketName,
    outputName,
    videoPath,
    videoID,
  },
}: JobCommand) {
  const execCommand = `
    docker run --rm --cpus=1 \
        -e PROCESS='transcode&upload' \
        -e AWS_ACCESS_KEY_ID='${accessKey}' \
        -e AWS_SECRET_ACCESS_KEY='${secretKey}' \
        -e AWS_REGION='${region}' \
        -e AWS_BUCKET_NAME='${bucketName}' \
        -e VIDEO_FILE_PATH=/app/videos/video.mp4 \
        -e OUTPUT_NAME='${outputName}' \
        -v "${videoPath}":/app/videos/video.mp4 \
        --name ${"vidwave-" + videoID} \
        docker-video:latest
    `;
  console.log(execCommand);

  exec.execSync(execCommand, { stdio: "inherit" });
  console.log("Video transcoded and uploaded successfully.");
  deletVidFromDIR(videoPath);
  console.log("Video deleted from directory.");
}

export function deletVidFromDIR(videoPath: string) {
  const sudo = spawn("sudo", ["-S", "rm", "-rf", videoPath]);
  sudo.stdin.write(process.env.SUDO_PASS + "\n");
  sudo.stdin.end();
}
