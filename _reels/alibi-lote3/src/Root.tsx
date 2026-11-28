import React from "react";
import { Composition } from "remotion";
import { FPS } from "./kit";
import { CapaLusa } from "./capaLusa";
import { Lusa, ctx as cL } from "./v/lusa";

const comp = (id: string, c: React.FC, total: number) => <Composition id={id} component={c} durationInFrames={total} fps={FPS} width={1080} height={1920} />;
export const Root: React.FC = () => (
  <>
    <Composition id="Capa-013" component={CapaLusa} durationInFrames={1} fps={FPS} width={1080} height={1920} />
    {comp("013-Lusa", Lusa, cL.TOTAL)}
  </>
);
