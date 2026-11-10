import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CAM, FPS, SFX, T, TOTAL, q } from "./timeline";

// ── tema (mesmo universo dos vídeos da Explica Farmácia) ──────────────────
const C = { papel: "#F3F1EC", ponto: "#D3CEC4", tinta: "#1F1B17", cinza: "#77716A", rosa: "#E7B7C2", rosaForte: "#D9677F", branco: "#FFFFFF",
  pele: "#F3C9AA", peleSombra: "#E2AC88", cabelo: "#3F2B22", sebo: "#F3C54F", seboClaro: "#F9E08F", bact: "#8A63C7", bactEsc: "#5B3E96" };
const SANS = "Inter", MONO = "JetBrains Mono", MAO = "Caveat";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SP = { suave: { damping: 200 }, mola: { damping: 13, stiffness: 160 }, pop: { damping: 9, stiffness: 200 } };
const ease = Easing.bezier(0.65, 0, 0.35, 1);
const lin = (t: number, a: number, b: number, e: (n: number) => number = ease) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, t: f / fps }; };
const sp = (f: number, fps: number, at: number, cfg: { damping: number; stiffness?: number } = SP.suave) => spring({ frame: f - q(at), fps, config: cfg });

const Traco: React.FC<{ d: string; p: number; len?: number; w?: number; color?: string }> = ({ d, p, len = 600, w = 6, color = C.tinta }) => (
  <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
);
const Marca: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <span style={{ backgroundImage: `linear-gradient(${C.rosa}, ${C.rosa})`, backgroundRepeat: "no-repeat", backgroundSize: `${p * 100}% 78%`, backgroundPosition: "0 60%",
    padding: "0 6px", margin: "0 -6px" }}>{children}</span>
);
const Escrita: React.FC<{ at: number; dur?: number; size?: number; color?: string; style?: React.CSSProperties; sub?: boolean; children: React.ReactNode }> =
  ({ at, dur = 0.7, size = 62, color = C.tinta, style, sub = false, children }) => {
    const { t } = useT();
    const p = lin(t, at, at + dur, Easing.out(Easing.quad));
    if (p <= 0) return null;
    return (
      <div style={{ position: "absolute", fontFamily: MAO, fontWeight: 700, fontSize: size, lineHeight: 1.0, color, textAlign: "center", ...style }}>
        <div style={{ clipPath: `inset(-20% ${100 - p * 100}% -40% -5%)` }}>{children}</div>
        {sub && <svg width="100%" height="24" viewBox="0 0 400 24" preserveAspectRatio="none" style={{ display: "block", marginTop: 4 }}>
          <Traco d="M8 14 C80 4 150 22 220 10 C280 2 340 18 392 8" p={lin(t, at + dur * 0.7, at + dur * 0.7 + 0.4)} len={420} w={7} color={C.rosaForte} /></svg>}
      </div>
    );
  };

// ── CENA A: o rosto ───────────────────────────────────────────────────────
const P = { x: 668, y: 1140 }; // ponto da bochecha onde a câmera entra
const Rosto: React.FC<{ t: number }> = ({ t }) => {
  const { f, fps } = useT();
  const depois = t >= T.volta[0];
  const pisca = !depois && Math.abs(t - 0.32) < 0.05 ? 0.15 : 1;
  const mira = sp(f, fps, T.mira, SP.pop) * (1 - lin(t, T.mergulho[0] + 0.25, T.mergulho[0] + 0.45));
  const esp = sp(f, fps, T.espinha, SP.pop);
  const olho = depois ? 7 : 0;
  const balanco = Math.sin(t * 1.8) * 4;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <g transform={`translate(0 ${balanco})`}>
        <path d="M250 1010 C230 700 380 600 540 600 C700 600 850 700 830 1010 L852 1430 C760 1480 320 1480 228 1430 Z" fill={C.cabelo} />
        <path d="M150 1960 C150 1580 320 1450 470 1415 L610 1415 C760 1450 930 1580 930 1960 Z" fill="#E0929B" />
        <rect x="468" y="1220" width="144" height="210" rx="40" fill={C.peleSombra} />
        <ellipse cx="540" cy="1420" rx="100" ry="34" fill={C.peleSombra} />
        <ellipse cx="300" cy="1035" rx="34" ry="54" fill={C.pele} stroke={C.peleSombra} strokeWidth="5" />
        <ellipse cx="780" cy="1035" rx="34" ry="54" fill={C.pele} stroke={C.peleSombra} strokeWidth="5" />
        <path d="M300 980 C300 760 420 720 540 720 C660 720 780 760 780 980 C780 1180 660 1300 540 1300 C420 1300 300 1180 300 980 Z" fill={C.pele} />
        <path d="M292 1000 C276 760 420 688 560 698 C704 700 804 790 788 1000 C764 884 700 824 604 802 C522 864 400 884 332 872 C306 904 296 956 292 1000 Z" fill={C.cabelo} />
        <ellipse cx="392" cy="1100" rx="48" ry="28" fill="#F0A1A1" opacity="0.42" />
        <ellipse cx="690" cy="1100" rx="48" ry="28" fill="#F0A1A1" opacity="0.42" />
        {/* sobrancelhas */}
        {depois ? <>
          <path d="M392 934 Q440 902 492 906" fill="none" stroke={C.cabelo} strokeWidth="12" strokeLinecap="round" />
          <path d="M588 906 Q640 902 688 934" fill="none" stroke={C.cabelo} strokeWidth="12" strokeLinecap="round" />
        </> : <>
          <path d="M394 926 Q440 900 490 918" fill="none" stroke={C.cabelo} strokeWidth="12" strokeLinecap="round" />
          <path d="M590 918 Q640 900 686 926" fill="none" stroke={C.cabelo} strokeWidth="12" strokeLinecap="round" />
        </>}
        {/* olhos */}
        {[445, 635].map((x) => <g key={x} transform={`translate(${x + olho} ${990 + olho}) scale(1 ${pisca})`}>
          <ellipse rx="21" ry="27" fill="#2A1E18" /><circle cx="-6" cy="-9" r="7" fill="#fff" /></g>)}
        <path d="M540 1035 Q524 1090 548 1096" fill="none" stroke="#D9A27E" strokeWidth="8" strokeLinecap="round" />
        {depois
          ? <path d="M494 1186 Q518 1164 540 1182 Q562 1200 588 1178" fill="none" stroke="#B5524F" strokeWidth="12" strokeLinecap="round" />
          : <path d="M480 1166 Q540 1222 600 1166" fill="none" stroke="#B5524F" strokeWidth="12" strokeLinecap="round" />}
        {/* mira no poro */}
        {mira > 0.01 && <g transform={`translate(${P.x} ${P.y}) scale(${mira}) rotate(${t * 90})`}>
          <circle r="46" fill="none" stroke={C.rosaForte} strokeWidth="6" strokeDasharray="20 12" strokeLinecap="round" />
          <circle r="4" fill={C.rosaForte} /></g>}
        {/* a espinha */}
        {depois && <g transform={`translate(${P.x} ${P.y}) scale(${esp})`}>
          <circle r="38" fill="#F08080" opacity="0.4" />
          <circle r="18" fill="#DE5A57" /><circle cx="-5" cy="-6" r="5.5" fill="#fff" opacity="0.85" />
          {[-50, -5, 40].map((a) => <line key={a} x1="50" y1="0" x2="72" y2="0" stroke={C.rosaForte} strokeWidth="6" strokeLinecap="round" transform={`rotate(${a - 20})`}
            opacity={lin(t, T.espinha + 0.1, T.espinha + 0.3)} />)}
        </g>}
      </g>
    </svg>
  );
};

// ── CENA B: por dentro da pele (corte) ───────────────────────────────────
const CANAL = "M478 560 C486 620 494 660 494 700 L490 1170 C450 1200 452 1300 540 1318 C628 1300 630 1200 590 1170 L586 700 C586 660 594 620 602 560 Z";
const FLOCO = "-24,0 -12,-11 12,-11 24,0 12,11 -12,11";
const FLOCOS = [
  { x0: 330, x1: 512, y1: 590, r: 20 }, { x0: 760, x1: 568, y1: 588, r: -25 }, { x0: 250, x1: 540, y1: 574, r: 8 },
  { x0: 840, x1: 524, y1: 620, r: -12 }, { x0: 390, x1: 558, y1: 626, r: 30 }, { x0: 700, x1: 541, y1: 654, r: -6 }, { x0: 180, x1: 500, y1: 566, r: 14 },
];
const BACT = Array.from({ length: 15 }, (_, i) => {
  const ger = Math.floor(Math.log2(i + 1));
  return { x: 540 + (((i * 37) % 7) - 3) * 11, y: 730 + ((i * 5) % 15) * 28, rot: (i * 53) % 180, pai: i === 0 ? 0 : Math.floor((i - 1) / 2),
    at: T.p2 + 0.15 + ger * 0.3 + (i % 3) * 0.04 };
});
const DEFESA = [
  { x0: 120, y0: 1380, x1: 440, y1: 830 }, { x0: 960, y0: 1380, x1: 640, y1: 830 }, { x0: 60, y0: 1050, x1: 428, y1: 980 }, { x0: 1020, y0: 1050, x1: 652, y1: 700 },
  { x0: 240, y0: 1500, x1: 446, y1: 1100 }, { x0: 840, y0: 1500, x1: 648, y1: 960 }, { x0: 40, y0: 800, x1: 420, y1: 720 }, { x0: 1040, y0: 820, x1: 656, y1: 1100 },
];
const Rotulo: React.FC<{ x: number; y: number; de: number; ate: number; seta: string; size?: number; children: string }> = ({ x, y, de, ate, seta, size = 56, children }) => {
  const { f, fps, t } = useT();
  if (t < de || t > ate + 0.2) return null;
  const p = sp(f, fps, de), e = lin(t, ate, ate + 0.2);
  return <g opacity={Math.min(1, p * 1.5) * (1 - e)}>
    <text x={x} y={y + (1 - p) * 14} fontFamily={MAO} fontWeight={700} fontSize={size} fill={C.tinta} stroke={C.papel} strokeWidth="10" paintOrder="stroke" strokeLinejoin="round">{children}</text>
    <Traco d={seta} p={lin(t, de + 0.15, de + 0.5)} len={260} w={5} />
  </g>;
};

const Pele: React.FC<{ t: number }> = ({ t }) => {
  const { f, fps } = useT();
  const sebo = lin(t, T.p1 + 0.2, T.p1 + 1.6);
  const infl = lin(t, T.p3 + 0.1, T.p3 + 1.5);
  const b = lin(t, T.p3 + 0.35, T.p3 + 1.6, Easing.out(Easing.cubic));
  const pulso = t > T.p1 && t < T.p2 ? 1 + 0.045 * Math.sin((t - T.p1) * 11) : 1;
  const bate = 1 + 0.03 * infl * Math.sin(t * 16);
  const ySebo = 960 - 365 * sebo + Math.sin(t * 5) * 4;
  const w = 150 + 120 * b, h = 118 * b;
  const superficie = Array.from({ length: 60 }, (_, i) => -1560 + i * 70).filter((x) => x < 400 || x > 610);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id="derme" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F6C3B6" /><stop offset="0.55" stopColor="#EDA8A2" /><stop offset="1" stopColor="#E3938F" /></linearGradient>
        <linearGradient id="epi" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F9DFCB" /><stop offset="1" stopColor="#F5CDB8" /></linearGradient>
        <linearGradient id="seboG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.seboClaro} /><stop offset="1" stopColor={C.sebo} /></linearGradient>
        <radialGradient id="fogo"><stop offset="0" stopColor="#E8413C" stopOpacity="0.75" /><stop offset="0.55" stopColor="#E8413C" stopOpacity="0.3" /><stop offset="1" stopColor="#E8413C" stopOpacity="0" /></radialGradient>
        <radialGradient id="caroco" cx="0.5" cy="0.25" r="0.9"><stop offset="0" stopColor="#F07F78" /><stop offset="1" stopColor="#F3B5A4" /></radialGradient>
        <clipPath id="canalClip"><path d={CANAL} /></clipPath>
      </defs>
      {/* camadas */}
      <rect x="-1600" y="690" width="4300" height="3400" fill="url(#derme)" />
      {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${-400 + i * 130} ${1000 + (i % 4) * 150} q 90 -40 180 0 t 180 0`} fill="none" stroke="#fff" strokeOpacity="0.16" strokeWidth="10" strokeLinecap="round" />)}
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={-380 + i * 150} cy={1640 + (i % 3) * 46} r={74} fill="#F9E6BC" stroke="#EDCB8E" strokeWidth="5" opacity="0.92" />)}
      {/* vasos */}
      <g transform={`translate(540 1420) scale(1 ${bate}) translate(-540 -1420)`}>
        <path d="M-1600 1440 C-200 1380 200 1470 540 1420 C900 1370 1500 1460 2700 1410" fill="none" stroke="#D9544D" strokeWidth={22 + 10 * infl} strokeLinecap="round" />
        <path d="M-1600 1492 C-200 1440 220 1520 540 1474 C900 1424 1500 1510 2700 1466" fill="none" stroke="#7F93CE" strokeWidth="18" strokeLinecap="round" />
        <path d="M330 1436 C340 1300 390 1220 430 1150 M760 1404 C750 1290 700 1210 660 1150" fill="none" stroke="#D9544D" strokeWidth={9 + 6 * infl} strokeLinecap="round" />
      </g>
      {/* epiderme com ondinhas */}
      <path d={`M-1600 560 H2700 V700 ${Array.from({ length: 36 }, (_, i) => `q -30 ${i % 2 ? -26 : 26} -60 0 t -60 0`).join(" ")} Z`} fill="url(#epi)" />
      {/* inflamação */}
      {infl > 0 && <circle cx="540" cy="800" r={200 + 380 * infl} fill="url(#fogo)" opacity={infl * (0.85 + 0.15 * Math.sin(t * 16))} />}
      {/* glândulas sebáceas */}
      <g transform={`translate(700 990) scale(${pulso}) translate(-700 -990)`}>
        <path d="M660 960 L590 905" stroke="#D9A93F" strokeWidth="46" strokeLinecap="round" /><path d="M660 960 L590 905" stroke="#F7DD9A" strokeWidth="34" strokeLinecap="round" />
        {[[705, 965, 60], [770, 1015, 52], [698, 1048, 54], [778, 935, 42], [748, 1084, 40]].map(([x, y, r], i) => <g key={i}>
          <circle cx={x} cy={y} r={r} fill="#F7DD9A" stroke="#D9A93F" strokeWidth="6" /><circle cx={x - r * 0.25} cy={y - r * 0.25} r={r * 0.3} fill="#FBEBBE" /></g>)}
      </g>
      <g transform={`translate(385 1010) scale(${pulso}) translate(-385 -1010)`}>
        <path d="M420 985 L490 935" stroke="#D9A93F" strokeWidth="40" strokeLinecap="round" /><path d="M420 985 L490 935" stroke="#F7DD9A" strokeWidth="28" strokeLinecap="round" />
        {[[385, 990, 50], [338, 1034, 42], [396, 1056, 42]].map(([x, y, r], i) => <g key={i}>
          <circle cx={x} cy={y} r={r} fill="#F7DD9A" stroke="#D9A93F" strokeWidth="6" /><circle cx={x - r * 0.25} cy={y - r * 0.25} r={r * 0.3} fill="#FBEBBE" /></g>)}
      </g>
      {/* folículo */}
      <g transform={`translate(540 0) scale(${1 + 0.2 * b} 1) translate(-540 0)`}>
        <path d={CANAL} fill="none" stroke="#EDAAA4" strokeWidth="34" strokeLinejoin="round" />
        <path d={CANAL} fill="#FCEFE8" stroke="#C9797B" strokeWidth="9" strokeLinejoin="round" />
        <g clipPath="url(#canalClip)">
          <rect x="430" y={ySebo} width="220" height="800" fill="url(#seboG)" />
          <ellipse cx="540" cy={ySebo} rx="70" ry="13" fill={C.seboClaro} />
          {[0, 1, 2, 3, 4].map((i) => { const pp = ((t * 0.55 + i * 0.2) % 1); const yy = 1290 - pp * (1290 - ySebo);
            return <circle key={i} cx={512 + ((i * 29) % 56)} cy={yy} r={7 + (i % 3) * 3} fill="#FDF1C4" opacity={0.75 * Math.sin(pp * Math.PI)} />; })}
        </g>
        <path d="M540 1262 C534 1000 540 760 548 560 C552 470 566 400 590 330" fill="none" stroke="#5B4033" strokeWidth="15" strokeLinecap="round" />
        {/* gotas de sebo saindo da glândula */}
        {t > T.p1 && t < T.p3 && [0, 1, 2].map((i) => { const pp = ((t - T.p1) * 1.3 + i / 3) % 1;
          return <circle key={i} cx={655 - 70 * pp} cy={957 - 55 * pp} r={10} fill={C.seboClaro} opacity={Math.sin(pp * Math.PI)} />; })}
        {/* bactérias */}
        {BACT.map((bc, i) => { const p = sp(f, fps, bc.at, SP.pop); if (p <= 0.001) return null; const pa = BACT[bc.pai];
          const x = pa.x + (bc.x - pa.x) * Math.min(1, p), y = pa.y + (bc.y - pa.y) * Math.min(1, p);
          return <g key={i} transform={`translate(${x} ${y}) rotate(${bc.rot + Math.sin(t * 6 + i) * 14}) scale(${Math.min(1.15, p)})`}>
            <rect x="-19" y="-9" width="38" height="18" rx="9" fill={C.bact} stroke={C.bactEsc} strokeWidth="3.5" /><rect x="-11" y="-5" width="13" height="4" rx="2" fill="#C7B0EE" /></g>; })}
      </g>
      {/* superfície: camada córnea */}
      {superficie.map((x, i) => <rect key={i} x={x} y={548 + (i % 2) * 5} width="64" height="15" rx="7.5" fill="#EFCDB4" stroke="#D6A98A" strokeWidth="1.6" />)}
      {/* células mortas caindo no poro */}
      {FLOCOS.map((fl, i) => { const p = lin(t, T.p1 + 0.5 + i * 0.13, T.p1 + 1.0 + i * 0.13); if (p <= 0) return null;
        const borda = fl.x0 < 540 ? 470 : 610; const a = Math.min(1, p / 0.6), c = Math.max(0, (p - 0.6) / 0.4);
        const x = fl.x0 + (borda - fl.x0) * a + (fl.x1 - borda) * c, y = 545 + (fl.y1 - 545) * c - (1 - b) * 0 - h * 0.55 * b;
        return <polygon key={i} points={FLOCO} transform={`translate(${x} ${y}) rotate(${fl.r * (a + c)})`} fill="#EBCFB6" stroke="#B98F70" strokeWidth="3" strokeLinejoin="round" />; })}
      {/* o caroço que cresce na superfície */}
      {b > 0 && <g>
        <path d={`M${540 - w} 566 C${540 - w * 0.55} 566 ${540 - w * 0.5} ${566 - h * 1.35} 540 ${566 - h * 1.35} C${540 + w * 0.5} ${566 - h * 1.35} ${540 + w * 0.55} 566 ${540 + w} 566 Z`}
          fill="url(#caroco)" stroke="#D98880" strokeWidth="5" opacity={0.55 + 0.4 * b} />
        <ellipse cx="540" cy={566 - h * 0.95} rx={30 * b} ry={17 * b} fill="#FBE6C9" opacity={0.9 * lin(b, 0.5, 1)} />
        <ellipse cx={540 - w * 0.28} cy={566 - h * 0.9} rx={w * 0.12} ry={h * 0.12} fill="#fff" opacity={0.45 * b} />
      </g>}
      {/* células de defesa */}
      {DEFESA.map((d, i) => { const p = lin(t, T.p3 + 0.2 + i * 0.07, T.p3 + 1.1 + i * 0.07, Easing.out(Easing.cubic)); if (p <= 0) return null;
        const x = d.x0 + (d.x1 - d.x0) * p, y = d.y0 + (d.y1 - d.y0) * p + Math.sin(t * 7 + i) * 6;
        return <g key={i} transform={`translate(${x} ${y})`} opacity={Math.min(1, p * 4)}>
          <circle r="25" fill="#FFFFFF" stroke="#9FB4DD" strokeWidth="5" /><circle cx="4" cy="3" r="10" fill="#B9C9EC" /></g>; })}
      {/* rótulos à mão */}
      <Rotulo x={690} y={1210} de={T.p1 + 0.25} ate={T.p2 - 0.35} seta="M800 1150 C820 1120 810 1100 790 1085">glândula sebácea</Rotulo>
      <Rotulo x={640} y={770} de={T.p1 + 0.7} ate={T.p2 - 0.35} seta="M650 775 C620 790 600 800 578 815">sebo</Rotulo>
      <Rotulo x={70} y={455} de={T.p1 + 0.9} ate={T.p2 - 0.35} seta="M300 470 C340 490 370 510 400 535">células mortas</Rotulo>
      <Rotulo x={150} y={1300} de={T.p3 + 0.6} ate={T.volta[0] - 0.1} seta="M330 1245 C360 1210 390 1170 425 1130">células de defesa</Rotulo>
    </svg>
  );
};
const camPele = (t: number) => {
  let c = { s: CAM[0].s, fx: CAM[0].fx, fy: CAM[0].fy };
  for (const k of CAM.slice(1)) {
    if (t < k.t) break; const p = lin(t, k.t, k.t + k.d);
    c = { s: c.s + (k.s - c.s) * p, fx: c.fx + (k.fx - c.fx) * p, fy: c.fy + (k.fy - c.fy) * p };
  }
  const s = c.s * (1 + 0.012 * Math.sin(t * 1.3));
  return `translate(${540 - c.fx * s}px, ${1000 - c.fy * s}px) scale(${s})`;
};

// ── textos de tela ────────────────────────────────────────────────────────
const Titulo: React.FC = () => {
  const { f, fps, t } = useT();
  const e = lin(t, T.mergulho[0] + 0.1, T.mergulho[0] + 0.4);
  if (e >= 1) return null;
  const p = sp(f, fps, 0.03, SP.mola);
  return <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 104, lineHeight: 1.0, letterSpacing: "-0.045em",
    color: C.tinta, opacity: Math.min(1, p * 1.6) * (1 - e), transform: `translateY(${(1 - p) * 40 - e * 40}px) scale(${1 + e * 0.15})` }}>
    COMO NASCE<br />UMA <Marca p={lin(t, 0.3, 0.7)}>ESPINHA</Marca>?</div>;
};
const Passo: React.FC<{ n: number; de: number; ate: number; titulo: string; sub: string; size?: number }> = ({ n, de, ate, titulo, sub, size = 60 }) => {
  const { f, fps, t } = useT();
  if (t < de || t > ate + 0.25) return null;
  const p = sp(f, fps, de, SP.mola), e = lin(t, ate, ate + 0.22, Easing.in(Easing.cubic));
  const chip = sp(f, fps, de + 0.08, SP.pop);
  return (
    <div style={{ position: "absolute", left: 60, top: 150, width: 960, height: 200, borderRadius: 44, background: C.branco, border: "2px solid #E4DFD6",
      boxShadow: "0 36px 70px -34px rgba(60,30,30,0.55)", opacity: Math.min(1, p * 1.6) * (1 - e),
      transform: `translateY(${(1 - p) * -60 - e * 40}px) scale(${0.94 + 0.06 * p}) rotate(${(1 - p) * -1.5}deg)` }}>
      <div style={{ position: "absolute", left: 34, top: 44, width: 112, height: 112, borderRadius: 56, background: C.rosaForte, color: C.branco, display: "grid", placeItems: "center",
        fontFamily: SANS, fontWeight: 800, fontSize: 68, transform: `scale(${chip}) rotate(${(1 - chip) * -40}deg)` }}>{n}</div>
      <div style={{ position: "absolute", left: 176, top: 40, fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: "-0.04em", color: C.tinta, whiteSpace: "nowrap" }}>{titulo}</div>
      <Escrita at={de + 0.25} dur={0.55} size={58} color={C.rosaForte} style={{ left: 176, top: 112, textAlign: "left", whiteSpace: "nowrap" }}>{sub}</Escrita>
    </div>
  );
};
const Resultado: React.FC = () => {
  const { f, fps, t } = useT();
  if (t < T.espinha) return null;
  const p = sp(f, fps, T.espinha + 0.1, SP.mola), e = lin(t, T.fim - 0.3, T.fim - 0.05);
  const n = sp(f, fps, T.espinha + 0.45, SP.mola);
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 104, lineHeight: 1.0, letterSpacing: "-0.045em",
      color: C.tinta, opacity: Math.min(1, p * 1.6) * (1 - e), transform: `translateY(${(1 - p) * 40}px)` }}>
      E ASSIM NASCE<br />A <Marca p={lin(t, T.espinha + 0.4, T.espinha + 0.8)}>ESPINHA</Marca>!</div>
    <div style={{ position: "absolute", left: 150, top: 1490, width: 780, height: 150, borderRadius: 36, background: C.branco, boxShadow: "0 30px 60px -30px rgba(50,40,30,0.55)",
      opacity: Math.min(1, n * 1.6) * (1 - e), transform: `translateY(${(1 - n) * 50}px) rotate(-2.5deg)` }}>
      <Escrita at={T.espinha + 0.55} dur={0.6} size={78} sub style={{ left: 30, width: 720, top: 24 }}>não é falta de higiene!</Escrita>
    </div>
  </>;
};

// ── tela final da marca (Explica Farmácia) ───────────────────────────────
const LogoExplica: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 420 420" style={{ display: "block" }}>
    <circle cx="210" cy="210" r="210" fill="#E0929B" />
    <g fontFamily="Titan One" textAnchor="middle" fill="#F8EBE1" stroke="#F8EBE1" strokeWidth={2} strokeLinejoin="round" paintOrder="stroke">
      <text x="210" y="208" fontSize="77" textLength="294" lengthAdjust="spacingAndGlyphs">EXPLICA</text>
      <text x="210" y="284" fontSize="77" textLength="332" lengthAdjust="spacingAndGlyphs">FARMÁCIA</text>
    </g>
  </svg>
);
const IG = "linear-gradient(90deg, #F9A23B 0%, #F2643A 22%, #E1306C 50%, #C13584 72%, #7B4DE0 100%)";
const TelaMarca: React.FC = () => {
  const { f, fps, t } = useT();
  const F = T.fim;
  if (t < F - 0.25) return null;
  const fundo = lin(t, F - 0.25, F + 0.05);
  const frase = sp(f, fps, F + 0.05, SP.mola);
  const logo = sp(f, fps, F + 0.3, SP.mola);
  const arroba = sp(f, fps, F + 0.75, SP.suave);
  const botao = sp(f, fps, F + 1.05, SP.pop);
  const toque = lin(t, F + 1.9, F + 2.05) * (1 - lin(t, F + 2.05, F + 2.25));
  const seguindo = t >= F + 2.05;
  const mao = lin(t, F + 1.45, F + 1.9, Easing.out(Easing.cubic)) * (1 - lin(t, F + 2.4, F + 2.7));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: fundo, background: C.papel, backgroundImage: `radial-gradient(${C.ponto} 1.6px, transparent 1.9px)`, backgroundSize: "34px 34px" }} />
      <div style={{ position: "absolute", left: 90, right: 90, top: 210, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 66, lineHeight: 1.12, letterSpacing: "-0.04em",
        color: C.tinta, opacity: Math.min(1, frase * 1.6), transform: `translateY(${(1 - frase) * 40}px)` }}>
        Conhecer sua pele também é uma forma de <Marca p={lin(t, F + 0.5, F + 1.0)}>cuidar da saúde.</Marca></div>
      <div style={{ position: "absolute", left: 540 - 200, top: 640, width: 400, height: 400, borderRadius: "50%", boxShadow: "0 40px 80px -30px rgba(120,60,70,0.55)",
        transform: `scale(${logo}) rotate(${(1 - logo) * -25}deg)`, opacity: Math.min(1, logo * 2) }}><LogoExplica size={400} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1080, textAlign: "center", opacity: arroba, transform: `translateY(${(1 - arroba) * 24}px)` }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 25, letterSpacing: "0.08em", color: C.cinza, marginBottom: 8 }}>AUTOCUIDADO E SAÚDE DA PELE | FARMÁCIA</div>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 82, letterSpacing: "-0.04em", backgroundImage: IG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>@explicafarmacia</span>
      </div>
      <div style={{ position: "absolute", left: 540 - 210, top: 1280, width: 420, height: 110, borderRadius: 55, display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
        background: seguindo ? C.branco : C.tinta, border: `4px solid ${C.tinta}`, color: seguindo ? C.tinta : C.branco, fontFamily: SANS, fontWeight: 800, fontSize: 46, letterSpacing: "-0.02em",
        boxShadow: "0 24px 50px -24px rgba(40,30,20,0.6)", transform: `scale(${botao * (1 - 0.08 * toque)})`, opacity: Math.min(1, botao * 2) }}>
        {seguindo ? <><svg width="40" height="40" viewBox="0 0 20 20"><path d="M3.5 10.5 L8 15 L16.5 5.5" fill="none" stroke={C.rosaForte} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>SEGUINDO</>
          : <><span style={{ fontSize: 58, lineHeight: 1, marginTop: -6 }}>+</span>SEGUIR</>}
      </div>
      {mao > 0.001 && <svg width="120" height="140" viewBox="0 0 60 70" style={{ position: "absolute", left: 640 - 90 * (1 - mao), top: 1335 + 120 * (1 - mao), opacity: Math.min(1, mao * 1.5),
        transform: `scale(${1 - 0.1 * toque})`, transformOrigin: "20% 10%" }}>
        <path d="M18 6 C18 2 24 2 24 6 V30 L27 22 C29 18 34 20 32 25 L35 24 C37 21 42 23 40 28 L43 28 C46 27 48 30 46 34 L42 52 C41 58 36 62 30 62 H24 C18 62 14 58 11 53 L4 40 C2 36 7 33 10 37 L18 46 Z"
          fill={C.branco} stroke={C.tinta} strokeWidth="3.2" strokeLinejoin="round" /></svg>}
    </AbsoluteFill>
  );
};

// ── acabamento e som ──────────────────────────────────────────────────────
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
const Sons: React.FC = () => (
  <>
    <Audio src={staticFile("audio/trilha.mp3")} startFrom={q(8)} volume={(f) => 0.26 * interpolate(f, [0, 8], [0, 1], clamp) * interpolate(f, [TOTAL - q(1.2), TOTAL - 2], [1, 0], clamp)} />
    {SFX.map((s, i) => <Sequence key={i} from={Math.max(0, q(s.at))} durationInFrames={q(2.6)}><Audio src={staticFile(`audio/${s.src}.mp3`)} volume={s.vol ?? 0.5} /></Sequence>)}
  </>
);

export const Reel: React.FC = () => {
  const { f, t } = useT();
  const z = lin(t, T.mergulho[0], T.mergulho[1]) * (1 - lin(t, T.volta[0], T.volta[1]));
  const borrao = Math.sin(z * Math.PI) * 16;
  const aOp = 1 - lin(z, 0.5, 0.8, Easing.linear), bOp = lin(z, 0.4, 0.75, Easing.linear);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.papel }}>
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(${C.ponto} 1.6px, transparent 1.9px)`, backgroundSize: "34px 34px" }} />
      {aOp > 0 && <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: aOp, filter: borrao > 0.3 ? `blur(${borrao}px)` : undefined,
        transformOrigin: `${P.x}px ${P.y}px`, transform: `translate(${(540 - P.x) * z}px, ${(960 - P.y) * z}px) scale(${Math.pow(16, z)})` }}><Rosto t={t} /></div>}
      {bOp > 0 && <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: bOp, filter: borrao > 0.3 ? `blur(${borrao * 0.6}px)` : undefined,
        transformOrigin: "540px 960px", transform: `scale(${Math.pow(0.2, 1 - z)})` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: "0 0", transform: camPele(t) }}><Pele t={t} /></div>
      </div>}
      {/* luz cinematográfica dentro da pele */}
      <AbsoluteFill style={{ opacity: bOp, background: "radial-gradient(ellipse 75% 60% at 50% 48%, rgba(255,240,225,0.16) 0%, transparent 55%, rgba(70,20,30,0.42) 100%)" }} />
      <Titulo />
      <Passo n={1} de={T.p1 + 0.1} ate={T.p2 - 0.22} titulo="O PORO ENTOPE" sub="sebo + células mortas" size={66} />
      <Passo n={2} de={T.p2 + 0.05} ate={T.p3 - 0.22} titulo="A BACTÉRIA SE MULTIPLICA" sub="Cutibacterium acnes" size={49} />
      <Passo n={3} de={T.p3 + 0.05} ate={T.volta[0] - 0.05} titulo="A PELE INFLAMA" sub="vermelhidão e inchaço" size={66} />
      <Resultado />
      <TelaMarca />
      <AbsoluteFill style={{ backgroundImage: NOISE, backgroundSize: "220px", backgroundPosition: `${(f * 7) % 220}px ${(f * 13) % 220}px`, opacity: 0.05, mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(60,45,30,0.16) 100%)" }} />
      <Sons />
    </AbsoluteFill>
  );
};
export { FPS };
