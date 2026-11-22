import React from "react";
import { Composition } from "remotion";
import { FPS } from "./kit";
import { CapaBusca, CapaCoringa, CapaSerie } from "./capaSerie";
import { Parte1, Parte2, Parte3, ctx1, ctx2, ctx3 } from "./v/riggs";
import { Natalee, ctxN } from "./v/natalee";
import { Suzane, ctxS } from "./v/suzane";
import { Karen, ctxK } from "./v/karen";

const comp = (id: string, c: React.FC, total: number) => <Composition id={id} component={c} durationInFrames={total} fps={FPS} width={1080} height={1920} />;
const capaC = (id: string, props: React.ComponentProps<typeof CapaCoringa>) => <Composition id={id} component={CapaCoringa as React.FC<any>} defaultProps={props} durationInFrames={1} fps={FPS} width={1080} height={1920} />;
const capaB = (id: string, props: React.ComponentProps<typeof CapaBusca>) => <Composition id={id} component={CapaBusca as React.FC<any>} defaultProps={props} durationInFrames={1} fps={FPS} width={1080} height={1920} />;
const capa = (id: string, props: React.ComponentProps<typeof CapaSerie>) => <Composition id={id} component={CapaSerie as React.FC<any>} defaultProps={props} durationInFrames={1} fps={FPS} width={1080} height={1920} />;
export const Root: React.FC = () => (
  <>
    {comp("015-P1", Parte1, ctx1.TOTAL)}
    {comp("015-P2", Parte2, ctx2.TOTAL)}
    {comp("015-P3", Parte3, ctx3.TOTAL)}
    {comp("016-Natalee", Natalee, ctxN.TOTAL)}
    {comp("018-Suzane", Suzane, ctxS.TOTAL)}
    {comp("018-Karen", Karen, ctxK.TOTAL)}
    {capaB("Capa-018-Karen-A", { caso: "Nº 018", topo: "k-netflix-karen", posTopo: "50% 40%", img: "k-john-farda", pos: "50% 10%", selo: ["A SÉRIE DA", "NETFLIX"], linhas: [{ t: "KAREN READ", size: 128 }, { t: "CULPADA OU", size: 96 }, { t: "ARMAÇÃO?", destaque: true, size: 104 }] })}
    {capaB("Capa-018-Karen-B", { caso: "Nº 018", topo: "k-john-farda", posTopo: "50% 6%", img: "k-netflix-karen", pos: "50% 40%", selo: ["NOVA SÉRIE", "NETFLIX"], linhas: [{ t: "A HISTÓRIA REAL", size: 96 }, { t: "KAREN READ", destaque: true, size: 120 }] })}
    {capaC("Capa-018-Karen", { caso: "Nº 018", tag: null, seloTop: 1590, coringa: "k-casal", posTopo: "50% 0%", img: "k-karen-tribunal", pos: "40% 35%", linhas: [{ t: "MATOU" }, { t: "OU FOI" }, { t: "ARMAÇÃO?", destaque: true }] })}
    {capaC("Capa-018", { caso: "Nº 018", tag: null, seloTop: 1590, coringa: "s-casal", posTopo: "40% 25%", img: "s-netflix-suzane", pos: "50% 25%", linhas: [{ t: "O QUE A" }, { t: "NETFLIX", destaque: true }, { t: "NÃO MOSTROU" }] })}
    {capaC("Capa-016", { caso: "Nº 016", tag: null, seloTop: 1590, coringa: "n-natalee-yb", posTopo: "50% 20%", img: "n-joran-2023", pos: "50% 25%", linhas: [{ t: "ELE COBROU" }, { t: "US$ 25 MIL", destaque: true }, { t: "PELO CORPO" }] })}
    {capa("Capa-015-P1", { parte: "PARTE 1", img: "r-chantay-ng", pos: "50% 25%", linhas: [{ t: "O ASSASSINO" }, { t: "FOI AO VELÓRIO", destaque: true }], sub: "Chantay · Texas, 2016" })}
    {capa("Capa-015-P2", { parte: "PARTE 2", img: "r-snap-hunt", pos: "35% 35%", linhas: [{ t: "O DNA" }, { t: "DESENHOU", destaque: true }, { t: "O ROSTO" }], sub: "e alguém reconheceu" })}
    {capa("Capa-015-P3", { parte: "PARTE 3", img: "r-ryan-church", pos: "50% 18%", linhas: [{ t: "CONFESSOU" }, { t: "NA IGREJA", destaque: true }], sub: "na frente de todo mundo" })}
    {capaC("CapaC-015-P1", { parte: "PARTE 1", coringa: "cor-p1", img: "r-chantay-ng", pos: "50% 20%", linhas: [{ t: "O ASSASSINO" }, { t: "FOI AO VELÓRIO", destaque: true }] })}
    {capaC("CapaC-015-P2", { caso: "Nº 017", parte: "PARTE 2", coringa: "cor-p2", img: "r-snap-hunt", pos: "35% 25%", linhas: [{ t: "O DNA" }, { t: "DESENHOU", destaque: true }, { t: "O ROSTO" }] })}
    {capaC("CapaC-015-P3", { parte: "PARTE 3", coringa: "cor-p3", img: "r-ryan-church", pos: "50% 12%", linhas: [{ t: "CONFESSOU" }, { t: "NA IGREJA", destaque: true }] })}
  </>
);
