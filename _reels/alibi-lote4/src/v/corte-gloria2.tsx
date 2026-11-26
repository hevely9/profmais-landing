import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import palavras from "../../public/palavras-dp30.json";
import { C, COURIER, MONT, SANS, SERIF, clamp } from "../kit";

// ÁLIBI · Nº 030 — CORTE (mesmo formato do Nº 029): melhores momentos sobre o caso Daniella Perez (sem a entrevista da Glória já postada no Nº 029),
// gancho = vídeo enviado pelo usuário (“conta de 1 até 18”); nos trechos de fala entram fotos da Daniella por cima,
// montados a partir de trechos da série "Pacto Brutal" (HBO Max, 2022) e de arquivo de TV.
// Sem narração: vídeo original + marca + título + crachás + legenda sincronizada + cartões finais.
// Ordem: Glória em 1992 ("conta de 1 até 18") → contexto (corpo encontrado, prisão de Guilherme de Pádua)
// → "as punhaladas que ela tomou" → Glória hoje ("os netos que eu não tive", "eram pra mim") → "vou sempre lutar"
// → vídeos caseiros de Daniella + desfecho. Trecho com fotos de perícia foi cortado (nada gráfico).
type W = { text: string; start: number; end: number };
const WORDS = (palavras as { words: W[] }).words;
export const GLORIA2_TOTAL = Math.floor(72.0 * 30);
const BAND_TOP = 650, BAND_H = 608;
const useS = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return f / fps; };
const entra = (t: number, de: number, ate: number, d = 0.45) => interpolate(t, [de, de + d, ate - d, ate], [0, 1, 1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });

const Cracha: React.FC<{ de: number; ate: number; nome: string; sub: string }> = ({ de, ate, nome, sub }) => {
  const t = useS();
  if (t < de - 0.1 || t > ate + 0.6) return null;
  const k = interpolate(t, [de, de + 0.45, ate, ate + 0.45], [0, 1, 1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const kb = interpolate(t, [de + 0.25, de + 0.7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <div style={{ position: "absolute", left: 40, top: BAND_TOP + BAND_H - 190, transform: `translateX(${(1 - k) * -620}px)`, opacity: k }}>
    <div style={{ display: "inline-block", background: "#F4F1EA", padding: "8px 24px 6px", fontFamily: MONT, fontWeight: 800, fontSize: 48, color: "#111", letterSpacing: "0.01em", boxShadow: "0 8px 24px rgba(0,0,0,0.45)" }}>{nome}</div>
    <div style={{ overflow: "hidden", width: `${kb * 100}%`, whiteSpace: "nowrap" }}>
      <div style={{ display: "inline-block", background: C.lacre, padding: "8px 24px", fontFamily: SANS, fontWeight: 700, fontSize: 28, color: "#fff", letterSpacing: "0.03em" }}>{sub}</div>
    </div>
  </div>;
};

const CHAVE = /^(daniella|perez|filha|filhos|netos|menina|18|punhaladas|mim|lutar|memória|apagada|muitas)/i;
const Legenda: React.FC = () => {
  const t = useS();
  const pages = React.useMemo(() => {
    const ps: { de: number; ate: number; ws: W[] }[] = [];
    let cur: W[] = [];
    WORDS.forEach((w, i) => {
      cur.push(w);
      const prox = WORDS[i + 1];
      const pausa = prox ? prox.start - w.end > 0.6 : true;
      if (/[.,?!…]$/.test(w.text) || cur.length >= 5 || pausa) { ps.push({ de: cur[0].start, ate: 0, ws: cur }); cur = []; }
    });
    ps.forEach((p, i) => { const fim = p.ws[p.ws.length - 1].end + 0.7; p.ate = i < ps.length - 1 ? Math.min(ps[i + 1].de, fim) : fim; });
    return ps;
  }, []);
  const pg = pages.find((p) => t >= p.de - 0.06 && t < p.ate);
  if (!pg) return null;
  return <div style={{ position: "absolute", left: 60, right: 60, top: BAND_TOP + BAND_H + 40, display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: 16, rowGap: 6 }}>
    {pg.ws.map((w, i) => {
      const dita = t >= w.start - 0.04;
      const txt = w.text.replace(/[,;:]$/, "");
      const chave = CHAVE.test(txt.replace(/[.?!…]$/, ""));
      return <span key={i} style={{ fontFamily: SANS, fontWeight: 800, fontSize: 56, lineHeight: 1.15, color: dita ? (chave ? "#FF4D57" : "#FFFFFF") : "rgba(255,255,255,0.35)", textShadow: "0 3px 14px rgba(0,0,0,0.95), 0 0 2px #000" }}>{txt}</span>;
    })}
  </div>;
};

// fotos de Daniella (tiradas da montagem de fotos da série) por cima do vídeo enquanto a entrevistada fala
const FOTOS: [number, number, string, number][] = [
  [2.6, 4.1, "f150", 0], [4.1, 5.65, "f157", 1],
  [35.9, 37.6, "f153", 0], [37.6, 39.35, "f161", 1],
  [46.8, 48.75, "f165", 0], [48.75, 50.7, "f177", 1],
  [50.7, 53.2, "f168.5", 0], [53.2, 55.6, "f181.5", 1], [55.6, 58.1, "f189", 0],
];
const Fotos: React.FC = () => {
  const t = useS();
  return <>{FOTOS.map(([de, ate, f, dir], i) => {
    if (t < de - 0.4 || t > ate + 0.4) return null;
    const prevColado = i > 0 && Math.abs(FOTOS[i - 1][1] - de) < 0.05;
    const op = interpolate(t, [de - (prevColado ? 0.3 : 0.15), de + 0.15, ate - 0.15, ate + 0.3], [0, 1, 1, 0], clamp);
    const z = interpolate(t, [de - 0.3, ate + 0.3], dir ? [1.12, 1.02] : [1.02, 1.12], clamp);
    return <div key={i} style={{ position: "absolute", inset: 0, opacity: op }}>
      <Img src={staticFile(`img/dp30/${f}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, filter: "sepia(0.08)" }} />
    </div>;
  })}</>;
};

// título estilo reportagem: muda a cada parte da história ("conta de 1 até 18" só no gancho)
const TITULOS: [number, number, string, string][] = [
  [0, 14.4, "“CONTA DE 1 ATÉ 18”", "DANIELLA PEREZ, 22 ANOS"],
  [14.4, 28.0, "O CRIME QUE PAROU O BRASIL", "RIO DE JANEIRO, 1992"],
  [28.0, 46.8, "TUDO O QUE FOI TIRADO DELA", "A CARREIRA, OS FILHOS, OS NETOS"],
  [46.8, 58.1, "A MÃE QUE NÃO SE CALOU", "GLÓRIA PEREZ"],
  [58.1, 72.1, "30 ANOS DEPOIS", "A MEMÓRIA DE DANIELLA"],
];
const Titulos: React.FC = () => {
  const t = useS();
  return <>{TITULOS.map(([de, ate, l1, l2], i) => {
    if (t < de - 0.4 || t > ate + 0.4) return null;
    const op = interpolate(t, [de - (i ? 0.25 : 0), de + (i ? 0.25 : 0.5), ate - 0.25, ate + 0.25], [0, 1, 1, i === TITULOS.length - 1 ? 1 : 0], clamp);
    const y = interpolate(t, [de - 0.25, de + 0.35], [i ? 18 : 20, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
    return <div key={i} style={{ position: "absolute", left: 60, right: 60, top: 450, opacity: op, transform: `translateY(${y}px)` }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 56, lineHeight: 1.1, color: C.osso, textShadow: "0 4px 18px rgba(0,0,0,0.9)" }}>{l1}</div>
      <div style={{ display: "inline-block", marginTop: 10, background: C.lacre, padding: "2px 14px", fontFamily: MONT, fontWeight: 800, fontSize: 44, color: C.osso }}>{l2}</div>
    </div>;
  })}</>;
};

// cartões finais (sem fala): desfecho + chamada do perfil
const Final: React.FC = () => {
  const t = useS();
  const a = entra(t, 58.4, 62.6), b = entra(t, 62.8, 67.8), c = entra(t, 68.0, 72.2);
  const box: React.CSSProperties = { position: "absolute", left: 60, right: 60, top: BAND_TOP + BAND_H + 36, textAlign: "center" };
  return <>
    {a > 0 && <div style={{ ...box, opacity: a, transform: `translateY(${(1 - a) * 16}px)` }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 64, color: C.osso, textShadow: "0 4px 18px #000" }}>DANIELLA PEREZ</div>
      <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 40, color: C.fita, marginTop: 6, letterSpacing: "0.1em" }}>1970 — 1992</div>
    </div>}
    {b > 0 && <div style={{ ...box, opacity: b }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 42, lineHeight: 1.28, color: "#fff", textShadow: "0 3px 14px #000" }}>Guilherme de Pádua e Paula Thomaz foram <span style={{ color: "#FF4D57" }}>condenados</span>.</div>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, lineHeight: 1.32, color: "rgba(255,255,255,0.88)", marginTop: 14, textShadow: "0 3px 14px #000" }}>A campanha de Glória Perez colocou o homicídio qualificado na lista de crimes hediondos (Lei 8.930/1994).</div>
    </div>}
    {c > 0 && <div style={{ ...box, opacity: c }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 50, lineHeight: 1.2, color: C.osso, textShadow: "0 4px 18px #000" }}>Próximo caso no perfil.</div>
      <div style={{ display: "inline-block", marginTop: 14, background: C.lacre, padding: "6px 22px", fontFamily: MONT, fontWeight: 800, fontSize: 50, color: "#fff" }}>Segue o Álibi.</div>
    </div>}
  </>;
};

export const CorteGloria2: React.FC = () => {
  const t = useS();
  const tit = interpolate(t, [0, 0.5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill style={{ background: "#0A0A0B", overflow: "hidden" }}>
    <AbsoluteFill><OffthreadVideo src={staticFile("v/dp30.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(42px) brightness(0.3) saturate(0.8)", transform: "scale(1.2)" }} /></AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,10,11,0.55) 0%, rgba(10,10,11,0.1) 30%, rgba(10,10,11,0.1) 70%, rgba(10,10,11,0.6) 100%)" }} />
    <div style={{ position: "absolute", left: 0, top: BAND_TOP, width: 1080, height: BAND_H, overflow: "hidden", borderTop: "3px solid rgba(236,231,220,0.85)", borderBottom: "3px solid rgba(236,231,220,0.85)", boxShadow: "0 30px 80px rgba(0,0,0,0.8)" }}>
      <OffthreadVideo src={staticFile("v/dp30.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <Fotos />
      <div style={{ position: "absolute", right: 14, top: 12, padding: "4px 10px", background: "rgba(10,10,11,0.6)", fontFamily: SANS, fontWeight: 700, fontSize: 18, color: "rgba(236,231,220,0.85)" }}>HBO MAX · PACTO BRUTAL</div>
    </div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 380, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: tit }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 40, letterSpacing: "0.14em", color: C.osso }}>ÁLIBI</div>
      <div style={{ padding: "5px 14px", background: C.lacre, fontFamily: MONT, fontWeight: 800, fontSize: 26, color: C.osso, letterSpacing: "0.06em" }}>Nº 030 · CASO REAL</div>
    </div>
    <Titulos />
    <Cracha de={2.9} ate={5.5} nome="DANIELLA PEREZ" sub="ATRIZ · 22 ANOS · MORTA EM 28/12/1992" />
    <Cracha de={0.3} ate={2.2} nome="GLÓRIA PEREZ" sub="MÃE DE DANIELLA · NA ÉPOCA DO CRIME" />
    <Cracha de={11.9} ate={14.3} nome="RAUL GAZOLLA" sub="ATOR · MARIDO DE DANIELLA" />
    <Cracha de={22.8} ate={25.1} nome="GUILHERME DE PÁDUA" sub="ATOR · CONDENADO PELO CRIME" />
    <Cracha de={34.6} ate={38.4} nome="GLÓRIA PEREZ" sub="MÃE DE DANIELLA · DEPOIMENTO À SÉRIE" />
    <Legenda />
    <Final />
    <div style={{ position: "absolute", left: 60, right: 60, top: 1720, fontFamily: SANS, fontWeight: 600, fontSize: 19, color: "rgba(236,231,220,0.6)" }}>Reprodução · HBO Max, “Pacto Brutal: o assassinato de Daniella Perez” (2022) e arquivo de TV</div>
    <div style={{ position: "absolute", left: 60, right: 60, top: 1755, fontFamily: COURIER, fontWeight: 700, fontSize: 24, color: "rgba(236,231,220,0.55)", letterSpacing: "0.08em" }}>toda história tem um álibi.</div>
  </AbsoluteFill>;
};

// capa do Nº 030 (vertical; a versão 3:4 é o recorte central 1080×1440, por isso o texto fica entre y=300 e y=1640)
export const CapaDp30: React.FC = () => (
  <AbsoluteFill style={{ background: C.preto }}>
    <Img src={staticFile("img/dp30/f150.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "38% 40%" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.85) 78%)" }} />
    <div style={{ position: "absolute", left: 80, right: 80, top: 330, textAlign: "center" }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 104, lineHeight: 1.02, color: C.osso, textShadow: "0 6px 28px rgba(0,0,0,0.95)" }}>“CONTA DE<br />1 ATÉ 18”</div>
    </div>
    <div style={{ position: "absolute", left: 80, right: 80, top: 1220, textAlign: "center" }}>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 50, color: C.osso, textShadow: "0 4px 18px #000" }}>Daniella Perez, 22 anos.</div>
      <div style={{ display: "inline-block", marginTop: 16, padding: "6px 24px 10px", background: C.lacre, fontFamily: MONT, fontWeight: 800, fontSize: 62, color: C.osso }}>O CRIME QUE PAROU O BRASIL</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1540, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 44, letterSpacing: "0.12em", color: C.osso }}>ÁLIBI</div>
  </AbsoluteFill>
);
