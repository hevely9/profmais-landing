import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, COURIER, ELITE, MONT, SANS, SERIF } from "./kit";

// ÁLIBI · MOLDURAS para edição manual no CapCut (28/11/2026).
// Janela do vídeo entre y≈470 e y≈1530 (marcas do usuário). Modos:
//  - "verde": janela em #00FF00 (Chroma key no CapCut) → vídeo de 2 min feito de um laço de 4 s
//  - "png":   janela transparente (sobreposição parada)
//  - "previa": janela com uma imagem de exemplo e título de exemplo (só para mostrar ao usuário)
// Sem numeração: só a marca ÁLIBI e as cores. O título é digitado no CapCut, na área de cima.
export const LACO = 120; // 4 s a 30 fps; as animações fecham o ciclo em 120 quadros
type Modo = "verde" | "png" | "previa";
type P = { modo: Modo; titulo?: string; sub?: string };
const VERDE = "#00FF00";
const ciclo = (f: number) => (f % LACO) / LACO; // 0..1

const Marca: React.FC<{ size?: number }> = ({ size = 64 }) => (
  <span style={{ position: "relative", display: "inline-block", fontFamily: SERIF, fontWeight: 900, fontSize: size, letterSpacing: "0.14em", color: C.osso, padding: "0 10px", lineHeight: 1 }}>
    <span style={{ position: "absolute", left: -4, right: -4, top: "42%", bottom: "4%", background: C.lacre, transform: "skewX(-12deg) rotate(-1.5deg)", zIndex: 0, borderRadius: 4 }} />
    <span style={{ position: "relative" }}>ÁLIBI</span>
  </span>
);

const Janela: React.FC<{ x: number; y: number; w: number; h: number; modo: Modo; r?: number }> = ({ x, y, w, h, modo, r = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, overflow: "hidden", background: modo === "verde" ? VERDE : "transparent" }}>
    {modo === "previa" && <Img src={staticFile("img/eliza-capa.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
  </div>
);
// recorte: pinta tudo menos a janela (fundo da moldura), para o PNG transparente funcionar
const Fundo: React.FC<{ x: number; y: number; w: number; h: number; r?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, r = 0, children, style }) => (
  <div style={{ position: "absolute", inset: 0, clipPath: `path(evenodd, "M0 0 H1080 V1920 H0 Z M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z")`, ...style }}>{children}</div>
);
const Titulo: React.FC<{ p: P; top: number; cor?: string; centro?: boolean }> = ({ p, top, cor = C.osso, centro }) => p.modo !== "previa" ? null : (
  <div style={{ position: "absolute", left: 60, right: 60, top, textAlign: centro ? "center" : "left" }}>
    <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 64, lineHeight: 1.05, color: cor, textShadow: "0 4px 18px rgba(0,0,0,0.8)" }}>{p.titulo ?? "ELA AVISOU."}</div>
    <div style={{ display: "inline-block", marginTop: 10, background: C.lacre, padding: "2px 14px", fontFamily: MONT, fontWeight: 800, fontSize: 42, color: C.osso }}>{p.sub ?? "NINGUÉM OUVIU."}</div>
  </div>
);
const Rec: React.FC<{ left: number; top: number }> = ({ left, top }) => {
  const f = useCurrentFrame(); const on = ciclo(f) < 0.5;
  return <div style={{ position: "absolute", left, top, display: "flex", alignItems: "center", gap: 10, padding: "6px 12px", background: "rgba(10,10,11,0.72)" }}>
    <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.verm, opacity: on ? 1 : 0.15 }} />
    <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 24, color: C.osso, letterSpacing: "0.12em" }}>ARQUIVO</div>
  </div>;
};

// ═══ A · DOSSIÊ — fundo preto, visor de câmera, marca no topo e assinatura embaixo ═══
const A = { x: 40, y: 470, w: 1000, h: 1060 };
export const MolduraDossie: React.FC<P> = (p) => {
  const f = useCurrentFrame(); const k = ciclo(f);
  const canto = (s: React.CSSProperties) => <div style={{ position: "absolute", width: 70, height: 70, borderColor: C.osso, borderStyle: "solid", borderWidth: 0, ...s }} />;
  return <AbsoluteFill>
    <Janela {...A} modo={p.modo} />
    <Fundo {...A}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 0%, #2A2420 0%, ${C.preto} 55%)` }} />
      <div style={{ position: "absolute", left: 60, top: 140, display: "flex", alignItems: "center", gap: 22 }}>
        <Marca size={58} />
        <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 24, letterSpacing: "0.3em", color: C.ossoE }}>CASOS REAIS</div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1580, height: 3, background: `linear-gradient(90deg, ${C.lacre} ${k * 100}%, #3A342E ${k * 100}%)` }} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 1612, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: ELITE, fontSize: 34, color: C.osso }}>toda história tem um álibi.</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 30, letterSpacing: "0.14em", color: C.fita }}>@alibi.criminal</div>
      </div>
    </Fundo>
    <div style={{ position: "absolute", left: A.x - 4, top: A.y - 4, width: A.w + 8, height: A.h + 8, border: `4px solid rgba(236,231,220,0.85)`, boxSizing: "border-box" }} />
    {canto({ left: A.x + 22, top: A.y + 22, borderTopWidth: 6, borderLeftWidth: 6 })}
    {canto({ left: A.x + A.w - 92, top: A.y + 22, borderTopWidth: 6, borderRightWidth: 6 })}
    {canto({ left: A.x + 22, top: A.y + A.h - 92, borderBottomWidth: 6, borderLeftWidth: 6 })}
    {canto({ left: A.x + A.w - 92, top: A.y + A.h - 92, borderBottomWidth: 6, borderRightWidth: 6 })}
    <Rec left={A.x + 110} top={A.y + 30} />
    <Titulo p={p} top={260} />
  </AbsoluteFill>;
};

// ═══ B · FITA DA POLÍCIA — papel escuro, foto com borda creme, fitas douradas e faixa vermelha correndo ═══
const B = { x: 70, y: 480, w: 940, h: 1040 };
const Faixa: React.FC<{ top: number; rot: number; dir: 1 | -1 }> = ({ top, rot, dir }) => {
  const f = useCurrentFrame(); const PADRAO = 660; const dx = dir * ciclo(f) * PADRAO;
  return <div style={{ position: "absolute", left: -200, right: -200, top, height: 64, background: C.lacre, transform: `rotate(${rot}deg)`, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.6)", borderTop: "3px solid #000", borderBottom: "3px solid #000" }}>
    <div style={{ position: "absolute", left: -PADRAO + dx, top: 12, display: "flex" }}>
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ width: PADRAO, flex: "none", whiteSpace: "nowrap", fontFamily: MONT, fontWeight: 800, fontSize: 34, letterSpacing: "0.12em", color: C.osso }}>ÁLIBI ● NÃO ULTRAPASSE ●</div>)}
    </div>
  </div>;
};
export const MolduraFita: React.FC<P> = (p) => <AbsoluteFill>
  <Janela {...B} modo={p.modo} />
  <Fundo {...B}>
    <AbsoluteFill style={{ background: `linear-gradient(170deg, #1E1A16 0%, ${C.preto} 70%)` }} />
    <AbsoluteFill style={{ opacity: 0.08, backgroundImage: "repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 4px)" }} />
    <div style={{ position: "absolute", left: B.x - 18, top: B.y - 18, width: B.w + 36, height: B.h + 36, background: "#F1ECE0", boxShadow: "0 30px 80px rgba(0,0,0,0.85)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center" }}><Marca size={60} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1610, textAlign: "center", fontFamily: ELITE, fontSize: 34, color: C.osso }}>toda história tem um álibi.</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1666, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 28, letterSpacing: "0.14em", color: C.fita }}>@alibi.criminal</div>
  </Fundo>
  <div style={{ position: "absolute", left: B.x - 40, top: B.y - 34, width: 200, height: 58, background: "rgba(201,162,39,0.78)", transform: "rotate(-24deg)" }} />
  <div style={{ position: "absolute", left: B.x + B.w - 160, top: B.y + B.h - 26, width: 200, height: 58, background: "rgba(201,162,39,0.78)", transform: "rotate(-24deg)" }} />
  <Faixa top={B.y - 70} rot={-4} dir={1} />
  <Faixa top={B.y + B.h + 6} rot={3} dir={-1} />
  <Titulo p={p} top={240} centro />
</AbsoluteFill>;

// ═══ C · CINEMA — película correndo nas laterais, linhas douradas finas; ideal para edits tristes ═══
const CC = { x: 110, y: 470, w: 860, h: 1060 };
const Pelicula: React.FC<{ left: number }> = ({ left }) => {
  const f = useCurrentFrame(); const PASSO = 60; const dy = ciclo(f) * PASSO * 2;
  return <div style={{ position: "absolute", left, top: 0, width: 70, height: 1920, background: "#050505", overflow: "hidden", borderLeft: "2px solid #1C1916", borderRight: "2px solid #1C1916" }}>
    {Array.from({ length: 36 }, (_, i) => <div key={i} style={{ position: "absolute", left: 18, top: i * PASSO - PASSO * 2 + dy, width: 34, height: 34, borderRadius: 6, background: "#2B2621" }} />)}
  </div>;
};
export const MolduraCinema: React.FC<P> = (p) => <AbsoluteFill>
  <Janela {...CC} modo={p.modo} r={18} />
  <Fundo {...CC} r={18}>
    <AbsoluteFill style={{ background: C.preto }} />
    <Pelicula left={12} />
    <Pelicula left={998} />
    <div style={{ position: "absolute", left: CC.x, right: 1080 - CC.x - CC.w, top: 150, display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ flex: 1, height: 2, background: C.fita, opacity: 0.7 }} />
      <Marca size={52} />
      <div style={{ flex: 1, height: 2, background: C.fita, opacity: 0.7 }} />
    </div>
    <div style={{ position: "absolute", left: CC.x, right: 1080 - CC.x - CC.w, top: 1590, textAlign: "center" }}>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 40, color: C.osso }}>toda história tem um álibi.</div>
      <div style={{ marginTop: 10, fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: "0.3em", color: C.fita }}>@ALIBI.CRIMINAL</div>
    </div>
  </Fundo>
  <div style={{ position: "absolute", left: CC.x - 10, top: CC.y - 10, width: CC.w + 20, height: CC.h + 20, borderRadius: 26, border: `3px solid ${C.fita}`, boxSizing: "border-box", opacity: 0.85 }} />
  <Titulo p={p} top={250} centro />
</AbsoluteFill>;

export const MOLDURAS = { Dossie: MolduraDossie, Fita: MolduraFita, Cinema: MolduraCinema };
export const lacoOpacidade = (f: number) => interpolate(f, [0, 1], [1, 1]);
