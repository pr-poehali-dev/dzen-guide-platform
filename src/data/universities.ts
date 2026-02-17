export interface Faculty {
  id: number;
  name: string;
  direction: string;
  subjects: string[];
  score_budget: number;
  score_paid: number;
  fee_paid: number;
}

export interface University {
  id: number;
  name: string;
  city: string;
  ranking: number;
  faculties: Faculty[];
}

export const universities: University[] = [
  {
    id: 1,
    name: "МГУ им. Ломоносова",
    city: "Москва",
    ranking: 100,
    faculties: [
      { id: 101, name: "ВМК", direction: "IT", subjects: ["Рус", "Матем", "Информ"], score_budget: 295, score_paid: 250, fee_paid: 767000 },
      { id: 102, name: "Юридический", direction: "Юриспруденция", subjects: ["Рус", "Обществ", "История"], score_budget: 280, score_paid: 240, fee_paid: 600000 },
      { id: 103, name: "Экономический", direction: "Экономика", subjects: ["Рус", "Матем", "Обществ"], score_budget: 285, score_paid: 245, fee_paid: 650000 },
    ],
  },
  {
    id: 2,
    name: "НИУ ВШЭ",
    city: "Москва",
    ranking: 93,
    faculties: [
      { id: 201, name: "Экономика", direction: "Экономика", subjects: ["Рус", "Матем", "Обществ"], score_budget: 289, score_paid: 235, fee_paid: 520000 },
      { id: 202, name: "Прикладная математика", direction: "IT", subjects: ["Рус", "Матем", "Информ"], score_budget: 292, score_paid: 240, fee_paid: 580000 },
      { id: 203, name: "Менеджмент", direction: "Менеджмент", subjects: ["Рус", "Матем", "Обществ"], score_budget: 275, score_paid: 220, fee_paid: 480000 },
    ],
  },
  {
    id: 3,
    name: "СПбГУ",
    city: "Санкт-Петербург",
    ranking: 95,
    faculties: [
      { id: 301, name: "Математика и ИТ", direction: "IT", subjects: ["Рус", "Матем", "Информ"], score_budget: 282, score_paid: 230, fee_paid: 400000 },
      { id: 302, name: "Биология", direction: "Естественные науки", subjects: ["Рус", "Биология", "Химия"], score_budget: 260, score_paid: 210, fee_paid: 350000 },
      { id: 303, name: "Филология", direction: "Гуманитарные науки", subjects: ["Рус", "Литература", "История"], score_budget: 268, score_paid: 215, fee_paid: 320000 },
    ],
  },
  {
    id: 4,
    name: "МФТИ",
    city: "Москва",
    ranking: 92,
    faculties: [
      { id: 401, name: "Прикладная физика", direction: "Естественные науки", subjects: ["Рус", "Матем", "Физика"], score_budget: 290, score_paid: 245, fee_paid: 450000 },
      { id: 402, name: "Информатика", direction: "IT", subjects: ["Рус", "Матем", "Информ"], score_budget: 296, score_paid: 255, fee_paid: 500000 },
    ],
  },
  {
    id: 5,
    name: "ИТМО",
    city: "Санкт-Петербург",
    ranking: 88,
    faculties: [
      { id: 501, name: "ИТ и программирование", direction: "IT", subjects: ["Рус", "Матем", "Информ"], score_budget: 288, score_paid: 240, fee_paid: 380000 },
      { id: 502, name: "Фотоника", direction: "Естественные науки", subjects: ["Рус", "Матем", "Физика"], score_budget: 265, score_paid: 215, fee_paid: 350000 },
    ],
  },
  {
    id: 6,
    name: "НГУ",
    city: "Новосибирск",
    ranking: 85,
    faculties: [
      { id: 601, name: "Механико-математический", direction: "IT", subjects: ["Рус", "Матем", "Информ"], score_budget: 268, score_paid: 220, fee_paid: 250000 },
      { id: 602, name: "Экономический", direction: "Экономика", subjects: ["Рус", "Матем", "Обществ"], score_budget: 255, score_paid: 210, fee_paid: 220000 },
    ],
  },
  {
    id: 7,
    name: "КФУ",
    city: "Казань",
    ranking: 82,
    faculties: [
      { id: 701, name: "Юридический", direction: "Юриспруденция", subjects: ["Рус", "Обществ", "История"], score_budget: 250, score_paid: 200, fee_paid: 180000 },
      { id: 702, name: "ИТиМО", direction: "IT", subjects: ["Рус", "Матем", "Информ"], score_budget: 255, score_paid: 205, fee_paid: 200000 },
    ],
  },
  {
    id: 8,
    name: "УрФУ",
    city: "Екатеринбург",
    ranking: 80,
    faculties: [
      { id: 801, name: "ИРИТ-РтФ", direction: "IT", subjects: ["Рус", "Матем", "Информ"], score_budget: 250, score_paid: 200, fee_paid: 210000 },
      { id: 802, name: "Гуманитарный институт", direction: "Гуманитарные науки", subjects: ["Рус", "Литература", "История"], score_budget: 238, score_paid: 190, fee_paid: 170000 },
    ],
  },
  {
    id: 9,
    name: "ТГУ",
    city: "Томск",
    ranking: 83,
    faculties: [
      { id: 901, name: "Физический", direction: "Естественные науки", subjects: ["Рус", "Матем", "Физика"], score_budget: 245, score_paid: 200, fee_paid: 180000 },
      { id: 902, name: "Менеджмент", direction: "Менеджмент", subjects: ["Рус", "Матем", "Обществ"], score_budget: 240, score_paid: 195, fee_paid: 170000 },
    ],
  },
  {
    id: 10,
    name: "РАНХиГС",
    city: "Москва",
    ranking: 84,
    faculties: [
      { id: 1001, name: "Государственное управление", direction: "Менеджмент", subjects: ["Рус", "Матем", "Обществ"], score_budget: 270, score_paid: 220, fee_paid: 420000 },
      { id: 1002, name: "Экономика", direction: "Экономика", subjects: ["Рус", "Матем", "Обществ"], score_budget: 265, score_paid: 215, fee_paid: 380000 },
    ],
  },
];

export const directions = ["IT", "Экономика", "Менеджмент", "Юриспруденция", "Естественные науки", "Гуманитарные науки"] as const;

export type Direction = (typeof directions)[number];

export const directionEmojis: Record<Direction, string> = {
  IT: "💻",
  Экономика: "📊",
  Менеджмент: "📋",
  Юриспруденция: "⚖️",
  "Естественные науки": "🔬",
  "Гуманитарные науки": "📚",
};

export const cityCoords: Record<string, { x: number; y: number }> = {
  Москва: { x: 37, y: 42 },
  "Санкт-Петербург": { x: 32, y: 32 },
  Новосибирск: { x: 62, y: 45 },
  Казань: { x: 45, y: 42 },
  Екатеринбург: { x: 52, y: 40 },
  Томск: { x: 63, y: 42 },
};

export default universities;
