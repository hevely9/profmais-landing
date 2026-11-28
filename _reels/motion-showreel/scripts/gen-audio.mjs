// Synthesized, beat-locked score for the 15 s showreel (120 BPM, 30 fps → 15 frames per beat).
// Every sound event is placed on the same frame grid the animation uses.
import { writeFileSync, mkdirSync } from "node:fs";

const SR = 44100, DUR = 15, N = SR * DUR, FPS = 30;
const L = new Float32Array(N), R = new Float32Array(N);
const f2s = (f) => Math.round((f / FPS) * SR);
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

function add(start, buf, gain = 1, pan = 0) {
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4), gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < buf.length; i++) {
    const j = start + i;
    if (j >= 0 && j < N) { L[j] += buf[i] * gl; R[j] += buf[i] * gr; }
  }
}
const make = (secs, fn) => { const n = Math.round(secs * SR), b = new Float32Array(n); fn(b, n); return b; };

const kick = make(0.42, (b, n) => { let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / SR; ph += (2 * Math.PI * (45 + 95 * Math.exp(-t * 28))) / SR;
    b[i] = Math.tanh(1.6 * Math.sin(ph)) * Math.exp(-t * 7.5) + (i < 90 ? rnd() * 0.25 * (1 - i / 90) : 0); } });
const clap = make(0.22, (b, n) => { let lp = 0, hp = 0;
  for (let i = 0; i < n; i++) { const t = i / SR, x = rnd(); lp += 0.35 * (x - lp); hp = x - lp;
    const env = Math.exp(-t * 22) + 0.6 * Math.exp(-Math.max(0, t - 0.012) * 30) * (t > 0.012 ? 1 : 0);
    b[i] = hp * env * 0.8; } });
const hat = make(0.06, (b, n) => { let lp = 0;
  for (let i = 0; i < n; i++) { const x = rnd(); lp += 0.6 * (x - lp); b[i] = (x - lp) * Math.exp(-(i / SR) * 70); } });
const bassNote = (hz) => make(0.3, (b, n) => { let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / SR; ph += (2 * Math.PI * hz) / SR;
    b[i] = (Math.sin(ph) + 0.35 * Math.sin(2 * ph) + 0.15 * Math.sin(3 * ph)) * Math.min(1, t / 0.005) * Math.exp(-t * 7); } });
const pop = (hi = 900) => make(0.16, (b, n) => { let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / n; ph += (2 * Math.PI * (hi - hi * 0.55 * t)) / SR; b[i] = Math.sin(ph) * Math.exp(-t * 9); } });
const tick = (hz = 2200) => make(0.035, (b, n) => { let ph = 0;
  for (let i = 0; i < n; i++) { ph += (2 * Math.PI * hz) / SR; b[i] = Math.sin(ph) * Math.exp(-(i / n) * 6); } });
const whoosh = (secs = 0.45) => make(secs, (b, n) => { let lp = 0;
  for (let i = 0; i < n; i++) { const t = i / n, c = 0.02 + 0.3 * Math.pow(t, 1.6); lp += c * (rnd() - lp);
    b[i] = lp * Math.pow(Math.sin(Math.PI * Math.pow(t, 1.35)), 2) * 2.2; } });
const sub = (secs = 1.1, hz = 48) => make(secs, (b, n) => { let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / SR; ph += (2 * Math.PI * (hz + 30 * Math.exp(-t * 12))) / SR;
    b[i] = Math.tanh(2 * Math.sin(ph)) * Math.exp(-t * 3.2); } });
const crash = make(1.6, (b, n) => { let lp = 0;
  for (let i = 0; i < n; i++) { const t = i / SR; lp += 0.25 * (rnd() - lp); b[i] = (rnd() * 0.5 + lp) * Math.exp(-t * 2.6); } });
const riser = (secs) => make(secs, (b, n) => { let lp = 0, ph = 0;
  for (let i = 0; i < n; i++) { const t = i / n; lp += (0.01 + 0.5 * t * t) * (rnd() - lp);
    ph += (2 * Math.PI * (180 + 1400 * t * t)) / SR;
    b[i] = (lp * 1.4 + 0.25 * Math.sin(ph)) * Math.pow(t, 1.8); } });
const sparkle = make(0.9, (b, n) => {
  const notes = [[0, 1760], [0.05, 2217], [0.1, 2637], [0.16, 3520]];
  for (const [d, hz] of notes) { let ph = 0;
    for (let i = Math.round(d * SR); i < n; i++) { const t = i / SR - d; ph += (2 * Math.PI * hz) / SR;
      b[i] += Math.sin(ph) * Math.exp(-t * 6) * 0.35; } } });

// Pad: A add9 with slow filter breathing, fades in and out.
{ const fr = [110, 164.81, 220, 246.94, 277.18];
  for (const f of fr) for (const d of [f / 1.003, f * 1.003]) { let ph = rnd() * 6.28;
    for (let i = 0; i < N; i++) { ph += (2 * Math.PI * d) / SR; const t = i / SR;
      const v = Math.sin(ph) * (0.045 / fr.length) * Math.min(1, t / 1.2) * Math.min(1, (DUR - t) / 1.5) * (0.8 + 0.2 * Math.sin(t * 0.9));
      L[i] += v * (d > f ? 1.15 : 0.85); R[i] += v * (d > f ? 0.85 : 1.15); } } }

// ── Groove: frames 15 → 330, then double-time build in the tunnel, silence before the impact ──
const BASS = [110, 110, 92.5, 82.41]; // A2 A2 F#2 E2
for (let f = 15, beat = 0; f < 330; f += 15, beat++) {
  add(f2s(f), kick, 0.95);
  if (beat % 2 === 1) add(f2s(f), clap, 0.5, 0.05);
  add(f2s(f + 7.5), hat, 0.22, 0.35);
  add(f2s(f + 7.5), bassNote(BASS[beat % 4]), 0.32);
}
for (let f = 330; f < 383; f += 7.5) { add(f2s(f), kick, 0.85); add(f2s(f + 3.75), hat, 0.2, -0.3); }
for (let f = 366; f < 383; f += 3.75) add(f2s(f), clap, 0.22, 0.1);

// ── Scene SFX (sounds start 2–3 frames before the visual lands) ──
add(f2s(13), sub(0.9, 52), 0.85);                       // dot lands
add(f2s(25), whoosh(0.5), 0.45, -0.2);                  // dot → line → split
for (let i = 0; i < 4; i++) add(f2s(47 + i * 3), pop(700 + i * 90), 0.4, -0.3 + i * 0.2); // C A D A
for (let i = 0; i < 16; i++) add(f2s(78 + i * 1.5), tick(1800 + (i % 3) * 300), 0.18, (i % 2) * 0.6 - 0.3); // slot roll
for (let i = 0; i < 6; i++) add(f2s(86 + i * 3), tick(1200), 0.28, -0.3 + i * 0.12); // slot locks
add(f2s(98), whoosh(0.35), 0.35, 0.3);                  // IMPORTA wipe
add(f2s(113), pop(1100), 0.55);                         // hero period
add(f2s(121), whoosh(0.55), 0.5);                       // iris through the dot
for (let i = 0; i < 14; i++) add(f2s(132 + i), tick(2600 - i * 60), 0.12, rnd() * 0.6); // tiles pop
add(f2s(160), whoosh(0.3), 0.35, -0.4); add(f2s(190), whoosh(0.3), 0.35, 0.4); // tile waves
add(f2s(200), whoosh(0.45), 0.42);                      // tiles flip
add(f2s(244), riser(0.4), 0.3);                         // blobs collapse
add(f2s(254), sub(0.8, 60), 0.75); add(f2s(255), pop(500), 0.5); // goo pop
for (let i = 0; i < 18; i++) add(f2s(272 + i * 1.5), tick(1500 + i * 70), 0.12); // counter
for (let i = 0; i < 7; i++) add(f2s(283 + i * 4), pop(600 + i * 70), 0.22, -0.5 + i * 0.16); // bars
add(f2s(318), whoosh(0.4), 0.55, -0.6);                 // whip pan
add(f2s(330), riser(1.9), 0.55);                        // tunnel build
add(f2s(388), sub(1.6, 44), 1.0); add(f2s(388), crash, 0.35); add(f2s(388), kick, 1.0); // IMPACT
add(f2s(402), pop(1300), 0.5); add(f2s(403), sparkle, 0.6); // the "+"
for (let i = 0; i < 3; i++) add(f2s(418 + i * 3), tick(1600), 0.15); // tagline

// Glue: gentle saturation, then normalize to -1 dBFS peak.
let peak = 0;
for (let i = 0; i < N; i++) { L[i] = Math.tanh(L[i] * 1.1); R[i] = Math.tanh(R[i] * 1.1); peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); }
const g = 0.89 / peak;
const out = Buffer.alloc(44 + N * 4);
out.write("RIFF", 0); out.writeUInt32LE(36 + N * 4, 4); out.write("WAVE", 8); out.write("fmt ", 12);
out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(2, 22); out.writeUInt32LE(SR, 24);
out.writeUInt32LE(SR * 4, 28); out.writeUInt16LE(4, 32); out.writeUInt16LE(16, 34); out.write("data", 36); out.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g)) * 32767), 44 + i * 4);
  out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g)) * 32767), 46 + i * 4);
}
mkdirSync("public/audio", { recursive: true });
writeFileSync("public/audio/score.wav", out);
console.log("score.wav written:", DUR, "s");
