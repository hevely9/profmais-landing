import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import palavras from "../../public/palavras-sobinv.json";
import { C, ELITE, MONT, SANS, SERIF } from "../kit";

// Publi orgânica (TikTok Shop) — jogo "Sob Investigação · A Queda de Mosco". Imagens: vídeos da marca @sob.investigacao
// (usuário é afiliado/parceiro). Narração em 1ª pessoa (a equipe jogou), sem prometer nada além do que a marca mostra.
type W = { text: string; start: number; end: number };
const WORDS = (palavras as { words: W[] }).words;
export const SOB_TOTAL = Math.round(42.6 * 30);

// cortes: [início na narração, duração, vídeo, segundo no vídeo, zoom inicial, zoom final, origem do zoom]
// sob-p1 tem legenda e @ embutidos embaixo: só entra com zoom ≥ 2 no celular (corta a faixa de baixo)
const CORTES: [number, number, string, number, number, number, string][] = [
  [0.0, 3.4, "sob-p3", 60.3, 1.0, 1.12, "50% 45%"],
  [3.4, 3.1, "sob-p3", 29.0, 1.05, 1.2, "45% 45%"],
  [6.5, 2.6, "sob-p3", 0.0, 1.0, 1.1, "50% 40%"],
  [9.1, 2.3, "sob-p3", 2.0, 1.1, 1.0, "50% 50%"],
  [11.4, 1.9, "sob-p3", 24.6, 1.0, 1.1, "50% 40%"],
  [13.3, 2.1, "sob-p3", 26.0, 1.05, 1.15, "50% 50%"],
  [15.4, 2.9, "sob-p3", 32.4, 1.0, 1.18, "50% 45%"],
  [18.3, 3.2, "sob-p3", 41.6, 1.0, 1.1, "50% 50%"],
  [21.5, 2.3, "sob-p1", 11.9, 2.0, 2.15, "50% 22%"],
  [23.8, 1.5, "sob-p3", 44.6, 1.05, 1.15, "50% 45%"],
  [25.3, 2.0, "sob-p1", 16.0, 2.0, 2.15, "50% 22%"],
  [27.3, 2.6, "sob-p3", 19.6, 1.0, 1.15, "50% 45%"],
  [29.9, 4.0, "sob-p3", 37.6, 1.05, 1.2, "50% 40%"],
  [33.9, 3.2, "sob-p3", 39.4, 1.05, 1.15, "50% 45%"],
  [37.1, 5.5, "sob-p3", 10.0, 1.0, 1.1, "50% 40%"],
];

const Corte: React.FC<{ c: (typeof CORTES)[number] }> = ({ c }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const dur = c[1] * fps; const k = f / dur;
  const z = c[4] + (c[5] - c[4]) * Easing.out(Easing.quad)(Math.min(1, k));
  const soco = interpolate(f, [0, 5], [1.06, 1], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ transform: `scale(${z * soco})`, transformOrigin: c[6] }}>
    <OffthreadVideo src={staticFile(`v/${c[2]}.mp4`)} startFrom={Math.round(c[3] * fps)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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

// assinatura do Álibi: só o nome, com "marca-texto" vermelho (identidade do perfil: Playfair + vermelho lacre)
export const MarcaTexto: React.FC<{ size: number }> = ({ size }) => (
  <span style={{ position: "relative", display: "inline-block", fontFamily: SERIF, fontWeight: 900, fontSize: size, letterSpacing: "0.1em", color: "#fff", padding: `0 ${size * 0.22}px` }}>
    <span style={{ position: "absolute", left: 0, right: 0, top: "38%", bottom: "4%", background: C.lacre, transform: "skewX(-12deg) rotate(-1.5deg)", borderRadius: 4, opacity: 0.95 }} />
    <span style={{ position: "relative" }}>ÁLIBI</span>
  </span>
);
const Canto: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  if (t > 39.6) return null;
  return <div style={{ position: "absolute", left: 70, top: 250, opacity: 0.9, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}><MarcaTexto size={34} /></div>;
};
const Assinatura: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  if (t < 39.6) return null;
  const k = interpolate(t, [39.6, 40.3], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill style={{ background: `rgba(10,10,11,${0.62 * k})`, alignItems: "center", justifyContent: "center", opacity: k }}>
    <div style={{ marginTop: -120, textAlign: "center" }}>
      <MarcaTexto size={88} />
      <div style={{ marginTop: 22, fontFamily: ELITE, fontSize: 38, color: "rgba(255,255,255,0.88)" }}>toda história tem um álibi.</div>
    </div>
  </AbsoluteFill>;
};

// seta vermelha apontando pro selo do carrinho do TikTok Shop (canto inferior esquerdo, acima do nome do perfil)
const SetaCarrinho: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  if (t < 37.9) return null;
  const k = interpolate(t, [37.9, 38.2], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  const pulo = Math.abs(Math.sin((t - 37.9) * Math.PI * 2.2)) * 26;
  return <div style={{ position: "absolute", left: 150, top: 1430 + pulo, opacity: Math.min(1, k * 1.5), transform: `scale(${k})`, filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.55))" }}>
    <svg width="130" height="150" viewBox="0 0 130 150"><path d="M45 0 H85 V85 H125 L65 150 L5 85 H45 Z" fill="#E0353F" stroke="#fff" strokeWidth="6" strokeLinejoin="round" /></svg>
  </div>;
};

export const SobInvestigacao: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {CORTES.map((c, i) => <Sequence key={i} from={Math.round(c[0] * 30)} durationInFrames={Math.round(c[1] * 30)} layout="none"><Corte c={c} /></Sequence>)}
    <Audio src={staticFile("audio/sobinv.mp3")} />
    <Nota de={4.6} ate={6.4} texto="spoiler: é um jogo 🕵️‍♀️" />
    <Nota de={7.4} ate={9.0} texto="SOB INVESTIGAÇÃO" rot={0} />
    <Nota de={17.0} ate={18.2} texto="amassado DE VERDADE 😳" rot={2} />
    <Nota de={18.6} ate={21.4} texto="2º envelope só abre depois 😩" />
    <Nota de={22.8} ate={25.2} texto="pistas online no celular 📱" rot={2} />
    <Nota de={25.9} ate={29.8} texto="robô no WhatsApp te dá dica 🤖" />
    <Nota de={34.0} ate={37.0} texto="joga com os amigos 👀" rot={2} />
    <Nota de={37.9} ate={39.6} texto="🛒 tá no carrinho laranja" rot={0} />
    <Canto />
    <Legenda />
    <Assinatura />
    <SetaCarrinho />
  </AbsoluteFill>
);

// capa (1080×1920): foto real do produto + texto curto na área segura + assinatura discreta
export const CapaSob: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Img src={staticFile("img/sob-capa.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.15) 85%)" }} />
    <div style={{ position: "absolute", left: 90, right: 90, top: 860, textAlign: "center" }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 98, lineHeight: 1.02, color: "#fff", textShadow: "0 6px 26px rgba(0,0,0,0.85)" }}>UM CRIME PRA</div>
      <div style={{ display: "inline-block", marginTop: 14, padding: "6px 26px 12px", background: C.lacre, fontFamily: MONT, fontWeight: 800, fontSize: 92, lineHeight: 1.02, color: "#fff", whiteSpace: "nowrap" }}>VOCÊ RESOLVER</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1420, display: "flex", justifyContent: "center" }}><MarcaTexto size={40} /></div>
  </AbsoluteFill>
);
