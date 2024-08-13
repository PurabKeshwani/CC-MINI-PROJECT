import { useEffect } from "react";
import { getVideos } from "../lib/video";
import { useRecoilState } from "recoil";
import { videosAtom } from "../atom/video";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import LoginAlert from "../components/LoginAlert";

export default function StudioCx() {
  const [{ token }] = useCookies(["token"]);
  return token ? <Studio /> : <LoginAlert />;
}

function Studio() {
  const [videos, setVideos] = useRecoilState(videosAtom);
  useEffect(() => {
    if (videos.length) return;
    getVideos().then((videos) => {
      setVideos(videos);
    });
  }, [setVideos, videos.length]);
  return (
    <div className="p-10 min-w-[1000px]">
      <h1 className="text-4xl font-extrabold">Your videos</h1>
      <div className="flex space-x-16 w-full p-5 py-6">
        <div className="w-12 min-w-12">Sr. No.</div>
        <div className="w-52 min-w-52">Title</div>
        <div className="w-52 min-w-52">Description</div>
        <div className="w-16 min-w-16">Visibility</div>
        <div className="w-10 min-w-10">Views</div>
        <div className="w-10 min-w-10">Likes</div>
        <div className="w-10 min-w-10">Dislikes</div>
        <div className="w-20 min-w-28">Uploaded at</div>
        <div className="w-20 min-w-28">Updated at</div>
      </div>
      {videos.map((video, index) => {
        return (
          <Link
            to={`/studio/${video.id}`}
            key={index}
            className={`flex overflow-x-auto space-x-16 w-full p-5 py-9 border-b-2 border-gray-500 hover:bg-gray-700 ${
              index === 0 ? "border-t-2" : ""
            }`}
          >
            <p className="w-12 whitespace-nowrap overflow-hidden">
              {index + 1}
            </p>
            <p
              className="w-52 whitespace-nowrap overflow-hidden"
              title={video.title ? video.title : undefined}
            >
              {video.title
                ? video.title
                : "Enter your description to show it here"}
            </p>
            <p
              className="w-52 whitespace-nowrap overflow-hidden"
              title={video.description ? video.description : undefined}
            >
              {video.description
                ? video.description
                : "Enter your description to show it here"}
            </p>
            <p className="w-16 whitespace-nowrap overflow-hidden">
              {video.visibility}
            </p>
            <p className="w-10 whitespace-nowrap overflow-hidden">
              {video.views}
            </p>
            <p className="w-10 whitespace-nowrap overflow-hidden">
              {video.likes}
            </p>
            <p className="w-10 whitespace-nowrap overflow-hidden">
              {video.dislikes}
            </p>
            <p
              className="w-28 whitespace-nowrap overflow-hidden"
              title={video.uploadedAt.toLocaleString()}
            >
              {video.uploadedAt.toLocaleDateString()}
            </p>
            <p
              className="w-28 whitespace-nowrap overflow-hidden"
              title={video.updatedAt.toLocaleString()}
            >
              {video.updatedAt.toLocaleDateString()}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
