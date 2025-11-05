import express from "express";
import routes from "./routes";
import { CLIENT_URLS, PORT } from "./lib/constants";
import cors from "cors";
import prisma from "./lib/prisma";
import { redisClient } from "./lib/redis";
import cookieParser from "cookie-parser";

const app = express();

/**
 * 🔍 Debugging middleware
 * Logs every incoming request's origin and allowed origins
 */
app.use((req, res, next) => {
  console.log("===============================================");
  console.log("🛰️  Incoming request from:", req.headers.origin || "no-origin");
  console.log("✅ Allowed origins:", CLIENT_URLS);
  console.log("===============================================");
  next();
});

/**
 * ✅ CORS Configuration
 * Handles Amplify, LocalTunnel, and localhost origins
 * Supports credentials (cookies/sessions)
 */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow tools like Postman or curl

      // Allow fuzzy match for subdomains, Amplify previews, and trailing slashes
      const isAllowed = CLIENT_URLS.some((allowed) =>
        origin.startsWith(allowed.replace(/\/$/, ""))
      );

      if (isAllowed) {
        console.log("✅ CORS allowed for:", origin);
        return callback(null, true);
      }

      console.log("❌ CORS blocked for:", origin);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
  })
);

/**
 * 🧠 Explicit preflight handler
 * Ensures browsers get proper CORS headers for OPTIONS requests
 */
app.options("*", (req, res) => {
  const origin = req.headers.origin;
  const isAllowed = CLIENT_URLS.some((allowed) =>
    origin?.startsWith(allowed.replace(/\/$/, ""))
  );

  if (isAllowed && origin) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization,X-Requested-With"
    );
    console.log("✅ Preflight success for:", origin);
    return res.sendStatus(204);
  }

  console.log("❌ Preflight blocked for:", origin);
  return res.sendStatus(403);
});

/**
 * 🧩 Middleware Stack
 */
app.use(express.json());
app.use(cookieParser());

/**
 * 🛣️ Routes
 */
app.use("/", routes);

/**
 * 🚀 Server Startup
 */
app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database");

    await redisClient.connect();
    console.log("✅ Connected to Redis");

    console.log(`🚀 Server running on port ${PORT}`);
  } catch (err) {
    console.error("❌ Error starting server:", err);
  }
});
