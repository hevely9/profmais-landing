import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CAPITULOS, FIM_VOZ, FINAL, FPS, GAPS, PAUSA_T0, PAUSA_DUR, SFX, TOTAL, TRECHOS, WORDS, o, q, w } from "./timeline";

// ── ÁLIBI: grafite, chumbo, branco-osso, vermelho-lacre e âmbar de fita policial ──
const C = { preto: "#0A0A0B", osso: "#ECE7DC", ossoE: "#9C978E", lacre: "#A3141C", papel: "#E4DDCB", tinta: "#1A1714", fita: "#C9A227" };
const SERIF = "Playfair", ELITE = "Elite", SANS = "Inter", MONT = "Mont", COURIER = "Courier";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lin = (t: number, a: number, b: number, e: (n: number) => number = Easing.bezier(0.65, 0, 0.35, 1)) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, t: f / fps }; };
const spT = (f: number, fps: number, at: number, cfg = { damping: 18, stiffness: 120 }) => spring({ frame: f - q(at), fps, config: cfg });
const sp = (f: number, fps: number, r: number, cfg = { damping: 18, stiffness: 120 }) => spT(f, fps, o(r), cfg);
// Efeitos sempre discretos: nunca competir com a voz.
const SFX_GANHO = 0.45;
const SOMBRA = "0 4px 30px rgba(0,0,0,0.9)";
// Zona da legenda: y 1320–1480. Todo texto de cena fica ACIMA de 1240.

const Cena: React.FC<{ r: readonly [number, number]; children: React.ReactNode; fade?: number }> = ({ r, children, fade = 0.35 }) => {
  const { t } = useT();
  const de = o(r[0]), ate = o(r[1]);
  if (t < de - 0.02 || t > ate + fade) return null;
  return <AbsoluteFill style={{ opacity: lin(t, de, de + fade) * (1 - lin(t, ate, ate + fade)) }}>{children}</AbsoluteFill>;
};
const Clip: React.FC<{ src: string; r0: number; from?: number; zoom?: [number, number]; dur?: number; op?: number }> = ({ src, r0, from = 0, zoom = [1.05, 1.15], dur = 12, op = 1 }) => {
  const { t } = useT();
  const k = lin(t, o(r0), o(r0) + dur, Easing.linear);
  return <Sequence from={q(o(r0))} layout="none">
    <AbsoluteFill style={{ transform: `scale(${zoom[0] + (zoom[1] - zoom[0]) * k})`, opacity: op }}>
      <OffthreadVideo src={staticFile(`v/${src}.mp4`)} startFrom={q(from)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  </Sequence>;
};
// Foto/documento real: enquadrado como fotografia de arquivo, com crédito
const Foto: React.FC<{ src: string; r: readonly [number, number]; credito: string; top?: number; w?: number; h?: number; pos?: string; zoom?: [number, number]; rot?: number; cover?: boolean; pan?: [number, number] }> =
  ({ src, r, credito, top = 300, w = 920, h = 760, pos = "50% 50%", zoom = [1.0, 1.08], rot = 0, cover = true, pan }) => {
  const { t } = useT();
  const k = lin(t, o(r[0]), o(r[1]), Easing.linear);
  const py = pan ? pan[0] + (pan[1] - pan[0]) * k : undefined;
  return <div style={{ position: "absolute", left: (1080 - w) / 2, top, width: w, height: h, transform: `rotate(${rot}deg)`, boxShadow: "0 30px 80px rgba(0,0,0,0.85)", background: "#111", border: "10px solid #D9D2C0", boxSizing: "border-box", overflow: "hidden" }}>
    <Img src={staticFile(`img/${src}.jpg`)} style={{ width: "100%", height: "100%", objectFit: cover ? "cover" : "contain", objectPosition: py !== undefined ? `50% ${py}%` : pos, transform: `scale(${zoom[0] + (zoom[1] - zoom[0]) * k})`, filter: "contrast(1.08) sepia(0.15)" }} />
    <div style={{ position: "absolute", right: 10, bottom: 6, fontFamily: SANS, fontWeight: 600, fontSize: 15, color: "rgba(255,255,255,0.8)", textShadow: "0 1px 4px #000" }}>{credito}</div>
  </div>;
};
const Fundo: React.FC<{ cor?: string }> = ({ cor = "radial-gradient(ellipse at 50% 40%, #24201C 0%, #0A0A0B 75%)" }) => <AbsoluteFill style={{ background: cor }} />;
const Escuro: React.FC<{ a?: number }> = ({ a = 0.55 }) => <AbsoluteFill style={{ background: `rgba(10,10,11,${a})` }} />;
const Surge: React.FC<{ r: number; children: React.ReactNode; style?: React.CSSProperties; dur?: number }> = ({ r, children, style, dur = 0.6 }) => {
  const { t } = useT();
  const k = lin(t, o(r) - 0.05, o(r) + dur, Easing.out(Easing.cubic));
  if (k <= 0) return null;
  return <div style={{ position: "absolute", left: 70, right: 70, textAlign: "center", opacity: k, filter: `blur(${(1 - k) * 8}px)`, transform: `translateY(${(1 - k) * 18}px)`, ...style }}>{children}</div>;
};
const Datilo: React.FC<{ r: number; texto: string; vel?: number }> = ({ r, texto, vel = 22 }) => {
  const { t } = useT();
  const n = Math.max(0, Math.floor((t - o(r)) * vel));
  if (n <= 0) return null;
  return <span>{texto.slice(0, n)}{n < texto.length && Math.floor(t * 3) % 2 === 0 ? "▌" : ""}</span>;
};
const Carimbo: React.FC<{ r: number; texto: string; x: number; y: number; rot?: number; size?: number }> = ({ r, texto, x, y, rot = -8, size = 90 }) => {
  const { t } = useT();
  if (t < o(r) - 0.01) return null;
  const k = lin(t, o(r) - 0.01, o(r) + 0.1, Easing.in(Easing.cubic));
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${interpolate(k, [0, 1], [2.4, 1])})`, opacity: Math.min(1, k * 1.5),
    border: `9px solid ${C.lacre}`, borderRadius: 10, padding: "8px 24px", color: C.lacre, fontFamily: ELITE, fontSize: size, lineHeight: 1, letterSpacing: "0.06em", whiteSpace: "nowrap",
    filter: "url(#gasto)", background: "rgba(10,10,11,0.35)" }}>{texto}</div>;
};
const Rotulo: React.FC<{ r: number; texto: string; top: number; cor?: string; size?: number }> = ({ r, texto, top, cor = C.osso, size = 34 }) =>
  <Surge r={r} style={{ top, fontFamily: COURIER, fontWeight: 700, fontSize: size, letterSpacing: "0.08em", color: cor, textShadow: SOMBRA }}>{texto}</Surge>;
const Titulo: React.FC<{ r: number; children: React.ReactNode; top: number; size?: number; cor?: string }> = ({ r, children, top, size = 92, cor = C.osso }) =>
  <Surge r={r} style={{ top, fontFamily: MONT, fontWeight: 800, fontSize: size, lineHeight: 1.02, letterSpacing: "0.02em", color: cor, textShadow: SOMBRA }}>{children}</Surge>;
// fita de isolamento policial atravessando a tela
const Fita: React.FC<{ r: number; y: number; rot: number; texto?: string }> = ({ r, y, rot, texto = "CENA DO CRIME · NÃO ULTRAPASSE · " }) => {
  const { t } = useT();
  const k = lin(t, o(r), o(r) + 0.5, Easing.out(Easing.cubic));
  if (k <= 0) return null;
  const desliza = (t - o(r)) * 40;
  return <div style={{ position: "absolute", left: -300, width: 1700, top: y, height: 70, background: C.fita, transform: `rotate(${rot}deg) translateX(${(1 - k) * -1700}px)`, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.6)", opacity: 0.92 }}>
    <div style={{ whiteSpace: "nowrap", fontFamily: MONT, fontWeight: 800, fontSize: 36, lineHeight: "70px", color: "#111", transform: `translateX(${-desliza}px)`, letterSpacing: "0.08em" }}>{texto.repeat(8)}</div>
  </div>;
};
// pegadas na neve: da floresta até a casa, nenhuma voltando
const Pegadas: React.FC<{ r: number }> = ({ r }) => {
  const { t } = useT();
  return <>{Array.from({ length: 12 }, (_, i) => {
    const at = o(r) + i * 0.22; const k = lin(t, at, at + 0.2);
    const x = 540 + (i % 2 ? 26 : -26) + Math.sin(i * 0.6) * 40, y = 330 + i * 62;
    return <div key={i} style={{ position: "absolute", left: x, top: y, width: 26, height: 44, borderRadius: "50% 50% 45% 45%", background: "rgba(10,10,11,0.75)", opacity: k * 0.9, transform: `rotate(${(i % 2 ? 8 : -8)}deg) scale(${0.6 + i * 0.04})`, boxShadow: "inset 0 2px 6px rgba(255,255,255,0.15)" }} />;
  })}</>;
};

// ── cartelas ─────────────────────────────────────────────────────────────
const Pergunta: React.FC<{ r: readonly [number, number] }> = ({ r }) => (
  <Cena r={r} fade={0.25}>
    <Fundo cor={C.preto} />
    <Surge r={r[0] + 0.15} dur={1.2} style={{ top: 720, fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 84, lineHeight: 1.15, color: C.osso }}>Onde você estava<br />naquela manhã?</Surge>
  </Cena>
);
const Cartela: React.FC = () => {
  const { t } = useT();
  const de = o(15.1) - 0.2, ate = o(15.9) - 0.05;
  if (t < de || t > ate + 0.3) return null;
  return <AbsoluteFill style={{ background: C.preto, opacity: lin(t, de, de + 0.2) * (1 - lin(t, ate, ate + 0.3)) }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, letterSpacing: "0.12em", color: C.osso }}>ÁLIBI</div>
      <div style={{ height: 3, width: 300, margin: "16px auto 26px", background: C.lacre }} />
      <div style={{ fontFamily: ELITE, fontSize: 40, color: C.osso, letterSpacing: "0.08em" }}><Datilo r={15.15} texto="CASO Nº 005" vel={18} /></div>
      <div style={{ fontFamily: ELITE, fontSize: 32, color: C.ossoE, marginTop: 14 }}><Datilo r={15.4} texto="ACHE A MENTIRA · Connecticut, EUA" vel={34} /></div>
    </div>
  </AbsoluteFill>;
};
const Capitulo: React.FC<{ r: number; n: string; titulo: string }> = ({ r, n, titulo }) => {
  const { t } = useT();
  const g = GAPS.find(([at]) => at === r)?.[1] ?? 1.4;
  const de = o(r) - 0.15, ate = o(r) + g - 0.1;
  if (t < de || t > ate + 0.25) return null;
  const k = lin(t, de, de + 0.5, Easing.out(Easing.cubic));
  return <AbsoluteFill style={{ background: C.preto, opacity: lin(t, de, de + 0.15) * (1 - lin(t, ate, ate + 0.25)) }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center" }}>
      <div style={{ fontFamily: COURIER, fontSize: 32, letterSpacing: "0.5em", color: C.ossoE }}>CAPÍTULO {n}</div>
      <div style={{ height: 3, width: 140 * k, margin: "22px auto", background: C.lacre }} />
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: titulo.length > 12 ? 78 : 96, letterSpacing: `${0.02 + 0.08 * k}em`, color: C.osso, opacity: k }}>{titulo}</div>
    </div>
  </AbsoluteFill>;
};

const Etiqueta: React.FC<{ r: number; texto: string }> = ({ r, texto }) => {
  const { t } = useT();
  const k = lin(t, o(r) - 0.05, o(r) + 0.4, Easing.out(Easing.cubic));
  if (k <= 0) return null;
  return <div style={{ padding: "8px 18px", background: "rgba(228,221,203,0.95)", color: C.tinta, fontFamily: COURIER, fontWeight: 700, fontSize: 28, opacity: k, transform: `translateY(${(1 - k) * 12}px)` }}>{texto}</div>;
};

const Marcador: React.FC<{ r: number; x: number; y: number; texto: string }> = ({ r, x, y, texto }) => {
  const { t } = useT();
  const k = lin(t, o(r), o(r) + 0.5, Easing.out(Easing.back(2)));
  if (k <= 0) return null;
  const pulso = (t - o(r)) % 1.4 / 1.4;
  return <div style={{ position: "absolute", left: x, top: y }}>
    <div style={{ position: "absolute", left: -60, top: -60, width: 120, height: 120, borderRadius: "50%", border: `4px solid ${C.lacre}`, transform: `scale(${0.4 + pulso})`, opacity: 1 - pulso }} />
    <div style={{ position: "absolute", left: -16, top: -16, width: 32, height: 32, borderRadius: "50%", background: C.lacre, transform: `scale(${k})`, boxShadow: "0 0 20px rgba(163,20,28,0.8)" }} />
    <div style={{ position: "absolute", left: 30, top: -24, padding: "6px 14px", background: C.preto, color: C.osso, fontFamily: COURIER, fontWeight: 700, fontSize: 28, whiteSpace: "nowrap", opacity: k }}>{texto}</div>
  </div>;
};

const Silhueta: React.FC = () => (
  <div style={{ width: 230, height: 290, background: "#CFC7B3", border: `3px solid ${C.tinta}`, position: "relative", overflow: "hidden", flexShrink: 0,
    backgroundImage: "repeating-linear-gradient(0deg, rgba(26,23,20,0.25) 0 2px, transparent 2px 36px)" }}>
    <svg viewBox="0 0 100 126" style={{ position: "absolute", left: 0, bottom: 0, width: "100%" }}><path d="M50 20 a20 22 0 1 1 0.1 0 Z M12 126 C14 92 30 80 50 80 C70 80 86 92 88 126 Z" fill="#2A2622" /></svg>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 6, textAlign: "center", fontFamily: COURIER, fontSize: 15, color: "#E4DDCB" }}>silhueta ilustrativa</div>
  </div>
);

// ── cenas ──
const Papel: React.FC<{ children: React.ReactNode; top?: number; h?: number; rot?: number }> = ({ children, top = 260, h = 900, rot = -1 }) => (
  <div style={{ position: "absolute", left: 80, right: 80, top, height: h, background: C.papel, padding: "44px 50px", boxSizing: "border-box", color: C.tinta, transform: `rotate(${rot}deg)`, boxShadow: "0 30px 80px rgba(0,0,0,0.8)" }}>{children}</div>
);
const Cabec: React.FC<{ sup: string; titulo: string; size?: number }> = ({ sup, titulo, size = 64 }) => <>
  <div style={{ fontFamily: COURIER, fontSize: 26, letterSpacing: "0.14em", opacity: 0.7 }}>{sup}</div>
  <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: size, marginTop: 8, lineHeight: 1.04 }}>{titulo}</div>
  <div style={{ height: 3, background: C.tinta, margin: "14px 0 26px", opacity: 0.6 }} />
</>;
const Linha: React.FC<{ r: number; texto: string; size?: number }> = ({ r, texto, size = 36 }) => <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: size, lineHeight: 1.55 }}><Datilo r={r} texto={texto} vel={40} /></div>;
const Grande: React.FC<{ r: number; children: React.ReactNode; top?: number; size?: number }> = ({ r, children, top = 760, size = 74 }) =>
  <Surge r={r} dur={1.0} style={{ top, fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: size, lineHeight: 1.15, color: C.osso, textShadow: SOMBRA }}>{children}</Surge>;
const Etiq: React.FC<{ r: number; top: number; texto: string }> = ({ r, top, texto }) => {
  const { t } = useT();
  const k = lin(t, o(r) - 0.05, o(r) + 0.4, Easing.out(Easing.cubic));
  if (k <= 0) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", opacity: k, transform: `translateY(${(1 - k) * 14}px)` }}>
    <div style={{ padding: "12px 26px", background: "rgba(228,221,203,0.95)", color: C.tinta, fontFamily: COURIER, fontWeight: 700, fontSize: 36 }}>{texto}</div>
  </div>;
};
const MapaRuas: React.FC = () => (
  <svg width="1080" height="1920" style={{ position: "absolute", left: 0, top: 0, opacity: 0.35 }}>
    {Array.from({ length: 14 }, (_, i) => <line key={"h" + i} x1="90" x2="990" y1={420 + i * 40} y2={430 + i * 38} stroke="#ECE7DC" strokeWidth={i % 4 === 0 ? 4 : 1.5} />)}
    {Array.from({ length: 16 }, (_, i) => <line key={"v" + i} y1="420" y2="960" x1={110 + i * 56} x2={120 + i * 55} stroke="#ECE7DC" strokeWidth={i % 5 === 0 ? 4 : 1.5} />)}
    <path d="M90 700 C 300 640, 500 820, 990 760" stroke="#ECE7DC" strokeWidth="9" fill="none" />
  </svg>
);

// ── cenas: formato interativo "ACHE A MENTIRA" ───────────────────────────
const Gancho: React.FC = () => (
  <>
    <Cena r={[0, 5.2]}>
      <Clip src="c42039" r0={0} zoom={[1.1, 1.2]} dur={5.2} />
      <Escuro a={0.55} />
      <Rotulo r={0.0} texto="ESSE HOMEM CONTOU UMA HISTÓRIA À POLÍCIA" top={330} cor={C.ossoE} size={28} />
      <Titulo r={2.46} top={420} size={84}>UMA COISA<br />NELA É <span style={{ color: "#E0353F" }}>IMPOSSÍVEL</span></Titulo>
    </Cena>
    <Cena r={[5.2, 12.6]}>
      <Fundo cor={C.preto} />
      <Rotulo r={5.3} texto="MODO DETETIVE" top={380} size={40} cor="#E0353F" />
      <Titulo r={5.6} top={460} size={64}>AS MESMAS PISTAS<br />DOS INVESTIGADORES</Titulo>
      <Grande r={8.82} top={760} size={72}>consegue achar a mentira<br />antes de mim?</Grande>
    </Cena>
  </>
);
const Versao: React.FC = () => (
  <>
    <Cena r={[15.9, 21.2]}>
      <Fundo />
      <Foto src="estrada" r={[15.9, 21.2]} credito="CT Route 140, Ellington · John Phelan · CC BY 4.0" top={380} h={620} zoom={[1.05, 1.18]} />
      <Titulo r={16.28} top={230} size={78}>23 · 12 · 2015</Titulo>
      <Rotulo r={19.14} texto="Ellington, Connecticut · EUA" top={1060} size={32} />
    </Cena>
    <Cena r={[21.2, 45.0]}>
      <Fundo />
      <Papel top={250} h={940} rot={-1}>
        <Cabec sup="DEPOIMENTO · RICHARD DABATE" titulo="A VERSÃO DELE" size={58} />
        <Linha r={w("mascarado") - 0.4} texto="— um homem mascarado invadiu a casa" size={32} />
        <Linha r={w("camuflada") - 0.3} texto="— roupa camuflada" size={32} />
        <Linha r={w("diesel") - 0.8} texto="— voz grave, “tipo Vin Diesel”" size={32} />
        <Linha r={w("connie") - 0.2} texto="— Connie chegou da academia" size={32} />
        <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 40, lineHeight: 1.55, color: C.lacre }}><Datilo r={w("9") - 0.2} texto="  ≈ 9h05" vel={20} /></div>
        <Linha r={w("porão") - 0.6} texto="— o invasor a seguiu até o porão" size={32} />
        <Linha r={w("amarrou") - 0.2} texto="— amarrou Richard e fugiu" size={32} />
      </Papel>
    </Cena>
  </>
);
const Pista: React.FC<{ r: number; n: string; titulo: string; children: React.ReactNode }> = ({ r, n, titulo, children }) => {
  const { f, fps } = useT();
  const k = sp(f, fps, r, { damping: 14, stiffness: 150 });
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", opacity: k, transform: `scale(${0.9 + 0.1 * k})` }}>
      <div style={{ display: "inline-block", padding: "10px 30px", border: `5px solid ${C.lacre}`, fontFamily: ELITE, fontSize: 60, color: "#E0353F", transform: "rotate(-3deg)" }}>PISTA {n}</div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 52, color: C.osso, marginTop: 24, textShadow: SOMBRA }}>{titulo}</div>
    </div>
    {children}
  </>;
};
const Pistas: React.FC = () => (
  <>
    <Cena r={[45.0, 53.1]}>
      <Clip src="c3317" r0={45.0} zoom={[1.1, 1.2]} dur={8} />
      <Escuro a={0.6} />
      <Pista r={47.82} n="1" titulo="FILHOS NA ESCOLA">
        <Rotulo r={51.08} texto="ninguém mais viu o invasor" top={560} size={36} />
      </Pista>
    </Cena>
    <Cena r={[53.1, 57.3]}>
      <Fundo />
      <Pista r={53.24} n="2" titulo="UM RELÓGIO FITNESS">
        <Foto src="fitbit" r={[53.1, 57.3]} credito="Fitbit Charge HR · Alexei Zverev · CC BY-SA 4.0" top={460} w={560} h={640} zoom={[1.1, 1.25]} />
      </Pista>
    </Cena>
    <Cena r={[57.3, 63.2]}>
      <Clip src="c47087" r0={57.3} zoom={[1.1, 1.2]} dur={6} />
      <Escuro a={0.6} />
      <Pista r={57.42} n="3" titulo="GARAGEM → PORÃO">
        <Titulo r={w("40") - 0.2} top={560} size={150}>≈ 40 m</Titulo>
      </Pista>
    </Cena>
    <Cena r={[63.2, 66.0]}>
      <Fundo cor={C.preto} />
      <Titulo r={63.3} top={560} size={96}>PAUSE AGORA</Titulo>
      <Grande r={64.32} top={760} size={70}>onde está a mentira?</Grande>
    </Cena>
  </>
);
// contagem regressiva em silêncio (o espectador pensa)
const Pausa: React.FC = () => {
  const { t } = useT();
  const s = t - PAUSA_T0;
  if (s < -0.1 || s > PAUSA_DUR + 0.2) return null;
  const n = Math.max(1, 5 - Math.floor(s / 0.8));
  const frac = (s % 0.8) / 0.8;
  const resumo = s < 4.0;
  return <AbsoluteFill style={{ background: C.preto }}>
    {resumo ? <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: COURIER, fontWeight: 700, fontSize: 30, letterSpacing: "0.2em", color: C.ossoE }}>PENSE…</div>
      <div style={{ position: "absolute", left: 340, top: 420, width: 400, height: 400 }}>
        <svg width="400" height="400"><circle cx="200" cy="200" r="180" stroke="rgba(236,231,220,0.15)" strokeWidth="10" fill="none" />
          <circle cx="200" cy="200" r="180" stroke="#E0353F" strokeWidth="10" fill="none" strokeDasharray={1131} strokeDashoffset={1131 * frac} transform="rotate(-90 200 200)" /></svg>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: MONT, fontWeight: 800, fontSize: 200, color: C.osso }}>{n}</div>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 900, fontFamily: COURIER, fontWeight: 700, fontSize: 30, color: C.osso, lineHeight: 1.6, textAlign: "center" }}>
        ≈ 9h05 · filhos na escola<br />relógio fitness · garagem→porão 40 m</div>
    </> : <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 88, color: C.osso, opacity: lin(t, PAUSA_T0 + 4.0, PAUSA_T0 + 4.3) }}>A VERDADE</div>}
  </AbsoluteFill>;
};
const Revelacao: React.FC = () => {
  const { t } = useT();
  const x = (h: number) => 120 + ((h - 9) / 1.25) * 840; // 9:00 → 10:15
  const prog = lin(t, o(70.4), o(80.5), Easing.linear);
  const barras = Array.from({ length: 40 }, (_, i) => 9 + 23 / 60 + i * (42 / 60) / 40);
  return <>
    <Cena r={[66.0, 86.1]}>
      <Fundo />
      <Foto src="fitbit-raiox" r={[66.0, 70.3]} credito="Fitbit Charge HR (raio-X) · SarahCartwright · CC BY-SA 2.0" top={380} h={560} zoom={[1.0, 1.15]} />
      {t < o(70.3) && <Titulo r={67.12} top={240} size={58}>O RELÓGIO REGISTROU<br />OUTRA HISTÓRIA</Titulo>}
      {t >= o(70.3) && <AbsoluteFill>
        <Fundo cor={C.preto} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", fontFamily: COURIER, fontWeight: 700, fontSize: 30, letterSpacing: "0.14em", color: C.ossoE }}>DADOS DO RELÓGIO DE CONNIE</div>
        <svg width="1080" height="1920" style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1="120" x2="960" y1="760" y2="760" stroke="rgba(236,231,220,0.5)" strokeWidth="3" />
          {[9, 9.25, 9.5, 9.75, 10, 10.25].map((h) => <g key={h}><line x1={x(h)} x2={x(h)} y1="760" y2="775" stroke="#ECE7DC" strokeWidth="2" />
            <text x={x(h)} y="810" fill="#9C978E" fontFamily="Courier" fontSize="24" textAnchor="middle">{`${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`}</text></g>)}
          {barras.map((h, i) => { const vis = (i / barras.length) < prog; const alt = 40 + 160 * Math.abs(Math.sin(i * 1.7)); return <rect key={i} x={x(h) - 6} y={760 - alt} width="12" height={alt} fill="#ECE7DC" opacity={vis ? 0.85 : 0} />; })}
          <line x1={x(9 + 5 / 60)} x2={x(9 + 5 / 60)} y1="480" y2="760" stroke="#E0353F" strokeWidth="5" strokeDasharray="12 8" />
          <text x={x(9 + 5 / 60) + 12} y="500" fill="#E0353F" fontFamily="Courier" fontWeight="700" fontSize="26">9h05 · segundo ele</text>
        </svg>
        <Rotulo r={70.42} texto="chegou em casa depois das 9h20" top={880} size={32} />
        <Rotulo r={75.1} texto="andou ≈ 370 m dentro de casa (não 40 m)" top={930} size={32} />
        <Rotulo r={78.16} texto="último movimento: 10h05" top={980} size={32} cor="#E0353F" />
        <Carimbo r={84.5} texto="MENTIRA" x={540} y={1130} rot={-8} size={96} />
      </AbsoluteFill>}
    </Cena>
  </>;
};
const Veredito: React.FC = () => (
  <>
    <Cena r={[86.1, 92.0]}>
      <Clip src="c4331" r0={86.1} zoom={[1.1, 1.2]} dur={6} />
      <Escuro a={0.55} />
      <Rotulo r={86.64} texto="OS INVESTIGADORES DESCOBRIRAM AINDA" top={330} cor={C.ossoE} size={28} />
      <Titulo r={w("amante") - 0.2} top={420} size={84}>UMA AMANTE</Titulo>
      <Rotulo r={w("grávida") - 0.3} texto="que estava grávida" top={560} size={36} cor="#E0353F" />
    </Cena>
    <Cena r={[92.0, 102.0]}>
      <Clip src="c46820" r0={92.0} zoom={[1.12, 1.2]} dur={10} />
      <Escuro a={0.5} />
      <Titulo r={93.38} top={300} size={150}>65 ANOS</Titulo>
      <Rotulo r={94.0} texto="condenado em 2022" top={480} size={34} />
      <Rotulo r={96.2} texto="Suprema Corte de Connecticut manteve (2025)" top={540} size={28} cor={C.ossoE} />
      <Rotulo r={99.64} texto="o relógio foi aceito como prova" top={1080} size={32} cor="#E0353F" />
    </Cena>
    <Cena r={[102.0, 110.2]}>
      <Fundo cor={C.preto} />
      <Grande r={102.14} top={560} size={62}>achou a mentira antes<br />da revelação?</Grande>
      <Titulo r={w("achei") - 0.2} top={820} size={110}>“ACHEI”</Titulo>
      <Rotulo r={107.7} texto="ou conta qual pista te enganou" top={980} size={32} />
    </Cena>
    <Cena r={[110.2, 115.5]}>
      <Clip src="c46898" r0={110.2} from={2} zoom={[1.3, 1.4]} dur={6} />
      <Escuro a={0.5} />
      <Surge r={110.26} dur={1.2} style={{ top: 640, fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 88, lineHeight: 1.15, color: C.osso, textShadow: SOMBRA }}>Onde você estava<br />naquela manhã?</Surge>
      <Surge r={113.64} style={{ top: 900, fontFamily: ELITE, fontSize: 46, color: C.ossoE, textShadow: SOMBRA }}>…e esse era o álibi.</Surge>
    </Cena>
  </>
);
const TelaFinal: React.FC = () => {
  const { f, fps, t } = useT();
  if (t < FINAL - 0.4) return null;
  const a = spT(f, fps, FINAL, { damping: 20, stiffness: 90 }), b = spT(f, fps, FINAL + 0.8), c = spT(f, fps, FINAL + 1.6);
  return <AbsoluteFill style={{ background: C.preto, opacity: lin(t, FINAL - 0.4, FINAL) }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", opacity: a, transform: `scale(${0.92 + 0.08 * a})` }}>
      <div style={{ width: 380, height: 380, borderRadius: "50%", overflow: "hidden", border: `2px solid rgba(236,231,220,0.3)` }}><Img src={staticFile("img/perfil.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 730, textAlign: "center", opacity: a }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 130, letterSpacing: "0.12em", color: C.osso }}>ÁLIBI</div>
      <div style={{ height: 3, width: 260, margin: "10px auto 20px", background: C.lacre }} />
      <div style={{ fontFamily: ELITE, fontSize: 34, color: C.ossoE, opacity: b }}>toda história tem um álibi.</div>
    </div>
    <div style={{ position: "absolute", left: 90, right: 90, top: 1090, textAlign: "center", padding: "26px 30px", border: `2px solid rgba(236,231,220,0.35)`, opacity: c }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.osso, lineHeight: 1.25 }}>Achou a mentira<br />antes da revelação?</div>
      <div style={{ fontFamily: ELITE, fontSize: 30, color: "#E0353F", marginTop: 12 }}>comenta “ACHEI” ↓</div>
    </div>
  </AbsoluteFill>;
};
const Hud: React.FC = () => {
  const { t } = useT();
  const v = lin(t, o(15.9), o(16.5)) * (1 - lin(t, FIM_VOZ - 0.2, FIM_VOZ + 0.3));
  if (v <= 0) return null;
  const s = Math.max(0, t - o(15.9));
  const tc = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}:${String(Math.floor((s % 1) * 30)).padStart(2, "0")}`;
  return <div style={{ position: "absolute", left: 60, right: 60, top: 150, display: "flex", justifyContent: "space-between", fontFamily: COURIER, fontWeight: 700, fontSize: 26, color: "rgba(236,231,220,0.7)", opacity: v }}>
    <span><span style={{ color: C.lacre, opacity: Math.floor(t * 1.5) % 2 ? 1 : 0.25 }}>●</span> REC {tc}</span><span>CASO Nº 005 · ACHE A MENTIRA</span>
  </div>;
};
const PAGES = (() => {
  const pages: { de: number; ate: number; ws: typeof WORDS }[] = [];
  let cur: typeof WORDS = [];
  WORDS.forEach((w, i) => {
    cur.push(w);
    if (/[.,?!]$/.test(w.text) || cur.length >= 3 || i === WORDS.length - 1) { pages.push({ de: cur[0].start, ate: 0, ws: cur }); cur = []; }
  });
  pages.forEach((p, i) => { p.ate = i < pages.length - 1 ? Math.min(pages[i + 1].de, p.ws[p.ws.length - 1].end + 0.6) : FIM_VOZ + 0.2; });
  return pages;
})();
const CHAVE = /^(impossível|mentira|mascarado|porão|relógio|fitness|metros|morta|amante|grávida|achei|álibi)$/i;
const Legenda: React.FC = () => {
  const { t } = useT();
  const pg = PAGES.find((p) => t >= p.de - 0.05 && t < p.ate);
  if (!pg || t > FIM_VOZ + 0.2) return null;
  return <div style={{ position: "absolute", left: 70, right: 170, top: 1340, display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: 16, rowGap: 4 }}>
    {pg.ws.map((w, i) => {
      const dita = t >= w.start - 0.03;
      const txt = w.text.replace(/[,;:]$/, "");
      const chave = CHAVE.test(txt.replace(/[.?!]$/, ""));
      return <span key={i} style={{ fontFamily: SANS, fontWeight: 800, fontSize: 54, lineHeight: 1.15, color: dita ? (chave ? "#E0353F" : C.osso) : "rgba(236,231,220,0.35)", textShadow: "0 3px 14px rgba(0,0,0,0.95), 0 0 2px #000" }}>{txt}</span>;
    })}
  </div>;
};
const Textura: React.FC = () => {
  const { f } = useT();
  return <>
    <svg width="0" height="0" style={{ position: "absolute" }}><filter id="gasto"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" /><feDisplacementMap in="SourceGraphic" scale="5" /></filter></svg>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,0.75) 100%)" }} />
    <AbsoluteFill style={{ opacity: 0.09, mixBlendMode: "overlay" }}>
      <svg width="1080" height="1920"><filter id="grao"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 30} /></filter><rect width="1080" height="1920" filter="url(#grao)" /></svg>
    </AbsoluteFill>
  </>;
};
const Sons: React.FC = () => (
  <>
    {TRECHOS.map(([a, b], i) => <Sequence key={"v" + i} from={q(o(a))} durationInFrames={q(b - a) + 1}><Audio src={staticFile("audio/voz.mp3")} startFrom={q(a)} endAt={q(b)} /></Sequence>)}
    <Audio src={staticFile("audio/trilha.mp3")} volume={(fr) => interpolate(fr, [0, 45, q(FIM_VOZ), q(FINAL + 0.5)], [0, 0.4, 0.4, 0.62], clamp) * interpolate(fr, [TOTAL - 50, TOTAL - 2], [1, 0], clamp)} />
    {SFX.map((s, i) => { const at = s.t ?? o(s.r ?? 0); return <Sequence key={i} from={Math.max(0, q(at))} durationInFrames={q(3.2)}><Audio src={staticFile(`audio/${s.src}.mp3`)} volume={(s.vol ?? 0.4) * SFX_GANHO} /></Sequence>; })}
  </>
);

export const Reel: React.FC = () => (
  <AbsoluteFill style={{ background: C.preto, overflow: "hidden" }}>
    <Gancho /><Pergunta r={[12.6, 15.05]} /><Versao /><Pistas /><Pausa /><Revelacao /><Veredito />
    <Legenda />
    <Cartela />
    {CAPITULOS.map(([r, n, ti]) => <Capitulo key={n} r={r} n={n} titulo={ti} />)}
    <Hud />
    <TelaFinal />
    <Textura />
    <Sons />
  </AbsoluteFill>
);
export { FPS };
