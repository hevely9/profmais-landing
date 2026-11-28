import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, COURIER, ELITE, MONT, SANS, SERIF } from "./kit";

// CARROSSEL 2 (modo foto, 1080×1920) — séries: O ÁLIBI QUE CAIU · HORA A HORA · ONDE ESTÃO HOJE · VERSÃO × FATO.
// Área segura: x 90–990, y 380–1540 (fora disso a interface do TikTok cobre).
const CRED: React.CSSProperties = { fontFamily: SANS, fontWeight: 600, fontSize: 19, color: "rgba(236,231,220,0.55)" };
const fundo = "radial-gradient(ellipse at 50% 35%, #2A2622 0%, #0A0A0B 72%)";

export type Linha = { t: string; destaque?: boolean };
export type FolhaProps = {
  serie: string; n: number; total: number;
  img?: string | [string, string]; pos?: string; cinza?: boolean; imgTop?: number; imgH?: number; legendaImg?: string;
  chip?: string; hora?: string; titulo?: Linha[]; tSize?: number; texto?: string; xSize?: number;
  carimbo?: string; status?: [string, string]; credito?: string; dias?: [string, boolean][]; final?: { pergunta: string; palavra: string; resto: string }; capa?: boolean;
};

const Foto: React.FC<{ src: string; pos?: string; cinza?: boolean; style: React.CSSProperties }> = ({ src, pos = "50% 35%", cinza, style }) =>
  <div style={{ position: "absolute", overflow: "hidden", border: "6px solid #D9D2C0", boxSizing: "border-box", boxShadow: "0 24px 70px rgba(0,0,0,0.85)", background: "#111", ...style }}>
    <Img src={staticFile(`img/${src}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, filter: `${cinza ? "grayscale(1) " : ""}contrast(1.06)` }} />
  </div>;

export const Folha: React.FC<FolhaProps> = (p) => {
  const imgTop = p.imgTop ?? 470, imgH = p.imgH ?? 560;
  const temImg = !!p.img;
  const corpoTop = temImg ? imgTop + imgH + 40 : p.hora ? 760 : 560;
  return <AbsoluteFill style={{ background: fundo, overflow: "hidden" }}>
    {/* foto de fundo desfocada (atmosfera) */}
    {temImg && <AbsoluteFill><Img src={staticFile(`img/${Array.isArray(p.img) ? p.img[0] : p.img}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(46px) brightness(0.28) grayscale(0.6)", transform: "scale(1.3)" }} /></AbsoluteFill>}
    {/* topo: série + contador */}
    <div style={{ position: "absolute", left: 90, right: 90, top: 380, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ padding: "7px 16px", background: C.lacre, fontFamily: MONT, fontWeight: 800, fontSize: 28, color: C.osso, letterSpacing: "0.05em" }}>{p.serie}</div>
      <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 30, color: C.osso, letterSpacing: "0.1em" }}>{p.n}/{p.total}</div>
    </div>
    {/* foto(s) */}
    {typeof p.img === "string" && <Foto src={p.img} pos={p.pos} cinza={p.cinza} style={{ left: 90, top: imgTop, width: 900, height: imgH }} />}
    {Array.isArray(p.img) && <>
      <Foto src={p.img[0]} pos={p.pos} cinza={p.cinza} style={{ left: 90, top: imgTop, width: 442, height: imgH }} />
      <Foto src={p.img[1]} pos={p.pos} cinza={p.cinza} style={{ left: 548, top: imgTop, width: 442, height: imgH }} />
    </>}
    {temImg && p.legendaImg && <div style={{ position: "absolute", left: 104, top: imgTop + imgH - 52, padding: "4px 12px", background: "rgba(10,10,11,0.85)", fontFamily: SANS, fontWeight: 700, fontSize: 22, color: C.osso }}>{p.legendaImg}</div>}
    {temImg && p.credito && <div style={{ ...CRED, position: "absolute", right: 90, top: imgTop + imgH + 8 }}>{p.credito}</div>}
    {p.carimbo && <div style={{ position: "absolute", left: 110, top: imgTop + imgH - 62, display: "flex" }}>
      <div style={{ transform: "rotate(-4deg)", border: `7px solid ${C.verm}`, borderRadius: 8, padding: "4px 22px", fontFamily: ELITE, fontSize: 62, color: C.verm, background: "rgba(10,10,11,0.55)", letterSpacing: "0.05em" }}>{p.carimbo}</div>
    </div>}
    {/* hora grande (série HORA A HORA) */}
    {p.hora && <div style={{ position: "absolute", left: 90, right: 90, top: temImg ? imgTop + imgH + 62 : 470 }}>
      {p.chip && <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 36, color: C.fita, letterSpacing: "0.12em" }}>{p.chip}</div>}
      <div style={{ display: "inline-block", marginTop: 10, padding: "4px 26px 10px", border: `5px solid ${C.verm}`, fontFamily: MONT, fontWeight: 800, fontSize: temImg ? 120 : 200, lineHeight: 1, color: C.verm, letterSpacing: "0.02em" }}>{p.hora}</div>
    </div>}
    {/* corpo */}
    <div style={{ position: "absolute", left: 90, right: 90, top: p.hora ? (temImg ? imgTop + imgH + 290 : 800) : corpoTop }}>
      {p.status && <div style={{ display: "inline-block", marginBottom: 18, padding: "6px 16px", background: p.status[1], fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#fff", letterSpacing: "0.06em" }}>{p.status[0]}</div>}
      {!p.hora && p.chip && <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 32, color: C.fita, letterSpacing: "0.1em", marginBottom: 12 }}>{p.chip}</div>}
      {(p.titulo ?? []).map((l, i) => <div key={i} style={{ display: "flex" }}>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: p.tSize ?? 64, lineHeight: 1.08, color: C.osso, background: l.destaque ? C.lacre : "none", padding: l.destaque ? "2px 16px 8px" : "0 0 4px", margin: l.destaque ? "6px 0" : 0 }}>{l.t}</div>
      </div>)}
      {p.texto && <div style={{ marginTop: 22, fontFamily: SANS, fontWeight: 600, fontSize: p.xSize ?? (temImg ? 40 : 48), lineHeight: 1.32, color: "rgba(236,231,220,0.92)", whiteSpace: "pre-line" }}>{p.texto}</div>}
      {p.final && <div style={{ marginTop: 30, padding: "22px 26px", border: `3px solid ${C.osso}`, background: "rgba(10,10,11,0.6)" }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 38, color: C.osso, lineHeight: 1.25 }}>{p.final.pergunta}</div>
        <div style={{ marginTop: 10, fontFamily: SANS, fontWeight: 800, fontSize: 38, color: C.osso, lineHeight: 1.25 }}>Comenta <span style={{ background: C.lacre, padding: "0 10px" }}>{p.final.palavra}</span> {p.final.resto}</div>
      </div>}
    </div>
    {/* linha do tempo dos dias (slides só de texto) */}
    {p.dias && <div style={{ position: "absolute", left: 90, right: 90, top: 1250, display: "flex", alignItems: "center" }}>
      {p.dias.map(([d, on], i) => <React.Fragment key={i}>
        {i > 0 && <div style={{ flex: 1, height: 4, background: on || p.dias![i - 1][1] ? C.verm : "rgba(236,231,220,0.25)" }} />}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ width: on ? 34 : 22, height: on ? 34 : 22, borderRadius: "50%", background: on ? C.verm : "rgba(236,231,220,0.3)", border: on ? "4px solid #ECE7DC" : "none" }} />
        </div>
      </React.Fragment>)}
    </div>}
    {p.dias && <div style={{ position: "absolute", left: 60, right: 60, top: 1310, display: "flex", justifyContent: "space-between" }}>
      {p.dias.map(([d, on], i) => <div key={i} style={{ width: 90, textAlign: "center", fontFamily: COURIER, fontWeight: 700, fontSize: 26, color: on ? C.osso : "rgba(236,231,220,0.45)" }}>{d}</div>)}
    </div>}
    {/* rodapé */}
    <div style={{ position: "absolute", left: 90, right: 90, top: 1490, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 30, letterSpacing: "0.12em", color: "rgba(236,231,220,0.7)" }}>ÁLIBI</div>
      {p.n < p.total && <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 36, color: C.osso }}>arrasta <span style={{ color: C.verm }}>→</span></div>}
    </div>
    {!temImg && p.credito && <div style={{ ...CRED, position: "absolute", right: 90, top: 1450 }}>{p.credito}</div>}
  </AbsoluteFill>;
};

// capa da série ONDE ESTÃO HOJE: mosaico 2×2
export const CapaOnde: React.FC<{ imgs: [string, string][]; total: number }> = ({ imgs, total }) => (
  <AbsoluteFill style={{ background: fundo }}>
    <div style={{ position: "absolute", left: 90, right: 90, top: 380, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ padding: "7px 16px", background: C.lacre, fontFamily: MONT, fontWeight: 800, fontSize: 28, color: C.osso, letterSpacing: "0.05em" }}>ATUALIZADO · NOV/2026</div>
      <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 30, color: C.osso, letterSpacing: "0.1em" }}>1/{total}</div>
    </div>
    {imgs.map(([src, pos], i) => <Foto key={i} src={src} pos={pos} style={{ left: i % 2 ? 548 : 90, top: 470 + Math.floor(i / 2) * 330, width: 442, height: 314 }} />)}
    <div style={{ position: "absolute", left: 90, right: 90, top: 1120 }}>
      <div style={{ display: "flex" }}><div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 90, lineHeight: 1.02, color: C.osso, background: C.lacre, padding: "2px 18px 10px" }}>ONDE ESTÃO</div></div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 90, lineHeight: 1.05, color: C.osso, marginTop: 6 }}>HOJE?</div>
      <div style={{ marginTop: 12, fontFamily: ELITE, fontSize: 32, color: C.osso }}>os condenados dos crimes que pararam o Brasil</div>
    </div>
    <div style={{ position: "absolute", left: 90, right: 90, top: 1490, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 30, letterSpacing: "0.12em", color: "rgba(236,231,220,0.7)" }}>ÁLIBI</div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 36, color: C.osso }}>arrasta <span style={{ color: C.verm }}>→</span></div>
    </div>
  </AbsoluteFill>
);

// VERSÃO × FATO — carrossel: capa (1) + um caso por foto
const Rodape: React.FC<{ seta: boolean }> = ({ seta }) =>
  <div style={{ position: "absolute", left: 90, right: 90, top: 1495, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 30, letterSpacing: "0.12em", color: "rgba(236,231,220,0.7)" }}>ÁLIBI</div>
    {seta && <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 36, color: C.osso }}>arrasta <span style={{ color: C.verm }}>→</span></div>}
  </div>;
const Topo: React.FC<{ esq: string; dir: string }> = ({ esq, dir }) =>
  <div style={{ position: "absolute", left: 90, right: 90, top: 380, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div style={{ padding: "7px 16px", background: C.lacre, fontFamily: MONT, fontWeight: 800, fontSize: 28, color: C.osso, letterSpacing: "0.05em" }}>{esq}</div>
    <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 30, color: C.osso, letterSpacing: "0.1em" }}>{dir}</div>
  </div>;

export const CapaVxF: React.FC<{ imgs: [string, string][]; total: number }> = ({ imgs, total }) => (
  <AbsoluteFill style={{ background: fundo }}>
    <Topo esq="VERSÃO × FATO" dir={`1/${total}`} />
    {imgs.map(([src, pos], i) => <React.Fragment key={i}>
      <Foto src={src} pos={pos} cinza style={{ left: i % 2 ? 548 : 90, top: 460 + Math.floor(i / 2) * 300, width: 442, height: 284 }} />
      <div style={{ position: "absolute", left: (i % 2 ? 548 : 90), width: 442, top: 460 + Math.floor(i / 2) * 300 + 232, display: "flex", justifyContent: "center" }}>
        <div style={{ transform: "rotate(-6deg)", border: `5px solid ${C.verm}`, borderRadius: 6, padding: "2px 14px", fontFamily: ELITE, fontSize: 40, color: C.verm, background: "rgba(10,10,11,0.6)" }}>VERSÃO FALSA</div>
      </div>
    </React.Fragment>)}
    <div style={{ position: "absolute", left: 90, right: 90, top: 1090 }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 70, lineHeight: 1.06, color: C.osso }}>{imgs.length} histórias contadas à polícia.</div>
      <div style={{ display: "flex", marginTop: 12 }}><div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 70, lineHeight: 1.06, color: C.osso, background: C.lacre, padding: "2px 16px 8px" }}>Nenhuma era verdade.</div></div>
      <div style={{ marginTop: 18, fontFamily: ELITE, fontSize: 38, color: C.osso }}>arrasta e vê o que a perícia descobriu</div>
    </div>
    <Rodape seta />
  </AbsoluteFill>
);

export const VersaoFatoPost: React.FC<{ n?: number; total?: number; caso: string; img: string; pos?: string; credito: string; versao: string; fatos: string[]; desfecho: string; final?: { palavra: string; resto: string } }> = ({ n, total, caso, img, pos = "50% 30%", credito, versao, fatos, desfecho, final }) => (
  <AbsoluteFill style={{ background: fundo }}>
    <Topo esq={caso} dir={n ? `${n}/${total}` : ""} />
    <Foto src={img} pos={pos} style={{ left: 90, top: 450, width: 300, height: 380 }} />
    <div style={{ ...CRED, position: "absolute", left: 90, top: 838, width: 300, fontSize: 16 }}>{credito}</div>
    <div style={{ position: "absolute", left: 420, right: 90, top: 450, height: 380, padding: "22px 26px", boxSizing: "border-box", background: "rgba(236,231,220,0.08)", border: "2px solid rgba(236,231,220,0.3)" }}>
      <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 28, color: C.ossoE, letterSpacing: "0.12em" }}>A VERSÃO</div>
      <div style={{ marginTop: 14, fontFamily: ELITE, fontSize: 38, lineHeight: 1.3, color: C.osso }}>{versao}</div>
    </div>
    <div style={{ position: "absolute", left: 90, right: 90, top: 880, padding: "24px 30px", background: "rgba(10,10,11,0.7)", borderLeft: `10px solid ${C.verm}` }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 40, color: C.verm, letterSpacing: "0.03em" }}>O QUE A INVESTIGAÇÃO PROVOU</div>
      {fatos.map((f, i) => <div key={i} style={{ marginTop: 16, display: "flex", gap: 16, fontFamily: SANS, fontWeight: 700, fontSize: 36, lineHeight: 1.28, color: C.osso }}><span style={{ color: C.verm }}>✕</span><span>{f}</span></div>)}
    </div>
    {final && <div style={{ position: "absolute", left: 90, right: 90, top: 1330, padding: "14px 20px", border: `3px solid ${C.osso}`, background: "rgba(10,10,11,0.6)", fontFamily: SANS, fontWeight: 800, fontSize: 32, color: C.osso, textAlign: "center" }}>Comenta <span style={{ background: C.lacre, padding: "0 10px" }}>{final.palavra}</span> {final.resto}</div>}
    <div style={{ position: "absolute", left: 90, right: 90, top: 1440, fontFamily: SANS, fontWeight: 800, fontSize: 32, color: C.osso, textAlign: "center" }}>{desfecho}</div>
    <Rodape seta={!!n && n < (total ?? 0)} />
  </AbsoluteFill>
);
