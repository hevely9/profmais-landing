/* arte.js: personagens e cenários em SVG (estilo flat) para a série "A História dos Números".
   Cada cena chama cena({...}). Tudo é desenhado por código: sem imagens externas. */

// ── Personagens ───────────────────────────────────────────────────────────
function personagem(o = {}) {
  const pele = o.pele || '#E8B48A', roupa = o.roupa || '#3B5BA5', cabelo = o.cabelo || '#2B1D14';
  const sombra = 'rgba(0,0,0,.18)', escuro = '#2A1410';
  const e = o.expr || 'neutro', pose = o.pose || 'normal';

  const braco = (d, mao) => `<path d="${d}" stroke="${roupa}" stroke-width="64" stroke-linecap="round" fill="none"/>
    <path d="${d}" stroke="${sombra}" stroke-width="64" stroke-linecap="round" fill="none" opacity=".25"/>
    <circle cx="${mao[0]}" cy="${mao[1]}" r="34" fill="${pele}"/>`;
  const bracos = {
    normal: braco('M150 560 Q105 660 118 760', [118, 770]) + braco('M350 560 Q395 660 382 760', [382, 770]),
    aponta: braco('M150 560 Q105 660 118 760', [118, 770]) + braco('M352 560 Q450 520 478 420', [482, 410]),
    pensa: braco('M150 560 Q105 660 118 760', [118, 770]) + braco('M352 575 Q340 470 300 432', [296, 428]),
    celebra: braco('M148 560 Q60 470 70 360', [70, 350]) + braco('M352 560 Q440 470 430 360', [430, 350]),
    segura: braco('M150 560 Q140 640 220 650', [228, 650]) + braco('M350 560 Q360 640 280 650', [272, 650]),
  }[pose];

  const sob = {
    bravo: ['M172 248 L234 276', 'M266 276 L328 248'],
    confuso: ['M172 236 Q200 222 232 240', 'M268 266 L328 260'],
    feliz: ['M176 248 Q204 230 232 246', 'M268 246 Q296 230 324 248'],
    malicioso: ['M174 262 L234 274', 'M266 270 Q300 250 330 256'],
    surpreso: ['M176 228 Q204 208 232 226', 'M268 226 Q296 208 324 228'],
    pensativo: ['M176 250 Q204 240 232 250', 'M268 244 Q296 232 324 244'],
    neutro: ['M176 252 Q204 244 232 252', 'M268 252 Q296 244 324 252'],
  }[e];
  const olhar = { pensativo: [-8, -10], malicioso: [6, 4], confuso: [6, -4] }[e] || [0, 2];
  const olhos = [205, 295].map(x => `<ellipse cx="${x}" cy="302" rx="25" ry="${e === 'surpreso' ? 33 : 29}" fill="#fff"/>
    <circle cx="${x + olhar[0]}" cy="${304 + olhar[1]}" r="${e === 'surpreso' ? 11 : 13}" fill="${escuro}"/>
    <circle cx="${x + olhar[0] + 5}" cy="${298 + olhar[1]}" r="4" fill="#fff"/>`).join('');
  const palpebra = e === 'malicioso' ? [205, 295].map(x => `<path d="M${x - 28} 300 Q${x} 268 ${x + 28} 300 L${x + 28} 270 L${x - 28} 270Z" fill="${pele}"/>
    <path d="M${x - 27} 300 L${x + 27} 300" stroke="${escuro}" stroke-width="5"/>`).join('') : '';
  const boca = {
    bravo: `<path d="M212 396 Q250 366 288 396" stroke="${escuro}" stroke-width="9" fill="none" stroke-linecap="round"/>`,
    confuso: `<path d="M214 388 q12 -12 24 0 t24 0 t24 0" stroke="${escuro}" stroke-width="8" fill="none" stroke-linecap="round"/>`,
    feliz: `<path d="M204 364 Q250 430 296 364 Z" fill="#7A1F1F"/><path d="M214 368 Q250 384 286 368" stroke="#fff" stroke-width="10" fill="none"/>`,
    malicioso: `<path d="M214 382 Q258 404 292 366" stroke="${escuro}" stroke-width="9" fill="none" stroke-linecap="round"/>`,
    surpreso: `<ellipse cx="250" cy="390" rx="20" ry="28" fill="#7A1F1F"/>`,
    pensativo: `<path d="M226 388 L276 382" stroke="${escuro}" stroke-width="9" stroke-linecap="round"/>`,
    neutro: `<path d="M222 382 Q250 398 278 382" stroke="${escuro}" stroke-width="9" fill="none" stroke-linecap="round"/>`,
  }[e];
  const bochecha = `<circle cx="172" cy="350" r="22" fill="${e === 'bravo' ? '#E0352B' : '#F08A8A'}" opacity="${e === 'bravo' ? .45 : .3}"/>
    <circle cx="328" cy="350" r="22" fill="${e === 'bravo' ? '#E0352B' : '#F08A8A'}" opacity="${e === 'bravo' ? .45 : .3}"/>`;
  const barba = o.barba ? `<path d="M140 320 Q146 488 250 500 Q354 488 360 320 Q336 432 250 438 Q164 432 140 320Z" fill="${o.barba}"/>` : '';
  const cabeloBase = `<path d="M134 290 Q132 160 250 156 Q368 160 366 290 Q344 214 250 218 Q156 214 134 290Z" fill="${cabelo}"/>`;

  const chapeus = {
    florentino: `<path d="M120 262 Q108 128 250 116 Q404 122 386 262 Q392 300 360 292 Q334 204 250 204 Q166 204 140 292 Q108 300 120 262Z" fill="#B3262E"/>
      <path d="M126 250 Q250 196 378 250" stroke="#8C1C23" stroke-width="18" fill="none"/>
      <path d="M372 236 Q440 330 410 486 Q388 404 356 300Z" fill="#9C2129"/>`,
    louros: cabeloBase + Array.from({ length: 9 }, (_, i) => {
      const a = Math.PI * (1 - i / 8), x = 250 + Math.cos(a) * 128, y = 262 - Math.sin(a) * 104;
      return `<ellipse cx="${x}" cy="${y}" rx="15" ry="30" fill="#4E8B3A" transform="rotate(${(a * 180 / Math.PI) - 90 + 20} ${x} ${y})"/>`;
    }).join(''),
    turbante: `<path d="M122 268 Q108 118 250 104 Q392 118 378 268 Q334 218 250 222 Q166 218 122 268Z" fill="#E8A23A"/>
      <path d="M140 220 Q250 150 362 222 M132 248 Q250 176 370 250" stroke="#C47F22" stroke-width="12" fill="none"/>
      <circle cx="250" cy="196" r="20" fill="#C0392B" stroke="#F5C542" stroke-width="6"/>`,
    turbanteBranco: `<path d="M118 300 Q120 460 170 500 L170 300Z M382 300 Q380 460 330 500 L330 300Z" fill="#E9E4D6"/>
      <path d="M120 270 Q106 120 250 108 Q394 120 380 270 Q334 220 250 224 Q166 220 120 270Z" fill="#F4F1E8"/>
      <path d="M128 238 Q250 170 372 238" stroke="#2D6A8C" stroke-width="16" fill="none"/>`,
    capuz: `<path d="M96 336 Q90 120 250 110 Q410 120 404 336 Q406 486 330 500 L334 300 Q330 214 250 212 Q170 214 166 300 L170 500 Q94 486 96 336Z" fill="#2B2F3A"/>`,
    bone: cabeloBase + `<path d="M138 250 Q142 156 250 152 Q358 156 362 250 Z" fill="#E36B1F"/><path d="M250 250 L410 244 Q420 262 402 270 L250 268Z" fill="#B9551A"/>`,
  };
  const chapeu = o.chapeu ? chapeus[o.chapeu] : cabeloBase;

  return `<svg viewBox="0 0 500 800" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="250" cy="800" rx="190" ry="26" fill="rgba(0,0,0,.25)"/>
    <path d="M104 800 Q112 520 250 500 Q388 520 396 800 Z" fill="${roupa}"/>
    <path d="M250 500 Q388 520 396 800 L300 800 Q320 620 250 500Z" fill="${sombra}"/>
    <path d="M200 505 L250 580 L300 505" fill="none" stroke="${o.gola || 'rgba(255,255,255,.55)'}" stroke-width="14" stroke-linejoin="round"/>
    <rect x="222" y="410" width="56" height="104" rx="20" fill="${pele}"/><rect x="222" y="410" width="56" height="60" fill="${sombra}"/>
    ${bracos}
    <ellipse cx="132" cy="312" rx="22" ry="32" fill="${pele}"/><ellipse cx="368" cy="312" rx="22" ry="32" fill="${pele}"/>
    <ellipse cx="250" cy="300" rx="120" ry="130" fill="${pele}"/>
    ${barba}${bochecha}${olhos}${palpebra}
    <path d="M${sob[0].slice(1)}" stroke="${o.sobrancelha || cabelo}" stroke-width="13" fill="none" stroke-linecap="round"/>
    <path d="M${sob[1].slice(1)}" stroke="${o.sobrancelha || cabelo}" stroke-width="13" fill="none" stroke-linecap="round"/>
    <path d="M250 320 Q240 345 256 352" stroke="${sombra}" stroke-width="8" fill="none" stroke-linecap="round"/>
    ${boca}${chapeu}
  </svg>`;
}

// ── Cenários (silhuetas grandes, uma cor dominante por época) ─────────────
function aleatorio(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

function cenario(tipo, c = '#5A3A2A', c2 = '#3E271C', luz = '#FFD27A') {
  const casas = (n, y, cor, seed) => { const r = aleatorio(seed); let x = -20, out = '';
    while (x < 1100) { const w = 90 + r() * 90, h = 120 + r() * 140;
      out += `<rect x="${x}" y="${y - h}" width="${w}" height="${h + 400}" fill="${cor}"/><path d="M${x - 8} ${y - h} L${x + w / 2} ${y - h - 46} L${x + w + 8} ${y - h}Z" fill="${cor}"/>`;
      for (let j = 0; j < 2; j++) if (r() > .4) out += `<rect x="${x + 18 + j * (w / 2 - 6)}" y="${y - h + 40}" width="24" height="34" rx="12" fill="${luz}" opacity=".85"/>`;
      x += w + 6; } return out; };
  const svgs = {
    florenca: `${casas(10, 760, c2, 7)}
      <rect x="240" y="150" width="120" height="620" fill="${c}"/><path d="M230 150 L300 70 L370 150Z" fill="${c}"/>
      ${[0, 1, 2, 3].map(i => `<rect x="272" y="${210 + i * 130}" width="56" height="80" rx="28" fill="${c2}"/>`).join('')}
      <rect x="560" y="420" width="360" height="360" fill="${c}"/>
      <path d="M580 430 Q740 120 900 430Z" fill="${c}"/><path d="M640 430 Q740 200 840 430" stroke="${c2}" stroke-width="10" fill="none"/>
      <rect x="715" y="190" width="50" height="90" fill="${c}"/><path d="M705 190 L740 140 L775 190Z" fill="${c}"/>
      ${[0, 1, 2, 3, 4].map(i => `<rect x="${590 + i * 66}" y="500" width="34" height="70" rx="17" fill="${c2}"/>`).join('')}`,
    coliseu: `<path d="M40 900 L40 260 Q540 160 1040 260 L1040 900Z" fill="${c}"/>
      ${[0, 1, 2].map(row => Array.from({ length: 9 }, (_, i) => `<path d="M${84 + i * 108} ${430 + row * 170} L${84 + i * 108} ${360 + row * 170} Q${124 + i * 108} ${310 + row * 170} ${164 + i * 108} ${360 + row * 170} L${164 + i * 108} ${430 + row * 170}Z" fill="${c2}"/>`).join('')).join('')}
      <path d="M40 300 Q540 200 1040 300" stroke="${c2}" stroke-width="14" fill="none"/>
      <path d="M760 900 L760 600 L1080 560 L1080 900Z" fill="${c2}" opacity=".6"/>`,
    templo: `<path d="M330 820 L360 300 Q540 40 720 300 L750 820Z" fill="${c}"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${352 + i * 4} ${330 + i * 80} Q540 ${300 + i * 80 - 40} ${728 - i * 4} ${330 + i * 80}" stroke="${c2}" stroke-width="12" fill="none"/>`).join('')}
      <circle cx="540" cy="92" r="30" fill="${c}"/><rect x="532" y="30" width="16" height="50" fill="${c}"/>
      <path d="M90 820 L110 520 Q200 380 290 520 L310 820Z" fill="${c2}"/><path d="M770 820 L790 520 Q880 380 970 520 L990 820Z" fill="${c2}"/>
      <rect x="470" y="660" width="140" height="160" rx="70" fill="${c2}"/>
      <path d="M30 900 Q60 600 40 420 M40 420 q-70 -10 -110 40 M40 420 q70 -30 120 10 M40 420 q-20 -70 -80 -80 M40 420 q40 -70 100 -60" stroke="${c2}" stroke-width="22" fill="none" stroke-linecap="round"/>`,
    arabe: `<path d="M180 120 a80 80 0 1 0 60 140 a64 64 0 1 1 -60 -140Z" fill="${luz}"/>
      ${[[720, 60], [880, 140], [620, 180], [960, 40], [420, 90], [120, 300]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#fff" opacity=".8"/>`).join('')}
      <rect x="140" y="560" width="300" height="340" fill="${c}"/><path d="M150 570 Q290 330 430 570Z" fill="${c}"/>
      <rect x="520" y="250" width="70" height="650" fill="${c}"/><path d="M505 250 L555 160 L605 250Z" fill="${c}"/><rect x="500" y="320" width="110" height="24" fill="${c}"/>
      <rect x="650" y="620" width="380" height="280" fill="${c}"/><path d="M670 630 Q840 380 1010 630Z" fill="${c}"/>
      ${[0, 1, 2].map(i => `<path d="M${700 + i * 110} 900 L${700 + i * 110} 760 Q${740 + i * 110} 700 ${780 + i * 110} 760 L${780 + i * 110} 900Z" fill="${c2}"/>`).join('')}
      <path d="M210 900 L210 760 Q290 690 370 760 L370 900Z" fill="${c2}"/>`,
    cidade: (() => { const r = aleatorio(3); let x = 0, out = '';
      while (x < 1080) { const w = 110 + r() * 90, h = 380 + r() * 420;
        out += `<rect x="${x}" y="${900 - h}" width="${w}" height="${h}" fill="${r() > .5 ? c : c2}"/>`;
        for (let yy = 900 - h + 30; yy < 880; yy += 58) for (let xx = x + 16; xx < x + w - 24; xx += 36) if (r() > .45)
          out += `<rect x="${xx}" y="${yy}" width="18" height="26" fill="${r() > .3 ? luz : '#7FE3FF'}" opacity="${.5 + r() * .5}"/>`;
        x += w + 8; } return out; })(),
    nenhum: '',
  };
  return `<svg viewBox="0 0 1080 900" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">${svgs[tipo] || ''}</svg>`;
}

// ── Montagem da cena ──────────────────────────────────────────────────────
function cena(o) {
  const b = document.body;
  b.style.setProperty('--c1', o.c1); b.style.setProperty('--c2', o.c2);
  b.style.setProperty('--chao', o.chao || '#2A2A2A'); if (o.acento) b.style.setProperty('--acento', o.acento);
  let html = `<div class="camada ceu"></div>`;
  if (o.cenario) html += `<div class="cenario lento">${cenario(o.cenario, o.sil, o.sil2, o.luz)}</div>`;
  if (o.chao) html += `<div class="chao"></div>`;
  if (o.extra) html += o.extra;
  (o.personagens || []).forEach(p => {
    html += `<div class="personagem ${p.pos || ''} a ${p.anim || 'sobe'}" style="--d:${p.d ?? .05}s;--t:.55s"><div class="balanca" style="--d:${p.d ?? 0}s">${personagem(p)}</div></div>`;
  });
  html += `<div class="camada vinheta"></div>`;
  if (o.prop) html += `<div class="prop" style="${o.propEstilo || ''}">${o.prop}</div>`;
  if (o.serie) html += `<div class="selo-serie a sobe" style="--d:0s;--t:.01s">A história dos <b>números</b><br><small>EP.01 · O ZERO</small></div>`;
  if (o.legenda) {
    const d0 = o.legendaD ?? .15;
    html += `<div class="legenda">${o.legenda.map((l, i) => {
      const menor = l.startsWith('~'); l = menor ? l.slice(1) : l;
      const anim = o.imediato ? 'suave' : 'pop', d = o.imediato ? 0 : d0 + i * (o.passo ?? .45);
      return `<div class="linha a ${anim} ${menor ? 'menor' : ''}" style="--d:${d.toFixed(2)}s;--t:${o.imediato ? '.9s' : '.4s'}">${l.replace(/\*(.+?)\*/g, '<b>$1</b>')}</div>`;
    }).join('')}</div>`;
  }
  b.insertAdjacentHTML('beforeend', html);
  if (location.search.includes('guias')) b.classList.add('guias');
}
