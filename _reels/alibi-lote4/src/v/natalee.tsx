import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile } from "remotion";
import palavras from "../../public/palavras-natalee.json";
import { C, COURIER, Carimbo, Cheia, Clip, Contador, ELITE, Faixa, Foto, Fundo, Grande, MONT, Papel, Cabec, Linha, Plano, Reel, Rotulo, SANS, SOMBRA, Titulo, TituloVivo, clamp, lin, mkCtx, useT } from "../kit";
import { Ficha } from "../ui";

// ÁLIBI · CASO Nº 016 — Natalee Holloway (Aruba, 2005). Fontes: DOJ (N.D. Alabama, 2023), FBI (2010), AP, CBS, CNN, ABC.
// Regra: Joran CONFESSOU (2023), mas nunca foi condenado pela morte de Natalee — só pela extorsão (EUA) e pela morte de Stephany Flores (Peru).
type Ws = { words: { text: string; start: number; end: number }[] };
export const ctxN = mkCtx({
  caso: "Nº 016", audio: "natalee", words: (palavras as Ws).words, lead: 0.1, fimVozRaw: 220.81, final: "alibi", proximo: "NO PERFIL",
  cta: ["Você acha que um dia vão achar a Natalee?", "comenta: SIM ou NÃO ↓"],
  chave: /^(natalee|joran|beth|fbi|mentira|nada|peru|confessa|assassino|álibi|corpo|nunca|extorsão|dinheiro|stephany|aruba)$/i,
  semLegenda: [[209.01, 266.21]],
  sfx: [
    { src: "impacto", r: 0.02, vol: 0.45 }, { src: "carimbo", r: 5.4, vol: 0.4 }, { src: "cassete", r: 14.81, vol: 0.4 }, { src: "whoosh", r: 18.91, vol: 0.3 },
    { src: "subida", r: 21.61, vol: 0.25 }, { src: "whoosh", r: 27.31, vol: 0.25 }, { src: "whoosh", r: 32.31, vol: 0.25 }, { src: "trava", r: 37.11, vol: 0.35 },
    ...Array.from({ length: 6 }, (_, i) => ({ src: "tique", r: 43.31 + i * 0.5, vol: 0.25 })), { src: "impacto", r: 48.91, vol: 0.35 }, { src: "coracao", r: 53.59, vol: 0.5 },
    { src: "whoosh", r: 56.61, vol: 0.25 }, { src: "impacto", r: 60.53, vol: 0.4 }, { src: "whoosh", r: 62.31, vol: 0.25 }, { src: "carimbo", r: 69.55, vol: 0.5 },
    { src: "tecla", r: 71.21, vol: 0.25 }, { src: "tecla", r: 73.81, vol: 0.25 }, { src: "carimbo", r: 78.47, vol: 0.45 }, { src: "carimbo", r: 79.99, vol: 0.5 },
    { src: "trava", r: 82.79, vol: 0.4 }, { src: "carimbo", r: 83.97, vol: 0.45 }, { src: "impacto", r: 87.15, vol: 0.4 }, { src: "subida", r: 89.01, vol: 0.3 },
    { src: "coracao", r: 96.41, vol: 0.45 }, { src: "carimbo", r: 104.25, vol: 0.5 }, { src: "subida", r: 105.91, vol: 0.3 }, { src: "tecla", r: 109.11, vol: 0.25 },
    ...Array.from({ length: 10 }, (_, i) => ({ src: "tique", r: 112.61 + i * 0.12, vol: 0.22 })), { src: "trava", r: 119.87, vol: 0.4 }, { src: "impacto", r: 123.03, vol: 0.35 },
    ...Array.from({ length: 8 }, (_, i) => ({ src: "tique", r: 125.21 + i * 0.12, vol: 0.22 })), { src: "impacto", r: 131.01, vol: 0.4 }, { src: "coracao", r: 135.05, vol: 0.45 },
    { src: "carimbo", r: 140.35, vol: 0.55 }, { src: "whoosh", r: 141.81, vol: 0.3 }, { src: "impacto", r: 145.03, vol: 0.4 }, { src: "coracao", r: 148.99, vol: 0.5 },
    { src: "whoosh", r: 153.11, vol: 0.25 }, { src: "coracao", r: 161.67, vol: 0.5 }, { src: "carimbo", r: 164.07, vol: 0.5 }, { src: "subida", r: 172.21, vol: 0.3 },
    { src: "trava", r: 178.81, vol: 0.4 }, { src: "tecla", r: 180.81, vol: 0.25 }, { src: "impacto", r: 184.69, vol: 0.45 }, { src: "coracao", r: 188.61, vol: 0.5 },
    { src: "impacto", r: 194.71, vol: 0.4 }, { src: "impacto", r: 201.03, vol: 0.5 }, { src: "carimbo", r: 205.41, vol: 0.5 },
  ],
});

// ── mapa simples: Aruba e a costa da Venezuela (≈ 29 km) ──
const Mapa: React.FC<{ r: number }> = ({ r }) => {
  const { t, o } = useT();
  const k = lin(t, o(r), o(r) + 0.8, Easing.out(Easing.cubic));
  const km = Math.round(interpolate(t, [o(r) + 0.6, o(r) + 1.8], [0, 29], clamp));
  return <AbsoluteFill>
    <Fundo cor="radial-gradient(ellipse at 50% 40%, #13202A 0%, #0A0A0B 80%)" />
    <svg width="1080" height="1920" style={{ position: "absolute", opacity: k }}>
      <path d="M -20 1180 C 200 1140, 380 1200, 560 1160 S 900 1120, 1100 1170 L 1100 1600 L -20 1600 Z" fill="#1E2A22" stroke="#3E5A48" strokeWidth="4" />
      <path d="M 420 640 C 470 600, 560 610, 640 680 C 700 730, 720 790, 690 810 C 650 830, 600 790, 560 760 C 500 720, 430 700, 420 640 Z" fill="#2A3A30" stroke={C.osso} strokeWidth="4" />
      <line x1="600" y1="800" x2="600" y2="1150" stroke={C.verm} strokeWidth="5" strokeDasharray="14 12" strokeDashoffset={-t * 40} opacity={lin(t, o(r) + 0.5, o(r) + 0.9)} />
      <circle cx="470" cy="672" r={16.21 + 4 * Math.sin(t * 6)} fill={C.verm} />
    </svg>
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 64, color: C.osso, opacity: k, textShadow: SOMBRA }}>ARUBA</div>
    <div style={{ position: "absolute", left: 640, top: 940, fontFamily: MONT, fontWeight: 800, fontSize: 58, color: C.verm, opacity: lin(t, o(r) + 0.6, o(r) + 0.9), textShadow: SOMBRA }}>≈ {km} km</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1210, textAlign: "center", fontFamily: COURIER, fontWeight: 700, fontSize: 40, letterSpacing: "0.2em", color: C.ossoE, opacity: k }}>VENEZUELA</div>
  </AbsoluteFill>;
};
// rebobinar: 2010 → 2005
const Rebobina: React.FC<{ r: number; ate: number }> = ({ r, ate }) => {
  const { t, o } = useT();
  const ano = Math.round(interpolate(t, [o(r), o(ate)], [2010, 2005], { ...clamp, easing: Easing.inOut(Easing.cubic) }));
  const pisca = Math.floor(t * 4) % 2 === 0;
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 260, color: C.osso, textShadow: SOMBRA, fontVariantNumeric: "tabular-nums" }}>{ano}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", fontFamily: COURIER, fontWeight: 700, fontSize: 48, letterSpacing: "0.2em", color: pisca ? C.verm : C.ossoE }}>◀◀ VOLTANDO</div>
  </>;
};
// linha do tempo (2005 → 2023), destaca o ano atual
const ANOS = ["2005", "2008", "2010", "2023"];
const LinhaTempo: React.FC<{ r: number; ativo: number; sub: string }> = ({ r, ativo, sub }) => {
  const { t, o } = useT();
  const k = lin(t, o(r), o(r) + 0.6, Easing.out(Easing.cubic));
  return <>
    <Fundo />
    <div style={{ position: "absolute", left: 170, right: 170, top: 760, height: 6, background: "rgba(236,231,220,0.25)" }} />
    <div style={{ position: "absolute", left: 170, top: 760, height: 6, width: 740 * (ativo / 3) * k, background: C.verm }} />
    {ANOS.map((a, i) => {
      const x = 170 + (740 * i) / 3, on = i === ativo, passou = i < ativo;
      return <div key={a} style={{ position: "absolute", left: x - 90, width: 180, top: on ? 560 : 640, textAlign: "center" }}>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: on ? 80 : 48, color: on ? C.osso : passou ? C.ossoE : "rgba(236,231,220,0.3)", transform: `scale(${on ? 0.9 + 0.1 * k : 1})` }}>{a}</div>
        <div style={{ margin: "26px auto 0", width: on ? 34 : 22, height: on ? 34 : 22, borderRadius: 20, background: on || passou ? C.verm : "#333", boxShadow: on ? `0 0 30px ${C.verm}` : "none" }} />
      </div>;
    })}
    <div style={{ position: "absolute", left: 60, right: 60, top: 900, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.osso, opacity: lin(t, o(r) + 0.3, o(r) + 0.7) }}>{sub}</div>
  </>;
};
// os três rapazes
const Trio: React.FC<{ r: number[] }> = ({ r }) => {
  const { t, o } = useT();
  const cards: [string, string | null][] = [["JORAN VAN DER SLOOT", "n-joran-2005"], ["DEEPAK KALPOE", null], ["SATISH KALPOE", null]];
  return <>{cards.map(([nome, img], i) => {
    const k = lin(t, o(r[i]) - 0.05, o(r[i]) + 0.35, Easing.out(Easing.back(1.5)));
    if (k <= 0) return null;
    return <div key={i} style={{ position: "absolute", left: 60 + i * 330, top: 520, width: 300, opacity: Math.min(1, k * 1.3), transform: `scale(${0.85 + 0.15 * k}) rotate(${(i - 1) * 2}deg)` }}>
      <div style={{ width: 300, height: 380, border: "8px solid #D9D2C0", background: "#1A1815", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.9)", position: "relative" }}>
        {img ? <Img src={staticFile(`img/${img}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(0.6) contrast(1.1)" }} />
          : <svg viewBox="0 0 100 126" style={{ position: "absolute", left: 0, bottom: 0, width: "100%" }}><path d="M30 42 a20 21 0 1 0 40 0 a20 21 0 1 0 -40 0 Z M12 126 C14 94 30 80 50 80 C70 80 86 94 88 126 Z" fill="#3A3530" /></svg>}
      </div>
      <div style={{ marginTop: 14, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 30, lineHeight: 1.1, color: C.osso, textShadow: SOMBRA }}>{nome}</div>
    </div>;
  })}</>;
};
// dois calendários: 30/05/2005 e 30/05/2010
const Calendarios: React.FC<{ r: number; r2: number }> = ({ r, r2 }) => {
  const { t, o } = useT();
  const fol = (rr: number, ano: string, left: number, cor: string) => {
    const k = lin(t, o(rr) - 0.05, o(rr) + 0.35, Easing.out(Easing.back(1.5)));
    if (k <= 0) return null;
    return <div style={{ position: "absolute", left, top: 460, width: 400, opacity: Math.min(1, k * 1.3), transform: `scale(${0.85 + 0.15 * k})` }}>
      <div style={{ background: cor, height: 80, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONT, fontWeight: 800, fontSize: 44, color: C.osso }}>MAIO · {ano}</div>
      <div style={{ background: C.papel, height: 300, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONT, fontWeight: 800, fontSize: 200, color: C.tinta }}>30</div>
    </div>;
  };
  return <>{fol(r, "2005", 80, "#4A4540")}{fol(r2, "2010", 600, C.lacre)}</>;
};
const Ass: React.FC<{ r: number }> = ({ r }) => {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.05, o(r) + 0.6, Easing.out(Easing.cubic));
  return <div style={{ position: "absolute", left: 60, right: 60, top: 960, textAlign: "center", opacity: k, fontFamily: ELITE, fontSize: 60, color: C.osso, textShadow: SOMBRA }}>…e nenhum era o álibi.</div>;
};

export const Natalee: React.FC = () => (
  <Reel ctx={ctxN}>
    {/* GANCHO — Beth com a foto da filha; texto entra com a voz */}
    <Plano r={[-0.1, 4.9]} forte>
      <Foto src="n-beth-natalee" r={[-0.1, 4.9]} fundo="c18305" credito="Reprodução · Access Hollywood · Beth e a foto de Natalee" top={760} w={1040} h={440} pos="50% 70%" zoom={[1.0, 1.08]} />
      <TituloVivo top={170} size={84} destaque="US$ 25 MIL" linhas={[[["ELE", 0], ["COBROU", 0.16]], [["US$ 25 MIL", 0.56]], [["DA", 2.22], ["MÃE", 2.42], ["DELA", 2.6]], [["PRA", 2.92], ["CONTAR", 3.1], ["ONDE", 3.44]], [["ESTAVA", 3.88], ["O", 4.2], ["CORPO", 4.34]]]} />
    </Plano>
    <Plano r={[4.9, 6.55]}>
      <Clip src="c18305" r0={4.9} dur={1.65} a={0.5} />
      <Carimbo r={5.4} texto="E PEGOU O DINHEIRO" y={800} rot={-6} size={84} />
    </Plano>
    <Plano r={[6.55, 12.76]}>
      <Foto src="n-netflix" r={[6.55, 12.76]} credito="Reprodução · Netflix · trailer oficial de “Taken: Natalee Holloway” (2026)" top={420} w={1000} h={560} pos="50% 50%" zoom={[1.0, 1.1]} />
      <Rotulo r={6.7} texto="ESSA HISTÓRIA VIROU SÉRIE…" top={260} size={44} cor={C.fita} />
      <Contador r={10.2} ate={10.6} valor={1} prefixo="#" top={1020} size={190} cor={C.verm} />
      <Rotulo r={10.4} texto="estreou em 1º lugar no mundo" top={1220} size={40} />
    </Plano>
    <Plano r={[12.76, 18.91]}>
      <Fundo />
      <Rotulo r={12.81} texto="MAS PRA ENTENDER COMO ISSO ACONTECEU…" top={400} size={36} cor={C.fita} />
      <Rebobina r={14.81} ate={17.61} />
    </Plano>
    <Plano r={[18.91, 21.61]}>
      <Mapa r={18.91} />
      <Titulo r={19.87} top={260} size={84}>MAIO · 2005</Titulo>
    </Plano>
    <Plano r={[21.61, 27.31]}>
      <Clip src="c44364" r0={21.61} dur={5.7} a={0.5} />
      <Contador r={21.77} ate={23.01} valor={125} top={420} size={200} />
      <Titulo r={22.35} top={640} size={76}>FORMANDOS</Titulo>
      <Rotulo r={23.65} texto="de um colégio do Alabama (EUA)" top={760} size={40} />
      <Faixa r={25.53} texto="COMEMORAR O FIM DA ESCOLA" top={860} size={52} />
    </Plano>
    <Plano r={[27.31, 32.31]}>
      <Foto src="n-natalee-yb" r={[27.31, 32.31]} credito="Reprodução · foto de família divulgada à imprensa" top={300} w={740} h={860} pos="50% 25%" zoom={[1.0, 1.1]} />
      <Faixa r={28.73} texto="NATALEE HOLLOWAY" top={1100} size={64} />
      <Rotulo r={30.11} texto="18 anos" top={1190} size={40} />
      <Rotulo r={31.37} texto="queria ser médica" top={220} size={44} cor={C.fita} />
    </Plano>
    <Plano r={[32.31, 35.16]}>
      <Clip src="c8711" r0={32.31} dur={2.85} a={0.5} />
      <Titulo r={32.36} top={400} size={90}>A ÚLTIMA NOITE<br />DA VIAGEM</Titulo>
    </Plano>
    <Plano r={[35.16, 37.06]}>
      <Foto src="n-rua-bar" r={[35.16, 37.06]} credito="Reprodução · CNN · rua onde Natalee foi vista pela última vez" top={420} w={980} h={620} zoom={[1.0, 1.1]} />
      <Faixa r={35.41} texto="CARLOS'N CHARLIE'S" top={270} size={66} />
    </Plano>
    <Plano r={[37.06, 43.21]}>
      <Ficha sup="ARUBA · MAIO DE 2005" nome="JORAN VAN DER SLOOT" foto="n-joran-2005" pos="50% 30%" credito="foto: reprodução (SBS6)" top={360}
        linhas={[[33.02, "— holandês"], [33.78, "— 17 anos"]]} />
    </Plano>
    <Plano r={[43.21, 48.81]}>
      <Clip src="c27717" r0={43.21} dur={5.6} a={0.5} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "14px 40px", background: "rgba(10,10,11,0.85)", border: `3px solid ${C.osso}`, fontFamily: MONT, fontWeight: 800, fontSize: 150, color: C.osso }}>01:30</div>
      </div>
      <Rotulo r={45.39} texto="OS AMIGOS VEEM NATALEE…" top={640} size={42} cor={C.fita} />
      <Faixa r={47.85} texto="ENTRAR NUM CARRO" top={720} size={64} />
    </Plano>
    <Plano r={[48.81, 53.51]}>
      <Fundo />
      <Rotulo r={48.89} texto="COM:" top={380} size={50} cor={C.fita} />
      <Trio r={[49.29, 51.51, 52.23]} />
    </Plano>
    <Plano r={[53.51, 56.61]}>
      <Foto src="n-natalee-sorriso" r={[53.51, 56.61]} credito="Reprodução · Netflix (trailer)" top={330} w={760} h={820} pos="45% 30%" cinza zoom={[1.05, 1.15]} />
      <Carimbo r={54.53} texto="ÚLTIMA VEZ VISTA" y={1130} rot={-6} size={76} />
    </Plano>
    <Plano r={[56.61, 62.31]}>
      <Clip src="c34613" r0={56.61} dur={5.7} a={0.5} />
      <Titulo r={56.67} top={380} size={96}>DE MANHÃ</Titulo>
      <Rotulo r={57.87} texto="o grupo se reúne pra voltar pra casa" top={520} size={40} />
      <Faixa r={60.53} texto="NATALEE NÃO APARECE" top={640} size={66} />
    </Plano>
    <Plano r={[62.31, 66.51]}>
      <Foto src="n-beth-2005" r={[62.31, 66.51]} credito="Reprodução · AP (Aruba, 2005)" top={420} w={940} h={700} pos="65% 30%" zoom={[1.0, 1.12]} />
      <Faixa r={63.37} texto="BETH · A MÃE" top={260} size={66} />
      <Rotulo r={64.15} texto="voa pra Aruba no mesmo dia" top={1150} size={40} />
    </Plano>
    <Plano r={[66.51, 70.51]}>
      <Clip src="c1085" r0={66.51} dur={4.0} a={0.5} />
      <Titulo r={66.59} top={380} size={90}>CENTENAS DE<br />VOLUNTÁRIOS</Titulo>
      <Carimbo r={69.55} texto="NADA" y={800} rot={-8} size={170} />
    </Plano>
    <Plano r={[70.51, 77.01]}>
      <Fundo />
      <Papel top={380} h={560} rot={-1}>
        <Cabec sup="DEPOIMENTO DOS TRÊS RAPAZES" titulo="“DEIXAMOS ELA NO HOTEL”" size={52} />
        <Linha r={74.75} texto="— por volta das 2h da manhã" />
      </Papel>
    </Plano>
    <Plano r={[77.01, 80.81]}>
      <Foto src="n-joran-2005" r={[77.01, 80.81]} credito="Reprodução (SBS6)" top={520} w={620} h={760} pos="50% 35%" cinza zoom={[1.0, 1.08]} />
      <Titulo r={77.07} top={300} size={82}>JORAN MUDA<br />A VERSÃO</Titulo>
      <Carimbo r={78.47} texto="MUDOU" y={760} rot={-8} size={110} />
      <Carimbo r={79.99} texto="DE NOVO" y={960} rot={6} size={110} />
    </Plano>
    <Plano r={[80.81, 84.71]}>
      <Foto src="n-polis" r={[80.81, 84.71]} credito="Reprodução · AP · polícia de Aruba" top={430} w={940} h={680} zoom={[1.0, 1.1]} />
      <Titulo r={80.89} top={240} size={84}>JUNHO · PRESOS</Titulo>
      <Carimbo r={83.97} texto="SOLTOS" y={780} rot={-8} size={140} />
    </Plano>
    <Plano r={[84.71, 89.01]}>
      <Fundo />
      <Rotulo r={84.79} texto="✗ SEM CORPO" top={480} size={64} />
      <Rotulo r={86.01} texto="✗ SEM PROVAS" top={580} size={64} />
      <Faixa r={87.15} texto="NINGUÉM É ACUSADO" top={720} size={70} />
    </Plano>
    <Plano r={[89.01, 91.21]}><LinhaTempo r={89.01} ativo={1} sub="3 anos depois…" /></Plano>
    <Plano r={[91.21, 96.31]}>
      <Clip src="c42039" r0={91.21} dur={5.1} a={0.5} />
      <Rotulo r={91.31} texto="ELE ENTRA NO CARRO DE UM AMIGO…" top={300} size={40} cor={C.fita} />
      <Faixa r={94.45} texto="● CÂMERAS ESCONDIDAS" top={380} size={60} />
      <Foto src="n-peter" r={[91.21, 96.31]} credito="Reprodução · AP · Peter R. de Vries" top={600} w={520} h={420} zoom={[1.0, 1.1]} />
      <Rotulo r={95.11} texto="armadilha do jornalista Peter R. de Vries" top={1060} size={34} />
    </Plano>
    <Plano r={[96.31, 102.51]}>
      <Clip src="c9294" r0={96.31} dur={6.2} a={0.6} />
      <Rotulo r={96.39} texto="NA GRAVAÇÃO, JORAN DIZ:" top={330} size={44} cor={C.fita} />
      <Grande r={98.23} top={450} size={66}>“ela passou mal<br />na praia”</Grande>
      <Grande r={100.37} top={700} size={66}>“mandei um amigo jogar<br />o corpo no mar”</Grande>
    </Plano>
    <Plano r={[102.51, 105.81]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Rotulo r={102.55} texto="O VÍDEO VAI AO AR. E ELE DIZ:" top={480} size={40} cor={C.fita} />
      <Carimbo r={104.25} texto="“INVENTEI TUDO”" y={760} rot={-6} size={86} />
    </Plano>
    <Plano r={[105.81, 108.31]}><LinhaTempo r={105.81} ativo={2} sub="então chega 2010" /></Plano>
    <Plano r={[108.31, 112.51]}>
      <Fundo />
      <Papel top={400} h={460} rot={1}>
        <Cabec sup="E-MAIL AO ADVOGADO DA FAMÍLIA · 2010" titulo="UMA PROPOSTA" size={64} />
        <Linha r={109.61} texto="— de: Joran van der Sloot" />
      </Papel>
    </Plano>
    <Plano r={[112.51, 118.61]}>
      <Fundo cor="radial-gradient(ellipse at 50% 40%, #1F2A1E 0%, #0A0A0B 75%)" />
      <Contador r={112.53} ate={114.11} valor={250000} prefixo="US$ " top={460} size={150} />
      <Rotulo r={114.75} texto="pela localização do corpo" top={660} size={46} />
      <Contador r={116.93} ate={117.81} valor={25000} prefixo="US$ " top={840} size={110} cor={C.verm} />
      <Rotulo r={117.87} texto="ADIANTADOS" top={980} size={50} />
    </Plano>
    <Plano r={[118.61, 121.31]}>
      <Foto src="n-beth-press" r={[118.61, 121.31]} credito="Reprodução · AP · Beth Holloway" top={430} w={940} h={680} zoom={[1.0, 1.1]} />
      <Faixa r={119.55} texto="BETH AVISA O FBI" top={260} size={70} />
    </Plano>
    <Plano r={[121.31, 123.91]}>
      <Foto src="n-sting" r={[121.31, 123.91]} credito="Reprodução · imagens do FBI (via Inside Edition/Netflix)" top={560} w={1000} h={560} pos="40% 50%" zoom={[1.0, 1.1]} />
      <Rotulo r={121.35} texto="● REC" top={230} size={60} cor={C.verm} />
      <Titulo r={122.25} top={330} size={84}>ENCONTRO<br />GRAVADO</Titulo>
    </Plano>
    <Plano r={[123.91, 128.21]}>
      <Clip src="c23168" r0={123.91} dur={4.3} a={0.5} />
      <Contador r={125.21} ate={126.11} valor={10000} prefixo="US$ " top={420} size={150} />
      <Rotulo r={126.19} texto="EM DINHEIRO, NA FRENTE DELE" top={600} size={44} />
    </Plano>
    <Plano r={[128.21, 131.91]}>
      <Fundo cor="radial-gradient(ellipse at 50% 40%, #1F2A1E 0%, #0A0A0B 75%)" />
      <Rotulo r={128.21} texto="US$ 10.000 em dinheiro" top={380} size={50} cor={C.ossoE} />
      <Contador r={128.77} ate={129.61} valor={15000} prefixo="+ US$ " top={470} size={110} />
      <Rotulo r={129.83} texto="na conta dele, na Holanda" top={610} size={42} />
      <div style={{ position: "absolute", left: 200, right: 200, top: 700, height: 5, background: C.osso, opacity: 0.6 }} />
      <Contador r={130.81} ate={131.41} valor={25000} prefixo="= US$ " top={740} size={130} cor={C.verm} />
    </Plano>
    <Plano r={[131.91, 140.21]}>
      <Clip src="c5291" r0={131.91} dur={8.3} a={0.55} />
      <Rotulo r={131.99} texto="JORAN LEVA O ADVOGADO ATÉ UMA CASA" top={330} size={38} cor={C.fita} />
      <Grande r={134.25} top={450} size={64}>“meu pai enterrou ela aqui,<br />embaixo da fundação”</Grande>
      <Rotulo r={135.87} texto="(o pai dele já tinha morrido)" top={680} size={40} />
    </Plano>
    <Plano r={[140.21, 141.81]}>
      <Fundo cor={C.preto} />
      <Carimbo r={140.35} texto="MENTIRA" y={820} rot={-8} size={170} />
    </Plano>
    <Plano r={[141.81, 144.96]}>
      <Clip src="c7374" r0={141.81} dur={3.15} a={0.5} />
      <Titulo r={141.91} top={400} size={80}>COM O DINHEIRO<br />NO BOLSO…</Titulo>
      <Faixa r={144.71} texto="PERU" top={640} size={90} />
    </Plano>
    <Plano r={[144.96, 148.91]}>
      <Clip src="c41161" r0={144.96} dur={3.95} a={0.5} />
      <Titulo r={145.03} top={380} size={96}>30 DE MAIO<br />DE 2010</Titulo>
      <Rotulo r={148.09} texto="LIMA · PERU" top={620} size={50} cor={C.fita} />
    </Plano>
    <Plano r={[148.91, 153.11]}>
      <Fundo />
      <Calendarios r={148.99} r2={150.31} />
      <Faixa r={150.67} texto="EXATAMENTE 5 ANOS DEPOIS" top={900} size={60} />
    </Plano>
    <Plano r={[153.11, 159.71]}>
      <Clip src="c5230" r0={153.11} dur={6.6} a={0.5} />
      <Rotulo r={153.21} texto="NUM CASSINO, JOGANDO PÔQUER…" top={360} size={44} cor={C.fita} />
      <Faixa r={158.35} texto="STEPHANY FLORES · 21 ANOS" top={460} size={56} />
    </Plano>
    <Plano r={[159.71, 164.01]}>
      <Clip src="c27291" r0={159.71} dur={4.3} a={0.55} />
      <Rotulo r={159.75} texto="OS DOIS VÃO PRO HOTEL DELE" top={400} size={44} />
      <Grande r={161.67} top={560} size={84}>ela nunca<br />sai de lá.</Grande>
    </Plano>
    <Plano r={[164.01, 168.41]}>
      <Foto src="n-joran-peru" r={[164.01, 168.41]} credito="Reprodução · CBS (Peru, 2010)" top={380} w={960} h={620} pos="60% 30%" zoom={[1.0, 1.1]} />
      <Carimbo r={164.07} texto="CONFESSOU" y={300} rot={-6} size={90} />
      <Contador r={166.19} ate={166.81} valor={28} sufixo=" ANOS" top={1050} size={110} cor={C.verm} />
      <Rotulo r={167.77} texto="de prisão no Peru" top={1170} size={40} />
    </Plano>
    <Plano r={[168.41, 172.21]}>
      <Foto src="n-beth-natalee" r={[168.41, 172.21]} credito="Reprodução · Access Hollywood" top={420} w={1040} h={440} pos="50% 70%" cinza zoom={[1.0, 1.08]} />
      <Grande r={168.49} top={940} size={70}>mas a mãe de Natalee<br />continuava sem resposta</Grande>
    </Plano>
    <Plano r={[172.21, 174.51]}><LinhaTempo r={172.21} ativo={3} sub="18 anos depois do sumiço" /></Plano>
    <Plano r={[174.51, 179.81]}>
      <Foto src="n-extradicao" r={[174.51, 179.81]} credito="Reprodução · WVTM 13 · extradição para os EUA (2023)" top={430} w={980} h={620} zoom={[1.0, 1.1]} />
      <Titulo r={174.55} top={230} size={76}>LEVADO AOS EUA</Titulo>
      <Faixa r={178.57} texto="E FAZ UM ACORDO" top={1100} size={62} />
    </Plano>
    <Plano r={[179.81, 184.61]}>
      <Fundo />
      <Papel top={360} h={600} rot={-1}>
        <Cabec sup="TRIBUNAL FEDERAL · ALABAMA · 18/10/2023" titulo="ACORDO" size={70} />
        <Linha r={180.21} texto="— 20 anos (junto com o Peru)" />
        <Linha r={181.63} texto="— em troca: a verdade" />
        <Linha r={182.81} texto="  sobre Natalee" />
      </Papel>
    </Plano>
    <Plano r={[184.61, 187.96]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Contador r={184.99} ate={185.91} valor={18} sufixo=" ANOS" top={520} size={190} />
      <Titulo r={185.97} top={740} size={80}>DEPOIS…</Titulo>
      <Faixa r={187.33} texto="ELE CONTA" top={880} size={80} />
    </Plano>
    <Plano r={[187.96, 193.16]}>
      <Foto src="n-joran-2023" r={[187.96, 193.16]} credito="Reprodução · CBS News" top={330} w={820} h={740} pos="50% 30%" zoom={[1.0, 1.12]} cinza />
      <Rotulo r={188.01} texto="CONFISSÃO · 2023" top={200} size={48} cor={C.verm} />
      <Grande r={188.63} top={1100} size={58}>matou Natalee naquela noite, na praia,<br />depois que ela rejeitou ele</Grande>
    </Plano>
    <Plano r={[193.16, 197.46]}>
      <Clip src="c1954" r0={193.16} dur={4.3} a={0.55} />
      <Rotulo r={193.69} texto="O JUIZ:" top={380} size={50} cor={C.fita} />
      <Titulo r={194.71} top={470} size={80}>“O CORPO NUNCA VAI<br />SER ENCONTRADO”</Titulo>
    </Plano>
    <Plano r={[197.46, 203.31]}>
      <Foto src="n-beth-tribunal" r={[197.46, 203.31]} credito="Reprodução · WVTM 13 · Birmingham, 2023" top={430} w={1020} h={460} pos="55% 35%" zoom={[1.0, 1.08]} />
      <Rotulo r={197.51} texto="NO TRIBUNAL, BETH OLHA PRA ELE…" top={300} size={40} cor={C.fita} />
      <Grande r={201.03} top={980} size={84}>“Você é um assassino.”</Grande>
    </Plano>
    <Plano r={[203.31, 209.01]}>
      <Fundo />
      <Papel top={380} h={560} rot={1}>
        <Cabec sup="FICHA DE JORAN VAN DER SLOOT" titulo="CONDENAÇÕES" size={64} />
        <Linha r={203.81} texto="✓ Stephany (Peru): 28 anos" />
        <Linha r={204.71} texto="✗ Natalee: nunca" />
        <Linha r={207.41} texto="✓ extorsão (EUA): 20 anos" />
      </Papel>
      <Carimbo r={205.41} texto="NUNCA" y={1060} rot={-8} size={120} />
    </Plano>
    <Plano r={[209.01, 266.21]} soco={false}>
      <Clip src="c4677" r0={209.01} dur={9} a={0.6} />
      <Grande r={209.11} top={560} size={84}>Onde você estava<br />naquela noite?</Grande>
      <Rotulo r={211.15} texto="ele respondeu de vários jeitos, por 18 anos" top={800} size={36} cor={C.ossoE} />
      <Ass r={215.65} />
    </Plano>
  </Reel>
);
