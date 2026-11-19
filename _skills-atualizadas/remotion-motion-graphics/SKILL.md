---
name: "remotion-motion-graphics"
description: "Cria e edita vídeos de motion graphics com Remotion (vinhetas, Reels, intros, legendas animadas). Use sempre que pedirem para criar, animar ou melhorar um vídeo."
---

# Remotion Motion Graphics

Baseada na skill open-source (MIT) de haidrrrry/claude-remotion-skill, consolidada em um arquivo e adaptada.

Remotion renders React components frame-by-frame into video. Code quality is not the bottleneck — **motion design craft is**. Untrained generation produces linear easing, opacity-only fades, simultaneous entrances, flat colors, and no texture. That is the "generic AI video" look. This skill exists to prevent it.

## Marca padrão: Prof+
Se o usuário não indicar outra marca, o vídeo é do Prof+ (profmais.online, materiais pedagógicos personalizados). Não pergunte cores nem fontes:
- bg `#0A2A22`, bgDark `#08352A`, primary `#0E4B3C` (verde profundo), light `#2E7A63`, sand `#EFDCA9` (areia), text `#F6F1E3` (off-white)
- hero `#E36B1F` (laranja) — um único elemento por quadro (ex.: o "+" do logotipo)
- Gradiente: `linear-gradient(165deg, #08352A 0%, #0E4B3C 55%, #2E7A63 100%)`
- Títulos: Montserrat 700/800; corpo: Lato 400/700
- Motivo: faixa de módulos quadrados com quarto de círculo inscrito; curva de quarto de círculo entrando pelo canto inferior direito
- Textos em português, falando COM o professor (você), sem tom de vendedor de curso.

## Non-negotiable rules (apply to EVERY composition)
1. **NEVER use linear interpolation.** Every `interpolate()` gets an easing curve; every entrance prefers `spring()`. Always `extrapolateLeft/Right: "clamp"`.
2. **Entrances animate 2–3 properties together** (opacity + translateY + scale). A lone fade is forbidden.
3. **Stagger everything.** Lists, words, rays, cards: 3–6 frame offsets. Nothing enters simultaneously.
4. **Exits exist and are faster than entrances** (~10 frames vs ~20).
5. **Five-layer stack in every scene**, bottom to top: background mesh → assets → graphics/type → color grade → grain + vignette. Never a flat solid background.
6. **Every still image gets Ken Burns** (slow scale 1→1.08 + pan). Every video asset uses `<OffthreadVideo>`, never `<Video>`.
7. **Idle elements breathe**: anything on screen >2s gets sin-wave micro-motion.
8. **All timing derives from `fps`** via `useVideoConfig()`. No magic frame numbers.
9. **One theme object** at the top of the project (colors, easings, spring presets, fonts). Never inline a hex color or easing in a component.
10. **Render, extract frames, LOOK at them, fix, re-render.** Never deliver an unverified render.

## Workflow

### Step 1 — Scope
Determine: duration, fps (30 default; 60 only for heavy fast motion), dimensions (1080×1920 Reels/Shorts, 1920×1080 landscape), what assets exist (images, footage, audio, logos), and whether this is a new composition or an edit. If editing an existing project: read `src/` fully first, find the theme (or create one), and refactor violations of the rules above before adding features.

### Step 2 — Setup
Requires network access for package installs (Settings → Capabilities → Allow network egress; new chat picks it up). If installs are blocked, say so plainly instead of faking a render.
```bash
npm install remotion @remotion/cli react react-dom
# optional: @remotion/transitions @remotion/motion-blur
```
Structure: `src/index.ts` (registerRoot) → `src/Root.tsx` (Composition) → `src/scenes/*.tsx` → `src/components/*.tsx`. Assets in `public/`, loaded via `staticFile()`. Copy the theme template below into `src/theme.ts`.

**Fonts (reliable, offline):** don't depend on Google Fonts at render time. Install `@fontsource/<font>` packages, copy the needed `*-latin-<weight>-normal.woff2` files to `public/fonts/`, and load them in `src/index.ts`:
```ts
import { registerRoot, continueRender, delayRender, staticFile } from "remotion";
const fonts = [["Montserrat","fonts/montserrat-latin-800-normal.woff2","800"],["Lato","fonts/lato-latin-400-normal.woff2","400"]];
const h = delayRender("fonts");
Promise.all(fonts.map(([fam, file, w]) => new FontFace(fam, `url(${staticFile(file)}) format("woff2")`, { weight: w })
  .load().then((f) => document.fonts.add(f)))).then(() => continueRender(h));
registerRoot(Root);
```
The latin subset covers Portuguese accents (á, ç, ê, õ).

### Step 3 — Build
Compose scenes from the patterns below. Scene rhythm: HIT → hold (15–20 still frames) → build → HIT. Something must move in the first 15 frames. Never >90 frames without a new visual element.

### Step 4 — Render
```bash
npx remotion render src/index.ts <CompId> out/video.mp4 --codec h264 --crf 16 --overwrite
```
Remotion needs Chromium. If auto-download fails, pass one explicitly:
```bash
which chromium chromium-browser google-chrome 2>/dev/null; ls /opt/pw-browsers 2>/dev/null
npx remotion render ... --browser-executable=<path>
```
If full Chrome errors with "Old Headless mode has been removed", use a `headless_shell` binary (Playwright: `chromium_headless_shell-*/chrome-linux/headless_shell`).

### Step 5 — VERIFY (mandatory)
```bash
for t in 0.3 0.9 1.6 3.2 4.9; do ffmpeg -v error -y -ss $t -i out/video.mp4 -frames:v 1 -vf scale=360:-1 out/c_$t.png; done
ffmpeg -v error -y -i out/c_0.3.png -i out/c_0.9.png -i out/c_1.6.png -i out/c_3.2.png -i out/c_4.9.png -filter_complex hstack=5 out/sheet.png
```
(Without system ffmpeg: `npx remotion still src/index.ts <CompId> out/check_<f>.png --frame <f> --overwrite`.) Open the sheet and a full-res crop. Look for, in order:
- Spacing bugs: `gap`/`margin` in `em` resolves against the PARENT font-size — use px around big type.
- Text overflowing or touching edges (9:16: critical content in the middle ~75% vertically).
- Elements visible before entrance or after exit (missing clamp).
- Broken accents / fallback fonts.
- Color/contrast failures: hero color on >1 element per frame, dim text unreadable.
- Layer order mistakes (grain/vignette on top, grade above content).
Also `ffprobe` to confirm duration and that an audio stream exists. Fix → re-render → re-inspect. Only deliver after a clean pass, then run the checklist at the end.

### Editing the user's existing footage
Put the file in `public/`, render it as the asset layer with `<OffthreadVideo src={staticFile("clip.mp4")} />`, set duration from `ffprobe`, stack graphics/grade/grain above it.

## Theme template (`src/theme.ts`)
```ts
import { Easing } from "remotion";
export const theme = {
  colors: { bg: "#0A2A22", bgDark: "#08352A", primary: "#0E4B3C", light: "#2E7A63",
    hero: "#E36B1F", sand: "#EFDCA9", text: "#F6F1E3", textDim: "rgba(246,241,227,0.72)",
    glow: "rgba(227,107,31,0.45)" },
  fonts: { display: "Montserrat", body: "Lato" },
  ease: { out: Easing.bezier(0.16, 1, 0.3, 1), inOut: Easing.bezier(0.83, 0, 0.17, 1), in: Easing.bezier(0.7, 0, 0.84, 0) },
  spring: { snappy: { damping: 14, stiffness: 160, mass: 0.6 }, smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 } },
} as const;
```
For other brands, swap colors/fonts (dark tech default: bg #0A0A0F, hero #7C3AED, accent #22D3EE, text #F4F4F5).

## Motion patterns (component library)

### Premium entrance
```tsx
const Entrance: React.FC<{delay?: number; children: React.ReactNode}> = ({ delay = 0, children }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: theme.spring.smooth });
  return <div style={{ opacity: p, transform: `translateY(${interpolate(p,[0,1],[40,0])}px) scale(${interpolate(p,[0,1],[0.94,1])})` }}>{children}</div>;
};
// bezier version: interpolate(frame,[0,25],[60,0],{ easing: theme.ease.out, extrapolateLeft:"clamp", extrapolateRight:"clamp" })
```
Stagger: `items.map((it,i) => <Entrance delay={start + i*4}>…)` — words 3, cards 4–5, big blocks 6.

### Word-by-word reveal
```tsx
const WordReveal = ({ text, delay = 0, per = 3, style }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  return <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", columnGap: 18, ...style }}>
    {text.split(" ").map((w,i) => { const p = spring({ frame: frame - delay - i*per, fps, config: theme.spring.snappy });
      return <span key={i} style={{ display:"inline-block", opacity:p, transform:`translateY(${interpolate(p,[0,1],[30,0])}px)` }}>{w}</span>; })}
  </div>;
};
```
Use pixel gaps (not em) between big text blocks.

### Background mesh
```tsx
const BgMesh = () => { const frame = useCurrentFrame();
  const d1 = Math.sin(frame/55)*50, d2 = Math.cos(frame/70)*40;
  return <AbsoluteFill style={{ background: theme.colors.bg }}>
    <div style={{ position:"absolute", width:1200, height:1200, borderRadius:"50%", top:-450, left:-300+d1, filter:"blur(50px)", background:`radial-gradient(circle, ${theme.colors.light}55, transparent 62%)` }}/>
    <div style={{ position:"absolute", width:900, height:900, borderRadius:"50%", bottom:-400, right:-250-d2, filter:"blur(70px)", background:`radial-gradient(circle, ${theme.colors.sand}1f, transparent 65%)` }}/>
  </AbsoluteFill>; };
```

### Color grade (above content, below grain)
```tsx
const Grade = () => <AbsoluteFill style={{ pointerEvents:"none" }}>
  <AbsoluteFill style={{ backgroundColor: theme.colors.light, mixBlendMode:"soft-light", opacity:0.2 }}/>
  <AbsoluteFill style={{ background:"linear-gradient(180deg, rgba(0,0,0,0.12), transparent 28%, transparent 72%, rgba(0,0,0,0.25))" }}/>
</AbsoluteFill>;
```
Opacity 0.10–0.15 light themes, 0.18–0.25 dark. Per-asset fix: `filter: "saturate(1.1) contrast(1.08)"`.

### Procedural grain + vignette (topmost)
```tsx
const Grain = () => { const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return <AbsoluteFill style={{ pointerEvents:"none", backgroundImage:noise, backgroundSize:"220px",
    backgroundPosition:`${(frame*7)%220}px ${(frame*13)%220}px`, opacity:0.08, mixBlendMode:"overlay" }}/>; }; // "multiply" ~0.05 on light themes
const Vignette = () => <AbsoluteFill style={{ pointerEvents:"none", background:"radial-gradient(ellipse at center, transparent 54%, rgba(0,0,0,0.3) 100%)" }}/>;
```

### Ken Burns (every still)
```tsx
const KenBurns = ({ src, zoomTo = 1.1 }) => { const frame = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame,[0,durationInFrames],[1,zoomTo],{ easing: theme.ease.inOut });
  const pan = interpolate(frame,[0,durationInFrames],[0,-25],{ easing: theme.ease.inOut });
  return <Img src={staticFile(src)} style={{ width:"100%", height:"100%", objectFit:"cover", transform:`scale(${scale}) translateX(${pan}px)` }}/>; };
```
Alternate zoom in/out between shots. Rounded cards: `borderRadius:32, overflow:"hidden", border:"1px solid rgba(255,255,255,0.08)", boxShadow:"0 40px 80px -20px rgba(0,0,0,0.6)"`.

### Counter
`interpolate(spring({ frame: frame-delay, fps, config:{ damping:30, stiffness:60 } }),[0,1],[0,target])` with `fontVariantNumeric:"tabular-nums"`.

### Logo hero pop
Hero element (e.g. orange "+"): scale with bouncy spring, rotation from -120° with smooth spring, `textShadow: 0 0 60px glow, 0 0 120px glow`. Radial spark: 12 rays, each `spring` delayed `i*1.2` frames, `transformOrigin:"50% 0%"`, rotated `(360/rays)*i`.

### Exits (faster than entrances)
```tsx
const e = interpolate(frame,[durationInFrames-12, durationInFrames-2],[0,1],{ easing: theme.ease.in, extrapolateLeft:"clamp", extrapolateRight:"clamp" });
// style: { opacity: 1-e, transform: `translateY(${-45*e}px) scale(${1-0.04*e})` } on a scene wrapper
```

### Idle breathing / parallax
`1 + Math.sin(frame/22)*0.012` (scale), `Math.sin(frame/30)*3` (float px). Parallax: one eased x value applied at 0.3 / 0.6 / 1.0 to back/mid/front layers.

### Transitions
`@remotion/transitions` (`TransitionSeries` + `slide`, 12-frame timing) or hand-rolled 8–14 frames: whip pan (1500px in 6 frames + blur 8px), scale-through (A→1.3 + fade, B 0.8→1), brand-colored mask wipe. Motion blur for >30px/frame: `<Trail layers={4} lagInFrames={0.4}>` from `@remotion/motion-blur`.

### Audio + SFX
```tsx
<Audio src={staticFile("sfx/pad.wav")} volume={0.25}/>
<Sequence from={hitFrame - 3}><Audio src={staticFile("sfx/whoosh.wav")} volume={0.6}/></Sequence>
```
SFX 2–3 frames BEFORE the visual lands. Cuts on beat: framesPerBeat = fps*60/BPM. Music ~-18dB under SFX/VO.

No SFX assets is not a reason to ship silent — synthesize a kit (`scripts/gen-sfx.mjs`, run with node, writes 16-bit mono WAVs to `public/sfx/`):
```js
import { writeFileSync, mkdirSync } from "node:fs";
const SR = 44100, OUT = "public/sfx"; mkdirSync(OUT, { recursive: true });
const secs = (s) => Math.round(s * SR);
function wav(x){ const n=x.length,b=Buffer.alloc(44+n*2); b.write("RIFF",0); b.writeUInt32LE(36+n*2,4); b.write("WAVE",8); b.write("fmt ",12);
  b.writeUInt32LE(16,16); b.writeUInt16LE(1,20); b.writeUInt16LE(1,22); b.writeUInt32LE(SR,24); b.writeUInt32LE(SR*2,28); b.writeUInt16LE(2,32); b.writeUInt16LE(16,34);
  b.write("data",36); b.writeUInt32LE(n*2,40); for(let i=0;i<n;i++) b.writeInt16LE(Math.round(Math.max(-1,Math.min(1,x[i]))*32767),44+i*2); return b; }
function tone(name, dur, fn){ const N=secs(dur), o=new Float32Array(N); let ph=0, lp=0;
  for(let i=0;i<N;i++){ const t=i/N; const r=fn(t,ph,lp); ph=r.ph; lp=r.lp ?? lp; o[i]=r.v; } writeFileSync(`${OUT}/${name}`, wav(o)); }
// whoosh: swept low-passed noise
tone("whoosh.wav",0.4,(t,ph,lp)=>{ const c=0.05+0.25*Math.sin(Math.PI*t); lp+=c*((Math.random()*2-1)-lp); return { v: lp*Math.sin(Math.PI*Math.pow(t,0.7))**2*0.9, ph, lp }; });
// pop: pitch-dropping sine
tone("pop.wav",0.14,(t,ph)=>{ ph+=2*Math.PI*(700-380*t)/SR; return { v: Math.sin(ph)*Math.exp(-t*9)*0.8, ph }; });
// tick
tone("tick.wav",0.05,(t,ph)=>{ ph+=2*Math.PI*1900/SR; return { v: Math.sin(ph)*Math.exp(-t*14)*0.5, ph }; });
// bass hit
tone("bass.wav",0.45,(t,ph)=>{ ph+=2*Math.PI*(85-25*t)/SR; return { v: Math.sin(ph)*Math.exp(-t*6)*0.95, ph }; });
// pad: detuned A-major drone sized to the video (set DUR)
{ const DUR = 5.2, N = secs(DUR), o = new Float32Array(N), fr = [110,164.81,220,277.18];
  for (const f of fr) for (const d of [f/1.0015, f*1.0015]) { let ph = Math.random()*6.28; for (let i=0;i<N;i++){ ph += 2*Math.PI*d/SR; o[i] += Math.sin(ph); } }
  for (let i=0;i<N;i++){ const t=i/SR; o[i] *= (0.5/(fr.length*2))*Math.min(1,t/0.8)*Math.min(1,(DUR-t)/1.2)*(1-0.18*(0.5+0.5*Math.sin(2*Math.PI*0.13*t))); }
  writeFileSync(`${OUT}/pad.wav`, wav(o)); }
```
Tell the user synthesized audio is basic and suggest swapping in a real track (Pixabay, Mixkit, freesound.org) for publishing.

### Word-synced captions over footage
Get word timestamps (Whisper / `@remotion/install-whisper-cpp`), then `createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: 1200 })` from `@remotion/captions`; render each page in a `<Sequence>` from its start, highlight the active word in the hero color. Heavy display weight, 2–4 words per page, at ~65% height.

## Design rules
- **Color:** one base + ONE hero + one accent + neutrals, 60/30/10. Hero color on at most one element per frame; glow only on the hero.
- **Type:** display face 600–800, letterSpacing -0.03em, lineHeight 1.05. Reels hero 80–250px at 1080 wide; landscape 100–160px. Body/captions clean sans 400–500, dimmed. Highlight ONE word per headline. Never default system fonts for hero text.
- **No emoji as icons** — they ignore the palette; draw glyphs with CSS/SVG.
- **30s Reel:** 0–1.5s HOOK (movement in first 15 frames) → 1.5–3s CONTEXT → 3–22s BODY (3–4 beats: HIT → hold → build) → 22–27s PAYOFF (biggest animation) → 27–30s CTA (calm, glow on CTA word).
- **5s logo sting:** mark in (0–0.8s) → wordmark (0.6–1.8s) → tagline/detail (2–3.5s) → breathe → exit (last 0.5s).
- New visual element at least every 90 frames; holds are a design tool (fast move → stillness → next move).
- 9:16 safe zone: critical text inside the middle ~75% vertically.
- **Generated images:** lock a prompt skeleton, vary only the subject, same lighting/palette words, final aspect ratio.
- **Render:** masters `--crf 16`; heavy blur/transparency add `--image-format png`.
- Avoid: one giant component; `durationInFrames` mismatch (dead air); forgetting `--overwrite` and inspecting stale files; describing the result instead of rendering it.

## PRE-DELIVERY CHECKLIST
- [ ] Zero linear easing; every interpolate clamped
- [ ] Entrances = 2–3 properties, staggered
- [ ] Exits animated, faster than entrances
- [ ] Every still has Ken Burns; fast moves have motion blur
- [ ] 5-layer stack present
- [ ] One hero color, ≤1 hero/glowing element per frame
- [ ] Display font ≥600 on heroes; accents render correctly
- [ ] Pixel gaps between large text blocks
- [ ] ≥3 moments of stillness
- [ ] SFX on major hits (audio stream confirmed with ffprobe)
- [ ] Text inside safe zone; nothing touching edges
- [ ] Frames extracted and visually inspected; issues fixed and re-rendered
- [ ] Deliver the mp4 with SendUserFile and a one-line summary
## PERFIL ÁLIBI (true crime, TikTok) — sobrepõe a marca Prof+ quando o vídeo for do ÁLIBI
Regras completas: skill `alibi-perfil`. Kit pronto: `_reels/alibi-lote1/src/kit.tsx` (Plano, Clip, Foto, Cheia, Titulo,
Faixa, Carimbo, Contador, Papel, Legenda, Hud, TelaFinal, Capa em `src/capas.tsx`). Paleta grafite #0A0A0B, osso #ECE7DC,
lacre #A3141C / #E0353F; Playfair 900, Montserrat 800, Special Elite, Courier Prime, Inter.
- **Quadro 0 em movimento** (o orgânico perdeu a maioria em 0:01 com título parado + foto): clipe em movimento ou foto com
  soco 1,25→1 em ~0,4 s, voz começando em ≤ 0,1 s e texto do gancho entrando palavra a palavra com a fala.
- **Sem "Caso nº X" na abertura**: o HUD com o número só entra depois de 3 s (o número vai na capa e na legenda).
- Corte a cada 3–5 s, nada parado > 4 s, legenda sempre ativa (y 1320–1480, margem direita 170).
- Tela final: ÁLIBI + "AMANHÃ 19H30 · <próximo caso>" + "SEGUE O ÁLIBI" (últimos ~3 s).
- 60–90 s; efeitos com `SFX_GANHO = 0.45`; trilha sintetizada; export yuv420p nível 4.1, -14 LUFS, < 50 MB.
- Gerar a capa (≤ 5 palavras, nº do caso) e o PACOTE DE POSTAGEM (ver `alibi-perfil` §5) em toda entrega.
