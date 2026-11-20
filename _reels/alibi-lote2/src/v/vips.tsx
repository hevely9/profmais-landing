import React from "react";
import palavras from "../../public/palavras-vips.json";
import { Assinatura, C, Carimbo, Cheia, Clip, Contador, Faixa, Foto, Fundo, Grande, Papel, Cabec, Linha, Plano, Reel, Rotulo, Titulo, TituloVivo, achar, mkCtx } from "../kit";
import { Cracha, Ficha, Flashes } from "../ui";

const words = (palavras as { words: { text: string; start: number; end: number }[] }).words;
const w = achar(words);
export const ctx = mkCtx({
  caso: "Nº 012", audio: "vips", words, lead: 0.1, fimVozRaw: 66.6, final: "alibi", proximo: "NO PERFIL",
  cta: ["Você teria acreditado nele?", "comenta: SIM ou NÃO ↓"],
  chave: /^(gol|tv|vip|herdeiro|helicóptero|marcelo|federal|absurdo|tráfico|12|seis|filme)$/i,
  semLegenda: [[58.9, 70]],
  sfx: [
    { src: "whoosh", r: 2.35, vol: 0.3 }, { src: "impacto", r: 4.92, vol: 0.4 }, { src: "whoosh", r: 7.25, vol: 0.25 },
    { src: "trava", r: 11.52, vol: 0.35 }, ...[17.84, 18.2, 18.5, 18.8].map((r) => ({ src: "tique", r, vol: 0.35 })),
    { src: "whoosh", r: 24.35, vol: 0.3 }, { src: "carimbo", r: 28.72, vol: 0.55 }, ...[31.0, 31.4, 31.8, 33.1, 33.4].map((r) => ({ src: "tecla", r, vol: 0.28 })),
    { src: "trava", r: 35.44, vol: 0.45 }, { src: "coracao", r: 38.4, vol: 0.5 }, { src: "subida", r: 39.4, vol: 0.3 }, { src: "impacto", r: 41.2, vol: 0.45 },
    ...Array.from({ length: 12 }, (_, i) => ({ src: "tique", r: 46.6 + i * 0.09, vol: 0.25 })), { src: "carimbo", r: 49.88, vol: 0.45 },
    { src: "whoosh", r: 50.75, vol: 0.25 }, { src: "coracao", r: 55.0, vol: 0.45 },
  ],
});

export const Vips: React.FC = () => (
  <Reel ctx={ctx}>
    {/* GANCHO — avião da Gol entrando com impacto, decolagem ao fundo, texto com a voz */}
    <Plano r={[-0.1, 2.4]} forte>
      <Foto src="v-gol" fundo="c7031" alt={{ clip: "c7031" }} r={[-0.1, 2.4]} credito="Ecliptics · CC BY-SA 4.0" top={560} w={960} h={600} zoom={[1.0, 1.15]} cinza />
      <TituloVivo top={170} size={82} destaque="GOL" linhas={[[["ELE", 0], ["FINGIU", 0.16], ["SER", 0.78]], [["FILHO", 1.02], ["DO", 1.42], ["DONO", 1.62]], [["DA", 1.96], ["GOL", 2.1]]]} />
    </Plano>
    <Plano r={[2.4, 4.8]}>
      <Clip src="c22998" r0={2.4} dur={2.4} a={0.45} />
      <Faixa r={w("deu") - 0.1} texto="E DEU ENTREVISTA NA TV" top={420} size={62} />
    </Plano>
    <Plano r={[4.8, 7.3]}>
      <Cheia src="v-recife" alt={{ clip: "c5227" }} r={[4.8, 7.3]} credito="Elvis Boaventura · CC BY 3.0" zoom={[1.1, 1.25]} cinza={false} a={0.45} />
      <Titulo r={w("recife") - 0.1} top={360} size={130}>RECIFE</Titulo>
      <Rotulo r={w("carnaval") - 0.1} texto="CARNAVAL · 2001" top={540} size={48} cor={C.verm} />
    </Plano>
    <Plano r={[7.3, 10.9]}>
      <Clip src="c51531" r0={7.3} dur={3.6} a={0.45} />
      <Titulo r={w("camarote") - 0.1} top={360} size={104}>CAMAROTE VIP</Titulo>
      <Rotulo r={w("rapaz") - 0.1} texto="aparece um rapaz de 24 anos" top={510} size={40} />
    </Plano>
    <Plano r={[10.9, 13.2]}><Cracha r={11.0} /></Plano>
    <Plano r={[13.2, 16.5]}>
      <Foto src="v-gol2" alt={{ clip: "c27989", from: 5 }} r={[13.2, 16.5]} credito="Halley Pacheco de Oliveira · CC BY-SA 3.0" top={460} w={960} h={640} zoom={[1.05, 1.2]} cinza />
      <Faixa r={w("herdeiro") - 0.1} texto="O HERDEIRO" top={250} size={84} />
      <Rotulo r={14.6} texto="de uma das maiores aéreas do país" top={1150} size={34} />
    </Plano>
    <Plano r={[16.5, 19.0]}>
      <Clip src="c5227" r0={16.5} dur={2.5} a={0.45} />
      <Flashes r={w("foto") - 0.05} />
      <Titulo r={16.55} top={380} size={78}>TODO MUNDO QUERIA<br />UMA FOTO COM ELE</Titulo>
    </Plano>
    <Plano r={[19.0, 21.3]}>
      <Clip src="c51554" r0={19.0} dur={2.3} a={0.45} />
      <Rotulo r={w("famosos") - 0.05} texto="FAMOSOS" top={420} size={66} />
      <Rotulo r={w("empresários") - 0.05} texto="EMPRESÁRIOS" top={520} size={66} />
    </Plano>
    <Plano r={[21.3, 24.4]}>
      <Foto src="v-amaury" alt={{ clip: "c22998" }} r={[21.3, 24.4]} credito="Sérgio Savarese · CC BY 2.0" top={430} w={940} h={700} zoom={[1.0, 1.12]} cinza />
      <Titulo r={w("amaury") - 0.1} top={190} size={84}>AMAURY JR.</Titulo>
      <Faixa r={w("entrevistou") - 0.1} texto="ENTREVISTOU O “HERDEIRO”" top={1150} size={54} />
    </Plano>
    <Plano r={[24.4, 28.0]}>
      <Clip src="c6926" r0={24.4} dur={3.6} a={0.4} />
      <Titulo r={w("pilotou") - 0.15} top={360} size={84}>PILOTOU UM<br />HELICÓPTERO</Titulo>
      <Rotulo r={w("bordo") - 0.5} texto="com o apresentador a bordo" top={580} size={40} />
    </Plano>
    <Plano r={[28.0, 30.5]}>
      <Cracha r={27.0} falso={w("constantino", 1) - 0.1} />
      <Carimbo r={w("não") - 0.02} texto="FALSO" y={930} rot={-10} size={150} />
    </Plano>
    <Plano r={[30.5, 32.9]}>
      <Ficha sup="IDENTIDADE REAL" nome="MARCELO NASCIMENTO DA ROCHA" linhas={[[31.6, "— 24 anos"], [33.0, "— de Maringá (PR)"]]} />
    </Plano>
    <Plano r={[32.9, 34.4]}>
      <Cheia src="v-maringa" alt={{ clip: "c4330" }} r={[32.9, 34.4]} credito="Luwikii2 · CC BY-SA 4.0" zoom={[1.05, 1.15]} a={0.4} />
      <Titulo r={32.95} top={380} size={110}>MARINGÁ · PR</Titulo>
    </Plano>
    <Plano r={[34.4, 37.9]}>
      <Clip src="c47803" r0={34.4} dur={3.5} a={0.45} />
      <Titulo r={w("polícia") - 0.1} top={360} size={90}>POLÍCIA FEDERAL</Titulo>
      <Carimbo r={w("prendeu") - 0.02} texto="PRESO · 2001" y={820} rot={-7} size={96} />
    </Plano>
    <Plano r={[37.9, 40.3]}>
      <Fundo cor={C.preto} />
      <Grande r={w("mas") - 0.05} top={660} size={80}>mas quem ele era<br />de verdade…</Grande>
    </Plano>
    <Plano r={[40.3, 42.0]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Faixa r={w("ainda", 2) - 0.1} texto="ERA AINDA MAIS ABSURDO" top={760} size={64} />
    </Plano>
    <Plano r={[42.0, 46.2]}>
      <Clip src="c24697" r0={42.0} dur={4.2} a={0.45} />
      <Rotulo r={w("contava") - 0.1} texto="SEGUNDO ELE, AOS 18 ANOS…" top={330} size={36} cor={C.ossoE} />
      <Titulo r={w("piloto") - 0.15} top={420} size={96}>PILOTO<br />DO TRÁFICO</Titulo>
    </Plano>
    <Plano r={[46.2, 48.4]}>
      <Fundo />
      <Rotulo r={46.25} texto="PRESO EM" top={560} size={44} cor={C.ossoE} />
      <Contador r={46.6} ate={47.6} valor={12} top={630} size={250} />
      <Rotulo r={47.5} texto="ESTADOS" top={900} size={56} />
    </Plano>
    <Plano r={[48.4, 50.8]}>
      <Clip src="c25261" r0={48.4} dur={2.4} a={0.45} />
      <Titulo r={w("fugiu") - 0.1} top={360} size={90}>FUGIU DA CADEIA</Titulo>
      <Carimbo r={w("vezes") - 0.05} texto="6 VEZES" y={800} rot={-8} size={130} />
    </Plano>
    <Plano r={[50.8, 54.0]}>
      <Foto src="v-wagner" alt={{ clip: "c22998" }} r={[50.8, 54.0]} credito="Harald Krichel · CC BY-SA 4.0" top={380} w={680} h={820} zoom={[1.0, 1.12]} pos="50% 25%" cinza />
      <Rotulo r={w("filme") - 0.1} texto="VIROU O FILME “VIPS”" top={230} size={44} cor={C.verm} />
      <Titulo r={w("wagner") - 0.1} top={1100} size={70}>WAGNER MOURA</Titulo>
    </Plano>
    <Plano r={[54.0, 56.6]}>
      <Fundo />
      <Papel top={560} h={400} rot={-1}>
        <Cabec sup="MARCELO NASCIMENTO DA ROCHA" titulo="1976 – 2025" />
        <Linha r={54.9} texto="morreu em dezembro de 2025" size={36} />
      </Papel>
    </Plano>
    <Plano r={[56.6, 58.9]}>
      <Fundo />
      <Titulo r={56.65} top={560} size={110}>49 ANOS</Titulo>
      <Rotulo r={57.0} texto="e uma vida inteira de personagens" top={760} size={36} cor={C.ossoE} />
    </Plano>
    <Plano r={[58.9, 80]} soco={false}>
      <Clip src="c51531" r0={58.9} from={4} dur={6} a={0.62} />
      <Grande r={58.98} top={640} size={86}>Onde você estava<br />naquela noite?</Grande>
      <Assinatura r={w("esse") - 0.05} />
    </Plano>
  </Reel>
);
