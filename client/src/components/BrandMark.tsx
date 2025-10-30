export default function BrandMark({ className = "w-40 h-10" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <path id="vidpulse-arc" d="M 8 56 Q 160 16 312 56" fill="none" />
      </defs>
      <text
        fill="#2563EB"
        fontSize="46"
        fontWeight="1000"
        style={{ fontFamily: "BrandFont, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial", letterSpacing: "0.15em" }}
      >
        <textPath
          href="#vidpulse-arc"
          startOffset="50%"
          textAnchor="middle"
          dominantBaseline="hanging"
        >
          StreamFlix
        </textPath>
      </text>
    </svg>
  );
}


