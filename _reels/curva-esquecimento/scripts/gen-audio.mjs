// Trilha original (110 BPM) + efeitos, travados na mesma linha do tempo do vídeo.
// A música já vem "abaixada" (ducking) nos trechos em que a narração vai entrar.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const TL = JSON.parse(readFileSync("src/timeline.json", "utf8"));
const SR = 44100, FPS = TL.fps, DUR = TL.total / FPS, N = Math.ceil(DUR * SR);
const M = [new Float32Array(N), new Float32Array(N)];   // música
const X = [new Float32Array(N), new Float32Array(N)];   // efeitos
const q2s = (q) => Math.round((q / FPS) * SR), s2s = (s) => Math.round(s * SR);
let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
const add = (bus, at, b, g = 1, pan = 0) => { const gl = g * Math.cos(((pan + 1) * Math.PI) / 4), gr = g * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < b.length; i++) { const j = at + i; if (j >= 0 && j < N) { bus[0][j] += b[i] * gl; bus[1][j] += b[i] * gr; } } };
const make = (s, fn) => { const n = Math.round(s * SR), b = new Float32Array(n); fn(b, n); return b; };

// ── instrumentos ──
const kick = make(0.4, (b, n) => { let ph = 0; for (let i = 0; i < n; i++) { const t = i / SR; ph += (2 * Math.PI * (48 + 90 * Math.exp(-t * 26))) / SR; b[i] = Math.tanh(1.5 * Math.sin(ph)) * Math.exp(-t * 8); } });
const snap = make(0.18, (b, n) => { let lp = 0; for (let i = 0; i < n; i++) { const x = rnd(); lp += 0.4 * (x - lp); b[i] = (x - lp) * Math.exp(-(i / SR) * 26) * 0.8; } });
const hat = make(0.05, (b, n) => { let lp = 0; for (let i = 0; i < n; i++) { const x = rnd(); lp += 0.6 * (x - lp); b[i] = (x - lp) * Math.exp(-(i / SR) * 80); } });
const pluck = (hz, s = 0.5) => make(s, (b, n) => { let ph = 0; for (let i = 0; i < n; i++) { const t = i / SR; ph += (2 * Math.PI * hz) / SR;
  b[i] = (Math.sin(ph) + 0.3 * Math.sin(2 * ph) + 0.12 * Math.sin(3 * ph)) * Math.exp(-t * 5) * Math.min(1, t / 0.004); } });
const bass = (hz) => make(0.42, (b, n) => { let ph = 0; for (let i = 0; i < n; i++) { const t = i / SR; ph += (2 * Math.PI * hz) / SR;
  b[i] = (Math.sin(ph) + 0.25 * Math.sin(2 * ph)) * Math.exp(-t * 4) * Math.min(1, t / 0.006); } });
// ── efeitos ──
const whoosh = (s = 0.4) => make(s, (b, n) => { let lp = 0; for (let i = 0; i < n; i++) { const t = i / n; lp += (0.02 + 0.3 * t ** 1.5) * (rnd() - lp); b[i] = lp * Math.sin(Math.PI * t ** 1.3) ** 2 * 2; } });
const impacto = make(1.2, (b, n) => { let ph = 0, lp = 0; for (let i = 0; i < n; i++) { const t = i / SR; ph += (2 * Math.PI * (42 + 40 * Math.exp(-t * 10))) / SR; lp += 0.2 * (rnd() - lp);
  b[i] = Math.tanh(2.2 * Math.sin(ph)) * Math.exp(-t * 3) + lp * Math.exp(-t * 7) * 0.6; } });
const tique = (hz) => make(0.04, (b, n) => { let ph = 0; for (let i = 0; i < n; i++) { ph += (2 * Math.PI * hz) / SR; b[i] = Math.sin(ph) * Math.exp(-(i / n) * 7); } });
const pop = (hi = 900) => make(0.14, (b, n) => { let ph = 0; for (let i = 0; i < n; i++) { const t = i / n; ph += (2 * Math.PI * (hi - hi * 0.5 * t)) / SR; b[i] = Math.sin(ph) * Math.exp(-t * 9); } });
const ding = make(1.0, (b, n) => { for (const [hz, a] of [[1318.5, 1], [2637, 0.35], [3955, 0.12]]) { let ph = 0; for (let i = 0; i < n; i++) { const t = i / SR; ph += (2 * Math.PI * hz) / SR; b[i] += Math.sin(ph) * a * Math.exp(-t * 4.5) * 0.5; } } });
const notif = make(0.5, (b, n) => { for (const [d, hz] of [[0, 880], [0.11, 1318.5]]) { let ph = 0; for (let i = Math.round(d * SR); i < n; i++) { const t = i / SR - d; ph += (2 * Math.PI * hz) / SR; b[i] += Math.sin(ph) * Math.exp(-t * 9) * 0.6; } } });
const carimbo = make(0.3, (b, n) => { let lp = 0; for (let i = 0; i < n; i++) { const t = i / SR; lp += 0.15 * (rnd() - lp); b[i] = (lp * 2 + Math.sin(t * 2 * Math.PI * 90) * 0.7) * Math.exp(-t * 18); } });

// ── música: progressão Am7 – Fmaj7 – C – G (2 compassos cada), groove leve ──
const BEAT = TL.beat, fimMusica = TL.total;
const PROG = [[220, 261.6, 329.6, 392], [174.6, 220, 261.6, 329.6], [261.6, 329.6, 392, 493.9], [196, 246.9, 293.7, 392]];
const BASS = [110, 87.3, 130.8, 98];
for (let k = 0, q = 0; q < fimMusica - BEAT; k++, q = k * BEAT) {
  const bar = Math.floor(k / 4), beat = k % 4, ch = PROG[Math.floor(bar / 2) % 4];
  const fim = q > TL.encerramento + 30;
  add(M, q2s(q), kick, fim ? 0.5 : 0.85);
  if (beat % 2 === 1) add(M, q2s(q), snap, 0.4, 0.1);
  add(M, q2s(q + BEAT / 2), hat, 0.16, 0.4);
  add(M, q2s(q + BEAT / 2), bass(BASS[Math.floor(bar / 2) % 4]), 0.32);
  add(M, q2s(q), pluck(ch[(k * 3) % 4] * 2, 0.45), 0.13, beat % 2 ? 0.4 : -0.4);
  if (beat === 0) for (const hz of ch) add(M, q2s(q), pluck(hz, 1.6), 0.06, (hz % 3) / 3 - 0.3);
}

// ── ducking: a música abaixa ~8 dB onde haverá voz (ataque 80 ms, soltura 300 ms) ──
const voz = new Float32Array(N);
for (const f of TL.frases) for (let i = s2s(f.inicio - 0.08); i < s2s(f.fim + 0.3) && i < N; i++) if (i >= 0) voz[i] = 1;
let env = 0; const att = 1 / (0.08 * SR), rel = 1 / (0.3 * SR);
for (let i = 0; i < N; i++) { env += voz[i] > env ? Math.min(att, voz[i] - env) : -Math.min(rel, env - voz[i]);
  const g = 1 - 0.6 * env; M[0][i] *= g; M[1][i] *= g; }
// fade de entrada/saída da música
for (let i = 0; i < N; i++) { const t = i / SR, g = Math.min(1, t / 0.15) * Math.min(1, (DUR - t) / 0.8); M[0][i] *= g; M[1][i] *= g; }

// ── efeitos (2–3 quadros antes do visual) ──
const C = TL.cortes, W = (frase, palavra) => TL.palavras.find((p) => p.frase === frase && p.mostra.replace(/[.,:]/g, "").startsWith(palavra)).q;
for (let i = 1; i < 8; i++) add(X, q2s(C[i] - 3) - s2s(0.25), whoosh(0.4), 0.45, i % 2 ? -0.3 : 0.3);   // troca de cena
add(X, q2s(TL.encerramento - 3) - s2s(0.25), whoosh(0.45), 0.5);
add(X, q2s(W(1, "METADE") + 6 - 3), impacto, 0.9);                                                     // o medidor despenca
for (let q = C[3] + 6; q < C[3] + 6 + 70; q += 3) add(X, q2s(q), tique(q % 6 ? 2200 : 1700), 0.13, 0.2); // curva desenhando
for (const [fr, pal] of [[1, "METADE"], [2, "ESQUECIMENTO"], [3, "1885"], [4, "DESPENCA"], [5, "REVISÃO"], [6, "AULA"], [7, "PROF+"], [8, "WHATSAPP"]])
  add(X, q2s(W(fr, pal) - 3), pop(fr % 2 ? 950 : 1150), 0.32);                                         // palavra-chave
const REV = [0.22, 0.5, 0.78].map((p) => Math.round(C[4] + 8 + p * (C[5] - C[4] - 14)));
REV.forEach((q) => add(X, q2s(q - 3), ding, 0.38));                                                    // checks de revisão
add(X, q2s(W(6, "AULA") + 6 - 3), ding, 0.3);                                                          // check aula seguinte
add(X, q2s(W(6, "PROVA") - 3), carimbo, 0.45);                                                         // véspera riscada
add(X, q2s(W(7, "PLANEJADAS") - 3), carimbo, 0.55);                                                    // selo
add(X, q2s(C[7] + 10 - 3), notif, 0.5);                                                                // notificação
add(X, q2s(TL.encerramento + 12 - 3), ding, 0.35);                                                     // "+" do logo

// ── mix: música a −20 dB "sob a voz" (referência −6 dBFS para a voz), efeitos por cima; pico ≤ −1 dBFS ──
const MUS = Math.pow(10, -14 / 20);   // nível de pico da música antes do ducking
let pm = 0; for (let c = 0; c < 2; c++) for (let i = 0; i < N; i++) pm = Math.max(pm, Math.abs(M[c][i]));
const out = [new Float32Array(N), new Float32Array(N)];
let pk = 0;
for (let c = 0; c < 2; c++) for (let i = 0; i < N; i++) { out[c][i] = (M[c][i] / pm) * MUS + X[c][i] * 0.55; pk = Math.max(pk, Math.abs(out[c][i])); }
const lim = Math.pow(10, -1.5 / 20) / Math.max(pk, Math.pow(10, -1.5 / 20));
const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) for (let c = 0; c < 2; c++) buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, out[c][i] * lim)) * 32767), 44 + i * 4 + c * 2);
mkdirSync("public/audio", { recursive: true });
writeFileSync("public/audio/trilha.wav", buf);
console.log("trilha.wav", DUR.toFixed(2), "s · checks em", REV.join(","));
