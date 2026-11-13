import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BgMesh } from "../components/fx";
import { clamp, rand, theme } from "../theme";

// 6.7–9.1 s · Metaballs (SVG goo filter) orbiting on Lissajous paths, collapsing into one
// mass that pops on the beat, sprays droplets and resolves into a ring — the match cut into Data.
export const RING = { cx: 540, cy: 860, r: 300, stroke: 18 };
const COLLAPSE = [36, 52] as const, POP = 54;

export const Goo: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const col = interpolate(f, COLLAPSE, [1, 0], { ...clamp, easing: theme.ease.in });
  const pop = spring({ frame: f - POP, fps, config: theme.spring.jelly });
  const shrink = interpolate(f, [POP + 4, POP + 14], [1, 0], { ...clamp, easing: theme.ease.in });
  const ringP = interpolate(f, [POP + 2, POP + 16], [0, 1], { ...clamp, easing: theme.ease.out });

  const blobs = Array.from({ length: 9 }, (_, i) => {
    const sp = 0.045 + rand(i + 2) * 0.03;
    const a = (i / 9) * Math.PI * 2 + f * sp;
    const orbit = (230 + 140 * Math.sin(f * 0.06 + i * 1.7)) * col;
    const x = RING.cx + Math.cos(a) * orbit * 1.05;
    const y = RING.cy + Math.sin(a * 1.5 + i) * orbit * 0.95;
    const r = (62 + rand(i + 5) * 58 + 10 * Math.sin(f / 9 + i)) * (0.55 + 0.45 * col);
    return <circle key={i} cx={x} cy={y} r={r} fill={i === 4 ? theme.colors.hero : theme.colors.sand} />;
  });
  const coreR = (80 + 60 * (1 - col) + (f >= POP ? 150 * pop : 0)) * shrink;

  const drops = Array.from({ length: 14 }, (_, i) => {
    const t = f - POP;
    if (t < 0) return null;
    const a = (i / 14) * Math.PI * 2 + rand(i) * 0.4, v = 22 + rand(i + 40) * 16;
    const x = RING.cx + Math.cos(a) * v * t, y = RING.cy + Math.sin(a) * v * t + 0.9 * t * t;
    const o = interpolate(t, [0, 14], [1, 0], { ...clamp, easing: theme.ease.in });
    const s = 16 - (i % 5) * 2;
    return <circle key={`d${i}`} cx={x} cy={y} r={s * o} fill={theme.colors.sand} opacity={o} />;
  });

  const ringR = interpolate(ringP, [0, 1], [200, RING.r]);
  return (
    <AbsoluteFill>
      <BgMesh base={theme.colors.bgDark} a={theme.colors.primary} b={theme.colors.light} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <filter id="goo" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="26" result="b" />
            <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 42 -18" result="g" />
            <feComposite in="SourceGraphic" in2="g" operator="atop" />
          </filter>
        </defs>
        <g filter="url(#goo)">
          {blobs}
          <circle cx={RING.cx} cy={RING.cy} r={Math.max(0, coreR)} fill={theme.colors.sand} />
        </g>
        {drops}
        <circle cx={RING.cx} cy={RING.cy} r={ringR} fill="none" stroke={theme.colors.sand} strokeWidth={RING.stroke}
          opacity={ringP > 0.01 ? 1 : 0} transform={`rotate(-90 ${RING.cx} ${RING.cy})`} />
      </svg>
    </AbsoluteFill>
  );
};
