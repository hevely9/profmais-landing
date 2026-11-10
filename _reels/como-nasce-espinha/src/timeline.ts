// "Como nasce uma espinha" v2 — sem narração; tudo em segundos.
export const FPS = 30;
export const q = (t: number) => Math.round(t * FPS);

export const T = {
  preocupa: 1.0,            // ela sente algo e olha para a bochecha
  mao: [1.45, 2.2],         // a mão sobe até o rosto
  mira: 2.7,                // mira aparece no ponto tocado
  mergulho: [3.25, 4.05],   // câmera entra no poro
  p1: 4.05,                 // 1 · sebo demais
  p2: 6.6,                  // 2 · o poro entope
  p3: 9.4,                  // 3 · a bactéria se multiplica
  p4: 12.2,                 // 4 · a pele inflama
  volta: [15.2, 15.9],      // câmera volta à superfície
  espinha: 15.82,           // a espinha aparece
  higiene: 16.7,            // nota "não é falta de higiene!"
  espreme: [17.5, 18.1],    // a mão sobe para espremer…
  nao: 18.15,               // …"não esprema!"
  relaxa: 19.2,             // ela respira e sorri
  fim: 20.2,                // tela da marca
};
export const TOTAL = q(T.fim + 3.3);

// Câmera dentro da pele: foco (fx, fy) do mundo vai para o ponto (540, 1000) da tela.
export const CAM: { t: number; d: number; s: number; fx: number; fy: number }[] = [
  { t: 0, d: 0, s: 1, fx: 540, fy: 900 },
  { t: T.p1 + 0.15, d: 0.8, s: 1.2, fx: 610, fy: 930 },
  { t: T.p2 - 0.25, d: 0.7, s: 1.12, fx: 540, fy: 790 },
  { t: T.p3 - 0.25, d: 0.7, s: 1.5, fx: 540, fy: 960 },
  { t: T.p4 - 0.25, d: 0.7, s: 1.22, fx: 540, fy: 770 },
];

export const SFX: { src: string; at: number; vol?: number }[] = [
  { src: "sfx-massinha", at: 0.05, vol: 0.5 },
  { src: "esp-duvida", at: T.preocupa + 0.2, vol: 0.55 },
  { src: "sfx-whoosh", at: T.mao[0], vol: 0.22 },
  { src: "esp-toque", at: T.mao[1] + 0.02, vol: 0.6 },
  { src: "esp-toque", at: T.mao[1] + 0.3, vol: 0.5 },
  { src: "sfx-lapis", at: T.mira, vol: 0.4 },
  { src: "esp-mergulho", at: T.mergulho[1] - 1.0, vol: 0.9 },
  { src: "sfx-massinha", at: T.p1 + 0.1, vol: 0.45 },
  { src: "esp-sebo", at: T.p1 + 0.3, vol: 0.7 },
  { src: "sfx-whoosh", at: T.p2 - 0.3, vol: 0.28 },
  { src: "sfx-massinha", at: T.p2 + 0.05, vol: 0.45 },
  ...[0, 1, 2, 3, 4, 5, 6].map((i) => ({ src: "esp-toque", at: T.p2 + 0.75 + i * 0.14, vol: 0.32 })),
  { src: "esp-sebo", at: T.p2 + 1.0, vol: 0.7 },
  { src: "sfx-whoosh", at: T.p3 - 0.3, vol: 0.28 },
  { src: "sfx-massinha", at: T.p3 + 0.05, vol: 0.45 },
  { src: "esp-bacterias", at: T.p3 + 0.2, vol: 0.7 },
  { src: "sfx-whoosh", at: T.p4 - 0.3, vol: 0.28 },
  { src: "sfx-massinha", at: T.p4 + 0.05, vol: 0.45 },
  { src: "esp-inflamacao", at: T.p4 + 0.1, vol: 0.9 },
  { src: "esp-pop", at: T.espinha - 0.5, vol: 0.9 },
  { src: "sfx-lapis", at: T.higiene, vol: 0.45 },
  { src: "sfx-whoosh", at: T.espreme[0], vol: 0.22 },
  { src: "esp-nao", at: T.nao - 0.02, vol: 0.7 },
  { src: "esp-brilho", at: T.relaxa, vol: 0.35 },
  { src: "sfx-whoosh", at: T.fim - 0.15, vol: 0.35 },
  { src: "esp-brilho", at: T.fim + 0.1, vol: 0.6 },
  { src: "sfx-ding", at: T.fim + 2.05, vol: 0.5 },
];
