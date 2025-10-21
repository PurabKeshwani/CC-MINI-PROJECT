/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { trackVideoView } from "../../lib/analytics";

interface VideoPlayerProps {
  options: any;
  videoId?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any | null>(null);
  const { options, videoId } = props;

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");

      if (videoRef.current) {
        videoRef.current.appendChild(videoElement);
        const player = videojs(videoElement, options, () => {
          // Track video view when player is ready
          if (videoId) {
            let hasTrackedView = false;
            let lastTrackedTime = 0;
            let watchTimeAccumulator = 0;
            
            player.on('play', () => {
              // Track view only once when video starts playing
              if (!hasTrackedView) {
                console.log(`📊 Tracking view for video: ${videoId}`);
                trackVideoView(videoId, 0);
                hasTrackedView = true;
              }
            });
            
            player.on('timeupdate', () => {
              const currentTime = player.currentTime();
              
              // Track watch time every 10 seconds
              if (currentTime > 0 && currentTime - lastTrackedTime >= 10) {
                const timeWatched = currentTime - lastTrackedTime;
                watchTimeAccumulator += timeWatched;
                
                console.log(`📊 Tracking watch time for video: ${videoId} - ${timeWatched}s (total: ${watchTimeAccumulator}s)`);
                trackVideoView(videoId, watchTimeAccumulator);
                
                lastTrackedTime = currentTime;
              }
            });
            
            // Track final watch time when video ends
            player.on('ended', () => {
              const finalTime = player.currentTime();
              if (finalTime > lastTrackedTime) {
                const finalWatchTime = watchTimeAccumulator + (finalTime - lastTrackedTime);
                console.log(`📊 Final watch time for video: ${videoId} - ${finalWatchTime}s`);
                trackVideoView(videoId, finalWatchTime);
              }
            });
          }
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
