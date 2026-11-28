import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, COURIER, MONT, SANS } from "./kit";

// Capa do Caso Nº 013: tela dividida Flamengo (cima) × Portuguesa (baixo).
// Tudo que é texto fica na ÁREA SEGURA: x 90–990 e y 380–1540 (cabe no recorte 3:4 da grade, y 240–1680, com folga).
const Metade: React.FC<{ img: string; pos: string; top: number; h: number; filtroDe: "cima" | "baixo" }> = ({ img, pos, top, h, filtroDe }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, height: h, overflow: "hidden" }}>
    <Img src={staticFile(`img/${img}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, filter: "contrast(1.12) saturate(1.1) brightness(0.88)" }} />
    <AbsoluteFill style={{ background: filtroDe === "cima" ? "linear-gradient(180deg, rgba(10,10,11,0.15) 45%, rgba(10,10,11,0.85) 100%)" : "linear-gradient(0deg, rgba(10,10,11,0.15) 45%, rgba(10,10,11,0.85) 100%)" }} />
  </div>
);
const Tag: React.FC<{ texto: string; cor: string; top: number }> = ({ texto, cor, top }) => (
  <div style={{ position: "absolute", left: 100, top, padding: "4px 18px", background: cor, fontFamily: MONT, fontWeight: 800, fontSize: 42, color: C.osso }}>{texto}</div>
);
export const CapaLusa: React.FC = () => (
  <AbsoluteFill style={{ background: C.preto, overflow: "hidden" }}>
    <Metade img="l-andre" pos="32% 14%" top={0} h={960} filtroDe="cima" />
    <Metade img="l-heverton" pos="27% 10%" top={960} h={960} filtroDe="baixo" />
    {/* selo do caso */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 390, display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "8px 20px", border: `3px solid ${C.osso}`, fontFamily: COURIER, fontWeight: 700, fontSize: 32, color: C.osso, letterSpacing: "0.1em", background: "rgba(10,10,11,0.7)" }}>ÁLIBI · CASO Nº 013</div>
    </div>
    <Tag texto="FLAMENGO" cor="#8E0F1E" top={480} />
    {/* pergunta no centro */}
    <div style={{ position: "absolute", left: 90, right: 90, top: 760, textAlign: "center" }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 124, lineHeight: 1.0, color: C.osso, textShadow: "0 8px 40px rgba(0,0,0,0.95)" }}>QUEM ERA</div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
        <div style={{ background: C.lacre, padding: "4px 26px 10px", fontFamily: MONT, fontWeight: 800, fontSize: 128, lineHeight: 1.0, color: C.osso, boxShadow: "0 0 0 5px rgba(236,231,220,0.9)" }}>PRA CAIR?</div>
      </div>
    </div>
    <Tag texto="PORTUGUESA" cor="#0B5E33" top={1390} />
    <div style={{ position: "absolute", left: 90, right: 90, top: 1470, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.osso, textShadow: "0 3px 14px #000" }}>Brasileirão 2013 · 13 minutos</div>
  </AbsoluteFill>
);
