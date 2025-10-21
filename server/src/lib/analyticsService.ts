import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
} from "./constants";

const dynamoClient = new DynamoDBClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

export interface VideoMetrics {
  videoId: string;
  userId: string;
  title: string;
  views: number;
  likes: number;
  dislikes: number;
  comments: number;
  shares: number;
  watchTime: number; // in seconds
  createdAt: string;
  lastUpdated: string;
}

export interface UserEngagement {
  userId: string;
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  averageWatchTime: number;
  lastActive: string;
}

export interface TrendingVideo {
  videoId: string;
  title: string;
  userId: string;
  views: number;
  likes: number;
  engagementScore: number;
  trendingRank: number;
}

// Track video view
export async function trackVideoView(videoId: string, userId: string, watchTime: number = 0) {
  try {
    console.log(`📊 Tracking view for video ${videoId} by user ${userId}, watchTime: ${watchTime}`);
    const timestamp = new Date().toISOString();
    
    // Only increment view count if this is the first view (watchTime = 0)
    let updateExpression = "SET lastUpdated = :timestamp";
    let expressionValues: any = { ":timestamp": timestamp };
    let expressionNames: any = {};

    if (watchTime === 0) {
      // This is a new view - increment view count
      updateExpression += " ADD #views :increment";
      expressionValues[":increment"] = 1;
      expressionNames["#views"] = "views";
    }
    
    // Always add to watch time
    if (watchTime > 0) {
      updateExpression += " ADD #watchTime :watchTime";
      expressionValues[":watchTime"] = watchTime;
      expressionNames["#watchTime"] = "watchTime";
    }

    // Update video metrics
    await docClient.send(new UpdateCommand({
      TableName: "VideoMetrics",
      Key: { videoId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionNames,
      ExpressionAttributeValues: expressionValues,
      ReturnValues: "UPDATED_NEW"
    }));

    // Track user engagement (only for authenticated users)
    if (userId !== "anonymous") {
      let userUpdateExpression = "SET lastViewed = :timestamp";
      let userExpressionValues: any = { ":timestamp": timestamp };
      let userExpressionNames: any = {};

      if (watchTime === 0) {
        // This is a new view - increment view count
        userUpdateExpression += " ADD viewCount :increment";
        userExpressionValues[":increment"] = 1;
      }
      
      // Always add to watch time
      if (watchTime > 0) {
        userUpdateExpression += " ADD totalWatchTime :watchTime";
        userExpressionValues[":watchTime"] = watchTime;
      }

      await docClient.send(new UpdateCommand({
        TableName: "UserEngagement",
        Key: { userId, videoId },
        UpdateExpression: userUpdateExpression,
        ExpressionAttributeNames: userExpressionNames,
        ExpressionAttributeValues: userExpressionValues,
        ReturnValues: "UPDATED_NEW"
      }));
    }

    console.log(`📊 Tracked view for video ${videoId} by user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error("Error tracking video view:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Track video like/dislike
export async function trackVideoInteraction(videoId: string, userId: string, type: 'like' | 'dislike' | 'comment') {
  try {
    console.log(`📊 Tracking ${type} for video ${videoId} by user ${userId}`);
    const timestamp = new Date().toISOString();
    
    let updateExpression = "SET lastUpdated = :timestamp";
    let expressionValues: any = { ":timestamp": timestamp };
    let expressionNames: any = {};

    if (type === 'like') {
      updateExpression += " ADD #likes :increment";
      expressionValues[":increment"] = 1;
      expressionNames["#likes"] = "likes";
    } else if (type === 'dislike') {
      updateExpression += " ADD #dislikes :increment";
      expressionValues[":increment"] = 1;
      expressionNames["#dislikes"] = "dislikes";
    } else if (type === 'comment') {
      updateExpression += " ADD #comments :increment";
      expressionValues[":increment"] = 1;
      expressionNames["#comments"] = "comments";
    }

    console.log(`📊 Update expression: ${updateExpression}`);
    console.log(`📊 Expression values:`, expressionValues);
    console.log(`📊 Expression names:`, expressionNames);

    const result = await docClient.send(new UpdateCommand({
      TableName: "VideoMetrics",
      Key: { videoId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionNames,
      ExpressionAttributeValues: expressionValues,
      ReturnValues: "UPDATED_NEW"
    }));

    console.log(`📊 Successfully tracked ${type} for video ${videoId}. Result:`, result.Attributes);
    return { success: true };
  } catch (error) {
    console.error(`❌ Error tracking ${type} for video ${videoId}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Get video metrics
export async function getVideoMetrics(videoId: string): Promise<VideoMetrics | null> {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: "VideoMetrics",
      Key: { videoId }
    }));

    return result.Item as VideoMetrics || null;
  } catch (error) {
    console.error("Error getting video metrics:", error);
    return null;
  }
}

// Get user analytics
export async function getUserAnalytics(userId: string): Promise<UserEngagement | null> {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: "UserEngagement",
      Key: { userId }
    }));

    return result.Item as UserEngagement || null;
  } catch (error) {
    console.error("Error getting user analytics:", error);
    return null;
  }
}

// Get trending videos
export async function getTrendingVideos(limit: number = 10): Promise<TrendingVideo[]> {
  try {
    // This would typically use a GSI (Global Secondary Index) for sorting
    // For now, we'll get all videos and sort them
    const result = await docClient.send(new ScanCommand({
      TableName: "VideoMetrics",
      // Note: In production, you'd use a GSI for efficient sorting
    }));

    const videos = (result.Items || []) as VideoMetrics[];
    
    // Calculate engagement score and sort
    const trendingVideos = videos
      .map(video => ({
        videoId: video.videoId,
        title: video.title,
        userId: video.userId,
        views: video.views,
        likes: video.likes,
        engagementScore: (video.likes + video.comments * 2) / Math.max(video.views, 1),
        trendingRank: 0
      }))
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, limit)
      .map((video, index) => ({
        ...video,
        trendingRank: index + 1
      }));

    return trendingVideos;
  } catch (error) {
    console.error("Error getting trending videos:", error);
    return [];
  }
}

// Initialize video metrics when video is created
export async function initializeVideoMetrics(videoId: string, userId: string, title: string) {
  try {
    const timestamp = new Date().toISOString();
    
    const videoMetrics: VideoMetrics = {
      videoId,
      userId,
      title,
      views: 0,
      likes: 0,
      dislikes: 0,
      comments: 0,
      shares: 0,
      watchTime: 0,
      createdAt: timestamp,
      lastUpdated: timestamp
    };

    await docClient.send(new PutCommand({
      TableName: "VideoMetrics",
      Item: videoMetrics
    }));

    // Initialize user engagement if not exists
    await docClient.send(new PutCommand({
      TableName: "UserEngagement",
      Item: {
        userId,
        totalVideos: 1,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        averageWatchTime: 0,
        lastActive: timestamp
      },
      ConditionExpression: "attribute_not_exists(userId)"
    }));

    console.log(`📊 Initialized metrics for video ${videoId}`);
    return { success: true };
  } catch (error) {
    console.error("Error initializing video metrics:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
