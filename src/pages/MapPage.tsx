import { useState } from "react";
import Icon from "@/components/ui/icon";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { universities, directionEmojis, cityCoords, type Direction } from "@/data/universities";

const MapPage = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [collected, setCollected] = useState<number[]>(() => {
    const saved = localStorage.getItem("dzenguide_collected");
    return saved ? JSON.parse(saved) : [];
  });

  const citiesWithUnis = Object.entries(
    universities.reduce((acc, uni) => {
      if (!acc[uni.city]) acc[uni.city] = [];
      acc[uni.city].push(uni);
      return acc;
    }, {} as Record<string, typeof universities>)
  );

  const collectFaculty = (facId: number) => {
    if (collected.includes(facId)) return;
    const newCollected = [...collected, facId];
    setCollected(newCollected);
    localStorage.setItem("dzenguide_collected", JSON.stringify(newCollected));
  };

  const totalFaculties = universities.reduce((sum, u) => sum + u.faculties.length, 0);

  return (
    <div className="min-h-screen bg-[var(--dzen-cream)]">
      <Header />
      <BottomNav />

      <div className="pt-24 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="font-heading font-bold text-3xl text-[var(--dzen-blue-dark)] mb-2">
              🗺️ Карта вузов России
            </h1>
            <p className="text-muted-foreground mb-4">Собери коллекцию факультетов</p>
            <div className="inline-flex items-center gap-2 bg-white/70 rounded-full px-4 py-2 text-sm">
              <Icon name="Star" size={14} className="text-[var(--dzen-gold)]" />
              Собрано: <strong className="text-[var(--dzen-blue-dark)]">{collected.length}</strong> из {totalFaculties}
            </div>
          </div>

          <div className="relative bg-white/60 rounded-3xl p-8 border border-white/50 mb-8 min-h-[400px] animate-fade-in">
            <svg viewBox="0 0 100 80" className="w-full h-auto">
              <ellipse cx="50" cy="45" rx="42" ry="30" fill="none" stroke="var(--dzen-sand)" strokeWidth="0.3" strokeDasharray="1,1" opacity="0.5" />
              
              <path d="M20,35 Q30,25 40,30 Q50,20 60,28 Q70,22 80,32 Q85,40 80,50 Q70,58 60,55 Q50,60 40,55 Q30,58 25,50 Q18,45 20,35Z" 
                fill="var(--dzen-sky)" fillOpacity="0.08" stroke="var(--dzen-sky)" strokeWidth="0.3" strokeOpacity="0.3" />

              {citiesWithUnis.map(([city, unis]) => {
                const coords = cityCoords[city] || { x: 50, y: 40 };
                const isSelected = selectedCity === city;
                const cityFacIds = unis.flatMap((u) => u.faculties.map((f) => f.id));
                const collectedCount = cityFacIds.filter((id) => collected.includes(id)).length;
                const allCollected = collectedCount === cityFacIds.length;

                return (
                  <g key={city} onClick={() => setSelectedCity(isSelected ? null : city)} className="cursor-pointer">
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r={isSelected ? 3.5 : 2.5}
                      fill={allCollected ? "#4ade80" : "var(--dzen-sky)"}
                      stroke="white"
                      strokeWidth="0.5"
                      className="transition-all duration-300"
                    />
                    {isSelected && (
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r="5"
                        fill="none"
                        stroke="var(--dzen-sky)"
                        strokeWidth="0.3"
                        opacity="0.5"
                      />
                    )}
                    <text
                      x={coords.x}
                      y={coords.y - 4}
                      textAnchor="middle"
                      fontSize="2.5"
                      fill="var(--dzen-blue-dark)"
                      fontWeight={isSelected ? "bold" : "normal"}
                    >
                      {city}
                    </text>
                    {collectedCount > 0 && (
                      <text
                        x={coords.x + 3.5}
                        y={coords.y + 1}
                        textAnchor="start"
                        fontSize="2"
                        fill="var(--dzen-gold)"
                      >
                        {collectedCount}/{cityFacIds.length}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {selectedCity && (
            <div className="animate-fade-in-up">
              <h2 className="font-heading font-bold text-xl text-[var(--dzen-blue-dark)] mb-4">
                📍 {selectedCity}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {citiesWithUnis
                  .filter(([city]) => city === selectedCity)
                  .flatMap(([, unis]) =>
                    unis.map((uni) => (
                      <div key={uni.id} className="bg-white/80 rounded-2xl p-5 border border-white/60">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-heading font-semibold text-[var(--dzen-blue-dark)]">{uni.name}</h3>
                          <span className="text-xs bg-[var(--dzen-sky)]/10 text-[var(--dzen-sky)] px-2 py-1 rounded-full">
                            Рейтинг: {uni.ranking}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {uni.faculties.map((fac) => {
                            const isCollected = collected.includes(fac.id);
                            return (
                              <div
                                key={fac.id}
                                className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                                  isCollected
                                    ? "bg-green-50 border border-green-200"
                                    : "bg-[var(--dzen-cream)] border border-transparent hover:border-[var(--dzen-sky)]/30"
                                }`}
                              >
                                <div>
                                  <span className="text-sm font-medium text-[var(--dzen-blue-dark)]">
                                    {directionEmojis[fac.direction as Direction]} {fac.name}
                                  </span>
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    Бюджет: {fac.score_budget} · Платно: {fac.score_paid} ({(fac.fee_paid / 1000).toFixed(0)}к ₽)
                                  </div>
                                </div>
                                <button
                                  onClick={() => collectFaculty(fac.id)}
                                  disabled={isCollected}
                                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                    isCollected
                                      ? "bg-green-400 text-white"
                                      : "bg-[var(--dzen-sky)]/10 text-[var(--dzen-sky)] hover:bg-[var(--dzen-sky)] hover:text-white"
                                  }`}
                                >
                                  <Icon name={isCollected ? "Check" : "Plus"} size={14} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
              </div>
            </div>
          )}

          {!selectedCity && (
            <div className="text-center text-muted-foreground text-sm animate-fade-in">
              <Icon name="MousePointerClick" size={20} className="mx-auto mb-2 text-[var(--dzen-sky)]" />
              Нажми на город на карте, чтобы увидеть вузы
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPage;