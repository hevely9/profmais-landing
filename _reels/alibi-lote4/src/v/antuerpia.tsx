import React from "react";
import palavras from "../../public/palavras-antuerpia.json";
import { C, Carimbo, Cheia, Clip, Contador, Faixa, Foto, Grande, Plano, Reel, Rotulo, SANS, Titulo, TituloVivo, mkCtx } from "../kit";
import { Fechamento, Hora } from "../dossie";

// ÁLIBI · CASO Nº 028 — O roubo de diamantes de Antuérpia (2003). Pedido nos comentários do carrossel ("LIXO").
// Imagens: trailer oficial da Netflix "Stolen: Heist of the Century" (2025): fotos de polícia do cofre, recorte de jornal,
// fichas da quadrilha, entrevistas e reconstituições. Sem tela preta com só legenda: toda cena tem imagem.
// Gancho: imagem mais forte (cofre revirado) no quadro 0 + promessa concreta (US$ 100 mi) + virada absurda (sanduíche) em 7 s.
// Fatos: Wikipedia (Antwerp diamond heist), casepin.org, Vlaanderen Vroeger, Antwerpist, Executive Digest.
type Ws = { words: { text: string; start: number; end: number }[] };
export const ctxAn = mkCtx({
  caso: "Nº 028", audio: "antuerpia", words: (palavras as Ws).words, lead: 0.15, fimVozRaw: 154.15, final: "alibi", proximo: "NO PERFIL", cta: ["", ""],
  chave: /^(diamante|cofre|sanduíche|lixo|notarbartolo|impossível|ladrão|turim|polícia|preso|nunca|100)/i,
  semLegenda: [[151.45, 300]],
  sfx: [
    { src: "impacto", r: 0.0, vol: 0.5 }, { src: "whoosh", r: 2.45, vol: 0.3 }, { src: "whoosh", r: 4.85, vol: 0.3 }, { src: "carimbo", r: 7.1, vol: 0.45 },
    { src: "whoosh", r: 9.0, vol: 0.25 }, { src: "tique", r: 28.3, vol: 0.3 }, { src: "tique", r: 29.6, vol: 0.3 }, { src: "tique", r: 30.3, vol: 0.3 },
    { src: "tique", r: 31.6, vol: 0.3 }, { src: "tique", r: 33.0, vol: 0.3 }, { src: "carimbo", r: 36.8, vol: 0.45 }, { src: "carimbo", r: 55.6, vol: 0.45 },
    { src: "subida", r: 70.4, vol: 0.3 }, { src: "impacto", r: 82.6, vol: 0.45 }, { src: "whoosh", r: 99.0, vol: 0.3 }, { src: "carimbo", r: 115.8, vol: 0.5 },
    { src: "impacto", r: 125.2, vol: 0.45 }, { src: "carimbo", r: 143.9, vol: 0.45 },
  ],
});

const CR = "Reprodução · Netflix, “Stolen: Heist of the Century” (2025)";
const Cred: React.FC = () => <div style={{ position: "absolute", right: 34, top: 1262, fontFamily: SANS, fontWeight: 600, fontSize: 17, color: "rgba(236,231,220,0.6)", textShadow: "0 1px 4px #000" }}>{CR}</div>;
// cena em movimento (trecho do trailer), tela cheia
const Cena: React.FC<{ r: [number, number]; from: number; a?: number; zoom?: [number, number] }> = ({ r, from, a = 0.38, zoom }) =>
  <><Clip src="an-trailer" r0={r[0]} from={from} dur={r[1] - r[0]} a={a} zoom={zoom} /><Cred /></>;

export const Antuerpia: React.FC = () => (
  <Reel ctx={ctxAn}>
    {/* ── GANCHO (0–9 s): 3 imagens fortes, texto que entra junto com a voz ── */}
    <Plano r={[-0.2, 2.45]} forte>
      <Cheia src="an2-cofre-cor" r={[-0.2, 2.45]} credito={CR} cinza={false} pos="50% 55%" zoom={[1.18, 1.06]} a={0.3} />
      <TituloVivo top={330} size={110} destaque="MILHÕES" linhas={[[["US$", 0.12], ["100", 0.5]], [["MILHÕES", 0.8]]]} />
    </Plano>
    <Plano r={[2.45, 4.85]}>
      <Cheia src="an2-cofre-pb" r={[2.45, 4.85]} credito={CR} cinza={false} pos="50% 50%" zoom={[1.12, 1.02]} a={0.3} />
      <Titulo r={2.5} top={330} size={92}>SUMIRAM</Titulo>
      <Rotulo r={3.0} texto="do cofre mais seguro do mundo" top={450} size={46} />
    </Plano>
    <Plano r={[4.85, 9.0]}>
      <Cheia src="an2-fichas" r={[4.85, 9.0]} credito={CR} cinza={false} pos="50% 40%" zoom={[1.05, 1.14]} a={0.3} />
      <TituloVivo top={300} size={92} destaque="SANDUÍCHE" linhas={[[["PEGOS", 5.9], ["POR", 6.4], ["UM", 6.9]], [["SANDUÍCHE", 7.1]]]} />
    </Plano>

    {/* ── CONTEXTO ── */}
    <Plano r={[9.0, 13.7]}>
      <Cena r={[9.0, 13.7]} from={0.8} />
      <Rotulo r={9.0} texto="ISSO ACONTECEU DE VERDADE" top={300} size={42} cor={C.fita} />
      <Titulo r={10.2} top={370} size={88}>ANTUÉRPIA · BÉLGICA</Titulo>
      <Rotulo r={11.7} texto="FEVEREIRO DE 2003" top={490} size={48} />
    </Plano>
    <Plano r={[13.7, 20.1]}>
      <Cheia src="an2-diamante" r={[13.7, 20.1]} credito={CR} cinza={false} pos="36% 50%" zoom={[1.2, 1.35]} a={0.3} />
      <Rotulo r={13.8} texto="A CAPITAL MUNDIAL" top={320} size={46} cor={C.fita} />
      <Titulo r={14.7} top={390} size={92}>DOS DIAMANTES</Titulo>
      <Rotulo r={17.3} texto="a maior parte dos diamantes brutos do planeta passa por lá" top={1150} size={34} />
    </Plano>
    <Plano r={[20.1, 25.3]}>
      <Cheia src="an2-caixas" r={[20.1, 25.3]} credito={CR} cinza={false} pos="50% 50%" zoom={[1.0, 1.1]} />
      <Rotulo r={20.2} texto="O COFRE DO" top={320} size={44} cor={C.fita} />
      <Titulo r={22.3} top={385} size={92}>DIAMOND CENTRE</Titulo>
      <Rotulo r={23.4} texto="2 andares abaixo do chão · 160 caixas" top={1150} size={40} />
    </Plano>
    <Plano r={[25.3, 35.8]}>
      <Cheia src="an-entrada" r={[25.3, 35.8]} credito={CR} cinza={false} pos="50% 50%" zoom={[1.0, 1.08]} a={0.55} />
      <Rotulo r={25.4} texto="PROTEGIDO POR:" top={330} size={46} cor={C.fita} />
      <Rotulo r={28.3} texto="✓ detector de calor" top={420} size={50} />
      <Rotulo r={29.6} texto="✓ radar" top={500} size={50} />
      <Rotulo r={30.3} texto="✓ sensor de vibração" top={580} size={50} />
      <Rotulo r={31.6} texto="✓ campo magnético" top={660} size={50} />
      <Rotulo r={33.0} texto="✓ fechadura com milhões de combinações" top={740} size={44} />
    </Plano>
    <Plano r={[35.8, 38.4]}>
      <Cheia src="an2-caixas" r={[35.8, 38.4]} credito={CR} cinza={false} pos="30% 50%" zoom={[1.1, 1.0]} a={0.3} />
      <Carimbo r={36.6} texto="IMPOSSÍVEL" y={760} rot={-8} size={110} />
    </Plano>
    <Plano r={[38.4, 42.7]}>
      <Cheia src="an2-rua" r={[38.4, 42.7]} credito={CR} cinza={false} pos="55% 50%" zoom={[1.0, 1.08]} />
      <Rotulo r={38.4} texto="MAS UM HOMEM JÁ ESTAVA LÁ DENTRO" top={330} size={44} cor={C.fita} />
      <Faixa r={40.6} texto="HÁ MAIS DE 2 ANOS" top={420} size={64} />
    </Plano>

    {/* ── O INFILTRADO ── */}
    <Plano r={[42.7, 49.9]}>
      <Foto src="an2-jornal" r={[42.7, 49.9]} credito={CR} top={420} w={900} h={760} pos="35% 30%" zoom={[1.0, 1.08]} />
      <Titulo r={42.7} top={230} size={66}>LEONARDO NOTARBARTOLO</Titulo>
      <Rotulo r={45.3} texto="italiano · alugou uma sala no próprio prédio" top={1200} size={36} />
    </Plano>
    <Plano r={[49.9, 58.4]}>
      <Cheia src="an2-notar" r={[49.9, 58.4]} credito={CR} cinza={false} pos="50% 30%" zoom={[1.0, 1.1]} />
      <Rotulo r={49.9} texto="DIZIA SER COMERCIANTE" top={330} size={44} cor={C.fita} />
      <Rotulo r={51.0} texto="entrava e saía todo dia, sem suspeita" top={410} size={40} />
      <Carimbo r={55.5} texto="LADRÃO" y={1150} rot={-6} size={110} />
    </Plano>
    <Plano r={[58.4, 64.7]}>
      <Cheia src="an2-fichas" r={[58.4, 64.7]} credito={CR} cinza={false} pos="50% 40%" zoom={[1.1, 1.0]} />
      <Rotulo r={58.4} texto="A QUADRILHA FICOU CONHECIDA COMO" top={320} size={40} cor={C.fita} />
      <Faixa r={59.6} texto="A ESCOLA DE TURIM" top={400} size={70} />
      <Rotulo r={62.7} texto="estudaram cada detalhe do cofre" top={1170} size={42} />
    </Plano>

    {/* ── O ROUBO ── */}
    <Plano r={[64.7, 70.4]}>
      <Cheia src="an2-aereo" r={[64.7, 70.4]} credito={CR} cinza={false} pos="55% 50%" zoom={[1.0, 1.1]} a={0.45} />
      <Hora r={65.4} hora="15–16/02/2003" top={420} sub="fim de semana" />
      <Rotulo r={68.2} texto="o bairro dos diamantes está vazio" top={1150} size={42} />
    </Plano>
    <Plano r={[70.4, 75.5]}>
      <Cheia src="an-cofre" r={[70.4, 75.5]} credito={CR} cinza={false} pos="40% 50%" zoom={[1.0, 1.1]} a={0.3} />
      <Rotulo r={70.5} texto="UM SENSOR DE CADA VEZ" top={330} size={48} cor={C.fita} />
      <Faixa r={73.8} texto="E ABREM O COFRE" top={410} size={66} />
    </Plano>
    <Plano r={[75.5, 82.6]}>
      <Cena r={[75.5, 82.6]} from={21.5} a={0.5} />
      <Contador r={76.6} ate={77.6} valor={123} sufixo="" top={360} size={190} />
      <Rotulo r={77.7} texto="DAS 160 CAIXAS ARROMBADAS" top={580} size={48} />
      <Rotulo r={80.1} texto="diamantes · ouro · joias · dinheiro" top={1160} size={42} />
    </Plano>
    <Plano r={[82.6, 88.2]}>
      <Cheia src="an2-cofre-cor" r={[82.6, 88.2]} credito={CR} cinza={false} pos="50% 55%" zoom={[1.0, 1.12]} a={0.25} />
      <Rotulo r={82.7} texto="SEGUNDA-FEIRA DE MANHÃ" top={330} size={46} cor={C.fita} />
      <Faixa r={85.5} texto="O CHÃO COBERTO DE CAIXAS VAZIAS" top={410} size={50} />
    </Plano>
    <Plano r={[88.2, 95.7]}>
      <Cheia src="an2-cofre-pb" r={[88.2, 95.7]} credito={CR} cinza={false} pos="60% 50%" zoom={[1.0, 1.12]} a={0.35} />
      <Rotulo r={88.3} texto="PREJUÍZO ESTIMADO" top={330} size={44} cor={C.fita} />
      <Titulo r={89.9} top={400} size={96}>+ US$ 100 MILHÕES</Titulo>
      <Rotulo r={92.7} texto="o maior roubo de diamantes da história" top={1160} size={42} />
    </Plano>

    {/* ── O LIXO ── */}
    <Plano r={[95.7, 101.5]}>
      <Cheia src="an2-cofre-cor" r={[95.7, 101.5]} credito={CR} cinza={false} pos="30% 55%" zoom={[1.1, 1.0]} a={0.35} />
      <Rotulo r={95.8} texto="PARECIA O CRIME PERFEITO" top={330} size={46} cor={C.fita} />
      <Faixa r={99.0} texto="ATÉ QUE ALGUÉM SE LIVROU DO LIXO" top={410} size={50} />
    </Plano>
    <Plano r={[101.5, 107.5]}>
      <Cena r={[101.5, 107.5]} from={52.6} a={0.2} />
      <Rotulo r={101.6} texto="NA FUGA" top={330} size={48} cor={C.fita} />
      <Grande r={103.0} top={410} size={58}>sacos de lixo jogados perto da rodovia Antuérpia–Bruxelas</Grande>
    </Plano>
    <Plano r={[107.5, 111.9]}>
      <Cena r={[107.5, 111.9]} from={7.0} />
      <Rotulo r={107.6} texto="O DONO DO TERRENO ABRE OS SACOS" top={330} size={42} cor={C.fita} />
      <Faixa r={110.0} texto="E CHAMA A POLÍCIA" top={410} size={66} />
    </Plano>
    <Plano r={[111.9, 121.7]}>
      <Cheia src="an2-lixo" r={[111.9, 121.7]} credito={CR} cinza={false} pos="50% 50%" zoom={[1.0, 1.1]} a={0.4} />
      <Rotulo r={111.9} texto="DENTRO DOS SACOS:" top={330} size={46} cor={C.fita} />
      <Rotulo r={112.7} texto="✓ papéis do Diamond Centre" top={410} size={46} />
      <Rotulo r={114.4} texto="✓ fitas de vídeo" top={485} size={46} />
      <Carimbo r={115.8} texto="SANDUÍCHE DE SALAME" y={760} rot={-6} size={78} />
      <Faixa r={118.3} texto="FOI ESSE LIXO QUE ENTREGOU A QUADRILHA" top={1080} size={40} />
    </Plano>

    {/* ── DESFECHO ── */}
    <Plano r={[121.7, 127.0]}>
      <Cheia src="an2-detet" r={[121.7, 127.0]} credito={CR} cinza={false} pos="50% 40%" zoom={[1.0, 1.08]} />
      <Rotulo r={121.8} texto="DIAS DEPOIS DO ROUBO" top={330} size={46} cor={C.fita} />
      <Rotulo r={123.1} texto="Notarbartolo volta ao Diamond Centre" top={400} size={42} />
      <Faixa r={125.2} texto="E É PRESO ALI MESMO" top={470} size={60} />
    </Plano>
    <Plano r={[127.0, 135.6]}>
      <Foto src="an2-jornal" r={[127.0, 135.6]} credito={CR} top={460} w={900} h={700} pos="40% 40%" zoom={[1.08, 1.0]} />
      <Titulo r={127.3} top={240} size={80}>10 ANOS DE PRISÃO</Titulo>
      <Rotulo r={129.5} texto="outros integrantes também foram condenados" top={350} size={36} />
      <Faixa r={132.8} texto="OS DIAMANTES NUNCA FORAM ACHADOS" top={1080} size={46} />
    </Plano>
    <Plano r={[135.6, 145.5]}>
      <Cheia src="an-lider" r={[135.6, 145.5]} credito={CR} cinza={false} pos="50% 30%" zoom={[1.0, 1.1]} />
      <Rotulo r={135.7} texto="ANOS DEPOIS, A VERSÃO DELE:" top={330} size={44} cor={C.fita} />
      <Faixa r={139.9} texto="“FOI FRAUDE DE SEGURO”" top={410} size={60} />
      <Carimbo r={143.8} texto="A POLÍCIA NUNCA ACREDITOU" y={1160} rot={-5} size={56} />
    </Plano>
    <Plano r={[145.5, 151.45]}>
      <Cheia src="an2-cofre-cor" r={[145.5, 151.45]} credito={CR} cinza={false} pos="50% 55%" zoom={[1.12, 1.0]} a={0.35} />
      <Rotulo r={145.6} texto="US$ 100 MILHÕES" top={340} size={58} />
      <Rotulo r={147.9} texto="UM COFRE IMPOSSÍVEL" top={430} size={58} />
      <Faixa r={149.7} texto="E UM SANDUÍCHE PELA METADE" top={520} size={54} />
    </Plano>
    <Plano r={[151.45, 300]} soco={false}>
      <Fechamento r={151.5} caso="Nº 028" status="NUNCA RECUPERADOS" pergunta="Os diamantes nunca foram encontrados." />
    </Plano>
  </Reel>
);

// capa: o cofre revirado + promessa (o que o vídeo entrega)
import { AbsoluteFill, Img, staticFile } from "remotion";
import { MONT, ELITE, SOMBRA } from "../kit";
export const CapaAntu: React.FC = () => (
  <AbsoluteFill style={{ background: C.preto }}>
    <Img src={staticFile("img/an2-cofre-cor.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "45% 55%" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.8) 75%)" }} />
    <div style={{ position: "absolute", left: 90, right: 90, top: 420, textAlign: "center" }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 110, lineHeight: 1.0, color: C.osso, textShadow: SOMBRA }}>US$ 100</div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 110, lineHeight: 1.05, color: C.osso, textShadow: SOMBRA }}>MILHÕES</div>
    </div>
    <div style={{ position: "absolute", left: 90, right: 90, top: 1140, textAlign: "center" }}>
      <div style={{ fontFamily: ELITE, fontSize: 42, lineHeight: 1.3, color: C.osso, textShadow: SOMBRA }}>em diamantes. Os ladrões foram pegos por causa de um</div>
      <div style={{ display: "inline-block", marginTop: 14, padding: "6px 26px 12px", background: C.lacre, fontFamily: MONT, fontWeight: 800, fontSize: 96, color: C.osso }}>SANDUÍCHE</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1460, textAlign: "center", fontFamily: "Playfair", fontWeight: 900, fontSize: 44, letterSpacing: "0.12em", color: C.osso }}>ÁLIBI</div>
  </AbsoluteFill>
);
