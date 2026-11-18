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
  const de = o(18.9) - 0.2, ate = o(19.6) - 0.05;
  if (t < de || t > ate + 0.3) return null;
  return <AbsoluteFill style={{ background: C.preto, opacity: lin(t, de, de + 0.2) * (1 - lin(t, ate, ate + 0.3)) }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, letterSpacing: "0.12em", color: C.osso }}>ÁLIBI</div>
      <div style={{ height: 3, width: 300, margin: "16px auto 26px", background: C.lacre }} />
      <div style={{ fontFamily: ELITE, fontSize: 40, color: C.osso, letterSpacing: "0.08em" }}><Datilo r={18.95} texto="CASO Nº 003" vel={18} /></div>
      <div style={{ fontFamily: ELITE, fontSize: 32, color: C.ossoE, marginTop: 14 }}><Datilo r={19.2} texto="Wichita, Kansas, EUA · 1974–2005" vel={34} /></div>
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

// ── cenas ────────────────────────────────────────────────────────────────
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

const Gancho: React.FC = () => (
  <>
    <Cena r={[0, 6.3]}>
      <Clip src="c42039" r0={0} zoom={[1.1, 1.2]} dur={6.3} />
      <Escuro a={0.5} />
      <Rotulo r={0.0} texto="VOCÊ JÁ OUVIU FALAR DELE" top={330} cor={C.ossoE} size={32} />
      <Titulo r={2.6} top={420} size={80}>MAS NÃO<br />DESSE DETALHE</Titulo>
    </Cena>
    <Cena r={[6.3, 10.2]}>
      <Clip src="c4331" r0={6.3} zoom={[1.1, 1.2]} dur={4} />
      <Escuro a={0.5} />
      <Titulo r={6.6} top={430} size={190}>31</Titulo>
      <Rotulo r={7.4} texto="ANOS FUGINDO DA POLÍCIA" top={660} size={40} />
    </Cena>
    <Cena r={[10.2, 15.6]}>
      <Clip src="c4331" r0={10.2} from={4} zoom={[1.2, 1.3]} dur={5.4} />
      <Escuro a={0.6} />
      <Rotulo r={10.4} texto="PRESO POR CAUSA DE" top={420} cor={C.ossoE} size={36} />
      <Titulo r={10.9} top={480} size={96}>UMA PERGUNTA</Titulo>
      <Grande r={13.5} top={780} size={60}>e ele acreditou<br />na resposta.</Grande>
    </Cena>
  </>
);
const HomemComum: React.FC = () => (
  <>
    <Cena r={[19.6, 24.44]}>
      <Fundo />
      <Foto src="wichita-noite" r={[19.6, 24.44]} credito="Wichita à noite · StarksWinter · CC BY-SA 4.0" top={360} h={680} zoom={[1.1, 1.25]} />
      <Titulo r={20.0} top={220} size={72}>WICHITA, KANSAS</Titulo>
      <Rotulo r={21.6} texto="uma cidade tranquila" top={1090} cor={C.ossoE} />
    </Cena>
    <Cena r={[24.44, 34.6]}>
      <Fundo />
      <Papel>
        <Cabec sup="PERFIL · O VIZINHO" titulo="DENNIS RADER" size={66} />
        <div style={{ display: "flex", gap: 28 }}>
          <Silhueta />
          <div>
            <Linha r={w("casado")} texto="— casado" />
            <Linha r={w("dois")} texto="— dois filhos" />
            <Linha r={w("presidente")} texto="— presidente do" />
            <Linha r={w("presidente") + 0.5} texto="  conselho da igreja" />
            <Linha r={w("líder")} texto="— líder de escoteiros" />
          </div>
        </div>
      </Papel>
    </Cena>
    <Cena r={[34.6, 41.1]}>
      <Clip src="c3428" r0={34.6} zoom={[1.1, 1.2]} dur={6.5} />
      <Escuro a={0.5} />
      <Etiq r={w("alarmes")} top={420} texto="instalador de alarmes de segurança" />
      <Etiq r={w("fiscal")} top={520} texto="fiscal da prefeitura" />
    </Cena>
    <Cena r={[41.1, 47.0]}>
      <Fundo />
      <Foto src="parkcity" r={[41.1, 47.0]} credito="Park City, Kansas · Staryu · CC0" top={360} h={640} zoom={[1.05, 1.18]} />
      <Rotulo r={41.4} texto="PARK CITY · ONDE ELE TRABALHAVA" top={270} cor={C.ossoE} />
      <Rotulo r={w("multava")} texto="multas: grama alta · cachorro solto" top={1060} size={32} />
    </Cena>
    <Cena r={[47.0, 51.8]}>
      <Fundo cor={C.preto} />
      <Rotulo r={47.08} texto="O ÁLIBI DELE:" top={640} cor={C.ossoE} size={40} />
      <Grande r={w("vida") - 0.3} top={720} size={96}>uma vida comum.</Grande>
    </Cena>
  </>
);
const Etiq: React.FC<{ r: number; top: number; texto: string }> = ({ r, top, texto }) => {
  const { t } = useT();
  const k = lin(t, o(r) - 0.05, o(r) + 0.4, Easing.out(Easing.cubic));
  if (k <= 0) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", opacity: k, transform: `translateY(${(1 - k) * 14}px)` }}>
    <div style={{ padding: "12px 26px", background: "rgba(228,221,203,0.95)", color: C.tinta, fontFamily: COURIER, fontWeight: 700, fontSize: 36 }}>{texto}</div>
  </div>;
};
const Assinatura: React.FC = () => {
  const { t } = useT();
  const anos = Math.round(interpolate(t, [o(88.2), o(93.0)], [1991, 2004], clamp));
  return <>
    <Cena r={[51.8, 59.1]}>
      <Fundo />
      <Foto src="wichita-skyline" r={[51.8, 59.1]} credito="Wichita · Andrea Allen · CC BY 2.0" top={360} h={460} zoom={[1.1, 1.3]} />
      <Titulo r={w("dez")} top={900} size={120}>10 VÍTIMAS</Titulo>
      <Rotulo r={w("dez") + 0.4} texto="1974 — 1991" top={1050} size={40} cor="#E0353F" />
    </Cena>
    <Cena r={[59.1, 63.3]}>
      <Fundo cor={C.preto} />
      <Grande r={59.3} top={640} size={70}>ele não queria só matar.</Grande>
      <Grande r={w("lembrado") - 0.4} top={800} size={82}>queria ser lembrado.</Grande>
    </Cena>
    <Cena r={[63.3, 71.2]}>
      <Clip src="c50726" r0={63.3} zoom={[1.1, 1.2]} dur={8} />
      <Escuro a={0.45} />
      <Rotulo r={63.5} texto="OUTUBRO · 1974" top={330} cor={C.ossoE} />
      <Titulo r={w("carta") - 0.1} top={400} size={66}>UMA CARTA<br />DENTRO DE UM LIVRO</Titulo>
      <Rotulo r={w("biblioteca")} texto="biblioteca pública de Wichita" top={620} size={34} />
    </Cena>
    <Cena r={[71.2, 77.0]}>
      <Clip src="c21333" r0={71.2} from={1} zoom={[1.15, 1.25]} dur={6} />
      <Escuro a={0.55} />
      <Rotulo r={72.4} texto="O APELIDO ESCOLHIDO POR ELE" top={330} cor={C.ossoE} size={32} />
      <Titulo r={75.6} top={420} size={210}>BTK</Titulo>
    </Cena>
    <Cena r={[77.0, 81.5]}>
      <Clip src="c21333" r0={77.0} from={6} zoom={[1.2, 1.28]} dur={4.5} />
      <Escuro a={0.55} />
      <Rotulo r={77.6} texto="cartas · poemas · para jornais e TVs" top={560} size={32} />
    </Cena>
    <Cena r={[81.5, 87.0]}>
      <Fundo />
      <Papel top={420} h={560} rot={1.5}>
        <div style={{ fontFamily: COURIER, fontSize: 24, letterSpacing: "0.14em", opacity: 0.7 }}>TRECHO DE CARTA · 1978 (TRADUÇÃO)</div>
        <div style={{ fontFamily: ELITE, fontSize: 48, lineHeight: 1.35, marginTop: 30 }}><Datilo r={83.04} texto="“Quantos eu preciso matar antes de ter o meu nome no jornal?”" vel={20} /></div>
      </Papel>
    </Cena>
    <Cena r={[87.0, 94.3]}>
      <Clip src="c3317" r0={87.0} zoom={[1.1, 1.25]} dur={7.3} />
      <Escuro a={0.5} />
      <Titulo r={88.2} top={420} size={170}>{anos}</Titulo>
      <Rotulo r={91.4} texto="13 ANOS DE SILÊNCIO" top={640} size={42} cor="#E0353F" />
    </Cena>
  </>;
};
const Volta: React.FC = () => {
  const { t } = useT();
  const pinos: [number, number, number, string][] = [[w("parques"), 330, 520, "parque"], [w("estradas"), 700, 640, "estrada"], [w("caçamba"), 480, 820, "caminhonete"]];
  return <>
    <Cena r={[94.3, 103.4]}>
      <Clip src="c41187" r0={94.3} zoom={[1.1, 1.2]} dur={9} op={0.6} />
      <Escuro a={0.5} />
      <Papel top={360} h={560} rot={-1.5}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 40, textAlign: "center", borderBottom: `3px double ${C.tinta}`, paddingBottom: 10 }}>JORNAL DE WICHITA · JAN 2004</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, lineHeight: 1.05, marginTop: 30, opacity: lin(t, o(99.3), o(100.0)) }}>Caso BTK:<br />30 anos sem solução</div>
        <div style={{ fontFamily: COURIER, fontSize: 22, marginTop: 24, opacity: 0.6 }}>manchete traduzida e reconstituída</div>
      </Papel>
    </Cena>
    <Cena r={[103.4, 112.5]}>
      <Fundo />
      <Papel top={380} h={520} rot={1}>
        <Cabec sup="CHEGOU NA REDAÇÃO" titulo="UMA CARTA" />
        <Linha r={w("documentos")} texto="— documentos de um crime de 1986" />
        <Linha r={w("ligado") - 0.3} texto="— nunca ligado ao BTK" />
      </Papel>
      <Grande r={w("voltado") - 0.4} top={1000} size={80}>ele tinha voltado.</Grande>
    </Cena>
    <Cena r={[112.5, 122.6]}>
      <Clip src="c50134" r0={112.5} zoom={[1.1, 1.2]} dur={10} />
      <Escuro a={0.6} />
      <Titulo r={w("mais", 0) - 0.1} top={260} size={74}>+10 MENSAGENS</Titulo>
      <MapaRuas />
      {pinos.map(([r, x, y, txt], i) => <Marcador key={i} r={r} x={x} y={y} texto={txt} />)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1000, textAlign: "center", fontFamily: COURIER, fontSize: 20, color: C.ossoE, opacity: lin(t, o(117.5), o(118)) }}>mapa ilustrativo</div>
    </Cena>
  </>;
};
const MapaRuas: React.FC = () => (
  <svg width="1080" height="1920" style={{ position: "absolute", left: 0, top: 0, opacity: 0.35 }}>
    {Array.from({ length: 14 }, (_, i) => <line key={"h" + i} x1="90" x2="990" y1={420 + i * 40} y2={430 + i * 38} stroke="#ECE7DC" strokeWidth={i % 4 === 0 ? 4 : 1.5} />)}
    {Array.from({ length: 16 }, (_, i) => <line key={"v" + i} y1="420" y2="960" x1={110 + i * 56} x2={120 + i * 55} stroke="#ECE7DC" strokeWidth={i % 5 === 0 ? 4 : 1.5} />)}
    <path d="M90 700 C 300 640, 500 820, 990 760" stroke="#ECE7DC" strokeWidth="9" fill="none" />
  </svg>
);
const APergunta: React.FC = () => {
  const { t } = useT();
  return <>
    <Cena r={[122.6, 130.8]}>
      <Fundo />
      <Foto src="disquetes" r={[122.6, 130.8]} credito="Drives de disquete · Swtpc6800 · domínio público" top={420} h={560} zoom={[1.1, 1.3]} />
      <Titulo r={w("dúvida") - 0.2} top={240} size={60}>DÁ PARA RASTREAR<br />UM DISQUETE?</Titulo>
    </Cena>
    <Cena r={[130.8, 136.3]}>
      <Fundo cor={C.preto} />
      <Grande r={131.0} top={600} size={62}>então ele fez o que<br />nenhum criminoso deveria.</Grande>
      <Titulo r={w("perguntou") - 0.1} top={860} size={70}>PERGUNTOU À POLÍCIA.</Titulo>
    </Cena>
    <Cena r={[136.3, 146.1]}>
      <Fundo />
      <Papel top={300} h={820} rot={-1}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 36, textAlign: "center", borderBottom: `3px double ${C.tinta}`, paddingBottom: 8 }}>CLASSIFICADOS</div>
        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          {[0, 1].map((c) => <div key={c} style={{ flex: 1 }}>{Array.from({ length: 9 }, (_, i) => <div key={i} style={{ height: 9, background: "rgba(0,0,0,0.18)", margin: "12px 0", width: `${70 + ((i * 29 + c * 13) % 30)}%` }} />)}</div>)}
        </div>
        <div style={{ marginTop: 26, border: `4px solid ${C.tinta}`, padding: "24px 20px", textAlign: "center", opacity: lin(t, o(142.0), o(142.4)), boxShadow: lin(t, o(142.2), o(142.8)) > 0.5 ? `0 0 0 8px rgba(163,20,28,0.5)` : "none" }}>
          <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 52 }}>REX, IT WILL BE OK</div>
          <div style={{ fontFamily: COURIER, fontSize: 28, marginTop: 10 }}>(“Rex, vai ficar tudo bem”)</div>
        </div>
        <div style={{ fontFamily: COURIER, fontSize: 20, marginTop: 20, opacity: 0.6 }}>texto real do anúncio · página reconstituída</div>
        <Carimbo r={144.56} texto="MENTIRA" x={460} y={560} rot={-12} size={110} />
      </Papel>
    </Cena>
    <Cena r={[146.1, 153.5]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A2240 0%, #0A0A0B 70%)" />
      <Disquete r={146.3} />
      <Rotulo r={146.5} texto="FEVEREIRO · 2005" top={260} cor={C.ossoE} />
      <Rotulo r={w("emissora") - 0.2} texto="enviado a uma emissora de TV" top={1060} size={34} />
      <Rotulo r={w("apagado") - 0.3} texto="dentro: um arquivo apagado" top={1120} cor="#E0353F" size={34} />
    </Cena>
    <Cena r={[153.5, 162.1]}>
      <Fundo cor={C.preto} />
      <div style={{ position: "absolute", left: 80, right: 80, top: 380, background: "#14161A", border: "2px solid #3A3F47", fontFamily: COURIER, color: C.osso, boxShadow: "0 30px 80px rgba(0,0,0,0.8)" }}>
        <div style={{ background: "#2A2F37", padding: "12px 20px", fontSize: 26, fontWeight: 700 }}>Propriedades do documento recuperado</div>
        <div style={{ padding: "26px 30px", fontSize: 36, lineHeight: 1.7 }}>
          <div>Tipo: documento de texto</div>
          <div><Datilo r={w("última")} texto="Última alteração por: " vel={40} /><span style={{ color: "#E0353F", fontWeight: 700, opacity: lin(t, o(w("dennis", 1)), o(w("dennis", 1) + 0.2)) }}>Dennis</span></div>
          <div><Datilo r={w("igreja", 1) - 0.1} texto="Organização: " vel={40} /><span style={{ color: "#E0353F", fontWeight: 700, opacity: lin(t, o(w("igreja", 1)), o(w("igreja", 1) + 0.3)) }}>Christ Lutheran Church</span></div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", fontFamily: COURIER, fontSize: 22, color: C.ossoE }}>reconstituição gráfica</div>
    </Cena>
    <Cena r={[162.1, 170.0]}>
      <Fundo cor={C.preto} />
      <div style={{ position: "absolute", left: 80, right: 80, top: 380, height: 90, borderRadius: 45, border: "2px solid #ECE7DC", display: "flex", alignItems: "center", padding: "0 34px", fontFamily: SANS, fontWeight: 600, fontSize: 36, color: C.osso }}>
        🔍&nbsp;<Datilo r={162.3} texto="Christ Lutheran Church Dennis" vel={22} /></div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 540, background: C.papel, color: C.tinta, padding: "30px 36px", opacity: lin(t, o(w("presidente", 1)), o(w("presidente", 1) + 0.4)) }}>
        <div style={{ fontFamily: COURIER, fontSize: 26, opacity: 0.7 }}>conselho da congregação</div>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 46, marginTop: 8 }}>Presidente: <span style={{ color: C.lacre }}>Dennis Rader</span></div>
      </div>
      <Grande r={w("dennis", 2) + 0.4} top={880} size={64}>o vizinho comum.</Grande>
    </Cena>
  </>;
};
const Disquete: React.FC<{ r: number }> = ({ r }) => {
  const { f, fps } = useT();
  const s = sp(f, fps, r, { damping: 14, stiffness: 110 });
  return <div style={{ position: "absolute", left: 290, top: 400, width: 500, height: 520, background: "linear-gradient(160deg, #6B4FA0, #3E2C66)", borderRadius: 16, transform: `rotate(${-8 + 8 * s}deg) scale(${0.7 + 0.3 * s})`, opacity: s, boxShadow: "0 40px 90px rgba(0,0,0,0.8)" }}>
    <div style={{ position: "absolute", left: 120, top: 0, width: 260, height: 150, background: "#B9BCC4", borderRadius: "0 0 8px 8px" }}><div style={{ position: "absolute", left: 170, top: 20, width: 50, height: 110, background: "#3E2C66" }} /></div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 230, bottom: 30, background: "#F2EFE6", borderRadius: 6, padding: 20, fontFamily: ELITE, fontSize: 30, color: "#333" }}>1.44 MB</div>
  </div>;
};
const Prova: React.FC = () => {
  const { t } = useT();
  const bandas = [0.1, 0.22, 0.31, 0.45, 0.52, 0.66, 0.74, 0.88];
  const cmp = lin(t, o(188.5), o(192.0));
  return <>
    <Cena r={[170.0, 178.5]}>
      <Fundo cor={C.preto} />
      <Grande r={170.6} top={600} size={72}>um nome não era prova.</Grande>
      <Titulo r={w("dna") - 0.1} top={800} size={110}>FALTAVA O DNA</Titulo>
    </Cena>
    <Cena r={[178.5, 188.0]}>
      <Fundo />
      <Papel top={330} h={700} rot={1}>
        <Cabec sup="LINHA DE INVESTIGAÇÃO" titulo="A FILHA DELE" />
        <Linha r={w("exame")} texto="— exame médico, anos antes" />
        <Linha r={w("clínica")} texto="— clínica da universidade" />
        <Linha r={w("ordem")} texto="— ordem judicial" />
        <Linha r={w("amostra") - 0.2} texto="— amostra obtida" />
      </Papel>
    </Cena>
    <Cena r={[188.0, 195.0]}>
      <Fundo cor={C.preto} />
      <div style={{ position: "absolute", left: 200, right: 200, top: 300, display: "flex", justifyContent: "space-between", fontFamily: COURIER, fontWeight: 700, fontSize: 30, color: C.ossoE }}><span>FILHA</span><span>CENA DO CRIME</span></div>
      {[0, 1].map((c) => <div key={c} style={{ position: "absolute", left: c ? 650 : 230, top: 360, width: 200, height: 600, border: "2px solid rgba(236,231,220,0.4)" }}>
        {bandas.map((b, i) => <div key={i} style={{ position: "absolute", left: 20, right: 20, top: `${b * 100}%`, height: 14, background: i % 3 === 0 && cmp > 0.5 ? "#E0353F" : C.osso, opacity: 0.85 }} />)}
      </div>)}
      {bandas.filter((_, i) => i % 3 === 0).map((b, i) => <div key={i} style={{ position: "absolute", left: 430, width: 220 * cmp, top: 360 + b * 600 + 6, height: 2, background: "#E0353F" }} />)}
      <Carimbo r={192.5} texto="PARENTESCO" x={540} y={1060} rot={-5} size={64} />
    </Cena>
    <Cena r={[195.0, 204.7]}>
      <Clip src="c49328" r0={195.0} zoom={[1.1, 1.2]} dur={10} />
      <Escuro a={0.35} />
      <Titulo r={195.3} top={300} size={92}>25 · 02 · 2005</Titulo>
      <Rotulo r={w("almoço") - 0.3} texto="voltando para casa no almoço" top={460} size={34} />
      <Carimbo r={w("preso", 1)} texto="PRESO" x={540} y={760} rot={-8} size={120} />
    </Cena>
    <Cena r={[204.7, 211.9]}>
      <Fundo />
      <Foto src="inverno" r={[204.7, 211.9]} credito="Paisagem de inverno · NARA · domínio público" top={360} h={600} zoom={[1.05, 1.15]} />
      <Rotulo r={205.0} texto="NAQUELE DIA" top={250} cor={C.ossoE} />
      <Rotulo r={w("fbi") - 0.2} texto="um agente do FBI bateu na porta da filha" top={1010} size={30} />
    </Cena>
  </>;
};
const OFim: React.FC = () => (
  <>
    <Cena r={[211.9, 223.7]}>
      <Fundo />
      <Foto src="tribunal" r={[211.9, 223.7]} credito="Fórum do condado de Sedgwick · FUBAR007 · CC0" top={330} w={640} h={760} zoom={[1.05, 1.2]} pos="50% 40%" />
      <Rotulo r={212.9} texto="JUNHO · 2005" top={240} cor={C.ossoE} />
      <Carimbo r={216.0} texto="CULPADO" x={540} y={1150} rot={-6} size={90} />
    </Cena>
    <Cena r={[223.7, 229.6]}>
      <Fundo cor={C.preto} />
      <Titulo r={w("condenado") - 0.1} top={560} size={190}>10</Titulo>
      <Rotulo r={w("condenado") + 0.4} texto="PRISÕES PERPÉTUAS CONSECUTIVAS" top={790} size={38} />
      <Grande r={w("nunca", 0) - 0.2} top={900} size={56}>ele nunca mais vai sair.</Grande>
    </Cena>
    <Cena r={[229.6, 236.0]}>
      <Fundo />
      <Papel top={420} h={520} rot={-1.5}>
        <Cabec sup="LIVRO · 2019" titulo="A FILHA DE UM ASSASSINO" size={52} />
        <Linha r={230.2} texto="Kerri Rawson" size={40} />
        <div style={{ fontFamily: COURIER, fontSize: 22, opacity: 0.6, marginTop: 20 }}>título original: “A Serial Killer's Daughter”</div>
      </Papel>
    </Cena>
    <Cena r={[236.0, 244.0]}>
      <Clip src="c42039" r0={236.0} from={6} zoom={[1.2, 1.3]} dur={8} />
      <Escuro a={0.55} />
      <Grande r={236.4} top={560} size={64}>31 anos atrás de<br />uma vida perfeita.</Grande>
      <Grande r={241.02} top={820} size={64}>e caiu porque <span style={{ color: "#E0353F" }}>confiou<br />na polícia.</span></Grande>
    </Cena>
    <Cena r={[244.0, 249.3]}>
      <Clip src="c46898" r0={244.0} from={2} zoom={[1.3, 1.4]} dur={6} />
      <Escuro a={0.5} />
      <Surge r={244.2} dur={1.2} style={{ top: 640, fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 88, lineHeight: 1.15, color: C.osso, textShadow: SOMBRA }}>Onde você estava<br />naquela noite?</Surge>
      <Surge r={247.48} style={{ top: 900, fontFamily: ELITE, fontSize: 46, color: C.ossoE, textShadow: SOMBRA }}>…e esse era o álibi.</Surge>
    </Cena>
  </>
);
// ── trecho inserido: o método (tempo de vídeo; sem detalhes gráficos) ──
const Metodo: React.FC = () => {
  const { f, fps, t } = useT();
  const t0 = INS_T0, fim = o(INS_RAW) - 0.15;
  if (t < t0 - 0.3 || t > fim + 0.3) return null;
  const s = t - t0;
  const op = lin(t, t0 - 0.3, t0) * (1 - lin(t, fim, fim + 0.3));
  const letra = (i: number, at: number, en: string, pt: string, ) => {
    const k = spT(f, fps, t0 + at, { damping: 14, stiffness: 160 });
    return <div key={i} style={{ flex: 1, textAlign: "center", opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 30}px)` }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 200, color: C.osso, lineHeight: 1 }}>{en[0]}</div>
      <div style={{ fontFamily: COURIER, fontSize: 26, color: C.ossoE, marginTop: 6 }}>{en}</div>
      <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 34, color: "#E0353F", marginTop: 8 }}>{pt}</div>
    </div>;
  };
  const linha = (at: number, txt: string) => <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 34, lineHeight: 1.55, opacity: lin(t, t0 + at - 0.05, t0 + at + 0.3) }}>{txt}</div>;
  return <AbsoluteFill style={{ opacity: op }}>
    {s < 5.9 && <AbsoluteFill>
      <Fundo cor={C.preto} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", fontFamily: COURIER, fontSize: 30, letterSpacing: "0.2em", color: C.ossoE, opacity: lin(t, t0, t0 + 0.5) }}>O QUE AS LETRAS SIGNIFICAVAM</div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 450, display: "flex" }}>
        {letra(0, 2.9, "BIND", "amarrar")}{letra(1, 3.8, "TORTURE", "torturar")}{letra(2, 4.7, "KILL", "matar")}
      </div>
    </AbsoluteFill>}
    {s >= 5.9 && s < 12.9 && <AbsoluteFill>
      <Fundo />
      <Papel top={360} h={620} rot={-1}>
        <Cabec sup="PERFIL CRIMINAL" titulo="O MÉTODO" />
        {linha(6.1, "— escolhia as vítimas antes")}
        {linha(8.5, "— observava por semanas")}
        {linha(10.6, "— chamava cada uma de")}
        <div style={{ position: "relative", height: 90 }}>
          <div style={{ position: "absolute", left: 120, top: 10, transform: "rotate(-6deg)", border: `7px solid ${C.lacre}`, padding: "4px 20px", fontFamily: ELITE, fontSize: 56, color: C.lacre,
            opacity: lin(t, t0 + 10.9, t0 + 11.05), transformOrigin: "center", scale: `${interpolate(lin(t, t0 + 10.9, t0 + 11.05), [0, 1], [2, 1])}` }}>“PROJETO”</div>
        </div>
      </Papel>
    </AbsoluteFill>}
    {s >= 12.9 && <AbsoluteFill>
      <Clip2 t0={t0 + 12.9} />
      <Escuro a={0.62} />
      <div style={{ position: "absolute", left: 90, right: 90, top: 330, color: C.osso, textShadow: SOMBRA }}>
        <div style={{ fontFamily: COURIER, fontSize: 28, letterSpacing: "0.16em", color: C.ossoE, marginBottom: 20 }}>PADRÃO DOS CRIMES</div>
        {linha(13.3, "✕ cortava a linha do telefone")}
        {linha(15.6, "✕ entrava na casa")}
        {linha(17.0, "✕ às vezes esperava lá dentro")}
        {linha(18.3, "✕ usava cordas")}
        {linha(20.8, "✕ a maioria: estrangulada")}
        {linha(22.7, "✕ levava objetos como “lembrança”")}
      </div>
    </AbsoluteFill>}
  </AbsoluteFill>;
};
const Clip2: React.FC<{ t0: number }> = ({ t0 }) => {
  const { t } = useT();
  const k = lin(t, t0, t0 + 14, Easing.linear);
  return <Sequence from={q(t0)} layout="none"><AbsoluteFill style={{ transform: `scale(${1.15 + 0.1 * k})` }}>
    <OffthreadVideo src={staticFile("v/c2026.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill></Sequence>;
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
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.osso, lineHeight: 1.25 }}>Você teria desconfiado<br />do vizinho?</div>
      <div style={{ fontFamily: ELITE, fontSize: 30, color: "#E0353F", marginTop: 12 }}>comenta ↓</div>
    </div>
  </AbsoluteFill>;
};
const Hud: React.FC = () => {
  const { t } = useT();
  const v = lin(t, o(19.6), o(20.2)) * (1 - lin(t, FIM_VOZ - 0.2, FIM_VOZ + 0.3));
  if (v <= 0) return null;
  const s = Math.max(0, t - o(19.6));
  const tc = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}:${String(Math.floor((s % 1) * 30)).padStart(2, "0")}`;
  return <div style={{ position: "absolute", left: 60, right: 60, top: 150, display: "flex", justifyContent: "space-between", fontFamily: COURIER, fontWeight: 700, fontSize: 26, color: "rgba(236,231,220,0.7)", opacity: v }}>
    <span><span style={{ color: C.lacre, opacity: Math.floor(t * 1.5) % 2 ? 1 : 0.25 }}>●</span> REC {tc}</span><span>CASO Nº 003</span>
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
const CHAVE = /^(polícia|resposta|álibi|comum|lembrado|biblioteca|silêncio|voltado|disquete|mentira|dennis|dna|filha|preso|culpado|perpétuas|confiou)$/i;
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
    <Gancho /><Pergunta r={[15.6, 18.75]} /><HomemComum /><Assinatura /><Metodo /><Volta /><APergunta /><Prova /><OFim />
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
