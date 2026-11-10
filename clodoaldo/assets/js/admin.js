/* Painel administrativo do portal.
   Funciona sem servidor próprio: lê e grava os arquivos do site direto no
   repositório do GitHub (API REST), autenticado por um token pessoal.
   Cada "salvar" gera um único commit, com histórico completo e reversível. */
(function () {
  "use strict";
  if (window.top !== window.self) { document.documentElement.textContent = ""; return; } // anti-clickjacking

  const DEFAULTS = { owner: "hevely9", repo: "profmais-landing", branch: "main", base: "clodoaldo" };
  const ALLOWED_API = "https://api.github.com"; // único destino de rede permitido (também fixado na CSP)
  const PDFJS = "assets/vendor/pdfjs/"; // pdf.js 3.11.174 hospedado no próprio site

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (v) => String(v == null ? "" : v).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const slug = (v) => norm(v).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const store = { get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { sessionStorage.setItem(k, v); } catch {} },
    clear: () => { try { ["gh_token", "gh_cfg"].forEach((k) => { sessionStorage.removeItem(k); localStorage.removeItem(k); }); } catch {} } };

  let repo = null, token = null;

  // ---------- validação de entradas ----------
  const MAX_PDF = 25 * 1024 * 1024, MAX_IMG = 15 * 1024 * 1024;
  const RE = {
    ano: /^(19|20)\d{2}$/, numero: /^\d{1,5}[A-Za-z]?$/, data: /^\d{4}-\d{2}-\d{2}$/,
    owner: /^[A-Za-z0-9-]{1,39}$/, repo: /^[A-Za-z0-9._-]{1,100}$/, branch: /^[A-Za-z0-9._/-]{1,100}$/, base: /^[a-z0-9_-]{0,60}$/
  };
  const httpsOk = (v) => !v || /^https:\/\/[^\s<>"'`]+$/i.test(v);
  const clip = (v, n) => String(v || "").slice(0, n);
  async function assertPdf(file) {
    if (file.size > MAX_PDF) throw new Error(`"${file.name}" tem ${(file.size / 1048576).toFixed(1)} MB. O limite é 25 MB.`);
    const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
    if (String.fromCharCode(...head) !== "%PDF-") throw new Error(`"${file.name}" não é um PDF válido.`);
  }

  let projetos = [], deputado = {}, config = {};

  function toast(msg, err) {
    const t = document.createElement("div"); t.className = "toast" + (err ? " err" : ""); t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), err ? 7000 : 4200);
  }

  // ---------- base64 ----------
  const utf8ToB64 = (s) => { const b = new TextEncoder().encode(s); let bin = ""; for (let i = 0; i < b.length; i += 0x8000) bin += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(bin); };
  const b64ToUtf8 = (b) => new TextDecoder().decode(Uint8Array.from(atob(b.replace(/\s/g, "")), (c) => c.charCodeAt(0)));
  const bufToB64 = (buf) => { const b = new Uint8Array(buf); let bin = ""; for (let i = 0; i < b.length; i += 0x8000) bin += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(bin); };

  // ---------- GitHub API ----------
  async function gh(path, opts = {}) {
    const r = await fetch("https://api.github.com" + path, {
      ...opts,
      headers: { Accept: "application/vnd.github+json", Authorization: "Bearer " + token, "X-GitHub-Api-Version": "2022-11-28", ...(opts.body ? { "Content-Type": "application/json" } : {}) }
    });
    if (!r.ok) {
      let m = r.status + ""; try { m = (await r.json()).message || m; } catch {}
      const e = new Error(m); e.status = r.status; throw e;
    }
    return r.status === 204 ? null : r.json();
  }
  const R = () => `/repos/${repo.owner}/${repo.repo}`;
  const P = (p) => (repo.base ? repo.base.replace(/\/$/, "") + "/" : "") + p;

  async function readJSON(path, ref) {
    try {
      const f = await gh(`${R()}/contents/${encodeURI(P(path))}?ref=${encodeURIComponent(ref || repo.branch)}`);
      if (f.content) return JSON.parse(b64ToUtf8(f.content));
      const blob = await gh(`${R()}/git/blobs/${f.sha}`); // arquivos > 1 MB
      return JSON.parse(b64ToUtf8(blob.content));
    } catch (e) { if (e.status === 404) return null; throw e; }
  }

  /* Gera um único commit.
     files: [{path, b64}] · deletes: [path] · json: {path: fn(atual) => novo}
     Os JSON são relidos no commit mais recente antes de aplicar a alteração,
     para não sobrescrever o que outra pessoa salvou no meio tempo. */
  async function commit(message, { files = [], deletes = [], json = {} }) {
    for (let tentativa = 0; tentativa < 3; tentativa++) {
      const ref = await gh(`${R()}/git/ref/heads/${repo.branch}`);
      const head = ref.object.sha;
      const base = await gh(`${R()}/git/commits/${head}`);
      const tree = [];
      const results = {};
      for (const [path, fn] of Object.entries(json)) {
        const cur = await readJSON(path, head);
        const next = fn(cur);
        results[path] = next;
        files = files.filter((f) => f.path !== path).concat([{ path, b64: utf8ToB64(JSON.stringify(next, null, 2) + "\n") }]);
      }
      if (results["data/projetos.json"]) files = files.filter((f) => f.path !== "sitemap.xml").concat([{ path: "sitemap.xml", b64: utf8ToB64(sitemapXML(results["data/projetos.json"])) }]);
      for (const f of files) {
        const blob = await gh(`${R()}/git/blobs`, { method: "POST", body: JSON.stringify({ content: f.b64, encoding: "base64" }) });
        tree.push({ path: P(f.path), mode: "100644", type: "blob", sha: blob.sha });
      }
      for (const d of deletes) tree.push({ path: P(d), mode: "100644", type: "blob", sha: null });
      const t = await gh(`${R()}/git/trees`, { method: "POST", body: JSON.stringify({ base_tree: base.tree.sha, tree }) });
      const c = await gh(`${R()}/git/commits`, { method: "POST", body: JSON.stringify({ message, tree: t.sha, parents: [head] }) });
      try {
        await gh(`${R()}/git/refs/heads/${repo.branch}`, { method: "PATCH", body: JSON.stringify({ sha: c.sha }) });
        return results;
      } catch (e) { if (e.status !== 422) throw e; } // outro commit chegou antes: tenta de novo
    }
    throw new Error("O repositório mudou durante o envio. Recarregue a página e tente novamente.");
  }

  function sitemapXML(list) {
    const site = "https://profmais.online/" + (repo.base ? repo.base.replace(/\/$/, "") + "/" : "");
    const x = (u) => `  <url><loc>${u.replace(/&/g, "&amp;")}</loc></url>\n`;
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      [site, site + "projetos.html", site + "deputado.html"].concat((list || []).map((p) => site + "projeto.html?id=" + encodeURIComponent(p.id))).map(x).join("") + "</urlset>\n";
  }

  // ---------- login ----------
  async function login(tok, cfg) {
    if (!RE.owner.test(cfg.owner) || !RE.repo.test(cfg.repo) || !RE.branch.test(cfg.branch) || !RE.base.test(cfg.base)) throw new Error("Configuração do repositório inválida.");
    if (!/^[A-Za-z0-9_]{20,255}$/.test(tok)) throw new Error("O token não tem o formato de um token do GitHub.");
    token = tok; repo = cfg;
    const info = await gh(R());
    if (!info.permissions || !info.permissions.push) throw new Error("Este token não tem permissão de escrita no repositório.");
    let user = ""; try { user = (await gh("/user")).login; } catch {}
    store.set("gh_token", tok); store.set("gh_cfg", JSON.stringify(cfg));
    $("#who-name").textContent = user ? "Conectado como " + user : "Conectado";
    $("#who").hidden = false; $("#v-login").hidden = true; $("#v-app").hidden = false;
    await loadAll();
  }

  async function loadAll() {
    [projetos, deputado, config] = await Promise.all([readJSON("data/projetos.json"), readJSON("data/deputado.json"), readJSON("data/config.json")]);
    projetos = Array.isArray(projetos) ? projetos : []; deputado = deputado || {}; config = config || {};
    renderProjetos(); renderDeputado(); renderConfig();
  }

  // ---------- projetos ----------
  const projId = (p) => slug([p.tipo, p.numero, p.ano].join(" "));
  const pdfPath = (p) => `documentos/${slug(p.ano) || "sem-ano"}/${projId(p)}.pdf`;
  const sortP = (l) => l.slice().sort((a, b) => (parseInt(b.ano) || 0) - (parseInt(a.ano) || 0) || (parseInt(b.numero) || 0) - (parseInt(a.numero) || 0));

  function renderProjetos() {
    const q = norm($("#p-busca").value);
    const list = sortP(projetos).filter((p) => !q || norm([p.tipo, p.numero, p.ano, p.ementa, p.situacao].join(" ")).includes(q));
    $("#p-vazio").hidden = projetos.length > 0;
    $("#p-tbody").innerHTML = list.map((p) => `<tr>
      <td><strong>${esc(p.tipo)}</strong><br>Nº ${esc(p.numero)}/${esc(p.ano)}</td>
      <td><div class="ementa">${esc(p.ementa)}</div></td>
      <td>${esc(p.situacao || "-")}</td>
      <td>${p.pdf ? `<a href="${esc(p.pdf)}" target="_blank" rel="noopener">abrir</a>` : '<span class="flag warn">sem PDF</span>'}</td>
      <td><div class="actions"><button class="btn btn-outline btn-sm" data-edit="${esc(p.id)}">Editar</button><button class="btn btn-danger btn-sm" data-del="${esc(p.id)}">Remover</button></div></td>
    </tr>`).join("");
  }

  let editing = null;
  function openDialog(p) {
    editing = p || null;
    const f = $("#f-proj"); f.reset();
    $("#dlg-titulo").textContent = p ? "Editar projeto" : "Novo projeto";
    if (p) {
      ["tipo", "numero", "ano", "dataApresentacao", "ementa", "descricao", "situacao", "linkOficial"].forEach((k) => { f.elements[k].value = p[k] || ""; });
      f.elements.palavrasChave.value = (p.palavrasChave || []).join(", ");
      if (/^https?:/i.test(p.pdf || "")) f.elements.pdfUrl.value = p.pdf;
    }
    $("#dlg-pdf-atual").textContent = p && p.pdf ? "PDF atual: " + p.pdf + " (envie outro arquivo para substituir)" : "";
    $("#dlg").showModal();
  }

  async function saveProject() {
    const f = $("#f-proj");
    if (!f.reportValidity()) return;
    const v = (k) => f.elements[k].value.trim();
    const p = {
      tipo: v("tipo"), numero: v("numero"), ano: v("ano"), dataApresentacao: v("dataApresentacao"),
      ementa: v("ementa"), descricao: v("descricao"), situacao: v("situacao"), linkOficial: v("linkOficial"),
      palavrasChave: v("palavrasChave").split(",").map((s) => s.trim()).filter(Boolean)
    };
    p.ementa = clip(p.ementa, 2000); p.descricao = clip(p.descricao, 2000); p.tipo = clip(p.tipo, 80); p.situacao = clip(p.situacao, 120);
    p.palavrasChave = p.palavrasChave.slice(0, 15).map((k) => clip(k, 40));
    if (!RE.ano.test(p.ano)) { toast("Ano inválido. Use 4 dígitos, por exemplo 2026.", true); return; }
    if (!RE.numero.test(p.numero)) { toast("Número inválido. Use só o número, por exemplo 27.", true); return; }
    if (p.dataApresentacao && !RE.data.test(p.dataApresentacao)) { toast("Data de apresentação inválida.", true); return; }
    if (!httpsOk(p.linkOficial) || !httpsOk(v("pdfUrl"))) { toast("Os links precisam começar com https://", true); return; }
    p.id = projId(p);
    const oldId = editing && editing.id;
    if (p.id !== oldId && projetos.some((x) => x.id === p.id)) { toast("Já existe um projeto com esse tipo, número e ano.", true); return; }
    const file = f.elements.arquivo.files[0];
    const files = [], deletes = [];
    if (file) {
      try { await assertPdf(file); } catch (err) { toast(err.message, true); return; }
      p.pdf = pdfPath(p);
      files.push({ path: p.pdf, b64: bufToB64(await file.arrayBuffer()) });
      if (editing && editing.pdf && !/^https?:/i.test(editing.pdf) && editing.pdf !== p.pdf) deletes.push(editing.pdf);
    } else if (v("pdfUrl")) {
      p.pdf = v("pdfUrl");
    } else if (editing && editing.pdf) {
      p.pdf = editing.pdf;
    }
    p.atualizadoEm = new Date().toISOString().slice(0, 10);
    p.fonte = editing && editing.fonte ? editing.fonte : "Cadastro manual";
    const btn = $("#dlg-salvar"); btn.classList.add("busy"); btn.textContent = "Publicando…";
    try {
      const res = await commit(`${oldId ? "Atualiza" : "Adiciona"} ${p.tipo} ${p.numero}/${p.ano}`, {
        files, deletes,
        json: { "data/projetos.json": (cur) => { const l = (cur || []).filter((x) => x.id !== oldId && x.id !== p.id); l.push(p); return sortP(l); } }
      });
      projetos = res["data/projetos.json"]; renderProjetos(); $("#dlg").close(); toast("Projeto publicado.");
    } catch (e) { toast("Erro ao salvar: " + e.message, true); }
    finally { btn.classList.remove("busy"); btn.textContent = "Salvar e publicar"; }
  }

  async function removeProject(id) {
    const p = projetos.find((x) => x.id === id); if (!p) return;
    if (!confirm(`Remover ${p.tipo} ${p.numero}/${p.ano} do portal?\nO PDF hospedado também será apagado (continua recuperável pelo histórico do GitHub).`)) return;
    try {
      const res = await commit(`Remove ${p.tipo} ${p.numero}/${p.ano}`, {
        deletes: p.pdf && !/^https?:/i.test(p.pdf) ? [p.pdf] : [],
        json: { "data/projetos.json": (cur) => (cur || []).filter((x) => x.id !== id) }
      });
      projetos = res["data/projetos.json"]; renderProjetos(); toast("Projeto removido.");
    } catch (e) { toast("Erro ao remover: " + e.message, true); }
  }

  // ---------- importação em lote ----------
  let pdfjsReady = null;
  function loadPdfJs() {
    if (pdfjsReady) return pdfjsReady;
    pdfjsReady = new Promise((ok, fail) => {
      const s = document.createElement("script"); s.src = PDFJS + "pdf.min.js";
      s.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + "pdf.worker.min.js"; ok(window.pdfjsLib); };
      s.onerror = () => fail(new Error("Não foi possível carregar o leitor de PDF."));
      document.head.appendChild(s);
    });
    return pdfjsReady;
  }

  async function pdfText(buf) {
    const lib = await loadPdfJs();
    const doc = await lib.getDocument({ data: buf.slice(0), isEvalSupported: false, enableXfa: false }).promise;
    let out = "";
    for (let i = 1; i <= Math.min(doc.numPages, 2); i++) {
      const page = await doc.getPage(i);
      const c = await page.getTextContent();
      let lastY = null;
      c.items.forEach((it) => { const y = it.transform[5]; out += (lastY !== null && Math.abs(y - lastY) > 2 ? "\n" : " ") + it.str; lastY = y; });
      out += "\n";
    }
    return out.replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n");
  }

  const TIPOS = [
    [/projeto\s+de\s+lei\s+complementar/i, "Projeto de Lei Complementar"],
    [/proposta\s+de\s+emenda/i, "Proposta de Emenda à Constituição"],
    [/projeto\s+de\s+decreto\s+legislativo/i, "Projeto de Decreto Legislativo"],
    [/projeto\s+de\s+resolu[cç][aã]o/i, "Projeto de Resolução"],
    [/projeto\s+de\s+lei/i, "Projeto de Lei"],
    [/indica[cç][aã]o/i, "Indicação"],
    [/requerimento/i, "Requerimento"],
    [/mo[cç][aã]o/i, "Moção"]
  ];

  // Sugestões a partir do texto do PDF e do nome do arquivo. Sempre revisadas por uma pessoa.
  function guess(text, fname) {
    const g = { tipo: "", numero: "", ano: "", ementa: "", autoria: null, semTexto: text.replace(/\s/g, "").length < 40 };
    const src = text + "\n" + fname.replace(/[_]+/g, " ");
    for (const [re, label] of TIPOS) {
      const m = src.match(re);
      if (m) {
        g.tipo = label;
        const after = src.slice(m.index, m.index + 160);
        const n = after.match(/n[º°o.]*\s*[:.]?\s*(\d{1,5})\s*(?:[\/\-.,]|\s+de\s+(?:\d{1,2}\s+de\s+\w+\s+de\s+)?)?\s*(\d{4})?/i);
        if (n) { g.numero = n[1]; if (n[2]) g.ano = n[2]; }
        break;
      }
    }
    if (!g.numero) { const n = fname.match(/(\d{1,5})\s*[-_\/.]\s*(20\d{2})/); if (n) { g.numero = n[1]; g.ano = n[2]; } }
    if (!g.ano) { const y = src.match(/\b(20[0-4]\d)\b/); if (y) g.ano = y[1]; }
    const em = text.match(/((?:Disp[õo]e|Institui|Altera|Cria|Autoriza|Declara|Denomina|Estabelece|Reconhece|Concede|Obriga|Pro[íi]be|Assegura|Garante|Inclui|Revoga|Regulamenta|Determina|Torna|Indic[oa]|Requer|Solicita)(?=[\s,])[\s\S]{20,700}?)(?:\n\s*(?:A\s+ASSEMBLEIA|O\s+GOVERNADOR|A\s+MESA|Art\.?\s*1|Senhor|Excelent[ií]ssim|JUSTIFICATIVA)|$)/i);
    if (em) g.ementa = em[1].replace(/\s*\n\s*/g, " ").trim().slice(0, 600);
    g.autoria = /clodoaldo/i.test(text) ? true : (g.semTexto ? null : false);
    return g;
  }

  let fila = [];
  async function addFiles(fileList) {
    const arr = Array.from(fileList).filter((f) => /pdf$/i.test(f.type) || /\.pdf$/i.test(f.name));
    if (!arr.length) return;
    $("#imp-bar").hidden = false;
    for (const file of arr) {
      const item = { file, sel: true, status: "lendo" };
      fila.push(item); renderFila();
      try {
        await assertPdf(file);
      } catch (err) { fila.pop(); renderFila(); toast(err.message, true); continue; }
      try {
        item.buf = await file.arrayBuffer();
        const txt = await pdfText(item.buf);
        Object.assign(item, guess(txt, file.name));
      } catch (e) { Object.assign(item, guess("", file.name)); item.semTexto = true; item.erro = e.message; }
      item.status = "pronto"; renderFila();
    }
  }

  function renderFila() {
    const ids = new Set(projetos.map((p) => p.id));
    $("#imp-lista").innerHTML = fila.map((it, i) => {
      if (it.status === "lendo") return `<div class="imp-row"><span></span><span class="muted">Lendo ${esc(it.file.name)}…</span></div>`;
      const dup = it.tipo && it.numero && it.ano && ids.has(projId(it));
      const flags = [
        it.semTexto ? '<span class="flag warn">PDF sem texto (escaneado): preencha manualmente</span>' : "",
        it.autoria === true ? '<span class="flag ok">Menciona Clodoaldo</span>' : it.autoria === false ? '<span class="flag bad">Autoria não identificada no texto: confira</span>' : "",
        dup ? '<span class="flag bad">Já existe na biblioteca</span>' : ""
      ].join("");
      return `<div class="imp-row" data-i="${i}">
        <input type="checkbox" data-k="sel" ${it.sel && !dup ? "checked" : ""} aria-label="Selecionar">
        <input class="in" data-k="tipo" list="tipos" value="${esc(it.tipo)}" placeholder="Tipo">
        <input class="in" data-k="numero" value="${esc(it.numero)}" placeholder="Nº">
        <input class="in" data-k="ano" value="${esc(it.ano)}" placeholder="Ano">
        <textarea class="ta" data-k="ementa" placeholder="Ementa">${esc(it.ementa)}</textarea>
        <input class="in" data-k="situacao" list="situacoes" value="${esc(it.situacao || "")}" placeholder="Situação">
        <div class="fname">${esc(it.file.name)} · ${(it.file.size / 1024 / 1024).toFixed(2)} MB ${flags}</div>
      </div>`;
    }).join("");
    const n = fila.filter((i) => i.sel && i.status === "pronto").length;
    $("#imp-resumo").textContent = `${fila.length} arquivo(s) · ${n} selecionado(s)`;
  }

  async function publishImport() {
    const ids = new Set(projetos.map((p) => p.id));
    const sel = fila.filter((it) => it.sel && it.status === "pronto");
    const bad = sel.filter((it) => !it.tipo || !it.numero || !/^\d{4}$/.test(it.ano) || !it.ementa);
    if (!sel.length) { toast("Selecione ao menos um arquivo.", true); return; }
    if (bad.length) { toast(`${bad.length} linha(s) sem tipo, número, ano ou ementa. Complete antes de publicar.`, true); return; }
    const novos = [], files = [], vistos = new Set();
    for (const it of sel) {
      const p = { tipo: it.tipo.trim(), numero: it.numero.trim(), ano: it.ano.trim(), ementa: it.ementa.trim(), descricao: "", situacao: (it.situacao || "").trim(), dataApresentacao: "", linkOficial: "", palavrasChave: [] };
      p.id = projId(p);
      if (ids.has(p.id) || vistos.has(p.id)) continue;
      vistos.add(p.id);
      p.pdf = pdfPath(p); p.fonte = "Importação de PDF: " + it.file.name; p.atualizadoEm = new Date().toISOString().slice(0, 10);
      files.push({ path: p.pdf, b64: bufToB64(it.buf) }); novos.push(p);
    }
    if (!novos.length) { toast("Todos os selecionados já estão na biblioteca.", true); return; }
    const btn = $("#imp-publicar"); btn.classList.add("busy"); btn.textContent = `Publicando ${novos.length}…`;
    try {
      const res = await commit(`Importa ${novos.length} proposição(ões) em PDF`, {
        files, json: { "data/projetos.json": (cur) => { const l = (cur || []).filter((x) => !vistos.has(x.id)); return sortP(l.concat(novos)); } }
      });
      projetos = res["data/projetos.json"]; renderProjetos();
      fila = fila.filter((it) => !sel.includes(it)); renderFila();
      toast(`${novos.length} documento(s) publicados.`);
    } catch (e) { toast("Erro ao publicar: " + e.message + ". Se forem muitos arquivos grandes, envie em lotes menores.", true); }
    finally { btn.classList.remove("busy"); btn.textContent = "Publicar selecionados"; }
  }

  // ---------- deputado ----------
  function tlRow(item = {}) {
    const d = document.createElement("div"); d.className = "tl-item";
    d.innerHTML = `<input class="in" placeholder="Período (ex.: 2023 a 2026)" value="${esc(item.periodo)}"><input class="in" placeholder="Descrição" value="${esc(item.descricao)}"><button class="btn btn-danger btn-sm" type="button" aria-label="Remover">×</button>`;
    d.querySelector("button").onclick = () => d.remove();
    $("#d-tl").appendChild(d);
  }
  function renderDeputado() {
    const f = $("#f-dep");
    ["nome", "nomeCompleto", "cargo", "partido", "estado", "lema", "resumo", "biografia", "trajetoriaPessoal", "atuacaoParlamentar"].forEach((k) => { f.elements[k].value = deputado[k] || ""; });
    f.elements.areasDeAtuacao.value = (deputado.areasDeAtuacao || []).join(", ");
    f.elements.destaques.value = (deputado.destaques || []).join("\n");
    $("#d-tl").innerHTML = ""; (deputado.trajetoriaPolitica || []).forEach(tlRow);
    $("#d-foto-prev").src = deputado.foto || "assets/img/deputado-retrato.jpg";
  }
  let novaFoto = null;
  async function resizeImage(file, max = 1400) {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error("Use uma foto JPG, PNG ou WebP.");
    if (file.size > MAX_IMG) throw new Error("A foto passa de 15 MB.");
    const img = await createImageBitmap(file);
    const s = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    const blob = await new Promise((ok) => c.toBlob(ok, "image/jpeg", 0.86));
    return { blob, b64: bufToB64(await blob.arrayBuffer()) };
  }
  async function saveDeputado(e) {
    e.preventDefault();
    const f = e.target, v = (k) => f.elements[k].value.trim();
    const d = {};
    ["nome", "nomeCompleto", "cargo", "partido", "estado", "lema", "resumo", "biografia", "trajetoriaPessoal", "atuacaoParlamentar"].forEach((k) => { d[k] = v(k); });
    d.areasDeAtuacao = v("areasDeAtuacao").split(",").map((s) => s.trim()).filter(Boolean);
    d.destaques = v("destaques").split("\n").map((s) => s.trim()).filter(Boolean);
    d.trajetoriaPolitica = $$(".tl-item", $("#d-tl")).map((r) => { const [a, b] = $$("input", r); return { periodo: a.value.trim(), descricao: b.value.trim() }; }).filter((x) => x.periodo || x.descricao);
    const files = [];
    if (novaFoto) { d.foto = `assets/img/deputado-foto-${Date.now().toString(36)}.jpg`; files.push({ path: d.foto, b64: novaFoto.b64 }); }
    f.classList.add("busy");
    try {
      const res = await commit("Atualiza biografia do deputado", { files, json: { "data/deputado.json": (cur) => ({ ...(cur || {}), ...d }) } });
      deputado = res["data/deputado.json"]; novaFoto = null; toast("Biografia publicada.");
    } catch (err) { toast("Erro ao salvar: " + err.message, true); }
    finally { f.classList.remove("busy"); }
  }

  // ---------- configurações ----------
  function renderConfig() { const f = $("#f-cfg"); ["aleacUrl", "aleacProjetosUrl", "instagram", "facebook", "whatsappGrupo"].forEach((k) => { f.elements[k].value = config[k] || ""; }); }
  async function saveConfig(e) {
    e.preventDefault();
    const f = e.target, d = {};
    ["aleacUrl", "aleacProjetosUrl", "instagram", "facebook", "whatsappGrupo"].forEach((k) => { d[k] = f.elements[k].value.trim(); });
    if (!Object.values(d).every(httpsOk)) { toast("Todos os links precisam começar com https://", true); return; }
    if (d.whatsappGrupo && !/^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+$/.test(d.whatsappGrupo.split("?")[0])) { toast("O link do grupo deve ser do tipo https://chat.whatsapp.com/…", true); return; }
    if (d.whatsappGrupo) d.whatsappGrupo = d.whatsappGrupo.split("?")[0];
    f.classList.add("busy");
    try {
      const res = await commit("Atualiza links oficiais", { json: { "data/config.json": (cur) => ({ ...(cur || {}), ...d, atualizadoEm: new Date().toISOString().slice(0, 10) }) } });
      config = res["data/config.json"]; toast("Links publicados.");
    } catch (err) { toast("Erro ao salvar: " + err.message, true); }
    finally { f.classList.remove("busy"); }
  }

  // ---------- eventos ----------
  document.addEventListener("DOMContentLoaded", () => {
    const saved = (() => { try { return JSON.parse(store.get("gh_cfg") || "null"); } catch { return null; } })() || DEFAULTS;
    $("#l-owner").value = saved.owner; $("#l-repo").value = saved.repo; $("#l-branch").value = saved.branch; $("#l-base").value = saved.base;

    $("#f-login").addEventListener("submit", async (e) => {
      e.preventDefault(); $("#l-erro").textContent = "";
      const cfg = { owner: $("#l-owner").value.trim(), repo: $("#l-repo").value.trim(), branch: $("#l-branch").value.trim() || "main", base: $("#l-base").value.trim() };
      e.target.classList.add("busy");
      try { await login($("#l-token").value.trim(), cfg); }
      catch (err) { $("#l-erro").textContent = err.status === 401 ? "Token inválido ou expirado." : err.status === 404 ? "Repositório não encontrado ou sem acesso para este token." : err.message; }
      finally { e.target.classList.remove("busy"); }
    });
    const tok = store.get("gh_token");
    if (tok) login(tok, saved).catch(() => { store.clear(); });
    $("#sair").addEventListener("click", () => { store.clear(); location.reload(); });

    $$(".tab").forEach((t) => t.addEventListener("click", () => {
      $$(".tab").forEach((x) => x.setAttribute("aria-selected", x === t));
      $$("[data-panel]").forEach((p) => { p.hidden = p.dataset.panel !== t.dataset.tab; });
    }));

    $("#p-busca").addEventListener("input", renderProjetos);
    $("#p-novo").addEventListener("click", () => openDialog(null));
    $("#p-tbody").addEventListener("click", (e) => {
      const ed = e.target.closest("[data-edit]"), dl = e.target.closest("[data-del]");
      if (ed) openDialog(projetos.find((p) => p.id === ed.dataset.edit));
      if (dl) removeProject(dl.dataset.del);
    });
    $("#f-proj").addEventListener("submit", (e) => { if (e.submitter && e.submitter.value === "save") { e.preventDefault(); saveProject(); } });

    const drop = $("#drop");
    ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("over"); }));
    ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
    drop.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));
    $("#imp-files").addEventListener("change", (e) => { addFiles(e.target.files); e.target.value = ""; });
    $("#imp-lista").addEventListener("input", (e) => {
      const row = e.target.closest("[data-i]"); if (!row) return;
      const it = fila[+row.dataset.i], k = e.target.dataset.k;
      it[k] = k === "sel" ? e.target.checked : e.target.value;
      if (k === "sel") renderFila();
    });
    $("#imp-publicar").addEventListener("click", publishImport);

    $("#d-tl-add").addEventListener("click", () => tlRow());
    $("#d-foto").addEventListener("change", async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { novaFoto = await resizeImage(f); } catch (err) { toast(err.message, true); e.target.value = ""; return; }
      $("#d-foto-prev").src = URL.createObjectURL(novaFoto.blob);
      toast("Foto pronta. Clique em “Salvar biografia” para publicar.");
    });
    $("#f-dep").addEventListener("submit", saveDeputado);
    $("#f-cfg").addEventListener("submit", saveConfig);
  });
})();
