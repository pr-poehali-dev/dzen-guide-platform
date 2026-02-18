import { useState } from "react";
import { Island } from "@/data/archipelago";

interface IslandSVGProps {
  island: Island;
  revealed: boolean;
  active: boolean;
  onClick: () => void;
}

const IslandSVG = ({ island, revealed, active, onClick }: IslandSVGProps) => {
  const [hovered, setHovered] = useState(false);
  const gradientId = `grad-${island.id}`;
  const glowId = `glow-${island.id}`;
  const fogId = `fog-${island.id}`;

  return (
    <g
      className="cursor-pointer transition-all"
      onClick={revealed ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ transition: "all 0.6s ease" }}
    >
      <defs>
        <radialGradient id={gradientId} cx="40%" cy="35%">
          <stop offset="0%" stopColor={island.gradientFrom} stopOpacity={revealed ? 1 : 0.3} />
          <stop offset="100%" stopColor={island.gradientTo} stopOpacity={revealed ? 0.9 : 0.15} />
        </radialGradient>
        <filter id={glowId}>
          <feGaussianBlur stdDeviation={active ? 6 : 3} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={fogId}>
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {active && revealed && (
        <ellipse
          cx={island.cx}
          cy={island.cy}
          rx={island.rx + 12}
          ry={island.ry + 8}
          fill={island.color}
          opacity={0.15}
          filter={`url(#${glowId})`}
        >
          <animate
            attributeName="opacity"
            values="0.1;0.2;0.1"
            dur="3s"
            repeatCount="indefinite"
          />
        </ellipse>
      )}

      <ellipse
        cx={island.cx}
        cy={island.cy}
        rx={island.rx + 4}
        ry={island.ry + 3}
        fill="#c8dbe8"
        opacity={0.3}
      />

      <ellipse
        cx={island.cx}
        cy={island.cy}
        rx={island.rx}
        ry={island.ry}
        fill={`url(#${gradientId})`}
        stroke={revealed ? island.color : "#d0d8e0"}
        strokeWidth={hovered && revealed ? 2.5 : 1.5}
        style={{
          transition: "all 0.5s ease",
          transform: hovered && revealed ? "scale(1.03)" : "scale(1)",
          transformOrigin: `${island.cx}px ${island.cy}px`,
        }}
      />

      {!revealed && (
        <ellipse
          cx={island.cx}
          cy={island.cy}
          rx={island.rx - 5}
          ry={island.ry - 5}
          fill="white"
          opacity={0.4}
          filter={`url(#${fogId})`}
        />
      )}

      {revealed && (
        <>
          <ellipse
            cx={island.cx - island.rx * 0.25}
            cy={island.cy - island.ry * 0.15}
            rx={island.rx * 0.3}
            ry={island.ry * 0.18}
            fill={island.gradientFrom}
            opacity={0.4}
          />
          <ellipse
            cx={island.cx + island.rx * 0.2}
            cy={island.cy + island.ry * 0.1}
            rx={island.rx * 0.2}
            ry={island.ry * 0.12}
            fill="white"
            opacity={0.2}
          />
        </>
      )}

      <text
        x={island.cx}
        y={island.cy - 6}
        textAnchor="middle"
        fontSize={revealed ? "20" : "16"}
        style={{ transition: "all 0.5s ease" }}
      >
        {revealed ? island.emoji : "🌫️"}
      </text>

      <text
        x={island.cx}
        y={island.cy + 16}
        textAnchor="middle"
        fontSize="9"
        fontWeight={600}
        fill={revealed ? island.color : "#a0a8b0"}
        opacity={revealed ? 1 : 0.5}
        style={{ transition: "all 0.5s ease" }}
      >
        {revealed ? island.name : "???"}
      </text>
    </g>
  );
};

export default IslandSVG;