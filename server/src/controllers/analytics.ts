import { Request, Response } from "express";
import { 
  getVideoMetrics, 
  getUserAnalytics, 
  getTrendingVideos,
  trackVideoView,
  trackVideoInteraction,
  initializeVideoMetrics
} from "../lib/analyticsService";
import { validateToken } from "../middleware";

// Get video analytics
export async function handleGetVideoAnalytics(req: Request, res: Response) {
  const { videoId } = req.params;
  const { user } = res.locals; // This might be undefined if no auth

  console.log(`📊 Getting analytics for video ${videoId}, user:`, user?.id || 'anonymous');

  // Add timeout to prevent hanging
  const timeoutId = setTimeout(() => {
    if (!res.headersSent) {
      console.log(`⏰ Timeout for video analytics ${videoId}`);
      res.status(408).json({ message: "Request timeout" });
    }
  }, 8000); // 8 second timeout

  try {
    const metrics = await getVideoMetrics(videoId);
    
    if (!metrics) {
      console.log(`❌ No metrics found for video ${videoId}`);
      clearTimeout(timeoutId);
      return res.status(404).json({ message: "Video metrics not found" });
    }

    console.log(`📊 Found metrics for video ${videoId}:`, {
      userId: metrics.userId,
      requestingUser: user?.id || 'anonymous',
      views: metrics.views
    });

    // If user is authenticated, check if they own the video
    // If not authenticated, return the metrics anyway (public access)
    if (user && metrics.userId !== user.id) {
      console.log(`❌ Access denied for video ${videoId}: user ${user.id} does not own video (owned by ${metrics.userId})`);
      clearTimeout(timeoutId);
      return res.status(403).json({ message: "Access denied" });
    }

    console.log(`✅ Returning analytics for video ${videoId}`);
    clearTimeout(timeoutId);
    res.status(200).json({
      videoId: metrics.videoId,
      title: metrics.title,
      views: metrics.views,
      likes: metrics.likes,
      dislikes: metrics.dislikes,
      comments: metrics.comments,
      shares: metrics.shares,
      watchTime: metrics.watchTime,
      averageWatchTime: metrics.views > 0 ? metrics.watchTime / metrics.views : 0,
      engagementRate: metrics.views > 0 ? ((metrics.likes + metrics.comments) / metrics.views) * 100 : 0,
      createdAt: metrics.createdAt,
      lastUpdated: metrics.lastUpdated
    });
  } catch (error) {
    console.error("Error getting video analytics:", error);
    clearTimeout(timeoutId);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get user analytics dashboard
export async function handleGetUserAnalytics(req: Request, res: Response) {
  const { user } = res.locals;

  try {
    const analytics = await getUserAnalytics(user.id);
    
    if (!analytics) {
      return res.status(404).json({ message: "User analytics not found" });
    }

    res.status(200).json({
      userId: analytics.userId,
      totalVideos: analytics.totalVideos,
      totalViews: analytics.totalViews,
      totalLikes: analytics.totalLikes,
      totalComments: analytics.totalComments,
      averageWatchTime: analytics.averageWatchTime,
      lastActive: analytics.lastActive,
      // Calculate additional metrics
      averageViewsPerVideo: analytics.totalVideos > 0 ? analytics.totalViews / analytics.totalVideos : 0,
      engagementScore: analytics.totalViews > 0 ? (analytics.totalLikes + analytics.totalComments) / analytics.totalViews : 0
    });
  } catch (error) {
    console.error("Error getting user analytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get trending videos
export async function handleGetTrendingVideos(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const trendingVideos = await getTrendingVideos(limit);

    res.status(200).json({
      trendingVideos,
      count: trendingVideos.length
    });
  } catch (error) {
    console.error("Error getting trending videos:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Track video view
export async function handleTrackVideoView(req: Request, res: Response) {
  const { videoId } = req.params;
  const { watchTime } = req.body;
  
  // Get user from token if available, otherwise use anonymous
  let userId = "anonymous";
  if (res.locals.user) {
    userId = res.locals.user.id;
  }

  try {
    const result = await trackVideoView(videoId, userId, watchTime || 0);
    
    if (result.success) {
      res.status(200).json({ message: "View tracked successfully" });
    } else {
      res.status(500).json({ message: "Failed to track view", error: result.error });
    }
  } catch (error) {
    console.error("Error tracking video view:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Track video interaction (like, dislike, comment)
export async function handleTrackVideoInteraction(req: Request, res: Response) {
  const { videoId } = req.params;
  const { type } = req.body;
  
  // Get user from token if available, otherwise use anonymous
  let userId = "anonymous";
  if (res.locals.user) {
    userId = res.locals.user.id;
  }

  console.log(`📊 Tracking ${type} for video ${videoId} by user ${userId}`);

  if (!['like', 'dislike', 'comment'].includes(type)) {
    return res.status(400).json({ message: "Invalid interaction type" });
  }

  try {
    const result = await trackVideoInteraction(videoId, userId, type);
    
    if (result.success) {
      res.status(200).json({ message: `${type} tracked successfully` });
    } else {
      res.status(500).json({ message: `Failed to track ${type}`, error: result.error });
    }
  } catch (error) {
    console.error(`Error tracking ${type}:`, error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Initialize video metrics (called when video is created)
export async function handleInitializeVideoMetrics(req: Request, res: Response) {
  const { videoId, title } = req.body;
  const { user } = res.locals;

  try {
    const result = await initializeVideoMetrics(videoId, user.id, title);
    
    if (result.success) {
      res.status(200).json({ message: "Video metrics initialized" });
    } else {
      res.status(500).json({ message: "Failed to initialize metrics", error: result.error });
    }
  } catch (error) {
    console.error("Error initializing video metrics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
