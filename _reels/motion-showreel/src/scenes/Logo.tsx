import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { measureText } from "@remotion/layout-utils";
import { BgMesh, chroma, impactAt } from "../components/fx";
import { T, clamp, theme } from "../theme";

// 12.9–15 s · White-out resolves into the Prof+ wordmark: masked letter rise, the orange "+"
// spins in on a bouncy spring with a ray burst, the module band and corner arc draw in, tagline types on.
const FS = 236, LS = "-0.04em", PLUS = 150, GAP = 18, Y = 900;
const PLUS_AT = 14;

export const Logo: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = f + T.logo.from;
  const word = "Prof";
  const widths = word.split("").map((c) => measureText({ text: c, fontFamily: theme.fonts.display, fontWeight: "900", fontSize: FS, letterSpacing: LS }).width);
  const wordW = widths.reduce((a, b) => a + b, 0);
  const left = 540 - (wordW + GAP + PLUS) / 2;
  const plusX = left + wordW + GAP + PLUS / 2, plusY = Y - 18;

  const whiteOut = interpolate(f, [0, 9], [1, 0], { ...clamp, easing: theme.ease.out });
  const ps = spring({ frame: f - PLUS_AT, fps, config: theme.spring.bouncy });
  const pr = spring({ frame: f - PLUS_AT, fps, config: theme.spring.smooth });
  const breathe = 1 + Math.sin(f / 20) * 0.01;
  const ch = chroma(Math.max(impactAt(g, 390, 3), impactAt(g, 404, 3)));
  const arc = interpolate(f, [6, 30], [0, 1], { ...clamp, easing: theme.ease.inOut });

  let x = left;
  const letters = word.split("").map((c, i) => {
    const p = spring({ frame: f - 3 - i * 3, fps, config: theme.spring.smooth });
    const el = (
      <div key={i} style={{ position: "absolute", left: x, top: Y - FS * 0.62, height: FS * 0.98, overflow: "hidden" }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 900, fontSize: FS, letterSpacing: LS, lineHeight: 1, color: theme.colors.text,
          transform: `translateY(${(1 - p) * FS}px) rotate(${(1 - p) * 8}deg)`, transformOrigin: "0 100%", textShadow: ch }}>{c}</div>
      </div>
    );
    x += widths[i];
    return el;
  });

  const rays = Array.from({ length: 12 }, (_, i) => {
    const p = spring({ frame: f - PLUS_AT - 1 - i * 0.8, fps, config: theme.spring.snappy });
    const fade = interpolate(f, [PLUS_AT + 10, PLUS_AT + 22], [1, 0], { ...clamp, easing: theme.ease.in });
    return <div key={i} style={{ position: "absolute", left: plusX - 3, top: plusY, width: 6, height: 70 * p, borderRadius: 3,
      background: theme.colors.sand, opacity: fade * (p > 0.02 ? 1 : 0),
      transform: `rotate(${(360 / 12) * i}deg) translateY(${110 + 60 * p}px)`, transformOrigin: "50% 0%" }} />;
  });

  const band = Array.from({ length: 7 }, (_, i) => {
    const p = spring({ frame: f - 20 - i * 3, fps, config: theme.spring.smooth });
    return <div key={i} style={{ position: "absolute", left: 92 + i * 132, top: 1250, width: 116, height: 116, borderRadius: 10,
      background: i % 2 ? theme.colors.primary : "rgba(239,220,169,0.12)", overflow: "hidden", opacity: p,
      transform: `translateY(${(1 - p) * 60}px) scale(${0.9 + 0.1 * p})` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 116, height: 116, borderBottomRightRadius: 116,
        background: i % 2 ? theme.colors.light : theme.colors.sand, opacity: 0.85, transform: `rotate(${i * 90}deg)` }} />
    </div>;
  });

  const tag = "motion com intenção".split(" ");
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(165deg, ${theme.colors.bgDark} 0%, ${theme.colors.primary} 55%, ${theme.colors.light} 100%)` }} />
      <AbsoluteFill style={{ opacity: 0.6 }}><BgMesh base="transparent" a={theme.colors.light} /></AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <path d="M1080 1920 L1080 1420 A500 500 0 0 0 580 1920 Z" fill="rgba(239,220,169,0.07)" />
        <path d="M1080 1380 A540 540 0 0 0 540 1920" fill="none" stroke={theme.colors.sand} strokeWidth={6} opacity={0.5}
          strokeDasharray={`${848 * arc} 900`} />
      </svg>
      <AbsoluteFill style={{ transform: `scale(${breathe})` }}>
        {letters}
        {rays}
        <svg width={PLUS} height={PLUS} viewBox="0 0 100 100" style={{ position: "absolute", left: plusX - PLUS / 2, top: plusY - PLUS / 2,
          transform: `scale(${ps}) rotate(${(1 - pr) * -180}deg)`, filter: `drop-shadow(0 0 28px ${theme.colors.glow}) drop-shadow(0 0 60px ${theme.colors.glow})` }}>
          <rect x="38" y="6" width="24" height="88" rx="8" fill={theme.colors.hero} />
          <rect x="6" y="38" width="88" height="24" rx="8" fill={theme.colors.hero} />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: Y + 150, display: "flex", justifyContent: "center", gap: 16,
          fontFamily: theme.fonts.body, fontWeight: 400, fontSize: 52, color: theme.colors.textDim }}>
          {tag.map((w, i) => {
            const p = spring({ frame: f - 24 - i * 3, fps, config: theme.spring.snappy });
            return <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}>{w}</span>;
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: Y + 236, textAlign: "center", fontFamily: theme.fonts.mono, fontWeight: 700,
          fontSize: 26, letterSpacing: "0.3em", color: theme.colors.sand,
          opacity: interpolate(f, [34, 42], [0, 1], { ...clamp, easing: theme.ease.out }),
          transform: `translateY(${interpolate(f, [34, 42], [16, 0], { ...clamp, easing: theme.ease.out })}px)` }}>PROFMAIS.ONLINE</div>
      </AbsoluteFill>
      {band}
      <AbsoluteFill style={{ background: theme.colors.text, opacity: whiteOut }} />
    </AbsoluteFill>
  );
};
