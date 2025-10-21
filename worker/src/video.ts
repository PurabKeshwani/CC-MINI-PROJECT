import exec, { spawn } from "child_process";
import { JobCommand } from "./typs";

export function uploadVideo({
  payload: {
    accessKey,
    secretKey,
    sessionToken,
    region,
    bucketName,
    outputName,
    videoPath,
    videoID,
  },
}: JobCommand) {
  const processType = 'transcode&upload';
  const awsAccessKeyId = accessKey;
  const awsSecretKey = secretKey;
  const awsSessionToken = sessionToken || '';
  const awsRegion = region;
  const containerName = `vidwave-${videoID}`;

  const dockerArgs = [
    'run', '--rm', '--cpus=1',
    '-e', `PROCESS=${processType}`,
    '-e', `AWS_ACCESS_KEY_ID=${awsAccessKeyId}`,
    '-e', `AWS_SESSION_TOKEN=${awsSessionToken}`,
    '-e', `AWS_SECRET_ACCESS_KEY=${awsSecretKey}`,
    '-e', `AWS_REGION=${awsRegion}`,
    '-e', `AWS_BUCKET_NAME=${bucketName}`,
    '-e', 'VIDEO_FILE_PATH=/app/videos/video.mp4',
    '-e', `OUTPUT_NAME=${outputName}`,
    '-v', `${videoPath}:/app/videos/video.mp4`,
    '--name', containerName,
    'docker-video:latest'
  ];

  console.log('Docker command:', 'docker', dockerArgs.join(' '));

  const dockerProcess = spawn('docker', dockerArgs, { stdio: 'inherit' });
  
  dockerProcess.on('close', (code) => {
    if (code === 0) {
      console.log("Video transcoded and uploaded successfully.");
      deletVidFromDIR(videoPath);
      console.log("Video deleted from directory.");
    } else {
      console.error(`Docker process exited with code ${code}`);
    }
  });

  dockerProcess.on('error', (error) => {
    console.error('Docker process error:', error);
  });
}

export function deletVidFromDIR(videoPath: string) {
  const sudo = spawn("sudo", ["-S", "rm", "-rf", videoPath]);
  sudo.stdin.write(process.env.SUDO_PASS + "\n");
  sudo.stdin.end();
}
