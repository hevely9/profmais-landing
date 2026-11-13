import React from "react";
import { Composition } from "remotion";
import { Capa, Reel } from "./Reel";
import { H, TOTAL, TL, W } from "./theme";

export const Root: React.FC = () => (
  <>
    <Composition id="Reel" component={Reel} durationInFrames={TOTAL} fps={TL.fps} width={W} height={H} defaultProps={{ legenda: true, audio: true }} />
    <Composition id="Capa" component={Capa} durationInFrames={TOTAL} fps={TL.fps} width={W} height={H} />
  </>
);
