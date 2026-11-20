import { Easing } from "remotion";

// One source of truth: colors, easings, springs, fonts and the beat-locked timeline.
export const theme = {
  colors: {
    bg: "#0A2A22",
    bgDark: "#061F19",
    primary: "#0E4B3C",
    light: "#2E7A63",
    hero: "#E36B1F",
    sand: "#EFDCA9",
    text: "#F6F1E3",
    textDim: "rgba(246,241,227,0.62)",
    glow: "rgba(227,107,31,0.55)",
    cyan: "rgba(90,220,255,0.75)",
    red: "rgba(255,70,70,0.75)",
  },
  fonts: { display: "Montserrat", body: "Lato", mono: "JetBrains Mono" },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    fall: Easing.bezier(0.55, 0, 1, 0.45),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    jelly: { damping: 7, stiffness: 220, mass: 0.5 },
  },
} as const;

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const BEAT = 15; // 120 BPM at 30 fps
export const TOTAL = 450; // 15 s

// Scene boundaries (global frames). Overlaps are intentional: transitions live inside them.
export const T = {
  drop: { from: 0, dur: 46 },
  type: { from: 38, dur: 100 },
  grid: { from: 130, dur: 84 },
  goo: { from: 200, dur: 72 },
  data: { from: 268, dur: 64 },
  tunnel: { from: 322, dur: 70 },
  logo: { from: 388, dur: 62 },
};

// Camera-shake impacts (global frames) and their strength in px.
export const HITS: [number, number][] = [
  [15, 22],
  [50, 14],
  [256, 18],
  [390, 34],
  [404, 18],
];

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Deterministic pseudo-random (no Math.random in render code).
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
