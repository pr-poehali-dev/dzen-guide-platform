import { useState, useEffect, useCallback, useRef } from "react";
import { Direction } from "@/data/universities";

export type ArchipelagoPhase = "intro" | "self-discovery" | "energy" | "explore" | "finale";
export type SelfDiscoveryStep = "quiz" | "role" | "situation" | "done";

export interface EnergyLevels {
  IT: number;
  Экономика: number;
  Менеджмент: number;
  Юриспруденция: number;
  "Естественные науки": number;
  "Гуманитарные науки": number;
}

export interface ArchipelagoProgress {
  phase: ArchipelagoPhase;
  selfDiscoveryStep: SelfDiscoveryStep;
  selfDiscoveryQuizIndex: number;
  selectedRole: string | null;
  situationDone: boolean;
  energyLevels: EnergyLevels;
  revealedIslands: string[];
  openedCities: number[];
  cityHarmony: Record<number, number>;
  openedFaculties: number[];
  discoveryAlbum: number[];
  profileScores: Record<string, number>;
  totalFacultiesOpened: number;
  finaleShown: boolean;
}

const STORAGE_KEY = "dzenguide_archipelago";

const defaultProgress: ArchipelagoProgress = {
  phase: "intro",
  selfDiscoveryStep: "quiz",
  selfDiscoveryQuizIndex: 0,
  selectedRole: null,
  situationDone: false,
  energyLevels: {
    IT: 0,
    Экономика: 0,
    Менеджмент: 0,
    Юриспруденция: 0,
    "Естественные науки": 0,
    "Гуманитарные науки": 0,
  },
  revealedIslands: [],
  openedCities: [],
  cityHarmony: {},
  openedFaculties: [],
  discoveryAlbum: [],
  profileScores: { technical: 0, analytical: 0, creative: 0, social: 0, leadership: 0 },
  totalFacultiesOpened: 0,
  finaleShown: false,
};

function loadProgress(): ArchipelagoProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultProgress, ...parsed };
    }
  } catch {
    // ignore parse errors
  }
  return { ...defaultProgress };
}

function saveProgress(p: ArchipelagoProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function useArchipelagoState() {
  const [progress, setProgress] = useState<ArchipelagoProgress>(loadProgress);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      const fresh = loadProgress();
      setProgress(fresh);
    }
  }, []);

  useEffect(() => {
    if (mountedRef.current) {
      saveProgress(progress);
    }
  }, [progress]);

  const update = useCallback((partial: Partial<ArchipelagoProgress>) => {
    setProgress((prev) => ({ ...prev, ...partial }));
  }, []);

  const addProfileScores = useCallback((scores: Partial<Record<string, number>>) => {
    setProgress((prev) => {
      const newScores = { ...prev.profileScores };
      for (const [k, v] of Object.entries(scores)) {
        newScores[k] = (newScores[k] || 0) + (v || 0);
      }
      return { ...prev, profileScores: newScores };
    });
  }, []);

  const addEnergy = useCallback((direction: Direction, amount: number) => {
    setProgress((prev) => {
      const newLevels = { ...prev.energyLevels };
      newLevels[direction] = (newLevels[direction] || 0) + amount;
      return { ...prev, energyLevels: newLevels };
    });
  }, []);

  const addEnergyMultiple = useCallback((energies: Partial<Record<Direction, number>>) => {
    setProgress((prev) => {
      const newLevels = { ...prev.energyLevels };
      for (const [dir, amt] of Object.entries(energies)) {
        newLevels[dir as Direction] = (newLevels[dir as Direction] || 0) + (amt || 0);
      }
      return { ...prev, energyLevels: newLevels };
    });
  }, []);

  const revealIsland = useCallback((islandId: string) => {
    setProgress((prev) => {
      if (prev.revealedIslands.includes(islandId)) return prev;
      return { ...prev, revealedIslands: [...prev.revealedIslands, islandId] };
    });
  }, []);

  const openCity = useCallback((uniId: number, harmony: number) => {
    setProgress((prev) => {
      if (prev.openedCities.includes(uniId)) return prev;
      return {
        ...prev,
        openedCities: [...prev.openedCities, uniId],
        cityHarmony: { ...prev.cityHarmony, [uniId]: harmony },
      };
    });
  }, []);

  const openFaculty = useCallback((facId: number) => {
    setProgress((prev) => {
      if (prev.openedFaculties.includes(facId)) return prev;
      const newFaculties = [...prev.openedFaculties, facId];
      const newAlbum = [...prev.discoveryAlbum, facId];
      const total = newFaculties.length;
      return {
        ...prev,
        openedFaculties: newFaculties,
        discoveryAlbum: newAlbum,
        totalFacultiesOpened: total,
        finaleShown: total >= 5 ? false : prev.finaleShown,
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({ ...defaultProgress });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    progress,
    update,
    addProfileScores,
    addEnergy,
    addEnergyMultiple,
    revealIsland,
    openCity,
    openFaculty,
    resetProgress,
  };
}

export default useArchipelagoState;