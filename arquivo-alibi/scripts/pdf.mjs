// ARQUIVO ÁLIBI — dossiê em PDF. Não tem layout próprio: chama o gerador único das folhas (scripts/impressos.mjs),
// para o PDF de entrega e o PDF do modo papel serem SEMPRE o mesmo arquivo (nada fica desatualizado).
// Uso: NODE_PATH=$(npm root -g) node scripts/pdf.mjs <slug>  →  dist/pdf/<slug>-dossie.pdf
import { execFileSync } from "node:child_process";
import path from "node:path";
const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
execFileSync("node", [path.join(RAIZ, "scripts", "impressos.mjs"), process.argv[2] || "mansao-valente"], { stdio: "inherit" });
