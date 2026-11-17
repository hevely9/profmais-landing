import palavras from "../public/palavras.json";

// Short "Não termine 2027 sem dinheiro" — meta: primeiros 100 inscritos. Segundos de SAÍDA.
export const FPS = 30;
export const LEAD = 0.2;
// Respiros: depois do gancho ("...sem dinheiro.") a fala segura um tempo antes de seguir.
export const GAPS: [number, number][] = [[6.4, 0.6]];
export const o = (t: number) => t + LEAD + GAPS.reduce((s, [at, g]) => s + (t >= at ? g : 0), 0);
// Trechos da narração (tempo bruto) para tocar com os respiros.
export const VOZ_FIM_RAW = 59.7;
export const TRECHOS: [number, number][] = [0, ...GAPS.map(([at]) => at)].map((a, i, arr) => [a, arr[i + 1] ?? VOZ_FIM_RAW]);
export const q = (t: number) => Math.round(t * FPS);
export const FIM_VOZ = o(59.6);
// Tela final da marca NEXO depois da última fala.
export const MARCA = FIM_VOZ + 0.35;
export const TOTAL = q(MARCA + 3.0);

type W = { text: string; start: number; end: number };
export const WORDS = (palavras as { words: W[] }).words.map((w) => ({ text: w.text, start: o(w.start), end: o(w.end) }));
const limpa = (s: string) => s.toLowerCase().replace(/[.,?!;:…]/g, "");
const wa = (txt: string, n = 0) => {
  const m = WORDS.filter((w) => limpa(w.text) === txt)[n];
  if (!m) throw new Error(`palavra não encontrada: ${txt} #${n}`);
  return m.start;
};
export const T = {
  dinheiro: wa("dinheiro"), seis: wa("seis"), naoVai: wa("vai", 1),
  p1: wa("um"), p2: wa("dois"), p3: wa("três"), p4: wa("quatro"), p5: wa("cinco"), p6: wa("seis", 1),
  parecer: wa("parecer"), canal: wa("esse"), cem: wa("100"), inscreve: wa("inscreve"), comenta: wa("comenta"), meuAno: wa("é", 2), bora: wa("bora"),
};

// Passos: número, título na tela e tempo.
export const PASSOS = [
  { n: 1, titulo: "ANOTE TUDO", sub: "30 dias, cada real", de: T.p1, ate: T.p2 },
  { n: 2, titulo: "DÍVIDA CARA PRIMEIRO", sub: "cartão e cheque especial", de: T.p2, ate: T.p3 },
  { n: 3, titulo: "RESERVA DE EMERGÊNCIA", sub: "imprevisto não vira dívida", de: T.p3, ate: T.p4 },
  { n: 4, titulo: "PAGUE-SE PRIMEIRO", sub: "recebeu? guardou.", de: T.p4, ate: T.p5 },
  { n: 5, titulo: "AUMENTE A RENDA", sub: "cortar gasto tem limite", de: T.p5, ate: T.p6 },
  { n: 6, titulo: "PARECER RICO ≠ FICAR RICO", sub: "o mais difícil", de: T.p6, ate: T.canal },
];

// Clipes (Mixkit, licença livre) — quando entra cada um.
export const SHOTS: { src: string; de: number; ate: number; from?: number }[] = [
  { src: "c4064", de: 0, ate: o(2.5) },
  { src: "c18263", de: o(2.5), ate: T.p1 - 0.05, from: 1 },
  { src: "c1737", de: T.p1 - 0.05, ate: T.p2 - 0.05, from: 2 },
  { src: "c38482", de: T.p2 - 0.05, ate: T.p3 - 0.05, from: 1 },
  { src: "c47734", de: T.p3 - 0.05, ate: T.p4 - 0.05, from: 3 },
  { src: "c24354", de: T.p4 - 0.05, ate: T.p5 - 0.05, from: 2 },
  { src: "c16215", de: T.p5 - 0.05, ate: T.p6 - 0.05, from: 2 },
  { src: "c31086", de: T.p6 - 0.05, ate: T.parecer - 0.4 },
  { src: "c4076", de: T.parecer - 0.4, ate: T.canal - 0.05, from: 1 },
  { src: "c35133", de: T.canal - 0.05, ate: T.inscreve - 0.3, from: 2 },
  { src: "c36791", de: T.inscreve - 0.3, ate: TOTAL / FPS + 1, from: 1 },
];

export const SFX: { src: string; at: number; vol?: number }[] = [
  { src: "boom", at: 0.05, vol: 0.55 },
  { src: "boom", at: T.dinheiro - 0.05, vol: 0.4 },
  ...PASSOS.map((p) => ({ src: "el-whoosh", at: p.de - 0.25, vol: 0.4 })),
  ...PASSOS.map((p) => ({ src: "sfx-massinha", at: p.de + 0.02, vol: 0.35 })),
  { src: "boom", at: T.parecer, vol: 0.35 },
  { src: "el-brilho", at: T.cem - 0.2, vol: 0.45 },
  { src: "clique", at: T.inscreve + 0.35, vol: 0.6 },
  { src: "sfx-ding", at: T.inscreve + 0.4, vol: 0.4 },
  { src: "sfx-massinha", at: T.comenta + 0.1, vol: 0.4 },
  { src: "el-whoosh", at: MARCA - 0.25, vol: 0.4 },
  { src: "boom", at: MARCA + 0.15, vol: 0.45 },
  { src: "el-brilho", at: MARCA + 0.5, vol: 0.4 },
];
