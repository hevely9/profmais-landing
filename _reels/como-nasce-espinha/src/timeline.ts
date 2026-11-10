// "Como nasce uma espinha" — sem narração; tudo em segundos.
export const FPS = 30;
export const q = (t: number) => Math.round(t * FPS);

export const T = {
  mira: 0.45,              // mira aparece na bochecha
  mergulho: [0.85, 1.6],   // câmera entra no poro
  p1: 1.6,                 // 1 · o poro entope
  p2: 3.6,                 // 2 · a bactéria se multiplica
  p3: 5.2,                 // 3 · a pele inflama
  volta: [6.9, 7.5],       // câmera volta à superfície
  espinha: 7.42,           // a espinha aparece
  fim: 9.0,                // tela da marca
};
export const TOTAL = q(T.fim + 3.3);

// Câmera dentro da pele: foco (fx, fy) do mundo vai para o ponto (540, 1000) da tela.
export const CAM: { t: number; d: number; s: number; fx: number; fy: number }[] = [
  { t: 0, d: 0, s: 1, fx: 540, fy: 900 },
  { t: T.p2 - 0.25, d: 0.7, s: 1.5, fx: 540, fy: 960 },
  { t: T.p3 - 0.25, d: 0.7, s: 1.22, fx: 540, fy: 770 },
];

export const SFX: { src: string; at: number; vol?: number }[] = [
  { src: "sfx-massinha", at: 0.05, vol: 0.5 },
  { src: "sfx-lapis", at: T.mira, vol: 0.4 },
  { src: "esp-mergulho", at: T.mergulho[1] - 1.0, vol: 0.9 },   // impacto grave cai na chegada
  { src: "sfx-massinha", at: T.p1 + 0.1, vol: 0.45 },
  { src: "esp-sebo", at: T.p1 + 0.15, vol: 0.75 },
  { src: "sfx-whoosh", at: T.p2 - 0.3, vol: 0.3 },
  { src: "sfx-massinha", at: T.p2 + 0.05, vol: 0.45 },
  { src: "esp-bacterias", at: T.p2 + 0.1, vol: 0.7 },
  { src: "sfx-whoosh", at: T.p3 - 0.3, vol: 0.3 },
  { src: "sfx-massinha", at: T.p3 + 0.05, vol: 0.45 },
  { src: "esp-inflamacao", at: T.p3 - 0.05, vol: 0.9 },
  { src: "esp-pop", at: T.espinha - 0.5, vol: 0.9 },             // "boing" cai quando a espinha aparece
  { src: "sfx-lapis", at: T.espinha + 0.45, vol: 0.45 },
  { src: "sfx-whoosh", at: T.fim - 0.15, vol: 0.35 },
  { src: "esp-brilho", at: T.fim + 0.1, vol: 0.6 },
  { src: "sfx-ding", at: T.fim + 2.05, vol: 0.5 },
];
