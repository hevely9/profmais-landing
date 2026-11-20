import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { C, COURIER, Carimbo, Clip, ELITE, Faixa, Fita, Foto, Fundo, MONT, Papel, Plano, Quadro, Rotulo, SERIF, SOMBRA, Titulo, TituloVivo, lin, mkCtx, useT, Datilo } from "./kit";
import { MapaTunel } from "./v/fortaleza";
import { Moldura } from "./v/gardner";
import { Vitrine } from "./v/jules";

// Stories animados do ÁLIBI: 8 s, sem som, em loop. Zona segura do story: y 260–1580.
export const DUR = 8;
const ctx = mkCtx({ caso: "", audio: "", words: [], lead: 0, fimVozRaw: DUR, final: "alibi", cta: ["", ""], chave: /^$/, sfx: [] });

// entra do preto e volta ao preto no fim (o loop fica sem pulo)
const Laco: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useT();
  const op = lin(t, 0, 0.35) * (1 - lin(t, DUR - 0.45, DUR - 0.05));
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};
const Selo: React.FC<{ caso: string; r?: number }> = ({ caso, r = 0.2 }) => <Rotulo r={r} texto={`ÁLIBI · CASO ${caso}`} top={270} size={34} cor={C.ossoE} />;
// chamada pulsante pro perfil
const NoPerfil: React.FC<{ r: number; texto?: string }> = ({ r, texto = "NOVO CASO NO PERFIL" }) => {
  const { t, o } = useT();
  const k = lin(t, o(r), o(r) + 0.4, Easing.out(Easing.back(1.6)));
  if (k <= 0) return null;
  const pulso = 1 + 0.035 * Math.sin((t - o(r)) * 6);
  return <div style={{ position: "absolute", left: 0, right: 0, top: 1380, display: "flex", justifyContent: "center", opacity: k, transform: `scale(${(0.8 + 0.2 * k) * pulso})` }}>
    <div style={{ padding: "18px 40px", background: C.lacre, fontFamily: MONT, fontWeight: 800, fontSize: 44, color: C.osso, boxShadow: "0 0 40px rgba(163,20,28,0.6)" }}>{texto} ↗</div>
  </div>;
};
const Marca: React.FC<{ r: number }> = ({ r }) => {
  const { t, o } = useT();
  const k = lin(t, o(r), o(r) + 0.6);
  return <div style={{ position: "absolute", left: 0, right: 0, top: 1490, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 56, letterSpacing: "0.14em", color: C.osso, opacity: k * 0.85 }}>ÁLIBI</div>;
};

// 1 — genérico: dossiê confidencial + pergunta da marca
export const StoryNovoCaso: React.FC = () => (
  <Quadro ctx={ctx}><Laco>
    <Clip src="c46139" r0={0} dur={DUR} a={0.6} />
    <Fita r={0.2} y={330} rot={-8} />
    <Fita r={0.5} y={1270} rot={6} texto="NÃO ULTRAPASSE · INVESTIGAÇÃO EM ANDAMENTO · " />
    <Papel top={520} h={640} rot={-1.5}>
      <div style={{ fontFamily: COURIER, fontSize: 28, letterSpacing: "0.16em", opacity: 0.7 }}>ARQUIVO · ÁLIBI</div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 70, marginTop: 10 }}>CASO Nº ███</div>
      <div style={{ height: 3, background: C.tinta, margin: "18px 0 30px", opacity: 0.5 }} />
      <div style={{ fontFamily: ELITE, fontSize: 54, lineHeight: 1.3 }}><Datilo r={1.0} texto="Onde você estava naquela noite?" vel={16} /></div>
    </Papel>
    <Carimbo r={3.6} texto="CONFIDENCIAL" y={1060} rot={-9} size={78} />
    <NoPerfil r={4.6} />
    <Marca r={5.0} />
  </Laco></Quadro>
);

// 2 — Nº 007/008 · Banco Central (túnel)
export const StoryBC: React.FC = () => (
  <Quadro ctx={ctx}><Laco>
    <Plano r={[0, DUR]} forte><MapaTunel cava={[0.6, 3.6]} cofre={3.4} rotulos={0.3} /></Plano>
    <Selo caso="Nº 007 · 008" />
    <TituloVivo top={1205} size={62} destaque="COFRE" linhas={[[["CAVARAM", 0.4], ["ATÉ", 0.8], ["O", 1.0], ["COFRE", 1.2]]]} />
    <Carimbo r={3.7} texto="R$ 164 MILHÕES" y={880} rot={-7} size={70} />
    <NoPerfil r={4.8} texto="PARTES 1 E 2 NO PERFIL" />
  </Laco></Quadro>
);

// 3 — Nº 009 · Alcatraz (a cabeça falsa)
export const StoryAlcatraz: React.FC = () => (
  <Quadro ctx={ctx}><Laco>
    <Plano r={[0, DUR]} forte>
      <Foto src="a-cabeca" fundo="c45612" r={[0, DUR]} credito="FBI · domínio público" top={470} w={860} h={700} zoom={[1.0, 1.2]} pos="50% 40%" />
    </Plano>
    <Selo caso="Nº 009" />
    <TituloVivo top={330} size={76} destaque="SABÃO" linhas={[[["FEITA", 0.4], ["DE", 0.6], ["SABÃO", 0.8]]]} />
    <Carimbo r={2.6} texto="FUGA" y={830} rot={-8} size={150} />
    <Rotulo r={3.6} texto="ALCATRAZ · 1962 · NUNCA ENCONTRADOS" top={1200} size={32} cor={C.verm} />
    <NoPerfil r={4.6} />
  </Laco></Quadro>
);

// 4 — Nº 010 · Jules Rimet (a vitrine vazia)
export const StoryJules: React.FC = () => (
  <Quadro ctx={ctx}><Laco>
    <Plano r={[0, DUR]} forte><Vitrine r={[0, DUR]} trinca={2.4} some={3.0} /></Plano>
    <Selo caso="Nº 010" />
    <TituloVivo top={1180} size={70} destaque="TAÇA" linhas={[[["CADÊ", 0.5], ["A", 0.8], ["TAÇA?", 1.0]]]} />
    <Carimbo r={3.4} texto="ROUBADA · 1983" y={760} rot={-7} size={84} />
    <NoPerfil r={4.6} />
  </Laco></Quadro>
);

// 5 — Nº 011 · Gardner (o quadro some da moldura)
export const StoryGardner: React.FC = () => (
  <Quadro ctx={ctx}><Laco>
    <Plano r={[0, DUR]} forte><Moldura r={[0, DUR]} some={[1.2, 2.6]} zoom={[1.0, 1.12]} /></Plano>
    <Selo caso="Nº 011" />
    <TituloVivo top={1180} size={70} destaque="VAZIA" linhas={[[["A", 2.6], ["MOLDURA", 2.8]], [["CONTINUA", 3.2], ["VAZIA", 3.6]]]} />
    <Rotulo r={0.6} texto="BOSTON · 1990 · US$ 500 MILHÕES" top={340} size={32} cor={C.verm} />
    <NoPerfil r={4.8} />
  </Laco></Quadro>
);
export const _u = [Faixa, Fundo, Titulo, SOMBRA];
