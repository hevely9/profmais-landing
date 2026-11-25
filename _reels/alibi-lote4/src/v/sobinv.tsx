import React from "react";
import { AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import palavras from "../../public/palavras-sobinv.json";
import { MONT, SANS } from "../kit";

// Publi orgânica (TikTok Shop) — jogo "Sob Investigação · A Queda de Mosco". Imagens: vídeos da marca @sob.investigacao
// (usuário é afiliado/parceiro). Narração em 1ª pessoa (a equipe jogou), sem prometer nada além do que a marca mostra.
type W = { text: string; start: number; end: number };
const WORDS = (palavras as { words: W[] }).words;
export const SOB_TOTAL = Math.round(42.2 * 30);

// cortes: [início na narração, duração, segundo do vídeo da marca, zoom inicial, zoom final, origem do zoom]
const CORTES: [number, number, number, number, number, string][] = [
  [0.0, 3.4, 60.3, 1.0, 1.12, "50% 45%"],
  [3.4, 3.6, 29.0, 1.05, 1.2, "45% 45%"],
  [7.0, 2.6, 0.0, 1.0, 1.1, "50% 40%"],
  [9.6, 2.8, 2.0, 1.1, 1.0, "50% 50%"],
  [12.4, 2.7, 24.6, 1.0, 1.12, "50% 40%"],
  [15.1, 2.2, 26.0, 1.05, 1.15, "50% 50%"],
  [17.3, 3.3, 32.4, 1.0, 1.18, "50% 45%"],
  [20.6, 4.2, 41.6, 1.0, 1.1, "50% 50%"],
  [24.8, 2.9, 37.6, 1.1, 1.2, "50% 40%"],
  [27.7, 3.9, 19.6, 1.0, 1.15, "50% 45%"],
  [31.6, 4.3, 44.6, 1.0, 1.12, "50% 45%"],
  [35.9, 3.3, 39.4, 1.05, 1.15, "50% 45%"],
  [39.2, 3.0, 10.0, 1.0, 1.08, "50% 40%"],
];

const Corte: React.FC<{ c: (typeof CORTES)[number] }> = ({ c }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const dur = c[1] * fps; const k = f / dur;
  const z = c[3] + (c[4] - c[3]) * Easing.out(Easing.quad)(Math.min(1, k));
  const soco = interpolate(f, [0, 5], [1.06, 1], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ transform: `scale(${z * soco})`, transformOrigin: c[5] }}>
    <OffthreadVideo src={staticFile("v/sob-p3.mp4")} startFrom={Math.round(c[2] * fps)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill>;
};

// legenda estilo TikTok: 2–3 palavras por vez, branco com contorno
const Legenda: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const pages: { de: number; ate: number; ws: W[] }[] = [];
  let cur: W[] = [];
  WORDS.forEach((w, i) => { cur.push(w); if (/[.,?!]$/.test(w.text) || cur.length >= 3 || i === WORDS.length - 1) { pages.push({ de: cur[0].start, ate: 0, ws: cur }); cur = []; } });
  pages.forEach((p, i) => { p.ate = i < pages.length - 1 ? pages[i + 1].de : p.ws[p.ws.length - 1].end + 1.2; });
  const pg = pages.find((p) => t >= p.de && t < p.ate);
  if (!pg) return null;
  return <div style={{ position: "absolute", left: 80, right: 80, top: 1140, textAlign: "center" }}>
    {pg.ws.map((w, i) => {
      const on = t >= w.start - 0.03;
      return <span key={i} style={{ fontFamily: MONT, fontWeight: 800, fontSize: 70, lineHeight: 1.15, color: on ? "#fff" : "rgba(255,255,255,0.0)", WebkitTextStroke: on ? "3px #000" : "0", paintOrder: "stroke fill", textShadow: on ? "0 4px 14px rgba(0,0,0,0.6)" : "none", marginRight: 16 }}>{w.text.replace(/[.,]$/, "")}</span>;
    })}
  </div>;
};

// texto de destaque "de criador" (caixa branca, como texto nativo do TikTok)
const Nota: React.FC<{ de: number; ate: number; texto: string; top?: number; rot?: number }> = ({ de, ate, texto, top = 330, rot = -2 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  if (t < de || t > ate) return null;
  const k = interpolate(t, [de, de + 0.18], [0.6, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  return <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center" }}>
    <div style={{ transform: `scale(${k}) rotate(${rot}deg)`, background: "#fff", color: "#111", fontFamily: SANS, fontWeight: 800, fontSize: 52, padding: "10px 24px", borderRadius: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}>{texto}</div>
  </div>;
};

export const SobInvestigacao: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {CORTES.map((c, i) => <Sequence key={i} from={Math.round(c[0] * 30)} durationInFrames={Math.round(c[1] * 30)} layout="none"><Corte c={c} /></Sequence>)}
    <Audio src={staticFile("audio/sobinv.mp3")} />
    <Nota de={4.0} ate={6.9} texto="spoiler: é um jogo 🕵️‍♀️" />
    <Nota de={7.2} ate={9.5} texto="SOB INVESTIGAÇÃO" rot={0} />
    <Nota de={19.0} ate={20.5} texto="amassado DE VERDADE 😳" rot={2} />
    <Nota de={21.0} ate={24.7} texto="2º envelope só abre depois 😩" />
    <Nota de={28.3} ate={31.5} texto="delegado no WhatsApp 📲" rot={2} />
    <Nota de={36.0} ate={39.1} texto="joga com os amigos 👀" />
    <Nota de={39.2} ate={42.2} texto="🛒 link aqui no vídeo" rot={0} top={420} />
    <Legenda />
  </AbsoluteFill>
);
