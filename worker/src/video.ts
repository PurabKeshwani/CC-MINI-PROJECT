import exec from "child_process";
import { JobCommand } from "./typs";

export function uploadVideo({
  payload: { accessKey, secretKey, region, bucketName, outputName, videoPath },
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
        docker-video:latest
    `;
  console.log(execCommand);

  exec.execSync(execCommand, { stdio: "inherit" });
  console.log("Video transcoded and uploaded successfully.");
  exec.execSync(`rm -rf '${videoPath}'`);
}
