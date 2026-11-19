import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CAPITULOS, FIM_VOZ, FINAL, FPS, GAPS, INS_DUR, INS_RAW, INS_T0, SFX, TOTAL, TRECHOS, WORDS, o, q, w } from "./timeline";

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
    <Surge r={r[0] + 0.15} dur={1.2} style={{ top: 720, fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 84, lineHeight: 1.15, color: C.osso }}>Onde você estava<br />naquela noite?</Surge>
  </Cena>
);
const Cartela: React.FC = () => {
  const { t } = useT();
  const de = o(19.5) - 0.2, ate = o(20.4) - 0.05;
  if (t < de || t > ate + 0.3) return null;
  return <AbsoluteFill style={{ background: C.preto, opacity: lin(t, de, de + 0.2) * (1 - lin(t, ate, ate + 0.3)) }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, letterSpacing: "0.12em", color: C.osso }}>ÁLIBI</div>
      <div style={{ height: 3, width: 300, margin: "16px auto 26px", background: C.lacre }} />
      <div style={{ fontFamily: ELITE, fontSize: 40, color: C.osso, letterSpacing: "0.08em" }}><Datilo r={19.55} texto="CASO Nº 006" vel={18} /></div>
      <div style={{ fontFamily: ELITE, fontSize: 32, color: C.ossoE, marginTop: 14 }}><Datilo r={19.8} texto="Voo 305 · Portland → Seattle · 1971" vel={34} /></div>
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

// ── cenas: D. B. Cooper ──────────────────────────────────────────────────
const Contador: React.FC<{ r: number; ate: number; valor: number; prefixo?: string; top: number; size?: number }> = ({ r, ate, valor, prefixo = "US$ ", top, size = 150 }) => {
  const { t } = useT();
  const k = lin(t, o(r), o(ate), Easing.out(Easing.cubic));
  if (t < o(r) - 0.05) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: size, color: C.osso, textShadow: SOMBRA, fontVariantNumeric: "tabular-nums" }}>
    {prefixo}{Math.round(valor * k).toLocaleString("pt-BR")}</div>;
};
const Gancho: React.FC = () => (
  <>
    <Cena r={[-0.45, 6.9]} fade={0.02}>
      <Fundo />
      <Foto src="bilhete" r={[-0.4, 6.9]} credito="Bilhete do voo 305 · FBI · domínio público" top={420} w={1000} h={640} zoom={[1.55, 1.9]} pos="22% 62%" />
      <Titulo r={-1.2} top={250} size={68}>BILHETE REAL · 1971</Titulo>
      <Titulo r={2.32} top={1100} size={64}>“DAN COOPER”</Titulo>
      <Rotulo r={3.6} texto="pago em dinheiro" top={1190} size={30} cor="#E0353F" />
    </Cena>
    <Cena r={[6.9, 10.0]}>
      <Clip src="c7374" r0={6.9} zoom={[1.05, 1.15]} dur={3.2} />
      <Escuro a={0.45} />
      <Titulo r={7.2} top={420} size={88}>SEQUESTROU<br />O AVIÃO</Titulo>
    </Cena>
    <Cena r={[10.0, 12.1]}>
      <Fundo cor={C.preto} />
      <Contador r={10.1} ate={11.3} valor={200000} top={700} />
    </Cena>
    <Cena r={[12.1, 14.2]}>
      <Fundo cor="#0E0E10" />
      <Foto src="escada727" r={[12.1, 14.2]} credito="Boeing 727 · Anynobody · CC BY 2.5" top={560} w={980} h={520} cover={false} zoom={[1.0, 1.08]} />
      <Titulo r={12.2} top={360} size={72}>SALTOU DE<br />PARAQUEDAS</Titulo>
    </Cena>
    <Cena r={[14.2, 16.9]}>
      <Fundo />
      <Foto src="retrato" r={[14.2, 16.9]} credito="Retrato falado · FBI · domínio público" top={360} w={560} h={820} zoom={[1.0, 1.08]} />
      <Carimbo r={14.4} texto="NUNCA ENCONTRADO" x={540} y={1150} rot={-7} size={62} />
    </Cena>
  </>
);
const Passageiro: React.FC = () => (
  <>
    <Cena r={[20.4, 31.9]}>
      <Clip src="c4065" r0={20.4} zoom={[1.08, 1.18]} dur={11.5} />
      <Escuro a={0.5} />
      <Titulo r={21.18} top={300} size={84}>24 · 11 · 1971</Titulo>
      <Rotulo r={24.2} texto="véspera de Ação de Graças" top={430} size={34} />
      <Titulo r={w("voo") - 0.1} top={900} size={56}>VOO 305</Titulo>
      <Rotulo r={w("voo") + 0.6} texto="PORTLAND → SEATTLE" top={990} size={36} />
    </Cena>
    <Cena r={[31.9, 41.1]}>
      <Fundo />
      <Papel top={280} h={880} rot={-1}>
        <Cabec sup="DESCRIÇÃO DO PASSAGEIRO" titulo="“DAN COOPER”" size={58} />
        <div style={{ display: "flex", gap: 26 }}>
          <div style={{ width: 300, height: 420, flexShrink: 0, overflow: "hidden", border: `3px solid ${C.tinta}` }}>
            <Img src={staticFile("img/retrato-b.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 25%" }} />
          </div>
          <div>
            <Linha r={w("terno") - 0.1} texto="— terno escuro" size={32} />
            <Linha r={w("gravata") - 0.1} texto="— gravata preta" size={32} />
            <Linha r={w("óculos") - 0.1} texto="— óculos escuros" size={32} />
            <Linha r={w("fundo") - 0.2} texto="— fundo do avião" size={32} />
            <Linha r={w("bebida") - 0.3} texto="— pediu uma bebida" size={32} />
          </div>
        </div>
        <div style={{ fontFamily: COURIER, fontSize: 18, opacity: 0.6, marginTop: 14 }}>retrato falado do FBI · domínio público</div>
      </Papel>
    </Cena>
    <Cena r={[41.1, 50.6]}>
      <Fundo />
      <Papel top={380} h={620} rot={1.5}>
        <div style={{ fontFamily: COURIER, fontSize: 24, letterSpacing: "0.14em", opacity: 0.7 }}>O QUE ELE DISSE À COMISSÁRIA</div>
        <div style={{ fontFamily: ELITE, fontSize: 52, lineHeight: 1.35, marginTop: 34 }}><Datilo r={46.2} texto="“Senhorita, é melhor ler esse bilhete. Eu tenho uma bomba.”" vel={18} /></div>
        <div style={{ fontFamily: COURIER, fontSize: 20, opacity: 0.6, marginTop: 30 }}>fala relatada pela tripulação · tradução</div>
      </Papel>
      <Rotulo r={41.28} texto="ela guardou sem ler: achou que era cantada" top={240} cor={C.ossoE} size={28} />
    </Cena>
    <Cena r={[50.6, 55.2]}>
      <Fundo cor={C.preto} />
      <Titulo r={50.92} top={640} size={84}>DENTRO DA MALETA</Titulo>
      <Rotulo r={w("fios") - 0.1} texto="fios · cilindros vermelhos" top={880} size={40} cor="#E0353F" />
    </Cena>
  </>
);
const Exigencias: React.FC = () => (
  <>
    <Cena r={[55.2, 61.9]}>
      <Fundo />
      <Papel top={400} h={560} rot={-1.5}>
        <Cabec sup="EXIGÊNCIAS DO SEQUESTRADOR" titulo="O PREÇO" />
        <Linha r={57.2} texto="— US$ 200.000" size={44} />
        <Linha r={58.0} texto="  em notas de US$ 20" size={34} />
        <Linha r={w("paraquedas", 1) - 0.4} texto="— 4 paraquedas" size={44} />
      </Papel>
    </Cena>
    <Cena r={[61.9, 71.5]}>
      <Fundo />
      <Foto src="tripulacao" r={[61.9, 71.5]} credito="Tripulação do voo 305 · Marilyn Newton · domínio público" top={360} h={560} zoom={[1.05, 1.2]} />
      <Titulo r={61.96} top={220} size={60}>SEATTLE</Titulo>
      <Rotulo r={w("troca") - 0.1} texto="36 passageiros liberados" top={970} size={34} />
      <Rotulo r={67.32} texto="calmo · educado · pediu comida para a tripulação" top={1030} cor={C.ossoE} size={26} />
    </Cena>
    <Cena r={[71.5, 80.0]}>
      <Clip src="c7025" r0={71.5} zoom={[1.05, 1.15]} dur={8.5} />
      <Escuro a={0.45} />
      <Rotulo r={71.6} texto="DECOLAGEM · VOO BAIXO E LENTO" top={300} size={32} />
      <Titulo r={w("escada") - 0.3} top={900} size={72}>ESCADA TRASEIRA<br />ABERTA EM VOO</Titulo>
    </Cena>
  </>
);
const Salto: React.FC = () => {
  const { t } = useT();
  const linhas: [number, string][] = [[w("noite", 3) - 0.2, "de noite."], [w("chuva") - 0.2, "na chuva."], [w("frio") - 0.2, "no frio."], [w("sapato") - 0.2, "de sapato social."]];
  return <>
    <Cena r={[80.0, 87.3]}>
      <Clip src="c4695" r0={80.0} zoom={[1.08, 1.2]} dur={7.3} />
      <Escuro a={0.45} />
      <Rotulo r={80.74} texto="≈ 20H · FLORESTAS DE WASHINGTON" top={300} size={32} />
      <Titulo r={w("tranco") - 0.2} top={860} size={74}>UM TRANCO<br />NA CAUDA</Titulo>
    </Cena>
    <Cena r={[87.3, 93.1]}>
      <Clip src="c2717" r0={87.3} zoom={[1.1, 1.2]} dur={6} />
      <Escuro a={0.5} />
      <Titulo r={87.42} top={300} size={88}>ELE SALTOU.</Titulo>
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center" }}>
        {linhas.map(([r, txt], i) => <div key={i} style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 66, lineHeight: 1.3, color: i === 3 ? "#E0353F" : C.osso, textShadow: SOMBRA, opacity: lin(t, o(r), o(r) + 0.3) }}>{txt}</div>)}
      </div>
    </Cena>
    <Cena r={[93.1, 99.0]}>
      <Fundo cor={C.preto} />
      <Grande r={93.22} top={560} size={66}>o avião pousou.<br />ele não estava lá.</Grande>
      <Rotulo r={96.14} texto="deixou para trás só a gravata preta" top={820} size={34} cor="#E0353F" />
    </Cena>
  </>;
};
const Cacada: React.FC = () => (
  <>
    <Cena r={[99.0, 108.0]}>
      <Fundo />
      <Foto src="procurado" r={[99.0, 108.0]} credito="Cartaz do FBI · domínio público" top={300} w={560} h={900} zoom={[1.0, 1.2]} pos="50% 15%" />
      <Carimbo r={107.26} texto="NADA" x={540} y={1150} rot={-8} size={96} />
    </Cena>
    <Cena r={[108.0, 119.2]}>
      <Clip src="c43609" r0={108.0} zoom={[1.08, 1.18]} dur={11} />
      <Escuro a={0.45} />
      <Titulo r={108.12} top={300} size={110}>1980</Titulo>
      <Rotulo r={110.86} texto="um menino de 8 anos · rio Columbia" top={460} size={32} />
      <Contador r={116.4} ate={118.4} valor={5800} top={860} size={120} />
      <Rotulo r={117.6} texto="em notas podres, enterradas na areia" top={1010} size={30} />
    </Cena>
    <Cena r={[119.2, 123.4]}>
      <Fundo />
      <Foto src="dinheiro" r={[119.2, 123.4]} credito="Dinheiro do resgate encontrado · FBI · domínio público" top={420} h={620} zoom={[1.05, 1.2]} />
      <Carimbo r={121.0} texto="NÚMEROS BATEM" x={540} y={1110} rot={-6} size={64} />
    </Cena>
    <Cena r={[123.4, 126.6]}>
      <Fundo />
      <Foto src="mapa" r={[123.4, 126.6]} credito="Mapa do caso · webcyss · CC BY-SA 3.0" top={420} h={640} cover={false} zoom={[1.1, 1.25]} />
      <Rotulo r={123.44} texto="fora da rota do avião" top={300} size={38} cor="#E0353F" />
    </Cena>
  </>
);
const Pistas: React.FC = () => {
  const { t } = useT();
  const risco = lin(t, o(w("erro") - 0.2), o(w("erro") + 0.4));
  return <>
    <Cena r={[126.6, 141.0]}>
      <Fundo />
      <Papel top={330} h={760} rot={1}>
        <Cabec sup="ANÁLISE · 2017" titulo="A GRAVATA" />
        <Linha r={128.4} texto="— microscópio eletrônico" size={34} />
        <Linha r={w("partículas") - 0.2} texto="— partículas de titânio puro" size={34} />
        <Linha r={w("raro") - 0.2} texto="— material raro em 1971" size={34} />
        <Linha r={w("pista", 0) - 0.1} texto="→ trabalhava com aviões?" size={38} />
        <div style={{ fontFamily: COURIER, fontSize: 18, opacity: 0.6, marginTop: 20 }}>conclusão de pesquisadores independentes</div>
      </Papel>
    </Cena>
    <Cena r={[141.0, 155.25]}>
      <Fundo cor={C.preto} />
      <Rotulo r={141.22} texto="O DETALHE QUE QUASE NINGUÉM SABE" top={420} cor={C.ossoE} size={30} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 140, color: C.osso, opacity: lin(t, o(144.2), o(144.6)) }}>
        <span style={{ position: "relative", color: risco > 0.5 ? "#6A655C" : C.osso }}>D.B.<span style={{ position: "absolute", left: -10, top: "50%", height: 14, width: `${risco * 115}%`, background: "#E0353F", transform: "rotate(-6deg)" }} /></span> COOPER
      </div>
      <Titulo r={w("dan", 1) - 0.1} top={760} size={90}>DAN COOPER</Titulo>
      <Rotulo r={w("erro") - 0.2} texto="“D.B.” foi um erro da imprensa" top={900} size={34} cor="#E0353F" />
    </Cena>
  </>;
};
const SemFim: React.FC = () => (
  <>
    <Cena r={[155.4, 163.3]}>
      <Fundo />
      <Foto src="retrato" r={[155.4, 163.3]} credito="Retrato falado · FBI · domínio público" top={420} w={520} h={720} zoom={[1.0, 1.1]} />
      <Titulo r={156.06} top={230} size={84}>2016</Titulo>
      <Rotulo r={159.98} texto="FBI encerra a investigação ativa · 45 anos" top={1170} size={28} />
    </Cena>
    <Cena r={[163.3, 169.0]}>
      <Clip src="c6753" r0={163.3} zoom={[1.08, 1.15]} dur={6} />
      <Escuro a={0.5} />
      <Titulo r={163.38} top={400} size={64}>O ÚNICO SEQUESTRO<br />AÉREO NÃO RESOLVIDO</Titulo>
      <Rotulo r={167.1} texto="da aviação comercial americana" top={600} size={32} />
    </Cena>
    <Cena r={[169.0, 180.0]}>
      <Fundo />
      <Foto src="trava" r={[169.0, 180.0]} credito="Trava Cooper num Boeing 727 · Tank67 · domínio público" top={380} h={620} zoom={[1.05, 1.25]} />
      <Rotulo r={169.0} texto="por causa dele, os aviões ganharam isto" top={250} size={30} cor={C.ossoE} />
      <Titulo r={177.1} top={1060} size={84}>TRAVA COOPER</Titulo>
    </Cena>
    <Cena r={[180.0, 187.5]}>
      <Fundo />
      <Foto src="retrato-b" r={[180.0, 187.5]} credito="Retrato falado · FBI · domínio público" top={300} w={560} h={860} zoom={[1.0, 1.12]} />
      <Rotulo r={180.06} texto="morreu no salto?" top={1180} size={36} />
      <Rotulo r={181.98} texto="ou virou um vizinho qualquer?" top={1235} size={30} cor="#E0353F" />
    </Cena>
    <Cena r={[187.5, 193.2]}>
      <Clip src="c40102" r0={187.5} zoom={[1.1, 1.2]} dur={6} />
      <Escuro a={0.5} />
      <Surge r={187.66} dur={1.2} style={{ top: 640, fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 88, lineHeight: 1.15, color: C.osso, textShadow: SOMBRA }}>Onde você estava<br />naquela noite?</Surge>
      <Surge r={191.14} style={{ top: 900, fontFamily: ELITE, fontSize: 46, color: C.ossoE, textShadow: SOMBRA }}>…e esse era o álibi.</Surge>
    </Cena>
  </>
);
// ── inserção: D. B. Cooper na ficção (só texto, sem trechos das séries) ──
const NaFiccao: React.FC = () => {
  const { f, fps, t } = useT();
  const t0 = INS_T0 - 0.25, fim = o(INS_RAW) - 0.1;
  if (t < t0 - 0.3 || t > fim + 0.3) return null;
  const s = t - INS_T0;
  const op = lin(t, t0 - 0.3, t0) * (1 - lin(t, fim, fim + 0.3));
  const a = spT(f, fps, INS_T0 + 1.4, { damping: 14, stiffness: 140 }), b = spT(f, fps, INS_T0 + 11.1, { damping: 14, stiffness: 140 });
  const aparece = (at: number) => lin(t, INS_T0 + at - 0.05, INS_T0 + at + 0.35);
  return <AbsoluteFill style={{ opacity: op }}>
    <Fundo cor="radial-gradient(ellipse at 50% 40%, #1E1C26 0%, #0A0A0B 72%)" />
    <AbsoluteFill style={{ opacity: 0.18 }}><Img src={staticFile("img/retrato.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) blur(1px)" }} /></AbsoluteFill>
    <div style={{ position: "absolute", left: 0, right: 0, top: 260, textAlign: "center", fontFamily: COURIER, fontWeight: 700, fontSize: 30, letterSpacing: "0.2em", color: C.ossoE, opacity: aparece(0) }}>ELE VIROU LENDA</div>
    {s < 11.0 ? <div style={{ position: "absolute", left: 70, right: 70, top: 400, textAlign: "center", opacity: a, transform: `scale(${0.9 + 0.1 * a})` }}>
      <div style={{ fontFamily: COURIER, fontSize: 26, color: C.ossoE, letterSpacing: "0.12em" }}>NA SÉRIE</div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 120, color: C.osso, lineHeight: 1, marginTop: 10 }}>PRISON<br />BREAK</div>
      <div style={{ height: 3, width: 220, margin: "26px auto", background: C.lacre }} />
      <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 36, color: C.osso, opacity: aparece(3.6) }}>Charles Westmoreland,<br />o preso mais velho de Fox River</div>
      <div style={{ fontFamily: ELITE, fontSize: 46, color: "#E0353F", marginTop: 26, opacity: aparece(7.9) }}>“eu sou D. B. Cooper”</div>
    </div> : <div style={{ position: "absolute", left: 70, right: 70, top: 400, textAlign: "center", opacity: b, transform: `scale(${0.9 + 0.1 * b})` }}>
      <div style={{ fontFamily: COURIER, fontSize: 26, color: C.ossoE, letterSpacing: "0.12em" }}>MARVEL · DISNEY+</div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 150, color: C.osso, lineHeight: 1, marginTop: 10 }}>LOKI</div>
      <div style={{ height: 3, width: 220, margin: "26px auto", background: C.lacre }} />
      <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 36, color: C.osso, opacity: aparece(13.5) }}>o sequestrador do voo 305 era…</div>
      <div style={{ fontFamily: ELITE, fontSize: 50, color: "#E0353F", marginTop: 26, opacity: aparece(16.6) }}>o deus da trapaça</div>
    </div>}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1170, textAlign: "center", fontFamily: COURIER, fontSize: 20, color: C.ossoE }}>referências de ficção</div>
  </AbsoluteFill>;
};

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
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.osso, lineHeight: 1.25 }}>Ele sobreviveu<br />ao salto?</div>
      <div style={{ fontFamily: ELITE, fontSize: 30, color: "#E0353F", marginTop: 12 }}>comenta: VIVO ou MORTO ↓</div>
    </div>
  </AbsoluteFill>;
};
const Hud: React.FC = () => {
  const { t } = useT();
  const v = lin(t, o(20.4), o(21.0)) * (1 - lin(t, FIM_VOZ - 0.2, FIM_VOZ + 0.3));
  if (v <= 0) return null;
  const s = Math.max(0, t - o(20.4));
  const tc = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}:${String(Math.floor((s % 1) * 30)).padStart(2, "0")}`;
  return <div style={{ position: "absolute", left: 60, right: 60, top: 150, display: "flex", justifyContent: "space-between", fontFamily: COURIER, fontWeight: 700, fontSize: 26, color: "rgba(236,231,220,0.7)", opacity: v }}>
    <span><span style={{ color: C.lacre, opacity: Math.floor(t * 1.5) % 2 ? 1 : 0.25 }}>●</span> REC {tc}</span><span>CASO Nº 006</span>
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
const CHAVE = /^(encontrado|bomba|paraquedas|saltado|gravata|nada|sequestro|titânio|erro|cooper|álibi|frio|lenda|loki|trapaça)$/i;
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
    <Sequence from={q(INS_T0)}><Audio src={staticFile("audio/insercao.mp3")} /></Sequence>
    {SFX.map((s, i) => { const at = s.t ?? o(s.r ?? 0); return <Sequence key={i} from={Math.max(0, q(at))} durationInFrames={q(3.2)}><Audio src={staticFile(`audio/${s.src}.mp3`)} volume={(s.vol ?? 0.4) * SFX_GANHO} /></Sequence>; })}
  </>
);

export const Reel: React.FC = () => (
  <AbsoluteFill style={{ background: C.preto, overflow: "hidden" }}>
    <Gancho /><Pergunta r={[16.9, 19.45]} /><Passageiro /><Exigencias /><Salto /><Cacada /><Pistas /><NaFiccao /><SemFim />
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
