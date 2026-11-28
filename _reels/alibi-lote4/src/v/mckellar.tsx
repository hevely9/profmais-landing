import React from "react";
import { Easing } from "remotion";
import palavras from "../../public/palavras-mckellar.json";
import { C, Carimbo, Contador, ELITE, Faixa, Foto, Fundo, Grande, Plano, Reel, Rotulo, SOMBRA, Titulo, TituloVivo, lin, mkCtx, useT } from "../kit";
import { Fechamento } from "../dossie";

// ÁLIBI · CASO Nº 025 — Caroline Muirhead e Sandy McKellar (Escócia), vídeo único.
// Fontes: STV, Sky News, BBC Scotland ("Murder Case: The Vanishing Cyclist"), PA/Jersey Evening Post (sentença 25/08/2023),
// Netflix Tudum / The Scotsman / Wikipedia ("Should I Marry a Murderer?", 29/04/2026; prisão 30/12/2020).
type Ws = { words: { text: string; start: number; end: number }[] };
export const ctxM = mkCtx({
  caso: "Nº 025", audio: "mckellar", words: (palavras as Ws).words, lead: 0.1, fimVozRaw: 180.6, final: "alibi", proximo: "NO PERFIL", cta: ["", ""],
  chave: /^(noivo|matou|provas|caroline|tinder|sandy|robert|gêmeo|segredo|tony|atropelou|corpo|presos|polícia|bebia|netflix)/i,
  semLegenda: [[169.5, 260]],
  sfx: [
    { src: "impacto", r: 2.1, vol: 0.45 }, { src: "whoosh", r: 6.7, vol: 0.25 }, { src: "whoosh", r: 12.8, vol: 0.25 }, { src: "whoosh", r: 21.5, vol: 0.25 },
    { src: "carimbo", r: 44.6, vol: 0.4 }, { src: "coracao", r: 48.1, vol: 0.4 }, { src: "trava", r: 55.1, vol: 0.4 }, { src: "subida", r: 57.8, vol: 0.3 },
    { src: "tique", r: 65.8, vol: 0.4 }, { src: "coracao", r: 69.0, vol: 0.4 }, { src: "impacto", r: 89.7, vol: 0.5 }, { src: "tique", r: 92.0, vol: 0.35 },
    { src: "tique", r: 93.5, vol: 0.35 }, { src: "carimbo", r: 95.8, vol: 0.45 }, { src: "coracao", r: 107.5, vol: 0.4 }, { src: "subida", r: 116.5, vol: 0.3 },
    { src: "impacto", r: 123.4, vol: 0.45 }, { src: "tecla", r: 127.7, vol: 0.3 }, { src: "carimbo", r: 134.3, vol: 0.55 }, { src: "impacto", r: 146.0, vol: 0.4 },
    { src: "carimbo", r: 149.6, vol: 0.45 }, { src: "carimbo", r: 153.4, vol: 0.45 }, { src: "coracao", r: 157.3, vol: 0.4 }, { src: "carimbo", r: 177.9, vol: 0.55 },
  ],
});

const Ass: React.FC<{ r: number }> = ({ r }) => {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.05, o(r) + 0.6, Easing.out(Easing.cubic));
  return <div style={{ position: "absolute", left: 60, right: 60, top: 1150, textAlign: "center", opacity: k, fontFamily: ELITE, fontSize: 54, color: C.osso, textShadow: SOMBRA }}>…e esse era o álibi. Durou 3 anos.</div>;
};
const BBC = "Reprodução · BBC Scotland";

export const McKellar: React.FC = () => (
  <Reel ctx={ctxM}>
    <Plano r={[-0.1, 6.7]} forte>
      <Foto src="mk-casal" r={[-0.1, 6.7]} credito={`${BBC} (foto do casal)`} top={620} w={1000} h={560} pos="40% 35%" zoom={[1.05, 1.15]} />
      <TituloVivo top={170} size={84} destaque="MATOU" linhas={[[["SEU", 1.4], ["NOIVO", 1.6]], [["MATOU", 2.1], ["UM", 2.6], ["HOMEM", 2.8]]]} />
      <Faixa r={4.0} texto="E VOCÊ PRECISA FICAR COM ELE" top={430} size={50} />
      <Rotulo r={5.4} texto="pra conseguir as provas" top={1220} size={46} cor={C.fita} />
    </Plano>
    <Plano r={[6.7, 12.8]}>
      <Foto src="mk-caroline" r={[6.7, 12.8]} credito="Reprodução · Netflix, “Should I Marry a Murderer?” (2026)" top={330} w={760} h={800} pos="50% 30%" zoom={[1.0, 1.08]} />
      <Titulo r={8.3} top={1160} size={70}>CAROLINE MUIRHEAD</Titulo>
      <Rotulo r={10.2} texto="E TUDO COMEÇA NO TINDER" top={200} size={44} cor={C.fita} />
    </Plano>
    <Plano r={[12.8, 21.5]}>
      <Foto src="mk-paisagem" r={[12.8, 21.5]} credito="Reprodução · Terras Altas da Escócia" top={560} w={1000} h={600} pos="50% 50%" zoom={[1.0, 1.1]} />
      <Titulo r={12.8} top={200} size={90}>ESCÓCIA</Titulo>
      <Rotulo r={14.8} texto="ELA É MÉDICA LEGISTA" top={330} size={46} cor={C.fita} />
      <Rotulo r={17.1} texto="acabou de terminar um namoro de 8 anos" top={410} size={38} />
      <Faixa r={19.8} texto="BAIXOU O TINDER" top={1200} size={62} />
    </Plano>
    <Plano r={[21.5, 29.9]}>
      <Foto src="mk-sandy" r={[21.5, 29.9]} credito="Reprodução · Sky News" top={330} w={760} h={800} pos="50% 35%" zoom={[1.0, 1.1]} />
      <Rotulo r={21.6} texto="UM PERFIL CHAMOU A ATENÇÃO" top={200} size={40} cor={C.fita} />
      <Titulo r={24.0} top={1150} size={76}>SANDY McKELLAR</Titulo>
      <Rotulo r={25.1} texto="alto · de kilt · fazenda isolada" top={1250} size={34} />
    </Plano>
    <Plano r={[29.9, 34.4]}>
      <Foto src="mk-vila" r={[29.9, 34.4]} credito="Reprodução · Bridge of Orchy, Terras Altas" top={500} w={1000} h={600} pos="50% 50%" zoom={[1.0, 1.1]} />
      <Titulo r={31.2} top={240} size={76}>BRIDGE OF ORCHY</Titulo>
      <Rotulo r={32.9} texto="ele trabalhava com caça" top={1150} size={46} cor={C.fita} />
    </Plano>
    <Plano r={[34.4, 41.0]}>
      <Foto src="mk-fazenda" r={[34.4, 41.0]} credito="Reprodução · Terras Altas, região de Bridge of Orchy" top={500} w={1000} h={640} pos="50% 50%" zoom={[1.0, 1.12]} />
      <Faixa r={35.8} texto="1H30 DE ESTRADA NO 1º ENCONTRO" top={300} size={48} />
      <Rotulo r={39.0} texto="ENGRAÇADO. CARINHOSO." top={1190} size={52} />
    </Plano>
    <Plano r={[41.0, 45.6]}>
      <Foto src="mk-casal" r={[41.0, 45.6]} credito={BBC} top={420} w={1000} h={560} pos="40% 35%" zoom={[1.1, 1.2]} />
      <Rotulo r={41.1} texto="O NAMORO FICOU SÉRIO RÁPIDO" top={250} size={44} cor={C.fita} />
      <Carimbo r={44.4} texto="NOIVOS" y={1120} rot={-5} size={100} />
    </Plano>
    <Plano r={[45.6, 51.2]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Rotulo r={45.7} texto="MAS TINHA COISAS ESTRANHAS" top={500} size={46} cor={C.ossoE} />
      <Carimbo r={48.1} texto="QUANDO BEBIA…" y={720} rot={-5} size={96} />
      <Rotulo r={49.6} texto="Sandy virava outra pessoa" top={880} size={50} />
    </Plano>
    <Plano r={[51.2, 57.7]}>
      <Foto src="mk-gemeos" r={[51.2, 57.7]} credito="Reprodução · fotos dos irmãos McKellar (imprensa)" top={400} w={1000} h={640} pos="50% 30%" zoom={[1.0, 1.08]} />
      <Rotulo r={51.3} texto="O IRMÃO GÊMEO, ROBERT, AVISOU:" top={250} size={40} cor={C.fita} />
      <Grande r={55.1} top={1090} size={56}>“o Sandy não está<br />bem da cabeça”</Grande>
    </Plano>
    <Plano r={[57.7, 62.6]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Grande r={58.7} top={600} size={70}>uma noite, ele disse<br />que precisava contar<br />um segredo.</Grande>
    </Plano>
    {/* o segredo */}
    <Plano r={[62.6, 68.9]}>
      <Foto src="mk-estrada" r={[62.6, 68.9]} credito="Reprodução · estrada A82, Terras Altas" top={560} w={940} h={620} pos="50% 50%" cinza zoom={[1.0, 1.1]} />
      <Rotulo r={62.7} texto="PRA ENTENDER O SEGREDO, VOLTAMOS A" top={230} size={36} cor={C.fita} />
      <Titulo r={65.8} top={310} size={76}>29 DE SETEMBRO<br />DE 2017</Titulo>
    </Plano>
    <Plano r={[68.9, 75.6]}>
      <Foto src="mk-tony" r={[68.9, 75.6]} credito="Reprodução · STV News (Tony Parsons)" top={300} w={760} h={820} pos="50% 30%" zoom={[1.0, 1.08]} />
      <Titulo r={69.0} top={1170} size={80}>TONY PARSONS</Titulo>
      <Rotulo r={70.3} texto="63 ANOS" top={1270} size={40} cor={C.fita} />
    </Plano>
    <Plano r={[75.6, 79.0]}>
      <Foto src="mk-estrada" r={[75.6, 79.0]} credito="Reprodução · estrada A82, Terras Altas" top={420} w={940} h={680} pos="50% 50%" zoom={[1.05, 1.15]} />
      <Rotulo r={75.7} texto="PEDALANDO PELA ESTRADA A82" top={250} size={44} cor={C.fita} />
      <Faixa r={76.6} texto="UMA VIAGEM PELA CARIDADE" top={1150} size={56} />
    </Plano>
    <Plano r={[79.0, 86.8]}>
      <Foto src="mk-hotel" r={[79.0, 86.8]} credito="Reprodução · hotel de Bridge of Orchy" top={480} w={1000} h={600} pos="50% 50%" zoom={[1.0, 1.1]} />
      <Rotulo r={79.1} texto="NAQUELE MESMO DIA, OS GÊMEOS…" top={240} size={40} cor={C.fita} />
      <Rotulo r={82.6} texto="horas bebendo com um grupo de caça" top={320} size={42} />
      <Faixa r={85.2} texto="NO HOTEL DE BRIDGE OF ORCHY" top={1140} size={50} />
    </Plano>
    <Plano r={[86.8, 91.3]}>
      <Foto src="mk-estrada" r={[86.8, 91.3]} credito="Reprodução · estrada A82" top={500} w={940} h={600} pos="50% 50%" cinza zoom={[1.15, 1.3]} />
      <Grande r={86.9} top={260} size={64}>na volta pra casa,<br />bêbado…</Grande>
      <Carimbo r={89.6} texto="ATROPELOU TONY" y={1200} rot={-5} size={86} />
    </Plano>
    <Plano r={[91.3, 99.7]}>
      <Fundo />
      <Rotulo r={92.0} texto="✗ não chamou socorro" top={480} size={56} />
      <Rotulo r={93.5} texto="✗ não chamou a polícia" top={570} size={56} />
      <Faixa r={95.6} texto="OS IRMÃOS ESCONDERAM O CORPO" top={720} size={52} />
      <Rotulo r={97.8} texto="dentro da propriedade da família" top={850} size={44} cor={C.fita} />
    </Plano>
    <Plano r={[99.7, 111.5]}>
      <Foto src="mk-policia" r={[99.7, 111.5]} credito="Reprodução · Police Scotland (apelo por Tony Parsons)" top={320} w={760} h={760} pos="50% 30%" zoom={[1.0, 1.1]} />
      <Rotulo r={99.8} texto="TONY NUNCA CHEGOU EM CASA" top={190} size={44} cor={C.fita} />
      <Rotulo r={102.6} texto="buscas · apelos na TV · nada" top={1110} size={44} />
      <Contador r={107.5} ate={108.1} valor={3} prefixo="+ DE " sufixo=" ANOS SEM RESPOSTA" top={1190} size={56} cor={C.verm} />
    </Plano>
    <Plano r={[111.5, 116.4]}>
      <Foto src="mk-sandy" r={[111.5, 116.4]} credito="Reprodução · Sky News" top={320} w={760} h={800} pos="50% 35%" cinza zoom={[1.1, 1.25]} />
      <Grande r={112.0} top={1150} size={54}>e agora, deitado ao lado dela,<br />Sandy contava tudo.</Grande>
    </Plano>
    <Plano r={[116.4, 125.2]}>
      <Foto src="mk-caroline" r={[116.4, 125.2]} credito="Reprodução · Netflix, “Should I Marry a Murderer?” (2026)" top={560} w={680} h={620} pos="50% 30%" zoom={[1.05, 1.15]} />
      <Rotulo r={116.5} texto="CAROLINE TINHA DUAS OPÇÕES:" top={200} size={42} cor={C.fita} />
      <Rotulo r={118.6} texto="1. fingir que não ouviu nada" top={290} size={44} />
      <Rotulo r={121.0} texto="2. entregar o noivo" top={370} size={44} />
      <Faixa r={123.4} texto="ELA ESCOLHEU A FAMÍLIA DE TONY" top={1210} size={48} />
    </Plano>
    <Plano r={[125.2, 130.9]}>
      <Fundo />
      <Rotulo r={125.3} texto="SEM SANDY SABER…" top={520} size={50} cor={C.ossoE} />
      <Faixa r={127.6} texto="ELA JUNTOU PROVAS" top={620} size={72} />
      <Rotulo r={128.9} texto="e levou tudo pra polícia" top={790} size={50} />
    </Plano>
    <Plano r={[130.9, 140.8]}>
      <Foto src="mk-busca" r={[130.9, 140.8]} credito={`${BBC} (buscas na propriedade)`} top={620} w={1000} h={560} pos="50% 50%" zoom={[1.0, 1.1]} />
      <Titulo r={131.1} top={210} size={86}>30/12/2020</Titulo>
      <Carimbo r={134.2} texto="PRESOS" y={420} rot={-6} size={100} />
      <Rotulo r={136.8} texto="2 semanas depois: o corpo de Tony, enterrado na propriedade" top={1200} size={30} cor={C.fita} />
    </Plano>
    <Plano r={[140.8, 157.0]}>
      <Foto src="mk-gemeos" r={[140.8, 157.0]} credito="Reprodução · fotos dos irmãos McKellar (imprensa)" top={190} w={1000} h={560} pos="50% 30%" cinza zoom={[1.0, 1.08]} />
      <Rotulo r={141.5} texto="ACUSADOS DE ASSASSINATO…" top={790} size={44} cor={C.fita} />
      <Rotulo r={144.0} texto="mas a acusação mudou" top={860} size={40} />
      <Titulo r={146.0} top={930} size={66}>AGOSTO DE 2023</Titulo>
      <Rotulo r={149.5} texto="SANDY: 12 ANOS · homicídio culposo" top={1040} size={40} />
      <Rotulo r={153.3} texto="ROBERT: 5 ANOS E 3 MESES · esconder o crime" top={1110} size={36} />
    </Plano>
    <Plano r={[157.0, 165.7]}>
      <Foto src="mk-tony" r={[157.0, 165.7]} credito="Reprodução · STV News" top={300} w={700} h={760} pos="50% 30%" cinza zoom={[1.05, 1.15]} />
      <Grande r={157.3} top={1100} size={50}>a família passou 3 anos sem<br />saber onde ele estava</Grande>
      <Rotulo r={162.6} texto="até uma mulher decidir não ficar calada" top={190} size={38} cor={C.fita} />
    </Plano>
    <Plano r={[165.7, 169.5]}>
      <Foto src="mk-caroline" r={[165.7, 169.5]} credito="Reprodução · Netflix (2026)" top={360} w={760} h={780} pos="50% 30%" zoom={[1.05, 1.12]} />
      <Faixa r={166.0} texto="VIROU SÉRIE NA NETFLIX · 2026" top={1190} size={50} />
    </Plano>
    <Plano r={[169.5, 177.8]}>
      <Foto src="mk-hotel" r={[169.5, 177.8]} credito="Reprodução · hotel de Bridge of Orchy" top={300} w={1000} h={560} pos="50% 50%" cinza zoom={[1.05, 1.15]} />
      <Grande r={169.6} top={920} size={70}>Onde você estava<br />naquela noite?</Grande>
      <Rotulo r={171.9} texto="Sandy: bebendo num hotel" top={1090} size={40} cor={C.ossoE} />
      <Ass r={174.0} />
    </Plano>
    <Plano r={[177.8, 260]} soco={false}>
      <Fechamento r={177.9} caso="Nº 025" status="CONDENADOS" pergunta="Tony Parsons, 63 anos. Encontrado 3 anos depois." />
    </Plano>
  </Reel>
);
