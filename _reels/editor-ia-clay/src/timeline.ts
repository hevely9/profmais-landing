import palavras from "../public/palavras.json";

// Linha do tempo única (segundos de SAÍDA). A narração do ElevenLabs é cortada em 3 trechos
// para abrir espaço às duas falas do Clay; `o(t)` converte o tempo da narração no tempo do vídeo.
export const FPS = 30;
export const LEAD = 0.2;
export const GAP1_AT = 40.55, GAP1 = 2.2;   // depois de "...faz as animações."
export const GAP2_AT = 52.95, GAP2 = 2.2;   // depois de "...música e cor."
// A narração termina em "...igual um editor de verdade."; o CTA final é só visual.
export const NARR_FIM = 70.12;
export const o = (t: number) => t + LEAD + (t >= GAP1_AT ? GAP1 : 0) + (t >= GAP2_AT ? GAP2 : 0);
export const NARR_SEGS = [
  { from: o(0), start: 0, end: GAP1_AT },
  { from: o(GAP1_AT), start: GAP1_AT, end: GAP2_AT },
  { from: o(GAP2_AT), start: GAP2_AT, end: NARR_FIM },
];
export const CLAY_LINES = [
  { from: o(GAP1_AT) - GAP1 + 0.1, start: 0, end: 1.95, texto: "Instalei e testei tudo!" },
  { from: o(GAP2_AT) - GAP2 + 0.1, start: 3.3, end: 5.15, texto: "Folha de estilo pronta!" },
];
export const TOTAL = Math.ceil((o(NARR_FIM) + 4.8) * FPS);

type W = { text: string; type: string; start: number; end: number };
export const WORDS = (palavras as { words: W[] }).words
  .filter((w) => w.type === "word" && !w.text.startsWith("[") && w.start < NARR_FIM)
  .map((w) => ({ text: w.text.replace(/["“”]/g, ""), start: o(w.start), end: o(w.end) }));
const wordAt = (txt: string, n = 0) => WORDS.filter((w) => w.text.toLowerCase().startsWith(txt.toLowerCase()))[n].start;

// Cenas (ElevenLabs · Kling 3.0 Pro). rate < 1 desacelera; blur = fundo para os painéis.
export type Shot = { src: string; from: number; to: number; rate?: number; startFrom?: number; blur?: boolean };
export const SHOTS: Shot[] = [
  { src: "c1", from: 0, to: o(8.45), rate: 0.7 },
  { src: "c2", from: o(8.45), to: o(15.2), rate: 0.74 },
  { src: "c2", from: o(15.2), to: o(22.2), rate: 0.35, startFrom: 2.5, blur: true },
  { src: "c1", from: o(22.2), to: o(26.1), rate: 0.85, startFrom: 2.6 },
  { src: "c3", from: o(26.1), to: o(30.3), rate: 1.15 },
  { src: "c3", from: o(30.3), to: o(GAP1_AT), rate: 0.3, startFrom: 1.5, blur: true },
  { src: "c3", from: o(GAP1_AT) - GAP1, to: o(GAP1_AT), rate: 1, startFrom: 2.8 },
  { src: "c4", from: o(GAP1_AT), to: o(46.4), rate: 0.95 },
  { src: "c4", from: o(46.4), to: o(GAP2_AT) - GAP2 - 0.4, rate: 0.3, startFrom: 2.5, blur: true },
  { src: "c5", from: o(GAP2_AT) - GAP2 - 0.4, to: o(GAP2_AT), rate: 1, startFrom: 2.4 },
  { src: "c6", from: o(GAP2_AT), to: o(58.6), rate: 0.9 },
  { src: "c6", from: o(58.6), to: o(66.5), rate: 0.3, startFrom: 2.0, blur: true },
  { src: "c2", from: o(66.5), to: o(69.95), rate: 1, startFrom: 1.4 },
  { src: "c7", from: o(69.95), to: TOTAL / FPS, rate: 0.9 },
];
export const CUTS = SHOTS.map((s) => s.from).slice(1);

// Painéis desenhados por cima (tempo de saída).
export const P = {
  titulo: [0.15, o(8.3)],
  passos: [
    { n: 1, nome: "MONTA O AMBIENTE", de: o(8.48), ate: o(26.0) },
    { n: 2, nome: "AS FERRAMENTAS", de: o(26.16), ate: o(GAP1_AT) - GAP1 },
    { n: 3, nome: "TRAVA O SEU ESTILO", de: o(40.72), ate: o(GAP2_AT) - GAP2 },
    { n: 4, nome: "GRAVA E EDITA", de: o(53.0), ate: o(70.0) },
  ],
  pastas: { de: o(15.2), ate: o(22.2), itens: [wordAt("vídeo", 2), wordAt("referências", 0), wordAt("vídeos", 0)] },
  local: { de: o(22.2), ate: o(26.1), check: wordAt("local") },
  ferramentas: { de: o(30.3), ate: o(GAP1_AT) - GAP1, itens: [wordAt("FFmpeg"), wordAt("Whisper"), wordAt("yt-dlp"), wordAt("HyperFrames")] },
  folha: { de: o(46.4), ate: o(GAP2_AT) - GAP2 - 0.4, itens: [wordAt("cortes"), wordAt("legenda", 1), wordAt("ritmo"), wordAt("música"), wordAt("cor.")] },
  prompt: { de: o(58.6), ate: o(66.5) },
  cta: { de: o(70.15), pill: o(70.85), sub: o(71.6) },
};

// Efeitos (ElevenLabs Sound Effects), 2–3 quadros antes do visual.
const pre = 0.08;
export const SFX: { src: string; at: number; vol?: number }[] = [
  { src: "sfx-notebook", at: 1.6, vol: 0.8 },
  ...CUTS.map((c) => ({ src: "sfx-whoosh", at: c - 0.35, vol: 0.45 })),
  { src: "sfx-massinha", at: o(9.3), vol: 0.7 }, { src: "sfx-massinha", at: o(10.4), vol: 0.6 },
  ...P.pastas.itens.map((t) => ({ src: "sfx-massinha", at: t - pre, vol: 0.7 })),
  { src: "sfx-teclado", at: o(22.4), vol: 0.5 }, { src: "sfx-ding", at: P.local.check - pre, vol: 0.55 },
  { src: "sfx-caixa", at: o(26.5), vol: 0.75 }, { src: "sfx-caixa", at: o(27.3), vol: 0.75 }, { src: "sfx-caixa", at: o(28.1), vol: 0.75 },
  ...P.ferramentas.itens.map((t) => ({ src: "sfx-ding", at: t - pre, vol: 0.5 })),
  { src: "sfx-lapis", at: o(43.2), vol: 0.7 }, { src: "sfx-lapis", at: o(45.0), vol: 0.6 },
  ...P.folha.itens.map((t) => ({ src: "sfx-ding", at: t - pre, vol: 0.42 })),
  { src: "sfx-impressora", at: o(GAP2_AT) - GAP2 - 0.45, vol: 0.8 },
  { src: "sfx-rec", at: o(53.6), vol: 0.6 },
  { src: "sfx-teclado", at: o(58.7), vol: 0.45 }, { src: "sfx-teclado", at: o(60.5), vol: 0.45 },
  { src: "sfx-notificacao", at: P.cta.pill - pre, vol: 0.7 },
];
