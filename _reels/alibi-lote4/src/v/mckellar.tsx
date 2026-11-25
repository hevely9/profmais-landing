import React from "react";
import palavras from "../../public/palavras-mckellar1.json";
import { C, Carimbo, Contador, Faixa, Foto, Fundo, Grande, Plano, Reel, Rotulo, Titulo, TituloVivo, mkCtx } from "../kit";

// ÁLIBI · CASO Nº 021 · PARTE 1 — Caroline Muirhead e Sandy McKellar (Escócia). Fontes: STV, Sky News, BBC Scotland
// ("Murder Case: The Vanishing Cyclist"), Jersey Evening Post/PA (sentença de 25/08/2023). Doc Netflix "Should I Marry a Murderer?".
type Ws = { words: { text: string; start: number; end: number }[] };
export const ctxM1 = mkCtx({
  caso: "Nº 021", parte: "PARTE 1", audio: "mckellar1", words: (palavras as Ws).words, lead: 0.1, fimVozRaw: 70.3, final: "parte2",
  continua: ["PARTE 2", "o segredo da fazenda", "assista no perfil ↗"], cta: ["", ""],
  chave: /^(namorado|matou|provas|caroline|tinder|sandy|robert|gêmeo|segredo|matado|bebia)/i,
  semLegenda: [[66.6, 200]],
  sfx: [
    { src: "impacto", r: 2.04, vol: 0.45 }, { src: "whoosh", r: 6.9, vol: 0.25 }, { src: "whoosh", r: 18.9, vol: 0.25 }, { src: "coracao", r: 39.7, vol: 0.4 },
    { src: "carimbo", r: 41.36, vol: 0.4 }, { src: "trava", r: 47.88, vol: 0.4 }, { src: "subida", r: 50.6, vol: 0.3 }, { src: "coracao", r: 60.5, vol: 0.5 },
    { src: "carimbo", r: 65.28, vol: 0.55 },
  ],
});

export const McKellar1: React.FC = () => (
  <Reel ctx={ctxM1}>
    <Plano r={[-0.1, 6.9]} forte>
      <Foto src="mk-casal" r={[-0.1, 6.9]} credito="Reprodução · BBC Scotland (foto do casal)" top={620} w={1000} h={560} pos="50% 35%" zoom={[1.05, 1.15]} />
      <TituloVivo top={170} size={84} destaque="MATOU" linhas={[[["SEU", 1.34], ["NAMORADO", 1.5]], [["MATOU", 2.04], ["UM", 2.52], ["HOMEM", 2.7]]]} />
      <Faixa r={4.6} texto="E VOCÊ PRECISA FICAR COM ELE" top={430} size={50} />
      <Rotulo r={5.68} texto="pra conseguir as provas" top={1220} size={46} cor={C.fita} />
    </Plano>
    <Plano r={[6.9, 10.3]}>
      <Foto src="mk-caroline" r={[6.9, 10.3]} credito="Reprodução · Netflix, “Should I Marry a Murderer?”" top={380} w={760} h={800} pos="50% 30%" zoom={[1.0, 1.08]} />
      <Titulo r={8.58} top={1200} size={70}>CAROLINE MUIRHEAD</Titulo>
    </Plano>
    <Plano r={[10.3, 18.9]}>
      <Foto src="mk-paisagem" r={[10.3, 18.9]} credito="Reprodução · Terras Altas da Escócia" top={560} w={1000} h={600} pos="50% 50%" zoom={[1.0, 1.1]} />
      <Titulo r={10.34} top={200} size={90}>ESCÓCIA</Titulo>
      <Rotulo r={12.28} texto="ELA É MÉDICA" top={330} size={46} cor={C.fita} />
      <Rotulo r={14.64} texto="acabou de terminar um namoro de 8 anos" top={410} size={38} />
      <Faixa r={17.44} texto="BAIXOU O TINDER" top={1200} size={62} />
    </Plano>
    <Plano r={[18.9, 28.2]}>
      <Foto src="mk-sandy" r={[18.9, 28.2]} credito="Reprodução · Sky News" top={360} w={760} h={820} pos="50% 35%" zoom={[1.0, 1.1]} />
      <Rotulo r={19.02} texto="UM PERFIL CHAMOU A ATENÇÃO" top={220} size={40} cor={C.fita} />
      <Titulo r={21.34} top={1190} size={90}>SANDY</Titulo>
      <Rotulo r={22.7} texto="alto · de kilt · fazenda isolada" top={1300} size={36} />
    </Plano>
    <Plano r={[28.2, 34.6]}>
      <Foto src="mk-fazenda" r={[28.2, 34.6]} credito="Reprodução · Terras Altas, região de Bridge of Orchy" top={500} w={1000} h={640} pos="50% 50%" zoom={[1.0, 1.12]} />
      <Rotulo r={28.2} texto="ENGRAÇADO. CARINHOSO." top={250} size={52} />
      <Faixa r={31.2} texto="1H30 DE ESTRADA NO 1º ENCONTRO" top={1200} size={48} />
    </Plano>
    <Plano r={[34.6, 42.8]}>
      <Foto src="mk-casal" r={[34.6, 42.8]} credito="Reprodução · BBC Scotland" top={420} w={1000} h={560} pos="50% 35%" cinza zoom={[1.1, 1.2]} />
      <Rotulo r={34.7} texto="O NAMORO FICOU SÉRIO RÁPIDO" top={250} size={44} cor={C.fita} />
      <Carimbo r={39.72} texto="QUANDO BEBIA…" y={1100} rot={-5} size={84} />
      <Rotulo r={41.36} texto="virava outra pessoa" top={1220} size={46} />
    </Plano>
    <Plano r={[42.8, 50.5]}>
      <Foto src="mk-gemeos" r={[42.8, 50.5]} credito="Reprodução · fotos dos irmãos McKellar (imprensa)" top={400} w={1000} h={640} pos="50% 30%" zoom={[1.0, 1.08]} />
      <Rotulo r={43.4} texto="O IRMÃO GÊMEO, ROBERT, AVISOU:" top={250} size={40} cor={C.fita} />
      <Grande r={47.88} top={1090} size={56}>“o Sandy não está<br />bem da cabeça”</Grande>
    </Plano>
    <Plano r={[50.5, 60.1]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Grande r={51.66} top={520} size={66}>uma noite, ele disse que<br />precisava contar<br />um segredo.</Grande>
      <Contador r={58.36} ate={59.0} valor={3} prefixo="GUARDADO HÁ + DE " sufixo=" ANOS" top={880} size={60} cor={C.verm} />
    </Plano>
    <Plano r={[60.1, 67.3]}>
      <Foto src="mk-sandy" r={[60.1, 67.3]} credito="Reprodução · Sky News" top={300} w={760} h={820} pos="50% 35%" cinza zoom={[1.1, 1.25]} />
      <Rotulo r={60.5} texto="NAQUELA NOITE, CAROLINE DESCOBRIU…" top={190} size={36} cor={C.fita} />
      <Carimbo r={64.6} texto="ELE TINHA MATADO ALGUÉM" y={1200} rot={-4} size={66} />
    </Plano>
    <Plano r={[67.3, 200]} soco={false}>
      <Fundo />
      <Titulo r={67.35} top={700} size={110} cor={C.verm}>PARTE 2</Titulo>
      <Rotulo r={67.5} texto="NO PERFIL" top={850} size={50} />
    </Plano>
  </Reel>
);
