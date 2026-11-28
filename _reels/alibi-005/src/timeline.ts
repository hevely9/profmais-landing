import palavras from "../public/palavras.json";

// ÁLIBI · Caso nº 005 — "Ache a mentira" (formato interativo). Caso Dabate / Fitbit (Connecticut, 2015).
export const FPS = 30;
export const LEAD = 0.5;
// cartela, capítulos e a PAUSA interativa (contagem regressiva em silêncio)
export const PAUSA_RAW = 66.0, PAUSA_DUR = 5.0;
export const GAPS: [number, number][] = [[15.1, 1.0], [15.9, 1.2], [45.0, 1.2], [PAUSA_RAW, PAUSA_DUR], [86.1, 1.2]];
export const o = (t: number) => t + LEAD + GAPS.reduce((s, [at, g]) => s + (t >= at ? g : 0), 0);
export const q = (t: number) => Math.round(t * FPS);
export const VOZ_FIM_RAW = 115.45;
export const TRECHOS: [number, number][] = [0, ...GAPS.map(([at]) => at)].map((a, i, arr) => [a, arr[i + 1] ?? VOZ_FIM_RAW]);
export const FIM_VOZ = o(115.3);
export const FINAL = FIM_VOZ + 0.5;
export const TOTAL = q(FINAL + 5.0);
export const PAUSA_T0 = o(PAUSA_RAW) - PAUSA_DUR; // início da contagem (tempo de vídeo)

type W = { text: string; start: number; end: number };
const RAW = (palavras as { words: W[] }).words;
export const WORDS = RAW.map((w) => ({ text: w.text, start: o(w.start), end: o(w.end) }));
const limpa = (s: string) => s.toLowerCase().replace(/[.,?!;:…]/g, "");
export const w = (txt: string, n = 0) => {
  const m = RAW.filter((x) => limpa(x.text) === txt)[n];
  if (!m) throw new Error(`palavra não encontrada: ${txt} #${n}`);
  return m.start;
};

export const CAPITULOS: [number, string, string][] = [[15.9, "I", "A VERSÃO DELE"], [45.0, "II", "AS PISTAS"], [86.1, "IV", "O VEREDITO"]];

export const SFX: { src: string; r?: number; t?: number; vol?: number }[] = [
  // contagem regressiva da pausa: um tique por segundo
  ...[0.2, 1.0, 1.8, 2.6, 3.4].map((d) => ({ src: "tique", t: o(66.0) - 5.0 + d, vol: 0.55 })),
  { src: "cassete", t: 0.05, vol: 0.8 },
  { src: "coracao", r: 4.0, vol: 0.45 },
  { src: "cassete", r: 12.6, vol: 0.6 },
  ...[0, 0.12, 0.25, 0.4, 0.55, 0.7].map((d) => ({ src: "tecla", r: 15.15 + d, vol: 0.35 })),
  ...[15.9, 45.0, 86.1].map((r) => ({ src: "impacto", r, vol: 0.3 })),
  { src: "trava", r: 37.6, vol: 0.4 },
  ...[47.82, 53.24, 57.42].map((r) => ({ src: "carimbo", r, vol: 0.35 })),
  { src: "subida", r: 64.6, vol: 0.3 },
  { src: "impacto", r: 70.42, vol: 0.4 },
  { src: "carimbo", r: 84.5, vol: 0.5 },
  { src: "impacto", r: 93.38, vol: 0.4 },
  { src: "coracao", r: 110.2, vol: 0.4 },
  { src: "cassete", r: 115.4, vol: 0.6 },
];
