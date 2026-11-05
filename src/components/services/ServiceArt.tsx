import { ProjectArt } from "@/components/projects/ProjectArt";

/** Decorative illustration per service, drawn in code. */
export function ServiceArt({ slug }: { slug: string }) {
  if (slug === "residential-rooftop-solar") return <ProjectArt category="residential" seed={0} id="svc-res" />;
  if (slug === "commercial-solar") return <ProjectArt category="commercial" seed={1} id="svc-ci" />;
  if (slug === "solar-water-pump") return <ProjectArt category="agricultural" seed={2} id="svc-pump" />;
  if (slug === "on-grid-off-grid-hybrid-solar") return <HybridArt />;
  return <AmcArt />;
}

function HybridArt() {
  return (
    <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden focusable="false">
      <defs>
        <linearGradient id="hy-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0A1730" />
          <stop offset="1" stopColor="#1B3266" />
        </linearGradient>
        <radialGradient id="hy-glow">
          <stop offset="0" stopColor="#FFC93C" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FFC93C" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="260" fill="url(#hy-sky)" />
      <circle cx="320" cy="56" r="90" fill="url(#hy-glow)" />
      <circle cx="320" cy="56" r="26" fill="#FFC93C" />
      {/* grid tower */}
      <g stroke="#7FA2E0" strokeWidth="2.5" fill="none" strokeLinejoin="round">
        <path d="M44 236 62 120l18 116M50 196h24M55 160h14M62 120l-16 10M62 120l16 10" />
        <path d="M78 130c40 18 60 22 92 24" strokeDasharray="4 5" />
      </g>
      {/* house */}
      <rect x="150" y="150" width="120" height="86" fill="#FBF8F2" />
      <polygon points="140,152 210,100 280,152" fill="#1E4FB0" />
      <polygon points="214,106 270,148 222,148 192,124" fill="#2BA8E8" />
      <rect x="196" y="190" width="28" height="46" rx="3" fill="#1E4FB0" />
      <rect x="162" y="168" width="26" height="22" fill="#FFC93C" />
      <rect x="232" y="168" width="26" height="22" fill="#FFC93C" />
      {/* battery */}
      <g>
        <rect x="300" y="160" width="60" height="76" rx="10" fill="#12224A" stroke="#7CC520" strokeWidth="3" />
        <rect x="320" y="152" width="20" height="10" rx="3" fill="#7CC520" />
        <rect x="310" y="208" width="40" height="18" rx="4" fill="#7CC520" />
        <rect x="310" y="186" width="40" height="18" rx="4" fill="#7CC520" />
        <rect x="310" y="170" width="40" height="12" rx="4" fill="#7CC520" opacity="0.35" />
        <path d="M333 112l-10 18h10l-6 16 16-22h-10l6-12z" fill="#FFC93C" />
      </g>
      <path d="M270 200h30" stroke="#7CC520" strokeWidth="3" strokeDasharray="5 5" />
      <path d="M0 236h400v24H0z" fill="#2E8B1E" />
    </svg>
  );
}

function AmcArt() {
  const cells = Array.from({ length: 12 }, (_, i) => i);
  return (
    <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden focusable="false">
      <defs>
        <linearGradient id="amc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CFEAFB" />
          <stop offset="1" stopColor="#FBF8F2" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#amc-sky)" />
      <circle cx="70" cy="60" r="28" fill="#FFC93C" />
      {/* tilted panel */}
      <polygon points="90,200 300,200 340,110 130,110" fill="#123A86" />
      {cells.map((i) => {
        const r = Math.floor(i / 4);
        const c = i % 4;
        const t0 = r / 3;
        const t1 = (r + 1) / 3;
        const x = (t: number, u: number) => 130 - 40 * t + (210 * u) + 0;
        const y = (t: number) => 110 + 90 * t;
        const u0 = c / 4 + 0.01;
        const u1 = (c + 1) / 4 - 0.01;
        const v0 = t0 + 0.02;
        const v1 = t1 - 0.02;
        const pts = [
          [x(v0, u0), y(v0)],
          [x(v0, u1), y(v0)],
          [x(v1, u1), y(v1)],
          [x(v1, u0), y(v1)],
        ]
          .map((p) => p.join(","))
          .join(" ");
        const dusty = c >= 2;
        return <polygon key={i} points={pts} fill={dusty ? "#8C93A3" : ["#1E4FB0", "#2468C8", "#2B86DA"][(r + c) % 3]} opacity={dusty ? 0.9 : 1} />;
      })}
      <line x1="140" y1="200" x2="140" y2="236" stroke="#4B5563" strokeWidth="4" />
      <line x1="280" y1="200" x2="280" y2="236" stroke="#4B5563" strokeWidth="4" />
      {/* brush + water */}
      <g transform="rotate(-18 250 120)">
        <rect x="236" y="40" width="8" height="80" rx="4" fill="#F7931E" />
        <rect x="216" y="116" width="48" height="14" rx="5" fill="#0A1730" />
      </g>
      {[
        [216, 96],
        [206, 112],
        [228, 84],
      ].map(([cx, cy], i) => (
        <path key={i} d={`M${cx} ${cy}c-4 6-6 9-6 12a6 6 0 0 0 12 0c0-3-2-6-6-12z`} fill="#2BA8E8" />
      ))}
      {[
        [180, 128],
        [158, 170],
        [206, 160],
      ].map(([cx, cy], i) => (
        <path key={i} d={`M${cx} ${cy - 8}c1 5 3 7 8 8-5 1-7 3-8 8-1-5-3-7-8-8 5-1 7-3 8-8z`} fill="#fff" />
      ))}
      <path d="M0 236h400v24H0z" fill="#7CC520" />
    </svg>
  );
}
