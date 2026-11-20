import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CAPITULOS, FIM_VOZ, FINAL, FPS, GAPS, SFX, TOTAL, TRECHOS, WORDS, o, q, w } from "./timeline";

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
  const de = o(17.4) - 0.2, ate = o(18.2) - 0.05;
  if (t < de || t > ate + 0.3) return null;
  return <AbsoluteFill style={{ background: C.preto, opacity: lin(t, de, de + 0.2) * (1 - lin(t, ate, ate + 0.3)) }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, letterSpacing: "0.12em", color: C.osso }}>ÁLIBI</div>
      <div style={{ height: 3, width: 300, margin: "16px auto 26px", background: C.lacre }} />
      <div style={{ fontFamily: ELITE, fontSize: 40, color: C.osso, letterSpacing: "0.08em" }}><Datilo r={17.45} texto="CASO Nº 004" vel={18} /></div>
      <div style={{ fontFamily: ELITE, fontSize: 32, color: C.ossoE, marginTop: 14 }}><Datilo r={17.7} texto="Realengo, Rio de Janeiro · 07/04/2011" vel={34} /></div>
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

const Gancho: React.FC = () => {
  const { t } = useT();
  return <>
    <Cena r={[0, 5.5]}>
      <Clip src="c3428" r0={0} zoom={[1.1, 1.2]} dur={5.5} />
      <Escuro a={0.5} />
      <Rotulo r={0.0} texto="8 DA MANHÃ" top={330} cor={C.ossoE} size={34} />
      <Titulo r={2.6} top={400} size={78}>UMA ESCOLA<br />NO RIO</Titulo>
    </Cena>
    <Cena r={[5.5, 10.0]}>
      <Fundo />
      <Foto src="escola" r={[5.5, 10.0]} credito="Escola Tasso da Silveira · Shana Reis/Gov. RJ · CC BY 3.0 BR" top={380} h={620} zoom={[1.05, 1.18]} />
      <Rotulo r={5.76} texto="“vim dar uma palestra”" top={270} size={36} />
      <Rotulo r={7.9} texto="ele tinha estudado ali" top={1060} cor={C.ossoE} size={32} />
    </Cena>
    <Cena r={[10.0, 14.9]}>
      <Clip src="c17426" r0={10.0} zoom={[1.1, 1.2]} dur={5} op={0.6} />
      <Escuro a={0.5} />
      <Rotulo r={10.1} texto="MINUTOS DEPOIS" top={420} cor={C.ossoE} size={34} />
      <Titulo r={w("doze") - 0.1} top={480} size={220}>12</Titulo>
      <Rotulo r={w("crianças") - 0.1} texto="CRIANÇAS MORTAS" top={760} size={42} cor="#E0353F" />
    </Cena>
  </>;
};
const AManha: React.FC = () => (
  <>
    <Cena r={[18.2, 21.3]}>
      <Fundo />
      <Foto src="placa" r={[18.2, 21.3]} credito="Placa de Realengo · Jos Henr · CC0" top={380} w={760} h={640} zoom={[1.05, 1.2]} />
      <Titulo r={18.86} top={240} size={78}>07 · 04 · 2011</Titulo>
    </Cena>
    <Cena r={[21.3, 28.2]}>
      <Fundo />
      <Foto src="escola2" r={[21.3, 28.2]} credito="Escola Tasso da Silveira · Agência Brasil · CC BY 3.0 BR" top={380} h={620} zoom={[1.05, 1.2]} />
      <Titulo r={w("escola", 1) - 0.1} top={210} size={50}>ESCOLA MUNICIPAL<br />TASSO DA SILVEIRA</Titulo>
      <Rotulo r={w("realengo") - 0.1} texto="Realengo · zona oeste do Rio" top={1050} size={32} />
      <Rotulo r={26.3} texto="uma quinta-feira comum de aula" top={1105} cor={C.ossoE} size={30} />
    </Cena>
    <Cena r={[28.2, 32.8]}>
      <Fundo cor={C.preto} />
      <Rotulo r={28.4} texto="SALAS DO 8º ANO" top={660} size={46} />
      <Rotulo r={w("fogo") - 0.2} texto="o ex-aluno abriu fogo" top={740} cor="#E0353F" size={36} />
    </Cena>
    <Cena r={[32.8, 37.0]}>
      <Clip src="c4331" r0={32.8} zoom={[1.15, 1.25]} dur={4.2} />
      <Escuro a={0.55} />
      <Grande r={32.92} top={560} size={66}>mas quase ninguém lembra<br />do que aconteceu</Grande>
      <Titulo r={w("fora") - 0.3} top={800} size={84}>DO LADO DE FORA</Titulo>
    </Cena>
  </>
);
const Rota: React.FC = () => {
  const { t } = useT();
  const k = lin(t, o(41.0), o(45.4), Easing.inOut(Easing.cubic));
  const L = 560;
  return <svg width="1080" height="1920" style={{ position: "absolute", left: 0, top: 0 }}>
    <path d="M 290 820 C 420 760, 520 720, 600 640 S 760 520, 820 470" stroke="#E0353F" strokeWidth="10" fill="none" strokeDasharray={L} strokeDashoffset={L * (1 - k)} strokeLinecap="round" />
  </svg>;
};
const LadoDeFora: React.FC = () => {
  const { t } = useT();
  return <>
    <Cena r={[37.0, 46.9]}>
      <Clip src="c42039" r0={37.0} zoom={[1.15, 1.25]} dur={10} op={0.7} />
      <Escuro a={0.6} />
      <Titulo r={w("menino") - 0.2} top={240} size={70}>UM MENINO FERIDO</Titulo>
      <Rotulo r={w("escapar") - 0.2} texto="conseguiu escapar" top={340} size={34} />
      <MapaRuas />
      <Rota />
      <Marcador r={38.6} x={290} y={820} texto="escola" />
      <Marcador r={44.6} x={820} y={470} texto="viatura da PM" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1000, textAlign: "center", fontFamily: COURIER, fontWeight: 700, fontSize: 44, color: C.osso, opacity: lin(t, o(41.2), o(41.8)), textShadow: SOMBRA }}>≈ 200 METROS</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1070, textAlign: "center", fontFamily: COURIER, fontSize: 20, color: C.ossoE, opacity: lin(t, o(41.2), o(41.8)) }}>mapa ilustrativo</div>
    </Cena>
    <Cena r={[46.9, 55.6]}>
      <Fundo />
      <Foto src="sargento" r={[46.9, 55.6]} credito="Sgt. Márcio Alves · Repórter Brasil/EBC · CC BY 2.5 BR" top={360} h={640} zoom={[1.1, 1.3]} pos="70% 35%" />
      <Rotulo r={47.02} texto="SARGENTO MÁRCIO ALEXANDRE ALVES" top={240} size={34} />
      <Rotulo r={47.6} texto="Polícia Militar do Rio de Janeiro" top={290} cor={C.ossoE} size={28} />
      <Rotulo r={w("ferido", 1) - 0.1} texto="ferido, o atirador tirou a própria vida" top={1060} cor={C.ossoE} size={28} />
    </Cena>
    <Cena r={[55.6, 61.5]}>
      <Fundo cor={C.preto} />
      <Grande r={55.7} top={600} size={70}>um menino.<br />um sargento.</Grande>
      <Rotulo r={w("impediram") - 0.1} texto="IMPEDIRAM QUE FOSSE AINDA MAIOR" top={850} size={36} cor="#E0353F" />
    </Cena>
  </>;
};
const Velas: React.FC = () => {
  const { t } = useT();
  return <div style={{ position: "absolute", left: 120, right: 120, top: 760, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", rowGap: 40 }}>
    {Array.from({ length: 12 }, (_, i) => { const on = lin(t, o(62.6) + i * 0.35, o(62.6) + i * 0.35 + 0.3); const tremor = 0.85 + 0.15 * Math.sin(t * 9 + i);
      return <div key={i} style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 18, height: 30, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 50% 70%, #FFF3C4, #F2A93B 60%, transparent 70%)", opacity: on * tremor, boxShadow: `0 0 ${30 * on}px rgba(242,169,59,0.7)` }} />
      </div>; })}
  </div>;
};
const OsDoze: React.FC = () => (
  <>
    <Cena r={[61.5, 72.7]}>
      <Clip src="c29425" r0={61.5} zoom={[1.1, 1.2]} dur={11} op={0.55} />
      <Escuro a={0.55} />
      <Titulo r={62.32} top={300} size={86}>12 ESTUDANTES</Titulo>
      <Rotulo r={w("entre") - 0.1} texto="entre 12 e 15 anos" top={450} size={36} />
      <Velas />
      <Rotulo r={w("meninas") - 0.3} texto="10 meninas · 2 meninos" top={1010} size={34} />
      <Rotulo r={w("outros") - 0.1} texto="e outros feridos" top={1065} cor={C.ossoE} size={30} />
    </Cena>
    <Cena r={[72.7, 78.0]}>
      <Fundo />
      <Foto src="escola2" r={[72.7, 78.0]} credito="Escola Tasso da Silveira · Agência Brasil · CC BY 3.0 BR" top={420} h={560} zoom={[1.25, 1.35]} pos="40% 70%" />
      <Grande r={72.8} top={230} size={58}>nada parecido dentro<br />de uma escola.</Grande>
    </Cena>
  </>
);
const OQueFicou: React.FC = () => (
  <>
    <Cena r={[78.0, 86.0]}>
      <Fundo />
      <Papel top={360} h={640} rot={-1}>
        <Cabec sup="LEI Nº 13.277 · 2016" titulo="7 DE ABRIL" size={80} />
        <Linha r={w("dia") - 0.1} texto="Dia Nacional de Combate" size={38} />
        <Linha r={w("dia") + 0.6} texto="ao Bullying e à Violência" size={38} />
        <Linha r={w("dia") + 1.4} texto="na Escola" size={38} />
        <Carimbo r={82.2} texto="EM MEMÓRIA" x={460} y={520} rot={-7} size={56} />
      </Papel>
    </Cena>
    <Cena r={[86.0, 90.8]}>
      <Fundo />
      <Papel top={480} h={420} rot={1}>
        <Cabec sup="LEI Nº 14.811 · 2024" titulo="BULLYING VIRA CRIME" size={60} />
        <Carimbo r={88.3} texto="CRIME" x={460} y={270} rot={-6} size={80} />
      </Papel>
    </Cena>
    <Cena r={[90.8, 99.4]}>
      <Clip src="c17426" r0={90.8} from={3} zoom={[1.15, 1.25]} dur={9} op={0.7} />
      <Escuro a={0.5} />
      <Grande r={94.2} top={520} size={62}>não pelo nome<br />de quem atirou.</Grande>
      <Titulo r={w("nomes") - 0.9} top={800} size={72}>MAS PELOS<br />12 NOMES QUE FICARAM</Titulo>
    </Cena>
    <Cena r={[99.4, 101.6]}>
      <Clip src="c6925" r0={99.4} zoom={[1.2, 1.3]} dur={3} />
      <Escuro a={0.45} />
      <Surge r={99.5} dur={1.0} style={{ top: 680, fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 84, lineHeight: 1.15, color: C.osso, textShadow: SOMBRA }}>Onde você estava<br />naquela manhã?</Surge>
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
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.osso, lineHeight: 1.25 }}>Você lembra onde<br />estava naquele dia?</div>
      <div style={{ fontFamily: ELITE, fontSize: 30, color: "#E0353F", marginTop: 12 }}>comenta ↓</div>
    </div>
  </AbsoluteFill>;
};
const Hud: React.FC = () => {
  const { t } = useT();
  const v = lin(t, o(18.2), o(18.8)) * (1 - lin(t, FIM_VOZ - 0.2, FIM_VOZ + 0.3));
  if (v <= 0) return null;
  const s = Math.max(0, t - o(18.2));
  const tc = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}:${String(Math.floor((s % 1) * 30)).padStart(2, "0")}`;
  return <div style={{ position: "absolute", left: 60, right: 60, top: 150, display: "flex", justifyContent: "space-between", fontFamily: COURIER, fontWeight: 700, fontSize: 26, color: "rgba(236,231,220,0.7)", opacity: v }}>
    <span><span style={{ color: C.lacre, opacity: Math.floor(t * 1.5) % 2 ? 1 : 0.25 }}>●</span> REC {tc}</span><span>CASO Nº 004</span>
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
const CHAVE = /^(palestra|mortas|fora|menino|avisou|maior|doze|meninas|meninos|lei|crime|nomes)$/i;
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
    <Gancho /><Pergunta r={[14.9, 17.25]} /><AManha /><LadoDeFora /><OsDoze /><OQueFicou />
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
