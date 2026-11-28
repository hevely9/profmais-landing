import React from "react";
import palavras from "../../public/palavras-chefao.json";
import { Assinatura, C, Carimbo, Cheia, Clip, Contador, Faixa, Foto, Fundo, Grande, MONT, Papel, Cabec, Linha, Plano, Reel, Rotulo, Titulo, TituloVivo, achar, lin, mkCtx, useT } from "../kit";
import { Ficha, Roteiro } from "../ui";

const words = (palavras as { words: { text: string; start: number; end: number }[] }).words;
const w = achar(words);
export const ctx = mkCtx({
  caso: "Nº 015", audio: "chefao", words, lead: 0.1, fimVozRaw: 72.6, final: "alibi", proximo: "NO PERFIL",
  cta: ["Você já tinha reparado nisso?", "comenta: SIM ou NÃO ↓"],
  chave: /^(máfia|verdade|1971|colombo|fbi|cinco|impensável|acordo|nenhuma|elenco|montana|nervoso|brando|coppola)$/i,
  semLegenda: [[65.6, 90]],
  sfx: [
    { src: "impacto", r: 2.98, vol: 0.45 }, { src: "whoosh", r: 3.95, vol: 0.25 }, ...[8.62, 8.8, 9.0].map((r) => ({ src: "tecla", r, vol: 0.28 })),
    { src: "whoosh", r: 9.85, vol: 0.25 }, { src: "carimbo", r: 13.36, vol: 0.4 }, { src: "coracao", r: 17.28, vol: 0.5 },
    { src: "carimbo", r: 24.26, vol: 0.55 }, { src: "trava", r: 29.84, vol: 0.4 }, { src: "carimbo", r: 33.66, vol: 0.5 },
    ...[34.8, 35.6, 36.4].map((r) => ({ src: "tecla", r, vol: 0.3 })), { src: "carimbo", r: 38.22, vol: 0.5 },
    { src: "impacto", r: 41.8, vol: 0.45 }, { src: "coracao", r: 44.9, vol: 0.5 }, { src: "whoosh", r: 46.6, vol: 0.25 },
    { src: "carimbo", r: 54.32, vol: 0.5 }, ...[57.8, 58.0, 58.2, 58.4].map((r) => ({ src: "tique", r, vol: 0.3 })), { src: "subida", r: 62.0, vol: 0.3 },
  ],
});

// dois lados da mesa: produtor × chefe da Liga (silhuetas)
const Reuniao: React.FC = () => {
  const { t, o } = useT();
  const k = lin(t, o(28.8), o(29.6));
  const Lado: React.FC<{ x: number; nome: string; sub: string }> = ({ x, nome, sub }) => <div style={{ position: "absolute", left: x, top: 520, width: 380, textAlign: "center", opacity: k }}>
    <svg viewBox="0 0 100 126" style={{ width: 260, height: 330 }}><path d="M30 42 a20 21 0 1 0 40 0 a20 21 0 1 0 -40 0 Z M12 126 C14 94 30 80 50 80 C70 80 86 94 88 126 Z" fill="#ECE7DC" opacity="0.9" /></svg>
    <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 46, color: C.osso, marginTop: 14 }}>{nome}</div>
    <div style={{ fontFamily: "Courier", fontWeight: 700, fontSize: 26, color: C.ossoE }}>{sub}</div>
  </div>;
  return <>
    <Fundo cor="radial-gradient(ellipse at 50% 55%, #2A1F10 0%, #0A0A0B 70%)" />
    <div style={{ position: "absolute", left: 120, right: 120, top: 980, height: 18, background: "#3A2E22", boxShadow: "0 20px 40px rgba(0,0,0,0.8)" }} />
    <Lado x={80} nome="AL RUDDY" sub="produtor" />
    <Lado x={620} nome="JOE COLOMBO" sub="a Liga" />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1060, textAlign: "center", fontFamily: "Courier", fontSize: 22, color: C.ossoE }}>silhuetas ilustrativas</div>
  </>;
};

export const Chefao: React.FC = () => (
  <Reel ctx={ctx}>
    {/* GANCHO — roteiro real do filme (museu de Turim) entrando com impacto, projetor ao fundo */}
    <Plano r={[-0.1, 2.4]} forte>
      <Foto src="p-script" fundo="c28422" alt={{ clip: "c28422" }} r={[-0.1, 2.4]} credito="SunOfErat · CC BY-SA 4.0 · Museo del Cinema, Turim" top={560} w={940} h={680} zoom={[1.05, 1.2]} cinza />
      <TituloVivo top={190} size={86} destaque="VERDADE" linhas={[[["A", 0], ["MÁFIA", 0.18]], [["DE", 0.54], ["VERDADE", 0.7]], [["AJUDOU", 1.2]]]} />
    </Plano>
    <Plano r={[2.4, 3.9]}>
      <Clip src="c28417" r0={2.4} dur={1.5} a={0.4} />
      <Titulo r={w("poderoso") - 0.1} top={560} size={100}>O PODEROSO<br />CHEFÃO</Titulo>
    </Plano>
    <Plano r={[3.9, 6.6]}>
      <Cheia src="p-littleitaly" alt={{ clip: "c4443" }} r={[3.9, 6.6]} credito="Kidfly182 · CC BY 4.0" zoom={[1.05, 1.18]} a={0.45} />
      <Titulo r={w("nova") - 0.1} top={330} size={110}>NOVA YORK</Titulo>
      <Titulo r={w("1971") - 0.1} top={470} size={150} cor={C.verm}>1971</Titulo>
    </Plano>
    <Plano r={[6.6, 8.5]}>
      <Foto src="p-paramount" alt={{ clip: "c40676" }} r={[6.6, 8.5]} credito="Coolcaesar · CC BY-SA 4.0" top={460} w={960} h={640} zoom={[1.05, 1.18]} cinza />
      <Titulo r={w("paramount") - 0.1} top={250} size={96}>PARAMOUNT</Titulo>
    </Plano>
    <Plano r={[8.5, 9.9]}>
      <Clip src="c18288" r0={8.5} dur={1.4} a={0.45} />
      <Rotulo r={8.55} texto="O LIVRO DE" top={420} size={44} cor={C.ossoE} />
      <Titulo r={w("mario") - 0.1} top={490} size={100}>MARIO PUZO</Titulo>
    </Plano>
    <Plano r={[9.9, 12.6]}>
      <Clip src="c45700" r0={9.9} dur={2.7} a={0.5} />
      <Titulo r={w("protestar") - 0.2} top={380} size={84}>PROTESTOS<br />CONTRA O FILME</Titulo>
    </Plano>
    <Plano r={[12.6, 15.7]}>
      <Fundo />
      <Papel top={480} h={520} rot={-1.2}>
        <Cabec sup="QUEM PROTESTAVA" titulo="LIGA DOS DIREITOS CIVIS ÍTALO-AMERICANOS" size={52} />
        <Linha r={13.8} texto="dizia defender a imagem dos ítalo-americanos" size={32} />
      </Papel>
    </Plano>
    <Plano r={[15.7, 18.6]}>
      <Ficha sup="QUEM COMANDAVA A LIGA" nome="JOE COLOMBO" linhas={[[w("colombo") + 0.4, "Nova York · 1971"]]} />
    </Plano>
    <Plano r={[18.6, 21.0]}>
      <Clip src="c41497" r0={18.6} dur={2.4} a={0.45} />
      <Rotulo r={w("público") - 0.2} texto="EM PÚBLICO" top={360} size={44} cor={C.ossoE} />
      <Titulo r={w("líder") - 0.1} top={430} size={80}>LÍDER DA<br />COMUNIDADE</Titulo>
    </Plano>
    <Plano r={[21.0, 23.3]}>
      <Clip src="c41485" r0={21.0} dur={2.3} a={0.45} />
      <Titulo r={w("fbi") - 0.2} top={420} size={110}>PARA O FBI…</Titulo>
    </Plano>
    <Plano r={[23.3, 25.5]}>
      <Fundo cor={C.preto} />
      <Contador r={23.2} ate={23.9} valor={5} top={480} size={260} />
      <Rotulo r={23.5} texto="FAMÍLIAS DE NOVA YORK" top={760} size={44} />
      <Carimbo r={w("máfia", 1) - 0.05} texto="CHEFE DA MÁFIA" y={1000} rot={-6} size={84} />
    </Plano>
    <Plano r={[25.5, 28.8]}>
      <Clip src="c40502" r0={25.5} dur={3.3} a={0.45} />
      <Rotulo r={w("produtor") - 0.1} texto="O PRODUTOR" top={350} size={44} cor={C.ossoE} />
      <Titulo r={w("al") - 0.1} top={420} size={110}>AL RUDDY</Titulo>
      <Faixa r={w("impensável") - 0.2} texto="FEZ O IMPENSÁVEL" top={600} size={66} />
    </Plano>
    <Plano r={[28.8, 31.0]}>
      <Reuniao />
      <Titulo r={w("reunião") - 0.1} top={300} size={84}>UMA REUNIÃO</Titulo>
    </Plano>
    <Plano r={[31.0, 34.4]}><Roteiro r={31.0} risca={w("máfia", 2) - 0.05} /><Titulo r={w("acordo") - 0.1} top={230} size={84}>O ACORDO</Titulo></Plano>
    <Plano r={[34.4, 38.0]}>
      <Fundo />
      <Papel top={440} h={560} rot={1}>
        <Cabec sup="RUDDY × LIGA" titulo="O ACORDO" />
        <Linha r={31.9} texto="— sai a palavra “máfia”" size={40} />
        <Linha r={w("troca") - 0.1} texto="— a Liga deixa as filmagens" size={40} />
        <Linha r={w("paz") - 0.3} texto="  em paz" size={40} />
      </Papel>
      <Carimbo r={w("deu") - 0.02} texto="FECHADO" y={1110} rot={-7} size={100} />
    </Plano>
    <Plano r={[38.0, 40.6]}>
      <Clip src="c28422" r0={38.0} from={3} dur={2.6} a={0.45} />
      <Titulo r={w("repara") - 0.1} top={420} size={96}>REPARA<br />NO FILME</Titulo>
    </Plano>
    <Plano r={[40.6, 43.4]}>
      <Clip src="c28417" r0={40.6} from={2} dur={2.8} a={0.55} />
      <Rotulo r={40.65} texto="QUANTAS VEZES DIZEM “MÁFIA”?" top={420} size={40} cor={C.ossoE} />
      <Titulo r={w("nenhuma") - 0.15} top={500} size={260} cor={C.verm}>0</Titulo>
    </Plano>
    <Plano r={[43.4, 46.6]}>
      <Fundo cor={C.preto} />
      <Grande r={w("mas", 1) - 0.05} top={620} size={80}>mas a parte mais estranha<br />estava no elenco.</Grande>
    </Plano>
    <Plano r={[46.6, 50.8]}>
      <Clip src="c49326" r0={46.6} dur={4.2} a={0.45} />
      <Titulo r={w("luca") - 0.1} top={360} size={110}>LUCA BRASI</Titulo>
      <Rotulo r={w("capanga") - 0.1} texto="o capanga gigante de Don Corleone" top={520} size={40} />
    </Plano>
    <Plano r={[50.8, 52.3]}>
      <Ficha sup="O ATOR" nome="LENNY MONTANA" />
    </Plano>
    <Plano r={[52.3, 54.3]}>
      <Ficha sup="O ATOR" nome="LENNY MONTANA" linhas={[[w("ex-lutador") - 0.1, "— ex-lutador"], [w("segurança") - 0.1, "— segurança de um figurão"]]} />
    </Plano>
    <Plano r={[54.3, 56.5]}>
      <Ficha sup="O ATOR" nome="LENNY MONTANA" linhas={[[52.0, "— ex-lutador"], [52.5, "— segurança de um figurão"], [w("família") - 0.2, "  da família Colombo"]]} />
      <Carimbo r={w("verdade", 1) - 0.05} texto="DE VERDADE" y={1150} rot={-6} size={96} />
    </Plano>
    <Plano r={[56.5, 59.0]}>
      <Ficha sup="O ATOR" nome="LENNY MONTANA" tremor />
      <Faixa r={w("nervoso") - 0.2} texto="TÃO NERVOSO…" top={1150} size={70} />
    </Plano>
    <Plano r={[59.0, 61.6]}>
      <Foto src="p-brando" alt={{ clip: "c41485" }} r={[59.0, 61.6]} credito="Urpo Rouhiainen · CC BY 4.0" top={380} w={640} h={820} zoom={[1.0, 1.12]} pos="50% 25%" cinza />
      <Rotulo r={w("marlon") - 0.1} texto="CONTRACENAR COM MARLON BRANDO" top={220} size={36} />
      <Faixa r={w("errava") - 0.1} texto="QUE ERRAVA AS FALAS" top={1180} size={56} />
    </Plano>
    <Plano r={[61.6, 65.6]}>
      <Foto src="p-coppola" alt={{ clip: "c49326" }} r={[61.6, 65.6]} credito="Greg2600 · CC BY-SA 2.0" top={380} w={640} h={820} zoom={[1.0, 1.12]} pos="50% 25%" cinza />
      <Titulo r={w("coppola") - 0.1} top={200} size={96}>COPPOLA</Titulo>
      <Faixa r={w("colocou") - 0.15} texto="COLOCOU NO FILME" top={1180} size={60} />
    </Plano>
    <Plano r={[65.6, 95]} soco={false}>
      <Clip src="c28422" r0={65.6} from={5} dur={7} a={0.62} />
      <Grande r={65.68} top={640} size={86}>Onde você estava<br />naquela noite?</Grande>
      <Assinatura r={w("esse") - 0.05} />
    </Plano>
  </Reel>
);
