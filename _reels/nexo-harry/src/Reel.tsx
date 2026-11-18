import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BAIXO, CARIMBOS, CENA, FIM_VOZ, FPS, MARCA, SFX, T, TOTAL, TRECHOS, WORDS, o, q } from "./timeline";

// ── NEXO: azul, preto e branco; vermelho só para o "NÃO" ─────────────────
const C = { preto: "#05070F", branco: "#FFFFFF", vermelho: "#E53935", azulClaro: "#8FA2FF", papel: "#F2EBDD", tinta: "#1B1B1B" };
const TIT = "Anton", SANS = "Inter", MAO = "Caveat";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const lin = (t: number, a: number, b: number, e: (n: number) => number = Easing.bezier(0.65, 0, 0.35, 1)) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: e });
const useT = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, t: f / fps }; };
const sp = (f: number, fps: number, at: number, cfg = { damping: 12, stiffness: 180 }) => spring({ frame: f - q(at), fps, config: cfg });
const H = 960; // altura de cada metade
const SOMBRA = "0 6px 24px rgba(0,0,0,0.85)";

// ── peças ────────────────────────────────────────────────────────────────
const Janela: React.FC<{ de: number; ate: number; children: React.ReactNode }> = ({ de, ate, children }) => {
  const { t } = useT();
  if (t < de - 0.05 || t > ate + 0.05) return null;
  const soco = 1 - lin(t, de, de + 0.22, Easing.out(Easing.cubic));
  return <AbsoluteFill style={{ transform: `scale(${1 + 0.06 * soco})` }}>{children}</AbsoluteFill>;
};
const Foto: React.FC<{ src: string; de: number; ate: number; pos?: string; credito: string; zoom?: [number, number] }> = ({ src, de, ate, pos = "50% 50%", credito, zoom = [1.04, 1.16] }) => {
  const { t } = useT();
  const k = lin(t, de, ate, Easing.linear);
  return <>
    <Img src={staticFile(`img/${src}.jpg`)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${zoom[0] + (zoom[1] - zoom[0]) * k})` }} />
    <div style={{ position: "absolute", right: 18, bottom: 14, fontFamily: SANS, fontWeight: 800, fontSize: 17, color: "rgba(255,255,255,0.75)", textShadow: "0 1px 4px #000" }}>Foto: {credito}</div>
  </>;
};
const Clip: React.FC<{ src: string; de: number; from?: number }> = ({ src, de, from = 0 }) => (
  <Sequence from={q(de)} layout="none">
    <OffthreadVideo src={staticFile(`v/${src}.mp4`)} startFrom={q(from)} muted style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
  </Sequence>
);
const Escuro: React.FC<{ a?: number }> = ({ a = 0.35 }) => <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(0,0,0,${a + 0.2}) 0%, rgba(0,0,0,${a * 0.4}) 45%, rgba(0,0,0,${a + 0.25}) 100%)` }} />;
const Etiqueta: React.FC<{ at: number; x: number; y: number; cor?: string; texto: string; rot?: number; size?: number }> = ({ at, x, y, cor = C.branco, texto, rot = 0, size = 46 }) => {
  const { f, fps } = useT();
  const s = sp(f, fps, at, { damping: 11, stiffness: 220 });
  if (s <= 0.001) return null;
  const escuro = cor === C.branco;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s}) rotate(${rot}deg)`, padding: "10px 26px", borderRadius: 14,
    background: cor, color: escuro ? C.preto : C.branco, fontFamily: SANS, fontWeight: 800, fontSize: size, letterSpacing: "0.02em", whiteSpace: "nowrap", boxShadow: "0 12px 30px rgba(0,0,0,0.55)" }}>{texto}</div>;
};
const Carimbo: React.FC<{ at: number; x: number; y: number; rot: number; s?: number; texto?: string }> = ({ at, x, y, rot, s = 1, texto = "REJEITADO" }) => {
  const { t } = useT();
  if (t < at - 0.01) return null;
  const k = lin(t, at - 0.01, at + 0.09, Easing.in(Easing.cubic));
  const sc = interpolate(k, [0, 1], [2.6, 1]) * s;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${sc})`, opacity: Math.min(1, k * 1.6),
    border: `9px solid ${C.vermelho}`, borderRadius: 14, padding: "6px 22px", color: C.vermelho, fontFamily: TIT, fontSize: 92, letterSpacing: "0.04em", lineHeight: 1,
    mixBlendMode: "multiply", filter: "url(#gasto)" }}>{texto}</div>;
};
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

const TelaMarca: React.FC = () => {
  const { f, fps, t } = useT();
  if (t < MARCA - 0.3) return null;
  const fundo = lin(t, MARCA - 0.3, MARCA);
  const m = sp(f, fps, MARCA + 0.05, { damping: 13, stiffness: 140 });
  const flutua = Math.sin((t - MARCA) * 2.4) * 10;
  const sim = lin(t, MARCA + 0.45, MARCA + 1.05, Easing.out(Easing.cubic));
  const slog = sp(f, fps, MARCA + 0.8), insc = sp(f, fps, MARCA + 1.3, { damping: 11, stiffness: 200 });
  const brilho = 0.5 + 0.5 * Math.sin((t - MARCA) * 3);
  // mouse: entra pela direita, para no botão e clica
  const CLIQUE = MARCA + 2.25;
  const ida = lin(t, MARCA + 1.45, CLIQUE - 0.12, Easing.bezier(0.25, 0.8, 0.3, 1));
  const mx = interpolate(ida, [0, 1], [1150, 600]), my = interpolate(ida, [0, 1], [1750, 1420]);
  const cur = lin(t, MARCA + 1.4, MARCA + 1.6);
  const clicou = t >= CLIQUE - 0.06 && t < CLIQUE + 0.1 ? 1 : 0;
  const onda = t >= CLIQUE ? Math.min(1, (t - CLIQUE) / 0.45) : 0;
  const inscrito = t >= CLIQUE;
  const aperta = t >= CLIQUE - 0.04 && t < CLIQUE + 0.12 ? 0.93 : 1;
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
      <div style={{ position: "absolute", left: 0, right: 0, top: 1360, display: "flex", justifyContent: "center", transform: `scale(${insc * aperta})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "26px 60px", borderRadius: 999, background: inscrito ? "#272727" : "#FF0000", color: "#FFFFFF",
          fontFamily: "Roboto, " + SANS, fontWeight: 700, fontSize: 54, boxShadow: inscrito ? "0 20px 50px rgba(0,0,0,0.6)" : "0 0 50px rgba(255,0,0,0.55), 0 20px 50px rgba(0,0,0,0.6)" }}>
          {inscrito ? <>
            <svg width="50" height="50" viewBox="0 0 24 24" style={{ transform: `rotate(${Math.sin((t - CLIQUE) * 30) * 22 * Math.max(0, 1 - (t - CLIQUE) * 1.6)}deg)`, transformOrigin: "50% 10%" }}>
              <path d="M12 22a2.5 2.5 0 0 0 2.4-2h-4.8A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5.5-6.8V3.5a1.5 1.5 0 0 0-3 0v.7A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2Z" fill="#fff" /></svg>
            INSCRITO</> : "INSCREVA-SE"}
        </div>
      </div>
      {/* mouse que entra e clica no botão */}
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${mx}px, ${my}px) scale(${1 - 0.18 * clicou})`, opacity: cur, transformOrigin: "8px 6px" }}>
        <div style={{ position: "absolute", left: -46, top: -46, width: 100, height: 100, borderRadius: "50%", border: "6px solid rgba(255,255,255,0.9)",
          transform: `scale(${0.3 + onda * 1.4})`, opacity: onda > 0 ? 1 - onda : 0 }} />
        <svg width="96" height="120" viewBox="0 0 24 30" style={{ filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.7))" }}>
          <path d="M2 1 L2 23 L7.5 17.8 L11.3 27 L15 25.4 L11.2 16.5 L19 16.5 Z" fill="#fff" stroke="#000" strokeWidth="1.4" strokeLinejoin="round" /></svg>
      </div>
    </AbsoluteFill>
  );
};

// ── cenas de cima ────────────────────────────────────────────────────────
const Gancho: React.FC = () => {
  const { f, fps, t } = useT();
  const [de, ate] = CENA.gancho;
  const a = sp(f, fps, 0.05, { damping: 10, stiffness: 200 }), b = sp(f, fps, T.nao0 - 0.25, { damping: 10, stiffness: 200 });
  return <Janela de={de} ate={ate}>
    <Foto src="livros" de={de} ate={ate} pos="50% 40%" credito="BrokenSphere · CC BY-SA 3.0" zoom={[1.1, 1.25]} />
    <Escuro a={0.5} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: TIT, color: C.branco, textShadow: SOMBRA }}>
      <div style={{ fontSize: 210, lineHeight: 0.9, transform: `scale(${2 - a})`, opacity: Math.min(1, a * 2) }}>12</div>
      <div style={{ fontSize: 96, lineHeight: 1, transform: `scale(${2 - a})`, opacity: Math.min(1, a * 2) }}>EDITORAS</div>
      <div style={{ fontSize: 70, lineHeight: 1.2, marginTop: 10, opacity: b, transform: `translateY(${(1 - b) * 30}px)` }}>DISSERAM</div>
    </div>
    <Carimbo at={T.nao0} x={540} y={720} rot={-8} s={1.5} texto="NÃO" />
  </Janela>;
};
const Mae: React.FC = () => {
  const [de, ate] = CENA.mae;
  return <Janela de={de} ate={ate}>
    <Foto src="rowling1999" de={de} ate={ate} pos="50% 12%" credito="Kingkongphoto · CC BY-SA 2.0" zoom={[1.0, 1.1]} />
    <Escuro a={0.2} />
    <Etiqueta at={T.escocia} x={850} y={110} texto="📍 ESCÓCIA" size={40} />
    <Etiqueta at={T.mae} x={300} y={560} texto="MÃE SOLTEIRA" rot={-3} />
    <Etiqueta at={T.desempregada} x={700} y={660} texto="DESEMPREGADA" cor={C.vermelho} rot={2} />
    <Etiqueta at={T.ajuda} x={540} y={770} texto="VIVENDO DE AJUDA DO GOVERNO" size={38} rot={-1} />
  </Janela>;
};
const Cafe: React.FC = () => {
  const [de, ate] = CENA.cafe;
  return <Janela de={de} ate={ate}>
    <Foto src="cafe" de={de} ate={ate} pos="40% 50%" credito="1march1hare · CC BY-SA 4.0" zoom={[1.15, 1.3]} />
    <Escuro a={0.25} />
    <Etiqueta at={de + 0.2} x={540} y={150} texto="☕ O CAFÉ ONDE ELA ESCREVIA" size={40} />
    <Etiqueta at={de + 0.5} x={540} y={225} texto="Edimburgo, Escócia" size={30} cor={C.azulClaro} />
  </Janela>;
};
const Placa: React.FC = () => {
  const [de, ate] = CENA.placa;
  return <Janela de={de} ate={ate}>
    <Foto src="placa" de={de} ate={ate} pos="50% 45%" credito="SylviaStanley · CC BY-SA 3.0" zoom={[1.0, 1.12]} />
    <Escuro a={0.15} />
    <Etiqueta at={T.filha + 0.1} x={540} y={760} texto="👶 COM A FILHA DORMINDO AO LADO" size={38} />
  </Janela>;
};
const Envio: React.FC = () => {
  const [de, ate] = CENA.envio;
  return <Janela de={de} ate={ate}>
    <Clip src="c21333" de={de} from={1} />
    <Escuro a={0.3} />
    <Etiqueta at={T.editoras2} x={540} y={170} texto="✉️  MANUSCRITO → EDITORAS" size={44} />
  </Janela>;
};
const Carimbos: React.FC = () => {
  const { t } = useT();
  const [de, ate] = CENA.carimbos;
  const n = CARIMBOS.filter((c) => t >= c).length;
  const ult = Math.max(...CARIMBOS.filter((c) => t >= c), -9);
  const treme = t - ult < 0.12 ? Math.sin(t * 160) * (n > 3 ? 7 : 12) : 0;
  const pos: [number, number, number][] = [[540, 300, -8], [520, 500, 6], [560, 700, -12], [190, 170, 14], [880, 200, -10], [170, 420, -6], [900, 450, 12], [190, 680, 9], [890, 700, -14], [330, 860, -4], [750, 860, 7], [540, 140, -3]];
  return <Janela de={de} ate={ate}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #3A2A1C 0%, #120C08 75%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, transform: `translate(${treme}px, ${treme * 0.6}px)` }}>
      <div style={{ position: "absolute", left: 250, top: 95, width: 580, height: 770, background: C.papel, transform: "rotate(-2.5deg)", boxShadow: "0 30px 60px rgba(0,0,0,0.7)",
        padding: "60px 50px", boxSizing: "border-box", fontFamily: "'Courier New', monospace", color: C.tinta }}>
        <div style={{ fontSize: 34, fontWeight: 700, textAlign: "center" }}>HARRY POTTER</div>
        <div style={{ fontSize: 24, textAlign: "center", marginTop: 6 }}>e a Pedra Filosofal</div>
        <div style={{ fontSize: 20, textAlign: "center", marginTop: 14, opacity: 0.7 }}>manuscrito — J. K. Rowling</div>
        {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ height: 9, background: "rgba(0,0,0,0.13)", marginTop: i === 0 ? 50 : 24, width: `${70 + ((i * 37) % 30)}%` }} />)}
      </div>
      {CARIMBOS.map((c, i) => <Carimbo key={i} at={c} x={pos[i][0]} y={pos[i][1]} rot={pos[i][2]} s={i < 3 ? 1 : 0.62} />)}
    </div>
    <div style={{ position: "absolute", right: 40, top: 40, fontFamily: TIT, fontSize: 84, color: C.vermelho, textShadow: "0 4px 18px rgba(0,0,0,0.9)", opacity: n > 0 ? 1 : 0 }}>{n}× NÃO</div>
  </Janela>;
};
const Treze: React.FC = () => {
  const { f, fps, t } = useT();
  const [de, ate] = CENA.treze;
  const ent = sp(f, fps, de + 0.05, { damping: 13, stiffness: 150 });
  const abre = lin(t, T.aceitou - 0.1, T.aceitou + 0.45, Easing.out(Easing.cubic));
  const sobe = lin(t, T.aceitou + 0.2, T.aceitou + 0.9, Easing.out(Easing.cubic));
  return <Janela de={de} ate={ate}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 55%, rgba(79,111,255,${0.25 + 0.45 * abre}) 0%, #050816 65%)` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: TIT, fontSize: 120, color: C.branco, textShadow: SOMBRA, transform: `scale(${ent})` }}>A 13ª EDITORA</div>
    <div style={{ position: "absolute", left: 290, top: 400, width: 500, height: 330, transform: `scale(${0.6 + 0.4 * ent}) translateY(${(1 - ent) * 200}px)` }}>
      {/* carta que sobe */}
      <div style={{ position: "absolute", left: 40, right: 40, top: 20 - 230 * sobe, height: 300, background: C.papel, borderRadius: 6, boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center", fontFamily: TIT, fontSize: 96, color: "#2A3FD6" }}>SIM ✓</div>
      <div style={{ position: "absolute", inset: 0, background: "#E9DFC9", borderRadius: 10, boxShadow: `0 0 ${80 * abre}px rgba(143,162,255,0.9), 0 25px 50px rgba(0,0,0,0.6)` }} />
      <svg viewBox="0 0 500 330" style={{ position: "absolute", inset: 0 }}>
        <path d="M0 330 L250 150 L500 330" fill="#DDD1B6" />
        <path d="M0 0 L250 190 L500 0 Z" fill="#D2C4A4" style={{ transformOrigin: "250px 0px", transform: `scaleY(${1 - 2 * abre})` }} />
      </svg>
    </div>
  </Janela>;
};
const Leitura: React.FC = () => {
  const { f, fps } = useT();
  const [de, ate] = CENA.leitura;
  const qq = sp(f, fps, T.pediu, { damping: 9, stiffness: 200 });
  return <Janela de={de} ate={ate}>
    <Clip src="c1724" de={de} from={0.5} />
    <Escuro a={0.25} />
    <Etiqueta at={T.oito} x={540} y={160} texto="👧 A FILHA DE 8 ANOS DO DONO" size={40} />
    <Etiqueta at={T.leu} x={540} y={240} texto="leu o 1º capítulo…" size={34} cor={C.azulClaro} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: MAO, fontSize: 120, color: C.branco, textShadow: SOMBRA,
      transform: `scale(${qq}) rotate(-4deg)`, opacity: Math.min(1, qq * 2) }}>"quero o resto!"</div>
  </Janela>;
};
const Hogwarts: React.FC = () => {
  const [de, ate] = CENA.hogwarts;
  return <Janela de={de} ate={ate}>
    <Foto src="hogwarts" de={de} ate={ate} pos="50% 50%" credito="CapStudio (Clementp.fr) · CC BY-SA 4.0" zoom={[1.05, 1.22]} />
    <Escuro a={0.25} />
    <Etiqueta at={T.vendida - 0.1} x={540} y={760} texto="A SÉRIE MAIS VENDIDA DA HISTÓRIA" size={40} />
  </Janela>;
};
const Vendas: React.FC = () => {
  const { t } = useT();
  const [de, ate] = CENA.vendas;
  const k = lin(t, T.q500 - 0.5, T.copias + 0.3, Easing.out(Easing.cubic));
  const n = Math.round(500_000_000 * k).toLocaleString("pt-BR");
  return <Janela de={de} ate={ate}>
    <Foto src="trio" de={de} ate={ate} pos="50% 30%" credito="Ilona Higgins · CC BY-SA 2.0" zoom={[1.05, 1.15]} />
    <Escuro a={0.55} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: TIT, color: C.branco, textShadow: SOMBRA }}>
      <div style={{ fontSize: 46, fontFamily: SANS, fontWeight: 800, color: C.azulClaro, letterSpacing: "0.1em" }}>MAIS DE</div>
      <div style={{ fontSize: 150, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{n}</div>
      <div style={{ fontSize: 70, marginTop: 6 }}>DE CÓPIAS</div>
    </div>
  </Janela>;
};
const Final: React.FC = () => {
  const { f, fps, t } = useT();
  const [de, ate] = CENA.final;
  const a = sp(f, fps, T.doze3, { damping: 11, stiffness: 200 }), risco = lin(t, T.naoF + 0.1, T.naoF + 0.45);
  const b = sp(f, fps, T.sim - 0.05, { damping: 8, stiffness: 160 });
  const batidas = [0, 0.34, 0.68].map((d) => T.batendo - 0.05 + d);
  const treme = batidas.some((x) => t >= x && t < x + 0.1) ? Math.sin(t * 150) * 10 : 0;
  const brilho = 0.6 + 0.4 * Math.sin(t * 5);
  return <Janela de={de} ate={ate}>
    <AbsoluteFill style={{ background: "#03050C" }} />
    <AbsoluteFill style={{ opacity: 0.28 }}><Foto src="plataforma" de={de} ate={ate} pos="50% 40%" credito="Nelo Hotsuma · CC BY 2.0" zoom={[1.05, 1.12]} /></AbsoluteFill>
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${treme}px)` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: TIT, fontSize: 130, color: C.vermelho, opacity: a * (1 - 0.55 * b), transform: `scale(${a})`, textShadow: SOMBRA }}>
        <span style={{ position: "relative" }}>12 × NÃO
          <span style={{ position: "absolute", left: -10, top: "52%", height: 12, width: `${risco * 106}%`, background: C.branco, transform: "rotate(-4deg)" }} /></span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: TIT, fontSize: 260, lineHeight: 1, color: C.branco,
        transform: `scale(${b})`, opacity: Math.min(1, b * 2), textShadow: `0 0 ${60 * brilho}px #4F6FFF, 0 0 ${120 * brilho}px #4F6FFF` }}>1 SIM</div>
    </div>
  </Janela>;
};

// ── parte de baixo: satisfatório ─────────────────────────────────────────
const Baixo: React.FC = () => {
  const { t } = useT();
  if (t > MARCA + 0.1) return null;
  return <div style={{ position: "absolute", left: 0, top: H, width: 1080, height: H, overflow: "hidden" }}>
    {BAIXO.map((b, i) => (t >= b.de - 0.05 && t <= b.ate + 0.05) ? <AbsoluteFill key={i}><Clip src={b.src} de={b.de} /></AbsoluteFill> : null)}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 18%)" }} />
  </div>;
};

// ── legenda na divisa ────────────────────────────────────────────────────
const PAGES = (() => {
  const pages: { de: number; ate: number; ws: typeof WORDS }[] = [];
  let cur: typeof WORDS = [];
  WORDS.forEach((w, i) => {
    cur.push(w);
    const fim = /[.,?!]$/.test(w.text) || cur.length >= 3 || i === WORDS.length - 1;
    if (fim) { pages.push({ de: cur[0].start, ate: 0, ws: cur }); cur = []; }
  });
  pages.forEach((p, i) => { p.ate = i < pages.length - 1 ? pages[i + 1].de : FIM_VOZ + 0.3; });
  return pages;
})();
const Legenda: React.FC = () => {
  const { f, fps, t } = useT();
  const pg = PAGES.find((p) => t >= p.de - 0.05 && t < p.ate - 0.05);
  if (!pg || t > FIM_VOZ + 0.3) return null;
  const pin = spring({ frame: f - q(pg.de - 0.05), fps, config: { damping: 14, stiffness: 260 } });
  return <div style={{ position: "absolute", left: 40, right: 40, top: H - 62, display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: 30, transform: `scale(${0.85 + 0.15 * pin})` }}>
    {pg.ws.map((w, i) => {
      const ativo = t >= w.start - 0.03 && t < w.end + 0.1;
      return <span key={i} style={{ fontFamily: SANS, fontWeight: 800, fontSize: 74, lineHeight: 1.05, textTransform: "uppercase",
        color: ativo ? C.azulClaro : C.branco, WebkitTextStroke: "12px #000", paintOrder: "stroke fill", transform: `scale(${ativo ? 1.08 : 1})`, display: "inline-block" }}>{w.text.replace(/[,;:]$/, "")}</span>;
    })}
  </div>;
};

const MarcaDagua: React.FC = () => {
  const { t } = useT();
  if (t > MARCA) return null;
  return <div style={{ position: "absolute", left: 30, top: 30, opacity: 0.9 * lin(t, 0.3, 0.8) * (1 - lin(t, MARCA - 0.3, MARCA)), filter: "drop-shadow(0 0 12px #4F6FFFAA)" }}><SimboloNexo s={74} /></div>;
};

const Sons: React.FC = () => (
  <>
    {TRECHOS.map(([a, b], i) => <Sequence key={"v" + i} from={q(o(a))} durationInFrames={q(b - a) + 1}><Audio src={staticFile("audio/voz.mp3")} startFrom={q(a)} endAt={q(b)} /></Sequence>)}
    <Audio src={staticFile("audio/trilha-el.mp3")} volume={(fr) => interpolate(fr, [0, 20, q(FIM_VOZ - 0.3), q(FIM_VOZ + 0.6)], [0, 0.2, 0.2, 0.42], clamp) * interpolate(fr, [TOTAL - q(1.3), TOTAL - 2], [1, 0], clamp)} />
    {SFX.map((s, i) => <Sequence key={i} from={Math.max(0, q(s.at))} durationInFrames={q(2.5)}><Audio src={staticFile(`audio/${s.src}.mp3`)} volume={s.vol ?? 0.4} /></Sequence>)}
  </>
);

export const Reel: React.FC = () => (
  <AbsoluteFill style={{ background: C.preto, overflow: "hidden" }}>
    <svg width="0" height="0" style={{ position: "absolute" }}><filter id="gasto"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" /><feDisplacementMap in="SourceGraphic" scale="6" /></filter></svg>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: H, overflow: "hidden" }}>
      <Gancho /><Mae /><Cafe /><Placa /><Envio /><Carimbos /><Treze /><Leitura /><Hogwarts /><Vendas /><Final />
    </div>
    <Baixo />
    <Legenda />
    <MarcaDagua />
    <TelaMarca />
    <Sons />
  </AbsoluteFill>
);
export { FPS };
