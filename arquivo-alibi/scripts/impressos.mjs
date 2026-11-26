// ARQUIVO ÁLIBI — folhas de imprimir (modo papel): versão econômica, fundo branco, P&B, 2–3 documentos por página.
// Gera dist/impressos/<slug>/impresso-{dossie,obj1,obj2,solucao}.pdf + paginas.json.
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
const src = (nome) => { // foto em tons de cinza, leve
  const f = fs.readdirSync(dirMidia).find((x) => x.replace(/\.\w+$/, "") === nome); if (!f) return "";
  const jpg = path.join(dirJpg, nome + ".jpg");
  if (!fs.existsSync(jpg)) execFileSync("python3", ["-c", "import sys;from PIL import Image,ImageOps;im=Image.open(sys.argv[1]).convert('L');im=ImageOps.autocontrast(im,cutoff=1);im.thumbnail((900,900));im.save(sys.argv[2],'JPEG',quality=70,optimize=True)", path.join(dirMidia, f), jpg]);
  return `file://${jpg}`;
};
const CTX = { pdf: true, src };
const css = ["tokens.css", "docs.css"].map((f) => fs.readFileSync(path.join(RAIZ, "site", f), "utf8")).join("\n").replaceAll('url("fonts/', `url("file://${RAIZ}/site/fonts/`);
const ESTILO = `${css}
@page { size: A4; margin: 11mm 10mm 13mm; }
* { -webkit-print-color-adjust: economy; }
body { margin: 0; font-family: var(--f-texto); color: #000; background: #fff; font-size: 10.5px; }
.cols { column-count: 2; column-gap: 6mm; column-fill: auto; }
.doc { background: #fff !important; background-image: none !important; box-shadow: none !important; border: 1px solid #000; border-radius: 0; padding: 8px 10px 7px; font-size: 11.5px; line-height: 1.4; break-inside: avoid; margin: 0 0 5mm; color: #000; display: block; }
.doc::before { display: none; }
.doc-tipo { font-size: 7.5px; color: #000; } .doc-id { background: #000 !important; color: #fff; font-size: 12px; padding: 1px 6px; outline: none !important; }
.doc-titulo { font-size: 14px; margin: 2px 0 6px; } .doc-pe { display: none; }
.of-orgao { font-size: 9.5px; } .of-doc { font-size: 11px; margin-bottom: 6px; }
.doc-campos, .doc-tab { font-size: 10.5px; } .doc-campos th, .doc-campos td, .doc-tab td, .doc-tab th { padding: 2px 4px; }
.doc-campos th { background: #eee; border-color: #000; } .doc-campos td { border-color: #000; } .doc-tab th { background: #000; color: #fff; } .doc-tab td { border-color: #999; } .doc-tab tr:nth-child(even) td { background: #f2f2f2; }
.nota { background: #f2f2f2; border-left: 3px solid #000; font-size: 10.5px; padding: 3px 6px; }
.chat, .appcard, .recibo, .jornal, .carta, .agenda { background: #fff !important; color: #000 !important; border: 1px solid #000; box-shadow: none; transform: none; background-image: none !important; max-width: none; }
.chat-top small, .msg i { color: #333; } .msg { background: #fff; border: 1px solid #999; margin-right: 10px; } .msg b { color: #000; }
.j-col { column-count: 1; } .agenda .ag-it { color: #000; }
.ilus svg { border: 1px solid #000; box-shadow: none; }
.foto img, .anexo img { border: 1px solid #000; box-shadow: none; max-height: 48mm; width: auto; max-width: 100%; display: block; margin: 0 auto; min-height: 0; background: #fff; }
.dep-cab { grid-template-columns: 52px 1fr; gap: 7px; } .dep-foto img { width: 52px; height: 62px; border: 1px solid #000; box-shadow: none; }
.audio-prova.audio-pdf { border: 1.5px dashed #000; padding: 5px 8px; margin: 5px 0; font-size: 11px; display: block; }
.qa .a { padding-left: 8px; margin-bottom: 5px; } .notas { font-size: 10.5px; padding-left: 14px; } .ilus figcaption, .anexo figcaption { font-size: 8.5px; }
.cab { border: 2px solid #000; padding: 4mm 5mm; margin-bottom: 5mm; break-inside: avoid; }
.cab h1 { font-family: var(--f-impacto); font-size: 18px; margin: 0 0 1mm; } .cab .sub { font-size: 10px; letter-spacing: .12em; font-weight: 700; }
.cab ol { margin: 2mm 0 0; padding-left: 5mm; font-size: 10.5px; line-height: 1.45; }
.pessoas { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2mm; margin-bottom: 5mm; break-inside: avoid; }
.pessoas div { font-size: 8px; line-height: 1.2; } .pessoas img { width: 100%; height: 26mm; object-fit: cover; object-position: top; border: 1px solid #000; display: block; margin-bottom: 1mm; }
.sol p { margin: 0 0 6px; font-size: 10.5px; line-height: 1.45; } .sol h2 { font-family: var(--f-impacto); font-size: 14px; margin: 4mm 0 2mm; }
`;
const rodape = (t) => `<div style="width:100%;font-size:7px;color:#000;padding:0 10mm;display:flex;justify-content:space-between;font-family:Arial"><span>ARQUIVO ÁLIBI · CASO Nº ${b.numero} · ${t} · Caso fictício. Uso pessoal — proibida a redistribuição.</span><span><span class="pageNumber"></span>/<span class="totalPages"></span></span></div>`;

async function gerar(nome, titulo, corpo) {
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${ESTILO}</style></head><body>${corpo}</body></html>`;
  const arqHtml = path.join(OUT, `${nome}.html`); fs.writeFileSync(arqHtml, html);
  const pg = await nav.newPage();
  await pg.goto(`file://${arqHtml}`, { waitUntil: "networkidle" }); await pg.evaluate(() => document.fonts.ready);
  const pdf = path.join(OUT, `${nome}.pdf`);
  await pg.pdf({ path: pdf, format: "A4", printBackground: true, displayHeaderFooter: true, headerTemplate: "<span></span>", footerTemplate: rodape(titulo), margin: { top: "11mm", bottom: "13mm", left: "10mm", right: "10mm" } });
  await pg.close(); fs.rmSync(arqHtml);
  const paginas = Number(execFileSync("pdfinfo", [pdf]).toString().match(/Pages:\s+(\d+)/)[1]);
  console.log(`✓ ${nome}.pdf — ${paginas} páginas, ${Math.round(fs.statSync(pdf).size / 1024)} KB`);
  return paginas;
}

const nav = await chromium.launch();
const paginas = {};
const provasIniciais = b.provas.filter((p) => p.origem === "pdf");
const docs = (lista) => `<div class="cols">${lista.map((p) => renderProva(p, CTX)).join("")}</div>`;

paginas["impresso-dossie"] = await gerar("impresso-dossie", "Documentos do caso", `
<div class="cab"><div class="sub">ARQUIVO ÁLIBI · CASO Nº ${esc(b.numero)} · DOCUMENTOS PARA IMPRIMIR</div><h1>${esc(b.titulo)}</h1>
<div>${esc(b.sinopse)}</div>
<ol><li>Leia os documentos com calma. Cada um tem um número (E-01, E-02…).</li><li>No celular, abra a Central, veja o objetivo e escolha a resposta.</li><li>Digite os números das provas que sustentam a resposta e toque em “Conferir resposta”.</li><li>Acertou? A Central libera provas novas para imprimir. Os áudios você ouve no celular.</li></ol></div>
<div class="pessoas"><div><img src="${src(b.vitima.foto.rosto)}"><b>${esc(b.vitima.nome)}</b>, ${b.vitima.idade}<br>a vítima</div>${b.suspeitos.map((s) => `<div><img src="${src(s.foto.rosto)}"><b>${esc(s.nome)}</b>, ${s.idade}<br>${esc(s.relacao)}</div>`).join("")}</div>
${docs(provasIniciais)}`);

for (const o of b.objetivos) {
  if (!o.bonus.length) continue;
  const lista = o.bonus.map((id) => b.provas.find((p) => p.id === id));
  paginas[`impresso-obj${o.n}`] = await gerar(`impresso-obj${o.n}`, `Provas novas do objetivo ${o.n}`, `<div class="cab"><div class="sub">ARQUIVO ÁLIBI · CASO Nº ${esc(b.numero)}</div><h1>Provas novas — liberadas no objetivo ${o.n}</h1><div>Junte estas folhas às outras. Elas são necessárias para o próximo objetivo.</div></div>${docs(lista)}`);
}

const sol = b.solucao, it = sol.interrogatorio;
const termo = { id: "Final", rotulo: "Interrogatório · 24/09", titulo: "Termo de interrogatório", tipo: "depoimento", origem: "final", conteudo: { documento: "TERMO DE INTERROGATÓRIO", declarante: it.declarante, data: it.data, qa: it.qa, foto: it.foto } };
paginas["impresso-solucao"] = await gerar("impresso-solucao", "Solução", `<div class="cab"><div class="sub">ARQUIVO ÁLIBI · CASO Nº ${esc(b.numero)} · SOLUÇÃO</div><h1>${esc(b.titulo)}: o que aconteceu</h1></div>
<div class="cols">${renderProva(termo, CTX)}<div class="sol"><h2>O que aconteceu</h2>${sol.relato.map((p) => `<p>${esc(p)}</p>`).join("")}<h2>Como cada pista levava à verdade</h2>${sol.pistas.map(([id, t]) => `<p><b>${esc(id)}</b> ${esc(t)}</p>`).join("")}</div></div>`);

await nav.close();
fs.rmSync(dirJpg, { recursive: true, force: true });
fs.writeFileSync(path.join(OUT, "paginas.json"), JSON.stringify(paginas, null, 1));
