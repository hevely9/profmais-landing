import React from "react";
import { Composition } from "remotion";
import { FPS } from "./kit";
import { Capa } from "./capas";
import { DISPONIVEIS } from "./disponiveis";
import { Vips, ctx as cV } from "./v/vips";
import { Telexfree, ctx as cT } from "./v/telexfree";
import { Lobo, ctx as cL } from "./v/lobo";
import { Chefao, ctx as cC } from "./v/chefao";

const tem = (s: string) => DISPONIVEIS.includes(s);
const capa = (id: string, props: React.ComponentProps<typeof Capa>) => <Composition id={id} component={Capa as React.FC<any>} defaultProps={props} durationInFrames={1} fps={FPS} width={1080} height={1920} />;
const comp = (id: string, c: React.FC, total: number) => <Composition id={id} component={c} durationInFrames={total} fps={FPS} width={1080} height={1920} />;
export const Root: React.FC = () => (
  <>
    {capa("Capa-012", { caso: "Nº 012", ...(tem("v-gol") ? { img: "v-gol" } : { clip: "c27989", de: 60 }), pos: "50% 50%", linhas: [{ t: "FINGIU SER" }, { t: "HERDEIRO" }, { t: "DA GOL", destaque: true }], sub: "e deu entrevista na TV" })}
    {capa("Capa-013", { caso: "Nº 013", ...(tem("t-tjac") ? { img: "t-tjac" } : { clip: "c47687", de: 60 }), pos: "50% 50%", linhas: [{ t: "UMA JUÍZA" }, { t: "DO ACRE", destaque: true }, { t: "PAROU ISSO" }], sub: "1 milhão de brasileiros na Telexfree" })}
    {capa("Capa-014", { caso: "Nº 014", ...(tem("l-belfort") ? { img: "l-belfort" } : { clip: "c47016", de: 60 }), pos: "62% 30%", linhas: [{ t: "O LOBO" }, { t: "EXISTE", destaque: true }], sub: "e as vítimas ainda esperam", tam: 160 })}
    {capa("Capa-015", { caso: "Nº 015", ...(tem("p-script") ? { img: "p-script" } : { clip: "c28422", de: 60 }), pos: "50% 50%", linhas: [{ t: "A MÁFIA" }, { t: "AJUDOU" }, { t: "NO FILME", destaque: true }], sub: "O Poderoso Chefão" })}
    {comp("012-VIPs", Vips, cV.TOTAL)}
    {comp("013-Telexfree", Telexfree, cT.TOTAL)}
    {comp("014-Lobo", Lobo, cL.TOTAL)}
    {comp("015-Chefao", Chefao, cC.TOTAL)}
  </>
);
