import palavras from "../public/palavras.json";

// ÁLIBI · Caso nº 001 (Murdaugh). Tempos "r" = narração bruta; o(r) = tempo no vídeo.
export const FPS = 30;
export const LEAD = 0.5;
export const GAPS: [number, number][] = [[19.0, 0.8]]; // respiro para a cartela do caso
export const o = (t: number) => t + LEAD + GAPS.reduce((s, [at, g]) => s + (t >= at ? g : 0), 0);
export const q = (t: number) => Math.round(t * FPS);
export const VOZ_FIM_RAW = 136.6;
export const TRECHOS: [number, number][] = [0, ...GAPS.map(([at]) => at)].map((a, i, arr) => [a, arr[i + 1] ?? VOZ_FIM_RAW]);
export const FIM_VOZ = o(136.3);
export const FINAL = FIM_VOZ + 0.5;
export const TOTAL = q(FINAL + 5.0);

type W = { text: string; start: number; end: number };
export const WORDS = (palavras as { words: W[] }).words.map((w) => ({ text: w.text, start: o(w.start), end: o(w.end) }));

// Cenas em tempo bruto [de, até].
export const R = {
  gancho: [0, 15.9], pergunta: [15.9, 18.55], cartela: [18.55, 19.75], nome: [19.75, 29.85], noite: [29.85, 40.2], ligacao: [40.2, 45.0],
  ficha: [45.0, 62.0], minuto: [62.0, 69.4], h2044: [69.4, 77.2], h2049: [77.2, 84.4], vozes: [84.4, 94.98], tribunal: [94.98, 101.85],
  mentiu: [101.85, 113.0], virada: [113.0, 127.0], fecho: [127.0, 137.0],
} as const;

export const SFX: { src: string; r?: number; t?: number; vol?: number }[] = [
  { src: "cassete", t: 0.05, vol: 0.8 },
  { src: "coracao", r: 5.5, vol: 0.5 },
  { src: "trava", r: 6.94, vol: 0.4 },
  { src: "subida", r: 12.0, vol: 0.35 },
  { src: "impacto", r: 14.3, vol: 0.45 },
  { src: "cassete", r: 15.8, vol: 0.6 },
  ...[0, 0.12, 0.25, 0.4, 0.55, 0.7, 0.86, 1.0].map((d) => ({ src: "tecla", r: 18.6 + d, vol: 0.35 })),
  { src: "impacto", r: 30.85, vol: 0.35 },
  { src: "coracao", r: 37.1, vol: 0.45 },
  ...[47.18, 48.12, 49.46, 51.34].map((x) => ({ src: "tecla", r: x, vol: 0.35 })),
  { src: "carimbo", r: 57.06, vol: 0.4 },
  { src: "impacto", r: 60.52, vol: 0.35 },
  ...[62.4, 63.4, 64.4, 65.4, 66.4, 67.4, 68.4].map((x) => ({ src: "tique", r: x, vol: 0.35 })),
  { src: "impacto", r: 69.62, vol: 0.4 },
  { src: "trava", r: 71.74, vol: 0.35 },
  { src: "impacto", r: 77.38, vol: 0.4 },
  { src: "trava", r: 79.76, vol: 0.55 },
  { src: "trava", r: 81.54, vol: 0.55 },
  { src: "coracao", r: 82.5, vol: 0.55 },
  { src: "coracao", r: 83.6, vol: 0.4 },
  { src: "subida", r: 92.6, vol: 0.4 },
  { src: "impacto", r: 94.7, vol: 0.55 },
  { src: "carimbo", r: 102.0, vol: 0.6 },
  { src: "impacto", r: 111.02, vol: 0.5 },
  { src: "subida", r: 111.2, vol: 0.3 },
  { src: "carimbo", r: 119.04, vol: 0.55 },
  { src: "impacto", r: 124.78, vol: 0.4 },
  { src: "coracao", r: 130.3, vol: 0.45 },
  { src: "cassete", r: 136.3, vol: 0.6 },
];
