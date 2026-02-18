import Icon from "@/components/ui/icon";
import { universityImages } from "@/data/archipelago";
import { universities } from "@/data/universities";

interface DiscoveryAlbumProps {
  openedFaculties: number[];
  onClose: () => void;
}

const DiscoveryAlbum = ({ openedFaculties, onClose }: DiscoveryAlbumProps) => {
  const entries = openedFaculties.map((facId) => {
    for (const uni of universities) {
      const fac = uni.faculties.find((f) => f.id === facId);
      if (fac) {
        return { uni, fac, image: universityImages[uni.id] };
      }
    }
    return null;
  }).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 bg-[var(--dzen-cream)] overflow-y-auto animate-fade-in">
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Icon name="BookOpen" size={20} className="text-[var(--dzen-gold)]" />
            <h2 className="font-heading font-bold text-xl text-[var(--dzen-blue-dark)]">
              Альбом открытий
            </h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-[var(--dzen-blue-dark)]">
            <Icon name="X" size={20} />
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl mb-4 block">📖</span>
            <p className="text-muted-foreground">Альбом пока пуст. Открывай факультеты, чтобы заполнить его!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => {
              if (!entry) return null;
              return (
                <div
                  key={entry.fac.id}
                  className="bg-white rounded-2xl overflow-hidden border border-white/60 hover-lift"
                >
                  <div className="flex">
                    <img
                      src={entry.image}
                      alt={entry.uni.name}
                      className="w-24 h-24 object-cover"
                    />
                    <div className="p-4 flex-1">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-sm">🏛️</span>
                        <h4 className="font-heading font-semibold text-sm text-[var(--dzen-blue-dark)]">
                          {entry.fac.name}
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground">{entry.uni.name}, {entry.uni.city}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-[10px] bg-[var(--dzen-sky)]/10 text-[var(--dzen-sky)] px-2 py-0.5 rounded-full">
                          {entry.fac.direction}
                        </span>
                        <span className="text-[10px] bg-[var(--dzen-peach)]/30 text-[var(--dzen-gold)] px-2 py-0.5 rounded-full">
                          Рейтинг {entry.uni.ranking}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Открыто {entries.length} из {universities.reduce((sum, u) => sum + u.faculties.length, 0)} факультетов
        </div>
      </div>
    </div>
  );
};

export default DiscoveryAlbum;