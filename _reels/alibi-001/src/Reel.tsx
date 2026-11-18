import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FIM_VOZ, FINAL, FPS, R, SFX, TOTAL, TRECHOS, WORDS, o, q } from "./timeline";

// ── ÁLIBI: grafite, chumbo, branco-osso e vermelho-lacre (uma vez por cena) ──
const C = { preto: "#0A0A0B", chumbo: "#1C1C1F", osso: "#ECE7DC", ossoE: "#9C978E", lacre: "#A3141C", papel: "#E4DDCB", tinta: "#1A1714" };
const SERIF = "Playfair", ELITE = "Elite", SANS = "Inter";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lin = (t: number, a: number, b: number, e: (n: number) => number = Easing.bezier(0.65, 0, 0.35, 1)) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, t: f / fps }; };
const spT = (f: number, fps: number, at: number, cfg = { damping: 18, stiffness: 120 }) => spring({ frame: f - q(at), fps, config: cfg });
// sp recebe tempo BRUTO da narração
const sp = (f: number, fps: number, r: number, cfg = { damping: 18, stiffness: 120 }) => spT(f, fps, o(r), cfg);
// Efeitos sempre discretos: nunca competir com a voz.
const SFX_GANHO = 0.45;
const SOMBRA = "0 4px 30px rgba(0,0,0,0.9)";

// janela de cena (tempo bruto) com fade curto de entrada/saída
const Cena: React.FC<{ r: readonly [number, number]; children: React.ReactNode; fade?: number }> = ({ r, children, fade = 0.35 }) => {
  const { t } = useT();
  const de = o(r[0]), ate = o(r[1]);
  if (t < de - 0.02 || t > ate + fade) return null;
  const op = lin(t, de, de + fade) * (1 - lin(t, ate, ate + fade));
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
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
const Escuro: React.FC<{ a?: number }> = ({ a = 0.55 }) => <AbsoluteFill style={{ background: `rgba(10,10,11,${a})` }} />;

// texto que surge com leve desfoque (sem "pulo" de template)
const Surge: React.FC<{ r: number; children: React.ReactNode; style?: React.CSSProperties; dur?: number }> = ({ r, children, style, dur = 0.6 }) => {
  const { t } = useT();
  const k = lin(t, o(r) - 0.05, o(r) + dur, Easing.out(Easing.cubic));
  if (k <= 0) return null;
  return <div style={{ position: "absolute", left: 70, right: 70, textAlign: "center", opacity: k, filter: `blur(${(1 - k) * 8}px)`, transform: `translateY(${(1 - k) * 18}px)`, ...style }}>{children}</div>;
};
// datilografado
const Datilo: React.FC<{ r: number; texto: string; vel?: number; style?: React.CSSProperties }> = ({ r, texto, vel = 22, style }) => {
  const { t } = useT();
  const n = Math.max(0, Math.floor((t - o(r)) * vel));
  if (n <= 0) return null;
  const cursor = n < texto.length && Math.floor(t * 3) % 2 === 0;
  return <span style={style}>{texto.slice(0, n)}{cursor ? "▌" : ""}</span>;
};
const Carimbo: React.FC<{ r: number; texto: string; x: number; y: number; rot?: number; size?: number }> = ({ r, texto, x, y, rot = -8, size = 110 }) => {
  const { t } = useT();
  if (t < o(r) - 0.01) return null;
  const k = lin(t, o(r) - 0.01, o(r) + 0.1, Easing.in(Easing.cubic));
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${interpolate(k, [0, 1], [2.4, 1])})`, opacity: Math.min(1, k * 1.5),
    border: `10px solid ${C.lacre}`, borderRadius: 10, padding: "8px 26px", color: C.lacre, fontFamily: ELITE, fontSize: size, lineHeight: 1, letterSpacing: "0.06em",
    whiteSpace: "nowrap", filter: "url(#gasto)", textShadow: "0 0 18px rgba(163,20,28,0.35)" }}>{texto}</div>;
};
const Credito: React.FC<{ texto: string }> = ({ texto }) => <div style={{ position: "absolute", left: 40, bottom: 470, fontFamily: SANS, fontWeight: 600, fontSize: 18, color: "rgba(236,231,220,0.55)" }}>{texto}</div>;

// ── cenas ────────────────────────────────────────────────────────────────
const Gancho: React.FC = () => {
  const { t } = useT();
  const ondas = Array.from({ length: 46 }, (_, i) => i);
  const vivo = lin(t, o(12.0), o(12.6));
  return <Cena r={R.gancho} fade={0.25}>
    <Clip src="c46898" r0={0} zoom={[1.15, 1.3]} dur={6.3} />
    {t < o(6.3) ? null : <Clip src="c14669" r0={6.3} zoom={[1.1, 1.22]} dur={6} />}
    {t >= o(11.6) && <AbsoluteFill style={{ background: C.preto }} />}
    <Escuro a={t < o(11.6) ? 0.45 : 0} />
    <Surge r={0.16} style={{ top: 520, fontFamily: SERIF, fontWeight: 900, fontSize: 104, lineHeight: 1, color: C.osso, textShadow: SOMBRA, opacity: t > o(6.1) ? 0 : undefined }}>UM ADVOGADO</Surge>
    {t < o(6.1) && <Surge r={1.26} style={{ top: 660, fontFamily: ELITE, fontSize: 46, color: C.osso, textShadow: SOMBRA }}>jurou que não estava lá.</Surge>}
    {t >= o(6.3) && t < o(11.6) && <>
      <Surge r={6.94} style={{ top: 520, fontFamily: ELITE, fontSize: 46, color: C.osso, textShadow: SOMBRA }}>o celular do filho</Surge>
      <Surge r={8.48} style={{ top: 600, fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: C.osso, textShadow: SOMBRA }}>GRAVOU UM VÍDEO</Surge>
      <Surge r={10.06} style={{ top: 730, fontFamily: ELITE, fontSize: 40, color: C.ossoE, textShadow: SOMBRA }}>naquele lugar. minutos antes.</Surge>
    </>}
    {t >= o(11.6) && <>
      <div style={{ position: "absolute", left: 120, right: 120, top: 640, height: 220, display: "flex", alignItems: "center", gap: 7, opacity: vivo }}>
        {ondas.map((i) => { const h = 20 + 170 * Math.abs(Math.sin(i * 1.7 + t * 9) * random(`g${i}-${Math.floor(t * 12)}`)); const alto = i > 28 && i < 38 && t > o(13.9);
          return <div key={i} style={{ flex: 1, height: h, background: alto ? C.lacre : C.osso, opacity: alto ? 1 : 0.75, borderRadius: 3 }} />; })}
      </div>
      <Surge r={13.98} style={{ top: 930, fontFamily: ELITE, fontSize: 44, color: C.osso }}>a voz do advogado.</Surge>
    </>}
  </Cena>;
};
const Pergunta: React.FC = () => (
  <Cena r={R.pergunta} fade={0.2}>
    <AbsoluteFill style={{ background: C.preto }} />
    <Surge r={16.24} dur={1.2} style={{ top: 720, fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 84, lineHeight: 1.15, color: C.osso }}>Onde você estava<br />naquela noite?</Surge>
  </Cena>
);
const Cartela: React.FC = () => (
  <Cena r={R.cartela} fade={0.3}>
    <AbsoluteFill style={{ background: C.preto }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, letterSpacing: "0.12em", color: C.osso }}>ÁLIBI</div>
      <div style={{ height: 3, width: 300, margin: "16px auto 26px", background: C.lacre }} />
      <div style={{ fontFamily: ELITE, fontSize: 40, color: C.osso, letterSpacing: "0.08em" }}><Datilo r={18.6} texto="CASO Nº 001" vel={18} /></div>
      <div style={{ fontFamily: ELITE, fontSize: 32, color: C.ossoE, marginTop: 14 }}><Datilo r={19.0} texto="Carolina do Sul, EUA · 07/06/2021" vel={30} /></div>
    </div>
  </Cena>
);
const Nome: React.FC = () => {
  const { f, fps, t } = useT();
  const card = sp(f, fps, 20.0);
  const ger = lin(t, o(24.48), o(26.6));
  return <Cena r={R.nome}>
    <Clip src="c50861" r0={19.75} zoom={[1.1, 1.2]} />
    <Escuro a={0.62} />
    <div style={{ position: "absolute", left: 90, right: 90, top: 360, background: C.papel, padding: "46px 50px", boxShadow: "0 30px 70px rgba(0,0,0,0.7)", transform: `rotate(-1.5deg) translateY(${(1 - card) * 60}px)`, opacity: card, color: C.tinta }}>
      <div style={{ fontFamily: ELITE, fontSize: 26, letterSpacing: "0.12em", opacity: 0.7 }}>FICHA · INVESTIGADO</div>
      <div style={{ display: "flex", gap: 34, marginTop: 24, alignItems: "center" }}>
        <div style={{ width: 210, height: 260, background: "#CFC7B3", border: `3px solid ${C.tinta}`, display: "grid", placeItems: "center", fontFamily: ELITE, fontSize: 22, textAlign: "center", color: "#6B6457" }}>FOTO<br />NÃO<br />DIVULGADA</div>
        <div>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, lineHeight: 1 }}>ALEX<br />MURDAUGH</div>
          <div style={{ fontFamily: ELITE, fontSize: 30, marginTop: 16 }}>advogado</div>
          <div style={{ fontFamily: ELITE, fontSize: 26, marginTop: 6, opacity: 0.75 }}>Carolina do Sul, EUA</div>
        </div>
      </div>
      <div style={{ marginTop: 34, borderTop: `2px dashed ${C.tinta}`, paddingTop: 22, opacity: ger }}>
        <div style={{ fontFamily: ELITE, fontSize: 26 }}>FAMÍLIA: promotores da região</div>
        <div style={{ display: "flex", gap: 14, marginTop: 14 }}>{[0, 1, 2].map((i) => <div key={i} style={{ flex: 1, height: 16, background: C.tinta, opacity: lin(t, o(24.6 + i * 0.35), o(24.9 + i * 0.35)) }} />)}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: ELITE, fontSize: 24, marginTop: 8 }}><span>3 gerações</span><span style={{ color: C.lacre }}>+80 anos</span></div>
      </div>
    </div>
  </Cena>;
};
const Noite: React.FC = () => (
  <Cena r={R.noite}>
    <Clip src="c22729" r0={29.85} zoom={[1.08, 1.2]} />
    <Escuro a={0.5} />
    <Surge r={30.9} style={{ top: 330, fontFamily: SERIF, fontWeight: 900, fontSize: 132, color: C.osso, textShadow: SOMBRA, letterSpacing: "0.04em" }}>07.06.2021</Surge>
    <Surge r={30.9} style={{ top: 490, fontFamily: ELITE, fontSize: 38, color: C.ossoE, textShadow: SOMBRA }}>noite · fazenda da família</Surge>
    <Surge r={34.02} style={{ top: 640, left: 120, right: 560, textAlign: "left", fontFamily: ELITE, fontSize: 40, color: C.osso, textShadow: SOMBRA }}>MAGGIE, 52</Surge>
    <Surge r={35.76} style={{ top: 640, left: 560, right: 120, textAlign: "right", fontFamily: ELITE, fontSize: 40, color: C.osso, textShadow: SOMBRA }}>PAUL, 22</Surge>
    <Surge r={38.38} style={{ top: 760, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: C.osso, textShadow: SOMBRA }}>PERTO DOS <span style={{ color: C.lacre }}>CANIS</span></Surge>
  </Cena>
);
const Ligacao: React.FC = () => (
  <Cena r={R.ligacao}>
    <Clip src="c49328" r0={40.2} zoom={[1.1, 1.18]} dur={5} />
    <Escuro a={0.4} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: ELITE, color: C.osso, textShadow: SOMBRA }}>
      <div style={{ fontSize: 120 }}><Datilo r={42.0} texto="22:06" vel={8} /></div>
      <div style={{ fontSize: 38, marginTop: 10 }}><Datilo r={42.6} texto="ligação para a emergência" vel={28} /></div>
      <div style={{ fontSize: 30, marginTop: 10, color: C.ossoE }}><Datilo r={43.4} texto="quem liga: Alex" vel={26} /></div>
    </div>
  </Cena>
);
const Ficha: React.FC<{ fase: "alibi" | "mentira" }> = ({ fase }) => {
  const { f, fps, t } = useT();
  const r = fase === "alibi" ? R.ficha : R.mentiu;
  const ent = sp(f, fps, r[0] + 0.5);
  const linhas: [number, string][] = [[47.18, "— jantou com a família"], [48.12, "— cochilou no sofá"], [49.46, "— saiu para visitar a mãe doente"], [51.34, "— voltou e encontrou os dois"]];
  const sub = lin(t, o(57.6), o(58.6));
  const viva = fase === "alibi";
  return <Cena r={r}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #2A2622 0%, #0A0A0B 75%)" }} />
    <div style={{ position: "absolute", left: 80, right: 80, top: 300, height: 860, background: C.papel, padding: "50px 54px", boxSizing: "border-box", color: C.tinta,
      transform: `rotate(1.2deg) translateY(${(1 - ent) * 80}px)`, opacity: ent, boxShadow: "0 30px 80px rgba(0,0,0,0.8)" }}>
      <div style={{ fontFamily: ELITE, fontSize: 26, letterSpacing: "0.14em", opacity: 0.7 }}>DEPOIMENTO · 07/06/2021</div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 92, marginTop: 8 }}>O ÁLIBI</div>
      <div style={{ height: 3, background: C.tinta, margin: "10px 0 30px", opacity: 0.6 }} />
      {linhas.map(([rr, txt], i) => <div key={i} style={{ fontFamily: ELITE, fontSize: 40, lineHeight: 1.5 }}>{viva ? <Datilo r={rr} texto={txt} vel={34} /> : txt}</div>)}
      <div style={{ marginTop: 40, fontFamily: SERIF, fontWeight: 900, fontSize: 64, position: "relative", display: "inline-block" }}>
        {viva ? <Datilo r={57.06} texto={"“Não fui ao canil.”"} vel={16} /> : "“Não fui ao canil.”"}
        <div style={{ position: "absolute", left: 0, bottom: -6, height: 8, width: `${(viva ? sub : 1) * 100}%`, background: C.lacre }} />
      </div>
      {viva && <Surge r={60.52} style={{ left: 54, right: 54, top: 700, textAlign: "left", fontFamily: ELITE, fontSize: 44, color: C.lacre }}>nenhuma vez.</Surge>}
      {!viva && <>
        <Carimbo r={102.02} texto="MENTIRA" x={460} y={520} rot={-12} size={130} />
        <Surge r={102.84} style={{ left: 54, right: 54, top: 700, textAlign: "left", fontFamily: ELITE, fontSize: 40, color: C.tinta }}>“Eu estive no canil.” — no tribunal, 2023</Surge>
      </>}
    </div>
    {!viva && <Surge r={105.54} style={{ top: 1190, fontFamily: ELITE, fontSize: 36, color: C.ossoE }}>justificativa: paranoia · vício em remédios</Surge>}
  </Cena>;
};
const Minuto: React.FC = () => (
  <Cena r={R.minuto}>
    <Clip src="c28886" r0={62.0} zoom={[1.0, 1.15]} dur={7.4} />
    <Escuro a={0.45} />
    <Surge r={66.32} style={{ top: 1080, fontFamily: SERIF, fontWeight: 900, fontSize: 88, color: C.osso, textShadow: SOMBRA }}>MINUTO A MINUTO</Surge>
  </Cena>
);
const Relogio: React.FC<{ r: number; hora: string }> = ({ r, hora }) => {
  const { f, fps } = useT();
  const s = sp(f, fps, r, { damping: 14, stiffness: 160 });
  return <div style={{ position: "absolute", left: 0, right: 0, top: 290, textAlign: "center", fontFamily: ELITE, fontSize: 210, color: C.osso, letterSpacing: "0.04em", transform: `scale(${0.9 + 0.1 * s})`, opacity: s,
    textShadow: "0 0 40px rgba(236,231,220,0.25)" }}>{hora}</div>;
};
const Celular: React.FC<{ x: number; nome: string; travaR?: number; recR?: number; legenda?: string }> = ({ x, nome, travaR, recR, legenda }) => {
  const { t } = useT();
  const travado = travaR !== undefined && t >= o(travaR);
  const rec = recR !== undefined && t >= o(recR) && !travado;
  const k = travaR !== undefined ? lin(t, o(travaR), o(travaR) + 0.4) : 0;
  return <div style={{ position: "absolute", left: x, top: 640, width: 300, textAlign: "center" }}>
    <div style={{ width: 300, height: 540, borderRadius: 44, border: `6px solid ${C.osso}`, background: travado ? "#050506" : "#15161A", position: "relative", boxShadow: rec ? "0 0 60px rgba(163,20,28,0.35)" : "none" }}>
      {rec && <div style={{ position: "absolute", left: 0, right: 0, top: 220, fontFamily: ELITE, fontSize: 46, color: C.lacre, opacity: Math.floor(t * 2) % 2 ? 1 : 0.4 }}>● REC</div>}
      {travado && <div style={{ position: "absolute", left: 0, right: 0, top: 190, opacity: k }}>
        <div style={{ fontSize: 80 }}>🔒</div>
        <div style={{ fontFamily: ELITE, fontSize: 30, color: C.ossoE, marginTop: 10 }}>último uso<br />20:49</div>
      </div>}
    </div>
    <div style={{ fontFamily: ELITE, fontSize: 36, color: C.osso, marginTop: 20 }}>{nome}</div>
    {legenda && <div style={{ fontFamily: ELITE, fontSize: 28, color: C.ossoE, marginTop: 6 }}>{legenda}</div>}
  </div>;
};
const H2044: React.FC = () => (
  <Cena r={R.h2044}>
    <AbsoluteFill style={{ background: C.preto }} />
    <Relogio r={69.66} hora="20:44" />
    <Celular x={390} nome="celular de PAUL" recR={71.74} />
    <Surge r={74.74} style={{ top: 1250, fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: C.osso }}>vídeo curto · <span style={{ color: C.lacre }}>no canil</span></Surge>
  </Cena>
);
const H2049: React.FC = () => {
  const { t } = useT();
  const apaga = lin(t, o(82.6), o(84.2));
  return <Cena r={R.h2049}>
    <AbsoluteFill style={{ background: C.preto }} />
    <div style={{ opacity: 1 - 0.75 * apaga }}>
      <Relogio r={77.42} hora="20:49" />
      <Celular x={150} nome="PAUL" travaR={79.76} />
      <Celular x={630} nome="MAGGIE" travaR={81.54} />
    </div>
    <Surge r={82.46} dur={1.2} style={{ top: 1290, fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 72, color: C.osso }}>para sempre.</Surge>
  </Cena>;
};
const Vozes: React.FC = () => {
  const { t } = useT();
  const barras = Array.from({ length: 54 }, (_, i) => i);
  const faixa = (i: number) => (i < 18 ? 0 : i < 36 ? 1 : 2);
  const ativa = [o(91.08), o(91.74), o(92.84)];
  const alex = t >= o(94.72);
  return <Cena r={R.vozes}>
    <AbsoluteFill style={{ background: C.preto }} />
    <Surge r={84.64} style={{ top: 330, fontFamily: ELITE, fontSize: 40, color: C.ossoE, letterSpacing: "0.1em" }}>A GRAVAÇÃO · 20:44</Surge>
    <div style={{ position: "absolute", left: 80, right: 80, top: 560, height: 300, display: "flex", alignItems: "center", gap: 6 }}>
      {barras.map((i) => { const fx = faixa(i); const on = t >= ativa[fx]; const h = 14 + (on ? 240 : 60) * Math.abs(Math.sin(i * 1.3 + t * 8) * random(`v${i}-${Math.floor(t * 12)}`));
        const cor = fx === 2 && alex ? C.lacre : C.osso;
        return <div key={i} style={{ flex: 1, height: h, background: cor, opacity: on ? 0.95 : 0.3, borderRadius: 3 }} />; })}
    </div>
    <div style={{ position: "absolute", left: 80, right: 80, top: 900, display: "flex", fontFamily: ELITE, fontSize: 38, color: C.osso, textAlign: "center" }}>
      <div style={{ flex: 1, opacity: lin(t, ativa[0], ativa[0] + 0.3) }}>PAUL</div>
      <div style={{ flex: 1, opacity: lin(t, ativa[1], ativa[1] + 0.3) }}>MAGGIE</div>
      <div style={{ flex: 1, opacity: lin(t, ativa[2], ativa[2] + 0.3), color: alex ? C.lacre : C.osso, fontSize: alex ? 50 : 38 }}>{alex ? "ALEX" : "???"}</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1010, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 20, color: "rgba(236,231,220,0.45)" }}>representação · áudio original não reproduzido</div>
  </Cena>;
};
const Tribunal: React.FC = () => {
  const { t } = useT();
  const k = lin(t, o(94.98), o(99.0), Easing.linear);
  return <Cena r={R.tribunal}>
    {t < o(98.74) ? <AbsoluteFill>
      <Img src={staticFile("img/tribunal.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "45% 50%", transform: `scale(${1.05 + 0.1 * k})`, filter: "grayscale(0.85) contrast(1.15) brightness(0.8)" }} />
      <Credito texto="Foto: P. Hughes · CC BY 4.0 · Wikimedia Commons" />
    </AbsoluteFill> : <Clip src="c46820" r0={98.74} zoom={[1.12, 1.2]} dur={3.2} />}
    <Escuro a={0.45} />
    <Surge r={96.46} style={{ top: 330, fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: C.osso, textShadow: SOMBRA }}>2023</Surge>
    <Surge r={96.9} style={{ top: 470, fontFamily: ELITE, fontSize: 36, color: C.osso, textShadow: SOMBRA }}>tribunal do condado de Colleton</Surge>
    <Surge r={99.62} style={{ top: 1040, fontFamily: ELITE, fontSize: 40, color: C.osso, textShadow: SOMBRA }}>no banco das testemunhas</Surge>
  </Cena>;
};
const Sentenca: React.FC = () => {
  const { t } = useT();
  if (t < o(108.5) || t > o(113.0) + 0.3) return null;
  return <AbsoluteFill style={{ background: C.preto, opacity: lin(t, o(108.5), o(108.8)) * (1 - lin(t, o(113.0), o(113.3))) }}>
    <Surge r={108.6} style={{ top: 640, fontFamily: ELITE, fontSize: 46, color: C.ossoE }}>o júri não acreditou.</Surge>
    <Surge r={111.04} dur={0.3} style={{ top: 760, fontFamily: SERIF, fontWeight: 900, fontSize: 120, lineHeight: 1, color: C.osso }}>PRISÃO<br />PERPÉTUA</Surge>
  </AbsoluteFill>;
};
const Virada: React.FC = () => (
  <Cena r={R.virada}>
    <Clip src="c32786" r0={113.0} zoom={[1.1, 1.22]} dur={14} op={0.5} />
    <Escuro a={0.55} />
    <Surge r={113.2} style={{ top: 280, fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 70, color: C.osso, textShadow: SOMBRA }}>mas não terminou aí.</Surge>
    <Surge r={116.42} style={{ top: 430, fontFamily: ELITE, fontSize: 56, color: C.osso, textShadow: SOMBRA }}>MAIO · 2026</Surge>
    <Carimbo r={119.04} texto="CONDENAÇÃO ANULADA" x={540} y={640} rot={-6} size={64} />
    <Surge r={120.94} style={{ top: 790, fontFamily: ELITE, fontSize: 36, color: C.osso, textShadow: SOMBRA }}>a escrivã do tribunal interferiu no júri</Surge>
    <Surge r={124.8} style={{ top: 920, fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: C.osso, textShadow: SOMBRA }}>NOVO JULGAMENTO</Surge>
    <Surge r={126.02} style={{ top: 1040, fontFamily: ELITE, fontSize: 48, color: C.lacre, textShadow: SOMBRA }}>do zero.</Surge>
  </Cena>
);
const Fecho: React.FC = () => (
  <Cena r={[127.0, 136.3]}>
    <Clip src="c46898" r0={127.0} from={3} zoom={[1.3, 1.4]} dur={10} />
    <Escuro a={0.5} />
    <Surge r={130.42} dur={1.4} style={{ top: 640, fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 90, lineHeight: 1.15, color: C.osso, textShadow: SOMBRA }}>Onde você estava<br />naquela noite?</Surge>
    <Surge r={134.28} dur={1.0} style={{ top: 900, fontFamily: ELITE, fontSize: 46, color: C.ossoE, textShadow: SOMBRA }}>…e esse era o álibi.</Surge>
  </Cena>
);
const TelaFinal: React.FC = () => {
  const { f, fps, t } = useT();
  if (t < FINAL - 0.4) return null;
  const a = spT(f, fps, FINAL, { damping: 20, stiffness: 90 }), b = spT(f, fps, FINAL + 0.8), c = spT(f, fps, FINAL + 1.6);
  return <AbsoluteFill style={{ background: C.preto, opacity: lin(t, FINAL - 0.4, FINAL) }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", opacity: a, transform: `scale(${0.92 + 0.08 * a})` }}>
      <div style={{ width: 380, height: 380, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 80px rgba(236,231,220,0.12)", border: `2px solid rgba(236,231,220,0.3)` }}>
        <Img src={staticFile("img/perfil.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 730, textAlign: "center", opacity: a }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 130, letterSpacing: "0.12em", color: C.osso }}>ÁLIBI</div>
      <div style={{ height: 3, width: 260, margin: "10px auto 20px", background: C.lacre }} />
      <div style={{ fontFamily: ELITE, fontSize: 34, color: C.ossoE, opacity: b }}>toda história tem um álibi.</div>
    </div>
    <div style={{ position: "absolute", left: 90, right: 90, top: 1090, textAlign: "center", padding: "26px 30px", border: `2px solid rgba(236,231,220,0.35)`, opacity: c, transform: `translateY(${(1 - c) * 20}px)` }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.osso, lineHeight: 1.25 }}>Se você estivesse no júri,<br />esse vídeo bastaria?</div>
      <div style={{ fontFamily: ELITE, fontSize: 30, color: C.lacre, marginTop: 12 }}>comenta ↓</div>
    </div>
  </AbsoluteFill>;
};

// ── HUD de fita: REC + contador + número do caso ─────────────────────────
const Hud: React.FC = () => {
  const { t } = useT();
  const v = lin(t, o(19.75), o(20.4)) * (1 - lin(t, FIM_VOZ - 0.2, FIM_VOZ + 0.3));
  if (v <= 0) return null;
  const s = Math.max(0, t - o(19.75));
  const tc = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}:${String(Math.floor((s % 1) * 30)).padStart(2, "0")}`;
  return <div style={{ position: "absolute", left: 60, right: 60, top: 170, display: "flex", justifyContent: "space-between", fontFamily: ELITE, fontSize: 28, color: "rgba(236,231,220,0.75)", opacity: v }}>
    <span><span style={{ color: C.lacre, opacity: Math.floor(t * 1.5) % 2 ? 1 : 0.25 }}>●</span> REC {tc}</span>
    <span>CASO Nº 001</span>
  </div>;
};

// ── legenda: 3 palavras, palavra falada em branco-osso, demais apagadas ──
const PAGES = (() => {
  const pages: { de: number; ate: number; ws: typeof WORDS }[] = [];
  let cur: typeof WORDS = [];
  WORDS.forEach((w, i) => {
    cur.push(w);
    const fim = /[.,?!]$/.test(w.text) || cur.length >= 3 || i === WORDS.length - 1;
    if (fim) { pages.push({ de: cur[0].start, ate: 0, ws: cur }); cur = []; }
  });
  pages.forEach((p, i) => { p.ate = i < pages.length - 1 ? Math.min(pages[i + 1].de, p.ws[p.ws.length - 1].end + 0.6) : FIM_VOZ + 0.2; });
  return pages;
})();
const CHAVE = /^(canil|mentiu|alex|nenhuma|mentira|anulou|mortos|voz|perpétua|zero|álibi)$/i;
const Legenda: React.FC = () => {
  const { t } = useT();
  const pg = PAGES.find((p) => t >= p.de - 0.05 && t < p.ate);
  if (!pg || t > FIM_VOZ + 0.2) return null;
  return <div style={{ position: "absolute", left: 70, right: 170, top: 1330, display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: 16, rowGap: 6 }}>
    {pg.ws.map((w, i) => {
      const dita = t >= w.start - 0.03;
      const txt = w.text.replace(/[,;:]$/, "");
      const chave = CHAVE.test(txt.replace(/[.?!]$/, ""));
      return <span key={i} style={{ fontFamily: SANS, fontWeight: 800, fontSize: 56, lineHeight: 1.15, color: dita ? (chave ? "#E0353F" : C.osso) : "rgba(236,231,220,0.35)",
        textShadow: "0 3px 14px rgba(0,0,0,0.95), 0 0 2px #000" }}>{txt}</span>;
    })}
  </div>;
};

// grão de filme + vinheta
const Textura: React.FC = () => {
  const { f } = useT();
  return <>
    <svg width="0" height="0" style={{ position: "absolute" }}><filter id="gasto"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" /><feDisplacementMap in="SourceGraphic" scale="5" /></filter></svg>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,0.75) 100%)", pointerEvents: "none" }} />
    <AbsoluteFill style={{ opacity: 0.09, mixBlendMode: "overlay" }}>
      <svg width="1080" height="1920"><filter id="grao"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 30} /></filter><rect width="1080" height="1920" filter="url(#grao)" /></svg>
    </AbsoluteFill>
  </>;
};

const Sons: React.FC = () => (
  <>
    {TRECHOS.map(([a, b], i) => <Sequence key={"v" + i} from={q(o(a))} durationInFrames={q(b - a) + 1}><Audio src={staticFile("audio/voz.mp3")} startFrom={q(a)} endAt={q(b)} /></Sequence>)}
    <Audio src={staticFile("audio/trilha.mp3")} volume={(fr) => interpolate(fr, [0, 45, q(FIM_VOZ), q(FINAL + 0.5)], [0, 0.42, 0.42, 0.65], clamp) * interpolate(fr, [TOTAL - 50, TOTAL - 2], [1, 0], clamp)} />
    {SFX.map((s, i) => { const at = s.t ?? o(s.r ?? 0); return <Sequence key={i} from={Math.max(0, q(at))} durationInFrames={q(3.2)}><Audio src={staticFile(`audio/${s.src}.mp3`)} volume={(s.vol ?? 0.4) * SFX_GANHO} /></Sequence>; })}
  </>
);

export const Reel: React.FC = () => (
  <AbsoluteFill style={{ background: C.preto, overflow: "hidden" }}>
    <Gancho /><Pergunta /><Cartela /><Nome /><Noite /><Ligacao /><Ficha fase="alibi" /><Minuto /><H2044 /><H2049 /><Vozes /><Tribunal /><Ficha fase="mentira" /><Sentenca /><Virada /><Fecho />
    <Legenda />
    <Hud />
    <TelaFinal />
    <Textura />
    <Sons />
  </AbsoluteFill>
);
export { FPS };
