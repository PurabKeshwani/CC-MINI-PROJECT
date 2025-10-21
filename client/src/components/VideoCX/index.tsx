import { Video as VideoType } from "../../types/video";
import VideoJS from "./VideoPlayer";

interface VideoJsOptions {
  autoplay: boolean;
  controls: boolean;
  responsive: boolean;
  fluid: boolean;
  sources: Array<{ src: string; type: string }>;
}

export default function Video({ video }: { video: VideoType }) {
  const videoJsOptions: VideoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: video.url,
        type: "application/x-mpegURL",
      },
    ],
  };

  return <VideoJS options={videoJsOptions} videoId={video.id} />;
}
