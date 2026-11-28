import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile } from "remotion";
import palavras from "../../public/palavras-antuerpia.json";
import { C, COURIER, Carimbo, Cheia, Clip, ELITE, Faixa, Foto, MONT, Plano, Reel, Rotulo, SANS, SOMBRA, Titulo, TituloVivo, clamp, lin, mkCtx, useT } from "../kit";
import { Fechamento, Hora, Mural } from "../dossie";

// ÁLIBI · CASO Nº 028 — O roubo de diamantes de Antuérpia (2003). Pedido nos comentários do carrossel ("LIXO").
// v2 (pedido do usuário: "o visual também tem que prender"): história completa (~3 min), gancho com 5 cortes + flash + tremor,
// e animações que contam a história: mural da quadrilha, laser varrendo os sensores, grade das 160 caixas, rota do lixo, círculo no saco.
// Imagens: trailer oficial da Netflix "Stolen: Heist of the Century" (2025) — fotos de polícia, jornal, ficha policial (Finotto), entrevistas.
// Fatos: Wikipedia (Antwerp diamond heist), casepin.org, Vlaanderen Vroeger, Antwerpist, Executive Digest, Wired (2009, versão de Notarbartolo).
type Ws = { words: { text: string; start: number; end: number }[] };
// narração original + 3 trechos inseridos: tempos antigos → novos
const T = (r: number) => (r < 65.15 ? r : r < 75.36 ? r + 13.2 : r < 107.4 ? r + 17.35 : r + 25.86);

export const ctxAn = mkCtx({
  caso: "Nº 028", audio: "antuerpia", words: (palavras as Ws).words, lead: 0.15, fimVozRaw: 180.0, final: "alibi", proximo: "NO PERFIL", cta: ["", ""],
  chave: /^(diamante|cofre|sanduíche|lixo|notarbartolo|impossível|ladrão|turim|polícia|preso|nunca|100|speedy|chave)/i,
  semLegenda: [[T(151.45), 400]],
  sfx: [
    { src: "impacto", r: 0.0, vol: 0.55 }, { src: "whoosh", r: 1.35, vol: 0.3 }, { src: "whoosh", r: 2.45, vol: 0.3 }, { src: "whoosh", r: 3.65, vol: 0.3 },
    { src: "impacto", r: 4.85, vol: 0.4 }, { src: "carimbo", r: 7.1, vol: 0.45 }, { src: "whoosh", r: 9.0, vol: 0.25 },
    { src: "tique", r: 28.3, vol: 0.3 }, { src: "tique", r: 29.6, vol: 0.3 }, { src: "tique", r: 30.3, vol: 0.3 }, { src: "tique", r: 31.6, vol: 0.3 }, { src: "tique", r: 33.0, vol: 0.3 },
    { src: "impacto", r: 36.6, vol: 0.5 }, { src: "carimbo", r: 55.5, vol: 0.45 },
    { src: "tique", r: 67.0, vol: 0.35 }, { src: "tique", r: 69.4, vol: 0.35 }, { src: "tique", r: 72.5, vol: 0.35 }, { src: "carimbo", r: 76.6, vol: 0.45 },
    { src: "subida", r: T(70.4), vol: 0.3 }, { src: "impacto", r: 91.2, vol: 0.4 }, { src: "impacto", r: T(82.6), vol: 0.5 }, { src: "whoosh", r: T(99.0), vol: 0.3 },
    { src: "subida", r: 120.3, vol: 0.25 }, { src: "impacto", r: 128.5, vol: 0.4 }, { src: "carimbo", r: T(115.8), vol: 0.5 },
    { src: "impacto", r: T(125.2), vol: 0.45 }, { src: "carimbo", r: T(143.8), vol: 0.45 },
  ],
});

const CR = "Reprodução · Netflix, “Stolen: Heist of the Century” (2025)";
const Cred: React.FC = () => <div style={{ position: "absolute", right: 34, top: 1262, fontFamily: SANS, fontWeight: 600, fontSize: 17, color: "rgba(236,231,220,0.6)", textShadow: "0 1px 4px #000" }}>{CR}</div>;
const Cena: React.FC<{ r: [number, number]; from: number; a?: number; zoom?: [number, number] }> = ({ r, from, a = 0.38, zoom }) =>
  <><Clip src="an-trailer" r0={r[0]} from={from} dur={r[1] - r[0]} a={a} zoom={zoom} /><Cred /></>;

// ── recursos visuais (movimento além da foto) ──
const Flash: React.FC<{ r: number }> = ({ r }) => {
  const { t, o } = useT();
  const k = 1 - lin(t, o(r), o(r) + 0.18, Easing.out(Easing.quad));
  if (t < o(r) || k <= 0) return null;
  return <AbsoluteFill style={{ background: "#fff", opacity: 0.75 * k }} />;
};
const Tremor: React.FC<{ r: number; children: React.ReactNode; forca?: number }> = ({ r, children, forca = 14 }) => {
  const { t, o } = useT();
  const k = t < o(r) ? 0 : 1 - lin(t, o(r), o(r) + 0.5);
  return <AbsoluteFill style={{ transform: `translate(${Math.sin(t * 70) * forca * k}px, ${Math.cos(t * 55) * forca * k}px)` }}>{children}</AbsoluteFill>;
};
const Laser: React.FC<{ r: number }> = ({ r }) => {
  const { t, o } = useT();
  if (t < o(r)) return null;
  const y = 300 + (((t - o(r)) * 520) % 1000);
  return <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: y, height: 4, background: "#FF2A2A", boxShadow: "0 0 24px 8px rgba(255,40,40,0.55)" }} />
    <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(255,0,0,0.05) 0 2px, transparent 2px 6px)" }} />
  </AbsoluteFill>;
};
const Grade: React.FC<{ r: number; dur: number }> = ({ r, dur }) => {
  const { t, o } = useT();
  const n = Math.floor(interpolate(t, [o(r), o(r) + dur], [0, 123], clamp));
  const ordem = React.useMemo(() => { const a = Array.from({ length: 160 }, (_, i) => i); let s = 7; for (let i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor((s / 233280) * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }, []);
  const abertas = new Set(ordem.slice(0, n));
  return <div style={{ position: "absolute", left: 110, top: 440, width: 860, display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: 8 }}>
    {Array.from({ length: 160 }, (_, i) => <div key={i} style={{ height: 44, borderRadius: 4, border: "2px solid rgba(236,231,220,0.55)", background: abertas.has(i) ? C.verm : "rgba(20,20,22,0.75)", boxShadow: abertas.has(i) ? "0 0 12px rgba(224,53,63,0.7)" : "none" }} />)}
    <div style={{ gridColumn: "1 / -1", marginTop: 22, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 150, lineHeight: 1, color: C.osso, textShadow: SOMBRA }}>{n}<span style={{ fontSize: 60, color: C.ossoE }}> / 160</span></div>
  </div>;
};
const Rota: React.FC<{ r: number; pin: number }> = ({ r, pin }) => {
  const { t, o } = useT();
  const k = lin(t, o(r), o(r) + 2.0, Easing.inOut(Easing.cubic));
  const kp = lin(t, o(pin), o(pin) + 0.4, Easing.out(Easing.back(2)));
  const pulso = 1 + 0.12 * Math.sin((t - o(pin)) * 8);
  const y0 = 520, y1 = 1150, x = 540, yp = 880;
  return <AbsoluteFill>
    <svg width="1080" height="1920" style={{ position: "absolute" }}>
      <line x1={x} y1={y0} x2={x} y2={y0 + (y1 - y0) * k} stroke="#F1E7C9" strokeWidth="10" strokeDasharray="30 18" strokeLinecap="round" />
      <circle cx={x} cy={y0} r="22" fill={C.osso} /><circle cx={x} cy={y1} r={22 * Math.min(1, k * 1.2)} fill={C.osso} />
      {kp > 0 && <g transform={`translate(${x} ${yp}) scale(${kp * pulso})`}><circle r="44" fill="rgba(224,53,63,0.35)" /><circle r="22" fill={C.verm} stroke="#fff" strokeWidth="5" /></g>}
    </svg>
    <div style={{ position: "absolute", left: x + 44, top: y0 - 28, fontFamily: MONT, fontWeight: 800, fontSize: 46, color: C.osso, textShadow: SOMBRA, opacity: Math.min(1, k * 4) }}>ANTUÉRPIA</div>
    <div style={{ position: "absolute", left: x + 44, top: y1 - 28, fontFamily: MONT, fontWeight: 800, fontSize: 46, color: C.osso, textShadow: SOMBRA, opacity: k }}>BRUXELAS</div>
    {kp > 0 && <div style={{ position: "absolute", right: 1080 - x + 60, top: yp - 34, padding: "6px 16px", background: C.lacre, fontFamily: MONT, fontWeight: 800, fontSize: 40, color: C.osso, opacity: Math.min(1, kp * 1.5) }}>SACOS DE LIXO</div>}
  </AbsoluteFill>;
};
const Circulo: React.FC<{ r: number; x: number; y: number; rx: number; ry: number }> = ({ r, x, y, rx, ry }) => {
  const { t, o } = useT();
  const k = lin(t, o(r), o(r) + 0.6, Easing.inOut(Easing.cubic));
  if (k <= 0) return null;
  const L = 2 * Math.PI * Math.max(rx, ry) * 1.1;
  return <svg width="1080" height="1920" style={{ position: "absolute", left: 0, top: 0 }}>
    <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" stroke={C.verm} strokeWidth="10" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - k)} transform={`rotate(-8 ${x} ${y})`} style={{ filter: "drop-shadow(0 0 8px rgba(0,0,0,0.8))" }} />
  </svg>;
};
const Fonte: React.FC<{ r: number; texto: string }> = ({ r, texto }) => {
  const { t, o } = useT();
  if (t < o(r)) return null;
  return <div style={{ position: "absolute", left: 90, top: 250, padding: "6px 14px", border: `2px solid ${C.osso}`, fontFamily: COURIER, fontWeight: 700, fontSize: 30, color: C.osso, background: "rgba(10,10,11,0.6)" }}>{texto}</div>;
};

export const Antuerpia: React.FC = () => (
  <Reel ctx={ctxAn}>
    {/* ═══ GANCHO (0–9 s): 5 cortes de imagem real, flash + tremor, texto junto com a voz ═══ */}
    <Plano r={[-0.2, 1.35]} forte><Cheia src="an2-cofre-cor" r={[-0.2, 1.35]} credito={CR} cinza={false} pos="50% 55%" zoom={[1.22, 1.08]} a={0.3} /></Plano>
    <Plano r={[1.35, 2.45]}><Tremor r={1.35}><Cheia src="an2-caixas" r={[1.35, 2.45]} credito={CR} cinza={false} pos="45% 50%" zoom={[1.25, 1.1]} a={0.3} /></Tremor></Plano>
    <Plano r={[-0.2, 2.45]} soco={false}><TituloVivo top={330} size={110} destaque="MILHÕES" linhas={[[["US$", 0.12], ["100", 0.5]], [["MILHÕES", 0.8]]]} /></Plano>
    <Plano r={[2.45, 3.65]}><Tremor r={2.45}><Cheia src="an2-cofre-pb" r={[2.45, 3.65]} credito={CR} cinza={false} pos="50% 50%" zoom={[1.2, 1.05]} a={0.3} /></Tremor></Plano>
    <Plano r={[3.65, 4.85]}><Cena r={[3.65, 4.85]} from={5.0} a={0.25} zoom={[1.15, 1.05]} /></Plano>
    <Plano r={[2.45, 4.85]} soco={false}>
      <Titulo r={2.5} top={330} size={96}>SUMIRAM</Titulo>
      <Rotulo r={3.0} texto="do cofre mais seguro do mundo" top={455} size={46} />
    </Plano>
    <Plano r={[4.85, 9.0]}>
      <Tremor r={4.85} forca={18}><Cheia src="an2-fichas" r={[4.85, 9.0]} credito={CR} cinza={false} pos="50% 40%" zoom={[1.15, 1.02]} a={0.3} /></Tremor>
      <TituloVivo top={300} size={92} destaque="SANDUÍCHE" linhas={[[["PEGOS", 5.9], ["POR", 6.4], ["UM", 6.9]], [["SANDUÍCHE", 7.1]]]} />
    </Plano>
    <Flash r={1.35} /><Flash r={2.45} /><Flash r={3.65} /><Flash r={4.85} />

    {/* ═══ CONTEXTO ═══ */}
    <Plano r={[9.0, 13.7]}>
      <Cena r={[9.0, 13.7]} from={3.0} />
      <Rotulo r={9.0} texto="ISSO ACONTECEU DE VERDADE" top={300} size={42} cor={C.fita} />
      <Titulo r={10.2} top={370} size={70}>ANTUÉRPIA · BÉLGICA</Titulo>
      <Rotulo r={11.7} texto="FEVEREIRO DE 2003" top={470} size={48} />
    </Plano>
    <Plano r={[13.7, 20.1]}>
      <Cheia src="an2-diamante" r={[13.7, 20.1]} credito={CR} cinza={false} pos="36% 50%" zoom={[1.2, 1.4]} a={0.3} />
      <Rotulo r={13.8} texto="A CAPITAL MUNDIAL" top={320} size={46} cor={C.fita} />
      <Titulo r={14.7} top={390} size={92}>DOS DIAMANTES</Titulo>
      <Rotulo r={17.3} texto="a maior parte dos diamantes brutos do planeta passa por lá" top={1150} size={34} />
    </Plano>
    <Plano r={[20.1, 25.3]}>
      <Cheia src="an2-caixas" r={[20.1, 25.3]} credito={CR} cinza={false} pos="55% 50%" zoom={[1.0, 1.15]} />
      <Rotulo r={20.2} texto="O COFRE DO" top={320} size={44} cor={C.fita} />
      <Titulo r={22.3} top={385} size={92}>DIAMOND CENTRE</Titulo>
      <Rotulo r={23.4} texto="2 andares abaixo do chão · 160 caixas" top={1150} size={40} />
    </Plano>
    <Plano r={[25.3, 35.8]}>
      <Cheia src="an-entrada" r={[25.3, 35.8]} credito={CR} cinza={false} pos="50% 50%" zoom={[1.0, 1.12]} a={0.55} />
      <Laser r={25.3} />
      <Rotulo r={25.4} texto="PROTEGIDO POR:" top={330} size={46} cor={C.fita} />
      <Rotulo r={28.3} texto="✓ detector de calor" top={420} size={50} />
      <Rotulo r={29.6} texto="✓ radar" top={500} size={50} />
      <Rotulo r={30.3} texto="✓ sensor de vibração" top={580} size={50} />
      <Rotulo r={31.6} texto="✓ campo magnético" top={660} size={50} />
      <Rotulo r={33.0} texto="✓ fechadura com milhões de combinações" top={740} size={44} />
    </Plano>
    <Plano r={[35.8, 38.4]}>
      <Tremor r={36.6} forca={20}><Cheia src="an2-caixas" r={[35.8, 38.4]} credito={CR} cinza={false} pos="80% 50%" zoom={[1.3, 1.15]} a={0.3} /></Tremor>
      <Carimbo r={36.6} texto="IMPOSSÍVEL" y={760} rot={-8} size={110} />
    </Plano>
    <Flash r={36.6} />
    <Plano r={[38.4, 42.7]}>
      <Cheia src="an2-rua" r={[38.4, 42.7]} credito={CR} cinza={false} pos="55% 50%" zoom={[1.55, 1.7]} />
      <Rotulo r={38.4} texto="MAS UM HOMEM JÁ ESTAVA LÁ DENTRO" top={330} size={44} cor={C.fita} />
      <Faixa r={40.6} texto="HÁ MAIS DE 2 ANOS" top={420} size={64} />
    </Plano>

    {/* ═══ O INFILTRADO ═══ */}
    <Plano r={[42.7, 49.9]}>
      <Foto src="an2-jornal" r={[42.7, 49.9]} credito={CR} top={420} w={900} h={760} pos="35% 30%" zoom={[1.0, 1.12]} />
      <Titulo r={42.7} top={230} size={66}>LEONARDO NOTARBARTOLO</Titulo>
      <Rotulo r={45.3} texto="italiano · alugou uma sala no próprio prédio" top={1200} size={36} />
    </Plano>
    <Plano r={[49.9, 58.4]}>
      <Cheia src="an2-notar" r={[49.9, 58.4]} credito={CR} cinza={false} pos="50% 30%" zoom={[1.0, 1.12]} />
      <Rotulo r={49.9} texto="DIZIA SER COMERCIANTE" top={330} size={44} cor={C.fita} />
      <Rotulo r={51.0} texto="entrava e saía todo dia, sem suspeita" top={410} size={40} />
      <Carimbo r={55.5} texto="LADRÃO" y={1150} rot={-6} size={110} />
    </Plano>
    <Plano r={[58.4, 65.5]}>
      <Cheia src="an2-fichas" r={[58.4, 65.5]} credito={CR} cinza={false} pos="50% 40%" zoom={[1.1, 1.0]} />
      <Rotulo r={58.4} texto="A QUADRILHA FICOU CONHECIDA COMO" top={320} size={40} cor={C.fita} />
      <Faixa r={59.6} texto="A ESCOLA DE TURIM" top={400} size={70} />
      <Rotulo r={62.7} texto="estudaram cada detalhe do cofre" top={1170} size={42} />
    </Plano>
    {/* NOVO: mural da quadrilha (Finotto = foto real da ficha policial; os outros sem foto pública → silhueta) */}
    <Plano r={[65.5, 78.35]} soco={false}>
      <Mural
        itens={[
          { id: "chefe", r: 65.6, x: 370, y: 330, w: 340, h: 250, img: "an2-jornal", pos: "30% 35%", titulo: "NOTARBARTOLO", sub: "o infiltrado", rot: -2 },
          { id: "genio", r: 67.0, x: 100, y: 620, w: 280, h: 220, img: "an2-silhueta", titulo: "O GÊNIO", sub: "alarmes", rot: -4 },
          { id: "monstro", r: 69.4, x: 700, y: 600, w: 280, h: 260, img: "an2-finotto", pos: "50% 35%", titulo: "O MONSTRO", sub: "fechaduras", rot: 3 },
          { id: "speedy", r: 72.5, x: 140, y: 1010, w: 280, h: 180, img: "an2-silhueta", titulo: "SPEEDY", sub: "velho amigo", rot: 3 },
          { id: "rei", r: 75.1, x: 680, y: 1010, w: 300, h: 180, img: "an2-silhueta", titulo: "REI DAS CHAVES", sub: "nunca foi pego", rot: -3 },
        ]}
        fios={[{ a: "chefe", b: "genio", r: 67.2 }, { a: "chefe", b: "monstro", r: 69.6 }, { a: "chefe", b: "speedy", r: 72.7 }, { a: "chefe", b: "rei", r: 75.3 }]}
        camera={[[65.5, 1.0, 0, 20], [67.0, 1.04, 30, 0], [69.4, 1.04, -30, 0], [72.5, 1.04, 30, -40], [75.1, 1.04, -30, -40], [77.2, 1.0, 0, 20]]}
      />
      <Rotulo r={65.5} texto="CADA UM TINHA UM APELIDO" top={190} size={40} cor={C.fita} />
    </Plano>

    {/* ═══ O ROUBO ═══ */}
    <Plano r={[78.35, T(70.4)]}>
      <Cheia src="an2-aereo" r={[78.35, T(70.4)]} credito={CR} cinza={false} pos="55% 50%" zoom={[1.0, 1.12]} a={0.45} />
      <Hora r={78.6} hora="15–16 FEV" top={420} sub="2003 · fim de semana" />
      <Rotulo r={81.4} texto="o bairro dos diamantes está vazio" top={1150} size={42} />
    </Plano>
    <Plano r={[T(70.4), 88.86]}>
      <Cheia src="an-cofre" r={[T(70.4), 88.86]} credito={CR} cinza={false} pos="40% 50%" zoom={[1.0, 1.12]} a={0.3} />
      <Laser r={T(70.4)} />
      <Rotulo r={T(70.5)} texto="UM SENSOR DE CADA VEZ" top={330} size={48} cor={C.fita} />
      <Faixa r={T(73.8)} texto="E ABREM O COFRE" top={410} size={66} />
    </Plano>
    {/* NOVO: a chave */}
    <Plano r={[88.86, 92.71]}>
      <Cena r={[88.86, 92.71]} from={10.2} a={0.3} zoom={[1.1, 1.25]} />
      <Rotulo r={89.0} texto="ELES TINHAM A COMBINAÇÃO" top={330} size={46} cor={C.fita} />
      <Faixa r={91.1} texto="E UMA CÓPIA DA CHAVE" top={410} size={62} />
    </Plano>
    <Flash r={91.2} />
    <Plano r={[92.71, T(82.6)]}>
      <Cena r={[92.71, T(82.6)]} from={21.5} a={0.72} />
      <Rotulo r={92.8} texto="CAIXAS ARROMBADAS" top={330} size={50} cor={C.fita} />
      <Grade r={93.0} dur={3.3} />
      <Rotulo r={T(80.1)} texto="diamantes · ouro · joias · dinheiro" top={1180} size={42} />
    </Plano>
    <Plano r={[T(82.6), T(88.2)]}>
      <Tremor r={T(82.6)}><Cheia src="an2-cofre-cor" r={[T(82.6), T(88.2)]} credito={CR} cinza={false} pos="50% 55%" zoom={[1.0, 1.14]} a={0.25} /></Tremor>
      <Rotulo r={T(82.7)} texto="SEGUNDA-FEIRA DE MANHÃ" top={330} size={46} cor={C.fita} />
      <Faixa r={T(85.5)} texto="O CHÃO COBERTO DE CAIXAS VAZIAS" top={410} size={50} />
    </Plano>
    <Flash r={T(82.6)} />
    <Plano r={[T(88.2), T(95.7)]}>
      <Cheia src="an2-cofre-pb" r={[T(88.2), T(95.7)]} credito={CR} cinza={false} pos="60% 50%" zoom={[1.0, 1.15]} a={0.35} />
      <Rotulo r={T(88.3)} texto="PREJUÍZO ESTIMADO" top={330} size={44} cor={C.fita} />
      <Titulo r={T(89.9)} top={400} size={96}>+ US$ 100 MILHÕES</Titulo>
      <Rotulo r={T(92.7)} texto="o maior roubo de diamantes da história" top={1160} size={42} />
    </Plano>

    {/* ═══ O LIXO ═══ */}
    <Plano r={[T(95.7), T(101.5)]}>
      <Cheia src="an2-cofre-cor" r={[T(95.7), T(101.5)]} credito={CR} cinza={false} pos="30% 55%" zoom={[1.12, 1.0]} a={0.35} />
      <Rotulo r={T(95.8)} texto="PARECIA O CRIME PERFEITO" top={330} size={46} cor={C.fita} />
      <Faixa r={T(99.0)} texto="ATÉ QUE ALGUÉM SE LIVROU DO LIXO" top={410} size={50} />
    </Plano>
    <Plano r={[T(101.5), 125.1]}>
      <Cheia src="an2-aereo" r={[T(101.5), 125.1]} credito={CR} cinza={false} pos="50% 50%" zoom={[1.15, 1.3]} a={0.6} />
      <Rotulo r={T(101.6)} texto="NA FUGA" top={330} size={48} cor={C.fita} />
      <Rota r={120.3} pin={121.2} />
    </Plano>
    {/* NOVO: Speedy em pânico */}
    <Plano r={[125.1, 133.26]} soco={false}>
      <Mural
        itens={[{ id: "speedy", r: 125.2, x: 300, y: 520, w: 480, h: 420, img: "an2-silhueta", titulo: "SPEEDY", sub: "o mais nervoso do grupo", rot: -2 }]}
        fios={[]}
        camera={[[125.1, 0.95, 0, 0], [133.2, 1.08, 0, -30]]}
      />
      <Fonte r={125.2} texto="SEGUNDO A REVISTA WIRED" />
      <Rotulo r={126.9} texto="QUEM LARGOU OS SACOS FOI" top={340} size={44} cor={C.fita} />
      <Tremor r={131.0} forca={12}><Carimbo r={131.0} texto="EM PÂNICO" y={1180} rot={-8} size={90} /></Tremor>
    </Plano>
    <Flash r={131.0} />
    <Plano r={[133.26, T(111.9)]}>
      <Cheia src="an2-policia" r={[133.26, T(111.9)]} credito={CR} cinza={false} pos="45% 50%" zoom={[1.0, 1.15]} a={0.3} />
      <Rotulo r={T(107.6)} texto="O DONO DO TERRENO ABRE OS SACOS" top={330} size={42} cor={C.fita} />
      <Faixa r={T(110.0)} texto="E CHAMA A POLÍCIA" top={410} size={66} />
    </Plano>
    <Plano r={[T(111.9), T(121.7)]}>
      <Cheia src="an2-lixo" r={[T(111.9), T(121.7)]} credito={CR} cinza={false} pos="50% 50%" zoom={[1.0, 1.15]} a={0.4} />
      <Rotulo r={T(111.9)} texto="DENTRO DOS SACOS:" top={330} size={46} cor={C.fita} />
      <Rotulo r={T(112.7)} texto="✓ papéis do Diamond Centre" top={410} size={46} />
      <Rotulo r={T(114.4)} texto="✓ fitas de vídeo" top={485} size={46} />
      <Circulo r={T(115.5)} x={560} y={900} rx={260} ry={180} />
      <Carimbo r={T(115.8)} texto="SANDUÍCHE DE SALAME" y={1150} rot={-6} size={70} />
      <Faixa r={T(118.3)} texto="FOI ESSE LIXO QUE ENTREGOU A QUADRILHA" top={600} size={40} />
    </Plano>
    <Flash r={T(115.8)} />

    {/* ═══ DESFECHO ═══ */}
    <Plano r={[T(121.7), T(127.0)]}>
      <Cheia src="an2-detet" r={[T(121.7), T(127.0)]} credito={CR} cinza={false} pos="50% 40%" zoom={[1.0, 1.12]} />
      <Rotulo r={T(121.8)} texto="DIAS DEPOIS DO ROUBO" top={330} size={46} cor={C.fita} />
      <Rotulo r={T(123.1)} texto="Notarbartolo volta ao Diamond Centre" top={400} size={42} />
      <Faixa r={T(125.2)} texto="E É PRESO ALI MESMO" top={470} size={60} />
    </Plano>
    <Flash r={T(125.2)} />
    <Plano r={[T(127.0), T(135.6)]}>
      <Foto src="an2-jornal" r={[T(127.0), T(135.6)]} credito={CR} top={460} w={900} h={700} pos="40% 40%" zoom={[1.12, 1.0]} />
      <Titulo r={T(127.3)} top={240} size={80}>10 ANOS DE PRISÃO</Titulo>
      <Rotulo r={T(129.5)} texto="outros integrantes também foram condenados" top={350} size={36} />
      <Faixa r={T(132.8)} texto="OS DIAMANTES NUNCA FORAM ACHADOS" top={1080} size={46} />
    </Plano>
    <Plano r={[T(135.6), T(145.5)]}>
      <Cheia src="an-lider" r={[T(135.6), T(145.5)]} credito={CR} cinza={false} pos="50% 30%" zoom={[1.0, 1.14]} />
      <Rotulo r={T(135.7)} texto="ANOS DEPOIS, A VERSÃO DELE:" top={330} size={44} cor={C.fita} />
      <Faixa r={T(139.9)} texto="“FOI FRAUDE DE SEGURO”" top={410} size={60} />
      <Carimbo r={T(143.8)} texto="A POLÍCIA NUNCA ACREDITOU" y={1160} rot={-5} size={56} />
    </Plano>
    <Plano r={[T(145.5), T(151.45)]}>
      <Cheia src="an2-cofre-cor" r={[T(145.5), T(151.45)]} credito={CR} cinza={false} pos="50% 55%" zoom={[1.15, 1.0]} a={0.35} />
      <Rotulo r={T(145.6)} texto="US$ 100 MILHÕES" top={340} size={58} />
      <Rotulo r={T(147.9)} texto="UM COFRE IMPOSSÍVEL" top={430} size={58} />
      <Faixa r={T(149.7)} texto="E UM SANDUÍCHE PELA METADE" top={520} size={54} />
    </Plano>
    <Plano r={[T(151.45), 400]} soco={false}>
      <Fechamento r={T(151.5)} caso="Nº 028" status="NUNCA RECUPERADOS" pergunta="Os diamantes nunca foram encontrados." />
    </Plano>
  </Reel>
);

// capa: o cofre revirado + promessa (o que o vídeo entrega)
export const CapaAntu: React.FC = () => (
  <AbsoluteFill style={{ background: C.preto }}>
    <Img src={staticFile("img/an2-cofre-cor.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "45% 55%" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.8) 75%)" }} />
    <div style={{ position: "absolute", left: 90, right: 90, top: 420, textAlign: "center" }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 110, lineHeight: 1.0, color: C.osso, textShadow: SOMBRA }}>US$ 100</div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 110, lineHeight: 1.05, color: C.osso, textShadow: SOMBRA }}>MILHÕES</div>
    </div>
    <div style={{ position: "absolute", left: 90, right: 90, top: 1140, textAlign: "center" }}>
      <div style={{ fontFamily: ELITE, fontSize: 42, lineHeight: 1.3, color: C.osso, textShadow: SOMBRA }}>em diamantes. Os ladrões foram pegos por causa de um</div>
      <div style={{ display: "inline-block", marginTop: 14, padding: "6px 26px 12px", background: C.lacre, fontFamily: MONT, fontWeight: 800, fontSize: 96, color: C.osso }}>SANDUÍCHE</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1460, textAlign: "center", fontFamily: "Playfair", fontWeight: 900, fontSize: 44, letterSpacing: "0.12em", color: C.osso }}>ÁLIBI</div>
  </AbsoluteFill>
);
