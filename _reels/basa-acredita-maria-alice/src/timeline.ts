import palavras from "../public/palavras.json";

// Vídeo de divulgação da assessora Maria Alice (BASA Acredita). Segundos de SAÍDA.
export const FPS = 30;
export const LEAD = 0.35;
// Pausa de 1 s antes de "Fala com a Maria Alice" para o carimbo respirar.
export const GAP_AT = 8.95, GAP = 1.0;
export const o = (t: number) => t + LEAD + (t >= GAP_AT ? GAP : 0);
export const q = (t: number) => Math.round(t * FPS);

type W = { text: string; start: number; end: number };
export const WORDS = (palavras as { words: W[] }).words.map((w) => ({ text: w.text, start: o(w.start), end: o(w.end) }));
const limpa = (s: string) => s.toLowerCase().replace(/[.,?!;:]/g, "");
const wa = (txt: string, n = 0) => {
  const m = WORDS.filter((w) => limpa(w.text) === txt)[n];
  if (!m) throw new Error(`palavra não encontrada: ${txt}`);
  return m.start;
};
export const T = {
  credito: wa("crédito"), negocio: wa("negócio"), crescer: wa("crescer"),
  com: wa("com"), basa: wa("basa"), voce: wa("você"), micro: wa("microcrédito"), pensado: wa("pensado"),
  mais: wa("mais"), agilidade: wa("agilidade"), menos: wa("menos"), burocracia: wa("burocracia"),
  fala: wa("fala"), maria: wa("maria"), sua: wa("sua"), assessora: wa("assessora"),
  chama: wa("chama"), whats: wa("whatsapp"),
};
export const FIM_VOZ = o(13.4);
export const TOTAL = q(FIM_VOZ + 2.6);

// Cenas (cada uma entra um pouco antes da fala correspondente).
export const CENA = {
  duvida: { de: 0, ate: T.com - 0.15 },
  solucao: { de: T.com - 0.15, ate: T.mais - 0.2 },
  agil: { de: T.mais - 0.2, ate: T.fala - 0.2 },
  maria: { de: T.fala - 0.2, ate: TOTAL / FPS },
};

export const SFX: { src: string; at: number; vol?: number }[] = [
  { src: "sfx-massinha", at: 0.1, vol: 0.5 },
  { src: "esp-toque", at: T.credito, vol: 0.5 },
  { src: "moeda", at: T.credito + 0.15, vol: 0.45 },
  { src: "esp-pop", at: T.crescer - 0.45, vol: 0.4 },
  { src: "sfx-whoosh", at: CENA.solucao.de - 0.3, vol: 0.4 },
  { src: "esp-brilho", at: T.basa - 0.05, vol: 0.55 },
  { src: "sfx-massinha", at: T.voce, vol: 0.45 },
  { src: "sfx-massinha", at: T.micro + 0.25, vol: 0.45 },
  { src: "moeda", at: T.pensado, vol: 0.4 },
  { src: "sfx-whoosh", at: CENA.agil.de - 0.3, vol: 0.4 },
  { src: "relogio", at: T.mais, vol: 0.55 },
  { src: "papel", at: T.menos, vol: 0.6 },
  { src: "carimbo", at: T.burocracia + 0.6, vol: 0.85 },
  { src: "sfx-ding", at: T.burocracia + 0.8, vol: 0.4 },
  { src: "esp-brilho", at: T.burocracia + 1.05, vol: 0.4 },
  { src: "sfx-whoosh", at: CENA.maria.de - 0.3, vol: 0.4 },
  { src: "sfx-massinha", at: T.maria - 0.05, vol: 0.5 },
  { src: "sfx-lapis", at: T.assessora, vol: 0.35 },
  { src: "sfx-notificacao", at: T.chama - 0.05, vol: 0.6 },
  { src: "esp-toque", at: FIM_VOZ + 0.6, vol: 0.55 },
  { src: "sfx-ding", at: FIM_VOZ + 0.7, vol: 0.45 },
];
