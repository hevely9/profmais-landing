import palavras from "../public/palavras.json";

// ÁLIBI · Caso nº 002 — Hinterkaifeck (Baviera, 1922). r = tempo bruto da narração; o(r) = tempo no vídeo.
export const FPS = 30;
export const LEAD = 0.5;
// Respiros: cartela do caso + cartelas de capítulo (nas pausas naturais da voz).
export const GAPS: [number, number][] = [[27.4, 1.0], [28.3, 1.4], [58.0, 1.5], [95.0, 1.5], [115.6, 1.5], [137.2, 1.5], [179.6, 1.5]];
export const o = (t: number) => t + LEAD + GAPS.reduce((s, [at, g]) => s + (t >= at ? g : 0), 0);
export const q = (t: number) => Math.round(t * FPS);
export const VOZ_FIM_RAW = 225.3;
export const TRECHOS: [number, number][] = [0, ...GAPS.map(([at]) => at)].map((a, i, arr) => [a, arr[i + 1] ?? VOZ_FIM_RAW]);
export const FIM_VOZ = o(225.0);
export const FINAL = FIM_VOZ + 0.5;
export const TOTAL = q(FINAL + 5.0);

type W = { text: string; start: number; end: number };
export const WORDS = (palavras as { words: W[] }).words.map((w) => ({ text: w.text, start: o(w.start), end: o(w.end) }));

// Capítulos: [início do respiro (bruto), número, título]
export const CAPITULOS: [number, string, string][] = [
  [28.3, "I", "A FAZENDA"], [58.0, "II", "OS SINAIS"], [95.0, "III", "A NOITE"],
  [115.6, "IV", "OS DIAS SEGUINTES"], [137.2, "V", "O VIZINHO"], [179.6, "VI", "SEM SOLUÇÃO"],
];

export const SFX: { src: string; r?: number; t?: number; vol?: number }[] = [
  { src: "cassete", t: 0.05, vol: 0.8 },
  { src: "passos", r: 9.6, vol: 0.55 },
  { src: "coracao", r: 13.0, vol: 0.45 },
  { src: "impacto", r: 15.6, vol: 0.45 },
  { src: "coracao", r: 21.4, vol: 0.5 },
  { src: "cassete", r: 24.8, vol: 0.6 },
  ...[0, 0.12, 0.25, 0.4, 0.55, 0.7, 0.86].map((d) => ({ src: "tecla", r: 27.45 + d * 0.9, vol: 0.35 })),
  ...[28.3, 58.0, 95.0, 115.6, 137.2, 179.6].map((r) => ({ src: "impacto", r, vol: 0.32 })),
  ...[72.14, 73.6, 75.56, 78.88].map((r) => ({ src: "tecla", r, vol: 0.35 })),
  { src: "carimbo", r: 81.92, vol: 0.45 },
  { src: "coracao", r: 92.4, vol: 0.5 },
  { src: "impacto", r: 104.34, vol: 0.5 },
  ...[0, 1, 2, 3].map((d) => ({ src: "tique", r: 131.0 + d * 0.8, vol: 0.4 })),
  { src: "carimbo", r: 159.6, vol: 0.55 },
  { src: "carimbo", r: 171.3, vol: 0.45 },
  { src: "subida", r: 177.0, vol: 0.3 },
  { src: "tecla", r: 194.84, vol: 0.4 },
  { src: "coracao", r: 212.6, vol: 0.45 },
  { src: "cassete", r: 225.0, vol: 0.6 },
];
