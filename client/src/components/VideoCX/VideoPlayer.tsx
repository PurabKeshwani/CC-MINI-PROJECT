/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

interface VideoPlayerProps {
  options: any;
}

const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any | null>(null);
  const { options } = props;

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");

      if (videoRef.current) {
        videoRef.current.appendChild(videoElement);
        const player = videojs(videoElement, options, () => {
          videojs.log("player is ready");
        });

        playerRef.current = player;
      }
    } else {
      const player = playerRef.current;

      if (player) {
        player.autoplay(options.autoplay || false);
        player.src(options.sources || []);
      }
    }
  }, [options]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player className="min-w-full min-h-full">
      <div ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;
