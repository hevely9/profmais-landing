import React from "react";
import { Composition } from "remotion";
import { Folha, FolhaProps } from "./carrossel2";
import { FPS } from "./kit";

// CARROSSEL "ONDE ESTÁ HOJE": Andreas von Richthofen, o irmão de Suzane (fatos conferidos em 27/11/2026; fontes no POSTAGEM-Andreas.md).
// Tom: ele é VÍTIMA do caso. Respeito, nada de sensacionalismo sobre saúde ou drogas; só o que foi publicado, com data.
const S = "O IRMÃO DE SUZANE", T = 10;
const CR_TV02 = "Reprodução · TV (2002)";
const SLIDES: FolhaProps[] = [
  { serie: S, n: 1, total: T, img: ["an-teen-choro", "an-hoje-rosto"], pos: "50% 30%", imgH: 560, capa: true, legendaImg: "2002  ·  2026", credito: "Reprodução · TV (2002) e redes sociais (2026)",
    chip: "ANDREAS VON RICHTHOFEN", titulo: [{ t: "Ele tinha 15 anos" }, { t: "quando os pais", destaque: true }, { t: "foram mortos." }], tSize: 66,
    texto: "Arrasta e veja o que aconteceu com o irmão de Suzane até hoje.", xSize: 38 },
  { serie: S, n: 2, total: T, img: "an-teen-vermelha", pos: "50% 15%", imgH: 520, credito: "Reprodução · arquivo da família / TV",
    chip: "30 DE OUTUBRO DE 2002", titulo: [{ t: "Naquela noite, ele" }, { t: "foi deixado numa", destaque: true }, { t: "lan house." }], tSize: 62,
    texto: "Quem o levou foram a irmã, Suzane, e o namorado dela, Daniel. De madrugada, os pais foram mortos em casa.", xSize: 38 },
  { serie: S, n: 3, total: T, img: "an-enterro", pos: "50% 12%", imgH: 540, credito: CR_TV02, legendaImg: "No enterro dos pais",
    chip: "NOVEMBRO DE 2002", titulo: [{ t: "Órfão aos 15." }], tSize: 72,
    texto: "Dias depois, a própria irmã confessou o crime. O tio materno, Miguel Abdalla, passou a ser o tutor dele.", xSize: 38 },
  { serie: S, n: 4, total: T, img: "an-teen-cab", pos: "50% 30%", imgH: 540, credito: CR_TV02,
    chip: "JULGAMENTO · 2006", titulo: [{ t: "Depôs contra" }, { t: "a própria irmã.", destaque: true }], tSize: 66,
    texto: "No júri, chamou Suzane de manipuladora. Ela e Daniel pegaram 39 anos e 6 meses; Cristian, 38 anos e 6 meses.", xSize: 38 },
  { serie: S, n: 5, total: T, img: "an-teen-azul", pos: "50% 30%", imgH: 520, credito: "Reprodução · arquivo da família", legendaImg: "Andreas antes do crime",
    chip: "USP · 2015", titulo: [{ t: "Virou doutor" }, { t: "em química.", destaque: true }], tSize: 70,
    texto: "Defendeu o doutorado na USP em 2015. Na dedicatória da tese, lembra os pais. A irmã não é citada.", xSize: 38 },
  { serie: S, n: 6, total: T, img: "an-adulto", pos: "50% 25%", imgH: 540, credito: "Reprodução · imprensa", legendaImg: "Andreas já adulto",
    chip: "MAIO DE 2017", titulo: [{ t: "Encontrado" }, { t: "desorientado.", destaque: true }], tSize: 70,
    texto: "A PM o achou tentando pular o muro de uma casa na zona sul de SP, sob efeito de drogas. Foi internado. Reportagens ligaram o caso à Cracolândia.", xSize: 36 },
  { serie: S, n: 7, total: T, img: "an-sitio", pos: "50% 45%", imgH: 520, credito: "Reprodução · TV (2025)", legendaImg: "O sítio em São Roque (SP)",
    chip: "SÃO ROQUE (SP)", titulo: [{ t: "Herdeiro" }, { t: "e sozinho.", destaque: true }], tSize: 72,
    texto: "Herdou cerca de R$ 10 milhões e foi viver recluso num sítio. Em 2024, recusou ajuda de uma equipe de TV: “Não, obrigado, eu tenho dinheiro.”", xSize: 36 },
  { serie: S, n: 8, total: T, img: "an-irmaos", pos: "50% 8%", imgH: 520, credito: "Reprodução · arquivo da família", legendaImg: "Os irmãos, antes do crime",
    chip: "SETEMBRO DE 2025", titulo: [{ t: "A irmã" }, { t: "bateu à porta.", destaque: true }], tSize: 72,
    texto: "Segundo vizinhos, Suzane apareceu no sítio com o filho bebê. Ele mandou ela ir embora e ameaçou chamar a polícia.", xSize: 38 },
  { serie: S, n: 9, total: T, img: "an-laranja", pos: "50% 30%", imgH: 520, credito: CR_TV02, legendaImg: "Andreas em 2002",
    chip: "JANEIRO DE 2026", titulo: [{ t: "Mais uma perda." }], tSize: 72,
    texto: "O tio que foi seu tutor foi encontrado morto em casa; a polícia investiga como morte suspeita. E as dívidas cresceram: 27 processos municipais, mais de R$ 428 mil.", xSize: 36 },
  { serie: S, n: 10, total: T, img: "an-hoje-corpo", pos: "50% 30%", imgH: 480, credito: "Reprodução · redes sociais (13/11/2026)", legendaImg: "Andreas em vídeo de novembro de 2026",
    chip: "HOJE · 39 ANOS", titulo: [{ t: "Longe de tudo." }], tSize: 72,
    texto: "Vive sozinho em São Roque e recusou aparecer no documentário da Netflix sobre a irmã.", xSize: 36,
    final: { pergunta: "Você acha que ele deveria perdoar a irmã?", palavra: "SIM", resto: "ou NÃO aqui embaixo." } },
];
export const carrosselAndreas = () => SLIDES.map((p) => <Composition key={p.n} id={`Andreas-${p.n}`} component={Folha as React.FC<any>} defaultProps={p} durationInFrames={1} fps={FPS} width={1080} height={1920} />);
