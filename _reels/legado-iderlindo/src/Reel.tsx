import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CENA, FIM_VOZ, FPS, GAPS, LEAD, SFX, T, TOTAL, VOZ_FIM_RAW, WORDS, o, q } from "./timeline";
import { CamisaProfessor, Pessoa } from "./pessoas";

// ── paleta masculina: azul-marinho, giz e dourado ────────────────────────
const C = { fundo: "#0B1522", fundo2: "#14243A", azul: "#1E3352", aco: "#6E8DB5", acoClaro: "#A9BFDB", creme: "#F2EADB", giz: "#ECE8DE",
  ouro: "#D9A84E", ouroClaro: "#F1CF86", quadro: "#1B2A28", moldura: "#5A4430" };
const SANS = "Inter", MAO = "Caveat", MONO = "JetBrains Mono", TIT = "Montserrat";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SP = { suave: { damping: 200 }, mola: { damping: 14, stiffness: 140 }, pop: { damping: 11, stiffness: 190 } };
const ease = Easing.bezier(0.65, 0, 0.35, 1);
const lin = (t: number, a: number, b: number, e: (n: number) => number = ease) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, t: f / fps }; };
const sp = (f: number, fps: number, at: number, cfg: { damping: number; stiffness?: number } = SP.suave) => spring({ frame: f - q(at), fps, config: cfg });
const piscaDe = (t: number, off = 0) => (((t + off) % 3.4) < 0.1 ? 0.12 : 1);
const PROF = { estilo: "homem" as const, pele: "#B57A55", peleSombra: "#97603F", cabelo: "#16110E", camisa: "#F2C230", camisaSombra: "#D8A818" };

const Cena: React.FC<{ de: number; ate: number; children: React.ReactNode }> = ({ de, ate, children }) => {
  const { t } = useT();
  if (t < de - 0.05 || t > ate + 0.5) return null;
  const en = de <= 0 ? 1 : lin(t, de, de + 0.55, Easing.out(Easing.cubic));
  const e = lin(t, ate, ate + 0.45, Easing.in(Easing.cubic));
  const kb = interpolate(t, [de, ate + 0.45], [0, 1], clamp);
  return <AbsoluteFill style={{ opacity: en * (1 - e), transform: `scale(${1.04 - 0.04 * en + 0.03 * e + 0.045 * kb})`, filter: e > 0.02 || en < 0.98 ? `blur(${(1 - en) * 6 + e * 6}px)` : undefined }}>{children}</AbsoluteFill>;
};
const Traco: React.FC<{ d: string; p: number; len?: number; w?: number; color?: string; dash?: string }> = ({ d, p, len = 800, w = 6, color = C.giz }) => (
  <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
);
const Giz: React.FC<{ at: number; dur?: number; size?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ at, dur = 0.7, size = 72, color = C.giz, style, children }) => {
  const { t } = useT();
  const p = lin(t, at, at + dur, Easing.out(Easing.quad));
  if (p <= 0) return null;
  return <div style={{ position: "absolute", fontFamily: MAO, fontWeight: 700, fontSize: size, lineHeight: 1, color, whiteSpace: "nowrap", textShadow: `0 0 18px ${color}33`, ...style }}>
    <div style={{ clipPath: `inset(-30% ${100 - p * 100}% -40% -5%)` }}>{children}</div></div>;
};

// ── fundo: poeira dourada flutuando ──────────────────────────────────────
const POEIRA = Array.from({ length: 34 }, (_, i) => ({ x: (i * 397) % 1080, y: (i * 811) % 1920, r: 1.5 + (i % 4), v: 6 + (i % 5) * 3 }));
const Fundo: React.FC = () => {
  const { t } = useT();
  return <AbsoluteFill style={{ background: `radial-gradient(ellipse 85% 60% at 50% 40%, ${C.fundo2} 0%, ${C.fundo} 72%)` }}>
    <div style={{ position: "absolute", left: -200, top: -300, width: 900, height: 2600, transform: `rotate(${-24 + Math.sin(t * 0.3) * 2}deg)`, transformOrigin: "50% 0",
      background: "linear-gradient(90deg, transparent, rgba(241,207,134,0.07) 35%, rgba(241,207,134,0.11) 50%, rgba(241,207,134,0.07) 65%, transparent)", filter: "blur(18px)" }} />
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      {POEIRA.map((p, i) => <circle key={i} cx={(p.x + Math.sin(t * 0.4 + i) * 20) % 1080} cy={((p.y - t * p.v) % 1920 + 1920) % 1920} r={p.r} fill={C.ouroClaro} opacity={0.12 + 0.12 * Math.sin(t + i)} />)}
    </svg>
  </AbsoluteFill>;
};

// ── cena 1–2: o quadro, as pessoas que passam e o que o tempo não apaga ──
const PALAVRAS_QUADRO = [
  { txt: "conteúdo", x: 170, y: 330, r: -4, at: () => T.pessoas },
  { txt: "matéria", x: 560, y: 300, r: 3, at: () => T.passam },
  { txt: "exercício", x: 240, y: 520, r: 2, at: () => T.ensinando },
  { txt: "prova", x: 640, y: 560, r: -3, at: () => T.conteudos },
];
const Andante: React.FC<{ x: number; y: number; s: number; cor: string; fase: number }> = ({ x, y, s, cor, fase }) => (
  <g transform={`translate(${x} ${y + Math.abs(Math.sin(fase)) * -8}) scale(${s})`}>
    <ellipse cx="0" cy="98" rx="60" ry="10" fill="#000" opacity="0.25" />
    <circle cx="0" cy="-150" r="34" fill={cor} /><circle cx="-10" cy="-160" r="12" fill="#fff" opacity="0.08" />
    <path d="M-44 -108 Q0 -126 44 -108 L52 0 L-52 0 Z" fill={cor} />
    <path d={`M-18 0 L${-18 + Math.sin(fase) * 22} 92 M18 0 L${18 - Math.sin(fase) * 22} 92`} stroke={cor} strokeWidth="26" strokeLinecap="round" />
  </g>
);
const CenaQuadro: React.FC = () => {
  const { f, fps, t } = useT();
  const borr = lin(t, T.tempo - 0.1, T.apagar + 0.45, Easing.inOut(Easing.sin));
  const borrX = 100 + borr * 900;
  const apag = sp(f, fps, T.outras - 0.1, SP.mola);
  const maca = lin(t, T.outras + 0.9, T.outras + 1.7);
  const brilho = lin(t, T.apagar + 0.4, T.apagar + 0.9);
  const relogio = sp(f, fps, T.tempo - 0.2, SP.pop);
  return (
    <Cena de={CENA.passam.de} ate={CENA.apagar.ate}>
      {/* quadro */}
      <div style={{ position: "absolute", left: 60, top: 190, width: 960, height: 700, borderRadius: 18, background: C.moldura, boxShadow: "0 40px 80px -30px rgba(0,0,0,0.8)" }}>
        <div style={{ position: "absolute", left: 30, right: 30, bottom: -26, height: 26, borderRadius: "0 0 10px 10px", background: "#4A3726" }}>
          <div style={{ position: "absolute", left: 120, top: 6, width: 70, height: 12, borderRadius: 6, background: C.giz }} />
          <div style={{ position: "absolute", left: 220, top: 7, width: 46, height: 11, borderRadius: 6, background: C.ouroClaro }} /></div>
        <div style={{ position: "absolute", inset: 22, borderRadius: 8, background: `radial-gradient(ellipse at 40% 30%, #233633, ${C.quadro})`, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: NOISE, backgroundSize: "300px", opacity: 0.16, mixBlendMode: "screen" }} />
          <div style={{ position: "absolute", left: 60, top: 400, width: 500, height: 120, borderRadius: 60, background: "rgba(236,232,222,0.05)", filter: "blur(20px)" }} />
          {PALAVRAS_QUADRO.map((w, i) => {
            const x0 = w.x - 60; const apagado = lin(borrX - 22, x0, x0 + 280, Easing.linear);
            return <div key={i} style={{ opacity: 1 - apagado * 0.95 }}><Giz at={w.at()} size={88} style={{ left: w.x - 82, top: w.y - 212, transform: `rotate(${w.r}deg)` }}>{w.txt}</Giz></div>;
          })}
          {/* maçã dourada: o que fica */}
          <svg width="300" height="300" viewBox="0 0 100 100" style={{ position: "absolute", left: 318, top: 170, filter: `drop-shadow(0 0 ${24 * brilho}px ${C.ouro})` }}>
            <Traco d="M50 30 C35 18 12 24 14 50 C16 76 36 92 50 84 C64 92 84 76 86 50 C88 24 65 18 50 30 Z" p={maca} len={260} w={4.2} color={C.ouroClaro} />
            <Traco d="M50 30 C50 22 52 14 58 8" p={lin(t, T.outras + 1.5, T.outras + 1.8)} len={30} w={4} color={C.ouroClaro} />
            <Traco d="M54 18 C62 10 74 12 78 16 C72 24 62 24 54 18 Z" p={lin(t, T.outras + 1.6, T.outras + 2.0)} len={60} w={3.6} color={C.ouroClaro} />
          </svg>
          {t > T.apagar + 0.4 && <div style={{ position: "absolute", left: 0, right: 0, bottom: 52, textAlign: "center", opacity: brilho }}>
            <span style={{ fontFamily: MAO, fontWeight: 700, fontSize: 68, color: C.ouroClaro }}>o que o tempo não apaga</span></div>}
          {/* apagador */}
          {t > T.outras - 0.2 && t < T.apagar + 0.9 && <div style={{ position: "absolute", left: borrX - 120, top: 230 + Math.sin(borr * 18) * 70, width: 220, height: 100, borderRadius: 14,
            background: "linear-gradient(#7A5A3C 0 40%, #3B3F44 40%)", boxShadow: "0 14px 24px rgba(0,0,0,0.5)", transform: `scale(${apag}) rotate(${-6 + Math.sin(borr * 20) * 6}deg)`,
            opacity: 1 - lin(t, T.apagar + 0.5, T.apagar + 0.9) }} />}
        </div>
      </div>
      {/* relógio do tempo */}
      {t > T.tempo - 0.25 && <svg width="170" height="170" viewBox="0 0 100 100" style={{ position: "absolute", left: 860, top: 120, transform: `scale(${relogio})` }}>
        <circle cx="50" cy="50" r="42" fill={C.azul} stroke={C.ouro} strokeWidth="5" />
        <line x1="50" y1="50" x2="50" y2="20" stroke={C.creme} strokeWidth="5" strokeLinecap="round" transform={`rotate(${(t - T.tempo) * 720} 50 50)`} />
        <line x1="50" y1="50" x2="68" y2="50" stroke={C.ouroClaro} strokeWidth="5" strokeLinecap="round" transform={`rotate(${(t - T.tempo) * 60} 50 50)`} />
      </svg>}
      {/* pessoas que passam */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => { const vel = 120 + (i % 3) * 40; const x = ((i * 260 + t * vel) % 1500) - 210; const y = 1260 + (i % 2) * 90;
          return <Andante key={i} x={x} y={y} s={0.9 + (i % 3) * 0.12} cor={i % 2 ? "#2B4366" : "#38557D"} fase={t * 7 + i} />; })}
      </svg>
    </Cena>
  );
};

// ── cena 3: nunca foi apenas ─────────────────────────────────────────────
const Item: React.FC<{ at: number; x: number; icone: React.ReactNode; rotulo: string }> = ({ at, x, icone, rotulo }) => {
  const { f, fps, t } = useT();
  const p = sp(f, fps, at - 0.1, SP.pop);
  const encolhe = lin(t, T.e - 0.7, T.e - 0.3);
  if (t < at - 0.15) return null;
  return <div style={{ position: "absolute", left: x - 150, top: 740, width: 300, textAlign: "center", transform: `scale(${p * (1 - 0.25 * encolhe)}) translateY(${encolhe * 60}px)`, opacity: 1 - 0.6 * encolhe }}>
    <div style={{ width: 230, height: 230, margin: "0 auto", borderRadius: 60, background: C.azul, border: `4px solid ${C.aco}`, display: "grid", placeItems: "center", boxShadow: "0 30px 60px -30px rgba(0,0,0,0.8)" }}>{icone}</div>
    <div style={{ fontFamily: MAO, fontWeight: 700, fontSize: 66, color: C.creme, marginTop: 18 }}>{rotulo}</div>
  </div>;
};
const CenaApenas: React.FC = () => {
  const { f, fps, t } = useT();
  const tit = sp(f, fps, T.porque, SP.mola), ap = sp(f, fps, T.apenas, SP.pop);
  const ico = (d: string) => <svg width="130" height="130" viewBox="0 0 24 24" fill="none" stroke={C.ouroClaro} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
  return (
    <Cena de={CENA.apenas.de} ate={CENA.apenas.ate}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", fontFamily: TIT, fontWeight: 900, letterSpacing: "-0.03em" }}>
        <div style={{ fontSize: 76, color: C.creme, opacity: Math.min(1, tit * 1.5), transform: `translateY(${(1 - tit) * 30}px)` }}>ENSINAR NUNCA FOI</div>
        <div style={{ fontSize: 150, color: C.ouro, lineHeight: 1.05, opacity: Math.min(1, ap * 1.5), transform: `scale(${0.7 + 0.3 * ap})` }}>APENAS…</div>
      </div>
      <Item at={T.palavras} x={210} rotulo="palavras" icone={ico("M4 5h16v11H9l-5 4z M8 9h8 M8 12h5")} />
      <Item at={T.teorias} x={540} rotulo="teorias" icone={ico("M3 5c3-1 6-1 9 1v14c-3-2-6-2-9-1z M21 5c-3-1-6-1-9 1v14c3-2 6-2 9-1z")} />
      <Item at={T.quadro} x={870} rotulo="o quadro" icone={ico("M3 4h18v12H3z M8 20l4-4 4 4 M7 9h6 M7 12h9")} />
    </Cena>
  );
};

// ── cena 4: despertar, abrir caminhos, plantar ───────────────────────────
const Passinho: React.FC<{ at: number; x: number; rotulo: string; children: React.ReactNode }> = ({ at, x, rotulo, children }) => {
  const { f, fps, t } = useT();
  const p = sp(f, fps, at - 0.1, SP.pop), on = lin(t, at, at + 0.4);
  return <div style={{ position: "absolute", left: x - 150, top: 190, width: 300, textAlign: "center", opacity: t < at - 0.1 ? 0.18 : 1, transform: `scale(${0.85 + 0.15 * p})` }}>
    <div style={{ width: 150, height: 150, margin: "0 auto", borderRadius: 75, background: on > 0.5 ? C.ouro : C.azul, display: "grid", placeItems: "center",
      boxShadow: on > 0.5 ? `0 0 ${50 * on}px ${C.ouro}88` : "none" }}>{children}</div>
    <div style={{ fontFamily: MAO, fontWeight: 700, fontSize: 50, color: on > 0.5 ? C.ouroClaro : C.acoClaro, marginTop: 10, lineHeight: 1 }}>{rotulo}</div>
  </div>;
};
const CentroSemente: React.FC = () => {
  const { f, fps, t } = useT();
  const lamp = sp(f, fps, T.despertar - 0.1, SP.pop) * (1 - lin(t, T.abrir - 0.2, T.abrir + 0.1));
  const acesa = lin(t, T.despertar + 0.2, T.despertar + 0.6);
  const porta = sp(f, fps, T.abrir - 0.1, SP.pop) * (1 - lin(t, T.plantar - 0.25, T.plantar + 0.05));
  const abre = lin(t, T.abrir + 0.1, T.abrir + 0.7);
  return <>
    {lamp > 0.01 && <svg width="420" height="520" viewBox="0 0 100 124" style={{ position: "absolute", left: 330, top: 640, transform: `scale(${lamp})`, overflow: "visible" }}>
      <circle cx="50" cy="44" r={60 * acesa} fill={C.ouro} opacity={0.25 * acesa} />
      <path d="M50 6 C28 6 14 22 14 42 C14 56 22 64 30 72 C34 76 36 82 36 88 H64 C64 82 66 76 70 72 C78 64 86 56 86 42 C86 22 72 6 50 6 Z" fill={acesa > 0.5 ? C.ouroClaro : C.azul} stroke={C.creme} strokeWidth="3" />
      <rect x="36" y="92" width="28" height="8" rx="3" fill={C.aco} /><rect x="38" y="102" width="24" height="8" rx="3" fill={C.aco} />
      {acesa > 0.5 && [0, 1, 2, 3, 4, 5, 6].map((k) => { const a2 = -Math.PI + (k / 6) * Math.PI; return <line key={k} x1={50 + Math.cos(a2) * 50} y1={44 + Math.sin(a2) * 50} x2={50 + Math.cos(a2) * 62} y2={44 + Math.sin(a2) * 62} stroke={C.ouroClaro} strokeWidth="4" strokeLinecap="round" />; })}
    </svg>}
    {porta > 0.01 && <svg width="420" height="620" viewBox="0 0 100 150" style={{ position: "absolute", left: 330, top: 600, transform: `scale(${porta})`, overflow: "visible" }}>
      <rect x="18" y="10" width="64" height="130" rx="3" fill={C.ouroClaro} style={{ filter: `drop-shadow(0 0 ${30 * abre}px ${C.ouro})` }} opacity={abre} />
      <g transform={`translate(18 10) scale(${1 - 0.8 * abre} 1)`}><rect width="64" height="130" rx="3" fill="#4A3828" /><circle cx="54" cy="70" r="3.5" fill={C.ouro} /></g>
      <rect x="14" y="6" width="72" height="136" rx="4" fill="none" stroke={C.moldura} strokeWidth="6" />
      <path d={`M18 140 L82 140 L${100 + 40 * abre} 150 L${0 - 40 * abre} 150 Z`} fill={C.ouroClaro} opacity={0.4 * abre} />
    </svg>}
  </>;
};
const LETRAS = "ABCDEFGHIJLMNOPRSTUV".split("");
const CenaSemente: React.FC = () => {
  const { t } = useT();
  const cai = lin(t, T.plantar, T.plantar + 0.5, Easing.in(Easing.quad));
  const tronco = lin(t, T.plantar + 0.6, T.crescendo + 0.8, Easing.out(Easing.cubic));
  const galhos = lin(t, T.crescendo - 0.2, T.crescendo + 1.2);
  const escurece = lin(t, T.aula, T.terminar + 0.4);
  const st = (d: string) => <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke={C.creme} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
  return (
    <Cena de={CENA.semente.de} ate={CENA.semente.ate}>
      <Passinho at={T.despertar} x={200} rotulo={"despertar\npensamentos".replace("\n", " ")}>{st("M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z")}</Passinho>
      <Passinho at={T.abrir} x={540} rotulo="abrir caminhos">{st("M4 21V5l7-2v18 M11 5h7v16 M4 21h16 M9 12h.01")}</Passinho>
      <Passinho at={T.plantar} x={880} rotulo="plantar conhecimento">{st("M12 21v-8 M12 13c0-4 3-6 7-6 0 4-3 6-7 6z M12 15c0-3-2-5-6-5 0 3 2 5 6 5z")}</Passinho>
      {/* lâmpada que acende e porta que se abre (antes da semente) */}
      <CentroSemente />
      {/* sala de aula escurecendo */}
      <AbsoluteFill style={{ background: "#05080E", opacity: 0.55 * escurece }} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs><radialGradient id="aura"><stop offset="0" stopColor={C.ouro} stopOpacity="0.45" /><stop offset="1" stopColor={C.ouro} stopOpacity="0" /></radialGradient></defs>
        <circle cx="540" cy="1050" r={380 * galhos + 40 * escurece} fill="url(#aura)" opacity={0.4 + 0.6 * escurece} />
        <path d="M120 1460 Q540 1420 960 1460" fill="none" stroke="#6B5236" strokeWidth="30" strokeLinecap="round" />
        {t > T.plantar - 0.05 && t < T.plantar + 0.7 && <circle cx="540" cy={700 + cai * 740} r="16" fill={C.ouroClaro} />}
        <Traco d="M540 1446 C536 1300 548 1180 540 1000 C534 900 540 840 540 780" p={tronco} len={700} w={30} color="#8A6A45" />
        {[["M540 1140 C480 1100 420 1060 380 980", 0], ["M540 1080 C610 1040 670 990 700 920", 0.15], ["M540 960 C470 920 430 860 420 800", 0.3], ["M540 900 C600 860 640 800 660 740", 0.45]].map(([d, off], i) =>
          <Traco key={i} d={d as string} p={lin(galhos, off as number, (off as number) + 0.5)} len={260} w={16} color="#8A6A45" />)}
        {LETRAS.map((l, i) => { const a = (i / LETRAS.length) * Math.PI * 2; const rr = 120 + (i % 3) * 70; const x = 540 + Math.cos(a) * rr * 1.25, y = 860 + Math.sin(a) * rr * 0.75;
          const p = lin(galhos, 0.3 + (i % 7) * 0.08, 0.6 + (i % 7) * 0.08); if (p <= 0) return null;
          return <text key={i} x={x} y={y + Math.sin(t * 2 + i) * 6} textAnchor="middle" fontFamily={TIT} fontWeight={900} fontSize={54 * p} fill={i % 3 ? C.ouroClaro : C.creme}
            opacity={p} style={{ filter: `drop-shadow(0 0 ${8 + 10 * escurece}px ${C.ouro})` }}>{l}</text>; })}
      </svg>
      <Giz at={T.terminar} size={70} color={C.ouroClaro} style={{ left: 0, right: 0, top: 1520, textAlign: "center" }}>e continua crescendo…</Giz>
    </Cena>
  );
};

// ── cena 5: a jornada ────────────────────────────────────────────────────
const ESTRADA = "M540 1560 C220 1460 260 1240 540 1160 C820 1080 860 880 560 800 C300 730 320 560 540 470";
const CenaJornada: React.FC = () => {
  const { f, fps, t } = useT();
  const tit = sp(f, fps, T.jornada - 0.2, SP.mola);
  const rua = lin(t, T.na, T.jornada + 1.2);
  const estrela = sp(f, fps, T.descoberta - 0.05, SP.pop);
  const olho = sp(f, fps, T.perspectiva - 0.1, SP.pop);
  return (
    <Cena de={CENA.jornada.de} ate={CENA.jornada.ate}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontFamily: TIT, fontWeight: 900, letterSpacing: "-0.03em", opacity: Math.min(1, tit * 1.5),
        transform: `translateY(${(1 - tit) * 30}px)` }}>
        <div style={{ fontSize: 52, color: C.acoClaro }}>A JORNADA DE UM</div>
        <div style={{ fontSize: 110, color: C.creme, lineHeight: 1 }}>EDUCADOR</div>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <Traco d={ESTRADA} p={rua} len={2300} w={110} color={C.azul} />
        <path d={ESTRADA} fill="none" stroke={C.ouro} strokeWidth="6" strokeDasharray="26 30" opacity={rua > 0.98 ? 0.7 : 0} />
        {/* descoberta */}
        <g transform={`translate(330 1290) scale(${estrela}) rotate(${t * 40})`} opacity={Math.min(1, estrela * 2)}>
          <path d="M0 -70 L18 -18 L70 0 L18 18 L0 70 L-18 18 L-70 0 L-18 -18 Z" fill={C.ouroClaro} style={{ filter: `drop-shadow(0 0 20px ${C.ouro})` }} /></g>
        {/* perspectiva: olho que gira */}
        <g transform={`translate(760 960) scale(${olho})`} opacity={Math.min(1, olho * 2)}>
          <g transform={`scale(${Math.cos((t - T.perspectiva) * 3) * 0.3 + 0.7} 1)`}>
            <path d="M-90 0 Q0 -70 90 0 Q0 70 -90 0 Z" fill={C.creme} /><circle r="34" fill={C.azul} /><circle r="16" fill={C.fundo} /><circle cx="-10" cy="-10" r="7" fill="#fff" /></g></g>
        {/* alunos levando letras */}
        {[0, 1, 2].map((i) => { const a = T.aluno + i * 0.35; const p = lin(t, a, a + 2.6, Easing.inOut(Easing.sin)); if (t < a) return null;
          const x = 400 + i * 140 - p * (120 - i * 90), y = 640 - p * 260;
          return <g key={i} transform={`translate(${x} ${y}) scale(${0.55 - p * 0.15})`} opacity={1 - lin(p, 0.8, 1)}>
            <Andante x={0} y={0} s={1} cor={["#4E6E9E", "#5A7DAE", "#3F5F8C"][i]} fase={t * 7 + i} />
            <text x="60" y="-120" fontFamily={TIT} fontWeight={900} fontSize="90" fill={C.ouroClaro} style={{ filter: `drop-shadow(0 0 12px ${C.ouro})` }}>{["A", "B", "C"][i]}</text></g>; })}
      </svg>
      <Giz at={T.descoberta - 0.05} size={60} color={C.ouroClaro} style={{ left: 120, top: 1380 }}>uma descoberta</Giz>
      <Giz at={T.perspectiva} size={60} color={C.creme} style={{ left: 600, top: 1060 }}>uma nova perspectiva</Giz>
      <Giz at={T.levar} size={60} color={C.ouroClaro} style={{ left: 600, top: 560 }}>um pouco de você</Giz>
    </Cena>
  );
};

// ── cena 6: o professor ──────────────────────────────────────────────────
const CenaMestre: React.FC = () => {
  const { f, fps, t } = useT();
  const ent = sp(f, fps, CENA.mestre.de + 0.1, SP.mola);
  const nome = sp(f, fps, T.iderlindo - 0.05, SP.mola), sob = sp(f, fps, T.iderlindo + 0.45, SP.mola);
  const prof = sp(f, fps, T.professor, SP.suave);
  const ergue = lin(t, T.palavras2 - 0.5, T.palavras2);
  const voo = lin(t, T.palavras2, T.transformacao + 1.8, Easing.linear);
  return (
    <Cena de={CENA.mestre.de} ate={CENA.mestre.ate}>
      <div style={{ position: "absolute", left: 70, right: 70, top: 170 }}>
        <div style={{ fontFamily: TIT, fontWeight: 900, fontSize: 132, color: C.creme, letterSpacing: "-0.045em", lineHeight: 0.95, opacity: Math.min(1, nome * 1.6), transform: `translateY(${(1 - nome) * 40}px)` }}>Iderlindo</div>
        <div style={{ fontFamily: TIT, fontWeight: 900, fontSize: 132, color: C.ouro, letterSpacing: "-0.045em", lineHeight: 0.95, opacity: Math.min(1, sob * 1.6), transform: `translateY(${(1 - sob) * 40}px)` }}>Lopes</div>
        <div style={{ height: 6, width: 420 * prof, background: C.ouro, borderRadius: 3, margin: "22px 0 18px" }} />
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 38, color: C.acoClaro, letterSpacing: "0.12em", opacity: prof }}>PROFESSOR DE LETRAS</div>
        <div style={{ position: "relative", height: 90, marginTop: 10 }}><Giz at={T.acima} size={76} color={C.ouroClaro} style={{ left: 0, top: 0 }}>acima de tudo, um transformador</Giz></div>
      </div>
      {/* letras que viram pássaros */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {Array.from({ length: 12 }, (_, i) => { const a = T.palavras2 + i * 0.12; const p = lin(t, a, a + 2.4, Easing.out(Easing.quad)); if (t < a) return null;
          const vira = lin(t, T.transformacao + i * 0.06, T.transformacao + 0.5 + i * 0.06);
          const x = 780 + (i % 4 - 1.5) * 40 + p * ((i % 5) - 2) * 120, y = 1000 - p * (520 + (i % 3) * 120);
          return <g key={i} transform={`translate(${x} ${y})`} opacity={1 - lin(p, 0.85, 1)}>
            <text textAnchor="middle" fontFamily={MAO} fontWeight={700} fontSize="70" fill={C.ouroClaro} opacity={1 - vira}>{"palavras"[i % 8]}</text>
            <path d={`M-30 0 Q-14 ${-18 * Math.sin(t * 14 + i)} 0 4 Q14 ${-18 * Math.sin(t * 14 + i)} 30 0`} fill="none" stroke={C.creme} strokeWidth="6" strokeLinecap="round" opacity={vira} />
          </g>; })}
      </svg>
      <div style={{ position: "absolute", left: 165, top: 900, transform: `translateY(${(1 - ent) * 500}px) scale(1.25)`, transformOrigin: "50% 0" }}>
        <Pessoa {...PROF} humor={0.65} pisca={piscaDe(t)} olhar={ergue > 0.5 ? [8, -12] : [0, 0]} inclina={1.5 * Math.sin(t * 1.4)}
          bracoD={{ ombro: 20 + 130 * ergue, cotovelo: 30 - 40 * ergue }} bracoE={{ ombro: 12, cotovelo: 10 }} detalhe={<CamisaProfessor />} />
      </div>
    </Cena>
  );
};

// ── cena 7: permanece ────────────────────────────────────────────────────
const CenaPermanece: React.FC = () => {
  const { f, fps, t } = useT();
  const porta = lin(t, T.porque2, T.verdadeiro + 0.6);
  return (
    <Cena de={CENA.permanece.de} ate={CENA.permanece.ate}>
      <Giz at={T.sala - 0.3} size={80} color={C.creme} style={{ left: 0, right: 0, top: 200, textAlign: "center" }}>não termina na sala de aula</Giz>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <defs><linearGradient id="luz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.ouroClaro} stopOpacity="0.9" /><stop offset="1" stopColor={C.ouro} stopOpacity="0.05" /></linearGradient></defs>
        <rect x="380" y="400" width="320" height="560" rx="10" fill={C.ouroClaro} opacity={0.9 * porta} style={{ filter: `drop-shadow(0 0 60px ${C.ouro})` }} />
        <path d={`M380 960 L700 960 L${980} 1700 L${100} 1700 Z`} fill="url(#luz)" opacity={0.5 * porta} />
        <g transform={`translate(380 400) scale(${1 - 0.85 * porta} 1)`}><rect width="320" height="560" rx="10" fill="#4A3828" stroke={C.moldura} strokeWidth="10" /><circle cx="270" cy="300" r="14" fill={C.ouro} /></g>
        <rect x="364" y="384" width="352" height="590" rx="14" fill="none" stroke={C.moldura} strokeWidth="18" />
        {Array.from({ length: 10 }, (_, i) => { const a = T.verdadeiro + i * 0.18; const p = lin(t, a, a + 2.2, Easing.out(Easing.quad)); if (t < a) return null;
          const x = 540 + ((i % 5) - 2) * 40 + p * ((i % 7) - 3) * 120, y = 680 + p * (520 + (i % 3) * 140);
          return <path key={i} transform={`translate(${x} ${y})`} d={`M-26 0 Q-12 ${-16 * Math.sin(t * 14 + i)} 0 4 Q12 ${-16 * Math.sin(t * 14 + i)} 26 0`} fill="none" stroke={C.ouroClaro} strokeWidth="6" strokeLinecap="round" opacity={1 - lin(p, 0.8, 1)} />; })}
        {Array.from({ length: 8 }, (_, i) => { const x = 120 + i * 120, y = 1500 + (i % 2) * 40; const acesa = lin(t, T.permanece + i * 0.22, T.permanece + 0.4 + i * 0.22);
          return <g key={i}>
            <circle cx={x} cy={y - 110} r={70 * acesa} fill={C.ouro} opacity={0.25 * acesa} />
            <Andante x={x} y={y} s={0.55} cor={acesa > 0.5 ? "#C9A35C" : "#2B4366"} fase={0} />
            {acesa > 0.3 && <path transform={`translate(${x} ${y - 180}) scale(${acesa})`} d="M0 12 C-14 0 -22 -8 -14 -16 C-8 -22 0 -16 0 -10 C0 -16 8 -22 14 -16 C22 -8 14 0 0 12 Z" fill={C.ouroClaro} />}
          </g>; })}
      </svg>
      <Giz at={T.tocados - 0.2} size={74} color={C.ouroClaro} style={{ left: 0, right: 0, top: 1220, textAlign: "center" }}>permanece em quem foi tocado</Giz>
    </Cena>
  );
};

// ── tela final ───────────────────────────────────────────────────────────
const CenaFim: React.FC = () => {
  const { f, fps, t } = useT();
  const a = CENA.fim.de;
  const ret = sp(f, fps, a + 0.1, SP.mola), tit = sp(f, fps, a + 0.5, SP.mola), lin2 = lin(t, a + 1.1, a + 1.8);
  return (
    <Cena de={a} ate={TOTAL / FPS + 1}>
      <div style={{ position: "absolute", left: 540 - 250, top: 260, width: 500, height: 500, borderRadius: 250, overflow: "hidden", background: `radial-gradient(circle at 50% 40%, ${C.azul}, ${C.fundo})`,
        border: `8px solid ${C.ouro}`, boxShadow: `0 0 80px -10px ${C.ouro}88`, transform: `scale(${ret})` }}>
        <div style={{ position: "absolute", left: -50, top: 40, transform: "scale(1.0)", transformOrigin: "0 0" }}>
          <Pessoa {...PROF} humor={0.7} pisca={piscaDe(t, 1)} bracoD={{ ombro: 12, cotovelo: 10 }} bracoE={{ ombro: 12, cotovelo: 10 }} detalhe={<CamisaProfessor />} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 830, textAlign: "center", opacity: Math.min(1, tit * 1.5), transform: `translateY(${(1 - tit) * 40}px)` }}>
        <div style={{ fontFamily: TIT, fontWeight: 900, fontSize: 104, color: C.creme, letterSpacing: "-0.045em", lineHeight: 1 }}>Iderlindo Lopes</div>
        <div style={{ width: 520 * lin2, height: 5, borderRadius: 3, background: C.ouro, margin: "26px auto" }} />
        <div style={{ fontFamily: MAO, fontWeight: 700, fontSize: 96, color: C.ouroClaro, lineHeight: 1, clipPath: `inset(-20% ${100 - lin2 * 100}% -30% 0)` }}>O legado de quem ensina</div>
      </div>
    </Cena>
  );
};

// ── legenda karaokê (giz + marca dourada) ────────────────────────────────
const PAGES = (() => {
  const out: { de: number; ate: number; w: typeof WORDS }[] = []; let cur: typeof WORDS = [];
  WORDS.forEach((w, i) => {
    cur.push(w); const nx = WORDS[i + 1];
    const len = cur.map((x) => x.text).join(" ").length;
    if (!nx || /[.,?!]$/.test(w.text) || len >= 18 || cur.length >= 4 || nx.start - w.end > 0.4) { out.push({ de: cur[0].start, ate: w.end, w: cur }); cur = []; }
  });
  return out.map((p, i) => ({ ...p, ate: out[i + 1] && out[i + 1].de - p.ate < 0.6 ? out[i + 1].de : p.ate + 0.3 }));
})();
const Legenda: React.FC = () => {
  const { f, fps, t } = useT();
  const pg = PAGES.find((p) => t >= p.de - 0.06 && t < p.ate - 0.06);
  if (!pg || t > FIM_VOZ + 0.3) return null;
  const pin = spring({ frame: f - q(pg.de - 0.06), fps, config: { damping: 18, stiffness: 220 } });
  return (
    <div style={{ position: "absolute", left: 60, right: 130, top: 1610, display: "flex", justifyContent: "center", opacity: Math.min(1, pin * 1.8), transform: `translateY(${(1 - pin) * 14}px)` }}>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: 10, rowGap: 2, padding: "12px 18px", borderRadius: 26, background: "rgba(8,15,25,0.86)", border: `2px solid ${C.azul}` }}>
        {pg.w.map((w, i) => {
          const on = t >= w.start - 0.06, ativo = on && t < w.end + 0.05;
          const hp = lin(t, w.start - 0.06, w.start + 0.1, Easing.out(Easing.quad));
          return <span key={i} style={{ fontFamily: SANS, fontWeight: 800, fontSize: 50, letterSpacing: "-0.02em", lineHeight: 1.15, padding: "0 7px", borderRadius: 9,
            color: ativo ? C.fundo : on ? C.creme : "rgba(242,234,219,0.35)", backgroundImage: `linear-gradient(${C.ouro}, ${C.ouro})`, backgroundRepeat: "no-repeat",
            backgroundPosition: "0 60%", backgroundSize: `${(ativo ? hp : 0) * 100}% 86%` }}>{w.text.replace(/[,;:]$/, "")}</span>;
        })}
      </div>
    </div>
  );
};

// ── som ──────────────────────────────────────────────────────────────────
const VOZ_SEGS = (() => { const pts = [0, ...GAPS.map(([at]) => at), VOZ_FIM_RAW + 0.3]; return pts.slice(0, -1).map((s, i) => ({ s, e: pts[i + 1] })); })();
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
const Sons: React.FC = () => (
  <>
    {VOZ_SEGS.map((g, i) => <Sequence key={i} from={q(o(g.s))} durationInFrames={q(g.e - g.s) + 2}>
      <Audio src={staticFile("audio/voz.mp3")} startFrom={q(g.s)} endAt={q(g.e)} volume={1} /></Sequence>)}
    <Audio src={staticFile("audio/trilha-el.mp3")} volume={(fr) => interpolate(fr, [q(FIM_VOZ - 0.2), q(FIM_VOZ + 0.8)], [0.62, 1], clamp) * interpolate(fr, [0, 20], [0, 1], clamp) * interpolate(fr, [TOTAL - q(2.5), TOTAL - 2], [1, 0], clamp)} />
    {SFX.map((s, i) => <Sequence key={i} from={Math.max(0, q(s.at))} durationInFrames={q(2.2)}><Audio src={staticFile(`audio/${s.src}.mp3`)} volume={s.vol ?? 0.3} /></Sequence>)}
  </>
);

export const Reel: React.FC = () => {
  const { f } = useT();
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.fundo }}>
      <Fundo />
      <CenaQuadro /><CenaApenas /><CenaSemente /><CenaJornada /><CenaMestre /><CenaPermanece /><CenaFim />
      <Legenda />
      <AbsoluteFill style={{ backgroundImage: NOISE, backgroundSize: "220px", backgroundPosition: `${(f * 7) % 220}px ${(f * 13) % 220}px`, opacity: 0.05, mixBlendMode: "overlay" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)" }} />
      <Sons />
    </AbsoluteFill>
  );
};
export { FPS, LEAD };
