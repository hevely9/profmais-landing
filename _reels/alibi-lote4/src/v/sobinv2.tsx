import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import palavras from "../../public/palavras-sobinv2.json";
import { C, ELITE, MONT, SANS } from "../kit";
import { MarcaTexto } from "./sobinv";

// Publi 2 (criativo de teste) — ângulo "desafio": "você que acha que resolveria qualquer caso".
// Lição do 1º: imagens passaram rápido demais. Aqui: 8 planos longos (3,5–6,7 s), câmera lenta leve e zoom suave.
type W = { text: string; start: number; end: number };
const WORDS = (palavras as { words: W[] }).words;
const FIM = 41.3; // entra a assinatura
export const SOB2_TOTAL = Math.round(43.6 * 30);

// [início, duração, fonte ("v:arquivo" ou "i:imagem"), segundo na fonte, velocidade, zoom ini, zoom fim, origem]
type K = [number, number, string, number, number, number, number, string];
const PLANOS: K[] = [
  [0.0, 4.6, "v:sob-p3", 58.6, 1.0, 1.0, 1.08, "50% 50%"],   // mesa do caso: envelope, celular, jornal
  [4.6, 5.5, "i:sob2-prova", 0, 1, 1.0, 1.16, "40% 30%"],     // "um empresário foi encontrado sem vida" (foto-evidência do jogo)
  [10.1, 5.7, "v:sob-p3", 23.6, 1.0, 1.0, 1.08, "50% 45%"],   // jornal, relatório, fotos
  [15.8, 4.9, "v:sob-p3", 37.4, 0.75, 1.02, 1.12, "50% 40%"], // fichas dos suspeitos
  [20.7, 4.7, "v:sob-p3", 44.2, 1.0, 1.0, 1.08, "50% 45%"],   // senha do celular
  [25.4, 3.2, "v:sob-p3", 32.2, 0.9, 1.0, 1.08, "50% 45%"],   // "não tem gabarito"
  [28.6, 3.5, "v:sob-p3", 20.0, 0.63, 1.05, 1.18, "45% 55%"], // delegado no WhatsApp
  [32.1, 5.4, "v:sob-p3", 10.0, 0.6, 1.0, 1.1, "50% 40%"],    // caixa: 3–6 h, difícil
  [37.5, 6.1, "v:sob-p3", 0.0, 0.8, 1.0, 1.08, "50% 45%"],    // produto + carrinho + assinatura
];

const Plano: React.FC<{ c: K }> = ({ c }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const k = Math.min(1, f / (c[1] * fps));
  const z = c[5] + (c[6] - c[5]) * Easing.inOut(Easing.sin)(k);
  const entra = interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" }); // dissolve curto, sem soco
  const [tipo, nome] = c[2].split(":");
  return <AbsoluteFill style={{ opacity: c[0] === 0 ? 1 : entra }}>
    <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: c[7] }}>
      {tipo === "v"
        ? <OffthreadVideo src={staticFile(`v/${nome}.mp4`)} startFrom={Math.round(c[3] * fps)} playbackRate={c[4]} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <Img src={staticFile(`img/${nome}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
    </AbsoluteFill>
  </AbsoluteFill>;
};

const Legenda: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  if (t >= FIM) return null;
  const pages: { de: number; ate: number; ws: W[] }[] = [];
  let cur: W[] = [];
  WORDS.forEach((w, i) => { cur.push(w); if (/[.,?!]$/.test(w.text) || cur.length >= 3 || i === WORDS.length - 1) { pages.push({ de: cur[0].start, ate: 0, ws: cur }); cur = []; } });
  pages.forEach((p, i) => { p.ate = i < pages.length - 1 ? pages[i + 1].de : p.ws[p.ws.length - 1].end + 0.4; });
  const pg = pages.find((p) => t >= p.de && t < p.ate);
  if (!pg) return null;
  return <div style={{ position: "absolute", left: 80, right: 80, top: 1140, textAlign: "center" }}>
    {pg.ws.map((w, i) => {
      const on = t >= w.start - 0.03;
      return <span key={i} style={{ fontFamily: MONT, fontWeight: 800, fontSize: 70, lineHeight: 1.15, color: on ? "#fff" : "rgba(255,255,255,0)", WebkitTextStroke: on ? "3px #000" : "0", paintOrder: "stroke fill", textShadow: on ? "0 4px 14px rgba(0,0,0,0.6)" : "none", marginRight: 16 }}>{w.text.replace(/[.,]$/, "")}</span>;
    })}
  </div>;
};

// poucas notas, cada uma parada por 3–4 s
const Nota: React.FC<{ de: number; ate: number; texto: string; rot?: number; preta?: boolean }> = ({ de, ate, texto, rot = -2, preta }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  if (t < de || t > ate) return null;
  const k = interpolate(t, [de, de + 0.2], [0.6, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  return <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center" }}>
    <div style={{ transform: `scale(${k}) rotate(${rot}deg)`, background: preta ? "#111" : "#fff", color: preta ? "#fff" : "#111", fontFamily: SANS, fontWeight: 800, fontSize: 52, padding: "10px 24px", borderRadius: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}>{texto}</div>
  </div>;
};

const Canto: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  if (t > FIM) return null;
  return <div style={{ position: "absolute", left: 70, top: 250, opacity: 0.9, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}><MarcaTexto size={34} /></div>;
};
const Assinatura: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  if (t < FIM) return null;
  const k = interpolate(t, [FIM, FIM + 0.7], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill style={{ background: `rgba(10,10,11,${0.62 * k})`, alignItems: "center", justifyContent: "center", opacity: k }}>
    <div style={{ marginTop: -120, textAlign: "center" }}>
      <MarcaTexto size={88} />
      <div style={{ marginTop: 22, fontFamily: ELITE, fontSize: 38, color: "rgba(255,255,255,0.88)" }}>toda história tem um álibi.</div>
    </div>
  </AbsoluteFill>;
};
const SetaCarrinho: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps; const de = 39.3;
  if (t < de) return null;
  const k = interpolate(t, [de, de + 0.3], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  const pulo = Math.abs(Math.sin((t - de) * Math.PI * 2.2)) * 26;
  return <div style={{ position: "absolute", left: 150, top: 1430 + pulo, opacity: Math.min(1, k * 1.5), transform: `scale(${k})`, filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.55))" }}>
    <svg width="130" height="150" viewBox="0 0 130 150"><path d="M45 0 H85 V85 H125 L65 150 L5 85 H45 Z" fill="#E0353F" stroke="#fff" strokeWidth="6" strokeLinejoin="round" /></svg>
  </div>;
};

export const SobInvestigacao2: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {PLANOS.map((c, i) => <Sequence key={i} from={Math.round(c[0] * 30)} durationInFrames={Math.round(c[1] * 30) + (i < PLANOS.length - 1 ? 8 : 0)} layout="none"><Plano c={c} /></Sequence>)}
    <Audio src={staticFile("audio/sobinv2.mp3")} />
    <Nota de={0.25} ate={4.5} texto="você resolveria? 🕵️" />
    <Nota de={15.9} ate={20.6} texto="cada um conta uma versão 👀" rot={2} />
    <Nota de={25.5} ate={31.9} texto="sem gabarito no final 😬" />
    <Nota de={32.3} ate={37.3} texto="“3 a 6 horas”… 😅" rot={2} />
    <Nota de={37.6} ate={41.2} texto="🛒 tá no carrinho laranja" rot={0} />
    <Canto />
    <Legenda />
    <Assinatura />
    <SetaCarrinho />
  </AbsoluteFill>
);

// capa: ângulo desafio, diferente da 1ª ("UM CRIME PRA VOCÊ RESOLVER")
export const CapaSob2: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Img src={staticFile("img/sob2-capa.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.0) 28%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.6) 66%, rgba(0,0,0,0.1) 86%)" }} />
    <div style={{ position: "absolute", left: 90, right: 90, top: 840, textAlign: "center" }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 84, lineHeight: 1.05, color: "#fff", textShadow: "0 6px 26px rgba(0,0,0,0.85)" }}>VOCÊ RESOLVERIA</div>
      <div style={{ display: "inline-block", marginTop: 14, padding: "6px 26px 12px", background: C.lacre, fontFamily: MONT, fontWeight: 800, fontSize: 88, lineHeight: 1.02, color: "#fff", whiteSpace: "nowrap" }}>ESSE CASO?</div>
      <div style={{ marginTop: 26, fontFamily: ELITE, fontSize: 44, color: "#fff", textShadow: "0 3px 14px #000" }}>sem gabarito no final</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1420, display: "flex", justifyContent: "center" }}><MarcaTexto size={40} /></div>
  </AbsoluteFill>
);
