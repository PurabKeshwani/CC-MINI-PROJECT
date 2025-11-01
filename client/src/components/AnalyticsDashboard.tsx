import { useState, useEffect } from "react";
import { getVideoAnalytics, getUserAnalytics, getTrendingVideos, VideoMetrics, UserEngagement, TrendingVideo } from "../lib/analytics";
import { getVideos } from "../lib/video";
import { useCookies } from "react-cookie";

interface AnalyticsDashboardProps {
  userId?: string;
}

export default function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const [{ token }] = useCookies(["token"]);
  const [videoMetrics, setVideoMetrics] = useState<VideoMetrics[]>([]);
  const [userEngagement, setUserEngagement] = useState<UserEngagement[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<TrendingVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Analytics loading timeout - setting loading to false");
        setLoading(false);
      }
    }, 10000); // 10 second timeout

    loadAnalyticsData();

    return () => clearTimeout(timeoutId);
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Load user's videos and their analytics
      const videos = await getVideos();
      console.log("Loaded videos:", videos);
      
      if (videos && videos.length > 0) {
        // Only get analytics for videos owned by the current user
        const userVideos = videos.filter(video => video.isAuthor);
        console.log(`Found ${userVideos.length} user-owned videos out of ${videos.length} total videos`);
        
        if (userVideos.length > 0) {
          console.log("Getting analytics for user videos:", userVideos.map(v => v.id));
          
          // Load analytics for all videos in parallel with timeout
          const analyticsPromises = userVideos.map(async (video) => {
            console.log(`Getting analytics for video: ${video.id}`);
            try {
              const result = await Promise.race([
                getVideoAnalytics(video.id),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
              ]);
              console.log(`Analytics result for ${video.id}:`, result);
              return result;
            } catch (error) {
              console.error(`Error getting analytics for ${video.id}:`, error);
              return null;
            }
          });
          
          const metrics = await Promise.all(analyticsPromises);
          const validMetrics = metrics.filter(metric => metric !== null) as VideoMetrics[];
          console.log("Loaded video metrics:", validMetrics);
          setVideoMetrics(validMetrics);
        } else {
          console.log("No user-owned videos found");
          setVideoMetrics([]);
        }
      } else {
        console.log("No videos found");
        setVideoMetrics([]);
      }

      // Load trending videos and user engagement in parallel (non-blocking)
      Promise.all([
        getUserAnalytics().catch(err => {
          console.log("User engagement not available:", err);
          return [];
        }),
        getTrendingVideos().catch(err => {
          console.log("Trending videos not available:", err);
          return [];
        })
      ]).then(([engagement, trending]) => {
        setUserEngagement(engagement || []);
        setTrendingVideos(trending || []);
      });

    } catch (error) {
      console.error("Error loading analytics data:", error);
      // Set empty arrays on error to prevent infinite loading
      setVideoMetrics([]);
      setUserEngagement([]);
      setTrendingVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const totalViews = videoMetrics.reduce((sum, video) => sum + video.views, 0);
  const totalLikes = videoMetrics.reduce((sum, video) => sum + video.likes, 0);
  const totalComments = videoMetrics.reduce((sum, video) => sum + video.comments, 0);
  const totalWatchTime = videoMetrics.reduce((sum, video) => sum + video.watchTime, 0);

  // Check if user is authenticated
  if (!token) {
    return (
      <div className="min-h-screen bg-[#141414] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-4xl font-extrabold text-[#E50914] mb-4">Authentication Required</h1>
            <p className="text-xl text-gray-300 mb-8">
              Please log in to view your analytics dashboard
            </p>
            <a href="/login" className="btn btn-primary btn-lg">
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-[#E50914] mb-2">📊 Analytics Dashboard</h1>
            <p className="text-gray-300">Track your video performance and audience engagement</p>
          </div>
          <button
            onClick={() => {
              setLoading(true);
              loadAnalyticsData();
            }}
            disabled={loading}
            className="btn btn-primary btn-lg"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
              </>
            )}
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card card-dark shadow-xl">
            <div className="card-body">
              <div className="flex items-center">
                <div className="text-3xl mr-3">👁️</div>
                <div>
                  <h3 className="text-lg font-semibold">Total Views</h3>
                  <p className="text-2xl font-bold text-[#E50914]">{formatNumber(totalViews)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card card-dark shadow-xl">
            <div className="card-body">
              <div className="flex items-center">
                <div className="text-3xl mr-3">👍</div>
                <div>
                  <h3 className="text-lg font-semibold">Total Likes</h3>
                  <p className="text-2xl font-bold text-[#E50914]">{formatNumber(totalLikes)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card card-dark shadow-xl">
            <div className="card-body">
              <div className="flex items-center">
                <div className="text-3xl mr-3">💬</div>
                <div>
                  <h3 className="text-lg font-semibold">Total Comments</h3>
                  <p className="text-2xl font-bold text-[#E50914]">{formatNumber(totalComments)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card card-dark shadow-xl">
            <div className="card-body">
              <div className="flex items-center">
                <div className="text-3xl mr-3">⏱️</div>
                <div>
                  <h3 className="text-lg font-semibold">Watch Time</h3>
                  <p className="text-2xl font-bold text-[#E50914]">{formatDuration(totalWatchTime)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Your Videos Analytics */}
          <div className="card card-dark shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">📹 Your Videos Performance</h2>
              {videoMetrics.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📹</div>
                  <p className="text-gray-400">No videos uploaded yet</p>
                  <p className="text-sm text-gray-500">Upload your first video to see analytics!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {videoMetrics.map((video) => (
                    <div 
                      key={video.videoId} 
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedVideo === video.videoId 
                          ? 'border-[#E50914] bg-[#E50914]/10' 
                          : 'border-[#2b2b2b] hover:border-[#E50914]/50'
                      }`}
                      onClick={() => setSelectedVideo(selectedVideo === video.videoId ? null : video.videoId)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center">
                              <span className="mr-2">👁️</span>
                              <span>{formatNumber(video.views)} views</span>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-2">👍</span>
                              <span>{formatNumber(video.likes)} likes</span>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-2">👎</span>
                              <span>{formatNumber(video.dislikes)} dislikes</span>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-2">💬</span>
                              <span>{formatNumber(video.comments)} comments</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-400">
                          <p>Created: {formatDate(video.createdAt)}</p>
                          <p>Updated: {formatDate(video.updatedAt)}</p>
                        </div>
                      </div>
                      
                      {selectedVideo === video.videoId && (
                        <div className="mt-4 pt-4 border-t border-[#2b2b2b]">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Engagement Rate</h4>
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span>Like Rate:</span>
                                  <span>{video.views > 0 ? ((video.likes / video.views) * 100).toFixed(1) : 0}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Comment Rate:</span>
                                  <span>{video.views > 0 ? ((video.comments / video.views) * 100).toFixed(1) : 0}%</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Watch Time</h4>
                              <p className="text-lg font-semibold text-[#E50914]">
                                {formatDuration(video.watchTime)}
                              </p>
                              <p className="text-sm text-gray-400">
                                Avg: {video.views > 0 ? formatDuration(video.watchTime / video.views) : '0s'} per view
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Trending Videos */}
          <div className="card card-dark shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">🔥 Trending Videos</h2>
              {trendingVideos.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📈</div>
                  <p className="text-gray-400">No trending data available</p>
                  <p className="text-sm text-gray-500">Check back later for trending videos!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {trendingVideos.map((video, index) => (
                    <div key={video.videoId} className="p-4 rounded-lg border border-[#2b2b2b]">
                      <div className="flex items-center mb-2">
                        <div className="text-2xl font-bold text-[#E50914] mr-3">#{index + 1}</div>
                        <h3 className="font-semibold text-lg">{video.title}</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center">
                          <span className="mr-2">👁️</span>
                          <span>{formatNumber(video.views)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">👍</span>
                          <span>{formatNumber(video.likes)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">💬</span>
                          <span>{formatNumber(video.comments)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Engagement */}
        {userEngagement.length > 0 && (
          <div className="card bg-base-100 shadow-xl mt-8">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">👤 Your Engagement Activity</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Video ID</th>
                      <th>Views</th>
                      <th>Likes</th>
                      <th>Comments</th>
                      <th>Last Viewed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userEngagement.map((engagement) => (
                      <tr key={`${engagement.userId}-${engagement.videoId}`}>
                        <td className="font-mono text-sm">{engagement.videoId.slice(0, 8)}...</td>
                        <td>{engagement.viewCount || 0}</td>
                        <td>{engagement.likeCount || 0}</td>
                        <td>{engagement.commentCount || 0}</td>
                        <td>{formatDate(engagement.lastViewed)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button 
            className="btn btn-primary btn-lg"
            onClick={loadAnalyticsData}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Loading...
              </>
            ) : (
              <>
                🔄 Refresh Analytics
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
