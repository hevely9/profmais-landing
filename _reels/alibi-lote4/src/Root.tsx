import React from "react";
import { Composition } from "remotion";
import { FPS } from "./kit";
import { CapaBusca, CapaCoringa, CapaSerie } from "./capaSerie";
import { Slide } from "./carrossel";
import { Parte1, Parte2, Parte3, ctx1, ctx2, ctx3 } from "./v/riggs";
import { Natalee, ctxN } from "./v/natalee";
import { Suzane, ctxS } from "./v/suzane";
import { Karen, ctxK } from "./v/karen";
import { Criciuma, ctxC } from "./v/criciuma";
import { Gardner, ctxG } from "./v/gardner";
import { McKellar, ctxM } from "./v/mckellar";
import { Megan, ctxMe } from "./v/megan";
import { CapaKuka, Kuka, ctxKu } from "./v/kuka";
import { CapaSob, SobInvestigacao, SOB_TOTAL } from "./v/sobinv";
import { CapaSob2, SobInvestigacao2, SOB2_TOTAL } from "./v/sobinv2";

const comp = (id: string, c: React.FC, total: number) => <Composition id={id} component={c} durationInFrames={total} fps={FPS} width={1080} height={1920} />;
const capaC = (id: string, props: React.ComponentProps<typeof CapaCoringa>) => <Composition id={id} component={CapaCoringa as React.FC<any>} defaultProps={props} durationInFrames={1} fps={FPS} width={1080} height={1920} />;
const capaB = (id: string, props: React.ComponentProps<typeof CapaBusca>) => <Composition id={id} component={CapaBusca as React.FC<any>} defaultProps={props} durationInFrames={1} fps={FPS} width={1080} height={1920} />;
const slide = (id: string, props: React.ComponentProps<typeof Slide>) => <Composition id={id} component={Slide as React.FC<any>} defaultProps={props} durationInFrames={1} fps={FPS} width={1080} height={1920} />;
const capa = (id: string, props: React.ComponentProps<typeof CapaSerie>) => <Composition id={id} component={CapaSerie as React.FC<any>} defaultProps={props} durationInFrames={1} fps={FPS} width={1080} height={1920} />;
export const Root: React.FC = () => (
  <>
    {comp("015-P1", Parte1, ctx1.TOTAL)}
    {comp("015-P2", Parte2, ctx2.TOTAL)}
    {comp("015-P3", Parte3, ctx3.TOTAL)}
    {comp("016-Natalee", Natalee, ctxN.TOTAL)}
    {comp("018-Suzane", Suzane, ctxS.TOTAL)}
    {comp("018-Karen", Karen, ctxK.TOTAL)}
    {comp("019-Criciuma", Criciuma, ctxC.TOTAL)}
    {comp("020-Gardner", Gardner, ctxG.TOTAL)}
    {comp("021-McKellar", McKellar, ctxM.TOTAL)}
    {comp("026-Megan", Megan, ctxMe.TOTAL)}
    {comp("027-Kukaracha", Kuka, ctxKu.TOTAL)}
    <Composition id="Capa-027-Kukaracha" component={CapaKuka} durationInFrames={1} fps={FPS} width={1080} height={1920} />
    {comp("Publi-SobInvestigacao", SobInvestigacao, SOB_TOTAL)}
    <Composition id="Capa-Publi-Sob" component={CapaSob} durationInFrames={1} fps={FPS} width={1080} height={1920} />
    {comp("Publi-Sob-2", SobInvestigacao2, SOB2_TOTAL)}
    <Composition id="Capa-Publi-Sob-2" component={CapaSob2} durationInFrames={1} fps={FPS} width={1080} height={1920} />
    {capaB("Capa-026", { caso: "Nº 026", topo: "mm-megan", posTopo: "50% 30%", img: "mm-josh", pos: "35% 50%", selo: ["EUA · 2006", "CASO REAL"], linhas: [{ t: "O NAMORADO", size: 116 }, { t: "DA INTERNET", size: 104 }, { t: "NUNCA EXISTIU", destaque: true, size: 96 }] })}
    {capaB("Capa-025", { caso: "Nº 025", topo: "mk-casal", posTopo: "50% 35%", img: "mk-gemeos", pos: "50% 30%", selo: ["ESCÓCIA", "CASO REAL"], linhas: [{ t: "O NAMORADO", size: 110 }, { t: "DO TINDER", size: 110 }, { t: "ERA UM ASSASSINO", destaque: true, size: 76 }] })}
    {slide("Car-Antuerpia-1", { img: "an-cofre", faixa: 330, tapa: [862, 100, 190, 80, "NETFLIX · 2025"], n: 1, total: 4, etiqueta: "ANTUÉRPIA · BÉLGICA · 2003", credito: "Reprodução · Netflix, “Stolen: Heist of the Century” (2025)", linhas: [{ t: "Ladrões esvaziaram o", size: 66 }, { t: "cofre mais protegido", size: 66 }, { t: "da capital mundial", size: 66 }, { t: "dos diamantes:", size: 66 }, { t: "US$ 100 MILHÕES", destaque: true, size: 84 }], sub: "em pedras, ouro e joias." })}
    {slide("Car-Antuerpia-2", { img: "an-entrada", faixa: 330, tapa: [862, 100, 190, 80, "NETFLIX · 2025"], n: 2, total: 4, etiqueta: "FEVEREIRO · 2003", credito: "Reprodução · Netflix, “Stolen: Heist of the Century” (2025)", linhas: [{ t: "Ninguém percebeu nada.", size: 64 }, { t: "Só descobriram na", size: 64 }, { t: "SEGUNDA-FEIRA", destaque: true, size: 80 }, { t: "quando abriram o cofre.", size: 64 }], sub: "Nada foi recuperado até hoje." })}
    {slide("Car-Antuerpia-3", { img: "an-lider", faixa: 330, tapa: [862, 100, 190, 80, "NETFLIX · 2025"], n: 3, total: 4, etiqueta: "O LÍDER", credito: "Reprodução · Netflix, “Stolen: Heist of the Century” (2025)", linhas: [{ t: "O líder era um", size: 70 }, { t: "italiano que fingia", size: 70 }, { t: "ser comerciante", size: 70 }, { t: "DE DIAMANTES", destaque: true, size: 78 }], sub: "Tinha sala no próprio prédio." })}
    {slide("Car-Antuerpia-4", { img: "an-fuga", faixa: 330, tapa: [862, 100, 190, 80, "NETFLIX · 2025"], n: 4, total: 4, etiqueta: "A FUGA", credito: "Reprodução · Netflix, “Stolen: Heist of the Century” (2025)", linhas: [{ t: "Era o roubo perfeito.", size: 64 }, { t: "Até que jogaram um", size: 64 }, { t: "SACO DE LIXO", destaque: true, size: 76 }, { t: "no meio do mato.", size: 64 }], final: { pergunta: "Quer saber o que tinha dentro?", palavra: "LIXO", resto: "que a história completa vai pro perfil." } })}
    {slide("Car-Grito-1", { img: "gr-grito", pos: "50% 30%", n: 1, total: 4, etiqueta: "OSLO · 1994", credito: "Reprodução · Munch, “O Grito” (1893), Galeria Nacional, Oslo · domínio público", linhas: [{ t: "Levaram o quadro", size: 84 }, { t: "mais famoso", size: 84 }, { t: "da Noruega em", size: 84 }, { t: "50 SEGUNDOS", destaque: true, size: 96 }] })}
    {slide("Car-Grito-2", { img: "gr-sala", pos: "50% 45%", n: 2, total: 4, etiqueta: "12/02/1994", credito: "Reprodução · “O Grito” na Galeria Nacional de Oslo", linhas: [{ t: "Era o dia da", size: 80 }, { t: "abertura das", size: 80 }, { t: "OLIMPÍADAS", destaque: true, size: 92 }], sub: "O país inteiro estava olhando pra TV." })}
    {slide("Car-Grito-3", { img: "gr-museu", pos: "50% 50%", n: 3, total: 4, etiqueta: "GALERIA NACIONAL", credito: "Reprodução · Galeria Nacional, Oslo", linhas: [{ t: "Dois homens", size: 82 }, { t: "encostaram uma", size: 82 }, { t: "ESCADA", destaque: true, size: 96 }, { t: "no museu.", size: 82 }], sub: "Quebraram a janela e arrancaram O Grito da parede." })}
    {slide("Car-Grito-4", { img: "gr-grito", pos: "52% 32%", zoom: 1.9, cinza: true, n: 4, total: 4, etiqueta: "O BILHETE", credito: "Reprodução · Munch, “O Grito” (1893), Galeria Nacional, Oslo · domínio público", linhas: [{ t: "No lugar,", size: 84 }, { t: "deixaram um", size: 84 }, { t: "BILHETE.", destaque: true, size: 100 }], final: { pergunta: "Quer saber o que estava escrito?", palavra: "BILHETE", resto: "que a história completa vai pro perfil." } })}
    {capaB("Capa-020-Gardner", { caso: "Nº 020", topo: "g-moldura3", posTopo: "50% 35%", img: "g-concert", pos: "50% 45%", selo: ["BOSTON · 1990", "CASO REAL"], linhas: [{ t: "US$ 500 MILHÕES", size: 104 }, { t: "EM 81", size: 120 }, { t: "MINUTOS", destaque: true, size: 124 }] })}
    {capaB("Capa-019-Criciuma", { caso: "Nº 019", topo: "cr-fuzil-carro", posTopo: "55% 25%", img: "cr-refens-capa", pos: "50% 30%", selo: ["CRICIÚMA (SC)", "IMAGENS REAIS"], linhas: [{ t: "30 HOMENS", size: 124 }, { t: "TOMARAM UMA", size: 100 }, { t: "CIDADE", destaque: true, size: 124 }] })}
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
