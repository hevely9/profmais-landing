import { Easing } from "remotion";
import TL from "./timeline.json";

export const theme = {
  colors: {
    bg: "#0A2A22", bgDark: "#08352A", primary: "#0E4B3C", light: "#2E7A63",
    hero: "#E36B1F", sand: "#EFDCA9", text: "#F6F1E3", textDim: "rgba(246,241,227,0.6)",
    line: "#F6F1E3", glow: "rgba(227,107,31,0.5)", cyan: "rgba(90,220,255,0.7)", red: "rgba(255,70,70,0.7)",
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
  },
} as const;

export { TL };
export const W = 1080, H = 1920;
export const SAFE = { x0: 108, x1: 972, y0: 288, y1: 1632 }; // 10% laterais, 15% topo/base
export const BEAT = TL.beat;
export const C = TL.cortes as number[];
export const END = TL.encerramento as number;
export const TOTAL = TL.total as number;
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const HITS: [number, number][] = [];

// início (quadro, já adiantado 2q) da 1ª palavra da frase que começa com `w`
export const Wq = (frase: number, w: string) =>
  (TL.palavras as { frase: number; mostra: string; q: number }[]).find((p) => p.frase === frase && p.mostra.replace(/[.,:]/g, "").startsWith(w))!.q;

export const rand = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
