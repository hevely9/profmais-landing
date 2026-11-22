import React from "react";
import { Easing } from "remotion";
import palavras from "../../public/palavras-suzane.json";
import { C, Carimbo, Clip, Contador, ELITE, Faixa, Foto, Fundo, Grande, Papel, Cabec, Linha, Plano, Reel, Rotulo, SOMBRA, Titulo, TituloVivo, lin, mkCtx, useT } from "../kit";
import { ArquivoReal, Fechamento, Hora, Manchetes, Mural, Planta, VersaoFato } from "../dossie";

// ÁLIBI · CASO Nº 018 — Caso Richthofen contado pelo lado das vítimas (Manfred e Marísia), no embalo do documentário da Netflix (nov/2026).
// Fontes: Wikipedia (Richthofen case; Investigação do caso Richthofen), Gazeta do Povo, Observatório da Imprensa, DGABC, CNN Brasil,
// Terra, Correio Braziliense, Pipoca Moderna. Valor do cachê: "segundo a Folha" (não confirmado pela Netflix). Nada gráfico.
type Ws = { words: { text: string; start: number; end: number }[] };
export const ctxS = mkCtx({
  caso: "Nº 018", audio: "suzane", words: (palavras as Ws).words, lead: 0.1, fimVozRaw: 214.79, final: "alibi", proximo: "NO PERFIL",
  cta: ["Quem comete um crime deveria poder lucrar com ele?", "comenta: SIM ou NÃO ↓"],
  chave: /^(marísia|manfred|suzane|andreas|netflix|álibi|motel|polícia|dólares|fantástico|presa|aberto|ouvida|alarme|filha)$/i,
  semLegenda: [[199.89, 264.69]],
  sfx: [
    { src: "coracao", r: 3.4, vol: 0.4 }, { src: "whoosh", r: 7.75, vol: 0.25 }, { src: "whoosh", r: 19.6, vol: 0.3 }, { src: "impacto", r: 23.8, vol: 0.4 },
    ...Array.from({ length: 8 }, (_, i) => ({ src: "tique", r: 27.0 + i * 0.12, vol: 0.22 })), { src: "tecla", r: 30.8, vol: 0.3 }, { src: "tecla", r: 31.6, vol: 0.3 },
    { src: "tecla", r: 32.2, vol: 0.3 }, { src: "whoosh", r: 38.4, vol: 0.3 }, { src: "trava", r: 43.9, vol: 0.3 }, { src: "subida", r: 61.6, vol: 0.25 },
    { src: "coracao", r: 68.3, vol: 0.5 }, { src: "carimbo", r: 80.5, vol: 0.5 }, { src: "impacto", r: 81.6, vol: 0.45 }, { src: "tique", r: 87.84, vol: 0.4 },
    { src: "tecla", r: 89.82, vol: 0.3 }, { src: "tique", r: 93.76, vol: 0.4 }, { src: "trava", r: 104.02, vol: 0.4 }, { src: "coracao", r: 106.2, vol: 0.45 },
    { src: "carimbo", r: 108.82, vol: 0.35 }, { src: "carimbo", r: 110.82, vol: 0.35 }, { src: "carimbo", r: 112.7, vol: 0.35 }, { src: "carimbo", r: 117.0, vol: 0.5 },
    { src: "whoosh", r: 118.6, vol: 0.3 }, { src: "impacto", r: 122.74, vol: 0.4 }, { src: "carimbo", r: 127.54, vol: 0.5 }, { src: "carimbo", r: 128.52, vol: 0.5 },
    { src: "coracao", r: 133.2, vol: 0.45 }, { src: "whoosh", r: 136.7, vol: 0.25 }, { src: "trava", r: 144.94, vol: 0.4 }, { src: "carimbo", r: 151.48, vol: 0.5 },
    { src: "carimbo", r: 155.1, vol: 0.55 }, { src: "impacto", r: 160.56, vol: 0.45 }, { src: "impacto", r: 168.38, vol: 0.4 }, { src: "coracao", r: 172.1, vol: 0.45 },
    { src: "subida", r: 179.89, vol: 0.3 }, { src: "coracao", r: 193.79, vol: 0.4 }, { src: "carimbo", r: 208.09, vol: 0.55 },
  ],
});

const Ass: React.FC<{ r: number }> = ({ r }) => {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.05, o(r) + 0.6, Easing.out(Easing.cubic));
  return <div style={{ position: "absolute", left: 60, right: 60, top: 980, textAlign: "center", opacity: k, fontFamily: ELITE, fontSize: 60, color: C.osso, textShadow: SOMBRA }}>…e esse era o álibi.</div>;
};

// trajetos da planta (ilustrativa): entrada → alarme → escada → quarto dos pais
const SUZ_SOBE = "M 260 1200 L 260 1110 L 560 1110 L 780 1110 L 780 950 L 600 820 L 400 620";
const SUZ_DESCE = "M 400 620 L 600 820 L 780 950 L 780 1110";
const IRMAOS = "M 300 1215 L 560 1200 L 800 1170 L 800 960 L 620 840 L 430 650";

export const Suzane: React.FC = () => (
  <Reel ctx={ctxS}>
    {/* GANCHO — a mãe (melancólico): foto real do casal entrando com a voz */}
    <Plano r={[-0.1, 3.4]} forte>
      <Foto src="s-casal" r={[-0.1, 3.4]} fundo="c6925" credito="Reprodução · arquivo da família (imprensa)" top={640} w={900} h={670} pos="50% 30%" cinza zoom={[1.0, 1.08]} />
      <TituloVivo top={190} size={84} destaque="MENTE" linhas={[[["ELA", 0], ["PASSOU", 0.16], ["A", 0.52], ["VIDA", 0.7]], [["CUIDANDO", 1.12], ["DA", 1.64], ["MENTE", 1.88]], [["DOS", 2.16], ["OUTROS", 2.42]]]} />
    </Plano>
    <Plano r={[3.4, 7.75]}>
      <Foto src="s-familia" r={[3.4, 7.75]} credito="Reprodução · SBT · a família Richthofen" top={640} w={1040} h={270} pos="50% 30%" cinza zoom={[1.0, 1.1]} />
      <Grande r={3.5} top={300} size={66}>e nunca percebeu o que<br />a própria filha estava<br />planejando.</Grande>
    </Plano>
    {/* quem eram as vítimas — mural do investigador */}
    <Plano r={[7.75, 19.6]} soco={false}>
      <Mural camera={[[7.75, 1.15, 0, 120], [12.2, 1.0, 0, 40], [16.0, 1.05, 0, -60], [19.6, 1.1, 0, -120]]}
        itens={[
          { id: "casal", r: 7.82, x: 280, y: 300, w: 520, h: 380, img: "s-casal", titulo: "MARÍSIA E MANFRED", sub: "von Richthofen", rot: -2, pos: "40% 30%" },
          { id: "mar", r: 9.28, x: 70, y: 860, titulo: "MARÍSIA", sub: "psiquiatra · consultório em SP", w: 420, rot: 2 },
          { id: "man", r: 14.08, x: 590, y: 880, titulo: "MANFRED", sub: "engenheiro · nascido na Alemanha", w: 420, rot: -2 },
          { id: "usp", r: 16.68, x: 330, y: 1130, titulo: "USP", sub: "onde os dois se conheceram", w: 420, rot: 1 },
        ]}
        fios={[{ a: "casal", b: "mar", r: 9.5 }, { a: "casal", b: "man", r: 14.2 }, { a: "mar", b: "usp", r: 16.9 }, { a: "man", b: "usp", r: 17.3 }]} />
    </Plano>
    {/* o documentário e a polêmica */}
    <Plano r={[19.6, 25.1]}>
      <Foto src="s-netflix-suzane" r={[19.6, 25.1]} credito="Reprodução · Netflix · trailer oficial (2026)" top={420} w={900} h={680} pos="50% 30%" zoom={[1.0, 1.1]} />
      <Rotulo r={19.66} texto="24 ANOS DEPOIS DA MORTE DELES…" top={250} size={40} cor={C.fita} />
      <Faixa r={23.74} texto="UM DOCUMENTÁRIO NA NETFLIX" top={1130} size={54} />
    </Plano>
    <Plano r={[25.1, 30.75]}>
      <Clip src="c18305" r0={25.1} dur={5.65} a={0.6} />
      <Rotulo r={26.24} texto="SEGUNDO A FOLHA DE S.PAULO:" top={360} size={40} cor={C.fita} />
      <Contador r={27.0} ate={28.2} valor={500000} prefixo="≈ R$ " top={460} size={130} cor={C.verm} />
      <Rotulo r={29.28} texto="pra contar a versão dela" top={640} size={46} />
      <Rotulo r={29.6} texto="(valor não confirmado pela Netflix)" top={1180} size={28} cor={C.ossoE} />
    </Plano>
    <Plano r={[30.75, 33.0]}>
      <Manchetes itens={[[30.8, "Netflix é detonada nas redes após lançar documentário de Suzane", "TMC"], [31.6, "Gloria Perez faz críticas a documentário sobre Suzane", "CNN BRASIL"], [32.2, "Mãe de Isabella Nardoni critica: “Crime não é glamour”", "TERRA"]]} />
    </Plano>
    <Plano r={[33.0, 38.45]}>
      <Foto src="s-casal" r={[33.0, 38.45]} credito="Reprodução · arquivo da família (imprensa)" top={320} w={900} h={670} pos="50% 30%" cinza zoom={[1.05, 1.15]} />
      <Grande r={33.76} top={1010} size={62}>hoje, a versão de quem<br />não pode mais falar.</Grande>
    </Plano>
    {/* 31/10/2002 */}
    <Plano r={[38.45, 43.8]}>
      <Foto src="s-casa-policia" r={[38.45, 43.8]} credito="Reprodução · TV Globo · a casa, em 2002" top={460} w={1000} h={640} zoom={[1.0, 1.1]} />
      <Titulo r={38.54} top={230} size={84}>31 DE OUTUBRO<br />DE 2002</Titulo>
      <Rotulo r={41.26} texto="CAMPO BELO · ZONA SUL DE SÃO PAULO" top={1140} size={36} cor={C.fita} />
    </Plano>
    <Plano r={[43.8, 61.65]} soco={false}>
      <Mural camera={[[43.8, 1.12, 120, 140], [47.6, 1.0, 0, 60], [52.8, 1.0, 0, -40], [58.5, 1.08, -40, -160], [61.6, 1.08, -40, -160]]}
        itens={[
          { id: "suz", r: 43.9, x: 90, y: 300, w: 380, h: 420, img: "s-suzane-jovem", titulo: "SUZANE · 18 ANOS", sub: "estudante de Direito", rot: -3, pos: "50% 25%", cinza: false },
          { id: "dan", r: 46.96, x: 620, y: 360, titulo: "DANIEL CRAVINHOS", sub: "o namorado", w: 380, rot: 2 },
          { id: "pais", r: 49.66, x: 330, y: 860, w: 420, h: 300, img: "s-casal", titulo: "OS PAIS", rot: 1, pos: "50% 30%" },
          { id: "and", r: 54.06, x: 70, y: 1260, titulo: "ANDREAS · 15", sub: "deixado numa lan house", w: 400, rot: 2 },
          { id: "cri", r: 61.06, x: 620, y: 1260, titulo: "CRISTIAN CRAVINHOS", sub: "irmão de Daniel", w: 400, rot: -2 },
        ]}
        fios={[{ a: "suz", b: "dan", r: 47.6, texto: "namoro" }, { a: "dan", b: "pais", r: 50.0, texto: "não aceitavam" }, { a: "suz", b: "and", r: 52.9 }, { a: "dan", b: "cri", r: 61.1, texto: "irmãos" }]} />
    </Plano>
    {/* a planta da casa — o trajeto */}
    <Plano r={[61.65, 70.15]} soco={false}>
      <Planta trechos={[{ r: 61.7, d: SUZ_SOBE, dur: 4.2 }, { r: 67.54, d: SUZ_DESCE, dur: 0.8, cor: "#F4D35E" }, { r: 68.74, d: IRMAOS, dur: 1.4, cor: C.verm }]}
        marcas={[{ r: 62.28, x: 260, y: 1060, texto: "ALARME DESLIGADO" }, { r: 63.86, x: 780, y: 1180, texto: "ESCADA" }, { r: 65.08, x: 400, y: 700, texto: "CONFERE SE DORMEM" }, { r: 68.74, x: 560, y: 900, texto: "OS IRMÃOS SOBEM" }]} />
      <Rotulo r={61.7} texto="SUZANE (amarelo) · OS IRMÃOS (vermelho)" top={330} size={32} />
    </Plano>
    <Plano r={[70.15, 73.0]}>
      <Clip src="c6925" r0={70.15} dur={2.85} a={0.45} />
      <Grande r={70.24} top={620} size={76}>Manfred e Marísia<br />morreram enquanto<br />dormiam.</Grande>
    </Plano>
    <Plano r={[73.0, 81.5]}>
      <Clip src="c2489" r0={73.0} dur={8.5} a={0.55} />
      <Rotulo r={74.98} texto="O TRIO BAGUNÇA A CASA" top={340} size={46} cor={C.fita} />
      <Rotulo r={76.6} texto="✗ gavetas abertas" top={460} size={54} />
      <Rotulo r={77.78} texto="✗ dinheiro e joias levados" top={550} size={54} />
      <Carimbo r={80.5} texto="ASSALTO FALSO" y={800} rot={-8} size={110} />
    </Plano>
    <Plano r={[81.5, 84.85]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Rotulo r={81.6} texto="E ENTÃO, ELES MONTAM…" top={520} size={44} cor={C.ossoE} />
      <Titulo r={83.72} top={620} size={190} cor={C.verm}>O ÁLIBI</Titulo>
    </Plano>
    <Plano r={[84.85, 93.25]}>
      <Clip src="c27291" r0={84.85} dur={8.4} a={0.55} />
      <Rotulo r={84.92} texto="SUZANE E DANIEL VÃO PRA UM MOTEL" top={300} size={38} cor={C.fita} />
      <Hora r={87.34} hora="01:36" top={400} sub="ENTRADA NO MOTEL" />
      <Papel top={820} h={360} rot={-2}>
        <Cabec sup="MOTEL · 31/10/2002" titulo="NOTA FISCAL" size={60} />
        <Linha r={91.2} texto="— a prova de onde estavam" />
      </Papel>
    </Plano>
    <Plano r={[93.25, 100.25]}>
      <Clip src="c42039" r0={93.25} dur={7} a={0.55} />
      <Hora r={93.32} hora="03:00" top={360} sub="BUSCAM ANDREAS NA LAN HOUSE" />
      <Grande r={96.94} top={760} size={66}>e voltam pra casa como se<br />nada tivesse acontecido</Grande>
    </Plano>
    <Plano r={[100.25, 104.0]}>
      <Foto src="s-jn-casa" r={[100.25, 104.0]} credito="Reprodução · TV Globo (Jornal Nacional, 2002)" top={440} w={940} h={680} pos="40% 30%" zoom={[1.0, 1.1]} />
      <Titulo r={100.32} top={200} size={66}>ELES “DESCOBREM”<br />A CASA REVIRADA</Titulo>
    </Plano>
    <Plano r={[104.0, 106.1]}>
      <ArquivoReal src="nf-a3" r={104.0} dur={2.1} cropY={[380, 1040]} top={420} credito="Reprodução · Netflix (imagens de arquivo do documentário)" etiqueta="IMAGEM REAL · 2002" />
      <Faixa r={104.02} texto="E CHAMAM A POLÍCIA" top={1150} size={58} />
    </Plano>
    <Plano r={[106.1, 108.75]}>
      <Foto src="s-delegada" r={[106.1, 108.75]} credito="Reprodução · TV · delegada Cíntia Tucunduva" top={440} w={900} h={640} pos="60% 30%" zoom={[1.0, 1.1]} />
      <Titulo r={106.18} top={220} size={76}>A DELEGADA<br />ESTRANHA</Titulo>
    </Plano>
    <Plano r={[108.75, 115.15]}>
      <VersaoFato r={108.75} versao="“Foi um assalto.”" fatos={[[108.82, "nenhuma porta arrombada"], [110.82, "alarme desligado"], [112.7, "só o quarto dos pais revirado"]]} />
    </Plano>
    <Plano r={[115.15, 118.6]}>
      <Foto src="s-suzane-jovem" r={[115.15, 118.6]} credito="Reprodução · TV Globo" top={380} w={760} h={760} pos="50% 25%" cinza zoom={[1.05, 1.15]} />
      <Rotulo r={115.22} texto="E A FILHA…" top={230} size={48} cor={C.fita} />
      <Carimbo r={117.02} texto="CALMA DEMAIS" y={1180} rot={-6} size={92} />
    </Plano>
    <Plano r={[118.6, 123.25]}>
      <Clip src="c46005" r0={118.6} dur={4.65} a={0.5} />
      <Titulo r={118.66} top={360} size={90}>DIAS DEPOIS…</Titulo>
      <Rotulo r={120.24} texto="CRISTIAN COMPRA UMA MOTO" top={520} size={46} />
      <Rotulo r={121.76} texto="À VISTA" top={620} size={56} />
      <Faixa r={122.74} texto="EM DÓLARES" top={720} size={80} />
    </Plano>
    <Plano r={[123.25, 126.9]}>
      <Clip src="c18249" r0={123.25} dur={3.65} a={0.55} />
      <Grande r={123.32} top={620} size={70}>os mesmos dólares<br />que tinham sumido<br />da casa</Grande>
    </Plano>
    <Plano r={[126.9, 129.4]}>
      <ArquivoReal src="nf-a4" r={126.9} dur={2.5} cropY={[380, 1040]} top={420} credito="Reprodução · Netflix (imagens de arquivo do documentário)" etiqueta="IMAGEM REAL · 2002" />
      <Carimbo r={127.54} texto="PRESO" y={300} rot={-8} size={100} />
      <Carimbo r={128.52} texto="CONFESSA" y={1180} rot={6} size={96} />
    </Plano>
    <Plano r={[129.4, 131.2]}>
      <ArquivoReal src="nf-a1" r={129.4} dur={1.8} cropY={[380, 1040]} top={420} credito="Reprodução · Netflix (imagens de arquivo do documentário)" etiqueta="DHPP · 2002" />
      <Rotulo r={129.52} texto="EM SEGUIDA, SUZANE E DANIEL…" top={260} size={38} cor={C.fita} />
    </Plano>
    <Plano r={[131.2, 133.1]}>
      <ArquivoReal src="nf-a2" r={131.2} dur={1.9} cropY={[380, 1040]} top={420} credito="Reprodução · Netflix (imagens de arquivo do documentário)" etiqueta="FOLHA DE S.PAULO · 2002" />
      <Faixa r={131.66} texto="TAMBÉM CONFESSAM" top={1150} size={62} />
    </Plano>
    <Plano r={[133.1, 136.7]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Grande r={133.18} top={620} size={72}>mas essa história ainda<br />teria uma cena bizarra…</Grande>
    </Plano>
    <Plano r={[136.7, 144.25]}>
      <Foto src="s-fantastico" r={[136.7, 144.25]} credito="Reprodução · TV Globo (Fantástico, abril de 2006)" top={430} w={900} h={720} pos="40% 30%" zoom={[1.0, 1.12]} />
      <Rotulo r={137.1} texto="2006 · PERTO DO JULGAMENTO" top={230} size={40} cor={C.fita} />
      <Titulo r={140.44} top={300} size={66}>A ENTREVISTA</Titulo>
      <Rotulo r={142.08} texto="chorando" top={1180} size={46} />
      <Rotulo r={143.18} texto="arrependida" top={1240} size={46} />
    </Plano>
    <Plano r={[144.25, 153.3]}>
      <Foto src="s-fantastico" r={[144.25, 153.3]} credito="Reprodução · TV Globo (Fantástico, 2006)" top={560} w={760} h={600} pos="40% 30%" cinza zoom={[1.1, 1.25]} />
      <Rotulo r={144.3} texto="● MICROFONE LIGADO" top={230} size={56} cor={C.verm} />
      <Grande r={146.58} top={330} size={56}>os advogados orientando como<br />ela devia se comportar<br />diante da câmera</Grande>
      <Carimbo r={151.48} texto="O BRASIL VIU" y={1180} rot={-6} size={96} />
    </Plano>
    <Plano r={[153.3, 156.3]}>
      <Foto src="s-suzane-escoltada" r={[153.3, 156.3]} credito="Reprodução · TV" top={420} w={860} h={700} pos="55% 30%" zoom={[1.0, 1.1]} />
      <Carimbo r={155.1} texto="PRESA DE NOVO" y={1200} rot={-6} size={90} />
    </Plano>
    <Plano r={[156.3, 165.4]}>
      <Clip src="c47686" r0={156.3} dur={9.1} a={0.55} />
      <Titulo r={156.36} top={280} size={80}>JULHO DE 2006</Titulo>
      <Rotulo r={158.66} texto="SUZANE E DANIEL:" top={420} size={44} cor={C.fita} />
      <Contador r={160.56} ate={161.2} valor={39} sufixo=" ANOS" top={500} size={150} />
      <Rotulo r={161.86} texto="e 6 meses de prisão" top={680} size={46} />
      <Rotulo r={163.56} texto="CRISTIAN: 38 ANOS" top={820} size={52} />
    </Plano>
    <Plano r={[165.4, 169.4]}>
      <Foto src="s-suzane-grade" r={[165.4, 169.4]} credito="Reprodução · Jornal da Record" top={430} w={1000} h={560} pos="50% 30%" zoom={[1.0, 1.1]} />
      <Titulo r={166.06} top={240} size={100}>2023</Titulo>
      <Faixa r={168.38} texto="REGIME ABERTO" top={1080} size={70} />
    </Plano>
    <Plano r={[169.4, 175.2]}>
      <Foto src="s-familia" r={[169.4, 175.2]} credito="Reprodução · SBT · a família Richthofen" top={320} w={700} h={700} pos="34% 30%" cinza zoom={[1.1, 1.25]} />
      <Rotulo r={169.9} texto="ANDREAS, O MENINO DA LAN HOUSE…" top={190} size={38} cor={C.fita} />
      <Grande r={172.14} top={1070} size={62}>perdeu os pais e a irmã<br />na mesma noite.</Grande>
    </Plano>
    <Plano r={[175.2, 179.89]}>
      <ArquivoReal src="nf-sq" r={175.2} dur={4.69} cropY={[372, 1040]} top={380} credito="Reprodução · Netflix · “Suzane von Richthofen: O que o Tempo Não Apaga” (2026)" etiqueta="SUZANE, NO DOCUMENTÁRIO" />
    </Plano>
    <Plano r={[179.89, 185.39]}>
      <Foto src="s-netflix-suzane" r={[179.89, 185.39]} credito="Reprodução · Netflix (2026)" top={440} w={860} h={640} pos="50% 30%" zoom={[1.05, 1.15]} />
      <Rotulo r={179.93} texto="HOJE, O DOCUMENTÁRIO DELA ESTÁ NO" top={230} size={36} cor={C.fita} />
      <Contador r={182.85} ate={183.69} valor={26} prefixo="TOP 10 · " sufixo=" PAÍSES" top={1120} size={70} cor={C.verm} />
    </Plano>
    <Plano r={[185.39, 193.69]}>
      <Fundo />
      <Rotulo r={185.47} texto="A MÃE DA ISABELLA NARDONI PERGUNTOU:" top={420} size={38} cor={C.fita} />
      <Grande r={188.09} top={540} size={70}>“até quando assassinos<br />vão ser protagonistas…<br />e vítimas, coadjuvantes?”</Grande>
    </Plano>
    <Plano r={[193.69, 199.89]}>
      <Foto src="s-casal" r={[193.69, 199.89]} credito="Reprodução · arquivo da família (imprensa)" top={300} w={900} h={670} pos="50% 30%" cinza zoom={[1.0, 1.12]} />
      <Grande r={193.79} top={1020} size={58}>Marísia passou a vida<br />ouvindo as pessoas.</Grande>
      <Faixa r={196.95} texto="HOJE, FOI A VEZ DELA SER OUVIDA" top={200} size={46} />
    </Plano>
    <Plano r={[199.89, 207.19]}>
      <Clip src="c27291" r0={199.89} from={3} dur={7.3} a={0.65} />
      <Grande r={199.95} top={560} size={84}>Onde você estava<br />naquela noite?</Grande>
      <Rotulo r={201.85} texto="num motel. com nota fiscal." top={820} size={42} cor={C.ossoE} />
      <Ass r={205.13} />
    </Plano>
    <Plano r={[207.19, 264.69]} soco={false}>
      <Fechamento r={207.29} caso="Nº 018" status="CONDENADOS" pergunta="Quem comete um crime deveria poder ganhar dinheiro contando ele?" />
    </Plano>
  </Reel>
);
