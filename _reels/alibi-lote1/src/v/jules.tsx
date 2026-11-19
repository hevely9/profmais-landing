import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import palavras from "../../public/palavras-jules.json";
import { C, COURIER, Cabec, Carimbo, Clip, ELITE, Faixa, Foto, Fundo, Grande, Linha, MONT, Papel, Plano, Reel, Rotulo, SOMBRA, Titulo, achar, lin, mkCtx, useT, Assinatura } from "../kit";

const words = (palavras as { words: { text: string; start: number; end: number }[] }).words;
const w = achar(words);
export const ctx = mkCtx({
  caso: "Nº 010", audio: "jules", words, lead: 0.1, fimVozRaw: 64.5, final: "alibi",
  cta: ["A taça ainda existe?", "comenta: SIM ou NÃO ↓"],
  chave: /^(sempre|noite|tricampeão|definitivamente|balas|taça|mentor|condenadas|derretida|ouro|negaram|réplica|cachorro|pickles|álibi)$/i,
  semLegenda: [[60.2, 70]],
  sfx: [
    { src: "impacto", r: 2.42, vol: 0.4 }, { src: "whoosh", r: 4.55, vol: 0.25 }, { src: "impacto", r: 7.64, vol: 0.4 },
    { src: "whoosh", r: 10.25, vol: 0.25 }, { src: "whoosh", r: 14.55, vol: 0.25 }, { src: "trava", r: 19.04, vol: 0.35 },
    { src: "tique", r: 21.18, vol: 0.35 }, { src: "tique", r: 22.04, vol: 0.35 }, { src: "impacto", r: 23.32, vol: 0.4 },
    { src: "trava", r: 25.92, vol: 0.35 }, { src: "impacto", r: 27.34, vol: 0.45 }, { src: "carimbo", r: 29.66, vol: 0.5 },
    ...[33.0, 33.4, 33.8, 34.6].map((r) => ({ src: "tecla", r, vol: 0.28 })), { src: "carimbo", r: 34.62, vol: 0.45 },
    ...[36.14, 36.42, 36.88].map((r) => ({ src: "carimbo", r, vol: 0.3 })), { src: "coracao", r: 38.7, vol: 0.45 },
    { src: "subida", r: 41.0, vol: 0.25 }, { src: "carimbo", r: 45.98, vol: 0.5 }, { src: "impacto", r: 52.18, vol: 0.4 },
    { src: "carimbo", r: 55.78, vol: 0.45 }, { src: "subida", r: 57.4, vol: 0.25 },
  ],
});

// vitrine de vidro com a taça; pode trincar e ficar vazia
export const Vitrine: React.FC<{ r: readonly [number, number]; trinca?: number; some?: number; img?: string }> = ({ r, trinca, some, img = "j-lafleur" }) => {
  const { t, o } = useT();
  const k = lin(t, o(r[0]), o(r[1]), (x) => x);
  const tr = trinca !== undefined ? lin(t, o(trinca) - 0.02, o(trinca) + 0.12) : 0;
  const vaz = some !== undefined ? lin(t, o(some) - 0.05, o(some) + 0.4) : 0;
  return <>
    <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A2620 0%, #0A0A0B 72%)" />
    <div style={{ position: "absolute", left: 230, top: 330, width: 620, height: 860, transform: `scale(${1 + 0.06 * k})` }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 30, bottom: 150, overflow: "hidden", display: "flex", justifyContent: "center" }}>
        <Img src={staticFile(`img/${img}.jpg`)} style={{ height: "100%", objectFit: "contain", opacity: 1 - vaz, filter: "contrast(1.1) brightness(0.95)" }} />
      </div>
      <div style={{ position: "absolute", inset: "0 0 130px 0", border: "6px solid rgba(220,230,235,0.55)", background: "linear-gradient(120deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 35%, rgba(255,255,255,0.10) 60%, rgba(255,255,255,0.0) 100%)", boxShadow: "inset 0 0 40px rgba(255,255,255,0.08)" }} />
      {tr > 0 && <svg width="620" height="730" style={{ position: "absolute", left: 0, top: 0, opacity: tr }}>
        {[[310, 360, 40, 80], [310, 360, 560, 120], [310, 360, 120, 690], [310, 360, 590, 600], [310, 360, 300, 20], [310, 360, 20, 420]].map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} stroke="rgba(235,240,245,0.85)" strokeWidth={3} />)}
        <circle cx={310} cy={360} r={26} fill="none" stroke="rgba(235,240,245,0.9)" strokeWidth={3} />
      </svg>}
      <div style={{ position: "absolute", left: -20, right: -20, bottom: 0, height: 140, background: "linear-gradient(#3A2E22, #1E1812)", boxShadow: "0 30px 70px rgba(0,0,0,0.9)" }} />
    </div>
  </>;
};
// três fichas sem rosto (não mostramos condenados)
const Tres: React.FC<{ carimbo?: number }> = ({ carimbo }) => (
  <>
    <Fundo />
    {[0, 1, 2].map((i) => {
      const r = [w("três") + 0.0, w("pessoas"), w("foram")][i];
      return <Ficha key={i} r={r} i={i} />;
    })}
    <Titulo r={w("condenadas") - 0.1} top={1060} size={84}>3 CONDENADOS</Titulo>
    {carimbo !== undefined && <Carimbo r={carimbo} texto="NEGARAM" y={760} size={120} />}
  </>
);
const Ficha: React.FC<{ r: number; i: number }> = ({ r, i }) => {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.05, o(r) + 0.2);
  return <div style={{ position: "absolute", left: 60 + i * 330, top: 430 + (i % 2) * 50, width: 300, height: 400, opacity: k, transform: `translateY(${(1 - k) * 30}px) rotate(${(i - 1) * 3}deg)`, background: "#CFC7B3", border: `3px solid ${C.tinta}`, overflow: "hidden",
    backgroundImage: "repeating-linear-gradient(0deg, rgba(26,23,20,0.25) 0 2px, transparent 2px 40px)", boxShadow: "0 20px 50px rgba(0,0,0,0.8)" }}>
    <svg viewBox="0 0 100 126" style={{ position: "absolute", left: 0, bottom: 0, width: "100%" }}><path d="M50 20 a20 22 0 1 1 0.1 0 Z M12 126 C14 92 30 80 50 80 C70 80 86 92 88 126 Z" fill="#2A2622" /></svg>
    <div style={{ position: "absolute", left: 0, right: 0, top: 10, textAlign: "center", fontFamily: COURIER, fontWeight: 700, fontSize: 24, color: C.tinta }}>CONDENADO {i + 1}</div>
  </div>;
};
// patinhas atravessando a tela (ilustração para o cachorro Pickles)
const Patas: React.FC<{ r: number }> = ({ r }) => {
  const { t, o } = useT();
  return <>{Array.from({ length: 10 }, (_, i) => {
    const at = o(r) + i * 0.2; const k = lin(t, at, at + 0.15);
    const x = 120 + i * 92, y = 900 - Math.sin(i * 0.7) * 60 + (i % 2 ? 40 : -40);
    return <svg key={i} width="70" height="70" viewBox="0 0 70 70" style={{ position: "absolute", left: x, top: y, opacity: k * 0.9, transform: `rotate(${80}deg)` }}>
      <ellipse cx="35" cy="44" rx="15" ry="13" fill={C.osso} />{[[16, 24], [28, 15], [42, 15], [54, 24]].map(([cx, cy], j) => <ellipse key={j} cx={cx} cy={cy} rx="6.5" ry="8" fill={C.osso} />)}
    </svg>;
  })}</>;
};
// taça "derretendo": imagem esquenta, desfoca e escorre
const Derrete: React.FC<{ r: readonly [number, number] }> = ({ r }) => {
  const { t, o } = useT();
  const k = lin(t, o(r[0]) + 0.3, o(r[1]), (x) => x);
  return <>
    <Clip src="c20906" r0={r[0]} dur={4} a={0.35} />
    <div style={{ position: "absolute", left: 290, top: 360, width: 500, height: 760, display: "flex", justifyContent: "center", transform: `scaleY(${1 - 0.25 * k}) translateY(${k * 120}px)`, transformOrigin: "bottom" }}>
      <Img src={staticFile("img/j-preston.jpg")} style={{ height: "100%", objectFit: "contain", filter: `sepia(${k}) saturate(${1 + 3 * k}) hue-rotate(${-10 * k}deg) brightness(${1 + 0.6 * k}) blur(${k * 6}px)`, opacity: 1 - 0.5 * k }} />
    </div>
  </>;
};

export const Jules: React.FC = () => (
  <Reel ctx={ctx}>
    {/* GANCHO — texto no quadro 0, a taça em foto real */}
    <Plano r={[-0.1, 2.4]} soco={false}>
      <Foto src="j-replica" r={[-0.1, 2.4]} credito="Fabio Rodrigues Pozzebom/ABr · CC BY 3.0" top={430} w={700} h={800} zoom={[1.0, 1.12]} />
      <Titulo r={-1} top={160} size={84}>O BRASIL GANHOU<br />ESSA TAÇA<br />PARA SEMPRE</Titulo>
    </Plano>
    <Plano r={[2.4, 4.6]}>
      <Vitrine r={[2.4, 4.6]} some={2.5} />
      <Faixa r={w("perdeu") - 0.1} texto="E PERDEU NUMA NOITE" top={200} size={70} />
    </Plano>
    <Plano r={[4.6, 7.6]}>
      <Foto src="j-preston" r={[4.6, 7.6]} credito="Abel Lafleur · CC BY 2.0" top={330} w={640} h={880} zoom={[1.0, 1.1]} cover={false} />
      <Rotulo r={4.7} texto="TAÇA JULES RIMET" top={190} size={50} />
      <Rotulo r={w("copa") - 0.1} texto="o troféu da Copa de 1930 a 1970" top={260} size={30} cor={C.ossoE} />
    </Plano>
    <Plano r={[7.6, 10.3]}>
      <Clip src="c30326" r0={7.6} dur={2.7} a={0.45} />
      <Titulo r={7.65} top={420} size={240}>1970</Titulo>
    </Plano>
    <Plano r={[10.3, 12.3]}>
      <Foto src="j-camisa" r={[10.3, 12.3]} credito="Mike Peel · CC BY-SA 4.0 · Museu do Futebol" top={330} w={620} h={880} zoom={[1.0, 1.1]} pos="50% 30%" />
      <Faixa r={w("tricampeão") - 0.1} texto="TRICAMPEÃO" top={190} size={80} />
    </Plano>
    <Plano r={[12.3, 14.6]}>
      <Fundo />
      <Papel top={430} h={560} rot={-1}>
        <Cabec sup="REGRA DA TAÇA" titulo="O 1º TRICAMPEÃO FICA COM ELA" size={56} />
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 96, color: C.lacre }}>PARA SEMPRE.</div>
      </Papel>
    </Plano>
    <Plano r={[14.6, 17.0]}>
      <Clip src="c17399" r0={14.6} dur={2.4} a={0.5} />
      <Titulo r={w("cbf") - 0.2} top={380} size={96}>SEDE DA CBF</Titulo>
      <Rotulo r={w("rio") - 0.1} texto="RIO DE JANEIRO" top={510} size={44} />
    </Plano>
    <Plano r={[17.0, 20.0]}>
      <Vitrine r={[17.0, 20.0]} />
      <Rotulo r={w("vitrine") - 0.1} texto="VITRINE" top={180} size={50} />
      <Faixa r={w("prova") - 0.1} texto="À PROVA DE BALAS" top={240} size={58} />
    </Plano>
    <Plano r={[20.0, 22.6]}>
      <Fundo cor={C.preto} />
      <Rotulo r={20.05} texto="NA NOITE DE" top={600} size={40} cor={C.ossoE} />
      <Titulo r={w("19") - 0.1} top={680} size={150}>19 → 20</Titulo>
      <Rotulo r={w("dezembro") - 0.1} texto="DE DEZEMBRO" top={860} size={44} />
    </Plano>
    <Plano r={[22.6, 25.4]}>
      <Clip src="c41770" r0={22.6} dur={2.8} a={0.5} />
      <Titulo r={w("1983") - 0.1} top={420} size={240}>1983</Titulo>
    </Plano>
    <Plano r={[25.4, 27.3]}>
      <Clip src="c31379" r0={25.4} dur={1.9} a={0.45} />
      <Titulo r={25.45} top={380} size={84}>RENDERAM<br />O VIGIA</Titulo>
    </Plano>
    <Plano r={[27.3, 29.0]}>
      <Vitrine r={[27.3, 29.0]} trinca={27.36} />
      <Rotulo r={27.4} texto="arrombada pelo fundo de madeira" top={200} size={34} cor={C.verm} />
    </Plano>
    <Plano r={[29.0, 30.2]}>
      <Vitrine r={[29.0, 30.2]} some={29.05} />
      <Carimbo r={w("taça", 1) - 0.05} texto="LEVADA" y={760} size={130} />
    </Plano>
    <Plano r={[30.2, 32.9]}>
      <Clip src="c23247" r0={30.2} from={3} dur={2.7} a={0.5} />
      <Titulo r={30.25} top={400} size={84}>A INVESTIGAÇÃO</Titulo>
    </Plano>
    <Plano r={[32.9, 36.0]}>
      <Fundo />
      <Papel top={400} h={620} rot={1}>
        <Cabec sup="INQUÉRITO · 1983" titulo="O MENTOR" />
        <Linha r={32.95} texto="— circulava pela própria CBF" size={38} />
        <Linha r={w("mentor") - 0.1} texto="— planejou o roubo" size={38} />
      </Papel>
      <Carimbo r={w("plano") - 0.1} texto="DE DENTRO" y={1000} rot={-6} size={80} />
    </Plano>
    <Plano r={[36.0, 38.0]}><Tres /></Plano>
    <Plano r={[38.0, 40.3]}>
      <Vitrine r={[38.0, 40.3]} some={37.0} />
      <Faixa r={w("nunca") - 0.1} texto="A TAÇA NUNCA APARECEU" top={200} size={60} />
    </Plano>
    <Plano r={[40.3, 44.4]}>
      <Derrete r={[40.3, 44.4]} />
      <Rotulo r={40.35} texto="VERSÃO OFICIAL" top={190} size={38} cor={C.ossoE} />
      <Titulo r={w("derretida") - 0.15} top={250} size={110}>DERRETIDA</Titulo>
      <Rotulo r={w("ouro") - 0.2} texto="e vendida como ouro" top={1150} size={40} />
    </Plano>
    <Plano r={[44.4, 46.6]}><Tres carimbo={w("negaram") - 0.1} /></Plano>
    <Plano r={[46.6, 49.3]}>
      <Foto src="j-replica" r={[46.6, 49.3]} credito="Fabio Rodrigues Pozzebom/ABr · CC BY 3.0" top={360} w={640} h={780} zoom={[1.05, 1.15]} />
      <Faixa r={w("réplica") - 0.15} texto="SÓ UMA RÉPLICA" top={190} size={74} />
    </Plano>
    <Plano r={[49.3, 51.7]}>
      <Fundo cor={C.preto} />
      <Grande r={49.4} top={700} size={84}>e não foi<br />a primeira vez.</Grande>
    </Plano>
    <Plano r={[51.7, 54.0]}>
      <Fundo cor={C.preto} />
      <Titulo r={w("1966") - 0.1} top={600} size={240}>1966</Titulo>
      <Rotulo r={w("inglaterra") - 0.05} texto="LONDRES · INGLATERRA" top={880} size={44} />
    </Plano>
    <Plano r={[54.0, 56.3]}>
      <Foto src="j-national" r={[54.0, 56.3]} credito="Ank Kumar · CC BY-SA 4.0" top={330} w={640} h={860} zoom={[1.0, 1.12]} />
      <Carimbo r={w("roubada") - 0.05} texto="ROUBADA" y={800} size={120} />
    </Plano>
    <Plano r={[56.3, 60.2]}>
      <Clip src="c15123" r0={56.3} dur={3.9} a={0.5} />
      <Titulo r={w("encontrou") - 0.1} top={330} size={80}>QUEM ACHOU?</Titulo>
      <Patas r={57.6} />
      <Faixa r={w("pickles") - 0.1} texto="O CACHORRO PICKLES" top={480} size={66} />
      <Rotulo r={58.0} texto="enrolada em jornal, num jardim" top={1200} size={28} cor={C.ossoE} />
    </Plano>
    <Plano r={[60.2, 70]} soco={false}>
      <Clip src="c9585" r0={60.2} dur={5} a={0.6} />
      <Grande r={60.3} top={640} size={86}>Onde você estava<br />naquela noite?</Grande>
      <Assinatura r={w("esse") - 0.05} />
    </Plano>
  </Reel>
);
export const _u = [AbsoluteFill, ELITE, SOMBRA];
