import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { C, COURIER, ELITE, MONT, SANS, SOMBRA, lin, useT } from "./kit";

// ── peças gráficas do lote 2 ──
export const Tela: React.FC<{ children: React.ReactNode; top?: number; h?: number; barra?: string; rot?: number }> = ({ children, top = 360, h = 700, barra, rot = 0 }) => (
  <div style={{ position: "absolute", left: 90, right: 90, top, height: h, background: "#16171B", borderRadius: 28, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.85)", border: "2px solid #2C2D33", transform: `rotate(${rot}deg)` }}>
    {barra && <div style={{ height: 76, background: "#23242A", display: "flex", alignItems: "center", gap: 14, padding: "0 26px" }}>
      {["#E0353F", "#E3B23C", "#3DBE6B"].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />)}
      <div style={{ marginLeft: 16, flex: 1, height: 44, borderRadius: 22, background: "#0F1013", color: "#C9CCD3", fontFamily: SANS, fontWeight: 600, fontSize: 26, display: "flex", alignItems: "center", padding: "0 20px" }}>{barra}</div>
    </div>}
    <div style={{ padding: 40 }}>{children}</div>
  </div>
);
export const Botao: React.FC<{ texto: string; cor?: string; clique?: number; size?: number }> = ({ texto, cor = "#22A559", clique, size = 44 }) => {
  const { t, o } = useT();
  const press = clique !== undefined ? lin(t, o(clique) - 0.05, o(clique)) * (1 - lin(t, o(clique) + 0.1, o(clique) + 0.25)) : 0;
  return <div style={{ height: 110, borderRadius: 18, background: cor, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONT, fontWeight: 800, fontSize: size, color: "#fff", transform: `scale(${1 - 0.06 * press})`, boxShadow: "0 10px 0 rgba(0,0,0,0.35)" }}>{texto}</div>;
};
export const Cursor: React.FC<{ r: number; x: [number, number]; y: [number, number] }> = ({ r, x, y }) => {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.8, o(r) - 0.05, Easing.inOut(Easing.cubic));
  const press = lin(t, o(r) - 0.05, o(r)) * (1 - lin(t, o(r) + 0.1, o(r) + 0.25));
  return <svg width="90" height="110" viewBox="0 0 24 30" style={{ position: "absolute", left: x[0] + (x[1] - x[0]) * k, top: y[0] + (y[1] - y[0]) * k, transform: `scale(${1 - 0.15 * press})`, filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.6))" }}>
    <path d="M2 2 L2 24 L8 18 L12 28 L16 26 L12 16 L20 16 Z" fill="#fff" stroke="#000" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>;
};

// crachá VIP do "herdeiro" (reconstituição)
export const Cracha: React.FC<{ r: number; falso?: number }> = ({ r, falso }) => {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.1, o(r) + 0.35, Easing.out(Easing.back(1.5)));
  const balanco = Math.sin((t - o(r)) * 2.2) * 3;
  const riscado = falso !== undefined ? lin(t, o(falso), o(falso) + 0.35) : 0;
  return <>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #2A1F10 0%, #0A0A0B 72%)" }} />
    <div style={{ position: "absolute", left: 535, top: 0, width: 10, height: 420, background: "linear-gradient(#B8932E, #E7C873)", opacity: k }} />
    <div style={{ position: "absolute", left: 220, top: 400, width: 640, height: 820, borderRadius: 30, background: "linear-gradient(160deg, #F4EBD3, #D9C9A0)", boxShadow: "0 40px 90px rgba(0,0,0,0.9)", transform: `translateY(${(1 - k) * -500}px) rotate(${balanco}deg)`, transformOrigin: "50% -40%", overflow: "hidden" }}>
      <div style={{ height: 150, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONT, fontWeight: 800, fontSize: 92, letterSpacing: "0.2em", color: "#E7C873" }}>VIP</div>
      <div style={{ margin: "50px auto 0", width: 230, height: 290, background: "#CFC7B3", border: "4px solid #1A1714", position: "relative", overflow: "hidden" }}>
        <svg viewBox="0 0 100 126" style={{ position: "absolute", left: 0, bottom: 0, width: "100%" }}><path d="M30 42 a20 21 0 1 0 40 0 a20 21 0 1 0 -40 0 Z M12 126 C14 94 30 80 50 80 C70 80 86 94 88 126 Z" fill="#2A2622" /></svg>
      </div>
      <div style={{ textAlign: "center", marginTop: 34, fontFamily: MONT, fontWeight: 800, fontSize: 48, color: C.tinta, lineHeight: 1.05, position: "relative" }}>HENRIQUE<br />CONSTANTINO
        {riscado > 0 && <div style={{ position: "absolute", left: 40, top: "50%", height: 12, width: `${riscado * 82}%`, background: C.lacre, transform: "rotate(-8deg)" }} />}
      </div>
      <div style={{ textAlign: "center", marginTop: 16, fontFamily: COURIER, fontWeight: 700, fontSize: 28, color: "#5A5040" }}>"herdeiro" · camarote</div>
    </div>
    <div style={{ position: "absolute", right: 34, top: 1262, fontFamily: SANS, fontWeight: 600, fontSize: 17, color: "rgba(236,231,220,0.55)" }}>reconstituição</div>
  </>;
};
// flashes de câmera (paparazzi)
export const Flashes: React.FC<{ r: number; n?: number }> = ({ r, n = 6 }) => {
  const { t, o } = useT();
  return <>{Array.from({ length: n }, (_, i) => {
    const at = o(r) + i * 0.32 + (i % 3) * 0.07;
    const k = lin(t, at, at + 0.04) * (1 - lin(t, at + 0.05, at + 0.22));
    const x = [180, 820, 420, 700, 260, 900][i % 6], y = [420, 520, 900, 300, 1100, 980][i % 6];
    return <div key={i} style={{ position: "absolute", left: x - 300, top: y - 300, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.35) 25%, transparent 60%)", opacity: k, mixBlendMode: "screen" }} />;
  })}</>;
};
// ficha com silhueta (quando não há foto livre da pessoa)
export const Ficha: React.FC<{ nome: string; sup?: string; linhas?: [number, string][]; tremor?: boolean; top?: number }> = ({ nome, sup = "FICHA", linhas = [], tremor, top = 330 }) => {
  const { t, o } = useT();
  const tr = tremor ? Math.sin(t * 50) * 3 : 0;
  return <>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #24201C 0%, #0A0A0B 75%)" }} />
    <div style={{ position: "absolute", left: 90, right: 90, top, padding: "40px 46px", background: C.papel, boxShadow: "0 30px 80px rgba(0,0,0,0.85)", transform: `rotate(-1.2deg) translateX(${tr}px)` }}>
      <div style={{ fontFamily: COURIER, fontSize: 26, letterSpacing: "0.16em", color: C.tinta, opacity: 0.7 }}>{sup}</div>
      <div style={{ display: "flex", gap: 34, marginTop: 20, alignItems: "flex-start" }}>
        <div style={{ width: 250, height: 320, flexShrink: 0, background: "#CFC7B3", border: `3px solid ${C.tinta}`, position: "relative", overflow: "hidden", backgroundImage: "repeating-linear-gradient(0deg, rgba(26,23,20,0.25) 0 2px, transparent 2px 40px)" }}>
          <svg viewBox="0 0 100 126" style={{ position: "absolute", left: 0, bottom: 0, width: "100%" }}><path d="M30 42 a20 21 0 1 0 40 0 a20 21 0 1 0 -40 0 Z M12 126 C14 94 30 80 50 80 C70 80 86 94 88 126 Z" fill="#2A2622" /></svg>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 6, textAlign: "center", fontFamily: COURIER, fontSize: 15, color: "#E4DDCB" }}>silhueta ilustrativa</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 54, lineHeight: 1.05, color: C.tinta }}>{nome}</div>
          <div style={{ height: 3, background: C.tinta, opacity: 0.5, margin: "16px 0 18px" }} />
          {linhas.map(([r, txt], i) => {
            const n = Math.max(0, Math.floor((t - o(r)) * 42));
            return <div key={i} style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 32, lineHeight: 1.45, color: C.tinta }}>{txt.slice(0, n)}</div>;
          })}
        </div>
      </div>
    </div>
  </>;
};
// pirâmide de pessoas que cresce (quem entra depois paga quem entrou antes)
export const Piramide: React.FC<{ r: number; setas?: number; contador?: boolean }> = ({ r, setas, contador = true }) => {
  const { t, o } = useT();
  const niveis = 7;
  const total = Math.round(1000000 * lin(t, o(r), o(r) + 1.6, Easing.out(Easing.cubic)));
  return <>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #1C1A16 0%, #0A0A0B 75%)" }} />
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: niveis }, (_, nv) => {
        const k = lin(t, o(r) + nv * 0.18, o(r) + nv * 0.18 + 0.25);
        const qtd = Math.pow(2, nv), y = 430 + nv * 105, larg = Math.min(900, 80 * qtd);
        return <g key={nv} opacity={k}>{Array.from({ length: Math.min(qtd, 40) }, (_, i) => {
          const n = Math.min(qtd, 40), x = 540 - larg / 2 + (larg / n) * (i + 0.5), s = Math.max(8, 30 - nv * 3.4);
          return <g key={i}><circle cx={x} cy={y - s * 1.1} r={s * 0.55} fill={nv === 0 ? C.verm : C.osso} /><rect x={x - s * 0.7} y={y - s * 0.4} width={s * 1.4} height={s * 1.3} rx={s * 0.5} fill={nv === 0 ? C.verm : C.osso} /></g>;
        })}</g>;
      })}
      {setas !== undefined && Array.from({ length: 5 }, (_, i) => {
        const ph = ((t - o(setas)) * 0.9 + i * 0.2) % 1; if (t < o(setas)) return null;
        const y = 1080 - ph * 640;
        return <text key={i} x={300 + i * 120} y={y} fontFamily="Mont" fontWeight="800" fontSize="56" fill="#3DBE6B" opacity={Math.sin(ph * Math.PI)}>$</text>;
      })}
    </svg>
    {contador && <div style={{ position: "absolute", left: 0, right: 0, top: 1150, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 90, color: C.osso, textShadow: SOMBRA }}>{total.toLocaleString("pt-BR")}</div>}
  </>;
};
// gráfico do "pump and dump": sobe, vende no topo, despenca
export const Grafico: React.FC<{ r: number; queda?: number; marcas?: [number, string][] }> = ({ r, queda, marcas = [] }) => {
  const { t, o } = useT();
  const pts: [number, number][] = [[120, 1080], [260, 1040], [380, 980], [500, 860], [610, 700], [700, 560], [780, 470]];
  const quedaPts: [number, number][] = [[840, 700], [900, 960], [960, 1110]];
  const k = lin(t, o(r), o(r) + 5.5, Easing.inOut(Easing.cubic));
  const kq = queda !== undefined ? lin(t, o(queda), o(queda) + 0.7, Easing.in(Easing.cubic)) : 0;
  const n = Math.max(2, Math.floor(k * pts.length));
  const linha = [...pts.slice(0, n), ...(kq > 0 ? quedaPts.slice(0, Math.max(1, Math.ceil(kq * quedaPts.length))) : [])];
  return <>
    <AbsoluteFill style={{ background: "#0B0D10" }} />
    <AbsoluteFill style={{ opacity: 0.18, backgroundImage: "linear-gradient(rgba(124,242,166,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(124,242,166,0.4) 1px, transparent 1px)", backgroundSize: "90px 90px" }} />
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
      <polyline points={linha.map((p) => p.join(",")).join(" ")} fill="none" stroke={kq > 0 ? C.verm : "#3DBE6B"} strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" />
      {linha.length > 0 && <circle cx={linha[linha.length - 1][0]} cy={linha[linha.length - 1][1]} r="18" fill={kq > 0 ? C.verm : "#3DBE6B"} />}
    </svg>
    {marcas.map(([mr, txt], i) => {
      const km = lin(t, o(mr) - 0.05, o(mr) + 0.3, Easing.out(Easing.back(1.5)));
      const [x, y] = [[140, 1130], [420, 1010], [600, 400]][i] ?? [500, 500];
      return <div key={i} style={{ position: "absolute", left: x, top: y, padding: "10px 20px", background: i === 2 ? C.lacre : C.papel, color: i === 2 ? C.osso : C.tinta, fontFamily: COURIER, fontWeight: 700, fontSize: 32, opacity: km, transform: `scale(${0.8 + 0.2 * km})` }}>{txt}</div>;
    })}
  </>;
};
// barra devido × recebido
export const Devido: React.FC<{ r: number }> = ({ r }) => {
  const { t, o } = useT();
  const a = lin(t, o(r), o(r) + 0.8, Easing.out(Easing.cubic)), b = lin(t, o(r) + 1.2, o(r) + 2.0, Easing.out(Easing.cubic));
  return <>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #1C1A16 0%, #0A0A0B 75%)" }} />
    <div style={{ position: "absolute", left: 170, bottom: 1920 - 1150, width: 300, height: 680 * a, background: C.osso }} />
    <div style={{ position: "absolute", left: 610, bottom: 1920 - 1150, width: 300, height: 80 * b, background: C.lacre }} />
    <div style={{ position: "absolute", left: 120, top: 1150 - 680 * a - 90, width: 400, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 64, color: C.osso, opacity: a }}>US$ 110 mi</div>
    <div style={{ position: "absolute", left: 560, top: 1150 - 80 * b - 90, width: 400, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 64, color: C.verm, opacity: b }}>?</div>
    <div style={{ position: "absolute", left: 120, top: 1170, width: 400, textAlign: "center", fontFamily: COURIER, fontWeight: 700, fontSize: 30, color: C.osso }}>A DEVOLVER</div>
    <div style={{ position: "absolute", left: 560, top: 1170, width: 400, textAlign: "center", fontFamily: COURIER, fontWeight: 700, fontSize: 30, color: C.osso }}>RECEBIDO</div>
  </>;
};
// página de roteiro com a palavra riscada
export const Roteiro: React.FC<{ r: number; risca: number }> = ({ r, risca }) => {
  const { t, o } = useT();
  const k = lin(t, o(risca), o(risca) + 0.4);
  const linhas = ["CENA 12 · INT. · NOITE", "", "Ninguém fala dos negócios", "da família. Nem da"];
  return <>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #24201C 0%, #0A0A0B 75%)" }} />
    <div style={{ position: "absolute", left: 120, right: 120, top: 380, height: 760, background: "#F3EFE3", boxShadow: "0 30px 80px rgba(0,0,0,0.85)", padding: "60px 70px", boxSizing: "border-box", transform: "rotate(1deg)", fontFamily: COURIER, fontSize: 40, color: "#1A1714", lineHeight: 1.6 }}>
      {linhas.map((l, i) => <div key={i} style={{ textAlign: "left", fontWeight: i === 0 ? 700 : 400 }}>{l}{i === 3 && <span style={{ position: "relative", fontWeight: 700 }}> MÁFIA.<span style={{ position: "absolute", left: 10, top: "52%", height: 9, width: `${k * 100}%`, background: C.lacre }} /></span>}</div>)}
    </div>
    <div style={{ position: "absolute", right: 34, top: 1262, fontFamily: SANS, fontWeight: 600, fontSize: 17, color: "rgba(236,231,220,0.55)" }}>página ilustrativa (não é o roteiro real)</div>
    {t > o(r) && null}
  </>;
};
export const _u = [ELITE];
