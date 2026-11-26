// ARQUIVO ÁLIBI — build do site: lê casos/*/biblia.json e gera dist/site com o conteúdo protegido.
// A Bíblia NUNCA vai para o site publicado: só saem blocos criptografados + hashes.
import fs from "node:fs";
import path from "node:path";
import { sha, derivar, chaveBruta, cifrar, normCodigo, canonCampos, canonResposta, b64 } from "../site/cripto.js";

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(RAIZ, "dist", "site");
const cfg = JSON.parse(fs.readFileSync(path.join(RAIZ, "config.json"), "utf8"));

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "data"), { recursive: true });
for (const f of fs.readdirSync(path.join(RAIZ, "site"))) {
  const src = path.join(RAIZ, "site", f);
  if (fs.statSync(src).isDirectory()) fs.cpSync(src, path.join(OUT, f), { recursive: true });
  else fs.copyFileSync(src, path.join(OUT, f));
}

const vitrine = [];
for (const slug of fs.readdirSync(path.join(RAIZ, "casos")).sort()) {
  const arq = path.join(RAIZ, "casos", slug, "biblia.json");
  if (!fs.existsSync(arq)) continue;
  const b = JSON.parse(fs.readFileSync(arq, "utf8"));
  const codigo = normCodigo(b.codigo);
  const chaveCaso = await derivar(codigo, `${slug}|caso`);
  const provasPdf = b.provas.filter((p) => p.origem === "pdf");
  const titulos = Object.fromEntries(provasPdf.map((p) => [p.id, p.titulo]));

  const objetivos = [];
  const blocos = {};
  for (const o of b.objetivos) {
    const campos = o.campos.map((c) => c.id);
    const salt = `${slug}|obj${o.n}`;
    const kRaw = globalThis.crypto.getRandomValues(new Uint8Array(32));
    const kConteudo = await chaveBruta(kRaw);
    const verificacao = [], embrulhos = [];
    for (const a of o.aceitas) for (const conj of a.provas) {
      const canon = canonResposta(campos, a, conj);
      verificacao.push(await sha(`${salt}|v|${canon}`));
      embrulhos.push(await cifrar(await derivar(`${canon}|${codigo}`, salt), kRaw));
    }
    const quase = [];
    for (const q of o.quase) {
      const chaves = Object.keys(q.campos).sort();
      quase.push({ chaves, h: await sha(`${salt}|q|${canonCampos(chaves, q.campos)}`), msg: q.msg });
    }
    const bonus = o.bonus.map((id) => b.provas.find((p) => p.id === id));
    const conteudo = { bonus, msg: o.msg_acerto };
    if (o.n === b.objetivos.length) conteudo.solucao = { ...b.solucao, verdade: b.verdade, suspeitos: b.suspeitos.map(({ id, nome, segredo, inocenta }) => ({ id, nome, segredo, inocenta })) };
    blocos[o.n] = await cifrar(kConteudo, conteudo);
    objetivos.push({ n: o.n, titulo: o.titulo, pergunta: o.pergunta, campos: o.campos, n_provas: o.n_provas, dicas: o.dicas, verificacao, embrulhos, quase, bonusIds: o.bonus });
  }

  const publico = {
    slug, numero: b.numero, titulo: b.titulo, local: b.local, data_crime: b.data_crime,
    suspeitos: b.suspeitos.map(({ id, nome, idade, relacao, retrato }) => ({ id, nome, idade, relacao, retrato })),
    provasPdf: provasPdf.map((p) => ({ id: p.id, titulo: p.titulo })), titulos, objetivos,
  };
  const pacote = { slug, versao: 1, iter: 120000, caso: await cifrar(chaveCaso, publico), blocos, codigoHash: await sha(`${slug}|codigo|${codigo}`) };
  fs.writeFileSync(path.join(OUT, "data", `${slug}.json`), JSON.stringify(pacote));
  vitrine.push({ slug, numero: b.numero, titulo: b.titulo, sinopse: b.sinopse, acento: b.acento, dificuldade: b.dificuldade, duracao: b.duracao, jogadores: b.jogadores, classificacao: b.classificacao, compra: cfg.links[slug] || `LINK_KIWIFY_${slug}`, prefixo: b.codigo.split("-")[0], disponivel: true });
  console.log(`✓ ${slug}: ${b.provas.length} provas, ${objetivos.length} objetivos`);
}
for (const e of cfg.emBreve || []) vitrine.push({ ...e, disponivel: false });
fs.writeFileSync(path.join(OUT, "casos.json"), JSON.stringify({ url: cfg.urlFinal, perfil: cfg.perfil, combo: cfg.links.combo || "LINK_KIWIFY_combo", casos: vitrine }, null, 1));

// checagem: nenhuma resposta, prova bônus ou solução em texto puro no que vai ser publicado
const publicado = fs.readdirSync(path.join(OUT, "data")).map((f) => fs.readFileSync(path.join(OUT, "data", f), "utf8")).join("") + fs.readFileSync(path.join(OUT, "casos.json"), "utf8");
for (const proibido of ["Caio Moura", "B-06", "frasco reserva", "Ostra Azul", "confissão", "VALENTE-7Q4K", "VALENTE7Q4K"]) {
  if (publicado.includes(proibido)) { console.error(`✗ VAZAMENTO: "${proibido}" aparece em texto puro no site.`); process.exit(1); }
}
console.log("✓ nenhum conteúdo sensível em texto puro em dist/site");
