// ARQUIVO ÁLIBI — Central de Investigação (site estático, sem backend).
// Dois modos: NA TELA (tudo no celular) e NO PAPEL (folhas impressas + celular só para conferir).
// Regra de ouro: uma ação principal por tela, linguagem simples, botão voltar do celular sempre funciona.
import { sha, derivar, chaveBruta, decifrar, decifrarBytes, normCodigo, canonCampos, canonResposta } from "./cripto.js";
import { renderProva } from "./render.js";

const $app = document.getElementById("app");
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const INTERROGATORIO_ATIVO = false; // fase 2 do produto: "Sala de Interrogatório" (desligada)
const EM_IFRAME = (() => { try { return window.self !== window.top; } catch { return true; } })();
const MSG_CODIGO = "Esse código não está certo. Use o botão “Começar a jogar” na sua área de membros da Kiwify.";

// ── progresso no navegador (falha em silêncio se o navegador bloquear) ──
const salvar = (slug, st) => { try { localStorage.setItem(`arquivo-alibi:${slug}`, JSON.stringify(st)); } catch {} };
const carregar = (slug) => { try { return JSON.parse(localStorage.getItem(`arquivo-alibi:${slug}`) || "null"); } catch { return null; } };
const guarda = () => salvar(S.slug, S.est);

let VITRINE = null;
const S = { slug: null, codigo: null, caso: null, chaveCaso: null, pacote: null, est: null, conteudos: {}, chaves: {}, filtro: "todas", busca: "", realce: null, tela: null };
const urls = new Map();

async function vitrine() { if (!VITRINE) VITRINE = await (await fetch("casos.json")).json(); return VITRINE; }
const casoPorCodigo = (v, cod) => { const n = normCodigo(cod), pre = n.slice(0, -8); return v.casos.find((c) => c.disponivel && normCodigo(c.prefixo) === pre) || null; };

// ── ícones simples (SVG em linha) ──
const IC = {
  docs: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h9l5 5v15H6z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14 2v6h6M9 13h8M9 17h8" stroke="currentColor" stroke-width="2"/></svg>',
  alvo: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>',
  lapis: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l4-1 11-11-3-3L5 16z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  tela: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 18h4" stroke="currentColor" stroke-width="2"/></svg>',
  papel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9V2h12v7M6 18H4v-8h16v8h-2M7 14h10v8H7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  som: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8a5 5 0 010 8M18.5 5a9 9 0 010 14" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
};

// ── navegação: cada tela é um endereço (#/caso/<slug>/<tela>), então o "voltar" do celular funciona ──
const ir = (tela) => { const h = `#/caso/${S.slug}/${tela}`; if (location.hash === h) desenhaTela(tela); else location.hash = h; };
function cabecalhoCaso(extra = "") {
  const at = atual(), total = S.caso.objetivos.length;
  const situ = at ? `Objetivo ${at.n} de ${total}` : "Caso encerrado";
  const outro = S.est.modo === "papel" ? "tela" : "papel";
  return `<div class="caso-cab"><div class="caso-linha"><small>CASO Nº ${esc(S.caso.numero)}</small><span class="situ">${situ}</span></div>
  <h1>${esc(S.caso.titulo)}</h1>${extra}
  ${S.est.modo ? `<button type="button" class="troca" id="troca-modo">${outro === "papel" ? "Trocar para papel" : "Trocar para tela"}</button>` : ""}</div>`;
}
function ligarCabecalho() {
  document.getElementById("troca-modo")?.addEventListener("click", () => { S.est.modo = S.est.modo === "papel" ? "tela" : "papel"; guarda(); ir(S.est.semComo ? entrada() : "como"); });
}
const entrada = () => (!atual() ? "final" : S.est.modo === "papel" ? "papel" : "objetivo");

// ── HOME: entrada do jogador (sem venda) ──
async function telaHome(msgErro) {
  S.tela = "home";
  const v = await vitrine();
  const salvos = v.casos.filter((c) => c.disponivel && carregar(c.slug)?.codigo);
  $app.innerHTML = `<section class="entrada">
    <small class="eyebrow">CENTRAL DE INVESTIGAÇÃO</small>
    <h1>Abra o seu caso</h1>
    <p>O jeito mais fácil: toque no botão <b>“Começar a jogar”</b> na sua área de membros da Kiwify. Ou digite o código aqui:</p>
    <form id="f-cod" class="form-cod"><label class="rotulo" for="cod">Código do caso</label>
      <input class="campo-codigo" id="cod" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="VALENTE-XXXX-XXXX" maxlength="24">
      <button class="btn btn-p btn-grande">Abrir meu caso</button>
      <p class="erro" id="err" role="alert">${esc(msgErro || "")}</p></form>
  </section>
  ${salvos.length ? `<section class="continuar">${salvos.map((c) => { const st = carregar(c.slug), feitos = Object.keys(st.resolvidos || {}).length; return `<a class="btn btn-s btn-grande" href="#/caso/${esc(c.slug)}">${feitos >= 3 ? "Rever" : "Continuar"} o Caso Nº ${esc(c.numero)}</a>`; }).join("")}</section>` : ""}
  <h2 class="sec-tit">Arquivos</h2>
  <section class="casos">${v.casos.map((c) => `<article class="pasta${c.disponivel ? "" : " embreve"}" data-num="CASO Nº ${esc(c.numero)}" style="--acento:${esc(c.acento)}">
    <div class="pasta-faixa"></div><div class="carimbo">${c.disponivel ? "CONFIDENCIAL" : "EM BREVE"}</div>
    <h3>${esc(c.titulo)}</h3><p>${esc(c.sinopse)}</p>
    <div class="selos"><span>${esc(c.dificuldade)}</span><span>${esc(c.duracao)}</span><span>${esc(c.jogadores)} jogadores</span><span>${esc(c.classificacao)}</span></div>
  </article>`).join("")}</section>`;
  const f = document.getElementById("f-cod"), inp = document.getElementById("cod");
  inp.addEventListener("input", () => { const n = formatar(inp.value); if (n !== inp.value) inp.value = n; });
  f.onsubmit = async (e) => {
    e.preventDefault();
    const c = casoPorCodigo(v, inp.value), err = document.getElementById("err");
    if (!inp.value.trim()) { err.textContent = "Digite o código do seu caso."; return; }
    if (!c) { err.textContent = MSG_CODIGO; return; }
    err.textContent = "Abrindo o caso…"; f.querySelector("button").disabled = true;
    if (!(await abrirCaso(c.slug, inp.value))) { err.textContent = MSG_CODIGO; f.querySelector("button").disabled = false; }
  };
}
function formatar(v) { const n = normCodigo(v); if (n.length <= 8) return v.toUpperCase(); const pre = n.slice(0, -8), r = n.slice(-8); return `${pre}-${r.slice(0, 4)}-${r.slice(4)}`; }

async function abrirCaso(slug, codigoDigitado, tela) {
  const codigo = normCodigo(codigoDigitado);
  let pacote, chave, caso;
  try {
    pacote = await (await fetch(`data/${slug}.json`)).json();
    chave = await derivar(codigo, `${slug}|caso`);
    caso = await decifrar(chave, pacote.caso);
  } catch { return false; }
  const est = carregar(slug) || {};
  Object.assign(est, { resolvidos: {}, dicas: {}, tentativas: {}, sel: {}, tempo: {}, notas: "", inicio: Date.now(), fim: null, briefing: false, modo: null, semComo: false, papel: { baixou: false, continuou: {} }, ...est, codigo });
  salvar(slug, est);
  Object.assign(S, { slug, codigo, caso, chaveCaso: chave, pacote, est, conteudos: {}, chaves: {}, filtro: "todas", busca: "", realce: null });
  for (const o of caso.objetivos) if (est.resolvidos[o.n]) await desbloquear(o, est.resolvidos[o.n]);
  const destino = tela || (!est.modo ? "modo" : !est.briefing ? "briefing" : entrada());
  const h = `#/caso/${slug}/${destino}`;
  if (location.hash === h) desenhaTela(destino); else location.hash = h;
  return true;
}

// tenta abrir o conteúdo do objetivo com a resposta canônica (só a resposta certa decifra)
async function desbloquear(o, canon) {
  const chave = await derivar(`${canon}|${S.codigo}`, `${S.slug}|obj${o.n}`);
  for (const emb of o.embrulhos) {
    try { const k = await chaveBruta(await decifrarBytes(chave, emb)); S.conteudos[o.n] = await decifrar(k, S.pacote.blocos[o.n]); S.chaves[o.n] = k; return true; } catch {}
  }
  return false;
}

// ── mídia criptografada (fotos, áudios e PDFs de imprimir) ──
async function midia(nome) {
  if (urls.has(nome)) return urls.get(nome);
  let info = S.caso.midia[nome], chave = S.chaveCaso;
  if (!info) for (const n of Object.keys(S.conteudos)) if (S.conteudos[n].midia?.[nome]) { info = S.conteudos[n].midia[nome]; chave = S.chaves[n]; }
  if (!info) return "";
  const p = (async () => {
    const buf = new Uint8Array(await (await fetch(`data/${S.slug}/${info.f}`)).arrayBuffer());
    const dados = await crypto.subtle.decrypt({ name: "AES-GCM", iv: buf.slice(0, 12) }, chave, buf.slice(12));
    return URL.createObjectURL(new Blob([dados], { type: info.t }));
  })();
  urls.set(nome, p);
  return p;
}
let tocando = null;
function hidratar(raiz) {
  raiz.querySelectorAll("img[data-midia]:not([src])").forEach(async (im) => { im.src = await midia(im.dataset.midia); });
  raiz.querySelectorAll("img.zoomavel").forEach((im) => { im.onclick = () => abrirImagem(im.src, im.alt); });
  raiz.querySelectorAll(".audio-prova[data-audio]").forEach((box) => {
    if (box.dataset.ok) return; box.dataset.ok = 1;
    const bt = box.querySelector(".audio-play"), tempo = box.querySelector(".audio-tempo");
    let au = null;
    const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
    bt.onclick = async () => {
      if (!au) {
        tempo.textContent = "carregando…";
        au = new Audio(await midia(box.dataset.audio));
        au.ontimeupdate = () => { tempo.textContent = `${fmt(au.currentTime)} / ${fmt(au.duration || 0)}`; box.style.setProperty("--prog", `${(au.currentTime / (au.duration || 1)) * 100}%`); };
        au.onended = () => { bt.textContent = "▶"; box.classList.remove("tocando"); };
      }
      if (au.paused) { if (tocando && tocando !== au) tocando.pause(); tocando = au; await au.play().catch(() => {}); bt.textContent = "❚❚"; box.classList.add("tocando"); }
      else { au.pause(); bt.textContent = "▶"; box.classList.remove("tocando"); }
    };
    box.querySelector(".audio-info").onclick = (e) => { if (!au || !au.duration) return; const r = e.currentTarget.getBoundingClientRect(); au.currentTime = ((e.clientX - r.left) / r.width) * au.duration; };
  });
}

// ── janelas (documento, foto, ajuda): o "voltar" do celular fecha a janela ──
const pilha = [];
window.addEventListener("popstate", () => { const m = pilha.pop(); if (m) m.fecharSemHistorico(); });
function modal(html) {
  const el = document.createElement("div"); el.className = "modal"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true");
  el.innerHTML = html; document.body.appendChild(el); document.body.classList.add("sem-rolagem");
  const reg = { fecharSemHistorico: () => { el.remove(); if (!document.querySelector(".modal")) document.body.classList.remove("sem-rolagem"); if (tocando) tocando.pause(); } };
  pilha.push(reg); history.pushState({ modal: pilha.length }, "");
  el.querySelectorAll("[data-fechar]").forEach((b) => (b.onclick = () => history.back()));
  return { el };
}
function zoomControles(el, alvo) {
  let z = 1;
  const aplica = () => { alvo.style.width = `${100 * z}%`; el.querySelector("[data-z]").textContent = `${Math.round(z * 100)}%`; };
  el.querySelector("[data-mais]").onclick = () => { z = Math.min(3, z + 0.5); aplica(); };
  el.querySelector("[data-menos]").onclick = () => { z = Math.max(1, z - 0.5); aplica(); };
  aplica();
}
const barra = (titulo, zoom = true) => `<div class="modal-barra"><b>${titulo}</b><div class="modal-acoes">${zoom ? `<button type="button" class="btn-ic" data-menos aria-label="Diminuir letra">−</button><span data-z>100%</span><button type="button" class="btn-ic" data-mais aria-label="Aumentar letra">+</button>` : ""}<button type="button" class="btn-fechar" data-fechar>Fechar</button></div></div>`;
function abrirDoc(p) {
  if (!p) return;
  const { el } = modal(`${barra(`${esc(p.id)} · ${esc(p.titulo)}`)}<div class="modal-corpo"><div class="modal-doc">${renderProva(p)}</div></div>`);
  zoomControles(el, el.querySelector(".modal-doc"));
  hidratar(el);
}
function abrirImagem(src, alt) {
  if (!src) return;
  const { el } = modal(`${barra(esc(alt || "Foto"))}<div class="modal-corpo modal-img"><img src="${esc(src)}" alt="${esc(alt || "")}"></div>`);
  zoomControles(el, el.querySelector(".modal-img img"));
}
function abrirLista(titulo, provas, intro = "") {
  const { el } = modal(`${barra(esc(titulo), false)}<div class="modal-corpo">${intro ? `<p class="intro">${intro}</p>` : ""}<div class="doc-grid">${provas.map(cardDoc).join("")}</div></div>`);
  el.querySelectorAll("[data-doc]").forEach((b) => (b.onclick = () => abrirDoc(todasProvas().find((p) => p.id === b.dataset.doc))));
}

// ── AJUDA (em todas as telas): passo a passo curto com imagens ──
const AJUDA = {
  home: { t: "Como abrir o seu caso", p: [["1", "Entre na sua área de membros da Kiwify e toque em <b>“Começar a jogar”</b>. O caso abre sozinho."], ["2", "Se o botão não abrir, copie o código que aparece embaixo dele e digite aqui."], ["3", "Seu progresso fica salvo neste celular. Para voltar depois, é só abrir o mesmo endereço."]] },
  tela: { t: "Como jogar na tela", p: [["ajuda/tela-1.webp", "Em <b>Objetivo</b>, leia a pergunta e escolha a sua resposta."], ["ajuda/tela-2.webp", "Marque as provas que mostram que você tem razão. Toque em <b>ver</b> para ler o documento sem sair da tela."], ["ajuda/tela-3.webp", "Em <b>Documentos</b> estão todos os papéis, fotos e áudios do caso. Use + e − para aumentar a letra."], ["ajuda/tela-4.webp", "Toque em <b>Conferir resposta</b>. Travou? Toque em <b>Pedir dica</b>. Suas anotações ficam em <b>Anotações</b>."]] },
  papel: { t: "Como jogar no papel", p: [["ajuda/papel-1.webp", "Toque em <b>Baixar documentos para imprimir</b> e imprima as folhas."], ["ajuda/papel-2.webp", "Leia as folhas. No celular, toque na resposta que você acha certa."], ["ajuda/papel-3.webp", "Digite os números das provas (por exemplo, <b>5</b> para a prova E-05) e toque em <b>Conferir resposta</b>."], ["ajuda/papel-4.webp", "Acertou? Imprima as provas novas e toque em <b>Já imprimi, continuar</b>. Os áudios você ouve no celular."]] },
};
function abrirAjuda() {
  const k = !S.caso || S.tela === "home" ? "home" : S.est.modo === "papel" ? "papel" : "tela";
  const a = AJUDA[k];
  const { el } = modal(`${barra(esc(a.t), false)}<div class="modal-corpo"><ol class="ajuda">${a.p.map(([img, txt]) => `<li>${img.includes("/") ? `<img src="${img}" alt="" loading="lazy">` : ""}<p>${txt}</p></li>`).join("")}</ol>
  <p class="intro">Ainda com dúvida? Mande uma mensagem para ${esc(VITRINE?.perfil || "@alibi.criminal")}.</p><button type="button" class="btn btn-p btn-grande" data-fechar>Entendi</button></div>`);
  el.querySelectorAll("[data-fechar]").forEach((b) => (b.onclick = () => history.back()));
}
document.getElementById("ajuda")?.addEventListener("click", abrirAjuda);

// ── telas do caso ──
const atual = () => S.caso.objetivos.find((o) => !S.est.resolvidos[o.n]);
const bonusLiberadas = () => Object.keys(S.conteudos).sort().flatMap((n) => S.conteudos[n].bonus);
const todasProvas = () => [...S.caso.provas, ...bonusLiberadas()];
const temAudio = (p) => p.tipo === "audio" || !!p.conteudo?.audio;

function desenhaTela(tela) {
  if (tocando) tocando.pause();
  S.tela = tela;
  document.body.classList.toggle("com-abas", S.est.modo === "tela" && ["docs", "objetivo", "notas"].includes(tela));
  ({ modo: telaModo, como: telaComo, briefing: telaBriefing, docs: telaDocs, objetivo: telaObjetivo, notas: telaNotas, papel: telaPapel, final: telaFinal }[tela] || (() => ir(entrada())))();
  window.scrollTo({ top: 0 });
}
function abasBaixo(ativa) {
  return `<nav class="abas-baixo" aria-label="Seções do caso">${[["docs", "Documentos", IC.docs], ["objetivo", "Objetivo", IC.alvo], ["notas", "Anotações", IC.lapis]].map(([k, t, i]) => `<a href="#/caso/${S.slug}/${k}" ${k === ativa ? 'aria-current="page"' : ""}>${i}<span>${t}</span></a>`).join("")}</nav>`;
}

// 1) escolha do modo
function telaModo() {
  $app.innerHTML = `${cabecalhoCaso()}<section class="cartao centro"><h2 class="h-grande">Como você vai jogar?</h2>
    <button type="button" class="opcao-modo" data-modo="tela"><span class="ic">${IC.tela}</span><span><b>Na tela <em>Recomendado</em></b>Celular, tablet ou computador. Não precisa imprimir nada.</span></button>
    <button type="button" class="opcao-modo" data-modo="papel"><span class="ic">${IC.papel}</span><span><b>No papel</b>Imprima os documentos e use o celular só para conferir as respostas.</span></button>
    <p class="intro">Você pode trocar depois, no topo da tela.</p></section>`;
  $app.querySelectorAll("[data-modo]").forEach((b) => (b.onclick = () => { S.est.modo = b.dataset.modo; guarda(); ir(S.est.semComo ? (!S.est.briefing ? "briefing" : entrada()) : "como"); }));
}

// 2) como jogar (4 passos do modo escolhido)
function telaComo() {
  const papel = S.est.modo === "papel";
  const passos = papel
    ? ["Baixe e imprima os documentos (um botão faz isso).", "Leia as folhas com calma. Cada documento tem um número, como E-05.", "No celular, escolha a resposta e digite os números das provas.", "Acertou? A Central libera provas novas para imprimir. Os áudios você ouve no celular."]
    : ["Leia o objetivo: é a pergunta que você precisa responder.", "Abra os documentos, fotos e áudios em Documentos.", "Escolha a resposta e marque as provas que mostram que você tem razão.", "Acertou? Provas novas aparecem. Travou? Peça uma dica."];
  $app.innerHTML = `${cabecalhoCaso()}<section class="cartao"><h2 class="h-grande">Como jogar ${papel ? "no papel" : "na tela"}</h2>
    <ol class="passos-4">${passos.map((p) => `<li>${esc(p)}</li>`).join("")}</ol>
    <button type="button" class="btn btn-p btn-grande" id="entendi">Entendi, começar</button>
    <label class="marcar"><input type="checkbox" id="nao-mostrar"> Não mostrar de novo</label></section>`;
  ligarCabecalho();
  document.getElementById("entendi").onclick = () => { S.est.semComo = document.getElementById("nao-mostrar").checked; guarda(); ir(!S.est.briefing ? "briefing" : entrada()); };
}

// 3) briefing da delegada (só na primeira vez)
function telaBriefing() {
  const b = S.caso.briefing, v = S.caso.vitima;
  $app.innerHTML = `${cabecalhoCaso()}<section class="briefing">
    <div class="brief-cab"><div class="distintivo" aria-hidden="true">★</div><div><small>RECADO DA DELEGADA</small><h2>${esc(b.de)}</h2><span>${esc(b.cargo)}</span></div></div>
    <div class="audio-prova" data-audio="${esc(b.audio)}"><button type="button" class="audio-play" aria-label="Ouvir o recado">▶</button><div class="audio-info"><b>Ouvir o recado (43 s)</b><span class="audio-tempo">toque para ouvir</span></div></div>
    <div class="brief-texto">${b.texto.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
    <div class="brief-fotos"><img class="zoomavel" data-midia="${esc(v.foto.rosto)}" alt="${esc(v.nome)}"><div><b>A vítima</b><br>${esc(v.nome)}, ${esc(v.idade)} anos<br><span>${esc(v.relacao)}</span></div></div>
    <button class="btn btn-p btn-grande" id="comecar">Começar a investigar</button></section>`;
  ligarCabecalho(); hidratar($app);
  document.getElementById("comecar").onclick = () => { S.est.briefing = true; S.est.inicio = Date.now(); guarda(); ir(entrada()); };
}

// ── MODO TELA ──
function categoria(p) {
  if (p.origem !== "pdf") return "Provas novas";
  if (p.tipo === "depoimento") return "Depoimentos";
  if (p.tipo === "audio") return "Áudios";
  if (p.tipo === "foto" || p.tipo === "ilustracao") return "Fotos";
  if (p.tipo === "oficio" && /laudo|informação técnica/i.test(p.titulo)) return "Laudos";
  if (["log", "app", "extrato", "recibo", "chat", "email", "agenda", "lista"].includes(p.tipo)) return "Registros";
  return "Documentos";
}
const CATS = ["Provas novas", "Laudos", "Depoimentos", "Registros", "Fotos", "Áudios", "Documentos"];
const cardDoc = (p) => `<button type="button" class="doc-card${p.origem !== "pdf" ? " bonus" : ""}${S.realce?.includes(p.id) ? " realce" : ""}" data-doc="${esc(p.id)}"><b>${esc(p.id)}</b><span>${esc(p.titulo)}</span><i>${temAudio(p) ? "áudio" : p.tipo === "foto" || p.conteudo?.anexo ? "foto" : ""}</i></button>`;

function telaDocs() {
  const lista0 = todasProvas();
  $app.innerHTML = `${cabecalhoCaso()}<section>
    <h2 class="h-sec">Documentos</h2>
    <input type="search" id="busca-docs" class="busca" placeholder="Buscar: número ou palavra (ex.: 18, alarme)" aria-label="Buscar documento">
    <button type="button" class="btn btn-s btn-grande" id="ver-pessoas">Ver as pessoas do caso</button>
    <div id="lista-docs"></div></section>${abasBaixo("docs")}`;
  ligarCabecalho();
  const desenha = () => {
    const q = (document.getElementById("busca-docs").value || "").trim().toLowerCase().replace(/^([eb])-?0?/, "$1-0");
    const lista = lista0.filter((p) => !q || `${p.id} ${p.titulo}`.toLowerCase().includes(q) || p.id.toLowerCase().endsWith(q.padStart(2, "0")));
    const box = document.getElementById("lista-docs");
    box.innerHTML = CATS.map((cat) => { const l = lista.filter((p) => categoria(p) === cat); return l.length ? `<h3 class="cat">${cat}${cat === "Provas novas" ? " (não estão no começo do caso)" : ""}</h3><div class="doc-grid">${l.map(cardDoc).join("")}</div>` : ""; }).join("") || `<p class="vazio">Nenhum documento com “${esc(q)}”.</p>`;
    box.querySelectorAll("[data-doc]").forEach((b) => (b.onclick = () => abrirDoc(lista0.find((p) => p.id === b.dataset.doc))));
  };
  document.getElementById("busca-docs").oninput = desenha;
  document.getElementById("ver-pessoas").onclick = abrirPessoas;
  desenha();
  if (S.realce) { document.querySelector(".doc-card.realce")?.scrollIntoView({ block: "center" }); S.realce = null; }
}
function abrirPessoas() {
  const v = S.caso.vitima;
  const { el } = modal(`${barra("As pessoas do caso", false)}<div class="modal-corpo"><article class="pessoa vitima"><img class="zoomavel" data-midia="${esc(v.foto.ficha)}" alt="${esc(v.nome)}"><div class="pessoa-txt"><small>A VÍTIMA</small><h3>${esc(v.nome)}, ${esc(v.idade)}</h3><p>${esc(v.relacao)}</p></div></article>
  <div class="pessoas">${S.caso.suspeitos.map((s) => `<article class="pessoa"><img class="zoomavel" data-midia="${esc(s.foto.ficha)}" alt="${esc(s.nome)} — foto de identificação">
    <div class="pessoa-txt"><h3>${esc(s.nome)}, ${esc(s.idade)}</h3><p>${esc(s.relacao)}</p></div>
    ${s.foto.cracha ? `<div class="cracha"><div class="cr-top">${esc(s.foto.cracha.empresa)}</div><img class="zoomavel cr-foto" data-midia="${esc(s.foto.dia)}" alt="${esc(s.nome)} — crachá"><b>${esc(s.nome.toUpperCase())}</b><span>${esc(s.foto.cracha.cargo)}</span></div>` : `<figure class="dia"><img class="zoomavel" data-midia="${esc(s.foto.dia)}" alt="${esc(s.nome)} — foto pessoal"><figcaption>Foto pessoal entregue à polícia</figcaption></figure>`}
  </article>`).join("")}</div><p class="intro">Todas as pessoas e imagens são fictícias, criadas para o jogo.</p></div>`);
  hidratar(el);
}

function telaObjetivo() {
  const o = atual();
  if (!o) return ir("final");
  const usadas = S.est.dicas[o.n] || 0;
  $app.innerHTML = `${cabecalhoCaso()}<section class="obj-tela">
    <h2 class="h-sec">${esc(o.titulo)}</h2>
    <div class="pergunta">${esc(o.pergunta)}</div>
    <form id="f-obj">
    ${o.campos.map((c) => `<fieldset><legend>${esc(c.label)}</legend>${c.opcoes.map((op) => `<label class="opc"><input type="radio" name="${esc(c.id)}" value="${esc(op.id)}" required> <span>${esc(op.texto)}</span></label>`).join("")}</fieldset>`).join("")}
    <fieldset><legend>Marque ${o.n_provas} provas que mostram que você tem razão</legend>
      <div class="marcadas" id="marcadas"></div>
      <input type="search" id="busca" class="busca" placeholder="Buscar: número ou palavra (ex.: 18, alarme)" value="${esc(S.busca)}" aria-label="Buscar prova">
      <div class="provas-sel" id="lista-provas"></div>
    </fieldset>
    <div id="resp" aria-live="polite"></div>
    <button class="btn btn-p btn-grande" id="enviar">Conferir resposta</button>
    <button type="button" class="btn btn-g" id="dica" ${usadas >= 3 ? "disabled" : ""}>${usadas >= 3 ? "Você já usou as 3 dicas" : `Pedir dica (${usadas} de 3 usadas)`}</button>
    <div class="dicas">${o.dicas.slice(0, usadas).map((d, i) => `<div class="dica"><b>DICA ${i + 1}</b> ${esc(d)}</div>`).join("")}</div></form>
  </section>${abasBaixo("objetivo")}`;
  ligarCabecalho();
  const f = document.getElementById("f-obj");
  const sel = new Set(S.est.sel[o.n] || []);
  const memo = () => { S.est.sel[o.n] = [...sel]; guarda(); };
  const desenhaMarcadas = () => {
    document.getElementById("marcadas").innerHTML = `<span class="cont">${sel.size} de ${o.n_provas} marcadas</span>${[...sel].map((id) => `<button type="button" class="pill" data-tira="${esc(id)}" aria-label="Desmarcar ${esc(id)}">${esc(id)} ✕</button>`).join("")}`;
    document.querySelectorAll("[data-tira]").forEach((b) => (b.onclick = () => { sel.delete(b.dataset.tira); memo(); desenhaMarcadas(); desenhaLista(); }));
  };
  const desenhaLista = () => {
    const q = S.busca.trim().toLowerCase();
    const lista = todasProvas().filter((p) => !q || `${p.id} ${p.titulo}`.toLowerCase().includes(q) || (/^\d+$/.test(q) && p.id.endsWith(q.padStart(2, "0"))));
    const grupos = CATS.map((c) => [c, lista.filter((p) => categoria(p) === c)]).filter(([, l]) => l.length);
    document.getElementById("lista-provas").innerHTML = grupos.length ? grupos.map(([c, l]) => `<div class="grupo"><h4>${c}</h4>${l.map((p) => `<div class="chip${p.origem !== "pdf" ? " bonus" : ""}${sel.has(p.id) ? " on" : ""}"><label><input type="checkbox" value="${esc(p.id)}"${sel.has(p.id) ? " checked" : ""}><b>${esc(p.id)}</b><span>${esc(p.titulo)}</span></label><button type="button" class="ver" data-ver="${esc(p.id)}" aria-label="Ver ${esc(p.id)}">ver</button></div>`).join("")}</div>`).join("") : `<p class="vazio">Nenhuma prova encontrada.</p>`;
    document.querySelectorAll("#lista-provas input").forEach((i) => (i.onchange = () => { i.checked ? sel.add(i.value) : sel.delete(i.value); i.closest(".chip").classList.toggle("on", i.checked); memo(); desenhaMarcadas(); }));
    document.querySelectorAll("[data-ver]").forEach((b) => (b.onclick = () => abrirDoc(todasProvas().find((p) => p.id === b.dataset.ver))));
  };
  document.getElementById("busca").oninput = (e) => { S.busca = e.target.value; desenhaLista(); };
  desenhaMarcadas(); desenhaLista();
  document.getElementById("dica").onclick = () => pedirDica(o);
  f.noValidate = true; f.onsubmit = (e) => { e.preventDefault(); conferir(o, Object.fromEntries(o.campos.map((c) => [c.id, f.querySelector(`input[name="${c.id}"]:checked`)?.value])), [...sel]); };
}
function pedirDica(o) { S.est.dicas[o.n] = Math.min(3, (S.est.dicas[o.n] || 0) + 1); guarda(); desenhaTela(S.tela); setTimeout(() => document.querySelector(".dicas .dica:last-child")?.scrollIntoView({ block: "center" }), 50); }

// conferência (igual nos dois modos)
async function conferir(o, valores, provas) {
  const $r = document.getElementById("resp");
  const falta = o.campos.find((c) => !valores[c.id]);
  if (falta) { $r.className = "resposta quase"; $r.textContent = `Escolha uma resposta em “${falta.label}”.`; return; }
  if (provas.length !== o.n_provas) { $r.className = "resposta quase"; $r.textContent = `Marque ${o.n_provas} provas. Você marcou ${provas.length}.`; return; }
  S.est.tentativas[o.n] = (S.est.tentativas[o.n] || 0) + 1; guarda();
  $r.className = "resposta"; $r.textContent = "Conferindo…";
  const canon = canonResposta(o.campos.map((c) => c.id), valores, provas);
  const salt = `${S.slug}|obj${o.n}`;
  if (o.verificacao.includes(await sha(`${salt}|v|${canon}`)) && (await desbloquear(o, canon))) {
    S.est.resolvidos[o.n] = canon;
    if (!atual()) S.est.fim = Date.now();
    guarda(); carimbo();
    if (S.est.modo === "papel") return ir("papel");
    return mostraAcerto(o);
  }
  const qs = [...o.quase].sort((a, b) => b.chaves.length - a.chaves.length);
  for (const q of qs) if ((await sha(`${salt}|q|${canonCampos(q.chaves, valores)}`)) === q.h) { $r.className = "resposta quase"; $r.textContent = q.msg; return; }
  $r.className = "resposta errada"; $r.textContent = "Ainda não é isso. Releia os documentos com calma ou toque em “Pedir dica”.";
}
function carimbo() { const el = document.createElement("div"); el.className = "selo-ok"; el.innerHTML = "<span>CONFIRMADO</span>"; document.body.appendChild(el); setTimeout(() => el.remove(), 2300); }
function mostraAcerto(o) {
  const ct = S.conteudos[o.n];
  if (!atual()) return ir("final");
  $app.innerHTML = `${cabecalhoCaso()}<section class="cartao acerto"><div class="selo-mini">CONFIRMADO</div><h2 class="h-grande">Você acertou o objetivo ${o.n}!</h2><p>${esc(ct.msg)}</p>
    ${ct.bonus.length ? `<button type="button" class="btn btn-p btn-grande" id="ver-novas">Ver as provas novas (${ct.bonus.length})</button>` : ""}
    <button type="button" class="btn btn-g btn-grande" id="proximo">Ir para o objetivo ${atual().n}</button></section>${abasBaixo("objetivo")}`;
  ligarCabecalho(); window.scrollTo({ top: 0 });
  document.getElementById("ver-novas")?.addEventListener("click", () => { S.realce = ct.bonus.map((p) => p.id); ir("docs"); });
  document.getElementById("proximo").onclick = () => desenhaTela("objetivo");
}

function telaNotas() {
  $app.innerHTML = `${cabecalhoCaso()}<section><h2 class="h-sec">Anotações</h2><p class="intro">Ficam salvas só neste celular.</p>
    <textarea id="notas" class="notas-campo" placeholder="Escreva aqui o que você descobriu…">${esc(S.est.notas || "")}</textarea><p class="salvo" id="salvo"></p>
    <h2 class="h-sec" style="margin-top:22px">Linha do tempo</h2><div id="tempo"></div></section>${abasBaixo("notas")}`;
  ligarCabecalho();
  let t; document.getElementById("notas").oninput = (e) => { S.est.notas = e.target.value; clearTimeout(t); t = setTimeout(() => { guarda(); document.getElementById("salvo").textContent = "Salvo"; }, 400); };
  linhaDoTempo(document.getElementById("tempo"));
}

// linha do tempo: arraste cada fato para o horário (ou toque no fato e depois no horário)
const minutos = (h) => { const [a, b] = h.split(":").map(Number); return a * 60 + b; };
const hh = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
function linhaDoTempo($c) {
  const T = S.caso.tempo, cartas = [...T.cartas, ...Object.values(S.conteudos).flatMap((c) => c.cartas || [])];
  const slots = []; for (let m = minutos(T.de); m <= minutos(T.ate); m += 5) slots.push(m);
  const pos = S.est.tempo || (S.est.tempo = {});
  let escolhida = null;
  const carta = (c, posta, est = "") => `<div class="tl-carta ${est}${escolhida === c[0] ? " escolhida" : ""}" data-c="${c[0]}" tabindex="0"><span>${esc(c[1])}</span><small>${esc(c[3])}</small>${posta ? `<button type="button" class="tira" data-volta="${c[0]}" aria-label="Tirar da linha do tempo">✕</button>` : ""}</div>`;
  const desenha = (conferir) => {
    const livres = cartas.filter((c) => pos[c[0]] == null);
    let certas = 0;
    $c.innerHTML = `<p class="intro">Toque num fato e depois no horário em que ele aconteceu (ou arraste). O número mostra onde procurar.</p>
    <div class="tl-pool">${livres.length ? livres.map((c) => carta(c)).join("") : `<span class="vazio">Todos os fatos estão na linha do tempo.</span>`}</div>
    <div class="tl">${slots.map((m) => `<div class="slot" data-m="${m}"><span class="hora">${hh(m)}</span><div class="slot-cartas">${cartas.filter((c) => pos[c[0]] === m).map((c) => { const ok = Math.floor(minutos(c[2]) / 5) * 5 === m; if (ok) certas++; return carta(c, true, conferir ? (ok ? "certa" : "errada") : ""); }).join("")}</div></div>`).join("")}</div>
    <p class="resultado-tl" id="res">${conferir ? `${certas} de ${cartas.filter((c) => pos[c[0]] != null).length} fatos no horário certo.` : ""}</p>
    <button type="button" class="btn btn-s btn-grande" id="conf">Conferir linha do tempo</button><button type="button" class="btn btn-g" id="limpa">Recomeçar</button>`;
    ligar();
    if (conferir) document.getElementById("res").scrollIntoView({ block: "center" });
  };
  const coloca = (id, m) => { pos[id] = m; guarda(); escolhida = null; desenha(false); };
  function ligar() {
    $c.querySelector("#conf").onclick = () => desenha(true);
    $c.querySelector("#limpa").onclick = () => { for (const k of Object.keys(pos)) delete pos[k]; guarda(); desenha(false); };
    $c.querySelectorAll("[data-volta]").forEach((b) => (b.onclick = (e) => { e.stopPropagation(); delete pos[b.dataset.volta]; guarda(); desenha(false); }));
    $c.querySelectorAll(".slot").forEach((s) => (s.onclick = () => { if (escolhida) coloca(escolhida, +s.dataset.m); }));
    $c.querySelectorAll(".tl-carta").forEach((el) => {
      el.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); escolhida = escolhida === el.dataset.c ? null : el.dataset.c; desenha(false); } };
      el.onpointerdown = (e) => {
        if (e.target.closest(".tira")) return;
        const id = el.dataset.c, x0 = e.clientX, y0 = e.clientY; let fant = null, rola = 0, alvo = null, raf;
        el.setPointerCapture(e.pointerId);
        const anda = () => { if (rola) window.scrollBy(0, rola); if (fant) raf = requestAnimationFrame(anda); };
        el.onpointermove = (ev) => {
          if (!fant && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 10) return;
          if (!fant) { fant = el.cloneNode(true); fant.classList.add("fantasma"); document.body.appendChild(fant); el.classList.add("arrastando"); raf = requestAnimationFrame(anda); }
          fant.style.left = `${ev.clientX - 60}px`; fant.style.top = `${ev.clientY - 20}px`;
          rola = ev.clientY < 110 ? -14 : ev.clientY > innerHeight - 140 ? 14 : 0;
          fant.style.display = "none"; const sob = document.elementFromPoint(ev.clientX, ev.clientY)?.closest(".slot"); fant.style.display = "";
          if (alvo !== sob) { alvo?.classList.remove("sobre"); sob?.classList.add("sobre"); alvo = sob; }
        };
        el.onpointerup = el.onpointercancel = (ev) => {
          el.onpointermove = el.onpointerup = el.onpointercancel = null;
          if (fant) { fant.remove(); fant = null; cancelAnimationFrame(raf); el.classList.remove("arrastando"); alvo?.classList.remove("sobre"); if (alvo && ev.type === "pointerup") coloca(id, +alvo.dataset.m); }
          else { escolhida = escolhida === id ? null : id; desenha(false); if (escolhida) $c.querySelector(".tl").classList.add("escolhendo"); }
        };
      };
    });
    if (escolhida) $c.querySelector(".tl").classList.add("escolhendo");
  }
  desenha(false);
}

// ── MODO PAPEL ──
async function baixar(nome, arquivo) {
  const url = await midia(nome);
  const a = document.createElement("a"); a.href = url; a.download = arquivo; document.body.appendChild(a);
  try { a.click(); } catch {} a.remove();
  if (EM_IFRAME) aviso("Se o download não começar, use “Enviar o PDF” ou abra o caso no navegador do celular.");
}
async function compartilhar(nome, arquivo) {
  const blob = await (await fetch(await midia(nome))).blob();
  const file = new File([blob], arquivo, { type: "application/pdf" });
  try {
    if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: arquivo, text: "Documentos do Arquivo Álibi para imprimir" }); return; }
  } catch (e) { if (e?.name === "AbortError") return; }
  aviso("Este celular não consegue enviar o arquivo. Toque em “Baixar” e mande pelo WhatsApp depois.");
}
const podeCompartilhar = () => !!navigator.canShare && !EM_IFRAME;
const nomeArq = (sufixo) => `arquivo-alibi-caso-${S.caso.numero}-${sufixo}.pdf`;

function telaPapel() {
  const at = atual();
  // provas novas ainda não impressas?
  const pend = S.caso.objetivos.find((o) => S.est.resolvidos[o.n] && S.conteudos[o.n]?.impresso && !S.est.papel.continuou[o.n]);
  if (!S.est.papel.baixou) return papelBaixar();
  if (pend) return papelNovas(pend);
  if (!at) return ir("final");
  papelResponder(at);
}
function papelBaixar() {
  const imp = S.caso.impresso;
  $app.innerHTML = `${cabecalhoCaso()}<section class="cartao centro"><span class="ic-grande">${IC.papel}</span><h2 class="h-grande">Imprima os documentos</h2>
    <p class="lead">Você vai precisar de: <b>as folhas impressas, uma caneta e o celular</b> só para conferir as respostas.</p>
    <button type="button" class="btn btn-p btn-grande" id="baixar">Baixar documentos para imprimir (${imp.paginas} páginas)</button>
    ${podeCompartilhar() ? `<button type="button" class="btn btn-g btn-grande" id="enviar-pdf">Enviar o PDF para o meu e-mail ou WhatsApp</button>` : ""}
    <button type="button" class="link" id="ja-tenho">Já imprimi, quero responder</button></section>`;
  ligarCabecalho();
  document.getElementById("baixar").onclick = async () => { await baixar(imp.pdf, nomeArq("documentos")); S.est.papel.baixou = true; guarda(); desenhaTela("papel"); };
  document.getElementById("enviar-pdf")?.addEventListener("click", () => compartilhar(imp.pdf, nomeArq("documentos")));
  document.getElementById("ja-tenho").onclick = () => { S.est.papel.baixou = true; guarda(); desenhaTela("papel"); };
}
function papelNovas(o) {
  const ct = S.conteudos[o.n], imp = ct.impresso;
  $app.innerHTML = `${cabecalhoCaso()}<section class="cartao centro acerto"><div class="selo-mini">CONFIRMADO</div><h2 class="h-grande">Você acertou o objetivo ${o.n}!</h2><p>${esc(ct.msg)}</p>
    <button type="button" class="btn btn-p btn-grande" id="imp-novas">Imprimir as provas novas (${imp.paginas} ${imp.paginas === 1 ? "página" : "páginas"})</button>
    <button type="button" class="btn btn-g" id="ver-novas">Ver na tela</button>
    ${podeCompartilhar() ? `<button type="button" class="btn btn-g" id="enviar-novas">Enviar o PDF</button>` : ""}
    <button type="button" class="btn btn-s btn-grande" id="continuar">Já imprimi, continuar</button></section>`;
  ligarCabecalho();
  document.getElementById("imp-novas").onclick = () => baixar(imp.pdf, nomeArq(`provas-novas-${o.n}`));
  document.getElementById("ver-novas").onclick = () => abrirLista(`Provas novas do objetivo ${o.n}`, ct.bonus);
  document.getElementById("enviar-novas")?.addEventListener("click", () => compartilhar(imp.pdf, nomeArq(`provas-novas-${o.n}`)));
  document.getElementById("continuar").onclick = () => { S.est.papel.continuou[o.n] = true; guarda(); desenhaTela("papel"); };
}
// "5", "e5", "E-05", "b2" → E-05 / B-02
function lerNumero(txt, letra) {
  const m = String(txt).trim().toUpperCase().match(/^([EB])?\s*-?\s*0*(\d{1,2})$/);
  if (!m) return null;
  return `${m[1] || letra}-${m[2].padStart(2, "0")}`;
}
function papelResponder(o) {
  const usadas = S.est.dicas[o.n] || 0;
  const temBonus = bonusLiberadas().length > 0;
  const guard = S.est.sel[o.n] || [];
  $app.innerHTML = `${cabecalhoCaso()}<section class="obj-tela papel">
    <h2 class="h-sec">${esc(o.titulo)}</h2>
    <div class="pergunta">${esc(o.pergunta)}</div>
    <form id="f-obj">
    ${o.campos.map((c) => `<fieldset><legend>${esc(c.label)}</legend><div class="opcoes-grandes">${c.opcoes.map((op) => `<label class="opc-grande"><input type="radio" name="${esc(c.id)}" value="${esc(op.id)}"><span>${esc(op.texto)}</span></label>`).join("")}</div></fieldset>`).join("")}
    <fieldset><legend>Digite os números das ${o.n_provas} provas</legend>
      <p class="intro">Exemplo: para a prova E-05, digite <b>5</b>.${temBonus ? " Para as provas novas (B-01, B-02…), toque em <b>B</b> antes." : ""}</p>
      ${Array.from({ length: o.n_provas }, (_, i) => { const v = guard[i] || ""; const letra = v.startsWith("B") ? "B" : "E"; return `<div class="campo-prova" data-i="${i}">
        ${temBonus ? `<div class="letra" role="group" aria-label="Tipo da prova ${i + 1}"><button type="button" data-l="E" aria-pressed="${letra === "E"}">E</button><button type="button" data-l="B" aria-pressed="${letra === "B"}">B</button></div>` : `<span class="letra-fixa">E-</span>`}
        <input type="text" inputmode="numeric" maxlength="5" autocomplete="off" aria-label="Número da prova ${i + 1}" value="${esc(v ? String(+v.slice(2)) : "")}" data-letra="${letra}">
        <span class="nome-prova" aria-live="polite"></span></div>`; }).join("")}
    </fieldset>
    <div id="resp" aria-live="polite"></div>
    <button class="btn btn-p btn-grande" id="enviar">Conferir resposta</button>
    <button type="button" class="btn btn-g" id="dica" ${usadas >= 3 ? "disabled" : ""}>${usadas >= 3 ? "Você já usou as 3 dicas" : `Pedir dica (${usadas} de 3 usadas)`}</button>
    <button type="button" class="btn btn-g" id="audios">${IC.som} Áudios do caso</button>
    <div class="dicas">${o.dicas.slice(0, usadas).map((d, i) => `<div class="dica"><b>DICA ${i + 1}</b> ${esc(d)}</div>`).join("")}</div></form></section>`;
  ligarCabecalho();
  const provas = todasProvas();
  const lerCampos = () => [...document.querySelectorAll(".campo-prova")].map((box) => { const inp = box.querySelector("input"); return inp.value.trim() ? lerNumero(inp.value, inp.dataset.letra) || "?" : ""; });
  const atualiza = (box) => {
    const inp = box.querySelector("input"), nome = box.querySelector(".nome-prova");
    if (!inp.value.trim()) { nome.textContent = ""; nome.className = "nome-prova"; return; }
    const id = lerNumero(inp.value, inp.dataset.letra);
    if (/[eb]/i.test(inp.value) && box.querySelector(".letra")) { const l = inp.value.trim()[0].toUpperCase(); inp.dataset.letra = l; box.querySelectorAll("[data-l]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.l === l)); }
    const p = id && provas.find((x) => x.id === id);
    nome.textContent = p ? `${p.id} · ${p.titulo}` : id ? `${id} não existe ou ainda não foi liberada.` : "Digite só o número, por exemplo 5.";
    nome.className = `nome-prova ${p ? "ok" : "erro"}`;
    S.est.sel[o.n] = lerCampos(); guarda();
  };
  document.querySelectorAll(".campo-prova").forEach((box) => {
    const inp = box.querySelector("input");
    inp.oninput = () => atualiza(box);
    box.querySelectorAll("[data-l]").forEach((b) => (b.onclick = () => { inp.dataset.letra = b.dataset.l; box.querySelectorAll("[data-l]").forEach((x) => x.setAttribute("aria-pressed", x === b)); atualiza(box); inp.focus(); }));
    if (inp.value) atualiza(box);
  });
  document.getElementById("dica").onclick = () => pedirDica(o);
  document.getElementById("audios").onclick = () => abrirLista("Áudios do caso", provas.filter(temAudio), "Toque num documento e depois no ▶ para ouvir.");
  document.getElementById("f-obj").noValidate = true;
  document.getElementById("f-obj").onsubmit = (e) => {
    e.preventDefault();
    const ids = lerCampos().filter(Boolean);
    const $r = document.getElementById("resp");
    if (ids.includes("?")) { $r.className = "resposta quase"; $r.textContent = "Um dos números não está certo. Digite só o número da prova, por exemplo 5."; return; }
    const inval = ids.find((id) => !provas.some((p) => p.id === id));
    if (inval) { $r.className = "resposta quase"; $r.textContent = `A prova ${inval} não existe ou ainda não foi liberada. Confira o número na folha.`; return; }
    if (new Set(ids).size !== ids.length) { $r.className = "resposta quase"; $r.textContent = "Você digitou a mesma prova duas vezes. Use provas diferentes."; return; }
    const valores = Object.fromEntries(o.campos.map((c) => [c.id, document.querySelector(`input[name="${c.id}"]:checked`)?.value]));
    conferir(o, valores, ids);
  };
}

// ── FINAL (os dois modos) ──
function nivel(dicas) { return dicas === 0 ? "Detetive Sênior" : dicas <= 2 ? "Detetive" : dicas <= 5 ? "Investigador(a)" : "Agente em treinamento"; }
async function telaFinal() {
  if (atual()) return ir(entrada());
  const ult = S.conteudos[S.caso.objetivos.length], sol = ult.solucao;
  const mins = Math.max(1, Math.round(((S.est.fim || Date.now()) - S.est.inicio) / 60000));
  const dicas = Object.values(S.est.dicas).reduce((a, b) => a + b, 0);
  const tent = Object.values(S.est.tentativas).reduce((a, b) => a + b, 0);
  const v = await vitrine();
  const prox = v.casos.filter((c) => c.numero > S.caso.numero && c.slug !== S.slug)[0];
  const it = sol.interrogatorio;
  const termo = { id: "Final", rotulo: "Interrogatório · 24/09", titulo: `Termo de interrogatório — ${it.declarante.split(",")[0]}`, tipo: "depoimento", origem: "final", conteudo: { documento: "TERMO DE INTERROGATÓRIO", declarante: it.declarante, data: it.data, qa: it.qa, audio: it.audio, foto: it.foto } };
  $app.innerHTML = `${cabecalhoCaso()}<section>
  <div class="msg-ok fim"><b>CASO ENCERRADO.</b> Você resolveu o Caso Nº ${esc(S.caso.numero)}.</div>
  <h2 class="h-sec">Relatório do detetive</h2>
  <div class="relatorio"><div><b>${mins} min</b>tempo</div><div><b>${dicas}</b>dicas</div><div><b>${tent}</b>tentativas</div></div>
  <div class="nivel">Nível: <b>${nivel(dicas)}</b></div>
  <button type="button" class="btn btn-p btn-grande" id="compart">Gerar imagem para Stories / TikTok</button>
  <button type="button" class="btn btn-g" id="desafio">Desafiar um amigo</button>
  ${ult.impressoSolucao ? `<button type="button" class="btn btn-g" id="imp-sol">Imprimir a solução</button>` : ""}
  <div id="share-area"></div>
  <h2 class="h-sec">A confissão</h2>
  <div class="final-doc">${renderProva(termo)}</div>
  <article class="solucao"><h2>O que aconteceu</h2>${sol.relato.map((p) => `<p>${esc(p)}</p>`).join("")}
  <h3>Como cada pista levava à verdade</h3><ul>${sol.pistas.map(([id, t]) => `<li><b>${esc(id)}</b> ${esc(t)}</li>`).join("")}</ul>
  <h3>Os inocentes</h3><ul>${sol.suspeitos.filter((s) => s.id !== sol.verdade.culpado).map((s) => `<li><b>${esc(s.nome)}</b><br>Segredo: ${esc(s.segredo)}<br>Por que é inocente: ${esc(s.inocenta)}</li>`).join("")}</ul>
  <h3>Linha do tempo real</h3><table class="doc-tab"><tbody>${sol.verdade.linha_do_tempo.map(([h, f]) => `<tr><td><b>${esc(h)}</b></td><td>${esc(f)}</td></tr>`).join("")}</tbody></table></article>
  ${prox ? `<aside class="proximo" style="--acento:${esc(prox.acento)}"><small>PRÓXIMO ARQUIVO · CASO Nº ${esc(prox.numero)}</small><h3>${esc(prox.titulo)}</h3><p>${esc(prox.sinopse)}</p>
    ${prox.disponivel ? `<a class="btn btn-p btn-grande" href="${esc(prox.compra)}">Quero investigar este caso</a>` : `<span class="teaser">Em breve. Siga ${esc(v.perfil)} para saber quando abrir.</span>`}</aside>` : ""}</section>`;
  ligarCabecalho(); hidratar($app);
  const texto = `Resolvi o Caso Nº ${S.caso.numero} do Arquivo Álibi em ${mins} min com ${dicas} ${dicas === 1 ? "dica" : "dicas"}. Nível: ${nivel(dicas)}. Você resolveria? ${v.perfil}`;
  document.getElementById("compart").onclick = async () => mostraImagem(await imagemResultado(mins, dicas));
  document.getElementById("imp-sol")?.addEventListener("click", () => baixar(ult.impressoSolucao.pdf, nomeArq("solucao")));
  document.getElementById("desafio").onclick = async () => {
    const blob = await (await fetch(await imagemResultado(mins, dicas))).blob();
    const file = new File([blob], `resolvi-caso-${S.caso.numero}.png`, { type: "image/png" });
    try { if (navigator.canShare?.({ files: [file] })) return await navigator.share({ files: [file], text: texto }); if (navigator.share) return await navigator.share({ text: texto }); } catch (e) { if (e?.name === "AbortError") return; }
    try { await navigator.clipboard.writeText(texto); aviso("Mensagem copiada. Cole no WhatsApp do seu amigo."); }
    catch { document.getElementById("share-area").innerHTML = `<label class="intro" for="txt-des">Copie e mande para um amigo:</label><textarea id="txt-des" class="notas-campo" rows="3">${esc(texto)}</textarea>`; document.getElementById("txt-des").select(); }
  };
}
function aviso(t) { const a = document.createElement("div"); a.className = "aviso"; a.setAttribute("role", "status"); a.textContent = t; document.body.appendChild(a); setTimeout(() => a.remove(), 4500); }
function mostraImagem(url) {
  document.getElementById("share-area").innerHTML = `<figure class="share-fig"><img src="${url}" alt="Imagem do resultado para compartilhar"><figcaption>Toque e segure na imagem para salvar e postar nos Stories ou no TikTok.</figcaption></figure>`;
  const a = document.createElement("a"); a.download = `resolvi-caso-${S.caso.numero}-arquivo-alibi.png`; a.href = url; try { a.click(); } catch {}
  document.querySelector(".share-fig").scrollIntoView({ behavior: "smooth", block: "center" });
}
async function imagemResultado(mins, dicas) {
  await document.fonts.ready;
  const cv = document.createElement("canvas"); cv.width = 1080; cv.height = 1920; const g = cv.getContext("2d");
  const grad = g.createRadialGradient(540, 620, 80, 540, 900, 1250); grad.addColorStop(0, "#2E2620"); grad.addColorStop(1, "#0A0A0B"); g.fillStyle = grad; g.fillRect(0, 0, 1080, 1920);
  g.fillStyle = "rgba(201,162,39,.55)"; g.save(); g.translate(150, 210); g.rotate(-0.4); g.fillRect(-160, -26, 320, 52); g.restore();
  g.textAlign = "center";
  g.fillStyle = "#A3141C"; g.save(); g.translate(540, 330); g.rotate(-0.025); g.fillRect(-300, -20, 600, 62); g.restore();
  g.fillStyle = "#ECE7DC"; g.font = "900 120px Playfair"; g.fillText("ÁLIBI", 540, 360);
  g.font = "700 36px Courier"; g.fillStyle = "#C9A227"; g.fillText("ARQUIVO ÁLIBI", 540, 440);
  g.fillStyle = "#ECE7DC"; g.font = "800 92px Mont"; g.fillText("RESOLVI O", 540, 660); g.fillText(`CASO Nº ${S.caso.numero}`, 540, 770);
  g.font = "800 44px Mont"; g.fillStyle = "#CFC8BA"; wrap(g, `“${S.caso.titulo}”`, 540, 870, 900, 56);
  g.font = "800 64px Inter"; g.fillStyle = "#C9A227"; g.fillText(`em ${mins} min com ${dicas} ${dicas === 1 ? "dica" : "dicas"}`, 540, 1070);
  g.strokeStyle = "#ECE7DC"; g.lineWidth = 3; g.strokeRect(240, 1140, 600, 110); g.font = "700 30px Courier"; g.fillStyle = "#9C978E"; g.fillText("NÍVEL DO DETETIVE", 540, 1180); g.font = "800 46px Mont"; g.fillStyle = "#ECE7DC"; g.fillText(nivel(dicas).toUpperCase(), 540, 1232);
  g.strokeStyle = "#E0353F"; g.lineWidth = 10; g.save(); g.translate(540, 1440); g.rotate(-0.16); g.strokeRect(-280, -72, 560, 124); g.fillStyle = "#E0353F"; g.font = "400 78px Elite"; g.fillText("CONFIRMADO", 0, 14); g.restore();
  g.fillStyle = "#ECE7DC"; g.font = "800 70px Mont"; g.fillText("Você resolveria?", 540, 1690);
  g.fillStyle = "#C9A227"; g.font = "700 44px Inter"; g.fillText(VITRINE?.perfil || "@alibi.criminal", 540, 1780);
  return cv.toDataURL("image/png");
}
function wrap(g, txt, x, y, max, lh) { const ps = txt.split(" "); let l = ""; for (const p of ps) { const t = l ? l + " " + p : p; if (g.measureText(t).width > max && l) { g.fillText(l, x, y); y += lh; l = p; } else l = t; } g.fillText(l, x, y); }

// ── rotas: #/  ·  #/caso/<slug>/<tela>  ·  ?c=CODIGO (botão da Kiwify / QR) ──
async function rota() {
  while (pilha.length) pilha.pop().fecharSemHistorico();
  const cod = new URLSearchParams(location.search).get("c");
  if (cod) {
    history.replaceState(null, "", location.pathname);
    const v = await vitrine(); const c = casoPorCodigo(v, cod);
    if (c && (await abrirCaso(c.slug, cod))) return;
    return telaHome(MSG_CODIGO);
  }
  const m = location.hash.match(/^#\/caso\/([\w-]+)(?:\/(\w+))?/);
  if (m) {
    if (S.slug === m[1] && S.caso) return desenhaTela(m[2] || entrada());
    const salvo = carregar(m[1]);
    if (salvo?.codigo && (await abrirCaso(m[1], salvo.codigo, m[2]))) return;
    history.replaceState(null, "", `${location.pathname}#/`);
  }
  S.slug = null; S.caso = null; document.body.classList.remove("com-abas"); telaHome();
}
window.addEventListener("hashchange", rota);
rota();
