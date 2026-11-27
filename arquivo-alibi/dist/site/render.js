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
  depoimento: (c, ctx) => `<div class="of-orgao">${esc(c.orgao || "POLÍCIA CIVIL — 1ª DELEGACIA DE POLÍCIA DE MONTE ALBOR")}</div><div class="of-doc">${esc(c.documento || "TERMO DE DECLARAÇÕES")}</div><div class="dep-cab">${c.foto ? `<div class="dep-foto">${img(c.foto, ctx, "", c.declarante)}</div>` : ""}<div>${campos([["Declarante", c.declarante], ["Data", c.data]])}</div></div>${audio(c.audio, ctx, "Ouvir a gravação do depoimento")}<div class="qa">${c.qa.map(([q, a]) => `<p class="q"><b>P:</b> ${esc(q)}</p><p class="a"><b>R:</b> ${esc(a)}</p>`).join("")}</div><div class="assin"><span></span>Assinatura do declarante</div>`,
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
  audio: (c, ctx) => `${campos([["Arquivo", c.arquivo], ["Trecho", c.inicio]])}<p>${esc(c.descricao)}</p>${audio(c.audio, ctx, "Ouvir a gravação")}${c.transcricao ? (!c.audio ? `<div class="transcricao aberta"><b>Transcrição da gravação</b>${c.transcricao.map((l) => `<p>${esc(l)}</p>`).join("")}</div>` : !ctx.pdf ? `<details class="transcricao"><summary>Ler transcrição</summary>${c.transcricao.map((l) => `<p>${esc(l)}</p>`).join("")}</details>` : "") : ""}`,
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
  onibus: () => `<svg viewBox="0 0 640 520" class="svg-planta" font-family="Courier" font-size="12">
  <rect width="640" height="520" fill="#F1EBDD"/>
  <text x="16" y="24" font-weight="700" font-size="14">CARRO 4412 — VISTA DE CIMA</text>
  <rect x="40" y="34" width="260" height="470" rx="26" fill="none" stroke="#1A1714" stroke-width="3"/>
  <text x="54" y="56" font-weight="700" font-size="11">FRENTE · CABINE</text>
  <line x1="40" y1="64" x2="300" y2="64" stroke="#1A1714" stroke-width="2"/>
  <rect x="236" y="40" width="40" height="20" fill="none" stroke="#1A1714" stroke-dasharray="3 3"/><text x="241" y="54" font-size="9">leito</text>
  <rect x="296" y="70" width="8" height="40" fill="#1A1714"/>
  <circle cx="290" cy="76" r="9" fill="#1A1714"/><text x="283" y="80" fill="#fff" font-weight="700" font-size="9">C1</text>
  <rect x="60" y="70" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="80" y="90" text-anchor="middle" font-weight="700" fill="#1A1714">1</text><rect x="104" y="70" width="40" height="30" rx="5" fill="#C9A227" stroke="#1A1714" stroke-width="1.5"/><text x="124" y="90" text-anchor="middle" font-weight="700" fill="#1A1714">2</text><rect x="196" y="70" width="40" height="30" rx="5" fill="#C9A227" stroke="#1A1714" stroke-width="1.5"/><text x="216" y="90" text-anchor="middle" font-weight="700" fill="#1A1714">3</text><rect x="240" y="70" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="260" y="90" text-anchor="middle" font-weight="700" fill="#1A1714">4</text><rect x="60" y="106" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="80" y="126" text-anchor="middle" font-weight="700" fill="#1A1714">5</text><rect x="104" y="106" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="124" y="126" text-anchor="middle" font-weight="700" fill="#1A1714">6</text><rect x="196" y="106" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="216" y="126" text-anchor="middle" font-weight="700" fill="#1A1714">7</text><rect x="240" y="106" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="260" y="126" text-anchor="middle" font-weight="700" fill="#1A1714">8</text><rect x="60" y="142" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="80" y="162" text-anchor="middle" font-weight="700" fill="#1A1714">9</text><rect x="104" y="142" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="124" y="162" text-anchor="middle" font-weight="700" fill="#1A1714">10</text><rect x="196" y="142" width="40" height="30" rx="5" fill="#C9A227" stroke="#1A1714" stroke-width="1.5"/><text x="216" y="162" text-anchor="middle" font-weight="700" fill="#1A1714">11</text><rect x="240" y="142" width="40" height="30" rx="5" fill="#A3141C" stroke="#1A1714" stroke-width="1.5"/><text x="260" y="162" text-anchor="middle" font-weight="700" fill="#fff">12</text><rect x="60" y="178" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="80" y="198" text-anchor="middle" font-weight="700" fill="#1A1714">13</text><rect x="104" y="178" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="124" y="198" text-anchor="middle" font-weight="700" fill="#1A1714">14</text><rect x="196" y="178" width="40" height="30" rx="5" fill="#C9A227" stroke="#1A1714" stroke-width="1.5"/><text x="216" y="198" text-anchor="middle" font-weight="700" fill="#1A1714">15</text><rect x="240" y="178" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="260" y="198" text-anchor="middle" font-weight="700" fill="#1A1714">16</text><rect x="60" y="214" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="80" y="234" text-anchor="middle" font-weight="700" fill="#1A1714">17</text><rect x="104" y="214" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="124" y="234" text-anchor="middle" font-weight="700" fill="#1A1714">18</text><rect x="196" y="214" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="216" y="234" text-anchor="middle" font-weight="700" fill="#1A1714">19</text><rect x="240" y="214" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="260" y="234" text-anchor="middle" font-weight="700" fill="#1A1714">20</text><rect x="60" y="250" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="80" y="270" text-anchor="middle" font-weight="700" fill="#1A1714">21</text><rect x="104" y="250" width="40" height="30" rx="5" fill="#C9A227" stroke="#1A1714" stroke-width="1.5"/><text x="124" y="270" text-anchor="middle" font-weight="700" fill="#1A1714">22</text><rect x="196" y="250" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="216" y="270" text-anchor="middle" font-weight="700" fill="#1A1714">23</text><rect x="240" y="250" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="260" y="270" text-anchor="middle" font-weight="700" fill="#1A1714">24</text><rect x="60" y="286" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="80" y="306" text-anchor="middle" font-weight="700" fill="#1A1714">25</text><rect x="104" y="286" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="124" y="306" text-anchor="middle" font-weight="700" fill="#1A1714">26</text><rect x="196" y="286" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="216" y="306" text-anchor="middle" font-weight="700" fill="#1A1714">27</text><rect x="240" y="286" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="260" y="306" text-anchor="middle" font-weight="700" fill="#1A1714">28</text><rect x="60" y="322" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="80" y="342" text-anchor="middle" font-weight="700" fill="#1A1714">29</text><rect x="104" y="322" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="124" y="342" text-anchor="middle" font-weight="700" fill="#1A1714">30</text><rect x="196" y="322" width="40" height="30" rx="5" fill="#C9A227" stroke="#1A1714" stroke-width="1.5"/><text x="216" y="342" text-anchor="middle" font-weight="700" fill="#1A1714">31</text><rect x="240" y="322" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="260" y="342" text-anchor="middle" font-weight="700" fill="#1A1714">32</text><rect x="60" y="358" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="80" y="378" text-anchor="middle" font-weight="700" fill="#1A1714">33</text><rect x="104" y="358" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="124" y="378" text-anchor="middle" font-weight="700" fill="#1A1714">34</text><rect x="196" y="358" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="216" y="378" text-anchor="middle" font-weight="700" fill="#1A1714">35</text><rect x="240" y="358" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="260" y="378" text-anchor="middle" font-weight="700" fill="#1A1714">36</text><rect x="60" y="394" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="80" y="414" text-anchor="middle" font-weight="700" fill="#1A1714">37</text><rect x="104" y="394" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="124" y="414" text-anchor="middle" font-weight="700" fill="#1A1714">38</text><rect x="196" y="394" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="216" y="414" text-anchor="middle" font-weight="700" fill="#1A1714">39</text><rect x="240" y="394" width="40" height="30" rx="5" fill="#C9A227" stroke="#1A1714" stroke-width="1.5"/><text x="260" y="414" text-anchor="middle" font-weight="700" fill="#1A1714">40</text><rect x="60" y="430" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="80" y="450" text-anchor="middle" font-weight="700" fill="#1A1714">41</text><rect x="104" y="430" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="124" y="450" text-anchor="middle" font-weight="700" fill="#1A1714">42</text><rect x="196" y="430" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="216" y="450" text-anchor="middle" font-weight="700" fill="#1A1714">43</text><rect x="240" y="430" width="40" height="30" rx="5" fill="#E4DDCB" stroke="#1A1714" stroke-width="1.5"/><text x="260" y="450" text-anchor="middle" font-weight="700" fill="#1A1714">44</text>
  <rect x="150" y="470" width="40" height="28" fill="#D6CDB6" stroke="#1A1714"/><text x="153" y="488" font-size="9">WC</text>
  <text x="150" y="512" font-size="10">FUNDO</text>
  <rect x="320" y="70" width="14" height="178" fill="rgba(62,106,138,.35)"/><text x="340" y="160" font-weight="700" font-size="11">ROTEADOR DIANTEIRO</text><text x="340" y="176" font-size="11">fileiras 1 a 5 (assentos 1 a 20)</text>
  <rect x="320" y="250" width="14" height="250" fill="rgba(94,122,74,.35)"/><text x="340" y="370" font-weight="700" font-size="11">ROTEADOR TRASEIRO</text><text x="340" y="386" font-size="11">fileiras 6 a 11 (21 a 44) e WC</text>
  <text x="340" y="84" font-size="11">porta dianteira (preto)</text><text x="340" y="100" font-size="11">C1: grava a porta e as fileiras 1 e 2</text>
  <rect x="340" y="440" width="14" height="14" fill="#A3141C"/><text x="360" y="451" font-size="11">assento da vítima (12)</text>
  <rect x="340" y="462" width="14" height="14" fill="#C9A227"/><text x="360" y="473" font-size="11">assentos citados no inquérito</text>
  <text x="340" y="496" font-size="11">corredor no meio do ônibus</text>
</svg>`,
  praca: () => `<svg viewBox="0 0 640 520" class="svg-planta" font-family="Courier" font-size="12">
  <rect width="640" height="520" fill="#F1EBDD"/>
  <text x="16" y="24" font-weight="700" font-size="14">PRAÇA DA MATRIZ — SERRA DO CORVO</text>
  <rect x="16" y="40" width="190" height="150" fill="#E4DDCB" stroke="#1A1714" stroke-width="3"/><text x="30" y="70" font-weight="700">IGREJA MATRIZ</text>
  <rect x="150" y="48" width="44" height="44" fill="#D6CDB6" stroke="#1A1714" stroke-width="2"/><text x="154" y="74" font-size="10">TORRE</text>
  <rect x="16" y="200" width="190" height="120" fill="#E4DDCB" stroke="#1A1714" stroke-width="3"/><text x="28" y="226" font-weight="700">SALÃO PAROQUIAL</text>
  <rect x="24" y="250" width="90" height="62" fill="#D6CDB6" stroke="#1A1714" stroke-width="2"/><text x="34" y="285" font-weight="700" font-size="11">DEPÓSITO</text>
  <rect x="10" y="262" width="10" height="34" fill="#A3141C"/>
  <rect x="200" y="250" width="10" height="30" fill="#1A1714"/><text x="214" y="296" font-size="9">porta da</text><text x="214" y="307" font-size="9">frente</text><text x="214" y="318" font-size="9">(fechada)</text>
  <line x1="6" y1="40" x2="6" y2="420" stroke="#1A1714" stroke-width="2" stroke-dasharray="8 5"/><text x="2" y="440" font-size="10">RUA DE TRÁS</text>
  <rect x="20" y="360" width="110" height="50" fill="#E4DDCB" stroke="#1A1714" stroke-width="2"/><text x="28" y="390" font-size="11" font-weight="700">FARMÁCIA</text>
  <circle cx="30" cy="350" r="10" fill="#1A1714"/><text x="22" y="354" fill="#fff" font-weight="700" font-size="9">F1</text>
  <path d="M30 340 L14 300 L46 300 Z" fill="rgba(163,20,28,.18)"/>
  <rect x="240" y="60" width="300" height="270" fill="none" stroke="#1A1714" stroke-width="2" stroke-dasharray="5 4"/><text x="250" y="80" font-weight="700">PRAÇA (festa)</text>
  <circle cx="390" cy="190" r="34" fill="#E4DDCB" stroke="#1A1714" stroke-width="2"/><text x="364" y="194" font-weight="700" font-size="11">CORETO</text>
  <rect x="260" y="250" width="100" height="36" fill="#C9A227" stroke="#1A1714"/><text x="266" y="272" font-size="10" font-weight="700">BARRACA PASTEL</text>
  <rect x="440" y="250" width="86" height="36" fill="#C9A227" stroke="#1A1714"/><text x="452" y="272" font-size="10" font-weight="700">MESA DA RIFA</text>
  <rect x="270" y="100" width="90" height="30" fill="#C9A227" stroke="#1A1714"/><text x="278" y="120" font-size="10" font-weight="700">QUENTÃO</text>
  <text x="250" y="352" font-weight="700" font-size="11">RUA DA MATRIZ</text>
  <rect x="380" y="360" width="140" height="46" fill="#E4DDCB" stroke="#1A1714" stroke-width="2"/><text x="390" y="388" font-size="11" font-weight="700">BAR DO TIÃO</text>
  <rect x="250" y="360" width="110" height="46" fill="none" stroke="#1A1714" stroke-dasharray="4 3"/><text x="256" y="388" font-size="10">vagas (van)</text>
  <path d="M545 60 C600 120 600 250 610 330" fill="none" stroke="#1A1714" stroke-width="3" stroke-dasharray="10 6"/>
  <text x="440" y="50" font-size="11" font-weight="700">ESTRADA DO MIRANTE →</text><text x="540" y="345" font-size="10">mirante: 2 km</text>
  <text x="16" y="470" font-size="11">Mercadinho Assunção: a 3 quadras, fora do croqui.</text>
  <text x="16" y="490" font-size="11">F1 grava a rua de trás e a porta lateral do salão (vermelho),</text><text x="16" y="508" font-size="11">que só abre com chave.</text>
</svg>`,
  planta: () => `<svg viewBox="0 0 640 560" class="svg-planta" font-family="Courier" font-size="12">
  <rect width="640" height="560" fill="#F1EBDD"/>
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
  <rect x="470" y="110" width="12" height="36" fill="#A3141C"/><text x="352" y="150" font-size="11">porta única do escritório →</text>
  <g fill="#A3141C" font-weight="700" font-size="12">
    <circle cx="150" cy="60" r="11"/><text x="143" y="64" fill="#fff">S8</text>
    <circle cx="310" cy="160" r="11"/><text x="303" y="164" fill="#fff">S6</text>
    <circle cx="450" cy="60" r="11"/><text x="443" y="64" fill="#fff">S4</text>
    <circle cx="150" cy="226" r="11"/><text x="143" y="230" fill="#fff">S5</text>
    <circle cx="310" cy="226" r="11"/><text x="303" y="230" fill="#fff">S2</text>
    <circle cx="450" cy="226" r="11"/><text x="443" y="230" fill="#fff">S3</text>
    <circle cx="600" cy="196" r="11"/><text x="593" y="200" fill="#fff">S1</text>
  </g>
    <rect x="336" y="338" width="288" height="30" fill="#E3D9C4" stroke="#1A1714" stroke-width="2" stroke-dasharray="5 4"/>
  <text x="346" y="358" font-weight="700" font-size="11">VARANDA LATERAL (sem sensor e sem câmera)</text>
  <rect x="380" y="328" width="34" height="10" fill="#1A1714"/><text x="372" y="322" font-size="10">porta</text>
<text x="16" y="400" font-weight="700" font-size="14">PÁTIO / JARDIM</text>
  <rect x="16" y="408" width="420" height="60" fill="none" stroke="#1A1714" stroke-dasharray="4 4"/>
  <circle cx="40" cy="438" r="11" fill="#1A1714"/><text x="31" y="442" fill="#fff" font-weight="700">C1</text>
  <text x="60" y="442">câmera cobre o pátio até a entrada do jardim</text>
  <text x="340" y="460">gazebo (fora da câmera) →</text>
  <text x="476" y="400" font-weight="700" font-size="14">ANDAR SUPERIOR</text>
  <rect x="476" y="408" width="148" height="140" fill="none" stroke="#1A1714" stroke-width="3"/>
  <line x1="476" y1="420" x2="624" y2="420" stroke="#1A1714" stroke-width="2"/>
  <text x="486" y="436">hall superior (S6)</text><text x="486" y="486">SUÍTE DO CASAL</text><text x="486" y="506">+ banheiro com</text><text x="486" y="524">armário de remédios</text>
  <text x="16" y="510">Portão social: P1</text><text x="16" y="530">Sensores repetem o registro a cada 5 min com presença.</text>
</svg>`,
};

export const ilustracoes = ILUS;
