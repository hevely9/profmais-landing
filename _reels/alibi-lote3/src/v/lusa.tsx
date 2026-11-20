import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile } from "remotion";
import palavras from "../../public/palavras-lusa.json";
import { C, COURIER, Carimbo, Cheia, Clip, ELITE, Faixa, Foto, Fundo, Grande, MONT, Papel, Cabec, Linha, Plano, Reel, Rotulo, SANS, SOMBRA, Titulo, TituloVivo, achar, clamp, lin, mkCtx, useT } from "../kit";
import { Ficha } from "../ui";

// ÁLIBI · CASO Nº 016 — Portuguesa × Flamengo (Brasileirão 2013, casos Héverton e André Santos)
// Tom neutro: os dois lados falam, nada de acusação. Fontes: STJD (16 e 27/12/2013), MP-SP (inquérito arquivado sem provas).
const words = (palavras as { words: { text: string; start: number; end: number }[] }).words;
const w = achar(words);
export const ctx = mkCtx({
  caso: "Nº 016", audio: "lusa", words, lead: 0.1, fimVozRaw: 146.38, final: "alibi", proximo: "NO PERFIL",
  cta: ["Quem tem razão?", "defende o seu time: FLA · LUSA · FLU ↓"],
  chave: /^(flamengo|portuguesa|héverton|andré|santos|suspenso|suspensão|tribunal|45|46|44|13|rebaixada|arquivado|fluminense|dinheiro|b|d|regra|mesa|você|time)$/i,
  semLegenda: [[138.0, 160]],
  sfx: [
    { src: "impacto", r: 0.02, vol: 0.45 }, { src: "whoosh", r: 3.95, vol: 0.3 }, { src: "trava", r: 5.8, vol: 0.35 },
    { src: "whoosh", r: 7.9, vol: 0.25 }, { src: "whoosh", r: 10.8, vol: 0.25 }, { src: "whoosh", r: 14.1, vol: 0.25 },
    { src: "trava", r: 17.45, vol: 0.3 }, ...[23.1, 23.4, 23.7, 24.0, 24.3].map((r) => ({ src: "tecla", r, vol: 0.25 })),
    { src: "whoosh", r: 25.3, vol: 0.3 }, ...Array.from({ length: 8 }, (_, i) => ({ src: "tique", r: 27.45 + i * 0.32, vol: 0.28 })), { src: "impacto", r: 30.0, vol: 0.45 },
    { src: "coracao", r: 31.6, vol: 0.45 }, { src: "whoosh", r: 34.4, vol: 0.3 }, ...[39.2, 39.45, 39.7].map((r) => ({ src: "tecla", r, vol: 0.25 })),
    { src: "carimbo", r: 40.26, vol: 0.5 }, { src: "carimbo", r: 46.86, vol: 0.55 }, { src: "whoosh", r: 47.65, vol: 0.3 }, { src: "impacto", r: 51.72, vol: 0.45 },
    { src: "subida", r: 53.2, vol: 0.3 }, { src: "trava", r: 57.2, vol: 0.4 }, { src: "coracao", r: 61.2, vol: 0.5 }, { src: "trava", r: 66.5, vol: 0.4 },
    { src: "carimbo", r: 70.76, vol: 0.55 }, { src: "whoosh", r: 72.85, vol: 0.3 },
    ...[78.9, 79.14, 79.66].map((r) => ({ src: "impacto", r, vol: 0.3 })), { src: "whoosh", r: 80.4, vol: 0.3 }, { src: "carimbo", r: 88.04, vol: 0.5 },
    { src: "whoosh", r: 89.45, vol: 0.3 }, { src: "whoosh", r: 97.3, vol: 0.3 }, { src: "impacto", r: 99.14, vol: 0.45 }, { src: "coracao", r: 100.76, vol: 0.4 },
    { src: "tecla", r: 107.3, vol: 0.25 }, { src: "whoosh", r: 109.05, vol: 0.3 }, { src: "coracao", r: 116.7, vol: 0.45 }, { src: "carimbo", r: 120.38, vol: 0.55 },
    ...[124.75, 125.2, 125.65, 126.1].map((r) => ({ src: "impacto", r, vol: 0.28 })), { src: "trava", r: 127.7, vol: 0.4 },
    { src: "carimbo", r: 130.7, vol: 0.5 }, { src: "whoosh", r: 131.45, vol: 0.3 }, { src: "impacto", r: 136.06, vol: 0.4 },
  ],
});

// ── cores dos clubes (só faixas de cor, sem escudos) ──
type Time = { id: string; nome: string; c1: string; c2: string; art?: string };
const FLA: Time = { id: "fla", nome: "FLAMENGO", c1: "#C8102E", c2: "#111" };
const LUSA: Time = { id: "lusa", nome: "PORTUGUESA", c1: "#C8102E", c2: "#00843D", art: "DA" };
const FLU: Time = { id: "flu", nome: "FLUMINENSE", c1: "#7A1E2E", c2: "#00613A" };
const CRI: Time = { id: "cri", nome: "CRICIÚMA", c1: "#F2C500", c2: "#111" };
const VAS: Time = { id: "vas", nome: "VASCO", c1: "#111", c2: "#EEE" };

// ── tabela animada: a punição do Flamengo, depois a da Portuguesa ──
const T_FLA = 56.74, T_SB = 61.2, T_LUSA = 66.04, T_REB = 69.44;
const ESTADOS: [number, string[]][] = [
  [-1, ["fla", "lusa", "cri", "flu", "vas"]],
  [T_FLA + 0.4, ["lusa", "cri", "flu", "fla", "vas"]],
  [T_LUSA + 0.5, ["cri", "flu", "fla", "lusa", "vas"]],
];
const ROW = 150;
const Tabela: React.FC<{ foco?: [number, number, number] }> = ({ foco = [1, 0, 0] }) => {
  const { t, o } = useT();
  const tr = (x: number) => o(x);
  let ei = 0; ESTADOS.forEach(([tc], i) => { if (t >= tr(tc)) ei = i; });
  const [tc, atual] = ESTADOS[ei]; const ant = ESTADOS[Math.max(0, ei - 1)][1];
  const k = ei === 0 ? 1 : lin(t, tr(tc), tr(tc) + 0.7, Easing.inOut(Easing.cubic));
  const pts = (id: string) => {
    if (id === "fla") return Math.round(interpolate(t, [tr(T_FLA), tr(T_FLA + 0.5)], [49, 45], clamp));
    if (id === "lusa") return Math.round(interpolate(t, [tr(T_LUSA), tr(T_LUSA + 0.5)], [48, 44], clamp));
    return { cri: 46, flu: 46, vas: 44 }[id] ?? 0;
  };
  const final = t >= tr(T_LUSA + 1.2);
  const times = [FLA, LUSA, CRI, FLU, VAS];
  const top0 = 330;
  return <AbsoluteFill style={{ transform: `scale(${foco[0]}) translate(${foco[1]}px, ${foco[2]}px)` }}>
    <Fundo cor="radial-gradient(ellipse at 50% 35%, #1E1C1A 0%, #0A0A0B 75%)" />
    <div style={{ position: "absolute", left: 70, right: 70, top: 200, display: "flex", justifyContent: "space-between", fontFamily: COURIER, fontWeight: 700, fontSize: 28, letterSpacing: "0.12em", color: C.ossoE }}>
      <span>BRASILEIRÃO 2013</span><span>PTS</span>
    </div>
    <div style={{ position: "absolute", left: 70, right: 70, top: 250, height: 3, background: "rgba(236,231,220,0.3)" }} />
    {/* linha da zona de rebaixamento: entre o 3º e o 4º da lista (16º e 17º) */}
    <div style={{ position: "absolute", left: 40, right: 40, top: top0 + 3 * ROW - 14, height: 6, background: C.verm, boxShadow: `0 0 24px ${C.verm}` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: top0 + 5 * ROW + 6, textAlign: "center", fontFamily: COURIER, fontWeight: 700, fontSize: 30, letterSpacing: "0.2em", color: C.verm }}>▲ ZONA DE REBAIXAMENTO ▲</div>
    <AbsoluteFill style={{ top: top0 + 3 * ROW - 11, height: 2 * ROW, background: "rgba(163,20,28,0.16)" }} />
    {times.map((tm) => {
      const y = interpolate(k, [0, 1], [ant.indexOf(tm.id), atual.indexOf(tm.id)]);
      const p = pts(tm.id);
      const caiu = (tm.id === "fla" && t >= tr(T_FLA)) || (tm.id === "lusa" && t >= tr(T_LUSA));
      const menos4 = caiu && t < (tm.id === "fla" ? tr(T_FLA + 3.2) : tr(T_LUSA + 3.2));
      const serieB = tm.id === "fla" && t >= tr(T_SB) && t < tr(T_LUSA);
      const reb = tm.id === "lusa" && t >= tr(T_REB);
      const pulsa = serieB || reb ? 0.5 + 0.5 * Math.sin(t * 9) : 0;
      return <div key={tm.id} style={{ position: "absolute", left: 60, right: 60, top: top0 + y * ROW, height: ROW - 22, display: "flex", alignItems: "center", gap: 26, padding: "0 30px",
        background: tm.id === "fla" || tm.id === "lusa" ? "rgba(236,231,220,0.10)" : "rgba(236,231,220,0.04)", border: `4px solid ${pulsa ? `rgba(224,53,63,${0.4 + 0.6 * pulsa})` : "transparent"}` }}>
        {final && <div style={{ width: 82, fontFamily: COURIER, fontWeight: 700, fontSize: 40, color: C.ossoE, opacity: lin(t, tr(T_LUSA + 1.2), tr(T_LUSA + 1.6)) }}>{14 + atual.indexOf(tm.id)}º</div>}
        <div style={{ width: 18, height: 84, background: `linear-gradient(180deg, ${tm.c1} 50%, ${tm.c2} 50%)` }} />
        <div style={{ flex: 1, fontFamily: MONT, fontWeight: 800, fontSize: 56, color: C.osso, letterSpacing: "0.01em" }}>{tm.nome}</div>
        {serieB && <div style={{ padding: "4px 14px", background: C.lacre, fontFamily: SANS, fontWeight: 800, fontSize: 32, color: C.osso }}>SÉRIE B</div>}
        {reb && <div style={{ padding: "4px 14px", background: C.lacre, fontFamily: SANS, fontWeight: 800, fontSize: 32, color: C.osso }}>REBAIXADA</div>}
        {menos4 && <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 44, color: C.verm }}>−4</div>}
        <div style={{ width: 120, textAlign: "right", fontFamily: MONT, fontWeight: 800, fontSize: 76, color: caiu ? C.verm : C.osso, fontVariantNumeric: "tabular-nums" }}>{p}</div>
      </div>;
    })}
  </AbsoluteFill>;
};

// tela dividida (os dois lados, mesma importância)
const Lado: React.FC<{ img: string; pos: string; top: number; rotulo: string; r: number; cor: string }> = ({ img, pos, top, rotulo, r, cor }) => {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.05, o(r) + 0.35, Easing.out(Easing.cubic));
  return <div style={{ position: "absolute", left: 0, right: 0, top, height: 560, overflow: "hidden", opacity: k, transform: `translateX(${(1 - k) * (top < 600 ? -80 : 80)}px)` }}>
    <Img src={staticFile(`img/${img}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, filter: "contrast(1.1) brightness(0.8) saturate(0.9)", transform: `scale(${1.04 + 0.06 * lin(t, o(r), o(r) + 6, Easing.linear)})` }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,10,11,0.1) 50%, rgba(10,10,11,0.75) 100%)" }} />
    <div style={{ position: "absolute", right: 30, top: 24, padding: "6px 20px", background: cor, fontFamily: MONT, fontWeight: 800, fontSize: 42, color: C.osso }}>{rotulo}</div>
  </div>;
};
const Split: React.FC<{ r: number; r2: number; children?: React.ReactNode }> = ({ r, r2, children }) => <>
  <Fundo cor={C.preto} />
  <Lado img="l-andre" pos="30% 6%" top={160} rotulo="FLAMENGO · ANDRÉ" r={r} cor="#8E0F1E" />
  <Lado img="l-heverton" pos="28% 0%" top={728} rotulo="LUSA · HÉVERTON" r={r2} cor="#0B5E33" />
  <div style={{ position: "absolute", left: 0, right: 0, top: 721, height: 6, background: C.osso }} />
  {children}
</>;

// relógio do jogo (32' do 2º tempo)
const Relogio: React.FC<{ r: number }> = ({ r }) => {
  const { t, o } = useT();
  const s = Math.max(0, Math.floor((t - o(r)) * 6)) % 60;
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 400, display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "18px 44px", background: "rgba(10,10,11,0.82)", border: `3px solid ${C.osso}`, fontFamily: MONT, fontWeight: 800, fontSize: 170, color: C.osso, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
        32<span style={{ color: C.ossoE }}>:{String(s).padStart(2, "0")}</span></div>
    </div>
    <Rotulo r={r} texto="2º TEMPO · PORTUGUESA × GRÊMIO" top={640} size={40} />
  </>;
};
const Placar: React.FC<{ r: number }> = ({ r }) => {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.05, o(r) + 0.3, Easing.out(Easing.back(1.6)));
  if (k <= 0) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: 620, display: "flex", justifyContent: "center", transform: `scale(${0.8 + 0.2 * k})`, opacity: Math.min(1, k * 1.4) }}>
    <div style={{ display: "flex", alignItems: "center", gap: 30, padding: "16px 34px", background: "rgba(10,10,11,0.85)", border: "3px solid rgba(236,231,220,0.5)" }}>
      <span style={{ fontFamily: MONT, fontWeight: 800, fontSize: 46, color: C.osso }}>LUSA</span>
      <span style={{ fontFamily: MONT, fontWeight: 800, fontSize: 110, color: C.osso }}>0 × 0</span>
      <span style={{ fontFamily: MONT, fontWeight: 800, fontSize: 46, color: C.osso }}>GRÊMIO</span>
    </div>
  </div>;
};
// a queda: A → B → C → D
const Queda: React.FC = () => {
  const { t, o } = useT();
  const degraus: [number, string, string][] = [[124.75, "SÉRIE A", "até 2013"], [125.2, "SÉRIE B", "caiu em 2013"], [125.65, "SÉRIE C", "caiu em 2014"], [126.1, "SÉRIE D", "caiu em 2016"]];
  return <>{degraus.map(([r, s, sub], i) => {
    const k = lin(t, o(r) - 0.05, o(r) + 0.25, Easing.out(Easing.cubic));
    if (k <= 0) return null;
    const ult = i === 3;
    return <div key={i} style={{ position: "absolute", left: 70 + i * 105, top: 300 + i * 215 - (1 - k) * 60, opacity: k, display: "flex", alignItems: "baseline", gap: 18 }}>
      <div style={{ padding: "6px 22px", background: ult ? C.lacre : "rgba(10,10,11,0.8)", border: `3px solid ${ult ? C.lacre : C.osso}`, fontFamily: MONT, fontWeight: 800, fontSize: 70, color: C.osso, whiteSpace: "nowrap" }}>{s}</div>
      <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 28, color: C.osso, textShadow: SOMBRA, whiteSpace: "nowrap" }}>{sub}</div>
    </div>;
  })}</>;
};
const Lista: React.FC<{ itens: [number, string][]; top: number }> = ({ itens, top }) => {
  const { t, o } = useT();
  return <div style={{ position: "absolute", left: 110, right: 90, top }}>
    {itens.map(([r, txt], i) => {
      const k = lin(t, o(r) - 0.05, o(r) + 0.25, Easing.out(Easing.cubic));
      return <div key={i} style={{ opacity: k, transform: `translateX(${(1 - k) * -40}px)`, fontFamily: MONT, fontWeight: 800, fontSize: 60, color: C.osso, textShadow: SOMBRA, lineHeight: 1.45 }}>
        <span style={{ color: C.verm }}>✓ </span>{txt}</div>;
    })}
  </div>;
};

// faixa "VERSÃO DA ..." com as cores do clube
const Versao: React.FC<{ r: number; time: Time; children?: React.ReactNode; top?: number }> = ({ r, time, children, top = 230 }) => {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.05, o(r) + 0.35, Easing.out(Easing.cubic));
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", opacity: k, transform: `translateY(${(1 - k) * -30}px)` }}>
      <div style={{ display: "flex", alignItems: "stretch", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}>
        <div style={{ width: 22, background: `linear-gradient(180deg, ${time.c1} 50%, ${time.c2} 50%)` }} />
        <div style={{ padding: "12px 30px", background: "rgba(10,10,11,0.88)" }}>
          <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 30, letterSpacing: "0.18em", color: C.ossoE }}>A VERSÃO DA TORCIDA {time.art ?? "DO"}</div>
          <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 84, color: C.osso, lineHeight: 1.05 }}>{time.nome}</div>
        </div>
      </div>
    </div>
    {children}
  </>;
};
// três torcidas, três versões
const Tres: React.FC = () => {
  const { t, o } = useT();
  const itens: [number, Time][] = [[78.9, LUSA], [79.14, FLA], [79.66, FLU]];
  return <>
    <Fundo cor={C.preto} />
    {itens.map(([r, tm], i) => {
      const k = lin(t, o(r) - 0.05, o(r) + 0.3, Easing.out(Easing.cubic));
      return <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 380 + i * 270, height: 240, opacity: k, transform: `translateX(${(1 - k) * (i % 2 ? 300 : -300)}px)`,
        background: `linear-gradient(90deg, ${tm.c1} 0%, ${tm.c1} 50%, ${tm.c2} 50%, ${tm.c2} 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ padding: "6px 30px", background: "rgba(10,10,11,0.82)", fontFamily: MONT, fontWeight: 800, fontSize: 86, color: C.osso }}>{tm.nome}</div>
      </div>;
    })}
    <Titulo r={77.85} top={200} size={74}>CADA TORCIDA, UMA VERSÃO</Titulo>
  </>;
};
const AssinaturaL: React.FC<{ r: number }> = ({ r }) => {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.05, o(r) + 0.6, Easing.out(Easing.cubic));
  return <div style={{ position: "absolute", left: 60, right: 60, top: 930, textAlign: "center", opacity: k, fontFamily: ELITE, fontSize: 56, color: C.osso, textShadow: SOMBRA }}>…cada torcida<br />tem o seu álibi.</div>;
};

export const Lusa: React.FC = () => (
  <Reel ctx={ctx}>
    {/* GANCHO */}
    <Plano r={[-0.1, 4.0]} forte>
      <Cheia src="l-andre" r={[-0.1, 4.0]} credito="Reprodução · imprensa" pos="32% 30%" zoom={[1.0, 1.12]} cinza={false} a={0.3} />
      <TituloVivo top={170} size={88} destaque="CAÍDO" linhas={[[["TEM", 0], ["TORCEDOR", 0.12], ["QUE", 0.64], ["JURA:", 0.82]], [["O", 1.3], ["FLAMENGO", 1.9]], [["ERA", 2.48], ["PRA", 2.64], ["TER", 2.78], ["CAÍDO", 2.94]], [["EM", 3.28], ["2013", 3.4]]]} />
    </Plano>
    <Plano r={[4.0, 7.95]}>
      <Fundo />
      <Rotulo r={4.1} texto="E A MATEMÁTICA…" top={420} size={44} cor={C.ossoE} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 70 }}>
        <Num r={5.8} n="45" sub="FLAMENGO" /><Num r={6.46} n="44" sub="PORTUGUESA" verm />
      </div>
      <Rotulo r={6.82} texto="dá razão pra ele" top={1000} size={44} />
    </Plano>
    {/* contexto */}
    <Plano r={[7.95, 10.85]}>
      <Clip src="c17399" r0={7.95} dur={2.9} a={0.45} />
      <Titulo r={8.0} top={380} size={110}>ÚLTIMA<br />RODADA</Titulo>
      <Rotulo r={9.08} texto="BRASILEIRÃO 2013 · 8 DE DEZEMBRO" top={640} size={40} cor={C.fita} />
    </Plano>
    <Plano r={[10.85, 14.15]}>
      <Cheia src="l-copa" r={[10.85, 14.15]} credito="Reprodução · TV · Maracanã, 27/11/2013" cinza={false} a={0.4} />
      <Rotulo r={10.9} texto="FLAMENGO" top={330} size={50} />
      <Faixa r={13.06} texto="CAMPEÃO DA COPA DO BRASIL" top={420} size={60} />
    </Plano>
    <Plano r={[14.15, 17.45]}>
      <Cheia src="l-caninde" r={[14.15, 17.45]} credito="Reprodução · YouTube · Canindé (SP)" cinza={false} a={0.4} />
      <Titulo r={14.2} top={360} size={100}>PORTUGUESA</Titulo>
      <Faixa r={15.66} texto="JÁ LIVRE DA QUEDA" top={500} size={64} />
    </Plano>
    {/* sexta-feira: o julgamento */}
    <Plano r={[17.45, 22.1]}>
      <Clip src="c47686" r0={17.45} dur={4.65} a={0.5} />
      <Titulo r={17.5} top={360} size={104}>SEXTA-FEIRA</Titulo>
      <Rotulo r={18.86} texto="TRIBUNAL ESPORTIVO (STJD) · 6/12" top={500} size={40} cor={C.fita} />
      <Rotulo r={19.96} texto="julga um jogador da Portuguesa" top={580} size={40} />
    </Plano>
    <Plano r={[22.1, 25.35]}>
      <Ficha sup="STJD · JULGAMENTO · 06/12/2013" nome="HÉVERTON" foto="l-heverton" pos="28% 25%" credito="foto: reprodução" top={360}
        linhas={[[22.4, "— meia da Portuguesa"], [23.1, "— +1 jogo de"], [23.9, "  suspensão"]]} />
    </Plano>
    {/* domingo: Portuguesa x Grêmio */}
    <Plano r={[25.35, 27.4]}>
      <Cheia src="l-lusagremio" r={[25.35, 27.4]} credito="Reprodução · ESPN · Canindé, 8/12/2013" cinza={false} a={0.35} />
      <Titulo r={25.4} top={330} size={110}>DOMINGO</Titulo>
      <Faixa r={26.46} texto="PORTUGUESA × GRÊMIO" top={480} size={62} />
    </Plano>
    <Plano r={[27.4, 30.0]}>
      <Clip src="c43481" r0={27.4} dur={2.6} a={0.55} />
      <Relogio r={27.45} />
    </Plano>
    <Plano r={[30.0, 31.6]}>
      <Cheia src="l-heverton" r={[30.0, 31.6]} credito="Reprodução · imprensa" pos="28% 40%" zoom={[1.0, 1.1]} cinza={false} a={0.3} />
      <Faixa r={30.05} texto="HÉVERTON ENTRA" top={330} size={76} />
    </Plano>
    <Plano r={[31.6, 34.45]}>
      <Clip src="c43485" r0={31.6} dur={2.85} a={0.6} />
      <Titulo r={31.66} top={380} size={150}>13 MIN</Titulo>
      <Placar r={33.14} />
    </Plano>
    {/* o mesmo domingo: Cruzeiro x Flamengo */}
    <Plano r={[34.45, 37.3]}>
      <Cheia src="l-crufla" r={[34.45, 37.3]} credito="Reprodução · TV · Cruzeiro 1 × 1 Flamengo, 8/12/2013" cinza={false} a={0.35} />
      <Rotulo r={34.5} texto="NO MESMO DOMINGO…" top={330} size={46} cor={C.fita} />
      <Faixa r={35.95} texto="CRUZEIRO × FLAMENGO" top={420} size={64} />
    </Plano>
    <Plano r={[37.3, 39.95]}>
      <Ficha sup="FLAMENGO · LATERAL" nome="ANDRÉ SANTOS" foto="l-andre" pos="30% 15%" credito="foto: reprodução" top={360} linhas={[[39.2, "— suspenso"]]} />
    </Plano>
    <Plano r={[39.95, 42.45]}>
      <Cheia src="l-flafinal" r={[39.95, 42.45]} credito="Reprodução · TV Globo · final da Copa do Brasil 2013" pos="70% 40%" cinza={false} a={0.35} />
      <Rotulo r={40.0} texto="FINAL DA COPA DO BRASIL" top={330} size={46} />
      <Carimbo r={40.24} texto="EXPULSO" y={560} rot={-8} size={120} />
    </Plano>
    <Plano r={[42.45, 45.4]}>
      <Fundo />
      <Papel top={380} h={560} rot={-1.2}>
        <Cabec sup="O QUE O FLAMENGO ALEGOU" titulo="PENA JÁ CUMPRIDA" size={60} />
        <Linha r={43.2} texto="— ele ficou fora contra" />
        <Linha r={44.0} texto="  o Vitória, em 1º/12" />
      </Papel>
    </Plano>
    <Plano r={[45.4, 47.7]}>
      <Clip src="c47687" r0={45.4} dur={2.3} a={0.5} />
      <Titulo r={45.45} top={360} size={90}>O TRIBUNAL:</Titulo>
      <Carimbo r={46.86} texto="NÃO" y={640} rot={-8} size={200} />
    </Plano>
    {/* o mesmo erro */}
    <Plano r={[47.7, 51.7]}>
      <Split r={47.76} r2={48.1}><Faixa r={49.0} texto="O MESMO ERRO" top={668} size={70} /></Split>
    </Plano>
    <Plano r={[51.7, 53.7]}>
      <Clip src="c47602" r0={51.7} dur={2.0} a={0.55} />
      <Titulo r={51.72} top={400} size={190} cor={C.verm}>−4</Titulo>
      <Titulo r={52.12} top={620} size={84}>PONTOS</Titulo>
      <Rotulo r={52.96} texto="pra cada um" top={750} size={46} />
    </Plano>
    {/* a tabela */}
    <Plano r={[53.7, 56.6]}><Tabela /><Rotulo r={53.72} texto="AGORA OLHA A TABELA" top={1140} size={40} cor={C.fita} /></Plano>
    <Plano r={[56.6, 61.1]}><Tabela foco={[1.06, 0, 0]} /><Rotulo r={58.76} texto="Fluminense: 46" top={1140} size={40} cor={C.fita} /></Plano>
    <Plano r={[61.1, 64.6]}><Tabela foco={[1.18, 0, -150]} /></Plano>
    <Plano r={[64.6, 67.6]}><Tabela foco={[1.04, 0, 0]} /><Rotulo r={64.72} texto="MAS A PORTUGUESA…" top={1140} size={40} cor={C.fita} /></Plano>
    <Plano r={[67.6, 69.4]}><Tabela foco={[1.16, 0, -120]} /><Rotulo r={67.74} texto="um ponto a menos que o Flamengo" top={1140} size={40} cor={C.fita} /></Plano>
    <Plano r={[69.4, 72.9]}>
      <Cheia src="l-lusachoro" r={[69.4, 72.9]} credito="Reprodução · PELEJA · torcida da Portuguesa" pos="40% 40%" cinza={false} a={0.35} />
      <Titulo r={69.45} top={300} size={96}>PORTUGUESA</Titulo>
      <Carimbo r={70.76} texto="REBAIXADA" y={530} rot={-6} size={110} />
      <Faixa r={71.68} texto="O FLAMENGO FICA" top={700} size={70} />
    </Plano>
    <Plano r={[72.9, 77.75]}>
      <Foto src="l-mario" r={[72.9, 77.75]} credito="Reprodução · TV · Mário Bittencourt, advogado do Fluminense no STJD" top={470} w={960} h={600} pos="55% 35%" zoom={[1.0, 1.1]} />
      <Titulo r={72.96} top={200} size={92}>FLUMINENSE</Titulo>
      <Rotulo r={74.22} texto="tinha caído dentro de campo…" top={320} size={40} />
      <Faixa r={76.3} texto="SALVO NO TRIBUNAL" top={1100} size={62} />
    </Plano>
    {/* cada torcida, uma versão */}
    <Plano r={[77.75, 80.45]}><Tres /></Plano>
    <Plano r={[80.45, 86.9]}>
      <Cheia src="l-protesto" r={[80.45, 86.9]} credito="Reprodução · TV Brasil / TV Gazeta · torcida da Lusa, dez/2013" cinza={false} a={0.55} />
      <Versao r={80.5} time={LUSA}>
        <Lista top={560} itens={[[82.48, "o time já estava salvo"], [84.14, "13 minutos"], [85.44, "jogo sem valor"]]} />
      </Versao>
    </Plano>
    <Plano r={[86.9, 89.5]}>
      <Cheia src="l-onibus" r={[86.9, 89.5]} credito="Reprodução · Folha de S.Paulo · torcida da Lusa" cinza={false} a={0.5} />
      <Rotulo r={87.0} texto="PRA TORCIDA DA LUSA:" top={380} size={44} cor={C.fita} />
      <Carimbo r={88.3} texto="VIRADA DE MESA" y={600} rot={-7} size={96} />
    </Plano>
    <Plano r={[89.5, 94.3]}>
      <Cheia src="l-flafesta" r={[89.5, 94.3]} credito="Reprodução · ESPN · Flamengo campeão da Copa do Brasil 2013" cinza={false} a={0.55} />
      <Versao r={89.6} time={FLA}>
        <Lista top={560} itens={[[91.6, "punido igualzinho"], [93.04, "tinha mais pontos"]]} />
      </Versao>
    </Plano>
    <Plano r={[94.3, 97.35]}>
      <Foto src="l-heverton" r={[94.3, 97.35]} credito="Reprodução · imprensa" top={500} w={980} h={580} pos="28% 30%" zoom={[1.0, 1.1]} />
      <Rotulo r={94.35} texto="PRA TORCIDA DO FLAMENGO:" top={250} size={44} cor={C.fita} />
      <Faixa r={94.76} texto="QUEM ESCALOU FOI A LUSA" top={340} size={60} />
    </Plano>
    <Plano r={[97.35, 100.7]}>
      <Cheia src="l-flufesta" r={[97.35, 100.7]} credito="Reprodução · PELEJA · torcida do Fluminense" pos="50% 30%" cinza={false} a={0.5} />
      <Versao r={97.5} time={FLU}>
        <Titulo r={99.14} top={600} size={130}>REGRA<br />É REGRA</Titulo>
      </Versao>
    </Plano>
    {/* a pergunta */}
    <Plano r={[100.7, 102.6]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Grande r={100.76} top={620} size={84}>só que ficou<br />uma pergunta…</Grande>
    </Plano>
    <Plano r={[102.6, 106.45]}>
      <Cheia src="l-lusagremio" r={[102.6, 106.45]} credito="Reprodução · ESPN" a={0.62} />
      <Titulo r={102.66} top={300} size={110}>POR QUÊ?</Titulo>
      <Lista top={520} itens={[[103.44, "time já salvo"], [105.46, "jogador suspenso"]]} />
    </Plano>
    <Plano r={[106.45, 109.1]}>
      <Fundo />
      <Papel top={400} h={460} rot={1}>
        <Cabec sup="O QUE A PORTUGUESA DISSE" titulo="NÃO SABIA DA SUSPENSÃO" size={58} />
        <Linha r={107.3} texto="— versão do clube" />
      </Papel>
    </Plano>
    <Plano r={[109.1, 111.1]}>
      <Clip src="c47687" r0={109.1} from={3} dur={2.0} a={0.55} />
      <Titulo r={109.15} top={360} size={86}>MINISTÉRIO<br />PÚBLICO · SP</Titulo>
      <Faixa r={110.32} texto="INVESTIGOU" top={600} size={64} />
    </Plano>
    <Plano r={[111.1, 115.25]}>
      <Clip src="c18305" r0={111.1} dur={4.15} a={0.6} />
      <Rotulo r={111.18} texto="UM PROMOTOR CHEGOU A DIZER:" top={330} size={40} cor={C.fita} />
      <Grande r={112.82} top={460} size={74}>“alguém na Portuguesa<br />recebeu dinheiro”</Grande>
    </Plano>
    <Plano r={[115.25, 119.3]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Titulo r={115.86} top={480} size={140}>QUEM<br />PAGOU?</Titulo>
      <Rotulo r={117.7} texto="…nem se alguém pagou" top={830} size={48} cor={C.ossoE} />
    </Plano>
    <Plano r={[119.3, 121.25]}>
      <Fundo />
      <Papel top={400} h={460} rot={-1.5}>
        <Cabec sup="MINISTÉRIO PÚBLICO · SP" titulo="INQUÉRITO" size={70} />
        <Linha r={119.5} texto="nenhuma prova" />
      </Papel>
      <Carimbo r={120.38} texto="ARQUIVADO" y={800} rot={-9} size={110} />
    </Plano>
    {/* depois */}
    <Plano r={[121.25, 122.5]}>
      <Cheia src="l-escudo" r={[121.25, 122.5]} credito="Reprodução · TV Record · Canindé" a={0.4} />
      <Titulo r={121.3} top={420} size={100}>E A PORTUGUESA?</Titulo>
    </Plano>
    <Plano r={[122.5, 126.7]}>
      <Cheia src="l-somos" r={[122.5, 126.7]} credito="Reprodução · TV · Canindé, 2016" a={0.6} />
      <Rotulo r={122.6} texto="EM 3 ANOS…" top={190} size={44} cor={C.fita} />
      <Queda />
    </Plano>
    <Plano r={[126.7, 129.2]}>
      <Cheia src="l-heverton" r={[126.7, 129.2]} credito="Reprodução · imprensa" pos="28% 40%" a={0.5} />
      <Rotulo r={126.78} texto="POR CAUSA DE" top={380} size={46} />
      <Titulo r={127.6} top={450} size={150}>13 MINUTOS</Titulo>
    </Plano>
    {/* o tribunal é você */}
    <Plano r={[129.2, 131.45]}>
      <Clip src="c46820" r0={129.2} dur={2.25} a={0.55} />
      <Titulo r={129.3} top={380} size={110}>O TRIBUNAL</Titulo>
      <Carimbo r={130.7} texto="É VOCÊ" y={640} rot={-7} size={150} />
    </Plano>
    <Plano r={[131.45, 138.0]}>
      <Split r={131.5} r2={133.64}>
        <Titulo r={131.88} top={500} size={72}>ERA PRA TER CAÍDO?</Titulo>
        <Titulo r={134.02} top={1090} size={72}>OU CAIU SOZINHA?</Titulo>
        <Faixa r={136.06} texto="DEFENDE O SEU TIME ↓" top={668} size={66} />
      </Split>
    </Plano>
    <Plano r={[138.0, 160]} soco={false}>
      <Clip src="c21751" r0={138.0} dur={8} a={0.62} />
      <Grande r={138.1} top={560} size={80}>Onde você estava<br />aos 32 do<br />segundo tempo?</Grande>
      <AssinaturaL r={141.32} />
    </Plano>
  </Reel>
);


function Num({ r, n, sub, verm }: { r: number; n: string; sub: string; verm?: boolean }) {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.05, o(r) + 0.3, Easing.out(Easing.back(1.7)));
  return <div style={{ textAlign: "center", opacity: Math.min(1, k * 1.4), transform: `scale(${0.7 + 0.3 * k})` }}>
    <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 230, lineHeight: 1, color: verm ? C.verm : C.osso, textShadow: SOMBRA }}>{n}</div>
    <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 36, letterSpacing: "0.1em", color: C.osso, marginTop: 10 }}>{sub}</div>
  </div>;
}
export const _l = [ELITE];
