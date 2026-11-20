import palavras from "../public/palavras.json";

// ÁLIBI · Caso nº 004 — Massacre de Realengo (Rio de Janeiro, 2011). Sem foto nem destaque ao autor; foco nas vítimas e em quem ajudou.
export const FPS = 30;
export const LEAD = 0.5;
export const GAPS: [number, number][] = [[17.4, 1.0], [18.2, 1.3], [37.0, 1.3], [61.5, 1.3], [78.0, 1.3]];
export const o = (t: number) => t + LEAD + GAPS.reduce((s, [at, g]) => s + (t >= at ? g : 0), 0);
export const q = (t: number) => Math.round(t * FPS);
export const VOZ_FIM_RAW = 101.6;
export const TRECHOS: [number, number][] = [0, ...GAPS.map(([at]) => at)].map((a, i, arr) => [a, arr[i + 1] ?? VOZ_FIM_RAW]);
export const FIM_VOZ = o(101.55);
export const FINAL = FIM_VOZ + 0.6;
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

export const CAPITULOS: [number, string, string][] = [[18.2, "I", "A MANHÃ"], [37.0, "II", "O LADO DE FORA"], [61.5, "III", "OS DOZE"], [78.0, "IV", "O QUE FICOU"]];

export const SFX: { src: string; r?: number; t?: number; vol?: number }[] = [
  { src: "cassete", t: 0.05, vol: 0.8 },
  { src: "coracao", r: 9.4, vol: 0.45 },
  { src: "impacto", r: 10.9, vol: 0.4 },
  { src: "cassete", r: 14.8, vol: 0.6 },
  ...[0, 0.12, 0.25, 0.4, 0.55, 0.7].map((d) => ({ src: "tecla", r: 17.45 + d, vol: 0.35 })),
  ...[18.2, 37.0, 61.5, 78.0].map((r) => ({ src: "impacto", r, vol: 0.3 })),
  { src: "coracao", r: 29.4, vol: 0.45 },
  { src: "subida", r: 38.4, vol: 0.3 },
  { src: "impacto", r: 46.0, vol: 0.35 },
  ...Array.from({ length: 12 }, (_, i) => ({ src: "tique", r: 62.6 + i * 0.35, vol: 0.25 })),
  { src: "tecla", r: 79.2, vol: 0.35 },
  { src: "carimbo", r: 82.2, vol: 0.45 },
  { src: "carimbo", r: 88.3, vol: 0.45 },
  { src: "coracao", r: 99.3, vol: 0.4 },
  { src: "cassete", r: 101.6, vol: 0.6 },
];
