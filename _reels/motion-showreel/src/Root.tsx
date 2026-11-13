import React from "react";
import { Composition } from "remotion";
import { Showreel } from "./Showreel";
import { FPS, H, TOTAL, W } from "./theme";

export const Root: React.FC = () => (
  <Composition id="Showreel" component={Showreel} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
