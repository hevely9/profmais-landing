import palavras from "../public/palavras.json";

// ÁLIBI · Caso nº 006 — D. B. Cooper (EUA, 1971). Abertura nítida com o bilhete real (FBI).
export const FPS = 30;
export const LEAD = 0.4;
export const GAPS: [number, number][] = [[19.5, 0.9], [20.4, 1.2], [55.2, 1.2], [80.0, 1.2], [99.0, 1.2], [126.6, 1.2], [155.4, 1.2]];
export const o = (t: number) => t + LEAD + GAPS.reduce((s, [at, g]) => s + (t >= at ? g : 0), 0);
export const q = (t: number) => Math.round(t * FPS);
export const VOZ_FIM_RAW = 193.2;
export const TRECHOS: [number, number][] = [0, ...GAPS.map(([at]) => at)].map((a, i, arr) => [a, arr[i + 1] ?? VOZ_FIM_RAW]);
export const FIM_VOZ = o(193.05);
export const FINAL = FIM_VOZ + 0.5;
export const TOTAL = q(FINAL + 5.0);

type W = { text: string; start: number; end: number };
const RAW = (palavras as { words: W[] }).words;
export const WORDS = RAW.map((w) => ({ text: w.text, start: o(w.start), end: o(w.end) }));
const limpa = (s: string) => s.toLowerCase().replace(/[.,?!;:…]/g, "");
export const w = (txt: string, n = 0) => {
  const m = RAW.filter((x) => limpa(x.text) === txt)[n];
  if (!m) throw new Error(`palavra não encontrada: ${txt} #${n}`);
  return m.start;
};

export const CAPITULOS: [number, string, string][] = [
  [20.4, "I", "O PASSAGEIRO"], [55.2, "II", "AS EXIGÊNCIAS"], [80.0, "III", "O SALTO"],
  [99.0, "IV", "A CAÇADA"], [126.6, "V", "AS PISTAS"], [155.4, "VI", "SEM FIM"],
];

export const SFX: { src: string; r?: number; t?: number; vol?: number }[] = [
  { src: "tecla", t: 0.1, vol: 0.4 },
  { src: "impacto", r: 6.98, vol: 0.4 },
  { src: "trava", r: 10.2, vol: 0.4 },
  { src: "subida", r: 10.6, vol: 0.3 },
  { src: "carimbo", r: 14.3, vol: 0.5 },
  { src: "cassete", r: 16.4, vol: 0.6 },
  ...[0, 0.12, 0.25, 0.4, 0.55, 0.7].map((d) => ({ src: "tecla", r: 19.55 + d, vol: 0.35 })),
  ...[20.4, 55.2, 80.0, 99.0, 126.6, 155.4].map((r) => ({ src: "impacto", r, vol: 0.3 })),
  ...[33.0, 34.0, 35.4, 38.0].map((r) => ({ src: "tecla", r, vol: 0.3 })),
  { src: "coracao", r: 48.6, vol: 0.45 },
  { src: "carimbo", r: 59.0, vol: 0.4 },
  { src: "subida", r: 76.0, vol: 0.3 },
  { src: "impacto", r: 85.6, vol: 0.45 },
  { src: "coracao", r: 92.0, vol: 0.4 },
  { src: "carimbo", r: 107.26, vol: 0.45 },
  { src: "carimbo", r: 121.0, vol: 0.45 },
  ...[130.0, 132.64, 135.26, 137.92].map((r) => ({ src: "tecla", r, vol: 0.3 })),
  { src: "impacto", r: 144.3, vol: 0.4 },
  { src: "carimbo", r: 150.1, vol: 0.45 },
  { src: "impacto", r: 177.1, vol: 0.45 },
  { src: "coracao", r: 186.0, vol: 0.4 },
  { src: "cassete", r: 193.2, vol: 0.6 },
];
