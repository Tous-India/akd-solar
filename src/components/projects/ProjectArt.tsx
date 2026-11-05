import type { ProjectCategory } from "@/lib/data";

type Pt = [number, number];

function lerp(a: Pt, b: Pt, t: number): Pt {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

/** Split a quad (top-left, top-right, bottom-right, bottom-left) into a grid of panel polygons */
function panelGrid(q: [Pt, Pt, Pt, Pt], rows: number, cols: number, gap = 0.03) {
  const at = (u: number, v: number) => lerp(lerp(q[0], q[1], u), lerp(q[3], q[2], u), v);
  const out: string[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const u0 = c / cols + gap / 2;
      const u1 = (c + 1) / cols - gap / 2;
      const v0 = r / rows + gap;
      const v1 = (r + 1) / rows - gap;
      out.push(
        [at(u0, v0), at(u1, v0), at(u1, v1), at(u0, v1)].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" "),
      );
    }
  }
  return out;
}

const SKIES = [
  { top: "#FFE2A8", bottom: "#FFF6E6", sun: [318, 64] as Pt },
  { top: "#CFEAFB", bottom: "#F4FAFE", sun: [84, 58] as Pt },
  { top: "#FFD1A3", bottom: "#FCEFE0", sun: [300, 84] as Pt },
];

const PANEL_FILLS = ["#1E4FB0", "#2468C8", "#2B86DA"];

type Props = { category: ProjectCategory; seed?: number; id: string; className?: string };

/** Code-drawn illustration for a project card (no stock photos needed). Decorative. */
export function ProjectArt({ category, seed = 0, id, className = "" }: Props) {
  const sky = SKIES[seed % SKIES.length];
  const g = (name: string) => `${id}-${name}`;

  return (
    <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className={`h-full w-full ${className}`} aria-hidden focusable="false">
      <defs>
        <linearGradient id={g("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky.top} />
          <stop offset="1" stopColor={sky.bottom} />
        </linearGradient>
        <radialGradient id={g("glow")}>
          <stop offset="0" stopColor="#FFC93C" stopOpacity="0.8" />
          <stop offset="1" stopColor="#FFC93C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={g("ground")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8FD13A" />
          <stop offset="1" stopColor="#2E8B1E" />
        </linearGradient>
      </defs>

      <rect width="400" height="260" fill={`url(#${g("sky")})`} />
      <circle cx={sky.sun[0]} cy={sky.sun[1]} r="70" fill={`url(#${g("glow")})`} />
      <circle cx={sky.sun[0]} cy={sky.sun[1]} r="24" fill="#FFC93C" />
      <circle cx={sky.sun[0]} cy={sky.sun[1]} r="24" fill="#F7931E" opacity="0.35" />
      <path d="M0 214c70-22 150-26 220-16s130 8 180-8v70H0z" fill="#B9E07F" opacity="0.6" />

      {category === "residential" ? <Residential /> : null}
      {category === "commercial" ? <Commercial /> : null}
      {category === "agricultural" ? <Agricultural /> : null}

      <path d="M0 232c90-12 190-14 280-8s90 4 120 0v36H0z" fill={`url(#${g("ground")})`} />
    </svg>
  );
}

function Residential() {
  const panels = panelGrid(
    [
      [146, 104],
      [292, 104],
      [318, 150],
      [122, 150],
    ],
    2,
    5,
  );
  return (
    <g>
      <rect x="116" y="150" width="210" height="86" fill="#FFFDF8" />
      <rect x="296" y="150" width="30" height="86" fill="#EDE3D2" />
      <polygon points="104,152 138,98 302,98 336,152" fill="#123A86" />
      {panels.map((p, i) => (
        <polygon key={i} points={p} fill={PANEL_FILLS[(i + Math.floor(i / 5)) % 3]} />
      ))}
      <path d="M98 154 136 96h168l38 58" fill="none" stroke="#2BA8E8" strokeWidth="6" strokeLinejoin="round" />
      <rect x="198" y="186" width="34" height="50" rx="4" fill="#1E4FB0" />
      <rect x="140" y="172" width="38" height="30" rx="3" fill="#CDEBFA" stroke="#1E4FB0" strokeWidth="3" />
      <rect x="252" y="172" width="38" height="30" rx="3" fill="#CDEBFA" stroke="#1E4FB0" strokeWidth="3" />
      <rect x="60" y="196" width="6" height="40" rx="2" fill="#7A5230" />
      <circle cx="63" cy="186" r="22" fill="#2E8B1E" />
      <circle cx="74" cy="198" r="14" fill="#7CC520" />
    </g>
  );
}

function Commercial() {
  const rows = [
    { y: 112, x0: 70, w: 30, n: 8, h: 10 },
    { y: 124, x0: 62, w: 32, n: 8, h: 11 },
  ];
  return (
    <g>
      <rect x="50" y="136" width="300" height="100" fill="#F3ECDF" />
      <rect x="50" y="136" width="300" height="8" fill="#D9CDB7" />
      {Array.from({ length: 3 }, (_, r) =>
        Array.from({ length: 9 }, (_, c) => (
          <rect key={`${r}-${c}`} x={66 + c * 31} y={156 + r * 24} width="20" height="14" rx="2" fill="#CDEBFA" stroke="#1E4FB0" strokeWidth="2" />
        )),
      )}
      {rows.map((row, ri) =>
        Array.from({ length: row.n }, (_, i) => {
          const x = row.x0 + i * (row.w + 4);
          return (
            <g key={`${ri}-${i}`}>
              <polygon points={`${x},${row.y + row.h} ${x + row.w},${row.y + row.h} ${x + row.w + 5},${row.y} ${x + 5},${row.y}`} fill={PANEL_FILLS[(i + ri) % 3]} />
              <line x1={x + 4} y1={row.y + row.h} x2={x + 4} y2={row.y + row.h + 4} stroke="#6B7280" strokeWidth="1.5" />
            </g>
          );
        }),
      )}
      <rect x="300" y="196" width="34" height="40" fill="#1E4FB0" />
      <rect x="20" y="206" width="5" height="30" fill="#7A5230" />
      <circle cx="22" cy="198" r="16" fill="#2E8B1E" />
    </g>
  );
}

function Agricultural() {
  const panels = panelGrid(
    [
      [70, 118],
      [190, 118],
      [204, 166],
      [56, 166],
    ],
    2,
    4,
  );
  return (
    <g>
      {/* crop rows */}
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M${200 + i * 30} 236 L${250 + i * 18} 200`} stroke="#5FAE24" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      ))}
      {/* array on stand */}
      <line x1="80" y1="166" x2="80" y2="230" stroke="#4B5563" strokeWidth="4" />
      <line x1="180" y1="166" x2="180" y2="230" stroke="#4B5563" strokeWidth="4" />
      <polygon points="66,118 194,118 208,168 52,168" fill="#123A86" />
      {panels.map((p, i) => (
        <polygon key={i} points={p} fill={PANEL_FILLS[i % 3]} />
      ))}
      {/* pump + water */}
      <rect x="226" y="176" width="26" height="40" rx="4" fill="#F7931E" />
      <rect x="230" y="168" width="18" height="10" rx="2" fill="#0A1730" />
      <path d="M252 186h26c14 0 18 10 18 22" fill="none" stroke="#6B7280" strokeWidth="6" strokeLinecap="round" />
      <path d="M296 210c0 10 6 16 6 22" fill="none" stroke="#2BA8E8" strokeWidth="5" strokeLinecap="round" />
      <circle cx="306" cy="226" r="3" fill="#2BA8E8" />
      <circle cx="292" cy="230" r="2.5" fill="#2BA8E8" />
      <path d="M150 236c40-6 120-6 190 0" stroke="#2BA8E8" strokeWidth="4" opacity="0.6" fill="none" />
    </g>
  );
}
