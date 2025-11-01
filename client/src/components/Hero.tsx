import { Link } from "react-router-dom";
import { Video } from "../types/video";

export default function Hero({ video }: { video: Video }) {
  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] rounded-b-2xl overflow-hidden mb-10 shadow-big">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3 drop-shadow-lg">
          {video.title}
        </h1>
        <p className="max-w-3xl text-sm md:text-base text-gray-200/90 line-clamp-3 mb-6">
          {video.description || "Enjoy high‑quality streaming with multiple resolutions and smooth playback."}
        </p>
        <div className="flex gap-3">
          <Link to={`/${video.id}`} className="btn btn-primary">
            ▶ Play
          </Link>
          <Link to={`/studio/${video.id}`} className="btn btn-secondary hidden md:inline-flex">
            ℹ Details
          </Link>
        </div>
      </div>
    </div>
  );
}


