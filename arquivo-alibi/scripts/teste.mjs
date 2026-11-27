// Teste ponta a ponta da Central (Playwright), no celular (390px), nos DOIS modos.
// Uso: NODE_PATH=$(npm root -g) node scripts/teste.mjs <slug> [pasta-de-prints] [--ajuda]
//   --ajuda: além do teste, gera as imagens do "Precisa de ajuda?" em site/ajuda/ (sem spoiler).
import fs from "node:fs"; import path from "node:path"; import { spawn, execFileSync } from "node:child_process"; import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const slug = process.argv[2] || "mansao-valente", PR = process.argv[3] && !process.argv[3].startsWith("--") ? process.argv[3] : null;
const AJUDA = process.argv.includes("--ajuda");
const b = JSON.parse(fs.readFileSync(path.join(RAIZ, "casos", slug, "biblia.json"), "utf8"));
const SITE = path.join(RAIZ, "dist", "site");
const srv = spawn("python3", ["-m", "http.server", "8799"], { cwd: SITE, stdio: "ignore" });
await new Promise((r) => setTimeout(r, 800));
const nav = await chromium.launch();
let ok = true; const falha = (m) => { ok = false; console.log("✗", m); }; const passo = (m) => console.log("✓", m);
let nShot = 0; const shot = async (pg, n) => { if (!PR) return; nShot++; await pg.screenshot({ path: path.join(PR, `${n}.png`) }); };
const URL0 = "http://localhost:8799/";
const LINK_KIWIFY = `${URL0}?c=${b.codigo}`;
// combinações ALTERNATIVAS (não as óbvias), para provar que todas valem
const RESPS = {
  "mansao-valente": { 1: [{ fato: "c" }, ["E-05", "E-07", "E-26"]], 2: [{ suspeito: "caio" }, ["E-02", "E-27", "B-02"]], 3: [{ suspeito: "caio", metodo: "m1", motivo: "mo2" }, ["B-07", "E-17", "E-16"]], fraca: [{ suspeito: "caio" }, ["E-02", "E-12", "E-27"]] },
  "linha-404": { 1: [{ fato: "c" }, ["E-05", "E-08", "E-07"]], 2: [{ suspeito: "davi" }, ["E-02", "B-02", "E-15"]], 3: [{ suspeito: "davi", metodo: "m1", motivo: "mo2" }, ["B-05", "B-03", "B-08"]], fraca: [{ suspeito: "davi" }, ["E-09", "E-02", "E-15"]] },
  "serra-do-corvo": { 1: [{ fato: "c" }, ["E-05", "E-04", "E-21"]], 2: [{ suspeito: "gilberto" }, ["E-08", "B-02", "E-17"]], 3: [{ suspeito: "gilberto", metodo: "m1", motivo: "mo2" }, ["B-05", "B-06", "B-03"]], fraca: [{ suspeito: "gilberto" }, ["E-08", "E-02", "E-17"]] },
};
const RESP = RESPS[slug];
// prova com áudio de verdade (só as que já têm arquivo gravado)
const temArq = (n) => fs.readdirSync(path.join(RAIZ, "casos", slug, "midia")).some((f) => f.replace(/\.\w+$/, "") === n);
const PROVA_AUDIO = b.provas.find((p) => p.origem === "pdf" && p.tipo === "audio" && temArq(p.conteudo.audio))?.id;
const CARTA = b.tempo_jogo.cartas.find((c) => !c[4]); const SLOT = (() => { const [h, m] = CARTA[2].split(":").map(Number); return Math.floor((h * 60 + m) / 5) * 5; })();

// 0) segurança: nada de PDF solto; arquivos de mídia são ilegíveis sem o código
const soltos = execFileSync("find", [SITE, "-name", "*.pdf"]).toString().trim();
if (soltos) falha(`PDF solto no site: ${soltos}`); else passo("nenhum PDF solto no site");
const bins = fs.readdirSync(path.join(SITE, "data", slug));
const expostos = bins.filter((f) => { const h = fs.readFileSync(path.join(SITE, "data", slug, f)).subarray(0, 16).toString("latin1"); return /%PDF|RIFF|WEBP|ID3|\xFF\xFB/.test(h); });
if (expostos.length) falha(`mídia sem criptografia: ${expostos}`); else passo(`${bins.length} arquivos de mídia/PDF criptografados (nenhum abre sem o código)`);

async function novoCel() {
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, acceptDownloads: true });
  const pg = await ctx.newPage(); const erros = [];
  pg.on("pageerror", (e) => erros.push(e.message)); pg.on("console", (m) => m.type() === "error" && erros.push(m.text()));
  pg.on("response", (r) => r.status() >= 400 && erros.push(`${r.status()} ${r.url()}`));
  return { ctx, pg, erros };
}
const pdfPaginas = (f) => Number(execFileSync("pdfinfo", [f]).toString().match(/Pages:\s+(\d+)/)[1]);
async function baixa(pg, sel, nome) {
  const [dl] = await Promise.all([pg.waitForEvent("download", { timeout: 20000 }), pg.click(sel)]);
  const f = path.join(PR || "/tmp", nome); await dl.saveAs(f);
  const cab = fs.readFileSync(f).subarray(0, 4).toString();
  if (cab !== "%PDF") falha(`${nome} não é PDF`); else passo(`download ${nome}: PDF de ${pdfPaginas(f)} páginas`);
}
async function semRolagemLateral(pg, onde) { const l = await pg.evaluate(() => document.documentElement.scrollWidth); if (l > 390) falha(`${onde}: rolagem lateral (${l}px)`); }
async function fonteMinima(pg, onde) {
  const peq = await pg.evaluate(() => [...document.querySelectorAll("main button, main a.btn, main label, main p, main legend, main input, .abas-baixo a")].filter((e) => e.offsetParent && e.textContent.trim() && !["radio", "checkbox"].includes(e.type) && parseFloat(getComputedStyle(e).fontSize) < 15.5).map((e) => e.textContent.trim().slice(0, 30)).slice(0, 5));
  if (peq.length) falha(`${onde}: texto menor que 16px: ${peq.join(" | ")}`);
  const baixos = await pg.evaluate(() => [...document.querySelectorAll("main button:not(.tira), main .btn, .abas-baixo a")].filter((e) => e.offsetParent && e.getBoundingClientRect().height < 44).map((e) => e.textContent.trim().slice(0, 30)).slice(0, 5));
  if (baixos.length) falha(`${onde}: botão menor que 44px: ${baixos.join(" | ")}`);
}

// ── MODO TELA ──
async function modoTela() {
  const { ctx, pg, erros } = await novoCel();
  await pg.goto(`${URL0}?c=VALENTE-7Q4K`); await pg.waitForSelector("#err");
  if (!/Kiwify/.test(await pg.textContent("#err"))) falha("mensagem de código errado não ensina o que fazer"); else passo("código antigo recusado com mensagem que ensina (Kiwify)");
  await shot(pg, "tela-00-codigo-errado");
  await pg.goto(LINK_KIWIFY); await pg.waitForSelector("[data-modo]", { timeout: 20000 }); passo("link da Kiwify abre o caso sem digitar nada");
  await shot(pg, "tela-01-escolha-do-modo"); await fonteMinima(pg, "escolha do modo");
  await pg.click('[data-modo="tela"]'); await pg.waitForSelector("#entendi"); await shot(pg, "tela-02-como-jogar"); await fonteMinima(pg, "como jogar");
  await pg.click("#entendi"); await pg.waitForSelector("#comecar");
  await pg.waitForFunction(() => document.querySelector(".brief-fotos img")?.naturalWidth > 0, null, { timeout: 15000 });
  await shot(pg, "tela-03-recado-da-delegada");
  await pg.click("#comecar"); await pg.waitForSelector("#f-obj");
  if (!(await pg.textContent(".situ")).includes("Objetivo 1 de 3")) falha("sem 'Objetivo 1 de 3'"); else passo("'Objetivo 1 de 3' visível");
  await shot(pg, "tela-04-objetivo"); await fonteMinima(pg, "objetivo"); await semRolagemLateral(pg, "objetivo");
  // ajuda
  await pg.click("#ajuda"); await pg.waitForSelector(".ajuda"); await pg.waitForTimeout(400); await shot(pg, "tela-05-precisa-de-ajuda"); await pg.goBack(); await pg.waitForTimeout(300);
  if (await pg.$(".modal")) falha("voltar do celular não fechou a ajuda"); else passo("voltar do celular fecha a janela de ajuda");
  // documentos e voltar
  await pg.click('.abas-baixo a[href$="/docs"]'); await pg.waitForSelector("#lista-docs .doc-card");
  await shot(pg, "tela-06-documentos");
  if (PROVA_AUDIO) {
    await pg.click(`[data-doc="${PROVA_AUDIO}"]`); await pg.waitForSelector(".modal .audio-play"); await pg.click(".modal .audio-play");
    await pg.waitForFunction(() => /\d:\d\d \/ \d:\d\d/.test(document.querySelector(".modal .audio-tempo").textContent), null, { timeout: 15000 });
    await pg.click(".modal .transcricao summary"); await shot(pg, "tela-07-audio-com-transcricao"); passo("áudio toca dentro do documento, com transcrição");
  } else { await pg.click('[data-doc="E-05"]'); await pg.waitForSelector(".modal .doc"); await shot(pg, "tela-07-documento"); passo("documento abre (caso ainda sem áudios gravados)"); }
  await pg.goBack(); await pg.waitForTimeout(300); await pg.goBack(); await pg.waitForSelector("#f-obj"); passo("voltar do celular: documento → lista → objetivo");
  // objetivos
  for (const n of [1, 2, 3]) {
    const [campos, provas] = RESP[n];
    for (const [k, v] of Object.entries(campos)) await pg.check(`#f-obj input[name="${k}"][value="${v}"]`);
    if (n === 1) { await pg.click("#enviar"); await pg.waitForSelector(".resposta.quase"); if (!/Marque 3 provas\. Você marcou 0/.test(await pg.textContent("#resp"))) falha("erro de provas não ensina"); else passo("erro ensina: “Marque 3 provas. Você marcou 0.”"); }
    if (n === 2) {
      // prova fraca (nenhum registro que desminta o álibi) não pode passar: tem de dar "quase"
      for (const [k, v] of Object.entries(RESP.fraca[0])) await pg.check(`#f-obj input[name="${k}"][value="${v}"]`);
      for (const id of RESP.fraca[1]) { await pg.fill("#busca", id); await pg.check(`#lista-provas input[value="${id}"]`); }
      await pg.click("#enviar"); await pg.waitForSelector(".resposta.quase", { timeout: 20000 });
      if (!/falta um registro/.test(await pg.textContent("#resp"))) falha(`${RESP.fraca[1].join("+")} não deu o 'quase' certo`); else passo(`${RESP.fraca[1].join("+")} dá 'quase' (falta um registro), não acerto`);
      await pg.click("#limpar-sel"); if (!/0 de 3 marcadas/.test(await pg.textContent("#marcadas"))) falha("Limpar seleção não zerou"); else passo("botão Limpar seleção zera as provas marcadas");
    }
    for (const id of provas) { await pg.fill("#busca", id); await pg.check(`#lista-provas input[value="${id}"]`); }
    if (n === 1) { await pg.fill("#busca", ""); await pg.click('[data-ver="E-05"]'); await pg.waitForSelector(".modal .doc"); await shot(pg, "tela-08-ver-prova-sem-sair"); await pg.goBack(); await pg.waitForTimeout(300); passo("prova aberta e fechada sem sair do objetivo"); }
    await pg.click("#enviar");
    if (n < 3) {
      await pg.waitForSelector("#ver-novas", { timeout: 20000 }); passo(`objetivo ${n} confirmado (${provas.join("+")})`);
      if (n === 1) { await pg.waitForTimeout(2400); await shot(pg, "tela-09-acerto"); }
      await pg.waitForTimeout(2400);
      await pg.click("#ver-novas"); await pg.waitForSelector(".doc-card.realce"); if (n === 1) await shot(pg, "tela-10-provas-novas"); passo(`“Ver as provas novas” leva direto a elas (objetivo ${n})`);
      await pg.click('.abas-baixo a[href$="/objetivo"]'); await pg.waitForSelector("#f-obj");
    } else { await pg.waitForSelector("#compart", { timeout: 20000 }); passo(`objetivo 3 confirmado (${provas.join("+")})`); }
  }
  await pg.waitForTimeout(2400);
  await pg.waitForFunction(() => document.querySelector(".final-doc .dep-foto img")?.naturalWidth > 0, null, { timeout: 15000 });
  await shot(pg, "tela-11-final"); await pg.click("#compart"); await pg.waitForSelector(".share-fig img"); await pg.waitForTimeout(500); await shot(pg, "tela-12-imagem-para-compartilhar");
  if (PR) { const src = await pg.$eval(".share-fig img", (i) => i.src); fs.writeFileSync(path.join(PR, "tela-13-imagem-1080x1920.png"), Buffer.from(src.split(",")[1], "base64")); }
  // anotações + linha do tempo (aba ainda existe após o fim? acessar direto)
  await pg.goto(`${URL0}#/caso/${slug}/notas`); await pg.waitForSelector("#notas");
  await pg.fill("#notas", "teste de anotação"); await pg.click(`.tl-carta[data-c="${CARTA[0]}"]`); await pg.click(`.slot[data-m="${SLOT}"]`); await pg.click("#conf");
  if (!/1 de 1 fatos no horário certo/.test(await pg.textContent("#res"))) falha("linha do tempo: carta no horário certo não foi aceita");
  await shot(pg, "tela-14-anotacoes"); passo("anotações e linha do tempo");
  await pg.reload(); await pg.waitForSelector("#notas"); if ((await pg.inputValue("#notas")) !== "teste de anotação") falha("notas não salvaram"); else passo("progresso e notas salvos após recarregar");
  if (erros.length) falha(`modo tela, erros: ${erros.join(" | ")}`);
  await ctx.close();
}

// ── MODO PAPEL ──
async function modoPapel() {
  const { ctx, pg, erros } = await novoCel();
  await pg.goto(LINK_KIWIFY); await pg.waitForSelector("[data-modo]", { timeout: 20000 });
  await pg.click('[data-modo="papel"]'); await pg.waitForSelector("#entendi"); await shot(pg, "papel-01-como-jogar");
  await pg.check("#nao-mostrar"); await pg.click("#entendi"); await pg.click("#comecar");
  await pg.waitForSelector("#baixar"); await shot(pg, "papel-02-baixar"); await fonteMinima(pg, "papel baixar");
  if (!/\(\d+ páginas\)/.test(await pg.textContent("#baixar"))) falha("botão de baixar sem nº de páginas");
  await baixa(pg, "#baixar", "papel-impresso-documentos.pdf");
  await pg.waitForSelector(".campo-prova input"); await shot(pg, "papel-03-responder"); await fonteMinima(pg, "papel responder"); await semRolagemLateral(pg, "papel responder");
  for (const n of [1, 2, 3]) {
    const [campos, provas] = RESP[n];
    for (const [k, v] of Object.entries(campos)) await pg.click(`.opc-grande:has(input[name="${k}"][value="${v}"]) span`);
    const campos2 = await pg.$$(".campo-prova");
    for (let i = 0; i < provas.length; i++) {
      const [L, num] = provas[i].split("-"); const box = campos2[i];
      if (await box.$("[data-l]")) await (await box.$(`[data-l="${L}"]`)).click();
      await (await box.$("input")).fill(n === 1 && i === 0 ? "e5" : n === 1 && i === 1 ? provas[i] : String(+num));
    }
    const nomes = await pg.$$eval(".nome-prova", (els) => els.map((e) => e.textContent));
    if (nomes.some((t) => !/·/.test(t))) falha(`papel obj ${n}: nome da prova não apareceu (${nomes})`);
    if (n === 1) { passo(`papel aceita “e5”, “E-07” e “26” e mostra o nome: ${nomes[0]}`); await shot(pg, "papel-04-numeros-digitados"); }
    if (n === 2 && PROVA_AUDIO) { await pg.click("#audios"); await pg.waitForSelector(".modal .doc-card"); await shot(pg, "papel-05-audios-do-caso"); await pg.goBack(); await pg.waitForTimeout(300); passo("papel: botão Áudios do caso"); }
    await pg.click("#enviar");
    if (n < 3) {
      await pg.waitForSelector("#imp-novas", { timeout: 20000 }); passo(`papel: objetivo ${n} confirmado`);
      await pg.waitForTimeout(2400);
      if (n === 1) await shot(pg, "papel-06-acerto-imprimir-provas-novas");
      await baixa(pg, "#imp-novas", `papel-impresso-provas-novas-${n}.pdf`);
      await pg.click("#ver-novas"); await pg.waitForSelector(".modal .doc-card"); if (n === 1) await shot(pg, "papel-07-provas-novas-na-tela"); await pg.goBack(); await pg.waitForTimeout(300);
      if (await pg.$(".campo-prova")) falha("próximo objetivo apareceu antes de “Já imprimi”");
      await pg.click("#continuar"); await pg.waitForSelector(".campo-prova input");
      if (n === 1) { const t = await pg.textContent(".situ"); if (!t.includes("Objetivo 2 de 3")) falha("papel: sem Objetivo 2 de 3"); }
    } else { await pg.waitForSelector("#compart", { timeout: 20000 }); passo("papel: objetivo 3 confirmado"); }
  }
  await pg.waitForTimeout(2400); await shot(pg, "papel-08-final");
  await baixa(pg, "#imp-sol", "papel-impresso-solucao.pdf");
  if (erros.length) falha(`modo papel, erros: ${erros.join(" | ")}`);
  await ctx.close();
}

// ── imagens do "Precisa de ajuda?" (sem spoiler: telas do objetivo 1, sem marcar a resposta certa) ──
async function imagensAjuda() {
  const D = path.join(RAIZ, "site", "ajuda", slug); fs.mkdirSync(D, { recursive: true });
  const salva = async (loc, nome) => { const f = path.join(D, nome + ".png"); await loc.screenshot({ path: f }); execFileSync("python3", ["-c", "import sys;from PIL import Image;im=Image.open(sys.argv[1]).convert('RGB');im.thumbnail((1400,1400));im.save(sys.argv[2],'WEBP',quality=90,method=6)", f, f.replace(".png", ".webp")]); fs.rmSync(f); };
  const { ctx, pg } = await novoCel();
  await pg.goto(LINK_KIWIFY); await pg.click('[data-modo="tela"]'); await pg.click("#entendi"); await pg.click("#comecar"); await pg.waitForSelector("#f-obj");
  await salva(pg.locator(".obj-tela fieldset").first(), "tela-1");
  await pg.fill("#busca", "E-01"); await pg.check('#lista-provas input[value="E-01"]'); await salva(pg.locator("#lista-provas"), "tela-2");
  await pg.click('.abas-baixo a[href$="/docs"]'); await pg.waitForSelector(".doc-card"); await salva(pg, "tela-3");
  await pg.click('.abas-baixo a[href$="/objetivo"]'); await pg.waitForSelector("#enviar"); await pg.locator("#enviar").scrollIntoViewIfNeeded(); await salva(pg, "tela-4");
  await ctx.close();
  const c2 = await novoCel(); const p2 = c2.pg;
  await p2.goto(LINK_KIWIFY); await p2.click('[data-modo="papel"]'); await p2.click("#entendi"); await p2.click("#comecar"); await p2.waitForSelector("#baixar");
  await salva(p2.locator(".cartao"), "papel-1"); await p2.click("#ja-tenho"); await p2.waitForSelector(".campo-prova input");
  await salva(p2.locator(".obj-tela fieldset").first(), "papel-2");
  await (await p2.$(".campo-prova input")).fill("1"); await salva(p2.locator(".obj-tela fieldset").nth(1), "papel-3");
  await c2.ctx.close();
  // papel-4: tela de provas novas (só os botões, sem a mensagem de acerto)
  const c3 = await novoCel(); const p3 = c3.pg;
  await p3.goto(LINK_KIWIFY); await p3.click('[data-modo="papel"]'); await p3.click("#entendi"); await p3.click("#comecar"); await p3.click("#ja-tenho");
  for (const [k, v] of Object.entries(RESP[1][0])) await p3.click(`.opc-grande:has(input[name="${k}"][value="${v}"]) span`);
  const cs = await p3.$$(".campo-prova input"); for (let i = 0; i < 3; i++) await cs[i].fill(String(+RESP[1][1][i].split("-")[1]));
  await p3.click("#enviar"); await p3.waitForSelector("#imp-novas"); await p3.waitForTimeout(2500);
  await p3.evaluate(() => { document.querySelector(".acerto p").remove(); }); await salva(p3.locator(".acerto"), "papel-4");
  await c3.ctx.close();
  passo("imagens da ajuda geradas em site/ajuda/");
}

try {
  if (AJUDA) await imagensAjuda();
  await modoTela();
  await modoPapel();
} catch (e) { falha(e.message.split("\n")[0]); }
await nav.close(); srv.kill();
console.log(ok ? "TUDO OK" : "FALHOU"); process.exit(ok ? 0 : 1);
