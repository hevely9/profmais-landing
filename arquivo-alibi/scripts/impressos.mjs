// ARQUIVO ÁLIBI — folhas de imprimir (modo papel), no visual colorido do dossiê: capa de pasta, documentos em papel,
// fotos coloridas. UM gerador só para tudo que é impresso, para nada ficar desatualizado:
//   impresso-dossie.pdf   ESSENCIAL: regras, pessoas e documentos iniciais em fluxo compacto
//   impresso-opcional.pdf capa da pasta + fichas recortáveis · impresso-completo.pdf = tudo (vai para dist/pdf/)
//   impresso-obj1/2.pdf   provas novas liberadas em cada objetivo
//   impresso-solucao.pdf  solução + interrogatório
// Estes PDFs NUNCA vão soltos para o site: o build os criptografa (dossiê com o código; provas novas e solução
// com a chave do objetivo) e a Central monta o arquivo no navegador só depois do código / do acerto.
// Uso: NODE_PATH=$(npm root -g) node scripts/impressos.mjs <slug>
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { renderProva } from "../site/render.js";

const { chromium } = createRequire(import.meta.url)("playwright");
const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const slug = process.argv[2] || "mansao-valente";
const b = JSON.parse(fs.readFileSync(path.join(RAIZ, "casos", slug, "biblia.json"), "utf8"));
const OUT = path.join(RAIZ, "dist", "impressos", slug); fs.mkdirSync(OUT, { recursive: true });
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const dirMidia = path.join(RAIZ, "casos", slug, "midia");
const dirJpg = path.join(OUT, ".jpg"); fs.mkdirSync(dirJpg, { recursive: true });
// fotos coloridas em JPEG (o Chrome embute JPEG sem recomprimir; WebP viraria imagem pesada)
const src = (nome) => {
  const f = fs.readdirSync(dirMidia).find((x) => x.replace(/\.\w+$/, "") === nome); if (!f) return "";
  const jpg = path.join(dirJpg, nome + ".jpg");
  if (!fs.existsSync(jpg)) execFileSync("python3", ["-c", "import sys;from PIL import Image;im=Image.open(sys.argv[1]).convert('RGB');im.thumbnail((1000,1000));im.save(sys.argv[2],'JPEG',quality=74,optimize=True,progressive=True)", path.join(dirMidia, f), jpg]);
  return `file://${jpg}`;
};
const CTX = { pdf: true, src };
const foto = (nome) => `<img src="${src(nome)}" alt="">`;
const css = ["tokens.css", "docs.css"].map((f) => fs.readFileSync(path.join(RAIZ, "site", f), "utf8")).join("\n").replaceAll('url("fonts/', `url("file://${RAIZ}/site/fonts/`);

const ESTILO = `${css}
@page { size: A4; margin: 14mm 13mm 16mm; }
body { margin: 0; font-family: var(--f-texto); color: var(--tinta); }
.pag { break-after: page; } .pag:last-child { break-after: auto; }
.capa { height: 252mm; box-sizing: border-box; position: relative; background: linear-gradient(170deg, #CFAE74, #A9844C); border-radius: 6px 26px 8px 8px; padding: 22mm 16mm; color: var(--tinta); overflow: hidden; }
.capa .etq { position: absolute; top: 0; left: 0; background: #E9DDBE; padding: 6px 22px; border-radius: 0 0 14px 0; font-family: var(--f-doc); font-weight: 700; font-size: 14px; }
.capa .alibi { font-family: var(--f-titulo); font-weight: 900; font-size: 64px; letter-spacing: .14em; position: relative; display: inline-block; padding: 0 12px; color: var(--osso); }
.capa .alibi::before { content: ""; position: absolute; inset: 40% -4px 4% -4px; background: var(--lacre); transform: skewX(-12deg) rotate(-1.5deg); z-index: -1; }
.capa .arq { font-family: var(--f-doc); font-weight: 700; letter-spacing: .4em; font-size: 15px; margin-top: 8px; }
.capa h1 { font-family: var(--f-impacto); font-weight: 800; font-size: 54px; line-height: 1.04; margin: 22mm 0 6mm; }
.capa .sub { font-family: var(--f-maquina); font-size: 18px; line-height: 1.4; max-width: 112mm; }
.capa .carimbo { position: absolute; left: 14mm; top: 168mm; border: 6px solid var(--lacre); color: var(--lacre); font-family: var(--f-maquina); font-size: 40px; padding: 4px 18px; transform: rotate(-12deg); }
.capa .cnum { position: absolute; left: 16mm; bottom: 22mm; font-family: var(--f-doc); font-weight: 700; font-size: 16px; line-height: 1.6; }
.capa .fita { position: absolute; top: 60mm; left: -10mm; width: 70mm; height: 14mm; background: rgba(201,162,39,.6); transform: rotate(-24deg); }
.capa .fotinha { position: absolute; right: 16mm; top: 122mm; width: 46mm; background: #F4F1EA; padding: 3mm 3mm 9mm; transform: rotate(5deg); box-shadow: 0 6px 18px rgba(0,0,0,.35); }
.capa .fotinha img { width: 100%; height: 50mm; object-fit: cover; object-position: top; display: block; }
.capa .fotinha span { position: absolute; left: 0; right: 0; bottom: 2mm; text-align: center; font-family: var(--f-maquina); font-size: 12px; }
h2.sec { font-family: var(--f-impacto); font-size: 26px; margin: 0 0 4mm; border-bottom: 3px solid var(--lacre); padding-bottom: 2mm; }
.regras { font-size: 13.5px; line-height: 1.55; } .regras h3 { font-family: var(--f-impacto); font-size: 16px; margin: 5mm 0 2mm; }
.regras ol { margin: 0; padding-left: 6mm; } .regras li { margin-bottom: 1.5mm; }
.box { border: 2px solid var(--tinta); padding: 4mm 5mm; margin: 4mm 0; border-radius: 3px; } .box.alerta { border-color: var(--lacre); }
.codigo-box { display: flex; align-items: center; justify-content: space-between; gap: 6mm; border: 3px dashed var(--tinta); padding: 4mm 6mm; margin: 4mm 0; background: rgba(201,162,39,.14); }
.codigo-box b { font-family: var(--f-doc); font-size: 22px; letter-spacing: .08em; white-space: nowrap; } .codigo-box span { font-size: 12px; max-width: 80mm; }
.vit { display: grid; grid-template-columns: 50mm 1fr; gap: 5mm; align-items: center; border: 2px solid var(--tinta); padding: 3mm; margin-bottom: 5mm; font-size: 13px; } .vit img { width: 50mm; height: 56mm; object-fit: cover; object-position: top; display: block; }
.pers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; } .pers .p { border: 1px solid #B8AD96; padding: 2.5mm; font-size: 11.5px; line-height: 1.35; break-inside: avoid; } .pers img { width: 100%; height: 52mm; object-fit: cover; object-position: top; display: block; margin-bottom: 2mm; }
.fluxo { zoom: .72; } .fluxo .prova-pag { break-inside: avoid; margin: 0 0 5mm; } .fluxo .doc > :first-child, .fluxo .doc h3, .fluxo .doc .doc-titulo { break-after: avoid; } .fluxo tr, .fluxo .qa, .fluxo img, .fluxo figure, .fluxo .anexo, .fluxo .msg { break-inside: avoid; } .fluxo .prova-pag .foto img { max-height: 95mm; } .fluxo .prova-pag .anexo img { height: 52mm; }
.regras.compacta { font-size: 12.5px; line-height: 1.45; } .regras.compacta h3 { margin: 3mm 0 1.5mm; }
.prova-pag .doc { box-shadow: none; border: 1px solid #B8AD96; padding: 18px 20px 12px; break-inside: auto; }
.prova-pag .doc-tab td, .prova-pag .doc-tab th { padding: 3px 6px; }
.prova-pag .foto img { max-height: 120mm; object-fit: contain; background: #fff; }
.prova-pag .anexo img { height: 62mm; width: auto; max-width: 100%; margin: 0 auto; object-fit: contain; } .prova-pag .anexo { text-align: center; }
.prova-pag .audio-pdf { font-size: 14px; padding: 4mm 5mm; border-width: 2px; }
.recorte { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; } .recorte .r { border: 1.5px dashed #777; padding: 4mm; text-align: center; font-size: 12px; } .recorte img { width: 100%; height: 60mm; object-fit: cover; object-position: top; display: block; margin-bottom: 2mm; }
.faixa { background: linear-gradient(170deg, #CFAE74, #A9844C); border-radius: 4px 16px 4px 4px; padding: 8mm 10mm; margin-bottom: 6mm; color: var(--tinta); position: relative; }
.faixa small { font-family: var(--f-doc); font-weight: 700; letter-spacing: .14em; } .faixa h1 { font-family: var(--f-impacto); font-size: 30px; margin: 2mm 0; line-height: 1.1; }
.faixa .carimbo { position: absolute; right: 8mm; top: 8mm; border: 4px solid var(--lacre); color: var(--lacre); font-family: var(--f-maquina); font-size: 22px; padding: 2px 10px; transform: rotate(-8deg); }
.sol { font-family: var(--f-doc); font-size: 12px; line-height: 1.45; background: var(--papel); padding: 6mm 8mm; border-radius: 3px; } .sol h2 { font-family: var(--f-impacto); font-size: 18px; margin: 5mm 0 2mm; } .sol p { margin: 0 0 3mm; }
`;
const rodape = (t) => `<div style="width:100%;font-size:7.5px;color:#555;padding:0 13mm;display:flex;justify-content:space-between;font-family:Arial"><span>ARQUIVO ÁLIBI · CASO Nº ${b.numero} · ${t} · Caso fictício. Qualquer semelhança com fatos ou pessoas reais é coincidência. · Uso pessoal — proibida a redistribuição.</span><span class="pageNumber"></span></div>`;

// Paginação dos documentos em fluxo: nenhum documento é partido se cabe numa folha; o espaço que sobra no
// fim de uma folha é preenchido com o próximo documento pequeno que caiba (no máximo 3 posições adiante),
// para não sobrar meia folha em branco nem um pedacinho de documento sozinho numa folha.
function paginar() {
  const AREA = (267 * 96) / 25.4; // altura útil da A4 (297 − 30 mm de margens), em px
  for (const fluxo of document.querySelectorAll(".fluxo")) {
    const itens = [...fluxo.children];
    const alt = new Map(itens.map((el) => { const r = el.getBoundingClientRect(); const mb = parseFloat(getComputedStyle(el).marginBottom) || 0; return [el, r.height + mb * (r.height / (el.offsetHeight || r.height || 1))]; }));
    const fila = [...itens], ordem = [];
    let resta = AREA;
    while (fila.length) {
      let i = fila.findIndex((el, k) => k < 4 && alt.get(el) <= resta);
      let el;
      if (i >= 0) { el = fila.splice(i, 1)[0]; el.style.breakBefore = "auto"; resta -= alt.get(el); }
      else {
        el = fila.shift();
        if (alt.get(el) > AREA) { // maior que uma folha: começa no topo de uma folha nova e pode continuar na seguinte
          el.style.breakBefore = resta < AREA ? "page" : "auto"; el.style.breakInside = "auto";
          resta = AREA - (alt.get(el) % AREA);
        } else { el.style.breakBefore = "page"; resta = AREA - alt.get(el); }
      }
      if (el.style.breakInside !== "auto") el.style.breakInside = "avoid";
      ordem.push(el);
    }
    for (const el of ordem) fluxo.appendChild(el);
  }
}

async function gerar(nome, titulo, corpo) {
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${ESTILO}</style></head><body>${corpo}</body></html>`;
  const arqHtml = path.join(OUT, `${nome}.html`); fs.writeFileSync(arqHtml, html);
  // viewport = área útil da folha A4 (210 − 26 mm de margens), para medir a altura real de cada documento
  const pg = await nav.newPage({ viewport: { width: Math.round((184 * 96) / 25.4), height: 1200 } });
  await pg.emulateMedia({ media: "print" });
  await pg.goto(`file://${arqHtml}`, { waitUntil: "networkidle" }); await pg.evaluate(() => document.fonts.ready);
  await pg.evaluate(paginar);
  const pdf = path.join(OUT, `${nome}.pdf`);
  await pg.pdf({ path: pdf, format: "A4", printBackground: true, displayHeaderFooter: true, headerTemplate: "<span></span>", footerTemplate: rodape(titulo), margin: { top: "14mm", bottom: "16mm", left: "13mm", right: "13mm" } });
  await pg.close(); fs.rmSync(arqHtml);
  const paginas = Number(execFileSync("pdfinfo", [pdf]).toString().match(/Pages:\s+(\d+)/)[1]);
  console.log(`✓ ${nome}.pdf — ${paginas} páginas, ${Math.round(fs.statSync(pdf).size / 1024)} KB`);
  return paginas;
}

const nav = await chromium.launch();
const paginas = {};
const provasIniciais = b.provas.filter((p) => p.origem === "pdf");
const docs = (lista) => lista.map((p) => `<section class="pag prova-pag">${renderProva(p, CTX)}</section>`).join("\n");
const local = b.local.split("—")[0].trim();
const AUDIOS = provasIniciais.filter((p) => p.tipo === "audio").map((p) => p.id);
const IMP = b.impresso || {};

// 1) dossiê. ESSENCIAL (o que precisa estar na mesa): regras, pessoas e TODOS os documentos em fluxo compacto.
//    Nada é destacado nem deixado de fora: separar "importantes" de "não importantes" entregaria a solução.
//    OPCIONAL: capa da pasta e fichas recortáveis. COMPLETO (entrega/Kiwify): capa + essencial + fichas.
const CAPA = `<section class="pag capa"><div class="etq">CASO Nº ${esc(b.numero)}</div><div class="fita"></div>
  <div style="margin-top:14mm"><span class="alibi">ÁLIBI</span><div class="arq">ARQUIVO ÁLIBI</div></div>
  <h1>${esc(b.titulo)}</h1><div class="sub">${esc(b.subtitulo)}</div>
  <div class="fotinha">${foto(b.vitima.foto.rosto)}<span>${esc(b.vitima.nome)}</span></div>
  <div class="carimbo">CONFIDENCIAL</div>
  <div class="cnum">ARQUIVO ÁLIBI — CASO Nº ${esc(b.numero)} — CONFIDENCIAL<br>${esc(b.data_crime)} · ${esc(local)}<br>${esc(b.jogadores)} jogadores · ${esc(b.duracao)} · ${esc(b.classificacao)}</div>
</section>`;
const REGRAS = `<section class="pag regras compacta"><h2 class="sec">Como jogar no papel</h2>
  <div class="box alerta"><b>Aviso de spoiler:</b> não procure a solução. Ela fica trancada na Central até você resolver o caso.</div>
  <h3>Sua missão</h3><p>${esc(b.sinopse)} Você é o investigador. Nestas folhas estão os documentos que a polícia reuniu na primeira noite: boletim, depoimentos, laudos, fotos e registros. Cada documento tem um número (E-01, E-02…).</p>
  <h3>Os ${b.objetivos.length} objetivos</h3><p>${b.objetivos.map((o) => `<b>${o.n}. ${esc(o.titulo)}</b>`).join("<br>")}<br>A pergunta de cada objetivo aparece no celular, um de cada vez. Cada acerto libera provas novas.</p>
  <h3>Passo a passo</h3><ol>
    <li>Leia as folhas com calma. Anote horários e compare o que as pessoas <b>dizem</b> com o que os registros <b>mostram</b>.</li>
    <li>No celular, abra a Central pelo botão <b>“Começar a jogar”</b> na sua área de membros da Kiwify (você já escolheu jogar <b>no papel</b>).</li>
    <li>Toque na resposta e <b>digite os números das provas</b> que mostram que você tem razão (por exemplo, 5 para a E-05). Toque em <b>Conferir resposta</b>.</li>
    <li>Acertou? A Central libera <b>provas novas para imprimir</b>. Sem elas não dá para fechar o caso. Travou? Toque em <b>Pedir dica</b> (3 por objetivo).</li>
  </ol>
  <h3>Provas em áudio</h3><p>Os depoimentos foram gravados${AUDIOS.length ? `, e ${AUDIOS.length === 1 ? "a prova" : "as provas"} ${AUDIOS.map((id) => `<b>${esc(id)}</b>`).join(" e ")} ${AUDIOS.length === 1 ? "existe" : "existem"} só em áudio` : ""}. Nas folhas, elas aparecem com o aviso <b>“Ouça no celular”</b>: abra a Central &gt; Documentos e toque no ▶.</p>
  <div class="codigo-box"><b>${esc(b.codigo)}</b><span>Seu código. Guarde: se precisar abrir o caso de novo, digite-o na Central. Não compartilhe.</span></div>
  <div class="box"><b>Caso fictício.</b> Qualquer semelhança com fatos ou pessoas reais é coincidência. Classificação: ${esc(b.classificacao)}. Uso pessoal — proibida a redistribuição.</div>
</section>`;
const PESSOAS = `<section class="pag"><h2 class="sec">${esc(IMP.titulo_pessoas || "As pessoas da casa")}</h2>
  <div class="vit">${foto(b.vitima.foto.rosto)}<div><b style="font-size:11px;letter-spacing:.1em">A VÍTIMA</b><br><b style="font-size:17px">${esc(b.vitima.nome)}, ${esc(b.vitima.idade)} anos</b><br>${esc(b.vitima.relacao)}<br><br>${esc(IMP.texto_vitima || `Encontrado morto na noite de ${b.data_crime.toLowerCase()}.`)}</div></div>
  <p style="font-size:13px;margin:0 0 3mm">${esc(IMP.texto_suspeitos || "Estavam na casa naquela noite:")}</p>
  <div class="pers">${b.suspeitos.map((s) => `<div class="p">${foto(s.foto.rosto)}<b>${esc(s.nome)}</b>, ${esc(s.idade)}<br>${esc(s.relacao)}</div>`).join("")}</div>
  <p style="font-size:11px;margin-top:3mm">Fotos de identificação. Todas as pessoas são fictícias e as imagens foram criadas para o jogo.</p>
</section>`;
const FICHAS = `<section class="pag"><h2 class="sec">Fichas recortáveis (opcional)</h2><p style="font-size:12px">Recorte na linha tracejada e use as fichas para montar seu quadro de suspeitos.</p>
  <div class="recorte">${b.suspeitos.map((s) => `<div class="r">${foto(s.foto.rosto)}<b>${esc(s.nome)}</b><br>${esc(s.relacao)}</div>`).join("")}</div>
</section>`;
const FLUXO = `<section class="fluxo">${provasIniciais.map((p) => `<div class="prova-pag">${renderProva(p, CTX)}</div>`).join("\n")}</section>`;
paginas["impresso-dossie"] = await gerar("impresso-dossie", "Dossiê — essencial", REGRAS + PESSOAS + FLUXO);
paginas["impresso-opcional"] = await gerar("impresso-opcional", "Dossiê — opcional", CAPA + FICHAS);
paginas["impresso-completo"] = await gerar("impresso-completo", "Dossiê", CAPA + REGRAS + PESSOAS + FLUXO + `<div style="break-before:page"></div>` + FICHAS);

// 2) provas novas de cada objetivo
for (const o of b.objetivos) {
  if (!o.bonus.length) continue;
  const lista = o.bonus.map((id) => b.provas.find((p) => p.id === id));
  paginas[`impresso-obj${o.n}`] = await gerar(`impresso-obj${o.n}`, `Provas novas — objetivo ${o.n}`, `
<section class="fluxo"><div class="prova-pag"><div class="faixa"><small>ARQUIVO ÁLIBI · CASO Nº ${esc(b.numero)}</small><h1>Provas novas</h1><div>Liberadas no objetivo ${o.n}. Junte estas folhas às outras: elas são necessárias para o próximo objetivo.</div><div class="carimbo">NOVAS</div></div></div>
${lista.map((p) => `<div class="prova-pag">${renderProva(p, CTX)}</div>`).join("\n")}</section>`);
}

// 3) solução
const sol = b.solucao, it = sol.interrogatorio;
const termo = { id: "Final", rotulo: "Interrogatório · 24/09", titulo: "Termo de interrogatório", tipo: "depoimento", origem: "final", conteudo: { documento: "TERMO DE INTERROGATÓRIO", declarante: it.declarante, data: it.data, qa: it.qa, foto: it.foto } };
paginas["impresso-solucao"] = await gerar("impresso-solucao", "Solução", `
<section class="pag"><div class="faixa"><small>ARQUIVO ÁLIBI · CASO Nº ${esc(b.numero)}</small><h1>Caso encerrado</h1><div>${esc(b.titulo)}: o que aconteceu.</div><div class="carimbo">SOLUÇÃO</div></div>
<div class="prova-pag">${renderProva(termo, CTX)}</div></section>
<section class="pag"><div class="sol"><h2>O que aconteceu</h2>${sol.relato.map((p) => `<p>${esc(p)}</p>`).join("")}<h2>Como cada pista levava à verdade</h2>${sol.pistas.map(([id, t]) => `<p><b>${esc(id)}</b> — ${esc(t)}</p>`).join("")}</div></section>`);

await nav.close();
fs.rmSync(dirJpg, { recursive: true, force: true });
fs.writeFileSync(path.join(OUT, "paginas.json"), JSON.stringify(paginas, null, 1));
// o dossiê completo para entrega é o mesmo arquivo do modo papel (uma fonte só)
const DPDF = path.join(RAIZ, "dist", "pdf"); fs.mkdirSync(DPDF, { recursive: true });
fs.copyFileSync(path.join(OUT, "impresso-completo.pdf"), path.join(DPDF, `${slug}-dossie.pdf`));
