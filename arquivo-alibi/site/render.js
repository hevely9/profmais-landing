// ARQUIVO ÁLIBI — renderizador único de documentos (usado pelo PDF e pela Central de Investigação).
// O mesmo código desenha cada prova nos dois lugares; por isso PDF e site batem 100%.
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const TIPO_ROTULO = {
  oficio: "Documento oficial", depoimento: "Termo de declarações", chat: "Conversa (print)", email: "E-mail", recibo: "Recibo",
  log: "Registro", jornal: "Recorte de jornal", extrato: "Extrato bancário", carta: "Carta / bilhete", agenda: "Agenda",
  app: "Recibo de aplicativo", lista: "Auto de apreensão", ilustracao: "Croqui da perícia", foto: "Foto da perícia", audio: "Prova em áudio",
};

// mídia: no site, <img data-midia> é preenchida depois (arquivo criptografado); no PDF, ctx.src devolve o caminho do arquivo
const img = (nome, ctx, cls = "", alt = "") => nome ? `<img class="${cls}" data-midia="${esc(nome)}"${ctx.src ? ` src="${esc(ctx.src(nome))}"` : ""} alt="${esc(alt)}" loading="lazy">` : "";
const anexo = (a, ctx) => !a ? "" : `<figure class="anexo">${img(a.img, ctx, "zoomavel", a.legenda)}<figcaption>${esc(a.legenda)}</figcaption></figure>`;
const audio = (nome, ctx, rotulo) => !nome ? "" : ctx.pdf
  ? `<div class="audio-prova audio-pdf"><b>▶ Ouça no celular:</b> <span>abra a Central &gt; Documentos &gt; ${esc(ctx.id || "")}</span></div>`
  : `<div class="audio-prova" data-audio="${esc(nome)}"><button type="button" class="audio-play" aria-label="${esc(rotulo || "Ouvir gravação")}">▶</button><div class="audio-info"><b>${esc(rotulo || "Ouvir gravação")}</b><span class="audio-tempo">toque para carregar</span></div></div>`;

const tabela = (t) => !t ? "" : `${t.titulo ? `<div class="doc-sub">${esc(t.titulo)}</div>` : ""}<table class="doc-tab"><thead><tr>${t.cab.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${t.linhas.map((l) => `<tr>${l.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
const campos = (c) => !c ? "" : `<table class="doc-campos">${c.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</table>`;
const paragrafos = (ps) => (ps || []).map((p) => `<p>${esc(p)}</p>`).join("");

const corpo = {
  oficio: (c) => `<div class="of-orgao">${esc(c.orgao)}</div><div class="of-doc">${esc(c.documento)}</div>${campos(c.campos)}${c.tabela && !c.corpo ? tabela(c.tabela) : ""}<div class="of-corpo">${paragrafos(c.corpo)}</div>${c.tabela && c.corpo ? tabela(c.tabela) : ""}${c.assinatura ? `<div class="assin"><span></span>${esc(c.assinatura)}</div>` : ""}`,
  depoimento: (c, ctx) => `<div class="of-orgao">POLÍCIA CIVIL — 1ª DELEGACIA DE POLÍCIA DE MONTE ALBOR</div><div class="of-doc">${esc(c.documento || "TERMO DE DECLARAÇÕES")}</div><div class="dep-cab">${c.foto ? `<div class="dep-foto">${img(c.foto, ctx, "", c.declarante)}</div>` : ""}<div>${campos([["Declarante", c.declarante], ["Data", c.data]])}</div></div>${audio(c.audio, ctx, "Ouvir a gravação do depoimento")}<div class="qa">${c.qa.map(([q, a]) => `<p class="q"><b>P:</b> ${esc(q)}</p><p class="a"><b>R:</b> ${esc(a)}</p>`).join("")}</div><div class="assin"><span></span>Assinatura do declarante</div>`,
  chat: (c) => `<div class="chat"><div class="chat-top">${esc(c.grupo)}<small>${esc(c.data)}</small></div>${c.msgs.map(([h, a, t]) => `<div class="msg"><b>${esc(a)}</b>${esc(t)}<i>${esc(h)}</i></div>`).join("")}</div>`,
  email: (c) => `<div class="mail">${campos([["De", c.de], ["Para", c.para], ["Data", c.data], ["Assunto", c.assunto]])}<div class="mail-corpo">${paragrafos(c.corpo)}</div></div>`,
  recibo: (c) => `<div class="recibo"><b>${esc(c.loja)}</b><div>${esc(c.endereco)}</div><div>${esc(c.data)}</div><hr>${c.itens.map(([d, q, v]) => `<div class="rl"><span>${esc(q)}x ${esc(d)}</span><span>${esc(v)}</span></div>`).join("")}<hr><div class="rl"><b>TOTAL</b><b>${esc(c.total)}</b></div><hr>${(c.extra || []).map((e) => `<div>${esc(e)}</div>`).join("")}</div>`,
  log: (c) => `<div class="of-orgao">${esc(c.sistema)}</div><div class="of-doc">${esc(c.local)}</div>${c.nota_topo ? `<p class="nota">${esc(c.nota_topo)}</p>` : ""}${tabela({ cab: c.colunas, linhas: c.linhas })}${c.nota ? `<p class="nota"><b>Nota:</b> ${esc(c.nota)}</p>` : ""}`,
  jornal: (c) => `<div class="jornal"><div class="j-nome">${esc(c.jornal)}</div><div class="j-data">${esc(c.data)}</div><h3>${esc(c.manchete)}</h3><div class="j-fina">${esc(c.linha_fina)}</div><div class="j-col">${paragrafos(c.corpo)}</div></div>`,
  extrato: (c) => `<div class="of-orgao">${esc(c.banco)}</div><div class="of-doc">EXTRATO DE CONTA — ${esc(c.periodo)}</div>${campos([["Cliente", c.cliente]])}${tabela({ cab: ["Data", "Lançamento", "Valor", "Saldo"], linhas: c.linhas })}${c.nota ? `<p class="nota">${esc(c.nota)}</p>` : ""}`,
  carta: (c) => `<div class="carta"><div class="c-cab">${esc(c.cabecalho)}</div><div class="c-data">${esc(c.data)}</div>${paragrafos(c.corpo)}${c.rodape ? `<div class="c-rod">${esc(c.rodape)}</div>` : ""}</div>`,
  agenda: (c) => `<div class="agenda"><div class="ag-tit">${esc(c.titulo)}</div>${c.dias.map(([d, its]) => `<div class="ag-dia"><b>${esc(d)}</b><div>${its.map((i) => `<div class="ag-it">${esc(i)}</div>`).join("")}</div></div>`).join("")}</div>`,
  app: (c) => `<div class="appcard"><div class="app-top">${esc(c.app)}</div>${campos(c.campos)}</div>`,
  lista: (c) => `<div class="of-orgao">${esc(c.orgao)}</div><div class="of-doc">${esc(c.documento)}</div>${tabela({ cab: ["Item", "Descrição", "Onde estava"], linhas: c.itens })}${c.nota ? `<p class="nota">${esc(c.nota)}</p>` : ""}`,
  foto: (c, ctx) => `<figure class="ilus foto">${img(c.img, ctx, "zoomavel", c.legenda)}<figcaption>${esc(c.legenda)}</figcaption></figure>${c.notas ? `<ul class="notas">${c.notas.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>` : ""}`,
  audio: (c, ctx) => `${campos([["Arquivo", c.arquivo], ["Trecho", c.inicio]])}<p>${esc(c.descricao)}</p>${audio(c.audio, ctx, "Ouvir a gravação")}${!ctx.pdf && c.transcricao ? `<details class="transcricao"><summary>Ler transcrição</summary>${c.transcricao.map((l) => `<p>${esc(l)}</p>`).join("")}</details>` : ""}`,
  ilustracao: (c, ctx) => `<figure class="ilus">${(ILUS[c.svg] || (() => ""))(ctx)}<figcaption>${esc(c.legenda)}</figcaption></figure>${c.notas ? `<ul class="notas">${c.notas.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>` : ""}`,
};

export function renderProva(p, ctx = {}) {
  const fn0 = corpo[p.tipo] || ((c) => paragrafos(c.corpo));
  const fn = (c, x) => fn0(c, { ...x, id: p.id }) + anexo(c.anexo, x);
  const bonus = p.origem !== "pdf" && p.origem !== "final";
  return `<article class="doc doc-${p.tipo}${bonus ? " doc-bonus" : ""}" id="${esc(p.id)}">
  <header class="doc-head"><span class="doc-tipo">${esc(p.rotulo || TIPO_ROTULO[p.tipo] || "Documento")}${bonus ? " · PROVA BÔNUS" : ""}</span><span class="doc-id">${esc(p.id)}</span></header>
  <h2 class="doc-titulo">${esc(p.titulo)}</h2>
  <div class="doc-corpo">${fn(p.conteudo, ctx)}</div>
  <footer class="doc-pe">Caso fictício. Qualquer semelhança com fatos ou pessoas reais é coincidência.</footer>
</article>`;
}

// ── retrato falado (ilustração, nunca foto real) ──
export function retrato(s, w = 220) {
  const r = s.retrato || {};
  const pele = r.pele || "#D9B08C", cab = r.cabelo || "#2B2118", roupa = r.roupa || "#333";
  const cabelo = {
    curto: `<path d="M62 78 Q60 40 100 36 Q140 40 138 78 Q130 56 100 54 Q72 56 62 78Z" fill="${cab}"/>`,
    longo: `<path d="M58 84 Q54 36 100 34 Q146 36 142 84 L148 150 Q140 128 134 96 Q128 58 100 56 Q72 58 66 96 Q60 128 52 150Z" fill="${cab}"/>`,
    lateral: `<path d="M62 80 Q58 38 104 36 Q142 40 138 78 Q126 52 92 58 Q74 60 62 80Z" fill="${cab}"/>`,
    coque: `<circle cx="100" cy="30" r="16" fill="${cab}"/><path d="M62 78 Q62 40 100 38 Q138 40 138 78 Q130 58 100 56 Q70 58 62 78Z" fill="${cab}"/>`,
    calvo: `<path d="M62 86 Q60 70 66 62 L70 80Z M138 86 Q140 70 134 62 L130 80Z" fill="${cab}"/>`,
  }[r.estilo || "curto"];
  return `<svg viewBox="0 0 200 220" width="${w}" class="retrato" role="img" aria-label="Retrato falado de ${esc(s.nome)}">
  <rect width="200" height="220" fill="#CFC6B2"/>${[40, 70, 100, 130, 160, 190].map((y) => `<line x1="0" x2="200" y1="${y}" y2="${y}" stroke="#B4AA94" stroke-width="1"/><text x="4" y="${y - 3}" font-size="8" fill="#8E846F" font-family="Courier">${(2.2 - (y - 40) / 150).toFixed(1)}</text>`).join("")}
  <path d="M40 220 Q44 160 100 150 Q156 160 160 220Z" fill="${roupa}"/>
  <rect x="88" y="128" width="24" height="26" fill="${pele}"/>
  <ellipse cx="100" cy="92" rx="38" ry="46" fill="${pele}"/>
  ${cabelo}
  <ellipse cx="86" cy="92" rx="4" ry="3" fill="#2A211A"/><ellipse cx="114" cy="92" rx="4" ry="3" fill="#2A211A"/>
  <path d="M100 96 Q96 108 100 112" stroke="#8A6A52" stroke-width="2" fill="none"/>
  <path d="M90 122 Q100 126 110 122" stroke="#7A4A3A" stroke-width="2.5" fill="none"/>
  <rect x="40" y="194" width="120" height="22" fill="#1A1714"/><text x="100" y="209" text-anchor="middle" font-size="11" fill="#ECE7DC" font-family="Courier" font-weight="700">${esc(s.nome.toUpperCase())}</text>
</svg>`;
}

// ── croquis / fotos ilustradas da perícia ──
const ILUS = {
  planta: () => `<svg viewBox="0 0 640 520" class="svg-planta" font-family="Courier" font-size="12">
  <rect width="640" height="520" fill="#F1EBDD"/>
  <text x="16" y="24" font-weight="700" font-size="14">TÉRREO</text>
  <g stroke="#1A1714" stroke-width="3" fill="none">
    <rect x="16" y="34" width="608" height="300"/>
    <line x1="176" y1="34" x2="176" y2="334"/><line x1="336" y1="34" x2="336" y2="200"/><line x1="476" y1="34" x2="476" y2="334"/>
    <line x1="16" y1="200" x2="476" y2="200"/><line x1="176" y1="130" x2="336" y2="130"/><line x1="476" y1="170" x2="624" y2="170"/>
  </g>
  <g font-weight="700">
    <text x="40" y="110">SALA DE ESTAR</text><text x="196" y="90">SALA DE JANTAR</text><text x="200" y="170">HALL · ESCADA</text>
    <text x="356" y="110">SALA DE TV</text><text x="40" y="270">SALA DE MÚSICA</text><text x="200" y="270">COZINHA</text>
    <text x="356" y="250">CORREDOR LESTE</text><text x="496" y="100">ESCRITÓRIO</text><text x="496" y="250">GARAGEM</text>
  </g>
  <line x1="336" y1="200" x2="336" y2="334" stroke="#1A1714" stroke-width="3" stroke-dasharray="6 6"/>
  <rect x="470" y="110" width="12" height="36" fill="#A3141C"/><text x="380" y="292" font-size="11">porta única →</text>
  <g fill="#A3141C" font-weight="700" font-size="12">
    <circle cx="150" cy="60" r="11"/><text x="143" y="64" fill="#fff">S8</text>
    <circle cx="310" cy="160" r="11"/><text x="303" y="164" fill="#fff">S6</text>
    <circle cx="450" cy="60" r="11"/><text x="443" y="64" fill="#fff">S4</text>
    <circle cx="150" cy="226" r="11"/><text x="143" y="230" fill="#fff">S5</text>
    <circle cx="310" cy="226" r="11"/><text x="303" y="230" fill="#fff">S2</text>
    <circle cx="450" cy="226" r="11"/><text x="443" y="230" fill="#fff">S3</text>
    <circle cx="600" cy="196" r="11"/><text x="593" y="200" fill="#fff">S1</text>
  </g>
  <text x="16" y="360" font-weight="700" font-size="14">PÁTIO / JARDIM</text>
  <rect x="16" y="368" width="420" height="60" fill="none" stroke="#1A1714" stroke-dasharray="4 4"/>
  <circle cx="40" cy="398" r="11" fill="#1A1714"/><text x="31" y="402" fill="#fff" font-weight="700">C1</text>
  <text x="60" y="402">câmera cobre o pátio até a entrada do jardim</text>
  <text x="340" y="420">gazebo (fora da câmera) →</text>
  <text x="476" y="360" font-weight="700" font-size="14">ANDAR SUPERIOR</text>
  <rect x="476" y="368" width="148" height="140" fill="none" stroke="#1A1714" stroke-width="3"/>
  <line x1="476" y1="420" x2="624" y2="420" stroke="#1A1714" stroke-width="2"/>
  <text x="486" y="396">hall superior (S6)</text><text x="486" y="446">SUÍTE DO CASAL</text><text x="486" y="466">+ banheiro com</text><text x="486" y="484">armário de remédios</text>
  <text x="16" y="470">Portão social: P1</text><text x="16" y="490">Sensores repetem o registro a cada 5 min com presença.</text>
</svg>`,
};

export const ilustracoes = ILUS;
