import { Router } from "express";
import {
  handleGetVideoAnalytics,
  handleGetUserAnalytics,
  handleGetTrendingVideos,
  handleTrackVideoView,
  handleTrackVideoInteraction,
  handleInitializeVideoMetrics
} from "../controllers/analytics";
import { validateToken } from "../middleware";

const router = Router();

// Get video analytics (no authentication required)
router.get("/video/:videoId", handleGetVideoAnalytics);

// Get user analytics dashboard (requires authentication)
router.get("/user", validateToken, handleGetUserAnalytics);

// Get trending videos (public)
router.get("/trending", handleGetTrendingVideos);

// Track video view (public - works for anonymous users)
router.post("/track/view/:videoId", handleTrackVideoView);

// Track video interaction (public - works for anonymous users)
router.post("/track/interaction/:videoId", handleTrackVideoInteraction);

// Initialize video metrics (requires authentication)
router.post("/initialize", validateToken, handleInitializeVideoMetrics);

export default router;
