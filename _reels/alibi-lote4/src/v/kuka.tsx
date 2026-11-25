import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import palavras from "../../public/palavras-kuka.json";
import { C, Carimbo, Cheia, Contador, ELITE, Faixa, Foto, Fundo, Grande, MONT, Plano, Reel, Rotulo, SANS, SOMBRA, Titulo, mkCtx, useT } from "../kit";
import { Fechamento, Hora } from "../dossie";

// ÁLIBI · CASO Nº 027 — "o vídeo viral é FILME" (Kukaracha, Geórgia 1982) → o caso REAL parecido: Marianne Bachmeier (Lübeck, 1981).
// Fontes: Letterboxd/Wikipedia/Cavea (Kukaracha); Wikipedia, ZDF, Aventuras na História (Bachmeier). Sem detalhe do crime contra a criança.
// A cena do filme roda SEM narração nos primeiros 5 s (lead 5.0); o desmentido vem cedo (r 18.6) pra ninguém sair achando que é real.
type Ws = { words: { text: string; start: number; end: number }[] };
export const ctxKu = mkCtx({
  caso: "Nº 027", audio: "kuka", words: (palavras as Ws).words, lead: 5.0, fimVozRaw: 138.2, final: "alibi", proximo: "NO PERFIL", cta: ["", ""],
  chave: /^(filme|kukaracha|cinema|ficção|verdade|real|marianne|anna|grabowski|tribunal|justiça)/i,
  semLegenda: [[135.3, 300]],
  sfx: [
    // tiros: na cena do filme (antes da narração) e no trecho do filme de 1984 — CC0, freesound 385811
    { src: "tiro", r: -2.55, vol: 0.75 }, { src: "tiro", r: -2.05, vol: 0.7 }, { src: "tiro", r: -1.5, vol: 0.7 },
    { src: "tiro", r: 120.3, vol: 0.35 }, { src: "tiro", r: 120.9, vol: 0.32 }, { src: "tiro", r: 121.5, vol: 0.32 },
    { src: "whoosh", r: 15.0, vol: 0.25 }, { src: "carimbo", r: 19.6, vol: 0.5 }, { src: "tique", r: 40.6, vol: 0.35 }, { src: "tique", r: 42.2, vol: 0.35 },
    { src: "tique", r: 43.2, vol: 0.35 }, { src: "carimbo", r: 45.5, vol: 0.45 }, { src: "subida", r: 46.8, vol: 0.3 }, { src: "impacto", r: 50.8, vol: 0.45 },
    { src: "coracao", r: 58.9, vol: 0.35 }, { src: "tique", r: 80.9, vol: 0.4 }, { src: "impacto", r: 97.5, vol: 0.45 }, { src: "carimbo", r: 115.0, vol: 0.45 },
    { src: "coracao", r: 132.4, vol: 0.4 },
  ],
});

const CRK = "Reprodução · Kukaracha (Geórgia-Film, 1982)";
const CRM = "Reprodução · imprensa alemã (Marianne Bachmeier, 1981)";
const CRB = "Reprodução · Der Fall Bachmeier (filme, 1984)";

// vídeo emoldurado (o recorte do filme é quase quadrado) sobre o fundo desfocado dele mesmo
const Tela: React.FC<{ src: string; r: number; dur: number; top?: number; w?: number; h?: number; credito: string; etiqueta?: string }> = ({ src, r, dur, top = 420, w = 940, h = 810, credito, etiqueta }) => {
  const { o } = useT();
  const v = staticFile(`v/${src}.mp4`);
  return <Sequence from={Math.max(0, Math.round(o(r) * 30))} durationInFrames={Math.round(dur * 30)} layout="none">
    <AbsoluteFill><OffthreadVideo src={v} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px) brightness(0.35) grayscale(0.4)", transform: "scale(1.25)" }} /></AbsoluteFill>
    <div style={{ position: "absolute", left: (1080 - w) / 2, top, width: w, height: h, overflow: "hidden", border: "8px solid #D9D2C0", boxSizing: "border-box", boxShadow: "0 30px 90px rgba(0,0,0,0.9)", background: "#000" }}>
      <OffthreadVideo src={v} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      {etiqueta && <div style={{ position: "absolute", left: 18, top: 16, padding: "6px 14px", background: "#0A0A0B", fontFamily: SANS, fontWeight: 800, fontSize: 28, color: C.osso, display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 12, height: 12, borderRadius: 6, background: C.verm, display: "inline-block" }} />{etiqueta}</div>}
    </div>
    <div style={{ position: "absolute", right: 34, top: 1262, fontFamily: SANS, fontWeight: 600, fontSize: 17, color: "rgba(236,231,220,0.6)", textShadow: "0 1px 4px #000" }}>{credito}</div>
  </Sequence>;
};

// manchete no estilo dos perfis que espalharam o vídeo (só no gancho, antes do desmentido)
const Viral: React.FC<{ ate: number }> = ({ ate }) => {
  const { t, o } = useT();
  if (t >= o(ate)) return null;
  return <div style={{ position: "absolute", left: 60, right: 60, top: 150 }}>
    <div style={{ display: "inline-block", padding: "4px 14px", background: C.lacre, fontFamily: SANS, fontWeight: 800, fontSize: 30, color: C.osso, letterSpacing: "0.06em" }}>● VIRALIZOU</div>
    <div style={{ marginTop: 12, fontFamily: MONT, fontWeight: 800, fontSize: 60, lineHeight: 1.08, color: C.osso, textShadow: SOMBRA }}>ELA FEZ JUSTIÇA COM AS PRÓPRIAS MÃOS NO MEIO DO JULGAMENTO</div>
  </div>;
};

// filme × real lado a lado
const Lado: React.FC<{ img: string; x: number; rotulo: string; cor: string; cinza?: boolean; pos?: string }> = ({ img, x, rotulo, cor, cinza, pos = "50% 30%" }) =>
  <div style={{ position: "absolute", left: x, top: 470, width: 470, height: 680, border: "8px solid #D9D2C0", boxSizing: "border-box", overflow: "hidden", boxShadow: "0 24px 70px rgba(0,0,0,0.85)" }}>
    <Img src={staticFile(`img/${img}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, filter: `${cinza ? "grayscale(1) " : ""}contrast(1.08)` }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 0", background: cor, textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 36, color: C.osso }}>{rotulo}</div>
  </div>;
const Comparar: React.FC = () => <>
  <Fundo />
  <Lado img="kuka-mulher" x={60} rotulo="FILME · 1982" cor="#0A0A0B" pos="58% 30%" />
  <Lado img="bach-marianne" x={550} rotulo="REAL · 1981" cor={C.lacre} cinza pos="50% 25%" />
  <div style={{ position: "absolute", right: 34, top: 1262, fontFamily: SANS, fontWeight: 600, fontSize: 17, color: "rgba(236,231,220,0.6)", textShadow: "0 1px 4px #000" }}>Reprodução · Kukaracha (1982) / imprensa alemã (1981)</div>
</>;

export const Kuka: React.FC = () => (
  <Reel ctx={ctxKu}>
    {/* ── O VÍDEO VIRAL (filme), contínuo de -5 a 46,8 ── */}
    <Tela src="kuka" r={-5.0} dur={51.8} credito={CRK} />
    <Plano r={[-5.0, 15.0]} soco={false}><Viral ate={15.0} /></Plano>
    <Plano r={[15.0, 18.5]} soco={false}><Faixa r={15.1} texto="SÓ QUE TEM UM DETALHE…" top={250} size={56} /></Plano>
    <Plano r={[18.5, 22.0]} soco={false}>
      <Rotulo r={18.6} texto="ESSA CENA NUNCA ACONTECEU" top={250} size={46} cor={C.fita} />
      <Carimbo r={19.6} texto="CENA DE FILME" y={820} rot={-8} size={96} />
    </Plano>
    <Plano r={[22.0, 30.3]} soco={false}>
      <Rotulo r={22.0} texto="É DO FILME" top={180} size={42} cor={C.fita} />
      <Titulo r={22.6} top={240} size={92}>KUKARACHA</Titulo>
      <Rotulo r={24.8} texto="Geórgia (antiga URSS) · 1982" top={1150} size={42} />
      <Rotulo r={28.0} texto="baseado no livro de Nodar Dumbadze" top={1150} size={40} />
    </Plano>
    <Plano r={[30.3, 39.5]} soco={false}>
      <Rotulo r={30.4} texto="NO FILME:" top={190} size={42} cor={C.fita} />
      <Rotulo r={31.6} texto="Inga perde o homem que amava" top={260} size={46} />
      <Rotulo r={33.6} texto="um policial, morto por um criminoso" top={330} size={38} cor={C.ossoE} />
      <Faixa r={36.1} texto="NO JULGAMENTO, ELA ATIRA NELE" top={1150} size={48} />
    </Plano>
    <Plano r={[39.5, 46.8]} soco={false}>
      <Rotulo r={39.6} texto="REPARA:" top={160} size={42} cor={C.fita} />
      <Rotulo r={40.6} texto="✓ close no rosto" top={225} size={44} />
      <Rotulo r={42.2} texto="✓ trilha sonora" top={290} size={44} />
      <Rotulo r={43.2} texto="✓ lembranças em flashback" top={355} size={44} />
      <Carimbo r={44.9} texto="É TUDO CINEMA" y={830} rot={-7} size={92} />
    </Plano>

    {/* ── A PONTE: filme × real ── */}
    <Plano r={[46.8, 55.3]}>
      <Comparar />
      <Rotulo r={46.9} texto="MAS UMA CENA MUITO PARECIDA" top={230} size={46} cor={C.fita} />
      <Titulo r={50.7} top={310} size={64} cor={C.verm}>ACONTECEU DE VERDADE</Titulo>
    </Plano>

    {/* ── O CASO REAL ── */}
    <Plano r={[55.3, 64.4]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Rotulo r={55.4} texto="ALEMANHA OCIDENTAL" top={440} size={42} cor={C.fita} />
      <Titulo r={55.5} top={510} size={140}>LÜBECK</Titulo>
      <Rotulo r={56.7} texto="MAIO DE 1980" top={690} size={52} />
      <Grande r={58.9} top={820} size={66}>Anna Bachmeier, 7 anos</Grande>
      <Rotulo r={62.6} texto="não voltou pra casa" top={960} size={46} cor={C.ossoE} />
    </Plano>
    <Plano r={[64.4, 75.8]}>
      <Fundo />
      <Rotulo r={64.5} texto="ela foi encontrada sem vida" top={420} size={44} cor={C.ossoE} />
      <Rotulo r={66.7} texto="O SUSPEITO, PRESO LOGO DEPOIS:" top={540} size={42} cor={C.fita} />
      <Titulo r={69.0} top={610} size={70}>KLAUS GRABOWSKI</Titulo>
      <Rotulo r={70.4} texto="vizinho · 35 anos" top={720} size={46} />
      <Faixa r={72.8} texto="JÁ TINHA SIDO CONDENADO ANTES" top={840} size={48} />
      <Rotulo r={73.8} texto="por crimes contra crianças" top={940} size={42} />
    </Plano>
    <Plano r={[75.8, 80.8]}>
      <Foto src="bach-marianne" r={[75.8, 80.8]} credito={CRM} top={380} w={820} h={760} pos="50% 25%" zoom={[1.0, 1.06]} cinza />
      <Rotulo r={75.9} texto="A MÃE DA ANNA" top={200} size={44} cor={C.fita} />
      <Titulo r={76.9} top={260} size={84}>MARIANNE, 30</Titulo>
      <Rotulo r={79.1} texto="acompanhou o julgamento de perto" top={1170} size={40} />
    </Plano>
    <Plano r={[80.8, 86.7]}>
      <Fundo />
      <Hora r={80.9} hora="06.03.1981" top={480} sub="3º dia do julgamento" />
    </Plano>
    <Plano r={[86.7, 94.4]}>
      <Cheia src="bach-marianne" r={[86.7, 94.4]} credito={CRM} pos="50% 25%" zoom={[1.05, 1.15]} a={0.45} />
      <Rotulo r={86.8} texto="ELA ENTRA NO TRIBUNAL" top={300} size={46} cor={C.fita} />
      <Faixa r={88.6} texto="PISTOLA ESCONDIDA NA BOLSA" top={380} size={52} />
      <Rotulo r={91.4} texto="na frente do juiz e de todo mundo" top={1170} size={42} />
    </Plano>
    <Plano r={[94.4, 101.6]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Rotulo r={94.5} texto="ela atira várias vezes" top={480} size={48} />
      <Titulo r={97.4} top={580} size={76}>GRABOWSKI MORRE<br />NO TRIBUNAL</Titulo>
      <Rotulo r={100.2} texto="ela não tentou fugir" top={820} size={46} cor={C.ossoE} />
    </Plano>
    <Plano r={[101.6, 111.3]}>
      <Fundo />
      <Titulo r={102.4} top={400} size={78}>A ALEMANHA<br />SE DIVIDIU</Titulo>
      <Rotulo r={104.5} texto="pra uns: justiça de mãe" top={640} size={48} cor={C.fita} />
      <Rotulo r={107.3} texto="pra outros: ninguém faz justiça com as próprias mãos" top={730} size={38} />
    </Plano>
    <Plano r={[111.3, 118.6]}>
      <Fundo />
      <Rotulo r={111.4} texto="CONDENADA EM 1983" top={420} size={46} cor={C.fita} />
      <Contador r={114.1} ate={114.9} valor={6} sufixo=" ANOS" top={500} size={150} />
      <Rotulo r={116.4} texto="cumpriu metade" top={720} size={48} cor={C.ossoE} />
    </Plano>
    <Plano r={[118.6, 122.0]}>
      <Tela src="bach84" r={118.6} dur={3.4} top={400} w={820} h={1034} credito={CRB} etiqueta="FILME · 1984" />
      <Rotulo r={118.7} texto="A HISTÓRIA DELA VIROU FILME" top={240} size={44} cor={C.fita} />
    </Plano>
    <Plano r={[122.0, 129.9]}>
      <Foto src="bach-marianne" r={[122.0, 129.9]} credito={CRM} top={380} w={820} h={760} pos="50% 25%" zoom={[1.06, 1.0]} cinza />
      <Rotulo r={122.4} texto="MARIANNE MORREU EM 1996" top={220} size={44} cor={C.fita} />
      <Rotulo r={125.5} texto="aos 46 anos" top={290} size={42} />
      <Faixa r={127.5} texto="ENTERRADA AO LADO DA FILHA" top={1160} size={50} />
    </Plano>
    <Plano r={[129.9, 135.3]}>
      <Comparar />
      <Rotulo r={130.4} texto="A CENA É FICÇÃO" top={250} size={50} cor={C.ossoE} />
      <Titulo r={132.3} top={320} size={76} cor={C.verm}>A DOR FOI REAL</Titulo>
    </Plano>
    <Plano r={[135.3, 300]} soco={false}>
      <Fechamento r={135.35} caso="Nº 027" status="CASO REAL" pergunta="A cena viral é ficção. A história de Marianne, não." />
    </Plano>
  </Reel>
);

// capa: cena do filme + pergunta (a resposta está no vídeo)
export const CapaKuka: React.FC = () => (
  <AbsoluteFill style={{ background: C.preto }}>
    <Img src={staticFile("img/kuka-mulher.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "58% 30%", filter: "contrast(1.08)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,0.85) 80%)" }} />
    <div style={{ position: "absolute", left: 90, right: 90, top: 980, textAlign: "center" }}>
      <div style={{ display: "inline-block", padding: "6px 18px", background: C.lacre, fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.osso, letterSpacing: "0.05em" }}>● VIRALIZOU</div>
      <div style={{ marginTop: 18, fontFamily: MONT, fontWeight: 800, fontSize: 86, lineHeight: 1.04, color: C.osso, textShadow: SOMBRA }}>ESSE VÍDEO<br />É REAL?</div>
      <div style={{ marginTop: 22, fontFamily: ELITE, fontSize: 44, color: C.osso, textShadow: "0 3px 14px #000" }}>e a história real por trás dela</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1460, textAlign: "center", fontFamily: "Playfair", fontWeight: 900, fontSize: 48, letterSpacing: "0.12em", color: C.osso }}>ÁLIBI</div>
  </AbsoluteFill>
);
