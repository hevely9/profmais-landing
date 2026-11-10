import palavras from "../public/palavras.json";

// Tudo em segundos de SAÍDA. A voz (áudio original limpo) entra com LEAD de atraso.
export const FPS = 30;
export const LEAD = 0.3;
export const VOZ_FIM = 37.15;
export const o = (t: number) => t + LEAD;
export const q = (t: number) => Math.round(t * FPS);
// Tela final da marca (Explica Farmácia) entra logo depois da última palavra.
export const FIM = o(VOZ_FIM) + 0.1;
export const TOTAL = Math.ceil((FIM + 3.7) * FPS);

type W = { text: string; start: number; end: number };
export const WORDS = (palavras as { words: W[] }).words.map((w) => ({ text: w.text, start: o(w.start), end: o(w.end) }));
const limpa = (s: string) => s.toLowerCase().replace(/[.,?!;:]/g, "");
const wa = (txt: string, n = 0) => {
  const m = WORDS.filter((w) => limpa(w.text) === txt)[n];
  if (!m) throw new Error(`palavra não encontrada: ${txt} #${n}`);
  return m.start;
};

// Momentos-chave, presos à fala (transcrição com tempo por palavra).
export const T = {
  cosmeticos: wa("cosméticos"), descrito: wa("descrito"), rotulos: wa("rótulos"), embalagens: wa("embalagens"),
  pao: wa("esse"), potinho: wa("potinho"), tempo: wa("tempo"), aberto: wa("aberto"),
  coelho: wa("o", 2), coelhinho: wa("coelhinho"), testado: wa("testado"), animais: wa("animais"),
  tri: wa("esse", 1), triangular: wa("triangular"), identif: wa("identificação"), recic1: wa("reciclagem"),
  amp: wa("a", 1), ampulheta: wa("ampulheta"), validade: wa("validade"), conferir: wa("conferir"), data: wa("data"),
  verde: wa("esse", 2), setas: wa("setas"), empresa: wa("empresa"), financ: wa("financeiramente"), recic2: wa("reciclagem", 1),
  agora: wa("agora"), ler: wa("ler"), salva: wa("salva"), lembrar: wa("lembrar"),
};

// Blocos (cada símbolo tem um "cartão" grande que entra e sai).
export const SEG = {
  pao: { de: T.pao - 0.25, ate: T.coelho - 0.2 },
  coelho: { de: T.coelho - 0.2, ate: T.tri - 0.2 },
  tri: { de: T.tri - 0.2, ate: T.amp - 0.2 },
  amp: { de: T.amp - 0.2, ate: T.validade + 1.5 },
  verde: { de: T.verde - 0.1, ate: T.agora - 0.25 },
};

// Embalagem (coordenadas do "mundo" 1080×1920).
export const ICON_Y = 1222;
export const ICON_X = [365, 452.5, 540, 627.5, 715];
export const VAL = { x: 413, y: 1350 };

// Câmera: cada chave começa a se mover em `t` e chega em `d` segundos.
export type Cam = { s: number; px: number; py: number; sx: number; sy: number };
const wide: Cam = { s: 0.78, px: 540, py: 980, sx: 540, sy: 905 };
const row = (i: number): Cam => ({ s: 1.9, px: ICON_X[i], py: ICON_Y, sx: 540, sy: 1150 });
export const CAM: { t: number; d: number; c: Cam }[] = [
  { t: 0, d: 0, c: wide },
  { t: T.rotulos - 0.35, d: 0.8, c: { s: 1.5, px: 540, py: 800, sx: 540, sy: 880 } },
  { t: SEG.pao.de - 0.45, d: 0.75, c: row(0) },
  { t: SEG.coelho.de - 0.3, d: 0.6, c: row(1) },
  { t: SEG.tri.de - 0.3, d: 0.6, c: row(2) },
  { t: SEG.amp.de - 0.3, d: 0.6, c: row(3) },
  { t: T.validade + 1.35, d: 0.7, c: { s: 2.3, px: VAL.x, py: VAL.y, sx: 540, sy: 900 } },
  { t: SEG.verde.de - 0.35, d: 0.65, c: row(4) },
  { t: T.agora - 0.3, d: 0.8, c: wide },
];
export const CUTS = CAM.slice(1).map((k) => k.t);

// Efeitos sonoros (reaproveitados da biblioteca dos Reels anteriores).
const pre = 0.06;
export const SFX: { src: string; at: number; vol?: number }[] = [
  ...CUTS.map((t) => ({ src: "sfx-whoosh", at: t - 0.05, vol: 0.32 })),
  { src: "sfx-massinha", at: T.cosmeticos - pre, vol: 0.5 }, { src: "sfx-massinha", at: T.cosmeticos + 0.18, vol: 0.45 },
  { src: "sfx-massinha", at: T.cosmeticos + 0.36, vol: 0.45 },
  { src: "sfx-lapis", at: T.embalagens - 0.1, vol: 0.5 },
  ...Object.values(SEG).map((s) => ({ src: "sfx-massinha", at: s.de + 0.15, vol: 0.5 })),
  { src: "sfx-teclado", at: T.tempo, vol: 0.35 },
  { src: "sfx-lapis", at: T.aberto, vol: 0.45 },
  { src: "sfx-lapis", at: T.testado + 0.1, vol: 0.5 },
  { src: "sfx-lapis", at: T.animais, vol: 0.4 },
  { src: "sfx-teclado", at: T.identif, vol: 0.35 },
  { src: "sfx-lapis", at: T.recic1, vol: 0.4 },
  { src: "sfx-lapis", at: T.conferir, vol: 0.5 },
  { src: "sfx-massinha", at: T.financ, vol: 0.45 }, { src: "sfx-massinha", at: T.financ + 0.3, vol: 0.45 }, { src: "sfx-massinha", at: T.financ + 0.6, vol: 0.45 },
  { src: "sfx-lapis", at: T.recic2, vol: 0.4 },
  { src: "sfx-ding", at: T.ler - pre, vol: 0.45 },
  { src: "sfx-notificacao", at: T.salva - pre, vol: 0.55 },
  { src: "sfx-whoosh", at: FIM - 0.1, vol: 0.35 },
  { src: "sfx-massinha", at: FIM - 0.1, vol: 0.55 },
  { src: "sfx-massinha", at: FIM + 0.75, vol: 0.4 },
  { src: "sfx-ding", at: FIM + 1.75, vol: 0.5 },
];
