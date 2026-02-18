import { islands } from "@/data/archipelago";
import IslandSVG from "./IslandSVG";

interface ArchipelagoMapProps {
  revealedIslands: string[];
  activeIsland: string | null;
  onIslandClick: (islandId: string) => void;
}

const ArchipelagoMap = ({ revealedIslands, activeIsland, onIslandClick }: ArchipelagoMapProps) => {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-b from-[#e8f0f8] via-[#d8e8f4] to-[#c8dce8]">
      <svg
        viewBox="0 0 800 480"
        className="w-full h-auto"
        style={{ minHeight: "320px" }}
      >
        <defs>
          <radialGradient id="ocean-glow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#d8e8f4" />
            <stop offset="100%" stopColor="#c0d4e4" />
          </radialGradient>
          <filter id="water-ripple">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" />
            <feDisplacementMap in="SourceGraphic" scale="3" />
          </filter>
        </defs>

        <rect width="800" height="480" fill="url(#ocean-glow)" />

        {[
          { cx: 100, cy: 60, rx: 40, ry: 8 },
          { cx: 700, cy: 50, rx: 50, ry: 10 },
          { cx: 400, cy: 440, rx: 60, ry: 8 },
          { cx: 750, cy: 400, rx: 35, ry: 7 },
          { cx: 50, cy: 200, rx: 30, ry: 6 },
        ].map((cloud, i) => (
          <ellipse
            key={i}
            {...cloud}
            fill="white"
            opacity={0.25}
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`0,0; ${10 + i * 3},${-2}; 0,0`}
              dur={`${20 + i * 5}s`}
              repeatCount="indefinite"
            />
          </ellipse>
        ))}

        {[
          { x1: 180, y1: 155, x2: 350, y2: 260 },
          { x1: 520, y1: 130, x2: 350, y2: 260 },
          { x1: 350, y1: 310, x2: 530, y2: 365 },
          { x1: 680, y1: 265, x2: 530, y2: 365 },
          { x1: 120, y1: 320, x2: 180, y2: 155 },
          { x1: 120, y1: 370, x2: 350, y2: 300 },
        ].map((line, i) => (
          <line
            key={i}
            {...line}
            stroke="#b0c8d8"
            strokeWidth="1"
            strokeDasharray="4 6"
            opacity={0.4}
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;20"
              dur="4s"
              repeatCount="indefinite"
            />
          </line>
        ))}

        {islands.map((island) => (
          <IslandSVG
            key={island.id}
            island={island}
            revealed={revealedIslands.includes(island.id)}
            active={activeIsland === island.id}
            onClick={() => onIslandClick(island.id)}
          />
        ))}

        <text x="400" y="25" textAnchor="middle" fontSize="13" fontWeight="700" fill="#7EAEC4" opacity={0.6}>
          Архипелаг Будущего
        </text>
      </svg>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--dzen-cream)] to-transparent pointer-events-none" />
    </div>
  );
};

export default ArchipelagoMap;