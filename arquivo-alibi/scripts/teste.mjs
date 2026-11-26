// Teste ponta a ponta da Central (Playwright). Uso: NODE_PATH=$(npm root -g) node scripts/teste.mjs <slug> [pasta-de-prints]
// Joga o caso inteiro no celular (390px) e confere no computador (1280px).
import fs from "node:fs"; import path from "node:path"; import { spawn } from "node:child_process"; import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const slug = process.argv[2] || "mansao-valente", PR = process.argv[3];
const b = JSON.parse(fs.readFileSync(path.join(RAIZ, "casos", slug, "biblia.json"), "utf8"));
const srv = spawn("python3", ["-m", "http.server", "8799"], { cwd: path.join(RAIZ, "dist", "site"), stdio: "ignore" });
await new Promise((r) => setTimeout(r, 800));
const nav = await chromium.launch();
let ok = true; const falha = (m) => { ok = false; console.log("✗", m); }; const passo = (m) => console.log("✓", m);
const shot = async (pg, n) => PR && pg.screenshot({ path: path.join(PR, `${n}.png`), fullPage: false });
const URL0 = "http://localhost:8799/";
// respostas: usa combinações ALTERNATIVAS (não as óbvias) para provar que todas valem
const RESP = { 1: [{ fato: "c" }, ["E-05", "E-07", "E-26"]], 2: [{ suspeito: "caio" }, ["E-02", "E-27", "B-04"]], 3: [{ suspeito: "caio", metodo: "m1", motivo: "mo2" }, ["B-07", "E-17", "E-16"]] };

async function jogo(largura, nome) {
  const ctx = await nav.newContext({ viewport: { width: largura, height: largura < 500 ? 844 : 900 } });
  const pg = await ctx.newPage(); const erros = [];
  pg.on("pageerror", (e) => erros.push(e.message)); pg.on("console", (m) => m.type() === "error" && erros.push(m.text()));
  pg.on("response", (r) => r.status() >= 400 && erros.push(`${r.status()} ${r.url()}`));
  await pg.goto(URL0); await pg.waitForSelector("#cod");
  if (await pg.$('a[href*="LINK_KIWIFY"], a[href*="kiwify"]')) falha(`${nome}: link de compra na home`);
  await shot(pg, `${nome}-01-home`);
  await pg.fill("#cod", "VALENTE-7Q4K"); await pg.click("#f-cod button"); await pg.waitForTimeout(1500);
  if (!/não/i.test(await pg.textContent("#err"))) falha(`${nome}: código antigo aceito`); else passo(`${nome}: código antigo recusado`);
  await pg.fill("#cod", b.codigo.replaceAll("-", "").toLowerCase()); await pg.click("#f-cod button");
  await pg.waitForSelector("#comecar", { timeout: 20000 }); passo(`${nome}: código novo aceito (digitado sem hífen, minúsculo)`);
  await pg.click(".briefing .audio-play"); await pg.waitForFunction(() => /\d:\d\d \/ \d:\d\d/.test(document.querySelector(".audio-tempo").textContent), null, { timeout: 15000 }); passo(`${nome}: áudio do briefing toca`);
  await pg.waitForFunction(() => [...document.querySelectorAll(".briefing img")].every((i) => i.naturalWidth > 0));
  await shot(pg, `${nome}-02-briefing`);
  await pg.click("#comecar"); await pg.waitForSelector("#f-obj");
  // abas não cortadas
  const cortada = await pg.evaluate(() => [...document.querySelectorAll(".abas button")].some((b) => b.scrollWidth > b.clientWidth + 1 || b.getBoundingClientRect().right > innerWidth));
  if (cortada) falha(`${nome}: aba cortada`); else passo(`${nome}: abas inteiras`);
  // dossiê: documento com foto e com áudio
  await pg.click('[data-aba="dossie"]'); await pg.click('[data-doc="E-04"]'); await pg.waitForFunction(() => document.querySelector(".modal img")?.naturalWidth > 0, null, { timeout: 15000 });
  await pg.click("[data-mais]"); await shot(pg, `${nome}-03-doc-zoom`); await pg.click("[data-fechar]"); passo(`${nome}: dossiê abre foto E-04 com zoom`);
  await pg.click('[data-doc="E-27"]'); await pg.click(".modal .audio-play"); await pg.waitForFunction(() => /\d:\d\d \/ \d:\d\d/.test(document.querySelector(".modal .audio-tempo").textContent), null, { timeout: 15000 });
  await pg.click("[data-fechar]"); passo(`${nome}: prova em áudio E-27 toca`);
  await pg.click('[data-doc="E-09"]'); await pg.waitForFunction(() => document.querySelector(".modal .dep-foto img")?.naturalWidth > 0, null, { timeout: 15000 }); await shot(pg, `${nome}-04-depoimento`); await pg.click("[data-fechar]");
  // suspeitos: todas as fotos carregam
  await pg.click('[data-aba="suspeitos"]'); await pg.waitForFunction(() => { const i = [...document.querySelectorAll("#conteudo img")]; return i.length >= 13 && i.every((x) => x.naturalWidth > 0); }, null, { timeout: 20000 });
  await shot(pg, `${nome}-05-suspeitos`); passo(`${nome}: fotos dos suspeitos carregam`);
  // notas
  await pg.click('[data-aba="notas"]'); await pg.fill("#notas", "Caio e Rafael de azul-marinho?"); await pg.waitForTimeout(600);
  // linha do tempo: tocar no fato e depois no horário
  await pg.click('[data-aba="tempo"]'); await pg.click('.tl-carta[data-c="t07"]'); await pg.click('.slot[data-m="1310"]');
  await pg.click('.tl-carta[data-c="t04"]'); await pg.click('.slot[data-m="1300"]');
  await pg.click("#conf"); const r = await pg.textContent("#res");
  if (!r.startsWith("1 de 2")) falha(`${nome}: conferência da linha do tempo (${r})`); else passo(`${nome}: linha do tempo confere (${r.trim()})`);
  await shot(pg, `${nome}-06-tempo`);
  // objetivos
  await pg.click('[data-aba="objetivos"]');
  for (const n of [1, 2, 3]) {
    const [campos, provas] = RESP[n];
    if (n === 2) { // resposta errada "quase"
      await pg.check('#f-obj input[name="suspeito"][value="rafael"]');
      for (const id of provas) { await pg.fill("#busca", id); await pg.check(`#lista-provas input[value="${id}"]`); }
      await pg.click("#enviar"); await pg.waitForSelector(".resposta.quase"); passo(`${nome}: mensagem de "quase" no objetivo 2`);
      await pg.fill("#busca", "");
    } else for (const id of provas) { await pg.fill("#busca", id); await pg.check(`#lista-provas input[value="${id}"]`); }
    for (const [k, v] of Object.entries(campos)) await pg.check(`#f-obj input[name="${k}"][value="${v}"]`);
    if (n === 1) await shot(pg, `${nome}-07-objetivo`);
    if (await pg.$('a[href*="LINK_KIWIFY"]')) falha(`${nome}: botão de compra antes do fim`);
    await pg.click("#enviar"); await pg.waitForSelector(n < 3 ? ".msg-ok" : "#compart", { timeout: 20000 });
    passo(`${nome}: objetivo ${n} confirmado com combinação alternativa ${provas.join("+")}`);
    await pg.waitForTimeout(2400);
  }
  await pg.waitForFunction(() => document.querySelector(".final-doc .dep-foto img")?.naturalWidth > 0, null, { timeout: 15000 });
  await pg.click(".final-doc .audio-play"); await pg.waitForFunction(() => /\d:\d\d \/ \d:\d\d/.test(document.querySelector(".final-doc .audio-tempo").textContent), null, { timeout: 15000 });
  passo(`${nome}: interrogatório final com foto e áudio`);
  await pg.click("#compart"); await pg.waitForSelector(".share-fig img");
  const dim = await pg.evaluate(() => new Promise((res) => { const i = new Image(); i.onload = () => res([i.width, i.height]); i.src = document.querySelector(".share-fig img").src; }));
  if (dim[0] !== 1080 || dim[1] !== 1920) falha(`${nome}: imagem ${dim}`); else passo(`${nome}: imagem 1080×1920`);
  if (PR) { const src = await pg.$eval(".share-fig img", (i) => i.src); fs.writeFileSync(path.join(PR, `${nome}-share.png`), Buffer.from(src.split(",")[1], "base64")); }
  const prox = await pg.$(".proximo"); if (!prox) falha(`${nome}: sem bloco Próximo arquivo`); else passo(`${nome}: bloco Próximo arquivo (${(await prox.textContent()).slice(0, 60).trim()}…)`);
  await pg.evaluate(() => document.querySelector(".proximo").scrollIntoView()); await shot(pg, `${nome}-08-final`);
  // persistência
  await pg.reload(); await pg.waitForSelector("#compart", { timeout: 20000 }); passo(`${nome}: progresso salvo após recarregar`);
  await pg.click('[data-aba="notas"]'); if ((await pg.inputValue("#notas")) !== "Caio e Rafael de azul-marinho?") falha(`${nome}: notas não salvaram`); else passo(`${nome}: notas salvas`);
  const larg = await pg.evaluate(() => document.documentElement.scrollWidth); if (larg > largura) falha(`${nome}: rolagem horizontal (${larg}px)`);
  if (erros.length) falha(`${nome}: erros: ${erros.join(" | ")}`);
  await ctx.close();
}
try {
  await jogo(390, "celular");
  await jogo(1280, "pc");
  // QR code: ?c=CODIGO abre direto (navegador novo)
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 } }); const pg = await ctx.newPage();
  await pg.goto(`${URL0}?c=${b.codigo}`); await pg.waitForSelector("#comecar", { timeout: 20000 }); passo("QR code (?c=) abre o caso direto");
  await pg.goto(`${URL0}?c=VALENTE-7Q4K`); await pg.waitForSelector("#err"); passo("QR com código antigo não abre");
  await ctx.close();
} catch (e) { falha(e.message.split("\n")[0]); }
await nav.close(); srv.kill();
console.log(ok ? "TUDO OK" : "FALHOU"); process.exit(ok ? 0 : 1);
