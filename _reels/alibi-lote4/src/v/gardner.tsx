import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import palavras from "../../public/palavras-gardner.json";
import { C, COURIER, Carimbo, Clip, Contador, ELITE, Faixa, Foto, Fundo, Grande, MONT, Plano, Reel, Rotulo, SANS, SOMBRA, Titulo, TituloVivo, lin, mkCtx, useT } from "../kit";
import { Fechamento, Hora } from "../dossie";

// ÁLIBI · CASO Nº 020 — O roubo do Museu Isabella Stewart Gardner (Boston, 18/03/1990).
// Fontes: History.com, PBS NewsHour, Smithsonian, NPR/Boston.com (FBI, 2013), Mental Floss, Boston Globe ("Last Seen"),
// CBS Boston (vídeo de segurança divulgado em 2015). Pinturas: domínio público. Nada gráfico, sem pedir comentário.
type Ws = { words: { text: string; start: number; end: number }[] };
export const ctxG = mkCtx({
  caso: "Nº 020", audio: "gardner", words: (palavras as Ws).words, lead: 0.1, fimVozRaw: 180.6, final: "alibi", proximo: "NO PERFIL",
  cta: ["", ""],
  chave: /^(policiais|museu|segurança|porta|molduras?|vazias|vermeer|rembrandt|manet|sala|azul|fbi|preso|farda|álibi|500|13)/i,
  semLegenda: [[168.3, 260]],
  sfx: [
    { src: "impacto", r: 1.34, vol: 0.45 }, { src: "trava", r: 6.0, vol: 0.4 }, { src: "impacto", r: 10.22, vol: 0.45 }, { src: "coracao", r: 13.8, vol: 0.4 },
    { src: "whoosh", r: 19.3, vol: 0.25 }, { src: "tique", r: 24.74, vol: 0.4 }, { src: "whoosh", r: 26.7, vol: 0.25 }, { src: "carimbo", r: 33.0, vol: 0.45 },
    { src: "carimbo", r: 40.06, vol: 0.45 }, { src: "trava", r: 47.52, vol: 0.45 }, { src: "coracao", r: 51.0, vol: 0.4 }, { src: "subida", r: 56.9, vol: 0.3 },
    { src: "impacto", r: 63.98, vol: 0.4 }, { src: "whoosh", r: 65.3, vol: 0.25 }, { src: "whoosh", r: 71.9, vol: 0.25 }, { src: "tique", r: 79.24, vol: 0.35 },
    { src: "tique", r: 80.04, vol: 0.35 }, { src: "tique", r: 82.16, vol: 0.35 }, { src: "tique", r: 85.22, vol: 0.4 }, { src: "impacto", r: 92.0, vol: 0.45 },
    { src: "subida", r: 97.1, vol: 0.3 }, { src: "tecla", r: 100.8, vol: 0.25 }, { src: "tecla", r: 101.6, vol: 0.25 }, { src: "tecla", r: 102.4, vol: 0.25 },
    { src: "impacto", r: 108.7, vol: 0.45 }, { src: "whoosh", r: 114.9, vol: 0.25 }, { src: "carimbo", r: 124.2, vol: 0.5 }, { src: "carimbo", r: 129.72, vol: 0.5 },
    { src: "whoosh", r: 130.8, vol: 0.25 }, { src: "trava", r: 145.2, vol: 0.4 }, { src: "carimbo", r: 149.16, vol: 0.5 }, { src: "impacto", r: 152.52, vol: 0.4 },
    { src: "coracao", r: 157.1, vol: 0.4 }, { src: "coracao", r: 166.4, vol: 0.4 }, { src: "carimbo", r: 177.6, vol: 0.55 },
  ],
});

const Ass: React.FC<{ r: number; top?: number }> = ({ r, top = 1100 }) => {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.05, o(r) + 0.6, Easing.out(Easing.cubic));
  return <div style={{ position: "absolute", left: 60, right: 60, top, textAlign: "center", opacity: k, fontFamily: ELITE, fontSize: 60, color: C.osso, textShadow: SOMBRA }}>…e esse era o álibi.</div>;
};

// esquema ilustrativo dos sensores de movimento: salas acendem com os passos; a Sala Azul só com o segurança
const Sensores: React.FC<{ r: number; rAzul: number }> = ({ r, rAzul }) => {
  const { t, o } = useT();
  const salas: { nome: string; sub: string; x: number; y: number; w: number; h: number; dt: number; azul?: boolean }[] = [
    { nome: "SALA HOLANDESA", sub: "Vermeer · Rembrandt", x: 90, y: 360, w: 500, h: 300, dt: 1.6 },
    { nome: "GALERIA CURTA", sub: "Degas · a águia", x: 620, y: 360, w: 370, h: 300, dt: 2.4 },
    { nome: "SALA AZUL", sub: "Manet", x: 90, y: 700, w: 900, h: 300, dt: 99, azul: true },
  ];
  const k0 = lin(t, o(r) - 0.1, o(r) + 0.4);
  const kz = lin(t, o(rAzul) - 0.05, o(rAzul) + 0.4, Easing.out(Easing.cubic));
  return <AbsoluteFill>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #12202C 0%, #070B10 80%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 270, textAlign: "center", fontFamily: COURIER, fontWeight: 700, fontSize: 30, letterSpacing: "0.18em", color: "rgba(156,196,232,0.85)", opacity: k0 }}>SENSORES DE MOVIMENTO · 18/03/1990</div>
    {salas.map((s, i) => {
      const ka = s.azul ? 0 : lin(t, o(r) + s.dt, o(r) + s.dt + 0.4);
      const cor = s.azul ? (kz > 0 ? "#2F6FA8" : "rgba(156,196,232,0.35)") : ka > 0 ? C.verm : "rgba(156,196,232,0.35)";
      const passos = Array.from({ length: 6 }, (_, j) => j);
      return <div key={i} style={{ position: "absolute", left: s.x, top: s.y, width: s.w, height: s.h, opacity: k0, border: `4px solid ${cor}`, background: s.azul ? `rgba(47,111,168,${0.25 * kz})` : `rgba(224,53,63,${0.18 * ka})` }}>
        <div style={{ position: "absolute", left: 22, top: 16, fontFamily: MONT, fontWeight: 800, fontSize: 40, color: C.osso }}>{s.nome}</div>
        <div style={{ position: "absolute", left: 22, top: 66, fontFamily: COURIER, fontWeight: 700, fontSize: 26, color: C.ossoE }}>{s.sub}</div>
        {!s.azul && passos.map((j) => <div key={j} style={{ position: "absolute", left: 40 + j * ((s.w - 100) / 5), top: 170 + (j % 2) * 40, width: 22, height: 32, borderRadius: 11, background: C.verm, opacity: lin(t, o(r) + s.dt + j * 0.12, o(r) + s.dt + j * 0.12 + 0.2) }} />)}
        {s.azul && kz > 0 && <div style={{ position: "absolute", left: 22, top: 140, fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.osso, opacity: kz }}>só os passos do segurança</div>}
        {s.azul && kz <= 0 && <div style={{ position: "absolute", left: 22, top: 150, fontFamily: COURIER, fontWeight: 700, fontSize: 34, color: "rgba(156,196,232,0.6)", opacity: lin(t, o(r) + 3.5, o(r) + 4) }}>nenhum passo dos ladrões</div>}
      </div>;
    })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1030, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 20, color: "rgba(236,231,220,0.5)" }}>esquema ilustrativo</div>
  </AbsoluteFill>;
};

const CRED_PINTURA = (obra: string) => `${obra} · domínio público`;

export const Gardner: React.FC = () => (
  <Reel ctx={ctxG}>
    {/* GANCHO — imagem real da câmera de segurança do museu */}
    <Plano r={[-0.1, 5.0]} forte>
      <Foto src="g-cctv" r={[-0.1, 5.0]} credito="Reprodução · câmera de segurança do museu (CBS Boston)" top={520} w={1000} h={640} pos="50% 40%" cinza zoom={[1.05, 1.18]} />
      <TituloVivo top={160} size={88} destaque="POLICIAIS" linhas={[[["DOIS", 0], ["HOMENS", 0.3]], [["VESTIDOS", 0.62], ["DE", 1.18]], [["POLICIAIS", 1.34]]]} />
      <Rotulo r={2.06} texto="tocaram a campainha de um museu" top={1190} size={44} cor={C.fita} />
    </Plano>
    <Plano r={[5.0, 7.5]}>
      <Foto src="g-patio2" r={[5.0, 7.5]} credito="Reprodução · Museu Isabella Stewart Gardner" top={420} w={900} h={640} pos="50% 50%" cinza zoom={[1.05, 1.15]} />
      <Faixa r={5.5} texto="O SEGURANÇA ABRIU A PORTA" top={1130} size={58} />
    </Plano>
    <Plano r={[7.5, 13.3]}>
      <Foto src="g-concert" r={[7.5, 13.3]} credito={CRED_PINTURA("Vermeer, “O Concerto” (roubado)")} top={420} w={700} h={780} pos="50% 50%" zoom={[1.0, 1.1]} />
      <Contador r={7.6} ate={8.6} valor={81} sufixo=" MINUTOS DEPOIS…" top={230} size={64} />
      <Faixa r={10.22} texto="US$ 500 MILHÕES EM ARTE SUMIRAM" top={1230} size={48} />
    </Plano>
    <Plano r={[13.3, 19.65]}>
      <Foto src="g-moldura" r={[13.3, 19.65]} credito="Reprodução · CBS Boston (moldura vazia no museu)" top={300} w={940} h={760} pos="50% 50%" zoom={[1.0, 1.08]} />
      <Grande r={13.4} top={1100} size={54}>até hoje, as molduras vazias<br />continuam na parede.</Grande>
      <Rotulo r={17.94} texto="esperando." top={200} size={52} cor={C.ossoE} />
    </Plano>
    {/* a noite */}
    <Plano r={[19.65, 26.7]}>
      <Foto src="g-patio" r={[19.65, 26.7]} credito="Reprodução · Museu Isabella Stewart Gardner, Boston" top={640} w={1000} h={560} pos="50% 50%" zoom={[1.0, 1.1]} />
      <Titulo r={19.7} top={190} size={84}>BOSTON · EUA</Titulo>
      <Rotulo r={21.48} texto="18 DE MARÇO DE 1990" top={310} size={46} cor={C.fita} />
      <Hora r={24.74} hora="01:24" top={380} />
    </Plano>
    <Plano r={[26.7, 31.8]}>
      <Foto src="g-sketch" r={[26.7, 31.8]} credito="Reprodução · FBI (retratos falados dos suspeitos)" top={420} w={960} h={640} pos="50% 50%" cover={false} zoom={[1.0, 1.06]} />
      <Rotulo r={26.78} texto="DOIS HOMENS DE FARDA" top={250} size={52} cor={C.fita} />
      <Rotulo r={28.54} texto="na porta lateral do museu" top={1120} size={46} />
    </Plano>
    <Plano r={[31.8, 35.2]}>
      <Fundo />
      <Rotulo r={31.82} texto="ELES DIZEM:" top={460} size={44} cor={C.ossoE} />
      <Grande r={32.4} top={540} size={70}>“estamos atendendo<br />um chamado de<br />perturbação”</Grande>
      <Carimbo r={33.0} texto="FALSOS POLICIAIS" y={960} rot={-6} size={84} />
    </Plano>
    <Plano r={[35.2, 41.9]}>
      <Foto src="g-sala" r={[35.2, 41.9]} credito="Reprodução · History (sala do museu)" top={430} w={900} h={640} pos="50% 50%" cinza zoom={[1.05, 1.15]} />
      <Rotulo r={35.3} texto="O SEGURANÇA DE PLANTÃO" top={230} size={46} cor={C.fita} />
      <Rotulo r={37.56} texto="23 ANOS · deixa eles entrarem" top={310} size={42} />
      <Carimbo r={40.06} texto="CONTRA AS REGRAS" y={1160} rot={-5} size={84} />
    </Plano>
    <Plano r={[41.9, 50.9]}>
      <Clip src="c47802" r0={41.9} dur={9.0} a={0.55} />
      <Rotulo r={41.95} texto="LÁ DENTRO, ELES DIZEM:" top={360} size={42} cor={C.fita} />
      <Grande r={43.04} top={440} size={64}>“existe um mandado<br />de prisão contra você”</Grande>
      <Carimbo r={47.52} texto="ALGEMADO" y={800} rot={-6} size={100} />
      <Rotulo r={49.2} texto="depois, o outro vigia" top={960} size={50} />
    </Plano>
    <Plano r={[50.9, 56.8]}>
      <Clip src="c2632" r0={50.9} dur={5.9} a={0.6} />
      <Grande r={50.96} top={560} size={70}>os dois são levados<br />pro porão, amarrados…</Grande>
      <Rotulo r={54.7} texto="e deixados ali até de manhã" top={820} size={48} cor={C.fita} />
    </Plano>
    <Plano r={[56.8, 60.6]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Titulo r={57.4} top={640} size={120} cor={C.verm}>COMEÇA<br />O ROUBO</Titulo>
      <Rotulo r={59.0} texto="sem pressa." top={940} size={54} cor={C.ossoE} />
    </Plano>
    {/* as obras */}
    <Plano r={[60.6, 65.65]}>
      <Foto src="g-moldura2" r={[60.6, 65.65]} credito="Reprodução · CBS Boston (moldura vazia)" top={440} w={1000} h={600} pos="45% 50%" zoom={[1.0, 1.1]} />
      <Faixa r={60.82} texto="CORTAM AS TELAS DAS MOLDURAS" top={270} size={50} />
      <Contador r={63.98} ate={64.5} valor={13} sufixo=" OBRAS" top={1090} size={110} cor={C.verm} />
    </Plano>
    <Plano r={[65.65, 71.9]}>
      <Foto src="g-concert" r={[65.65, 71.9]} credito={CRED_PINTURA("Vermeer, “O Concerto”, c. 1664")} top={360} w={760} h={850} pos="50% 50%" zoom={[1.0, 1.12]} />
      <Titulo r={66.42} top={170} size={80}>O CONCERTO</Titulo>
      <Rotulo r={67.56} texto="VERMEER" top={270} size={44} cor={C.fita} />
      <Rotulo r={68.32} texto="um de pouco mais de 30 quadros que ele pintou" top={1225} size={30} />
    </Plano>
    <Plano r={[71.9, 77.8]}>
      <Foto src="g-storm" r={[71.9, 77.8]} credito={CRED_PINTURA("Rembrandt, “A Tempestade no Mar da Galileia”, 1633")} top={380} w={820} h={800} pos="50% 50%" zoom={[1.0, 1.12]} />
      <Rotulo r={72.38} texto="A TEMPESTADE NO MAR DA GALILEIA" top={200} size={44} cor={C.osso} />
      <Rotulo r={74.98} texto="a única paisagem marítima de Rembrandt" top={1220} size={38} cor={C.fita} />
    </Plano>
    <Plano r={[77.8, 84.5]}>
      <Foto src="g-tortoni" r={[77.8, 84.5]} credito={CRED_PINTURA("Manet, “No Tortoni” (detalhe)")} top={700} w={760} h={560} pos="50% 40%" zoom={[1.0, 1.1]} />
      <Rotulo r={77.9} texto="TAMBÉM LEVAM:" top={240} size={44} cor={C.fita} />
      <Rotulo r={79.24} texto="✗ um Manet" top={330} size={56} />
      <Rotulo r={80.04} texto="✗ 5 desenhos de Degas" top={420} size={56} />
      <Rotulo r={82.16} texto="✗ uma águia de bronze" top={510} size={56} />
    </Plano>
    <Plano r={[84.5, 90.2]}>
      <Clip src="c42039" r0={84.5} dur={5.7} a={0.55} />
      <Hora r={85.22} hora="02:45" top={360} sub="ELES VÃO EMBORA" />
      <Grande r={87.78} top={760} size={66}>e nunca mais<br />são vistos.</Grande>
    </Plano>
    <Plano r={[90.2, 97.0]}>
      <Foto src="g-lady" r={[90.2, 97.0]} credito={CRED_PINTURA("Rembrandt, “Uma Dama e um Cavalheiro de Preto” (detalhe, roubado)")} top={560} w={900} h={620} pos="50% 30%" cinza zoom={[1.05, 1.15]} />
      <Rotulo r={90.3} texto="VALOR ESTIMADO HOJE:" top={220} size={44} cor={C.fita} />
      <Contador r={92.0} ate={92.9} valor={500} prefixo="US$ " sufixo=" MILHÕES" top={300} size={96} cor={C.verm} />
      <Faixa r={94.46} texto="O MAIOR ROUBO DE ARTE DA HISTÓRIA" top={450} size={46} />
    </Plano>
    {/* o detalhe estranho */}
    <Plano r={[97.0, 99.35]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Rotulo r={97.08} texto="MAS TEM UM…" top={560} size={50} cor={C.ossoE} />
      <Titulo r={97.45} top={650} size={110} cor={C.verm}>DETALHE<br />ESTRANHO</Titulo>
    </Plano>
    <Plano r={[99.35, 114.85]} soco={false}>
      <Sensores r={99.35} rAzul={108.7} />
      <Faixa r={110.12} texto="O SEGURANÇA QUE ABRIU A PORTA" top={1130} size={50} />
    </Plano>
    <Plano r={[114.85, 125.9]}>
      <Foto src="g-cctv" r={[114.85, 125.9]} credito="Reprodução · câmera de segurança do museu, 1990 (divulgada em 2015)" top={480} w={1000} h={660} pos="50% 40%" zoom={[1.05, 1.2]} />
      <Rotulo r={115.42} texto="ANOS DEPOIS, UMA CÂMERA REVELOU…" top={230} size={40} cor={C.fita} />
      <Faixa r={119.04} texto="NA NOITE ANTERIOR AO ROUBO" top={320} size={52} />
      <Carimbo r={124.08} texto="NUNCA IDENTIFICADO" y={1220} rot={-4} size={74} />
    </Plano>
    <Plano r={[125.9, 130.7]}>
      <Fundo />
      <Grande r={125.94} top={560} size={66}>ele sempre negou<br />qualquer envolvimento.</Grande>
      <Carimbo r={129.04} texto="NUNCA ACUSADO" y={900} rot={-6} size={96} />
    </Plano>
    {/* o FBI */}
    <Plano r={[130.7, 140.4]}>
      <Foto src="g-sketch" r={[130.7, 140.4]} credito="Reprodução · FBI (retratos falados dos suspeitos)" top={560} w={900} h={600} pos="50% 50%" cover={false} cinza zoom={[1.0, 1.08]} />
      <Titulo r={130.8} top={180} size={100}>2013</Titulo>
      <Rotulo r={132.72} texto="O FBI DIZ QUE SABE QUEM FOI" top={320} size={46} cor={C.fita} />
      <Rotulo r={135.84} texto="organização criminosa da costa leste dos EUA" top={1190} size={36} />
    </Plano>
    <Plano r={[140.4, 146.5]}>
      <Clip src="c27717" r0={140.4} dur={6.1} a={0.6} />
      <Rotulo r={140.5} texto="AS OBRAS TERIAM PASSADO POR" top={420} size={42} cor={C.fita} />
      <Titulo r={142.28} top={500} size={80}>CONNECTICUT</Titulo>
      <Titulo r={143.22} top={610} size={80}>FILADÉLFIA</Titulo>
      <Faixa r={144.9} texto="E A PISTA SOME" top={800} size={70} />
    </Plano>
    <Plano r={[146.5, 156.3]}>
      <Fundo />
      <Rotulo r={146.56} texto="OS NOMES NUNCA FORAM DIVULGADOS" top={360} size={40} cor={C.fita} />
      <Carimbo r={149.16} texto="NINGUÉM PRESO" y={540} rot={-6} size={100} />
      <Rotulo r={150.7} texto="HOJE, O MUSEU OFERECE" top={720} size={44} />
      <Contador r={152.52} ate={153.2} valor={10} prefixo="US$ " sufixo=" MILHÕES" top={800} size={100} cor={C.verm} />
      <Rotulo r={154.32} texto="por informações que levem às obras" top={960} size={40} cor={C.ossoE} />
    </Plano>
    {/* o fim */}
    <Plano r={[156.3, 168.3]}>
      <Foto src="g-moldura3" r={[156.3, 168.3]} credito="Reprodução · moldura vazia no Museu Gardner" top={300} w={760} h={820} pos="50% 50%" cinza zoom={[1.0, 1.14]} />
      <Grande r={157.08} top={1150} size={44}>Isabella deixou escrito que nada<br />no museu poderia mudar de lugar</Grande>
      <Contador r={166.64} ate={167.3} valor={36} prefixo="HÁ " sufixo=" ANOS" top={180} size={84} />
    </Plano>
    <Plano r={[168.3, 177.4]}>
      <Foto src="g-moldura" r={[168.3, 177.4]} credito="Reprodução · CBS Boston" top={260} w={900} h={600} pos="50% 50%" cinza zoom={[1.05, 1.15]} />
      <Grande r={168.4} top={900} size={70}>Onde você estava<br />naquela noite?</Grande>
      <Rotulo r={170.54} texto="uma farda… e alguém que abrisse a porta" top={1060} size={36} cor={C.ossoE} />
      <Ass r={175.26} top={1130} />
    </Plano>
    <Plano r={[177.4, 260]} soco={false}>
      <Fechamento r={177.5} caso="Nº 020" status="SEM SOLUÇÃO" pergunta="13 obras. 36 anos. Nenhuma recuperada." />
    </Plano>
  </Reel>
);
