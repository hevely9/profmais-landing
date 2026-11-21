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

// Capa com o Coringa reagindo (metade de cima) + imagem do caso (metade de baixo), estilo miniatura de react.
// Texto e selo na ÁREA SEGURA (x 90–990, y 380–1540).
export const CapaCoringa: React.FC<{ parte?: string; coringa: string; img: string; pos?: string; posTopo?: string; linhas: { t: string; destaque?: boolean }[]; esconde?: boolean; caso?: string; tag?: string | null; seloTop?: number }> =
  ({ parte, coringa, img, pos = "50% 20%", posTopo = "50% 0%", linhas, esconde, caso = "Nº 015", tag = "LOUD CORINGA REAGINDO", seloTop = 1450 }) => (
  <AbsoluteFill style={{ background: C.preto, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 960, overflow: "hidden" }}>
      <Img src={staticFile(`img/${coringa}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: posTopo, filter: "contrast(1.1) saturate(1.1)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,10,11,0.35) 0%, rgba(10,10,11,0) 25%, rgba(10,10,11,0) 60%, rgba(10,10,11,0.85) 100%)" }} />
      {tag && <div style={{ position: "absolute", left: 100, top: 400, display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", background: "#0A0A0B", borderRadius: 8 }}>
        <div style={{ width: 14, height: 14, borderRadius: 7, background: C.verm }} />
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 28, color: C.osso }}>{tag}</div>
      </div>}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 960, height: 960, overflow: "hidden" }}>
      <Img src={staticFile(`img/${img}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos,
        filter: esconde ? "blur(22px) brightness(0.3) grayscale(1) contrast(1.4)" : "contrast(1.12) brightness(0.85)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(10,10,11,0.95) 0%, rgba(10,10,11,0.2) 45%, rgba(10,10,11,0.6) 100%)" }} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 957, height: 6, background: C.osso }} />
    <div style={{ position: "absolute", left: 90, right: 90, top: 780, textAlign: "center" }}>
      {linhas.map((l, i) => <div key={i} style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 108, lineHeight: 1.0, color: C.osso, padding: l.destaque ? "4px 22px 10px" : "0 0 6px", background: l.destaque ? C.lacre : "none", margin: l.destaque ? "10px 0" : 0, textShadow: l.destaque ? "none" : "0 6px 30px rgba(0,0,0,0.95)", boxShadow: l.destaque ? "0 0 0 5px rgba(236,231,220,0.9)" : "none" }}>{l.t}</div>
      </div>)}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: seloTop, display: "flex", justifyContent: "center", gap: 16 }}>
      <div style={{ padding: "8px 18px", border: `3px solid ${C.osso}`, fontFamily: COURIER, fontWeight: 700, fontSize: 30, color: C.osso, letterSpacing: "0.1em", background: "rgba(10,10,11,0.75)" }}>ÁLIBI · CASO {caso}</div>
      {parte && <div style={{ padding: "8px 18px", background: C.lacre, fontFamily: MONT, fontWeight: 800, fontSize: 34, color: C.osso }}>{parte}</div>}
    </div>
  </AbsoluteFill>
);
