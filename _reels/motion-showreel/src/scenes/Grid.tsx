import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BgMesh } from "../components/fx";
import { clamp, rand, theme } from "../theme";
import { typeDot } from "./Type";

// 4.3–7.1 s · Iris through the hero period into a Truchet field built from the brand's
// quarter-circle module. Two rotation waves (on the beat) re-wire the whole maze; exit is a diagonal card flip.
const S = 180, COLS = 6, ROWS = 11, OY = (1920 - ROWS * S) / 2;
const W1 = 30, W2 = 58, EXIT = 68;

const Tile: React.FC<{ i: number; j: number; f: number; cx: number; cy: number }> = ({ i, j, f, cx, cy }) => {
  const { fps } = useVideoConfig();
  const x = i * S, y = OY + j * S;
  const tcx = x + S / 2, tcy = y + S / 2;
  const dIris = Math.hypot(tcx - cx, tcy - cy) / S;
  const dCenter = Math.hypot(tcx - 540, tcy - 960) / S;
  const pin = spring({ frame: f - dIris * 1.1, fps, config: theme.spring.snappy });
  const w1 = spring({ frame: f - W1 - dCenter * 1.1, fps, config: theme.spring.snappy });
  const w2 = spring({ frame: f - W2 - (i + j) * 0.9, fps, config: theme.spring.snappy });
  const base = Math.floor(rand(i * 13 + j * 7) * 4) * 90;
  const rot = base + 90 * w1 + 90 * w2 + interpolate(pin, [0, 1], [-90, 0]);
  const flip = interpolate(f, [EXIT + (i + j) * 0.5, EXIT + (i + j) * 0.5 + 7], [0, 1], { ...clamp, easing: theme.ease.in });
  const filled = rand(i * 3 + j * 11) > 0.62;
  const hero = i === 2 && j === 5;
  const pulse = hero ? 1 + 0.08 * Math.max(0, Math.sin((f / 15) * Math.PI * 2)) : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: S, height: S, opacity: pin * (1 - flip * 0.2),
      transform: `perspective(700px) rotateY(${flip * 90}deg) scale(${interpolate(pin, [0, 1], [0.3, 1]) * pulse})` }}>
      <svg width={S} height={S} viewBox="0 0 180 180" style={{ transform: `rotate(${rot}deg)`, overflow: "visible" }}>
        <rect x="1.5" y="1.5" width="177" height="177" rx="6" fill={hero ? theme.colors.primary : filled ? theme.colors.primary : theme.colors.bg}
          stroke="rgba(239,220,169,0.08)" strokeWidth="2" />
        {filled && !hero && <path d="M0 0 H120 A120 120 0 0 1 0 120 Z" fill={theme.colors.light} opacity="0.55" />}
        {hero && <path d="M0 0 H150 A150 150 0 0 1 0 150 Z" fill={theme.colors.hero} />}
        <path d="M90 0 A90 90 0 0 1 0 90 M180 90 A90 90 0 0 0 90 180" fill="none"
          stroke={hero ? theme.colors.text : theme.colors.sand} strokeWidth="16" strokeLinecap="butt" />
      </svg>
    </div>
  );
};

export const Grid: React.FC = () => {
  const f = useCurrentFrame();
  const dot = typeDot();
  const iris = interpolate(f, [0, 3, 14], [dot.r * 1.8, dot.r * 3.2, 2300], { ...clamp, easing: theme.ease.in });
  const ring = interpolate(f, [0, 5, 13], [16, 16, 0], { ...clamp, easing: theme.ease.inOut });
  const cam = interpolate(f, [0, 84], [1.2, 1.0], { ...clamp, easing: theme.ease.out });
  const tilt = interpolate(f, [0, 84], [-6, 0], { ...clamp, easing: theme.ease.out });
  const tiles = [];
  for (let i = 0; i < COLS; i++) for (let j = 0; j < ROWS; j++) tiles.push(<Tile key={`${i}-${j}`} i={i} j={j} f={f} cx={dot.x} cy={dot.y} />);
  return (
    <AbsoluteFill style={{ clipPath: `circle(${iris}px at ${dot.x}px ${dot.y}px)` }}>
      <AbsoluteFill style={{ opacity: interpolate(f, [EXIT, EXIT + 4], [1, 0], clamp) }}>
        <BgMesh base={theme.colors.bgDark} a={theme.colors.primary} />
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${cam}) rotate(${tilt}deg)` }}>{tiles}</AbsoluteFill>
      <div style={{ position: "absolute", left: dot.x - iris, top: dot.y - iris, width: iris * 2, height: iris * 2, borderRadius: "50%",
        border: `${ring}px solid ${theme.colors.hero}`, opacity: ring > 0.5 ? 1 : 0 }} />
    </AbsoluteFill>
  );
};
