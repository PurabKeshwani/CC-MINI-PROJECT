import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Video } from "../types/video";

export default function Hero({ video }: { video: Video }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, [video.id]);

  return (
    <div className="relative w-full h-[56vh] md:h-[68vh] rounded-b-2xl overflow-hidden mb-10 shadow-big">
      <div className={`absolute inset-0 will-change-transform transition-transform duration-700 ease-out ${mounted ? "scale-100" : "scale-105"}`}>
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Subtle top fade for readability without dark theme */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/10 to-transparent" />

      {/* Glass content card */}
      <div className="absolute bottom-6 md:bottom-10 left-6 md:left-12 right-6 md:right-auto">
        <div className="max-w-3xl md:max-w-4xl backdrop-blur-md bg-white/70 border border-[#e5e7eb] rounded-2xl px-6 md:px-8 py-5 md:py-7 shadow-lg">
          <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight text-[#0f172a] mb-3">
            {video.title}
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed line-clamp-3 md:line-clamp-2 mb-5">
            {video.description || "Enjoy high‑quality streaming with smooth playback and crisp audio."}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link to={`/${video.id}`} className="btn btn-primary">
              ▶ Play
            </Link>
            <Link to={`/studio/${video.id}`} className="btn btn-secondary hidden sm:inline-flex">
              ℹ Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


