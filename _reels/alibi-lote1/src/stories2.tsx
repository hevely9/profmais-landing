import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { C, COURIER, Carimbo, Clip, ELITE, Fita, MONT, Quadro, SERIF, lin, mkCtx, useT } from "./kit";

// Stories aleatórios de clima (sem caso específico): 6 s, sem som, em loop. Zona segura y 260–1580.
export const DUR2 = 6;
const ctx = mkCtx({ caso: "", audio: "", words: [], lead: 0, fimVozRaw: DUR2, final: "alibi", cta: ["", ""], chave: /^$/, sfx: [] });
const Laco: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useT();
  return <AbsoluteFill style={{ opacity: lin(t, 0, 0.3) * (1 - lin(t, DUR2 - 0.35, DUR2 - 0.02)) }}>{children}</AbsoluteFill>;
};
const Assina: React.FC = () => <div style={{ position: "absolute", left: 0, right: 0, top: 1500, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 40, letterSpacing: "0.16em", color: "rgba(236,231,220,0.55)" }}>ÁLIBI</div>;
const Txt: React.FC<{ top: number; size?: number; children: React.ReactNode; cor?: string; font?: string; op?: number }> = ({ top, size = 64, children, cor = C.osso, font = MONT, op = 1 }) =>
  <div style={{ position: "absolute", left: 60, right: 60, top, textAlign: "center", fontFamily: font, fontWeight: 800, fontSize: size, color: cor, opacity: op, textShadow: "0 4px 30px rgba(0,0,0,0.9)", lineHeight: 1.1 }}>{children}</div>;

// 1 — fita de isolamento atravessando a cena
export const SFita: React.FC = () => (
  <Quadro ctx={ctx}><Laco>
    <Clip src="c32790" r0={0} dur={DUR2} a={0.45} />
    <Fita r={0.2} y={560} rot={-12} />
    <Fita r={0.6} y={900} rot={9} texto="NÃO ULTRAPASSE · POLÍCIA · " />
    <Fita r={1.0} y={1200} rot={-5} />
    <Assina />
  </Laco></Quadro>
);

// 2 — digital sendo analisada
const SDigitalIn: React.FC = () => {
  const { t } = useT();
  const scan = ((t * 0.55) % 1);
  const pct = Math.min(97, Math.floor(lin(t, 0.6, 3.6) * 97));
  return <Laco>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #10221A 0%, #050807 75%)" }} />
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
      <defs><clipPath id="dg"><ellipse cx="540" cy="820" rx="260" ry="340" /></clipPath></defs>
      <g clipPath="url(#dg)" fill="none" stroke="#7CF2A6" strokeWidth="7" strokeLinecap="round" opacity="0.85">
        {Array.from({ length: 16 }, (_, i) => <ellipse key={i} cx={540 + Math.sin(i) * 8} cy={860 - i * 6} rx={30 + i * 17} ry={44 + i * 22} strokeDasharray={`${120 + (i * 37) % 90} ${18 + (i * 13) % 22}`} strokeDashoffset={i * 40} />)}
      </g>
      <rect x="260" y={480 + scan * 700} width="560" height="6" fill="#7CF2A6" opacity="0.9" />
      <rect x="260" y={480 + scan * 700 - 60} width="560" height="60" fill="rgba(124,242,166,0.12)" />
    </svg>
    <Txt top={290} size={36} font={COURIER} cor="#7CF2A6">ANALISANDO DIGITAL…</Txt>
    <Txt top={1230} size={110} cor="#7CF2A6">{pct}%</Txt>
    {t > 3.7 && <Carimbo r={3.7} texto="COMPATÍVEL" y={1120} rot={-8} size={90} />}
    <Assina />
  </Laco>;
};

// 3 — quadro de evidências com linha vermelha ligando as pistas
const SQuadroIn: React.FC = () => {
  const { t } = useT();
  const pts: [number, number, string][] = [[260, 520, "?"], [800, 470, "13/03"], [300, 1080, "CARRO"], [790, 1120, "?"], [540, 800, "ÁLIBI"]];
  const ordem = [0, 4, 1, 4, 2, 4, 3];
  return <Laco>
    <AbsoluteFill style={{ background: "#3B2A1C", backgroundImage: "radial-gradient(rgba(0,0,0,0.25) 1.5px, transparent 2px), radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1.5px)", backgroundSize: "9px 9px, 13px 13px" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(0,0,0,0.75) 100%)" }} />
    {pts.map(([x, y, rot], i) => <div key={i} style={{ position: "absolute", left: x - 130, top: y - 150, width: 260, height: 300, background: i === 4 ? C.papel : "#E9E4D6", transform: `rotate(${(i % 2 ? 4 : -5)}deg)`, boxShadow: "0 18px 40px rgba(0,0,0,0.7)", padding: 16, boxSizing: "border-box" }}>
      <div style={{ height: 200, background: i === 4 ? C.lacre : "#2A2622", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONT, fontWeight: 800, fontSize: rot.length > 2 ? 52 : 110, color: C.osso }}>{rot}</div>
      <div style={{ fontFamily: ELITE, fontSize: 26, color: C.tinta, marginTop: 14, textAlign: "center" }}>{["suspeito", "data", "veículo", "testemunha", "?"][i]}</div>
    </div>)}
    <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
      {ordem.slice(0, -1).map((a, i) => {
        const b = ordem[i + 1]; const k = lin(t, 0.4 + i * 0.5, 0.9 + i * 0.5, Easing.inOut(Easing.cubic));
        const [x1, y1] = pts[a], [x2, y2] = pts[b];
        return <line key={i} x1={x1} y1={y1 - 130} x2={x1 + (x2 - x1) * k} y2={y1 - 130 + (y2 - y1) * k} stroke="#C8161F" strokeWidth="5" />;
      })}
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y - 130} r="13" fill="#E0353F" stroke="#5A0A0E" strokeWidth="3" />)}
    </svg>
    <Txt top={1340} size={76}>QUEM FOI?</Txt>
  </Laco>;
};

// 4 — câmera de segurança
const SCameraIn: React.FC = () => {
  const { t, f } = useT();
  const s = 7 + Math.floor(t);
  const glitch = (f % 47 < 3) ? (f % 2 ? 18 : -14) : 0;
  return <Laco>
    <AbsoluteFill style={{ filter: "grayscale(1) contrast(1.45) brightness(0.95)", transform: `translateX(${glitch}px)` }}><Clip src="c1919" r0={0} dur={DUR2} a={0.05} zoom={[1.1, 1.14]} /></AbsoluteFill>
    <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0 2px, transparent 2px 5px)" }} />
    <div style={{ position: "absolute", left: 60, right: 60, top: 290, display: "flex", justifyContent: "space-between", fontFamily: COURIER, fontWeight: 700, fontSize: 40, color: "#F2F2F2", textShadow: "0 0 8px #000" }}>
      <span><span style={{ color: "#E0353F", opacity: Math.floor(t * 2) % 2 ? 1 : 0.2 }}>●</span> REC</span><span>CAM 03</span>
    </div>
    <div style={{ position: "absolute", left: 60, top: 1430, fontFamily: COURIER, fontWeight: 700, fontSize: 40, color: "#F2F2F2", textShadow: "0 0 8px #000" }}>13/03 · 03:14:{String(s).padStart(2, "0")}</div>
    {[[60, 360], [960, 360], [60, 1500], [960, 1500]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x, top: y, width: 60, height: 60, borderLeft: i % 2 ? "none" : "5px solid #F2F2F2", borderRight: i % 2 ? "5px solid #F2F2F2" : "none", borderTop: i < 2 ? "5px solid #F2F2F2" : "none", borderBottom: i >= 2 ? "5px solid #F2F2F2" : "none", opacity: 0.8 }} />)}
  </Laco>;
};

// 5 — máquina de escrever
const SMaquinaIn: React.FC = () => {
  const { t } = useT();
  const frases = ["Ninguém viu nada.", "Ninguém ouviu nada.", "Mas alguém sabe."];
  const linhas = frases.map((fr, i) => fr.slice(0, Math.max(0, Math.floor((t - 0.4 - i * 1.6) * 18))));
  return <Laco>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #2A241D 0%, #0A0A0B 75%)" }} />
    <div style={{ position: "absolute", left: 110, right: 110, top: 520, height: 760, background: C.papel, transform: "rotate(-1.5deg)", boxShadow: "0 40px 90px rgba(0,0,0,0.85)", padding: "70px 60px", boxSizing: "border-box",
      backgroundImage: "repeating-linear-gradient(0deg, rgba(26,23,20,0.06) 0 1px, transparent 1px 64px)" }}>
      {linhas.map((l, i) => <div key={i} style={{ fontFamily: ELITE, fontSize: 64, color: i === 2 ? C.lacre : C.tinta, lineHeight: 1.6 }}>{l}{l.length > 0 && l.length < frases[i].length && Math.floor(t * 3) % 2 === 0 ? "▌" : ""}</div>)}
    </div>
    <Assina />
  </Laco>;
};

// 6 — sirene na noite
const SSireneIn: React.FC = () => {
  const { t } = useT();
  const fase = Math.floor(t * 4) % 2;
  return <Laco>
    <Clip src="c17376" r0={0} dur={DUR2} a={0.35} />
    <AbsoluteFill style={{ background: fase ? "radial-gradient(ellipse at 0% 50%, rgba(224,20,40,0.55), transparent 60%)" : "radial-gradient(ellipse at 100% 50%, rgba(30,80,255,0.55), transparent 60%)", mixBlendMode: "screen" }} />
    <Txt top={860} size={70} font={COURIER} cor={C.osso} op={0.95}>PLANTÃO · 03h14</Txt>
    <Assina />
  </Laco>;
};

// 7 — lupa revelando a palavra no documento
const SLupaIn: React.FC = () => {
  const { t } = useT();
  const k = lin(t, 0.3, 3.4, Easing.inOut(Easing.cubic));
  const x = 700 - 330 * k + Math.sin(t * 2.2) * 18, y = 620 + 340 * k + Math.cos(t * 1.8) * 14;
  const linhas = ["Declarou estar em casa", "das 22h até a manhã", "seguinte, sozinho.", "Nenhuma testemunha", "confirma a versão.", "O relógio dele, sim."];
  const doc = (zoom: number) => <div style={{ position: "absolute", left: 110, top: 470, width: 860, padding: "60px 56px", boxSizing: "border-box", fontFamily: ELITE, fontSize: 50, lineHeight: 1.7, color: C.tinta, transform: `scale(${zoom})`, transformOrigin: `${x - 110}px ${y - 470}px` }}>
    {linhas.map((l, i) => <div key={i} style={{ color: i === 5 ? C.lacre : C.tinta }}>{l}</div>)}
  </div>;
  return <Laco>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #2A241D 0%, #0A0A0B 75%)" }} />
    <div style={{ position: "absolute", left: 110, top: 470, width: 860, height: 720, background: C.papel, boxShadow: "0 40px 90px rgba(0,0,0,0.85)" }} />
    {doc(1)}
    <div style={{ position: "absolute", left: x - 170, top: y - 170, width: 340, height: 340, borderRadius: "50%", overflow: "hidden", border: "16px solid #2B2622", boxShadow: "0 30px 70px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,0,0,0.4)", background: C.papel }}>
      <div style={{ position: "absolute", left: -(x - 154), top: -(y - 154), width: 1080, height: 1920 }}>{doc(1.6)}</div>
    </div>
    <div style={{ position: "absolute", left: x + 110, top: y + 110, width: 50, height: 230, background: "#2B2622", borderRadius: 20, transform: "rotate(-45deg)", transformOrigin: "top" }} />
    {t > 3.6 && <Carimbo r={3.6} texto="MENTIRA" y={1340} rot={-6} size={110} />}
  </Laco>;
};

export const SDigital: React.FC = () => <Quadro ctx={ctx}><SDigitalIn /></Quadro>;
export const SQuadro: React.FC = () => <Quadro ctx={ctx}><SQuadroIn /></Quadro>;
export const SCamera: React.FC = () => <Quadro ctx={ctx}><SCameraIn /></Quadro>;
export const SMaquina: React.FC = () => <Quadro ctx={ctx}><SMaquinaIn /></Quadro>;
export const SSirene: React.FC = () => <Quadro ctx={ctx}><SSireneIn /></Quadro>;
export const SLupa: React.FC = () => <Quadro ctx={ctx}><SLupaIn /></Quadro>;