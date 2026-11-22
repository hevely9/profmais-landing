import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, Sequence, staticFile } from "remotion";
import palavras from "../../public/palavras-criciuma.json";
import { C, Carimbo, Clip, Contador, ELITE, Faixa, Foto, Fundo, Grande, Plano, Reel, Rotulo, SANS, SOMBRA, Titulo, TituloVivo, lin, mkCtx, q, useT } from "../kit";
import { Fechamento } from "../dossie";

// ÁLIBI · CASO Nº 019 — O ataque a Criciúma (SC), 30/11 → 01/12/2020. Imagens reais gravadas por moradores (TikTok),
// trechos de um policial do BOPE em podcast e fotos de TV com crédito. Fontes: Agência Brasil, CNN Brasil, NSC Total,
// NPR, Jovem Pan, TJSC (condenação de 27/11/2024: 17 réus, mais de 504 anos; cerca de R$ 130 milhões). Nada gráfico.
type Ws = { words: { text: string; start: number; end: number }[] };
export const ctxC = mkCtx({
  caso: "Nº 019", audio: "criciuma", words: (palavras as Ws).words, lead: 0.1, fimVozRaw: 159.96, final: "alibi", proximo: "NO PERFIL",
  cta: ["", ""],
  chave: /^(criciúma|escudo|bombas?|explosivos?|bope|dinheiro|polícia|matar|milharal|condenadas|primeira|morre|fuzis)/i,
  semLegenda: [[150.6, 240]],
  sfx: [
    { src: "impacto", r: 1.28, vol: 0.45 }, { src: "trava", r: 5.32, vol: 0.4 }, { src: "subida", r: 7.7, vol: 0.25 }, { src: "whoosh", r: 14.9, vol: 0.3 },
    { src: "whoosh", r: 20.3, vol: 0.25 }, { src: "impacto", r: 27.0, vol: 0.4 }, { src: "whoosh", r: 28.6, vol: 0.25 }, { src: "carimbo", r: 39.44, vol: 0.45 },
    { src: "coracao", r: 41.84, vol: 0.45 }, { src: "carimbo", r: 50.42, vol: 0.5 }, { src: "whoosh", r: 52.5, vol: 0.25 }, { src: "coracao", r: 60.04, vol: 0.45 },
    { src: "carimbo", r: 61.52, vol: 0.4 }, { src: "whoosh", r: 72.1, vol: 0.25 }, { src: "carimbo", r: 81.46, vol: 0.5 }, { src: "subida", r: 85.0, vol: 0.3 },
    { src: "carimbo", r: 90.4, vol: 0.5 }, { src: "whoosh", r: 92.3, vol: 0.25 }, { src: "impacto", r: 105.49, vol: 0.35 }, { src: "tique", r: 112.68, vol: 0.35 },
    { src: "tique", r: 113.84, vol: 0.35 }, { src: "impacto", r: 115.74, vol: 0.35 }, { src: "coracao", r: 121.2, vol: 0.45 }, { src: "whoosh", r: 125.4, vol: 0.25 },
    { src: "impacto", r: 136.12, vol: 0.45 }, { src: "carimbo", r: 144.08, vol: 0.5 }, { src: "impacto", r: 148.42, vol: 0.45 }, { src: "carimbo", r: 157.3, vol: 0.55 },
  ],
});

// vídeo real numa faixa recortada (sem marca/emoji), com tampas opcionais por cima de textos embutidos
const Real: React.FC<{ src: string; r: number; dur: number; from?: number; cropY: [number, number]; top: number; credito: string; etiqueta?: string; tapas?: [number, number, number, number, string][]; lento?: number }> =
  ({ src, r, dur, from = 0, cropY, top, credito, etiqueta, tapas = [], lento = 1 }) => {
  const { o } = useT();
  const h = cropY[1] - cropY[0];
  return <Sequence from={q(o(r))} durationInFrames={q(dur)} layout="none">
    <AbsoluteFill><OffthreadVideo src={staticFile(`v/${src}.mp4`)} startFrom={q(from)} playbackRate={lento} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(36px) brightness(0.4)", transform: "scale(1.2)" }} /></AbsoluteFill>
    <div style={{ position: "absolute", left: 0, top, width: 1080, height: h, overflow: "hidden", boxShadow: "0 24px 70px rgba(0,0,0,0.85)", borderTop: "4px solid #D9D2C0", borderBottom: "4px solid #D9D2C0" }}>
      <OffthreadVideo src={staticFile(`v/${src}.mp4`)} startFrom={q(from)} playbackRate={lento} muted style={{ position: "absolute", left: 0, top: -cropY[0], width: 1080, height: 1920 }} />
      {tapas.map(([x, y, w, hh, txt], i) => <div key={i} style={{ position: "absolute", left: x, top: y - cropY[0], width: w, height: hh, background: "#0A0A0B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 26, color: C.osso }}>{txt}</div>)}
      {etiqueta && <div style={{ position: "absolute", left: 24, top: 20, padding: "6px 14px", background: "#0A0A0B", fontFamily: SANS, fontWeight: 800, fontSize: 26, color: C.osso, display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 12, height: 12, borderRadius: 6, background: C.verm, display: "inline-block" }} />{etiqueta}</div>}
    </div>
    <div style={{ position: "absolute", right: 34, top: 1262, fontFamily: SANS, fontWeight: 600, fontSize: 17, color: "rgba(236,231,220,0.6)", textShadow: "0 1px 4px #000" }}>{credito}</div>
  </Sequence>;
};

const Ass: React.FC<{ r: number; texto: string; top?: number }> = ({ r, texto, top = 1000 }) => {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.05, o(r) + 0.6, Easing.out(Easing.cubic));
  return <div style={{ position: "absolute", left: 60, right: 60, top, textAlign: "center", opacity: k, fontFamily: ELITE, fontSize: 58, color: C.osso, textShadow: SOMBRA }}>{texto}</div>;
};

const CRED_MORADOR = "Reprodução · vídeo de morador (redes sociais)";
const CRED_POD = "Reprodução · policial do BOPE-SC em podcast (corte)";
// recortes (coordenadas no quadro 1080×1920 já convertido)
const POD: [number, number] = [60, 690];        // rosto do policial, sem a legenda embutida
const DRONE: [number, number] = [1220, 1920];   // imagem aérea do milharal (parte de baixo do corte)

export const Criciuma: React.FC = () => (
  <Reel ctx={ctxC}>
    {/* GANCHO — imagem real do comboio, gravada por morador */}
    <Plano r={[-0.1, 3.3]} forte>
      <Real src="cr-a4" r={-0.1} dur={3.4} from={6} cropY={[330, 1030]} top={430} credito={CRED_MORADOR} etiqueta="IMAGEM REAL · CRICIÚMA (SC)" />
      <TituloVivo top={120} size={84} destaque="CIDADE" linhas={[[["30", 0], ["HOMENS", 0.32]], [["ARMADOS", 0.7], ["TOMARAM", 1.28]], [["UMA", 1.76], ["CIDADE", 1.94]]]} />
    </Plano>
    <Plano r={[3.3, 7.6]}>
      <Foto src="cr-policia-cena" r={[3.3, 7.6]} credito="Reprodução · CNN Brasil (Criciúma, 01/12/2020)" top={330} w={760} h={780} pos="50% 40%" zoom={[1.0, 1.1]} />
      <Rotulo r={3.86} texto="E ANTES DE IR EMBORA…" top={200} size={44} cor={C.fita} />
      <Faixa r={5.32} texto="DEIXARAM BOMBAS ARMADAS" top={1150} size={56} />
    </Plano>
    <Plano r={[7.6, 14.9]}>
      <Real src="cr-a6" r={7.6} dur={7.3} from={30} cropY={POD} top={420} credito={CRED_POD} etiqueta="POLICIAL QUE DESARMOU AS BOMBAS" />
      <Rotulo r={7.66} texto="UM POLICIAL CONTOU O QUE VIU" top={250} size={44} cor={C.fita} />
      <Faixa r={12.4} texto="O QUE QUASE NINGUÉM SABE" top={1150} size={56} />
    </Plano>
    {/* a noite */}
    <Plano r={[14.9, 20.3]}>
      <Foto src="cr-comboio" r={[14.9, 20.3]} credito="Reprodução · SBT (noite do ataque)" top={560} w={1000} h={600} pos="50% 50%" zoom={[1.0, 1.12]} />
      <Titulo r={15.18} top={220} size={96}>CRICIÚMA (SC)</Titulo>
      <Rotulo r={17.32} texto="NOITE DE 30 DE NOVEMBRO DE 2020" top={400} size={42} cor={C.fita} />
    </Plano>
    <Plano r={[20.3, 25.2]}>
      <Real src="cr-a3" r={20.3} dur={4.9} from={0} cropY={[680, 1380]} top={430} credito={CRED_MORADOR} etiqueta="IMAGEM REAL · O COMBOIO" />
      <Rotulo r={20.48} texto="PERTO DA MEIA-NOITE…" top={300} size={46} cor={C.fita} />
      <Faixa r={22.18} texto="UM COMBOIO ENTRA NA CIDADE" top={1170} size={54} />
    </Plano>
    <Plano r={[25.2, 28.6]}>
      <Foto src="cr-fuzil-carro" r={[25.2, 28.6]} credito="Reprodução · Record News (noite do ataque)" top={460} w={1000} h={560} pos="50% 40%" zoom={[1.05, 1.18]} />
      <Rotulo r={25.34} texto="HOMENS ENCAPUZADOS" top={290} size={50} cor={C.fita} />
      <Faixa r={26.9} texto="FUZIS E ARMAS DE GUERRA" top={1090} size={58} />
    </Plano>
    <Plano r={[28.6, 36.0]}>
      <Foto src="cr-fogo" r={[28.6, 36.0]} credito="Reprodução · SBT (fogo nas ruas durante o ataque)" top={470} w={940} h={640} pos="50% 50%" zoom={[1.0, 1.12]} />
      <Rotulo r={29.44} texto="UMA PARTE VAI PRO BATALHÃO DA PM" top={250} size={40} cor={C.fita} />
      <Faixa r={32.3} texto="FOGO NUM CAMINHÃO NA FRENTE" top={340} size={52} />
      <Rotulo r={34.3} texto="pra travar a saída das viaturas" top={1150} size={44} />
    </Plano>
    <Plano r={[36.0, 41.75]}>
      <Clip src="c23073" r0={36.0} dur={5.75} a={0.6} />
      <Rotulo r={36.14} texto="O RESTO CERCA O" top={460} size={46} cor={C.fita} />
      <Titulo r={37.9} top={540} size={96}>BANCO DO BRASIL</Titulo>
      <Carimbo r={39.44} texto="EXPLOSIVOS" y={880} rot={-6} size={100} />
    </Plano>
    {/* os reféns */}
    <Plano r={[41.75, 44.65]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Grande r={41.84} top={600} size={80}>quem estava na rua…</Grande>
      <Titulo r={42.94} top={760} size={130} cor={C.verm}>VIROU ESCUDO</Titulo>
    </Plano>
    <Plano r={[44.65, 52.5]}>
      <Foto src="cr-refens" r={[44.65, 52.5]} credito="Reprodução · Toda Hora (reféns sentados na rua)" top={380} w={1000} h={700} pos="40% 50%" zoom={[1.0, 1.12]} />
      <Rotulo r={44.7} texto="MORADORES E ATÉ" top={200} size={44} cor={C.fita} />
      <Rotulo r={45.76} texto="FUNCIONÁRIOS DA PREFEITURA" top={270} size={44} />
      <Carimbo r={50.42} texto="ESCUDO HUMANO" y={1180} rot={-5} size={90} />
    </Plano>
    <Plano r={[52.5, 59.9]}>
      <Real src="cr-a2" r={52.5} dur={7.4} from={2} cropY={[760, 1460]} top={430} credito={CRED_MORADOR} etiqueta="GRAVADO DA JANELA DE UM PRÉDIO" />
      <Rotulo r={52.6} texto="DOS PRÉDIOS, AS PESSOAS FILMAVAM" top={280} size={40} cor={C.fita} />
      <Rotulo r={56.58} texto="em silêncio" top={1150} size={50} />
      <Rotulo r={58.0} texto="com medo de levar um tiro" top={1220} size={40} cor={C.ossoE} />
    </Plano>
    <Plano r={[59.9, 64.8]}>
      <Clip src="c32790" r0={59.9} dur={4.9} a={0.55} />
      <Rotulo r={60.04} texto="UM POLICIAL MILITAR" top={520} size={56} />
      <Carimbo r={61.52} texto="BALEADO" y={700} rot={-6} size={100} />
      <Rotulo r={62.38} texto="E UM VIGILANTE FERIDO" top={880} size={52} cor={C.fita} />
    </Plano>
    <Plano r={[64.8, 72.1]}>
      <Real src="cr-a4" r={64.8} dur={7.3} from={14} cropY={[330, 1030]} top={430} credito={CRED_MORADOR} etiqueta="IMAGEM REAL · A FUGA" />
      <Titulo r={64.9} top={190} size={78}>QUASE 2 HORAS<br />DE TERROR</Titulo>
      <Faixa r={69.64} texto="A CIDADE EM PEDAÇOS" top={1170} size={58} />
    </Plano>
    {/* o dinheiro */}
    <Plano r={[72.1, 77.1]}>
      <Foto src="cr-dinheiro-rua" r={[72.1, 77.1]} credito="Reprodução · Record News (dinheiro na rua)" top={420} w={940} h={700} pos="50% 50%" zoom={[1.0, 1.12]} />
      <Rotulo r={72.16} texto="E DEIXANDO OUTRA COISA PRA TRÁS:" top={250} size={40} cor={C.fita} />
      <Faixa r={74.9} texto="DINHEIRO ESPALHADO NA RUA" top={1170} size={54} />
    </Plano>
    <Plano r={[77.1, 80.0]}>
      <Foto src="cr-dinheiro-pilha" r={[77.1, 80.0]} credito="Reprodução · CNN Brasil" top={420} w={940} h={640} pos="50% 60%" zoom={[1.05, 1.15]} />
      <Rotulo r={77.2} texto="MUITA GENTE SAIU DE CASA PRA PEGAR" top={260} size={38} cor={C.fita} />
    </Plano>
    <Plano r={[80.0, 85.0]}>
      <Foto src="cr-dinheiro-mao" r={[80.0, 85.0]} credito="Reprodução · Gazeta do Povo" top={560} w={620} h={620} pos="50% 50%" zoom={[1.0, 1.1]} />
      <Rotulo r={80.1} texto="4 MORADORES DETIDOS COM" top={240} size={44} cor={C.fita} />
      <Contador r={82.68} ate={83.7} valor={810000} prefixo="R$ " top={320} size={104} cor={C.verm} />
    </Plano>
    {/* as bombas */}
    <Plano r={[85.0, 92.25]}>
      <Foto src="cr-policia-cena" r={[85.0, 92.25]} credito="Reprodução · CNN Brasil (perto do banco, 01/12/2020)" top={420} w={760} h={760} pos="50% 40%" cinza zoom={[1.05, 1.18]} />
      <Titulo r={85.06} top={210} size={70}>O PIOR AINDA<br />ESTAVA ALI</Titulo>
      <Carimbo r={90.4} texto="EXPLOSIVOS ARMADOS" y={1220} rot={-4} size={74} />
    </Plano>
    <Plano r={[92.25, 98.6]}>
      <Real src="cr-a6" r={92.25} dur={6.35} from={0} cropY={POD} top={420} credito={CRED_POD} etiqueta="POLICIAL DO BOPE-SC · PODCAST" />
      <Rotulo r={92.36} texto="ELE ESTAVA LÁ" top={270} size={46} cor={C.fita} />
      <Faixa r={96.16} texto="PRA QUE SERVIAM AS BOMBAS?" top={1150} size={54} />
    </Plano>
    {/* fala real 1 */}
    <Plano r={[98.6, 109.9]} soco={false}>
      <Real src="cr-a6" r={98.6} dur={11.3} from={7.28 - 0.05} cropY={POD} top={420} credito={CRED_POD} etiqueta="A FALA DO POLICIAL" />
      <Rotulo r={98.7} texto="NAS PALAVRAS DELE:" top={270} size={44} cor={C.fita} />
      <Faixa r={105.4} texto="“PRA MATAR POLICIAL”" top={1150} size={60} />
    </Plano>
    <Plano r={[109.9, 121.25]}>
      <Fundo />
      <Rotulo r={110.36} texto="ELE MESMO DESARMOU A PRIMEIRA" top={330} size={42} cor={C.fita} />
      <Titulo r={112.68} top={430} size={110}>NA MÃO.</Titulo>
      <Titulo r={113.84} top={570} size={110} cor={C.verm}>SEM ROBÔ.</Titulo>
      <Contador r={115.74} ate={116.4} valor={45} prefixo="TRAJE DE " sufixo=" KG" top={760} size={80} />
      <Grande r={117.54} top={930} size={50}>que, segundo ele, não salvaria<br />ninguém naquela distância</Grande>
    </Plano>
    {/* fala real 2 */}
    <Plano r={[121.25, 125.4]} soco={false}>
      <Real src="cr-a6" r={121.25} dur={4.15} from={177.62 - 0.12} cropY={POD} top={420} credito={CRED_POD} etiqueta="A FALA DO POLICIAL" />
    </Plano>
    {/* o fim */}
    <Plano r={[125.4, 133.3]}>
      <Real src="cr-a6" r={125.4} dur={7.9} from={60} cropY={DRONE} top={430} credito="Reprodução · imagem aérea do milharal (via corte de podcast)" etiqueta="IMAGEM REAL · OS CARROS DA FUGA" />
      <Rotulo r={125.52} texto="HORAS DEPOIS…" top={230} size={46} cor={C.fita} />
      <Faixa r={129.3} texto="ABANDONADOS NUM MILHARAL" top={310} size={50} />
      <Rotulo r={130.3} texto="NOVA VENEZA (SC) · ~20 KM DALI" top={1165} size={38} />
    </Plano>
    <Plano r={[133.3, 141.2]}>
      <Clip src="c18249" r0={133.3} dur={7.9} a={0.6} />
      <Rotulo r={133.42} texto="SEGUNDO A JUSTIÇA, A QUADRILHA LEVOU" top={420} size={36} cor={C.fita} />
      <Contador r={136.12} ate={136.9} valor={130} prefixo="R$ " sufixo=" MILHÕES" top={500} size={88} cor={C.verm} />
      <Rotulo r={138.58} texto="UM DOS MAIORES ROUBOS DO PAÍS" top={720} size={46} />
    </Plano>
    <Plano r={[141.2, 150.6]}>
      <Clip src="c47803" r0={141.2} dur={9.4} a={0.55} />
      <Titulo r={141.3} top={300} size={84}>NOVEMBRO DE 2024</Titulo>
      <Contador r={144.08} ate={144.6} valor={17} sufixo=" CONDENADOS" top={460} size={100} cor={C.verm} />
      <Rotulo r={146.52} texto="SOMANDO AS PENAS:" top={680} size={44} cor={C.fita} />
      <Contador r={148.42} ate={149.0} valor={500} prefixo="+ DE " sufixo=" ANOS" top={760} size={110} />
    </Plano>
    {/* bordão */}
    <Plano r={[150.6, 157.1]}>
      <Foto src="cr-refens" r={[150.6, 157.1]} credito="Reprodução · Toda Hora" top={320} w={1000} h={600} pos="40% 50%" cinza zoom={[1.05, 1.15]} />
      <Grande r={150.76} top={950} size={72}>Onde você estava<br />naquela noite?</Grande>
      <Ass r={154.34} top={1150} texto="…quem estava na rua virou escudo." />
    </Plano>
    <Plano r={[157.1, 240]} soco={false}>
      <Fechamento r={157.2} caso="Nº 019" status="17 CONDENADOS" pergunta="Criciúma, 30 de novembro de 2020." />
    </Plano>
  </Reel>
);
