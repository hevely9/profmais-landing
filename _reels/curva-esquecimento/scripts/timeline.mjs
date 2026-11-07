// Linha do tempo do Reel (fonte única): tempo de cada palavra num ritmo natural de narração,
// páginas da legenda karaokê, cortes na batida (110 BPM), .srt e roteiro de narração com tempos.
// Uso: node scripts/timeline.mjs
import { writeFileSync, mkdirSync } from "node:fs";

const FPS = 30, BPM = 110, BEAT = (FPS * 60) / BPM; // 16,36 quadros
const SPS = 5.6;            // sílabas por segundo (narração calma e clara)
const P = { ",": 0.22, ":": 0.3 };
const GAP = 0.5, START = 0.3, LEAD = 2; // pausa entre frases (s), início da 1ª fala (s), legenda adianta 2 quadros

// token: "MOSTRA|falado" (falado opcional). *palavra* = palavra-chave (laranja).
const FRASES = [
  "SEU ALUNO ESQUECE MAIS DA *METADE* DA AULA EM 24|vinte-e-quatro HORAS.",
  "ISSO TEM NOME: CURVA DO *ESQUECIMENTO*.",
  "FOI DESCOBERTA POR HERMANN EBBINGHAUS, EM *1885*|mil-oitocentos-e-oitenta-e-cinco.",
  "SEM REVISÃO, A MEMÓRIA *DESPENCA* NOS PRIMEIROS DIAS.",
  "MAS CADA *REVISÃO* NO TEMPO CERTO FAZ A CURVA CAIR MAIS DEVAGAR.",
  "POR ISSO REVISAR NA *AULA* *SEGUINTE* VALE MAIS QUE UMA REVISÃO GIGANTE ANTES DA PROVA.",
  "NO *PROF+*|prof-mais, A SUA SEQUÊNCIA DIDÁTICA JÁ VEM COM AS REVISÕES PLANEJADAS.",
  "CHAMA NO *WHATSAPP*|uótsápi PELO LINK DA BIO.",
];
const silabas = (w) => w.toLowerCase().split(/[-\s]/).reduce((s, x) =>
  s + Math.max(1, (x.match(/[aeiouáéíóúâêôãõày]+/g) || []).length), 0);

let t = START;
const frases = FRASES.map((txt, n) => {
  const toks = txt.split(" ").map((raw) => {
    const [mostraBruto, falado] = raw.split("|");
    const chave = mostraBruto.includes("*");
    const mostra = mostraBruto.replace(/\*/g, "");
    const pont = (falado || mostra).match(/[,.:]$/)?.[0] || "";
    const fala = (falado || mostra).replace(/[,.:]$/, "") + (falado ? pont || (mostra.match(/[,.:]$/)?.[0] ?? "") : "");
    const d = silabas(fala.replace(/[^\p{L}\s-]/gu, "")) / SPS;
    const tok = { mostra, falado: (falado || mostra).replace(/-/g, " ").toLowerCase().replace(/[.]$/, ""), chave, t0: +t.toFixed(3), t1: +(t + d).toFixed(3) };
    t += d;
    const fim = mostra.match(/[,:]$/)?.[0];
    if (fim) t += P[fim];
    return tok;
  });
  const fr = { n: n + 1, inicio: toks[0].t0, fim: +t.toFixed(3), toks, texto: toks.map((x) => x.mostra).join(" ") };
  t += GAP;
  return fr;
});

// cortes de cena: batida mais próxima do fim de cada frase
const snap = (s) => Math.round(Math.round((s * FPS) / BEAT) * BEAT);
const cortes = [0, ...frases.map((f) => snap(f.fim + 0.15))];
const fimVoz = Math.round(frases[7].fim * FPS);
const encerramento = Math.max(cortes[8], fimVoz + 4);
const total = encerramento + 2 * FPS;

// páginas da legenda: 2–5 palavras, quebra na pontuação, ~20 caracteres
const paginas = [];
for (const f of frases) {
  let pg = [];
  f.toks.forEach((tk, i) => {
    pg.push(tk);
    const txt = pg.map((x) => x.mostra).join(" ");
    const ultimo = i === f.toks.length - 1;
    const restam = f.toks.length - 1 - i;
    const ligacao = /^(A|O|AS|OS|DA|DO|DE|NA|NO|EM|POR|QUE|UMA|UM|COM|PELO|SUA|SEU|MAIS|SEM|JÁ|FAZ|CADA)$/.test(tk.mostra);
    if (ultimo || (pg.length >= 2 && !ligacao && (/[,:]$/.test(tk.mostra) || txt.length >= 14) && restam !== 1) || pg.length === 5) {
      paginas.push({ frase: f.n, toks: pg }); pg = [];
    }
  });
}
paginas.forEach((p, i) => {
  p.de = Math.max(0, Math.round(p.toks[0].t0 * FPS) - LEAD);
  const prox = paginas[i + 1];
  p.ate = prox && prox.frase === p.frase ? Math.round(prox.toks[0].t0 * FPS) - LEAD
    : Math.round(p.toks.at(-1).t1 * FPS) + 8;
  if (i === 0) p.de = 0;
});

const out = { fps: FPS, bpm: BPM, beat: BEAT, total, encerramento, cortes, frases, paginas,
  palavras: frases.flatMap((f) => f.toks.map((tk) => ({ ...tk, frase: f.n, q: Math.max(0, Math.round(tk.t0 * FPS) - LEAD) }))) };
mkdirSync("src", { recursive: true }); mkdirSync("out", { recursive: true });
writeFileSync("src/timeline.json", JSON.stringify(out, null, 1));

// .srt (páginas da legenda)
const ts = (q) => { const ms = Math.round((q / FPS) * 1000), h = Math.floor(ms / 3.6e6), m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1000) % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`; };
writeFileSync("out/legendas.srt", paginas.map((p, i) => `${i + 1}\n${ts(p.de)} --> ${ts(p.ate)}\n${p.toks.map((x) => x.mostra).join(" ")}\n`).join("\n"));

// roteiro para narrar em cima do vídeo
const mmss = (s) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, "0")}`;
writeFileSync("out/roteiro-narracao.txt", [
  "ROTEIRO DE NARRAÇÃO · Curva do esquecimento (Prof+)",
  `Vídeo: ${mmss(total / FPS)} · fala de ${mmss(frases[0].inicio)} a ${mmss(frases[7].fim)} · depois, 2 s de encerramento sem voz.`,
  "Narre acompanhando a legenda: cada palavra acende no momento de falar. Ritmo calmo e claro.", "",
  ...frases.map((f) => `FRASE ${f.n} · ${mmss(f.inicio)} → ${mmss(f.fim)} (${(f.fim - f.inicio).toFixed(1)}s)\n  ${f.toks.map((x) => x.falado).join(" ")}\n  ênfase: ${f.toks.filter((x) => x.chave).map((x) => x.mostra.replace(/[.,]/g, "")).join(" ")}`),
].join("\n") + "\n");

console.log(`total ${total}q (${(total / FPS).toFixed(1)}s) · encerramento q${encerramento} · cortes ${cortes.join(",")}`);
frases.forEach((f) => console.log(`F${f.n} ${f.inicio.toFixed(2)}–${f.fim.toFixed(2)}s  ${f.texto}`));
console.log(paginas.map((p) => `[${p.de}-${p.ate}] ${p.toks.map((x) => x.mostra).join(" ")}`).join("\n"));
