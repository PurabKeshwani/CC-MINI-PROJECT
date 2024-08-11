import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// AWS credentials
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
export const AWS_REGION = process.env.AWS_REGION || "us-east-1";
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME || "video-bucket";

export const NODE_ENV = process.env.NODE_ENV || "development";
export const HASH_PREFIX = process.env.HASH_PREFIX || "xx";
export const HASH_SUFFIX = process.env.HASH_SUFFIX || "yy";
export const HASH_SALT = process.env.HASH_SALT || "zz";
export const JWT_SECRET = process.env.JWT_SECRET || "secret";