import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Block, Check, breathe, draw, useInOut } from "./components/anim";
import { C, END, SAFE, TL, Wq, clamp, rand, theme } from "./theme";

const col = theme.colors;
const mono: React.CSSProperties = { fontFamily: theme.fonts.mono, fontWeight: 700, letterSpacing: "0.18em", color: col.sand };
const S = { stroke: col.line, strokeWidth: 6, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;
const vis = (f: number, a: number, b: number) => f >= a - 2 && f <= b + 12;

// ── F1 · GANCHO: lousa + medidor de memória que despenca abaixo de 50% ──────────
export const Hook: React.FC = () => {
  const { f, style: sOut } = useInOut(-30, C[1] - 6);
  const { fps } = useVideoConfig();
  if (!vis(f, 0, C[1])) return null;
  const q = Wq(1, "METADE"), land = q + 6;
  const fall = interpolate(f, [q - 2, land], [0, 1], { ...clamp, easing: theme.ease.fall });
  const settle = spring({ frame: f - land, fps, config: { damping: 9, stiffness: 180, mass: 0.6 } });
  const LV = 0.36; // abaixo da metade (o roteiro diz "mais da metade" — sem número exato)
  // tensão desde o quadro 0: a memória já vaza devagar (com tremor) antes de despencar
  const leak = interpolate(f, [0, q - 2], [1, 0.86], { ...clamp, easing: theme.ease.inOut });
  const wobble = f < q - 2 ? Math.sin(f / 2.2) * 0.008 : 0;
  const level = f < land ? leak + wobble - (leak - LV) * fall : LV + (1 - settle) * 0.06;
  const shake = f >= land ? Math.sin((f - land) * 3) * 14 * Math.exp(-(f - land) / 4) : 0;
  const B = { x: 150, y: 430, w: 600, h: 440 };          // lousa
  const M = { x: 800, y: 430, w: 110, h: 440 };          // medidor
  const lvlY = M.y + M.h * (1 - level);
  const half = M.y + M.h / 2;
  const qh = Wq(1, "24"); const spin = f * 0.035 + interpolate(f, [qh - 4, qh + 14], [0, 2], { ...clamp, easing: theme.ease.inOut });
  const hp = spring({ frame: f - qh, fps, config: theme.spring.bouncy });
  const chalk = [
    "M190 500 q40 -18 80 0 t80 0 t80 0 t80 0", "M190 570 q30 -14 60 0 t60 0 t60 0 t60 0 t60 0", "M190 640 l60 0 m30 0 l90 0 m30 0 l70 0",
    "M190 710 q40 -18 80 0 t80 0 t80 0", "M190 780 l220 0", "M560 520 l90 140 l-150 0 z",
  ];
  return (
    <AbsoluteFill style={{ ...sOut, transform: `${sOut.transform} translateX(${shake}px)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <rect x={B.x} y={B.y} width={B.w} height={B.h} rx={18} {...S} />
        <path d={`M${B.x - 10} ${B.y + B.h + 22} H${B.x + B.w + 10}`} {...S} />
        {/* o que está acima do nível de memória some (apagado) */}
        <defs><clipPath id="mem"><rect x={0} y={lvlY} width={1080} height={1920} /></clipPath></defs>
        <g clipPath="url(#mem)">
          {chalk.map((d, i) => <path key={i} d={d} {...S} stroke={col.sand} strokeWidth={5} opacity={0.85}
            style={draw(f, -10 + i * 2, 16, 600)} pathLength={600} />)}
        </g>
        {f >= q - 2 && Array.from({ length: 12 }, (_, i) => { // pó de giz no apagador
          const t = f - land; if (t < -6 || t > 18) return null;
          return <circle key={i} cx={B.x + 30 + rand(i) * (B.w - 60) + Math.sin(f / 3 + i) * 8} cy={lvlY - 6 + Math.max(0, t) * (1.5 + rand(i + 5) * 2)}
            r={3 + rand(i + 9) * 3} fill={col.sand} opacity={interpolate(t, [-6, 18], [0.9, 0], clamp)} />;
        })}
        <rect x={M.x} y={M.y} width={M.w} height={M.h} rx={20} {...S} />
        <rect x={M.x + 12} y={lvlY + 12} width={M.w - 24} height={Math.max(0, M.y + M.h - lvlY - 24)} rx={10} fill={col.sand} />
        <path d={`M${B.x - 20} ${half} H${M.x + M.w + 30}`} stroke={col.text} strokeWidth={4} strokeDasharray="16 14" opacity={0.75} />
        <text x={B.x - 18} y={half - 14} textAnchor="start" style={{ ...mono, fontSize: 26, fill: col.text } as React.CSSProperties}>50%</text>
        <g transform={`translate(${M.x + M.w / 2} ${M.y + M.h + 92})`}>
          <circle r={46} {...S} />
          <path d="M0 0 V-30" {...S} transform={`rotate(${spin * 360})`} />
          <path d="M0 0 H22" {...S} transform={`rotate(${spin * 30})`} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: M.x - 40, width: M.w + 80, top: M.y - 62, textAlign: "center", ...mono, fontSize: 24 }}>MEMÓRIA</div>
      <div style={{ position: "absolute", left: M.x - 60, width: M.w + 120, top: M.y + M.h + 148, textAlign: "center", ...mono, fontSize: 30, color: col.text,
        opacity: hp, transform: `scale(${0.6 + 0.4 * hp})` }}>24 H</div>
    </AbsoluteFill>
  );
};

// ── F2 / F4 / F5 · o gráfico (um só objeto, entra e sai do quadro) ───────────────
const G = { x0: 236, x1: 900, yT: 530, yB: 1050 };
const gx = (x: number) => G.x0 + x * (G.x1 - G.x0), gy = (m: number) => G.yB - m * (G.yB - G.yT);
const REVX = [0.18, 0.42, 0.7];
const REVQ = [0.22, 0.5, 0.78].map((p) => Math.round(C[4] + 8 + p * (C[5] - C[4] - 14)));
const semRev = (x: number) => 0.08 + 0.92 * Math.exp(-x * 5.2);
const comRev = (x: number) => {
  const ks = [6, 2.2, 0.9, 0.3]; let x0 = 0, k = 0;
  for (let i = 0; i < REVX.length; i++) if (x >= REVX[i]) { x0 = REVX[i]; k = i + 1; }
  return Math.exp(-ks[k] * (x - x0));
};

export const Graph: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  if (!(vis(f, C[1], C[2]) || vis(f, C[3], C[5]))) return null;
  // entrada F2 (do medidor) · sai para a esquerda em C2 · volta da esquerda em C3 · sai para cima em C5
  const pIn = spring({ frame: f - C[1], fps, config: theme.spring.smooth });
  const out1 = interpolate(f, [C[2] - 4, C[2] + 6], [0, 1], { ...clamp, easing: theme.ease.in });
  const back = spring({ frame: f - C[3], fps, config: theme.spring.smooth });
  const out2 = interpolate(f, [C[5] - 4, C[5] + 6], [0, 1], { ...clamp, easing: theme.ease.in });
  const tx = f < C[3] - 2 ? -1250 * out1 : -1250 * (1 - back);
  const ty = -1300 * out2;
  const axes = draw(f, C[1] + 2, 14, 1400);
  // F4: curva sem revisão desenha (com tique-taque)
  const p4 = interpolate(f, [C[3] + 6, C[3] + 76], [0, 1], { ...clamp, easing: theme.ease.out });
  const n = 80, ptsSem = Array.from({ length: n + 1 }, (_, i) => [gx(i / n), gy(semRev(i / n))]);
  const shown = (pts: number[][], p: number) => pts.slice(0, Math.max(1, Math.floor(p * n) + 1));
  const tipS = ptsSem[Math.min(n, Math.floor(p4 * n))];
  // F5: curva com revisões (sobe em 3 degraus com check)
  const xAt = (q: number) => interpolate(q, [C[4] + 8, ...REVQ, C[5] - 6], [0, ...REVX, 1], clamp);
  const x5 = xAt(f);
  const ptsCom: number[][] = [];
  for (let i = 0; i <= 160; i++) {
    const x = i / 160; if (x > x5) break;
    const r = REVX.find((rx) => Math.abs(rx - x) < 0.5 / 160);
    if (r !== undefined) ptsCom.push([gx(x), gy(comRev(x - 1e-4))]);
    ptsCom.push([gx(x), gy(comRev(x))]);
  }
  const f5 = f >= C[4];
  const ghost = interpolate(f, [C[1] + 14, C[1] + 34], [0, 1], { ...clamp, easing: theme.ease.out });
  return (
    <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px)`, opacity: 1 - out2 * 0.6 }}>
      <svg width={1080} height={1920} style={{ position: "absolute", transform: breathe(f, 4, 34) }}>
        <path d={`M${G.x0} ${G.yT - 40} V${G.yB} H${G.x1 + 30}`} {...S} style={axes} pathLength={1400} />
        <path d={`M${G.x0 - 14} ${G.yT - 22} L${G.x0} ${G.yT - 44} L${G.x0 + 14} ${G.yT - 22}`} {...S} opacity={pIn} />
        <path d={`M${G.x1 + 10} ${G.yB - 14} L${G.x1 + 32} ${G.yB} L${G.x1 + 10} ${G.yB + 14}`} {...S} opacity={pIn} />
        {[1, 2, 3, 4, 5, 6].map((d) => <path key={d} d={`M${gx(d / 7)} ${G.yB} v14`} {...S} strokeWidth={4} opacity={0.6 * pIn} />)}
        {/* prévia fantasma na F2 */}
        {f < C[3] && <polyline points={ptsSem.map((p) => p.join(",")).join(" ")} {...S} stroke={col.sand} strokeDasharray="10 14" opacity={0.45 * ghost} />}
        {/* curva sem revisão */}
        {f >= C[3] && <polyline points={(f5 ? ptsSem : shown(ptsSem, p4)).map((p) => p.join(",")).join(" ")} {...S}
          stroke={f5 ? col.text : col.sand} strokeWidth={f5 ? 5 : 9} strokeDasharray={f5 ? "12 14" : undefined} opacity={f5 ? 0.4 : 1} />}
        {f >= C[3] && !f5 && p4 > 0 && <circle cx={tipS[0]} cy={tipS[1]} r={14} fill={col.sand} />}
        {/* curva com revisões */}
        {f5 && ptsCom.length > 1 && <polyline points={ptsCom.map((p) => p.join(",")).join(" ")} {...S} stroke={col.sand} strokeWidth={9} />}
        {f5 && ptsCom.length > 1 && <circle cx={ptsCom[ptsCom.length - 1][0]} cy={ptsCom[ptsCom.length - 1][1]} r={14} fill={col.sand} />}
      </svg>
      {f5 && REVX.map((rx, i) => (
        <div key={i} style={{ position: "absolute", left: gx(rx) - 34, top: gy(1) - 92 }}><Check q={REVQ[i]} size={68} /></div>
      ))}
      <div style={{ position: "absolute", left: 160, top: (G.yT + G.yB) / 2, transform: "translate(-50%, -50%) rotate(-90deg)", ...mono, fontSize: 26, opacity: pIn }}>MEMÓRIA</div>
      <div style={{ position: "absolute", left: G.x1 - 110, top: G.yB + 30, ...mono, fontSize: 26, opacity: pIn }}>DIAS</div>
      <div style={{ position: "absolute", left: G.x0, right: SAFE.x0, top: 350, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40,
        color: col.text, letterSpacing: "-0.01em", opacity: Math.min(1, pIn * 1.5), transform: `translateY(${(1 - pIn) * 30}px)` }}>
        {f < C[4] ? (f < C[3] ? "Curva do esquecimento" : "Sem revisão") : "Com revisões no tempo certo"}
      </div>
    </AbsoluteFill>
  );
};

// ── F3 · Ebbinghaus, 1885 (retrato em traço + ano rolando + fonte) ────────────
export const Ebbinghaus: React.FC = () => {
  const { f, style } = useInOut(C[2] + 2, C[3] - 6, theme.spring.smooth, 80);
  const { fps } = useVideoConfig();
  if (!vis(f, C[2], C[3])) return null;
  const qy = Wq(3, "1885");
  const digits = "1885".split("");
  return (
    <AbsoluteFill style={style}>
      <svg width={1080} height={1920} style={{ position: "absolute", transform: breathe(f, 5, 28) }}>
        <g transform="translate(540 600)">
          <circle r={230} fill={col.primary} opacity={0.6} />
          <path d="M-110 -60 Q-112 -170 0 -172 Q112 -170 110 -60 Q112 40 60 92 Q0 130 -60 92 Q-112 40 -110 -60 Z" {...S} style={draw(f, C[2] + 4, 16, 900)} pathLength={900} />
          <path d="M-100 -96 Q-60 -150 0 -146 Q70 -150 100 -100" {...S} stroke={col.sand} style={draw(f, C[2] + 8, 12, 400)} pathLength={400} />
          <circle cx={-44} cy={-36} r={28} {...S} style={draw(f, C[2] + 12, 10, 200)} pathLength={200} />
          <circle cx={44} cy={-36} r={28} {...S} style={draw(f, C[2] + 13, 10, 200)} pathLength={200} />
          <path d="M-16 -36 H16" {...S} />
          <path d="M-84 10 Q-78 112 0 132 Q78 112 84 10" {...S} stroke={col.sand} style={draw(f, C[2] + 16, 12, 500)} pathLength={500} />
          {[-48, -24, 0, 24, 48].map((x, i) => <path key={i} d={`M${x} ${62 + Math.abs(x) * 0.2} q${x * 0.08} 26 ${x * 0.05} ${50 - Math.abs(x) * 0.5}`}
            {...S} stroke={col.sand} strokeWidth={4} opacity={interpolate(f, [C[2] + 20 + i, C[2] + 26 + i], [0, 0.8], clamp)} />)}
          <path d="M-30 30 Q0 44 30 30" {...S} strokeWidth={5} />
          <path d="M-150 230 Q-130 150 -60 140 M150 230 Q130 150 60 140" {...S} style={draw(f, C[2] + 18, 12, 400)} pathLength={400} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 850, display: "flex", justifyContent: "center", fontFamily: theme.fonts.display,
        fontWeight: 800, fontSize: 170, lineHeight: 1, color: col.sand, letterSpacing: "-0.02em" }}>
        {digits.map((d, i) => {
          const s = C[2] + 8 + i * 3;
          const p = interpolate(f, [s, s + 14], [0, 1], { ...clamp, easing: theme.ease.out });
          const strip = [...Array.from({ length: 6 }, (_, k) => String(Math.floor(rand(i * 7 + k) * 10))), d];
          return <span key={i} style={{ display: "inline-block", width: 118, textAlign: "center", fontVariantNumeric: "tabular-nums", height: 172, overflow: "hidden", opacity: f >= s - 1 ? 1 : 0 }}>
            <span style={{ display: "flex", flexDirection: "column", transform: `translateY(${-p * 6 * 172}px)` }}>
              {strip.map((c, k) => <span key={k} style={{ height: 172, display: "block" }}>{c}</span>)}
            </span></span>;
        })}
      </div>
      <Block inQ={Wq(3, "HERMANN")} style={{ left: 0, right: 0, top: 1042, textAlign: "center", ...mono, fontSize: 30, color: col.text }}>HERMANN EBBINGHAUS</Block>
      <Block inQ={Wq(3, "HERMANN") + 6} style={{ left: 0, right: 0, top: 1092, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 400,
        fontSize: 28, color: col.textDim }}>fonte: estudo com memorização de sílabas</Block>
    </AbsoluteFill>
  );
};

// ── F6 · calendário: aula seguinte ✓ × véspera da prova riscada ─────────────────
export const Calendar: React.FC = () => {
  const { f, style } = useInOut(C[5] + 2, C[6] - 6);
  const qA = Wq(6, "AULA"), qP = Wq(6, "PROVA");
  const tagA = useInOut(qA - 2);
  const tagV = useInOut(qP - 10);
  const nota = useInOut(Wq(6, "GIGANTE"));
  if (!vis(f, C[5], C[6])) return null;
  const cell = 108, gap = 14, x0 = 540 - (7 * cell + 6 * gap) / 2, y0 = 560;
  const cells = Array.from({ length: 14 }, (_, i) => {
    const r = Math.floor(i / 7), c = i % 7, x = x0 + c * (cell + gap), y = y0 + r * (cell + gap + 40);
    const pIn = interpolate(f, [C[5] + 4 + i * 1.2, C[5] + 14 + i * 1.2], [0, 1], { ...clamp, easing: theme.ease.out });
    const tipo = i === 0 ? "aula" : i === 1 ? "seguinte" : i === 12 ? "vespera" : i === 13 ? "prova" : "";
    const hl = tipo === "seguinte" ? interpolate(f, [qA, qA + 8], [0, 1], { ...clamp, easing: theme.ease.out }) : 0;
    return (
      <div key={i} style={{ position: "absolute", left: x, top: y, width: cell, height: cell, borderRadius: 14,
        border: `${tipo === "seguinte" ? 4 + 4 * hl : 3}px solid ${tipo ? col.sand : "rgba(246,241,227,0.35)"}`,
        background: tipo === "aula" || tipo === "prova" ? col.light : "rgba(14,75,60,0.55)", overflow: "hidden",
        opacity: pIn, transform: `translateY(${(1 - pIn) * 30}px) scale(${1 + 0.08 * hl * (1 - Math.min(1, (f - qA) / 20))})` }}>
        {!tipo && rand(i) > 0.55 && <div style={{ position: "absolute", left: 0, top: 0, width: 54, height: 54, borderBottomRightRadius: 54, background: "rgba(239,220,169,0.12)" }} />}
        <div style={{ position: "absolute", left: 10, top: 6, ...mono, fontSize: 20, color: col.textDim, letterSpacing: "0.05em" }}>{i + 1}</div>
        {tipo === "aula" && <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", ...mono, fontSize: 20, color: col.text }}>AULA</div>}
        {tipo === "prova" && <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", ...mono, fontSize: 18, color: col.text }}>PROVA</div>}
        {tipo === "vespera" && <svg width={cell} height={cell} style={{ position: "absolute", left: -3, top: -3 }}>
          <path d="M22 22 L86 86 M86 22 L22 86" {...S} strokeWidth={9} style={draw(f, qP, 8, 200)} pathLength={200} /></svg>}
      </div>
    );
  });
  return (
    <AbsoluteFill style={style}>
      <div style={{ position: "absolute", left: x0, top: 420, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 46, color: col.text }}>Quando revisar?</div>
      {cells}
      <div style={{ position: "absolute", left: x0, top: y0 - 70, display: "flex", alignItems: "center", gap: 12, ...tagA.style }}>
        <Check q={qA + 4} size={56} />
        <span style={{ ...mono, fontSize: 26, color: col.sand }}>AULA SEGUINTE</span>
      </div>
      <div style={{ position: "absolute", right: 1080 - (x0 + 7 * cell + 6 * gap), top: y0 + 2 * cell + gap + 70, ...tagV.style }}>
        <span style={{ position: "relative", ...mono, fontSize: 26, color: col.text }}>VÉSPERA DA PROVA
          <span style={{ position: "absolute", left: -6, right: -6, top: "50%", height: 5, background: col.text, transformOrigin: "left",
            transform: `scaleX(${interpolate(tagV.f, [qP, qP + 8], [0, 1], { ...clamp, easing: theme.ease.out })})` }} />
        </span>
      </div>
      <div style={{ position: "absolute", left: x0, right: x0, top: y0 + 2 * cell + gap + 150, fontFamily: theme.fonts.body, fontWeight: 400, fontSize: 30,
        color: col.textDim, ...nota.style }}>revisar perto da aula &gt; uma revisão gigante no fim</div>
    </AbsoluteFill>
  );
};

// ── F7 · página de sequência didática com selo "revisões planejadas" ────────────
export const Doc: React.FC = () => {
  const { f, style } = useInOut(C[6] + 2, C[7] - 6, theme.spring.smooth, 120);
  const { fps } = useVideoConfig();
  if (!vis(f, C[6], C[7])) return null;
  const qS = Wq(7, "PLANEJADAS");
  const st = spring({ frame: f - qS, fps, config: theme.spring.bouncy });
  const rows = ["AULA 1", "AULA 2 · REVISÃO", "AULA 3", "AULA 4 · REVISÃO", "AULA 5", "AULA 6 · REVISÃO"];
  const tilt = interpolate(f, [C[6], C[6] + 24], [24, 0], { ...clamp, easing: theme.ease.out });
  return (
    <AbsoluteFill style={{ ...style, perspective: 1400 }}>
      <div style={{ position: "absolute", left: 230, top: 380, width: 620, height: 800, borderRadius: 24, border: `6px solid ${col.line}`,
        background: "rgba(8,53,42,0.9)", transform: `rotateX(${tilt}deg) ${breathe(f, 4, 32)}`, transformOrigin: "50% 100%", padding: "44px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 36, color: col.text }}>Sequência didática</span>
          <span style={{ fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 30, color: col.sand }}>Prof+</span>
        </div>
        <div style={{ height: 4, background: "rgba(246,241,227,0.25)", margin: "22px 0 26px" }} />
        {rows.map((r, i) => {
          const p = interpolate(f, [C[6] + 8 + i * 3, C[6] + 18 + i * 3], [0, 1], { ...clamp, easing: theme.ease.out });
          const rev = r.includes("REVISÃO");
          return <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, height: 92, opacity: p, transform: `translateX(${(1 - p) * 40}px)` }}>
            {rev ? <Check q={Wq(7, "REVISÕES") - 8 + i * 2} size={56} /> : <div style={{ width: 56, height: 56, borderRadius: 28, border: `4px solid rgba(246,241,227,0.35)` }} />}
            <span style={{ ...mono, fontSize: 26, letterSpacing: "0.08em", color: rev ? col.sand : col.text }}>{r}</span>
            <div style={{ flex: 1, height: 3, background: "rgba(246,241,227,0.12)" }} />
          </div>;
        })}
      </div>
      <div style={{ position: "absolute", left: 360, top: 900, padding: "14px 26px", border: `8px solid ${col.sand}`, borderRadius: 16,
        fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40, color: col.sand, background: "rgba(10,42,34,0.85)",
        opacity: Math.min(1, st * 2), transform: `rotate(-9deg) scale(${interpolate(st, [0, 1], [2.2, 1])})`, whiteSpace: "nowrap" }}>REVISÕES PLANEJADAS</div>
    </AbsoluteFill>
  );
};

// ── F8 · WhatsApp: ícone de conversa em traço, botão pulsando, notificação ─────
export const Whats: React.FC = () => {
  const { f, style } = useInOut(C[7] + 2, END - 6);
  const { fps } = useVideoConfig();
  if (!vis(f, C[7], END)) return null;
  const nt = spring({ frame: f - (C[7] + 10), fps, config: theme.spring.snappy });
  const pulse = (k: number) => ((f - C[7] + k * 10) % 30) / 30;
  return (
    <AbsoluteFill style={style}>
      <div style={{ position: "absolute", left: 160, right: 160, top: 360, height: 110, borderRadius: 26, background: "rgba(246,241,227,0.95)",
        display: "flex", alignItems: "center", gap: 20, padding: "0 26px", boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
        transform: `translateY(${(1 - nt) * -260}px)`, opacity: nt }}>
        <svg width={60} height={60} viewBox="0 0 100 100"><path d="M18 50 a32 32 0 1 1 14 26 L14 84 L20 64 Z" fill="none" stroke={col.primary} strokeWidth={8} strokeLinejoin="round" /></svg>
        <div style={{ fontFamily: theme.fonts.body }}><div style={{ fontWeight: 900, fontSize: 30, color: col.primary }}>Prof+</div>
          <div style={{ fontWeight: 400, fontSize: 26, color: "#2b3b35" }}>Nova mensagem</div></div>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", transform: breathe(f, 6, 26) }}>
        <g transform="translate(540 700)">
          <path d="M-150 10 a150 140 0 1 1 64 116 L-170 160 L-138 90 Z" {...S} strokeWidth={10} style={draw(f, C[7] + 4, 18, 1200)} pathLength={1200} />
          {[-60, 0, 60].map((x, i) => <circle key={i} cx={x} cy={0} r={16} fill={col.sand}
            opacity={interpolate(f, [C[7] + 18 + i * 3, C[7] + 24 + i * 3], [0, 1], clamp) * (0.6 + 0.4 * Math.sin(f / 4 - i))} />)}
        </g>
      </svg>
      <div style={{ position: "absolute", left: 540, top: 960, width: 0, height: 0 }}>
        {[0, 1, 2].map((k) => <div key={k} style={{ position: "absolute", left: -330 * (1 + pulse(k) * 0.25), top: -60 * (1 + pulse(k) * 0.6),
          width: 660 * (1 + pulse(k) * 0.25), height: 120 * (1 + pulse(k) * 0.6), borderRadius: 999, border: `3px solid ${col.sand}`, opacity: 0.6 * (1 - pulse(k)) }} />)}
        <div style={{ position: "absolute", left: -330, top: -60, width: 660, height: 120, borderRadius: 999, background: col.sand,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 18, fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 40,
          color: col.bg, transform: `scale(${1 + 0.03 * Math.sin(f / 4)})` }}>
          <svg width={52} height={52} viewBox="0 0 100 100"><path d="M18 50 a32 32 0 1 1 14 26 L14 84 L20 64 Z" fill="none" stroke={col.bg} strokeWidth={10} strokeLinejoin="round" /></svg>
          CHAMAR NO WHATSAPP
        </div>
      </div>
      <Block inQ={Wq(8, "LINK")} style={{ left: 0, right: 0, top: 1062, textAlign: "center", ...mono, fontSize: 30, color: col.text }}>LINK NA BIO ↑ · PROFMAIS.ONLINE</Block>
    </AbsoluteFill>
  );
};

// ── Encerramento (2 s após a voz): logo Prof+ com o "+" laranja ────────────────
export const Closing: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  if (f < END - 2) return null;
  const word = "Prof".split("");
  const ps = spring({ frame: f - END - 10, fps, config: theme.spring.bouncy });
  const pr = spring({ frame: f - END - 10, fps, config: theme.spring.smooth });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 720, display: "flex", justifyContent: "center", alignItems: "center",
        fontFamily: theme.fonts.display, fontWeight: 800, fontSize: 210, lineHeight: 1, letterSpacing: "-0.03em", color: col.text,
        transform: `scale(${1 + Math.sin(f / 20) * 0.01})` }}>
        {word.map((c, i) => { const p = spring({ frame: f - END - i * 3, fps, config: theme.spring.smooth });
          return <span key={i} style={{ display: "inline-block", height: 210, overflow: "hidden" }}><span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 210}px)` }}>{c}</span></span>; })}
        <svg width={150} height={150} viewBox="0 0 100 100" style={{ marginLeft: 14, transform: `scale(${ps}) rotate(${(1 - pr) * -180}deg)`,
          filter: `drop-shadow(0 0 26px ${col.glow})` }}>
          <rect x="38" y="6" width="24" height="88" rx="8" fill={col.hero} /><rect x="6" y="38" width="88" height="24" rx="8" fill={col.hero} />
        </svg>
      </div>
      <Block inQ={END + 16} style={{ left: 0, right: 0, top: 980, textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 400, fontSize: 40, color: col.textDim }}>
        materiais pedagógicos personalizados</Block>
      <Block inQ={END + 22} style={{ left: 0, right: 0, top: 1046, textAlign: "center", ...mono, fontSize: 32, color: col.sand }}>PROFMAIS.ONLINE</Block>
      {Array.from({ length: 6 }, (_, i) => {
        const p = spring({ frame: f - END - 14 - i * 3, fps, config: theme.spring.smooth });
        return <div key={i} style={{ position: "absolute", left: 159 + i * 132, top: 1180, width: 116, height: 116, borderRadius: 10, overflow: "hidden",
          background: i % 2 ? col.primary : "rgba(239,220,169,0.12)", opacity: p, transform: `translateY(${(1 - p) * 50}px)` }}>
          <div style={{ width: 116, height: 116, borderBottomRightRadius: 116, background: i % 2 ? col.light : col.sand, opacity: 0.85, transform: `rotate(${i * 90}deg)` }} />
        </div>;
      })}
    </AbsoluteFill>
  );
};

// ── Motivo da marca: curva entrando pelo canto inferior direito ────────────────
export const Motif: React.FC = () => {
  const f = useCurrentFrame();
  return <svg width={1080} height={1920} style={{ position: "absolute" }}>
    <path d="M1080 1920 L1080 1440 A480 480 0 0 0 600 1920 Z" fill="rgba(239,220,169,0.06)" />
    <path d="M1080 1400 A520 520 0 0 0 560 1920" fill="none" stroke={col.sand} strokeWidth={5} opacity={0.35} style={draw(f, 0, 30, 820)} pathLength={820} />
  </svg>;
};

// ── HUD de progresso: série + 8 pontos (um por frase) ─────────────────────────
export const Progress: React.FC = () => {
  const f = useCurrentFrame();
  const atual = (TL.frases as { n: number; inicio: number }[]).filter((x) => f >= x.inicio * 30 - 6).length;
  const o = interpolate(f, [0, 8, END - 6, END + 2], [0.6, 1, 1, 0], clamp);
  return <div style={{ position: "absolute", left: SAFE.x0, right: SAFE.x0, top: 300, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: o }}>
    <span style={{ ...mono, fontSize: 22, color: col.textDim }}>PROF+ · CURIOSIDADE</span>
    <div style={{ display: "flex", gap: 10 }}>{Array.from({ length: 8 }, (_, i) =>
      <div key={i} style={{ width: i + 1 === atual ? 34 : 12, height: 12, borderRadius: 6, background: i < atual ? col.sand : "rgba(246,241,227,0.22)" }} />)}</div>
  </div>;
};
