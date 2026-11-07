import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, theme } from "../theme";

// Entrada (spring, 3 propriedades) e saída (mais rápida, ease-in) de qualquer bloco.
export const useInOut = (inQ: number, outQ?: number, cfg = theme.spring.smooth, dist = 50) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: f - inQ, fps, config: cfg });
  const e = outQ === undefined ? 0 : interpolate(f, [outQ, outQ + 8], [0, 1], { ...clamp, easing: theme.ease.in });
  return {
    p, e, f,
    style: { opacity: Math.min(1, p * 1.4) * (1 - e),
      transform: `translateY(${(1 - p) * dist - e * 36}px) scale(${0.94 + 0.06 * p - 0.05 * e})` } as React.CSSProperties,
  };
};

export const Block: React.FC<{ inQ: number; outQ?: number; style?: React.CSSProperties; children: React.ReactNode; cfg?: typeof theme.spring.smooth; dist?: number }> =
  ({ inQ, outQ, style, children, cfg, dist }) => {
    const { style: s } = useInOut(inQ, outQ, cfg, dist);
    return <div style={{ position: "absolute", ...style, ...s }}>{children}</div>;
  };

// Traço que se desenha (stroke-dashoffset), com easing.
export const draw = (f: number, q0: number, dur: number, len = 1000) => {
  const p = interpolate(f, [q0, q0 + dur], [0, 1], { ...clamp, easing: theme.ease.inOut });
  return { strokeDasharray: `${len}`, strokeDashoffset: `${len * (1 - p)}` };
};

// Ícone de check em traço (SVG), desenhado.
export const Check: React.FC<{ q: number; size?: number; color?: string }> = ({ q, size = 90, color = theme.colors.sand }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: f - q, fps, config: theme.spring.bouncy });
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `scale(${p})`, overflow: "visible" }}>
      <circle cx="50" cy="50" r="44" fill="#0A2A22" stroke={color} strokeWidth="8" />
      <path d="M30 52 L45 66 L72 36" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"
        style={draw(f, q + 3, 8, 70)} pathLength={70} />
    </svg>
  );
};

export const breathe = (f: number, amp = 6, per = 30) => `translateY(${Math.sin(f / per) * amp}px)`;
