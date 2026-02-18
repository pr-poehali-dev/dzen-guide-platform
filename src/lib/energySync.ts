import type { StudentProfile } from "@/lib/algorithm";
import type { Direction } from "@/data/universities";

const ARCHIPELAGO_KEY = "dzenguide_archipelago";

const directionProfileBoost: Record<string, Partial<Record<Direction, number>>> = {
  technical: { IT: 5, "Естественные науки": 3 },
  analytical: { Экономика: 4, IT: 3, Юриспруденция: 3, "Естественные науки": 4 },
  creative: { "Гуманитарные науки": 5, Менеджмент: 2 },
  social: { Менеджмент: 4, Юриспруденция: 3, "Гуманитарные науки": 3 },
  leadership: { Менеджмент: 5, Экономика: 3 },
};

export function profileToEnergies(profile: StudentProfile): Record<Direction, number> {
  const energies: Record<string, number> = {
    IT: 0,
    Экономика: 0,
    Менеджмент: 0,
    Юриспруденция: 0,
    "Естественные науки": 0,
    "Гуманитарные науки": 0,
  };

  for (const [trait, value] of Object.entries(profile)) {
    const boosts = directionProfileBoost[trait];
    if (boosts && value) {
      for (const [dir, mult] of Object.entries(boosts)) {
        energies[dir] = (energies[dir] || 0) + value * (mult || 0);
      }
    }
  }

  return energies as Record<Direction, number>;
}

export function syncQuizToArchipelago(profile: StudentProfile): void {
  const energies = profileToEnergies(profile);

  try {
    const raw = localStorage.getItem(ARCHIPELAGO_KEY);
    const state = raw ? JSON.parse(raw) : null;

    if (!state) return;

    if (state._quizSynced) return;

    const newLevels = { ...state.energyLevels };
    for (const [dir, amt] of Object.entries(energies)) {
      newLevels[dir] = (newLevels[dir] || 0) + Math.round(amt * 0.3);
    }

    const newScores = { ...state.profileScores };
    for (const [trait, val] of Object.entries(profile)) {
      newScores[trait] = (newScores[trait] || 0) + Math.round(val * 0.5);
    }

    state.energyLevels = newLevels;
    state.profileScores = newScores;
    state._quizSynced = true;

    localStorage.setItem(ARCHIPELAGO_KEY, JSON.stringify(state));
  } catch {
    // safe fallback
  }
}

const directionEnergyMap: Record<Direction, Direction> = {
  IT: "IT",
  Экономика: "Экономика",
  Менеджмент: "Менеджмент",
  Юриспруденция: "Юриспруденция",
  "Естественные науки": "Естественные науки",
  "Гуманитарные науки": "Гуманитарные науки",
};

export function syncStudentDayToArchipelago(direction: Direction): void {
  try {
    const raw = localStorage.getItem(ARCHIPELAGO_KEY);
    const state = raw ? JSON.parse(raw) : null;

    if (!state) return;

    const syncKey = `_studentDay_${direction}`;
    if (state[syncKey]) return;

    const targetDir = directionEnergyMap[direction] || direction;
    const newLevels = { ...state.energyLevels };

    newLevels[targetDir] = (newLevels[targetDir] || 0) + 10;

    const neighborBoosts: Record<Direction, Direction[]> = {
      IT: ["Естественные науки"],
      Экономика: ["Менеджмент"],
      Менеджмент: ["Экономика", "Юриспруденция"],
      Юриспруденция: ["Менеджмент", "Гуманитарные науки"],
      "Естественные науки": ["IT"],
      "Гуманитарные науки": ["Юриспруденция"],
    };

    const neighbors = neighborBoosts[direction] || [];
    for (const n of neighbors) {
      newLevels[n] = (newLevels[n] || 0) + 4;
    }

    state.energyLevels = newLevels;
    state[syncKey] = true;

    localStorage.setItem(ARCHIPELAGO_KEY, JSON.stringify(state));
  } catch {
    // safe fallback
  }
}

export function syncCollectedFaculties(): void {
  try {
    const raw = localStorage.getItem(ARCHIPELAGO_KEY);
    const state = raw ? JSON.parse(raw) : null;

    if (!state) return;

    const album = state.discoveryAlbum || [];
    if (album.length > 0) {
      localStorage.setItem("dzenguide_collected", JSON.stringify(album));
    }
  } catch {
    // safe fallback
  }
}

export default {
  profileToEnergies,
  syncQuizToArchipelago,
  syncStudentDayToArchipelago,
  syncCollectedFaculties,
};
