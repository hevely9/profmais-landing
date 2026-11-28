import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { C, COURIER, MONT, SANS, SOMBRA, lin, q, useT } from "./kit";

// ── gancho com corte de reação (Coringa) — o áudio do corte toca; o fundo é o mesmo vídeo desfocado ──
// cropY: faixa vertical do vídeo original (1080×1920) que aparece; top: onde ela entra na tela.
// tapa: retângulo (coords do vídeo original) coberto pela etiqueta "LOUD CORINGA" (esconde marca d'água).
export const Corte: React.FC<{ src: string; de: number; dur: number; cropY: [number, number]; top: number; tapa?: [number, number]; topo?: boolean }> = ({ src, de, dur, cropY, top, tapa, topo }) => {
  const h = cropY[1] - cropY[0];
  return <Sequence from={q(de)} durationInFrames={q(dur)} layout="none">
    <AbsoluteFill>
      <OffthreadVideo src={staticFile(`v/${src}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(36px) brightness(0.45) saturate(0.8)", transform: "scale(1.2)" }} />
    </AbsoluteFill>
    <div style={{ position: "absolute", left: 0, top, width: 1080, height: h, overflow: "hidden", boxShadow: "0 24px 70px rgba(0,0,0,0.8)" }}>
      <OffthreadVideo src={staticFile(`v/${src}.mp4`)} style={{ position: "absolute", left: 0, top: -cropY[0], width: 1080, height: 1920 }} />
      {tapa && <div style={{ position: "absolute", left: 40, top: tapa[0] - cropY[0], height: tapa[1] - tapa[0], display: "flex", alignItems: "center" }}><Etiqueta /></div>}
    </div>
    {topo && <div style={{ position: "absolute", left: 0, right: 0, top: top - 92, display: "flex", justifyContent: "center" }}><Etiqueta /></div>}
  </Sequence>;
};
export const Etiqueta: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", background: "#0A0A0B", border: "2px solid rgba(236,231,220,0.35)", borderRadius: 8 }}>
    <div style={{ width: 16, height: 16, borderRadius: 8, background: C.verm }} />
    <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: C.osso, letterSpacing: "0.02em" }}>LOUD CORINGA REAGINDO</div>
  </div>
);
// legenda do corte (quando o vídeo original não tem a fala escrita)
export const FalaCorte: React.FC<{ paginas: [number, number, string][] }> = ({ paginas }) => {
  const { t } = useT();
  const p = paginas.find(([a, b]) => t >= a && t < b);
  if (!p) return null;
  return <div style={{ position: "absolute", left: 70, right: 70, top: 1400, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 62, lineHeight: 1.1, color: C.osso, textShadow: "0 4px 16px #000, 0 0 3px #000" }}>
    {p[2].split("*").map((s, i) => <span key={i} style={{ color: i % 2 ? "#3BE07A" : C.osso }}>{s}</span>)}
  </div>;
};

// silhueta escondida (Parte 1: o assassino ainda não pode ser revelado)
export const Misterio: React.FC<{ img: string }> = ({ img }) => {
  const { t } = useT();
  return <>
    <AbsoluteFill><Img src={staticFile(`img/${img}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 25%", filter: "blur(26px) brightness(0.22) contrast(1.4) grayscale(1)" }} /></AbsoluteFill>
    <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 420, color: C.lacre, opacity: 0.55 + 0.25 * Math.sin(t * 4), textShadow: "0 0 60px rgba(163,20,28,0.8)" }}>?</div>
  </>;
};

// comparação lado a lado: retrato do DNA × rosto real
export const Compara: React.FC<{ a: string; b: string; ra: number; rb: number; la: string; lb: string; credA: string; credB: string }> = ({ a, b, ra, rb, la, lb, credA, credB }) => {
  const { t, o } = useT();
  const lado = (img: string, r: number, rot: string, left: number, label: string, cred: string, pos: string) => {
    const k = lin(t, o(r) - 0.05, o(r) + 0.4, Easing.out(Easing.back(1.4)));
    if (k <= 0) return null;
    return <div style={{ position: "absolute", left, top: 330, width: 470, opacity: Math.min(1, k * 1.3), transform: `rotate(${rot}) scale(${0.85 + 0.15 * k})` }}>
      <div style={{ width: 470, height: 600, border: "10px solid #D9D2C0", background: "#111", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.9)" }}>
        <Img src={staticFile(`img/${img}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, filter: "contrast(1.08)" }} />
      </div>
      <div style={{ marginTop: 18, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 40, color: C.osso, textShadow: SOMBRA }}>{label}</div>
      <div style={{ textAlign: "center", fontFamily: COURIER, fontSize: 18, color: "rgba(236,231,220,0.6)" }}>{cred}</div>
    </div>;
  };
  return <>
    {lado(a, ra, "-3deg", 50, la, credA, "30% 30%")}
    {lado(b, rb, "3deg", 560, lb, credB, "50% 20%")}
  </>;
};
