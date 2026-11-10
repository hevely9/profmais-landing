/* Portal Clodoaldo Rodrigues: scripts públicos.
   Todo o conteúdo vem de data/*.json. Nada é inventado: campos vazios somem da tela.
   Todo texto injetado passa por esc(); todo link por safeHref(). */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  // ---------- utilidades ----------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (v) => String(v == null ? "" : v).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const isUrl = (v) => /^https?:\/\//i.test(String(v || ""));
  const safeHref = (v) => {
    const s = String(v || "").trim();
    if (!s) return "";
    if (isUrl(s)) return s;
    if (/^[a-z][a-z0-9+.-]*:/i.test(s) || s.startsWith("//")) return ""; // bloqueia javascript:, data:, etc.
    return s;
  };
  const numValue = (n) => { const m = String(n || "").match(/\d+/); return m ? parseInt(m[0], 10) : 0; };
  const BASE = location.pathname.replace(/[^/]*$/, ""); // pasta do portal, ex.: /clodoaldo/

  const ICON = {
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>',
    external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4 10 14M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Zm-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88Zm8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.17-3.48-8.42Z"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5"/></svg>'
  };

  async function getJSON(path, fallback) {
    try {
      const r = await fetch(path, { cache: "no-cache" });
      if (!r.ok) throw new Error(r.status);
      return await r.json();
    } catch (e) {
      console.warn("Falha ao carregar", path, e);
      return fallback;
    }
  }

  function toast(msg) {
    const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 3200);
  }

  // ---------- projetos: ordenação, situação, datas ----------
  function sortProjects(list) {
    return list.slice().sort((a, b) =>
      (numValue(b.ano) - numValue(a.ano)) ||
      String(b.dataApresentacao || "").localeCompare(String(a.dataApresentacao || "")) ||
      (numValue(b.numero) - numValue(a.numero)));
  }
  function statusClass(s) {
    const t = norm(s);
    if (!t) return "";
    if (/(inconstitucional|arquivad|retirad|vetad|rejeitad|prejudicad)/.test(t)) return "off";
    if (/(aprovad|sancionad|promulgad|lei n|transformad|autografo)/.test(t)) return "ok";
    return "warn";
  }
  function statusLabel(p) {
    // Texto curto e compreensível para o cidadão; o termo oficial fica na página de detalhe.
    const t = norm(p.situacao);
    if (/autografo/.test(t)) return "Aprovado";
    if (/inconstitucional/.test(t)) return "Rejeitado na CCJR";
    return p.situacao || "";
  }
  function fmtDate(iso, long) {
    if (!iso) return "";
    const d = new Date(String(iso).length === 10 ? iso + "T12:00:00" : iso);
    if (isNaN(d)) return esc(iso);
    return d.toLocaleDateString("pt-BR", long ? { day: "numeric", month: "long", year: "numeric" } : { day: "2-digit", month: "short", year: "numeric" }).replace(".", "");
  }
  const projTitle = (p) => `${p.tipo || "Proposição"} nº ${p.numero}/${p.ano}`;
  const projUrl = (p) => `projeto.html?id=${encodeURIComponent(p.id)}`;
  const pdfName = (p) => norm([p.tipo, p.numero, p.ano].filter(Boolean).join("-")).replace(/[^a-z0-9-]+/g, "-") + ".pdf";

  function cardHTML(p) {
    const pdf = safeHref(p.pdf);
    const st = p.situacao ? `<span class="status ${statusClass(p.situacao)}">${esc(statusLabel(p))}</span>` : "";
    const date = p.dataApresentacao ? `<span>${ICON.calendar}${fmtDate(p.dataApresentacao)}</span>` : "";
    return `<article class="pcard reveal">
      <div class="pcard-top"><span class="pcard-kind">${esc(p.tipo || "Proposição")}</span>${st}</div>
      <h3 class="pcard-num">Nº ${esc(p.numero)}<small>/${esc(p.ano)}</small></h3>
      <p class="pcard-title"><a href="${projUrl(p)}">${esc(p.ementa)}</a></p>
      ${date ? `<div class="pcard-meta">${date}</div>` : ""}
      <div class="pcard-actions">
        <a class="btn btn-outline btn-sm" href="${projUrl(p)}">Ver detalhes ${ICON.arrow}</a>
        ${pdf ? `<a class="btn btn-primary btn-sm btn-icon" href="${esc(pdf)}" ${isUrl(pdf) ? 'target="_blank" rel="noopener"' : `download="${esc(pdfName(p))}"`} aria-label="Baixar PDF do ${esc(projTitle(p))}" title="Baixar PDF">${ICON.download}</a>` : ""}
      </div>
    </article>`;
  }
  function emptyHTML(cfg, filtered) {
    if (filtered) {
      return `<div class="empty"><div class="ic">${ICON.search}</div><h3>Nenhum projeto encontrado</h3>
        <p>Tente outro número, ano ou palavra. Exemplos: <em>saúde</em>, <em>2025</em>, <em>27/2026</em>.</p>
        <button class="btn btn-outline" type="button" data-clear>Limpar busca</button></div>`;
    }
    const aleac = safeHref(cfg.aleacProjetosUrl || cfg.aleacUrl);
    return `<div class="empty"><div class="ic">${ICON.file}</div><h3>Biblioteca em atualização</h3>
      <p>Os projetos estão sendo reunidos a partir da fonte oficial da Assembleia Legislativa do Acre.</p>
      ${aleac ? `<a class="btn btn-primary" href="${esc(aleac)}" target="_blank" rel="noopener">${ICON.external}Consultar na ALEAC</a>` : ""}</div>`;
  }

  // ---------- comum ----------
  let io;
  function observeReveal(root = document) {
    const els = $$(".reveal:not(.is-in)", root);
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-in")); return; }
    io = io || new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    els.forEach((e) => io.observe(e));
  }
  function applyConfig(cfg) {
    $$("[data-link]").forEach((a) => {
      const key = a.dataset.link;
      let href = safeHref(cfg[key]);
      if (!href && key === "aleacProjetosUrl") href = safeHref(cfg.aleacUrl);
      if (href) a.href = href; else (a.closest("li") || a).hidden = true;
    });
    const y = $("#year"); if (y) y.textContent = new Date().getFullYear();
  }
  function markCurrent() {
    const file = location.pathname.split("/").pop() || "index.html";
    $$(".nav a, .tabbar a").forEach((a) => {
      const href = a.getAttribute("href") || "";
      const target = href.split("?")[0];
      const match = target === file || (file === "projeto.html" && target === "projetos.html");
      if (match) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }
  function initOffline() {
    const set = () => document.documentElement.classList.toggle("is-offline", navigator.onLine === false);
    window.addEventListener("online", set); window.addEventListener("offline", set); set();
  }
  function initSW() {
    if (!("serviceWorker" in navigator) || location.protocol !== "https:" && location.hostname !== "localhost") return;
    window.addEventListener("load", () => { navigator.serviceWorker.register(BASE + "sw.js", { scope: BASE }).catch(() => {}); });
  }
  // ---------- início ----------
  async function initHome(cfg) {
    const [projetos, dep] = await Promise.all([getJSON("data/projetos.json", []), getJSON("data/deputado.json", {})]);
    const all = sortProjects(Array.isArray(projetos) ? projetos : []);
    const grid = $("#recentes");
    if (grid) { grid.innerHTML = all.length ? all.slice(0, 3).map(cardHTML).join("") : emptyHTML(cfg, false); observeReveal(grid); }
    const stats = $("#hero-stats");
    if (stats && all.length) {
      const anos = all.map((p) => numValue(p.ano)).filter(Boolean);
      const aprov = all.filter((p) => statusClass(p.situacao) === "ok").length;
      const ini = Math.min(...anos), fim = Math.max(...anos);
      stats.innerHTML = `
        <div class="hero-stat"><b>${all.length}</b><span>projetos de lei apresentados</span></div>
        <div class="hero-stat"><b>${aprov}</b><span>aprovados pela Assembleia</span></div>
        <div class="hero-stat"><b>${fim - ini + 1}</b><span>anos de atuação, de ${ini} a ${fim}</span></div>`;
    } else if (stats) { stats.hidden = true; }
    const resumo = $("#sobre-resumo");
    if (resumo) { if (dep.resumo) resumo.textContent = dep.resumo; else resumo.hidden = true; }
    if (/^assets\/img\/[A-Za-z0-9._-]+\.(jpe?g|png|webp)$/i.test(dep.foto || "")) $$("[data-foto]").forEach((img) => { img.src = dep.foto; img.removeAttribute("srcset"); });
  }

  // ---------- biblioteca ----------
  async function initLibrary(cfg) {
    const lista = $("#lista"), count = $("#contagem"), fq = $("#q"), clear = $("#q-clear"), nav = $("#year-nav");
    const all = sortProjects((await getJSON("data/projetos.json", [])) || []);
    all.forEach((p) => {
      p._search = norm([p.tipo, p.numero, p.ano, `${p.numero}/${p.ano}`, `${p.numero}-${p.ano}`, `pl ${p.numero}`, p.ementa, p.descricao, p.situacao, statusLabel(p), p.resultado, (p.palavrasChave || []).join(" ")].join(" "));
    });
    fq.value = new URLSearchParams(location.search).get("q") || "";

    function render() {
      const terms = norm(fq.value).split(/\s+/).filter(Boolean);
      const found = all.filter((p) => terms.every((t) => p._search.includes(t)));
      clear.hidden = !fq.value;
      if (!found.length) {
        lista.innerHTML = `<div class="cards">${emptyHTML(cfg, terms.length > 0 && all.length > 0)}</div>`;
        nav.hidden = true;
      } else {
        const groups = [];
        found.forEach((p) => { const k = p.ano || "Sem ano"; let g = groups.find((x) => x.ano === k); if (!g) groups.push(g = { ano: k, itens: [] }); g.itens.push(p); });
        lista.innerHTML = groups.map((g) => `<section class="year-group" id="ano-${esc(g.ano)}" aria-labelledby="t-${esc(g.ano)}">
          <h2 class="year-title" id="t-${esc(g.ano)}">${esc(g.ano)} <span>${g.itens.length} ${g.itens.length === 1 ? "projeto" : "projetos"}</span></h2>
          <div class="cards">${g.itens.map(cardHTML).join("")}</div></section>`).join("");
        nav.hidden = groups.length < 2;
        nav.querySelector(".scroller").innerHTML = groups.map((g, i) => `<a href="#ano-${esc(g.ano)}" class="${i === 0 ? "active" : ""}">${esc(g.ano)} <small>${g.itens.length}</small></a>`).join("");
      }
      observeReveal(lista);
      count.innerHTML = all.length ? (terms.length ? `<strong>${found.length}</strong> de ${all.length} projetos encontrados para “${esc(fq.value.trim())}”` : `<strong>${all.length}</strong> projetos de lei, do mais recente ao mais antigo`) : "";
      history.replaceState(null, "", location.pathname + (fq.value.trim() ? "?q=" + encodeURIComponent(fq.value.trim()) : ""));
      watchYears();
    }
    let yearObs;
    function watchYears() {
      if (yearObs) yearObs.disconnect();
      if (!("IntersectionObserver" in window)) return;
      yearObs = new IntersectionObserver((ents) => {
        ents.forEach((en) => { if (en.isIntersecting) $$("a", nav).forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id)); });
      }, { rootMargin: "-35% 0px -55% 0px" });
      $$(".year-group", lista).forEach((s) => yearObs.observe(s));
    }
    let t;
    fq.addEventListener("input", () => { clearTimeout(t); t = setTimeout(render, 140); });
    $("#busca").addEventListener("submit", (e) => { e.preventDefault(); render(); fq.blur(); });
    clear.addEventListener("click", () => { fq.value = ""; render(); fq.focus(); });
    document.addEventListener("click", (e) => { if (e.target.closest("[data-clear]")) { fq.value = ""; render(); fq.focus(); } });
    render();
  }

  // ---------- detalhe do projeto ----------
  async function initDetail(cfg) {
    const id = new URLSearchParams(location.search).get("id") || "";
    const all = sortProjects((await getJSON("data/projetos.json", [])) || []);
    const p = all.find((x) => x.id === id);
    const root = $("#detalhe");
    if (!p) {
      root.innerHTML = `<div class="container section"><div class="empty"><div class="ic">${ICON.search}</div><h3>Projeto não encontrado</h3>
        <p>O link pode estar incompleto ou o projeto foi removido da biblioteca.</p><a class="btn btn-primary" href="projetos.html">Ver todos os projetos</a></div></div>`;
      return;
    }
    const title = projTitle(p);
    document.title = `${title} · Clodoaldo Rodrigues`;
    const md = $('meta[name="description"]'); if (md) md.content = p.ementa;
    const og = $('meta[property="og:title"]'); if (og) og.content = `${title}: ${p.ementa}`;
    const pdf = safeHref(p.pdf), oficial = safeHref(p.linkOficial);
    const shareUrl = location.origin + BASE + projUrl(p);
    const shareText = `${title}\n${p.ementa}\n\nBaixe o documento oficial:\n${shareUrl}`;
    const meta = [
      ["Situação oficial", p.situacao], ["Resultado", p.resultado], ["Apresentação", fmtDate(p.dataApresentacao, true)],
      ["Votação", fmtDate(p.dataVotacao, true)], ["Última tramitação", fmtDate(p.dataUltimaTramitacao, true)], ["Localização atual", p.localizacaoAtual], ["Autor", "Deputado Clodoaldo Rodrigues"]
    ].filter(([, v]) => v);
    const related = all.filter((x) => x.id !== p.id).map((x) => ({ x, s: (x.palavrasChave || []).filter((k) => (p.palavrasChave || []).includes(k)).length * 3 + (x.ano === p.ano ? 1 : 0) }))
      .sort((a, b) => b.s - a.s).slice(0, 3).map((r) => r.x);

    root.innerHTML = `
      <section class="page-hero detail-hero"><div class="container">
        <nav class="crumbs" aria-label="Você está em"><a href="index.html">Início</a> / <a href="projetos.html">Projetos de lei</a> / <span>${esc(p.ano)}</span></nav>
        <div class="kind">${esc(p.tipo || "Proposição")}</div>
        <h1>Nº ${esc(p.numero)}<em>/${esc(p.ano)}</em></h1>
        <p class="ementa">${esc(p.ementa)}</p>
        ${p.situacao ? `<span class="status ${statusClass(p.situacao)}">${esc(statusLabel(p))}</span>` : ""}
      </div></section>
      <div class="container detail-grid">
        <div class="detail-main">
          ${p.descricao ? `<section class="panel"><h2>Em resumo</h2><div class="prose"><p>${esc(p.descricao)}</p></div></section>` : ""}
          ${pdf ? `<section class="panel"><h2>Documento oficial</h2>
            <iframe class="pdf-viewer" src="${esc(pdf)}#view=FitH" title="Texto do ${esc(title)} em PDF" loading="lazy"></iframe>
            <p class="pdf-fallback">Se o documento não aparecer acima, use o botão “Baixar PDF”.</p></section>` : ""}
          ${(p.palavrasChave || []).length ? `<section class="panel"><h2>Temas</h2><div class="chips">${p.palavrasChave.map((k) => `<a class="chip" href="projetos.html?q=${encodeURIComponent(k)}">${esc(k)}</a>`).join("")}</div></section>` : ""}
        </div>
        <aside class="detail-side">
          <section class="panel"><h2>Acesso rápido</h2><div class="detail-actions">
            ${pdf ? `<a class="btn btn-primary" href="${esc(pdf)}" ${isUrl(pdf) ? 'target="_blank" rel="noopener"' : `download="${esc(pdfName(p))}"`}>${ICON.download}Baixar PDF</a>` : ""}
            <a class="btn btn-wa" href="https://wa.me/?text=${encodeURIComponent(shareText)}" target="_blank" rel="noopener">${ICON.whatsapp}Compartilhar no WhatsApp</a>
            <button class="btn btn-outline" type="button" id="copiar">${ICON.link}Copiar link</button>
            ${oficial ? `<a class="btn btn-outline" href="${esc(oficial)}" target="_blank" rel="noopener">${ICON.external}Ver tramitação na ALEAC</a>` : ""}
          </div></section>
          <section class="panel"><h2>Ficha</h2><dl class="meta-list">${meta.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl></section>
        </aside>
      </div>
      ${related.length ? `<section class="section container"><div class="section-head"><div><span class="eyebrow">Veja também</span><h2 class="section-title">Projetos relacionados</h2></div><a class="btn btn-outline" href="projetos.html">Todos os projetos ${ICON.arrow}</a></div><div class="cards">${related.map(cardHTML).join("")}</div></section>` : ""}`;
    observeReveal(root);
    $("#copiar").addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(shareUrl); toast("Link copiado."); }
      catch { prompt("Copie o link:", shareUrl); }
    });
    // Dados estruturados para buscadores
    const ld = document.createElement("script"); ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "Legislation", name: title, legislationIdentifier: `${p.numero}/${p.ano}`,
      description: p.ementa, dateCreated: p.dataApresentacao || undefined, legislationType: p.tipo, inLanguage: "pt-BR",
      legislationPassedBy: { "@type": "GovernmentOrganization", name: "Assembleia Legislativa do Estado do Acre" },
      author: { "@type": "Person", name: "Clodoaldo Rodrigues" }, url: shareUrl, encoding: pdf ? { "@type": "MediaObject", contentUrl: location.origin + BASE + pdf, encodingFormat: "application/pdf" } : undefined });
    document.head.appendChild(ld);
  }

  // ---------- página do deputado ----------
  async function initProfile() {
    const [dep, projetos] = await Promise.all([getJSON("data/deputado.json", {}), getJSON("data/projetos.json", [])]);
    const paras = (txt) => String(txt || "").split(/\n{2,}/).map((s) => s.trim()).filter(Boolean).map((s) => `<p>${esc(s)}</p>`).join("");
    const fill = (block, id, html) => {
      const sec = document.getElementById(block), el = document.getElementById(id);
      if (!sec || !el) return;
      if (html) { el.innerHTML = html; sec.hidden = false; } else { sec.hidden = true; const a = $(`.toc a[href="#${block}"]`); if (a) a.hidden = true; }
    };
    if (/^assets\/img\/[A-Za-z0-9._-]+\.(jpe?g|png|webp)$/i.test(dep.foto || "")) $$("[data-foto]").forEach((img) => { img.src = dep.foto; img.removeAttribute("srcset"); });
    if (dep.nomeCompleto) { const el = $("#nome-completo"); if (el) el.innerHTML = `Nome completo: <strong>${esc(dep.nomeCompleto)}</strong>`; }
    const linha = [dep.cargo, dep.partido, dep.estado].filter(Boolean).map(esc).join(" · ");
    if (linha) { const el = $("#cargo-linha"); if (el) el.innerHTML = linha; }
    fill("apresentacao", "bio-apresentacao", paras(dep.biografia));
    fill("pessoal", "bio-pessoal", paras(dep.trajetoriaPessoal));
    const tp = Array.isArray(dep.trajetoriaPolitica) ? dep.trajetoriaPolitica.filter((i) => i && (i.periodo || i.descricao)) : [];
    fill("politica", "bio-politica", tp.length ? `<ol class="timeline">${tp.map((i) => `<li><div class="when">${esc(i.periodo)}</div><div class="what">${esc(i.descricao)}</div></li>`).join("")}</ol>` : "");
    const list = Array.isArray(projetos) ? projetos : [];
    const atu = [];
    if (dep.atuacaoParlamentar) atu.push(paras(dep.atuacaoParlamentar));
    if (list.length) {
      const anos = list.map((p) => numValue(p.ano)).filter(Boolean), aprov = list.filter((p) => statusClass(p.situacao) === "ok").length;
      atu.push(`<div class="stat-row"><div class="stat"><b>${list.length}</b><span>projetos de lei apresentados</span></div><div class="stat"><b>${aprov}</b><span>aprovados pela Assembleia</span></div><div class="stat"><b>${Math.min(...anos)} a ${Math.max(...anos)}</b><span>período com projetos na biblioteca</span></div></div>`);
    }
    fill("atuacao", "bio-atuacao", atu.join(""));
    const dest = Array.isArray(dep.destaques) ? dep.destaques.filter(Boolean) : [];
    fill("destaques", "bio-destaques", dest.length ? `<ol class="timeline">${dest.map((d) => `<li><div class="what">${esc(d)}</div></li>`).join("")}</ol>` : "");
    const fontes = Array.isArray(dep.fontes) ? dep.fontes.filter((f) => f && safeHref(f.url)) : [];
    const fEl = $("#bio-fontes");
    if (fEl && fontes.length) { fEl.innerHTML = `<h3>Fontes consultadas</h3><ul>${fontes.map((f) => `<li><a href="${esc(safeHref(f.url))}" target="_blank" rel="noopener">${esc(f.titulo || f.url)}</a></li>`).join("")}</ul>`; fEl.hidden = false; }
    const links = $$(".toc a:not([hidden])");
    links.forEach((a, i) => a.classList.toggle("active", i === 0));
    if ("IntersectionObserver" in window && links.length) {
      const obs = new IntersectionObserver((ents) => { ents.forEach((en) => { if (en.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id)); }); }, { rootMargin: "-30% 0px -60% 0px" });
      $$(".bio-block:not([hidden])").forEach((s) => obs.observe(s));
    }
  }

  // ---------- inicialização ----------
  document.addEventListener("DOMContentLoaded", async () => {
    markCurrent(); initOffline(); initSW(); observeReveal();
    const cfg = (await getJSON("data/config.json", {})) || {};
    applyConfig(cfg);
    const page = document.body.dataset.page;
    if (page === "home") initHome(cfg);
    if (page === "projetos") initLibrary(cfg);
    if (page === "projeto") initDetail(cfg);
    if (page === "deputado") initProfile();
  });
})();
