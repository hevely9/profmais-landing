import React from "react";
import { AbsoluteFill } from "remotion";
import p1 from "../../public/palavras-fortaleza1.json";
import p2 from "../../public/palavras-fortaleza2.json";
import { C, COURIER, Cabec, Carimbo, Cheia, Clip, Contador, ELITE, Faixa, Foto, Fundo, Grande, Linha, MONT, Papel, Plano, Reel, Rotulo, SOMBRA, Titulo, achar, lin, mkCtx, useT, Marcador, Assinatura, TituloVivo } from "../kit";

type W = { text: string; start: number; end: number };
const words1 = (p1 as { words: W[] }).words, words2 = (p2 as { words: W[] }).words;
const w1 = achar(words1), w2 = achar(words2);

export const ctx1 = mkCtx({
  caso: "Nº 007", parte: "PARTE 1", audio: "fortaleza1", words: words1, lead: 0.1, fimVozRaw: 60.3, final: "parte2",
  cta: ["", ""],
  chave: /^(terra|nada|túnel|cofre|concreto|destruição|registrada|r\$164|erro|2)$/i,
  semLegenda: [],
  sfx: [
    { src: "whoosh", r: 2.45, vol: 0.25 }, { src: "coracao", r: 5.3, vol: 0.45 }, { src: "impacto", r: 7.64, vol: 0.4 },
    { src: "whoosh", r: 12.55, vol: 0.25 }, { src: "whoosh", r: 19.45, vol: 0.25 }, { src: "subida", r: 22.5, vol: 0.2 },
    ...[26.18, 26.84, 27.8].map((r) => ({ src: "tecla", r, vol: 0.3 })), { src: "impacto", r: 34.74, vol: 0.45 },
    { src: "trava", r: 38.54, vol: 0.4 }, { src: "carimbo", r: 43.4, vol: 0.5 }, ...[0, 1, 2, 3, 4, 5, 6, 7].map((d) => ({ src: "tique", r: 50.7 + d * 0.2, vol: 0.28 })),
    { src: "impacto", r: 52.48, vol: 0.5 }, { src: "coracao", r: 54.9, vol: 0.5 }, { src: "subida", r: 56.5, vol: 0.3 },
  ],
});
export const ctx2 = mkCtx({
  caso: "Nº 008", parte: "PARTE 2", audio: "fortaleza2", words: words2, lead: 0.1, fimVozRaw: 58.4, final: "alibi",
  cta: ["Onde está o resto do dinheiro?", "comenta seu palpite ↓"], proximo: "A FUGA DE ALCATRAZ",
  chave: /^(sumir|11|vivo|caminhão|falsos|cofre|meada|condenadas|60|apareceu|sumidos|álibi)$/i,
  semLegenda: [[54.0, 70]],
  sfx: [
    { src: "whoosh", r: 3.15, vol: 0.25 }, { src: "whoosh", r: 5.45, vol: 0.25 }, ...Array.from({ length: 11 }, (_, i) => ({ src: "tique", r: 11.3 + i * 0.13, vol: 0.28 })),
    { src: "whoosh", r: 14.85, vol: 0.25 }, { src: "trava", r: 21.08, vol: 0.4 }, { src: "impacto", r: 25.66, vol: 0.4 },
    { src: "carimbo", r: 30.84, vol: 0.5 }, { src: "subida", r: 31.6, vol: 0.2 }, ...[0, 1, 2, 3, 4, 5].map((d) => ({ src: "tique", r: 37.9 + d * 0.18, vol: 0.28 })),
    { src: "impacto", r: 43.32, vol: 0.4 }, { src: "carimbo", r: 46.52, vol: 0.5 }, { src: "coracao", r: 49.6, vol: 0.45 }, { src: "subida", r: 52.0, vol: 0.25 },
  ],
});

// mapa esquemático: loja → avenida → cofre do Banco Central
const MapaTunel: React.FC<{ cava?: [number, number]; cofre?: number; zoom?: number; rotulos?: number }> = ({ cava, cofre, zoom = 1, rotulos = -99 }) => {
  const { t, o } = useT();
  const k = cava ? lin(t, o(cava[0]), o(cava[1]), (x) => x) : 0;
  const mostra = (r: number) => lin(t, o(r) - 0.05, o(r) + 0.3);
  return <>
    <Fundo cor="#0D0E10" />
    <AbsoluteFill style={{ opacity: 0.12, backgroundImage: "linear-gradient(rgba(236,231,220,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(236,231,220,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
    <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "75% 50%" }}>
    <svg width="1080" height="1920" style={{ position: "absolute", left: 0, top: 0 }}>
      {/* superfície: loja | avenida | Banco Central */}
      <rect x="70" y="430" width="270" height="210" fill="#2B2722" stroke={C.osso} strokeWidth="4" />
      <rect x="340" y="560" width="330" height="80" fill="#1A1A1C" />
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={355 + i * 54} y="596" width="30" height="8" fill="#C9A227" opacity="0.8" />)}
      <rect x="670" y="330" width="340" height="310" fill="#2B2722" stroke={C.osso} strokeWidth="4" />
      <line x1="40" y1="640" x2="1040" y2="640" stroke={C.osso} strokeWidth="3" />
      {/* terra */}
      <rect x="40" y="642" width="1000" height="420" fill="#1C1611" />
      {/* cofre */}
      <rect x="760" y="900" width="200" height="130" fill="#3A332B" stroke={C.osso} strokeWidth="5" opacity={cofre !== undefined ? 1 : 0.6} />
      {/* túnel */}
      <path d="M200 640 L200 960 L760 960" stroke={C.lacre} strokeWidth="26" fill="none" strokeLinecap="square" strokeDasharray="900" strokeDashoffset={900 * (1 - k)} />
      <path d="M200 640 L200 960 L760 960" stroke="#E7C873" strokeWidth="3" fill="none" strokeDasharray="12 16" opacity={k > 0.02 ? 0.8 : 0} />
    </svg>
    <div style={{ position: "absolute", left: 70, top: 380, width: 270, textAlign: "center", fontFamily: COURIER, fontWeight: 700, fontSize: 28, color: C.osso, opacity: mostra(rotulos + 0.6) }}>LOJA DE GRAMA</div>
    <div style={{ position: "absolute", left: 340, top: 660, width: 330, textAlign: "center", fontFamily: COURIER, fontWeight: 700, fontSize: 26, color: C.ossoE, opacity: mostra(rotulos) }}>AVENIDA</div>
    <div style={{ position: "absolute", left: 670, top: 280, width: 340, textAlign: "center", fontFamily: COURIER, fontWeight: 700, fontSize: 28, color: C.osso, opacity: mostra(rotulos) }}>BANCO CENTRAL</div>
    <div style={{ position: "absolute", left: 760, top: 1040, width: 200, textAlign: "center", fontFamily: COURIER, fontWeight: 700, fontSize: 30, color: C.verm, opacity: cofre !== undefined ? mostra(cofre) : 0 }}>COFRE</div>
    </AbsoluteFill>
    {cava && <div style={{ position: "absolute", left: 0, right: 0, top: 1110, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 72, color: C.osso, textShadow: SOMBRA }}>≈ {Math.round(78 * k)} m</div>}
  </>;
};
// placa da loja-fachada
const Placa: React.FC<{ r: number }> = ({ r }) => {
  const { t, o } = useT();
  const k = lin(t, o(r), o(r) + 0.4);
  const neon = 0.75 + 0.25 * Math.sin(t * 9);
  return <>
    <Fundo cor="radial-gradient(ellipse at 50% 45%, #1F2A1E 0%, #0A0A0B 75%)" />
    <div style={{ position: "absolute", left: 110, right: 110, top: 520, padding: "50px 30px", border: `6px solid rgba(120,200,120,${0.6 * neon})`, boxShadow: `0 0 ${60 * neon}px rgba(80,180,90,0.35), inset 0 0 40px rgba(80,180,90,0.2)`, textAlign: "center", opacity: k, transform: `scale(${0.94 + 0.06 * k})` }}>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 70, color: "#CFEAC9", lineHeight: 1.05, textShadow: `0 0 ${24 * neon}px rgba(120,220,120,0.6)` }}>GRAMA<br />SINTÉTICA</div>
      <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 30, color: C.ossoE, marginTop: 20 }}>“vende-se grama”</div>
    </div>
    <Rotulo r={r + 0.3} texto="reconstituição da fachada" top={1000} size={26} cor={C.ossoE} />
  </>;
};
// bloco de concreto armado sendo furado
const Concreto: React.FC<{ r: number }> = ({ r }) => {
  const { t, o } = useT();
  const k = lin(t, o(r), o(r) + 1.6, (x) => x);
  return <>
    <Fundo cor="#0D0D0E" />
    <div style={{ position: "absolute", left: 140, right: 140, top: 520, height: 420, background: "linear-gradient(#77736C, #5A5751)", boxShadow: "inset 0 0 60px rgba(0,0,0,0.6), 0 30px 80px rgba(0,0,0,0.8)",
      backgroundImage: "repeating-linear-gradient(90deg, rgba(40,40,40,0.5) 0 6px, transparent 6px 90px), repeating-linear-gradient(0deg, rgba(40,40,40,0.5) 0 6px, transparent 6px 90px)" }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: 40 + 260 * k, height: 40 + 260 * k, borderRadius: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, #050505 55%, #2A2824 70%, transparent 72%)" }} />
    </div>
    <div style={{ position: "absolute", left: 140, top: 960, fontFamily: COURIER, fontWeight: 700, fontSize: 28, color: C.ossoE }}>↕ +1 metro</div>
  </>;
};
// barras: roubado x recuperado
const Barras: React.FC<{ r: number; rec: number; carimbo?: number }> = ({ r, rec, carimbo }) => {
  const { t, o } = useT();
  const a = lin(t, o(r), o(r) + 0.8, (x) => 1 - Math.pow(1 - x, 3)), b = lin(t, o(rec), o(rec) + 0.8, (x) => 1 - Math.pow(1 - x, 3));
  const H = 700;
  return <>
    <Fundo />
    <div style={{ position: "absolute", left: 180, bottom: 1920 - 1180, width: 300, height: H * a, background: C.osso }} />
    <div style={{ position: "absolute", left: 600, bottom: 1920 - 1180, width: 300, height: H * (60 / 164) * b, background: C.lacre }} />
    <div style={{ position: "absolute", left: 180, top: 1190, width: 300, textAlign: "center", fontFamily: COURIER, fontWeight: 700, fontSize: 30, color: C.osso }}>ROUBADO</div>
    <div style={{ position: "absolute", left: 600, top: 1190, width: 300, textAlign: "center", fontFamily: COURIER, fontWeight: 700, fontSize: 30, color: C.osso }}>RECUPERADO</div>
    <div style={{ position: "absolute", left: 130, top: 1180 - H * a - 90, width: 400, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 64, color: C.osso, opacity: a }}>R$ 164 mi</div>
    <div style={{ position: "absolute", left: 550, top: 1180 - H * (60 / 164) * b - 90, width: 400, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 64, color: C.verm, opacity: b }}>≤ 60 mi</div>
    {carimbo !== undefined && <Carimbo r={carimbo} texto="O RESTO SUMIU" y={330} size={84} />}
  </>;
};
// 11 carros comprados de uma vez
const Onze: React.FC<{ r: number }> = ({ r }) => {
  const { t, o } = useT();
  return <>
    <Fundo />
    <div style={{ position: "absolute", left: 90, right: 90, top: 420, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 26 }}>
      {Array.from({ length: 11 }, (_, i) => {
        const k = lin(t, o(r) + i * 0.13, o(r) + i * 0.13 + 0.15);
        return <svg key={i} width="190" height="110" viewBox="0 0 190 110" style={{ opacity: k, transform: `scale(${0.7 + 0.3 * k})` }}>
          <path d="M15 72 L25 45 Q32 30 50 28 L120 28 Q138 28 150 44 L172 60 Q182 64 182 76 L182 84 L8 84 L8 76 Q8 72 15 72 Z" fill={C.osso} />
          <path d="M48 36 L70 36 L70 56 L36 56 Z M78 36 L118 36 Q130 36 138 52 L138 56 L78 56 Z" fill="#0A0A0B" opacity="0.7" />
          <circle cx="48" cy="86" r="16" fill="#0A0A0B" stroke={C.osso} strokeWidth="6" /><circle cx="146" cy="86" r="16" fill="#0A0A0B" stroke={C.osso} strokeWidth="6" />
        </svg>;
      })}
    </div>
    <Contador r={r} ate={r + 1.4} valor={11} sufixo=" CARROS" top={240} size={110} />
  </>;
};
const Fio: React.FC<{ r: number }> = ({ r }) => {
  const { t, o } = useT();
  const k = lin(t, o(r), o(r) + 1.6, (x) => x);
  return <svg width="1080" height="1920" style={{ position: "absolute", left: 0, top: 0 }}>
    <path d="M-20 980 C 200 820, 300 1140, 540 960 S 880 820, 1100 900" stroke={C.lacre} strokeWidth="8" fill="none" strokeDasharray="1400" strokeDashoffset={1400 * (1 - k)} />
  </svg>;
};

export const Fortaleza1: React.FC = () => (
  <Reel ctx={ctx1}>
    {/* GANCHO — texto no quadro 0, prédio real do Banco Central */}
    <Plano r={[-0.1, 2.5]} soco={false}>
      <Foto src="f-bc" r={[-0.1, 2.5]} credito="Joelkaula · CC BY-SA 4.0" top={520} w={760} h={740} zoom={[1.0, 1.1]} pos="50% 35%" cinza />
      <Titulo r={-1} top={200} size={88}>3,5 TONELADAS<br />DE DINHEIRO</Titulo>
      <Rotulo r={-1} texto="BANCO CENTRAL · FORTALEZA" top={440} size={34} cor={C.verm} />
    </Plano>
    <Plano r={[2.5, 5.1]}>
      <Clip src="c46139" r0={2.5} dur={2.6} a={0.4} />
      <Titulo r={w1("por") - 0.1} top={380} size={110}>POR BAIXO<br />DA TERRA</Titulo>
    </Plano>
    <Plano r={[5.1, 7.5]}>
      <Fundo cor={C.preto} />
      <Grande r={5.2} top={700} size={84}>e ninguém<br />ouviu nada.</Grande>
    </Plano>
    <Plano r={[7.5, 9.2]}>
      <Cheia src="f-cidade" alt={{ clip: "c1919" }} r={[7.5, 9.2]} credito="deltafrut · CC BY 2.0" zoom={[1.1, 1.22]} a={0.45} />
      <Titulo r={7.55} top={380} size={110}>FORTALEZA</Titulo>
      <Titulo r={w1("2005") - 0.1} top={520} size={110} cor={C.verm}>2005</Titulo>
    </Plano>
    <Plano r={[9.2, 12.6]}><MapaTunel rotulos={10.2} /></Plano>
    <Plano r={[12.6, 15.9]}>
      <Placa r={12.65} />
      <Titulo r={12.7} top={300} size={70}>ABRE UMA LOJA NOVA</Titulo>
    </Plano>
    <Plano r={[15.9, 17.9]}>
      <Clip src="c31375" r0={15.9} dur={2} a={0.45} />
      <Titulo r={15.95} top={380} size={84}>OS VIZINHOS<br />ESTRANHAVAM</Titulo>
    </Plano>
    <Plano r={[17.9, 19.5]}>
      <Fundo />
      <Rotulo r={17.95} texto="CLIENTES POR DIA" top={620} size={40} cor={C.ossoE} />
      <Titulo r={18.3} top={700} size={200}>≈ 0</Titulo>
    </Plano>
    <Plano r={[19.5, 21.6]}>
      <Clip src="c10161" r0={19.5} dur={2.1} a={0.4} />
      <Faixa r={w1("saía") - 0.1} texto="MAS SAÍA MUITA TERRA" top={420} size={64} />
    </Plano>
    <Plano r={[21.6, 24.4]}>
      <Clip src="c46139" r0={21.6} from={4} dur={2.8} a={0.45} />
      <Titulo r={21.65} top={380} size={96}>3 MESES<br />CAVANDO</Titulo>
    </Plano>
    <Plano r={[24.4, 26.0]}><MapaTunel cava={[24.3, 25.6]} rotulos={0} /></Plano>
    <Plano r={[26.0, 30.0]}>
      <Fundo />
      <Papel top={400} h={620} rot={-1}>
        <Cabec sup="DETALHES DA OBRA" titulo="O TÚNEL" />
        <Linha r={w1("luz") - 0.1} texto="— iluminação elétrica" size={40} />
        <Linha r={w1("ventilação") - 0.1} texto="— ventilação" size={40} />
        <Linha r={w1("paredes") - 0.1} texto="— paredes escoradas com madeira" size={40} />
      </Papel>
    </Plano>
    <Plano r={[30.0, 32.8]}><MapaTunel cava={[30.0, 34.0]} rotulos={0} /></Plano>
    <Plano r={[32.8, 35.5]}>
      <MapaTunel cava={[30.0, 34.0]} rotulos={0} cofre={w1("cofre") - 0.1} zoom={1.25} />
      <Faixa r={w1("exatamente") - 0.05} texto="EXATAMENTE EMBAIXO DO COFRE" top={170} size={54} />
    </Plano>
    <Plano r={[35.5, 37.4]}>
      <Clip src="c49379" r0={35.5} dur={1.9} a={0.45} />
      <Titulo r={35.55} top={400} size={90}>NUM FIM<br />DE SEMANA</Titulo>
    </Plano>
    <Plano r={[37.4, 39.6]}>
      <Concreto r={37.5} />
      <Titulo r={w1("concreto") - 0.2} top={250} size={74}>CONCRETO ARMADO</Titulo>
    </Plano>
    <Plano r={[39.6, 41.4]}>
      <Clip src="c25451" r0={39.6} dur={1.8} a={0.45} />
      <Titulo r={39.65} top={400} size={110}>LÁ DENTRO</Titulo>
    </Plano>
    <Plano r={[41.4, 44.4]}>
      <Fundo />
      <Papel top={440} h={500} rot={1.5}>
        <Cabec sup="COFRE · BANCO CENTRAL" titulo="NOTAS DE R$ 50" />
        <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 40 }}>separadas para destruição</div>
      </Papel>
      <Carimbo r={w1("destruição") - 0.05} texto="DESTRUIR" y={1040} rot={-8} size={96} />
    </Plano>
    <Plano r={[44.4, 47.5]}>
      <Clip src="c46980" r0={44.4} dur={3.1} a={0.5} />
      <Rotulo r={44.45} texto="NOTAS USADAS" top={330} size={50} />
      <Faixa r={w1("sem") - 0.1} texto="SEM NUMERAÇÃO REGISTRADA" top={420} size={56} />
      <Rotulo r={46.6} texto="= impossível de rastrear" top={540} size={34} cor={C.verm} />
    </Plano>
    <Plano r={[47.5, 50.6]}>
      <Clip src="c46981" r0={47.5} dur={3.1} a={0.5} />
      <Titulo r={47.55} top={400} size={96}>SEGUNDA-FEIRA</Titulo>
      <Rotulo r={w1("abriram") - 0.1} texto="abrem o cofre" top={530} size={44} />
    </Plano>
    <Plano r={[50.6, 53.8]}>
      <Fundo cor={C.preto} />
      <Rotulo r={50.65} texto="FALTAVAM" top={560} size={48} cor={C.ossoE} />
      <Contador r={50.7} ate={52.4} valor={164} prefixo="R$ " sufixo=" MI" top={650} size={160} cor={C.verm} />
      <Rotulo r={52.6} texto="o maior furto da história do Brasil" top={860} size={32} />
    </Plano>
    <Plano r={[53.8, 58.0]}>
      <Clip src="c17228" r0={53.8} dur={4.2} a={0.5} />
      <Titulo r={w1("erro") - 0.3} top={380} size={96}>O MAIOR ERRO</Titulo>
      <Rotulo r={w1("ainda") - 0.1} texto="ainda estava por vir" top={510} size={44} />
    </Plano>
    <Plano r={[58.0, 70]} soco={false}>
      <Fundo cor={C.preto} />
      <Titulo r={58.05} top={700} size={170}>PARTE 2</Titulo>
      <Rotulo r={w1("perfil") - 0.1} texto="NO PERFIL ↗" top={900} size={56} cor={C.verm} />
    </Plano>
  </Reel>
);

export const Fortaleza2: React.FC = () => (
  <Reel ctx={ctx2}>
    {/* GANCHO — texto no quadro 0 */}
    <Plano r={[-0.1, 3.2]} forte>
      <Clip src="c46981" r0={-0.1} dur={3.3} a={0.35} />
      <TituloVivo top={250} size={92} linhas={[[["ROUBARAM", 0]], [["R$ 164", 0.78], ["MILHÕES", 1.54]]]} />
      <Faixa r={2.3} texto="E FORAM PEGOS POR 11 CARROS" top={560} size={52} />
          </Plano>
    <Plano r={[3.2, 5.5]}>
      <Clip src="c1919" r0={3.2} dur={2.3} a={0.45} />
      <Grande r={3.3} top={680} size={88}>agora era<br />só sumir.</Grande>
    </Plano>
    <Plano r={[5.5, 7.6]}>
      <Fundo cor={C.preto} />
      <Titulo r={w2("dia") - 0.3} top={720} size={100}>NO DIA<br />SEGUINTE</Titulo>
    </Plano>
    <Plano r={[7.6, 10.6]}>
      <Clip src="c23048" r0={7.6} dur={3} a={0.45} />
      <Titulo r={w2("revenda") - 0.2} top={360} size={80}>UMA REVENDA<br />DE CARROS</Titulo>
      <Rotulo r={w2("fortaleza") - 0.1} texto="FORTALEZA" top={560} size={40} />
    </Plano>
    <Plano r={[10.6, 13.4]}><Onze r={w2("11") - 0.3} /></Plano>
    <Plano r={[13.4, 14.9]}>
      <Clip src="c24454" r0={13.4} dur={1.5} a={0.45} />
      <Faixa r={w2("dinheiro") - 0.1} texto="EM DINHEIRO VIVO" top={420} size={72} />
    </Plano>
    <Plano r={[14.9, 18.5]}>
      <Clip src="c17228" r0={14.9} from={4} dur={3.6} a={0.45} />
      <Titulo r={w2("caminhão") - 0.15} top={360} size={84}>CAMINHÃO-<br />CEGONHA</Titulo>
      <Rotulo r={w2("rumo") - 0.1} texto="RUMO AO SUDESTE" top={560} size={40} />
    </Plano>
    <Plano r={[18.5, 22.1]}>
      <Clip src="c17376" r0={18.5} dur={3.6} a={0.45} />
      <Titulo r={w2("minas") - 0.15} top={360} size={100}>MINAS GERAIS</Titulo>
      <Rotulo r={w2("polícia") - 0.1} texto="POLÍCIA RODOVIÁRIA FEDERAL" top={490} size={36} />
      <Carimbo r={w2("parou") - 0.05} texto="PARADO" y={820} size={110} />
    </Plano>
    <Plano r={[22.1, 25.5]}>
      <Clip src="c46980" r0={22.1} from={2} dur={3.4} a={0.5} />
      <Rotulo r={22.15} texto="DENTRO DOS CARROS" top={340} size={44} cor={C.ossoE} />
      <Faixa r={w2("fundos") - 0.15} texto="FUNDOS FALSOS" top={420} size={84} />
    </Plano>
    <Plano r={[25.5, 28.0]}>
      <Clip src="c45703" r0={25.5} dur={2.5} a={0.6} />
      <Titulo r={w2("milhões", 1) - 0.1} top={380} size={84}>MILHÕES EM<br />NOTAS DE R$ 50</Titulo>
    </Plano>
    <Plano r={[28.0, 31.4]}>
      <Fundo />
      <Papel top={420} h={560} rot={-1}>
        <Cabec sup="INVESTIGAÇÃO" titulo="AS MESMAS NOTAS" />
        <Linha r={28.1} texto="notas da cegonha" size={40} />
        <Linha r={29.0} texto="= notas do cofre" size={40} />
      </Papel>
      <Carimbo r={w2("cofre") - 0.05} texto="CONFERE" y={1050} size={100} />
    </Plano>
    <Plano r={[31.4, 33.9]}>
      <Fundo cor={C.preto} />
      <Fio r={31.45} />
      <Grande r={31.5} top={600} size={80}>o primeiro<br />fio da meada.</Grande>
    </Plano>
    <Plano r={[33.9, 37.2]}>
      <Clip src="c23253" r0={33.9} dur={3.3} a={0.5} />
      <Titulo r={w2("polícia", 1) - 0.1} top={380} size={88}>POLÍCIA FEDERAL</Titulo>
      <Rotulo r={w2("seguiu") - 0.1} texto="seguiu o dinheiro por anos" top={500} size={40} />
    </Plano>
    <Plano r={[37.2, 39.9]}>
      <Fundo />
      <Contador r={37.3} ate={38.6} valor={100} prefixo="+" top={560} size={240} />
      <Rotulo r={38.8} texto="CONDENADOS" top={830} size={56} />
    </Plano>
    <Plano r={[39.9, 42.7]}><Barras r={39.95} rec={w2("60") - 0.1} /></Plano>
    <Plano r={[42.7, 45.6]}><AbsoluteFill style={{ transform: "scale(1.12)", transformOrigin: "75% 60%" }}><Barras r={39.95} rec={w2("60") - 0.1} /></AbsoluteFill></Plano>
    <Plano r={[45.6, 48.3]}><Barras r={30} rec={30} carimbo={w2("nunca") - 0.05} /></Plano>
    <Plano r={[48.3, 51.3]}>
      <Foto src="f-bc" r={[48.3, 51.3]} credito="Joelkaula · CC BY-SA 4.0" top={500} w={760} h={760} zoom={[1.05, 1.18]} pos="50% 35%" cinza />
      <Titulo r={48.35} top={330} size={110}>ATÉ HOJE</Titulo>
    </Plano>
    <Plano r={[51.3, 54.0]}>
      <Clip src="c46139" r0={51.3} from={6} dur={2.7} a={0.45} />
      <Titulo r={51.35} top={360} size={92}>+ R$ 100 MI</Titulo>
      <Faixa r={w2("sumidos") - 0.15} texto="CONTINUAM SUMIDOS" top={500} size={64} />
    </Plano>
    <Plano r={[54.0, 70]} soco={false}>
      <Clip src="c1919" r0={54.0} from={4} dur={5} a={0.6} />
      <Grande r={54.1} top={640} size={86}>Onde você estava<br />naquela noite?</Grande>
      <Assinatura r={w2("esse") - 0.05} />
    </Plano>
  </Reel>
);
export const _u = [ELITE, Foto, Marcador];
