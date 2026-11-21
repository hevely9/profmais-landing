import React from "react";
import { Composition } from "remotion";
import { FPS } from "./kit";
import { CapaCoringa, CapaSerie } from "./capaSerie";
import { Parte1, Parte2, Parte3, ctx1, ctx2, ctx3 } from "./v/riggs";

const comp = (id: string, c: React.FC, total: number) => <Composition id={id} component={c} durationInFrames={total} fps={FPS} width={1080} height={1920} />;
const capaC = (id: string, props: React.ComponentProps<typeof CapaCoringa>) => <Composition id={id} component={CapaCoringa as React.FC<any>} defaultProps={props} durationInFrames={1} fps={FPS} width={1080} height={1920} />;
const capa = (id: string, props: React.ComponentProps<typeof CapaSerie>) => <Composition id={id} component={CapaSerie as React.FC<any>} defaultProps={props} durationInFrames={1} fps={FPS} width={1080} height={1920} />;
export const Root: React.FC = () => (
  <>
    {comp("015-P1", Parte1, ctx1.TOTAL)}
    {comp("015-P2", Parte2, ctx2.TOTAL)}
    {comp("015-P3", Parte3, ctx3.TOTAL)}
    {capa("Capa-015-P1", { parte: "PARTE 1", img: "r-chantay-ng", pos: "50% 25%", linhas: [{ t: "O ASSASSINO" }, { t: "FOI AO VELÓRIO", destaque: true }], sub: "Chantay · Texas, 2016" })}
    {capa("Capa-015-P2", { parte: "PARTE 2", img: "r-snap-hunt", pos: "35% 35%", linhas: [{ t: "O DNA" }, { t: "DESENHOU", destaque: true }, { t: "O ROSTO" }], sub: "e alguém reconheceu" })}
    {capa("Capa-015-P3", { parte: "PARTE 3", img: "r-ryan-church", pos: "50% 18%", linhas: [{ t: "CONFESSOU" }, { t: "NA IGREJA", destaque: true }], sub: "na frente de todo mundo" })}
    {capaC("CapaC-015-P1", { parte: "PARTE 1", coringa: "cor-p1", img: "r-chantay-ng", pos: "50% 20%", linhas: [{ t: "O ASSASSINO" }, { t: "FOI AO VELÓRIO", destaque: true }] })}
    {capaC("CapaC-015-P2", { parte: "PARTE 2", coringa: "cor-p2", img: "r-snap-hunt", pos: "35% 25%", linhas: [{ t: "O DNA" }, { t: "DESENHOU", destaque: true }, { t: "O ROSTO" }] })}
    {capaC("CapaC-015-P3", { parte: "PARTE 3", coringa: "cor-p3", img: "r-ryan-church", pos: "50% 12%", linhas: [{ t: "CONFESSOU" }, { t: "NA IGREJA", destaque: true }] })}
  </>
);
