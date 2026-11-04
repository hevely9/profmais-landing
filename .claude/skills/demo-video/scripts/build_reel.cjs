#!/usr/bin/env node
/*
 * build_reel.cjs: transforma cenas HTML em um Reel MP4 vertical (1080x1920).
 *
 * Uso:
 *   node .claude/skills/demo-video/scripts/build_reel.cjs _reels/<nome>            # gera o vídeo
 *   node .claude/skills/demo-video/scripts/build_reel.cjs _reels/<nome> --previa   # só 1 imagem por cena
 *
 * Lê _reels/<nome>/reel.json e grava em _reels/<nome>/saida/:
 *   reel.mp4   vídeo final (H.264 + AAC, 30 fps, 9:16, faststart), pronto para o Instagram
 *   capa.jpg   capa do Reel (1080x1920)
 *   previa-NN.png  (só com --previa) um quadro do meio de cada cena
 *
 * Requisitos: Node + Playwright (Chromium) e ffmpeg/ffprobe no PATH.
 * Narração (padrão da Prof+): "motor_voz": "elevenlabs" (voz mais humana, precisa de chave) ou
 * "edge" (edge-tts, grátis: pip install edge-tts). A voz entra direto no MP4.
 * Sem edge-tts, ou se a rede bloquear, o MP4 sai sem voz e saida/narracao.txt traz a fala
 * de cada cena com o tempo, para usar no 'Texto para fala' do Instagram ou do CapCut.
 *
 * As cenas são animadas SÓ com CSS (@keyframes / animation-delay). O script
 * pausa todas as animações e avança o relógio quadro a quadro, então o
 * resultado é idêntico em qualquer máquina e não depende da velocidade do PC.
 * Para animação via JS, a cena pode definir window.reelSeek = (ms) => {...}.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');
const { pathToFileURL } = require('url');

let chromium;
try { ({ chromium } = require('playwright')); }
catch { console.error('Playwright não encontrado. Instale com: npm i -D playwright && npx playwright install chromium'); process.exit(1); }

const W = 1080, H = 1920;
const args = process.argv.slice(2);
const dir = args.find(a => !a.startsWith('--'));
const PREVIA = args.includes('--previa');
if (!dir) { console.error('Uso: node build_reel.cjs <pasta-do-reel> [--previa]'); process.exit(1); }

const raiz = path.resolve(dir);
const cfg = JSON.parse(fs.readFileSync(path.join(raiz, 'reel.json'), 'utf8'));
const FPS = cfg.fps || 30;
const saida = path.join(raiz, 'saida');
const tmp = path.join(saida, '.tmp');
fs.mkdirSync(tmp, { recursive: true });

const temCmd = c => spawnSync(c, ['-version'], { stdio: 'ignore' }).status === 0
  || spawnSync(c, ['--version'], { stdio: 'ignore' }).status === 0;
if (!temCmd('ffmpeg')) { console.error('ffmpeg não encontrado no PATH.'); process.exit(1); }

function run(cmd, a, opts = {}) {
  const r = spawnSync(cmd, a, { encoding: 'utf8', ...opts });
  if (r.status !== 0) throw new Error(`${cmd} falhou:\n${(r.stderr || '').slice(-1500)}`);
  return r.stdout;
}
const duracaoAudio = f => parseFloat(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]));

// ── 1. Narração ───────────────────────────────────────────────────────────
// motor_voz: "elevenlabs" (voz mais humana; precisa de chave) ou "edge" (grátis, Microsoft)
const MOTOR = cfg.motor_voz || 'edge';
const voz = MOTOR === 'elevenlabs' ? (cfg.voz_elevenlabs || null) : (cfg.voz || null);
const temFala = cfg.cenas.some(c => c.narracao);
let ttsOk = !PREVIA && !!voz && temFala;
if (ttsOk && MOTOR === 'edge' && spawnSync('edge-tts', ['--help'], { stdio: 'ignore' }).status !== 0) {
  console.warn('⚠ edge-tts não instalado (pip install edge-tts): o vídeo sai sem narração.'); ttsOk = false;
}
if (!PREVIA && temFala && !voz) console.warn(`⚠ nenhuma voz definida para o motor "${MOTOR}": o vídeo sai sem narração.`);

function falaEdge(c, mp3) {
  const a = ['--voice', voz, '--text', c.narracao, '--write-media', mp3];
  if (cfg.velocidade_voz) a.push(`--rate=${cfg.velocidade_voz}`);
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  if (proxy) a.push('--proxy', proxy);
  const r = spawnSync('edge-tts', a, { encoding: 'utf8' });
  return r.status === 0 ? null : (r.stderr || '').trim().split('\n').pop();
}

function falaElevenLabs(c, mp3, i) {
  // Chave: variável ELEVENLABS_API_KEY ou segredo de rede injetado pelo proxy para api.elevenlabs.io
  const ajustes = cfg.ajustes_elevenlabs || {};
  const corpo = {
    text: c.narracao,
    model_id: cfg.modelo_elevenlabs || 'eleven_multilingual_v2',
    language_code: 'pt',
    // contexto das cenas vizinhas: a entonação fica contínua, como uma fala só
    previous_text: cfg.cenas.slice(0, i).map(x => x.narracao || '').join(' ').slice(-500) || undefined,
    next_text: cfg.cenas.slice(i + 1).map(x => x.narracao || '').join(' ').slice(0, 500) || undefined,
    voice_settings: {
      stability: ajustes.estabilidade ?? 0.4,          // menor = mais emoção e variação
      similarity_boost: ajustes.similaridade ?? 0.8,
      style: ajustes.estilo ?? 0.35,                   // maior = mais teatral
      use_speaker_boost: true,
      speed: ajustes.velocidade ?? 1.05,               // 0.7 a 1.2
    },
  };
  const json = path.join(tmp, `voz-${i}.json`);
  fs.writeFileSync(json, JSON.stringify(corpo));
  const a = ['-sS', '-X', 'POST', `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voz)}?output_format=mp3_44100_128`,
    '-H', 'Content-Type: application/json', '--data-binary', `@${json}`, '-o', mp3, '-w', '%{http_code}'];
  if (process.env.ELEVENLABS_API_KEY) a.push('-H', `xi-api-key: ${process.env.ELEVENLABS_API_KEY}`);
  const r = spawnSync('curl', a, { encoding: 'utf8' });
  const code = (r.stdout || '').trim();
  if (code === '200') return null;
  let msg = '';
  try { msg = fs.readFileSync(mp3, 'utf8').slice(0, 300); } catch {}
  fs.rmSync(mp3, { force: true });
  return `HTTP ${code || '?'} ${msg || (r.stderr || '').trim()}`;
}

cfg.cenas.forEach((c, i) => {
  c._dur = c.duracao || 3;
  if (!ttsOk || !c.narracao) return;
  const mp3 = path.join(tmp, `voz-${i}.mp3`);
  const erro = MOTOR === 'elevenlabs' ? falaElevenLabs(c, mp3, i) : falaEdge(c, mp3);
  if (erro || !fs.existsSync(mp3) || fs.statSync(mp3).size === 0) {
    console.warn(`⚠ narração (${MOTOR}) falhou: ${erro || 'áudio vazio'}. Seguindo sem narração.`);
    ttsOk = false; return;
  }
  c._audio = mp3;
  c._dur = Math.max(c._dur, duracaoAudio(mp3) + (cfg.pausa_entre_falas ?? 0.3));
});
if (!ttsOk) cfg.cenas.forEach(c => delete c._audio);

// roteiro de narração com tempos (para colar no 'Texto para fala' do Instagram/CapCut)
function escreverNarracao() {
  let t0 = 0;
  const fmtT = s => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;
  const roteiro = cfg.cenas.map((c, i) => { const l = `[${fmtT(t0)}] Cena ${i + 1}: ${c.narracao || '(sem fala)'}`; t0 += c._dur; return l; });
  fs.writeFileSync(path.join(saida, 'narracao.txt'),
    `Narração: ${cfg.titulo || path.basename(raiz)}\nVoz sugerida: ${voz || '-'}${ttsOk ? ' (já está no MP4)' : ' (NÃO está no MP4: use o Texto para fala do Instagram ou do CapCut)'}\n\n${roteiro.join('\n')}\n`);

}

// ── 2. Render das cenas quadro a quadro ──────────────────────────────────
const SEEK = `(ms) => {
  for (const a of document.getAnimations()) { a.pause(); a.currentTime = ms; }
  if (typeof window.reelSeek === 'function') window.reelSeek(ms);
}`;

async function abrir(page, arquivo) {
  const f = path.join(raiz, arquivo);
  if (!fs.existsSync(f)) throw new Error(`Cena não encontrada: ${f}`);
  await page.goto(pathToFileURL(f).href, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(img => img.complete ? 0 : new Promise(r => { img.onload = img.onerror = r; })));
  });
  const quebradas = await page.evaluate(() => [...document.images].filter(i => !i.naturalWidth).map(i => i.getAttribute('src')));
  if (quebradas.length) console.warn(`⚠ ${arquivo}: imagem não carregou → ${quebradas.join(', ')}`);
}

function encoderDeCena(out, dur) {
  // recebe JPEGs pelo stdin e grava um MP4 silencioso da cena
  const p = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-t', dur.toFixed(3), '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), out],
    { stdio: ['pipe', 'ignore', 'inherit'] });
  const fim = new Promise((ok, erro) => p.on('close', code => code === 0 ? ok() : erro(new Error('ffmpeg (cena) falhou'))));
  return { stdin: p.stdin, fim };
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

  if (PREVIA) {
    for (const [i, c] of cfg.cenas.entries()) {
      await abrir(page, c.arquivo);
      await page.evaluate(`(${SEEK})(${Math.round(c._dur * 1000 * 0.75)})`);
      const f = path.join(saida, `previa-${String(i + 1).padStart(2, '0')}.png`);
      await page.screenshot({ path: f });
      console.log('✓', path.relative(process.cwd(), f));
    }
    escreverNarracao();
    console.log('✓', path.relative(process.cwd(), path.join(saida, 'narracao.txt')));
    await browser.close(); fs.rmSync(tmp, { recursive: true, force: true }); return;
  }

  const segmentos = [];
  for (const [i, c] of cfg.cenas.entries()) {
    await abrir(page, c.arquivo);
    const total = Math.round(c._dur * FPS);
    const video = path.join(tmp, `cena-${i}.mp4`);
    const enc = encoderDeCena(video, c._dur);
    for (let q = 0; q < total; q++) {
      await page.evaluate(`(${SEEK})(${(q * 1000) / FPS})`);
      const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
      if (!enc.stdin.write(buf)) await new Promise(r => enc.stdin.once('drain', r));
    }
    enc.stdin.end(); await enc.fim;

    // junta o áudio da cena (narração ou silêncio) com a duração exata
    const seg = path.join(tmp, `seg-${i}.mp4`);
    const audioIn = c._audio ? ['-i', c._audio] : ['-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo'];
    run('ffmpeg', ['-y', '-loglevel', 'error', '-i', video, ...audioIn, '-map', '0:v', '-map', '1:a',
      '-af', `apad,atrim=0:${c._dur.toFixed(3)}`, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-ar', '44100', '-ac', '2',
      '-t', c._dur.toFixed(3), seg]);
    segmentos.push(seg);
    console.log(`✓ cena ${i + 1}/${cfg.cenas.length}  ${c.arquivo}  ${c._dur.toFixed(1)}s`);
  }

  // capa
  const capaCfg = cfg.capa || { cena: 0, tempo: 1.5 };
  await abrir(page, cfg.cenas[capaCfg.cena].arquivo);
  await page.evaluate(`(${SEEK})(${Math.round((capaCfg.tempo ?? 1.5) * 1000)})`);
  await page.screenshot({ path: path.join(saida, 'capa.jpg'), type: 'jpeg', quality: 92 });
  await browser.close();

  // ── 3. Concatena e (opcional) mistura música de fundo ───────────────────
  const lista = path.join(tmp, 'lista.txt');
  fs.writeFileSync(lista, segmentos.map(s => `file '${s.replace(/'/g, "'\\''")}'`).join('\n'));
  const juntado = path.join(tmp, 'juntado.mp4');
  run('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy', juntado]);

  escreverNarracao();

  const final = path.join(saida, 'reel.mp4');
  const musica = cfg.musica ? path.resolve(raiz, cfg.musica) : null;
  if (musica && fs.existsSync(musica)) {
    const vol = cfg.volume_musica ?? 0.15;
    run('ffmpeg', ['-y', '-loglevel', 'error', '-i', juntado, '-stream_loop', '-1', '-i', musica,
      '-filter_complex', `[1:a]volume=${vol}[m];[0:a][m]amix=inputs=2:duration=first:normalize=0[a]`,
      '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', final + '.tmp.mp4']);
    fs.renameSync(final + '.tmp.mp4', juntado);
  } else {
    if (musica) console.warn(`⚠ música não encontrada: ${musica}`);
  }
  // volume no padrão dos Reels (~ -14 LUFS): vídeo baixo passa despercebido no feed
  run('ffmpeg', ['-y', '-loglevel', 'error', '-i', juntado, '-c:v', 'copy', '-af', `loudnorm=I=${cfg.loudness ?? -14}:TP=-1.5:LRA=11`,
    '-c:a', 'aac', '-b:a', '160k', '-ar', '44100', '-movflags', '+faststart', final]);
  fs.rmSync(tmp, { recursive: true, force: true });

  const dur = duracaoAudio(final);
  const mb = (fs.statSync(final).size / 1048576).toFixed(1);
  console.log(`\n✅ ${path.relative(process.cwd(), final)}  (${dur.toFixed(1)}s, ${mb} MB, ${W}x${H}, ${FPS}fps)`);
  console.log(`   capa: ${path.relative(process.cwd(), path.join(saida, 'capa.jpg'))}`);
  console.log(`   narração: ${path.relative(process.cwd(), path.join(saida, 'narracao.txt'))}${ttsOk ? '' : '  (voz não incluída no MP4)'}`);
  if (dur > 90) console.warn('⚠ Mais de 90s: o Instagram aceita, mas Reels curtos (15–45s) retêm muito melhor.');
})().catch(e => { console.error('✗', e.message); process.exit(1); });
