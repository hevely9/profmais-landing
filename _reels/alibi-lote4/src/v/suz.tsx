import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import w1 from "../../public/palavras-suz-s1.json";
import w3 from "../../public/palavras-suz-s3.json";
import w4 from "../../public/palavras-suz-s4.json";
import w5 from "../../public/palavras-suz-s5.json";
import { C, COURIER, MONT, SANS, SERIF, clamp } from "../kit";

// ÁLIBI · lote Suzane von Richthofen (27/11/2026): 2 CORTES (Nº 031 e Nº 032, formato do Nº 029/030) + 3 EDITS curtos (15–30 s).
// Fontes: vídeos enviados pelo usuário (TikTok) com trechos de “Suzane von Richthofen: O que o Tempo Não Apaga” (Netflix, 2026),
// da série “Tremembé – A Vida Real” (RecordPlus) e de arquivo de TV (2002). Nada gráfico: o vídeo policial do quarto e a
// reconstituição do ataque ficam cobertos por fotos. Tom: factual; ela é a condenada, as vítimas são os pais e o irmão.

type W = { text: string; start: number; end: number };
const FONTES: Record<string, { src: string; w: number; h: number; words?: W[] }> = {
  s1: { src: "v/suz/s1.mp4", w: 576, h: 1024, words: (w1 as { words: W[] }).words },
  s2: { src: "v/suz/s2.mp4", w: 1080, h: 1920 },
  s3: { src: "v/suz/s3.mp4", w: 576, h: 1024, words: (w3 as { words: W[] }).words },
  s4: { src: "v/suz/s4.mp4", w: 1080, h: 1920, words: (w4 as { words: W[] }).words },
  s5: { src: "v/suz/s5.mp4", w: 720, h: 1280, words: (w5 as { words: W[] }).words },
  s6: { src: "v/suz/s6.mp4", w: 1080, h: 1920 },
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

// ——— CORTE (Nº 031 / Nº 032): faixa 1080×608 com fundo desfocado, marca, títulos, crachás e legenda ———
const BT = 700, BH = 608;
type Corte = { n: string; planos: Plano[]; fix: Fix[]; chave: RegExp; titulos: Tit[]; fotos: FotoOv[]; crachas: { de: number; ate: number; nome: string; sub: string }[]; etiquetas: { de: number; ate: number; texto: string }[]; cartoes: Card[]; fonteTag: string; credito: string; total: number };
const CorteBase: React.FC<{ c: Corte }> = ({ c }) => {
  const words = React.useMemo(() => palavras(c.planos, c.fix), [c]);
  const t = useS();
  const tit = interpolate(t, [0, 0.5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill style={{ background: C.preto, overflow: "hidden" }}>
    <AbsoluteFill style={{ filter: "blur(42px) brightness(0.3) saturate(0.8)", transform: "scale(1.2)" }}><Planos planos={c.planos} bw={1080} bh={1920} /></AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,10,11,0.55) 0%, rgba(10,10,11,0.1) 30%, rgba(10,10,11,0.1) 70%, rgba(10,10,11,0.6) 100%)" }} />
    <div style={{ position: "absolute", left: 0, top: BT, width: 1080, height: BH, overflow: "hidden", borderTop: "3px solid rgba(236,231,220,0.85)", borderBottom: "3px solid rgba(236,231,220,0.85)", boxShadow: "0 30px 80px rgba(0,0,0,0.8)", background: "#000" }}>
      <Planos planos={c.planos} bw={1080} bh={BH} />
      <FotosOv itens={c.fotos} />
      <div style={{ position: "absolute", right: 14, top: 12, padding: "4px 10px", background: "rgba(10,10,11,0.6)", fontFamily: SANS, fontWeight: 700, fontSize: 18, color: "rgba(236,231,220,0.85)" }}>{c.fonteTag}</div>
    </div>
    <Audios planos={c.planos} />
    <div style={{ position: "absolute", left: 60, right: 60, top: 440, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: tit }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 40, letterSpacing: "0.14em", color: C.osso }}>ÁLIBI</div>
      <div style={{ padding: "5px 14px", background: C.lacre, fontFamily: MONT, fontWeight: 800, fontSize: 26, color: C.osso, letterSpacing: "0.06em" }}>{c.n} · CASO REAL</div>
    </div>
    <Titulos itens={c.titulos} top={520} />
    {c.crachas.map((k, i) => <Cracha key={i} {...k} top={BT + BH - 168} />)}
    {c.etiquetas.map((e, i) => <Etiqueta key={i} {...e} top={BT + 20} />)}
    <Legenda words={words} chave={c.chave} top={BT + BH + 44} />
    <Cartoes itens={c.cartoes} top={BT + BH + 40} />
    <div style={{ position: "absolute", left: 60, right: 60, top: 1700, fontFamily: SANS, fontWeight: 600, fontSize: 19, lineHeight: 1.3, color: "rgba(236,231,220,0.6)" }}>{c.credito}</div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 1760, fontFamily: COURIER, fontWeight: 700, fontSize: 24, color: "rgba(236,231,220,0.55)", letterSpacing: "0.08em" }}>toda história tem um álibi.</div>
  </AbsoluteFill>;
};

// monta a linha do tempo de trechos contínuos [fonte, de, até] com 0,15 s de respiro entre eles
const seq = (f: string, trechos: [number, number][], crop: Crop, gap = 0.15, t0 = 0) => {
  let at = t0; const ps: Plano[] = [];
  trechos.forEach(([a, b]) => { ps.push({ at, dur: b - a, v: { f, from: a, crop }, a: { f, from: a, dur: b - a } }); at += b - a + gap; });
  return { ps, fim: at - gap, T: (i: number, src: number) => ps[i].at + (src - ps[i].v!.from) };
};

// ===== Nº 031 · “Ela fala do irmão” (Netflix, 2026) =====
const CR1: Crop = [28, 414, 520, 292];
const S1 = seq("s1", [[0.0, 6.6], [13.8, 17.7], [22.2, 37.4], [40.05, 43.45], [45.2, 50.0], [62.9, 76.65], [84.7, 90.5], [93.5, 109.95], [119.6, 121.5]], CR1);
const F1 = S1.fim; // ~73,0 s
export const SUZ031_TOTAL = Math.round((F1 + 11.2) * 30);
const corte031: Corte = {
  n: "Nº 031",
  planos: [...S1.ps, { at: F1 + 0.15, dur: 11.1, v: { f: "s1", from: 110.2, crop: CR1 } }],
  fix: [[21, "Andreas."], [83, "descobre que"]], chave: /^(andreas|irmão|silêncio|mortos|grito|desespero|culpa|sofrimento|dor|assim)$/i,
  titulos: [
    [0, S1.T(2, 22.2), "SUZANE FALA DO IRMÃO", "ANDREAS TINHA 15 ANOS"],
    [S1.T(2, 22.2), S1.T(4, 45.2), "A NOITE DO CRIME", "ELA BUSCOU O IRMÃO NA LAN HOUSE"],
    [S1.T(4, 45.2), S1.T(6, 84.7), "A NOTÍCIA", "31 DE OUTUBRO DE 2002"],
    [S1.T(6, 84.7), F1, "24 ANOS DEPOIS", "NETFLIX · 2026"],
    [F1 + 0.15, F1 + 11.2, "O DESFECHO", "CASO RICHTHOFEN"],
  ],
  fotos: [
    [S1.T(0, 3.4), S1.T(0, 6.6), "an-irmaos", "Suzane e Andreas, antes do crime"],
    [S1.T(1, 13.86), S1.T(1, 17.7), "an-teen-azul", "Andreas antes do crime"],
    [S1.T(2, 26.0), S1.T(2, 30.4), "an-teen-vermelha", "Andreas, 15 anos"],
    [S1.T(4, 45.3), S1.T(4, 50.0), "s-casa-policia", "A casa da família, 31/10/2002"],
    [S1.T(5, 67.9), S1.T(5, 72.0), "an-teen-choro", "Andreas em 2002"],
    [S1.T(5, 72.0), S1.T(5, 76.65), "an-enterro", "Andreas no enterro dos pais"],
    [S1.T(7, 99.4), S1.T(7, 106.8), "an-teen-cab", "Andreas em 2002"],
    [S1.T(7, 106.8), S1.T(7, 109.95), "an-hoje-rosto", "Andreas em 2026"],
  ],
  crachas: [{ de: 0.3, ate: 3.2, nome: "SUZANE VON RICHTHOFEN", sub: "CONDENADA PELA MORTE DOS PAIS" }],
  etiquetas: [],
  cartoes: [
    [F1 + 0.8, F1 + 4.3, <div style={tx()}>Andreas <V>não quis participar</V> do documentário. Vive recluso em São Roque (SP).</div>],
    [F1 + 4.5, F1 + 7.9, <div style={tx()}>Suzane foi condenada a <V>39 anos e 6 meses</V>. Está em regime aberto desde 2023.</div>],
    [F1 + 8.1, F1 + 11.6, <Segue />],
  ],
  fonteTag: "NETFLIX · 2026",
  credito: "Reprodução · Netflix, “Suzane von Richthofen: O que o Tempo Não Apaga” (2026); fotos: arquivo de TV (2002) e redes sociais (2026)",
  total: SUZ031_TOTAL,
};
export const Suz031: React.FC = () => <CorteBase c={corte031} />;

// ===== Nº 032 · “A versão dela” (Netflix, 2026 + reconstituição de 2002) =====
const CR3: Crop = [26, 366, 520, 290];
const S3 = seq("s3", [[145.85, 152.5], [25.0, 44.2], [45.3, 51.9], [92.4, 102.8], [116.9, 129.3], [158.4, 162.85], [170.7, 178.95]], CR3);
const F3 = S3.fim;
export const SUZ032_TOTAL = Math.round((F3 + 11.2) * 30);
const corte032: Corte = {
  n: "Nº 032",
  planos: [...S3.ps, { at: F3 + 0.15, dur: 11.1, v: { f: "s3", from: 130.0, crop: CR3 } }],
  fix: [], chave: /^(mim|eu|premeditado|agosto|raiva|sabia|soube|arma|barra|ouvir|daniel)$/i,
  titulos: [
    [0, S3.T(1, 25.0), "“NÃO FUI EU QUE FIZ”", "A VERSÃO DE SUZANE"],
    [S3.T(1, 25.0), S3.T(3, 92.4), "A RECONSTITUIÇÃO", "ONDE ELA ESTAVA?"],
    [S3.T(3, 92.4), S3.T(5, 158.4), "A ARMA", "FEITA À MÃO POR DANIEL"],
    [S3.T(5, 158.4), F3, "24 ANOS DEPOIS", "O QUE ELA DIZ HOJE"],
    [F3 + 0.15, F3 + 11.2, "O DESFECHO", "CASO RICHTHOFEN"],
  ],
  fotos: [
    [S3.T(1, 40.4), S3.T(1, 43.5), "s-mansao-aerea", "A casa da família Richthofen"],
    [S3.T(4, 116.9), S3.T(4, 125.9), "s-presos-2002", "Suzane e os irmãos Cravinhos, 2002"],
  ],
  crachas: [
    { de: 0.3, ate: 3.4, nome: "SUZANE VON RICHTHOFEN", sub: "EM 2026 · NETFLIX" },
  ],
  etiquetas: [
    { de: S3.T(1, 28.0), ate: S3.T(1, 35.4), texto: "ENTREVISTADA NO DOCUMENTÁRIO" },
    { de: S3.T(2, 45.4), ate: S3.T(2, 51.9), texto: "RECONSTITUIÇÃO · 2002" },
    { de: S3.T(5, 158.5), ate: S3.T(5, 162.6), texto: "SUZANE · 2026" },
  ],
  cartoes: [
    [F3 + 0.8, F3 + 4.3, <div style={tx()}>Na reconstituição, ela confirmou que <V>abriu a porta</V> da casa para os irmãos Cravinhos.</div>],
    [F3 + 4.5, F3 + 7.9, <div style={tx({ fontSize: 40 })}>Em 2006, o júri condenou Suzane e Daniel a <V>39 anos e 6 meses</V>; Cristian, a 38 anos e 6 meses.</div>],
    [F3 + 8.1, F3 + 11.6, <Segue />],
  ],
  fonteTag: "NETFLIX · 2026",
  credito: "Reprodução · Netflix, “Suzane von Richthofen: O que o Tempo Não Apaga” (2026), com arquivo da reconstituição (2002); fotos: arquivo de TV",
  total: SUZ032_TOTAL,
};
export const Suz032: React.FC = () => <CorteBase c={corte032} />;

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
  const musVol = (f: number) => { const s = f / 30; const alta = e.musica.some(([a, b]) => s >= a && s < b); return interpolate(s, [0, 0.6], [0, 1], clamp) * (alta ? 0.42 : 0.11) * interpolate(s, [e.total / 30 - 1.2, e.total / 30], [1, 0], clamp); };
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
    <Audio src={staticFile("audio/trilha.mp3")} volume={musVol} />
    <div style={{ position: "absolute", left: 60, right: 60, top: 300, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 38, letterSpacing: "0.14em", color: C.osso, textShadow: "0 3px 12px #000" }}>ÁLIBI</div>
      <div style={{ padding: "5px 14px", background: C.lacre, fontFamily: MONT, fontWeight: 800, fontSize: 24, color: C.osso, letterSpacing: "0.06em" }}>CASO RICHTHOFEN</div>
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

// ——— EDIT 1 · “Nada a declarar” (a pergunta que ela não respondeu) ———
const editA: Edit = {
  planos: [
    { at: 0, dur: 2.6, img: "suz/s4q", a: { f: "s4", from: 0, dur: 2.56 } },
    { at: 2.6, dur: 4.65, v: { f: "s4", from: 2.6 }, a: { f: "s4", from: 2.56, dur: 4.7 } },
    { at: 7.25, dur: 2.15, img: "s-suzane-escoltada" },
    { at: 9.4, dur: 1.7, v: { f: "s4", from: 42.0 }, a: { f: "s4", from: 42.1, dur: 5.15 } },
    { at: 11.1, dur: 3.5, v: { f: "s4", from: 44.5 } },
    { at: 14.6, dur: 5.6, img: "c2-suz-juri" },
  ],
  fix: [[34, "calculista."], [35, ""], [36, ""]], chave: /^(planejou|morte|pais|nada|declarar|fria|calculista)$/i,
  topo: [[0, 7.2, "A PERGUNTA QUE", "ELA NÃO RESPONDEU"], [9.4, 14.5, "“UMA PESSOA", "MUITO FRIA”"]],
  carimbos: [[7.35, 9.3, "ELA CONFESSOU O CRIME.", 64]],
  etiquetas: [{ de: 2.7, ate: 7.1, texto: "SUZANE VON RICHTHOFEN · 2002" }, { de: 11.2, ate: 14.5, texto: "NO ENTERRO DOS PAIS · 2002" }],
  crachas: [],
  cartoes: [
    [14.8, 17.4, <div style={tx({ fontSize: 50 })}>Condenada a <V>39 anos e 6 meses</V>.</div>],
    [17.5, 20.3, <Segue />],
  ],
  fim: 14.6, total: Math.round(20.2 * 30), musica: [[7.25, 9.4], [14.6, 21]],
  credito: "Reprodução · RecordPlus, “Tremembé – A Vida Real” (trailer) e arquivo de TV (2002)",
};
export const SUZEA_TOTAL = editA.total;
export const SuzEditA: React.FC = () => <EditBase e={editA} />;

// ——— EDIT 2 · “Sedutora” (o que dizem de quem conviveu com ela) ———
const CR5: Crop = [0, 374, 720, 532];
const editB: Edit = {
  planos: [
    { at: 0, dur: 10.95, v: { f: "s5", from: 0.25, crop: CR5 }, a: { f: "s5", from: 0.0, dur: 10.95 } },
    { at: 10.95, dur: 2.75, img: "suz/s6pass", a: { f: "s5", from: 22.85, dur: 9.35 } },
    { at: 13.7, dur: 1.55, img: "suz/s6red" },
    { at: 15.25, dur: 1.45, img: "suz/s6car" },
    { at: 16.7, dur: 4.0, v: { f: "s6", from: 0.3, crop: [0, 554, 1080, 812] } },
    { at: 20.7, dur: 5.2, img: "c2-suz-grade" },
  ],
  fix: [[3, "promotor,"], [10, "segurança,"], [12, "diretora,"], [18, "mulheres."], [37, "chá."], [42, "legal."], [47, "sedutor."]], chave: /^(seduziu|seduzia|promotor|diretora|psicopata|sedutor|legal)$/i,
  topo: [[0, 10.8, "“ELA SEDUZIU", "O PROMOTOR”"], [10.95, 20.4, "QUEM CONVIVEU", "COM ELA NA PRISÃO"]],
  carimbos: [[2.0, 3.7, "O PROMOTOR"], [4.55, 6.85, "O AGENTE"], [7.3, 9.0, "A DIRETORA"], [9.25, 10.95, "HOMENS E MULHERES", 62]],
  etiquetas: [{ de: 0.2, ate: 4.4, texto: "VOZ · ENTREVISTADO EM PODCAST" }, { de: 16.8, ate: 20.4, texto: "SUZANE NA PRISÃO · 2006" }],
  crachas: [],
  cartoes: [
    [20.6, 23.2, <div style={tx({ fontSize: 46 })}>Condenada a <V>39 anos e 6 meses</V>, está em regime aberto desde 2023.</div>],
    [23.3, 26, <Segue />],
  ],
  fim: 20.5, total: Math.round(25.9 * 30), musica: [[20.5, 27]],
  moldura: [[0, 10.9], [16.7, 20.7]],
  credito: "Reprodução · trecho de podcast, arquivo de TV (2002–2006) e redes sociais",
};
export const SUZEB_TOTAL = editB.total;
export const SuzEditB: React.FC = () => <EditBase e={editB} />;

// ——— EDIT 3 · “A Suzane de antigamente” (Daniel, 2002) ———
const editC: Edit = {
  planos: [
    { at: 0, dur: 2.45, v: { f: "s4", from: 17.4 }, a: { f: "s4", from: 17.4, dur: 6.8 } },
    { at: 2.45, dur: 2.15, img: "suz/s6red" },
    { at: 4.6, dur: 2.35, img: "suz/s6pass" },
    { at: 6.95, dur: 3.35, v: { f: "s4", from: 23.0 }, a: { f: "s4", from: 24.4, dur: 3.3 } },
    { at: 10.3, dur: 3.9, v: { f: "s2", from: 5.0, crop: [0, 556, 1080, 824] } },
    { at: 14.2, dur: 4.6, v: { f: "s2", from: 9.4, crop: [0, 556, 1080, 824] } },
  ],
  fix: [], chave: /^(apaixonado|amo|antigamente|hoje|conhecer)$/i,
  topo: [[0, 10.2, "ELE MATOU OS PAIS DELA.", "E DISSE ISTO:"], [10.3, 14.1, "DIAS DEPOIS,", "OS TRÊS CONFESSARAM"]],
  carimbos: [],
  etiquetas: [{ de: 7.0, ate: 9.75, texto: "NO ENTERRO DOS PAIS DE SUZANE · 2002" }, { de: 10.4, ate: 14.1, texto: "SUZANE E DANIEL · 2002" }],
  crachas: [{ de: 0.2, ate: 2.3, nome: "DANIEL CRAVINHOS", sub: "NAMORADO DE SUZANE · 2002" }],
  cartoes: [
    [14.4, 17.0, <div style={tx({ fontSize: 46 })}>Suzane e Daniel foram condenados a <V>39 anos e 6 meses</V>.</div>],
    [17.1, 19.9, <Segue />],
  ],
  fim: 14.2, total: Math.round(19.8 * 30), musica: [[10.3, 21]],
  moldura: [[10.3, 20]],
  credito: "Reprodução · RecordPlus, “Tremembé – A Vida Real” (trailer), arquivo de TV (2002) e redes sociais",
};
export const SUZEC_TOTAL = editC.total;
export const SuzEditC: React.FC = () => <EditBase e={editC} />;

// ——— capa genérica (vertical; a 3:4 é o recorte central 1080×1440 → texto entre y=300 e y=1640) ———
export const CapaSuz: React.FC<{ img: string; pos?: string; l1: string; l2: string; sub: string; n?: string }> = ({ img, pos = "50% 30%", l1, l2, sub, n }) => (
  <AbsoluteFill style={{ background: C.preto }}>
    <Img src={staticFile(`img/${img}.jpg`)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px) brightness(0.35)", transform: "scale(1.2)" }} />
    <div style={{ position: "absolute", left: 70, right: 70, top: 330, textAlign: "center" }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 92, lineHeight: 1.04, color: C.osso, textShadow: "0 6px 28px rgba(0,0,0,0.95)" }}>{l1}</div>
    </div>
    <div style={{ position: "absolute", left: 40, right: 40, top: 640, background: "#F4F1EA", padding: 16, transform: "rotate(-2deg)", boxShadow: "0 30px 70px rgba(0,0,0,0.8)" }}>
      <Img src={staticFile(`img/${img}.jpg`)} style={{ width: "100%", height: 560, objectFit: "cover", objectPosition: pos, display: "block" }} />
    </div>
    <div style={{ position: "absolute", left: 50, right: 50, top: 1290, textAlign: "center" }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 46, color: C.osso, textShadow: "0 4px 18px #000" }}>{sub}</div>
      <div style={{ display: "inline-block", marginTop: 16, padding: "6px 22px 10px", background: C.lacre, fontFamily: MONT, fontWeight: 800, fontSize: 52, color: C.osso, whiteSpace: "nowrap" }}>{l2}</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1555, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 42, letterSpacing: "0.12em", color: C.osso }}>ÁLIBI{n ? `  ·  ${n}` : ""}</div>
  </AbsoluteFill>
);
