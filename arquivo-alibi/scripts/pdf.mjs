// ARQUIVO ÁLIBI — gera o dossiê em PDF (A4) a partir da Bíblia, com o MESMO renderizador do site.
// Uso: node scripts/pdf.mjs <slug>   →  dist/pdf/<slug>-dossie.pdf (+ fichas recortáveis no fim)
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { renderProva, retrato } from "../site/render.js";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const slug = process.argv[2] || "mansao-valente";
const b = JSON.parse(fs.readFileSync(path.join(RAIZ, "casos", slug, "biblia.json"), "utf8"));
const cfg = JSON.parse(fs.readFileSync(path.join(RAIZ, "config.json"), "utf8"));
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const OUT = path.join(RAIZ, "dist", "pdf"); fs.mkdirSync(OUT, { recursive: true });

const url = `${cfg.urlFinal}/?c=${b.codigo}`;
const qrArq = path.join(OUT, `${slug}-qr.svg`);
execFileSync("python3", [path.join(RAIZ, "scripts", "qr.py"), url, qrArq]);
const qr = fs.readFileSync(qrArq, "utf8").replace(/<\?xml[^>]*>/, "");
const provas = b.provas.filter((p) => p.origem === "pdf");
const css = ["tokens.css", "docs.css"].map((f) => fs.readFileSync(path.join(RAIZ, "site", f), "utf8")).join("\n").replaceAll('url("fonts/', `url("file://${RAIZ}/site/fonts/`);

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${css}
@page { size: A4; margin: 14mm 13mm 16mm; }
body { margin: 0; font-family: var(--f-texto); color: var(--tinta); }
.pag { break-after: page; } .pag:last-child { break-after: auto; }
.capa { height: 252mm; box-sizing: border-box; position: relative; background: linear-gradient(170deg, #CFAE74, #A9844C); border-radius: 6px 26px 8px 8px; padding: 22mm 16mm; color: var(--tinta); overflow: hidden; }
.capa .etq { position: absolute; top: 0; left: 0; background: #E9DDBE; padding: 6px 22px; border-radius: 0 0 14px 0; font-family: var(--f-doc); font-weight: 700; font-size: 14px; }
.capa .alibi { font-family: var(--f-titulo); font-weight: 900; font-size: 64px; letter-spacing: .14em; position: relative; display: inline-block; padding: 0 12px; color: var(--osso); }
.capa .alibi::before { content: ""; position: absolute; inset: 40% -4px 4% -4px; background: var(--lacre); transform: skewX(-12deg) rotate(-1.5deg); z-index: -1; }
.capa .arq { font-family: var(--f-doc); font-weight: 700; letter-spacing: .4em; font-size: 15px; margin-top: 8px; }
.capa h1 { font-family: var(--f-impacto); font-weight: 800; font-size: 54px; line-height: 1.04; margin: 28mm 0 6mm; }
.capa .sub { font-family: var(--f-maquina); font-size: 18px; line-height: 1.4; max-width: 150mm; }
.capa .carimbo { position: absolute; right: 16mm; top: 168mm; border: 6px solid var(--lacre); color: var(--lacre); font-family: var(--f-maquina); font-size: 40px; padding: 4px 18px; transform: rotate(-12deg); }
.capa .cnum { position: absolute; left: 16mm; bottom: 26mm; font-family: var(--f-doc); font-weight: 700; font-size: 16px; line-height: 1.6; }
.capa .fita { position: absolute; top: 60mm; left: -10mm; width: 70mm; height: 14mm; background: rgba(201,162,39,.6); transform: rotate(-24deg); }
h2.sec { font-family: var(--f-impacto); font-size: 26px; margin: 0 0 4mm; border-bottom: 3px solid var(--lacre); padding-bottom: 2mm; }
.regras { font-size: 13.5px; line-height: 1.55; } .regras h3 { font-family: var(--f-impacto); font-size: 16px; margin: 5mm 0 2mm; }
.box { border: 2px solid var(--tinta); padding: 4mm 5mm; margin: 4mm 0; border-radius: 3px; } .box.alerta { border-color: var(--lacre); }
.codigo { text-align: center; } .codigo .c { font-family: var(--f-doc); font-weight: 700; font-size: 44px; letter-spacing: .14em; border: 3px dashed var(--tinta); padding: 6mm; margin: 6mm auto; display: inline-block; }
.codigo svg { width: 70mm; height: 70mm; }
.pers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5mm; } .pers .p { border: 1px solid #B8AD96; padding: 3mm; font-size: 12px; line-height: 1.35; } .pers svg { width: 100%; height: auto; }
.prova-pag .doc { box-shadow: none; border: 1px solid #B8AD96; }
.recorte { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; } .recorte .r { border: 1.5px dashed #777; padding: 4mm; text-align: center; font-size: 12px; } .recorte svg { width: 100%; height: auto; }
</style></head><body>

<section class="pag capa"><div class="etq">CASO Nº ${esc(b.numero)}</div><div class="fita"></div>
  <div style="margin-top:14mm"><span class="alibi">ÁLIBI</span><div class="arq">ARQUIVO ÁLIBI</div></div>
  <h1>${esc(b.titulo)}</h1><div class="sub">${esc(b.subtitulo)}</div>
  <div class="carimbo">CONFIDENCIAL</div>
  <div class="cnum">ARQUIVO ÁLIBI — CASO Nº ${esc(b.numero)} — CONFIDENCIAL<br>${esc(b.data_crime)} · ${esc(b.local.split("—")[0].trim())}<br>${esc(b.jogadores)} jogadores · ${esc(b.duracao)} · ${esc(b.classificacao)}</div>
</section>

<section class="pag regras"><h2 class="sec">Como jogar</h2>
  <div class="box alerta"><b>Aviso de spoiler:</b> não leia nada na Central de Investigação antes de examinar o dossiê. Não procure a solução: ela fica trancada até você resolver o caso.</div>
  <h3>Sua missão</h3><p>${esc(b.sinopse)} Você é o investigador. Neste dossiê estão os documentos que a polícia reuniu na primeira noite: boletim, depoimentos, laudos, fotos, registros e papéis pessoais. Cada documento tem um número (E-01, E-02…).</p>
  <h3>Os 3 objetivos</h3><p><b>1. Não foi o coração:</b> prove o que realmente causou a morte.<br><b>2. Quem mentiu sobre o álibi?</b> Descubra quem mentiu sobre onde estava e prove a mentira.<br><b>3. Acusação final:</b> quem foi, como e por quê.</p>
  <p>Os objetivos são resolvidos em ordem. Cada objetivo que você acerta libera <b>provas novas</b> na Central, que não estão neste PDF. Sem elas não dá para fechar o caso.</p>
  <h3>Como usar a Central de Investigação</h3><p>Abra <b>${esc(cfg.urlFinal.replace("https://", ""))}</b> no celular ou no computador (ou leia o QR code da próxima página) e digite o código do caso. Para cada objetivo, escolha sua resposta e marque as provas (pelos números) que a sustentam. Se errar, a Central diz se você está perto. Travou? Peça uma dica: são 3 por objetivo, da mais leve à que praticamente entrega a resposta. O progresso fica salvo no seu navegador.</p>
  <h3>Dicas de investigador</h3><p>Anote horários. Compare o que as pessoas <b>dizem</b> com o que os registros <b>mostram</b>. Desconfie de quem tem o álibi perfeito e também de quem não tem nenhum. Jogando em grupo, dividam os documentos e depois discutam.</p>
  <div class="box"><b>Caso fictício.</b> Qualquer semelhança com fatos ou pessoas reais é coincidência. Classificação: ${esc(b.classificacao)}. Uso pessoal — proibida a redistribuição.</div>
</section>

<section class="pag codigo"><h2 class="sec" style="text-align:left">Código do caso</h2>
  <p style="font-size:15px">Digite este código na Central de Investigação:</p><div class="c">${esc(b.codigo)}</div>
  <p style="font-size:14px">ou aponte a câmera do celular para o QR code:</p>${qr}
  <p style="font-family:var(--f-doc);font-size:13px">${esc(url)}</p>
  <div class="box" style="text-align:left;font-size:13px">Este código é exclusivo do seu dossiê. Não compartilhe. A Central não guarda dados pessoais: o progresso fica só no seu navegador.</div>
</section>

<section class="pag"><h2 class="sec">As pessoas da casa</h2>
  <p style="font-size:13px">Estavam na Mansão Valente na noite de ${esc(b.data_crime.toLowerCase())}. A vítima: <b>Augusto Valente, 71 anos</b>, fundador da Cristais Valente.</p>
  <div class="pers">${b.suspeitos.map((s) => `<div class="p">${retrato(s)}<b>${esc(s.nome)}</b>, ${esc(s.idade)}<br>${esc(s.relacao)}</div>`).join("")}</div>
  <p style="font-size:11px;margin-top:4mm">Retratos falados (ilustrações). Todos os personagens são fictícios.</p>
</section>

${provas.map((p) => `<section class="pag prova-pag">${renderProva(p)}</section>`).join("\n")}

<section class="pag"><h2 class="sec">Fichas recortáveis (opcional)</h2><p style="font-size:12px">Recorte na linha tracejada e use as fichas para montar seu quadro de suspeitos.</p>
  <div class="recorte">${b.suspeitos.map((s) => `<div class="r">${retrato(s)}<b>${esc(s.nome)}</b><br>${esc(s.relacao)}</div>`).join("")}</div>
</section>
</body></html>`;

const htmlArq = path.join(OUT, `${slug}-dossie.html`);
fs.writeFileSync(htmlArq, html);
const nav = await chromium.launch();
const pg = await nav.newPage();
await pg.goto(`file://${htmlArq}`, { waitUntil: "networkidle" });
await pg.evaluate(() => document.fonts.ready);
await pg.pdf({
  path: path.join(OUT, `${slug}-dossie.pdf`), format: "A4", printBackground: true, displayHeaderFooter: true,
  headerTemplate: "<span></span>",
  footerTemplate: `<div style="width:100%;font-size:7.5px;color:#555;padding:0 13mm;display:flex;justify-content:space-between;font-family:Arial"><span>ARQUIVO ÁLIBI · CASO Nº ${b.numero} · Caso fictício. Qualquer semelhança com fatos ou pessoas reais é coincidência. · Uso pessoal — proibida a redistribuição.</span><span class="pageNumber"></span></div>`,
  margin: { top: "14mm", bottom: "16mm", left: "13mm", right: "13mm" },
});
await nav.close();
console.log(`✓ dist/pdf/${slug}-dossie.pdf (${provas.length} provas)`);
