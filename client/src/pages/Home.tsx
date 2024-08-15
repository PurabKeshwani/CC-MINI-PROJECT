import { useRecoilState } from "recoil";
import { videosAtom } from "../atom/video";
import Video from "../components/Video";
import { useEffect } from "react";
import { getVideos } from "../lib/video";
import { useCookies } from "react-cookie";

export default function Home() {
  const [{ token }] = useCookies(["token"]);
  const [videos, setVideos] = useRecoilState(videosAtom);
  useEffect(() => {
    if (videos.length) return;
    getVideos().then((videos) => {
      setVideos(videos);
    });
  }, [setVideos, videos.length]);
  useEffect(() => {
    getVideos().then((videos) => {
      setVideos(videos);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <div className="h-full w-full p-5 flex space-x-5 space-y-0 flex-wrap">
      {videos.map((video, index) => {
        return <Video key={index} video={video} />;
      })}
    </div>
  );
}
