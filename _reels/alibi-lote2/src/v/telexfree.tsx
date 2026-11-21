import React from "react";
import palavras from "../../public/palavras-telexfree.json";
import { Assinatura, C, COURIER, Carimbo, Cheia, Clip, Contador, ELITE, Faixa, Foto, Fundo, Grande, MONT, Papel, Cabec, Linha, Plano, Reel, Rotulo, Titulo, TituloVivo, achar, mkCtx } from "../kit";
import { Botao, Cursor, Piramide, Tela } from "../ui";

const words = (palavras as { words: { text: string; start: number; end: number }[] }).words;
const w = achar(words);
export const ctx = mkCtx({
  caso: "Nº 014", audio: "telexfree", words, lead: 0.1, fimVozRaw: 79.45, final: "alibi", proximo: "NO PERFIL",
  cta: ["Você conhece alguém que entrou?", "comenta: SIM ou NÃO ↓"],
  chave: /^(acre|milhão|telexfree|dólar|membros|parar|500|protestar|pirâmide|seis|brasil|bilhões)$/i,
  semLegenda: [[72.6, 90]],
  sfx: [
    { src: "carimbo", r: 1.2, vol: 0.45 }, ...Array.from({ length: 8 }, (_, i) => ({ src: "tique", r: 2.6 + i * 0.12, vol: 0.25 })),
    { src: "impacto", r: 4.64, vol: 0.4 }, { src: "whoosh", r: 9.9, vol: 0.25 }, { src: "tique", r: 14.9, vol: 0.5 },
    { src: "coracao", r: 22.14, vol: 0.45 }, { src: "impacto", r: 28.98, vol: 0.4 }, { src: "carimbo", r: 34.94, vol: 0.55 },
    ...[36.06, 37.6, 38.68].map((r) => ({ src: "tecla", r, vol: 0.32 })), ...Array.from({ length: 8 }, (_, i) => ({ src: "tique", r: 41.2 + i * 0.12, vol: 0.25 })),
    { src: "whoosh", r: 43.7, vol: 0.25 }, { src: "carimbo", r: 49.56, vol: 0.55 }, { src: "impacto", r: 54.72, vol: 0.45 },
    { src: "trava", r: 59.26, vol: 0.45 }, { src: "whoosh", r: 60.3, vol: 0.3 }, { src: "carimbo", r: 65.72, vol: 0.55 },
    { src: "subida", r: 68.6, vol: 0.3 }, { src: "impacto", r: 70.46, vol: 0.45 },
  ],
});

export const Telexfree: React.FC = () => (
  <Reel ctx={ctx}>
    {/* GANCHO — fachada real do TJAC entrando com impacto, juíza assinando ao fundo */}
    <Plano r={[-0.1, 2.5]} forte>
      <Foto src="t-tjac" fundo="c47687" alt={{ clip: "c47687" }} r={[-0.1, 2.5]} credito="CNJ · CC BY 2.0" top={600} w={940} h={620} zoom={[1.0, 1.12]} />
      <TituloVivo top={190} size={82} destaque="ACRE" linhas={[[["UMA", 0], ["JUÍZA", 0.22], ["DO", 0.64], ["ACRE", 0.84]], [["PAROU", 1.2], ["UM", 1.52], ["ESQUEMA", 1.66]]]} />
    </Plano>
    <Plano r={[2.5, 4.5]}><Piramide r={2.3} /></Plano>
    <Plano r={[4.5, 7.2]}>
      <Clip src="c45707" r0={4.5} dur={2.7} a={0.45} />
      <Titulo r={w("2013") - 0.1} top={380} size={220}>2013</Titulo>
      <Rotulo r={w("país") - 0.2} texto="em todo o país" top={660} size={44} />
    </Plano>
    <Plano r={[7.2, 10.0]}>
      <Clip src="c18249" r0={7.2} dur={2.8} a={0.5} />
      <Titulo r={w("economias") - 0.3} top={360} size={80}>AS ECONOMIAS</Titulo>
      <Faixa r={w("telexfree") - 0.1} texto="NA TELEXFREE" top={500} size={80} />
    </Plano>
    <Plano r={[10.0, 12.0]}>
      <Fundo cor={C.preto} />
      <Grande r={10.05} top={720} size={84}>a promessa<br />parecia simples.</Grande>
    </Plano>
    <Plano r={[12.0, 16.2]}>
      <Fundo />
      <Tela barra="painel do divulgador" top={330} h={760}>
        <div style={{ fontFamily: "Inter", fontWeight: 800, fontSize: 30, color: "#8B8F99" }}>SEU PACOTE · ATIVO</div>
        <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 56, color: "#fff", marginTop: 16 }}>Anúncio do dia</div>
        <div style={{ height: 220, margin: "26px 0", borderRadius: 16, background: "#0F1013", border: "2px dashed #34363D", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter", fontWeight: 600, fontSize: 30, color: "#8B8F99" }}>cole seu anúncio aqui</div>
        <Botao texto="POSTAR ANÚNCIO" clique={w("anúncio") + 0.4} />
      </Tela>
      <Cursor r={w("anúncio") + 0.4} x={[900, 560]} y={[1250, 960]} />
      <Rotulo r={12.05} texto="RECONSTITUIÇÃO" top={250} size={28} cor={C.ossoE} />
    </Plano>
    <Plano r={[16.2, 18.5]}>
      <Clip src="c18249" r0={16.2} from={4} dur={2.3} a={0.45} />
      <Titulo r={w("recebia") - 0.1} top={380} size={100}>+ US$</Titulo>
      <Faixa r={w("semana") - 0.2} texto="TODA SEMANA" top={560} size={80} />
    </Plano>
    <Plano r={[18.5, 22.0]}>
      <Clip src="c4603" r0={18.5} dur={3.5} a={0.45} />
      <Titulo r={w("vender") - 0.2} top={360} size={76}>“PLANOS DE TELEFONE<br />PELA INTERNET”</Titulo>
      <Rotulo r={19.4} texto="o que a empresa dizia vender (VoIP)" top={660} size={34} cor={C.ossoE} />
    </Plano>
    <Plano r={[22.0, 25.7]}>
      <Fundo />
      <Papel top={430} h={560} rot={-1}>
        <Cabec sup="DECISÃO · JUSTIÇA DO ACRE" titulo="O VERDADEIRO MOTIVO" size={54} />
        <div style={{ fontFamily: ELITE, fontSize: 42, lineHeight: 1.35 }}>“o real motivo… não era a aquisição de contas VoIP”</div>
        <div style={{ fontFamily: COURIER, fontSize: 20, opacity: 0.6, marginTop: 20 }}>trecho da decisão de out/2013, citado pelo Conjur</div>
      </Papel>
    </Plano>
    <Plano r={[25.7, 28.4]}><Piramide r={24.0} setas={25.9} contador={false} /></Plano>
    <Plano r={[28.4, 31.6]}>
      <Cheia src="t-rioacre" alt={{ clip: "c45612" }} r={[28.4, 31.6]} credito="Gabriel Brito · CC BY-SA 3.0" zoom={[1.1, 1.22]} cinza={false} a={0.45} />
      <Titulo r={w("junho") - 0.1} top={330} size={100}>JUNHO · 2013</Titulo>
      <Rotulo r={w("ministério") - 0.1} texto="AÇÃO DO MINISTÉRIO PÚBLICO DO ACRE" top={470} size={34} />
    </Plano>
    <Plano r={[31.6, 34.3]}>
      <Foto src="t-tjac" alt={{ clip: "c47686" }} r={[31.6, 34.3]} credito="CNJ · CC BY 2.0" top={430} w={940} h={620} zoom={[1.05, 1.2]} />
      <Titulo r={w("thaís") - 0.1} top={200} size={74}>JUÍZA THAÍS KHALIL</Titulo>
      <Rotulo r={w("rio") - 0.05} texto="2ª VARA CÍVEL · RIO BRANCO" top={1100} size={36} />
    </Plano>
    <Plano r={[34.3, 36.0]}>
      <Fundo cor="radial-gradient(ellipse at 50% 40%, #3A0D10 0%, #0A0A0B 75%)" />
      <Carimbo r={w("parar") - 0.02} texto="SUSPENSA" y={760} size={140} />
    </Plano>
    <Plano r={[36.0, 40.2]}>
      <Fundo />
      <Papel top={430} h={600} rot={1}>
        <Cabec sup="DECISÃO LIMINAR" titulo="FICA PROIBIDO" />
        <Linha r={w("sem") - 0.1} texto="✕ novos cadastros" size={44} />
        <Linha r={w("sem", 1) - 0.1} texto="✕ pagamentos" size={44} />
        <Linha r={w("brasil") - 0.1} texto="→ no Brasil inteiro" size={44} />
      </Papel>
    </Plano>
    <Plano r={[40.2, 43.7]}>
      <Fundo cor={C.preto} />
      <Rotulo r={w("multa") - 0.1} texto="A MULTA" top={540} size={50} cor={C.ossoE} />
      <Contador r={41.2} ate={42.3} valor={500000} prefixo="R$ " top={620} size={130} cor={C.verm} />
      <Rotulo r={w("dia", 1) - 0.1} texto="POR DIA" top={790} size={60} />
    </Plano>
    <Plano r={[43.7, 48.4]}>
      <Clip src="c45700" r0={43.7} dur={4.7} a={0.45} />
      <Titulo r={w("divulgadores") - 0.1} top={330} size={80}>DIVULGADORES DE<br />VÁRIOS ESTADOS</Titulo>
      <Faixa r={w("protestar") - 0.2} texto="FORAM ATÉ O ACRE" top={560} size={66} />
    </Plano>
    <Plano r={[48.4, 50.2]}>
      <Fundo />
      <Carimbo r={w("mantida") - 0.05} texto="DECISÃO MANTIDA" y={760} rot={-6} size={96} />
    </Plano>
    <Plano r={[50.2, 55.2]}>
      <Fundo />
      <Papel top={420} h={560} rot={-1.2}>
        <Cabec sup="PERÍCIA CONTRATADA PELA DEFESA" titulo="CONCLUSÃO" />
        <div style={{ fontFamily: ELITE, fontSize: 44, lineHeight: 1.35 }}>elementos que indicam</div>
      </Papel>
      <Faixa r={w("características") - 0.1} texto="CARACTERÍSTICAS DE PIRÂMIDE" top={1050} size={52} />
    </Plano>
    <Plano r={[55.2, 59.8]}>
      <Clip src="c47686" r0={55.2} dur={4.6} a={0.45} />
      <Rotulo r={w("estados", 1) - 0.1} texto="ESTADOS UNIDOS" top={330} size={50} cor={C.ossoE} />
      <Titulo r={w("condenado") - 0.1} top={430} size={90}>UM DOS DONOS</Titulo>
      <Carimbo r={w("seis") - 0.05} texto="6 ANOS DE PRISÃO" y={820} rot={-6} size={84} />
    </Plano>
    <Plano r={[59.8, 62.1]}>
      <Clip src="c27989" r0={59.8} dur={2.3} a={0.45} />
      <Titulo r={w("outro") - 0.1} top={380} size={96}>O OUTRO FUGIU…</Titulo>
      <Faixa r={w("brasil", 1) - 0.15} texto="PRO BRASIL" top={560} size={90} />
    </Plano>
    <Plano r={[62.1, 67.0]}>
      <Foto src="t-tjac" alt={{ clip: "c47687" }} r={[62.1, 67.0]} credito="CNJ · CC BY 2.0" top={430} w={940} h={620} zoom={[1.15, 1.3]} cinza />
      <Titulo r={w("2015") - 0.1} top={200} size={120}>2015</Titulo>
      <Carimbo r={w("pirâmide", 1) - 0.05} texto="PIRÂMIDE FINANCEIRA" y={1130} rot={-5} size={74} />
    </Plano>
    <Plano r={[67.0, 72.6]}>
      <Clip src="c18249" r0={67.0} from={7} dur={5.6} a={0.55} />
      <Rotulo r={w("dívida") - 0.1} texto="DÍVIDA COM O GOVERNO, HOJE" top={420} size={40} cor={C.ossoE} />
      <Contador r={69.6} ate={71.0} valor={5} prefixo="+R$ " sufixo=" BI" top={500} size={170} cor={C.verm} />
      <Rotulo r={71.4} texto="segundo dados do governo federal" top={700} size={30} cor={C.ossoE} />
    </Plano>
    <Plano r={[72.6, 95]} soco={false}>
      <Clip src="c45707" r0={72.6} from={5} dur={7} a={0.62} />
      <Grande r={72.72} top={640} size={86}>Onde você estava<br />naquela noite?</Grande>
      <Assinatura r={w("esse") - 0.05} />
    </Plano>
  </Reel>
);
export const _u = [Fundo];
