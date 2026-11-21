import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, COURIER, MONT, SANS } from "./kit";

// Capa da série (1080×1920). Todo texto na ÁREA SEGURA x 90–990, y 380–1540 (cabe no recorte 3:4 da grade).
export const CapaSerie: React.FC<{ parte: string; img: string; pos?: string; cinza?: boolean; linhas: { t: string; destaque?: boolean }[]; sub: string; esconde?: boolean }> =
  ({ parte, img, pos = "50% 30%", cinza = false, linhas, sub, esconde }) => (
  <AbsoluteFill style={{ background: C.preto, overflow: "hidden" }}>
    <AbsoluteFill><Img src={staticFile(`img/${img}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos,
      filter: esconde ? "blur(22px) brightness(0.3) grayscale(1) contrast(1.4)" : `${cinza ? "grayscale(0.85) " : ""}contrast(1.12) brightness(0.85)` }} /></AbsoluteFill>
    {esconde && <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 420, color: C.lacre, opacity: 0.6 }}>?</div>}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,10,11,0.55) 0%, rgba(10,10,11,0.1) 25%, rgba(10,10,11,0.35) 45%, rgba(10,10,11,0.92) 72%, #0A0A0B 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 400, display: "flex", justifyContent: "center", gap: 16 }}>
      <div style={{ padding: "8px 18px", border: `3px solid ${C.osso}`, fontFamily: COURIER, fontWeight: 700, fontSize: 30, color: C.osso, letterSpacing: "0.1em", background: "rgba(10,10,11,0.65)" }}>ÁLIBI · CASO Nº 015</div>
      <div style={{ padding: "8px 18px", background: C.lacre, fontFamily: MONT, fontWeight: 800, fontSize: 34, color: C.osso }}>{parte}</div>
    </div>
    <div style={{ position: "absolute", left: 90, right: 90, top: 960, textAlign: "center" }}>
      {linhas.map((l, i) => <div key={i} style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 112, lineHeight: 1.0, color: C.osso, padding: l.destaque ? "4px 22px 10px" : "0 0 6px", background: l.destaque ? C.lacre : "none", margin: l.destaque ? "10px 0" : 0, textShadow: l.destaque ? "none" : "0 6px 30px rgba(0,0,0,0.9)" }}>{l.t}</div>
      </div>)}
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 42, color: C.osso, marginTop: 22, textShadow: "0 3px 14px #000" }}>{sub}</div>
    </div>
  </AbsoluteFill>
);
