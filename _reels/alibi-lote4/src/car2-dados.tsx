import React from "react";
import { Composition } from "remotion";
import { CapaOnde, Folha, FolhaProps, VersaoFatoPost } from "./carrossel2";
import { C, FPS } from "./kit";

// Conteúdo dos carrosséis (fatos conferidos em 25–26/11/2026; fontes no POSTAGEM-Carrosseis-2.md)
const VERDE = "#2E7D4F", AMAR = "#B7791F";
const CR_SUZ = "Reprodução · imprensa / TV (2002–2006)";
const CR_ELOA = "Reprodução · arquivo da família / imprensa (2008)";

const ALIBI: FolhaProps[] = [
  { serie: "O ÁLIBI QUE CAIU · EP. 01", n: 1, total: 7, img: "c2-suz-daniel", pos: "50% 30%", imgH: 540, credito: CR_SUZ, capa: true,
    titulo: [{ t: "O ÁLIBI DE" }, { t: "SUZANE", destaque: true }], tSize: 84, texto: "Ela e o namorado tinham uma prova de onde estavam naquela noite. Até a polícia olhar de perto.", xSize: 38 },
  { serie: "O ÁLIBI QUE CAIU · EP. 01", n: 2, total: 7, img: "c2-familia", pos: "50% 40%", imgH: 520, credito: CR_SUZ,
    chip: "MADRUGADA DE 31/10/2002", titulo: [{ t: "Manfred e Marísia" }, { t: "von Richthofen são" }, { t: "mortos em casa", destaque: true }], tSize: 60,
    texto: "Zona sul de São Paulo. A filha do casal, Suzane, tinha 18 anos." },
  { serie: "O ÁLIBI QUE CAIU · EP. 01", n: 3, total: 7, img: "c2-casal", pos: "50% 35%", imgH: 520, credito: CR_SUZ,
    chip: "O ÁLIBI", titulo: [{ t: "“A gente estava" }, { t: "num motel.”", destaque: true }], tSize: 72,
    texto: "Suzane e o namorado, Daniel Cravinhos, foram a um motel depois do crime. E pediram nota fiscal.", xSize: 38 },
  { serie: "O ÁLIBI QUE CAIU · EP. 01", n: 4, total: 7, img: "c2-reconst", pos: "50% 45%", imgH: 520, credito: "Reprodução · vídeo da reconstituição (Polícia Civil, 2002)",
    chip: "A VERSÃO", titulo: [{ t: "De volta pra casa:" }, { t: "“foi um assalto”", destaque: true }], tSize: 66,
    texto: "A casa estava revirada. A polícia foi chamada e ouviu a mesma história de todos." },
  { serie: "O ÁLIBI QUE CAIU · EP. 01", n: 5, total: 7, img: "c2-casa", pos: "50% 50%", imgH: 520, credito: "Reprodução · TV (casa da família, 2002)", carimbo: "CONTRADIÇÃO",
    titulo: [{ t: "Nada foi" }, { t: "arrombado", destaque: true }], tSize: 76,
    texto: "Só o quarto do casal estava revirado. Pra polícia, quem entrou conhecia a casa." },
  { serie: "O ÁLIBI QUE CAIU · EP. 01", n: 6, total: 7, img: "c2-daniel", pos: "50% 30%", imgH: 520, credito: CR_SUZ, carimbo: "CONTRADIÇÃO",
    titulo: [{ t: "Quem pede nota" }, { t: "de motel?", destaque: true }], tSize: 72,
    texto: "A nota chamou mais atenção do que protegeu. E logo depois do enterro, o irmão de Daniel, Cristian, comprou uma moto pagando em dólares." , xSize: 38 },
  { serie: "O ÁLIBI QUE CAIU · EP. 01", n: 7, total: 7, img: "c2-suz-grade", pos: "50% 35%", imgH: 470, credito: CR_SUZ,
    titulo: [{ t: "O ÁLIBI CAIU", destaque: true }], tSize: 76,
    texto: "Cerca de uma semana depois, Cristian confessou. Depois, Daniel e Suzane.\nEm 2006: Suzane e Daniel, 39 anos e 6 meses. Cristian, 38 anos e 6 meses.", xSize: 34,
    final: { pergunta: "Quer o próximo álibi?", palavra: "ÁLIBI", resto: "que eu trago o episódio 2." } },
];

const HORA: FolhaProps[] = [
  { serie: "HORA A HORA · SANTO ANDRÉ, 2008", n: 1, total: 7, img: "c2-eloa", pos: "50% 30%", imgH: 600, credito: CR_ELOA, capa: true,
    titulo: [{ t: "100 HORAS", destaque: true }], tSize: 110, texto: "Eloá Pimentel, 15 anos. O sequestro que o Brasil inteiro acompanhou ao vivo." },
  { serie: "HORA A HORA · SANTO ANDRÉ, 2008", n: 2, total: 7, img: "c2-lindemberg", pos: "40% 35%", imgH: 520, credito: "Reprodução · imprensa (Lindemberg Alves no julgamento, 2012)",
    chip: "SEG · 13/10/2008", hora: "13h30", texto: "Lindemberg Alves, 22 anos, ex-namorado de Eloá, invade o apartamento dela. Ela fazia trabalho de escola com três colegas.", xSize: 36 },
  { serie: "HORA A HORA · SANTO ANDRÉ, 2008", n: 3, total: 7,
    dias: [["SEG", true], ["TER", false], ["QUA", false], ["QUI", false], ["SEX", false], ["SÁB", false]], chip: "SEG · 13/10/2008", hora: "21h", texto: "Os dois meninos são libertados.\nNo apartamento ficam Eloá e a amiga Nayara, também de 15 anos." },
  { serie: "HORA A HORA · SANTO ANDRÉ, 2008", n: 4, total: 7,
    dias: [["SEG", false], ["TER", true], ["QUA", false], ["QUI", false], ["SEX", false], ["SÁB", false]], chip: "TER · 14/10/2008", hora: "NOITE", texto: "Nayara é libertada.\nEloá fica sozinha com ele. A negociação é transmitida ao vivo pela TV." },
  { serie: "HORA A HORA · SANTO ANDRÉ, 2008", n: 5, total: 7,
    dias: [["SEG", false], ["TER", false], ["QUA", false], ["QUI", true], ["SEX", false], ["SÁB", false]], chip: "QUI · 16/10/2008", hora: "MANHÃ", texto: "Nayara volta ao apartamento, durante a negociação.\nA decisão seria duramente criticada depois." },
  { serie: "HORA A HORA · SANTO ANDRÉ, 2008", n: 6, total: 7,
    dias: [["SEG", false], ["TER", false], ["QUA", false], ["QUI", false], ["SEX", true], ["SÁB", false]], chip: "SEX · 17/10/2008", hora: "18h", texto: "Depois de cerca de 100 horas, a polícia explode a porta e entra.\nLindemberg atira. Eloá é baleada. Nayara, ferida no rosto, sobrevive." },
  { serie: "HORA A HORA · SANTO ANDRÉ, 2008", n: 7, total: 7, img: "c2-eloa", pos: "50% 30%", cinza: true, imgH: 400, credito: CR_ELOA,
    chip: "SÁB · 18/10/2008", titulo: [{ t: "Eloá morre" }, { t: "no hospital.", destaque: true }], tSize: 64,
    texto: "Tinha 15 anos. Em 2012, Lindemberg foi condenado a 98 anos; a pena depois caiu para 39.", xSize: 34,
    final: { pergunta: "Quer outro caso hora a hora?", palavra: "HORA", resto: "que eu trago o próximo." } },
];

const ONDE: FolhaProps[] = [
  { serie: "ONDE ESTÃO HOJE", n: 2, total: 7, img: "c2-suz-hoje", pos: "45% 30%", imgH: 520, credito: "Reprodução · TV (Suzane após deixar a prisão)",
    status: ["REGIME ABERTO", VERDE], titulo: [{ t: "SUZANE VON" }, { t: "RICHTHOFEN" }], tSize: 60,
    texto: "Condenada pela morte dos pais (2002).\nHoje: regime aberto desde janeiro de 2023. Casou com um médico, teve um filho em 2024 e mora em Bragança Paulista (SP).", xSize: 34 },
  { serie: "ONDE ESTÃO HOJE", n: 3, total: 7, img: "c2-daniel", pos: "50% 30%", imgH: 520, credito: "Reprodução · imprensa (Daniel Cravinhos, 2002)", legendaImg: "Daniel, em 2002",
    status: ["REGIME ABERTO", VERDE], titulo: [{ t: "IRMÃOS CRAVINHOS" }], tSize: 60,
    texto: "Daniel e Cristian, condenados pelo mesmo crime.\nHoje: os dois cumprem pena em regime aberto. Daniel trabalha com customização de motos e se casou em 2025.", xSize: 34 },
  { serie: "ONDE ESTÃO HOJE", n: 4, total: 7, img: ["c2-nardoni", "c2-jatoba"], pos: "50% 25%", imgH: 520, credito: "Reprodução · imprensa (2008)",
    status: ["REGIME ABERTO", VERDE], titulo: [{ t: "NARDONI E JATOBÁ" }], tSize: 58,
    texto: "Condenados pela morte de Isabella, 5 anos (2008).\nHoje: Anna Jatobá está no aberto desde 2023; Alexandre, desde 2024. Em setembro de 2026, o STJ manteve os dois no regime aberto.", xSize: 33 },
  { serie: "ONDE ESTÃO HOJE", n: 5, total: 7, img: "c2-elize", pos: "50% 30%", imgH: 520, credito: "Reprodução · imprensa (2012)",
    status: ["LIBERDADE CONDICIONAL", AMAR], titulo: [{ t: "ELIZE MATSUNAGA" }], tSize: 60,
    texto: "Condenada pela morte do marido, Marcos (2012).\nHoje: saiu da prisão em maio de 2022, em liberdade condicional, depois de cerca de 10 anos presa. Chegou a trabalhar como motorista de aplicativo.", xSize: 33 },
  { serie: "ONDE ESTÃO HOJE", n: 6, total: 7, img: "c2-bruno", pos: "50% 30%", imgH: 520, credito: "Reprodução · TV (Bruno no julgamento, 2013)",
    status: ["PRESO", C.lacre], titulo: [{ t: "GOLEIRO BRUNO" }], tSize: 60,
    texto: "Condenado pela morte de Eliza Samudio (2010).\nHoje: perdeu a liberdade condicional em março de 2026, ficou foragido e foi preso de novo em 7 de maio. Segue preso.", xSize: 33 },
  { serie: "ONDE ESTÃO HOJE", n: 7, total: 7, img: "c2-lindemberg", pos: "40% 30%", imgH: 400, credito: "Reprodução · imprensa (Lindemberg Alves, 2012)",
    status: ["PRESO", C.lacre], titulo: [{ t: "LINDEMBERG ALVES" }], tSize: 60,
    texto: "Condenado pela morte de Eloá Pimentel (2008).\nHoje: cumpre pena de 39 anos. Em setembro de 2026, ganhou 80 dias a menos por causa da nota no Enem.", xSize: 32,
    final: { pergunta: "Quem falta nessa lista?", palavra: "O NOME", resto: "que eu atualizo no próximo." } },
];

const folha = (id: string, p: FolhaProps) => <Composition key={id} id={id} component={Folha as React.FC<any>} defaultProps={p} durationInFrames={1} fps={FPS} width={1080} height={1920} />;

export const carrosseis2 = () => <>
  {ALIBI.map((p) => folha(`Car-Alibi1-${p.n}`, p))}
  {HORA.map((p) => folha(`Car-Hora-${p.n}`, p))}
  <Composition id="Car-Onde-1" component={CapaOnde as React.FC<any>} defaultProps={{ total: 7, imgs: [["c2-suz-hoje", "45% 30%"], ["c2-nardoni", "50% 20%"], ["c2-elize", "50% 30%"], ["c2-bruno", "50% 30%"]] }} durationInFrames={1} fps={FPS} width={1080} height={1920} />
  {ONDE.map((p) => folha(`Car-Onde-${p.n}`, p))}
  <Composition id="VxF-Nardoni" component={VersaoFatoPost as React.FC<any>} defaultProps={{ caso: "CASO ISABELLA · 2008", img: "c2-nardoni", pos: "50% 25%", credito: "Reprodução · imprensa (2008)",
    versao: "Uma terceira pessoa entrou no apartamento e jogou Isabella pela janela.",
    fatos: ["A perícia descartou a presença de outra pessoa", "A tela foi cortada meio metro acima do parapeito, alto demais pra Isabella", "Fiapos da tela foram achados na roupa de Alexandre", "O sangue dela foi limpo com fralda e toalha, dentro do apartamento"],
    desfecho: "2010: Alexandre, 31 anos · Anna Jatobá, 26 anos" }} durationInFrames={1} fps={FPS} width={1080} height={1920} />
  <Composition id="VxF-Elize" component={VersaoFatoPost as React.FC<any>} defaultProps={{ caso: "CASO MATSUNAGA · 2012", img: "c2-elize", pos: "50% 25%", credito: "Reprodução · imprensa (2012)",
    versao: "Marcos saiu de casa levando roupas e dinheiro.",
    fatos: ["A câmera do elevador mostra Elize saindo do prédio com malas", "Em 4 de junho de 2012, o corpo de Marcos foi identificado", "Dois dias depois, Elize confessou o crime"],
    desfecho: "Condenada em 2016 · pena final: 16 anos e 3 meses" }} durationInFrames={1} fps={FPS} width={1080} height={1920} />
  <Composition id="VxF-Suzane" component={VersaoFatoPost as React.FC<any>} defaultProps={{ caso: "CASO RICHTHOFEN · 2002", img: "c2-suz-grade", pos: "55% 30%", credito: "Reprodução · imprensa (2002–2006)",
    versao: "Foi um assalto. A gente estava num motel.",
    fatos: ["Nada foi arrombado; só o quarto do casal estava revirado", "Pediram nota fiscal no motel, e isso chamou atenção", "Cristian comprou uma moto pagando em dólares, logo depois do enterro", "Cerca de uma semana depois, os três confessaram"],
    desfecho: "2006: Suzane e Daniel, 39 anos e 6 meses" }} durationInFrames={1} fps={FPS} width={1080} height={1920} />
  <Composition id="VxF-Bruno" component={VersaoFatoPost as React.FC<any>} defaultProps={{ caso: "CASO ELIZA SAMUDIO · 2010", img: "c2-bruno", pos: "50% 30%", credito: "Reprodução · TV (julgamento, 2013)",
    versao: "Não tenho nada a ver com o sumiço da Eliza.",
    fatos: ["O primo de Bruno, Jorge, confessou ter levado Eliza ao sítio do goleiro", "Macarrão, amigo e braço-direito, ligou Bruno à morte dela", "O corpo nunca foi achado, mas o júri condenou com base nas provas"],
    desfecho: "2013: Bruno, 22 anos e 3 meses de prisão" }} durationInFrames={1} fps={FPS} width={1080} height={1920} />
</>;
