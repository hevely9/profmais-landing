import React from "react";
import { AbsoluteFill } from "remotion";
import palavras from "../../public/palavras-lobo.json";
import { Assinatura, C, Carimbo, Cheia, Clip, Contador, Faixa, Foto, Fundo, Grande, Papel, Cabec, Linha, Plano, Reel, Rotulo, Titulo, TituloVivo, achar, mkCtx } from "../kit";
import { Devido, Grafico } from "../ui";

const words = (palavras as { words: { text: string; start: number; end: number }[] }).words;
const w = achar(words);
export const ctx = mkCtx({
  caso: "Nº 014", audio: "lobo", words, lead: 0.1, fimVozRaw: 78.95, final: "alibi", proximo: "NO PERFIL",
  cta: ["Ele merecia virar filme?", "comenta: SIM ou NÃO ↓"],
  chave: /^(existe|vítimas|topo|cliente|iate|fbi|22|110|1\.513|pequena|dicaprio|vender)$/i,
  semLegenda: [[71.6, 90]],
  sfx: [
    { src: "impacto", r: 1.1, vol: 0.4 }, { src: "whoosh", r: 5.15, vol: 0.25 }, ...[9.2, 10.4, 11.9, 13.0].map((r) => ({ src: "tecla", r, vol: 0.25 })),
    { src: "subida", r: 18.5, vol: 0.3 }, { src: "impacto", r: 23.22, vol: 0.5 }, { src: "carimbo", r: 24.4, vol: 0.5 },
    { src: "whoosh", r: 25.8, vol: 0.25 }, { src: "whoosh", r: 27.8, vol: 0.25 }, { src: "whoosh", r: 28.85, vol: 0.25 },
    { src: "coracao", r: 35.0, vol: 0.5 }, { src: "carimbo", r: 42.58, vol: 0.5 }, { src: "trava", r: 46.24, vol: 0.45 },
    ...Array.from({ length: 10 }, (_, i) => ({ src: "tique", r: 48.8 + i * 0.09, vol: 0.25 })), ...Array.from({ length: 10 }, (_, i) => ({ src: "tique", r: 52.6 + i * 0.12, vol: 0.25 })),
    { src: "impacto", r: 59.46, vol: 0.45 }, { src: "whoosh", r: 61.0, vol: 0.3 }, { src: "subida", r: 68.0, vol: 0.25 },
  ],
});

export const Lobo: React.FC = () => (
  <Reel ctx={ctx}>
    {/* GANCHO — foto real do Belfort entrando com impacto, gráfico da bolsa ao fundo */}
    <Plano r={[-0.1, 2.3]} forte>
      <Foto src="l-belfort" fundo="c47016" alt={{ clip: "c47016" }} r={[-0.1, 2.3]} credito="Artur Shakhnazarov · CC0" top={560} w={900} h={660} zoom={[1.1, 1.25]} pos="62% 30%" cinza />
      <TituloVivo top={180} size={90} destaque="EXISTE" linhas={[[["O", 0], ["LOBO", 0.12], ["DE", 0.44]], [["WALL", 0.56], ["STREET", 0.8]], [["EXISTE", 1.1]]]} />
    </Plano>
    <Plano r={[2.3, 5.2]}>
      <Clip src="c46117" r0={2.3} dur={2.9} a={0.5} />
      <Faixa r={w("vítimas") - 0.1} texto="E AS VÍTIMAS" top={420} size={80} />
      <Titulo r={w("esperam") - 0.2} top={560} size={70}>AINDA ESPERAM<br />O DINHEIRO</Titulo>
    </Plano>
    <Plano r={[5.2, 8.6]}>
      <Cheia src="l-nyse" alt={{ clip: "c4330" }} r={[5.2, 8.6]} credito="Jeffrey Zeldman · CC BY 2.0" zoom={[1.05, 1.18]} a={0.45} />
      <Titulo r={w("jordan") - 0.1} top={330} size={96}>JORDAN BELFORT</Titulo>
      <Rotulo r={w("nova") - 0.1} texto="NOVA YORK · ANOS 90" top={470} size={44} cor={C.verm} />
    </Plano>
    <Plano r={[8.6, 11.4]}>
      <Clip src="c23073" r0={8.6} dur={2.8} a={0.45} />
      <Rotulo r={w("corretora") - 0.1} texto="A CORRETORA" top={340} size={40} cor={C.ossoE} />
      <Titulo r={w("stratton") - 0.1} top={410} size={90}>STRATTON<br />OAKMONT</Titulo>
    </Plano>
    <Plano r={[11.4, 14.1]}>
      <Clip src="c16109" r0={11.4} dur={2.7} a={0.45} />
      <Titulo r={w("centenas") - 0.1} top={380} size={84}>CENTENAS DE<br />VENDEDORES</Titulo>
      <Rotulo r={w("telefone") - 0.1} texto="no telefone, o dia inteiro" top={600} size={40} />
    </Plano>
    <Plano r={[14.1, 18.0]}>
      <Grafico r={14.3} marcas={[[w("comprar") - 0.1, "1 · COMPRA BARATO"]]} />
      <Titulo r={w("método") - 0.2} top={240} size={90}>O MÉTODO</Titulo>
    </Plano>
    <Plano r={[18.0, 22.5]}>
      <Grafico r={14.3} marcas={[[14.0, "1 · COMPRA BARATO"], [w("convencer") - 0.1, "2 · CONVENCE MILHARES"], [w("topo") - 0.3, "3 · VENDE NO TOPO"]]} />
    </Plano>
    <Plano r={[22.5, 25.8]}>
      <Grafico r={14.3} queda={w("despencava") - 0.1} marcas={[[14.0, "1 · COMPRA BARATO"], [14.0, "2 · CONVENCE MILHARES"], [14.0, "3 · VENDE NO TOPO"]]} />
      <Carimbo r={w("cliente") - 0.2} texto="QUEM PERDIA: O CLIENTE" y={1240} rot={-5} size={58} />
    </Plano>
    <Plano r={[25.8, 27.8]}>
      <Clip src="c51562" r0={25.8} dur={2.0} a={0.4} />
      <Titulo r={w("festas") - 0.05} top={420} size={120}>FESTAS</Titulo>
    </Plano>
    <Plano r={[27.8, 28.9]}>
      <Clip src="c6952" r0={27.8} dur={1.1} a={0.4} />
      <Titulo r={w("helicóptero") - 0.1} top={420} size={92}>HELICÓPTERO</Titulo>
    </Plano>
    <Plano r={[28.9, 31.0]}>
      <Clip src="c47193" r0={28.9} dur={2.1} a={0.4} />
      <Titulo r={w("iate") - 0.1} top={380} size={96}>UM IATE<br />AFUNDADO</Titulo>
      <Rotulo r={w("mediterrâneo") - 0.1} texto="Mediterrâneo, 1996" top={600} size={40} />
    </Plano>
    <Plano r={[31.0, 34.9]}>
      <Foto src="l-dicaprio" alt={{ clip: "c4443" }} r={[31.0, 34.9]} credito="Georges Biard · CC BY-SA 3.0" top={360} w={640} h={820} zoom={[1.0, 1.12]} pos="50% 25%" cinza />
      <Rotulo r={w("filme") - 0.2} texto="NO FILME: LEONARDO DICAPRIO" top={220} size={36} cor={C.ossoE} />
      <Faixa r={w("aconteceu") - 0.1} texto="ACONTECEU DE VERDADE" top={1120} size={62} />
    </Plano>
    <Plano r={[34.9, 39.4]}>
      <Fundo cor={C.preto} />
      <Grande r={w("mas") - 0.05} top={560} size={74}>mas o que o filme<br />quase não mostra…</Grande>
      <Faixa r={w("vítimas", 1) - 0.15} texto="SÃO AS VÍTIMAS" top={880} size={74} />
    </Plano>
    <Plano r={[39.4, 42.4]}>
      <Fundo />
      <Papel top={430} h={600} rot={-1}>
        <Cabec sup="EUA × JORDAN BELFORT" titulo="1999" size={90} />
        <Linha r={w("declarou") - 0.2} texto="— se declarou culpado" size={42} />
      </Papel>
    </Plano>
    <Plano r={[42.4, 45.1]}>
      <Fundo />
      <Papel top={430} h={600} rot={-1}>
        <Cabec sup="EUA × JORDAN BELFORT" titulo="1999" size={90} />
        <Linha r={39.0} texto="— se declarou culpado" size={42} />
        <Linha r={w("fraude") - 0.1} texto="— fraude" size={42} />
        <Linha r={w("lavagem") - 0.1} texto="— lavagem de dinheiro" size={42} />
      </Papel>
      <Carimbo r={w("culpado") - 0.02} texto="CULPADO" y={1100} rot={-8} size={110} />
    </Plano>
    <Plano r={[45.1, 48.6]}>
      <Clip src="c47802" r0={45.1} dur={3.5} a={0.45} />
      <Titulo r={w("fbi") - 0.3} top={380} size={84}>COLABOROU<br />COM O FBI</Titulo>
      <Rotulo r={w("sócios") - 0.3} texto="contra os próprios sócios" top={600} size={44} cor={C.verm} />
    </Plano>
    <Plano r={[48.6, 50.7]}>
      <Fundo cor={C.preto} />
      <Contador r={48.9} ate={49.8} valor={22} top={560} size={260} />
      <Rotulo r={49.6} texto="MESES PRESO" top={850} size={60} />
    </Plano>
    <Plano r={[50.7, 54.4]}>
      <Clip src="c46117" r0={50.7} from={3} dur={3.7} a={0.55} />
      <Rotulo r={w("juiz") - 0.1} texto="O JUIZ MANDOU DEVOLVER" top={420} size={40} cor={C.ossoE} />
      <Contador r={52.4} ate={53.8} valor={110} prefixo="US$ " sufixo=" MI" top={500} size={150} cor={C.verm} />
    </Plano>
    <Plano r={[54.4, 57.0]}>
      <Fundo />
      <Titulo r={54.45} top={520} size={150}>1.513</Titulo>
      <Rotulo r={55.4} texto="VÍTIMAS" top={720} size={66} />
    </Plano>
    <Plano r={[57.0, 61.0]}>
      <Devido r={57.1} />
      <Rotulo r={w("reportagens") - 0.2} texto="SEGUNDO REPORTAGENS" top={300} size={36} cor={C.ossoE} />
      <Faixa r={w("pequena") - 0.2} texto="SÓ UMA PEQUENA PARTE" top={1270} size={52} />
    </Plano>
    <Plano r={[61.0, 64.0]}>
      <Foto src="l-belfort" alt={{ clip: "c4330" }} r={[61.0, 64.0]} credito="Artur Shakhnazarov · CC0" top={400} w={760} h={760} zoom={[1.2, 1.4]} pos="62% 30%" cinza />
      <Titulo r={61.05} top={190} size={76}>E O BELFORT<br />DE VERDADE?</Titulo>
    </Plano>
    <Plano r={[64.0, 67.0]}>
      <Foto src="l-dicaprio" alt={{ clip: "c4443" }} r={[64.0, 67.0]} credito="Georges Biard · CC BY-SA 3.0" top={420} w={600} h={760} zoom={[1.05, 1.15]} pos="50% 25%" cinza />
      <Rotulo r={64.05} texto="APARECE NO FIM DO FILME" top={230} size={42} />
      <Faixa r={w("apresentando") - 0.1} texto="APRESENTANDO O DICAPRIO" top={1200} size={52} />
    </Plano>
    <Plano r={[67.0, 69.4]}>
      <Clip src="c9585" r0={67.0} dur={2.4} a={0.45} />
      <Titulo r={w("hoje") - 0.1} top={400} size={110}>HOJE?</Titulo>
      <Rotulo r={w("palestras") - 0.2} texto="PALESTRAS" top={560} size={70} />
    </Plano>
    <Plano r={[69.4, 71.6]}>
      <Clip src="c9585" r0={69.4} from={3} dur={2.2} a={0.5} />
      <Faixa r={w("como") - 0.2} texto="SOBRE COMO VENDER" top={600} size={74} />
    </Plano>
    <Plano r={[71.6, 95]} soco={false}>
      <Clip src="c4330" r0={71.6} dur={7} a={0.6} />
      <Grande r={71.74} top={640} size={86}>Onde você estava<br />naquela noite?</Grande>
      <Assinatura r={w("esse") - 0.05} />
    </Plano>
  </Reel>
);
export const _u = [AbsoluteFill];
