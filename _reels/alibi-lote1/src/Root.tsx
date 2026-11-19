import React from "react";
import { Composition } from "remotion";
import { FPS } from "./kit";
import { Capa } from "./capas";
import { Alcatraz, ctx as cAlc } from "./v/alcatraz";
import { Gardner, ctx as cGar } from "./v/gardner";
import { Jules, ctx as cJul } from "./v/jules";
import { Fortaleza1, Fortaleza2, ctx1 as cF1, ctx2 as cF2 } from "./v/fortaleza";


const capa = (id: string, props: React.ComponentProps<typeof Capa>) => <Composition id={id} component={Capa as React.FC<any>} defaultProps={props} durationInFrames={1} fps={FPS} width={1080} height={1920} />;
const CAPAS = <>
  {capa("Capa-007", { caso: "Nº 007", parte: "PARTE 1", img: "f-bc", pos: "50% 30%", linhas: [{ t: "CAVARAM" }, { t: "ATÉ O COFRE", destaque: true }], tam: 124, sub: "do Banco Central · R$ 164 milhões" })}
  {capa("Capa-008", { caso: "Nº 008", parte: "PARTE 2", clip: "c17228", de: 150, linhas: [{ t: "11 CARROS", destaque: true }, { t: "ENTREGARAM" }, { t: "TUDO" }], sub: "o erro do maior furto do Brasil" })}
  {capa("Capa-009", { caso: "Nº 009", img: "a-cabeca", pos: "50% 30%", linhas: [{ t: "ESSA CABEÇA" }, { t: "ENGANOU" }, { t: "ALCATRAZ", destaque: true }], sub: "e os 3 nunca mais foram vistos", tam: 128 })}
  {capa("Capa-010", { caso: "Nº 010", img: "j-replica", pos: "50% 35%", linhas: [{ t: "O BRASIL" }, { t: "PERDEU" }, { t: "A TAÇA", destaque: true }], sub: "e ela nunca mais apareceu" })}
  {capa("Capa-011", { caso: "Nº 011", img: "g-tempestade", pos: "50% 30%", linhas: [{ t: "US$ 500 MI", destaque: true }, { t: "E NINGUÉM" }, { t: "FOI PRESO" }], sub: "o maior roubo de arte da história" })}
</>;
const comp = (id: string, c: React.FC, total: number) => <Composition id={id} component={c} durationInFrames={total} fps={FPS} width={1080} height={1920} />;
export const Root: React.FC = () => (
  <>
    {CAPAS}
    {comp("Fortaleza1", Fortaleza1, cF1.TOTAL)}
    {comp("Fortaleza2", Fortaleza2, cF2.TOTAL)}
    {comp("Alcatraz", Alcatraz, cAlc.TOTAL)}
    {comp("Jules", Jules, cJul.TOTAL)}
    {comp("Gardner", Gardner, cGar.TOTAL)}
  </>
);
