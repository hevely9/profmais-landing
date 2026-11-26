// ARQUIVO ÁLIBI — criptografia (igual no build em Node e no navegador, via WebCrypto).
// Respostas: conferidas por hash SHA-256 com salt do caso. Provas bônus e solução: AES-GCM com chave derivada (PBKDF2)
// da resposta correta + código do caso. Sem a resposta certa, o conteúdo não pode ser aberto.
const sub = globalThis.crypto.subtle;
const te = new TextEncoder(), td = new TextDecoder();
export const ITER = 120000;

export const b64 = (buf) => { const b = new Uint8Array(buf); let s = ""; for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]); return btoa(s); };
export const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
export const normCodigo = (c) => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

export async function sha(texto) { return b64(await sub.digest("SHA-256", te.encode(texto))); }

export async function derivar(segredo, salt) {
  const base = await sub.importKey("raw", te.encode(segredo), "PBKDF2", false, ["deriveKey"]);
  return sub.deriveKey({ name: "PBKDF2", salt: te.encode(salt), iterations: ITER, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
}
export async function chaveBruta(raw) { return sub.importKey("raw", raw, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]); }

export async function cifrar(chave, dados) {
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const bruto = dados instanceof Uint8Array ? dados : te.encode(JSON.stringify(dados));
  const ct = await sub.encrypt({ name: "AES-GCM", iv }, chave, bruto);
  return { iv: b64(iv), ct: b64(ct) };
}
export async function decifrarBytes(chave, pacote) {
  return new Uint8Array(await sub.decrypt({ name: "AES-GCM", iv: unb64(pacote.iv) }, chave, unb64(pacote.ct)));
}
export async function decifrar(chave, pacote) { return JSON.parse(td.decode(await decifrarBytes(chave, pacote))); }

// resposta canônica: campos na ordem do objetivo + provas em ordem alfabética
export const canonCampos = (campos, valores) => campos.map((c) => `${c}=${valores[c] ?? ""}`).join("&");
export const canonResposta = (campos, valores, provas) => `${canonCampos(campos, valores)}|${[...provas].map((p) => p.toUpperCase()).sort().join(",")}`;
