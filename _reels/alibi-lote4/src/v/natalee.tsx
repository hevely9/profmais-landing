import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile } from "remotion";
import palavras from "../../public/palavras-natalee.json";
import { C, COURIER, Carimbo, Cheia, Clip, Contador, ELITE, Faixa, Foto, Fundo, Grande, MONT, Papel, Cabec, Linha, Plano, Reel, Rotulo, SANS, SOMBRA, Titulo, TituloVivo, clamp, lin, mkCtx, useT } from "../kit";
import { Ficha } from "../ui";

// ÁLIBI · CASO Nº 016 — Natalee Holloway (Aruba, 2005). Fontes: DOJ (N.D. Alabama, 2023), FBI (2010), AP, CBS, CNN, ABC.
// Regra: Joran CONFESSOU (2023), mas nunca foi condenado pela morte de Natalee — só pela extorsão (EUA) e pela morte de Stephany Flores (Peru).
type Ws = { words: { text: string; start: number; end: number }[] };
export const ctxN = mkCtx({
  caso: "Nº 016", audio: "natalee", words: (palavras as Ws).words, lead: 0.1, fimVozRaw: 214.6, final: "alibi", proximo: "NO PERFIL",
  cta: ["Você acha que um dia vão achar a Natalee?", "comenta: SIM ou NÃO ↓"],
  chave: /^(natalee|joran|beth|fbi|mentira|nada|peru|confessa|assassino|álibi|corpo|nunca|extorsão|dinheiro|stephany|aruba)$/i,
  semLegenda: [[202.8, 260]],
  sfx: [
    { src: "impacto", r: 0.02, vol: 0.45 }, { src: "carimbo", r: 5.4, vol: 0.4 }, { src: "cassete", r: 8.6, vol: 0.4 }, { src: "whoosh", r: 12.7, vol: 0.3 },
    { src: "subida", r: 15.4, vol: 0.25 }, { src: "whoosh", r: 21.1, vol: 0.25 }, { src: "whoosh", r: 26.1, vol: 0.25 }, { src: "trava", r: 30.9, vol: 0.35 },
    ...Array.from({ length: 6 }, (_, i) => ({ src: "tique", r: 37.1 + i * 0.5, vol: 0.25 })), { src: "impacto", r: 42.7, vol: 0.35 }, { src: "coracao", r: 47.38, vol: 0.5 },
    { src: "whoosh", r: 50.4, vol: 0.25 }, { src: "impacto", r: 54.32, vol: 0.4 }, { src: "whoosh", r: 56.1, vol: 0.25 }, { src: "carimbo", r: 63.34, vol: 0.5 },
    { src: "tecla", r: 65.0, vol: 0.25 }, { src: "tecla", r: 67.6, vol: 0.25 }, { src: "carimbo", r: 72.26, vol: 0.45 }, { src: "carimbo", r: 73.78, vol: 0.5 },
    { src: "trava", r: 76.58, vol: 0.4 }, { src: "carimbo", r: 77.76, vol: 0.45 }, { src: "impacto", r: 80.94, vol: 0.4 }, { src: "subida", r: 82.8, vol: 0.3 },
    { src: "coracao", r: 90.2, vol: 0.45 }, { src: "carimbo", r: 98.04, vol: 0.5 }, { src: "subida", r: 99.7, vol: 0.3 }, { src: "tecla", r: 102.9, vol: 0.25 },
    ...Array.from({ length: 10 }, (_, i) => ({ src: "tique", r: 106.4 + i * 0.12, vol: 0.22 })), { src: "trava", r: 113.66, vol: 0.4 }, { src: "impacto", r: 116.82, vol: 0.35 },
    ...Array.from({ length: 8 }, (_, i) => ({ src: "tique", r: 119.0 + i * 0.12, vol: 0.22 })), { src: "impacto", r: 124.8, vol: 0.4 }, { src: "coracao", r: 128.84, vol: 0.45 },
    { src: "carimbo", r: 134.14, vol: 0.55 }, { src: "whoosh", r: 135.6, vol: 0.3 }, { src: "impacto", r: 138.82, vol: 0.4 }, { src: "coracao", r: 142.78, vol: 0.5 },
    { src: "whoosh", r: 146.9, vol: 0.25 }, { src: "coracao", r: 155.46, vol: 0.5 }, { src: "carimbo", r: 157.86, vol: 0.5 }, { src: "subida", r: 166.0, vol: 0.3 },
    { src: "trava", r: 172.6, vol: 0.4 }, { src: "tecla", r: 174.6, vol: 0.25 }, { src: "impacto", r: 178.48, vol: 0.45 }, { src: "coracao", r: 182.4, vol: 0.5 },
    { src: "impacto", r: 188.5, vol: 0.4 }, { src: "impacto", r: 194.82, vol: 0.5 }, { src: "carimbo", r: 199.2, vol: 0.5 },
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
      <circle cx="470" cy="672" r={10 + 4 * Math.sin(t * 6)} fill={C.verm} />
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
    <Plano r={[6.55, 12.7]}>
      <Fundo />
      <Rotulo r={6.6} texto="MAS PRA ENTENDER COMO ISSO ACONTECEU…" top={400} size={36} cor={C.fita} />
      <Rebobina r={8.6} ate={11.4} />
    </Plano>
    <Plano r={[12.7, 15.4]}>
      <Mapa r={12.7} />
      <Titulo r={13.66} top={260} size={84}>MAIO · 2005</Titulo>
    </Plano>
    <Plano r={[15.4, 21.1]}>
      <Clip src="c44364" r0={15.4} dur={5.7} a={0.5} />
      <Contador r={15.56} ate={16.8} valor={125} top={420} size={200} />
      <Titulo r={16.14} top={640} size={76}>FORMANDOS</Titulo>
      <Rotulo r={17.44} texto="de um colégio do Alabama (EUA)" top={760} size={40} />
      <Faixa r={19.32} texto="COMEMORAR O FIM DA ESCOLA" top={860} size={52} />
    </Plano>
    <Plano r={[21.1, 26.1]}>
      <Foto src="n-natalee-yb" r={[21.1, 26.1]} credito="Reprodução · foto de família divulgada à imprensa" top={300} w={740} h={860} pos="50% 25%" zoom={[1.0, 1.1]} />
      <Faixa r={22.52} texto="NATALEE HOLLOWAY" top={1100} size={64} />
      <Rotulo r={23.9} texto="18 anos" top={1190} size={40} />
      <Rotulo r={25.16} texto="queria ser médica" top={220} size={44} cor={C.fita} />
    </Plano>
    <Plano r={[26.1, 28.95]}>
      <Clip src="c8711" r0={26.1} dur={2.85} a={0.5} />
      <Titulo r={26.15} top={400} size={90}>A ÚLTIMA NOITE<br />DA VIAGEM</Titulo>
    </Plano>
    <Plano r={[28.95, 30.85]}>
      <Foto src="n-rua-bar" r={[28.95, 30.85]} credito="Reprodução · CNN · rua onde Natalee foi vista pela última vez" top={420} w={980} h={620} zoom={[1.0, 1.1]} />
      <Faixa r={29.2} texto="CARLOS'N CHARLIE'S" top={270} size={66} />
    </Plano>
    <Plano r={[30.85, 37.0]}>
      <Ficha sup="ARUBA · MAIO DE 2005" nome="JORAN VAN DER SLOOT" foto="n-joran-2005" pos="50% 30%" credito="foto: reprodução (SBS6)" top={360}
        linhas={[[33.02, "— holandês"], [33.78, "— 17 anos"]]} />
    </Plano>
    <Plano r={[37.0, 42.6]}>
      <Clip src="c27717" r0={37.0} dur={5.6} a={0.5} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "14px 40px", background: "rgba(10,10,11,0.85)", border: `3px solid ${C.osso}`, fontFamily: MONT, fontWeight: 800, fontSize: 150, color: C.osso }}>01:30</div>
      </div>
      <Rotulo r={39.18} texto="OS AMIGOS VEEM NATALEE…" top={640} size={42} cor={C.fita} />
      <Faixa r={41.64} texto="ENTRAR NUM CARRO" top={720} size={64} />
    </Plano>
    <Plano r={[42.6, 47.3]}>
      <Fundo />
      <Rotulo r={42.68} texto="COM:" top={380} size={50} cor={C.fita} />
      <Trio r={[43.08, 45.3, 46.02]} />
    </Plano>
    <Plano r={[47.3, 50.4]}>
      <Foto src="n-natalee-sorriso" r={[47.3, 50.4]} credito="Reprodução · Netflix (trailer)" top={330} w={760} h={820} pos="45% 30%" cinza zoom={[1.05, 1.15]} />
      <Carimbo r={48.32} texto="ÚLTIMA VEZ VISTA" y={1130} rot={-6} size={76} />
    </Plano>
    <Plano r={[50.4, 56.1]}>
      <Clip src="c34613" r0={50.4} dur={5.7} a={0.5} />
      <Titulo r={50.46} top={380} size={96}>DE MANHÃ</Titulo>
      <Rotulo r={51.66} texto="o grupo se reúne pra voltar pra casa" top={520} size={40} />
      <Faixa r={54.32} texto="NATALEE NÃO APARECE" top={640} size={66} />
    </Plano>
    <Plano r={[56.1, 60.3]}>
      <Foto src="n-beth-2005" r={[56.1, 60.3]} credito="Reprodução · AP (Aruba, 2005)" top={420} w={940} h={700} pos="65% 30%" zoom={[1.0, 1.12]} />
      <Faixa r={57.16} texto="BETH · A MÃE" top={260} size={66} />
      <Rotulo r={57.94} texto="voa pra Aruba no mesmo dia" top={1150} size={40} />
    </Plano>
    <Plano r={[60.3, 64.3]}>
      <Clip src="c1085" r0={60.3} dur={4.0} a={0.5} />
      <Titulo r={60.38} top={380} size={90}>CENTENAS DE<br />VOLUNTÁRIOS</Titulo>
      <Carimbo r={63.34} texto="NADA" y={800} rot={-8} size={170} />
    </Plano>
    <Plano r={[64.3, 70.8]}>
      <Fundo />
      <Papel top={380} h={560} rot={-1}>
        <Cabec sup="DEPOIMENTO DOS TRÊS RAPAZES" titulo="“DEIXAMOS ELA NO HOTEL”" size={52} />
        <Linha r={68.54} texto="— por volta das 2h da manhã" />
      </Papel>
    </Plano>
    <Plano r={[70.8, 74.6]}>
      <Cheia src="n-joran-2005" r={[70.8, 74.6]} credito="Reprodução (SBS6)" pos="50% 30%" a={0.5} />
      <Titulo r={70.86} top={300} size={82}>JORAN MUDA<br />A VERSÃO</Titulo>
      <Carimbo r={72.26} texto="MUDOU" y={760} rot={-8} size={110} />
      <Carimbo r={73.78} texto="DE NOVO" y={960} rot={6} size={110} />
    </Plano>
    <Plano r={[74.6, 78.5]}>
      <Foto src="n-polis" r={[74.6, 78.5]} credito="Reprodução · AP · polícia de Aruba" top={430} w={940} h={680} zoom={[1.0, 1.1]} />
      <Titulo r={74.68} top={240} size={84}>JUNHO · PRESOS</Titulo>
      <Carimbo r={77.76} texto="SOLTOS" y={780} rot={-8} size={140} />
    </Plano>
    <Plano r={[78.5, 82.8]}>
      <Fundo />
      <Rotulo r={78.58} texto="✗ SEM CORPO" top={480} size={64} />
      <Rotulo r={79.8} texto="✗ SEM PROVAS" top={580} size={64} />
      <Faixa r={80.94} texto="NINGUÉM É ACUSADO" top={720} size={70} />
    </Plano>
    <Plano r={[82.8, 85.0]}><LinhaTempo r={82.8} ativo={1} sub="3 anos depois…" /></Plano>
    <Plano r={[85.0, 90.1]}>
      <Clip src="c42039" r0={85.0} dur={5.1} a={0.5} />
      <Rotulo r={85.1} texto="ELE ENTRA NO CARRO DE UM AMIGO…" top={300} size={40} cor={C.fita} />
      <Faixa r={88.24} texto="● CÂMERAS ESCONDIDAS" top={380} size={60} />
      <Foto src="n-peter" r={[85.0, 90.1]} credito="Reprodução · AP · Peter R. de Vries" top={600} w={520} h={420} zoom={[1.0, 1.1]} />
      <Rotulo r={88.9} texto="armadilha do jornalista Peter R. de Vries" top={1060} size={34} />
    </Plano>
    <Plano r={[90.1, 96.3]}>
      <Clip src="c9294" r0={90.1} dur={6.2} a={0.6} />
      <Rotulo r={90.18} texto="NA GRAVAÇÃO, JORAN DIZ:" top={330} size={44} cor={C.fita} />
      <Grande r={92.02} top={450} size={66}>“ela passou mal<br />na praia”</Grande>
      <Grande r={94.16} top={700} size={66}>“mandei um amigo jogar<br />o corpo no mar”</Grande>
    </Plano>
    <Plano r={[96.3, 99.6]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Rotulo r={96.34} texto="O VÍDEO VAI AO AR. E ELE DIZ:" top={480} size={40} cor={C.fita} />
      <Carimbo r={98.04} texto="“INVENTEI TUDO”" y={760} rot={-6} size={86} />
    </Plano>
    <Plano r={[99.6, 102.1]}><LinhaTempo r={99.6} ativo={2} sub="então chega 2010" /></Plano>
    <Plano r={[102.1, 106.3]}>
      <Fundo />
      <Papel top={400} h={460} rot={1}>
        <Cabec sup="E-MAIL AO ADVOGADO DA FAMÍLIA · 2010" titulo="UMA PROPOSTA" size={64} />
        <Linha r={103.4} texto="— de: Joran van der Sloot" />
      </Papel>
    </Plano>
    <Plano r={[106.3, 112.4]}>
      <Fundo cor="radial-gradient(ellipse at 50% 40%, #1F2A1E 0%, #0A0A0B 75%)" />
      <Contador r={106.32} ate={107.9} valor={250000} prefixo="US$ " top={460} size={150} />
      <Rotulo r={108.54} texto="pela localização do corpo" top={660} size={46} />
      <Contador r={110.72} ate={111.6} valor={25000} prefixo="US$ " top={840} size={110} cor={C.verm} />
      <Rotulo r={111.66} texto="ADIANTADOS" top={980} size={50} />
    </Plano>
    <Plano r={[112.4, 115.1]}>
      <Foto src="n-beth-press" r={[112.4, 115.1]} credito="Reprodução · AP · Beth Holloway" top={430} w={940} h={680} zoom={[1.0, 1.1]} />
      <Faixa r={113.34} texto="BETH AVISA O FBI" top={260} size={70} />
    </Plano>
    <Plano r={[115.1, 117.7]}>
      <Cheia src="n-sting" r={[115.1, 117.7]} credito="Reprodução · imagens do FBI (via Inside Edition/Netflix)" pos="40% 50%" a={0.35} cinza={false} />
      <Rotulo r={115.14} texto="● REC" top={300} size={60} cor={C.verm} />
      <Titulo r={116.04} top={380} size={84}>ENCONTRO<br />GRAVADO</Titulo>
    </Plano>
    <Plano r={[117.7, 122.0]}>
      <Clip src="c23168" r0={117.7} dur={4.3} a={0.5} />
      <Contador r={119.0} ate={119.9} valor={10000} prefixo="US$ " top={420} size={150} />
      <Rotulo r={119.98} texto="EM DINHEIRO, NA FRENTE DELE" top={600} size={44} />
    </Plano>
    <Plano r={[122.0, 125.7]}>
      <Fundo cor="radial-gradient(ellipse at 50% 40%, #1F2A1E 0%, #0A0A0B 75%)" />
      <Rotulo r={122.0} texto="US$ 10.000 em dinheiro" top={380} size={50} cor={C.ossoE} />
      <Contador r={122.56} ate={123.4} valor={15000} prefixo="+ US$ " top={470} size={110} />
      <Rotulo r={123.62} texto="na conta dele, na Holanda" top={610} size={42} />
      <div style={{ position: "absolute", left: 200, right: 200, top: 700, height: 5, background: C.osso, opacity: 0.6 }} />
      <Contador r={124.6} ate={125.2} valor={25000} prefixo="= US$ " top={740} size={130} cor={C.verm} />
    </Plano>
    <Plano r={[125.7, 134.0]}>
      <Clip src="c5291" r0={125.7} dur={8.3} a={0.55} />
      <Rotulo r={125.78} texto="JORAN LEVA O ADVOGADO ATÉ UMA CASA" top={330} size={38} cor={C.fita} />
      <Grande r={128.04} top={450} size={64}>“meu pai enterrou ela aqui,<br />embaixo da fundação”</Grande>
      <Rotulo r={129.66} texto="(o pai dele já tinha morrido)" top={680} size={40} />
    </Plano>
    <Plano r={[134.0, 135.6]}>
      <Fundo cor={C.preto} />
      <Carimbo r={134.14} texto="MENTIRA" y={820} rot={-8} size={170} />
    </Plano>
    <Plano r={[135.6, 138.75]}>
      <Clip src="c7374" r0={135.6} dur={3.15} a={0.5} />
      <Titulo r={135.7} top={400} size={80}>COM O DINHEIRO<br />NO BOLSO…</Titulo>
      <Faixa r={138.5} texto="PERU" top={640} size={90} />
    </Plano>
    <Plano r={[138.75, 142.7]}>
      <Clip src="c41161" r0={138.75} dur={3.95} a={0.5} />
      <Titulo r={138.82} top={380} size={96}>30 DE MAIO<br />DE 2010</Titulo>
      <Rotulo r={141.88} texto="LIMA · PERU" top={620} size={50} cor={C.fita} />
    </Plano>
    <Plano r={[142.7, 146.9]}>
      <Fundo />
      <Calendarios r={142.78} r2={144.1} />
      <Faixa r={144.46} texto="EXATAMENTE 5 ANOS DEPOIS" top={900} size={60} />
    </Plano>
    <Plano r={[146.9, 153.5]}>
      <Clip src="c5230" r0={146.9} dur={6.6} a={0.5} />
      <Rotulo r={147.0} texto="NUM CASSINO, JOGANDO PÔQUER…" top={360} size={44} cor={C.fita} />
      <Faixa r={152.14} texto="STEPHANY FLORES · 21 ANOS" top={460} size={56} />
    </Plano>
    <Plano r={[153.5, 157.8]}>
      <Clip src="c27291" r0={153.5} dur={4.3} a={0.55} />
      <Rotulo r={153.54} texto="OS DOIS VÃO PRO HOTEL DELE" top={400} size={44} />
      <Grande r={155.46} top={560} size={84}>ela nunca<br />sai de lá.</Grande>
    </Plano>
    <Plano r={[157.8, 162.2]}>
      <Foto src="n-joran-peru" r={[157.8, 162.2]} credito="Reprodução · CBS (Peru, 2010)" top={380} w={960} h={620} pos="60% 30%" zoom={[1.0, 1.1]} />
      <Carimbo r={157.86} texto="CONFESSOU" y={300} rot={-6} size={90} />
      <Contador r={159.98} ate={160.6} valor={28} sufixo=" ANOS" top={1050} size={110} cor={C.verm} />
      <Rotulo r={161.56} texto="de prisão no Peru" top={1170} size={40} />
    </Plano>
    <Plano r={[162.2, 166.0]}>
      <Foto src="n-beth-natalee" r={[162.2, 166.0]} credito="Reprodução · Access Hollywood" top={420} w={1040} h={440} pos="50% 70%" cinza zoom={[1.0, 1.08]} />
      <Grande r={162.28} top={940} size={70}>mas a mãe de Natalee<br />continuava sem resposta</Grande>
    </Plano>
    <Plano r={[166.0, 168.3]}><LinhaTempo r={166.0} ativo={3} sub="18 anos depois do sumiço" /></Plano>
    <Plano r={[168.3, 173.6]}>
      <Foto src="n-extradicao" r={[168.3, 173.6]} credito="Reprodução · WVTM 13 · extradição para os EUA (2023)" top={430} w={980} h={620} zoom={[1.0, 1.1]} />
      <Titulo r={168.34} top={230} size={76}>LEVADO AOS EUA</Titulo>
      <Faixa r={172.36} texto="E FAZ UM ACORDO" top={1100} size={62} />
    </Plano>
    <Plano r={[173.6, 178.4]}>
      <Fundo />
      <Papel top={360} h={600} rot={-1}>
        <Cabec sup="TRIBUNAL FEDERAL · ALABAMA · 18/10/2023" titulo="ACORDO" size={70} />
        <Linha r={174.0} texto="— 20 anos (junto com o Peru)" />
        <Linha r={175.42} texto="— em troca: a verdade" />
        <Linha r={176.6} texto="  sobre Natalee" />
      </Papel>
    </Plano>
    <Plano r={[178.4, 181.75]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Contador r={178.78} ate={179.7} valor={18} sufixo=" ANOS" top={520} size={190} />
      <Titulo r={179.76} top={740} size={80}>DEPOIS…</Titulo>
      <Faixa r={181.12} texto="ELE CONTA" top={880} size={80} />
    </Plano>
    <Plano r={[181.75, 186.95]}>
      <Foto src="n-joran-2023" r={[181.75, 186.95]} credito="Reprodução · CBS News" top={330} w={820} h={740} pos="50% 30%" zoom={[1.0, 1.12]} cinza />
      <Rotulo r={181.8} texto="CONFISSÃO · 2023" top={200} size={48} cor={C.verm} />
      <Grande r={182.42} top={1100} size={58}>matou Natalee naquela noite, na praia,<br />depois que ela rejeitou ele</Grande>
    </Plano>
    <Plano r={[186.95, 191.25]}>
      <Clip src="c1954" r0={186.95} dur={4.3} a={0.55} />
      <Rotulo r={187.48} texto="O JUIZ:" top={380} size={50} cor={C.fita} />
      <Titulo r={188.5} top={470} size={80}>“O CORPO NUNCA VAI<br />SER ENCONTRADO”</Titulo>
    </Plano>
    <Plano r={[191.25, 197.1]}>
      <Cheia src="n-beth-tribunal" r={[191.25, 197.1]} credito="Reprodução · WVTM 13 · Birmingham, 2023" pos="55% 30%" a={0.45} cinza={false} />
      <Rotulo r={191.3} texto="NO TRIBUNAL, BETH OLHA PRA ELE…" top={300} size={40} cor={C.fita} />
      <Grande r={194.82} top={1000} size={86}>“Você é um assassino.”</Grande>
    </Plano>
    <Plano r={[197.1, 202.8]}>
      <Fundo />
      <Papel top={380} h={560} rot={1}>
        <Cabec sup="FICHA DE JORAN VAN DER SLOOT" titulo="CONDENAÇÕES" size={64} />
        <Linha r={197.6} texto="✓ Stephany (Peru): 28 anos" />
        <Linha r={198.5} texto="✗ Natalee: nunca" />
        <Linha r={201.2} texto="✓ extorsão (EUA): 20 anos" />
      </Papel>
      <Carimbo r={199.2} texto="NUNCA" y={1060} rot={-8} size={120} />
    </Plano>
    <Plano r={[202.8, 260]} soco={false}>
      <Clip src="c4677" r0={202.8} dur={9} a={0.6} />
      <Grande r={202.9} top={560} size={84}>Onde você estava<br />naquela noite?</Grande>
      <Rotulo r={204.94} texto="ele respondeu de vários jeitos, por 18 anos" top={800} size={36} cor={C.ossoE} />
      <Ass r={209.44} />
    </Plano>
  </Reel>
);
