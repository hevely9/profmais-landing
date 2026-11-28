import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BgMesh } from "../components/fx";
import { clamp, rand, theme } from "../theme";

// 10.7–13.1 s · Whip-in to a CSS-3D tunnel of brand modules that twists and accelerates
// (cubic speed ramp) toward the hero dot at the vanishing point; warp streaks; white-out into the logo.
const N = 18, DEPTH = 4200;
const travel = (f: number) => { const p = f / 70; return DEPTH * (0.5 * p + 1.6 * p * p * p); };

export const Tunnel: React.FC = () => {
  const f = useCurrentFrame();
  const enter = interpolate(f, [0, 10], [1, 0], { ...clamp, easing: theme.ease.out });
  const speed = (travel(f + 1) - travel(f)) / 60; // ~1 → 4
  const flash = interpolate(f, [58, 66], [0, 1], { ...clamp, easing: theme.ease.in });
  const t = travel(f);

  const frames = Array.from({ length: N }, (_, k) => {
    const z = ((k * (DEPTH / N) + t) % DEPTH) - DEPTH + 520;
    const fog = interpolate(z, [-DEPTH + 520, -2400, 200, 500], [0, 1, 1, 0], clamp);
    const twist = k * 9 + f * 1.2 + z * 0.012;
    const color = [theme.colors.sand, theme.colors.light, theme.colors.text][k % 3];
    return (
      <div key={k} style={{ position: "absolute", left: 540, top: 960, width: 0, height: 0, transformStyle: "preserve-3d",
        transform: `translateZ(${z}px) rotateZ(${twist}deg)` }}>
        <div style={{ position: "absolute", left: -520, top: -520, width: 1040, height: 1040, borderRadius: 40,
          border: `12px solid ${color}`, opacity: fog }}>
          <div style={{ position: "absolute", left: -12, top: -12, width: 280, height: 280, borderTopLeftRadius: 40,
            borderBottomRightRadius: 280, background: color, opacity: 0.22 }} />
        </div>
      </div>
    );
  });

  const streaks = Array.from({ length: 56 }, (_, i) => {
    const a = rand(i) * Math.PI * 2;
    const r = ((rand(i + 100) * 900 + f * (14 + speed * 22)) % 900) + 80;
    const len = 20 + speed * 120 * (r / 900);
    const o = interpolate(speed, [1, 3.5], [0.15, 0.85], clamp) * interpolate(r, [80, 300, 900], [0, 1, 0.4], clamp);
    return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * r, top: 960 + Math.sin(a) * r, width: len, height: 3,
      borderRadius: 2, background: theme.colors.text, opacity: o, transform: `rotate(${(a * 180) / Math.PI}deg)`, transformOrigin: "0 50%" }} />;
  });

  const dotR = interpolate(f, [0, 64], [6, 70], { ...clamp, easing: theme.ease.in }) * (1 + 0.12 * Math.sin(f * (0.3 + f * 0.01)));
  return (
    <AbsoluteFill style={{ transform: `translateX(${1400 * enter}px) scaleX(${1 + 0.25 * enter})`, filter: `blur(${enter * 16}px)` }}>
      <BgMesh base="#04140F" a={theme.colors.primary} b={theme.colors.light} drift={2} />
      <AbsoluteFill style={{ perspective: 760, perspectiveOrigin: "540px 960px" }}>
        <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `rotateZ(${Math.sin(f / 16) * 3}deg)` }}>{frames}</AbsoluteFill>
      </AbsoluteFill>
      {streaks}
      <div style={{ position: "absolute", left: 540 - dotR, top: 960 - dotR, width: dotR * 2, height: dotR * 2, borderRadius: "50%",
        background: theme.colors.hero, boxShadow: `0 0 ${40 + dotR}px ${theme.colors.glow}, 0 0 ${90 + dotR * 2}px ${theme.colors.glow}` }} />
      <AbsoluteFill style={{ background: theme.colors.text, opacity: flash }} />
    </AbsoluteFill>
  );
};
