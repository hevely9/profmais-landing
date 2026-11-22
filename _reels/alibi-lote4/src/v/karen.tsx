import React from "react";
import { AbsoluteFill, Easing, Img, staticFile } from "remotion";
import palavras from "../../public/palavras-karen.json";
import { C, COURIER, Carimbo, Clip, ELITE, Faixa, Foto, Fundo, Grande, MONT, Plano, Reel, Rotulo, SANS, SOMBRA, Titulo, TituloVivo, lin, mkCtx, useT } from "../kit";
import { Fechamento, Hora, Mural } from "../dossie";

// ÁLIBI · CASO Nº 018 — Karen Read (Canton, Massachusetts), no embalo da série da Netflix (estreia 23/11/2026).
// Fontes: cobertura de NBC Boston, WCVB, CBS Boston, Court TV, AP, CNN, People (2022–2025). Fatos conferidos; nada gráfico.
type Ws = { words: { text: string; start: number; end: number }[] };
export const ctxK = mkCtx({
  caso: "Nº 018", audio: "karen", words: (palavras as Ws).words, lead: 0.1, fimVozRaw: 182.3, final: "alibi", proximo: "NO PERFIL",
  cta: ["Karen Read matou o namorado ou foi armação?", "comenta: CULPADA ou ARMAÇÃO ↓"],
  chave: /^(karen|john|o'keefe|neve|namorada|netflix|google|lanterna|ré|bêbada|mccabe|frio|cachorro|demitido|absolvida|álibi|sobrinhos|armação)/i,
  semLegenda: [[166.0, 240]],
  sfx: [
    { src: "impacto", r: 1.44, vol: 0.45 }, { src: "coracao", r: 5.48, vol: 0.4 }, { src: "carimbo", r: 7.56, vol: 0.45 }, { src: "whoosh", r: 8.7, vol: 0.25 },
    { src: "whoosh", r: 11.86, vol: 0.3 }, { src: "carimbo", r: 17.56, vol: 0.5 }, { src: "subida", r: 19.7, vol: 0.25 },
    ...Array.from({ length: 6 }, (_, i) => ({ src: "tecla", r: 21.9 + i * 0.22, vol: 0.25 })), { src: "impacto", r: 24.18, vol: 0.45 },
    { src: "whoosh", r: 25.72, vol: 0.3 }, { src: "coracao", r: 35.66, vol: 0.4 }, { src: "whoosh", r: 42.78, vol: 0.25 }, { src: "trava", r: 51.74, vol: 0.35 },
    { src: "coracao", r: 56.68, vol: 0.45 }, { src: "carimbo", r: 60.78, vol: 0.45 }, { src: "impacto", r: 64.42, vol: 0.4 }, { src: "impacto", r: 68.42, vol: 0.4 },
    { src: "carimbo", r: 72.72, vol: 0.45 }, { src: "tique", r: 78.8, vol: 0.35 }, { src: "tique", r: 79.52, vol: 0.35 }, { src: "tique", r: 80.42, vol: 0.35 },
    { src: "tique", r: 81.92, vol: 0.35 }, { src: "carimbo", r: 84.2, vol: 0.5 }, { src: "subida", r: 85.4, vol: 0.3 }, { src: "whoosh", r: 88.4, vol: 0.25 },
    ...Array.from({ length: 10 }, (_, i) => ({ src: "tecla", r: 94.66 + i * 0.2, vol: 0.25 })), { src: "trava", r: 97.5, vol: 0.35 },
    { src: "impacto", r: 102.42, vol: 0.45 }, { src: "impacto", r: 109.42, vol: 0.45 }, { src: "carimbo", r: 114.42, vol: 0.5 }, { src: "whoosh", r: 115.86, vol: 0.3 },
    { src: "impacto", r: 120.92, vol: 0.4 }, { src: "impacto", r: 125.74, vol: 0.4 }, { src: "tecla", r: 131.3, vol: 0.3 }, { src: "tecla", r: 133.82, vol: 0.3 },
    { src: "carimbo", r: 136.02, vol: 0.55 }, { src: "whoosh", r: 137.8, vol: 0.25 }, { src: "trava", r: 141.36, vol: 0.4 }, { src: "whoosh", r: 143.1, vol: 0.25 },
    { src: "carimbo", r: 147.06, vol: 0.55 }, { src: "subida", r: 153.98, vol: 0.3 }, { src: "coracao", r: 158.78, vol: 0.45 }, { src: "coracao", r: 162.16, vol: 0.4 },
    { src: "carimbo", r: 174.8, vol: 0.55 },
  ],
});

const Ass: React.FC<{ r: number }> = ({ r }) => {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.05, o(r) + 0.6, Easing.out(Easing.cubic));
  return <div style={{ position: "absolute", left: 60, right: 60, top: 1000, textAlign: "center", opacity: k, fontFamily: ELITE, fontSize: 60, color: C.osso, textShadow: SOMBRA }}>…e esse era o álibi.</div>;
};

// barra de busca: digita a frase junto com a voz (ou fica borrada, no "loop aberto" do começo)
const Busca: React.FC<{ r: number; texto: string; dur: number; top?: number; borrado?: boolean; original?: [number, string] }> = ({ r, texto, dur, top = 560, borrado, original }) => {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.1, o(r) + 0.25, Easing.out(Easing.cubic));
  const n = borrado ? texto.length : Math.round(texto.length * lin(t, o(r), o(r) + dur, Easing.linear));
  const cursor = Math.floor(t * 2.5) % 2 === 0;
  const ok = original ? lin(t, o(original[0]) - 0.05, o(original[0]) + 0.35, Easing.out(Easing.cubic)) : 0;
  return <div style={{ position: "absolute", left: 70, right: 70, top, opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "26px 34px", background: "#F4F1EA", borderRadius: 60, boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}>
      <svg width="46" height="46" viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5" stroke="#555" strokeWidth="2.4" fill="none" /><line x1="15" y1="15" x2="21" y2="21" stroke="#555" strokeWidth="2.6" strokeLinecap="round" /></svg>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 44, color: "#1A1714", filter: borrado ? "blur(13px)" : "none", whiteSpace: "nowrap", overflow: "hidden" }}>
        {texto.slice(0, n)}{!borrado && cursor && <span style={{ color: C.lacre }}>|</span>}
      </div>
    </div>
    {original && <div style={{ marginTop: 22, textAlign: "center", opacity: ok, fontFamily: COURIER, fontWeight: 700, fontSize: 30, color: C.ossoE }}>{original[1]}</div>}
  </div>;
};

// duas falas em cartões: a mesma frase, com sentidos opostos
const Aspas: React.FC<{ itens: [number, string, string, string][] }> = ({ itens }) => {
  const { t, o } = useT();
  return <AbsoluteFill>
    <Fundo />
    {itens.map(([r, quem, fala, cor], i) => {
      const k = lin(t, o(r) - 0.3, o(r) + 0.15, Easing.out(Easing.back(1.4)));
      if (k <= 0) return null;
      return <div key={i} style={{ position: "absolute", left: 70, right: 70, top: 300 + i * 470, opacity: Math.min(1, k * 1.4), transform: `rotate(${i ? 1.5 : -1.5}deg) scale(${0.85 + 0.15 * k})`, background: "#F4F1EA", padding: "28px 36px 40px", boxShadow: "0 20px 50px rgba(0,0,0,0.75)", borderLeft: `14px solid ${cor}` }}>
        <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 30, letterSpacing: "0.12em", color: cor }}>{quem}</div>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 104, lineHeight: 1.05, color: "#111", marginTop: 12 }}>{fala}</div>
      </div>;
    })}
  </AbsoluteFill>;
};

// defesa × acusação, uma em cima da outra (o tribunal é você)
const Lados: React.FC<{ cima: [number, string, string, string?]; baixo: [number, string, string, string?] }> = ({ cima, baixo }) => {
  const { t, o } = useT();
  const bloco = ([r, rot, txt, img]: [number, string, string, string?], top: number, cor: string) => {
    const k = lin(t, o(r) - 0.1, o(r) + 0.3, Easing.out(Easing.cubic));
    return <div style={{ position: "absolute", left: 60, right: 60, top, height: 440, opacity: k, transform: `translateX(${(1 - k) * (top < 700 ? -60 : 60)}px)`, background: "rgba(10,10,11,0.85)", border: `4px solid ${cor}`, overflow: "hidden" }}>
      {img && <Img src={staticFile(`img/${img}.jpg`)} style={{ position: "absolute", right: 0, top: 0, width: 420, height: "100%", objectFit: "cover", opacity: 0.85, filter: "contrast(1.08) sepia(0.12)" }} />}
      <div style={{ position: "absolute", left: 36, top: 34, right: img ? 450 : 36 }}>
        <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 32, letterSpacing: "0.16em", color: cor }}>{rot}</div>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 64, lineHeight: 1.1, color: C.osso, marginTop: 16 }}>{txt}</div>
      </div>
    </div>;
  };
  return <AbsoluteFill>
    <Fundo />
    {bloco(cima, 250, "#9CC4E8")}
    <div style={{ position: "absolute", left: 0, right: 0, top: 712, textAlign: "center", fontFamily: ELITE, fontSize: 60, color: C.fita, opacity: lin(t, o(baixo[0]) - 0.6, o(baixo[0]) - 0.2) }}>×</div>
    {bloco(baixo, 800, C.verm)}
  </AbsoluteFill>;
};

const CRED_TV = "Reprodução · cobertura do julgamento (TV)";

export const Karen: React.FC = () => (
  <Reel ctx={ctxK}>
    {/* GANCHO — imagem real da cena (viatura na neve) */}
    <Plano r={[-0.1, 5.4]} forte>
      <Foto src="k-cena-noite" r={[-0.1, 5.4]} credito="Reprodução · WCVB · Canton (2022)" top={760} w={1040} h={420} pos="50% 60%" zoom={[1.05, 1.18]} />
      <TituloVivo top={260} size={96} destaque="NEVE" linhas={[[["UM", 0], ["POLICIAL", 0.14]], [["MORTO", 1.44], ["NA", 1.98], ["NEVE", 2.12]]]} />
      <Rotulo r={2.74} texto="na frente da casa de OUTRO policial" top={1215} size={40} cor={C.fita} />
    </Plano>
    <Plano r={[5.4, 8.7]}>
      <Foto src="k-casal" r={[5.4, 8.7]} credito="Reprodução · redes sociais (imprensa)" top={420} w={780} h={830} pos="50% 8%" zoom={[1.0, 1.1]} />
      <Rotulo r={5.48} texto="E A ACUSADA…" top={250} size={52} cor={C.fita} />
      <Faixa r={7.38} texto="ERA A NAMORADA DELE" top={1150} size={62} />
    </Plano>
    <Plano r={[8.7, 11.86]}>
      <Foto src="k-multidao" r={[8.7, 11.86]} credito="Reprodução · apoiadores em frente ao tribunal (imprensa)" top={460} w={1000} h={620} pos="50% 40%" zoom={[1.0, 1.1]} />
      <Titulo r={9.54} top={210} size={74}>DIVIDIU OS EUA<br />AO MEIO</Titulo>
    </Plano>
    <Plano r={[11.86, 15.62]}>
      <Foto src="k-netflix-karen" r={[11.86, 15.62]} credito="Reprodução · Netflix (2026)" top={480} w={1000} h={560} pos="50% 30%" zoom={[1.0, 1.1]} />
      <Rotulo r={11.9} texto="A NETFLIX LANÇA A SÉRIE DO CASO" top={260} size={42} cor={C.fita} />
      <Faixa r={14.02} texto="23 DE NOVEMBRO" top={1130} size={70} />
    </Plano>
    <Plano r={[15.62, 19.68]}>
      <Foto src="k-john-farda" r={[15.62, 19.68]} credito="Reprodução · Polícia de Boston · John O'Keefe" top={280} w={700} h={840} pos="50% 25%" cinza zoom={[1.0, 1.1]} />
      <Rotulo r={15.7} texto="ATÉ HOJE…" top={190} size={48} cor={C.fita} />
      <Carimbo r={17.56} texto="NINGUÉM CONDENADO" y={1225} rot={-4} size={76} />
    </Plano>
    <Plano r={[19.68, 25.72]}>
      <Clip src="c45661" r0={19.68} dur={6.04} a={0.6} />
      <Rotulo r={20.46} texto="NO MEIO DESSA HISTÓRIA…" top={380} size={44} cor={C.fita} />
      <Busca r={21.9} texto="quanto tempo leva pra morrer no frio" dur={1} borrado top={560} />
      <Titulo r={23.0} top={820} size={86}>UMA PESQUISA<br />NO GOOGLE</Titulo>
      <Faixa r={24.18} texto="QUE MUDA TUDO" top={1080} size={70} />
    </Plano>
    {/* a noite */}
    <Plano r={[25.72, 31.36]}>
      <Foto src="k-dashcam" r={[25.72, 31.36]} credito="Reprodução · vídeo da polícia exibido no julgamento" top={640} w={1040} h={460} pos="50% 50%" zoom={[1.05, 1.2]} />
      <Titulo r={25.72} top={240} size={86}>JANEIRO<br />DE 2022</Titulo>
      <Rotulo r={28.02} texto="CANTON · PERTO DE BOSTON" top={1150} size={40} cor={C.fita} />
      <Faixa r={30.0} texto="UMA NEVASCA" top={470} size={60} />
    </Plano>
    <Plano r={[31.36, 38.66]} soco={false}>
      <Mural camera={[[31.36, 1.12, 60, 120], [34.1, 1.0, 0, 40], [37.0, 1.05, 0, -80], [38.66, 1.08, 0, -120]]}
        itens={[
          { id: "john", r: 31.4, x: 290, y: 280, w: 500, h: 600, img: "k-john-farda", titulo: "JOHN O'KEEFE", sub: "46 anos", rot: -2, pos: "50% 25%" },
          { id: "pol", r: 34.12, x: 70, y: 1020, titulo: "POLICIAL DE BOSTON", sub: "há 16 anos na corporação", w: 430, rot: 2 },
          { id: "sob", r: 35.66, x: 580, y: 1040, titulo: "CRIAVA 2 SOBRINHOS", sub: "depois que a irmã morreu", w: 430, rot: -2 },
        ]}
        fios={[{ a: "john", b: "pol", r: 34.3 }, { a: "john", b: "sob", r: 35.8 }]} />
    </Plano>
    <Plano r={[38.66, 42.78]}>
      <Foto src="k-casal" r={[38.66, 42.78]} fundo="c4043" credito="Reprodução · redes sociais (imprensa)" top={380} w={760} h={760} pos="50% 30%" zoom={[1.05, 1.15]} />
      <Rotulo r={38.7} texto="NAQUELA NOITE, UM BAR COM…" top={230} size={40} cor={C.fita} />
      <Faixa r={41.6} texto="A NAMORADA: KAREN READ" top={1170} size={54} />
    </Plano>
    <Plano r={[42.78, 47.4]}>
      <Foto src="k-casa" r={[42.78, 47.4]} credito="Reprodução · a casa em Canton (imprensa)" top={560} w={1000} h={560} pos="50% 50%" zoom={[1.0, 1.1]} />
      <Rotulo r={42.84} texto="DEPOIS DO BAR, UMA FESTA" top={260} size={44} cor={C.fita} />
      <Titulo r={45.56} top={340} size={66}>NA CASA DE<br />OUTRO POLICIAL</Titulo>
    </Plano>
    <Plano r={[47.4, 53.34]}>
      <Clip src="c42039" r0={47.4} dur={5.94} a={0.55} />
      <Rotulo r={47.44} texto="A VERSÃO DE KAREN:" top={380} size={44} cor={C.fita} />
      <Grande r={48.1} top={470} size={70}>“deixei ele na porta<br />e fui embora”</Grande>
      <Rotulo r={50.88} texto="📞 ligações para John…" top={860} size={46} />
      <Faixa r={51.74} texto="NUNCA MAIS ATENDIDAS" top={960} size={62} />
    </Plano>
    <Plano r={[53.34, 61.54]}>
      <Foto src="k-cena-noite" r={[53.34, 61.54]} credito="Reprodução · WCVB · Canton (2022)" top={640} w={1040} h={440} pos="50% 60%" cinza zoom={[1.15, 1.3]} />
      <Titulo r={53.34} top={220} size={86}>DE MANHÃ</Titulo>
      <Rotulo r={54.48} texto="KAREN VOLTA COM DUAS AMIGAS" top={370} size={42} cor={C.fita} />
      <Rotulo r={56.68} texto="John caído na neve, no gramado" top={480} size={44} />
      <Carimbo r={60.6} texto="MORTO" y={1210} rot={-6} size={100} />
    </Plano>
    {/* a frase */}
    <Plano r={[61.54, 69.92]} soco={false}>
      <Aspas itens={[[64.42, "PARAMÉDICA: KAREN REPETIA", "“EU BATI NELE.”", C.lacre], [68.42, "DEFESA: ELA PERGUNTAVA", "“EU BATI NELE?”", "#2F6FA8"]]} />
      <Rotulo r={61.6} texto="UMA FRASE. DOIS SENTIDOS." top={190} size={42} cor={C.fita} />
    </Plano>
    <Plano r={[69.92, 73.44]}>
      <Foto src="k-lanterna-tribunal" r={[69.92, 73.44]} credito={CRED_TV} top={400} w={900} h={680} pos="50% 40%" zoom={[1.0, 1.1]} />
      <Rotulo r={69.96} texto="O CARRO DE KAREN:" top={170} size={44} cor={C.fita} />
      <Faixa r={71.84} texto="LANTERNA TRASEIRA" top={1110} size={60} />
      <Carimbo r={72.72} texto="QUEBRADA" y={300} rot={-6} size={84} />
    </Plano>
    <Plano r={[73.44, 76.56]}>
      <Foto src="k-lanterna" r={[73.44, 76.56]} credito="Reprodução · prova exibida no julgamento" top={340} w={860} h={780} pos="50% 50%" zoom={[1.0, 1.12]} />
      <Faixa r={74.7} texto="PEDAÇOS ACHADOS NO LOCAL" top={1160} size={54} />
    </Plano>
    <Plano r={[76.56, 83.0]}>
      <Clip src="c27717" r0={76.56} dur={6.44} a={0.6} />
      <Titulo r={76.6} top={330} size={72}>PRA ACUSAÇÃO,<br />É SIMPLES:</Titulo>
      <Rotulo r={78.8} texto="✗ deu ré" top={600} size={60} />
      <Rotulo r={79.52} texto="✗ bêbada" top={690} size={60} />
      <Rotulo r={80.42} texto="✗ atingiu o namorado" top={780} size={60} />
      <Rotulo r={81.92} texto="✗ foi embora" top={870} size={60} />
    </Plano>
    <Plano r={[83.0, 85.34]}>
      <Foto src="k-karen-tribunal" r={[83.0, 85.34]} credito={CRED_TV} top={460} w={1040} h={560} pos="35% 40%" zoom={[1.0, 1.08]} />
      <Carimbo r={84.1} texto="ACUSADA DE ASSASSINATO" y={1150} rot={-5} size={70} />
    </Plano>
    <Plano r={[85.34, 88.4]}>
      <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
      <Rotulo r={85.4} texto="SÓ QUE AÍ…" top={560} size={50} cor={C.ossoE} />
      <Titulo r={86.6} top={660} size={110} cor={C.verm}>A HISTÓRIA<br />VIRA</Titulo>
    </Plano>
    {/* a pesquisa */}
    <Plano r={[88.4, 94.62]}>
      <Foto src="k-mccabe" r={[88.4, 94.62]} credito={CRED_TV} top={420} w={1000} h={600} pos="62% 40%" zoom={[1.0, 1.12]} />
      <Rotulo r={88.44} texto="UMA DAS AMIGAS DAQUELA MANHÃ" top={230} size={40} cor={C.fita} />
      <Faixa r={91.46} texto="JENNIFER McCABE" top={1110} size={66} />
    </Plano>
    <Plano r={[94.62, 99.5]}>
      <Clip src="c45661" r0={94.62} from={2} dur={4.88} a={0.65} />
      <Rotulo r={94.66} texto="ELA PESQUISOU NO GOOGLE:" top={400} size={42} cor={C.fita} />
      <Busca r={94.62} texto="quanto tempo leva pra morrer no frio" dur={2.1} top={500} original={[95.6, "(no original: “how long to die in cold”)"]} />
      <Faixa r={97.5} texto="O PROBLEMA É O HORÁRIO" top={880} size={60} />
    </Plano>
    <Plano r={[99.5, 106.94]}>
      <Foto src="k-pesquisa" r={[99.5, 106.94]} credito="Reprodução · relatório pericial exibido no julgamento" top={720} w={900} h={520} pos="70% 50%" zoom={[1.0, 1.12]} />
      <Rotulo r={99.54} texto="PERITO DA DEFESA:" top={200} size={44} cor="#9CC4E8" />
      <Hora r={102.42} hora="02:27" top={270} sub="HORAS ANTES DE ACHAREM O CORPO" />
    </Plano>
    <Plano r={[106.94, 115.86]}>
      <Clip src="c45661" r0={106.94} from={4} dur={8.92} a={0.65} />
      <Rotulo r={106.98} texto="PERITOS DA ACUSAÇÃO:" top={200} size={44} cor={C.verm} />
      <Hora r={109.42} hora="06:24" top={270} sub="JÁ NA CENA" />
      <Grande r={111.92} top={680} size={60}>“a pedido da<br />própria Karen”</Grande>
      <Carimbo r={114.42} texto="KAREN NEGA" y={1080} rot={-6} size={96} />
    </Plano>
    {/* o braço */}
    <Plano r={[115.86, 119.56]}>
      <Clip src="c46748" r0={115.86} dur={3.7} a={0.6} />
      <Titulo r={115.9} top={420} size={78}>E NÃO PARA<br />POR AÍ</Titulo>
      <Faixa r={118.14} texto="MARCAS NO BRAÇO DE JOHN" top={760} size={56} />
    </Plano>
    <Plano r={[119.56, 127.06]} soco={false}>
      <Lados cima={[119.8, "DEFESA", "mordida de cachorro: o pastor alemão da casa"]} baixo={[124.38, "ACUSAÇÃO", "a lanterna do carro", "k-lanterna"]} />
      <Rotulo r={119.6} texto="O TRIBUNAL É VOCÊ" top={170} size={40} cor={C.fita} />
    </Plano>
    {/* o investigador */}
    <Plano r={[127.06, 132.2]}>
      <Foto src="k-proctor" r={[127.06, 132.2]} credito="Reprodução · Michael Proctor no julgamento (imprensa)" top={380} w={820} h={700} pos="45% 35%" zoom={[1.0, 1.1]} />
      <Rotulo r={127.1} texto="O INVESTIGADOR DO CASO" top={230} size={44} cor={C.fita} />
      <Grande r={128.64} top={1110} size={52}>mandava mensagens chamando<br />Karen de “louca”</Grande>
    </Plano>
    <Plano r={[132.2, 137.8]}>
      <Foto src="k-proctor" r={[132.2, 137.8]} credito="Reprodução · Michael Proctor no julgamento (imprensa)" top={560} w={720} h={560} pos="45% 35%" cinza zoom={[1.1, 1.22]} />
      <Rotulo r={132.28} texto="PRA IRMÃ, ELE ESCREVEU QUE…" top={210} size={40} cor={C.fita} />
      <Grande r={133.12} top={290} size={52}>esperava que ela tirasse<br />a própria vida</Grande>
      <Carimbo r={135.9} texto="DEMITIDO" y={1180} rot={-8} size={104} />
    </Plano>
    {/* julgamentos */}
    <Plano r={[137.8, 143.1]}>
      <Clip src="c9530" r0={137.8} dur={5.3} a={0.55} />
      <Rotulo r={137.84} texto="1º JULGAMENTO" top={380} size={50} cor={C.fita} />
      <Titulo r={139.0} top={460} size={130}>2024</Titulo>
      <Carimbo r={141.3} texto="JÚRI SEM ACORDO" y={900} rot={-6} size={84} />
    </Plano>
    <Plano r={[143.1, 146.5]}>
      <Foto src="k-veredito" r={[143.1, 146.5]} credito={CRED_TV} top={600} w={1040} h={420} pos="40% 40%" zoom={[1.0, 1.08]} />
      <Rotulo r={143.14} texto="2º JULGAMENTO" top={270} size={50} cor={C.fita} />
      <Titulo r={144.48} top={350} size={84}>JUNHO DE 2025</Titulo>
    </Plano>
    <Plano r={[146.5, 153.98]}>
      <Foto src="k-abraco" r={[146.5, 153.98]} credito={CRED_TV} top={380} w={840} h={640} pos="40% 35%" zoom={[1.0, 1.12]} />
      <Carimbo r={147.0} texto="ABSOLVIDA" y={270} rot={-6} size={96} />
      <Rotulo r={149.3} texto="condenada só por dirigir bêbada" top={1060} size={40} />
      <Rotulo r={151.72} texto="1 ano de liberdade condicional" top={1130} size={36} cor={C.fita} />
    </Plano>
    <Plano r={[153.98, 157.66]}>
      <Foto src="k-multidao" r={[153.98, 157.66]} credito="Reprodução · em frente ao tribunal de Dedham (imprensa)" top={420} w={1000} h={660} pos="55% 40%" zoom={[1.05, 1.15]} />
      <Faixa r={155.88} texto="A MULTIDÃO COMEMOROU" top={1130} size={60} />
    </Plano>
    {/* o lado da vítima */}
    <Plano r={[157.66, 161.8]}>
      <Foto src="k-john-farda" r={[157.66, 161.8]} credito="Reprodução · Polícia de Boston · John O'Keefe" top={300} w={680} h={820} pos="50% 25%" cinza zoom={[1.05, 1.15]} />
      <Rotulo r={157.7} texto="ATÉ HOJE, NINGUÉM FOI CONDENADO" top={190} size={38} cor={C.fita} />
      <Faixa r={160.74} texto="PELA MORTE DE JOHN" top={1150} size={58} />
    </Plano>
    <Plano r={[161.8, 166.12]}>
      <Clip src="c6925" r0={161.8} dur={4.32} a={0.45} />
      <Grande r={161.86} top={600} size={66}>e os sobrinhos que<br />ele criava perderam<br />mais uma pessoa.</Grande>
    </Plano>
    {/* bordão */}
    <Plano r={[166.12, 174.64]}>
      <Clip src="c27717" r0={166.12} from={2} dur={8.52} a={0.65} />
      <Grande r={166.12} top={480} size={84}>Onde você estava<br />naquela noite?</Grande>
      <Rotulo r={168.18} texto="KAREN: “indo embora”" top={780} size={46} cor="#9CC4E8" />
      <Rotulo r={170.28} texto="ACUSAÇÃO: “dando ré”" top={860} size={46} cor={C.verm} />
      <Ass r={172.78} />
    </Plano>
    <Plano r={[174.64, 240]} soco={false}>
      <Fechamento r={174.7} caso="Nº 018" status="SEM CULPADO" pergunta="Karen Read matou o namorado… ou foi armação?" />
    </Plano>
  </Reel>
);
