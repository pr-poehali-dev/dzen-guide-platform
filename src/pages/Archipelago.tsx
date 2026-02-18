import { useState, useCallback, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import ArchipelagoMap from "@/components/archipelago/ArchipelagoMap";
import SelfDiscoveryPhase from "@/components/archipelago/SelfDiscoveryPhase";
import EnergyBar from "@/components/archipelago/EnergyBar";
import CityView from "@/components/archipelago/CityView";
import SimulationModal from "@/components/archipelago/SimulationModal";
import ChallengeModal from "@/components/archipelago/ChallengeModal";
import DiscoveryAlbum from "@/components/archipelago/DiscoveryAlbum";
import FinaleOverlay from "@/components/archipelago/FinaleOverlay";
import { useArchipelagoState } from "@/hooks/useArchipelagoState";
import { islands, universityIslandMap, universityImages, selfDiscoveryQuizzes } from "@/data/archipelago";
import { universities, Direction } from "@/data/universities";
import { syncCollectedFaculties } from "@/lib/energySync";

const directionProfileBoost: Record<string, Partial<Record<Direction, number>>> = {
  technical: { IT: 5, "Естественные науки": 3 },
  analytical: { Экономика: 4, IT: 3, Юриспруденция: 3, "Естественные науки": 4 },
  creative: { "Гуманитарные науки": 5, Менеджмент: 2 },
  social: { Менеджмент: 4, Юриспруденция: 3, "Гуманитарные науки": 3 },
  leadership: { Менеджмент: 5, Экономика: 3 },
};

const Archipelago = () => {
  const {
    progress,
    update,
    addProfileScores,
    addEnergyMultiple,
    revealIsland,
    openCity,
    openFaculty,
  } = useArchipelagoState();

  const [selectedIsland, setSelectedIsland] = useState<string | null>(null);
  const [selectedUniId, setSelectedUniId] = useState<number | null>(null);
  const [showSimulation, setShowSimulation] = useState(false);
  const [showChallenge, setShowChallenge] = useState<number | null>(null);
  const [showAlbum, setShowAlbum] = useState(false);
  const [showFinale, setShowFinale] = useState(false);

  useEffect(() => {
    syncCollectedFaculties();
  }, [progress.discoveryAlbum]);

  const checkAndRevealIslands = useCallback(
    (newEnergies: Record<string, number>) => {
      for (const island of islands) {
        const level = newEnergies[island.direction] || 0;
        if (level >= island.energyThreshold && !progress.revealedIslands.includes(island.id)) {
          revealIsland(island.id);
        }
      }
    },
    [progress.revealedIslands, revealIsland]
  );

  const distributeEnergyFromScores = useCallback(
    (scores: Partial<Record<string, number>>) => {
      const energyBoost: Partial<Record<Direction, number>> = {};
      for (const [trait, value] of Object.entries(scores)) {
        const boosts = directionProfileBoost[trait];
        if (boosts && value) {
          for (const [dir, mult] of Object.entries(boosts)) {
            energyBoost[dir as Direction] = (energyBoost[dir as Direction] || 0) + value * (mult || 0);
          }
        }
      }
      addEnergyMultiple(energyBoost);

      const newLevels = { ...progress.energyLevels };
      for (const [dir, amt] of Object.entries(energyBoost)) {
        newLevels[dir as Direction] = (newLevels[dir as Direction] || 0) + (amt || 0);
      }
      checkAndRevealIslands(newLevels);
    },
    [addEnergyMultiple, progress.energyLevels, checkAndRevealIslands]
  );

  const handleStartExploring = () => {
    update({ phase: "self-discovery" });
  };

  const handleQuizAnswer = (scores: Partial<Record<string, number>>) => {
    addProfileScores(scores);
    distributeEnergyFromScores(scores);
    const nextIdx = progress.selfDiscoveryQuizIndex + 1;
    if (nextIdx >= selfDiscoveryQuizzes.length) {
      update({ selfDiscoveryStep: "role", selfDiscoveryQuizIndex: nextIdx });
    } else {
      update({ selfDiscoveryQuizIndex: nextIdx });
    }
  };

  const handleRoleSelect = (roleId: string, scores: Partial<Record<string, number>>) => {
    addProfileScores(scores);
    distributeEnergyFromScores(scores);
    update({ selectedRole: roleId, selfDiscoveryStep: "situation" });
  };

  const handleSituationAnswer = (scores: Partial<Record<string, number>>) => {
    addProfileScores(scores);
    distributeEnergyFromScores(scores);
    update({ situationDone: true, selfDiscoveryStep: "done" });
  };

  const handleSelfDiscoveryComplete = () => {
    const topTrait = Object.entries(progress.profileScores).sort(([, a], [, b]) => b - a)[0]?.[0];
    if (topTrait) {
      const boosts = directionProfileBoost[topTrait];
      if (boosts) {
        const topDir = Object.entries(boosts).sort(([, a], [, b]) => (b || 0) - (a || 0))[0]?.[0];
        const island = islands.find((i) => i.direction === topDir);
        if (island && !progress.revealedIslands.includes(island.id)) {
          revealIsland(island.id);
        }
      }
    }
    update({ phase: "explore" });
  };

  const handleIslandClick = (islandId: string) => {
    if (!progress.revealedIslands.includes(islandId)) return;
    setSelectedIsland(islandId);
    setSelectedUniId(null);
  };

  const islandUniversities = useMemo(() => {
    if (!selectedIsland) return [];
    return universities.filter((u) => universityIslandMap[u.id] === selectedIsland);
  }, [selectedIsland]);

  const handleSimulationComplete = (harmony: number) => {
    if (selectedUniId) {
      openCity(selectedUniId, harmony);
    }
    setShowSimulation(false);

    if (progress.totalFacultiesOpened + 1 >= 5 && !progress.finaleShown) {
      // will check on faculty open
    }
  };

  const handleChallengeComplete = (success: boolean) => {
    if (success && showChallenge) {
      openFaculty(showChallenge);

      const newTotal = progress.totalFacultiesOpened + 1;
      if (newTotal >= 5 && !progress.finaleShown) {
        setTimeout(() => {
          setShowFinale(true);
          update({ finaleShown: true });
        }, 1000);
      }
    }
    setShowChallenge(null);
  };

  const handleFinaleDisimss = () => {
    setShowFinale(false);
  };

  return (
    <div className="min-h-screen bg-[var(--dzen-cream)]">
      <Header />
      <BottomNav archipelagoProgress={progress.revealedIslands.length} />

      <div className="pt-20 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">

          {progress.phase === "intro" && (
            <div className="text-center animate-fade-in-up pt-8">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[var(--dzen-sky)]/20 to-[var(--dzen-peach)]/20 flex items-center justify-center mb-4">
                  <span className="text-5xl animate-float">🏝️</span>
                </div>
                <h1 className="font-heading font-bold text-3xl text-[var(--dzen-blue-dark)] mb-3">
                  Архипелаг Будущего
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto mb-2">
                  Россия как спокойный архипелаг. Каждый остров — направление. Каждый город — университет. Каждое здание — факультет.
                </p>
                <p className="text-sm text-muted-foreground/70 max-w-sm mx-auto">
                  Исследуй, открывай, собирай. Без таймеров и соревнований — только спокойное познание.
                </p>
              </div>

              <ArchipelagoMap
                revealedIslands={[]}
                activeIsland={null}
                onIslandClick={() => {}}
              />

              <div className="mt-8">
                <button
                  onClick={handleStartExploring}
                  className="bg-[var(--dzen-sky)] hover:bg-[var(--dzen-blue-dark)] text-white px-10 py-4 rounded-2xl font-heading font-semibold transition-all hover:shadow-lg inline-flex items-center gap-2"
                >
                  <Icon name="Compass" size={18} />
                  Начать исследование
                </button>
              </div>
            </div>
          )}

          {progress.phase === "self-discovery" && (
            <div className="max-w-lg mx-auto pt-4">
              <div className="mb-6">
                <ArchipelagoMap
                  revealedIslands={progress.revealedIslands}
                  activeIsland={null}
                  onIslandClick={() => {}}
                />
              </div>

              <div className="bg-white/80 rounded-3xl p-6 border border-white/60">
                <SelfDiscoveryPhase
                  step={progress.selfDiscoveryStep}
                  quizIndex={progress.selfDiscoveryQuizIndex}
                  onQuizAnswer={handleQuizAnswer}
                  onRoleSelect={handleRoleSelect}
                  onSituationAnswer={handleSituationAnswer}
                  onComplete={handleSelfDiscoveryComplete}
                />
              </div>

              <div className="mt-4">
                <EnergyBar
                  energyLevels={progress.energyLevels}
                  revealedIslands={progress.revealedIslands}
                />
              </div>
            </div>
          )}

          {progress.phase === "explore" && !selectedIsland && (
            <div className="animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="font-heading font-bold text-2xl text-[var(--dzen-blue-dark)]">
                    Архипелаг Будущего
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Нажми на открытый остров, чтобы исследовать
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAlbum(true)}
                    className="flex items-center gap-1.5 bg-white/80 border border-white/60 px-3 py-2 rounded-xl text-xs font-medium text-[var(--dzen-blue-dark)] hover:bg-white transition-all"
                  >
                    <Icon name="BookOpen" size={14} className="text-[var(--dzen-gold)]" />
                    Альбом ({progress.discoveryAlbum.length})
                  </button>
                </div>
              </div>

              <ArchipelagoMap
                revealedIslands={progress.revealedIslands}
                activeIsland={null}
                onIslandClick={handleIslandClick}
              />

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EnergyBar
                  energyLevels={progress.energyLevels}
                  revealedIslands={progress.revealedIslands}
                />

                <div className="bg-white/70 rounded-2xl p-4 border border-white/60">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="Map" size={14} className="text-[var(--dzen-sky)]" />
                    <span className="text-xs font-heading font-semibold text-[var(--dzen-blue-dark)]">Прогресс</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Острова открыты</span>
                      <span className="font-medium text-[var(--dzen-blue-dark)]">
                        {progress.revealedIslands.length} / {islands.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Города исследованы</span>
                      <span className="font-medium text-[var(--dzen-blue-dark)]">
                        {progress.openedCities.length} / {universities.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Факультеты открыты</span>
                      <span className="font-medium text-[var(--dzen-blue-dark)]">
                        {progress.totalFacultiesOpened} / {universities.reduce((s, u) => s + u.faculties.length, 0)}
                      </span>
                    </div>
                  </div>

                  {progress.totalFacultiesOpened >= 5 && (
                    <Link
                      to="/results"
                      className="mt-3 flex items-center justify-center gap-1.5 bg-[var(--dzen-sky)] text-white py-2 rounded-xl text-xs font-medium transition-all hover:bg-[var(--dzen-blue-dark)]"
                    >
                      <Icon name="Sparkles" size={12} />
                      Создать DzenGuide
                    </Link>
                  )}
                </div>
              </div>

              {progress.revealedIslands.length === 0 && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Пока ни один остров не открыт. Пройди мини-кейс, чтобы набрать энергию!
                  </p>
                  <Link
                    to="/student-day"
                    className="inline-flex items-center gap-2 bg-[var(--dzen-peach)]/30 hover:bg-[var(--dzen-peach)]/50 text-[var(--dzen-blue-dark)] px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
                  >
                    <Icon name="Sun" size={14} />
                    День студента (набрать энергию)
                  </Link>
                </div>
              )}
            </div>
          )}

          {progress.phase === "explore" && selectedIsland && !selectedUniId && (
            <div className="animate-fade-in-up">
              <button
                onClick={() => setSelectedIsland(null)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-[var(--dzen-blue-dark)] mb-4 transition-colors"
              >
                <Icon name="ArrowLeft" size={16} />
                К архипелагу
              </button>

              {(() => {
                const island = islands.find((i) => i.id === selectedIsland);
                if (!island) return null;
                return (
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{island.emoji}</span>
                      <div>
                        <h2 className="font-heading font-bold text-xl text-[var(--dzen-blue-dark)]">{island.name}</h2>
                        <p className="text-sm text-muted-foreground">{island.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="space-y-3">
                {islandUniversities.map((uni) => {
                  const isOpened = progress.openedCities.includes(uni.id);
                  const harmony = progress.cityHarmony[uni.id] || 0;
                  const openedFacCount = uni.faculties.filter((f) =>
                    progress.openedFaculties.includes(f.id)
                  ).length;

                  return (
                    <button
                      key={uni.id}
                      onClick={() => setSelectedUniId(uni.id)}
                      className="w-full text-left bg-white/80 rounded-2xl p-4 border border-white/60 hover:bg-white hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 rounded-xl bg-cover bg-center shrink-0"
                          style={{
                            backgroundImage: `url(${universityImages[uni.id] || ""})`,
                            filter: isOpened ? "none" : "blur(3px) grayscale(0.5)",
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-heading font-semibold text-[var(--dzen-blue-dark)] truncate">
                              {isOpened ? uni.name : "???"}
                            </span>
                            {isOpened && (
                              <span className="shrink-0 text-[10px] bg-[var(--dzen-sky)]/10 text-[var(--dzen-sky)] px-1.5 py-0.5 rounded-full">
                                {Math.round(harmony * 100)}%
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {isOpened ? `${uni.city} · ${openedFacCount}/${uni.faculties.length} факультетов` : "Город скрыт в тумане"}
                          </div>
                        </div>
                        <Icon name="ChevronRight" size={16} className="text-muted-foreground shrink-0" />
                      </div>
                    </button>
                  );
                })}

                {islandUniversities.length === 0 && (
                  <div className="text-center py-8">
                    <span className="text-3xl mb-2 block">🌊</span>
                    <p className="text-sm text-muted-foreground">На этом острове пока нет городов</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {progress.phase === "explore" && selectedIsland && selectedUniId && (
            <CityView
              universityId={selectedUniId}
              isOpened={progress.openedCities.includes(selectedUniId)}
              harmony={progress.cityHarmony[selectedUniId] || 0}
              openedFaculties={progress.openedFaculties}
              onStartSimulation={() => setShowSimulation(true)}
              onFacultyChallenge={(facId) => setShowChallenge(facId)}
              onBack={() => setSelectedUniId(null)}
            />
          )}
        </div>
      </div>

      {showSimulation && selectedUniId && (
        <SimulationModal
          universityId={selectedUniId}
          onComplete={handleSimulationComplete}
          onClose={() => setShowSimulation(false)}
        />
      )}

      {showChallenge && (
        <ChallengeModal
          facultyId={showChallenge}
          onComplete={handleChallengeComplete}
          onClose={() => setShowChallenge(null)}
        />
      )}

      {showAlbum && (
        <DiscoveryAlbum
          openedFaculties={progress.discoveryAlbum}
          onClose={() => setShowAlbum(false)}
        />
      )}

      {showFinale && (
        <FinaleOverlay
          totalFaculties={progress.totalFacultiesOpened}
          onDismiss={handleFinaleDisimss}
        />
      )}
    </div>
  );
};

export default Archipelago;