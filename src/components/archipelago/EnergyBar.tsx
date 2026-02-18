import Icon from "@/components/ui/icon";
import { directionEnergies, islands } from "@/data/archipelago";
import type { EnergyLevels } from "@/hooks/useArchipelagoState";
import { Direction } from "@/data/universities";

interface EnergyBarProps {
  energyLevels: EnergyLevels;
  revealedIslands: string[];
}

const EnergyBar = ({ energyLevels, revealedIslands }: EnergyBarProps) => {
  const entries = Object.entries(directionEnergies) as [Direction, typeof directionEnergies[Direction]][];

  return (
    <div className="bg-white/70 rounded-2xl p-4 border border-white/60">
      <div className="flex items-center gap-2 mb-3">
        <Icon name="Zap" size={14} className="text-[var(--dzen-gold)]" />
        <span className="text-xs font-heading font-semibold text-[var(--dzen-blue-dark)]">Энергии направлений</span>
      </div>
      <div className="space-y-2.5">
        {entries.map(([dir, info]) => {
          const island = islands.find((i) => i.direction === dir);
          const level = energyLevels[dir] || 0;
          const threshold = island?.energyThreshold || 25;
          const percentage = Math.min((level / threshold) * 100, 100);
          const isRevealed = island ? revealedIslands.includes(island.id) : false;

          return (
            <div key={dir}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Icon name={info.icon} size={12} style={{ color: info.color }} />
                  <span className="text-xs text-[var(--dzen-blue-dark)]">{info.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">{level}/{threshold}</span>
                  {isRevealed && <span className="text-[10px]">✨</span>}
                </div>
              </div>
              <div className="h-1.5 bg-[var(--dzen-sand)]/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: info.color,
                    opacity: percentage > 0 ? 1 : 0.3,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EnergyBar;