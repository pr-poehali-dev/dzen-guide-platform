import { universities, Faculty, University, Direction } from "@/data/universities";

export interface StudentProfile {
  technical: number;
  analytical: number;
  creative: number;
  social: number;
  leadership: number;
}

export interface StudentInput {
  profile: StudentProfile;
  egeTotal: number;
  budget: number;
  preferredCity?: string;
  canRelocate: boolean;
}

export interface FacultyRecommendation {
  university: University;
  faculty: Faculty;
  finalScore: number;
  profileMatch: number;
  probability: number;
  regionMatch: number;
  financialFit: number;
  universityRating: number;
  isBudget: boolean;
}

const directionProfileMap: Record<Direction, (keyof StudentProfile)[]> = {
  IT: ["technical", "analytical"],
  Экономика: ["analytical", "leadership"],
  Менеджмент: ["leadership", "social"],
  Юриспруденция: ["analytical", "social"],
  "Естественные науки": ["analytical", "technical"],
  "Гуманитарные науки": ["creative", "social"],
};

function calcProfileMatch(profile: StudentProfile, direction: string): number {
  const keys = directionProfileMap[direction as Direction] || ["analytical"];
  const maxPossible = keys.length * 51;
  const score = keys.reduce((sum, key) => sum + (profile[key] || 0), 0);
  return Math.min(score / maxPossible, 1);
}

function calcProbability(egeTotal: number, avgScore: number): number {
  return Math.min(egeTotal / avgScore, 1);
}

function calcRegionMatch(city: string, preferredCity?: string, canRelocate?: boolean): number {
  if (!preferredCity) return 0.7;
  if (city === preferredCity) return 1;
  if (canRelocate) return 0.5;
  return 0.2;
}

function calcFinancialFit(fee: number, budget: number, isBudget: boolean): number {
  if (isBudget) return 1;
  if (budget <= 0) return 0;
  return Math.min(budget / fee, 1);
}

export function getRecommendations(input: StudentInput): FacultyRecommendation[] {
  const results: FacultyRecommendation[] = [];

  for (const uni of universities) {
    for (const fac of uni.faculties) {
      const isBudget = input.egeTotal >= fac.score_budget;
      const targetScore = isBudget ? fac.score_budget : fac.score_paid;

      const profileMatch = calcProfileMatch(input.profile, fac.direction);
      const probability = calcProbability(input.egeTotal, targetScore);
      const regionMatch = calcRegionMatch(uni.city, input.preferredCity, input.canRelocate);
      const financialFit = isBudget ? 1 : calcFinancialFit(fac.fee_paid, input.budget, isBudget);
      const universityRating = uni.ranking / 100;

      const finalScore =
        profileMatch * 0.3 +
        probability * 0.25 +
        regionMatch * 0.15 +
        financialFit * 0.15 +
        universityRating * 0.15;

      results.push({
        university: uni,
        faculty: fac,
        finalScore,
        profileMatch,
        probability,
        regionMatch,
        financialFit,
        universityRating,
        isBudget,
      });
    }
  }

  return results.sort((a, b) => b.finalScore - a.finalScore).slice(0, 5);
}

export function getTopDirection(profile: StudentProfile): Direction {
  const scores: Record<Direction, number> = {
    IT: profile.technical * 2 + profile.analytical,
    Экономика: profile.analytical * 2 + profile.leadership,
    Менеджмент: profile.leadership * 2 + profile.social,
    Юриспруденция: profile.analytical + profile.social * 1.5,
    "Естественные науки": profile.analytical * 2 + profile.technical,
    "Гуманитарные науки": profile.creative * 2 + profile.social,
  };

  return Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0] as Direction;
}

export function getProfilePercentages(profile: StudentProfile): Record<string, number> {
  const max = Math.max(...Object.values(profile), 1);
  return Object.fromEntries(
    Object.entries(profile).map(([key, val]) => [key, Math.round((val / max) * 100)])
  );
}

export default getRecommendations;
