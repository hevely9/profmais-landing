import React from "react";
import { Composition } from "remotion";
import { FPS } from "./kit";
import { Alcatraz, ctx as cAlc } from "./v/alcatraz";
import { Gardner, ctx as cGar } from "./v/gardner";
import { Jules, ctx as cJul } from "./v/jules";
import { Fortaleza1, Fortaleza2, ctx1 as cF1, ctx2 as cF2 } from "./v/fortaleza";

const comp = (id: string, c: React.FC, total: number) => <Composition id={id} component={c} durationInFrames={total} fps={FPS} width={1080} height={1920} />;
export const Root: React.FC = () => (
  <>
    {comp("Fortaleza1", Fortaleza1, cF1.TOTAL)}
    {comp("Fortaleza2", Fortaleza2, cF2.TOTAL)}
    {comp("Alcatraz", Alcatraz, cAlc.TOTAL)}
    {comp("Jules", Jules, cJul.TOTAL)}
    {comp("Gardner", Gardner, cGar.TOTAL)}
  </>
);
