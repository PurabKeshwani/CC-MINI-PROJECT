import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { videosAtom } from "../atom/video";
import { useEffect, useMemo } from "react";
import { getVideo } from "../lib/video";
import Description from "../components/VideoCX/Description";
import VideoPlayer from "../components/VideoCX";

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
        <h1 className="text-3xl font-extrabold">{video.title}</h1>
        <Description description={video.description} className="text-xl mt-5" />
      </div>
    </div>
  ) : (
    <div>Video not found</div>
  );
}
