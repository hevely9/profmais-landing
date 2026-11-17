import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FIM_VOZ, FPS, TRECHOS, o, MARCA, PASSOS, SFX, SHOTS, T, TOTAL, WORDS, q } from "./timeline";

// ── identidade do canal: preto, dourado e branco ─────────────────────────
const C = { preto: "#0A0A0A", ouro: "#F5B82E", ouroClaro: "#FFD66B", branco: "#FFFFFF", vermelho: "#E53935", cinza: "#3A3A3A" };
const TIT = "Anton", SANS = "Inter", MAO = "Caveat";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lin = (t: number, a: number, b: number, e: (n: number) => number = Easing.bezier(0.65, 0, 0.35, 1)) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, t: f / fps }; };
const sp = (f: number, fps: number, at: number, cfg = { damping: 12, stiffness: 180 }) => spring({ frame: f - q(at), fps, config: cfg });

// ── clipes com zoom lento e "soco" de câmera em cada corte ───────────────
const Clipes: React.FC = () => {
  const { t } = useT();
  return <>{SHOTS.map((s, i) => {
    if (t < s.de - 0.02 || t > s.ate + 0.02) return null;
    const k = lin(t, s.de, s.ate, Easing.linear);
    const soco = 1 - lin(t, s.de, s.de + 0.25, Easing.out(Easing.cubic));
    return <Sequence key={i} from={q(s.de)} durationInFrames={q(s.ate - s.de) + 2} layout="none">
      <AbsoluteFill style={{ transform: `scale(${1.04 + 0.08 * k + 0.08 * soco})` }}>
        <OffthreadVideo src={staticFile(`v/${s.src}.mp4`)} startFrom={q(s.from ?? 0)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </Sequence>;
  })}</>;
};
const Grade: React.FC = () => (
  <>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.75) 100%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(135deg, rgba(245,184,46,0.10), transparent 40%, rgba(0,40,80,0.12))", mixBlendMode: "overlay" }} />
  </>
);
const Flash: React.FC = () => {
  const { t } = useT();
  const cortes = SHOTS.slice(1).map((s) => s.de);
  const v = Math.max(0, ...cortes.map((c) => 1 - Math.abs(t - c) / 0.08));
  return <AbsoluteFill style={{ background: "#fff", opacity: v * 0.35 }} />;
};

// ── gancho ───────────────────────────────────────────────────────────────
const Gancho: React.FC = () => {
  const { f, fps, t } = useT();
  if (t > T.p1 - 0.1) return null;
  const a = sp(f, fps, 0.05, { damping: 9, stiffness: 220 }), b = sp(f, fps, T.dinheiro - 0.05, { damping: 9, stiffness: 220 });
  const c = sp(f, fps, T.seis - 0.1), e = lin(t, T.p1 - 0.35, T.p1 - 0.1);
  const treme = t > T.dinheiro && t < T.dinheiro + 0.35 ? Math.sin(t * 90) * 6 : 0;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 330, textAlign: "center", opacity: 1 - e, transform: `translateX(${treme}px)` }}>
      <div style={{ fontFamily: TIT, fontSize: 150, lineHeight: 0.95, color: C.branco, textShadow: "0 10px 40px rgba(0,0,0,0.8)", transform: `scale(${2 - a})`, opacity: Math.min(1, a * 2) }}>NÃO TERMINE<br />2027</div>
      <div style={{ display: "inline-block", marginTop: 16, padding: "6px 28px", background: C.ouro, color: C.preto, fontFamily: TIT, fontSize: 132, lineHeight: 1.05,
        transform: `scale(${2.2 - 1.2 * b}) rotate(-3deg)`, opacity: Math.min(1, b * 2), boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>SEM DINHEIRO</div>
      <div style={{ marginTop: 30, fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.branco, opacity: c, transform: `translateY(${(1 - c) * 30}px)`, textShadow: "0 4px 18px rgba(0,0,0,0.9)" }}>
        faça essas <span style={{ color: C.ouro }}>6 coisas</span> ↓</div>
    </div>
  );
};

// ── barra de progresso 1–6 ──────────────────────────────────────────────
const Progresso: React.FC = () => {
  const { t } = useT();
  if (t < T.p1 - 0.2 || t > T.canal + 0.3) return null;
  const v = lin(t, T.p1 - 0.2, T.p1 + 0.1) * (1 - lin(t, T.canal, T.canal + 0.3));
  return <div style={{ position: "absolute", left: 70, right: 70, top: 220, display: "flex", gap: 12, opacity: v }}>
    {PASSOS.map((p, i) => { const fill = lin(t, p.de, p.ate, Easing.linear); const on = t >= p.de;
      return <div key={i} style={{ flex: 1, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.25)", overflow: "hidden" }}>
        <div style={{ width: `${fill * 100}%`, height: "100%", background: on ? C.ouro : "transparent" }} /></div>; })}
  </div>;
};

// ── título de cada passo ─────────────────────────────────────────────────
const Passo: React.FC<{ n: number; titulo: string; sub: string; de: number; ate: number }> = ({ n, titulo, sub, de, ate }) => {
  const { f, fps, t } = useT();
  if (t < de - 0.05 || t > ate) return null;
  const p = sp(f, fps, de, { damping: 10, stiffness: 200 }), s = sp(f, fps, de + 0.25);
  const e = lin(t, ate - 0.2, ate);
  const grande = titulo.length > 16;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 300, textAlign: "center", opacity: 1 - e, transform: `translateY(${-e * 40}px)` }}>
      <div style={{ display: "inline-grid", placeItems: "center", width: 150, height: 150, borderRadius: 75, background: C.ouro, color: C.preto, fontFamily: TIT, fontSize: 104,
        transform: `scale(${p}) rotate(${(1 - p) * -90}deg)`, boxShadow: "0 16px 40px rgba(0,0,0,0.6)" }}>{n}</div>
      <div style={{ fontFamily: TIT, fontSize: grande ? 104 : 132, lineHeight: 1.0, color: C.branco, marginTop: 24, textShadow: "0 8px 34px rgba(0,0,0,0.9)",
        transform: `scale(${1.6 - 0.6 * p})`, opacity: Math.min(1, p * 2) }}>
        {titulo.split("≠").map((parte, i, arr) => <React.Fragment key={i}>{parte}{i < arr.length - 1 && <><br /><span style={{ color: C.ouro }}>≠</span><br /></>}</React.Fragment>)}</div>
      <div style={{ fontFamily: MAO, fontWeight: 700, fontSize: 70, color: C.ouroClaro, marginTop: 14, opacity: s, transform: `translateY(${(1 - s) * 20}px)`, textShadow: "0 4px 18px rgba(0,0,0,0.9)" }}>{sub}</div>
    </div>
  );
};

// ── chamada final: meta de 100 inscritos ─────────────────────────────────
const Meta: React.FC = () => {
  const { f, fps, t } = useT();
  if (t < T.canal - 0.1) return null;
  const tit = sp(f, fps, T.canal);
  const n = Math.round(interpolate(t, [T.cem - 0.6, T.cem + 0.4], [0, 100], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const num = sp(f, fps, T.cem - 0.6, { damping: 12, stiffness: 160 });
  const btn = sp(f, fps, T.inscreve - 0.2, { damping: 11, stiffness: 200 });
  const toque = lin(t, T.inscreve + 0.25, T.inscreve + 0.35) * (1 - lin(t, T.inscreve + 0.35, T.inscreve + 0.5));
  const inscrito = t > T.inscreve + 0.35;
  const mao = lin(t, T.inscreve - 0.1, T.inscreve + 0.25, Easing.out(Easing.cubic)) * (1 - lin(t, T.inscreve + 0.8, T.inscreve + 1.1));
  const bal = sp(f, fps, T.comenta + 0.05, { damping: 10, stiffness: 200 });
  return (
    <>
      <div style={{ position: "absolute", left: 60, right: 60, top: 230, textAlign: "center", opacity: Math.min(1, tit * 1.5), transform: `translateY(${(1 - tit) * 30}px)` }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 46, color: C.ouroClaro, letterSpacing: "0.12em", textShadow: "0 4px 18px rgba(0,0,0,0.9)" }}>NOSSA PRIMEIRA META</div>
        <div style={{ fontFamily: TIT, fontSize: 300, lineHeight: 1, color: C.branco, textShadow: `0 0 60px ${C.ouro}88, 0 10px 40px rgba(0,0,0,0.8)`, transform: `scale(${0.6 + 0.4 * num})`, opacity: num }}>{n}</div>
        <div style={{ fontFamily: TIT, fontSize: 104, lineHeight: 1, color: C.ouro, marginTop: -6, opacity: num, textShadow: "0 8px 30px rgba(0,0,0,0.9)" }}>INSCRITOS</div>
      </div>
      {t > T.inscreve - 0.3 && <div style={{ position: "absolute", left: 0, right: 0, top: 930, display: "flex", justifyContent: "center", transform: `scale(${btn * (1 - 0.06 * toque)})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "26px 54px", borderRadius: 999, background: inscrito ? C.cinza : C.vermelho, color: C.branco,
          fontFamily: SANS, fontWeight: 800, fontSize: 56, boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
          {inscrito ? <><svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" /></svg>INSCRITO ✓</>
            : <>INSCREVER-SE</>}
        </div>
      </div>}
      {mao > 0.001 && <svg width="150" height="170" viewBox="0 0 60 70" style={{ position: "absolute", left: 640 - 140 * (1 - mao), top: 990 + 200 * (1 - mao), opacity: Math.min(1, mao * 1.5), transform: `scale(${1 - 0.1 * toque})` }}>
        <path d="M18 6 C18 2 24 2 24 6 V30 L27 22 C29 18 34 20 32 25 L35 24 C37 21 42 23 40 28 L43 28 C46 27 48 30 46 34 L42 52 C41 58 36 62 30 62 H24 C18 62 14 58 11 53 L4 40 C2 36 7 33 10 37 L18 46 Z"
          fill="#fff" stroke="#111" strokeWidth="3.2" strokeLinejoin="round" /></svg>}
      {t > T.comenta && <div style={{ position: "absolute", left: 110, top: 1110, transform: `scale(${bal}) rotate(-3deg)`, transformOrigin: "10% 100%" }}>
        <div style={{ padding: "22px 34px", borderRadius: 36, background: C.branco, color: C.preto, fontFamily: SANS, fontWeight: 800, fontSize: 54, boxShadow: "0 18px 40px rgba(0,0,0,0.5)" }}>
          “é o meu ano”</div>
      </div>}
    </>
  );
};

// ── marca NEXO: o X é uma conexão (duas linhas que se cruzam, com nós nas pontas) ──
// Símbolo NEXO ("estrela de conexões") — mesmo desenho de _reels/nexo-marca/simbolo-nexo.svg, sem texto.
const AZUL = "#4F6FFF";
const SimboloNexo: React.FC<{ s: number; p?: number }> = ({ s, p = 1 }) => {
  const d = 80 * (1 - Math.min(1, p * 1.3)), no = Math.min(1, Math.max(0, p * 1.6 - 0.4));
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={{ overflow: "visible", display: "block" }}>
      <defs><linearGradient id="gnx" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#A9B8FF" /><stop offset=".55" stopColor={AZUL} /><stop offset="1" stopColor="#2A3FD6" /></linearGradient></defs>
      <path d="M50 8 C53 36 64 47 92 50 C64 53 53 64 50 92 C47 64 36 53 8 50 C36 47 47 36 50 8 Z" fill="url(#gnx)" transform={`translate(50 50) rotate(${(1 - p) * -90}) scale(${p}) translate(-50 -50)`} />
      <path d="M22 22 L78 78 M78 22 L22 78" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity=".85" strokeDasharray="80" strokeDashoffset={d} />
      {[[22, 22], [78, 78], [78, 22], [22, 78]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r={6 * no} fill="#fff" />)}
      <circle cx="50" cy="50" r={5 * no} fill="#fff" />
    </svg>
  );
};
const MarcaDagua: React.FC = () => {
  const { t } = useT();
  if (t > MARCA) return null;
  return <div style={{ position: "absolute", left: 70, top: 120, opacity: 0.85 * lin(t, 0.3, 0.8) * (1 - lin(t, MARCA - 0.3, MARCA)) }}><div style={{ filter: `drop-shadow(0 0 14px ${AZUL}AA)` }}><SimboloNexo s={86} /></div></div>;
};
const TelaMarca: React.FC = () => {
  const { f, fps, t } = useT();
  if (t < MARCA - 0.3) return null;
  const fundo = lin(t, MARCA - 0.3, MARCA);
  const m = sp(f, fps, MARCA + 0.05, { damping: 13, stiffness: 140 });
  const flutua = Math.sin((t - MARCA) * 2.4) * 10;
  const sim = lin(t, MARCA + 0.45, MARCA + 1.05, Easing.out(Easing.cubic));
  const slog = sp(f, fps, MARCA + 0.8), insc = sp(f, fps, MARCA + 1.3, { damping: 11, stiffness: 200 });
  const brilho = 0.5 + 0.5 * Math.sin((t - MARCA) * 3);
  return (
    <AbsoluteFill style={{ opacity: fundo, background: `radial-gradient(ellipse at 50% 34%, #0E1A55 0%, #050816 55%, #000 100%)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", transform: `translateY(${flutua + (1 - m) * 80}px) scale(${0.6 + 0.4 * m})`, opacity: Math.min(1, m * 1.5) }}>
        <div style={{ width: 640, height: 640, borderRadius: "50%", overflow: "hidden", boxShadow: `0 0 ${70 + 40 * brilho}px ${AZUL}88, 0 0 0 6px ${AZUL}55` }}>
          <Img src={staticFile("mascote.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center", filter: `drop-shadow(0 0 ${30 * sim}px ${AZUL})` }}>
        <SimboloNexo s={150} p={sim} />
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1145, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 50, lineHeight: 1.2, color: C.branco,
        opacity: slog, transform: `translateY(${(1 - slog) * 20}px)` }}>Conexões, conhecimento<br /><span style={{ color: "#8FA2FF" }}>e oportunidades.</span></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1360, display: "flex", justifyContent: "center", transform: `scale(${insc})` }}>
        <div style={{ padding: "24px 56px", borderRadius: 999, background: C.vermelho, color: C.branco, fontFamily: SANS, fontWeight: 800, fontSize: 52, boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>INSCREVA-SE</div>
      </div>
    </AbsoluteFill>
  );
};

// ── legenda palavra a palavra ────────────────────────────────────────────
const PAGES = (() => {
  const out: { de: number; ate: number; w: typeof WORDS }[] = []; let cur: typeof WORDS = [];
  WORDS.forEach((w, i) => {
    cur.push(w); const nx = WORDS[i + 1];
    const len = cur.map((x) => x.text).join(" ").length;
    if (!nx || /[.,?!:…]$/.test(w.text) || len >= 14 || cur.length >= 3 || nx.start - w.end > 0.35) { out.push({ de: cur[0].start, ate: w.end, w: cur }); cur = []; }
  });
  return out.map((p, i) => ({ ...p, ate: out[i + 1] && out[i + 1].de - p.ate < 0.5 ? out[i + 1].de : p.ate + 0.25 }));
})();
const Legenda: React.FC = () => {
  const { f, fps, t } = useT();
  const pg = PAGES.find((p) => t >= p.de - 0.05 && t < p.ate - 0.05);
  if (!pg) return null;
  const pin = spring({ frame: f - q(pg.de - 0.05), fps, config: { damping: 14, stiffness: 260 } });
  return (
    <div style={{ position: "absolute", left: 70, right: 150, top: 1330, display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: 44,
      transform: `scale(${0.85 + 0.15 * pin})`, opacity: Math.min(1, pin * 2) }}>
      {pg.w.map((w, i) => {
        const on = t >= w.start - 0.05, ativo = on && t < w.end + 0.05;
        return <span key={i} style={{ fontFamily: SANS, fontWeight: 800, fontSize: 70, lineHeight: 1.1, textTransform: "uppercase", letterSpacing: "-0.01em",
          color: ativo ? C.ouro : on ? C.branco : "rgba(255,255,255,0.55)", WebkitTextStroke: "10px #000", paintOrder: "stroke fill",
          transform: `scale(${ativo ? 1.1 : 1})`, display: "inline-block" }}>{w.text.replace(/[,;:]$/, "")}</span>;
      })}
    </div>
  );
};

// ── som ──────────────────────────────────────────────────────────────────
const Sons: React.FC = () => (
  <>
    {TRECHOS.map(([a, b], i) => <Sequence key={"v" + i} from={q(o(a))} durationInFrames={q(b - a) + 1}><Audio src={staticFile("audio/voz-welliton.mp3")} startFrom={q(a)} endAt={q(b)} volume={1} /></Sequence>)}
    <Audio src={staticFile("audio/trilha.mp3")} volume={(fr) => interpolate(fr, [q(FIM_VOZ - 0.3), q(FIM_VOZ + 0.6)], [0.17, 0.4], clamp) * interpolate(fr, [TOTAL - q(1.4), TOTAL - 2], [1, 0], clamp)} />
    {SFX.map((s, i) => <Sequence key={i} from={Math.max(0, q(s.at))} durationInFrames={q(2)}><Audio src={staticFile(`audio/${s.src}.mp3`)} volume={s.vol ?? 0.4} /></Sequence>)}
  </>
);

export const Reel: React.FC = () => (
  <AbsoluteFill style={{ background: C.preto, overflow: "hidden" }}>
    <Clipes /><Grade /><Flash />
    <Gancho />
    {PASSOS.map((p) => <Passo key={p.n} {...p} />)}
    <Meta />
    <Legenda />
    <MarcaDagua />
    <TelaMarca />
    <Sons />
  </AbsoluteFill>
);
export { FPS };
