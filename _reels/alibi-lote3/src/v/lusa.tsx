import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile } from "remotion";
import palavras from "../../public/palavras-lusa.json";
import { Assinatura, C, COURIER, Carimbo, Cheia, Clip, ELITE, Faixa, Foto, Fundo, Grande, MONT, Papel, Cabec, Linha, Plano, Reel, Rotulo, SANS, SOMBRA, Titulo, TituloVivo, achar, clamp, lin, mkCtx, useT } from "../kit";
import { Ficha } from "../ui";

// ÁLIBI · CASO Nº 016 — Portuguesa × Flamengo (Brasileirão 2013, casos Héverton e André Santos)
// Tom neutro: os dois lados falam, nada de acusação. Fontes: STJD (16 e 27/12/2013), MP-SP (inquérito arquivado sem provas).
const words = (palavras as { words: { text: string; start: number; end: number }[] }).words;
const w = achar(words);
export const ctx = mkCtx({
  caso: "Nº 016", audio: "lusa", words, lead: 0.1, fimVozRaw: 143.42, final: "alibi", proximo: "NO PERFIL",
  cta: ["O Flamengo era pra ter caído?", "comenta: FLA ou LUSA ↓"],
  chave: /^(flamengo|portuguesa|héverton|andré|santos|suspenso|suspensão|tribunal|45|46|44|13|rebaixada|provas|arquivado|fluminense|dinheiro|b|d)$/i,
  semLegenda: [[136.5, 160]],
  sfx: [
    { src: "impacto", r: 0.02, vol: 0.45 }, { src: "whoosh", r: 4.35, vol: 0.3 }, { src: "trava", r: 4.96, vol: 0.35 },
    { src: "whoosh", r: 7.9, vol: 0.25 }, { src: "whoosh", r: 11.85, vol: 0.25 }, { src: "whoosh", r: 15.3, vol: 0.25 }, { src: "carimbo", r: 19.5, vol: 0.45 },
    { src: "trava", r: 21.1, vol: 0.3 }, ...[26.84, 27.1, 27.4, 27.7, 28.0].map((r) => ({ src: "tecla", r, vol: 0.25 })),
    { src: "whoosh", r: 29.05, vol: 0.3 }, ...Array.from({ length: 8 }, (_, i) => ({ src: "tique", r: 31.8 + i * 0.32, vol: 0.28 })), { src: "impacto", r: 34.42, vol: 0.45 },
    { src: "coracao", r: 36.2, vol: 0.45 }, { src: "whoosh", r: 40.85, vol: 0.3 }, ...[45.76, 46.0, 46.3, 46.6].map((r) => ({ src: "tecla", r, vol: 0.25 })),
    { src: "carimbo", r: 47.38, vol: 0.5 }, { src: "carimbo", r: 53.18, vol: 0.55 }, { src: "whoosh", r: 53.9, vol: 0.3 }, { src: "impacto", r: 58.7, vol: 0.45 },
    { src: "subida", r: 61.0, vol: 0.3 }, { src: "trava", r: 64.6, vol: 0.4 }, { src: "coracao", r: 69.2, vol: 0.5 }, { src: "trava", r: 74.6, vol: 0.4 },
    { src: "carimbo", r: 80.54, vol: 0.55 }, { src: "whoosh", r: 82.25, vol: 0.3 }, { src: "whoosh", r: 86.9, vol: 0.25 }, { src: "coracao", r: 90.3, vol: 0.4 },
    { src: "tecla", r: 96.4, vol: 0.25 }, { src: "tecla", r: 99.5, vol: 0.25 }, { src: "carimbo", r: 105.2, vol: 0.45 }, { src: "subida", r: 106.8, vol: 0.3 },
    { src: "whoosh", r: 109.05, vol: 0.3 }, { src: "coracao", r: 117.4, vol: 0.45 }, { src: "carimbo", r: 122.22, vol: 0.55 },
    ...[126.7, 127.2, 127.7, 128.2].map((r) => ({ src: "impacto", r, vol: 0.28 })), { src: "trava", r: 129.7, vol: 0.4 }, { src: "whoosh", r: 132.25, vol: 0.3 },
  ],
});

// ── cores dos clubes (só faixas de cor, sem escudos) ──
type Time = { id: string; nome: string; c1: string; c2: string };
const FLA: Time = { id: "fla", nome: "FLAMENGO", c1: "#C8102E", c2: "#111" };
const LUSA: Time = { id: "lusa", nome: "PORTUGUESA", c1: "#C8102E", c2: "#00843D" };
const FLU: Time = { id: "flu", nome: "FLUMINENSE", c1: "#7A1E2E", c2: "#00613A" };
const CRI: Time = { id: "cri", nome: "CRICIÚMA", c1: "#F2C500", c2: "#111" };
const VAS: Time = { id: "vas", nome: "VASCO", c1: "#111", c2: "#EEE" };

// ── tabela animada: a punição do Flamengo, depois a da Portuguesa ──
const T_FLA = 64.3, T_SB = 69.2, T_LUSA = 74.3, T_REB = 79.24;
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
    <div style={{ position: "absolute", left: 40, bottom: 24, padding: "6px 20px", background: cor, fontFamily: MONT, fontWeight: 800, fontSize: 46, color: C.osso }}>{rotulo}</div>
  </div>;
};
const Split: React.FC<{ r: number; r2: number; children?: React.ReactNode }> = ({ r, r2, children }) => <>
  <Fundo cor={C.preto} />
  <Lado img="l-andre" pos="30% 22%" top={160} rotulo="FLAMENGO · ANDRÉ SANTOS" r={r} cor="#8E0F1E" />
  <Lado img="l-heverton" pos="28% 30%" top={728} rotulo="PORTUGUESA · HÉVERTON" r={r2} cor="#0B5E33" />
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
  const degraus: [number, string, string][] = [[126.7, "SÉRIE A", "até 2013"], [127.2, "SÉRIE B", "caiu em 2013"], [127.7, "SÉRIE C", "caiu em 2014"], [128.2, "SÉRIE D", "caiu em 2016"]];
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

export const Lusa: React.FC = () => (
  <Reel ctx={ctx}>
    {/* GANCHO — André Santos com a camisa do Flamengo, texto entrando com a voz */}
    <Plano r={[-0.1, 4.4]} forte>
      <Cheia src="l-andre" r={[-0.1, 4.4]} credito="Reprodução · imprensa" pos="32% 30%" zoom={[1.0, 1.12]} cinza={false} a={0.3} />
      <TituloVivo top={170} size={88} destaque="CAÍDO" linhas={[[["TEM", 0], ["TORCEDOR", 0.12], ["QUE", 0.68], ["JURA:", 0.86]], [["O", 1.58], ["FLAMENGO", 1.88]], [["ERA", 2.46], ["PRA", 2.6], ["TER", 2.74], ["CAÍDO", 2.94]], [["EM", 3.3], ["2013", 3.4]]]} />
    </Plano>
    <Plano r={[4.4, 8.0]}>
      <Fundo />
      <Rotulo r={4.45} texto="E A MATEMÁTICA…" top={420} size={44} cor={C.ossoE} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 70 }}>
        <Num r={5.78} n="45" sub="FLAMENGO" /><Num r={6.48} n="44" sub="PORTUGUESA" verm />
      </div>
      <Rotulo r={6.86} texto="dá razão pra ele" top={1000} size={44} />
    </Plano>
    {/* contexto */}
    <Plano r={[8.0, 11.9]}>
      <Clip src="c17399" r0={8.0} dur={3.9} a={0.45} />
      <Titulo r={8.05} top={380} size={110}>DEZEMBRO<br />DE 2013</Titulo>
      <Rotulo r={w("última") - 0.05} texto="ÚLTIMA RODADA · BRASILEIRÃO" top={640} size={42} cor={C.fita} />
    </Plano>
    <Plano r={[11.9, 15.35]}>
      <Cheia src="l-copa" r={[11.9, 15.35]} credito="Reprodução · TV · Maracanã, 27/11/2013" cinza={false} a={0.4} />
      <Rotulo r={12.0} texto="FLAMENGO" top={330} size={50} />
      <Faixa r={w("copa") - 0.1} texto="CAMPEÃO DA COPA DO BRASIL" top={420} size={60} />
    </Plano>
    <Plano r={[15.35, 18.4]}>
      <Cheia src="l-caninde" r={[15.35, 18.4]} credito="Reprodução · YouTube · Canindé (SP)" cinza={false} a={0.4} />
      <Titulo r={15.4} top={360} size={100}>PORTUGUESA</Titulo>
      <Faixa r={w("livre") - 0.1} texto="JÁ LIVRE DA QUEDA" top={500} size={64} />
    </Plano>
    <Plano r={[18.4, 21.1]}>
      <Fundo cor={C.preto} />
      <Lado img="l-flafesta" pos="50% 40%" top={160} rotulo="FLAMENGO" r={18.4} cor="#8E0F1E" />
      <Lado img="l-onibus" pos="50% 50%" top={728} rotulo="PORTUGUESA" r={18.5} cor="#0B5E33" />
      <Carimbo r={w("nada") - 0.05} texto="NÃO PRECISAVAM DE NADA" y={724} rot={-6} size={62} />
    </Plano>
    {/* sexta-feira: o julgamento */}
    <Plano r={[21.1, 25.65]}>
      <Clip src="c47686" r0={21.1} dur={4.6} a={0.5} />
      <Titulo r={21.15} top={360} size={104}>SEXTA-FEIRA</Titulo>
      <Rotulo r={22.4} texto="TRIBUNAL ESPORTIVO (STJD) · 6/12" top={500} size={40} cor={C.fita} />
      <Rotulo r={24.0} texto="julga um jogador da Portuguesa" top={580} size={40} />
    </Plano>
    <Plano r={[25.65, 29.1]}>
      <Ficha sup="STJD · JULGAMENTO · 06/12/2013" nome="HÉVERTON" foto="l-heverton" pos="28% 25%" credito="foto: reprodução" top={360}
        linhas={[[26.3, "— meia da Portuguesa"], [26.84, "— +1 jogo de"], [27.6, "  suspensão"]]} />
    </Plano>
    {/* domingo: Portuguesa x Grêmio */}
    <Plano r={[29.1, 31.75]}>
      <Cheia src="l-lusagremio" r={[29.1, 31.75]} credito="Reprodução · ESPN · Canindé, 8/12/2013" cinza={false} a={0.35} />
      <Titulo r={29.15} top={330} size={110}>DOMINGO</Titulo>
      <Faixa r={w("grêmio") - 0.6} texto="PORTUGUESA × GRÊMIO" top={480} size={62} />
    </Plano>
    <Plano r={[31.75, 34.4]}>
      <Clip src="c43481" r0={31.75} dur={2.7} a={0.55} />
      <Relogio r={31.8} />
    </Plano>
    <Plano r={[34.4, 36.2]}>
      <Cheia src="l-heverton" r={[34.4, 36.2]} credito="Reprodução · imprensa" pos="28% 40%" zoom={[1.0, 1.1]} cinza={false} a={0.3} />
      <Faixa r={34.45} texto="HÉVERTON ENTRA" top={330} size={76} />
    </Plano>
    <Plano r={[36.2, 38.7]}>
      <Clip src="c43485" r0={36.2} dur={2.5} a={0.6} />
      <Titulo r={36.25} top={380} size={150}>13 MIN</Titulo>
      <Placar r={37.6} />
    </Plano>
    <Plano r={[38.7, 40.9]}>
      <Clip src="c30601" r0={38.7} dur={2.2} a={0.5} />
      <Grande r={38.75} top={560} size={84}>um jogo que<br />não valia nada.</Grande>
    </Plano>
    {/* o mesmo domingo: Cruzeiro x Flamengo */}
    <Plano r={[40.9, 43.85]}>
      <Cheia src="l-crufla" r={[40.9, 43.85]} credito="Reprodução · TV · Cruzeiro 1 × 1 Flamengo, 8/12/2013" cinza={false} a={0.35} />
      <Rotulo r={40.95} texto="NO MESMO DOMINGO…" top={330} size={46} cor={C.fita} />
      <Faixa r={w("cruzeiro") - 0.1} texto="CRUZEIRO × FLAMENGO" top={420} size={64} />
    </Plano>
    <Plano r={[43.85, 46.6]}>
      <Ficha sup="FLAMENGO · LATERAL" nome="ANDRÉ SANTOS" foto="l-andre" pos="30% 15%" credito="foto: reprodução" top={360}
        linhas={[[45.6, "— suspenso"]]} />
    </Plano>
    <Plano r={[46.6, 48.85]}>
      <Cheia src="l-flafinal" r={[46.6, 48.85]} credito="Reprodução · TV Globo · final da Copa do Brasil 2013" pos="70% 40%" cinza={false} a={0.35} />
      <Rotulo r={46.65} texto="FINAL DA COPA DO BRASIL" top={330} size={46} />
      <Carimbo r={w("expulsão") - 0.02} texto="EXPULSO" y={560} rot={-8} size={120} />
    </Plano>
    <Plano r={[48.85, 51.8]}>
      <Fundo />
      <Papel top={380} h={560} rot={-1.2}>
        <Cabec sup="VERSÃO DO FLAMENGO" titulo="PENA JÁ CUMPRIDA" size={60} />
        <Linha r={49.6} texto="— ele ficou fora contra" />
        <Linha r={50.4} texto="  o Vitória, em 1º/12" />
      </Papel>
    </Plano>
    <Plano r={[51.8, 53.95]}>
      <Clip src="c47687" r0={51.8} dur={2.15} a={0.5} />
      <Titulo r={51.85} top={360} size={90}>O TRIBUNAL:</Titulo>
      <Carimbo r={w("não", 1) - 0.02} texto="NÃO" y={640} rot={-8} size={200} />
    </Plano>
    {/* o mesmo erro */}
    <Plano r={[53.95, 57.55]}>
      <Split r={53.96} r2={54.32}>
        <Faixa r={w("erro") - 0.1} texto="O MESMO ERRO" top={668} size={70} />
      </Split>
    </Plano>
    <Plano r={[57.55, 61.6]}>
      <Clip src="c47602" r0={57.55} dur={4.05} a={0.55} />
      <Rotulo r={57.6} texto="A MESMA PUNIÇÃO" top={340} size={48} cor={C.fita} />
      <Titulo r={58.74} top={440} size={190} cor={C.verm}>−4</Titulo>
      <Titulo r={59.62} top={660} size={84}>PONTOS</Titulo>
      <Rotulo r={60.6} texto="pra cada um" top={790} size={46} />
    </Plano>
    {/* a tabela */}
    <Plano r={[61.6, 64.1]}><Tabela /><Rotulo r={61.66} texto="AGORA OLHA A TABELA" top={1140} size={40} cor={C.fita} /></Plano>
    <Plano r={[64.1, 69.1]}><Tabela foco={[1.06, 0, 0]} /><Rotulo r={66.5} texto="Fluminense: 46" top={1140} size={40} cor={C.fita} /></Plano>
    <Plano r={[69.1, 72.2]}><Tabela foco={[1.18, 0, -150]} /></Plano>
    <Plano r={[72.2, 76.0]}><Tabela foco={[1.04, 0, 0]} /><Rotulo r={72.26} texto="MAS A PORTUGUESA TAMBÉM…" top={1140} size={40} cor={C.fita} /></Plano>
    <Plano r={[76.0, 79.2]}><Tabela foco={[1.16, 0, -120]} /><Rotulo r={77.48} texto="um ponto a menos que o Flamengo" top={1140} size={40} cor={C.fita} /></Plano>
    <Plano r={[79.2, 82.25]}>
      <Cheia src="l-protesto" r={[79.2, 82.25]} credito="Reprodução · TV Brasil / TV Gazeta · torcida da Lusa, dez/2013" cinza={false} a={0.35} />
      <Titulo r={79.3} top={300} size={96}>PORTUGUESA</Titulo>
      <Carimbo r={80.54} texto="REBAIXADA" y={530} rot={-6} size={110} />
      <Faixa r={81.42} texto="O FLAMENGO FICA" top={700} size={70} />
    </Plano>
    <Plano r={[82.25, 86.9]}>
      <Foto src="l-mario" r={[82.25, 86.9]} credito="Reprodução · TV · Mário Bittencourt, advogado do Fluminense no STJD" top={470} w={960} h={600} pos="55% 35%" zoom={[1.0, 1.1]} />
      <Titulo r={82.3} top={200} size={92}>FLUMINENSE</Titulo>
      <Rotulo r={83.76} texto="tinha caído dentro de campo…" top={320} size={40} />
      <Faixa r={w("salva") - 0.1} texto="SALVO NO TRIBUNAL" top={1100} size={62} />
    </Plano>
    {/* a pergunta */}
    <Plano r={[86.9, 90.2]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Grande r={86.96} top={600} size={80}>mas a pergunta que<br />ninguém respondeu…</Grande>
    </Plano>
    <Plano r={[90.2, 96.1]}>
      <Cheia src="l-lusagremio" r={[90.2, 96.1]} credito="Reprodução · ESPN" a={0.62} />
      <Titulo r={90.22} top={300} size={110}>POR QUÊ?</Titulo>
      <Lista top={520} itens={[[91.26, "time já salvo"], [92.9, "jogador suspenso"], [94.44, "jogo sem valor"]]} />
    </Plano>
    {/* os dois lados */}
    <Plano r={[96.1, 99.2]}>
      <Fundo />
      <Papel top={380} h={520} rot={1}>
        <Cabec sup="VERSÃO DA PORTUGUESA" titulo="NÃO SABIA DA SUSPENSÃO" size={58} />
        <Linha r={97.6} texto="— o clube negou que" />
        <Linha r={98.3} texto="  soubesse do gancho" />
      </Papel>
    </Plano>
    <Plano r={[99.2, 103.7]}>
      <Fundo />
      <Papel top={380} h={520} rot={-1}>
        <Cabec sup="VERSÃO DO FLAMENGO" titulo="TAMBÉM FOI PUNIDO" size={58} />
        <Linha r={102.2} texto="— os mesmos 4 pontos," />
        <Linha r={103.0} texto="  do mesmo jeito" />
      </Papel>
    </Plano>
    <Plano r={[103.7, 106.75]}>
      <Cheia src="l-flafesta" r={[103.7, 106.75]} credito="Reprodução · ESPN" cinza a={0.4} />
      <Carimbo r={w("nada", 3) - 0.02} texto="NADA PROVADO" y={520} rot={-7} size={78} />
    </Plano>
    <Plano r={[106.75, 109.05]}>
      <Foto src="l-faixa" r={[106.75, 109.05]} credito="Reprodução · UOL · torcedores em frente ao STJD, Rio, dez/2013" top={430} w={1000} h={620} zoom={[1.0, 1.12]} />
      <Titulo r={w("desconfiança") - 0.15} top={190} size={72}>MAS A<br />DESCONFIANÇA FICOU</Titulo>
    </Plano>
    <Plano r={[109.05, 112.3]}>
      <Clip src="c47687" r0={109.05} from={3} dur={3.25} a={0.55} />
      <Titulo r={109.45} top={360} size={86}>MINISTÉRIO<br />PÚBLICO · SP</Titulo>
      <Faixa r={w("investigou") - 0.1} texto="INVESTIGOU O CASO" top={600} size={60} />
    </Plano>
    <Plano r={[112.3, 116.6]}>
      <Clip src="c18305" r0={112.3} dur={4.3} a={0.6} />
      <Rotulo r={112.35} texto="UM PROMOTOR CHEGOU A DIZER:" top={330} size={40} cor={C.fita} />
      <Grande r={113.8} top={460} size={74}>“alguém na Portuguesa<br />recebeu dinheiro”</Grande>
    </Plano>
    <Plano r={[116.6, 120.4]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Titulo r={w("quem") - 0.15} top={480} size={140}>QUEM<br />PAGOU?</Titulo>
      <Rotulo r={w("nem") - 0.05} texto="…nem se alguém pagou" top={830} size={48} cor={C.ossoE} />
    </Plano>
    <Plano r={[120.4, 123.45]}>
      <Fundo />
      <Papel top={400} h={460} rot={-1.5}>
        <Cabec sup="MINISTÉRIO PÚBLICO · SP" titulo="INQUÉRITO" size={70} />
        <Linha r={121.0} texto="situação: ARQUIVADO" />
      </Papel>
      <Carimbo r={w("sem", 0) - 0.02} texto="SEM PROVAS" y={800} rot={-9} size={110} />
    </Plano>
    {/* depois */}
    <Plano r={[123.45, 125.0]}>
      <Cheia src="l-escudo" r={[123.45, 125.0]} credito="Reprodução · TV Record · Canindé" a={0.4} />
      <Titulo r={123.5} top={420} size={100}>E A PORTUGUESA?</Titulo>
    </Plano>
    <Plano r={[125.0, 128.9]}>
      <Cheia src="l-somos" r={[125.0, 128.9]} credito="Reprodução · TV · Canindé, 2016" a={0.6} />
      <Rotulo r={125.1} texto="EM 3 ANOS…" top={190} size={44} cor={C.fita} />
      <Queda />
    </Plano>
    <Plano r={[128.9, 130.65]}>
      <Cheia src="l-heverton" r={[128.9, 130.65]} credito="Reprodução · imprensa" pos="28% 40%" a={0.5} />
      <Rotulo r={128.95} texto="POR CAUSA DE" top={380} size={46} />
      <Titulo r={129.6} top={450} size={150}>13 MINUTOS</Titulo>
    </Plano>
    {/* a pergunta para as duas torcidas */}
    <Plano r={[130.65, 132.25]}>
      <Foto src="l-torcidas" r={[130.65, 132.25]} credito="Reprodução · PELEJA" top={480} w={1000} h={600} zoom={[1.0, 1.08]} />
      <Titulo r={130.7} top={250} size={96}>ENTÃO ME FALA…</Titulo>
    </Plano>
    <Plano r={[132.25, 136.5]}>
      <Split r={132.25} r2={134.4}>
        <Titulo r={132.6} top={210} size={70}>ERA PRA TER CAÍDO?</Titulo>
        <Titulo r={134.76} top={780} size={70}>OU CAIU SOZINHA?</Titulo>
      </Split>
    </Plano>
    <Plano r={[136.5, 160]} soco={false}>
      <Clip src="c21751" r0={136.5} dur={8} a={0.62} />
      <Grande r={136.58} top={640} size={86}>Onde você estava<br />naquela noite?</Grande>
      <Assinatura r={w("esse") - 0.05} />
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
