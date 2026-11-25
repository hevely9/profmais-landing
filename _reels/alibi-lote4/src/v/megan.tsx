import React from "react";
import palavras from "../../public/palavras-megan.json";
import { C, Carimbo, Faixa, Foto, Fundo, Grande, Plano, Reel, Rotulo, Titulo, TituloVivo, mkCtx } from "../kit";
import { Fechamento } from "../dossie";

// ÁLIBI · CASO Nº 026 — Megan Meier (Missouri, 2006). Roteiro adaptado do aprovado pelo usuário, com fatos corrigidos
// (Wikipedia "Suicide of Megan Meier", US v. Drew, ABC News, Computerworld, PBS). Sem detalhe de método; CVV 188 no fim.
type Ws = { words: { text: string; start: number; end: number }[] };
export const ctxMe = mkCtx({
  caso: "Nº 026", audio: "megan", words: (palavras as Ws).words, lead: 0.1, fimVozRaw: 192.8, final: "alibi", proximo: "NO PERFIL", cta: ["", ""],
  chave: /^(megan|josh|internet|myspace|lori|sarah|tina|existiu|presa|feliz)/i,
  semLegenda: [[189.9, 280]],
  sfx: [
    { src: "coracao", r: 1.9, vol: 0.35 }, { src: "impacto", r: 10.6, vol: 0.4 }, { src: "whoosh", r: 16.9, vol: 0.25 }, { src: "whoosh", r: 39.3, vol: 0.25 },
    { src: "whoosh", r: 50.2, vol: 0.25 }, { src: "tique", r: 67.3, vol: 0.35 }, { src: "tique", r: 69.6, vol: 0.35 }, { src: "carimbo", r: 79.6, vol: 0.45 },
    { src: "coracao", r: 92.3, vol: 0.4 }, { src: "coracao", r: 103.7, vol: 0.4 }, { src: "subida", r: 120.2, vol: 0.3 }, { src: "impacto", r: 128.3, vol: 0.5 },
    { src: "carimbo", r: 133.0, vol: 0.45 }, { src: "carimbo", r: 158.7, vol: 0.45 }, { src: "carimbo", r: 175.5, vol: 0.5 }, { src: "carimbo", r: 190.8, vol: 0.5 },
  ],
});

const CR = "Reprodução · fotos da família Meier (imprensa)";
const CRL = "Reprodução · AP (Lori Drew, 2008)";
const CRJ = "Reprodução · perfil falso “Josh Evans” (MySpace, imprensa)";

export const Megan: React.FC = () => (
  <Reel ctx={ctxMe}>
    <Plano r={[-0.1, 8.2]} forte>
      <Foto src="mm-megan" r={[-0.1, 8.2]} credito={CR} top={560} w={1000} h={620} pos="50% 35%" zoom={[1.05, 1.15]} />
      <TituloVivo top={170} size={86} destaque="INTERNET" linhas={[[["ELA", 0.2], ["SE", 1.5], ["APAIXONOU", 1.9]], [["PELA", 3.7], ["INTERNET", 3.9]]]} />
      <Rotulo r={5.3} texto="ele era carinhoso · elogiava todo dia" top={1230} size={40} cor={C.fita} />
    </Plano>
    <Plano r={[8.2, 16.9]}>
      <Foto src="mm-josh" r={[8.2, 16.9]} credito={CRJ} top={500} w={1000} h={560} pos="40% 50%" zoom={[1.0, 1.1]} />
      <Faixa r={10.4} texto="ATÉ QUE ELE SE VIROU CONTRA ELA" top={300} size={50} />
      <Grande r={12.7} top={1130} size={52}>e o que a família descobriu<br />depois foi muito pior</Grande>
    </Plano>
    <Plano r={[16.9, 28.5]}>
      <Foto src="mm-megan2" r={[16.9, 28.5]} credito={CR} top={330} w={760} h={820} pos="50% 30%" zoom={[1.0, 1.08]} />
      <Rotulo r={17.0} texto="MISSOURI, EUA · 2006" top={200} size={44} cor={C.fita} />
      <Titulo r={20.4} top={1180} size={84}>MEGAN MEIER</Titulo>
      <Rotulo r={23.1} texto="13 anos · bullying · depressão" top={1290} size={36} />
    </Plano>
    <Plano r={[28.5, 39.3]}>
      <Foto src="mm-megan3" r={[28.5, 39.3]} credito={CR} top={330} w={760} h={780} pos="50% 30%" zoom={[1.0, 1.08]} />
      <Rotulo r={28.8} texto="MUDOU DE ESCOLA" top={200} size={46} cor={C.fita} />
      <Rotulo r={31.4} texto="e as coisas começaram a melhorar" top={1150} size={42} />
      <Faixa r={36.9} texto="A AMIZADE COM SARAH ESFRIOU" top={1230} size={48} />
    </Plano>
    <Plano r={[39.3, 50.2]}>
      <Foto src="mm-myspace2" r={[39.3, 50.2]} credito="Reprodução · NBC Today (MySpace, 2007)" top={520} w={1000} h={600} pos="50% 50%" zoom={[1.0, 1.1]} />
      <Rotulo r={39.4} texto="2006: TODO ADOLESCENTE QUERIA ESTAR NO" top={250} size={36} cor={C.fita} />
      <Titulo r={42.0} top={320} size={100}>MYSPACE</Titulo>
      <Rotulo r={46.6} texto="conta só com a senha dos pais · supervisionada" top={1180} size={34} />
    </Plano>
    <Plano r={[50.2, 60.5]}>
      <Foto src="mm-josh" r={[50.2, 60.5]} credito={CRJ} top={500} w={1000} h={560} pos="40% 50%" zoom={[1.05, 1.15]} />
      <Rotulo r={50.3} texto="FOI LÁ QUE APARECEU" top={240} size={44} cor={C.fita} />
      <Titulo r={51.7} top={310} size={90}>JOSH EVANS</Titulo>
      <Rotulo r={53.3} texto="16 anos · bonito · dizia que morava perto" top={1110} size={38} />
    </Plano>
    <Plano r={[60.5, 65.5]}>
      <Foto src="mm-tiara" r={[60.5, 65.5]} credito={CR} top={330} w={720} h={820} pos="50% 40%" zoom={[1.0, 1.08]} />
      <Faixa r={61.4} texto="PELA 1ª VEZ EM MUITO TEMPO, FELIZ" top={1200} size={44} />
    </Plano>
    <Plano r={[65.5, 76.5]}>
      <Foto src="mm-tina2" r={[65.5, 76.5]} credito="Reprodução · AP (Tina Meier)" top={560} w={760} h={700} pos="50% 30%" zoom={[1.0, 1.08]} />
      <Rotulo r={65.6} texto="TINA, A MÃE, DESCONFIAVA:" top={200} size={44} cor={C.fita} />
      <Rotulo r={67.3} texto="✗ Josh nunca podia aparecer" top={290} size={46} />
      <Rotulo r={69.6} texto="✗ nunca falava por telefone" top={370} size={46} />
      <Rotulo r={71.7} texto="mas a filha voltou a sorrir" top={450} size={42} cor={C.ossoE} />
    </Plano>
    <Plano r={[76.5, 86.0]}>
      <Foto src="mm-myspace" r={[76.5, 86.0]} credito="Reprodução · AP (MySpace)" top={520} w={1000} h={600} pos="50% 50%" cinza zoom={[1.0, 1.1]} />
      <Titulo r={77.5} top={230} size={80}>OUTUBRO DE 2006</Titulo>
      <Carimbo r={79.6} texto="JOSH MUDOU" y={1200} rot={-5} size={90} />
    </Plano>
    <Plano r={[86.0, 96.7]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Rotulo r={86.1} texto="MENSAGENS DELE E DE OUTRAS PESSOAS:" top={420} size={38} cor={C.fita} />
      <Rotulo r={88.4} texto="“feia” · “gorda”" top={520} size={56} />
      <Rotulo r={90.5} texto="“ninguém gosta de você”" top={610} size={50} />
      <Grande r={92.3} top={740} size={58}>“o mundo seria melhor<br />sem você”</Grande>
    </Plano>
    <Plano r={[96.7, 109.3]}>
      <Foto src="mm-megan" r={[96.7, 109.3]} credito={CR} top={330} w={1000} h={620} pos="50% 35%" cinza zoom={[1.05, 1.15]} />
      <Rotulo r={96.8} texto="ELA LIGOU PRA MÃE, CHORANDO" top={200} size={42} cor={C.fita} />
      <Grande r={103.6} top={1010} size={58}>Megan tirou a própria vida.</Grande>
      <Rotulo r={105.5} texto="3 semanas antes de fazer 14 anos" top={1110} size={40} cor={C.ossoE} />
    </Plano>
    <Plano r={[109.3, 120.1]}>
      <Foto src="mm-pais" r={[109.3, 120.1]} credito="Reprodução · AP (Tina e Ron Meier)" top={500} w={1000} h={560} pos="50% 40%" zoom={[1.0, 1.08]} />
      <Rotulo r={109.4} texto="OS PAIS FORAM À POLÍCIA" top={230} size={46} cor={C.fita} />
      <Rotulo r={113.3} texto="quase não havia lei pra crimes na internet" top={310} size={36} />
      <Faixa r={117.1} texto="E O JOSH? NINGUÉM SABIA QUEM ERA" top={1110} size={46} />
    </Plano>
    <Plano r={[120.1, 130.8]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Rotulo r={120.2} texto="6 SEMANAS DEPOIS, UMA VIZINHA CONTOU:" top={520} size={40} cor={C.ossoE} />
      <Titulo r={128.2} top={620} size={110} cor={C.verm}>JOSH EVANS<br />NUNCA EXISTIU</Titulo>
    </Plano>
    <Plano r={[130.8, 142.5]}>
      <Foto src="mm-lori" r={[130.8, 142.5]} credito={CRL} top={480} w={1000} h={720} pos="30% 30%" zoom={[1.0, 1.08]} />
      <Rotulo r={130.9} texto="O PERFIL FOI CRIADO POR" top={230} size={44} cor={C.fita} />
      <Titulo r={133.0} top={300} size={90}>LORI DREW</Titulo>
      <Rotulo r={134.3} texto="mãe de Sarah, a antiga melhor amiga" top={1230} size={38} />
    </Plano>
    <Plano r={[142.5, 153.8]}>
      <Foto src="mm-josh" r={[142.5, 153.8]} credito={CRJ} top={540} w={1000} h={560} pos="40% 50%" cinza zoom={[1.05, 1.15]} />
      <Rotulo r={142.6} texto="SEGUNDO A INVESTIGAÇÃO:" top={230} size={44} cor={C.fita} />
      <Rotulo r={144.3} texto="Lori + a filha + uma funcionária de 18 anos" top={310} size={38} />
      <Faixa r={149.5} texto="PRA SABER O QUE MEGAN FALAVA DE SARAH" top={1160} size={40} />
    </Plano>
    <Plano r={[153.8, 162.1]}>
      <Foto src="mm-lori" r={[153.8, 162.1]} credito={CRL} top={420} w={1000} h={720} pos="30% 30%" cinza zoom={[1.05, 1.15]} />
      <Rotulo r={153.9} texto="O CASO CHOCOU OS EUA" top={230} size={46} cor={C.fita} />
      <Carimbo r={158.6} texto="NENHUMA LEI NO MISSOURI" y={1230} rot={-4} size={66} />
    </Plano>
    <Plano r={[162.1, 179.2]}>
      <Fundo />
      <Rotulo r={162.2} texto="A PROMOTORIA FEDERAL TENTOU OUTRO CAMINHO" top={330} size={36} cor={C.fita} />
      <Rotulo r={165.1} texto="fraude: violar as regras do MySpace" top={410} size={42} />
      <Titulo r={169.5} top={520} size={80}>2008</Titulo>
      <Rotulo r={171.0} texto="condenada por crimes leves" top={630} size={44} />
      <Carimbo r={175.4} texto="CONDENAÇÃO ANULADA" y={800} rot={-5} size={74} />
      <Faixa r={177.2} texto="LORI DREW NUNCA FOI PRESA" top={960} size={58} />
    </Plano>
    <Plano r={[179.2, 190.0]}>
      <Foto src="mm-tina" r={[179.2, 190.0]} credito="Reprodução · Tina Meier (Teen Line)" top={500} w={800} h={700} pos="50% 35%" zoom={[1.0, 1.08]} />
      <Rotulo r={179.3} texto="DEPOIS DE MEGAN:" top={200} size={46} cor={C.fita} />
      <Rotulo r={183.0} texto="leis contra o assédio pela internet" top={280} size={42} />
      <Rotulo r={186.4} texto="Tina criou uma fundação contra o cyberbullying" top={360} size={36} />
    </Plano>
    <Plano r={[190.0, 280]} soco={false}>
      <Fechamento r={190.05} caso="Nº 026" status="NINGUÉM PRESO" pergunta="Se você está passando por algo difícil, fale com o CVV: ligue 188." />
    </Plano>
  </Reel>
);
