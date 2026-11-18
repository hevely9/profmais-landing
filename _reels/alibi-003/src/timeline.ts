import palavras from "../public/palavras.json";
import palavrasIns from "../public/palavras-insercao.json";

// ÁLIBI · Caso nº 003 — BTK, Dennis Rader (Wichita, Kansas). r = tempo bruto da narração; o(r) = tempo no vídeo.
export const FPS = 30;
export const LEAD = 0.5;
// Inserção (pedido do usuário): trecho sobre o método do BTK, encaixado depois de "B-T-K." (bruto 77.0).
export const INS_RAW = 77.0, INS_DUR = 27.0;
export const GAPS: [number, number][] = [[18.9, 1.0], [19.6, 1.4], [51.8, 1.5], [INS_RAW, INS_DUR], [94.3, 1.5], [122.6, 1.5], [170.0, 1.5], [211.9, 1.5]];
export const o = (t: number) => t + LEAD + GAPS.reduce((s, [at, g]) => s + (t >= at ? g : 0), 0);
export const q = (t: number) => Math.round(t * FPS);
export const VOZ_FIM_RAW = 249.4;
export const TRECHOS: [number, number][] = [0, ...GAPS.map(([at]) => at)].map((a, i, arr) => [a, arr[i + 1] ?? VOZ_FIM_RAW]);
export const FIM_VOZ = o(249.25);
export const FINAL = FIM_VOZ + 0.5;
export const TOTAL = q(FINAL + 5.0);

type W = { text: string; start: number; end: number };
const RAW = (palavras as { words: W[] }).words;
// início (tempo de vídeo) do trecho inserido
export const INS_T0 = o(INS_RAW) - INS_DUR + 0.2;
export const WORDS = [
  ...RAW.map((w) => ({ text: w.text, start: o(w.start), end: o(w.end) })),
  ...(palavrasIns as { words: W[] }).words.map((w) => ({ text: w.text, start: INS_T0 + w.start, end: INS_T0 + w.end })),
].sort((a, b) => a.start - b.start);
const limpa = (s: string) => s.toLowerCase().replace(/[.,?!;:…]/g, "");
// início BRUTO da n-ésima ocorrência de uma palavra
export const w = (txt: string, n = 0) => {
  const m = RAW.filter((x) => limpa(x.text) === txt)[n];
  if (!m) throw new Error(`palavra não encontrada: ${txt} #${n}`);
  return m.start;
};

export const CAPITULOS: [number, string, string][] = [
  [19.6, "I", "O HOMEM COMUM"], [51.8, "II", "A ASSINATURA"], [94.3, "III", "A VOLTA"],
  [122.6, "IV", "A PERGUNTA"], [170.0, "V", "A PROVA"], [211.9, "VI", "O FIM"],
];

export const SFX: { src: string; r?: number; t?: number; vol?: number; d?: number }[] = [
  { src: "cassete", t: 0.05, vol: 0.8 },
  { src: "coracao", r: 6.5, vol: 0.5 },
  { src: "impacto", r: 13.6, vol: 0.45 },
  { src: "cassete", r: 15.6, vol: 0.6 },
  ...[0, 0.12, 0.25, 0.4, 0.55, 0.7, 0.86].map((d) => ({ src: "tecla", r: 18.95 + d * 0.8, vol: 0.35 })),
  ...[19.6, 51.8, 94.3, 122.6, 170.0, 211.9].map((r) => ({ src: "impacto", r, vol: 0.32 })),
  ...[0, 1, 2, 3, 4].map((d) => ({ src: "tecla", r: 26.0 + d * 1.6, vol: 0.3 })),
  { src: "tecla", r: 47.6, vol: 0.35 },
  { src: "impacto", r: 75.56, vol: 0.4 },
  // trecho inserido (tempo de vídeo relativo ao início da inserção)
  ...[3.0, 3.9, 4.8, 10.9].map((d) => ({ src: "carimbo", t: INS_T0 + d, vol: 0.32 })),
  ...[6.1, 8.5, 13.3, 15.6, 17.0, 18.3, 20.8, 22.7].map((d) => ({ src: "tecla", t: INS_T0 + d, vol: 0.3 })),
  { src: "coracao", r: 83.0, vol: 0.45 },
  ...[0, 1, 2, 3, 4, 5].map((d) => ({ src: "tique", r: 88.0 + d * 0.9, vol: 0.35 })),
  { src: "trava", r: 104.0, vol: 0.4 },
  { src: "tecla", r: 142.2, vol: 0.4 },
  { src: "carimbo", r: 144.56, vol: 0.55 },
  { src: "trava", r: 147.0, vol: 0.45 },
  ...[0, 0.3, 0.6, 0.9].map((d) => ({ src: "tecla", r: 157.6 + d, vol: 0.3 })),
  { src: "impacto", r: 164.6, vol: 0.45 },
  { src: "coracao", r: 178.6, vol: 0.45 },
  { src: "carimbo", r: 192.5, vol: 0.5 },
  { src: "impacto", r: 203.2, vol: 0.5 },
  { src: "carimbo", r: 216.0, vol: 0.5 },
  { src: "impacto", r: 225.0, vol: 0.45 },
  { src: "coracao", r: 244.3, vol: 0.45 },
  { src: "cassete", r: 249.3, vol: 0.6 },
];
