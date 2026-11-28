import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile } from "remotion";
import { C, COURIER, ELITE, MONT, SANS, SOMBRA, clamp, lin, useT } from "./kit";

// ═══════════ IDENTIDADE VISUAL DO ÁLIBI (dossiê) ═══════════
// Mural do investigador (cortiça + fotos presas + fios vermelhos), planta da casa animada, VERSÃO × FATO,
// manchetes reais, relógio da noite e o dossiê fechando com carimbo. Reutilizável em todos os casos.

const Cortica: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #5A4330 0%, #3A2A1C 60%, #1E150D 100%)" }}>
    <svg width="1080" height="1920" style={{ position: "absolute", opacity: 0.35, mixBlendMode: "multiply" }}>
      <filter id="cortica"><feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" seed="7" /><feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.17  0 0 0 0 0.1  0 0 0 1.2 -0.1" /></filter>
      <rect width="1080" height="1920" filter="url(#cortica)" />
    </svg>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(0,0,0,0.75) 100%)" }} />
  </AbsoluteFill>
);

export type ItemMural = { id: string; r: number; x: number; y: number; w?: number; h?: number; img?: string; titulo: string; sub?: string; rot?: number; pos?: string; cinza?: boolean };
export type FioMural = { a: string; b: string; r: number; texto?: string };
// câmera: lista de [tempo bruto, escala, x, y] — o mural "anda" entre os pontos
export const Mural: React.FC<{ itens: ItemMural[]; fios: FioMural[]; camera?: [number, number, number, number][] }> = ({ itens, fios, camera = [[0, 1, 0, 0]] }) => {
  const { t, o } = useT();
  const cam = (() => {
    if (camera.length === 1) return camera[0].slice(1) as number[];
    const ts = camera.map((c) => o(c[0]));
    const f = (i: number) => interpolate(t, ts, camera.map((c) => c[i]), { ...clamp, easing: Easing.inOut(Easing.cubic) });
    return [f(1), f(2), f(3)];
  })();
  const centro = (id: string) => { const it = itens.find((i) => i.id === id)!; return [it.x + (it.w ?? 300) / 2, it.y + 22]; };
  return <AbsoluteFill>
    <Cortica />
    <AbsoluteFill style={{ transform: `scale(${cam[0]}) translate(${cam[1]}px, ${cam[2]}px)` }}>
      {itens.map((it) => {
        const k = lin(t, o(it.r) - 0.05, o(it.r) + 0.4, Easing.out(Easing.back(1.4)));
        if (k <= 0) return null;
        const w = it.w ?? 300, h = it.h ?? (it.img ? 340 : 160);
        return <div key={it.id} style={{ position: "absolute", left: it.x, top: it.y, width: w, opacity: Math.min(1, k * 1.4), transform: `rotate(${it.rot ?? 0}deg) scale(${0.8 + 0.2 * k})`, transformOrigin: "50% 0%" }}>
          <div style={{ background: it.img ? "#ECE7DC" : "#F1E7C9", padding: it.img ? "14px 14px 0" : "18px 20px", boxShadow: "0 18px 40px rgba(0,0,0,0.65)" }}>
            {it.img ? <div style={{ width: w - 28, height: h, overflow: "hidden", background: "#222" }}>
              <Img src={staticFile(`img/${it.img}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: it.pos ?? "50% 30%", filter: `${it.cinza === false ? "" : "grayscale(0.7) "}contrast(1.08) sepia(0.15)` }} />
            </div> : <svg viewBox="0 0 100 70" style={{ display: "none" }} />}
            <div style={{ padding: it.img ? "12px 4px 14px" : 0, textAlign: "center" }}>
              <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: it.img ? 30 : 34, color: C.tinta, lineHeight: 1.1 }}>{it.titulo}</div>
              {it.sub && <div style={{ fontFamily: ELITE, fontSize: 24, color: "#4A3F35", marginTop: 6 }}>{it.sub}</div>}
            </div>
          </div>
          <div style={{ position: "absolute", left: w / 2 - 14, top: -12, width: 28, height: 28, borderRadius: 14, background: "radial-gradient(circle at 35% 35%, #FF6B6B, #A3141C)", boxShadow: "0 4px 8px rgba(0,0,0,0.6)" }} />
        </div>;
      })}
      <svg width="1080" height="1920" style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        {fios.map((f, i) => {
          const k = lin(t, o(f.r), o(f.r) + 0.7, Easing.inOut(Easing.cubic));
          if (k <= 0) return null;
          const [x1, y1] = centro(f.a), [x2, y2] = centro(f.b);
          const len = Math.hypot(x2 - x1, y2 - y1);
          return <g key={i}>
            <path d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 + 60} ${x2} ${y2}`} stroke="#C8102E" strokeWidth="5" fill="none" strokeDasharray={len * 1.2} strokeDashoffset={len * 1.2 * (1 - k)} style={{ filter: "drop-shadow(0 3px 3px rgba(0,0,0,0.6))" }} />
            {f.texto && k > 0.9 && <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 + 40} textAnchor="middle" fontFamily="Courier" fontWeight="700" fontSize="30" fill="#F1E7C9" stroke="#1E150D" strokeWidth="6" paintOrder="stroke">{f.texto}</text>}
          </g>;
        })}
      </svg>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// planta da casa vista de cima (ilustrativa) com o trajeto desenhado ao longo da narração
export type Trecho = { r: number; dur?: number; d: string; cor?: string };
export const Planta: React.FC<{ trechos: Trecho[]; marcas: { r: number; x: number; y: number; texto: string }[]; titulo?: string }> = ({ trechos, marcas, titulo = "PLANTA ILUSTRATIVA DA CASA" }) => {
  const { t, o } = useT();
  return <AbsoluteFill>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #10202E 0%, #070D14 85%)" }} />
    <svg width="1080" height="1920" style={{ position: "absolute" }}>
      <defs><pattern id="grade" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(120,170,220,0.12)" strokeWidth="1" /></pattern></defs>
      <rect width="1080" height="1920" fill="url(#grade)" />
      <g stroke="#9CC4E8" strokeWidth="6" fill="rgba(156,196,232,0.05)">
        <rect x="140" y="420" width="800" height="820" />
        <line x1="140" y1="760" x2="620" y2="760" /><line x1="620" y1="420" x2="620" y2="1240" />
        <line x1="620" y1="900" x2="940" y2="900" /><line x1="380" y1="760" x2="380" y2="1240" />
      </g>
      <g stroke="#9CC4E8" strokeWidth="3" fill="none" opacity="0.8">
        {Array.from({ length: 8 }, (_, i) => <line key={i} x1={660} y1={940 + i * 34} x2={900} y2={940 + i * 34} />)}
      </g>
      <g fontFamily="Courier" fontWeight="700" fontSize="28" fill="#9CC4E8" letterSpacing="2">
        <text x="230" y="600">QUARTO DOS PAIS</text><text x="236" y="636" fontSize="22" opacity="0.7">(andar de cima)</text>
        <text x="690" y="680">SALA</text><text x="700" y="1236" fontSize="24">ESCADA</text>
        <text x="190" y="1010">ENTRADA</text><text x="430" y="1010">COZINHA</text>
      </g>
      {trechos.map((tr, i) => {
        const k = lin(t, o(tr.r), o(tr.r) + (tr.dur ?? 1.4), Easing.inOut(Easing.cubic));
        if (k <= 0) return null;
        return <path key={i} d={tr.d} stroke={tr.cor ?? C.fita} strokeWidth="9" fill="none" strokeLinecap="round" strokeDasharray="2000" strokeDashoffset={2000 * (1 - k)} style={{ filter: `drop-shadow(0 0 10px ${tr.cor ?? C.fita})` }} />;
      })}
    </svg>
    {marcas.map((m, i) => {
      const k = lin(t, o(m.r) - 0.05, o(m.r) + 0.3, Easing.out(Easing.back(1.6)));
      if (k <= 0) return null;
      return <div key={i} style={{ position: "absolute", left: m.x, top: m.y, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * k})`, opacity: Math.min(1, k * 1.4), padding: "6px 14px", background: C.lacre, fontFamily: SANS, fontWeight: 800, fontSize: 28, color: C.osso, whiteSpace: "nowrap", boxShadow: "0 8px 20px rgba(0,0,0,0.6)" }}>{m.texto}</div>;
    })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1270, textAlign: "center", fontFamily: COURIER, fontSize: 22, letterSpacing: "0.2em", color: "rgba(156,196,232,0.6)" }}>{titulo}</div>
  </AbsoluteFill>;
};

// VERSÃO × FATO
export const VersaoFato: React.FC<{ versao: string; fatos: [number, string][]; r: number; carimbo?: [number, string] }> = ({ versao, fatos, r, carimbo }) => {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.05, o(r) + 0.4, Easing.out(Easing.cubic));
  const ck = carimbo ? lin(t, o(carimbo[0]) - 0.01, o(carimbo[0]) + 0.12, Easing.in(Easing.cubic)) : 0;
  return <AbsoluteFill>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #24201C 0%, #0A0A0B 75%)" }} />
    <div style={{ position: "absolute", left: 60, right: 60, top: 300, opacity: k }}>
      <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 32, letterSpacing: "0.2em", color: C.ossoE }}>A VERSÃO</div>
      <div style={{ marginTop: 10, padding: "20px 26px", border: `3px solid ${C.ossoE}`, fontFamily: MONT, fontWeight: 800, fontSize: 60, color: C.osso }}>{versao}</div>
      <div style={{ marginTop: 54, fontFamily: COURIER, fontWeight: 700, fontSize: 32, letterSpacing: "0.2em", color: C.verm }}>O QUE A POLÍCIA VIU</div>
      <div style={{ marginTop: 10, padding: "16px 26px", background: "rgba(163,20,28,0.18)", borderLeft: `8px solid ${C.verm}` }}>
        {fatos.map(([fr, txt], i) => {
          const fk = lin(t, o(fr) - 0.05, o(fr) + 0.3, Easing.out(Easing.cubic));
          return <div key={i} style={{ opacity: fk, transform: `translateX(${(1 - fk) * -30}px)`, fontFamily: SANS, fontWeight: 800, fontSize: 50, color: C.osso, lineHeight: 1.5 }}>✗ {txt}</div>;
        })}
      </div>
    </div>
    {carimbo && ck > 0 && <div style={{ position: "absolute", left: 540, top: 1130, transform: `translate(-50%,-50%) rotate(-8deg) scale(${interpolate(ck, [0, 1], [2.4, 1])})`, opacity: Math.min(1, ck * 1.5), border: `9px solid ${C.lacre}`, borderRadius: 10, padding: "8px 24px", color: C.lacre, fontFamily: ELITE, fontSize: 96, letterSpacing: "0.06em", whiteSpace: "nowrap", filter: "url(#gasto)", background: "rgba(10,10,11,0.5)" }}>{carimbo[1]}</div>}
  </AbsoluteFill>;
};

// manchetes reais (texto + veículo) entrando como recortes
export const Manchetes: React.FC<{ itens: [number, string, string][] }> = ({ itens }) => {
  const { t, o } = useT();
  return <AbsoluteFill>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #24201C 0%, #0A0A0B 75%)" }} />
    {itens.map(([r, titulo, veiculo], i) => {
      const k = lin(t, o(r) - 0.05, o(r) + 0.35, Easing.out(Easing.back(1.4)));
      if (k <= 0) return null;
      return <div key={i} style={{ position: "absolute", left: 70 + (i % 2) * 30, right: 70 - (i % 2) * 30, top: 300 + i * 250, opacity: Math.min(1, k * 1.4), transform: `rotate(${i % 2 ? 1.5 : -1.5}deg) scale(${0.85 + 0.15 * k})`, background: "#F4F1EA", padding: "22px 28px", boxShadow: "0 18px 40px rgba(0,0,0,0.7)" }}>
        <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 22, letterSpacing: "0.12em", color: C.lacre }}>{veiculo}</div>
        <div style={{ fontFamily: "Playfair", fontWeight: 900, fontSize: 40, lineHeight: 1.15, color: "#111", marginTop: 6 }}>{titulo}</div>
      </div>;
    })}
  </AbsoluteFill>;
};

// relógio digital da noite do crime
export const Hora: React.FC<{ r: number; hora: string; top?: number; sub?: string }> = ({ r, hora, top = 360, sub }) => {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.05, o(r) + 0.3, Easing.out(Easing.back(1.6)));
  if (k <= 0) return null;
  const pisca = Math.floor(t * 2) % 2 === 0;
  return <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, k * 1.4), transform: `scale(${0.8 + 0.2 * k})` }}>
    <div style={{ padding: "12px 40px", background: "rgba(10,10,11,0.88)", border: `3px solid ${C.verm}`, fontFamily: MONT, fontWeight: 800, fontSize: 150, color: C.verm, letterSpacing: "0.04em", textShadow: `0 0 30px rgba(224,53,63,0.6)` }}>
      {hora.replace(":", pisca ? ":" : " ")}
    </div>
    {sub && <div style={{ marginTop: 14, fontFamily: COURIER, fontWeight: 700, fontSize: 36, letterSpacing: "0.14em", color: C.osso, textShadow: SOMBRA }}>{sub}</div>}
  </div>;
};

// dossiê fechando com carimbo (assinatura visual do fim)
export const Fechamento: React.FC<{ r: number; caso: string; status: string; pergunta: string }> = ({ r, caso, status, pergunta }) => {
  const { t, o } = useT();
  const k = lin(t, o(r), o(r) + 0.6, Easing.out(Easing.cubic));
  const ck = lin(t, o(r) + 0.7, o(r) + 0.85, Easing.in(Easing.cubic));
  const pk = lin(t, o(r) + 1.0, o(r) + 1.5, Easing.out(Easing.cubic));
  return <AbsoluteFill>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #24201C 0%, #0A0A0B 75%)" }} />
    <div style={{ position: "absolute", left: 140, right: 140, top: 340, height: 620, background: "linear-gradient(180deg, #C9A56A 0%, #A9844C 100%)", borderRadius: "0 16px 6px 6px", boxShadow: "0 30px 80px rgba(0,0,0,0.85)", transform: `perspective(1400px) rotateX(${(1 - k) * 50}deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", left: 0, top: -46, width: 280, height: 50, background: "#C9A56A", borderRadius: "14px 14px 0 0" }} />
      <div style={{ position: "absolute", left: 50, top: 50, fontFamily: COURIER, fontWeight: 700, fontSize: 30, letterSpacing: "0.2em", color: "#3A2A1C" }}>DOSSIÊ</div>
      <div style={{ position: "absolute", left: 50, top: 100, fontFamily: MONT, fontWeight: 800, fontSize: 64, color: "#2A1E12" }}>ÁLIBI · CASO {caso}</div>
      {ck > 0 && <div style={{ position: "absolute", left: 400, top: 380, transform: `translate(-50%,-50%) rotate(-10deg) scale(${interpolate(ck, [0, 1], [2.4, 1])})`, opacity: Math.min(1, ck * 1.5), border: `10px solid ${C.lacre}`, borderRadius: 10, padding: "10px 30px", color: C.lacre, fontFamily: ELITE, fontSize: 92, letterSpacing: "0.06em", whiteSpace: "nowrap", filter: "url(#gasto)" }}>{status}</div>}
    </div>
    <div style={{ position: "absolute", left: 70, right: 70, top: 1030, textAlign: "center", opacity: pk, fontFamily: SANS, fontWeight: 800, fontSize: 50, lineHeight: 1.25, color: C.osso, textShadow: SOMBRA }}>{pergunta}</div>
  </AbsoluteFill>;
};

// trecho de vídeo REAL (arquivo/documentário), sem som, mostrado numa faixa recortada (esconde marca d'água e legenda embutida)
import { OffthreadVideo, Sequence } from "remotion";
export const ArquivoReal: React.FC<{ src: string; r: number; dur: number; cropY: [number, number]; top: number; credito: string; etiqueta?: string; tapaDir?: [number, number, string] }> = ({ src, r, dur, cropY, top, credito, etiqueta, tapaDir }) => {
  const { o } = useT();
  const h = cropY[1] - cropY[0];
  return <Sequence from={Math.round(o(r) * 30)} durationInFrames={Math.round(dur * 30)} layout="none">
    <AbsoluteFill><OffthreadVideo src={staticFile(`v/${src}.mp4`)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(36px) brightness(0.4)", transform: "scale(1.2)" }} /></AbsoluteFill>
    <div style={{ position: "absolute", left: 0, top, width: 1080, height: h, overflow: "hidden", boxShadow: "0 24px 70px rgba(0,0,0,0.85)", borderTop: "4px solid #D9D2C0", borderBottom: "4px solid #D9D2C0" }}>
      <OffthreadVideo src={staticFile(`v/${src}.mp4`)} muted style={{ position: "absolute", left: 0, top: -cropY[0], width: 1080, height: 1920 }} />
      {etiqueta && <div style={{ position: "absolute", left: 24, top: 20, padding: "6px 14px", background: "#0A0A0B", fontFamily: SANS, fontWeight: 800, fontSize: 26, color: C.osso, display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 12, height: 12, borderRadius: 6, background: C.verm, display: "inline-block" }} />{etiqueta}</div>}
      {tapaDir && <div style={{ position: "absolute", right: 0, top: tapaDir[0] - cropY[0], height: tapaDir[1] - tapaDir[0], width: 380, background: "#0A0A0B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 26, color: C.osso, letterSpacing: "0.04em" }}>{tapaDir[2]}</div>}
    </div>
    <div style={{ position: "absolute", right: 34, top: 1262, fontFamily: SANS, fontWeight: 600, fontSize: 17, color: "rgba(236,231,220,0.6)", textShadow: "0 1px 4px #000" }}>{credito}</div>
  </Sequence>;
};
