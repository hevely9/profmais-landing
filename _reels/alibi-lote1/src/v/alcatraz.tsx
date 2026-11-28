import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import palavras from "../../public/palavras-alcatraz.json";
import { C, COURIER, Carimbo, Cheia, Clip, Contador, ELITE, Faixa, Foto, Fundo, Grande, Papel, Plano, Reel, Rotulo, Titulo, achar, lin, mkCtx, useT, Cabec, Linha, Datilo, Assinatura, TituloVivo } from "../kit";

const words = (palavras as { words: { text: string; start: number; end: number }[] }).words;
const w = achar(words);
export const ctx = mkCtx({
  caso: "Nº 009", audio: "alcatraz", words, lead: 0.1, fimVozRaw: 66.9, final: "alibi",
  cta: ["Eles sobreviveram?", "comenta: VIVOS ou MORTOS ↓"], proximo: "A TAÇA QUE O BRASIL PERDEU",
  chave: /^(cabeça|alcatraz|colheres|sabão|cabelo|jangada|gelada|cabeças|vistos|afogaram|apareceram|escapei|conseguiram|álibi)$/i,
  semLegenda: [[62.0, 70]],
  sfx: [
    { src: "whoosh", r: 2.25, vol: 0.3 }, { src: "impacto", r: 4.7, vol: 0.45 }, { src: "whoosh", r: 8.75, vol: 0.25 },
    { src: "carimbo", r: 10.3, vol: 0.35 }, { src: "carimbo", r: 11.8, vol: 0.35 }, { src: "carimbo", r: 12.32, vol: 0.35 },
    { src: "whoosh", r: 17.25, vol: 0.25 }, ...[19.95, 20.25, 21.0, 22.3].map((r) => ({ src: "tecla", r, vol: 0.3 })),
    ...[0, 1, 2, 3, 4, 5].map((d) => ({ src: "tique", r: 25.0 + d * 0.18, vol: 0.3 })), { src: "whoosh", r: 28.85, vol: 0.25 },
    { src: "whoosh", r: 34.05, vol: 0.3 }, { src: "carimbo", r: 40.06, vol: 0.5 }, { src: "coracao", r: 40.8, vol: 0.5 },
    { src: "impacto", r: 49.72, vol: 0.4 }, ...[57.5, 57.8, 58.1, 58.4, 58.7].map((r) => ({ src: "tecla", r, vol: 0.3 })),
    { src: "coracao", r: 60.3, vol: 0.45 }, { src: "subida", r: 61.0, vol: 0.3 },
  ],
});

// os três fugitivos aparecendo um a um, como fichas
const Trio: React.FC = () => {
  const { t, o } = useT();
  const fichas: [string, string, number, string][] = [["a-morris", "FRANK MORRIS", w("frank"), "50% 30%"], ["a-john", "JOHN ANGLIN", w("john"), "50% 25%"], ["a-clarence", "CLARENCE ANGLIN", w("clarence"), "50% 30%"]];
  return <>
    <Fundo />
    <Titulo r={8.85} top={250} size={84}>3 PRESOS</Titulo>
    {fichas.map(([src, nome, r, pos], i) => {
      const k = lin(t, o(r) - 0.08, o(r) + 0.25);
      return <div key={i} style={{ position: "absolute", left: 40 + i * 340, top: 470 + (i % 2) * 60, width: 320, opacity: k, transform: `translateY(${(1 - k) * 40}px) rotate(${(i - 1) * 2.5}deg)` }}>
        <div style={{ width: 320, height: 420, overflow: "hidden", border: "8px solid #D9D2C0", boxShadow: "0 20px 60px rgba(0,0,0,0.9)" }}>
          <Img src={staticFile(`img/${src}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, filter: "grayscale(1) contrast(1.15)" }} />
        </div>
        <div style={{ marginTop: 14, textAlign: "center", fontFamily: COURIER, fontWeight: 700, fontSize: 27, color: C.osso, background: C.preto, padding: "6px 0" }}>{nome}</div>
      </div>;
    })}
    <div style={{ position: "absolute", right: 34, top: 1262, fontFamily: "Inter", fontWeight: 600, fontSize: 17, color: "rgba(236,231,220,0.6)" }}>Fichas · Governo dos EUA · domínio público</div>
  </>;
};

const Carta: React.FC = () => (
  <>
    <Fundo cor="#0E0E10" />
    <Papel top={330} h={820} rot={-1.2}>
      <div style={{ fontFamily: COURIER, fontSize: 24, letterSpacing: "0.14em", opacity: 0.7 }}>CARTA À POLÍCIA DE SÃO FRANCISCO · 2013</div>
      <div style={{ height: 3, background: C.tinta, margin: "14px 0 30px", opacity: 0.5 }} />
      <div style={{ fontFamily: ELITE, fontSize: 50, lineHeight: 1.35 }}>
        <Datilo r={52.7} texto="“Meu nome é John Anglin." vel={20} /><br />
        <span style={{ color: C.lacre }}><Datilo r={w("eu") - 0.05} texto="Eu escapei de Alcatraz" vel={16} /></span><br />
        <Datilo r={59.0} texto="em junho de 1962…”" vel={20} />
      </div>
      <div style={{ fontFamily: COURIER, fontSize: 21, opacity: 0.65, marginTop: 34 }}>trecho traduzido · divulgada em 2018 · FBI: análise inconclusiva</div>
    </Papel>
  </>
);

export const Alcatraz: React.FC = () => (
  <Reel ctx={ctx}>
    {/* GANCHO — texto no quadro 0, foto real e nítida */}
    <Plano r={[-0.1, 2.3]} forte>
      <Foto src="a-cabeca" fundo="c45612" r={[-0.1, 2.3]} credito="Cabeça falsa · FBI · domínio público" top={450} w={860} h={690} zoom={[1.0, 1.15]} pos="50% 40%" />
      <TituloVivo top={160} size={82} destaque="GUARDAS" linhas={[[["ESSA", 0], ["CABEÇA", 0.28]], [["ENGANOU", 0.82], ["OS", 1.22], ["GUARDAS", 1.38]]]} />
      <Rotulo r={1.0} texto="FOTO REAL · FBI · 1962" top={1170} cor={C.verm} size={34} />
    </Plano>
    <Plano r={[2.3, 4.7]}>
      <Clip src="c11201" r0={2.3} dur={2.4} a={0.35} />
      <Titulo r={2.35} top={300} size={76}>A PRISÃO MAIS<br />SEGURA DOS EUA</Titulo>
    </Plano>
    <Plano r={[4.7, 6.7]}>
      <Cheia src="a-ilha" alt={{ clip: "c11304" }} r={[4.7, 6.7]} credito="Carol M. Highsmith · Biblioteca do Congresso · domínio público" zoom={[1.15, 1.3]} />
      <Titulo r={4.75} top={360} size={140}>ALCATRAZ</Titulo>
    </Plano>
    <Plano r={[6.7, 8.8]}>
      <Foto src="a-cellhouse" alt={{ clip: "c17536" }} r={[6.7, 8.8]} credito="Daniel Ramirez · CC BY 2.0" top={420} h={760} zoom={[1.05, 1.18]} cinza />
      <Titulo r={6.75} top={250} size={96}>11 · 06 · 1962</Titulo>
    </Plano>
    <Plano r={[8.8, 13.3]}><Trio /></Plano>
    <Plano r={[13.3, 15.3]}>
      <Foto src="a-celafuga" r={[13.3, 15.3]} credito="Supercarwaar · CC BY-SA 4.0" top={330} w={760} h={880} zoom={[1.0, 1.15]} pos="50% 60%" cinza />
      <Titulo r={13.35} top={170} size={80}>MESES CAVANDO</Titulo>
    </Plano>
    <Plano r={[15.3, 17.3]}>
      <Foto src="a-duto" alt={{ clip: "c23247" }} r={[15.3, 17.3]} credito="Benlechlitner · domínio público" top={380} h={700} zoom={[1.1, 1.3]} cinza />
      <Faixa r={w("colheres") - 0.05} texto="COM COLHERES" top={1130} size={70} />
    </Plano>
    <Plano r={[17.3, 19.9]}>
      <Foto src="a-cabeca" r={[17.3, 19.9]} credito="FBI · domínio público" top={360} w={820} h={860} zoom={[1.4, 1.6]} pos="50% 35%" />
      <Titulo r={17.4} top={190} size={84}>CABEÇAS FALSAS</Titulo>
    </Plano>
    <Plano r={[19.9, 24.2]}>
      <Fundo />
      <Papel top={380} h={700} rot={-1}>
        <Cabec sup="RECEITA · ALCATRAZ, 1962" titulo="A CABEÇA FALSA" />
        <Linha r={w("sabão") - 0.1} texto="— sabão" size={44} />
        <Linha r={w("papel") - 0.1} texto="— papel higiênico" size={44} />
        <Linha r={w("cabelo") - 0.1} texto="— cabelo humano" size={44} />
        <Linha r={w("barbearia") - 0.2} texto="  (da barbearia da prisão)" size={34} />
      </Papel>
    </Plano>
    <Plano r={[24.2, 26.6]}>
      <Clip src="c45612" r0={24.2} dur={2.4} a={0.4} />
      <Contador r={25.0} ate={26.0} valor={50} prefixo="+" top={560} size={220} />
      <Rotulo r={26.0} texto="CAPAS DE CHUVA" top={820} size={48} />
    </Plano>
    <Plano r={[26.6, 28.9]}>
      <Clip src="c26419" r0={26.6} dur={2.3} a={0.4} />
      <Titulo r={26.65} top={380} size={96}>VIRARAM<br />UMA JANGADA</Titulo>
    </Plano>
    <Plano r={[28.9, 31.8]}>
      <Foto src="a-celafuga2" alt={{ img: "a-celafuga", credito: "Supercarwaar · CC BY-SA 4.0" }} r={[28.9, 31.8]} credito="Samantha Marx · CC BY 2.0" top={360} w={780} h={860} zoom={[1.0, 1.12]} pos="50% 60%" cinza />
      <Titulo r={28.95} top={180} size={84}>NAQUELA NOITE</Titulo>
    </Plano>
    <Plano r={[31.8, 34.1]}>
      <Foto src="a-corredor" alt={{ clip: "c46139" }} r={[31.8, 34.1]} credito="Tom.k · CC BY-SA 3.0" top={330} w={760} h={880} zoom={[1.0, 1.15]} cinza />
      <Rotulo r={31.85} texto="DUTOS → TELHADO" top={200} size={50} />
    </Plano>
    <Plano r={[34.1, 37.4]}>
      <Clip src="c11080" r0={34.1} dur={3.3} a={0.4} />
      <Titulo r={w("gelada") - 0.15} top={340} size={96}>ÁGUA GELADA</Titulo>
      <Rotulo r={35.9} texto="correntes fortes · 2 km até a costa" top={480} size={32} />
    </Plano>
    <Plano r={[37.4, 40.8]}>
      <Foto src="a-celas" alt={{ img: "a-cabeca", credito: "FBI · domínio público" }} r={[37.4, 40.8]} credito="Superchilum · CC BY-SA 3.0" top={330} w={760} h={860} zoom={[1.0, 1.12]} cinza />
      <Titulo r={37.45} top={180} size={76}>NA MANHÃ SEGUINTE</Titulo>
      <Carimbo r={w("cabeças", 2)} texto="FUGA" y={760} size={150} />
    </Plano>
    <Plano r={[40.8, 43.7]}>
      <Foto src="a-procurado" alt={{ img: "a-clarence", credito: "Governo dos EUA · domínio público" }} r={[40.8, 43.7]} credito="Cartaz do FBI · domínio público" top={330} w={860} h={860} zoom={[1.0, 1.1]} />
      <Titulo r={41.3} top={1100} size={70}>NUNCA MAIS VISTOS</Titulo>
    </Plano>
    <Plano r={[43.7, 47.3]}>
      <Clip src="c45612" r0={43.7} from={4} dur={3.6} a={0.45} />
      <Rotulo r={43.8} texto="CONCLUSÃO DO FBI · 1979" top={360} size={34} cor={C.ossoE} />
      <Titulo r={w("afogaram") - 0.2} top={460} size={110}>AFOGADOS</Titulo>
    </Plano>
    <Plano r={[47.3, 49.7]}>
      <Clip src="c26419" r0={47.3} from={5} dur={2.4} a={0.45} />
      <Faixa r={w("corpos") - 0.05} texto="CORPOS: NUNCA ACHADOS" top={600} size={62} />
    </Plano>
    <Plano r={[49.7, 52.6]}>
      <Fundo cor={C.preto} />
      <Titulo r={w("2018") - 0.1} top={560} size={220}>2018</Titulo>
      <Rotulo r={w("carta") - 0.1} texto="uma carta chega a público" top={860} size={40} cor={C.verm} />
    </Plano>
    <Plano r={[52.6, 56.3]}><Carta /></Plano>
    <Plano r={[56.3, 60.2]}><AbsoluteFill style={{ transform: "scale(1.22)", transformOrigin: "40% 50%" }}><Carta /></AbsoluteFill></Plano>
    <Plano r={[60.2, 62.0]}>
      <Foto src="a-john" r={[60.2, 62.0]} credito="Governo dos EUA · domínio público" top={330} w={640} h={840} zoom={[1.0, 1.1]} pos="50% 25%" cinza />
      <Titulo r={60.25} top={180} size={78}>ELES CONSEGUIRAM?</Titulo>
    </Plano>
    <Plano r={[62.0, 72]} soco={false}>
      <Clip src="c11304" r0={62.0} dur={5} a={0.55} />
      <Grande r={62.1} top={640} size={86}>Onde você estava<br />naquela noite?</Grande>
      <Surge2 />
    </Plano>
  </Reel>
);
const Surge2: React.FC = () => <Assinatura r={w("esse", 0) - 0.05} />;

