import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

// Capa do Reel (1080×1920). Texto dentro da área que o feed recorta em 3:4 (y 240–1680).
const C = { creme: "#F6ECDD", tinta: "#22180F", laranja: "#E8743B", verdeEsc: "#10261E", areia: "#EFDCA9" };
const F = "Montserrat";

export const Capa: React.FC = () => (
  <AbsoluteFill style={{ background: C.verdeEsc }}>
    <Img src={staticFile("img/capa-bg.png")} style={{ position: "absolute", width: 1080, height: 1935, top: 80, objectFit: "cover",
      filter: "saturate(1.05) contrast(1.04)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(16,38,30,0.92) 0%, rgba(16,38,30,0.75) 22%, rgba(16,38,30,0) 42%, rgba(16,12,8,0) 70%, rgba(16,12,8,0.7) 100%)" }} />
    <div style={{ position: "absolute", top: 290, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <div style={{ fontFamily: F, fontWeight: 900, fontSize: 116, lineHeight: 0.98, letterSpacing: "-0.035em", color: C.creme, textAlign: "center",
        textShadow: "0 8px 40px rgba(0,0,0,0.5)" }}>EDITOR<br />DE VÍDEO<br />COM <span style={{ color: C.laranja }}>IA</span></div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.creme, borderRadius: 999, padding: "14px 30px 14px 16px",
        boxShadow: "0 18px 40px rgba(0,0,0,0.45)", transform: "rotate(-2deg)" }}>
        <div style={{ width: 62, height: 62, borderRadius: 999, background: C.laranja, color: C.creme, display: "grid", placeItems: "center",
          fontFamily: F, fontWeight: 900, fontSize: 38 }}>4</div>
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: 40, color: C.tinta, letterSpacing: "0.01em" }}>PASSOS · DO ZERO</div>
      </div>
    </div>
    <div style={{ position: "absolute", top: 1500, left: 0, right: 0, textAlign: "center", fontFamily: F, fontWeight: 800, fontSize: 40,
      color: C.areia, letterSpacing: "0.04em", textShadow: "0 4px 18px rgba(0,0,0,0.7)" }}>USANDO SÓ O CLAUDE NO SEU PC</div>
  </AbsoluteFill>
);
