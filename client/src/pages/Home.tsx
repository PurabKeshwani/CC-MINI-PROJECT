import { useRecoilState } from "recoil";
import { videosAtom } from "../atom/video";
import Video from "../components/Video";
import { useEffect } from "react";
import { getVideos } from "../lib/video";

export default function Home() {
  const [videos, setVideos] = useRecoilState(videosAtom);
  useEffect(() => {
    if (videos.length) return;
    getVideos().then((videos) => {
      setVideos(videos);
    });
  }, [setVideos, videos.length]);
  return (
    <div className="h-full w-full p-5 flex space-x-5 space-y-0 flex-wrap">
      {videos.map((video, index) => {
        return <Video key={index} video={video} />;
      })}
    </div>
  );
}
