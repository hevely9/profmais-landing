import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Grade, Grain, Hud, Vignette, useShake } from "./components/fx";
import { T } from "./theme";
import { Drop } from "./scenes/Drop";
import { Type } from "./scenes/Type";
import { Grid } from "./scenes/Grid";
import { Goo } from "./scenes/Goo";
import { Data } from "./scenes/Data";
import { Tunnel } from "./scenes/Tunnel";
import { Logo } from "./scenes/Logo";

// Stack (bottom → top): scenes (each with its own mesh) → HUD → grade → grain → vignette.
const scenes: [keyof typeof T, React.FC, number][] = [
  ["drop", Drop, 3], ["type", Type, 2], ["grid", Grid, 4], ["goo", Goo, 3],
  ["data", Data, 5], ["tunnel", Tunnel, 6], ["logo", Logo, 7],
];

export const Showreel: React.FC = () => {
  const g = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#04140F" }}>
      <AbsoluteFill style={{ transform: `${useShake(g)} scale(1.04)` }}>
        {scenes.map(([k, C, z]) => (
          <Sequence key={k} from={T[k].from} durationInFrames={T[k].dur} style={{ zIndex: z }} name={k}>
            <C />
          </Sequence>
        ))}
      </AbsoluteFill>
      <Hud globalFrame={g} hideFrom={T.tunnel.from + 50} />
      <Grade />
      <Grain />
      <Vignette />
      <Audio src={staticFile("audio/score.wav")} />
    </AbsoluteFill>
  );
};
