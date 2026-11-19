import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, spring, staticFile } from "remotion";
import palavras from "../public/palavras.json";
import { C, COURIER, Carimbo, Cheia, Clip, ELITE, Faixa, Foto, Fundo, Grande, MONT, Plano, Reel, Rotulo, SANS, SOMBRA, Titulo, TituloVivo, achar, lin, mkCtx, q, useT } from "./kit";

// ÁLIBI · especial — "5 coisas que você nunca deve fazer no Roblox" (teste, público jovem 13+).
const words = (palavras as { words: { text: string; start: number; end: number }[] }).words;
const w = achar(words);
export const ctx = mkCtx({
  caso: "ROBLOX", audio: "voz", words, lead: 0.1, fimVozRaw: 78.7, final: "alibi",
  cta: ["Você já caiu em algum desses?", "comenta o número ↓"],
  chave: /^(robux|grátis|senha|código|hack|ladrões|banimento|troca|pet|nome|escola|mora|adulto|denunciar|login|existe)$/i,
  sfx: [
    { src: "carimbo", r: 2.68, vol: 0.5 }, { src: "whoosh", r: 3.95, vol: 0.3 },
    ...[7.82, 21.28, 32.28, 46.38, 60.5].map((r) => ({ src: "impacto", r, vol: 0.45 })),
    { src: "tecla", r: 9.1, vol: 0.3 }, { src: "carimbo", r: 13.34, vol: 0.5 }, { src: "trava", r: 19.2, vol: 0.4 },
    ...[22.6, 22.75, 22.9, 23.05, 23.2, 23.35, 23.5, 23.65].map((r) => ({ src: "tecla", r, vol: 0.25 })),
    { src: "carimbo", r: 28.02, vol: 0.5 }, ...[33.6, 33.8, 34.0, 34.2, 34.4, 34.6].map((r) => ({ src: "tecla", r, vol: 0.25 })),
    { src: "carimbo", r: 41.34, vol: 0.5 }, { src: "carimbo", r: 44.72, vol: 0.5 }, { src: "carimbo", r: 53.94, vol: 0.5 },
    { src: "coracao", r: 57.4, vol: 0.45 }, { src: "subida", r: 58.0, vol: 0.3 },
    ...[62.46, 63.56, 64.3].map((r) => ({ src: "carimbo", r, vol: 0.35 })), { src: "trava", r: 69.36, vol: 0.45 },
    { src: "tique", r: 71.9, vol: 0.6 }, { src: "whoosh", r: 72.7, vol: 0.3 },
  ],
});

// figurinha animada com fundo transparente (GIFs enviados pelo usuário)
const Figurinha: React.FC<{ src: string; r: number; x: number; y: number; h: number; de?: "esq" | "dir" | "baixo"; flip?: boolean }> = ({ src, r, x, y, h, de = "baixo", flip }) => {
  const { f, fps, o } = useT();
  const k = spring({ frame: f - q(o(r)), fps, config: { damping: 13, stiffness: 140 } });
  const dx = de === "esq" ? -700 : de === "dir" ? 700 : 0, dy = de === "baixo" ? 500 : 0;
  return <Sequence from={q(o(r))} layout="none">
    <div style={{ position: "absolute", left: x, top: y, height: h, transform: `translate(${dx * (1 - k)}px, ${dy * (1 - k)}px) scaleX(${flip ? -1 : 1})`, filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.7))" }}>
      <OffthreadVideo src={staticFile(`v/${src}.webm`)} transparent muted style={{ height: h }} />
    </div>
  </Sequence>;
};
// cartão do número (Nº 5 … Nº 1)
const Numero: React.FC<{ r: number; n: string; titulo: string }> = ({ r, n, titulo }) => {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.05, o(r) + 0.3, Easing.out(Easing.back(1.6)));
  return <>
    <Fundo cor="radial-gradient(ellipse at 50% 45%, #2A1416 0%, #0A0A0B 70%)" />
    <div style={{ position: "absolute", left: 0, right: 0, top: 430, textAlign: "center", opacity: Math.min(1, k * 1.5), transform: `scale(${1.6 - 0.6 * k})` }}>
      <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 40, letterSpacing: "0.4em", color: C.ossoE }}>NUNCA</div>
      <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 330, lineHeight: 1, color: C.osso, textShadow: "0 0 60px rgba(163,20,28,0.6)" }}>Nº {n}</div>
    </div>
    <Faixa r={r + 0.25} texto={titulo} top={880} size={74} />
  </>;
};
// celular com print do app, dando zoom num ponto (x, y em 0–1)
const Celular: React.FC<{ src: string; r: readonly [number, number]; alvo?: [number, number]; zoom?: number; credito?: string }> = ({ src, r, alvo = [0.5, 0.5], zoom = 2.2 }) => {
  const { t, o } = useT();
  const k = lin(t, o(r[0]) + 0.3, o(r[0]) + 1.4, Easing.inOut(Easing.cubic));
  const W = 500, H = 1084, s = 1 + (zoom - 1) * k;
  const tx = (0.5 - alvo[0]) * W * (s - 1) / s, ty = (0.5 - alvo[1]) * H * (s - 1) / s;
  return <>
    <AbsoluteFill><Img src={staticFile(`img/${src}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px) brightness(0.35)", transform: "scale(1.2)" }} /></AbsoluteFill>
    <div style={{ position: "absolute", left: (1080 - W) / 2 - 14, top: 150, width: W + 28, height: H + 28, borderRadius: 64, background: "#111", boxShadow: "0 40px 100px rgba(0,0,0,0.9), inset 0 0 0 3px #333" }}>
      <div style={{ position: "absolute", left: 14, top: 14, width: W, height: H, borderRadius: 52, overflow: "hidden", background: "#fff" }}>
        <Img src={staticFile(`img/${src}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s}) translate(${tx}px, ${ty}px)` }} />
      </div>
    </div>
    {k > 0.9 && <div style={{ position: "absolute", left: 540 - 70, top: 150 + 14 + H / 2 - 70, width: 140, height: 140, borderRadius: "50%", border: `8px solid ${C.verm}`, opacity: lin(t, o(r[0]) + 1.3, o(r[0]) + 1.5), boxShadow: "0 0 30px rgba(224,53,63,0.7)" }} />}
    <div style={{ position: "absolute", right: 34, top: 1262, fontFamily: SANS, fontWeight: 600, fontSize: 17, color: "rgba(236,231,220,0.6)" }}>print do app Roblox</div>
  </>;
};
// cartão escuro tipo "tela" (navegador, chat, formulário)
const Tela: React.FC<{ children: React.ReactNode; top?: number; h?: number; barra?: string; rot?: number }> = ({ children, top = 360, h = 700, barra, rot = 0 }) => (
  <div style={{ position: "absolute", left: 90, right: 90, top, height: h, background: "#16171B", borderRadius: 28, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.85)", border: "2px solid #2C2D33", transform: `rotate(${rot}deg)` }}>
    {barra && <div style={{ height: 76, background: "#23242A", display: "flex", alignItems: "center", gap: 14, padding: "0 26px" }}>
      {["#E0353F", "#E3B23C", "#3DBE6B"].map((c) => <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />)}
      <div style={{ marginLeft: 16, flex: 1, height: 44, borderRadius: 22, background: "#0F1013", color: "#C9CCD3", fontFamily: SANS, fontWeight: 600, fontSize: 26, display: "flex", alignItems: "center", padding: "0 20px" }}>🔒 {barra}</div>
    </div>}
    <div style={{ padding: 40 }}>{children}</div>
  </div>
);
const Balao: React.FC<{ r: number; nome: string; texto: string; cor?: string }> = ({ r, nome, texto, cor = "#3B82F6" }) => {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.05, o(r) + 0.3, Easing.out(Easing.back(1.5)));
  if (k <= 0) return null;
  return <div style={{ display: "flex", gap: 18, marginBottom: 26, opacity: k, transform: `translateY(${(1 - k) * 30}px) scale(${0.9 + 0.1 * k})`, transformOrigin: "left" }}>
    <div style={{ width: 70, height: 70, borderRadius: 16, background: cor, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONT, fontWeight: 800, fontSize: 34, color: "#fff" }}>{nome[0]}</div>
    <div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 26, color: cor }}>{nome}</div>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 38, color: "#ECEDEF", lineHeight: 1.25, marginTop: 4 }}>{texto}</div>
    </div>
  </div>;
};
const Campo: React.FC<{ rotulo: string; valor: string; r?: number; vel?: number }> = ({ rotulo, valor, r, vel = 14 }) => {
  const { t, o } = useT();
  const n = r === undefined ? valor.length : Math.max(0, Math.floor((t - o(r)) * vel));
  return <div style={{ marginBottom: 30 }}>
    <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 26, color: "#8B8F99", marginBottom: 10 }}>{rotulo}</div>
    <div style={{ height: 86, borderRadius: 14, background: "#0F1013", border: "2px solid #34363D", color: "#ECEDEF", fontFamily: SANS, fontWeight: 600, fontSize: 40, display: "flex", alignItems: "center", padding: "0 26px" }}>{valor.slice(0, n)}</div>
  </div>;
};
const Botao: React.FC<{ texto: string; cor?: string; clique?: number; size?: number }> = ({ texto, cor = "#22A559", clique, size = 44 }) => {
  const { t, o } = useT();
  const press = clique !== undefined ? lin(t, o(clique) - 0.05, o(clique)) * (1 - lin(t, o(clique) + 0.1, o(clique) + 0.25)) : 0;
  return <div style={{ position: "relative", height: 110, borderRadius: 18, background: cor, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONT, fontWeight: 800, fontSize: size, color: "#fff", transform: `scale(${1 - 0.06 * press})`, boxShadow: `0 10px 0 rgba(0,0,0,0.35)` }}>{texto}</div>;
};
// cursor que vai até o botão e clica
const Cursor: React.FC<{ r: number; x: [number, number]; y: [number, number] }> = ({ r, x, y }) => {
  const { t, o } = useT();
  const k = lin(t, o(r) - 0.8, o(r) - 0.05, Easing.inOut(Easing.cubic));
  const press = lin(t, o(r) - 0.05, o(r)) * (1 - lin(t, o(r) + 0.1, o(r) + 0.25));
  return <svg width="90" height="110" viewBox="0 0 24 30" style={{ position: "absolute", left: x[0] + (x[1] - x[0]) * k, top: y[0] + (y[1] - y[0]) * k, transform: `scale(${1 - 0.15 * press})`, filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.6))" }}>
    <path d="M2 2 L2 24 L8 18 L12 28 L16 26 L12 16 L20 16 Z" fill="#fff" stroke="#000" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>;
};
const Ficha: React.FC<{ zoom?: number }> = ({ zoom = 1 }) => {
  const { t, o } = useT();
  const itens: [string, number][] = [["NOME COMPLETO", w("nome")], ["ESCOLA", w("escola")], ["ONDE MORA", w("onde")]];
  return <>
    <Fundo cor="radial-gradient(ellipse at 50% 40%, #1B1C22 0%, #0A0A0B 75%)" />
    <div style={{ position: "absolute", left: 90, right: 90, top: 330, transform: `scale(${zoom})`, transformOrigin: "50% 30%" }}>
      <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 34, letterSpacing: "0.2em", color: C.ossoE, marginBottom: 30, textAlign: "center" }}>NUNCA CONTE NO JOGO</div>
      {itens.map(([txt, r], i) => {
        const k = lin(t, o(r) - 0.1, o(r) + 0.25, Easing.out(Easing.back(1.5)));
        const x = lin(t, o(r) + 0.25, o(r) + 0.45);
        return <div key={i} style={{ position: "relative", height: 150, marginBottom: 34, borderRadius: 22, background: "#16171B", border: "2px solid #2C2D33", display: "flex", alignItems: "center", padding: "0 40px", opacity: k, transform: `translateX(${(1 - k) * -80}px)` }}>
          <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 60, color: C.osso }}>{txt}</div>
          <div style={{ position: "absolute", right: 36, width: 100, height: 100, borderRadius: 50, background: C.lacre, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONT, fontWeight: 800, fontSize: 64, color: "#fff", transform: `scale(${x})` }}>✕</div>
        </div>;
      })}
    </div>
  </>;
};

export const Roblox: React.FC = () => (
  <Reel ctx={ctx}>
    {/* GANCHO — imagem em movimento + texto entrando com a voz */}
    <Plano r={[-0.1, 2.0]} forte>
      <Cheia src="u-mundo-por-do-sol" r={[-0.1, 2.0]} credito="" zoom={[1.0, 1.12]} cinza={false} a={0.3} />
      <TituloVivo top={220} size={96} destaque="GRÁTIS" linhas={[[["UM", 0], ["LINK", 0.16], ["DE", 0.5]], [["ROBUX", 0.72], ["GRÁTIS", 1.2]]]} />
    </Plano>
    <Plano r={[2.0, 4.0]}>
      <Foto src="u-avatar-moletom" r={[2.0, 4.0]} credito="" top={380} w={760} h={760} zoom={[1.0, 1.1]} />
      <Titulo r={2.02} top={200} size={78}>ROUBA SUA CONTA</Titulo>
      <Carimbo r={w("conta")} texto="CONTA ROUBADA" y={1000} size={86} />
    </Plano>
    <Plano r={[4.0, 5.9]}>
      <Clip src="r3" r0={4.0} from={1} dur={1.9} a={0.3} />
      <Titulo r={4.05} top={300} size={240} cor={C.verm}>5</Titulo>
      <Titulo r={4.5} top={560} size={92}>COISAS</Titulo>
    </Plano>
    <Plano r={[5.9, 7.8]}>
      <Clip src="r3" r0={5.9} from={4} dur={1.9} a={0.3} />
      <Faixa r={w("nunca") - 0.1} texto="QUE VOCÊ NUNCA" top={360} size={84} />
      <Titulo r={w("fazer") - 0.2} top={500} size={84}>DEVE FAZER<br />NO ROBLOX</Titulo>
    </Plano>

    {/* Nº 5 — Robux grátis */}
    <Plano r={[7.8, 9.0]}><Numero r={7.82} n="5" titulo="ROBUX GRÁTIS" /></Plano>
    <Plano r={[9.0, 12.0]}>
      <Fundo />
      <Tela barra="robux-gratis-agora.xyz" top={330} h={760}>
        <div style={{ textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 64, color: "#3DBE6B", marginTop: 30 }}>GERADOR DE ROBUX</div>
        <div style={{ textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 130, color: "#fff", margin: "20px 0" }}>10.000</div>
        <div style={{ textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 32, color: "#8B8F99", marginBottom: 40 }}>grátis · só hoje · clique agora</div>
        <Botao texto="GERAR AGORA" clique={11.0} />
      </Tela>
      <Cursor r={11.0} x={[900, 560]} y={[1200, 900]} />
      <Rotulo r={9.0} texto="SITE FALSO · ILUSTRAÇÃO" top={250} size={28} cor={C.ossoE} />
    </Plano>
    <Plano r={[12.0, 14.5]}>
      <Fundo />
      <Tela barra="robux-gratis-agora.xyz" top={330} h={760} rot={-2}>
        <div style={{ textAlign: "center", fontFamily: MONT, fontWeight: 800, fontSize: 64, color: "#3DBE6B", marginTop: 30, opacity: 0.4 }}>GERADOR DE ROBUX</div>
      </Tela>
      <Titulo r={12.05} top={200} size={66}>GERADOR DE ROBUX</Titulo>
      <Carimbo r={w("existe") - 0.1} texto="NÃO EXISTE" y={720} size={120} />
    </Plano>
    <Plano r={[14.5, 18.4]}>
      <Celular src="u-app-inicio" r={[14.5, 18.4]} alvo={[0.8, 0.09]} zoom={2.6} />
      <Rotulo r={w("loja") - 0.1} texto="✓ LOJA OFICIAL" top={1100} size={46} cor="#3DBE6B" />
      <Rotulo r={w("cartão") - 0.1} texto="✓ CARTÃO-PRESENTE" top={1170} size={46} cor="#3DBE6B" />
    </Plano>
    <Plano r={[18.4, 21.2]}>
      <Fundo />
      <Tela barra="r0blox-login.xyz" top={330} h={760}>
        <Campo rotulo="USUÁRIO" valor="seu_nome" r={18.6} />
        <Campo rotulo="SENHA" valor="••••••••" r={19.1} vel={20} />
        <Botao texto="ENTRAR" cor="#3B82F6" clique={20.2} />
      </Tela>
      <Faixa r={w("login") - 0.1} texto="SÓ QUER SEU LOGIN" top={220} size={64} />
    </Plano>

    {/* Nº 4 — senha e código */}
    <Plano r={[21.2, 22.4]}><Numero r={21.28} n="4" titulo="SUA SENHA" /></Plano>
    <Plano r={[22.4, 24.6]}>
      <Fundo />
      <Tela top={450} h={420}>
        <Campo rotulo="SENHA" valor="••••••••••••" r={22.5} vel={6} />
      </Tela>
      <Titulo r={22.5} top={240} size={92}>NUNCA PASSE</Titulo>
      <Rotulo r={23.4} texto="🔒 ela é só sua" top={950} size={44} />
    </Plano>
    <Plano r={[24.6, 26.6]}>
      <Fundo />
      <Tela top={430} h={520}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#8B8F99" }}>CÓDIGO DE VERIFICAÇÃO</div>
        <div style={{ display: "flex", gap: 18, marginTop: 40, justifyContent: "center" }}>
          {"482917".split("").map((d, i) => <div key={i} style={{ width: 110, height: 150, borderRadius: 18, background: "#0F1013", border: "2px solid #3B82F6", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONT, fontWeight: 800, fontSize: 86, color: "#fff" }}>{d}</div>)}
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, color: "#8B8F99", marginTop: 40, textAlign: "center" }}>chegou no seu e-mail · não compartilhe</div>
      </Tela>
      <Titulo r={24.65} top={250} size={80}>NEM O CÓDIGO</Titulo>
    </Plano>
    <Plano r={[26.6, 28.6]}>
      <Fundo />
      <Tela top={380} h={640}>
        <Balao r={26.7} nome="Mod_Oficial" cor="#E3B23C" texto="Sou moderador. Me passa sua senha pra verificar sua conta." />
        <Balao r={27.6} nome="amigo123" cor="#8B5CF6" texto="Me empresta sua conta rapidinho?" />
      </Tela>
      <Carimbo r={w("moderador") - 0.05} texto="FALSO" y={900} size={130} />
    </Plano>
    <Plano r={[28.6, 32.2]}>
      <Foto src="u-noob-ceu" r={[28.6, 32.2]} credito="" top={420} w={700} h={760} zoom={[1.0, 1.12]} />
      <Titulo r={28.65} top={170} size={66}>A EQUIPE DO ROBLOX</Titulo>
      <Faixa r={w("pede") - 0.2} texto="NUNCA PEDE SUA SENHA" top={290} size={58} />
    </Plano>

    {/* Nº 3 — código estranho / hack */}
    <Plano r={[32.2, 33.4]}><Numero r={32.28} n="3" titulo="CÓDIGO ESTRANHO" /></Plano>
    <Plano r={[33.4, 36.0]}>
      <Fundo />
      <Tela barra="cole isso no navegador" top={380} h={600}>
        <div style={{ fontFamily: COURIER, fontWeight: 700, fontSize: 40, color: "#3DBE6B", lineHeight: 1.5, filter: "blur(1.5px)" }}>
          {"▓▓▓▓ ▓▓▓▓▓▓▓ ▓▓ ▓▓▓▓▓\n▓▓ ▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓ ▓▓▓\n▓▓▓▓▓▓ ▓▓▓▓ ▓▓▓▓▓▓▓".split("\n").map((l, i) => <div key={i}>{l}</div>)}
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 34, color: "#E3B23C", marginTop: 40 }}>"cola aqui que você ganha Robux"</div>
      </Tela>
      <Titulo r={33.45} top={220} size={70}>NUNCA COLE</Titulo>
    </Plano>
    <Plano r={[36.0, 37.2]}>
      <Clip src="c43527" r0={36.0} dur={1.2} a={0.4} />
      <Faixa r={w("baixe") - 0.1} texto="NEM BAIXE “HACK”" top={520} size={80} />
    </Plano>
    <Plano r={[37.2, 39.7]}>
      <Clip src="c45735" r0={37.2} dur={2.5} a={0.45} />
      <Titulo r={37.25} top={330} size={84}>O TRUQUE<br />DOS LADRÕES</Titulo>
    </Plano>
    <Plano r={[39.7, 43.2]}>
      <Foto src="u-avatar-moletom" r={[39.7, 43.2]} credito="" top={400} w={700} h={700} zoom={[1.1, 1.25]} cinza />
      <Rotulo r={39.75} texto="1 COMANDO COPIADO =" top={220} size={48} />
      <Carimbo r={w("entrega") - 0.05} texto="CONTA ROUBADA" y={760} size={90} />
    </Plano>
    <Plano r={[43.2, 46.3]}>
      <Clip src="r3" r0={43.2} from={12} dur={3.1} a={0.35} />
      <Titulo r={43.25} top={300} size={80}>E AINDA PODE</Titulo>
      <Carimbo r={w("banimento") - 0.05} texto="BANIDO" y={760} size={150} />
    </Plano>

    {/* Nº 2 — troca falsa */}
    <Plano r={[46.3, 47.8]}><Numero r={46.38} n="2" titulo="TROCA FALSA" /></Plano>
    <Plano r={[47.8, 50.0]}>
      <Foto src="u-dumpling" r={[47.8, 50.0]} credito="" top={420} w={940} h={560} zoom={[1.0, 1.12]} pos="70% 50%" />
      <Faixa r={w("confia") - 0.1} texto="“CONFIA EM MIM”" top={230} size={78} />
    </Plano>
    <Plano r={[50.0, 53.9]}>
      <Fundo />
      <Tela top={330} h={760}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: "#8B8F99", textAlign: "center", marginBottom: 30 }}>PEDIDO DE TROCA</div>
        <div style={{ display: "flex", gap: 24 }}>
          {[["VOCÊ DÁ", "🐾 PET RARO", "#3DBE6B"], ["ELE DÁ", "…", "#E0353F"]].map(([a, b, c], i) => <div key={i} style={{ flex: 1, height: 300, borderRadius: 20, background: "#0F1013", border: `3px solid ${c}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 28, color: "#8B8F99" }}>{a}</div>
            <div style={{ fontFamily: MONT, fontWeight: 800, fontSize: 52, color: "#fff", marginTop: 16 }}>{b}</div>
          </div>)}
        </div>
        <div style={{ marginTop: 40 }}><Balao r={50.1} nome="vendedor_pro" cor="#E3B23C" texto="Me dá o seu pet primeiro, que eu devolvo." /></div>
      </Tela>
    </Plano>
    <Plano r={[53.9, 55.1]}>
      <Fundo />
      <Tela top={430} h={420}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 44, color: "#8B8F99", textAlign: "center", marginTop: 60 }}>vendedor_pro saiu do jogo</div>
      </Tela>
      <Carimbo r={w("não", 1) - 0.05} texto="NÃO DEVOLVE" y={640} size={104} />
    </Plano>
    <Plano r={[55.1, 57.4]}>
      <Celular src="u-app-soccer" r={[55.1, 57.4]} alvo={[0.5, 0.68]} zoom={1.6} />
      <Rotulo r={w("janela") - 0.2} texto="✓ SÓ A JANELA DE TROCA DO JOGO" top={1190} size={36} cor="#3DBE6B" />
    </Plano>
    <Plano r={[57.4, 60.4]}>
      <Clip src="r3" r0={57.4} from={16} dur={3} a={0.5} />
      <Titulo r={w("mas") - 0.05} top={420} size={96}>MAS O Nº 1…</Titulo>
      <Grande r={58.66} top={640} size={80}>é o mais importante.</Grande>
    </Plano>

    {/* Nº 1 — dados pessoais e outro aplicativo */}
    <Plano r={[60.4, 61.4]}><Numero r={60.5} n="1" titulo="SEUS DADOS" /></Plano>
    <Plano r={[61.4, 63.5]}><Ficha /></Plano>
    <Plano r={[63.5, 66.1]}><Ficha zoom={1.08} /></Plano>
    <Plano r={[66.1, 69.3]}>
      <Celular src="u-app-inicio" r={[66.1, 69.3]} alvo={[0.7, 0.93]} zoom={2.6} />
      <Rotulo r={w("outro") - 0.2} texto="“vamos conversar em outro app?”" top={1110} size={36} cor="#E3B23C" />
      <Rotulo r={w("aplicativo") + 0.2} texto="= SINAL DE PERIGO" top={1180} size={44} cor={C.verm} />
    </Plano>
    <Plano r={[69.3, 71.0]}>
      <Fundo cor="radial-gradient(ellipse at 50% 40%, #3A0D10 0%, #0A0A0B 75%)" />
      <div style={{ position: "absolute", left: 340, top: 300, width: 400, height: 400, background: C.lacre, clipPath: "polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONT, fontWeight: 800, fontSize: 110, color: "#fff" }}>PARE</div>
      <Titulo r={w("chame") - 0.1} top={820} size={84}>CHAME UM ADULTO</Titulo>
    </Plano>
    <Plano r={[71.0, 72.7]}>
      <Fundo />
      <div style={{ position: "absolute", left: 140, right: 140, top: 560 }}><Botao texto="⚑ DENUNCIAR" cor={C.lacre} clique={w("denunciar")} size={60} /></div>
      <Cursor r={w("denunciar")} x={[880, 600]} y={[1150, 620]} />
      <Titulo r={71.05} top={330} size={70}>USE O BOTÃO</Titulo>
    </Plano>

    {/* FIM */}
    <Plano r={[72.7, 75.9]}>
      <Fundo cor="radial-gradient(ellipse at 50% 55%, #1E2A44 0%, #0A0A0B 75%)" />
      <Figurinha src="s-pin5" r={72.75} x={60} y={560} h={560} de="esq" />
      <Figurinha src="s-pin1" r={73.1} x={560} y={600} h={520} de="dir" />
      <Titulo r={w("agora") - 0.05} top={240} size={90}>AGORA VOCÊ SABE</Titulo>
      <Faixa r={w("quem") - 0.1} texto="QUEM SABE, NÃO CAI" top={400} size={66} />
    </Plano>
    <Plano r={[75.9, 90]}>
      <Cheia src="u-mundo-por-do-sol" r={[75.9, 79.5]} credito="" zoom={[1.1, 1.2]} cinza={false} a={0.4} />
      <Figurinha src="s-pin2" r={76.0} x={300} y={640} h={520} de="baixo" />
      <Titulo r={w("manda") - 0.05} top={240} size={76}>MANDA PRA QUEM<br />JOGA COM VOCÊ</Titulo>
    </Plano>
  </Reel>
);
export const _u = [ELITE, SOMBRA];
