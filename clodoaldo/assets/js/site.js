/* Portal Clodoaldo Rodrigues — scripts públicos
   Os dados vêm de data/*.json. Nada aqui gera ou inventa conteúdo:
   quando um campo está vazio, a página mostra um estado "em preparação". */
(function () {
  "use strict";
  document.documentElement.classList.remove("no-js");

  // ---------- utilidades ----------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (v) => String(v == null ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const norm = (v) => String(v == null ? "" : v).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const isUrl = (v) => /^https?:\/\//i.test(String(v || ""));
  const safeHref = (v) => {
    const s = String(v || "").trim();
    if (!s) return "";
    if (isUrl(s)) return s;
    if (/^[a-z]+:/i.test(s)) return ""; // bloqueia javascript:, data: etc.
    return s;
  };

  const ICON = {
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>',
    external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
    library: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2Z"/><path d="M4 19a2 2 0 0 1 2-2h12"/><path d="M9 7h6M9 11h4"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    arrow: '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };

  async function getJSON(path, fallback) {
    try {
      const r = await fetch(path + (path.includes("?") ? "&" : "?") + "v=" + Date.now().toString(36).slice(0, -3), { cache: "no-cache" });
      if (!r.ok) throw new Error(r.status);
      return await r.json();
    } catch (e) {
      console.warn("Não foi possível carregar", path, e);
      return fallback;
    }
  }

  // ---------- projetos ----------
  function numValue(n) { const m = String(n || "").match(/\d+/); return m ? parseInt(m[0], 10) : 0; }
  function sortProjects(list) {
    return list.slice().sort((a, b) =>
      (numValue(b.ano) - numValue(a.ano)) ||
      String(b.dataApresentacao || "").localeCompare(String(a.dataApresentacao || "")) ||
      (numValue(b.numero) - numValue(a.numero)));
  }
  function statusClass(s) {
    const t = norm(s);
    if (!t) return "";
    if (/(aprovad|sancionad|promulgad|lei n|transformad)/.test(t)) return "ok";
    if (/(arquivad|retirad|vetad|rejeitad|prejudicad)/.test(t)) return "off";
    return "warn";
  }
  function fmtDate(iso) {
    if (!iso) return "";
    const d = new Date(iso + (iso.length === 10 ? "T12:00:00" : ""));
    return isNaN(d) ? esc(iso) : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  }
  function fileName(p) {
    const base = [p.tipo, p.numero, p.ano].filter(Boolean).join("-");
    return norm(base).replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-") + ".pdf";
  }

  function cardHTML(p) {
    const pdf = safeHref(p.pdf);
    const oficial = safeHref(p.linkOficial);
    const num = p.numero ? `Nº ${esc(p.numero)}${p.ano ? `<small>/${esc(p.ano)}</small>` : ""}` : esc(p.ano || "");
    const st = p.situacao ? `<span class="status ${statusClass(p.situacao)}">${esc(p.situacao)}</span>` : "";
    const meta = [];
    if (p.dataApresentacao) meta.push(`<span>${ICON.calendar}Apresentado em ${fmtDate(p.dataApresentacao)}</span>`);
    else if (p.ano) meta.push(`<span>${ICON.calendar}${esc(p.ano)}</span>`);
    const actions = [];
    if (pdf) actions.push(`<a class="btn btn-primary btn-sm" href="${esc(pdf)}" ${isUrl(pdf) ? 'target="_blank" rel="noopener"' : `download="${esc(fileName(p))}"`} aria-label="Baixar ${esc(p.tipo || "projeto")} ${esc(p.numero || "")}/${esc(p.ano || "")} em PDF">${ICON.download}Baixar projeto</a>`);
    if (oficial) actions.push(`<a class="btn btn-outline btn-sm" href="${esc(oficial)}" target="_blank" rel="noopener" aria-label="Consultar na ALEAC (abre em nova aba)">${ICON.external}Ver na ALEAC</a>`);
    return `<article class="pcard reveal">
      <div class="pcard-top"><span class="pcard-type">${esc(p.tipo || "Proposição")}</span>${st}</div>
      <h3 class="pcard-num">${num}</h3>
      ${p.ementa ? `<p class="pcard-ementa">${esc(p.ementa)}</p>` : ""}
      ${p.descricao ? `<p class="pcard-desc">${esc(p.descricao)}</p>` : ""}
      ${meta.length ? `<div class="pcard-meta">${meta.join("")}</div>` : ""}
      ${actions.length ? `<div class="pcard-actions">${actions.join("")}</div>` : ""}
    </article>`;
  }

  function emptyHTML(cfg, filtered) {
    if (filtered) {
      return `<div class="empty"><div class="ic">${ICON.file}</div>
        <h3>Nenhum documento encontrado</h3>
        <p>Tente outro número, ano ou palavra-chave, ou limpe os filtros para ver toda a biblioteca.</p>
        <button class="btn btn-outline" type="button" data-clear>Limpar filtros</button></div>`;
    }
    const aleac = safeHref(cfg.aleacProjetosUrl || cfg.aleacUrl);
    return `<div class="empty"><div class="ic">${ICON.library}</div>
      <h3>Biblioteca em atualização</h3>
      <p>Os projetos de lei estão sendo reunidos a partir da fonte oficial da Assembleia Legislativa do Acre e serão publicados aqui em breve.</p>
      ${aleac ? `<a class="btn btn-primary" href="${esc(aleac)}" target="_blank" rel="noopener">${ICON.external}Consultar na ALEAC</a>` : ""}</div>`;
  }

  // ---------- comum: menu, links, revelação ----------
  function initMenu() {
    const btn = $(".menu-toggle"), nav = $("#nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open);
    });
    $$("a", nav).forEach((a) => a.addEventListener("click", () => { nav.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); }));
  }

  let io;
  function observeReveal(root = document) {
    const els = $$(".reveal:not(.is-in)", root);
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-in")); return; }
    io = io || new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    els.forEach((e) => io.observe(e));
  }

  function applyConfig(cfg) {
    $$("[data-link]").forEach((a) => {
      const href = safeHref(cfg[a.dataset.link]) || (a.dataset.link === "aleacProjetosUrl" ? safeHref(cfg.aleacUrl) : "");
      if (href) a.href = href; else (a.closest("li") || a).hidden = true;
    });
    const y = $("#year"); if (y) y.textContent = new Date().getFullYear();
  }

  // ---------- página inicial ----------
  async function initHome(cfg) {
    const [projetos, dep] = await Promise.all([getJSON("data/projetos.json", []), getJSON("data/deputado.json", {})]);
    const sorted = sortProjects(Array.isArray(projetos) ? projetos : []);
    const grid = $("#recentes");
    if (grid) {
      grid.innerHTML = sorted.length ? sorted.slice(0, 3).map(cardHTML).join("") : emptyHTML(cfg, false);
      observeReveal(grid);
    }
    const total = $("#total-docs");
    if (total) {
      if (sorted.length) {
        const anos = new Set(sorted.map((p) => p.ano).filter(Boolean));
        total.innerHTML = `<strong>${sorted.length}</strong> ${sorted.length === 1 ? "documento" : "documentos"}<br>${anos.size} ${anos.size === 1 ? "ano" : "anos"} de atuação`;
      } else {
        total.innerHTML = "<strong>Acesso livre</strong>Documentos oficiais em PDF";
      }
    }
    const resumo = $("#sobre-resumo");
    if (resumo) {
      resumo.innerHTML = dep.resumo
        ? `<p>${esc(dep.resumo)}</p>`
        : `<span class="pending">${ICON.clock}Apresentação oficial em preparação.</span>`;
    }
    if (dep.foto) $$("[data-foto]").forEach((img) => { img.src = dep.foto; });
  }

  // ---------- biblioteca ----------
  async function initLibrary(cfg) {
    const PAGE = 12;
    const grid = $("#lista"), count = $("#contagem"), chips = $("#chips"), more = $("#mais");
    const fq = $("#q"), fano = $("#f-ano"), ftipo = $("#f-tipo"), fsit = $("#f-situacao"), ford = $("#f-ordem");
    const all = sortProjects((await getJSON("data/projetos.json", [])) || []);
    let shown = PAGE, current = [];

    const uniq = (k) => Array.from(new Set(all.map((p) => p[k]).filter(Boolean)));
    const fill = (sel, values, label) => {
      sel.innerHTML = `<option value="">${label}</option>` + values.map((v) => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
    };
    fill(fano, uniq("ano").sort((a, b) => numValue(b) - numValue(a)), "Todos os anos");
    fill(ftipo, uniq("tipo").sort((a, b) => a.localeCompare(b, "pt-BR")), "Todos os tipos");
    fill(fsit, uniq("situacao").sort((a, b) => a.localeCompare(b, "pt-BR")), "Todas as situações");
    [fano, ftipo, fsit].forEach((s) => { s.disabled = s.options.length <= 1; });

    // estado inicial a partir da URL (links compartilháveis)
    const params = new URLSearchParams(location.search);
    fq.value = params.get("q") || "";
    [["ano", fano], ["tipo", ftipo], ["situacao", fsit], ["ordem", ford]].forEach(([k, el]) => { if (params.get(k)) el.value = params.get(k); });

    all.forEach((p) => {
      p._search = norm([p.tipo, p.numero, p.ano, `${p.numero}/${p.ano}`, `${p.numero}-${p.ano}`, p.ementa, p.descricao, p.situacao, (p.palavrasChave || []).join(" ")].join(" "));
    });

    function apply(resetPage) {
      if (resetPage) shown = PAGE;
      const terms = norm(fq.value).split(/\s+/).filter(Boolean);
      current = all.filter((p) =>
        (!fano.value || String(p.ano) === fano.value) &&
        (!ftipo.value || p.tipo === ftipo.value) &&
        (!fsit.value || p.situacao === fsit.value) &&
        terms.every((t) => p._search.includes(t)));
      if (ford.value === "antigos") current.reverse();

      const filtered = !!(terms.length || fano.value || ftipo.value || fsit.value);
      grid.innerHTML = current.length ? current.slice(0, shown).map(cardHTML).join("") : emptyHTML(cfg, filtered && all.length > 0);
      observeReveal(grid);
      count.innerHTML = all.length
        ? `<strong>${current.length}</strong> de ${all.length} ${all.length === 1 ? "documento" : "documentos"}`
        : "";
      more.hidden = current.length <= shown;
      more.querySelector("span").textContent = `Carregar mais (${current.length - shown} restantes)`;

      const c = [];
      if (terms.length) c.push(["q", `“${fq.value.trim()}”`]);
      if (fano.value) c.push(["ano", fano.value]);
      if (ftipo.value) c.push(["tipo", ftipo.value]);
      if (fsit.value) c.push(["situacao", fsit.value]);
      chips.innerHTML = c.map(([k, v]) => `<button class="chip" type="button" data-chip="${k}" aria-label="Remover filtro ${esc(v)}">${esc(v)}${ICON.x}</button>`).join("");

      const qs = new URLSearchParams();
      if (fq.value.trim()) qs.set("q", fq.value.trim());
      if (fano.value) qs.set("ano", fano.value);
      if (ftipo.value) qs.set("tipo", ftipo.value);
      if (fsit.value) qs.set("situacao", fsit.value);
      if (ford.value !== "recentes") qs.set("ordem", ford.value);
      history.replaceState(null, "", location.pathname + (qs.toString() ? "?" + qs : ""));
    }

    let t;
    fq.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => apply(true), 160); });
    $("#busca").addEventListener("submit", (e) => { e.preventDefault(); apply(true); });
    [fano, ftipo, fsit, ford].forEach((s) => s.addEventListener("change", () => apply(true)));
    more.addEventListener("click", () => { shown += PAGE; apply(false); });
    document.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-chip]");
      if (chip) {
        const k = chip.dataset.chip;
        ({ q: fq, ano: fano, tipo: ftipo, situacao: fsit })[k].value = "";
        apply(true);
      }
      if (e.target.closest("[data-clear]")) { fq.value = ""; fano.value = ftipo.value = fsit.value = ""; apply(true); fq.focus(); }
    });
    apply(true);
  }

  // ---------- página do deputado ----------
  async function initProfile() {
    const [dep, projetos] = await Promise.all([getJSON("data/deputado.json", {}), getJSON("data/projetos.json", [])]);
    const pending = (txt) => `<span class="pending">${ICON.clock}${txt || "Informação oficial em preparação."}</span>`;
    const paras = (txt) => String(txt || "").split(/\n{2,}|\r\n\r\n/).map((p) => `<p>${esc(p.trim())}</p>`).join("");
    const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

    if (dep.foto) $$("[data-foto]").forEach((img) => { img.src = dep.foto; });
    if (dep.nomeCompleto) set("nome-completo", `Nome completo: <strong>${esc(dep.nomeCompleto)}</strong>`);
    const linha = [dep.cargo, dep.partido, dep.estado].filter(Boolean).map(esc).join(" · ");
    if (linha) set("cargo-linha", linha);

    set("bio-apresentacao", dep.biografia ? paras(dep.biografia) : pending());
    set("bio-pessoal", dep.trajetoriaPessoal ? paras(dep.trajetoriaPessoal) : pending());
    const tp = Array.isArray(dep.trajetoriaPolitica) ? dep.trajetoriaPolitica.filter((i) => i && (i.periodo || i.descricao)) : [];
    set("bio-politica", tp.length
      ? `<ol class="timeline">${tp.map((i) => `<li><div class="when">${esc(i.periodo)}</div><div class="what">${esc(i.descricao)}</div></li>`).join("")}</ol>`
      : pending());

    const list = Array.isArray(projetos) ? projetos : [];
    const atu = [];
    if (dep.atuacaoParlamentar) atu.push(paras(dep.atuacaoParlamentar));
    if (list.length) {
      const anos = new Set(list.map((p) => p.ano).filter(Boolean));
      const tipos = new Set(list.map((p) => p.tipo).filter(Boolean));
      atu.push(`<div class="stat-row">
        <div class="stat"><b>${list.length}</b><span>proposições na biblioteca</span></div>
        <div class="stat"><b>${anos.size}</b><span>${anos.size === 1 ? "ano" : "anos"} com documentos</span></div>
        <div class="stat"><b>${tipos.size}</b><span>${tipos.size === 1 ? "tipo de proposição" : "tipos de proposição"}</span></div></div>`);
    }
    const areas = Array.isArray(dep.areasDeAtuacao) ? dep.areasDeAtuacao.filter(Boolean) : [];
    if (areas.length) atu.push(`<div class="tags">${areas.map((a) => `<span class="tag">${esc(a)}</span>`).join("")}</div>`);
    set("bio-atuacao", atu.length ? atu.join("") : pending());

    const dest = Array.isArray(dep.destaques) ? dep.destaques.filter(Boolean) : [];
    set("bio-destaques", dest.length ? `<ol class="timeline">${dest.map((d) => `<li><div class="what">${esc(d)}</div></li>`).join("")}</ol>` : pending());

    // índice ativo conforme rolagem
    const links = $$(".toc a");
    if ("IntersectionObserver" in window && links.length) {
      const obs = new IntersectionObserver((ents) => {
        ents.forEach((en) => {
          if (en.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
        });
      }, { rootMargin: "-30% 0px -60% 0px" });
      $$(".bio-block").forEach((s) => obs.observe(s));
    }
  }

  // ---------- inicialização ----------
  document.addEventListener("DOMContentLoaded", async () => {
    initMenu();
    observeReveal();
    const cfg = (await getJSON("data/config.json", {})) || {};
    applyConfig(cfg);
    const page = document.body.dataset.page;
    if (page === "home") initHome(cfg);
    if (page === "projetos") initLibrary(cfg);
    if (page === "deputado") initProfile();
  });
})();
