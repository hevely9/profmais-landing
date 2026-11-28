import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile } from "remotion";
import { C, MONT, COURIER, SANS } from "./kit";

// Capa de TikTok (1080×1920). Texto dentro do miolo 3:4 (y 240–1680) que aparece na grade do perfil.
type Linha = { t: string; destaque?: boolean };
export const Capa: React.FC<{ caso: string; selo?: string; parte?: string; linhas: Linha[]; sub: string; img?: string; clip?: string; de?: number; cor?: boolean; pos?: string; fundo?: React.ReactNode; tam?: number }> =
  ({ caso, selo, parte, linhas, sub, img, clip, de = 0, cor = false, pos = "50% 40%", fundo, tam = 138 }) => (
  <AbsoluteFill style={{ background: C.preto, overflow: "hidden" }}>
    {img && <AbsoluteFill><Img src={staticFile(`img/${img}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, filter: cor ? "contrast(1.15) brightness(0.9) saturate(1.2)" : "grayscale(0.85) contrast(1.2) brightness(0.85)" }} /></AbsoluteFill>}
    {clip && <AbsoluteFill><OffthreadVideo src={staticFile(`v/${clip}.mp4`)} startFrom={de} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.15)" }} /></AbsoluteFill>}
    {fundo}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,10,11,0.75) 0%, rgba(10,10,11,0.1) 30%, rgba(10,10,11,0.15) 48%, rgba(10,10,11,0.92) 78%, #0A0A0B 100%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.6) 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 270, display: "flex", justifyContent: "center", gap: 18 }}>
      <div style={{ padding: "10px 22px", border: `3px solid ${C.osso}`, fontFamily: COURIER, fontWeight: 700, fontSize: 36, color: C.osso, letterSpacing: "0.1em", background: "rgba(10,10,11,0.6)" }}>{selo ?? `ÁLIBI · CASO ${caso}`}</div>
      {parte && <div style={{ padding: "10px 22px", background: C.lacre, fontFamily: MONT, fontWeight: 800, fontSize: 40, color: C.osso }}>{parte}</div>}
    </div>
    <div style={{ position: "absolute", left: 50, right: 50, top: 1000, textAlign: "center" }}>
      {linhas.map((l, i) => <div key={i} style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: tam, lineHeight: 1.0, color: C.osso, padding: l.destaque ? "4px 22px 10px" : "0 0 6px", background: l.destaque ? C.lacre : "none", textShadow: l.destaque ? "none" : "0 6px 30px rgba(0,0,0,0.9)", marginTop: l.destaque ? 10 : 0, marginBottom: l.destaque ? 10 : 0 }}>{l.t}</div>
      </div>)}
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.osso, marginTop: 22, textShadow: "0 3px 14px #000" }}>{sub}</div>
    </div>
  </AbsoluteFill>
);
