import palavras from "../public/palavras.json";

// "Iderlindo Lopes — O legado de quem ensina". Segundos de SAÍDA.
export const FPS = 30;
export const LEAD = 0.6;
// Respiros entre parágrafos (tempo da narração, duração). O maior vem antes do nome.
export const GAPS: [number, number][] = [[7.6, 0.5], [14.1, 0.5], [21.5, 0.6], [32.9, 1.0], [42.15, 0.6]];
export const o = (t: number) => t + LEAD + GAPS.reduce((s, [at, g]) => s + (t >= at ? g : 0), 0);
export const q = (t: number) => Math.round(t * FPS);
export const VOZ_FIM_RAW = 50.0;
export const FIM_VOZ = o(VOZ_FIM_RAW);
export const TOTAL = q(FIM_VOZ + 5.2);

type W = { text: string; start: number; end: number };
export const WORDS = (palavras as { words: W[] }).words.map((w) => ({ text: w.text, start: o(w.start), end: o(w.end) }));
const limpa = (s: string) => s.toLowerCase().replace(/[.,?!;:]/g, "");
const wa = (txt: string, n = 0) => {
  const m = WORDS.filter((w) => limpa(w.text) === txt)[n];
  if (!m) throw new Error(`palavra não encontrada: ${txt} #${n}`);
  return m.start;
};
export const T = {
  pessoas: wa("pessoas"), passam: wa("passam"), ensinando: wa("ensinando"), conteudos: wa("conteúdos"),
  outras: wa("outras"), tempo: wa("tempo"), apagar: wa("apagar"),
  porque: wa("porque"), apenas: wa("apenas"), palavras: wa("palavras"), teorias: wa("teorias"), quadro: wa("quadro"),
  e: wa("é"), despertar: wa("despertar"), abrir: wa("abrir"), plantar: wa("plantar"), crescendo: wa("crescendo"), aula: wa("aula"), terminar: wa("terminar"),
  na: wa("na"), jornada: wa("jornada"), descoberta: wa("descoberta"), ensinamento: wa("ensinamento"), perspectiva: wa("perspectiva"),
  aluno: wa("aluno"), levar: wa("levar"), aprendeu: wa("aprendeu"),
  iderlindo: wa("iderlindo"), professor: wa("professor"), letras: wa("letras"), acima: wa("acima"), palavras2: wa("palavras", 1), transformacao: wa("transformação"),
  porque2: wa("porque", 1), verdadeiro: wa("verdadeiro"), sala: wa("sala"), permanece: wa("permanece"), tocados: wa("tocados"),
};

export const CENA = {
  passam: { de: 0, ate: T.outras - 0.2 },
  apagar: { de: T.outras - 0.2, ate: T.porque - 0.25 },
  apenas: { de: T.porque - 0.25, ate: T.e - 0.25 },
  semente: { de: T.e - 0.25, ate: T.na - 0.25 },
  jornada: { de: T.na - 0.25, ate: T.iderlindo - 0.55 },
  mestre: { de: T.iderlindo - 0.55, ate: T.porque2 - 0.25 },
  permanece: { de: T.porque2 - 0.25, ate: FIM_VOZ + 0.35 },
  fim: { de: FIM_VOZ + 0.35, ate: TOTAL / FPS + 1 },
};

export const SFX: { src: string; at: number; vol?: number }[] = [
  ...[0, 1, 2, 3].map((i) => ({ src: "sfx-lapis", at: T.pessoas + i * 0.62, vol: 0.28 })),
  { src: "papel", at: T.apagar - 0.25, vol: 0.4 },
  { src: "esp-brilho", at: T.apagar + 0.45, vol: 0.3 },
  { src: "sfx-whoosh", at: CENA.apenas.de - 0.25, vol: 0.22 },
  { src: "sfx-massinha", at: T.palavras - 0.05, vol: 0.3 }, { src: "sfx-massinha", at: T.teorias - 0.05, vol: 0.3 }, { src: "sfx-lapis", at: T.quadro - 0.05, vol: 0.3 },
  { src: "sfx-whoosh", at: CENA.semente.de - 0.25, vol: 0.22 },
  { src: "esp-brilho", at: T.despertar + 0.1, vol: 0.3 },
  { src: "esp-toque", at: T.plantar + 0.15, vol: 0.35 },
  { src: "esp-brilho", at: T.crescendo, vol: 0.25 },
  { src: "sfx-whoosh", at: CENA.jornada.de - 0.25, vol: 0.22 },
  { src: "esp-brilho", at: T.descoberta + 0.1, vol: 0.28 },
  { src: "sfx-whoosh", at: T.perspectiva - 0.1, vol: 0.2 },
  { src: "sfx-whoosh", at: CENA.mestre.de - 0.3, vol: 0.28 },
  { src: "esp-brilho", at: T.iderlindo - 0.1, vol: 0.4 },
  { src: "sfx-lapis", at: T.acima, vol: 0.28 },
  { src: "esp-brilho", at: T.transformacao + 0.2, vol: 0.32 },
  { src: "sfx-whoosh", at: CENA.permanece.de - 0.25, vol: 0.22 },
  { src: "esp-brilho", at: T.tocados, vol: 0.3 },
  { src: "esp-brilho", at: CENA.fim.de + 0.2, vol: 0.35 },
];
