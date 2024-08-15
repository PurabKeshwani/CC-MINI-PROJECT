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
    <div className="h-full w-full p-5 flex flex-wrap">
      {videos.length > 0 ? (
        videos.map((video, index) => {
          return <Video key={index} video={video} />;
        })
      ) : (
        <div className="text-2xl font-bold flex justify-center items-center w-full h-full">No videos found</div>
      )}
    </div>
  );
}
