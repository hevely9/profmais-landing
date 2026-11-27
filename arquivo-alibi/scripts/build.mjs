// ARQUIVO ÁLIBI — build do site: lê casos/*/biblia.json e gera dist/site com o conteúdo protegido.
// A Bíblia NUNCA vai para o site publicado: só saem blocos criptografados.
// - Dados do caso (provas do dossiê, fotos, áudios): AES-GCM com chave derivada (PBKDF2) do código do caso.
// - Provas bônus, solução e a mídia delas: AES-GCM com uma chave aleatória por objetivo, embrulhada uma vez
//   para cada resposta aceita (resposta canônica + código). Sem acertar, não dá para abrir.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { derivar, chaveBruta, cifrar, normCodigo, canonCampos, canonResposta, sha } from "../site/cripto.js";

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(RAIZ, "dist", "site");
const cfg = JSON.parse(fs.readFileSync(path.join(RAIZ, "config.json"), "utf8"));
const sub = globalThis.crypto.subtle;
const TIPOS_MIDIA = { webp: "image/webp", mp3: "audio/mpeg", jpg: "image/jpeg", png: "image/png", pdf: "application/pdf" };

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "data"), { recursive: true });
for (const f of fs.readdirSync(path.join(RAIZ, "site"))) {
  const src = path.join(RAIZ, "site", f);
  if (fs.statSync(src).isDirectory()) fs.cpSync(src, path.join(OUT, f), { recursive: true });
  else fs.copyFileSync(src, path.join(OUT, f));
}

// todas as combinações de provas aceitas de uma resposta
function combinacoes(a) {
  const sets = [...(a.provas || []), ...(a.combinacoes || [])];
  if (a.papeis) {
    const escolhe = (arr, k) => k === 0 ? [[]] : arr.flatMap((x, i) => escolhe(arr.slice(i + 1), k - 1).map((r) => [x, ...r]));
    let parc = [[]];
    for (const p of a.papeis) parc = parc.flatMap((base) => escolhe(p.de, p.n || 1).map((r) => [...base, ...r]));
    sets.push(...parc);
  }
  const vistos = new Set();
  return sets.filter((s) => new Set(s).size === s.length).filter((s) => { const k = [...s].sort().join(","); if (vistos.has(k)) return false; vistos.add(k); return true; });
}

// nomes de mídia citados num objeto qualquer (campos img, audio, foto, rosto, ficha, dia)
function midiasEm(obj, acc = new Set()) {
  if (Array.isArray(obj)) obj.forEach((x) => midiasEm(x, acc));
  else if (obj && typeof obj === "object") for (const [k, v] of Object.entries(obj)) {
    if (["img", "audio", "foto", "rosto", "ficha", "dia", "pdf"].includes(k) && typeof v === "string") acc.add(v);
    else midiasEm(v, acc);
  }
  return acc;
}

async function cifrarArquivo(chave, nome, dirs, destino) {
  let arq, dir;
  for (const d of dirs) { arq = fs.readdirSync(d).find((f) => f.replace(/\.\w+$/, "") === nome); if (arq) { dir = d; break; } }
  if (!arq) throw new Error(`mídia não encontrada: ${nome}`);
  const bytes = fs.readFileSync(path.join(dir, arq));
  const iv = crypto.randomBytes(12);
  const ct = new Uint8Array(await sub.encrypt({ name: "AES-GCM", iv }, chave, bytes));
  const f = crypto.randomBytes(9).toString("hex") + ".bin";
  fs.writeFileSync(path.join(destino, f), Buffer.concat([iv, Buffer.from(ct)]));
  return { f, t: TIPOS_MIDIA[arq.split(".").pop()] || "application/octet-stream", kb: Math.round(bytes.length / 1024) };
}

const vitrine = [];
const proibidos = new Set(["Caio Moura", "frasco reserva", "Ostra Azul", "B-06", "digital de Caio", "VALENTE-7Q4K", "VALENTE7Q4K"]);
for (const slug of fs.readdirSync(path.join(RAIZ, "casos")).sort()) {
  const arq = path.join(RAIZ, "casos", slug, "biblia.json");
  if (!fs.existsSync(arq)) continue;
  const b = JSON.parse(fs.readFileSync(arq, "utf8"));
  const codigo = normCodigo(b.codigo);
  proibidos.add(b.codigo); proibidos.add(codigo);
  // folhas de imprimir (modo papel): geradas antes e criptografadas como o resto
  execFileSync("node", [path.join(RAIZ, "scripts", "impressos.mjs"), slug], { stdio: "inherit", env: { ...process.env, NODE_PATH: process.env.NODE_PATH || execFileSync("npm", ["root", "-g"]).toString().trim() } });
  const dirImp = path.join(RAIZ, "dist", "impressos", slug);
  const pags = JSON.parse(fs.readFileSync(path.join(dirImp, "paginas.json"), "utf8"));
  const imp = (nome) => pags[nome] ? { pdf: nome, paginas: pags[nome] } : null;
  const dirMidia = [path.join(RAIZ, "casos", slug, "midia"), dirImp];
  const dirOut = path.join(OUT, "data", slug); fs.mkdirSync(dirOut, { recursive: true });
  const chaveCaso = await derivar(codigo, `${slug}|caso`);
  const provasPdf = b.provas.filter((p) => p.origem === "pdf");
  const cartasBase = b.tempo_jogo.cartas.filter((c) => !c[4]);

  const objetivos = [];
  const blocos = {}, kRaws = {}, conteudos = {};
  for (const o of b.objetivos) {
    const campos = o.campos.map((c) => c.id);
    const salt = `${slug}|obj${o.n}`;
    const kRaw = globalThis.crypto.getRandomValues(new Uint8Array(32));
    kRaws[o.n] = kRaw;
    const verificacao = [], embrulhos = [];
    let total = 0;
    for (const a of o.aceitas) for (const conj of combinacoes(a)) {
      if (conj.length !== o.n_provas) throw new Error(`obj ${o.n}: combinação com ${conj.length} provas`);
      const canon = canonResposta(campos, a, conj);
      verificacao.push(await sha(`${salt}|v|${canon}`));
      embrulhos.push(await cifrar(await derivar(`${canon}|${codigo}`, salt), kRaw));
      total++;
    }
    const quase = [];
    for (const q of o.quase) {
      const chaves = Object.keys(q.campos).sort();
      quase.push({ chaves, h: await sha(`${salt}|q|${canonCampos(chaves, q.campos)}`), msg: q.msg });
    }
    const conteudo = { bonus: o.bonus.map((id) => b.provas.find((p) => p.id === id)), msg: o.msg_acerto, cartas: b.tempo_jogo.cartas.filter((c) => c[4] === o.n), impresso: imp(`impresso-obj${o.n}`) };
    if (o.n === b.objetivos.length) conteudo.impressoSolucao = imp("impresso-solucao");
    if (o.n === b.objetivos.length) conteudo.solucao = { ...b.solucao, verdade: b.verdade, suspeitos: b.suspeitos.map(({ id, nome, segredo, inocenta }) => ({ id, nome, segredo, inocenta })) };
    conteudos[o.n] = conteudo;
    objetivos.push({ n: o.n, titulo: o.titulo, pergunta: o.pergunta, campos: o.campos, n_provas: o.n_provas, dicas: o.dicas, verificacao, embrulhos, quase, bonusIds: o.bonus });
    console.log(`  objetivo ${o.n}: ${total} combinações de provas aceitas`);
  }

  const publico = {
    slug, numero: b.numero, titulo: b.titulo, local: b.local, data_crime: b.data_crime, briefing: b.briefing, vitima: b.vitima,
    suspeitos: b.suspeitos.map(({ id, nome, idade, relacao, foto }) => ({ id, nome, idade, relacao, foto })),
    provas: provasPdf, objetivos, impresso: imp("impresso-dossie"), impressoOpcional: imp("impresso-opcional"), tempo: { de: b.tempo_jogo.de, ate: b.tempo_jogo.ate, cartas: cartasBase },
  };

  // mídia: o que aparece no caso abre com o código; o resto só com o objetivo que libera
  const nomesCaso = midiasEm(publico);
  publico.midia = {};
  for (const n of nomesCaso) publico.midia[n] = await cifrarArquivo(chaveCaso, n, dirMidia, dirOut);
  const blocosOut = {};
  const jaCifradas = new Set(nomesCaso);
  for (const o of b.objetivos) {
    const c = conteudos[o.n];
    const k = await chaveBruta(kRaws[o.n]);
    c.midia = {};
    for (const n of midiasEm({ bonus: c.bonus, solucao: c.solucao, impresso: c.impresso, impressoSolucao: c.impressoSolucao })) {
      if (jaCifradas.has(n)) continue;
      c.midia[n] = await cifrarArquivo(k, n, dirMidia, dirOut); jaCifradas.add(n);
    }
    blocosOut[o.n] = await cifrar(k, c);
  }
  const pacote = { slug, versao: 2, iter: 120000, caso: await cifrar(chaveCaso, publico), blocos: blocosOut };
  fs.writeFileSync(path.join(OUT, "data", `${slug}.json`), JSON.stringify(pacote));
  // capa pública da vitrine (imagem sem spoiler escolhida na Bíblia), reduzida
  const vt = b.vitrine || {};
  let capa = null;
  if (vt.capa) {
    fs.mkdirSync(path.join(OUT, "capas"), { recursive: true });
    const orig = fs.readdirSync(dirMidia[0]).find((f) => f.replace(/\.\w+$/, "") === vt.capa);
    execFileSync("python3", ["-c", "import sys;from PIL import Image;im=Image.open(sys.argv[1]).convert('RGB');im.thumbnail((760,760));im.save(sys.argv[2],'WEBP',quality=72)", path.join(dirMidia[0], orig), path.join(OUT, "capas", `${slug}.webp`)]);
    capa = `capas/${slug}.webp`;
  }
  vitrine.push({ slug, numero: b.numero, titulo: b.titulo, sinopse: b.sinopse, chamada: b.subtitulo, acento: b.acento, dificuldade: b.dificuldade, duracao: b.duracao, jogadores: b.jogadores, classificacao: b.classificacao,
    provas: b.provas.length, suspeitos: b.suspeitos.length, tipo: vt.tipo, ano: vt.ano, cidade: vt.cidade, novo: !!vt.novo, capa,
    compra: cfg.links[slug] || `LINK_KIWIFY_${slug}`, prefixo: b.codigo.split("-")[0], disponivel: true });
  const kb = fs.readdirSync(dirOut).reduce((s, f) => s + fs.statSync(path.join(dirOut, f)).size, 0) / 1024;
  console.log(`✓ ${slug}: ${b.provas.length} provas, ${objetivos.length} objetivos, ${jaCifradas.size} arquivos de mídia (${Math.round(kb)} KB, criptografados)`);
}
for (const e of cfg.emBreve || []) vitrine.push({ ...e, disponivel: false });
vitrine.sort((a, b) => a.numero.localeCompare(b.numero));
fs.writeFileSync(path.join(OUT, "casos.json"), JSON.stringify({ url: cfg.urlFinal, perfil: cfg.perfil, combo: cfg.links.combo || "LINK_KIWIFY_combo", casos: vitrine }, null, 1));

// checagem: nenhuma resposta, prova bônus, solução ou código em texto puro no que vai ser publicado
const textos = [];
const varre = (d) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) varre(p); else if (!/\.(woff2|bin|webp)$/.test(f)) textos.push(fs.readFileSync(p, "utf8")); } };
varre(OUT);
const publicado = textos.join("\n");
for (const proibido of proibidos) {
  if (publicado.includes(proibido)) { console.error(`✗ VAZAMENTO: "${proibido}" aparece em texto puro no site.`); process.exit(1); }
}
console.log("✓ nenhum conteúdo sensível em texto puro em dist/site");
