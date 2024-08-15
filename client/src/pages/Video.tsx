import { Link, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { videosAtom } from "../atom/video";
import { useEffect, useMemo } from "react";
import { getVideo } from "../lib/video";
import Description from "../components/VideoCX/Description";
import VideoPlayer from "../components/VideoCX";
import Comments from "../components/VideoCX/Comments";

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
      <div className="w-full bg-black flex items-center justify-center">
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
