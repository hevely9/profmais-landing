import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BEAT, HITS, clamp, theme } from "../theme";

// ── Layer 1: living background mesh ──────────────────────────────────────
export const BgMesh: React.FC<{ base?: string; a?: string; b?: string; drift?: number }> = ({
  base = theme.colors.bg, a = theme.colors.light, b = theme.colors.sand, drift = 1,
}) => {
  const f = useCurrentFrame();
  const d1 = Math.sin(f / 55) * 60 * drift, d2 = Math.cos(f / 70) * 50 * drift;
  return (
    <AbsoluteFill style={{ background: base, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 1400, height: 1400, borderRadius: "50%", top: -520, left: -380 + d1,
        filter: "blur(60px)", background: `radial-gradient(circle, ${a}66, transparent 62%)` }} />
      <div style={{ position: "absolute", width: 1100, height: 1100, borderRadius: "50%", bottom: -480, right: -320 - d2,
        filter: "blur(80px)", background: `radial-gradient(circle, ${b}22, transparent 65%)` }} />
    </AbsoluteFill>
  );
};

// ── Layer 4: color grade ─────────────────────────────────────────────────
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.light, mixBlendMode: "soft-light", opacity: 0.2 }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.18), transparent 26%, transparent 74%, rgba(0,0,0,0.3))" }} />
  </AbsoluteFill>
);

// ── Layer 5: grain + vignette ────────────────────────────────────────────
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
export const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: NOISE, backgroundSize: "220px",
    backgroundPosition: `${(f * 7) % 220}px ${(f * 13) % 220}px`, opacity: 0.09, mixBlendMode: "overlay" }} />;
};
export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.42) 100%)" }} />
);

// ── Impact energy: 1 at the hit, decays fast (global frame) ──────────────
export const impactAt = (f: number, hit: number, decay = 5) => (f < hit ? 0 : Math.exp(-(f - hit) / decay));

// Camera shake driven by the global HITS list.
export const useShake = (globalFrame: number) => {
  let x = 0, y = 0, r = 0;
  for (const [h, amp] of HITS) {
    const e = impactAt(globalFrame, h, 4);
    if (e < 0.01) continue;
    const t = globalFrame - h;
    x += Math.sin(t * 2.9 + h) * amp * e;
    y += Math.cos(t * 3.7 + h * 0.5) * amp * e;
    r += Math.sin(t * 2.1 + h) * amp * 0.04 * e;
  }
  return `translate(${x}px, ${y}px) rotate(${r}deg)`;
};

// RGB split for type on impacts.
export const chroma = (amount: number) =>
  amount < 0.02 ? "none" : `${amount * 9}px 0 ${theme.colors.red}, ${-amount * 9}px 0 ${theme.colors.cyan}`;

// ── HUD: timecode + beat counter, the "designer's monitor" ───────────────
export const Hud: React.FC<{ globalFrame: number; hideFrom: number }> = ({ globalFrame, hideFrom }) => {
  const { fps } = useVideoConfig();
  const vis = interpolate(globalFrame, [6, 16, hideFrom, hideFrom + 8], [0, 1, 1, 0], { ...clamp, easing: theme.ease.out });
  const ss = Math.floor(globalFrame / fps), ff = globalFrame % fps;
  const tc = `00:00:${String(ss).padStart(2, "0")}:${String(ff).padStart(2, "0")}`;
  const beatInBar = Math.floor(globalFrame / BEAT) % 4;
  const beatPhase = (globalFrame % BEAT) / BEAT;
  const mono: React.CSSProperties = { fontFamily: theme.fonts.mono, fontWeight: 500, fontSize: 24, letterSpacing: "0.14em", color: theme.colors.textDim };
  return (
    <AbsoluteFill style={{ opacity: vis, pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 268, left: 72, right: 72, display: "flex", justifyContent: "space-between", ...mono,
        transform: `translateY(${(1 - vis) * -20}px)` }}>
        <span><span style={{ color: theme.colors.sand }}>●</span> MOTION REEL · 2026</span>
        <span style={{ fontVariantNumeric: "tabular-nums", color: theme.colors.text }}>{tc}</span>
      </div>
      <div style={{ position: "absolute", top: 312, left: 72, right: 72, height: 2, background: "rgba(246,241,227,0.12)" }}>
        <div style={{ width: `${(globalFrame / 450) * 100}%`, height: 2, background: theme.colors.sand }} />
      </div>
      <div style={{ position: "absolute", top: 332, left: 72, display: "flex", gap: 10, alignItems: "center", ...mono, fontSize: 18 }}>
        {[0, 1, 2, 3].map((i) => {
          const on = i === beatInBar ? 1 - beatPhase * 0.85 : 0.15;
          return <div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: theme.colors.sand, opacity: on,
            transform: `scale(${i === beatInBar ? 1.25 - beatPhase * 0.25 : 1})` }} />;
        })}
        <span style={{ marginLeft: 10 }}>120 BPM · 30 FPS</span>
      </div>
    </AbsoluteFill>
  );
};
