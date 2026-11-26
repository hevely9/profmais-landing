// ARQUIVO ÁLIBI — Central de Investigação (site estático, sem backend).
// Quem chega aqui já comprou: não há venda antes do fim do caso.
import { sha, derivar, chaveBruta, decifrar, decifrarBytes, normCodigo, canonCampos, canonResposta } from "./cripto.js";
import { renderProva } from "./render.js";

const $app = document.getElementById("app");
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const INTERROGATORIO_ATIVO = false; // fase 2 do produto: "Sala de Interrogatório" (desligada)
const EM_IFRAME = (() => { try { return window.self !== window.top; } catch { return true; } })();

// ── progresso no navegador (falha em silêncio se o navegador bloquear) ──
const salvar = (slug, st) => { try { localStorage.setItem(`arquivo-alibi:${slug}`, JSON.stringify(st)); } catch {} };
const carregar = (slug) => { try { return JSON.parse(localStorage.getItem(`arquivo-alibi:${slug}`) || "null"); } catch { return null; } };

let VITRINE = null;
const S = { slug: null, codigo: null, caso: null, chaveCaso: null, pacote: null, est: null, conteudos: {}, chaves: {}, aba: "objetivos", filtro: "todas", busca: "" };
const urls = new Map();

async function vitrine() {
  if (!VITRINE) VITRINE = await (await fetch("casos.json")).json();
  return VITRINE;
}
const casoPorCodigo = (v, cod) => {
  const n = normCodigo(cod), pre = n.slice(0, -8);
  return v.casos.find((c) => c.disponivel && normCodigo(c.prefixo) === pre) || null;
};

// ── HOME: entrada do jogador ──
async function telaHome(msgErro) {
  const v = await vitrine();
  $app.innerHTML = `<section class="entrada">
    <small class="eyebrow">CENTRAL DE INVESTIGAÇÃO</small>
    <h1>Digite o código do seu caso</h1>
    <p>O código está na página 3 do seu dossiê, junto do QR code.</p>
    <form id="f-cod" class="form-cod"><label class="sr" for="cod">Código do caso</label>
      <input class="campo-codigo" id="cod" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="VALENTE-XXXX-XXXX" maxlength="24">
      <button class="btn btn-p">Abrir o caso</button>
      <p class="erro" id="err" role="alert">${esc(msgErro || "")}</p></form>
  </section>
  <h2 class="sec-tit">Arquivos</h2>
  <section class="casos">${v.casos.map((c) => {
    const st = c.disponivel ? carregar(c.slug) : null;
    const prog = st ? Object.keys(st.resolvidos || {}).length : 0;
    return `<article class="pasta${c.disponivel ? "" : " embreve"}" data-num="CASO Nº ${esc(c.numero)}" style="--acento:${esc(c.acento)}">
    <div class="pasta-faixa"></div><div class="carimbo">${c.disponivel ? (prog === 3 ? "ENCERRADO" : "CONFIDENCIAL") : "EM BREVE"}</div>
    <h3>${esc(c.titulo)}</h3><p>${esc(c.sinopse)}</p>
    <div class="selos"><span>${esc(c.dificuldade)}</span><span>${esc(c.duracao)}</span><span>${esc(c.jogadores)} jogadores</span><span>${esc(c.classificacao)}</span></div>
    ${st?.codigo ? `<a class="btn btn-s" href="#/caso/${esc(c.slug)}">${prog === 3 ? "Rever o caso" : `Continuar investigação (${prog}/3)`}</a>` : ""}
  </article>`; }).join("")}</section>`;
  const f = document.getElementById("f-cod"), inp = document.getElementById("cod");
  inp.addEventListener("input", () => { const p = inp.selectionStart, n = formatar(inp.value); if (n !== inp.value) { inp.value = n; inp.setSelectionRange(p + 1, p + 1); } });
  f.onsubmit = async (e) => {
    e.preventDefault();
    const c = casoPorCodigo(v, inp.value), err = document.getElementById("err");
    if (!c) { err.textContent = "Código não reconhecido. Confira as letras e os números na página 3 do dossiê."; return; }
    err.textContent = "Conferindo o código…"; f.querySelector("button").disabled = true;
    const ok = await abrirCaso(c.slug, inp.value);
    if (!ok) { err.textContent = "Código não confere. Confira a página 3 do dossiê (sem 0, O, 1, I ou L)."; f.querySelector("button").disabled = false; }
  };
}
function formatar(v) { // VALENTEXXXXXXXX → VALENTE-XXXX-XXXX (o prefixo é tudo antes dos 8 últimos)
  const n = normCodigo(v); if (n.length <= 8) return v.toUpperCase();
  const pre = n.slice(0, -8), r = n.slice(-8);
  return `${pre}-${r.slice(0, 4)}-${r.slice(4)}`;
}

async function abrirCaso(slug, codigoDigitado) {
  const codigo = normCodigo(codigoDigitado);
  let pacote, chave, caso;
  try {
    pacote = await (await fetch(`data/${slug}.json`)).json();
    chave = await derivar(codigo, `${slug}|caso`);
    caso = await decifrar(chave, pacote.caso);
  } catch { return false; }
  const est = carregar(slug) || {};
  Object.assign(est, { resolvidos: {}, dicas: {}, tentativas: {}, sel: {}, tempo: {}, notas: "", inicio: Date.now(), fim: null, briefing: false, ...est, codigo });
  salvar(slug, est);
  Object.assign(S, { slug, codigo, caso, chaveCaso: chave, pacote, est, conteudos: {}, chaves: {}, filtro: "todas", busca: "" });
  for (const o of caso.objetivos) if (est.resolvidos[o.n]) await desbloquear(o, est.resolvidos[o.n]);
  if (location.hash !== `#/caso/${slug}`) history.replaceState(null, "", `${location.pathname}#/caso/${slug}`);
  est.briefing ? telaPainel() : telaBriefing();
  return true;
}

// tenta abrir o conteúdo do objetivo com a resposta canônica (só a resposta certa decifra)
async function desbloquear(o, canon) {
  const chave = await derivar(`${canon}|${S.codigo}`, `${S.slug}|obj${o.n}`);
  for (const emb of o.embrulhos) {
    try {
      const k = await chaveBruta(await decifrarBytes(chave, emb));
      S.conteudos[o.n] = await decifrar(k, S.pacote.blocos[o.n]); S.chaves[o.n] = k; return true;
    } catch {}
  }
  return false;
}

// ── mídia criptografada (fotos e áudios) ──
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

// ── visualizador de documento e de foto (com zoom) ──
function modal(html, aoFechar) {
  const el = document.createElement("div"); el.className = "modal"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true");
  el.innerHTML = html; document.body.appendChild(el); document.body.classList.add("sem-rolagem");
  const fechar = () => { el.remove(); if (!document.querySelector(".modal")) document.body.classList.remove("sem-rolagem"); if (tocando) tocando.pause(); aoFechar?.(); document.removeEventListener("keydown", tecla); };
  const tecla = (e) => { if (e.key === "Escape") fechar(); };
  document.addEventListener("keydown", tecla);
  el.querySelector("[data-fechar]").onclick = fechar;
  return { el, fechar };
}
function zoomControles(el, alvo, base) {
  let z = 1;
  const aplica = () => { alvo.style.width = `${base * z}%`; el.querySelector("[data-z]").textContent = `${Math.round(z * 100)}%`; };
  el.querySelector("[data-mais]").onclick = () => { z = Math.min(3, z + 0.5); aplica(); };
  el.querySelector("[data-menos]").onclick = () => { z = Math.max(1, z - 0.5); aplica(); };
  aplica();
}
const barraZoom = (titulo) => `<div class="modal-barra"><b>${titulo}</b><div class="modal-acoes"><button type="button" class="btn-ic" data-menos aria-label="Diminuir">−</button><span data-z>100%</span><button type="button" class="btn-ic" data-mais aria-label="Aumentar">+</button><button type="button" class="btn-ic" data-fechar aria-label="Fechar">✕</button></div></div>`;
function abrirDoc(p) {
  const { el } = modal(`${barraZoom(`${esc(p.id)} · ${esc(p.titulo)}`)}<div class="modal-corpo"><div class="modal-doc">${renderProva(p)}</div>
  ${!EM_IFRAME ? `<p style="text-align:center"><button type="button" class="btn btn-g" data-imp>Imprimir este documento</button></p>` : ""}</div>`);
  zoomControles(el, el.querySelector(".modal-doc"), 100);
  hidratar(el);
  el.querySelector("[data-imp]")?.addEventListener("click", () => imprimir(p));
}
function abrirImagem(src, alt) {
  if (!src) return;
  const { el } = modal(`${barraZoom(esc(alt || "Foto"))}<div class="modal-corpo modal-img"><img src="${esc(src)}" alt="${esc(alt || "")}"></div>`);
  zoomControles(el, el.querySelector(".modal-img img"), 100);
}
function imprimir(p) {
  const w = window.open("", "_blank"); if (!w) return;
  const html = renderProva(p).replace(/data-midia="([^"]+)"/g, (m, n) => `${m} data-x="${n}"`);
  w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(p.id)} — ${esc(p.titulo)}</title><base href="${location.href.split("#")[0]}"><link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="docs.css"><style>body{margin:24px;background:#fff}.audio-prova{display:none}</style></head><body>${html}</body></html>`);
  w.document.close();
  Promise.all([...w.document.querySelectorAll("img[data-x]")].map(async (im) => { im.src = await midia(im.dataset.x); })).then(() => setTimeout(() => w.print(), 500));
}

// ── BRIEFING (primeira vez que o código é digitado) ──
function telaBriefing() {
  const b = S.caso.briefing;
  $app.innerHTML = `<section class="briefing">
    <div class="brief-cab"><div class="distintivo" aria-hidden="true">★</div><div><small>BRIEFING · CASO Nº ${esc(S.caso.numero)}</small><h1>${esc(b.de)}</h1><span>${esc(b.cargo)}</span></div></div>
    <div class="audio-prova" data-audio="${esc(b.audio)}"><button type="button" class="audio-play" aria-label="Ouvir o briefing">▶</button><div class="audio-info"><b>Ouvir o briefing da delegada</b><span class="audio-tempo">0:43</span></div></div>
    <div class="brief-texto">${b.texto.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
    <div class="brief-fotos">${img2(S.caso.vitima.foto.rosto, S.caso.vitima.nome)}<div><b>A vítima</b><br>${esc(S.caso.vitima.nome)}, ${esc(S.caso.vitima.idade)} anos<br><span>${esc(S.caso.vitima.relacao)}</span></div></div>
    <button class="btn btn-p btn-largo" id="comecar">Começar a investigação</button>
  </section>`;
  hidratar($app);
  document.getElementById("comecar").onclick = () => { if (tocando) tocando.pause(); S.est.briefing = true; S.est.inicio = Date.now(); salvar(S.slug, S.est); telaPainel(); };
}
const img2 = (nome, alt, cls = "zoomavel") => `<img class="${cls}" data-midia="${esc(nome)}" alt="${esc(alt)}">`;

// ── PAINEL ──
const atual = () => S.caso.objetivos.find((o) => !S.est.resolvidos[o.n]);
const bonusLiberadas = () => Object.keys(S.conteudos).sort().flatMap((n) => S.conteudos[n].bonus);
const todasProvas = () => [...S.caso.provas, ...bonusLiberadas()];
const ABAS = [["objetivos", "Objetivos"], ["dossie", "Dossiê"], ["bonus", "Bônus"], ["suspeitos", "Suspeitos"], ["tempo", "Tempo"], ["notas", "Notas"]];

function telaPainel() {
  const c = S.caso, nb = bonusLiberadas().length;
  $app.innerHTML = `<div class="caso-cab"><small>ARQUIVO ÁLIBI · CASO Nº ${esc(c.numero)}</small><h1>${esc(c.titulo)}</h1><div class="caso-meta">${esc(c.data_crime)} · ${esc(c.local.split("—")[0])}</div></div>
  <nav class="abas" role="tablist">${ABAS.map(([k, t]) => `<button type="button" role="tab" aria-selected="${S.aba === k}" data-aba="${k}">${t}${k === "bonus" && nb ? ` <i>${nb}</i>` : ""}</button>`).join("")}${INTERROGATORIO_ATIVO ? `<button role="tab" data-aba="interrogatorio">Interrogatório</button>` : ""}</nav>
  <section id="conteudo"></section>`;
  $app.querySelectorAll("[data-aba]").forEach((b) => (b.onclick = () => { S.aba = b.dataset.aba; telaPainel(); window.scrollTo({ top: 0 }); }));
  ({ objetivos: abaObjetivos, dossie: abaDossie, bonus: abaBonus, suspeitos: abaSuspeitos, tempo: abaTempo, notas: abaNotas }[S.aba] || abaObjetivos)();
  hidratar(document.getElementById("conteudo"));
}

// categorias para achar provas rápido no celular
function categoria(p) {
  if (p.origem !== "pdf") return "Bônus";
  if (p.tipo === "depoimento") return "Depoimentos";
  if (p.tipo === "audio") return "Áudios";
  if (p.tipo === "foto" || p.tipo === "ilustracao") return "Fotos";
  if (p.tipo === "oficio" && /laudo|informação técnica/i.test(p.titulo)) return "Laudos";
  if (["log", "app", "extrato", "recibo", "chat", "email", "agenda", "lista"].includes(p.tipo)) return "Registros";
  return "Documentos";
}
const CATS = ["Laudos", "Depoimentos", "Registros", "Fotos", "Áudios", "Documentos", "Bônus"];

function abaObjetivos() {
  const $c = document.getElementById("conteudo");
  const at = atual();
  if (!at) return telaFinal($c);
  $c.innerHTML = S.caso.objetivos.map((o) => {
    const feito = !!S.est.resolvidos[o.n], eAtual = at.n === o.n;
    return `<article class="obj ${feito ? "feito" : eAtual ? "atual" : "bloq"}"><div class="obj-cab"><div class="obj-num">${feito ? "✓" : o.n}</div><div><h3>${esc(o.titulo)}</h3><p>${feito ? "Confirmado" : eAtual ? "Em investigação" : "Bloqueado: resolva o anterior"}</p></div></div>
    ${eAtual ? formObjetivo(o) : feito ? `<div class="obj-corpo"><div class="msg-ok">${esc(S.conteudos[o.n]?.msg || "")}</div></div>` : ""}</article>`;
  }).join("");
  ligarForm(at);
}

function formObjetivo(o) {
  const usadas = S.est.dicas[o.n] || 0;
  return `<div class="obj-corpo"><div class="pergunta">${esc(o.pergunta)}</div><form id="f-obj">
  ${o.campos.map((c) => `<fieldset><legend>${esc(c.label)}</legend>${c.opcoes.map((op) => `<label class="opc"><input type="radio" name="${esc(c.id)}" value="${esc(op.id)}" required> <span>${esc(op.texto)}</span></label>`).join("")}</fieldset>`).join("")}
  <fieldset><legend>Marque ${o.n_provas} provas que sustentam sua resposta</legend>
    <div class="marcadas" id="marcadas"></div>
    <div class="filtros"><input type="search" id="busca" placeholder="Buscar por número ou palavra (ex.: E-18, alarme)" value="${esc(S.busca)}" aria-label="Buscar prova">
    <div class="chips-filtro">${["todas", ...CATS].map((k) => `<button type="button" data-f="${k}" aria-pressed="${S.filtro === k}">${k === "todas" ? "Todas" : k}</button>`).join("")}</div></div>
    <div class="provas-sel" id="lista-provas"></div>
  </fieldset>
  <div class="linha-acoes"><button class="btn btn-p" id="enviar">Conferir resposta</button><button type="button" class="btn btn-g" id="dica" ${usadas >= 3 ? "disabled" : ""}>Pedir dica (${usadas}/3)</button></div>
  <div id="resp" aria-live="polite"></div>
  <div class="dicas">${o.dicas.slice(0, usadas).map((d, i) => `<div class="dica"><b>DICA ${i + 1}</b> ${esc(d)}</div>`).join("")}</div></form></div>`;
}

function ligarForm(o) {
  const f = document.getElementById("f-obj");
  const sel = new Set(S.est.sel[o.n] || []);
  const guarda = () => { S.est.sel[o.n] = [...sel]; salvar(S.slug, S.est); };
  const desenhaMarcadas = () => {
    document.getElementById("marcadas").innerHTML = `<span class="cont">${sel.size} de ${o.n_provas} marcadas</span>${[...sel].map((id) => `<button type="button" class="pill" data-tira="${esc(id)}" aria-label="Desmarcar ${esc(id)}">${esc(id)} ✕</button>`).join("")}`;
    document.querySelectorAll("[data-tira]").forEach((b) => (b.onclick = () => { sel.delete(b.dataset.tira); guarda(); desenhaMarcadas(); desenhaLista(); }));
  };
  const desenhaLista = () => {
    const q = S.busca.trim().toLowerCase();
    const lista = todasProvas().filter((p) => (S.filtro === "todas" || categoria(p) === S.filtro) && (!q || `${p.id} ${p.titulo}`.toLowerCase().includes(q)));
    const grupos = CATS.map((c) => [c, lista.filter((p) => categoria(p) === c)]).filter(([, l]) => l.length);
    document.getElementById("lista-provas").innerHTML = grupos.length ? grupos.map(([c, l]) => `<div class="grupo"><h4>${c}</h4>${l.map((p) => `<div class="chip${p.origem !== "pdf" ? " bonus" : ""}${sel.has(p.id) ? " on" : ""}"><label><input type="checkbox" value="${esc(p.id)}"${sel.has(p.id) ? " checked" : ""}><b>${esc(p.id)}</b><span>${esc(p.titulo)}</span></label><button type="button" class="ver" data-ver="${esc(p.id)}" aria-label="Ver ${esc(p.id)}">ver</button></div>`).join("")}</div>`).join("") : `<p class="vazio">Nenhuma prova encontrada.</p>`;
    document.querySelectorAll("#lista-provas input").forEach((i) => (i.onchange = () => { i.checked ? sel.add(i.value) : sel.delete(i.value); i.closest(".chip").classList.toggle("on", i.checked); guarda(); desenhaMarcadas(); }));
    document.querySelectorAll("[data-ver]").forEach((b) => (b.onclick = () => abrirDoc(todasProvas().find((p) => p.id === b.dataset.ver))));
  };
  document.querySelectorAll("[data-f]").forEach((b) => (b.onclick = () => { S.filtro = b.dataset.f; document.querySelectorAll("[data-f]").forEach((x) => x.setAttribute("aria-pressed", x === b)); desenhaLista(); }));
  document.getElementById("busca").oninput = (e) => { S.busca = e.target.value; desenhaLista(); };
  desenhaMarcadas(); desenhaLista();
  document.getElementById("dica").onclick = () => { S.est.dicas[o.n] = Math.min(3, (S.est.dicas[o.n] || 0) + 1); salvar(S.slug, S.est); telaPainel(); document.querySelector(".dicas .dica:last-child")?.scrollIntoView({ block: "center" }); };
  f.onsubmit = async (e) => {
    e.preventDefault();
    const $r = document.getElementById("resp");
    const valores = Object.fromEntries(o.campos.map((c) => [c.id, f.querySelector(`input[name="${c.id}"]:checked`)?.value]));
    const provas = [...sel];
    if (provas.length !== o.n_provas) { $r.className = "resposta quase"; $r.textContent = `Marque exatamente ${o.n_provas} provas (você marcou ${provas.length}).`; return; }
    S.est.tentativas[o.n] = (S.est.tentativas[o.n] || 0) + 1; salvar(S.slug, S.est);
    $r.className = "resposta"; $r.textContent = "Conferindo…";
    const canon = canonResposta(o.campos.map((c) => c.id), valores, provas);
    const salt = `${S.slug}|obj${o.n}`;
    if (o.verificacao.includes(await sha(`${salt}|v|${canon}`)) && (await desbloquear(o, canon))) {
      S.est.resolvidos[o.n] = canon;
      if (!atual()) S.est.fim = Date.now();
      salvar(S.slug, S.est);
      carimbo();
      S.aba = "objetivos"; telaPainel(); window.scrollTo({ top: 0 });
      const ct = S.conteudos[o.n];
      if (atual()) document.getElementById("conteudo").insertAdjacentHTML("afterbegin", `<div class="msg-ok"><b>CONFIRMADO.</b> ${esc(ct.msg)}${ct.bonus.length ? ` <button type="button" class="link" id="ver-bonus">Ver as ${ct.bonus.length} provas novas →</button>` : ""}</div>`);
      document.getElementById("ver-bonus")?.addEventListener("click", () => { S.aba = "bonus"; telaPainel(); });
      return;
    }
    const qs = [...o.quase].sort((a, b) => b.chaves.length - a.chaves.length);
    for (const q of qs) if ((await sha(`${salt}|q|${canonCampos(q.chaves, valores)}`)) === q.h) { $r.className = "resposta quase"; $r.textContent = q.msg; return; }
    $r.className = "resposta errada"; $r.textContent = "Não é isso. Releia os documentos com calma ou peça uma dica.";
  };
}

function carimbo() {
  const el = document.createElement("div"); el.className = "selo-ok"; el.innerHTML = "<span>CONFIRMADO</span>";
  document.body.appendChild(el); setTimeout(() => el.remove(), 2300);
}

const cardDoc = (p) => `<button type="button" class="doc-card${p.origem !== "pdf" ? " bonus" : ""}" data-doc="${esc(p.id)}"><b>${esc(p.id)}</b><span>${esc(p.titulo)}</span><i>${p.tipo === "audio" || p.conteudo?.audio ? "áudio" : p.tipo === "foto" || p.conteudo?.anexo ? "foto" : ""}</i></button>`;
function ligarDocs($c) { $c.querySelectorAll("[data-doc]").forEach((b) => (b.onclick = () => abrirDoc(todasProvas().find((p) => p.id === b.dataset.doc)))); }

function abaDossie() {
  const $c = document.getElementById("conteudo");
  $c.innerHTML = `<p class="intro">Todos os documentos do dossiê. Toque para abrir; use + e − para dar zoom. Os áudios só existem aqui na Central.</p>
  ${CATS.filter((c) => c !== "Bônus").map((cat) => { const l = S.caso.provas.filter((p) => categoria(p) === cat); return l.length ? `<h3 class="cat">${cat}</h3><div class="doc-grid">${l.map(cardDoc).join("")}</div>` : ""; }).join("")}`;
  ligarDocs($c);
}

function abaBonus() {
  const $c = document.getElementById("conteudo");
  const docs = bonusLiberadas();
  if (!docs.length) { $c.innerHTML = `<div class="cartao"><p>Nenhuma prova bônus ainda. Resolva o Objetivo 1 para liberar as primeiras. Elas não estão no PDF.</p></div>`; return; }
  $c.innerHTML = `<p class="intro">Provas liberadas pela Central. Elas não estão no PDF.</p>${Object.keys(S.conteudos).sort().map((n) => S.conteudos[n].bonus.length ? `<h3 class="cat">Liberadas no Objetivo ${n}</h3><div class="doc-grid">${S.conteudos[n].bonus.map(cardDoc).join("")}</div>` : "").join("")}`;
  ligarDocs($c);
}

function abaSuspeitos() {
  const v = S.caso.vitima;
  document.getElementById("conteudo").innerHTML = `<article class="pessoa vitima"><div class="pessoa-fotos">${img2(v.foto.ficha, `${v.nome} — retrato`)}</div><div class="pessoa-txt"><small>A VÍTIMA</small><h3>${esc(v.nome)}, ${esc(v.idade)}</h3><p>${esc(v.relacao)}</p></div></article>
  <div class="pessoas">${S.caso.suspeitos.map((s) => `<article class="pessoa"><div class="pessoa-fotos">${img2(s.foto.ficha, `${s.nome} — foto de identificação`)}</div>
    <div class="pessoa-txt"><h3>${esc(s.nome)}, ${esc(s.idade)}</h3><p>${esc(s.relacao)}</p></div>
    ${s.foto.cracha ? `<div class="cracha"><div class="cr-top">${esc(s.foto.cracha.empresa)}</div>${img2(s.foto.dia, `${s.nome} — crachá`, "zoomavel cr-foto")}<b>${esc(s.nome.toUpperCase())}</b><span>${esc(s.foto.cracha.cargo)}</span></div>` : `<figure class="dia">${img2(s.foto.dia, `${s.nome} — foto pessoal`)}<figcaption>Foto pessoal entregue à polícia</figcaption></figure>`}
  </article>`).join("")}</div>
  <p class="intro" style="margin-top:12px">Todas as pessoas e imagens são fictícias, criadas para o jogo.</p>`;
}

function abaNotas() {
  const $c = document.getElementById("conteudo");
  $c.innerHTML = `<p class="intro">Suas anotações ficam salvas só neste navegador.</p><textarea id="notas" class="notas-campo" placeholder="Ex.: Quem estava de azul-marinho? O que o sensor S1 registra?">${esc(S.est.notas || "")}</textarea><p class="salvo" id="salvo"></p>`;
  let t; document.getElementById("notas").oninput = (e) => { S.est.notas = e.target.value; clearTimeout(t); t = setTimeout(() => { salvar(S.slug, S.est); document.getElementById("salvo").textContent = "Salvo"; }, 400); };
}

// ── LINHA DO TEMPO interativa: arraste cada fato para o horário ──
const min = (h) => { const [a, b] = h.split(":").map(Number); return a * 60 + b; };
const hh = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
function abaTempo() {
  const $c = document.getElementById("conteudo");
  const T = S.caso.tempo, cartas = [...T.cartas, ...Object.values(S.conteudos).flatMap((c) => c.cartas || [])];
  const slots = []; for (let m = min(T.de); m <= min(T.ate); m += 5) slots.push(m);
  const pos = S.est.tempo || (S.est.tempo = {});
  let escolhida = null;
  const desenha = (conferir) => {
    const livres = cartas.filter((c) => pos[c[0]] == null);
    let certas = 0;
    $c.innerHTML = `<p class="intro">Arraste cada fato até o horário em que ele aconteceu (ou toque no fato e depois no horário). O número da prova mostra onde procurar.</p>
    <div class="tl-pool" id="pool">${livres.length ? livres.map((c) => carta(c)).join("") : `<span class="vazio">Todos os fatos estão na linha do tempo.</span>`}</div>
    <div class="linha-acoes" style="margin:10px 0 14px"><button type="button" class="btn btn-p" id="conf">Conferir linha do tempo</button><button type="button" class="btn btn-g" id="limpa">Recomeçar</button></div>
    <div class="tl" id="tl">${slots.map((m) => `<div class="slot" data-m="${m}"><span class="hora">${hh(m)}</span><div class="slot-cartas">${cartas.filter((c) => pos[c[0]] === m).map((c) => { const ok = Math.floor(min(c[2]) / 5) * 5 === m; if (ok) certas++; return carta(c, true, conferir ? (ok ? "certa" : "errada") : ""); }).join("")}</div></div>`).join("")}</div>
    <p class="resultado-tl" id="res">${conferir ? `${certas} de ${cartas.filter((c) => pos[c[0]] != null).length} fatos no horário certo${certas === cartas.length ? ". Linha do tempo completa!" : "."}` : ""}</p>`;
    ligar();
    if (conferir) document.getElementById("res").scrollIntoView({ block: "center", behavior: "smooth" });
  };
  const carta = (c, posta, est = "") => `<div class="tl-carta ${est}${escolhida === c[0] ? " escolhida" : ""}" data-c="${c[0]}" tabindex="0"><span>${esc(c[1])}</span><small>${esc(c[3])}</small>${posta ? `<button type="button" class="tira" data-volta="${c[0]}" aria-label="Tirar da linha do tempo">✕</button>` : ""}</div>`;
  const coloca = (id, m) => { pos[id] = m; salvar(S.slug, S.est); escolhida = null; desenha(false); };
  function ligar() {
    document.getElementById("conf").onclick = () => desenha(true);
    document.getElementById("limpa").onclick = () => { for (const k of Object.keys(pos)) delete pos[k]; salvar(S.slug, S.est); desenha(false); };
    $c.querySelectorAll("[data-volta]").forEach((b) => (b.onclick = (e) => { e.stopPropagation(); delete pos[b.dataset.volta]; salvar(S.slug, S.est); desenha(false); }));
    $c.querySelectorAll(".slot").forEach((s) => (s.onclick = () => { if (escolhida) coloca(escolhida, +s.dataset.m); }));
    $c.querySelectorAll(".tl-carta").forEach((el) => {
      el.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); escolhida = escolhida === el.dataset.c ? null : el.dataset.c; desenha(false); } };
      el.onpointerdown = (e) => {
        if (e.target.closest(".tira")) return;
        const id = el.dataset.c, x0 = e.clientX, y0 = e.clientY; let fant = null, rola = 0, alvo = null;
        el.setPointerCapture(e.pointerId);
        const anda = () => { if (rola) window.scrollBy(0, rola); if (fant) raf = requestAnimationFrame(anda); }; let raf;
        el.onpointermove = (ev) => {
          if (!fant && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 8) return;
          if (!fant) { fant = el.cloneNode(true); fant.classList.add("fantasma"); document.body.appendChild(fant); el.classList.add("arrastando"); raf = requestAnimationFrame(anda); }
          fant.style.left = `${ev.clientX - 60}px`; fant.style.top = `${ev.clientY - 20}px`;
          rola = ev.clientY < 90 ? -14 : ev.clientY > innerHeight - 90 ? 14 : 0;
          fant.style.display = "none"; const sob = document.elementFromPoint(ev.clientX, ev.clientY)?.closest(".slot"); fant.style.display = "";
          if (alvo !== sob) { alvo?.classList.remove("sobre"); sob?.classList.add("sobre"); alvo = sob; }
        };
        el.onpointerup = el.onpointercancel = (ev) => {
          el.onpointermove = el.onpointerup = el.onpointercancel = null;
          if (fant) { fant.remove(); fant = null; cancelAnimationFrame(raf); el.classList.remove("arrastando"); alvo?.classList.remove("sobre"); if (alvo && ev.type === "pointerup") coloca(id, +alvo.dataset.m); }
          else { escolhida = escolhida === id ? null : id; desenha(false); if (escolhida) document.querySelector(".tl")?.classList.add("escolhendo"); }
        };
      };
    });
    if (escolhida) $c.querySelector(".tl").classList.add("escolhendo");
  }
  desenha(false);
}

// ── FINAL ──
function nivel(dicas) { return dicas === 0 ? "Detetive Sênior" : dicas <= 2 ? "Detetive" : dicas <= 5 ? "Investigador(a)" : "Agente em treinamento"; }
async function telaFinal($c) {
  const sol = S.conteudos[S.caso.objetivos.length].solucao;
  const minutos = Math.max(1, Math.round(((S.est.fim || Date.now()) - S.est.inicio) / 60000));
  const dicas = Object.values(S.est.dicas).reduce((a, b) => a + b, 0);
  const tent = Object.values(S.est.tentativas).reduce((a, b) => a + b, 0);
  const v = await vitrine();
  const prox = v.casos.filter((c) => c.numero > S.caso.numero && c.slug !== S.slug)[0];
  const it = sol.interrogatorio;
  const termo = { id: "Termo final", titulo: `Termo de interrogatório — ${it.declarante.split(",")[0]}`, tipo: "depoimento", origem: "bonus", conteudo: { documento: "TERMO DE INTERROGATÓRIO", declarante: it.declarante, data: it.data, qa: it.qa, audio: it.audio, foto: it.foto } };
  $c.innerHTML = `<div class="msg-ok fim"><b>CASO ENCERRADO.</b> Você resolveu o Caso Nº ${esc(S.caso.numero)}.</div>
  <h3 class="cat">Relatório do detetive</h3>
  <div class="relatorio"><div><b>${minutos} min</b>tempo</div><div><b>${dicas}</b>dicas</div><div><b>${tent}</b>tentativas</div></div>
  <div class="nivel">Nível: <b>${nivel(dicas)}</b></div>
  <div class="linha-acoes" style="margin:12px 0 18px"><button type="button" class="btn btn-p" id="compart">Gerar imagem para Stories / TikTok</button><button type="button" class="btn btn-s" id="desafio">Desafiar um amigo</button></div>
  <div id="share-area"></div>
  <h3 class="cat">O interrogatório</h3>
  <div class="final-doc">${renderProva(termo)}</div>
  <article class="solucao"><h2>O que aconteceu</h2>${sol.relato.map((p) => `<p>${esc(p)}</p>`).join("")}
  <h3>Como cada pista levava à verdade</h3><ul>${sol.pistas.map(([id, t]) => `<li><b>${esc(id)}</b> ${esc(t)}</li>`).join("")}</ul>
  <h3>Os inocentes</h3><ul>${sol.suspeitos.filter((s) => s.id !== sol.verdade.culpado).map((s) => `<li><b>${esc(s.nome)}</b><br>Segredo: ${esc(s.segredo)}<br>Por que é inocente: ${esc(s.inocenta)}</li>`).join("")}</ul>
  <h3>Linha do tempo real</h3><table class="doc-tab"><tbody>${sol.verdade.linha_do_tempo.map(([h, f]) => `<tr><td><b>${esc(h)}</b></td><td>${esc(f)}</td></tr>`).join("")}</tbody></table></article>
  ${prox ? `<aside class="proximo" style="--acento:${esc(prox.acento)}"><small>PRÓXIMO ARQUIVO · CASO Nº ${esc(prox.numero)}</small><h3>${esc(prox.titulo)}</h3><p>${esc(prox.sinopse)}</p>
    ${prox.disponivel ? `<a class="btn btn-p" href="${esc(prox.compra)}" target="_blank" rel="noopener">Quero investigar este caso</a>` : `<span class="teaser">Em breve. Siga ${esc(v.perfil)} para saber quando abrir.</span>`}</aside>` : ""}`;
  hidratar($c);
  const texto = `Resolvi o Caso Nº ${S.caso.numero} do Arquivo Álibi em ${minutos} min com ${dicas} ${dicas === 1 ? "dica" : "dicas"}. Nível: ${nivel(dicas)}. Você resolveria? ${v.perfil}`;
  document.getElementById("compart").onclick = async () => mostraImagem(await imagemResultado(minutos, dicas));
  document.getElementById("desafio").onclick = async () => {
    const blob = await (await fetch(await imagemResultado(minutos, dicas))).blob();
    const file = new File([blob], `resolvi-caso-${S.caso.numero}.png`, { type: "image/png" });
    try { if (navigator.canShare?.({ files: [file] })) return await navigator.share({ files: [file], text: texto }); if (navigator.share) return await navigator.share({ text: texto }); } catch (e) { if (e?.name === "AbortError") return; }
    try { await navigator.clipboard.writeText(texto); aviso("Mensagem copiada. Cole no WhatsApp ou na DM do seu amigo."); }
    catch { document.getElementById("share-area").innerHTML = `<label class="intro" for="txt-des">Copie e mande para um amigo:</label><textarea id="txt-des" class="notas-campo" rows="3">${esc(texto)}</textarea>`; document.getElementById("txt-des").select(); }
  };
}
function aviso(t) { const a = document.createElement("div"); a.className = "aviso"; a.textContent = t; document.body.appendChild(a); setTimeout(() => a.remove(), 3500); }
function mostraImagem(url) {
  document.getElementById("share-area").innerHTML = `<figure class="share-fig"><img src="${url}" alt="Imagem do resultado para compartilhar"><figcaption>Toque e segure (ou clique com o botão direito) para salvar e postar nos Stories ou no TikTok.</figcaption></figure>`;
  const a = document.createElement("a"); a.download = `resolvi-caso-${S.caso.numero}-arquivo-alibi.png`; a.href = url; try { a.click(); } catch {}
  document.querySelector(".share-fig").scrollIntoView({ behavior: "smooth", block: "center" });
}
async function imagemResultado(minutos, dicas) {
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
  g.font = "800 64px Inter"; g.fillStyle = "#C9A227"; g.fillText(`em ${minutos} min com ${dicas} ${dicas === 1 ? "dica" : "dicas"}`, 540, 1070);
  g.strokeStyle = "#ECE7DC"; g.lineWidth = 3; g.strokeRect(240, 1140, 600, 110); g.font = "700 30px Courier"; g.fillStyle = "#9C978E"; g.fillText("NÍVEL DO DETETIVE", 540, 1180); g.font = "800 46px Mont"; g.fillStyle = "#ECE7DC"; g.fillText(nivel(dicas).toUpperCase(), 540, 1232);
  g.strokeStyle = "#E0353F"; g.lineWidth = 10; g.save(); g.translate(540, 1440); g.rotate(-0.16); g.strokeRect(-280, -72, 560, 124); g.fillStyle = "#E0353F"; g.font = "400 78px Elite"; g.fillText("CONFIRMADO", 0, 14); g.restore();
  g.fillStyle = "#ECE7DC"; g.font = "800 70px Mont"; g.fillText("Você resolveria?", 540, 1690);
  g.fillStyle = "#C9A227"; g.font = "700 44px Inter"; g.fillText(VITRINE?.perfil || "@alibi.criminal", 540, 1780);
  return cv.toDataURL("image/png");
}
function wrap(g, txt, x, y, max, lh) { const ps = txt.split(" "); let l = ""; for (const p of ps) { const t = l ? l + " " + p : p; if (g.measureText(t).width > max && l) { g.fillText(l, x, y); y += lh; l = p; } else l = t; } g.fillText(l, x, y); }

// ── rotas: #/  ·  #/caso/<slug>  ·  ?c=CODIGO (QR code) ──
async function rota() {
  const params = new URLSearchParams(location.search);
  const cod = params.get("c");
  if (cod) {
    history.replaceState(null, "", location.pathname);
    const v = await vitrine(); const c = casoPorCodigo(v, cod);
    if (c && (await abrirCaso(c.slug, cod))) return;
    return telaHome("Esse QR code não abriu nenhum caso. Digite o código da página 3.");
  }
  const m = location.hash.match(/^#\/caso\/([\w-]+)/);
  if (m) {
    if (S.slug === m[1] && S.caso) return telaPainel();
    const salvo = carregar(m[1]);
    if (salvo?.codigo && (await abrirCaso(m[1], salvo.codigo))) return;
    history.replaceState(null, "", `${location.pathname}#/`);
  }
  S.slug = null; S.caso = null; telaHome();
}
window.addEventListener("hashchange", rota);
rota();
