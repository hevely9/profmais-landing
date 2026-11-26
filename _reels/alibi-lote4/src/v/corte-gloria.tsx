import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import palavras from "../../public/palavras-dp-gloria.json";
import { C, COURIER, MONT, SANS, SERIF, clamp } from "../kit";

// ÁLIBI · Nº 029 — CORTE de documentário (formato novo): trecho da série "Pacto Brutal: o assassinato de Daniella Perez" (HBO Max, 2022).
// Quem fala: Glória Perez, autora de novelas, mãe da atriz Daniella Perez (morta em dezembro de 1992).
// Sem narração nossa: vídeo original + marca ÁLIBI + título + crachá de TV (lower third) com as cores do perfil + legenda sincronizada.
// Legenda: transcrição palavra a palavra (Whisper large-v3-turbo); trecho 150–188 s é só montagem de fotos com música (sem legenda).
type W = { text: string; start: number; end: number };
const WORDS = (palavras as { words: W[] }).words;
export const GLORIA_TOTAL = Math.floor(230.55 * 30);
const BAND_TOP = 650, BAND_H = 608; // vídeo 16:9 ocupando a largura toda

const useS = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return f / fps; };

// crachá de TV: nome em caixa branca + faixa vermelha embaixo
const Cracha: React.FC<{ de: number; ate: number }> = ({ de, ate }) => {
  const t = useS();
  if (t < de - 0.1 || t > ate + 0.6) return null;
  const k = interpolate(t, [de, de + 0.45, ate, ate + 0.45], [0, 1, 1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const kb = interpolate(t, [de + 0.25, de + 0.7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <div style={{ position: "absolute", left: 40, top: BAND_TOP + BAND_H - 190, transform: `translateX(${(1 - k) * -620}px)`, opacity: k }}>
    <div style={{ display: "inline-block", background: "#F4F1EA", padding: "8px 24px 6px", fontFamily: MONT, fontWeight: 800, fontSize: 48, color: "#111", letterSpacing: "0.01em", boxShadow: "0 8px 24px rgba(0,0,0,0.45)" }}>GLÓRIA PEREZ</div>
    <div style={{ overflow: "hidden", width: `${kb * 100}%`, whiteSpace: "nowrap" }}>
      <div style={{ display: "inline-block", background: C.lacre, padding: "8px 24px", fontFamily: SANS, fontWeight: 700, fontSize: 28, color: "#fff", letterSpacing: "0.03em" }}>MÃE DE DANIELLA PEREZ · AUTORA DE NOVELAS</div>
    </div>
  </div>;
};

// legenda sincronizada: até 5 palavras por vez, quebra em pontuação; palavra ainda não dita fica apagada
const CHAVE = /^(daniella|filha|filho|mãe|morte|tênis|delegado|olhinho|vazio|verdade|horrível)/i;
const Legenda: React.FC = () => {
  const t = useS();
  const pages = React.useMemo(() => {
    const ps: { de: number; ate: number; ws: W[] }[] = [];
    let cur: W[] = [];
    WORDS.forEach((w, i) => {
      cur.push(w);
      const prox = WORDS[i + 1];
      const pausa = prox ? prox.start - w.end > 0.6 : true;
      if (/[.,?!…]$/.test(w.text) || cur.length >= 5 || pausa) { ps.push({ de: cur[0].start, ate: 0, ws: cur }); cur = []; }
    });
    ps.forEach((p, i) => { const fim = p.ws[p.ws.length - 1].end + 0.7; p.ate = i < ps.length - 1 ? Math.min(ps[i + 1].de, fim) : fim; });
    return ps;
  }, []);
  const pg = pages.find((p) => t >= p.de - 0.06 && t < p.ate);
  if (!pg) return null;
  return <div style={{ position: "absolute", left: 60, right: 60, top: BAND_TOP + BAND_H + 40, display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: 16, rowGap: 6 }}>
    {pg.ws.map((w, i) => {
      const dita = t >= w.start - 0.04;
      const txt = w.text.replace(/[,;:]$/, "");
      const chave = CHAVE.test(txt.replace(/[.?!…]$/, ""));
      return <span key={i} style={{ fontFamily: SANS, fontWeight: 800, fontSize: 56, lineHeight: 1.15, color: dita ? (chave ? "#FF4D57" : "#FFFFFF") : "rgba(255,255,255,0.35)", textShadow: "0 3px 14px rgba(0,0,0,0.95), 0 0 2px #000" }}>{txt}</span>;
    })}
  </div>;
};

export const CorteGloria: React.FC = () => {
  const t = useS();
  const tit = interpolate(t, [0, 0.5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill style={{ background: "#0A0A0B", overflow: "hidden" }}>
    {/* fundo: o próprio vídeo desfocado (sem áreas vazias) */}
    <AbsoluteFill><OffthreadVideo src={staticFile("v/dp-gloria.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(42px) brightness(0.3) saturate(0.8)", transform: "scale(1.2)" }} /></AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,10,11,0.55) 0%, rgba(10,10,11,0.1) 30%, rgba(10,10,11,0.1) 70%, rgba(10,10,11,0.6) 100%)" }} />
    {/* vídeo principal */}
    <div style={{ position: "absolute", left: 0, top: BAND_TOP, width: 1080, height: BAND_H, overflow: "hidden", borderTop: "3px solid rgba(236,231,220,0.85)", borderBottom: "3px solid rgba(236,231,220,0.85)", boxShadow: "0 30px 80px rgba(0,0,0,0.8)" }}>
      <OffthreadVideo src={staticFile("v/dp-gloria.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", right: 14, top: 12, padding: "4px 10px", background: "rgba(10,10,11,0.6)", fontFamily: SANS, fontWeight: 700, fontSize: 18, color: "rgba(236,231,220,0.85)" }}>HBO MAX · PACTO BRUTAL</div>
    </div>
    {/* topo: marca + número + título */}
    <div style={{ position: "absolute", left: 60, right: 60, top: 380, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: tit }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 40, letterSpacing: "0.14em", color: C.osso }}>ÁLIBI</div>
      <div style={{ padding: "5px 14px", background: C.lacre, fontFamily: MONT, fontWeight: 800, fontSize: 26, color: C.osso, letterSpacing: "0.06em" }}>Nº 029 · CASO REAL</div>
    </div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 450, opacity: tit, transform: `translateY(${(1 - tit) * 20}px)` }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 52, lineHeight: 1.12, color: C.osso, textShadow: "0 4px 18px rgba(0,0,0,0.9)" }}>
        GLÓRIA PEREZ CONTA COMO<br />ENCONTROU A FILHA,<br /><span style={{ background: C.lacre, padding: "0 14px" }}>DANIELLA PEREZ</span>
      </div>
    </div>
    <Cracha de={5.1} ate={8.1} />
    <Cracha de={16.6} ate={22.5} />
    <Cracha de={192.0} ate={198.5} />
    <Legenda />
    {/* rodapé: crédito + assinatura */}
    <div style={{ position: "absolute", left: 60, right: 60, top: 1470, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 19, color: "rgba(236,231,220,0.6)" }}>Reprodução · HBO Max, “Pacto Brutal: o assassinato de Daniella Perez” (2022)</div>
    </div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 1505, fontFamily: COURIER, fontWeight: 700, fontSize: 24, color: "rgba(236,231,220,0.55)", letterSpacing: "0.08em" }}>toda história tem um álibi.</div>
  </AbsoluteFill>;
};
