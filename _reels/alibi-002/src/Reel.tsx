import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CAPITULOS, FIM_VOZ, FINAL, FPS, GAPS, SFX, TOTAL, TRECHOS, WORDS, o, q } from "./timeline";

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
  const de = o(27.4) - 0.2, ate = o(28.3) - 0.05;
  if (t < de || t > ate + 0.3) return null;
  return <AbsoluteFill style={{ background: C.preto, opacity: lin(t, de, de + 0.2) * (1 - lin(t, ate, ate + 0.3)) }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, letterSpacing: "0.12em", color: C.osso }}>ÁLIBI</div>
      <div style={{ height: 3, width: 300, margin: "16px auto 26px", background: C.lacre }} />
      <div style={{ fontFamily: ELITE, fontSize: 40, color: C.osso, letterSpacing: "0.08em" }}><Datilo r={27.45} texto="CASO Nº 002" vel={18} /></div>
      <div style={{ fontFamily: ELITE, fontSize: 32, color: C.ossoE, marginTop: 14 }}><Datilo r={27.7} texto="Baviera, Alemanha · 31/03/1922" vel={34} /></div>
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

// ── cenas ────────────────────────────────────────────────────────────────
const Gancho: React.FC = () => {
  const { t } = useT();
  return <>
    <Cena r={[0, 9.4]}>
      <Clip src="c3350" r0={0} zoom={[1.15, 1.3]} dur={9.4} />
      <Escuro a={0.45} />
      <Rotulo r={0.0} texto="DIAS ANTES DO CRIME" top={230} cor={C.ossoE} size={32} />
      <Titulo r={0.9} top={300} size={88}>PEGADAS<br />NA NEVE</Titulo>
      <Pegadas r={4.6} />
    </Cena>
    <Cena r={[9.4, 13.9]}>
      <Clip src="c2489" r0={9.4} from={4} zoom={[1.2, 1.3]} dur={4.5} />
      <Escuro a={0.55} />
      <Titulo r={9.8} top={560} size={84}>PASSOS<br />NO SÓTÃO</Titulo>
    </Cena>
    <Cena r={[13.9, 24.5]}>
      <Fundo />
      <Foto src="hof" r={[13.9, 24.5]} credito="Hinterkaifeck, 1922 · domínio público" top={330} h={700} zoom={[1.0, 1.12]} />
      <Fita r={14.3} y={290} rot={-7} />
      <Fita r={14.6} y={1000} rot={5} />
      <Rotulo r={15.6} texto="31 · 03 · 1922" top={1095} size={44} />
      {t > o(20.7) && <Surge r={20.72} style={{ top: 200, fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 56, color: C.osso, textShadow: SOMBRA }}>o assassino ficou. <span style={{ color: "#E0353F" }}>por dias.</span></Surge>}
    </Cena>
  </>;
};
const Familia: React.FC = () => {
  const linhas: [number, string, string][] = [[35.0, "ANDREAS GRUBER", "63"], [37.9, "CÄZILIA GRUBER", "72"], [41.0, "VIKTORIA GABRIEL", "35"], [45.7, "CÄZILIA", "7"], [47.9, "JOSEF", "2"]];
  return <>
    <Cena r={[28.3, 34.5]}>
      <Fundo />
      <Foto src="mapa" r={[28.3, 34.5]} credito="Mapa cadastral, após 1870 · domínio público" top={300} h={820} zoom={[1.0, 1.25]} pos="40% 55%" />
      <Marcador r={29.6} x={470} y={760} texto="HINTERKAIFECK" />
      <Rotulo r={31.6} texto="≈ 70 km ao norte de Munique" top={1155} size={34} />
    </Cena>
    <Cena r={[34.5, 49.6]}>
      <Fundo />
      <Foto src="inscricao" r={[34.5, 49.6]} credito="Inscrição no memorial · Christian Greller · CC BY 2.0" top={240} w={600} h={860} pan={[25, 85]} zoom={[1.15, 1.15]} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 1130, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
        {linhas.map(([r, nome, idade], i) => <Etiqueta key={i} r={r} texto={`${nome}, ${idade}`} />)}
      </div>
    </Cena>
    <Cena r={[49.6, 58.0]}>
      <Fundo />
      <Foto src="brummer" r={[49.6, 58.0]} credito="Depoimento sobre a morte de Karl Gabriel · B. Mücke · CC BY-SA 4.0" top={300} h={700} zoom={[1.05, 1.2]} pos="30% 40%" />
      <Rotulo r={49.9} texto="KARL GABRIEL · marido de Viktoria" top={1040} size={34} />
      <Rotulo r={55.34} texto="corpo nunca encontrado" top={1100} cor="#E0353F" size={34} />
    </Cena>
  </>;
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
const Sinais: React.FC = () => {
  const itens: [number, string][] = [[72.14, "pegadas na neve"], [73.6, "passos no sótão"], [75.56, "jornal de Munique que ninguém comprou"], [78.88, "chaves da casa desaparecidas"]];
  return <>
    <Cena r={[58.0, 66.6]}>
      <Clip src="c2632" r0={58.0} zoom={[1.1, 1.2]} dur={8.6} />
      <Escuro a={0.5} />
      <Rotulo r={58.9} texto="SEIS MESES ANTES" top={300} cor={C.ossoE} />
      <Titulo r={59.6} top={370} size={72}>A EMPREGADA<br />FOI EMBORA</Titulo>
      <Surge r={63.4} style={{ top: 980, fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 66, color: C.osso, textShadow: SOMBRA }}>“a casa é assombrada.”</Surge>
    </Cena>
    <Cena r={[66.6, 85.1]}>
      <Fundo />
      <div style={{ position: "absolute", left: 80, right: 80, top: 260, height: 900, background: C.papel, padding: "46px 50px", boxSizing: "border-box", color: C.tinta, transform: "rotate(-1deg)", boxShadow: "0 30px 80px rgba(0,0,0,0.8)" }}>
        <div style={{ fontFamily: COURIER, fontSize: 26, letterSpacing: "0.14em", opacity: 0.7 }}>RELATOS DE ANDREAS GRUBER · MARÇO 1922</div>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 70, marginTop: 10 }}>OS SINAIS</div>
        <div style={{ height: 3, background: C.tinta, margin: "14px 0 30px", opacity: 0.6 }} />
        {itens.map(([r, txt], i) => <div key={i} style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 40, lineHeight: 1.6 }}><Datilo r={r} texto={`☐ ${txt}`} vel={40} /></div>)}
        <Carimbo r={81.92} texto="NINGUÉM CHAMOU A POLÍCIA" x={460} y={720} rot={-6} size={44} />
      </div>
    </Cena>
    <Cena r={[85.1, 95.0]}>
      <Clip src="c3317" r0={85.1} zoom={[1.1, 1.2]} dur={10} />
      <Escuro a={0.55} />
      <Rotulo r={85.34} texto="31 DE MARÇO · À TARDE" top={300} cor={C.ossoE} />
      <Titulo r={89.46} top={380} size={76}>MARIA<br />BAUMGARTNER, 44</Titulo>
      <Rotulo r={89.9} texto="nova empregada · primeiro dia" top={600} size={34} />
      <Surge r={92.42} style={{ top: 1000, fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 62, color: C.osso, textShadow: SOMBRA }}>não passou da primeira noite.</Surge>
    </Cena>
  </>;
};
const Noite: React.FC = () => (
  <>
    <Cena r={[95.0, 104.2]}>
      <Clip src="c2634" r0={95.0} zoom={[1.1, 1.25]} dur={9.2} />
      <Escuro a={0.55} />
      <Rotulo r={95.7} texto="SEGUNDO A INVESTIGAÇÃO" top={300} cor={C.ossoE} />
      <Titulo r={97.62} top={370} size={84}>4 VÍTIMAS<br />NO CELEIRO</Titulo>
      <Rotulo r={98.8} texto="atraídas uma a uma" top={590} size={36} />
      <Titulo r={101.68} top={900} size={60}>DEPOIS, A CASA.</Titulo>
    </Cena>
    <Cena r={[104.2, 115.6]}>
      <Fundo cor={C.preto} />
      <Surge r={104.34} style={{ top: 330, fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 88, color: C.osso }}>ninguém escapou.</Surge>
      <Foto src="expo11" r={[105.5, 115.6]} credito="Anotação policial · B. Mücke · CC BY-SA 4.0" top={500} w={620} h={560} rot={2} zoom={[1.1, 1.25]} pos="50% 30%" />
      <Rotulo r={105.6} texto="A ARMA: UMA ENXADA (REUTHAUE)" top={1110} size={32} />
      <Rotulo r={109.84} texto="achada em 1923 · escondida no sótão" top={1165} cor="#E0353F" size={30} />
    </Cena>
  </>
);
const Depois: React.FC = () => {
  const { t } = useT();
  const itens: [number, string][] = [[122.66, "animais alimentados"], [124.66, "comida consumida"], [126.84, "fumaça na chaminé"]];
  const dias = Math.max(0, Math.min(4, Math.floor((t - o(131.0)) / 0.8) + 1));
  return <>
    <Cena r={[115.6, 130.0]}>
      <Clip src="c50861" r0={115.6} zoom={[1.1, 1.25]} dur={14} />
      <Clip src="c50957" r0={115.6} zoom={[1.0, 1.1]} dur={14} op={0.35} />
      <Escuro a={0.45} />
      <Titulo r={119.24} top={300} size={66}>ALGUÉM CONTINUOU<br />NA FAZENDA</Titulo>
      <div style={{ position: "absolute", left: 140, right: 140, top: 640 }}>
        {itens.map(([r, txt], i) => <div key={i} style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 42, color: C.osso, textShadow: SOMBRA, lineHeight: 1.7, opacity: lin(t, o(r) - 0.05, o(r) + 0.4) }}>✕ {txt}</div>)}
      </div>
    </Cena>
    <Cena r={[130.0, 137.2]}>
      <Fundo cor={C.preto} />
      <div style={{ position: "absolute", left: 90, right: 90, top: 420, display: "flex", gap: 18 }}>
        {["31 MAR", "01 ABR", "02 ABR", "03 ABR", "04 ABR"].map((d, i) => {
          const on = t >= o(130.6) + i * 0.8;
          return <div key={i} style={{ flex: 1, height: 200, border: `3px solid ${i === 4 && on ? C.lacre : "rgba(236,231,220,0.5)"}`, display: "grid", placeItems: "center", fontFamily: COURIER, fontWeight: 700, fontSize: 30,
            color: i === 4 && on ? "#E0353F" : C.osso, opacity: on ? 1 : 0.2, background: on && i < 4 ? "rgba(236,231,220,0.06)" : "transparent" }}>{d}</div>;
        })}
      </div>
      <Titulo r={131.0} top={700} size={120}>{dias} {dias === 1 ? "DIA" : "DIAS"}</Titulo>
      <Rotulo r={134.9} texto="até os vizinhos entrarem" top={880} size={36} />
    </Cena>
  </>;
};
const Vizinho: React.FC = () => {
  const pontos: [number, string][] = [[141.46, "relacionamento com Viktoria"], [143.6, "dizia ser o pai de Josef"], [148.92, "conhecia a casa"], [151.0, "mexeu nos corpos"]];
  return <>
    <Cena r={[137.2, 155.0]}>
      <Fundo />
      <div style={{ position: "absolute", left: 80, right: 80, top: 250, height: 920, background: C.papel, padding: "40px 46px", boxSizing: "border-box", color: C.tinta, transform: "rotate(1deg)", boxShadow: "0 30px 80px rgba(0,0,0,0.8)" }}>
        <div style={{ fontFamily: COURIER, fontSize: 26, letterSpacing: "0.14em", opacity: 0.7 }}>FICHA · SUSPEITO</div>
        <div style={{ display: "flex", gap: 30, marginTop: 20, alignItems: "center" }}>
          <Silhueta />
          <div>
            <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 56, lineHeight: 1.02 }}>LORENZ<br />SCHLITTEN-<br />BAUER</div>
            <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 28, marginTop: 12 }}>vizinho · encontrou os corpos</div>
          </div>
        </div>
        <div style={{ marginTop: 36, borderTop: `2px dashed ${C.tinta}`, paddingTop: 24 }}>
          {pontos.map(([r, txt], i) => <div key={i} style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 36, lineHeight: 1.55 }}><Datilo r={r} texto={`— ${txt}`} vel={38} /></div>)}
        </div>
      </div>
    </Cena>
    <Cena r={[155.0, 162.0]}>
      <Fundo />
      <Foto src="depoimento" r={[155.0, 162.0]} credito="Depoimento de L. Schlittenbauer · B. Mücke · CC BY-SA 4.0" top={330} h={620} zoom={[1.6, 2.0]} pos="15% 45%" />
      <Rotulo r={157.68} texto="O DEPOIMENTO ORIGINAL" top={250} cor={C.ossoE} />
      <Carimbo r={159.6} texto="NUNCA ACUSADO" x={540} y={1060} rot={-5} size={64} />
    </Cena>
    <Cena r={[162.0, 172.5]}>
      <Fundo />
      <Foto src="expo03" r={[162.0, 172.5]} credito="Cartaz da polícia de Munique · B. Mücke · CC BY-SA 4.0" top={260} w={720} h={860} zoom={[1.05, 1.25]} pos="50% 30%" />
      <Rotulo r={162.22} texto="OUTROS SUSPEITOS" top={190} cor={C.ossoE} />
      <Carimbo r={171.3} texto="NÃO FOI ROUBO" x={540} y={1050} rot={-7} size={60} />
      <Rotulo r={168.64} texto="o dinheiro da casa estava intacto" top={1150} size={30} />
    </Cena>
    <Cena r={[172.5, 179.6]}>
      <Fundo />
      <Foto src="expo15" r={[172.5, 179.6]} credito="Documento da polícia de Munique, 1922 · B. Mücke · CC BY-SA 4.0" top={280} w={720} h={760} zoom={[1.1, 1.3]} pos="50% 25%" />
      <Titulo r={172.6} top={1080} size={56}>RECOMPENSA: 100.000 MARCOS</Titulo>
      <Rotulo r={176.16} texto="até videntes foram consultados. nada." top={1175} cor="#E0353F" size={30} />
    </Cena>
  </>;
};
const Silhueta: React.FC = () => (
  <div style={{ width: 230, height: 290, background: "#CFC7B3", border: `3px solid ${C.tinta}`, position: "relative", overflow: "hidden", flexShrink: 0,
    backgroundImage: "repeating-linear-gradient(0deg, rgba(26,23,20,0.25) 0 2px, transparent 2px 36px)" }}>
    <svg viewBox="0 0 100 126" style={{ position: "absolute", left: 0, bottom: 0, width: "100%" }}><path d="M50 20 a20 22 0 1 1 0.1 0 Z M12 126 C14 92 30 80 50 80 C70 80 86 92 88 126 Z" fill="#2A2622" /></svg>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 6, textAlign: "center", fontFamily: COURIER, fontSize: 15, color: "#E4DDCB" }}>silhueta ilustrativa</div>
  </div>
);
const Fim: React.FC = () => {
  const { t } = useT();
  const some = lin(t, o(181.5), o(184.2));
  return <>
    <Cena r={[179.6, 185.0]}>
      <Fundo cor={C.preto} />
      <div style={{ opacity: 1 - some }}><Foto src="hof" r={[179.6, 185.0]} credito="Hinterkaifeck, 1922 · domínio público" top={360} h={640} zoom={[1.12, 1.18]} /></div>
      <Titulo r={181.0} top={230} size={72}>1923 · DEMOLIDA</Titulo>
    </Cena>
    <Cena r={[185.0, 201.2]}>
      <Fundo />
      <div style={{ position: "absolute", left: 80, right: 80, top: 260, height: 880, background: C.papel, padding: "46px 50px", boxSizing: "border-box", color: C.tinta, transform: "rotate(-1deg)", boxShadow: "0 30px 80px rgba(0,0,0,0.8)" }}>
        <div style={{ fontFamily: COURIER, fontSize: 26, letterSpacing: "0.14em", opacity: 0.7 }}>REVISÃO DO CASO · 2007</div>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 52, marginTop: 10, lineHeight: 1.05 }}>ACADEMIA DE POLÍCIA<br />DA BAVIERA</div>
        <div style={{ height: 3, background: C.tinta, margin: "16px 0 30px", opacity: 0.6 }} />
        <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 38, lineHeight: 1.6 }}><Datilo r={189.34} texto="técnicas modernas de investigação" vel={40} /></div>
        <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 38, lineHeight: 1.6 }}><Datilo r={192.16} texto="conclusão: suspeito provável" vel={40} /></div>
        <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 38, lineHeight: 1.6, display: "flex", alignItems: "center", gap: 16, opacity: lin(t, o(194.84), o(195.2)) }}>
          nome: <span style={{ display: "inline-block", height: 40, width: 380 * lin(t, o(194.84), o(195.8)), background: C.tinta }} /></div>
        <div style={{ fontFamily: COURIER, fontSize: 30, lineHeight: 1.5, marginTop: 30, opacity: lin(t, o(196.9), o(197.5)) }}>não divulgado, por respeito aos<br />descendentes que vivem na região</div>
      </div>
    </Cena>
    <Cena r={[201.2, 212.4]}>
      <Fundo />
      <Foto src="marterl" r={[201.2, 212.4]} credito="Memorial de Hinterkaifeck · Andreas Keller · uso livre" top={330} h={700} zoom={[1.0, 1.15]} pos="50% 45%" />
      <Titulo r={201.42} top={210} size={64}>+100 ANOS</Titulo>
      <Carimbo r={204.6} texto="SEM SOLUÇÃO" x={540} y={1110} rot={-6} size={64} />
    </Cena>
    <Cena r={[212.4, 219.6]}>
      <Fundo />
      <Foto src="inscricao" r={[212.4, 219.6]} credito="Inscrição no memorial · Christian Greller · CC BY 2.0" top={260} w={620} h={880} pan={[20, 60]} zoom={[1.1, 1.1]} />
    </Cena>
    <Cena r={[219.6, 225.0]}>
      <Clip src="c3350" r0={219.6} from={2} zoom={[1.3, 1.4]} dur={6} />
      <Escuro a={0.5} />
      <Surge r={220.14} dur={1.2} style={{ top: 640, fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 88, lineHeight: 1.15, color: C.osso, textShadow: SOMBRA }}>Onde você estava<br />naquela noite?</Surge>
      <Surge r={223.12} style={{ top: 900, fontFamily: ELITE, fontSize: 46, color: C.ossoE, textShadow: SOMBRA }}>…e esse era o álibi.</Surge>
    </Cena>
  </>;
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
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.osso, lineHeight: 1.25 }}>Quem você acha<br />que foi?</div>
      <div style={{ fontFamily: ELITE, fontSize: 30, color: "#E0353F", marginTop: 12 }}>comenta ↓</div>
    </div>
  </AbsoluteFill>;
};
const Hud: React.FC = () => {
  const { t } = useT();
  const v = lin(t, o(28.3), o(28.9)) * (1 - lin(t, FIM_VOZ - 0.2, FIM_VOZ + 0.3));
  if (v <= 0) return null;
  const s = Math.max(0, t - o(28.3));
  const tc = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}:${String(Math.floor((s % 1) * 30)).padStart(2, "0")}`;
  return <div style={{ position: "absolute", left: 60, right: 60, top: 150, display: "flex", justifyContent: "space-between", fontFamily: COURIER, fontWeight: 700, fontSize: 26, color: "rgba(236,231,220,0.7)", opacity: v }}>
    <span><span style={{ color: C.lacre, opacity: Math.floor(t * 1.5) % 2 ? 1 : 0.25 }}>●</span> REC {tc}</span><span>CASO Nº 002</span>
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
const CHAVE = /^(sótão|neve|mortas|assassino|dias|assombrada|sumido|ninguém|enxada|celeiro|fumaça|corpos|depoimento|roubo|nada|solução|álibi|schlittenbauer)$/i;
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
    <Gancho /><Pergunta r={[24.5, 27.25]} /><Familia /><Sinais /><Noite /><Depois /><Vizinho /><Fim />
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
