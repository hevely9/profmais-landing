import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import palavras from "../../public/palavras-gardner.json";
import { C, COURIER, Cabec, Carimbo, Cheia, Clip, Contador, ELITE, Faixa, Foto, Fundo, Grande, Papel, Plano, Reel, Rotulo, SOMBRA, Titulo, achar, lin, mkCtx, useT, Datilo, Assinatura } from "../kit";

const words = (palavras as { words: { text: string; start: number; end: number }[] }).words;
const w = achar(words);
export const ctx = mkCtx({
  caso: "Nº 011", audio: "gardner", words, lead: 0.1, fimVozRaw: 62.6, final: "alibi",
  cta: ["Onde estão os quadros?", "comenta seu palpite ↓"],
  chave: /^(vazias|policiais|amarrados|81|13|vermeer|rembrandt|500|preso|apareceu|recompensa|esperando|álibi)$/i,
  semLegenda: [[57.9, 70]],
  sfx: [
    { src: "subida", r: 0.2, vol: 0.25 }, { src: "impacto", r: 1.2, vol: 0.4 }, { src: "whoosh", r: 2.95, vol: 0.25 },
    { src: "tique", r: 7.94, vol: 0.35 }, { src: "whoosh", r: 10.05, vol: 0.25 }, { src: "trava", r: 12.9, vol: 0.35 },
    ...[16.0, 16.3, 16.6, 16.9].map((r) => ({ src: "tecla", r, vol: 0.28 })), { src: "trava", r: 19.4, vol: 0.4 },
    { src: "coracao", r: 22.5, vol: 0.45 }, ...[0, 1, 2, 3, 4, 5, 6].map((d) => ({ src: "tique", r: 24.3 + d * 0.22, vol: 0.28 })),
    { src: "impacto", r: 28.74, vol: 0.4 }, { src: "whoosh", r: 29.85, vol: 0.25 }, { src: "whoosh", r: 31.45, vol: 0.25 },
    ...[0, 1, 2, 3, 4, 5].map((d) => ({ src: "tique", r: 35.9 + d * 0.2, vol: 0.28 })), { src: "impacto", r: 38.82, vol: 0.45 },
    { src: "carimbo", r: 41.72, vol: 0.5 }, { src: "carimbo", r: 43.12, vol: 0.5 }, { src: "coracao", r: 53.9, vol: 0.45 }, { src: "subida", r: 56.0, vol: 0.25 },
  ],
});

// moldura dourada; o quadro some e fica só a parede (reconstituição)
export const Moldura: React.FC<{ r: readonly [number, number]; some?: [number, number]; vazia?: boolean; zoom?: [number, number] }> = ({ r, some, vazia, zoom = [1.0, 1.06] }) => {
  const { t, o } = useT();
  const k = lin(t, o(r[0]), o(r[1]));
  const sumiu = vazia ? 1 : some ? lin(t, o(some[0]), o(some[1])) : 0;
  return <>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #1F2A22 0%, #0B0F0C 80%)" }} />
    <AbsoluteFill style={{ opacity: 0.18, backgroundImage: "radial-gradient(circle at 25% 25%, #3C4A3F 2px, transparent 3px), radial-gradient(circle at 75% 75%, #3C4A3F 2px, transparent 3px)", backgroundSize: "46px 46px" }} />
    <div style={{ position: "absolute", left: 170, top: 380, width: 740, height: 820, transform: `scale(${zoom[0] + (zoom[1] - zoom[0]) * k})` }}>
      <div style={{ position: "absolute", inset: 0, border: "46px solid transparent", borderImage: "linear-gradient(135deg, #8A6A2B, #E7C873 25%, #7A5A1E 50%, #D9B65E 75%, #6B4E18) 1", boxShadow: "0 40px 90px rgba(0,0,0,0.9), inset 0 0 40px rgba(0,0,0,0.85)" }} />
      <div style={{ position: "absolute", inset: 46, background: "#151C17", boxShadow: "inset 0 0 60px rgba(0,0,0,0.9)" }}>
        <Img src={staticFile("img/g-concerto.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 1 - sumiu, filter: `contrast(1.05) brightness(${1 - sumiu * 0.5})` }} />
      </div>
    </div>
  </>;
};

export const Gardner: React.FC = () => (
  <Reel ctx={ctx}>
    {/* GANCHO — texto no quadro 0; o quadro desaparece da moldura */}
    <Plano r={[-0.1, 3.0]} soco={false}>
      <Moldura r={[-0.1, 3.0]} some={[0.35, 1.3]} />
      <Titulo r={-1} top={150} size={84}>ESSAS MOLDURAS<br />ESTÃO VAZIAS</Titulo>
      <Rotulo r={1.3} texto="reconstituição · O Concerto, de Vermeer" top={1240} size={24} cor={C.ossoE} />
      <Faixa r={w("1990") - 0.1} texto="DESDE 1990" top={1110} size={60} />
    </Plano>
    <Plano r={[3.0, 6.9]}>
      <Cheia src="g-patio" alt={{ clip: "c49294" }} r={[3.0, 6.9]} credito="Sintakso · CC BY-SA 4.0" zoom={[1.05, 1.2]} cinza={false} a={0.45} />
      <Titulo r={3.05} top={320} size={80}>E CONTINUAM<br />NA PAREDE</Titulo>
      <Rotulo r={4.2} texto="MUSEU ISABELLA STEWART GARDNER" top={560} size={30} />
    </Plano>
    <Plano r={[6.9, 10.1]}>
      <Foto src="g-fachada" alt={{ clip: "c31379" }} r={[6.9, 10.1]} credito="King of Hearts · CC BY-SA 4.0" top={430} h={720} zoom={[1.1, 1.25]} cinza />
      <Titulo r={w("18") - 0.1} top={190} size={96}>18 · 03 · 1990</Titulo>
      <Rotulo r={w("boston") - 0.1} texto="01H24 · BOSTON" top={320} size={40} cor={C.verm} />
    </Plano>
    <Plano r={[10.1, 12.4]}>
      <Clip src="c17376" r0={10.1} dur={2.3} a={0.45} />
      <Titulo r={10.15} top={360} size={86}>VESTIDOS DE<br />POLICIAIS</Titulo>
    </Plano>
    <Plano r={[12.4, 15.9]}>
      <Clip src="c23247" r0={12.4} dur={3.5} a={0.45} />
      <Titulo r={w("campainha") - 0.15} top={330} size={80}>TOCAM A<br />CAMPAINHA</Titulo>
      <Rotulo r={13.5} texto="porta lateral do museu" top={540} size={32} />
    </Plano>
    <Plano r={[15.9, 18.0]}>
      <Fundo />
      <Papel top={480} h={460} rot={-1.2}>
        <div style={{ fontFamily: COURIER, fontSize: 24, letterSpacing: "0.14em", opacity: 0.7 }}>O QUE DISSERAM NO INTERFONE</div>
        <div style={{ fontFamily: ELITE, fontSize: 54, lineHeight: 1.3, marginTop: 30 }}><Datilo r={15.95} texto="“Polícia. Recebemos um chamado.”" vel={24} /></div>
      </Papel>
    </Plano>
    <Plano r={[18.0, 20.1]}>
      <Clip src="c23253" r0={18.0} dur={2.1} a={0.45} />
      <Faixa r={18.05} texto="O VIGIA ABRE A PORTA" top={520} size={64} />
    </Plano>
    <Plano r={[20.1, 23.8]}>
      <Clip src="c46139" r0={20.1} dur={3.7} a={0.5} />
      <Titulo r={20.15} top={330} size={96}>EM MINUTOS</Titulo>
      <Rotulo r={w("amarrados") - 0.15} texto="2 SEGURANÇAS AMARRADOS" top={480} size={42} />
      <Rotulo r={w("porão") - 0.1} texto="no porão" top={545} size={36} cor={C.verm} />
    </Plano>
    <Plano r={[23.8, 27.9]}>
      <Clip src="c20841" r0={23.8} dur={4.1} a={0.55} />
      <Contador r={24.3} ate={25.6} valor={81} top={420} size={260} />
      <Rotulo r={24.9} texto="MINUTOS LIVRES NO MUSEU" top={700} size={40} />
    </Plano>
    <Plano r={[27.9, 29.9]}>
      <Foto src="g-poster" alt={{ clip: "c20842" }} r={[27.9, 29.9]} credito="Cartaz do FBI · domínio público" top={330} w={860} h={880} zoom={[1.0, 1.08]} pos="50% 30%" />
      <Faixa r={w("13") - 0.1} texto="13 OBRAS" top={170} size={84} />
    </Plano>
    <Plano r={[29.9, 31.5]}>
      <Foto src="g-concerto" r={[29.9, 31.5]} credito="Vermeer · domínio público" top={300} w={820} h={900} zoom={[1.0, 1.08]} />
      <Rotulo r={29.95} texto="VERMEER · O CONCERTO" top={200} size={40} />
    </Plano>
    <Plano r={[31.5, 34.7]}>
      <Foto src="g-tempestade" r={[31.5, 34.7]} credito="Rembrandt · domínio público" top={300} w={820} h={900} zoom={[1.0, 1.15]} pos="50% 30%" />
      <Rotulo r={31.55} texto="REMBRANDT" top={170} size={48} />
      <Rotulo r={w("mar") - 0.1} texto="o único mar que ele pintou" top={235} size={32} cor={C.verm} />
    </Plano>
    <Plano r={[34.7, 38.7]}>
      <Clip src="c18305" r0={34.7} dur={4} a={0.55} />
      <Rotulo r={34.75} texto="VALOR ESTIMADO HOJE" top={400} size={34} cor={C.ossoE} />
      <Contador r={35.9} ate={37.6} valor={500} prefixo="US$ " sufixo=" mi" top={480} size={150} />
    </Plano>
    <Plano r={[38.7, 41.6]}>
      <Foto src="g-tortoni" alt={{ img: "g-tempestade", credito: "Rembrandt · domínio público" }} r={[38.7, 41.6]} credito="Manet · Chez Tortoni · domínio público" top={420} w={900} h={680} zoom={[1.0, 1.1]} />
      <Titulo r={38.75} top={180} size={66}>O MAIOR ROUBO<br />DE ARTE DA HISTÓRIA</Titulo>
      <Rotulo r={39.0} texto="também levado naquela noite" top={1140} size={28} cor={C.ossoE} />
    </Plano>
    <Plano r={[41.6, 43.0]}>
      <Fundo cor={C.preto} />
      <Carimbo r={w("ninguém") + 0.05} texto="NINGUÉM PRESO" y={760} size={96} />
    </Plano>
    <Plano r={[43.0, 44.7]}>
      <Moldura r={[43.0, 44.7]} vazia />
      <Carimbo r={w("nenhuma")} texto="NENHUMA OBRA" y={800} rot={6} size={88} />
    </Plano>
    <Plano r={[44.7, 48.3]}>
      <Fundo />
      <Papel top={430} h={560} rot={1.2}>
        <Cabec sup="MUSEU ISABELLA STEWART GARDNER" titulo="RECOMPENSA" />
        <div style={{ fontFamily: "Mont", fontWeight: 800, fontSize: 92, lineHeight: 1 }}>US$ 10 MILHÕES</div>
        <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 30, marginTop: 24 }}>por informações que levem às obras</div>
      </Papel>
    </Plano>
    <Plano r={[48.3, 50.7]}>
      <Foto src="g-isabella" alt={{}} r={[48.3, 50.7]} credito="Anders Zorn, 1894 · domínio público" top={330} w={700} h={880} zoom={[1.0, 1.1]} pos="50% 20%" />
      <Rotulo r={w("fundadora") - 0.2} texto="ISABELLA STEWART GARDNER" top={190} size={38} />
    </Plano>
    <Plano r={[50.7, 53.1]}>
      <Cheia src="g-patio2" alt={{ clip: "c20841" }} r={[50.7, 53.1]} credito="Sintakso · CC BY-SA 4.0" zoom={[1.05, 1.18]} cinza={false} a={0.45} />
      <Titulo r={w("nada") - 0.1} top={340} size={80}>NADA PODE<br />MUDAR DE LUGAR</Titulo>
      <Rotulo r={51.5} texto="regra do testamento da fundadora" top={560} size={30} />
    </Plano>
    <Plano r={[53.1, 57.9]}>
      <Moldura r={[53.1, 57.9]} vazia zoom={[1.0, 1.18]} />
      <Grande r={w("esperando") - 0.1} top={1060} size={84}>esperando.</Grande>
    </Plano>
    <Plano r={[57.9, 70]} soco={false}>
      <Clip src="c49294" r0={57.9} dur={5} a={0.6} />
      <Grande r={58.0} top={640} size={86}>Onde você estava<br />naquela noite?</Grande>
      <Assinatura r={w("esse") - 0.05} />
    </Plano>
  </Reel>
);
