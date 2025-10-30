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
            className="group relative min-w-[240px] md:min-w-[280px] h-[150px] md:h-[180px] rounded-2xl overflow-hidden snap-start bg-white border border-[#e5e7eb] shadow-sm transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50"
          >
            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-transparent group-hover:bg-[#2563EB]/10 transition-colors" />

            {/* Top-left chips */}
            <div className="absolute top-2 left-2 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/80 border border-[#e5e7eb] text-[#0f172a] backdrop-blur">
                HD
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/65 border border-[#e5e7eb] text-[#0f172a] backdrop-blur">
                {Math.max(1, Math.min(59, (video.title.length % 59))) }:00
              </span>
            </div>

            {/* Bottom glass caption with avatar */}
            <div className="absolute bottom-2 left-2 right-2 rounded-xl backdrop-blur-md bg-white/80 border border-[#e5e7eb] px-3 py-2 shadow-sm">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                  {(video.title?.[0] || 'V').toUpperCase()}
                </div>
                <p className="text-[13px] md:text-sm font-semibold text-[#0f172a] truncate">
                  {video.title}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


