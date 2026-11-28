import React from "react";
import { Composition, Still } from "remotion";
import { Capa } from "./Capa";
import { Reel } from "./Reel";
import { FPS, TOTAL } from "./timeline";

export const Root: React.FC = () => (<>
  <Composition id="Reel" component={Reel} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} defaultProps={{ legenda: true }} />
  <Still id="Capa" component={Capa} width={1080} height={1920} />
</>);
