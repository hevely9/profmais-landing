import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BgMesh } from "../components/fx";
import { clamp, theme } from "../theme";

// 0.0–1.5 s · A single orange dot falls, squashes on the downbeat, rings out,
// stretches into a line and the frame splits open along it.
const LAND = 15;

const Inner: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const y = f < 4
    ? interpolate(f, [0, 4], [430, 380], { ...clamp, easing: theme.ease.out })
    : interpolate(f, [4, LAND], [380, 960], { ...clamp, easing: theme.ease.fall });
  const fallStretch = f < 4 ? interpolate(f, [0, 2, 4], [1, 0.82, 1], clamp) : interpolate(f, [4, LAND], [1, 1.5], { ...clamp, easing: theme.ease.in });
  const j = spring({ frame: f - LAND, fps, config: theme.spring.jelly });
  const d = f < LAND ? 0 : 1 - j; // oscillates around 0 after the landing
  const sx = f < LAND ? 1 / fallStretch : 1 + 0.75 * d;
  const sy = f < LAND ? fallStretch : 1 - 0.5 * d;

  const line = interpolate(f, [24, 38], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const w = interpolate(line, [0, 1], [96, 1500]);
  const h = interpolate(line, [0, 1], [96, 12]);

  const rings = [LAND, LAND + 4].map((s, i) => {
    const p = interpolate(f, [s, s + 20], [0, 1], { ...clamp, easing: theme.ease.out });
    return (
      <div key={i} style={{ position: "absolute", left: 540, top: 960, width: 0, height: 0 }}>
        <div style={{ position: "absolute", width: 2 * (48 + 470 * p), height: 2 * (48 + 470 * p) * 0.92,
          left: -(48 + 470 * p), top: -(48 + 470 * p) * 0.92, borderRadius: "50%",
          border: `${interpolate(p, [0, 1], [10, 0.5])}px solid ${theme.colors.sand}`, opacity: f < s ? 0 : 1 - p }} />
      </div>
    );
  });

  // dust kicked up by the impact
  const dust = Array.from({ length: 14 }, (_, i) => {
    const t = f - LAND;
    if (t < 0) return null;
    const side = i % 2 ? 1 : -1, sp = 6 + (i % 5) * 3.2;
    const x = 540 + side * (60 + sp * t * 1.6), yy = 990 - (sp * t - 0.5 * 1.1 * t * t) * 0.9;
    const o = interpolate(t, [0, 18], [1, 0], { ...clamp, easing: theme.ease.in });
    return <div key={i} style={{ position: "absolute", left: x, top: Math.min(yy, 1000), width: 10 - (i % 4), height: 10 - (i % 4),
      borderRadius: "50%", background: theme.colors.sand, opacity: o }} />;
  });

  return (
    <AbsoluteFill>
      <BgMesh base={theme.colors.bgDark} a={theme.colors.primary} />
      {rings}
      {dust}
      <div style={{ position: "absolute", left: 540 - w / 2, top: y - h / 2, width: w, height: h, borderRadius: 999,
        background: theme.colors.hero, transform: `scale(${sx}, ${sy})`, transformOrigin: "50% 100%",
        boxShadow: `0 0 60px ${theme.colors.glow}, 0 0 140px ${theme.colors.glow}` }} />
    </AbsoluteFill>
  );
};

export const Drop: React.FC = () => {
  const f = useCurrentFrame();
  const split = interpolate(f, [36, 46], [0, 1100], { ...clamp, easing: theme.ease.in });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: "inset(0 0 50% 0)", transform: `translateY(${-split}px)` }}><Inner /></AbsoluteFill>
      <AbsoluteFill style={{ clipPath: "inset(50% 0 0 0)", transform: `translateY(${split}px)` }}><Inner /></AbsoluteFill>
    </AbsoluteFill>
  );
};
