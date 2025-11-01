import { useEffect, useMemo, useState } from "react";
import { Video } from "../types/video";
import Hero from "./Hero";

export default function HeroCarousel({ videos, intervalMs = 5000 }: { videos: Video[]; intervalMs?: number }) {
  const items = useMemo(() => videos.slice(0, Math.min(6, videos.length)), [videos]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [items.length, intervalMs]);

  if (items.length === 0) return null;

  const go = (dir: number) => setIndex((i) => (i + dir + items.length) % items.length);

  return (
    <div className="relative">
      <Hero video={items[index]} />
      {items.length > 1 && (
        <>
          <button
            aria-label="Previous"
            onClick={() => go(-1)}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 btn btn-secondary btn-sm opacity-80 hover:opacity-100"
          >
            ←
          </button>
          <button
            aria-label="Next"
            onClick={() => go(1)}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 btn btn-secondary btn-sm opacity-80 hover:opacity-100"
          >
            →
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-[#E50914]" : "w-3 bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}


