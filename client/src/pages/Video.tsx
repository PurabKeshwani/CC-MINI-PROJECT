import { Link, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { videosAtom } from "../atom/video";
import { useEffect, useMemo } from "react";
import { getVideo } from "../lib/video";
import { trackVideoInteraction } from "../lib/analytics";
import Description from "../components/VideoCX/Description";
import VideoPlayer from "../components/VideoCX";
import Comments from "../components/VideoCX/Comments";
import toast from "react-hot-toast";

export default function VideoPage() {
  const { id } = useParams();
  const [videos, setVideos] = useRecoilState(videosAtom);
  const video = useMemo(
    () => videos.find((video) => video.id === id),
    [videos, id]
  );

  useEffect(() => {
    if (videos.length || !id) return;
    getVideo(id).then((v) => {
      if (v) setVideos((prev) => [...prev, v]);
    });
  }, [id, setVideos, video, videos.length]);

  return video ? (
    <div className="w-full h-full">
      <div className="w-full bg-gray-100 flex items-center justify-center">
        <div className="w-[60vw]">
          <VideoPlayer video={video} />
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between">
          <h1 className="text-3xl font-extrabold">{video.title}</h1>
          {video.isAuthor && (
            <Link
              to={`/studio/${video.id}`}
              className="text-xl flex items-center bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg"
            >
              Edit
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                viewBox="0 0 24 24"
                className="w-4 h-4 ml-2"
              >
                <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
            </Link>
          )}
        </div>
        
        {/* Like/Dislike Buttons */}
        <div className="flex items-center space-x-4 mt-4">
          <button
            onClick={() => {
              trackVideoInteraction(video.id, 'like');
              toast.success('👍 Liked!');
            }}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            <span>Like</span>
          </button>
          
          <button
            onClick={() => {
              trackVideoInteraction(video.id, 'dislike');
              toast.success('👎 Disliked!');
            }}
            className="flex items-center space-x-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.834a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
            </svg>
            <span>Dislike</span>
          </button>
        </div>
        <Description description={video.description} className="text-xl mt-5" />
        <Comments video={video} />
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center w-full h-full">
      Video not found
    </div>
  );
}
