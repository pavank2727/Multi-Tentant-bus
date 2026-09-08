interface YathriLogoProps {
  size?: number;
  textColor?: string;
  showTagline?: boolean;
  tagline?: string;
}

/* SVG mark: stylised road-fork forming a Y — two paths converging into one journey */
function YathriMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="yg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#138808" />
        </linearGradient>
      </defs>
      {/* Rounded square — India tricolour gradient */}
      <rect width="40" height="40" rx="10" fill="url(#yg)" />
      {/* Top-left road arm */}
      <path
        d="M11 10 L20 21"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Top-right road arm */}
      <path
        d="M29 10 L20 21"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Stem going down — the journey ahead */}
      <path
        d="M20 21 L20 31"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Small dot at junction — the traveller */}
      <circle cx="20" cy="21" r="2.2" fill="white" />
    </svg>
  );
}

export default function YathriLogo({
  size = 36,
  textColor = "#fff",
  showTagline = false,
  tagline = "OPERATOR PORTAL",
}: YathriLogoProps) {
  const nameSize = Math.round(size * 0.52);
  const tagSize  = Math.round(size * 0.28);

  return (
    <div className="flex items-center gap-2.5">
      <YathriMark size={size} />
      <div>
        <div
          className="font-jakarta font-black leading-none tracking-tight"
          style={{ color: textColor, fontSize: nameSize }}
        >
          Yathri
        </div>
        {showTagline && (
          <div
            className="font-mono leading-none mt-0.5 uppercase tracking-widest"
            style={{
              color: textColor === "#fff" ? "rgba(255,255,255,0.5)" : "#94A3B8",
              fontSize: tagSize,
            }}
          >
            {tagline}
          </div>
        )}
      </div>
    </div>
  );
}
