import fs from "fs";
import path from "path";
import s3 from "./client";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { AWS_BUCKET_NAME } from "../constants";

export async function uploadObject(Body: fs.ReadStream, Key: string) {
  const uploadParams: PutObjectCommandInput = {
    Bucket: AWS_BUCKET_NAME,
    Key,
    Body,
    ACL: undefined, // Disable ACL to avoid AccessControlListNotSupported error
  };

  const command = new PutObjectCommand(uploadParams);
  await s3.send(command);
  return Key;
}
export async function uploadVideo(
  id: string,
  pathToFile: string,
  resolution: string
) {
  if (!fs.existsSync(pathToFile)) {
    throw new Error(`File not found: ${pathToFile}`);
  }

  const fileStream = fs.createReadStream(pathToFile);
  const fileName = path.basename(pathToFile);

  const key = await uploadObject(
    fileStream,
    `${id}/${resolution ? resolution + "/" : ""}${fileName}`
  );
  return key;
}

export async function uploadDirectory(id: string) {
  const dirPath = path.join(__dirname, "../../output");
  console.log("Uploading directory", dirPath);

  const folder = fs.readdirSync(dirPath);

  console.log("Uploading files", folder);

  let indexM3u8Path: string | null = null;

  for (const file of folder) {
    const rPath = path.join(dirPath, file);
    if (fs.lstatSync(rPath).isFile()) {
      const key = await uploadVideo(id, rPath, "");
      if (file === "index.m3u8") {
        indexM3u8Path = key;
      }
    } else if (fs.lstatSync(rPath).isDirectory()) {
      for (const resolution of fs.readdirSync(rPath)) {
        const resPath = path.join(rPath, resolution);
        if (fs.lstatSync(resPath).isFile()) {
          await uploadVideo(id, resPath, file);
        }
      }
    }
  }
  if (!indexM3u8Path) return "";
  return indexM3u8Path;
}
