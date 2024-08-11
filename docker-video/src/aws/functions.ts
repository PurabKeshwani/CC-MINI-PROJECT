import fs from "fs";
import path from "path";
import s3 from "./client";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { AWS_BUCKET_NAME } from "../constants";

export async function uploadObject(
  id: string,
  pathToFile: string,
  resolution: string
) {
  if (!fs.existsSync(pathToFile)) {
    throw new Error(`File not found: ${pathToFile}`);
  }
  
  const fileStream = fs.createReadStream(pathToFile);
  const fileName = path.basename(pathToFile);

  const uploadParams: PutObjectCommandInput = {
    Bucket: AWS_BUCKET_NAME,
    Key: `${id}/${resolution ? resolution + "/" : ""}${fileName}`,
    Body: fileStream,
  };

  const command = new PutObjectCommand(uploadParams);
  await s3.send(command);
}

export async function uploadDirectory(id: string) {
  const dirPath = path.join(__dirname, "../../output");
  console.log("Uploading directory", dirPath);

  const folder = fs.readdirSync(dirPath);

  console.log("Uploading files", folder);

  for (const file of folder) {
    const rPath = path.join(dirPath, file);
    if (fs.lstatSync(rPath).isFile()) {
      await uploadObject(id, rPath, "");
    } else if (fs.lstatSync(rPath).isDirectory()) {
      for (const resolution of fs.readdirSync(rPath)) {
        const resPath = path.join(rPath, resolution);
        if (fs.lstatSync(resPath).isFile()) {
          await uploadObject(id, resPath, file);
        }
      }
    }
  }
}
