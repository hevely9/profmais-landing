import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BgMesh } from "../components/fx";
import { clamp, theme } from "../theme";
import { RING } from "./Goo";

// 8.9–11.1 s · The goo ring becomes a progress dial; counter, staggered bars and a line
// that draws itself with the hero dot riding its tip. Exit is a whip pan with stretch blur.
const VALUES = [0.32, 0.5, 0.42, 0.66, 0.58, 0.82, 1];
const BW = 70, GAP = 34, BASE = 1450, MAXH = 290;
const X0 = 540 - (VALUES.length * BW + (VALUES.length - 1) * GAP) / 2;
const PTS = VALUES.map((v, i) => [X0 + i * (BW + GAP) + BW / 2, BASE - v * MAXH - 46] as const);
const SEG = PTS.slice(1).map((p, i) => Math.hypot(p[0] - PTS[i][0], p[1] - PTS[i][1]));
const LEN = SEG.reduce((a, b) => a + b, 0);
const pointAt = (t: number) => {
  let d = t * LEN;
  for (let i = 0; i < SEG.length; i++) {
    if (d <= SEG[i]) { const k = d / SEG[i]; return [PTS[i][0] + (PTS[i + 1][0] - PTS[i][0]) * k, PTS[i][1] + (PTS[i + 1][1] - PTS[i][1]) * k]; }
    d -= SEG[i];
  }
  return [...PTS[PTS.length - 1]];
};
export const WHIP = 54;

export const Data: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  // the full goo ring snaps back to zero, then sweeps up as a dial
  const dial = f < 7
    ? interpolate(f, [0, 7], [1, 0], { ...clamp, easing: theme.ease.inOut })
    : interpolate(f, [7, 32], [0, 0.82], { ...clamp, easing: theme.ease.out });
  const count = Math.round(interpolate(f, [7, 32], [0, 98], { ...clamp, easing: theme.ease.out }));
  const draw = interpolate(f, [20, 44], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const tip = pointAt(draw);
  const whip = interpolate(f, [WHIP, WHIP + 10], [0, 1], { ...clamp, easing: theme.ease.in });
  const C = 2 * Math.PI * RING.r;
  const labelIn = spring({ frame: f - 10, fps, config: theme.spring.smooth });
  const breathe = 1 + Math.sin(f / 18) * 0.01;
  const numIn = spring({ frame: f - 5, fps, config: theme.spring.snappy });

  return (
    <AbsoluteFill style={{ transform: `translateX(${-1400 * whip}px) scaleX(${1 + 0.25 * whip})`, filter: `blur(${whip * 16}px)` }}>
      <BgMesh base={theme.colors.bgDark} a={theme.colors.primary} b={theme.colors.light} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <circle cx={RING.cx} cy={RING.cy} r={RING.r} fill="none" stroke="rgba(239,220,169,0.14)" strokeWidth={RING.stroke} />
        <circle cx={RING.cx} cy={RING.cy} r={RING.r} fill="none" stroke={theme.colors.sand} strokeWidth={RING.stroke} strokeLinecap="round"
          strokeDasharray={`${C * dial} ${C}`} transform={`rotate(-90 ${RING.cx} ${RING.cy})`} />
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i / 60) * Math.PI * 2 - Math.PI / 2, on = i / 60 <= dial;
          const r1 = RING.r + 34, r2 = RING.r + (i % 5 === 0 ? 58 : 46);
          return <line key={i} x1={RING.cx + Math.cos(a) * r1} y1={RING.cy + Math.sin(a) * r1} x2={RING.cx + Math.cos(a) * r2} y2={RING.cy + Math.sin(a) * r2}
            stroke={theme.colors.sand} strokeWidth={4} opacity={on ? 0.85 : 0.15} />;
        })}
        {VALUES.map((v, i) => {
          const p = spring({ frame: f - 8 - i * 4, fps, config: theme.spring.snappy });
          const h = v * MAXH * p * breathe;
          const x = X0 + i * (BW + GAP);
          return <g key={i}>
            <rect x={x} y={BASE - h} width={BW} height={h} rx={10} fill={theme.colors.light} />
            <rect x={x} y={BASE - h} width={BW} height={Math.min(h, 14)} rx={7} fill={theme.colors.sand} />
          </g>;
        })}
        <line x1={X0 - 20} y1={BASE + 2} x2={1080 - X0 + 20} y2={BASE + 2} stroke="rgba(239,220,169,0.35)" strokeWidth={3} />
        <polyline points={PTS.map((p) => p.join(",")).join(" ")} fill="none" stroke={theme.colors.text} strokeWidth={6}
          strokeLinejoin="round" strokeLinecap="round" strokeDasharray={`${LEN * draw} ${LEN}`} />
        {PTS.map((p, i) => {
          const passed = draw * LEN >= SEG.slice(0, i).reduce((a, b) => a + b, 0) - 1;
          return <circle key={i} cx={p[0]} cy={p[1]} r={passed && draw > 0 ? 9 : 0} fill={theme.colors.text} />;
        })}
        {draw > 0 && <circle cx={tip[0]} cy={tip[1]} r={18 * (1 + 0.15 * Math.sin(f / 3))} fill={theme.colors.hero}
          style={{ filter: `drop-shadow(0 0 18px ${theme.colors.hero})` }} />}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: RING.cy - 110, textAlign: "center", fontFamily: theme.fonts.display,
        fontWeight: 900, fontSize: 190, lineHeight: 1, letterSpacing: "-0.04em", color: theme.colors.text, fontVariantNumeric: "tabular-nums",
        opacity: numIn, transform: `translateY(${(1 - numIn) * 40}px) scale(${0.85 + 0.15 * numIn})` }}>
        {count}<span style={{ fontSize: 90, color: theme.colors.sand, marginLeft: 6 }}>%</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: RING.cy + 96, textAlign: "center", fontFamily: theme.fonts.mono, fontWeight: 700,
        fontSize: 26, letterSpacing: "0.3em", color: theme.colors.textDim, opacity: labelIn, transform: `translateY(${(1 - labelIn) * 20}px)` }}>
        ATENÇÃO RETIDA
      </div>
    </AbsoluteFill>
  );
};
