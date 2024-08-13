import VideoJS from "../components/VideoPlayer";

interface VideoJsOptions {
  autoplay: boolean;
  controls: boolean;
  responsive: boolean;
  fluid: boolean;
  sources: Array<{ src: string; type: string }>;
}

export default function Video() {
  const videoJsOptions: VideoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: "https://drfghsdgfsdfgsdfgsdgfsdfgsdgf.s3.amazonaws.com/5cce0552-e4dd-4649-bff5-dbafe272db74/index.m3u8",
        type: "application/x-mpegURL",
      },
    ],
  };

  return <VideoJS options={videoJsOptions} />;
}
