import axios from "axios";
import { BASE_URL } from "./constants";

export interface VideoMetrics {
  videoId: string;
  userId: string;
  title: string;
  views: number;
  likes: number;
  dislikes: number;
  comments: number;
  watchTime: number;
  createdAt: number;
  updatedAt: number;
}

export interface UserEngagement {
  userId: string;
  videoId: string;
  lastViewed: number;
  viewCount: number;
  likeCount?: number;
  dislikeCount?: number;
  commentCount?: number;
  lastInteraction?: number;
}

export interface TrendingVideo {
  videoId: string;
  userId: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  timestamp: number;
}

// Get video analytics
export async function getVideoAnalytics(videoId: string): Promise<VideoMetrics | null> {
  try {
    console.log(`🔍 Fetching analytics for video: ${videoId}`);
    const res = await axios.get(`${BASE_URL}/api/analytics/video/${videoId}`, {
      withCredentials: true,
      timeout: 5000 // 5 second timeout
    });
    console.log(`✅ Analytics response for ${videoId}:`, res.data);
    return res.data;
  } catch (error) {
    console.error(`❌ Error fetching video analytics for ${videoId}:`, error);
    return null;
  }
}

// Get user analytics
export async function getUserAnalytics(): Promise<UserEngagement[] | null> {
  try {
    const res = await axios.get(`${BASE_URL}/api/analytics/user`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    return null;
  }
}

// Get trending videos
export async function getTrendingVideos(): Promise<TrendingVideo[] | null> {
  try {
    const res = await axios.get(`${BASE_URL}/api/analytics/trending`, {
      withCredentials: true,
    });
    return res.data.trendingVideos || [];
  } catch (error) {
    console.error("Error fetching trending videos:", error);
    return null;
  }
}

// Track video view
export async function trackVideoView(videoId: string, watchTime: number): Promise<boolean> {
  try {
    console.log(`🔍 Tracking view for video: ${videoId}, watchTime: ${watchTime}`);
    const res = await axios.post(`${BASE_URL}/api/analytics/track/view/${videoId}`, 
      { watchTime }, 
      { 
        withCredentials: true,
        timeout: 5000
      }
    );
    console.log(`✅ Successfully tracked view for video ${videoId}:`, res.data);
    return true;
  } catch (error) {
    console.error(`❌ Error tracking view for video ${videoId}:`, error);
    return false;
  }
}

// Track video interaction (like, dislike, comment)
export async function trackVideoInteraction(
  videoId: string, 
  interactionType: 'like' | 'dislike' | 'comment'
): Promise<boolean> {
  try {
    console.log(`🔍 Tracking ${interactionType} for video: ${videoId}`);
    const res = await axios.post(`${BASE_URL}/api/analytics/track/interaction/${videoId}`, 
      { type: interactionType }, 
      { 
        withCredentials: true,
        timeout: 5000
      }
    );
    console.log(`✅ Successfully tracked ${interactionType} for video ${videoId}:`, res.data);
    return true;
  } catch (error) {
    console.error(`❌ Error tracking ${interactionType} for video ${videoId}:`, error);
    return false;
  }
}
