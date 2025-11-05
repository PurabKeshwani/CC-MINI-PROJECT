import express from "express";
import routes from "./routes";
import { CLIENT_URLS, PORT } from "./lib/constants";
import cors from "cors";
import prisma from "./lib/prisma";
import { redisClient } from "./lib/redis";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (CLIENT_URLS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: Origin not allowed: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Explicitly handle preflight requests with the same CORS rules
app.options(
  "*",
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (CLIENT_URLS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: Origin not allowed: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/", routes);

app.listen(PORT, async () => {
  await prisma.$connect();
  console.log("Connected to database");
  await redisClient.connect();
  console.log("Connected to redis");
  console.log(`app is running on port ${PORT}`);
});

