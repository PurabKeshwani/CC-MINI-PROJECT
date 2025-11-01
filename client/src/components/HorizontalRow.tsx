import { useRef } from "react";
import { Link } from "react-router-dom";
import { Video } from "../types/video";

export default function HorizontalRow({ title, videos }: { title: string; videos: Video[] }) {
  const scroller = useRef<HTMLDivElement | null>(null);
  const scrollBy = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.9), behavior: "smooth" });
  };
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-xl md:text-2xl font-extrabold">{title}</h2>
        <div className="hidden md:flex gap-2">
          <button className="btn btn-secondary btn-sm" onClick={() => scrollBy(-1)}>
            ←
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => scrollBy(1)}>
            →
          </button>
        </div>
      </div>
      <div
        ref={scroller}
        className="relative flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory px-1"
      >
        {videos.map((video) => (
          <Link
            key={video.id}
            to={`/${video.id}`}
            className="group relative min-w-[240px] md:min-w-[280px] h-[140px] md:h-[160px] rounded-xl overflow-hidden snap-start"
          >
            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-sm md:text-base font-semibold truncate">{video.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


