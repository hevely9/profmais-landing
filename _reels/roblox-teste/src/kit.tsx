import React, { createContext, useContext } from "react";
import { DISPONIVEIS } from "./disponiveis";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// ── ÁLIBI · lote 1 — formato curto (60–75 s): gancho no 0 s, corte a cada 2–3 s, marca só no fim ──
export const FPS = 30;
export const C = { preto: "#0A0A0B", osso: "#ECE7DC", ossoE: "#9C978E", lacre: "#A3141C", verm: "#E0353F", papel: "#E4DDCB", tinta: "#1A1714", fita: "#C9A227" };
export const SERIF = "Playfair", ELITE = "Elite", SANS = "Inter", MONT = "Mont", COURIER = "Courier";
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const lin = (t: number, a: number, b: number, e: (n: number) => number = Easing.bezier(0.65, 0, 0.35, 1)) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
export const q = (t: number) => Math.round(t * FPS);
const SFX_GANHO = 0.45; // efeitos sempre discretos: nunca competir com a voz
export const SOMBRA = "0 4px 30px rgba(0,0,0,0.9)";
// Zona da legenda: y 1320–1480. Todo texto de cena fica ACIMA de 1240.

type W = { text: string; start: number; end: number };
export type Video = {
  caso: string; parte?: string; audio: string; words: W[]; lead: number; fimVozRaw: number; final: "alibi" | "parte2";
  cta: [string, string]; proximo?: string; semMarca?: boolean; fecho?: string; chave: RegExp; semLegenda?: [number, number][]; sfx: { src: string; r: number; vol?: number }[];
};
type Ctx = Video & { o: (r: number) => number; FIM_VOZ: number; FINAL: number; TOTAL: number; WORDS: W[] };
const VC = createContext<Ctx | null>(null);
export const mkCtx = (v: Video): Ctx => {
  const o = (r: number) => r + v.lead;
  const FIM_VOZ = o(v.fimVozRaw), FINAL = FIM_VOZ + 0.35;
  return { ...v, o, FIM_VOZ, FINAL, TOTAL: q(FINAL + (v.final === "alibi" ? 3.2 : 3.0)), WORDS: v.words.map((w) => ({ text: w.text, start: o(w.start), end: o(w.end) })) };
};
export const useV = () => useContext(VC)!;
export const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); const v = useV(); return { f, fps, t: f / fps, o: v.o, v }; };
const limpa = (s: string) => s.toLowerCase().replace(/[.,?!;:…]/g, "");
// início BRUTO da n-ésima ocorrência de uma palavra
export const achar = (words: W[]) => (txt: string, n = 0) => {
  const m = words.filter((x) => limpa(x.text) === txt)[n];
  if (!m) throw new Error(`palavra não encontrada: ${txt} #${n}`);
  return m.start;
};

// ── plano: corte seco com "soco" de escala + Ken Burns lento ──
export const Plano: React.FC<{ r: readonly [number, number]; children: React.ReactNode; soco?: boolean; forte?: boolean }> = ({ r, children, soco = true, forte = false }) => {
  const { t, o } = useT();
  const de = Math.max(0, o(r[0])), ate = o(r[1]);
  if (t < de - 0.001 || t >= ate) return null;
  if (forte) {
    // gancho: entra já em movimento no quadro 0 (soco 1,25→1 + leve tremor que assenta)
    const k = lin(t, 0, 0.45, Easing.out(Easing.cubic));
    const tremor = (1 - lin(t, 0, 0.6)) * 6;
    return <AbsoluteFill style={{ transform: `scale(${1.25 - 0.25 * k}) translate(${Math.sin(t * 60) * tremor}px, ${Math.cos(t * 47) * tremor}px)` }}>{children}</AbsoluteFill>;
  }
  const k = soco ? lin(t, de, de + 0.32, Easing.out(Easing.cubic)) : 1;
  return <AbsoluteFill style={{ transform: `scale(${1.07 - 0.07 * k})` }}>{children}</AbsoluteFill>;
};
// texto do gancho que entra palavra a palavra junto com a voz (nunca bloco parado)
export const TituloVivo: React.FC<{ linhas: [string, number][][]; top: number; size?: number; destaque?: string }> = ({ linhas, top, size = 92, destaque }) => {
  const { t, o } = useT();
  return <div style={{ position: "absolute", left: 50, right: 50, top, textAlign: "center" }}>
    {linhas.map((ln, i) => <div key={i} style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: size * 0.28 }}>
      {ln.map(([p, r], j) => {
        const k = lin(t, Math.max(0, o(r) - 0.06), Math.max(0, o(r) - 0.06) + 0.22, Easing.out(Easing.back(1.8)));
        const ehChave = destaque !== undefined && p === destaque;
        return <span key={j} style={{ fontFamily: MONT, fontWeight: 800, fontSize: size, lineHeight: 1.08, color: C.osso, opacity: Math.min(1, k * 1.4), transform: `scale(${1.35 - 0.35 * k}) translateY(${(1 - k) * 20}px)`, display: "inline-block",
          textShadow: SOMBRA, background: ehChave ? C.lacre : "none", padding: ehChave ? "0 14px" : 0 }}>{p}</span>;
      })}
    </div>)}
  </div>;
};
export const Clip: React.FC<{ src: string; r0: number; from?: number; zoom?: [number, number]; dur?: number; a?: number }> = ({ src, r0, from = 0, zoom = [1.04, 1.14], dur = 4, a = 0.42 }) => {
  const { t, o } = useT();
  const k = lin(t, o(r0), o(r0) + dur, Easing.linear);
  return <Sequence from={q(o(r0))} layout="none">
    <AbsoluteFill style={{ transform: `scale(${zoom[0] + (zoom[1] - zoom[0]) * k})` }}>
      <OffthreadVideo src={staticFile(`v/${src}.mp4`)} startFrom={q(from)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
    <AbsoluteFill style={{ background: `rgba(10,10,11,${a})` }} />
  </Sequence>;
};
// foto em tela cheia (só imagens grandes e nítidas)
export type Alt = { img?: string; clip?: string; credito?: string };
const temImg = (s: string) => DISPONIVEIS.includes(s);
export const Cheia: React.FC<{ src: string; r: readonly [number, number]; credito: string; pos?: string; zoom?: [number, number]; a?: number; cinza?: boolean; alt?: Alt }> = ({ src, r, credito, pos = "50% 50%", zoom = [1.04, 1.16], a = 0.35, cinza = true, alt }) => {
  const { t, o } = useT();
  if (!temImg(src) && alt?.clip) return <Clip src={alt.clip} r0={r[0]} dur={r[1] - r[0]} a={a + 0.1} />;
  if (!temImg(src) && alt?.img) return <Foto src={alt.img} r={r} credito={alt.credito ?? ""} top={400} h={760} cinza />;
  const k = lin(t, o(r[0]), o(r[1]), Easing.linear);
  return <>
    <AbsoluteFill><Img src={staticFile(`img/${src}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${zoom[0] + (zoom[1] - zoom[0]) * k})`, filter: `${cinza ? "grayscale(0.85) " : ""}contrast(1.1) brightness(0.9)` }} /></AbsoluteFill>
    <AbsoluteFill style={{ background: `rgba(10,10,11,${a})` }} />
    <Credito texto={credito} />
  </>;
};
const Credito: React.FC<{ texto: string }> = ({ texto }) => <div style={{ position: "absolute", right: 34, top: 1262, fontFamily: SANS, fontWeight: 600, fontSize: 17, color: "rgba(236,231,220,0.6)", textShadow: "0 1px 4px #000" }}>{texto}</div>;
// foto de arquivo emoldurada sobre um fundo desfocado dela mesma (sem tela preta vazia)
export const Foto: React.FC<{ src: string; r: readonly [number, number]; credito: string; top?: number; w?: number; h?: number; pos?: string; zoom?: [number, number]; rot?: number; cover?: boolean; cinza?: boolean; ext?: string; alt?: Alt; fundo?: string }> =
  ({ src, r, credito, top = 300, w = 940, h = 800, pos = "50% 50%", zoom = [1.0, 1.1], rot = 0, cover = true, cinza = false, ext = "jpg", alt, fundo }) => {
  const { t, o } = useT();
  if (!temImg(src)) {
    if (alt?.clip) return <Clip src={alt.clip} r0={r[0]} dur={r[1] - r[0]} a={0.45} />;
    if (alt?.img && temImg(alt.img)) return <Foto src={alt.img} r={r} credito={alt.credito ?? ""} top={top} w={w} h={h} zoom={zoom} cinza={cinza} fundo={fundo} />;
    return <Fundo />;
  }
  const k = lin(t, o(r[0]), o(r[1]), Easing.linear);
  const file = staticFile(`img/${src}.${ext}`);
  return <>
    {fundo ? <Clip src={fundo} r0={r[0]} dur={r[1] - r[0]} a={0.55} /> : <AbsoluteFill><Img src={file} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, filter: "blur(38px) grayscale(0.7) brightness(0.38)", transform: "scale(1.25)" }} /></AbsoluteFill>}
    <div style={{ position: "absolute", left: (1080 - w) / 2, top, width: w, height: h, transform: `rotate(${rot}deg)`, boxShadow: "0 30px 90px rgba(0,0,0,0.9)", background: "#111", border: "10px solid #D9D2C0", boxSizing: "border-box", overflow: "hidden" }}>
      <Img src={file} style={{ width: "100%", height: "100%", objectFit: cover ? "cover" : "contain", objectPosition: pos, transform: `scale(${zoom[0] + (zoom[1] - zoom[0]) * k})`, filter: `${cinza ? "grayscale(0.8) " : ""}contrast(1.08) sepia(0.12)` }} />
    </div>
    <Credito texto={credito} />
  </>;
};
export const Fundo: React.FC<{ cor?: string }> = ({ cor = "radial-gradient(ellipse at 50% 40%, #24201C 0%, #0A0A0B 75%)" }) => <AbsoluteFill style={{ background: cor }} />;

// ── texto ──
export const Surge: React.FC<{ r: number; children: React.ReactNode; style?: React.CSSProperties; dur?: number }> = ({ r, children, style, dur = 0.35 }) => {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.04, o(r) + dur, Easing.out(Easing.cubic));
  if (k <= 0) return null;
  return <div style={{ position: "absolute", left: 60, right: 60, textAlign: "center", opacity: k, filter: `blur(${(1 - k) * 6}px)`, transform: `translateY(${(1 - k) * 16}px) scale(${1.04 - 0.04 * k})`, ...style }}>{children}</div>;
};
export const Titulo: React.FC<{ r: number; children: React.ReactNode; top: number; size?: number; cor?: string }> = ({ r, children, top, size = 92, cor = C.osso }) =>
  <Surge r={r} style={{ top, fontFamily: MONT, fontWeight: 800, fontSize: size, lineHeight: 1.02, letterSpacing: "0.01em", color: cor, textShadow: SOMBRA }}>{children}</Surge>;
export const Rotulo: React.FC<{ r: number; texto: string; top: number; cor?: string; size?: number }> = ({ r, texto, top, cor = C.osso, size = 34 }) =>
  <Surge r={r} style={{ top, fontFamily: COURIER, fontWeight: 700, fontSize: size, letterSpacing: "0.06em", color: cor, textShadow: SOMBRA }}>{texto}</Surge>;
export const Grande: React.FC<{ r: number; children: React.ReactNode; top?: number; size?: number }> = ({ r, children, top = 700, size = 78 }) =>
  <Surge r={r} dur={0.7} style={{ top, fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: size, lineHeight: 1.15, color: C.osso, textShadow: SOMBRA }}>{children}</Surge>;
// faixa de destaque (marca-texto vermelho atrás da palavra)
export const Faixa: React.FC<{ r: number; texto: string; top: number; size?: number }> = ({ r, texto, top, size = 64 }) => {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.03, o(r) + 0.28, Easing.out(Easing.cubic));
  if (k <= 0) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center" }}>
    <div style={{ position: "relative", padding: "10px 26px", fontFamily: MONT, fontWeight: 800, fontSize: size, color: C.osso, lineHeight: 1.05 }}>
      <div style={{ position: "absolute", inset: 0, background: C.lacre, transformOrigin: "left", transform: `scaleX(${k})` }} />
      <span style={{ position: "relative", opacity: lin(t, o(r) + 0.05, o(r) + 0.25) }}>{texto}</span>
    </div>
  </div>;
};
export const Datilo: React.FC<{ r: number; texto: string; vel?: number }> = ({ r, texto, vel = 26 }) => {
  const { t, o } = useT();
  const n = Math.max(0, Math.floor((t - o(r)) * vel));
  if (n <= 0) return null;
  return <span>{texto.slice(0, n)}{n < texto.length && Math.floor(t * 3) % 2 === 0 ? "▌" : ""}</span>;
};
export const Carimbo: React.FC<{ r: number; texto: string; x?: number; y: number; rot?: number; size?: number }> = ({ r, texto, x = 540, y, rot = -8, size = 90 }) => {
  const { t, o } = useT();
  if (t < o(r) - 0.01) return null;
  const k = lin(t, o(r) - 0.01, o(r) + 0.1, Easing.in(Easing.cubic));
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${interpolate(k, [0, 1], [2.4, 1])})`, opacity: Math.min(1, k * 1.5),
    border: `9px solid ${C.lacre}`, borderRadius: 10, padding: "8px 24px", color: C.lacre, fontFamily: ELITE, fontSize: size, lineHeight: 1, letterSpacing: "0.06em", whiteSpace: "nowrap",
    filter: "url(#gasto)", background: "rgba(10,10,11,0.45)" }}>{texto}</div>;
};
export const Contador: React.FC<{ r: number; ate: number; valor: number; prefixo?: string; sufixo?: string; top: number; size?: number; cor?: string }> = ({ r, ate, valor, prefixo = "", sufixo = "", top, size = 150, cor = C.osso }) => {
  const { t, o } = useT();
  const k = lin(t, o(r), o(ate), Easing.out(Easing.cubic));
  if (t < o(r) - 0.05) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: size, color: cor, textShadow: SOMBRA, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
    {prefixo}{Math.round(valor * k).toLocaleString("pt-BR")}{sufixo}</div>;
};
export const Papel: React.FC<{ children: React.ReactNode; top?: number; h?: number; rot?: number }> = ({ children, top = 300, h = 860, rot = -1 }) => (
  <div style={{ position: "absolute", left: 80, right: 80, top, height: h, background: C.papel, padding: "44px 50px", boxSizing: "border-box", color: C.tinta, transform: `rotate(${rot}deg)`, boxShadow: "0 30px 80px rgba(0,0,0,0.8)" }}>{children}</div>
);
export const Cabec: React.FC<{ sup: string; titulo: string; size?: number }> = ({ sup, titulo, size = 64 }) => <>
  <div style={{ fontFamily: COURIER, fontSize: 26, letterSpacing: "0.14em", opacity: 0.7 }}>{sup}</div>
  <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: size, marginTop: 8, lineHeight: 1.04 }}>{titulo}</div>
  <div style={{ height: 3, background: C.tinta, margin: "14px 0 26px", opacity: 0.6 }} />
</>;
export const Linha: React.FC<{ r: number; texto: string; size?: number }> = ({ r, texto, size = 38 }) => <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: size, lineHeight: 1.5 }}><Datilo r={r} texto={texto} vel={42} /></div>;
export const Fita: React.FC<{ r: number; y: number; rot: number; texto?: string }> = ({ r, y, rot, texto = "CENA DO CRIME · NÃO ULTRAPASSE · " }) => {
  const { t, o } = useT();
  const k = lin(t, o(r), o(r) + 0.4, Easing.out(Easing.cubic));
  if (k <= 0) return null;
  return <div style={{ position: "absolute", left: -300, width: 1700, top: y, height: 70, background: C.fita, transform: `rotate(${rot}deg) translateX(${(1 - k) * -1700}px)`, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.6)", opacity: 0.94 }}>
    <div style={{ whiteSpace: "nowrap", fontFamily: MONT, fontWeight: 800, fontSize: 36, lineHeight: "70px", color: "#111", transform: `translateX(${-(t - o(r)) * 40}px)`, letterSpacing: "0.08em" }}>{texto.repeat(8)}</div>
  </div>;
};
export const Marcador: React.FC<{ r: number; x: number; y: number; texto: string }> = ({ r, x, y, texto }) => {
  const { t, o } = useT();
  const k = lin(t, o(r), o(r) + 0.4, Easing.out(Easing.back(2)));
  if (k <= 0) return null;
  const pulso = (t - o(r)) % 1.2 / 1.2;
  return <div style={{ position: "absolute", left: x, top: y }}>
    <div style={{ position: "absolute", left: -60, top: -60, width: 120, height: 120, borderRadius: "50%", border: `4px solid ${C.lacre}`, transform: `scale(${0.4 + pulso})`, opacity: 1 - pulso }} />
    <div style={{ position: "absolute", left: -16, top: -16, width: 32, height: 32, borderRadius: "50%", background: C.lacre, transform: `scale(${k})`, boxShadow: "0 0 20px rgba(163,20,28,0.8)" }} />
    <div style={{ position: "absolute", left: 30, top: -24, padding: "6px 14px", background: C.preto, color: C.osso, fontFamily: COURIER, fontWeight: 700, fontSize: 30, whiteSpace: "nowrap", opacity: k }}>{texto}</div>
  </div>;
};

// ── fim: pergunta + marca (ou chamada da parte 2) ──
export const TelaFinal: React.FC = () => {
  const { f, fps, t, v } = useT();
  const { FINAL } = v;
  if (t < FINAL - 0.3) return null;
  const sp = (at: number, cfg = { damping: 18, stiffness: 120 }) => spring({ frame: f - q(at), fps, config: cfg });
  const a = sp(FINAL, { damping: 20, stiffness: 90 }), b = sp(FINAL + 0.5), c = sp(FINAL + 1.0);
  if (v.semMarca) {
    return <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #1E2A44 0%, #0A0A0B 75%)", opacity: lin(t, FINAL - 0.3, FINAL) }}>
      <div style={{ position: "absolute", left: 60, right: 60, top: 470, textAlign: "center", opacity: a, transform: `scale(${0.9 + 0.1 * a})` }}>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 104, lineHeight: 1.02, color: C.osso }}>{v.fecho ?? "SEGUE PRA MAIS DICAS"}</div>
        <div style={{ display: "inline-block", marginTop: 34, padding: "12px 30px", background: "#E3B23C", fontFamily: MONT, fontWeight: 800, fontSize: 52, color: "#111" }}>DE ROBLOX</div>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 1020, textAlign: "center", padding: "26px 30px", border: `2px solid rgba(236,231,220,0.35)`, opacity: c }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.osso, lineHeight: 1.25 }}>{v.cta[0]}</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: "#E3B23C", marginTop: 12 }}>{v.cta[1]}</div>
      </div>
    </AbsoluteFill>;
  }
  if (v.final === "parte2") {
    const pisca = Math.floor(t * 2) % 2 === 0;
    return <AbsoluteFill style={{ background: C.preto, opacity: lin(t, FINAL - 0.3, FINAL) }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", opacity: a, transform: `scale(${0.9 + 0.1 * a})` }}>
        <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 34, letterSpacing: "0.4em", color: C.ossoE }}>CONTINUA</div>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 210, color: C.osso, lineHeight: 1, marginTop: 20 }}>PARTE 2</div>
        <div style={{ height: 4, width: 320, margin: "26px auto", background: C.lacre }} />
        <div style={{ fontFamily: ELITE, fontSize: 52, color: C.osso, opacity: b }}>o erro que entregou tudo</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1060, display: "flex", justifyContent: "center", opacity: c }}>
        <div style={{ padding: "20px 40px", border: `3px solid ${pisca ? C.verm : "rgba(236,231,220,0.4)"}`, fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.osso }}>assista no perfil ↗</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1560, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 64, letterSpacing: "0.12em", color: C.osso, opacity: b }}>ÁLIBI</div>
    </AbsoluteFill>;
  }
  return <AbsoluteFill style={{ background: C.preto, opacity: lin(t, FINAL - 0.3, FINAL) }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: v.proximo ? 200 : 290, display: "flex", justifyContent: "center", opacity: a, transform: `scale(${0.92 + 0.08 * a})` }}>
      <div style={{ width: v.proximo ? 260 : 340, height: v.proximo ? 260 : 340, borderRadius: "50%", overflow: "hidden", border: `2px solid rgba(236,231,220,0.3)` }}><Img src={staticFile("img/perfil.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: v.proximo ? 490 : 680, textAlign: "center", opacity: a }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 130, letterSpacing: "0.12em", color: C.osso }}>ÁLIBI</div>
      <div style={{ height: 3, width: 260, margin: "10px auto 20px", background: C.lacre }} />
      <div style={{ fontFamily: ELITE, fontSize: 34, color: C.ossoE, opacity: b }}>toda história tem um álibi.</div>
      {v.proximo && <div style={{ marginTop: 34, opacity: b }}>
        <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 34, letterSpacing: "0.12em", color: C.verm }}>PRÓXIMO CASO</div>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 52, color: C.osso, marginTop: 8, lineHeight: 1.1, padding: "0 70px" }}>{v.proximo}</div>
        <div style={{ display: "inline-block", marginTop: 22, padding: "10px 26px", background: C.lacre, fontFamily: SANS, fontWeight: 800, fontSize: 38, color: C.osso }}>SEGUE O ÁLIBI</div>
      </div>}
    </div>
    <div style={{ position: "absolute", left: 90, right: 90, top: v.proximo ? 1150 : 1040, textAlign: "center", padding: "26px 30px", border: `2px solid rgba(236,231,220,0.35)`, opacity: c }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 42, color: C.osso, lineHeight: 1.25 }}>{v.cta[0]}</div>
      <div style={{ fontFamily: ELITE, fontSize: 32, color: C.verm, marginTop: 12 }}>{v.cta[1]}</div>
    </div>
  </AbsoluteFill>;
};
export const Hud: React.FC = () => {
  const { t, v } = useT();
  if (v.semMarca) return null;
  const vis = lin(t, 3.0, 3.4) * (1 - lin(t, v.FIM_VOZ - 0.2, v.FIM_VOZ + 0.2));
  if (vis <= 0) return null;
  return <div style={{ position: "absolute", left: 60, right: 60, top: 70, display: "flex", justifyContent: "space-between", fontFamily: COURIER, fontWeight: 700, fontSize: 26, color: "rgba(236,231,220,0.65)", opacity: vis }}>
    <span><span style={{ color: C.lacre, opacity: Math.floor(t * 1.5) % 2 ? 1 : 0.25 }}>●</span> REC</span><span style={{ background: "rgba(10,10,11,0.55)", padding: "4px 12px" }}>ÁLIBI · CASO {v.caso}{v.parte ? <span style={{ color: C.verm }}> · {v.parte}</span> : null}</span>
  </div>;
};
export const Legenda: React.FC = () => {
  const { t, v } = useT();
  const pages = React.useMemo(() => {
    const ps: { de: number; ate: number; ws: W[] }[] = [];
    let cur: W[] = [];
    v.WORDS.forEach((w, i) => {
      cur.push(w);
      if (/[.,?!]$/.test(w.text) || cur.length >= 3 || i === v.WORDS.length - 1) { ps.push({ de: cur[0].start, ate: 0, ws: cur }); cur = []; }
    });
    ps.forEach((p, i) => { p.ate = i < ps.length - 1 ? Math.min(ps[i + 1].de, p.ws[p.ws.length - 1].end + 0.6) : v.FIM_VOZ + 0.2; });
    return ps;
  }, [v]);
  if ((v.semLegenda ?? []).some(([a, b]) => t >= v.o(a) && t < v.o(b))) return null;
  const pg = pages.find((p) => t >= p.de - 0.05 && t < p.ate);
  if (!pg || t > v.FIM_VOZ + 0.2) return null;
  return <div style={{ position: "absolute", left: 70, right: 170, top: 1340, display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: 16, rowGap: 4 }}>
    {pg.ws.map((w, i) => {
      const dita = t >= w.start - 0.03;
      const txt = w.text.replace(/[,;:]$/, "");
      const chave = v.chave.test(txt.replace(/[.?!]$/, ""));
      return <span key={i} style={{ fontFamily: SANS, fontWeight: 800, fontSize: 56, lineHeight: 1.15, color: dita ? (chave ? C.verm : C.osso) : "rgba(236,231,220,0.35)", textShadow: "0 3px 14px rgba(0,0,0,0.95), 0 0 2px #000" }}>{txt}</span>;
    })}
  </div>;
};
export const Textura: React.FC = () => {
  const { f } = useT();
  return <>
    <svg width="0" height="0" style={{ position: "absolute" }}><filter id="gasto"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" /><feDisplacementMap in="SourceGraphic" scale="5" /></filter></svg>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(0,0,0,0.7) 100%)" }} />
    <AbsoluteFill style={{ opacity: 0.08, mixBlendMode: "overlay" }}>
      <svg width="1080" height="1920"><filter id="grao"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 30} /></filter><rect width="1080" height="1920" filter="url(#grao)" /></svg>
    </AbsoluteFill>
  </>;
};
const Sons: React.FC = () => {
  const { v } = useT();
  return <>
    <Sequence from={q(v.lead)}><Audio src={staticFile(`audio/${v.audio}.mp3`)} /></Sequence>
    <Audio src={staticFile("audio/trilha.mp3")} volume={(fr) => interpolate(fr, [0, q(v.FIM_VOZ), q(v.FINAL + 0.4)], [0.3, 0.3, 0.5], clamp) * interpolate(fr, [v.TOTAL - 40, v.TOTAL - 2], [1, 0], clamp)} />
    <Sequence from={q(v.FINAL)} durationInFrames={q(3)}><Audio src={staticFile("audio/impacto.mp3")} volume={0.4 * SFX_GANHO} /></Sequence>
    {v.sfx.map((s, i) => <Sequence key={i} from={Math.max(0, q(v.o(s.r)))} durationInFrames={q(3)}><Audio src={staticFile(`audio/${s.src}.mp3`)} volume={(s.vol ?? 0.4) * SFX_GANHO} /></Sequence>)}
  </>;
};
// moldura comum a todos os vídeos do lote
export const Reel: React.FC<{ ctx: Ctx; children: React.ReactNode }> = ({ ctx, children }) => (
  <VC.Provider value={ctx}>
    <AbsoluteFill style={{ background: C.preto, overflow: "hidden" }}>
      {children}
      <Legenda />
      <Hud />
      <TelaFinal />
      <Textura />
      <Sons />
    </AbsoluteFill>
  </VC.Provider>
);
export const Assinatura: React.FC<{ r: number }> = ({ r }) =>
  <Surge r={r} dur={0.6} style={{ top: 900, fontFamily: ELITE, fontSize: 54, color: C.ossoE, textShadow: SOMBRA }}>…e esse era o álibi.</Surge>;
