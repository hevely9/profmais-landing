import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { measureText } from "@remotion/layout-utils";
import { BgMesh, chroma, impactAt } from "../components/fx";
import { T, clamp, rand, theme } from "../theme";

// 1.3–4.6 s · Kinetic type, one technique per word, each on the beat:
// CADA (gravity drop) · QUADRO (slot machine) · IMPORTA. (mask rise + outline-to-fill wipe)
const ROW = { cada: 700, quadro: 935, importa: 1165 };
const SIZE = { cada: 250, quadro: 205, importa: 172 };
const LS = "-0.03em";
const display: React.CSSProperties = { fontFamily: theme.fonts.display, fontWeight: 900, letterSpacing: LS, lineHeight: 1 };

// Where the hero period sits (shared with the iris transition in Grid).
export const typeDot = () => {
  const w = measureText({ text: "IMPORTA", fontFamily: theme.fonts.display, fontWeight: "900", fontSize: SIZE.importa, letterSpacing: LS }).width;
  const r = 19, gap = 8;
  const total = w + gap + 2 * r;
  return { x: 540 - total / 2 + w + gap + r, y: ROW.importa + SIZE.importa * 0.33 - r, r, textW: w, total };
};

const START = { cada: 7, quadro: 37, importa: 67, exit: 87 };

const Cada: React.FC<{ f: number; g: number }> = ({ f, g }) => {
  const { fps } = useVideoConfig();
  const ex = interpolate(f, [START.exit, START.exit + 10], [0, 1], { ...clamp, easing: theme.ease.in });
  return (
    <div style={{ position: "absolute", top: ROW.cada - SIZE.cada / 2, left: 0, right: 0, display: "flex", justifyContent: "center",
      ...display, fontSize: SIZE.cada, color: theme.colors.sand, textShadow: chroma(impactAt(g, 50, 3)) }}>
      {"CADA".split("").map((ch, i) => {
        const p = spring({ frame: f - START.cada - i * 3, fps, config: theme.spring.bouncy });
        const r0 = (rand(i + 1) - 0.5) * 50;
        const ang = -Math.PI / 2 + (rand(i + 9) - 0.5) * 1.6;
        return (
          <span key={i} style={{ display: "inline-block", opacity: Math.min(1, p * 3) * (1 - ex),
            transform: `translate(${Math.cos(ang) * 700 * ex}px, ${-900 * (1 - p) + Math.sin(ang) * 700 * ex}px) rotate(${r0 * (1 - p) + ex * r0 * 3}deg) scale(${1 - 0.2 * ex})`,
            filter: `blur(${ex * 10}px)` }}>{ch}</span>
        );
      })}
    </div>
  );
};

const Quadro: React.FC<{ f: number }> = ({ f }) => {
  const word = "QUADRO", pool = "ABCDEFGHIJKLMNOPRSTUVZ";
  const lineH = SIZE.quadro * 1.02, steps = 9;
  return (
    <div style={{ position: "absolute", top: ROW.quadro - lineH / 2, left: 0, right: 0, display: "flex", justifyContent: "center",
      ...display, fontSize: SIZE.quadro, color: theme.colors.text, perspective: 900 }}>
      {word.split("").map((ch, i) => {
        const s = START.quadro + i * 3;
        const prog = (x: number) => interpolate(x, [s, s + 16], [0, 1], { ...clamp, easing: theme.ease.out });
        const p = prog(f), vel = Math.abs(prog(f + 1) - prog(f)) * steps * lineH;
        const strip = Array.from({ length: steps }, (_, k) => pool[Math.floor(rand(i * 31 + k) * pool.length)]).concat(ch);
        const ex = interpolate(f, [START.exit + i * 1.2, START.exit + i * 1.2 + 8], [0, 1], { ...clamp, easing: theme.ease.in });
        return (
          <span key={i} style={{ display: "inline-block", height: lineH, overflow: "hidden", opacity: interpolate(f, [s - 1, s + 2], [0, 1], clamp) * (1 - ex),
            transform: `rotateX(${ex * 95}deg) translateY(${ex * -60}px)`, transformOrigin: "50% 0%" }}>
            <span style={{ display: "flex", flexDirection: "column", transform: `translateY(${-p * steps * lineH}px)`,
              filter: `blur(${Math.min(12, vel * 0.05)}px)` }}>
              {strip.map((c, k) => <span key={k} style={{ height: lineH, display: "block", textAlign: "center" }}>{c}</span>)}
            </span>
          </span>
        );
      })}
    </div>
  );
};

const Importa: React.FC<{ f: number }> = ({ f }) => {
  const { fps } = useVideoConfig();
  const dot = typeDot();
  const rise = interpolate(f, [START.importa, START.importa + 10], [1, 0], { ...clamp, easing: theme.ease.out });
  const wipe = interpolate(f, [START.importa + 3, START.importa + 13], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const dp = spring({ frame: f - (START.importa + 10), fps, config: theme.spring.bouncy });
  // the period inhales just before the iris opens through it
  const inhale = interpolate(f, [START.exit + 1, START.exit + 6], [1, 1.8], { ...clamp, easing: theme.ease.inOut });
  const ex = interpolate(f, [START.exit, START.exit + 9], [0, 1], { ...clamp, easing: theme.ease.in });
  const left = 540 - dot.total / 2;
  const text = (style: React.CSSProperties) => (
    <div style={{ position: "absolute", left, top: ROW.importa - SIZE.importa / 2, ...display, fontSize: SIZE.importa,
      whiteSpace: "nowrap", transform: `translateY(${rise * SIZE.importa * 1.1}px)`, ...style }}>IMPORTA</div>
  );
  const slice = (top: boolean) => (
    <div style={{ position: "absolute", inset: 0, clipPath: top ? `inset(0 0 ${1920 - ROW.importa - 8}px 0)` : `inset(${ROW.importa + 8}px 0 0 0)`,
      transform: `translateX(${(top ? -1 : 1) * 1200 * ex}px)`, filter: `blur(${ex * 8}px)` }}>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(${ROW.importa - SIZE.importa * 0.62}px 0 ${1920 - ROW.importa - SIZE.importa * 0.62}px 0)` }}>
        {text({ color: "transparent", WebkitTextStroke: `3px ${theme.colors.text}` })}
        {text({ color: theme.colors.text, clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)` })}
      </div>
    </div>
  );
  return (
    <>
      {slice(true)}
      {slice(false)}
      <div style={{ position: "absolute", left: dot.x - dot.r, top: dot.y - dot.r, width: dot.r * 2, height: dot.r * 2, borderRadius: "50%",
        background: theme.colors.hero, transform: `scale(${dp * inhale})`, boxShadow: `0 0 40px ${theme.colors.glow}, 0 0 90px ${theme.colors.glow}` }} />
    </>
  );
};

export const Type: React.FC = () => {
  const f = useCurrentFrame();
  const g = f + T.type.from;
  const drift = interpolate(f, [0, 100], [1.06, 1], { ...clamp, easing: theme.ease.out });
  const breathe = 1 + Math.sin(f / 22) * 0.008;
  return (
    <AbsoluteFill>
      <BgMesh base={theme.colors.bg} />
      <AbsoluteFill style={{ transform: `scale(${drift * breathe})` }}>
        <Cada f={f} g={g} />
        <Quadro f={f} />
        <Importa f={f} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
