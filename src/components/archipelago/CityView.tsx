import { useState } from "react";
import Icon from "@/components/ui/icon";
import { universityImages, universitySimulations, facultyChallenges } from "@/data/archipelago";
import { universities } from "@/data/universities";

interface CityViewProps {
  universityId: number;
  isOpened: boolean;
  harmony: number;
  openedFaculties: number[];
  onStartSimulation: () => void;
  onFacultyChallenge: (facId: number) => void;
  onBack: () => void;
}

const CityView = ({
  universityId,
  isOpened,
  harmony,
  openedFaculties,
  onStartSimulation,
  onFacultyChallenge,
  onBack,
}: CityViewProps) => {
  const uni = universities.find((u) => u.id === universityId);
  if (!uni) return null;

  const image = universityImages[universityId];
  const brightness = isOpened ? 0.3 + harmony * 0.7 : 0.3;
  const hasSimulation = !!universitySimulations[universityId];

  return (
    <div className="animate-fade-in-up">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-[var(--dzen-blue-dark)] mb-4 transition-colors"
      >
        <Icon name="ArrowLeft" size={16} />
        К архипелагу
      </button>

      <div className="relative rounded-3xl overflow-hidden mb-6">
        <img
          src={image}
          alt={uni.name}
          className="w-full h-48 sm:h-64 object-cover transition-all duration-1000"
          style={{
            filter: `brightness(${brightness}) ${isOpened ? "" : "blur(3px) grayscale(0.5)"}`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="font-heading font-bold text-xl text-white mb-1">{uni.name}</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/80">{uni.city}</span>
            {isOpened && (
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white">
                Гармония: {Math.round(harmony * 100)}%
              </span>
            )}
          </div>
        </div>
        {!isOpened && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="text-center">
              <div className="text-4xl mb-2">🌫️</div>
              <p className="text-white/80 text-sm">Город скрыт в тумане</p>
            </div>
          </div>
        )}
      </div>

      {!isOpened && hasSimulation && (
        <div className="bg-white/80 rounded-2xl p-6 border border-white/60 text-center">
          <h3 className="font-heading font-semibold text-[var(--dzen-blue-dark)] mb-2">
            Открой город
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Пройди мини-симуляцию, чтобы увидеть университет
          </p>
          <button
            onClick={onStartSimulation}
            className="bg-[var(--dzen-sky)] hover:bg-[var(--dzen-blue-dark)] text-white px-6 py-3 rounded-2xl font-heading font-semibold transition-all inline-flex items-center gap-2"
          >
            <Icon name="Compass" size={16} />
            Начать путешествие
          </button>
        </div>
      )}

      {isOpened && (
        <div>
          <h3 className="font-heading font-semibold text-[var(--dzen-blue-dark)] mb-3 flex items-center gap-2">
            <Icon name="Building2" size={16} className="text-[var(--dzen-sky)]" />
            Здания знаний
          </h3>
          <div className="space-y-3">
            {uni.faculties.map((fac) => {
              const isOpen = openedFaculties.includes(fac.id);
              const hasChallenge = !!facultyChallenges[fac.id];

              return (
                <div
                  key={fac.id}
                  className={`rounded-2xl p-4 border-2 transition-all ${
                    isOpen
                      ? "bg-white border-[var(--dzen-sky)]/30 shadow-sm"
                      : "bg-white/50 border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          isOpen ? "bg-[var(--dzen-sky)]/10" : "bg-gray-100"
                        }`}
                      >
                        <span className="text-lg">{isOpen ? "🏛️" : "🌫️"}</span>
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${isOpen ? "text-[var(--dzen-blue-dark)]" : "text-gray-400"}`}>
                          {isOpen ? fac.name : "???"}
                        </div>
                        <div className="text-xs text-muted-foreground">{fac.direction}</div>
                      </div>
                    </div>

                    {isOpen ? (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <Icon name="Check" size={14} />
                        Открыто
                      </div>
                    ) : hasChallenge ? (
                      <button
                        onClick={() => onFacultyChallenge(fac.id)}
                        className="text-xs bg-[var(--dzen-sky)]/10 text-[var(--dzen-sky)] hover:bg-[var(--dzen-sky)]/20 px-3 py-1.5 rounded-xl transition-all"
                      >
                        Открыть
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Заблокировано</span>
                    )}
                  </div>

                  {isOpen && (
                    <div className="mt-3 pt-3 border-t border-[var(--dzen-sand)]/20">
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Бюджет: {fac.score_budget} баллов</span>
                        <span>Платное: {(fac.fee_paid / 1000).toFixed(0)}к ₽/год</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CityView;