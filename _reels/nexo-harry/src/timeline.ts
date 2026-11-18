import palavras from "../public/palavras.json";

// NEXO — "12 editoras disseram não pro Harry Potter". Tela dividida: história em cima, satisfatório embaixo.
export const FPS = 30;
export const LEAD = 0.3;
// Respiro depois do gancho (tempo bruto da narração, duração extra).
export const GAPS: [number, number][] = [[3.3, 0.35]];
export const o = (t: number) => t + LEAD + GAPS.reduce((s, [at, g]) => s + (t >= at ? g : 0), 0);
export const q = (t: number) => Math.round(t * FPS);
export const VOZ_FIM_RAW = 58.9;
export const TRECHOS: [number, number][] = [0, ...GAPS.map(([at]) => at)].map((a, i, arr) => [a, arr[i + 1] ?? VOZ_FIM_RAW]);
export const FIM_VOZ = o(58.62);
export const MARCA = FIM_VOZ + 0.6;
export const TOTAL = q(MARCA + 3.6);

type W = { text: string; start: number; end: number };
export const WORDS = (palavras as { words: W[] }).words.map((w) => ({ text: w.text, start: o(w.start), end: o(w.end) }));
const limpa = (s: string) => s.toLowerCase().replace(/[.,?!;:…]/g, "");
const wa = (txt: string, n = 0) => {
  const m = WORDS.filter((w) => limpa(w.text) === txt)[n];
  if (!m) throw new Error(`palavra não encontrada: ${txt} #${n}`);
  return m.start;
};
export const T = {
  nao0: wa("não"), harry: wa("harry"),
  ela: wa("ela"), mae: wa("mãe"), desempregada: wa("desempregada"), ajuda: wa("ajuda"), escocia: wa("escócia"),
  escrevia: wa("escrevia"), filha: wa("filha"), mandou: wa("mandou"), editoras2: wa("editoras", 1),
  nao1: wa("não", 1), nao2: wa("não", 2), nao3: wa("não", 3), doze2: wa("doze", 1), nao4: wa("não", 4),
  decima: wa("décima"), aceitou: wa("aceitou"), filha2: wa("filha", 1), oito: wa("oito"), leu: wa("leu"), pediu: wa("pediu"),
  esse: wa("esse"), vendida: wa("vendida"), mais2: wa("mais", 1), q500: wa("500"), copias: wa("cópias"),
  agora: wa("agora"), se: wa("se"), mundo: wa("mundo"), potter2: wa("potter", 1),
  e2: wa("e", 1), voce: wa("você", 0), nao_s: wa("nãos"), ouviu: wa("ouviu"), parou: wa("parou"),
  o_nao: wa("não", 6), fim: wa("fim"), talvez: wa("talvez"), porta: wa("porta"),
  doze3: wa("doze", 2), naoF: wa("não", 8), so: wa("só", 2), sim: wa("sim"), continua: wa("continua"), batendo: wa("batendo"),
  seu: wa("seu"), sim2: wa("sim", 1), proxima: wa("próxima"), porta2: wa("porta", 1),
};

// Cenas da parte de cima.
export const CENA = {
  gancho: [0, T.ela - 0.2],
  mae: [T.ela - 0.2, T.escrevia - 0.12],
  cafe: [T.escrevia - 0.12, T.filha - 0.1],
  placa: [T.filha - 0.1, T.mandou - 0.12],
  envio: [T.mandou - 0.12, T.nao1 - 0.15],
  carimbos: [T.nao1 - 0.15, T.decima - 0.15],
  treze: [T.decima - 0.15, T.filha2 - 0.12],
  leitura: [T.filha2 - 0.12, T.esse - 0.12],
  hogwarts: [T.esse - 0.12, T.mais2 - 0.12],
  vendas: [T.mais2 - 0.12, T.agora - 0.12],
  desistiu: [T.agora - 0.12, T.mundo - 0.1],
  apagou: [T.mundo - 0.1, T.e2 - 0.12],
  voce: [T.e2 - 0.12, T.o_nao - 0.15],
  porta: [T.o_nao - 0.15, T.doze3 - 0.15],
  final: [T.doze3 - 0.15, T.continua - 0.1],
  batendo: [T.continua - 0.1, MARCA],
} as const;

// Carimbos "REJEITADO": 3 nos "não" falados e mais 9 rápidos no "doze vezes não".
export const CARIMBOS: number[] = [T.nao1, T.nao2, T.nao3, ...Array.from({ length: 9 }, (_, i) => T.doze2 + 0.05 + i * 0.1)];

// Vídeos satisfatórios da parte de baixo (Mixkit).
export const BAIXO: { src: string; de: number; ate: number }[] = [
  { src: "c47351", de: 0, ate: 11 },
  { src: "c47346", de: 11, ate: 22 },
  { src: "c47337", de: 22, ate: 33 },
  { src: "c47350", de: 33, ate: 44 },
  { src: "c47351", de: 44, ate: 55 },
  { src: "c47346", de: 55, ate: MARCA + 0.1 },
];

export const SFX: { src: string; at: number; vol?: number }[] = [
  { src: "carimbo", at: T.nao0 - 0.02, vol: 0.55 },
  { src: "el-whoosh", at: CENA.mae[0] - 0.2, vol: 0.3 },
  { src: "papel", at: T.escrevia, vol: 0.3 },
  { src: "el-whoosh", at: CENA.envio[0] - 0.2, vol: 0.3 },
  ...CARIMBOS.map((c, i) => ({ src: "carimbo", at: c - 0.02, vol: i < 3 ? 0.6 : 0.4 })),
  { src: "el-brilho", at: T.decima, vol: 0.45 },
  { src: "papel", at: T.leu, vol: 0.3 },
  { src: "el-whoosh", at: CENA.hogwarts[0] - 0.2, vol: 0.3 },
  { src: "boom", at: T.q500, vol: 0.4 },
  { src: "el-whoosh", at: CENA.desistiu[0] - 0.2, vol: 0.3 },
  { src: "el-whoosh", at: CENA.voce[0] - 0.2, vol: 0.35 },
  { src: "boom", at: T.voce, vol: 0.35 },
  ...[0, 0.3, 0.6].map((d) => ({ src: "carimbo", at: T.nao_s + d - 0.02, vol: 0.4 })),
  { src: "el-whoosh", at: CENA.porta[0] - 0.2, vol: 0.3 },
  { src: "el-porta", at: T.porta - 0.1, vol: 0.35 },
  { src: "el-whoosh", at: CENA.final[0] - 0.2, vol: 0.3 },
  { src: "carimbo", at: T.naoF - 0.02, vol: 0.45 },
  { src: "sim", at: T.sim, vol: 0.5 },
  { src: "porta-bate", at: T.batendo - 0.05, vol: 0.55 },
  { src: "el-brilho", at: T.sim2 - 0.1, vol: 0.45 },
  { src: "el-whoosh", at: MARCA - 0.25, vol: 0.35 },
  { src: "boom", at: MARCA + 0.15, vol: 0.4 },
  { src: "el-brilho", at: MARCA + 0.5, vol: 0.4 },
  { src: "clique", at: MARCA + 2.22, vol: 0.75 },
  { src: "sfx-ding", at: MARCA + 2.32, vol: 0.45 },
];
