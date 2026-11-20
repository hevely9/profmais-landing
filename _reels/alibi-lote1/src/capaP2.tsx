import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, COURIER, MONT, SANS } from "./kit";

// Capa chamativa da PARTE 2 (BC Fortaleza): legível na grade do perfil (miolo 3:4, y 240–1680).
const Carro: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg width={150 * s} height={88 * s} viewBox="0 0 190 110">
    <path d="M15 72 L25 45 Q32 30 50 28 L120 28 Q138 28 150 44 L172 60 Q182 64 182 76 L182 84 L8 84 L8 76 Q8 72 15 72 Z" fill={C.osso} />
    <path d="M48 36 L70 36 L70 56 L36 56 Z M78 36 L118 36 Q130 36 138 52 L138 56 L78 56 Z" fill="#0A0A0B" opacity="0.75" />
    <circle cx="48" cy="86" r="16" fill="#0A0A0B" stroke={C.osso} strokeWidth="6" /><circle cx="146" cy="86" r="16" fill="#0A0A0B" stroke={C.osso} strokeWidth="6" />
  </svg>
);
const Fita: React.FC<{ y: number; rot: number; texto: string }> = ({ y, rot, texto }) => (
  <div style={{ position: "absolute", left: -200, width: 1500, top: y, height: 92, background: C.fita, transform: `rotate(${rot}deg)`, overflow: "hidden", boxShadow: "0 14px 40px rgba(0,0,0,0.7)" }}>
    <div style={{ whiteSpace: "nowrap", fontFamily: MONT, fontWeight: 800, fontSize: 46, lineHeight: "92px", color: "#111", letterSpacing: "0.06em", transform: "translateX(-60px)" }}>{texto.repeat(6)}</div>
  </div>
);

export const CapaParte2: React.FC = () => (
  <AbsoluteFill style={{ background: C.preto, overflow: "hidden" }}>
    <AbsoluteFill><Img src={staticFile("img/f-bc.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%", filter: "grayscale(0.85) contrast(1.2) brightness(0.9)" }} /></AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,10,11,0.55) 0%, rgba(10,10,11,0.2) 30%, rgba(10,10,11,0.75) 55%, rgba(10,10,11,0.96) 80%, #0A0A0B 100%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.65) 100%)" }} />
    <Fita y={150} rot={-9} texto="BANCO CENTRAL · NÃO ULTRAPASSE · " />
    {/* selo PARTE 2 bem grande */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center" }}>
      <div style={{ transform: "rotate(-4deg)", background: C.lacre, padding: "6px 44px 14px", boxShadow: "0 20px 60px rgba(163,20,28,0.6), 0 0 0 6px rgba(236,231,220,0.9)" }}>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 180, lineHeight: 1, color: C.osso, letterSpacing: "0.02em" }}>PARTE 2</div>
      </div>
    </div>
    {/* texto principal: liga direto ao vídeo 1 */}
    <div style={{ position: "absolute", left: 40, right: 40, top: 780, textAlign: "center" }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 112, lineHeight: 1.0, color: C.osso, textShadow: "0 8px 40px rgba(0,0,0,0.95)" }}>O ROUBO DO</div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
        <div style={{ background: C.lacre, padding: "6px 28px 14px", fontFamily: MONT, fontWeight: 800, fontSize: 118, lineHeight: 1.0, color: C.osso }}>BANCO<br />CENTRAL</div>
      </div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.osso, marginTop: 30, textShadow: "0 3px 14px #000" }}>Fortaleza · o túnel até o cofre</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.fita, marginTop: 14, textShadow: "0 3px 14px #000" }}>o que aconteceu depois</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1600, textAlign: "center", fontFamily: COURIER, fontWeight: 700, fontSize: 36, letterSpacing: "0.14em", color: "rgba(236,231,220,0.8)" }}>ÁLIBI · CASO Nº 008</div>
  </AbsoluteFill>
);
