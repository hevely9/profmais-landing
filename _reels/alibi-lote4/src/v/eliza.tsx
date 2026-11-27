import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import we4 from "../../public/palavras-eliza-e4.json";
import we2 from "../../public/palavras-eliza-e2.json";
import { C, COURIER, MONT, SANS, SERIF, clamp } from "../kit";

// ÁLIBI · EDIT TRISTE — Eliza Samudio (27/11/2026). Fontes: vídeos enviados pelo usuário (TikTok @editsx._ofc) com trechos de
// “A Vítima Invisível: O Caso Eliza Samudio” (Netflix), incluindo o vídeo de Eliza no aeroporto e a entrevista em que ela conta as
// ameaças. Tom: pelo lado da vítima, melancólico e respeitoso; nada gráfico. Trilha: “Ode to Loneliness”, Diego Nava (Mixkit, licença livre).

type W = { text: string; start: number; end: number };
const FONTES: Record<string, { src: string; w: number; h: number; words?: W[] }> = {
  e4: { src: "v/eliza/e4.mp4", w: 1080, h: 1920, words: (we4 as { words: W[] }).words },
  e2: { src: "v/eliza/e2.mp4", w: 576, h: 1024, words: (we2 as { words: W[] }).words },
};
type Crop = [number, number, number, number];
// um plano da montagem: vídeo (recortado) OU foto; o áudio pode vir de outro trecho
type Plano = { at: number; dur: number; v?: { f: string; from: number; crop?: Crop }; img?: string; pos?: string; a?: { f: string; from: number; dur: number; vol?: number } };
type Fix = [number, string]; // [índice da palavra na linha do tempo, texto correto]

const useS = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return f / fps; };
const entra = (t: number, de: number, ate: number, d = 0.4) => interpolate(t, [de, de + d, ate - d, ate], [0, 1, 1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });

// mostra a região crop do vídeo dentro da caixa, sem deformar (cover)
const VideoCrop: React.FC<{ f: string; from: number; crop?: Crop; bw: number; bh: number; muted?: boolean; style?: React.CSSProperties }> = ({ f, from, crop, bw, bh, style }) => {
  const F = FONTES[f];
  const [x, y, w, h] = crop ?? [0, 0, F.w, F.h];
  const s = Math.max(bw / w, bh / h);
  return <div style={{ position: "absolute", inset: 0, overflow: "hidden", ...style }}>
    <OffthreadVideo src={staticFile(F.src)} muted startFrom={Math.round(from * 30)}
      style={{ position: "absolute", width: F.w * s, height: F.h * s, left: -x * s + (bw - w * s) / 2, top: -y * s + (bh - h * s) / 2, maxWidth: "none" }} />
  </div>;
};

const FotoContain: React.FC<{ img: string; z: number }> = ({ img, z }) => <>
  <Img src={staticFile(`img/${img}.jpg`)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(30px) brightness(0.42)", transform: "scale(1.15)" }} />
  <Img src={staticFile(`img/${img}.jpg`)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", transform: `scale(${z})` }} />
</>;

// planos com fusão curta (0,2 s) entre eles; o áudio entra e sai com rampa curta (sem estalo)
const XF = 0.2;
const Planos: React.FC<{ planos: Plano[]; bw: number; bh: number }> = ({ planos, bw, bh }) => <>
  {planos.map((p, i) => {
    const de = Math.max(0, p.at - (i ? XF : 0));
    const fim = p.at + p.dur + (i < planos.length - 1 ? XF : 0);
    return <Sequence key={i} from={Math.round(de * 30)} durationInFrames={Math.max(1, Math.round((fim - de) * 30))}>
      <PlanoV p={p} de={de} bw={bw} bh={bh} primeiro={i === 0} />
    </Sequence>;
  })}
</>;
const PlanoV: React.FC<{ p: Plano; de: number; bw: number; bh: number; primeiro: boolean }> = ({ p, de, bw, bh, primeiro }) => {
  const t = useS() + de;
  const op = primeiro ? 1 : interpolate(t, [p.at - XF, p.at], [0, 1], clamp);
  const z = interpolate(t, [p.at, p.at + p.dur], [1.0, 1.04], clamp);
  return <AbsoluteFill style={{ opacity: op }}>
    {p.v && <VideoCrop f={p.v.f} from={p.v.from - (p.at - de)} crop={p.v.crop} bw={bw} bh={bh} />}
    {p.img && <FotoContain img={p.img} z={z} />}
  </AbsoluteFill>;
};
const Audios: React.FC<{ planos: Plano[] }> = ({ planos }) => <>
  {planos.filter((p) => p.a).map((p, i) => {
    const a = p.a!; const D = a.dur;
    return <Sequence key={i} from={Math.round(p.at * 30)} durationInFrames={Math.round(D * 30)}>
      <Audio src={staticFile(FONTES[a.f].src)} startFrom={Math.round(a.from * 30)}
        volume={(f) => (a.vol ?? 1) * interpolate(f / 30, [0, 0.08, D - 0.1, D], [0, 1, 1, 0], clamp)} />
    </Sequence>;
  })}
</>;

// palavras da linha do tempo, tiradas da transcrição de cada trecho de áudio
const palavras = (planos: Plano[], fix: Fix[]) => {
  const out: W[] = [];
  planos.forEach((p) => {
    if (!p.a) return; const F = FONTES[p.a.f]; if (!F.words) return;
    F.words.filter((w) => w.start >= p.a!.from - 0.05 && w.end <= p.a!.from + p.a!.dur + 0.12)
      .forEach((w) => out.push({ text: w.text.trim(), start: p.at + w.start - p.a!.from, end: Math.min(p.at + p.a!.dur, p.at + w.end - p.a!.from) }));
  });
  fix.forEach(([i, txt]) => { if (out[i]) out[i] = { ...out[i], text: txt }; });
  return out.filter((w) => w.text !== "");
};
const Legenda: React.FC<{ words: W[]; chave: RegExp; top: number; size?: number }> = ({ words, chave, top, size = 56 }) => {
  const t = useS();
  const pages = React.useMemo(() => {
    const ps: { de: number; ate: number; ws: W[] }[] = [];
    let cur: W[] = [];
    words.forEach((w, i) => {
      cur.push(w);
      const prox = words[i + 1];
      const pausa = prox ? prox.start - w.end > 0.6 : true;
      if (/[.,?!…]$/.test(w.text) || cur.length >= 5 || pausa) { ps.push({ de: cur[0].start, ate: 0, ws: cur }); cur = []; }
    });
    ps.forEach((p, i) => { const fim = p.ws[p.ws.length - 1].end + 0.6; p.ate = i < ps.length - 1 ? Math.min(ps[i + 1].de, fim) : fim; });
    return ps;
  }, [words]);
  const pg = pages.find((p) => t >= p.de - 0.06 && t < p.ate);
  if (!pg) return null;
  return <div style={{ position: "absolute", left: 60, right: 60, top, display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: 16, rowGap: 6 }}>
    {pg.ws.map((w, i) => {
      const dita = t >= w.start - 0.04;
      const txt = w.text.replace(/[,;:]$/, "");
      const ch = chave.test(txt.replace(/[.?!…”“"]/g, ""));
      return <span key={i} style={{ fontFamily: SANS, fontWeight: 800, fontSize: size, lineHeight: 1.15, color: dita ? (ch ? "#FF4D57" : "#FFFFFF") : "rgba(255,255,255,0.35)", textShadow: "0 3px 14px rgba(0,0,0,0.95), 0 0 2px #000" }}>{txt}</span>;
    })}
  </div>;
};

// ——— peças comuns ———
const Cracha: React.FC<{ de: number; ate: number; nome: string; sub: string; top: number }> = ({ de, ate, nome, sub, top }) => {
  const t = useS();
  if (t < de - 0.1 || t > ate + 0.6) return null;
  const k = interpolate(t, [de, de + 0.45, ate, ate + 0.45], [0, 1, 1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const kb = interpolate(t, [de + 0.25, de + 0.7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <div style={{ position: "absolute", left: 40, top, transform: `translateX(${(1 - k) * -620}px)`, opacity: k }}>
    <div style={{ display: "inline-block", background: "#F4F1EA", padding: "8px 24px 6px", fontFamily: MONT, fontWeight: 800, fontSize: 44, color: "#111", boxShadow: "0 8px 24px rgba(0,0,0,0.45)" }}>{nome}</div>
    <div style={{ overflow: "hidden", width: `${kb * 100}%`, whiteSpace: "nowrap" }}>
      <div style={{ display: "inline-block", background: C.lacre, padding: "8px 24px", fontFamily: SANS, fontWeight: 700, fontSize: 26, color: "#fff", letterSpacing: "0.03em" }}>{sub}</div>
    </div>
  </div>;
};
const Etiqueta: React.FC<{ de: number; ate: number; texto: string; top: number; left?: number }> = ({ de, ate, texto, top, left = 28 }) => {
  const t = useS();
  if (t < de - 0.1 || t > ate + 0.5) return null;
  const k = entra(t, de, ate + 0.35, 0.3);
  return <div style={{ position: "absolute", left, top, opacity: k, display: "flex", alignItems: "center", background: "rgba(10,10,11,0.8)", padding: "8px 16px 8px 12px", borderLeft: `6px solid ${C.lacre}` }}>
    <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 25, color: "#fff", letterSpacing: "0.04em" }}>{texto}</div>
  </div>;
};
type Tit = [number, number, string, string];
const Titulos: React.FC<{ itens: Tit[]; top: number }> = ({ itens, top }) => {
  const t = useS();
  return <>{itens.map(([de, ate, l1, l2], i) => {
    if (t < de - 0.4 || t > ate + 0.4) return null;
    const ult = i === itens.length - 1;
    const op = interpolate(t, [de - (i ? 0.25 : 0), de + (i ? 0.25 : 0.4), ate - 0.25, ate + 0.25], [i ? 0 : 1, 1, 1, ult ? 1 : 0], clamp);
    const y = interpolate(t, [de - 0.25, de + 0.35], [i ? 18 : 0, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
    return <div key={i} style={{ position: "absolute", left: 60, right: 60, top, opacity: op, transform: `translateY(${y}px)` }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 54, lineHeight: 1.1, color: C.osso, textShadow: "0 4px 18px rgba(0,0,0,0.9)" }}>{l1}</div>
      <div style={{ display: "inline-block", marginTop: 10, background: C.lacre, padding: "2px 14px", fontFamily: MONT, fontWeight: 800, fontSize: 40, color: C.osso }}>{l2}</div>
    </div>;
  })}</>;
};
type Card = [number, number, React.ReactNode];
const Cartoes: React.FC<{ itens: Card[]; top: number }> = ({ itens, top }) => {
  const t = useS();
  return <>{itens.map(([de, ate, el], i) => {
    const k = entra(t, de, ate, 0.4);
    if (k <= 0) return null;
    return <div key={i} style={{ position: "absolute", left: 60, right: 60, top, textAlign: "center", opacity: k, transform: `translateY(${(1 - k) * 14}px)` }}>{el}</div>;
  })}</>;
};
const tx = (s: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: SANS, fontWeight: 800, fontSize: 44, lineHeight: 1.28, color: "#fff", textShadow: "0 3px 14px #000", ...s });
const Segue: React.FC = () => <>
  <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 50, lineHeight: 1.2, color: C.osso, textShadow: "0 4px 18px #000" }}>Próximo caso no perfil.</div>
  <div style={{ display: "inline-block", marginTop: 14, background: C.lacre, padding: "6px 22px", fontFamily: MONT, fontWeight: 800, fontSize: 50, color: "#fff" }}>Segue o Álibi.</div>
</>;
const V = ({ children }: { children: React.ReactNode }) => <span style={{ color: "#FF4D57" }}>{children}</span>;

// foto por cima do vídeo (trechos em que a imagem original não serve ou não pode aparecer)
type FotoOv = [number, number, string, string?];
const FotosOv: React.FC<{ itens: FotoOv[] }> = ({ itens }) => {
  const t = useS();
  return <>{itens.map(([de, ate, img, leg], i) => {
    if (t < de - 0.4 || t > ate + 0.4) return null;
    const colado = i > 0 && Math.abs(itens[i - 1][1] - de) < 0.05;
    const op = interpolate(t, [de - (colado ? 0.3 : 0.2), de + 0.12, ate - 0.12, ate + 0.3], [0, 1, 1, 0], clamp);
    const z = interpolate(t, [de - 0.3, ate + 0.3], i % 2 ? [1.04, 1.0] : [1.0, 1.04], clamp);
    return <div key={i} style={{ position: "absolute", inset: 0, opacity: op }}>
      <FotoContain img={img} z={z} />
      {leg && <div style={{ position: "absolute", right: 16, bottom: 14, padding: "5px 12px", background: "rgba(10,10,11,0.75)", fontFamily: SANS, fontWeight: 700, fontSize: 22, color: C.osso }}>{leg}</div>}
    </div>;
  })}</>;
};

// ===== EDITS: tela cheia vertical, tipografia grande, trilha baixa por baixo da fala =====
type Carimbo = [number, number, string, number?]; // texto grande no centro
type Edit = { planos: Plano[]; fix: Fix[]; chave: RegExp; topo: [number, number, string, string][]; carimbos: Carimbo[]; etiquetas: { de: number; ate: number; texto: string }[]; crachas: { de: number; ate: number; nome: string; sub: string }[]; cartoes: Card[]; fim: number; total: number; credito: string; moldura?: [number, number][]; musica: [number, number][] };
const MT = 560, MH = 800; // moldura 4:3 para material que não é vertical
const EditBase: React.FC<{ e: Edit }> = ({ e }) => {
  const t = useS();
  const words = React.useMemo(() => palavras(e.planos, e.fix), [e]);
  const m = Math.max(0, ...(e.moldura ?? []).map(([a, b]) => interpolate(t, [a - 0.2, a, b, b + 0.2], [0, 1, 1, 0], clamp)));
  const emMoldura = m > 0.5;
  const fimK = interpolate(t, [e.fim - 0.2, e.fim + 0.4], [0, 1], clamp);
  const musVol = (f: number) => { const s = f / 30; const alta = e.musica.some(([a, b]) => s >= a && s < b); return interpolate(s, [0, 0.6], [0, 1], clamp) * (alta ? 0.5 : 0.16) * interpolate(s, [e.total / 30 - 1.2, e.total / 30], [1, 0], clamp); };
  return <AbsoluteFill style={{ background: C.preto, overflow: "hidden" }}>
    <AbsoluteFill style={{ filter: `blur(${40 * m}px) brightness(${1 - 0.68 * m})`, transform: `scale(${1 + 0.2 * m})` }}>
      <Planos planos={e.planos} bw={1080} bh={1920} />
    </AbsoluteFill>
    {m > 0 && <div style={{ position: "absolute", left: 0, top: MT, opacity: m, width: 1080, height: MH, overflow: "hidden", borderTop: `4px solid ${C.lacre}`, borderBottom: `4px solid ${C.lacre}`, boxShadow: "0 30px 80px rgba(0,0,0,0.85)" }}>
      <Planos planos={e.planos} bw={1080} bh={MH} />
    </div>}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,10,11,0.7) 0%, rgba(10,10,11,0) 28%, rgba(10,10,11,0) 58%, rgba(10,10,11,0.8) 100%)" }} />
    <AbsoluteFill style={{ background: `rgba(10,10,11,${0.72 * fimK})` }} />
    <AbsoluteFill style={{ boxShadow: "inset 0 0 220px rgba(0,0,0,0.75)" }} />
    <Audios planos={e.planos} />
    <Audio src={staticFile("audio/eliza-trilha.mp3")} volume={musVol} />
    <div style={{ position: "absolute", left: 60, right: 60, top: 300, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 38, letterSpacing: "0.14em", color: C.osso, textShadow: "0 3px 12px #000" }}>ÁLIBI</div>
      <div style={{ padding: "5px 14px", background: C.lacre, fontFamily: MONT, fontWeight: 800, fontSize: 24, color: C.osso, letterSpacing: "0.06em" }}>CASO ELIZA SAMUDIO</div>
    </div>
    {e.topo.map(([de, ate, l1, l2], i) => {
      const k = entra(t, de, ate, 0.3); if (k <= 0) return null;
      return <div key={i} style={{ position: "absolute", left: 60, right: 60, top: 380, opacity: k, transform: `translateY(${(1 - k) * 16}px)` }}>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 62, lineHeight: 1.06, color: C.osso, textShadow: "0 4px 20px rgba(0,0,0,0.95)" }}>{l1}</div>
        {l2 && <div style={{ display: "inline-block", marginTop: 10, background: C.lacre, padding: "2px 14px", fontFamily: MONT, fontWeight: 800, fontSize: 42, color: C.osso }}>{l2}</div>}
      </div>;
    })}
    {e.carimbos.map(([de, ate, txt, size], i) => {
      if (t < de - 0.05 || t > ate + 0.3) return null;
      const s = interpolate(t, [de, de + 0.18], [1.35, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
      const op = interpolate(t, [de, de + 0.1, ate, ate + 0.25], [0, 1, 1, 0], clamp);
      return <div key={i} style={{ position: "absolute", left: 40, right: 40, top: 1060, textAlign: "center", opacity: op, transform: `scale(${s}) rotate(-2deg)` }}>
        <span style={{ display: "inline-block", background: C.lacre, padding: "6px 26px 10px", fontFamily: MONT, fontWeight: 800, fontSize: size ?? 76, color: "#fff", boxShadow: "0 12px 40px rgba(0,0,0,0.7)" }}>{txt}</span>
      </div>;
    })}
    {e.crachas.map((k, i) => <Cracha key={i} {...k} top={1170} />)}
    {e.etiquetas.map((x, i) => <Etiqueta key={i} {...x} top={emMoldura ? MT + 20 : 1200} />)}
    <Legenda words={words} chave={e.chave} top={1400} size={60} />
    <Cartoes itens={e.cartoes} top={1240} />
    <div style={{ position: "absolute", left: 60, right: 60, top: 1690, fontFamily: SANS, fontWeight: 600, fontSize: 19, lineHeight: 1.3, color: "rgba(236,231,220,0.62)", textShadow: "0 2px 8px #000" }}>{e.credito}</div>
  </AbsoluteFill>;
};

const FIX: Fix[] = [[22, "a"], [23, "polícia."], [34, "maluca?"], [44, "eu."], [71, ""], [76, "Eliza,"], [88, "camisa"], [121, "Eliza"], [136, "Eliza"], [142, "Eliza,"], [149, "Eliza"], [165, "Eliza,"]];

const AIR: Crop = [180, 650, 820, 525];      // vídeo do aeroporto (4:3), sem a legenda queimada
const DEAM: Crop = [183, 650, 807, 525];     // entrevista de Eliza (4:3)
const MEIO: Crop = [185, 650, 709, 525];     // faixa 16:9 do documentário, centro
const DIR: Crop = [371, 650, 709, 525];      // faixa 16:9, rosto à direita
const E2: Crop = [87, 335, 401, 297];        // e2 (576 px), centro da faixa, sem a legenda queimada
const editE: Edit = {
  planos: [
    { at: 0, dur: 2.35, v: { f: "e4", from: 0.9, crop: AIR }, a: { f: "e4", from: 0.9, dur: 2.35 } },
    { at: 2.35, dur: 4.45, v: { f: "e4", from: 13.35, crop: AIR }, a: { f: "e4", from: 13.35, dur: 4.45 } },
    { at: 6.8, dur: 4.6, v: { f: "e4", from: 18.2, crop: AIR }, a: { f: "e4", from: 18.2, dur: 4.6 } },
    { at: 11.4, dur: 6.9, v: { f: "e4", from: 80.95, crop: DEAM }, a: { f: "e4", from: 80.65, dur: 6.9 } },
    { at: 18.3, dur: 6.7, v: { f: "e2", from: 22.4, crop: E2 }, a: { f: "e2", from: 21.0, dur: 6.7 } },
    { at: 25.0, dur: 4.5, v: { f: "e2", from: 38.0, crop: E2 }, a: { f: "e2", from: 37.9, dur: 4.5 } },
    { at: 29.5, dur: 3.6, v: { f: "e2", from: 57.0, crop: E2 }, a: { f: "e2", from: 57.0, dur: 3.65 } },
    { at: 33.1, dur: 6.1, v: { f: "e2", from: 61.9, crop: E2 }, a: { f: "e2", from: 61.9, dur: 6.1 } },
    { at: 39.2, dur: 1.7, v: { f: "e4", from: 58.8, crop: DIR }, a: { f: "e4", from: 58.8, dur: 1.7 } },
    { at: 40.9, dur: 1.2, v: { f: "e4", from: 60.6, crop: MEIO }, a: { f: "e4", from: 60.6, dur: 14.1 } },
    { at: 42.1, dur: 4.7, v: { f: "e4", from: 61.8, crop: MEIO } },
    { at: 46.8, dur: 2.0, v: { f: "e4", from: 66.5, crop: MEIO } },
    { at: 48.8, dur: 2.2, v: { f: "e4", from: 68.5, crop: MEIO } },
    { at: 51.0, dur: 4.0, v: { f: "e4", from: 70.7, crop: DIR } },
    { at: 55.0, dur: 1.6, v: { f: "e2", from: 45.1, crop: E2 }, a: { f: "e4", from: 78.66, dur: 1.6 } },
    { at: 56.6, dur: 3.4, v: { f: "e4", from: 23.0, crop: AIR } },
    { at: 60.0, dur: 3.0, v: { f: "e4", from: 5.2, crop: AIR } },
    { at: 63.0, dur: 2.9, v: { f: "e4", from: 88.0, crop: DEAM } },
    { at: 65.9, dur: 3.1, v: { f: "e4", from: 10.0, crop: AIR } },
  ],
  fix: FIX, chave: /^(medo|maluco|polícia|delegacia|mato|goleira|um|país|medo|invisível|acreditou|certo|justiça|socorro|ouvida|errado)$/i,
  topo: [[0, 11.3, "ELA AVISOU", "QUE TINHA MEDO DELE."], [11.4, 18.2, "ELA DENUNCIOU", "AS AMEAÇAS."], [18.3, 39.1, "QUEM ERA ELIZA", "GOLEIRA. CAMISA 1."], [39.2, 54.9, "ELA PEDIU SOCORRO.", "NINGUÉM OUVIU."]],
  carimbos: [[39.3, 40.85, "VÍTIMA INVISÍVEL", 70]],
  etiquetas: [{ de: 0.2, ate: 6.7, texto: "ELIZA SAMUDIO" }, { de: 11.5, ate: 18.1, texto: "ELIZA, EM ENTREVISTA" }, { de: 25.1, ate: 29.4, texto: "CARLA BÓ · AMIGA DE ELIZA" }, { de: 42.2, ate: 46.7, texto: "SÔNIA MOURA · MÃE DE ELIZA" }],
  crachas: [],
  cartoes: [
    [56.8, 59.7, <div style={tx({ fontSize: 50 })}>Eliza tinha <V>25 anos</V> e um filho de 4 meses.</div>],
    [59.9, 62.9, <div style={tx({ fontSize: 46 })}>Desapareceu em junho de 2010. <V>O corpo nunca foi encontrado.</V></div>],
    [63.1, 66.0, <div style={tx({ fontSize: 46 })}>Bruno foi condenado a <V>22 anos e 3 meses</V> de prisão.</div>],
    [66.2, 69.0, <Segue />],
  ],
  fim: 56.6, total: Math.round(69.0 * 30), musica: [[55.0, 70]],
  moldura: [[0, 70]],
  credito: "Reprodução · Netflix, “A Vítima Invisível: O Caso Eliza Samudio” · Trilha: “Ode to Loneliness”, Diego Nava (Mixkit)",
};
export const ELIZA_TOTAL = editE.total;
export const EditEliza: React.FC = () => <EditBase e={editE} />;
export const PALAVRAS_ELIZA = () => palavras(editE.planos, []);
