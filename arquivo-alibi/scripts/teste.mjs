// Teste ponta a ponta da Central (Playwright). Uso: NODE_PATH=$(npm root -g) node scripts/teste.mjs <slug>
// Sobe um servidor em dist/site, entra com o código, resolve os 3 objetivos com a 1ª resposta aceita da Bíblia.
import fs from "node:fs"; import path from "node:path"; import { spawn } from "node:child_process"; import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const slug = process.argv[2] || "mansao-valente";
const b = JSON.parse(fs.readFileSync(path.join(RAIZ, "casos", slug, "biblia.json"), "utf8"));
const srv = spawn("python3", ["-m", "http.server", "8799"], { cwd: path.join(RAIZ, "dist", "site"), stdio: "ignore" });
await new Promise((r) => setTimeout(r, 800));
const nav = await chromium.launch(); const pg = await nav.newPage({ viewport: { width: 375, height: 800 } });
const erros = []; pg.on("pageerror", (e) => erros.push(e.message)); pg.on("console", (m) => m.type() === "error" && erros.push(m.text()));
let ok = true; const falha = (m) => { ok = false; console.log("✗", m); };
try {
  await pg.goto(`http://localhost:8799/#/caso/${slug}`);
  await pg.fill("#cod", "ERRADO-0000"); await pg.click("#f-cod button"); await pg.waitForTimeout(1500);
  if (!(await pg.textContent("#err"))) falha("código errado não foi recusado");
  await pg.fill("#cod", b.codigo); await pg.click("#f-cod button"); await pg.waitForSelector("#f-obj", { timeout: 20000 });
  for (const o of b.objetivos) {
    const a = o.aceitas[0];
    for (const c of o.campos) await pg.check(`#f-obj input[name="${c.id}"][value="${a[c.id]}"]`);
    for (const id of a.provas[0]) await pg.check(`#f-obj input[name="prova"][value="${id}"]`);
    await pg.click("#enviar"); await pg.waitForSelector(".msg-ok", { timeout: 20000 });
    console.log(`✓ objetivo ${o.n} confirmado`);
    if (o.n < b.objetivos.length) { await pg.waitForTimeout(2500); await pg.waitForSelector("#f-obj"); }
  }
  await pg.waitForSelector("#compart", { timeout: 20000 }); console.log("✓ tela final");
  await pg.click("#compart"); await pg.waitForSelector("#img-share[src^='data:image/png']"); console.log("✓ imagem de compartilhar");
  await pg.reload(); await pg.waitForTimeout(2500);
  if (!(await pg.$("#compart"))) falha("progresso não persistiu após recarregar"); else console.log("✓ progresso salvo");
  const larg = await pg.evaluate(() => document.documentElement.scrollWidth); if (larg > 375) falha(`rolagem horizontal (${larg}px)`);
} catch (e) { falha(e.message); }
if (erros.length) falha("erros no console: " + erros.join(" | "));
await nav.close(); srv.kill();
console.log(ok ? "TUDO OK" : "FALHOU"); process.exit(ok ? 0 : 1);
