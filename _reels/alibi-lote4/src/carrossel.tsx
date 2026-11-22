import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, COURIER, ELITE, MONT, SANS } from "./kit";

// CARROSSEL (Modo Foto do TikTok) — história curta em 4 fotos, 1080×1920.
// Foto real em tela cheia, etiqueta de lugar/ano, texto grande na área segura (x 90–990, y 380–1540),
// uma palavra em destaque, contador "1/4" e seta pra arrastar. A última foto para antes da virada e chama pro perfil.
export type SlideProps = {
  img: string; pos?: string; zoom?: number; cinza?: boolean; n: number; total: number; etiqueta: string;
  linhas: { t: string; destaque?: boolean; size?: number }[]; sub?: string; credito: string; final?: { pergunta: string; palavra: string; resto: string };
  // modo faixa: imagem horizontal inteira e nítida (sem esticar), fundo desfocado; tapa = [x, y, w, h, texto] por cima de marca d'água
  faixa?: number; tapa?: [number, number, number, number, string];
};

export const Slide: React.FC<SlideProps> = ({ img, pos = "50% 50%", zoom = 1, cinza, n, total, etiqueta, linhas, sub, credito, final, faixa, tapa }) => (
  <AbsoluteFill style={{ background: C.preto, overflow: "hidden" }}>
    <AbsoluteFill>
      <Img src={staticFile(`img/${img}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${faixa !== undefined ? 1.3 : zoom})`, filter: faixa !== undefined ? "blur(40px) brightness(0.35) saturate(0.8)" : `${cinza ? "grayscale(0.6) " : ""}contrast(1.06) saturate(1.05)` }} />
    </AbsoluteFill>
    {faixa === undefined && <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,10,11,0.75) 0%, rgba(10,10,11,0.15) 22%, rgba(10,10,11,0.1) 45%, rgba(10,10,11,0.82) 70%, rgba(10,10,11,0.96) 100%)" }} />}
    {faixa !== undefined && <div style={{ position: "absolute", left: 0, top: faixa, width: 1080, height: 604, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.9)", borderTop: "4px solid #D9D2C0", borderBottom: "4px solid #D9D2C0" }}>
      <Img src={staticFile(`img/${img}.jpg`)} style={{ width: 1080, height: 604, objectFit: "cover", transform: `scale(${zoom})`, transformOrigin: pos, filter: `${cinza ? "grayscale(0.6) " : ""}contrast(1.05)` }} />
      {tapa && <div style={{ position: "absolute", left: tapa[0], top: tapa[1], width: tapa[2], height: tapa[3], background: "#0A0A0B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 22, color: C.osso, letterSpacing: "0.04em" }}>{tapa[4]}</div>}
    </div>}
    {/* topo: marca + contador */}
    <div style={{ position: "absolute", left: 90, right: 90, top: faixa !== undefined ? faixa - 84 : 380, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ padding: "8px 18px", background: C.lacre, fontFamily: MONT, fontWeight: 800, fontSize: 32, color: C.osso, letterSpacing: "0.06em" }}>{etiqueta}</div>
      <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 32, color: C.osso, letterSpacing: "0.1em", textShadow: "0 2px 10px #000" }}>{n}/{total}</div>
    </div>
    {/* texto */}
    <div style={faixa !== undefined ? { position: "absolute", left: 90, right: 90, top: faixa + 650 } : { position: "absolute", left: 90, right: 90, bottom: final ? 560 : 520 }}>
      {linhas.map((l, i) => <div key={i} style={{ display: "flex" }}>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: l.size ?? 82, lineHeight: 1.06, color: C.osso, padding: l.destaque ? "4px 18px 10px" : "0 0 4px", background: l.destaque ? C.lacre : "none", margin: l.destaque ? "10px 0" : 0, textShadow: l.destaque ? "none" : "0 4px 24px rgba(0,0,0,0.95)" }}>{l.t}</div>
      </div>)}
      {sub && <div style={{ marginTop: 22, fontFamily: ELITE, fontSize: 46, lineHeight: 1.25, color: C.osso, textShadow: "0 3px 16px #000" }}>{sub}</div>}
      {final && <div style={{ marginTop: 34, padding: "26px 30px", border: `3px solid ${C.osso}`, background: "rgba(10,10,11,0.7)" }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.osso, lineHeight: 1.2 }}>{final.pergunta}</div>
        <div style={{ marginTop: 14, fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.osso, lineHeight: 1.2 }}>Comenta <span style={{ background: C.lacre, padding: "0 12px" }}>{final.palavra}</span> {final.resto}</div>
      </div>}
    </div>
    {/* rodapé: seta / selo */}
    <div style={{ position: "absolute", left: 90, right: 90, bottom: 400, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 26, color: "rgba(236,231,220,0.75)", letterSpacing: "0.14em" }}>{final && faixa !== undefined ? "" : "ÁLIBI · CASO REAL"}</div>
      {!final && <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 40, color: C.osso, display: "flex", alignItems: "center", gap: 12 }}>arrasta <span style={{ fontSize: 56, color: C.verm }}>→</span></div>}
    </div>
    <div style={faixa !== undefined ? { position: "absolute", right: 24, top: faixa + 614, fontFamily: SANS, fontWeight: 600, fontSize: 18, color: "rgba(236,231,220,0.6)" } : { position: "absolute", right: 40, bottom: 330, fontFamily: SANS, fontWeight: 600, fontSize: 18, color: "rgba(236,231,220,0.55)" }}>{credito}</div>
  </AbsoluteFill>
);
