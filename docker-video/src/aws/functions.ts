import fs from "fs";
import path from "path";
import s3 from "./client";
import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { AWS_BUCKET_NAME } from "../constants";

export async function uploadObject(id: string, pathToFile: string) {
  if (!fs.existsSync(pathToFile)) {
    throw new Error(`File not found: ${pathToFile}`);
  }

  const fileStream = fs.createReadStream(pathToFile);
  const fileName = path.basename(pathToFile);

  const uploadParams: PutObjectCommandInput = {
    Bucket: AWS_BUCKET_NAME,
    Key: id + "/" + fileName,
    Body: fileStream,
  };

  const command = new PutObjectCommand(uploadParams);
  await s3.send(command);
}
