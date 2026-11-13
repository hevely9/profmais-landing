import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CENA, FIM_VOZ, FPS, GAP_AT, LEAD, SFX, T, TOTAL, WORDS, o, q } from "./timeline";
import { Avental, EstampaBasa, Pessoa } from "./pessoas";

// ── identidade (cores medidas do material da Maria Alice) ────────────────
const C = { fundo: "#012E1B", fundo2: "#06422A", verde: "#0F5A33", medio: "#3E8E2F", lima: "#7DBA3E", limaClaro: "#B5DC7E", cinza: "#EEF0EB",
  branco: "#FFFFFF", tinta: "#0E2418", ouro: "#E9C46A", whats: "#25D366" };
const F = "Montserrat", MAO = "Caveat";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SP = { suave: { damping: 200 }, mola: { damping: 13, stiffness: 160 }, pop: { damping: 10, stiffness: 200 } };
const ease = Easing.bezier(0.65, 0, 0.35, 1);
const lin = (t: number, a: number, b: number, e: (n: number) => number = ease) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, t: f / fps }; };
const sp = (f: number, fps: number, at: number, cfg: { damping: number; stiffness?: number } = SP.suave) => spring({ frame: f - q(at), fps, config: cfg });
const falando = (t: number) => WORDS.some((w) => t >= w.start && t < w.end + 0.02);
const bocaDe = (t: number) => (falando(t) ? 0.35 + 0.65 * Math.abs(Math.sin(t * 17)) : 0);
const piscaDe = (t: number, off = 0) => (((t + off) % 2.9) < 0.1 ? 0.12 : 1);

// Entrada/saída de cena: desliza e some.
const Cena: React.FC<{ de: number; ate: number; children: React.ReactNode }> = ({ de, ate, children }) => {
  const { t } = useT();
  if (t < de - 0.05 || t > ate + 0.35) return null;
  const e = lin(t, ate, ate + 0.32, Easing.in(Easing.cubic));
  const en = de <= 0 ? 1 : lin(t, de + 0.1, de + 0.45, Easing.out(Easing.cubic));
  return <AbsoluteFill style={{ opacity: (1 - e) * en, transform: `translateX(${-e * 160 + (1 - en) * 180}px) scale(${1 - 0.05 * e})` }}>{children}</AbsoluteFill>;
};
const Pop: React.FC<{ at: number; style?: React.CSSProperties; cfg?: { damping: number; stiffness?: number }; dy?: number; children: React.ReactNode }> = ({ at, style, cfg = SP.mola, dy = 50, children }) => {
  const { f, fps } = useT();
  const p = sp(f, fps, at, cfg);
  return <div style={{ position: "absolute", opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * dy}px) scale(${0.85 + 0.15 * p})`, ...style }}>{children}</div>;
};

// ── fundo da marca ────────────────────────────────────────────────────────
const Folha: React.FC<{ size: number; color: string; style?: React.CSSProperties }> = ({ size, color, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <path d="M10 90 C10 40 40 10 92 8 C90 60 60 90 10 90 Z" fill={color} /><path d="M14 86 C40 60 60 40 84 16" stroke={C.fundo} strokeWidth="4" fill="none" opacity="0.35" />
  </svg>
);
const Fundo: React.FC = () => {
  const { t } = useT();
  return <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% 42%, ${C.fundo2} 0%, ${C.fundo} 70%)` }}>
    <div style={{ position: "absolute", right: 70, top: 120, display: "grid", gridTemplateColumns: "repeat(5, 14px)", gap: 18, opacity: 0.8 }}>
      {Array.from({ length: 15 }, (_, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: 5, background: C.lima }} />)}</div>
    {[[-60, 1500, 340, 20], [880, 1640, 300, -30], [900, 420, 220, 150], [-90, 300, 260, 110]].map(([x, y, s, r], i) =>
      <Folha key={i} size={s} color={C.verde} style={{ position: "absolute", left: x, top: y + Math.sin(t * 0.8 + i) * 14, transform: `rotate(${r + Math.sin(t * 0.6 + i) * 4}deg)`, opacity: 0.55 }} />)}
  </AbsoluteFill>;
};
const Logo: React.FC<{ escala?: number }> = ({ escala = 1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18 * escala }}>
    <svg width={120 * escala} height={120 * escala} viewBox="0 0 100 100">
      <path d="M12 92 L42 10 L58 10 L88 92 L70 92 L50 34 L30 92 Z" fill={C.branco} />
      <path d="M30 80 C44 50 70 40 96 44 C88 70 62 84 30 80 Z" fill={C.lima} />
    </svg>
    <div style={{ lineHeight: 0.86 }}>
      <div style={{ fontFamily: F, fontWeight: 900, fontSize: 96 * escala, color: C.branco, letterSpacing: "-0.03em" }}>BASA</div>
      <div style={{ fontFamily: MAO, fontWeight: 700, fontSize: 92 * escala, color: C.lima, marginTop: -6 * escala }}>acredita</div>
    </div>
  </div>
);

// ── cena 1: a dúvida ──────────────────────────────────────────────────────
const Barraca: React.FC<{ t: number; cresce: number; murcha: number }> = ({ t, cresce, murcha }) => {
  const larg = 760 + 160 * cresce;
  return (
    <svg width={1080} height={700} viewBox="0 0 1080 700" style={{ overflow: "visible" }}>
      {/* toldo */}
      <g transform={`translate(540 0) scale(${larg / 760} 1) translate(-540 0)`}>
        <path d="M160 40 H920 L960 150 H120 Z" fill={C.branco} />
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${160 + i * 108.6} 40 h54.3 l${6 + i * 0.5} 110 h-${54.3 + 10} Z`} fill={C.lima} />)}
        {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${120 + i * 84} 150 q42 52 84 0`} fill={i % 2 ? C.lima : C.branco} />)}
        <rect x="150" y="150" width="14" height="420" fill="#C9A27A" /><rect x="916" y="150" width="14" height="420" fill="#C9A27A" />
      </g>
      {/* placa */}
      <g transform={`translate(540 230) rotate(${Math.sin(t * 2) * 2})`}>
        <rect x={-190 - 40 * cresce} y="-46" width={380 + 80 * cresce} height="92" rx="20" fill={C.branco} stroke={C.lima} strokeWidth="6" />
        <text y="18" textAnchor="middle" fontFamily={F} fontWeight={900} fontSize="46" fill={C.tinta}>{cresce > 0.5 ? "MEU NEGÓCIO ✦" : "MEU NEGÓCIO"}</text>
      </g>
      {/* balcão */}
      <rect x={180 - 80 * cresce} y="440" width={720 + 160 * cresce} height="240" rx="18" fill="#D9B48A" />
      <rect x={180 - 80 * cresce} y="440" width={720 + 160 * cresce} height="36" rx="12" fill="#B98A5E" />
      {[0, 1, 2, 3, 4, 5].map((i) => { const vis = i < 3 ? 1 : lin(cresce, 0.2 + (i - 3) * 0.2, 0.5 + (i - 3) * 0.2);
        return <g key={i} transform={`translate(${250 + i * 120 - 60 * cresce * (i > 2 ? 0 : 1) + (i > 2 ? 60 * cresce : 0)} 440) scale(${vis})`} opacity={vis}>
          <rect x="-34" y="-96" width="68" height="96" rx="14" fill={["#F2B33D", "#E8828A", C.limaClaro][i % 3]} stroke={C.tinta} strokeWidth="4" />
          <rect x="-38" y="-112" width="76" height="22" rx="7" fill={C.branco} stroke={C.tinta} strokeWidth="4" /></g>; })}
      {/* plantinha do negócio */}
      <g transform="translate(870 440)">
        <path d="M-40 0 L40 0 L30 -70 L-30 -70 Z" transform="scale(1 -1) translate(0 70)" fill="#B5643D" />
        <g transform={`rotate(${murcha * 28})`}>
          <path d={`M0 0 C0 -${60 + 140 * cresce} 6 -${90 + 170 * cresce} 0 -${110 + 190 * cresce}`} stroke={C.medio} strokeWidth={10 + 6 * cresce} fill="none" strokeLinecap="round" />
          {[0, 1, 2].map((k) => { const v = k === 0 ? 1 : lin(cresce, 0.2 * k, 0.2 * k + 0.4); const y = -(70 + 60 * k) * (0.6 + 0.9 * cresce);
            return <g key={k} transform={`translate(0 ${y}) scale(${v * (0.8 + 0.8 * cresce)})`}><Folha size={80} color={C.lima} style={undefined} />
              <g transform="scale(-1 1)"><svg x="-80" y="0" width="80" height="80" viewBox="0 0 100 100"><path d="M10 90 C10 40 40 10 92 8 C90 60 60 90 10 90 Z" fill={C.lima} /></svg></g></g>; })}
          {cresce > 0.6 && <circle cx="0" cy={-(110 + 190 * cresce) - 12} r={26 * lin(cresce, 0.6, 1)} fill={C.ouro} stroke="#C99A2E" strokeWidth="5" />}
        </g>
      </g>
    </svg>
  );
};

const CenaDuvida: React.FC = () => {
  const { f, fps, t } = useT();
  const bolha = sp(f, fps, T.negocio - 0.1, SP.pop);
  const murcha = lin(t, T.crescer + 0.1, T.crescer + 0.6) - 0.0;
  const sobe = lin(t, T.crescer - 0.5, T.crescer + 0.05);
  return (
    <Cena de={CENA.duvida.de} ate={CENA.duvida.ate}>
      <Pop at={0.05} style={{ left: 0, right: 0, top: 170, textAlign: "center" }}>
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: 80, color: C.branco, letterSpacing: "-0.03em", lineHeight: 1 }}>PRECISANDO DE</div>
      </Pop>
      <Pop at={T.credito - 0.05} cfg={SP.pop} style={{ left: 0, right: 0, top: 262, textAlign: "center" }}>
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: 150, color: C.lima, letterSpacing: "-0.04em", lineHeight: 1 }}>CRÉDITO?</div>
      </Pop>
      <div style={{ position: "absolute", left: 240, top: 620, transform: `scale(1.0)` }}>
        <Pessoa estilo="coque" pele="#A86B4C" peleSombra="#8E573C" cabelo="#2B1B14" camisa="#F2B33D" camisaSombra="#D99A22" humor={-1}
          pisca={piscaDe(t)} olhar={[-6, -10]} inclina={-4 + Math.sin(t * 2) * 1.5}
          bracoE={{ ombro: 10, cotovelo: 6 }} bracoD={{ ombro: 30 + 4 * Math.sin(t * 3), cotovelo: 128 }} detalhe={<Avental />} />
      </div>
      {/* pensamento */}
      <div style={{ position: "absolute", left: 640, top: 520, transform: `scale(${bolha})`, transformOrigin: "10% 100%", opacity: Math.min(1, bolha * 2) }}>
        <div style={{ position: "absolute", left: -10, top: 210, width: 26, height: 26, borderRadius: 13, background: C.branco }} />
        <div style={{ position: "absolute", left: 18, top: 170, width: 40, height: 40, borderRadius: 20, background: C.branco }} />
        <div style={{ width: 320, height: 170, borderRadius: 85, background: C.branco, display: "grid", placeItems: "center", fontFamily: F, fontWeight: 900, fontSize: 84, color: C.tinta,
          boxShadow: "0 20px 40px -20px rgba(0,0,0,0.5)" }}><span>R$ <span style={{ color: C.medio, display: "inline-block", transform: `rotate(${Math.sin(t * 6) * 10}deg)` }}>?</span></span></div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 1240 }}><Barraca t={t} cresce={0} murcha={murcha * (1 - 0) + 0 * sobe} /></div>
    </Cena>
  );
};

// ── cena 2: a solução ─────────────────────────────────────────────────────
const Card: React.FC<{ at: number; top: number; icone: React.ReactNode; titulo: string; sub: string }> = ({ at, top, icone, titulo, sub }) => {
  const { f, fps } = useT();
  const p = sp(f, fps, at, SP.mola);
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top, height: 200, borderRadius: 40, background: C.cinza, display: "flex", alignItems: "center", gap: 34, padding: "0 40px",
      boxShadow: "0 30px 60px -30px rgba(0,0,0,0.6)", opacity: Math.min(1, p * 1.6), transform: `translateX(${(1 - p) * 500}px) rotate(${(1 - p) * 4}deg)` }}>
      <div style={{ width: 124, height: 124, borderRadius: 62, background: C.medio, display: "grid", placeItems: "center", flexShrink: 0, transform: `scale(${0.6 + 0.4 * p})` }}>{icone}</div>
      <div>
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: 52, color: C.verde, letterSpacing: "-0.03em", lineHeight: 1.0 }}>{titulo}</div>
        <div style={{ fontFamily: F, fontWeight: 500, fontSize: 32, color: "#3C4A40", marginTop: 8 }}>{sub}</div>
      </div>
    </div>
  );
};
const IcPessoa = <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>;
const IcLoja = <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round"><path d="M3 9l2-5h14l2 5M3 9h18v2a3 3 0 0 1-6 0a3 3 0 0 1-6 0a3 3 0 0 1-6 0zM5 13v8h14v-8M10 21v-5h4v5" /></svg>;
const IcCheck = <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;

const CenaSolucao: React.FC = () => {
  const { f, fps, t } = useT();
  const logo = sp(f, fps, T.basa - 0.1, SP.mola);
  const raio = lin(t, T.basa - 0.1, T.basa + 0.8, Easing.out(Easing.cubic));
  return (
    <Cena de={CENA.solucao.de} ate={CENA.solucao.ate}>
      <div style={{ position: "absolute", left: 540, top: 600, width: 0, height: 0 }}>
        {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ position: "absolute", left: -6, top: -6, width: 12, height: 160 + 260 * raio, borderRadius: 6,
          background: `linear-gradient(${C.lima}, transparent)`, transformOrigin: "6px 6px", transform: `rotate(${i * 30 + t * 12}deg) translateY(${60 + 80 * raio}px)`, opacity: 0.35 * (1 - raio * 0.4) }} />)}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 460, display: "flex", justifyContent: "center", transform: `scale(${logo * 1.15}) rotate(${(1 - logo) * -8}deg)`, opacity: Math.min(1, logo * 2) }}>
        <Logo escala={1.25} />
      </div>
      <Card at={T.voce} top={920} icone={IcPessoa} titulo="MICROCRÉDITO" sub="Soluções pensadas pra você" />
      <Card at={T.micro + 0.25} top={1170} icone={IcLoja} titulo="PRA QUEM EMPREENDE" sub="Incentivo pra quem move a economia" />
      {[0, 1, 2, 3, 4, 5].map((i) => { const a = T.pensado + i * 0.12; const p = lin(t, a, a + 0.9, Easing.in(Easing.quad)); if (t < a) return null;
        return <div key={i} style={{ position: "absolute", left: 150 + ((i * 167) % 780), top: 1400 + p * 460, opacity: 1 - lin(t, a + 0.6, a + 0.9), transform: `rotate(${p * 280}deg)` }}>
          <svg width="80" height="80" viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill={C.ouro} stroke="#C99A2E" strokeWidth="6" /><text x="50" y="66" textAnchor="middle" fontFamily={F} fontWeight={900} fontSize="44" fill="#8A6A16">$</text></svg></div>; })}
    </Cena>
  );
};

// ── cena 3: agilidade e menos burocracia ─────────────────────────────────
const CenaAgil: React.FC = () => {
  const { f, fps, t } = useT();
  const rel = sp(f, fps, T.mais - 0.1, SP.pop), pap = sp(f, fps, T.menos - 0.15, SP.pop);
  const voa = lin(t, T.menos + 0.1, T.burocracia + 0.4, Easing.in(Easing.quad));
  const carimbo = sp(f, fps, T.burocracia + 0.55, { damping: 12, stiffness: 260 });
  const cresce = lin(t, T.burocracia + 0.75, T.burocracia + 1.6, Easing.out(Easing.back(1.6)));
  return (
    <Cena de={CENA.agil.de} ate={CENA.agil.ate}>
      {/* cronômetro */}
      <div style={{ position: "absolute", left: 80, top: 190, width: 440, textAlign: "center", transform: `scale(${rel})`, opacity: Math.min(1, rel * 2) }}>
        <svg width="300" height="330" viewBox="0 0 100 110" style={{ overflow: "visible" }}>
          <rect x="42" y="2" width="16" height="10" rx="3" fill={C.limaClaro} />
          <circle cx="50" cy="62" r="42" fill={C.branco} stroke={C.lima} strokeWidth="7" />
          <path d={`M50 62 L50 ${62 - 30}`} stroke={C.verde} strokeWidth="5" strokeLinecap="round" transform={`rotate(${(t - T.mais) * 900} 50 62)`} />
          <circle cx="50" cy="62" r="5" fill={C.verde} />
          {[0, 1, 2].map((i) => <path key={i} d={`M${-8 - i * 6} ${48 + i * 14} h-${18 - i * 4}`} stroke={C.lima} strokeWidth="5" strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(t * 20 + i)} />)}
        </svg>
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: 54, color: C.branco, letterSpacing: "-0.03em", marginTop: 6 }}>MAIS<br /><span style={{ color: C.lima }}>AGILIDADE</span></div>
      </div>
      {/* papelada voando */}
      <div style={{ position: "absolute", left: 560, top: 190, width: 440, height: 520, textAlign: "center", transform: `scale(${pap})`, opacity: Math.min(1, pap * 2) }}>
        {[0, 1, 2, 3, 4].map((i) => { const dx = (i - 2) * 160 * voa + voa * 40, dy = -voa * (380 + i * 60), r = (i - 2) * 50 * voa + (i - 2) * 4;
          return <div key={i} style={{ position: "absolute", left: 140, top: 70 + i * 16, width: 160, height: 200, borderRadius: 10, background: C.branco, boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
            transform: `translate(${dx}px, ${dy}px) rotate(${r}deg)`, opacity: 1 - lin(voa, 0.6, 1), padding: 18 }}>
            {[0, 1, 2, 3, 4].map((k) => <div key={k} style={{ height: 10, borderRadius: 5, background: "#D3D8D0", marginBottom: 16, width: `${90 - k * 12}%` }} />)}</div>; })}
        <div style={{ position: "absolute", left: 0, right: 0, top: 336, fontFamily: F, fontWeight: 900, fontSize: 54, color: C.branco, letterSpacing: "-0.03em" }}>MENOS<br />
          <span style={{ color: C.lima, position: "relative" }}>BUROCRACIA<span style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 9, borderRadius: 5, background: C.branco,
            transform: `scaleX(${lin(t, T.burocracia + 0.15, T.burocracia + 0.45)})`, transformOrigin: "0 50%" }} /></span></div>
      </div>
      {/* carimbo */}
      {t > T.burocracia + 0.5 && <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 44px", borderRadius: 28, border: `9px solid ${C.lima}`, color: C.lima, background: "rgba(1,46,27,0.85)",
          fontFamily: F, fontWeight: 900, fontSize: 64, letterSpacing: "-0.02em", transform: `scale(${2.2 - 1.2 * carimbo}) rotate(-7deg)`, opacity: Math.min(1, carimbo * 2) }}>
          <div style={{ width: 84, height: 84, borderRadius: 42, background: C.lima, display: "grid", placeItems: "center" }}>{IcCheck}</div>CRÉDITO LIBERADO</div>
      </div>}
      {/* o negócio cresce */}
      <div style={{ position: "absolute", left: 260, top: 1020, transform: `scale(0.82)`, transformOrigin: "50% 0" }}>
        <Pessoa estilo="coque" pele="#A86B4C" peleSombra="#8E573C" cabelo="#2B1B14" camisa="#F2B33D" camisaSombra="#D99A22" humor={cresce > 0.2 ? 1 : 0}
          pisca={piscaDe(t, 1)} bracoE={{ ombro: 10 + 140 * cresce, cotovelo: -20 * cresce }} bracoD={{ ombro: 10 + 140 * cresce, cotovelo: -20 * cresce }} detalhe={<Avental />} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 1360 }}><Barraca t={t} cresce={cresce} murcha={0} /></div>
    </Cena>
  );
};

// ── cena 4: Maria Alice ──────────────────────────────────────────────────
const CenaMaria: React.FC = () => {
  const { f, fps, t } = useT();
  const ent = sp(f, fps, CENA.maria.de, SP.mola);
  const nome = sp(f, fps, T.maria - 0.1, SP.mola);
  const btn = sp(f, fps, T.chama - 0.1, SP.pop);
  const acena = t < T.chama - 0.2;
  const aponta = lin(t, T.chama - 0.25, T.chama + 0.15);
  const toque = lin(t, FIM_VOZ + 0.5, FIM_VOZ + 0.62) * (1 - lin(t, FIM_VOZ + 0.62, FIM_VOZ + 0.85));
  const pulso = t > T.chama + 0.4 ? 1 + 0.035 * Math.sin((t - T.chama) * 7) : 1;
  const enviado = t > FIM_VOZ + 0.62;
  const mao = lin(t, FIM_VOZ + 0.05, FIM_VOZ + 0.5, Easing.out(Easing.cubic)) * (1 - lin(t, FIM_VOZ + 1.2, FIM_VOZ + 1.5));
  return (
    <Cena de={CENA.maria.de} ate={CENA.maria.ate}>
      {/* nome */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 190, opacity: Math.min(1, nome * 1.6), transform: `translateY(${(1 - nome) * 50}px)` }}>
        <div style={{ fontFamily: F, fontWeight: 800, fontSize: 40, color: C.limaClaro, letterSpacing: "0.04em" }}>FALA COM A</div>
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: 118, color: C.branco, letterSpacing: "-0.045em", lineHeight: 1 }}>Maria Alice</div>
        <div style={{ fontFamily: MAO, fontWeight: 700, fontSize: 74, color: C.lima, marginTop: 4, clipPath: `inset(0 ${100 - lin(t, T.sua, T.sua + 0.9) * 100}% 0 0)` }}>sua assessora financeira</div>
      </div>
      {/* botão WhatsApp */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: Math.min(1, btn * 2),
        transform: `scale(${btn * pulso * (1 - 0.06 * toque)})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "24px 46px", borderRadius: 999, background: enviado ? C.branco : C.whats,
          boxShadow: "0 24px 50px -20px rgba(0,0,0,0.6)" }}>
          <svg width="76" height="76" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill={enviado ? C.whats : "#fff"} /><path d="M9 23l1.3-3.6A7.6 7.6 0 1 1 13 22l-4 1z" fill="none" stroke={enviado ? "#fff" : C.whats} strokeWidth="2" strokeLinejoin="round" />
            <path d="M13 12.5c.2 2.6 2.4 5 5.2 5.6l1.1-1.4-1.8-.9-.8.8c-1-.5-1.9-1.4-2.4-2.4l.8-.8-.9-1.8z" fill={enviado ? "#fff" : C.whats} /></svg>
          <div style={{ fontFamily: F, fontWeight: 900, fontSize: 56, color: enviado ? C.verde : C.branco, letterSpacing: "-0.02em" }}>{enviado ? "VAMOS CONVERSAR!" : "CHAMA NO WHATSAPP"}</div>
        </div>
        <div style={{ fontFamily: F, fontWeight: 900, fontSize: 86, color: C.branco, letterSpacing: "-0.02em", lineHeight: 1 }}>68 99227-8563</div>
        <div style={{ fontFamily: F, fontWeight: 600, fontSize: 32, color: C.limaClaro, opacity: lin(t, FIM_VOZ - 0.2, FIM_VOZ + 0.3) }}>O crédito que impulsiona você.</div>
      </div>
      {mao > 0.001 && <svg width="130" height="150" viewBox="0 0 60 70" style={{ position: "absolute", left: 800 - 120 * (1 - mao), top: 640 + 160 * (1 - mao), opacity: Math.min(1, mao * 1.5),
        transform: `scale(${1 - 0.1 * toque})`, transformOrigin: "20% 10%" }}>
        <path d="M18 6 C18 2 24 2 24 6 V30 L27 22 C29 18 34 20 32 25 L35 24 C37 21 42 23 40 28 L43 28 C46 27 48 30 46 34 L42 52 C41 58 36 62 30 62 H24 C18 62 14 58 11 53 L4 40 C2 36 7 33 10 37 L18 46 Z"
          fill={C.branco} stroke={C.tinta} strokeWidth="3.2" strokeLinejoin="round" /></svg>}
      {/* personagem */}
      <div style={{ position: "absolute", left: 165, top: 900, transform: `translateX(${(1 - ent) * -700}px) rotate(${(1 - ent) * -10}deg) scale(1.25)`, transformOrigin: "50% 0" }}>
        <Pessoa estilo="maria" pele="#E3AE88" peleSombra="#C98F6A" cabelo="#1E1512" camisa={C.verde} camisaSombra="#0A4126" humor={1}
          pisca={piscaDe(t, 0.4)} boca={bocaDe(t)} olhar={aponta > 0.5 ? [6, -10] : [0, 0]} inclina={acena ? 3 * Math.sin(t * 3) : -3 * aponta}
          bracoD={acena ? { ombro: 150, cotovelo: -25 + 25 * Math.sin(t * 11) } : { ombro: 150 - 10 * aponta, cotovelo: -10 }}
          bracoE={{ ombro: 12, cotovelo: 8 }} detalhe={<EstampaBasa />} />
      </div>
    </Cena>
  );
};

// ── som e composição ─────────────────────────────────────────────────────
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
const Sons: React.FC = () => (
  <>
    <Sequence from={q(LEAD)} durationInFrames={q(GAP_AT) + 2}><Audio src={staticFile("audio/voz.mp3")} endAt={q(GAP_AT)} volume={1} /></Sequence>
    <Sequence from={q(o(GAP_AT))}><Audio src={staticFile("audio/voz.mp3")} startFrom={q(GAP_AT)} volume={1} /></Sequence>
    <Audio src={staticFile("audio/trilha.mp3")} startFrom={q(20)} volume={(fr) => 0.1 * interpolate(fr, [0, 10], [0, 1], clamp) * interpolate(fr, [TOTAL - q(1.2), TOTAL - 2], [1, 0], clamp)} />
    {SFX.map((s, i) => <Sequence key={i} from={Math.max(0, q(s.at))} durationInFrames={q(2.2)}><Audio src={staticFile(`audio/${s.src}.mp3`)} volume={s.vol ?? 0.5} /></Sequence>)}
  </>
);
export const Reel: React.FC = () => {
  const { f } = useT();
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.fundo }}>
      <Fundo />
      <CenaDuvida /><CenaSolucao /><CenaAgil /><CenaMaria />
      <AbsoluteFill style={{ backgroundImage: NOISE, backgroundSize: "220px", backgroundPosition: `${(f * 7) % 220}px ${(f * 13) % 220}px`, opacity: 0.05, mixBlendMode: "overlay" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.35) 100%)" }} />
      <Sons />
    </AbsoluteFill>
  );
};
export { FPS };
