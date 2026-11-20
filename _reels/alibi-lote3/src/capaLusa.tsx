import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, COURIER, MONT, SANS } from "./kit";

// Capa do Caso Nº 016: tela dividida Flamengo (cima) × Portuguesa (baixo), pergunta no meio (miolo 3:4, y 240–1680).
const Metade: React.FC<{ img: string; pos: string; top: number; h: number; cor: string; nome: string; embaixo?: boolean }> = ({ img, pos, top, h, cor, nome, embaixo }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, height: h, overflow: "hidden" }}>
    <Img src={staticFile(`img/${img}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, filter: "contrast(1.12) saturate(1.1) brightness(0.88)" }} />
    <AbsoluteFill style={{ background: embaixo ? "linear-gradient(180deg, rgba(10,10,11,0.15) 40%, rgba(10,10,11,0.9) 100%)" : "linear-gradient(180deg, rgba(10,10,11,0.2) 40%, rgba(10,10,11,0.85) 100%)" }} />
    <div style={{ position: "absolute", left: 50, [embaixo ? "bottom" : "top"]: embaixo ? 360 : 410, padding: "6px 22px", background: cor, fontFamily: MONT, fontWeight: 800, fontSize: 52, color: C.osso }}>{nome}</div>
  </div>
);
export const CapaLusa: React.FC = () => (
  <AbsoluteFill style={{ background: C.preto, overflow: "hidden" }}>
    <Metade img="l-andre" pos="32% 18%" top={0} h={990} cor="#8E0F1E" nome="FLAMENGO" />
    <Metade img="l-heverton" pos="27% 20%" top={990} h={930} cor="#0B5E33" nome="PORTUGUESA" embaixo />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.55) 50%, transparent 56%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 270, display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "10px 22px", border: `3px solid ${C.osso}`, fontFamily: COURIER, fontWeight: 700, fontSize: 36, color: C.osso, letterSpacing: "0.1em", background: "rgba(10,10,11,0.6)" }}>ÁLIBI · CASO Nº 016</div>
    </div>
    <div style={{ position: "absolute", left: 30, right: 30, top: 630, textAlign: "center" }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 150, lineHeight: 1.0, color: C.osso, textShadow: "0 8px 40px rgba(0,0,0,0.95)" }}>QUEM ERA</div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
        <div style={{ background: C.lacre, padding: "4px 30px 12px", fontFamily: MONT, fontWeight: 800, fontSize: 160, lineHeight: 1.0, color: C.osso, boxShadow: "0 0 0 6px rgba(236,231,220,0.9)" }}>PRA CAIR?</div>
      </div>
      </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1590, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 50, color: C.osso, textShadow: "0 3px 14px #000" }}>Brasileirão 2013 · 13 minutos</div>
  </AbsoluteFill>
);
