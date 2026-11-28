import React from "react";
import { AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAY_LINES, FPS, NARR_SEGS, P, SFX, SHOTS, TOTAL, WORDS } from "./timeline";

// ── tema ──────────────────────────────────────────────────────────────────
const C = { creme: "#F6ECDD", tinta: "#22180F", laranja: "#E8743B", verde: "#1E5C46", verdeEsc: "#10261E", areia: "#EFDCA9" };
const E = { out: Easing.bezier(0.16, 1, 0.3, 1), in: Easing.bezier(0.7, 0, 0.84, 0), inOut: Easing.bezier(0.83, 0, 0.17, 1) };
const SP = { snappy: { damping: 14, stiffness: 160, mass: 0.6 }, bouncy: { damping: 11, stiffness: 170, mass: 0.7 }, smooth: { damping: 20, stiffness: 90, mass: 1 } };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const q = (s: number) => Math.round(s * FPS);
const DISPLAY = "Montserrat";
const SAFE_X = 96;

// entrada (spring, 3 propriedades) e saída mais rápida
const useInOut = (de: number, ate: number) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: f - q(de), fps, config: SP.smooth });
  const e = interpolate(f, [q(ate) - 8, q(ate)], [0, 1], { ...clamp, easing: E.in });
  return { f, p, e, vis: f >= q(de) - 1 && f <= q(ate) + 1,
    style: { opacity: Math.min(1, p * 1.4) * (1 - e), transform: `translateY(${(1 - p) * 60 - e * 40}px) scale(${0.94 + 0.06 * p - 0.04 * e})` } as React.CSSProperties };
};

// ── cenas de vídeo ────────────────────────────────────────────────────────
const Shots: React.FC = () => (
  <>
    {SHOTS.map((s, i) => {
      const from = q(s.from), dur = Math.max(1, q(s.to) - from) + 2;
      return (
        <Sequence key={i} from={from} durationInFrames={dur}>
          <ShotView src={s.src} rate={s.rate ?? 1} startFrom={s.startFrom ?? 0} blur={!!s.blur} dur={dur} />
        </Sequence>
      );
    })}
  </>
);
const ShotView: React.FC<{ src: string; rate: number; startFrom: number; blur: boolean; dur: number }> = ({ src, rate, startFrom, blur, dur }) => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, dur], blur ? [1.12, 1.18] : [1.0, 1.06], { ...clamp, easing: E.inOut });
  const flash = interpolate(f, [0, 4], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: C.verdeEsc }}>
      <OffthreadVideo src={staticFile(`video/${src}.mp4`)} playbackRate={rate} startFrom={Math.round(startFrom * FPS)} muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`,
          filter: blur ? "blur(22px) brightness(0.5) saturate(1.15)" : "saturate(1.08) contrast(1.04)" }} />
      <AbsoluteFill style={{ background: C.creme, opacity: flash * 0.18 }} />
    </AbsoluteFill>
  );
};

// ── peças de interface ────────────────────────────────────────────────────
const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: C.creme, color: C.tinta, borderRadius: 32, padding: "34px 40px", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)",
    border: "4px solid rgba(255,255,255,0.6)", ...style }}>{children}</div>
);
const Check: React.FC<{ at: number; size?: number }> = ({ at, size = 52 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: f - q(at), fps, config: SP.bouncy });
  return <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `scale(${p})`, flex: "none" }}>
    <circle cx="50" cy="50" r="46" fill={C.verde} />
    <path d="M28 52 L44 67 L73 36" fill="none" stroke={C.creme} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"
      strokeDasharray="70" strokeDashoffset={70 * (1 - Math.min(1, Math.max(0, (f - q(at) - 2) / 7)))} />
  </svg>;
};
const Pasta: React.FC<{ cor?: string; size?: number }> = ({ cor = "#7FA8E0", size = 64 }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 100 80" style={{ flex: "none" }}>
    <path d="M4 14 Q4 6 12 6 H38 L46 15 H88 Q96 15 96 23 V70 Q96 76 88 76 H12 Q4 76 4 70 Z" fill={cor} />
    <path d="M4 26 H96 V70 Q96 76 88 76 H12 Q4 76 4 70 Z" fill="rgba(255,255,255,0.18)" />
  </svg>
);

const Titulo: React.FC = () => {
  const { vis, style, f } = useInOut(P.titulo[0], P.titulo[1]);
  const { fps } = useVideoConfig();
  if (!vis) return null;
  return (
    <div style={{ position: "absolute", top: 300, left: SAFE_X, right: SAFE_X, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, ...style }}>
      <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 82, lineHeight: 1.0, letterSpacing: "-0.03em", color: C.creme, textAlign: "center",
        textShadow: "0 6px 30px rgba(0,0,0,0.55)" }}>EDITOR DE VÍDEO<br />COM <span style={{ color: C.laranja }}>IA</span></div>
      <div style={{ display: "flex", gap: 14 }}>
        {[1, 2, 3, 4].map((n) => {
          const p = spring({ frame: f - q(P.titulo[0]) - 10 - n * 4, fps, config: SP.bouncy });
          return <div key={n} style={{ width: 66, height: 66, borderRadius: 18, background: C.creme, color: C.tinta, display: "grid", placeItems: "center",
            fontFamily: DISPLAY, fontWeight: 900, fontSize: 36, transform: `scale(${p}) rotate(${(1 - p) * -20}deg)`, boxShadow: "0 12px 30px rgba(0,0,0,0.4)" }}>{n}</div>;
        })}
        <div style={{ alignSelf: "center", marginLeft: 8, fontFamily: DISPLAY, fontWeight: 800, fontSize: 34, color: C.creme, textShadow: "0 4px 16px rgba(0,0,0,0.6)" }}>PASSOS</div>
      </div>
    </div>
  );
};

const SeloPasso: React.FC<{ n: number; nome: string; de: number; ate: number }> = ({ n, nome, de, ate }) => {
  const { vis, style, f } = useInOut(de, ate);
  const { fps } = useVideoConfig();
  if (!vis) return null;
  const big = spring({ frame: f - q(de), fps, config: SP.bouncy });
  return (
    <div style={{ position: "absolute", top: 290, left: SAFE_X, display: "flex", alignItems: "center", gap: 16, ...style }}>
      <div style={{ width: 92, height: 92, borderRadius: 26, background: C.laranja, color: C.creme, display: "grid", placeItems: "center",
        fontFamily: DISPLAY, fontWeight: 900, fontSize: 56, transform: `rotate(${(1 - big) * 25 - 4}deg)`, boxShadow: "0 14px 34px rgba(0,0,0,0.45)" }}>{n}</div>
      <div style={{ background: "rgba(16,38,30,0.86)", color: C.creme, padding: "16px 24px", borderRadius: 20, fontFamily: DISPLAY, fontWeight: 800,
        fontSize: 34, letterSpacing: "0.02em" }}>PASSO {n} · <span style={{ color: C.areia }}>{nome}</span></div>
    </div>
  );
};

const Pastas: React.FC = () => {
  const { vis, style } = useInOut(P.pastas.de, P.pastas.ate);
  if (!vis) return null;
  const nomes = ["Vídeo bruto", "Referências", "Vídeos prontos"];
  return (
    <div style={{ position: "absolute", top: 470, left: SAFE_X, right: SAFE_X, ...style }}>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: DISPLAY, fontWeight: 800, fontSize: 40 }}><Pasta cor={C.laranja} size={78} />Editor de vídeo com IA</div>
        <div style={{ marginLeft: 38, borderLeft: `5px solid ${C.verde}`, paddingLeft: 34, marginTop: 18, display: "flex", flexDirection: "column", gap: 20 }}>
          {nomes.map((n, i) => <Item key={n} at={P.pastas.itens[i]}><Pasta size={58} /><span>{n}</span></Item>)}
        </div>
      </Card>
    </div>
  );
};
const Item: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: f - q(at), fps, config: SP.snappy });
  return <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: "Lato", fontWeight: 900, fontSize: 38, opacity: p,
    transform: `translateX(${(1 - p) * -60}px) scale(${0.9 + 0.1 * p})` }}>{children}</div>;
};

const Local: React.FC = () => {
  const { vis, style, f } = useInOut(P.local.de, P.local.ate);
  if (!vis) return null;
  const on = interpolate(f, [q(P.local.check), q(P.local.check) + 8], [0, 1], { ...clamp, easing: E.out });
  return (
    <div style={{ position: "absolute", top: 470, left: SAFE_X, right: SAFE_X, ...style }}>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ background: "#E7D9C3", padding: "18px 26px", display: "flex", gap: 12, alignItems: "center" }}>
          {["#E8743B", "#E5B547", "#5FA36A"].map((c) => <div key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c }} />)}
          <span style={{ marginLeft: 14, fontFamily: DISPLAY, fontWeight: 800, fontSize: 30 }}>Claude Code · nova sessão</span>
        </div>
        <div style={{ padding: "30px 34px", display: "flex", flexDirection: "column", gap: 22, fontFamily: "Lato", fontWeight: 900, fontSize: 36 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Ambiente</span>
            <div style={{ display: "flex", background: "#E7D9C3", borderRadius: 999, padding: 6 }}>
              <span style={{ padding: "10px 24px", borderRadius: 999, opacity: 1 - on * 0.6 }}>Nuvem</span>
              <span style={{ padding: "10px 24px", borderRadius: 999, background: on > 0.5 ? C.verde : "transparent", color: on > 0.5 ? C.creme : C.tinta }}>Local</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#EFE3D0", borderRadius: 18, padding: "16px 20px" }}>
            <Pasta cor={C.laranja} size={50} /><span style={{ fontSize: 32 }}>Editor de vídeo com IA</span>
            <div style={{ marginLeft: "auto" }}><Check at={P.local.check + 0.2} size={50} /></div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const Ferramentas: React.FC = () => {
  const { vis, style } = useInOut(P.ferramentas.de, P.ferramentas.ate);
  if (!vis) return null;
  const tools = [["FFmpeg", "corta e junta"], ["Whisper", "fala vira legenda"], ["yt-dlp", "baixa as referências"], ["HyperFrames", "faz as animações"]];
  return (
    <div style={{ position: "absolute", top: 450, left: SAFE_X, right: SAFE_X, display: "flex", flexDirection: "column", gap: 20, ...style }}>
      {tools.map(([n, d], i) => <Tool key={n} at={P.ferramentas.itens[i]} nome={n} desc={d} />)}
    </div>
  );
};
const Tool: React.FC<{ at: number; nome: string; desc: string }> = ({ at, nome, desc }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: f - q(at) + 4, fps, config: SP.snappy });
  return (
    <Card style={{ padding: "22px 28px", display: "flex", alignItems: "center", gap: 22, opacity: p, transform: `translateX(${(1 - p) * 120}px) rotate(${(1 - p) * 4}deg)` }}>
      <div style={{ width: 70, height: 70, borderRadius: 18, background: C.verde, display: "grid", placeItems: "center", flex: "none" }}>
        <svg width="40" height="40" viewBox="0 0 100 100"><path d="M62 10 a26 26 0 0 0 -24 36 L10 74 l16 16 l28 -28 a26 26 0 0 0 36 -24 l-16 16 l-14 -4 l-4 -14 Z" fill={C.creme} /></svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 40, letterSpacing: "-0.01em" }}>{nome}</div>
        <div style={{ fontFamily: "Lato", fontWeight: 700, fontSize: 30, opacity: 0.72 }}>{desc}</div>
      </div>
      <Check at={at + 0.25} size={58} />
    </Card>
  );
};

const Folha: React.FC = () => {
  const { vis, style } = useInOut(P.folha.de, P.folha.ate);
  if (!vis) return null;
  const itens = ["Cortes", "Legenda", "Ritmo", "Música", "Cor"];
  return (
    <div style={{ position: "absolute", top: 450, left: SAFE_X + 30, right: SAFE_X + 30, ...style }}>
      <Card style={{ transform: "rotate(-2deg)" }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 42, borderBottom: `4px dashed ${C.verde}`, paddingBottom: 14, marginBottom: 18 }}>FOLHA DE ESTILO</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {itens.map((n, i) => <Item key={n} at={P.folha.itens[i] - 0.1}><Check at={P.folha.itens[i]} size={50} /><span>{n}</span></Item>)}
        </div>
      </Card>
    </div>
  );
};

const PROMPT = "Edita o vídeo da pasta vídeo bruto seguindo a folha de estilo. Corta as pausas, põe legenda e efeito sonoro e me mostra o storyboard antes de exportar.";
const Prompt: React.FC = () => {
  const { vis, style, f } = useInOut(P.prompt.de, P.prompt.ate);
  if (!vis) return null;
  const n = Math.floor(interpolate(f, [q(P.prompt.de) + 6, q(P.prompt.de) + q(4.6)], [0, PROMPT.length], { ...clamp, easing: E.inOut }));
  const cursor = Math.floor(f / 8) % 2 === 0;
  return (
    <div style={{ position: "absolute", top: 450, left: SAFE_X, right: SAFE_X, ...style }}>
      <Card>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 28, letterSpacing: "0.08em", color: C.verde, marginBottom: 16 }}>PROMPT DE EDIÇÃO</div>
        <div style={{ fontFamily: "Lato", fontWeight: 700, fontSize: 40, lineHeight: 1.32, minHeight: 330 }}>
          {PROMPT.slice(0, n)}<span style={{ opacity: cursor ? 1 : 0, color: C.laranja }}>▍</span>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <div style={{ background: C.laranja, color: C.creme, borderRadius: 999, padding: "12px 28px", fontFamily: DISPLAY, fontWeight: 900, fontSize: 30,
            opacity: n >= PROMPT.length ? 1 : 0.35 }}>ENVIAR ↵</div>
        </div>
      </Card>
    </div>
  );
};

const Balao: React.FC<{ from: number; texto: string }> = ({ from, texto }) => {
  const { vis, style } = useInOut(from, from + 2.05);
  if (!vis) return null;
  return (
    <div style={{ position: "absolute", top: 520, left: SAFE_X + 40, right: SAFE_X + 40, display: "flex", justifyContent: "center", ...style }}>
      <div style={{ position: "relative", background: C.creme, color: C.tinta, borderRadius: 40, padding: "26px 40px", fontFamily: DISPLAY, fontWeight: 900,
        fontSize: 50, boxShadow: "0 30px 60px -10px rgba(0,0,0,0.55)" }}>
        {texto}
        <div style={{ position: "absolute", bottom: -26, left: "50%", marginLeft: -20, width: 0, height: 0, borderLeft: "20px solid transparent",
          borderRight: "20px solid transparent", borderTop: `30px solid ${C.creme}` }} />
      </div>
    </div>
  );
};

const CTA: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  if (f < q(P.cta.de)) return null;
  const p0 = spring({ frame: f - q(P.cta.de), fps, config: SP.smooth });
  const p = spring({ frame: f - q(P.cta.pill), fps, config: SP.bouncy });
  const p2 = spring({ frame: f - q(P.cta.sub), fps, config: SP.smooth });
  const pulse = 1 + 0.03 * Math.sin((f - q(P.cta.pill)) / 4);
  return (
    <div style={{ position: "absolute", top: 330, left: SAFE_X - 40, right: SAFE_X - 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 66, color: C.creme, opacity: p0, transform: `translateY(${(1 - p0) * 30}px)`,
        letterSpacing: "-0.01em", textShadow: "0 6px 26px rgba(0,0,0,0.6)" }}>FICOU DÚVIDA?</div>
      <div style={{ background: C.laranja, color: C.creme, borderRadius: 34, padding: "16px 40px", fontFamily: DISPLAY, fontWeight: 900, fontSize: 86,
        letterSpacing: "-0.02em", whiteSpace: "nowrap", transform: `scale(${p * (f > q(P.cta.pill) + 15 ? pulse : 1)}) rotate(${(1 - p) * -10}deg)`, opacity: Math.min(1, p * 2),
        boxShadow: "0 30px 70px -10px rgba(232,116,59,0.55)" }}>COMENTA AQUI</div>
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 44, color: C.areia, opacity: p2, transform: `translateY(${(1 - p2) * 20}px)`,
        textShadow: "0 4px 18px rgba(0,0,0,0.65)" }}>que eu te ajudo</div>
    </div>
  );
};

// ── legenda karaokê (tempo por palavra do ElevenLabs Speech to Text) ───────
const KEY = /^(ia|passo|ffmpeg|whisper|yt-dlp|hyperframes|dúvida|comenta|local|estilo|storyboard|referências|ambiente|ferramentas)/i;
const PAGES: { de: number; ate: number; w: typeof WORDS }[] = (() => {
  const out: { de: number; ate: number; w: typeof WORDS }[] = []; let cur: typeof WORDS = [];
  WORDS.forEach((w, i) => {
    cur.push(w);
    const nx = WORDS[i + 1];
    const len = cur.map((x) => x.text).join(" ").length;
    if (!nx || /[.,:;?!…]$/.test(w.text) || len >= 16 || cur.length >= 4 || nx.start - w.end > 0.45) { out.push({ de: cur[0].start, ate: w.end, w: cur }); cur = []; }
  });
  return out.map((p, i) => ({ ...p, ate: out[i + 1] && out[i + 1].de - p.ate < 0.5 ? out[i + 1].de : p.ate + 0.35 }));
})();
const Legenda: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const t = f / fps;
  const pg = PAGES.find((p) => t >= p.de - 0.07 && t < p.ate - 0.07);
  if (!pg) return null;
  const pin = spring({ frame: f - q(pg.de - 0.07), fps, config: SP.snappy });
  return (
    <div style={{ position: "absolute", top: 1300, left: SAFE_X, right: SAFE_X, display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: 30,
      transform: `translateY(${(1 - pin) * 18}px) scale(${0.95 + 0.05 * pin})`, opacity: Math.min(1, pin * 1.6) }}>
      {pg.w.map((w, i) => {
        const on = t >= w.start - 0.07;
        const k = KEY.test(w.text);
        return <span key={i} style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 70, lineHeight: 1.08, textTransform: "uppercase", letterSpacing: "-0.01em",
          color: on ? (k ? C.laranja : C.creme) : "rgba(246,236,221,0.45)", WebkitTextStroke: "9px rgba(16,12,8,0.85)", paintOrder: "stroke fill",
          transform: `scale(${on && t - w.start < 0.15 ? 1.08 : 1})` }}>{w.text.replace(/[,;:]$/, "")}</span>;
      })}
    </div>
  );
};

// ── acabamento: grade, grão, vinheta ──────────────────────────────────────
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
const Acabamento: React.FC = () => {
  const f = useCurrentFrame();
  return <>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35), transparent 22%, transparent 62%, rgba(0,0,0,0.55))" }} />
    <AbsoluteFill style={{ backgroundImage: NOISE, backgroundSize: "220px", backgroundPosition: `${(f * 7) % 220}px ${(f * 13) % 220}px`, opacity: 0.07, mixBlendMode: "overlay" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.38) 100%)" }} />
  </>;
};

// ── áudio: narração (3 trechos), falas do Clay, trilha com ducking, efeitos ─
const narrando = (t: number) => NARR_SEGS.some((s) => t >= s.from - 0.1 && t <= s.from + (s.end - s.start) + 0.15)
  || CLAY_LINES.some((c) => t >= c.from - 0.1 && t <= c.from + (c.end - c.start) + 0.1);
const Sons: React.FC = () => (
  <>
    {NARR_SEGS.map((s, i) => <Sequence key={`n${i}`} from={q(s.from)} durationInFrames={q(s.end - s.start) + 2}>
      <Audio src={staticFile("audio/narracao.mp3")} startFrom={q(s.start)} endAt={q(s.end)} volume={1} /></Sequence>)}
    {CLAY_LINES.map((c, i) => <Sequence key={`c${i}`} from={q(c.from)} durationInFrames={q(c.end - c.start) + 2}>
      <Audio src={staticFile("audio/clay.mp3")} startFrom={q(c.start)} endAt={q(c.end)} volume={1} /></Sequence>)}
    <Audio src={staticFile("audio/trilha.mp3")} volume={(f) => {
      const t = f / FPS;
      // ducking suave: média de 0,3 s ao redor para não "bombear"
      let d = 0; for (let k = -4; k <= 4; k++) d += narrando(t + k * 0.04) ? 1 : 0; d /= 9;
      const fadeOut = interpolate(f, [TOTAL - q(2.2), TOTAL - 4], [1, 0], clamp);
      return (0.3 - 0.21 * d) * fadeOut;
    }} />
    {SFX.map((s, i) => <Sequence key={`s${i}`} from={Math.max(0, q(s.at))} durationInFrames={q(2.2)}>
      <Audio src={staticFile(`audio/${s.src}.mp3`)} volume={s.vol ?? 0.6} /></Sequence>)}
  </>
);

export const Reel: React.FC<{ legenda: boolean }> = ({ legenda }) => (
  <AbsoluteFill style={{ background: C.verdeEsc }}>
    <Shots />
    <Acabamento />
    <Titulo />
    {P.passos.map((p) => <SeloPasso key={p.n} {...p} />)}
    <Pastas /><Local /><Ferramentas /><Folha /><Prompt />
    {CLAY_LINES.map((c, i) => <Balao key={i} from={c.from} texto={c.texto} />)}
    <CTA />
    {legenda && <Legenda />}
    <Sons />
  </AbsoluteFill>
);
