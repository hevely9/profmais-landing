import React from "react";
import { Composition } from "remotion";
import { FPS } from "./kit";
import { Roblox, ctx } from "./Roblox";
import { Capa } from "./capas";

export const Root: React.FC = () => (
  <>
  <Composition id="Capa" component={Capa as React.FC<any>} defaultProps={{ caso: "ROBLOX", selo: "DICAS DE ROBLOX", img: "u-noob-ceu", pos: "50% 35%", cor: true, linhas: [{ t: "NUNCA FAÇA" }, { t: "ISSO NO" }, { t: "ROBLOX", destaque: true }], sub: "o nº 1 é o mais importante" }} durationInFrames={1} fps={FPS} width={1080} height={1920} />
  <Composition id="Roblox" component={Roblox} durationInFrames={ctx.TOTAL} fps={FPS} width={1080} height={1920} />
  </>
);
