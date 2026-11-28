import React from "react";
import p1 from "../../public/palavras-riggs1.json";
import p2 from "../../public/palavras-riggs2.json";
import p3 from "../../public/palavras-riggs3.json";
import { Assinatura, C, Carimbo, Cheia, Clip, Faixa, Foto, Fundo, Grande, Papel, Cabec, Linha, Plano, Reel, Rotulo, Titulo, mkCtx } from "../kit";
import { Ficha } from "../ui";
import { Compara, Corte, FalaCorte, Misterio } from "../serie";

// ÁLIBI · CASO Nº 015 — Chantay Blankinship (Lake Brownwood, Texas, 2016) — série em 3 partes.
// Fatos: TDCAA "Snapshot of a killer", Parabon (case summary), AP/CBS Austin, KTXS, Brownwood News, Dateline NBC.
// Fora do roteiro de propósito: violência sexual (fontes divergem) e detalhes gráficos.
type Ws = { words: { text: string; start: number; end: number }[] };
const CHAVE = /^(chantay|ryan|riggs|dna|igreja|assassino|velório|ninguém|sumiu|rosto|confessou|perdoo|álibi|culpado|perpétua|destruição|buscas)$/i;
const SEGUE = "segue o Álibi pra não perder ↗";

// ───────────────────────── PARTE 1 ─────────────────────────
export const ctx1 = mkCtx({
  caso: "Nº 015", parte: "PARTE 1", audio: "riggs1", words: (p1 as Ws).words, lead: 3.3, fimVozRaw: 67.95, final: "parte2",
  continua: ["PARTE 2", "o rosto que o DNA desenhou", SEGUE], cta: ["", ""], chave: CHAVE, semLegenda: [[65.9, 80]],
  sfx: [
    { src: "impacto", r: -0.05, vol: 0.45 }, { src: "whoosh", r: 2.4, vol: 0.25 }, { src: "whoosh", r: 4.95, vol: 0.25 }, { src: "coracao", r: 11.5, vol: 0.5 },
    { src: "whoosh", r: 13.4, vol: 0.25 }, { src: "whoosh", r: 17.75, vol: 0.25 }, { src: "subida", r: 21.5, vol: 0.3 }, { src: "impacto", r: 23.4, vol: 0.35 },
    { src: "coracao", r: 29.5, vol: 0.5 }, { src: "carimbo", r: 34.88, vol: 0.5 }, { src: "trava", r: 38.4, vol: 0.35 }, { src: "impacto", r: 42.7, vol: 0.4 },
    ...[45.4, 45.7, 46.0, 46.3].map((r) => ({ src: "tecla", r, vol: 0.25 })), { src: "carimbo", r: 47.1, vol: 0.5 }, { src: "carimbo", r: 52.24, vol: 0.5 },
    { src: "whoosh", r: 52.85, vol: 0.25 }, { src: "coracao", r: 57.3, vol: 0.5 }, { src: "impacto", r: 59.5, vol: 0.5 }, { src: "carimbo", r: 64.36, vol: 0.55 },
  ],
});
export const Parte1: React.FC = () => (
  <Reel ctx={ctx1}>
    {/* GANCHO — Coringa: "Cara, essa história tá estranha, hein, mano" */}
    <Plano r={[-3.3, 0]} forte>
      <Corte src="hk1" de={0} dur={3.3} cropY={[430, 1490]} top={330} topo />
    </Plano>
    <Plano r={[0, 2.45]}>
      <Clip src="c1704" r0={0} dur={2.45} a={0.4} />
      <Titulo r={0.0} top={380} size={110}>13 DE MAIO<br />DE 2016</Titulo>
    </Plano>
    <Plano r={[2.45, 4.95]}>
      <Clip src="c5030" r0={2.45} dur={2.5} a={0.4} />
      <Titulo r={2.5} top={380} size={100}>LAKE<br />BROWNWOOD</Titulo>
      <Rotulo r={3.76} texto="TEXAS · ESTADOS UNIDOS" top={620} size={40} cor={C.fita} />
    </Plano>
    <Plano r={[4.95, 7.7]}>
      <Foto src="r-chantay-ng" r={[4.95, 7.7]} credito="Reprodução · arquivo da família / TV" top={330} w={760} h={900} pos="50% 30%" zoom={[1.0, 1.1]} />
      <Faixa r={5.02} texto="CHANTAY BLANKINSHIP" top={1120} size={58} />
      <Rotulo r={6.46} texto="25 anos" top={1200} size={40} />
    </Plano>
    <Plano r={[7.7, 11.5]}>
      <Clip src="c1532" r0={7.7} dur={3.8} a={0.45} />
      <Titulo r={7.78} top={360} size={82}>SAI PRA CAMINHAR<br />COM O CACHORRO</Titulo>
      <Rotulo r={9.54} texto="como fazia toda noite" top={580} size={44} />
    </Plano>
    <Plano r={[11.5, 13.45]}>
      <Fundo cor={C.preto} />
      <Grande r={11.58} top={700} size={96}>Ela nunca voltou.</Grande>
    </Plano>
    <Plano r={[13.45, 15.4]}>
      <Clip src="c23247" r0={13.45} dur={1.95} a={0.5} />
      <Rotulo r={13.48} texto="VIZINHOS" top={420} size={70} />
      <Rotulo r={14.54} texto="AMIGOS" top={520} size={70} />
    </Plano>
    <Plano r={[15.4, 17.8]}>
      <Foto src="r-chantay-cap" r={[15.4, 17.8]} credito="Reprodução · arquivo da família / TV" top={420} w={700} h={760} pos="50% 30%" zoom={[1.02, 1.12]} rot={-2} />
      <Rotulo r={15.48} texto="A IGREJA ONDE ELA" top={230} size={44} cor={C.fita} />
      <Titulo r={16.6} top={290} size={70}>CANTAVA NO CORAL</Titulo>
    </Plano>
    <Plano r={[17.8, 20.6]}>
      <Clip src="c22729" r0={17.8} dur={2.8} a={0.5} />
      <Titulo r={17.86} top={380} size={96}>A CIDADE<br />INTEIRA PROCURA</Titulo>
    </Plano>
    <Plano r={[20.6, 23.4]}>
      <Clip src="c14120" r0={20.6} dur={2.8} a={0.5} />
      <Titulo r={20.66} top={420} size={110}>DOIS DIAS<br />DEPOIS</Titulo>
    </Plano>
    <Plano r={[23.4, 26.6]}>
      <Clip src="c5291" r0={23.4} dur={3.2} a={0.45} />
      <Faixa r={23.42} texto="UMA FAZENDA ABANDONADA" top={380} size={60} />
      <Rotulo r={25.0} texto="a 8 km da casa dela" top={500} size={44} />
    </Plano>
    <Plano r={[26.6, 31.9]}>
      <Clip src="c2632" r0={26.6} dur={5.3} a={0.55} />
      <Rotulo r={26.7} texto="OS MORADORES CHAMAVAM DE…" top={360} size={42} cor={C.fita} />
      <Titulo r={29.58} top={460} size={104} cor={C.verm}>A CASA<br />MAL-ASSOMBRADA</Titulo>
    </Plano>
    <Plano r={[31.9, 35.7]}>
      <Clip src="c2489" r0={31.9} dur={3.8} a={0.55} />
      <Rotulo r={32.3} texto="NO ABRIGO SUBTERRÂNEO" top={380} size={50} />
      <Carimbo r={34.88} texto="15 · MAIO · 2016" y={640} rot={-7} size={90} />
    </Plano>
    <Plano r={[35.7, 40.3]}>
      <Clip src="c32790" r0={35.7} dur={4.6} a={0.5} />
      <Rotulo r={37.54} texto="A ARMA:" top={360} size={48} cor={C.fita} />
      <Titulo r={38.4} top={440} size={84}>UMA LÂMINA DE<br />CORTADOR DE GRAMA</Titulo>
    </Plano>
    <Plano r={[40.3, 44.8]}>
      <Clip src="c5580" r0={40.3} dur={4.5} a={0.5} />
      <Rotulo r={41.0} texto="E UMA COISA QUE MUDA TUDO…" top={380} size={42} cor={C.fita} />
      <Titulo r={42.7} top={470} size={110}>O DNA DO<br />ASSASSINO</Titulo>
    </Plano>
    <Plano r={[44.8, 47.95]}>
      <Fundo />
      <Papel top={400} h={500} rot={-1}>
        <Cabec sup="LABORATÓRIO · BANCO DE DNA" titulo="BUSCA" size={70} />
        <Linha r={45.4} texto="correspondências: 0" />
      </Papel>
      <Carimbo r={47.1} texto="NINGUÉM" y={860} rot={-8} size={120} />
    </Plano>
    <Plano r={[47.95, 52.85]}>
      <Fundo />
      <Papel top={380} h={560} rot={1}>
        <Cabec sup="QUADRO DE SUSPEITOS" titulo="SUSPEITOS" size={64} />
        <Linha r={48.42} texto="— namorado: tinha álibi" />
        <Linha r={50.4} texto="— outros: não batem" />
        <Linha r={51.0} texto="  com o DNA" />
      </Papel>
      <Carimbo r={52.24} texto="DESCARTADOS" y={980} rot={-7} size={96} />
    </Plano>
    <Plano r={[52.85, 57.3]}>
      <Clip src="c29425" r0={52.85} dur={4.45} a={0.45} />
      <Titulo r={52.92} top={380} size={100}>UMA SEMANA<br />DEPOIS</Titulo>
      <Rotulo r={56.18} texto="o velório de Chantay · 20/05/2016" top={620} size={40} />
    </Plano>
    <Plano r={[57.3, 61.9]}>
      <Clip src="c33232" r0={57.3} dur={4.6} a={0.55} />
      <Grande r={57.32} top={420} size={78}>e no meio<br />daquelas pessoas…</Grande>
      <Faixa r={59.5} texto="ESTAVA O ASSASSINO" top={720} size={72} />
    </Plano>
    <Plano r={[61.9, 65.95]}>
      <Misterio img="r-ryan-church" />
      <Rotulo r={62.38} texto="ELE AJUDOU NAS BUSCAS" top={300} size={50} />
      <Carimbo r={64.36} texto="NINGUÉM DESCONFIOU" y={1050} rot={-6} size={86} />
    </Plano>
    <Plano r={[65.95, 80]} soco={false}>
      <Clip src="c1704" r0={65.95} from={3} dur={5} a={0.6} />
      <Grande r={66.0} top={700} size={76}>quem era ele?</Grande>
    </Plano>
  </Reel>
);

// ───────────────────────── PARTE 2 ─────────────────────────
export const ctx2 = mkCtx({
  caso: "Nº 017", parte: "PARTE 2", audio: "riggs2", words: (p2 as Ws).words, lead: 4.95, fimVozRaw: 61.1, final: "parte2",
  continua: ["PARTE 3", "a confissão no culto", SEGUE], cta: ["", ""], chave: CHAVE, semLegenda: [[59.2, 80]],
  sfx: [
    { src: "carimbo", r: 0.05, vol: 0.55 }, { src: "whoosh", r: 3.1, vol: 0.25 }, { src: "coracao", r: 6.3, vol: 0.45 }, { src: "whoosh", r: 10.8, vol: 0.25 },
    { src: "subida", r: 13.7, vol: 0.3 }, { src: "impacto", r: 16.66, vol: 0.4 }, ...[21.74, 22.92, 23.92, 24.76].map((r) => ({ src: "tecla", r, vol: 0.3 })),
    { src: "whoosh", r: 26.75, vol: 0.3 }, { src: "carimbo", r: 34.12, vol: 0.55 }, { src: "trava", r: 35.16, vol: 0.4 }, { src: "coracao", r: 42.0, vol: 0.45 },
    { src: "whoosh", r: 45.35, vol: 0.25 }, { src: "carimbo", r: 48.62, vol: 0.55 }, { src: "subida", r: 51.6, vol: 0.3 }, { src: "impacto", r: 53.28, vol: 0.5 },
    { src: "coracao", r: 56.1, vol: 0.5 },
  ],
});
export const Parte2: React.FC = () => (
  <Reel ctx={ctx2}>
    {/* GANCHO — Coringa: "Bobby, olha o nome do cara… algema, pode buscar, é ele, pode levar!" */}
    <Plano r={[-4.95, 0]} forte>
      <Corte src="hk2a" de={0} dur={1.6} cropY={[0, 830]} top={300} tapa={[180, 270]} />
      <Corte src="hk2b" de={1.6} dur={3.35} cropY={[0, 1280]} top={170} tapa={[170, 270]} />
      <FalaCorte paginas={[[0.05, 1.6, "BOBBY, *OLHA O NOME* DO CARA"], [1.62, 3.2, "*ALGEMA*, PODE BUSCAR"], [3.2, 4.95, "É ELE, *PODE LEVAR!*"]]} />
    </Plano>
    <Plano r={[0, 3.1]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Carimbo r={0.0} texto="NÃO ERA ELE" y={640} rot={-7} size={130} />
      <Rotulo r={1.12} texto="nenhum dos suspeitos era" top={860} size={46} />
    </Plano>
    <Plano r={[3.1, 6.3]}>
      <Clip src="c1704" r0={3.1} dur={3.2} a={0.5} />
      <Titulo r={3.18} top={380} size={100}>1 ANO E MEIO<br />DEPOIS</Titulo>
      <Faixa r={5.26} texto="CASO PARADO" top={640} size={64} />
    </Plano>
    <Plano r={[6.3, 8.6]}>
      <Clip src="c5485" r0={6.3} dur={2.3} a={0.5} />
      <Titulo r={6.32} top={420} size={110}>UM DNA<br />SEM NOME</Titulo>
    </Plano>
    <Plano r={[8.6, 10.8]}>
      <Foto src="r-chantay-grande" r={[8.6, 10.8]} credito="Reprodução · arquivo da família / TV" top={420} w={760} h={760} pos="50% 30%" cinza zoom={[1.0, 1.08]} />
      <Titulo r={8.66} top={220} size={74}>UMA FAMÍLIA<br />SEM RESPOSTA</Titulo>
    </Plano>
    <Plano r={[10.8, 13.7]}>
      <Clip src="c22998" r0={10.8} dur={2.9} a={0.5} />
      <Rotulo r={10.86} texto="ATÉ QUE UM INVESTIGADOR…" top={360} size={44} cor={C.fita} />
      <Titulo r={12.9} top={450} size={96}>ASSISTE A UM<br />PROGRAMA DE TV</Titulo>
    </Plano>
    <Plano r={[13.7, 16.6]}>
      <Clip src="c46748" r0={13.7} dur={2.9} a={0.5} />
      <Faixa r={14.42} texto="UMA TECNOLOGIA NOVA" top={460} size={66} />
    </Plano>
    <Plano r={[16.6, 21.7]}>
      <Foto src="r-snap-hunt" r={[16.6, 21.7]} credito="Reprodução · Parabon NanoLabs / Snapshot (2017)" top={470} w={940} h={660} pos="50% 30%" zoom={[1.0, 1.12]} />
      <Rotulo r={16.66} texto="UMA EMPRESA PEGA O DNA…" top={230} size={44} cor={C.fita} />
      <Titulo r={19.14} top={300} size={76}>E DESENHA O ROSTO</Titulo>
    </Plano>
    <Plano r={[21.7, 26.75]}>
      <Cheia src="r-snap-hunt" r={[21.7, 26.75]} credito="Reprodução · Parabon NanoLabs" pos="30% 40%" zoom={[1.1, 1.3]} a={0.6} />
      <Rotulo r={21.74} texto="✓ COR DA PELE" top={420} size={56} />
      <Rotulo r={22.92} texto="✓ DOS OLHOS" top={510} size={56} />
      <Rotulo r={23.92} texto="✓ DO CABELO" top={600} size={56} />
      <Rotulo r={24.76} texto="✓ ATÉ AS SARDAS" top={690} size={56} cor={C.verm} />
    </Plano>
    <Plano r={[26.75, 30.8]}>
      <Clip src="c17396" r0={26.75} dur={4.05} a={0.5} />
      <Titulo r={26.8} top={380} size={100}>NOVEMBRO<br />DE 2017</Titulo>
      <Faixa r={29.14} texto="A POLÍCIA DIVULGA O ROSTO" top={640} size={56} />
    </Plano>
    <Plano r={[30.8, 35.1]}>
      <Foto src="r-snap-hunt" r={[30.8, 35.1]} credito="Reprodução · Parabon NanoLabs" top={430} w={900} h={640} pos="35% 40%" zoom={[1.1, 1.25]} cinza />
      <Rotulo r={30.84} texto="O MEIO-IRMÃO DE CHANTAY OLHA…" top={260} size={40} cor={C.fita} />
      <Carimbo r={34.12} texto="RECONHECE" y={760} rot={-8} size={120} />
    </Plano>
    <Plano r={[35.1, 38.9]}>
      <Ficha sup="IDENTIFICADO · NOV/2017" nome="RYAN DEREK RIGGS" foto="r-ryan-church" pos="50% 15%" credito="foto: reprodução" top={360}
        linhas={[[36.72, "— 21 anos"], [37.94, "— vizinho"]]} />
    </Plano>
    <Plano r={[38.9, 42.0]}>
      <Cheia src="r-ryan-church" r={[38.9, 42.0]} credito="Reprodução · Dr Insanity (imagens do caso)" pos="50% 20%" zoom={[1.0, 1.1]} a={0.45} />
      <Rotulo r={38.94} texto="CONHECIA CHANTAY" top={360} size={56} />
      <Faixa r={40.34} texto="FREQUENTAVA A MESMA IGREJA" top={460} size={56} />
    </Plano>
    <Plano r={[42.0, 45.35]}>
      <Clip src="c23247" r0={42.0} dur={3.35} a={0.5} />
      <Rotulo r={42.02} texto="O MESMO RAPAZ QUE…" top={380} size={44} cor={C.fita} />
      <Titulo r={43.72} top={460} size={86}>AJUDOU A<br />PROCURAR POR ELA</Titulo>
    </Plano>
    <Plano r={[45.35, 47.7]}>
      <Clip src="c49328" r0={45.35} dur={2.35} a={0.45} />
      <Titulo r={45.42} top={420} size={84}>A POLÍCIA VAI<br />ATÉ A CASA DELE</Titulo>
    </Plano>
    <Plano r={[47.7, 51.6]}>
      <Clip src="c22729" r0={47.7} from={4} dur={3.9} a={0.55} />
      <Carimbo r={48.62} texto="SUMIU" y={600} rot={-8} size={170} />
      <Rotulo r={49.52} texto="dias sem nenhum sinal" top={820} size={48} />
    </Plano>
    <Plano r={[51.6, 56.0]}>
      <Clip src="c29425" r0={51.6} dur={4.4} a={0.45} />
      <Titulo r={51.66} top={380} size={96}>ATÉ QUE<br />ELE APARECE</Titulo>
      <Faixa r={53.28} texto="NA IGREJA" top={640} size={80} />
      <Rotulo r={54.3} texto="na frente de todo mundo" top={790} size={44} />
    </Plano>
    <Plano r={[56.0, 80]} soco={false}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Grande r={56.1} top={620} size={78}>e faz uma coisa<br />que ninguém ali<br />esperava…</Grande>
    </Plano>
  </Reel>
);

// ───────────────────────── PARTE 3 ─────────────────────────
export const ctx3 = mkCtx({
  caso: "Nº 015", parte: "PARTE 3", audio: "riggs3", words: (p3 as Ws).words, lead: 4.65, fimVozRaw: 59.92, final: "alibi", proximo: "NO PERFIL",
  cta: ["Você teria desconfiado dele?", "comenta: SIM ou NÃO ↓"], chave: CHAVE, semLegenda: [[55.2, 80]],
  sfx: [
    { src: "whoosh", r: 0.0, vol: 0.3 }, { src: "subida", r: 1.6, vol: 0.3 }, { src: "coracao", r: 6.9, vol: 0.45 }, { src: "impacto", r: 10.86, vol: 0.55 },
    { src: "whoosh", r: 12.85, vol: 0.25 }, { src: "impacto", r: 17.42, vol: 0.35 }, { src: "impacto", r: 18.46, vol: 0.35 }, { src: "whoosh", r: 22.95, vol: 0.25 },
    { src: "trava", r: 25.34, vol: 0.4 }, { src: "coracao", r: 28.3, vol: 0.45 }, { src: "subida", r: 33.0, vol: 0.3 }, { src: "impacto", r: 34.6, vol: 0.4 },
    { src: "impacto", r: 37.3, vol: 0.5 }, { src: "whoosh", r: 38.75, vol: 0.25 }, { src: "carimbo", r: 41.7, vol: 0.55 }, { src: "trava", r: 42.66, vol: 0.4 },
    { src: "coracao", r: 48.6, vol: 0.45 }, ...[50.44, 51.84, 53.02].map((r) => ({ src: "tecla", r, vol: 0.3 })),
  ],
});
export const Parte3: React.FC = () => (
  <Reel ctx={ctx3}>
    {/* GANCHO — Coringa sobre o interrogatório: "Pô, esse cara, mano… o DNA bate, beleza, mas…" */}
    <Plano r={[-4.65, 0]} forte>
      <Corte src="hk3" de={0} dur={4.65} cropY={[430, 1490]} top={330} topo />
    </Plano>
    <Plano r={[0, 1.6]}>
      <Clip src="c9530" r0={0} dur={1.6} a={0.45} />
      <Titulo r={0.12} top={420} size={82}>NORTH LAKE<br />COMMUNITY CHURCH</Titulo>
    </Plano>
    <Plano r={[1.6, 6.9]}>
      <Clip src="c29425" r0={1.6} dur={5.3} a={0.45} />
      <Rotulo r={1.64} texto="O CULTO ESTÁ ACONTECENDO…" top={380} size={44} cor={C.fita} />
      <Faixa r={4.58} texto="RYAN ENTRA" top={480} size={80} />
      <Rotulo r={5.66} texto="com os pais" top={620} size={46} />
    </Plano>
    <Plano r={[6.9, 10.8]}>
      <Cheia src="r-ryan-church" r={[6.9, 10.8]} credito="Reprodução · Dr Insanity (imagens do caso)" pos="50% 20%" zoom={[1.0, 1.12]} a={0.45} />
      <Rotulo r={6.94} texto="ELE VAI ATÉ A FRENTE…" top={360} size={48} />
      <Rotulo r={8.78} texto="e diz, pra igreja inteira:" top={450} size={44} cor={C.fita} />
    </Plano>
    <Plano r={[10.8, 12.9]}>
      <Fundo cor={C.preto} />
      <Grande r={10.86} top={640} size={92}>“Fui eu que matei<br />a Chantay.”</Grande>
    </Plano>
    <Plano r={[12.9, 17.4]}>
      <Foto src="r-chantay-cap" r={[12.9, 17.4]} credito="Reprodução · arquivo da família / TV" top={430} w={700} h={760} pos="50% 30%" zoom={[1.02, 1.12]} rot={2} />
      <Rotulo r={12.92} texto="A IGREJA ONDE ELA CANTAVA" top={230} size={44} cor={C.fita} />
      <Faixa r={15.16} texto="A MESMA DO VELÓRIO" top={300} size={60} />
    </Plano>
    <Plano r={[17.4, 19.45]}>
      <Fundo cor={C.preto} />
      <Titulo r={17.42} top={560} size={120}>SILÊNCIO.</Titulo>
      <Titulo r={18.46} top={720} size={120} cor={C.verm}>CHOQUE.</Titulo>
    </Plano>
    <Plano r={[19.45, 23.0]}>
      <Clip src="c9530" r0={19.45} from={2} dur={3.55} a={0.55} />
      <Grande r={19.5} top={560} size={80}>e algumas pessoas<br />foram até ele…</Grande>
      <Faixa r={22.16} texto="E ABRAÇARAM" top={860} size={72} />
    </Plano>
    <Plano r={[23.0, 28.25]}>
      <Cheia src="r-inter" r={[23.0, 28.25]} credito="Reprodução · vídeo do interrogatório (via Dr Insanity)" pos="50% 20%" zoom={[1.0, 1.12]} a={0.4} cinza={false} />
      <Rotulo r={23.04} texto="SALA DE INTERROGATÓRIO" top={320} size={50} cor={C.fita} />
      <Faixa r={25.34} texto="DETALHES QUE SÓ O ASSASSINO SABIA" top={400} size={46} />
    </Plano>
    <Plano r={[28.25, 33.55]}>
      <Foto src="r-inter-close" r={[28.25, 33.55]} credito="Reprodução · vídeo do interrogatório (via Dr Insanity)" top={300} w={860} h={760} pos="50% 20%" zoom={[1.0, 1.15]} cinza />
      <Titulo r={28.3} top={180} size={90}>POR QUÊ?</Titulo>
      <Grande r={30.66} top={1090} size={60}>uma parte dele só<br />queria destruição</Grande>
    </Plano>
    <Plano r={[33.55, 38.75]}>
      <Fundo />
      <Titulo r={33.62} top={180} size={76}>AGORA COMPARA</Titulo>
      <Compara a="r-snap-hunt" b="r-ryan-church" ra={34.56} rb={37.3} la="RETRATO DO DNA" lb="RYAN RIGGS" credA="Parabon NanoLabs" credB="reprodução" />
    </Plano>
    <Plano r={[38.75, 42.6]}>
      <Clip src="c47686" r0={38.75} dur={3.85} a={0.5} />
      <Titulo r={38.8} top={380} size={96}>FEVEREIRO<br />DE 2019</Titulo>
      <Carimbo r={41.7} texto="CULPADO" y={700} rot={-8} size={140} />
    </Plano>
    <Plano r={[42.6, 45.1]}>
      <Clip src="c47803" r0={42.6} dur={2.5} a={0.5} />
      <Titulo r={42.66} top={400} size={100}>PRISÃO<br />PERPÉTUA</Titulo>
      <Rotulo r={43.9} texto="sem condicional" top={640} size={48} />
    </Plano>
    <Plano r={[45.1, 50.1]}>
      <Foto src="r-chantay-grande" r={[45.1, 50.1]} credito="Reprodução · arquivo da família / TV" top={300} w={760} h={760} pos="50% 30%" zoom={[1.0, 1.1]} />
      <Rotulo r={45.46} texto="A MÃE DE CHANTAY OLHA NOS OLHOS DELE…" top={180} size={36} cor={C.fita} />
      <Grande r={48.84} top={1100} size={86}>“eu te perdoo.”</Grande>
    </Plano>
    <Plano r={[50.1, 55.2]}>
      <Misterio img="r-ryan-church" />
      <Rotulo r={50.44} texto="✓ AJUDOU NAS BUSCAS" top={470} size={56} />
      <Rotulo r={51.84} texto="✓ FOI AO VELÓRIO" top={570} size={56} />
      <Rotulo r={53.02} texto="✓ SENTOU NA MESMA IGREJA" top={670} size={52} />
    </Plano>
    <Plano r={[55.2, 80]} soco={false}>
      <Clip src="c1704" r0={55.2} from={2} dur={7} a={0.6} />
      <Assinatura r={55.6} />
    </Plano>
  </Reel>
);
