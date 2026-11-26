// ARQUIVO ÁLIBI — Central de Investigação (site estático, sem backend).
import { sha, derivar, chaveBruta, decifrar, decifrarBytes, normCodigo, canonCampos, canonResposta } from "./cripto.js";
import { renderProva, retrato } from "./render.js";

const $app = document.getElementById("app");
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const INTERROGATORIO_ATIVO = false; // fase 2 do produto: "Sala de Interrogatório" (desligada)

// ── progresso no navegador (falha em silêncio se o navegador bloquear) ──
const salvar = (slug, st) => { try { localStorage.setItem(`arquivo-alibi:${slug}`, JSON.stringify(st)); } catch {} };
const carregar = (slug) => { try { return JSON.parse(localStorage.getItem(`arquivo-alibi:${slug}`) || "null"); } catch { return null; } };

let VITRINE = null;
const S = { slug: null, codigo: null, caso: null, pacote: null, est: null, conteudos: {}, aba: "objetivos" };

async function vitrine() {
  if (!VITRINE) VITRINE = await (await fetch("casos.json")).json();
  return VITRINE;
}

// ── HOME ──
async function telaHome() {
  const v = await vitrine();
  $app.innerHTML = `<section class="hero">
    <h1>Você resolveria um <em>crime</em>?</h1>
    <p>Casos fictícios para investigar em casa, sozinho ou com até 4 pessoas. Você recebe o dossiê com depoimentos, laudos, fotos e registros. Aqui na Central, confere suas conclusões, pede dicas e desbloqueia provas novas.</p>
    <div class="passos"><div><b>1</b>Abra o dossiê em PDF</div><div><b>2</b>Digite o código do caso aqui</div><div><b>3</b>Resolva os 3 objetivos</div></div>
  </section>
  <section class="casos">${v.casos.map((c) => `<article class="pasta${c.disponivel ? "" : " embreve"}" data-num="CASO Nº ${esc(c.numero)}" style="--acento:${esc(c.acento)}">
    <div class="pasta-faixa"></div><div class="carimbo">${c.disponivel ? "CONFIDENCIAL" : "EM BREVE"}</div>
    <h2>${esc(c.titulo)}</h2><p>${esc(c.sinopse)}</p>
    <div class="selos"><span>${esc(c.dificuldade)}</span><span>${esc(c.duracao)}</span><span>${esc(c.jogadores)} jogadores</span><span>${esc(c.classificacao)}</span></div>
    ${c.disponivel ? `<div class="acoes"><a class="btn btn-p" href="${esc(c.compra)}" target="_blank" rel="noopener">Comprar o dossiê</a><a class="btn btn-s" href="#/caso/${esc(c.slug)}">Já tenho o dossiê</a></div>` : `<div class="acoes"><button class="btn btn-s" disabled>Em breve</button></div>`}
  </article>`).join("")}</section>
  <div class="combo"><b>Combo Arquivo Álibi</b><br><span style="color:var(--osso-e);font-size:13px">Todos os casos com desconto.</span><br><a class="btn btn-g" style="margin-top:10px" href="${esc(v.combo)}" target="_blank" rel="noopener">Ver combo</a></div>`;
}

// ── ENTRADA NO CASO ──
async function telaEntrada(slug, codigoUrl) {
  const v = await vitrine();
  const c = v.casos.find((x) => x.slug === slug && x.disponivel);
  if (!c) { $app.innerHTML = `<div class="cartao"><h2>Caso não encontrado</h2><p><a href="#/">Voltar ao arquivo</a></p></div>`; return; }
  const salvo = carregar(slug);
  if (salvo?.codigo && !codigoUrl) return abrirCaso(slug, salvo.codigo);
  $app.innerHTML = `<div class="cartao"><small style="font-family:var(--f-doc);color:var(--fita)">CASO Nº ${esc(c.numero)}</small>
    <h2>${esc(c.titulo)}</h2><p style="color:#CFC8BA;line-height:1.45">Digite o código impresso na página 3 do dossiê (ou aponte a câmera para o QR code).</p>
    <form id="f-cod"><input class="campo-codigo" id="cod" autocomplete="off" autocapitalize="characters" placeholder="${esc(c.prefixo)}-XXXX" value="${esc(codigoUrl || "")}" aria-label="Código do caso">
    <button class="btn btn-p" style="width:100%">Abrir o caso</button><p class="erro" id="err" role="alert"></p></form></div>`;
  document.getElementById("f-cod").onsubmit = (e) => { e.preventDefault(); abrirCaso(slug, document.getElementById("cod").value); };
  if (codigoUrl) abrirCaso(slug, codigoUrl);
}

async function abrirCaso(slug, codigoDigitado) {
  const err = document.getElementById("err");
  const codigo = normCodigo(codigoDigitado);
  const pacote = await (await fetch(`data/${slug}.json`)).json();
  if ((await sha(`${slug}|codigo|${codigo}`)) !== pacote.codigoHash) { if (err) err.textContent = "Código não confere. Confira a página 3 do dossiê."; return; }
  try {
    const caso = await decifrar(await derivar(codigo, `${slug}|caso`), pacote.caso);
    const est = carregar(slug) || { codigo, resolvidos: {}, dicas: {}, tentativas: {}, inicio: Date.now(), fim: null };
    est.codigo = codigo; salvar(slug, est);
    Object.assign(S, { slug, codigo, caso, pacote, est, conteudos: {} });
    for (const o of caso.objetivos) if (est.resolvidos[o.n]) await desbloquear(o, est.resolvidos[o.n]);
    if (location.hash !== `#/caso/${slug}`) history.replaceState(null, "", `#/caso/${slug}`);
    telaPainel();
  } catch { if (err) err.textContent = "Não foi possível abrir o caso. Tente de novo."; }
}

// tenta abrir o conteúdo do objetivo com a resposta canônica (só a resposta certa decifra)
async function desbloquear(o, canon) {
  const chave = await derivar(`${canon}|${S.codigo}`, `${S.slug}|obj${o.n}`);
  for (const emb of o.embrulhos) {
    try { const kRaw = await decifrarBytes(chave, emb); S.conteudos[o.n] = await decifrar(await chaveBruta(kRaw), S.pacote.blocos[o.n]); return true; } catch {}
  }
  return false;
}

// ── PAINEL ──
function atual() { return S.caso.objetivos.find((o) => !S.est.resolvidos[o.n]); }
function provasDisponiveis() {
  const l = S.caso.provasPdf.map((p) => ({ ...p, bonus: false }));
  for (const n of Object.keys(S.conteudos)) for (const p of S.conteudos[n].bonus) l.push({ id: p.id, titulo: p.titulo, bonus: true });
  return l;
}

function telaPainel() {
  const c = S.caso;
  $app.innerHTML = `<div class="caso-cab"><small>ARQUIVO ÁLIBI · CASO Nº ${esc(c.numero)}</small><h1>${esc(c.titulo)}</h1><div style="color:var(--osso-e);font-size:13px">${esc(c.local)} · ${esc(c.data_crime)}</div></div>
  <nav class="abas" role="tablist">${[["objetivos", "Objetivos"], ["provas", "Provas liberadas"], ["suspeitos", "Suspeitos"], ["dossie", "Índice do dossiê"]].map(([k, t]) => `<button role="tab" aria-selected="${S.aba === k}" data-aba="${k}">${t}</button>`).join("")}${INTERROGATORIO_ATIVO ? `<button role="tab" data-aba="interrogatorio">Interrogatório</button>` : ""}</nav>
  <section id="conteudo"></section>`;
  $app.querySelectorAll("[data-aba]").forEach((b) => (b.onclick = () => { S.aba = b.dataset.aba; telaPainel(); }));
  ({ objetivos: abaObjetivos, provas: abaProvas, suspeitos: abaSuspeitos, dossie: abaDossie }[S.aba] || abaObjetivos)();
}

function abaObjetivos() {
  const $c = document.getElementById("conteudo");
  const at = atual();
  if (!at) return telaFinal($c);
  $c.innerHTML = S.caso.objetivos.map((o) => {
    const feito = !!S.est.resolvidos[o.n], eAtual = at.n === o.n;
    return `<article class="obj ${feito ? "feito" : eAtual ? "atual" : "bloq"}"><div class="obj-cab"><div class="obj-num">${feito ? "✓" : o.n}</div><div><h3>${esc(o.titulo)}</h3><p>${feito ? "Confirmado" : eAtual ? "Em investigação" : "Bloqueado — resolva o anterior"}</p></div></div>
    ${eAtual ? formObjetivo(o) : feito ? `<div class="obj-corpo"><div class="msg-ok">${esc(S.conteudos[o.n]?.msg || "")}</div></div>` : ""}</article>`;
  }).join("");
  if (at) ligarForm(at);
}

function formObjetivo(o) {
  const usadas = S.est.dicas[o.n] || 0;
  return `<div class="obj-corpo"><div class="pergunta">${esc(o.pergunta)}</div><form id="f-obj">
  ${o.campos.map((c) => `<fieldset><legend>${esc(c.label)}</legend>${c.opcoes.map((op) => `<label class="opc"><input type="radio" name="${esc(c.id)}" value="${esc(op.id)}" required> <span>${esc(op.texto)}</span></label>`).join("")}</fieldset>`).join("")}
  <fieldset><legend>Marque exatamente ${o.n_provas} provas que sustentam sua resposta</legend>
  <div class="provas-sel">${provasDisponiveis().map((p) => `<label class="chip${p.bonus ? " bonus" : ""}"><input type="checkbox" name="prova" value="${esc(p.id)}"><span><b>${esc(p.id)}</b> ${esc(p.titulo)}</span></label>`).join("")}</div>
  <div class="contagem" id="cont">0 de ${o.n_provas} provas marcadas</div></fieldset>
  <div class="linha-acoes"><button class="btn btn-p" id="enviar">Conferir resposta</button><button type="button" class="btn btn-g" id="dica" ${usadas >= 3 ? "disabled" : ""}>Pedir dica (${usadas}/3)</button></div>
  <div id="resp"></div>
  <div class="dicas">${o.dicas.slice(0, usadas).map((d, i) => `<div class="dica"><b>DICA ${i + 1}</b> — ${esc(d)}</div>`).join("")}</div></form></div>`;
}

function ligarForm(o) {
  const f = document.getElementById("f-obj");
  const marcadas = () => [...f.querySelectorAll('input[name="prova"]:checked')].map((i) => i.value);
  f.addEventListener("change", () => { const n = marcadas().length; document.getElementById("cont").textContent = `${n} de ${o.n_provas} provas marcadas`; });
  document.getElementById("dica").onclick = () => { S.est.dicas[o.n] = Math.min(3, (S.est.dicas[o.n] || 0) + 1); salvar(S.slug, S.est); telaPainel(); };
  f.onsubmit = async (e) => {
    e.preventDefault();
    const $r = document.getElementById("resp");
    const valores = Object.fromEntries(o.campos.map((c) => [c.id, f.querySelector(`input[name="${c.id}"]:checked`)?.value]));
    const provas = marcadas();
    if (provas.length !== o.n_provas) { $r.className = "resposta quase"; $r.textContent = `Marque exatamente ${o.n_provas} provas (você marcou ${provas.length}).`; return; }
    S.est.tentativas[o.n] = (S.est.tentativas[o.n] || 0) + 1; salvar(S.slug, S.est);
    const canon = canonResposta(o.campos.map((c) => c.id), valores, provas);
    const salt = `${S.slug}|obj${o.n}`;
    if (o.verificacao.includes(await sha(`${salt}|v|${canon}`)) && (await desbloquear(o, canon))) {
      S.est.resolvidos[o.n] = canon;
      if (!atual()) S.est.fim = Date.now();
      salvar(S.slug, S.est);
      carimbo();
      S.aba = "objetivos"; telaPainel();
      if (atual()) document.getElementById("conteudo").insertAdjacentHTML("afterbegin", `<div class="msg-ok"><b>CONFIRMADO.</b> ${esc(S.conteudos[o.n].msg)}${S.conteudos[o.n].bonus.length ? ` <a href="#" id="ver-bonus">Ver as ${S.conteudos[o.n].bonus.length} provas novas →</a>` : ""}</div>`);
      const vb = document.getElementById("ver-bonus"); if (vb) vb.onclick = (ev) => { ev.preventDefault(); S.aba = "provas"; telaPainel(); };
      return;
    }
    // resposta "quase certa"? (do mais específico para o mais geral)
    const qs = [...o.quase].sort((a, b) => b.chaves.length - a.chaves.length);
    for (const q of qs) if ((await sha(`${salt}|q|${canonCampos(q.chaves, valores)}`)) === q.h) { $r.className = "resposta quase"; $r.textContent = q.msg; return; }
    $r.className = "resposta errada"; $r.textContent = "Não é isso. Releia os documentos com calma ou peça uma dica.";
  };
}

function carimbo() {
  const el = document.createElement("div"); el.className = "selo-ok"; el.innerHTML = "<span>CONFIRMADO</span>";
  document.body.appendChild(el); setTimeout(() => el.remove(), 2300);
}

function abaProvas() {
  const $c = document.getElementById("conteudo");
  const docs = Object.keys(S.conteudos).sort().flatMap((n) => S.conteudos[n].bonus);
  if (!docs.length) { $c.innerHTML = `<div class="cartao"><p>Nenhuma prova bônus liberada ainda. Resolva o Objetivo 1 para abrir as primeiras.</p></div>`; return; }
  $c.innerHTML = `<p style="color:var(--osso-e);font-size:13px">Provas liberadas pela Central. Elas não estão no PDF.</p><div class="docs">${docs.map((p) => `<div>${renderProva(p)}<div class="doc-acoes"><button class="btn btn-g" data-imp="${esc(p.id)}">Salvar / imprimir ${esc(p.id)}</button></div></div>`).join("")}</div>`;
  $c.querySelectorAll("[data-imp]").forEach((b) => (b.onclick = () => imprimir(docs.find((p) => p.id === b.dataset.imp))));
}

function imprimir(p) {
  const w = window.open("", "_blank"); if (!w) return;
  w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${esc(p.id)} — ${esc(p.titulo)}</title><base href="${location.href.split("#")[0]}"><link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="docs.css"><style>body{margin:24px;background:#fff}</style></head><body>${renderProva(p)}<script>setTimeout(()=>print(),400)<\/script></body></html>`);
  w.document.close();
}

function abaSuspeitos() {
  document.getElementById("conteudo").innerHTML = `<div class="fichas">${S.caso.suspeitos.map((s) => `<div class="ficha">${retrato(s)}<div style="margin-top:6px"><b>${esc(s.nome)}</b>, ${esc(s.idade)}<br><span style="color:var(--osso-e)">${esc(s.relacao)}</span></div></div>`).join("")}</div>
  <p style="color:var(--osso-e);font-size:12px;margin-top:12px">Retratos falados (ilustrações). Todos os personagens são fictícios.</p>`;
}

function abaDossie() {
  document.getElementById("conteudo").innerHTML = `<p style="color:var(--osso-e);font-size:13px">Documentos que estão no seu dossiê em PDF.</p><div class="lista-pdf">${S.caso.provasPdf.map((p) => `<div><b>${esc(p.id)}</b>${esc(p.titulo)}</div>`).join("")}</div>
  <p style="margin-top:18px"><button class="btn btn-g" id="sair">Trocar de caso / sair</button></p>`;
  document.getElementById("sair").onclick = () => { location.hash = "#/"; };
}

// ── FINAL ──
function telaFinal($c) {
  const sol = S.conteudos[S.caso.objetivos.length].solucao;
  const min = Math.max(1, Math.round(((S.est.fim || Date.now()) - S.est.inicio) / 60000));
  const dicas = Object.values(S.est.dicas).reduce((a, b) => a + b, 0);
  const tent = Object.values(S.est.tentativas).reduce((a, b) => a + b, 0);
  $c.innerHTML = `<div class="msg-ok" style="font-size:16px"><b>CASO ENCERRADO.</b> Você resolveu o caso Nº ${esc(S.caso.numero)}.</div>
  <h3 style="font-family:var(--f-impacto)">Relatório do detetive</h3>
  <div class="relatorio"><div><b>${min} min</b>tempo</div><div><b>${dicas}</b>dicas usadas</div><div><b>${tent}</b>tentativas</div></div>
  <div class="linha-acoes" style="margin-bottom:18px"><button class="btn btn-p" id="compart">Baixar imagem para compartilhar</button></div>
  <article class="solucao"><h2>O que aconteceu</h2>${sol.relato.map((p) => `<p>${esc(p)}</p>`).join("")}
  <h3>A confissão</h3><div class="confissao">${esc(sol.confissao)}</div>
  <h3>Como cada pista levava à verdade</h3><ul>${sol.pistas.map(([id, t]) => `<li><b>${esc(id)}</b> — ${esc(t)}</li>`).join("")}</ul>
  <h3>Os inocentes</h3><ul>${sol.suspeitos.filter((s) => s.id !== sol.verdade.culpado).map((s) => `<li><b>${esc(s.nome)}</b> <br>Segredo: ${esc(s.segredo)}<br>Por que é inocente: ${esc(s.inocenta)}</li>`).join("")}</ul>
  <h3>Linha do tempo</h3><table class="doc-tab"><tbody>${sol.verdade.linha_do_tempo.map(([h, f]) => `<tr><td><b>${esc(h)}</b></td><td>${esc(f)}</td></tr>`).join("")}</tbody></table></article>`;
  document.getElementById("compart").onclick = () => imagemResultado(min, dicas, tent);
}

async function imagemResultado(min, dicas, tent) {
  await document.fonts.ready;
  const cv = document.createElement("canvas"); cv.width = 1080; cv.height = 1920; const g = cv.getContext("2d");
  const grad = g.createRadialGradient(540, 500, 100, 540, 900, 1200); grad.addColorStop(0, "#2A2420"); grad.addColorStop(1, "#0A0A0B"); g.fillStyle = grad; g.fillRect(0, 0, 1080, 1920);
  g.fillStyle = "#A3141C"; g.save(); g.translate(540, 470); g.rotate(-0.03); g.fillRect(-330, -10, 660, 70); g.restore();
  g.textAlign = "center"; g.fillStyle = "#ECE7DC"; g.font = "900 110px Playfair"; g.fillText("ÁLIBI", 540, 500);
  g.font = "700 34px Courier"; g.fillStyle = "#C9A227"; g.fillText("ARQUIVO ÁLIBI · CASO Nº " + S.caso.numero, 540, 620);
  g.fillStyle = "#ECE7DC"; g.font = "800 84px Mont"; g.fillText("RESOLVI", 540, 800); g.fillText("O CASO", 540, 900);
  g.font = "800 46px Mont"; wrap(g, S.caso.titulo, 540, 1010, 900, 58);
  g.font = "800 40px Inter"; g.fillStyle = "#C9A227"; g.fillText(`${min} min  ·  ${dicas} dicas  ·  ${tent} tentativas`, 540, 1230);
  g.strokeStyle = "#E0353F"; g.lineWidth = 10; g.save(); g.translate(540, 1420); g.rotate(-0.17); g.strokeRect(-260, -70, 520, 120); g.fillStyle = "#E0353F"; g.font = "400 74px Elite"; g.fillText("CONFIRMADO", 0, 12); g.restore();
  g.fillStyle = "#9C978E"; g.font = "600 34px Inter"; g.fillText("E você, resolveria?  " + (VITRINE?.perfil || "@alibi.criminal"), 540, 1640);
  const a = document.createElement("a"); a.download = `resolvi-caso-${S.caso.numero}-arquivo-alibi.png`; a.href = cv.toDataURL("image/png"); try { a.click(); } catch {}
  let im = document.getElementById("img-share");
  if (!im) { const f = document.createElement("figure"); f.style.margin = "16px 0"; f.innerHTML = '<img id="img-share" alt="Imagem para compartilhar" style="width:100%;max-width:360px;border-radius:10px;display:block;margin:0 auto"><figcaption style="text-align:center;font-size:13px;color:var(--osso-e);margin-top:8px">Se o download não começar, toque e segure (ou clique com o botão direito) na imagem para salvar.</figcaption>'; document.getElementById("app").appendChild(f); im = document.getElementById("img-share"); }
  im.src = a.href; im.scrollIntoView({ behavior: "smooth", block: "center" });
}
function wrap(g, txt, x, y, max, lh) { const ps = txt.split(" "); let l = ""; for (const p of ps) { const t = l ? l + " " + p : p; if (g.measureText(t).width > max && l) { g.fillText(l, x, y); y += lh; l = p; } else l = t; } g.fillText(l, x, y); }

// ── rotas: #/  ·  #/caso/<slug>  ·  ?c=CODIGO (QR code) ──
async function rota() {
  const params = new URLSearchParams(location.search);
  const cod = params.get("c");
  if (cod) {
    const v = await vitrine(); const pre = normCodigo(cod).slice(0, -4);
    const c = v.casos.find((x) => x.disponivel && normCodigo(x.prefixo) === pre);
    history.replaceState(null, "", location.pathname + (c ? `#/caso/${c.slug}` : "#/"));
    if (c) return telaEntrada(c.slug, cod);
  }
  const m = location.hash.match(/^#\/caso\/([\w-]+)/);
  if (m) { if (S.slug === m[1] && S.caso) return telaPainel(); return telaEntrada(m[1]); }
  S.slug = null; S.caso = null; telaHome();
}
window.addEventListener("hashchange", rota);
rota();
