import { useRecoilState } from "recoil";
import { videosAtom } from "../atom/video";
import { useEffect, useMemo, useState } from "react";
import { getVideos } from "../lib/video";
import { useCookies } from "react-cookie";
import HeroCarousel from "../components/HeroCarousel";
import HorizontalRow from "../components/HorizontalRow";
 

export default function Home() {
  const [{ token }] = useCookies(["token"]);
  const [videos, setVideos] = useRecoilState(videosAtom);
  useEffect(() => {
    if (!videos.length) {
      getVideos().then((v) => setVideos(v));
    }
  }, [setVideos, videos.length]);
  useEffect(() => {
    getVideos().then((videos) => {
      setVideos(videos);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  const featuredList = useMemo(() => videos.slice(0, 6), [videos]);
  const firstRow = useMemo(() => videos.slice(0, 10), [videos]);
  const secondRow = useMemo(() => videos.slice(10, 20), [videos]);

  return (
    <div className="min-h-screen w-full pt-16 bg-white">
      <div className="px-4 md:px-8">
        {featuredList.length > 0 && <HeroCarousel videos={featuredList} />}
        
        {firstRow.length > 0 && (
          <HorizontalRow title="Popular on StreamFlix" videos={firstRow} />
        )}
        {secondRow.length > 0 && (
          <HorizontalRow title="Because you watched" videos={secondRow} />
        )}
      </div>
    </div>
  );
}
