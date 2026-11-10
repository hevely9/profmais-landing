import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CAM, Cam, FPS, ICON_X, ICON_Y, LEAD, SEG, SFX, T, TOTAL, VAL, WORDS, q } from "./timeline";
import { Frasco, ICONES, INK, IconAmpulheta, IconCoelho, IconPAO, IconPontoVerde, IconTriangulo, Moeda, Predio, Salvar } from "./icones";

// ── tema: papel pontilhado, tinta, marca-texto rosa ────────────────────────
export const C = { papel: "#F3F1EC", ponto: "#D3CEC4", tinta: INK, cinza: "#77716A", rosa: "#E7B7C2", rosaForte: "#D9677F", branco: "#FFFFFF" };
const SANS = "Inter", MONO = "JetBrains Mono", MAO = "Caveat", TEXTO = "Lato";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SP = { suave: { damping: 200 }, mola: { damping: 13, stiffness: 160 }, pop: { damping: 10, stiffness: 190 } };
const ease = Easing.bezier(0.65, 0, 0.35, 1);
const lin = (t: number, a: number, b: number, e = ease) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, t: f / fps }; };
const sp = (f: number, fps: number, at: number, cfg = SP.suave) => spring({ frame: f - q(at), fps, config: cfg });

// ── câmera ────────────────────────────────────────────────────────────────
export const camAt = (t: number): Cam => {
  let c = CAM[0].c;
  for (const k of CAM.slice(1)) {
    if (t < k.t) break;
    const p = k.d === 0 ? 1 : lin(t, k.t, k.t + k.d);
    c = { s: Math.exp(Math.log(c.s) + (Math.log(k.c.s) - Math.log(c.s)) * p), px: c.px + (k.c.px - c.px) * p, py: c.py + (k.c.py - c.py) * p,
      sx: c.sx + (k.c.sx - c.sx) * p, sy: c.sy + (k.c.sy - c.sy) * p };
  }
  return { ...c, s: c.s * (1 + 0.006 * Math.sin(t * 0.7)) }; // respiração sutil
};
const worldTransform = (c: Cam) => `translate(${c.sx - c.px * c.s}px, ${c.sy - c.py * c.s}px) scale(${c.s})`;

// ── traço que se desenha ──────────────────────────────────────────────────
const Traco: React.FC<{ d: string; p: number; len?: number; w?: number; color?: string }> = ({ d, p, len = 600, w = 6, color = C.tinta }) => (
  <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
);

// ── embalagem (mundo) ─────────────────────────────────────────────────────
const BARRAS = Array.from({ length: 46 }, (_, i) => ((i * 7919) % 13) % 3 === 0 ? 6 : ((i * 104729) % 7) % 2 === 0 ? 3 : 2);
const Codigo: React.FC = () => (
  <div style={{ position: "absolute", left: 334, top: 1432, width: 230 }}>
    <div style={{ display: "flex", gap: 2, height: 96 }}>{BARRAS.map((w, i) => <div key={i} style={{ width: w, background: i % 2 ? "transparent" : C.tinta }} />)}</div>
    <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 15, color: C.tinta, letterSpacing: "0.12em", marginTop: 6 }}>7 891234 567890</div>
  </div>
);
const Marca: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <span style={{ backgroundImage: `linear-gradient(${C.rosa}, ${C.rosa})`, backgroundRepeat: "no-repeat", backgroundSize: `${p * 100}% 78%`, backgroundPosition: "0 60%",
    padding: "0 3px", margin: "0 -3px" }}>{children}</span>
);

const Mundo: React.FC<{ t: number }> = ({ t }) => {
  const { f, fps } = useT();
  const niac = lin(t, T.rotulos + 0.35, T.rotulos + 0.8);
  const val = lin(t, SEG.amp.ate + 0.9, SEG.amp.ate + 1.4);
  const segs = [SEG.pao, SEG.coelho, SEG.tri, SEG.amp, SEG.verde];
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920 }}>
      {/* produtos do gancho */}
      <Produtos t={t} />
      {/* tampa e corpo */}
      <div style={{ position: "absolute", left: 322, top: 248, width: 436, height: 148, borderRadius: "20px 20px 8px 8px",
        background: "repeating-linear-gradient(90deg, #D6D1C8 0 9px, #E9E5DE 9px 18px)", boxShadow: "inset 0 -10px 18px rgba(0,0,0,0.08)" }} />
      <div style={{ position: "absolute", left: 290, top: 384, width: 500, height: 1330, borderRadius: 42,
        background: "linear-gradient(90deg, #E6E3DD 0%, #FFFFFF 13%, #FFFFFF 85%, #E2DFD9 100%)", boxShadow: "0 50px 90px -40px rgba(60,48,36,0.45), 0 2px 0 #E2DED6" }} />
      {/* rótulo */}
      <div style={{ position: "absolute", left: 334, top: 446, fontFamily: SANS, fontWeight: 800, fontSize: 58, letterSpacing: "-0.035em", color: C.tinta }}>HIDRATANTE</div>
      <div style={{ position: "absolute", left: 334, top: 520, fontFamily: SANS, fontWeight: 600, fontSize: 24, color: C.cinza }}>facial · todos os tipos de pele</div>
      <div style={{ position: "absolute", left: 334, top: 574, width: 412, height: 2, background: "#DAD5CC" }} />
      <div style={{ position: "absolute", left: 334, top: 600, width: 412, fontFamily: TEXTO, fontSize: 21, lineHeight: 1.45, color: "#3A352F" }}>
        <b style={{ fontFamily: SANS, fontWeight: 800, fontSize: 19 }}>MODO DE USAR:</b> aplique no rosto limpo, de manhã e à noite. Evite contato com os olhos.</div>
      <div style={{ position: "absolute", left: 334, top: 790, fontFamily: MONO, fontWeight: 500, fontSize: 17, letterSpacing: "0.1em", color: "#8C867E" }}>COMPOSIÇÃO</div>
      <div style={{ position: "absolute", left: 334, top: 828, width: 420, fontFamily: MONO, fontWeight: 500, fontSize: 21, lineHeight: 1.55, color: C.tinta }}>
        INGREDIENTS: AQUA, GLYCERIN,<br /><Marca p={niac}>NIACINAMIDE</Marca>, PANTHENOL,<br />SODIUM HYALURONATE,<br />PHENOXYETHANOL.</div>
      {/* símbolos */}
      {ICONES.map((Ic, i) => {
        const ativo = t >= segs[i].de && t < segs[i].ate + (i === 3 ? 6 : 0);
        const pc = lin(t, segs[i].de + 0.45, segs[i].de + 1.05);
        const sai = i === 3 ? lin(t, SEG.verde.de - 0.4, SEG.verde.de - 0.1) : lin(t, segs[i].ate - 0.25, segs[i].ate);
        const ck = sp(f, fps, T.ler + i * 0.16, SP.pop);
        return (
          <React.Fragment key={i}>
            <Ic size={64} sw={5.5} style={{ position: "absolute", left: ICON_X[i] - 32, top: ICON_Y - 32 }} />
            {ativo && <svg style={{ position: "absolute", left: ICON_X[i] - 60, top: ICON_Y - 60, overflow: "visible", opacity: 1 - sai }} width={120} height={120}>
              <Traco d="M60 6 C96 4 116 30 113 62 C110 96 82 116 54 113 C24 110 6 86 8 58 C10 30 30 10 66 9" p={pc} len={420} w={4.5} color={C.rosaForte} />
            </svg>}
            {t > T.ler - 0.1 && <div style={{ position: "absolute", left: ICON_X[i] + 12, top: ICON_Y - 50, width: 34, height: 34, borderRadius: 17, background: C.rosa,
              border: `3px solid ${C.tinta}`, display: "grid", placeItems: "center", transform: `scale(${ck})` }}>
              <svg width="20" height="20" viewBox="0 0 20 20"><path d="M4 10.5 L8.5 15 L16 6" fill="none" stroke={C.tinta} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg></div>}
          </React.Fragment>
        );
      })}
      {/* lote e validade */}
      <div style={{ position: "absolute", left: 328, top: 1335, width: 176 * val, height: 32, background: C.rosa, borderRadius: 4 }} />
      <div style={{ position: "absolute", left: 334, top: 1300, fontFamily: MONO, fontWeight: 700, fontSize: 22, lineHeight: 1.45, color: C.tinta }}>LOTE 2611B<br />VAL. 11/2028</div>
      <div style={{ position: "absolute", left: 622, top: 1300, width: 124, height: 2, background: "#DAD5CC" }} />
      <Codigo />
      <div style={{ position: "absolute", right: 1080 - 746, top: 1462, fontFamily: SANS, fontWeight: 800, fontSize: 54, letterSpacing: "-0.03em", color: C.tinta }}>200 ml</div>
    </div>
  );
};

// Produtos que pulam em volta no gancho (pote, conta-gotas, bisnaga).
const Produtos: React.FC<{ t: number }> = ({ t }) => {
  const { f, fps } = useT();
  const pop = (i: number) => sp(f, fps, T.cosmeticos + i * 0.18, SP.pop);
  const fora = lin(t, T.descrito - 0.4, T.descrito + 0.2);
  const st = (i: number, rot: number): React.CSSProperties => ({ position: "absolute", transform: `translateY(${(1 - pop(i)) * 60 + fora * 40}px) scale(${pop(i)}) rotate(${rot}deg)`,
    opacity: Math.min(1, pop(i) * 1.5) * (1 - fora), transformOrigin: "50% 100%" });
  if (t > T.descrito + 0.3) return null;
  const sw = { stroke: C.tinta, strokeWidth: 6, strokeLinejoin: "round" as const };
  return <>
    <svg width="210" height="230" viewBox="0 0 210 230" style={{ ...st(0, -6), left: 40, top: 1420 }}>
      <rect x="20" y="40" width="170" height="40" rx="12" fill={C.rosa} {...sw} />
      <rect x="28" y="80" width="154" height="130" rx="26" fill={C.branco} {...sw} />
      <text x="105" y="160" textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize="26" fill={C.tinta}>CREME</text>
    </svg>
    <svg width="160" height="330" viewBox="0 0 160 330" style={{ ...st(1, 5), left: 860, top: 1300 }}>
      <ellipse cx="80" cy="44" rx="28" ry="34" fill={C.rosa} {...sw} />
      <rect x="54" y="74" width="52" height="46" rx="6" fill="#E9E5DE" {...sw} />
      <rect x="22" y="118" width="116" height="200" rx="34" fill="#F6EEE4" {...sw} />
      <text x="80" y="228" textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize="22" fill={C.tinta}>SÉRUM</text>
    </svg>
    <svg width="150" height="300" viewBox="0 0 150 300" style={{ ...st(2, -10), left: 90, top: 1130 }}>
      <rect x="45" y="230" width="60" height="58" rx="10" fill="#E9E5DE" {...sw} />
      <path d="M20 14 H130 L114 232 H36 Z" fill={C.branco} {...sw} />
      <path d="M20 14 H130" {...sw} strokeWidth={10} />
      <text x="75" y="130" textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize="20" fill={C.tinta} transform="rotate(-90 75 130)">PROTETOR</text>
    </svg>
  </>;
};

// ── lupa (mostra o mundo ampliado dentro do círculo) ──────────────────────
const Lupa: React.FC<{ cx: number; cy: number; r: number; zoom: number; cam: Cam; t: number; vis: number }> = ({ cx, cy, r, zoom, cam, t, vis }) => {
  if (vis <= 0.001) return null;
  const s2 = cam.s * zoom;
  const wx = (cx - (cam.sx - cam.px * cam.s)) / cam.s, wy = (cy - (cam.sy - cam.py * cam.s)) / cam.s;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(1, vis * 1.4),
      transform: `scale(${0.85 + 0.15 * vis})`, transformOrigin: `${cx}px ${cy}px` }}>
      <div style={{ position: "absolute", left: cx + r * 0.62, top: cy + r * 0.62, width: 46, height: r * 0.95, borderRadius: 23, background: C.tinta,
        transform: "rotate(-45deg)", transformOrigin: "50% 0", boxShadow: "0 14px 30px rgba(0,0,0,0.25)" }} />
      <div style={{ position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: "50%", overflow: "hidden", background: C.branco,
        boxShadow: "0 24px 50px -10px rgba(40,30,20,0.45)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: "0 0", transform: `translate(${r - wx * s2}px, ${r - wy * s2}px) scale(${s2})` }}>
          <Mundo t={t} />
        </div>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.45), transparent 38%)" }} />
      </div>
      <div style={{ position: "absolute", left: cx - r - 14, top: cy - r - 14, width: 2 * r + 28, height: 2 * r + 28, borderRadius: "50%", border: `16px solid ${C.tinta}` }} />
    </div>
  );
};

// ── letra à mão que se escreve da esquerda para a direita ────────────────
const Escrita: React.FC<{ at: number; dur?: number; size?: number; color?: string; style?: React.CSSProperties; sub?: boolean; children: React.ReactNode }> =
  ({ at, dur = 0.8, size = 62, color = C.tinta, style, sub = false, children }) => {
    const { t } = useT();
    const p = lin(t, at, at + dur, Easing.out(Easing.quad));
    if (p <= 0) return null;
    return (
      <div style={{ position: "absolute", fontFamily: MAO, fontWeight: 700, fontSize: size, lineHeight: 1.0, color, textAlign: "center", ...style }}>
        <div style={{ clipPath: `inset(-20% ${100 - p * 100}% -40% -5%)` }}>{children}</div>
        {sub && <svg width="100%" height="24" viewBox="0 0 400 24" preserveAspectRatio="none" style={{ display: "block", marginTop: 4 }}>
          <Traco d="M8 14 C80 4 150 22 220 10 C280 2 340 18 392 8" p={lin(t, at + dur * 0.7, at + dur * 0.7 + 0.45)} len={420} w={7} color={C.rosaForte} /></svg>}
      </div>
    );
  };

// ── cartão de cada símbolo ────────────────────────────────────────────────
const CX = 90, CY = 226, CW = 900, CH = 664;
const Cartao: React.FC<{ de: number; ate: number; titulo: string; tituloAt: number; children: React.ReactNode }> = ({ de, ate, titulo, tituloAt, children }) => {
  const { f, fps, t } = useT();
  if (t < de || t > ate + 0.35) return null;
  const p = sp(f, fps, de, SP.mola);
  const e = lin(t, ate, ate + 0.3, Easing.in(Easing.cubic));
  const tp = sp(f, fps, tituloAt);
  const seta = lin(t, de + 0.5, de + 0.95);
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: 1 - e }}>
        <Traco d="M640 902 C700 960 690 1030 600 1074" p={seta} len={240} w={7} />
        <Traco d="M612 1046 L598 1076 L632 1080" p={lin(t, de + 0.9, de + 1.1)} len={80} w={7} />
      </svg>
      <div style={{ position: "absolute", left: CX, top: CY, width: CW, height: CH, borderRadius: 46, background: C.branco, border: "2px solid #E4DFD6",
        boxShadow: "0 40px 80px -36px rgba(50,40,30,0.45)", opacity: Math.min(1, p * 1.6) * (1 - e),
        transform: `translateY(${(1 - p) * 70 - e * 60}px) scale(${0.92 + 0.08 * p - 0.04 * e}) rotate(${(1 - p) * -2}deg)` }}>
        {children}
        <div style={{ position: "absolute", left: 0, right: 0, top: 352, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 48, letterSpacing: "-0.03em",
          color: C.tinta, opacity: tp, transform: `translateY(${(1 - tp) * 18}px)` }}>{titulo}</div>
      </div>
    </>
  );
};
const Grande: React.FC<{ children: React.ReactNode; dx?: number }> = ({ children, dx = 0 }) => (
  <div style={{ position: "absolute", left: 315 + dx, top: 46, width: 270, height: 270 }}>{children}</div>
);

const CartaoPAO: React.FC = () => {
  const { f, fps, t } = useT();
  const abre = sp(f, fps, T.aberto, SP.pop);
  const n = Math.max(1, Math.round(interpolate(t, [T.tempo, T.tempo + 1.1], [1, 12], clamp)));
  const cal = sp(f, fps, T.tempo - 0.15, SP.pop);
  return (
    <Cartao de={SEG.pao.de} ate={SEG.pao.ate} titulo="PRAZO APÓS ABERTO" tituloAt={T.potinho + 0.1}>
      <Grande dx={-90}><IconPAO size={270} sw={4.5} abre={Math.min(1.15, abre)} meses={`${n}M`} /></Grande>
      <div style={{ position: "absolute", left: 610, top: 92, width: 170, height: 176, borderRadius: 22, background: C.branco, border: `5px solid ${C.tinta}`,
        overflow: "hidden", transform: `scale(${cal}) rotate(${(1 - cal) * 12 + 3}deg)`, opacity: Math.min(1, cal * 2) }}>
        <div style={{ height: 40, background: C.rosa, borderBottom: `5px solid ${C.tinta}` }} />
        <div style={{ textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 74, lineHeight: 1.05, color: C.tinta, marginTop: 6 }}>{n}</div>
        <div style={{ textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 20, color: C.cinza }}>{n === 1 ? "MÊS" : "MESES"}</div>
      </div>
      <Escrita at={T.aberto + 0.15} dur={0.9} size={64} sub style={{ left: 120, width: 660, top: 432 }}>use em até 12 meses<br />depois de abrir</Escrita>
    </Cartao>
  );
};
const CartaoCoelho: React.FC = () => {
  const { f, fps, t } = useT();
  const tr = lin(t, SEG.coelho.de + 0.15, SEG.coelho.de + 1.1, Easing.out(Easing.quad));
  const fr = sp(f, fps, T.testado - 0.1, SP.pop);
  const x = lin(t, T.testado + 0.3, T.testado + 0.6);
  return (
    <Cartao de={SEG.coelho.de} ate={SEG.coelho.ate} titulo="NÃO TESTADO EM ANIMAIS" tituloAt={T.coelhinho + 0.15}>
      <Grande dx={-90}><IconCoelho size={270} sw={4.5} traco={tr} orelha={Math.sin(t * 7) * lin(t, SEG.coelho.de + 1, SEG.coelho.de + 1.3)} /></Grande>
      <div style={{ position: "absolute", left: 600, top: 80, width: 190, height: 190, transform: `scale(${fr})`, opacity: Math.min(1, fr * 2) }}>
        <Frasco size={190} sw={5} />
        <svg width={190} height={190} viewBox="0 0 100 100" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <Traco d="M8 8 L92 92" p={x} len={130} w={9} color={C.rosaForte} />
          <Traco d="M92 8 L8 92" p={lin(t, T.testado + 0.5, T.testado + 0.8)} len={130} w={9} color={C.rosaForte} />
        </svg>
      </div>
      <Escrita at={T.animais} dur={0.7} size={76} sub style={{ left: 200, width: 500, top: 440 }}>cruelty free</Escrita>
    </Cartao>
  );
};
const CartaoTri: React.FC = () => {
  const { f, fps, t } = useT();
  const g = sp(f, fps, SEG.tri.de, SP.mola);
  const num = sp(f, fps, T.triangular, SP.pop);
  const tag = sp(f, fps, T.identif - 0.1, SP.pop);
  const tipo = "polipropileno".slice(0, Math.round(interpolate(t, [T.identif + 0.2, T.identif + 0.9], [0, 13], clamp)));
  return (
    <Cartao de={SEG.tri.de} ate={SEG.tri.ate} titulo="SÍMBOLO DE RECICLAGEM" tituloAt={T.triangular + 0.1}>
      <Grande dx={-90}><IconTriangulo size={250} sw={4.5} giro={(1 - g) * -120} num={Math.min(1, num)} cod="PP" style={{ marginLeft: 10, marginTop: 6 }} /></Grande>
      <div style={{ position: "absolute", left: 560, top: 110, padding: "18px 26px", borderRadius: 20, background: "#FBF6EF", border: `4px solid ${C.tinta}`,
        transform: `scale(${tag}) rotate(${(1 - tag) * 10 - 2}deg)`, opacity: Math.min(1, tag * 2), transformOrigin: "0 50%" }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.tinta, letterSpacing: "-0.02em" }}>5 = PP</div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.cinza, minHeight: 30 }}>{tipo}</div>
      </div>
      <Escrita at={T.recic1} dur={0.9} size={64} sub style={{ left: 110, width: 680, top: 432 }}>o número diz qual<br />é o tipo de plástico</Escrita>
    </Cartao>
  );
};
const CartaoAmp: React.FC = () => {
  const { f, fps, t } = useT();
  const areia = lin(t, SEG.amp.de + 0.3, SEG.amp.ate, Easing.linear);
  const selo = sp(f, fps, T.validade, SP.pop);
  return (
    <Cartao de={SEG.amp.de} ate={SEG.amp.ate} titulo="PRAZO DE VALIDADE" tituloAt={T.ampulheta + 0.25}>
      <Grande dx={-90}><IconAmpulheta size={270} sw={4.5} areia={0.06 + 0.88 * areia} style={{ transform: `rotate(${Math.sin(t * 2.2) * 3}deg)` }} /></Grande>
      <div style={{ position: "absolute", left: 560, top: 120, padding: "16px 24px", borderRadius: 14, border: `6px solid ${C.rosaForte}`, color: C.rosaForte,
        fontFamily: MONO, fontWeight: 700, fontSize: 40, transform: `scale(${2 - selo}) rotate(-8deg)`, opacity: Math.min(1, selo * 1.5) }}>VAL.<br />11/2028</div>
      <Escrita at={T.validade + 0.45} dur={0.8} size={68} sub style={{ left: 170, width: 560, top: 440 }}>tem data pra acabar</Escrita>
    </Cartao>
  );
};
const CartaoVerde: React.FC = () => {
  const { f, fps, t } = useT();
  const g = sp(f, fps, SEG.verde.de, SP.mola);
  const pr = sp(f, fps, T.empresa - 0.1, SP.pop);
  return (
    <Cartao de={SEG.verde.de} ate={SEG.verde.ate} titulo="PONTO VERDE" tituloAt={T.setas}>
      <Grande><IconPontoVerde size={270} sw={4.5} giro={(1 - g) * -300 + (t - SEG.verde.de) * 14} /></Grande>
      <div style={{ position: "absolute", left: 70, top: 100, transform: `scale(${pr})`, opacity: Math.min(1, pr * 2) }}><Predio size={170} sw={5} />
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, color: C.cinza, textAlign: "center", marginTop: 4 }}>EMPRESA</div></div>
      {[0, 1, 2].map((i) => {
        const a = T.financ + i * 0.3;
        const p = lin(t, a, a + 0.42, Easing.in(Easing.quad));
        if (t < a || t > a + 0.6) return null;
        return <div key={i} style={{ position: "absolute", left: 405 + (i - 1) * 24, top: -60 + p * 230, opacity: 1 - lin(t, a + 0.42, a + 0.6), transform: `rotate(${p * 200}deg)` }}><Moeda size={90} /></div>;
      })}
      <Escrita at={T.recic2} dur={0.9} size={64} sub style={{ left: 120, width: 660, top: 432 }}>a marca ajuda a pagar<br />a reciclagem</Escrita>
    </Cartao>
  );
};

// ── abertura, validade e final ────────────────────────────────────────────
const Abertura: React.FC = () => {
  const { f, fps, t } = useT();
  const p = sp(f, fps, 0.05, SP.mola), e = lin(t, T.descrito - 0.45, T.descrito - 0.1);
  if (e >= 1) return null;
  const m = lin(t, 0.9, 1.4);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 92, lineHeight: 1.0,
      letterSpacing: "-0.045em", color: C.tinta, opacity: Math.min(1, p * 1.5) * (1 - e), transform: `translateY(${(1 - p) * 40 - e * 30}px)` }}>
      VOCÊ SABE LER<br />O <Marca p={m}>RÓTULO</Marca>?
    </div>
  );
};
const Pergunta: React.FC = () => {
  const { f, fps, t } = useT();
  if (t < T.embalagens || t > SEG.pao.de) return null;
  const p = sp(f, fps, T.embalagens, SP.pop), e = lin(t, SEG.pao.de - 0.3, SEG.pao.de);
  return <div style={{ position: "absolute", left: 170, top: 150, width: 740, padding: "18px 0 26px", borderRadius: 34, background: C.branco, textAlign: "center",
    boxShadow: "0 30px 60px -30px rgba(50,40,30,0.5)", fontFamily: MAO, fontWeight: 700, fontSize: 104, lineHeight: 1, color: C.rosaForte,
    transform: `scale(${p}) rotate(${-4 + (1 - p) * 14}deg)`, opacity: 1 - e }}>o que é tudo isso?</div>;
};
const NotaValidade: React.FC = () => {
  const { t } = useT();
  if (t < T.conferir - 0.2 || t > SEG.verde.de) return null;
  const e = lin(t, SEG.verde.de - 0.35, SEG.verde.de);
  return (
    <div style={{ position: "absolute", left: 130, top: 170, width: 820, height: 170, borderRadius: 34, background: C.branco,
      boxShadow: "0 30px 60px -30px rgba(50,40,30,0.5)", opacity: (1 - e) * lin(t, T.conferir - 0.2, T.conferir), transform: "rotate(-2deg)" }}>
      <Escrita at={T.conferir} dur={0.8} size={88} color={C.tinta} sub style={{ left: 40, width: 740, top: 30 }}>confere antes de usar!</Escrita>
    </div>
  );
};
const Final: React.FC = () => {
  const { f, fps, t } = useT();
  if (t < T.agora) return null;
  const p = sp(f, fps, T.agora + 0.15, SP.mola), m = lin(t, T.ler + 0.1, T.ler + 0.55);
  const c = sp(f, fps, T.salva - 0.05, SP.mola);
  const cheio = lin(t, T.salva + 0.25, T.salva + 0.5);
  const e = lin(t, T.salva - 0.25, T.salva);
  return <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 84, lineHeight: 1.0,
      letterSpacing: "-0.045em", color: C.tinta, opacity: Math.min(1, p * 1.5) * (1 - e), transform: `translateY(${(1 - p) * 40}px)` }}>
      AGORA VOCÊ SABE<br />LER O <Marca p={m}>RÓTULO</Marca></div>
    {t >= T.salva - 0.05 && <div style={{ position: "absolute", left: 140, top: 520, width: 800, padding: "40px 30px 46px", borderRadius: 46, background: C.branco,
      border: "2px solid #E4DFD6", boxShadow: "0 40px 80px -36px rgba(50,40,30,0.5)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
      opacity: Math.min(1, c * 1.6), transform: `translateY(${(1 - c) * 80}px) scale(${0.9 + 0.1 * c})` }}>
      <Salvar size={150} cheio={cheio} style={{ transform: `scale(${1 + 0.12 * Math.sin(lin(t, T.salva + 0.25, T.salva + 0.6) * Math.PI)})` }} />
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 70, letterSpacing: "-0.04em", color: C.tinta }}>SALVA ESSE VÍDEO</div>
      <div style={{ position: "relative", width: 600, height: 80 }}>
        <Escrita at={T.lembrar} dur={0.7} size={66} sub style={{ left: 0, width: 600, top: 0 }}>pra lembrar depois</Escrita></div>
    </div>}
  </>;
};

// ── legenda karaokê (marca-texto rosa na palavra falada) ─────────────────
const PAGES = (() => {
  const out: { de: number; ate: number; w: typeof WORDS }[] = []; let cur: typeof WORDS = [];
  WORDS.forEach((w, i) => {
    cur.push(w); const nx = WORDS[i + 1];
    const len = cur.map((x) => x.text).join(" ").length;
    if (!nx || /[.,?!]$/.test(w.text) || len >= 17 || cur.length >= 4 || nx.start - w.end > 0.4) { out.push({ de: cur[0].start, ate: w.end, w: cur }); cur = []; }
  });
  return out.map((p, i) => ({ ...p, ate: out[i + 1] && out[i + 1].de - p.ate < 0.6 ? out[i + 1].de : p.ate + 0.3 }));
})();
const Legenda: React.FC = () => {
  const { f, fps, t } = useT();
  const pg = PAGES.find((p) => t >= p.de - 0.06 && t < p.ate - 0.06);
  if (!pg) return null;
  const pin = spring({ frame: f - q(pg.de - 0.06), fps, config: { damping: 18, stiffness: 220 } });
  return (
    <div style={{ position: "absolute", left: 70, right: 140, top: 1490, display: "flex", justifyContent: "center", opacity: Math.min(1, pin * 1.8), transform: `translateY(${(1 - pin) * 14}px)` }}>
     <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: 8, rowGap: 2, padding: "12px 16px", borderRadius: 26,
      background: "rgba(255,255,255,0.94)", boxShadow: "0 18px 40px -20px rgba(50,40,30,0.45)" }}>
      {pg.w.map((w, i) => {
        const on = t >= w.start - 0.06, ativo = on && t < w.end + 0.05;
        const hp = lin(t, w.start - 0.06, w.start + 0.08, Easing.out(Easing.quad));
        return <span key={i} style={{ fontFamily: SANS, fontWeight: 800, fontSize: 54, letterSpacing: "-0.03em", lineHeight: 1.15, textTransform: "uppercase",
          color: on ? C.tinta : "rgba(31,27,23,0.32)", padding: "0 8px", borderRadius: 10,
          backgroundImage: `linear-gradient(${C.rosa}, ${C.rosa})`, backgroundRepeat: "no-repeat", backgroundPosition: "0 70%",
          backgroundSize: `${(ativo ? hp : 0) * 100}% 72%` }}>{w.text.replace(/[,;:]$/, "")}</span>;
      })}
     </div>
    </div>
  );
};

// ── fundo e acabamento ────────────────────────────────────────────────────
const Papel: React.FC = () => (
  <AbsoluteFill style={{ background: C.papel, backgroundImage: `radial-gradient(${C.ponto} 1.6px, transparent 1.9px)`, backgroundSize: "34px 34px" }} />
);
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
const Acabamento: React.FC = () => {
  const { f } = useT();
  return <>
    <AbsoluteFill style={{ backgroundImage: NOISE, backgroundSize: "220px", backgroundPosition: `${(f * 7) % 220}px ${(f * 13) % 220}px`, opacity: 0.05, mixBlendMode: "multiply" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(60,45,30,0.16) 100%)" }} />
  </>;
};

const Sons: React.FC = () => (
  <>
    <Sequence from={q(LEAD)}><Audio src={staticFile("audio/voz.mp3")} volume={1} /></Sequence>
    <Audio src={staticFile("audio/trilha.mp3")} volume={(f) => 0.075 * interpolate(f, [0, 12], [0, 1], clamp) * interpolate(f, [TOTAL - q(1.6), TOTAL - 3], [1, 0], clamp)} />
    {SFX.map((s, i) => <Sequence key={i} from={Math.max(0, q(s.at))} durationInFrames={q(2)}><Audio src={staticFile(`audio/${s.src}.mp3`)} volume={s.vol ?? 0.5} /></Sequence>)}
  </>
);

// ── composição ────────────────────────────────────────────────────────────
export const Reel: React.FC<{ legenda: boolean }> = ({ legenda }) => {
  const { t } = useT();
  const cam = camAt(t);
  const lupa1 = lin(t, T.rotulos - 0.05, T.rotulos + 0.3) * (1 - lin(t, SEG.pao.de - 0.55, SEG.pao.de - 0.3));
  const varre = lin(t, T.rotulos, SEG.pao.de - 0.4, Easing.inOut(Easing.sin));
  const lupa2 = lin(t, SEG.amp.ate + 0.5, SEG.amp.ate + 0.85) * (1 - lin(t, SEG.verde.de - 0.5, SEG.verde.de - 0.25));
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Papel />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: "0 0", transform: worldTransform(cam) }}><Mundo t={t} /></div>
      <Lupa cx={360 + 330 * varre} cy={1010 + 30 * Math.sin(varre * Math.PI)} r={165} zoom={1.65} cam={cam} t={t} vis={lupa1} />
      <Lupa cx={540 + 18 * Math.sin(t * 1.6)} cy={900} r={232} zoom={1.2} cam={cam} t={t} vis={lupa2} />
      <Abertura />
      <Pergunta />
      <CartaoPAO /><CartaoCoelho /><CartaoTri /><CartaoAmp /><CartaoVerde />
      <NotaValidade />
      <Final />
      {legenda && <Legenda />}
      <Acabamento />
      <Sons />
    </AbsoluteFill>
  );
};
export { FPS };
