import React from "react";

// Símbolos de rótulo em traço (viewBox 100×100). `p` (0–1) controla as animações dos grandes.
export const INK = "#1F1B17";
const base = (sw: number) => ({ fill: "none", stroke: INK, strokeWidth: sw, strokeLinecap: "round" as const, strokeLinejoin: "round" as const });
type P = { size: number; sw?: number; style?: React.CSSProperties };

// Período após aberto (pote com tampa aberta). `abre` 0→1 abre a tampa.
export const IconPAO: React.FC<P & { abre?: number; meses?: string }> = ({ size, sw = 5, abre = 1, meses = "12M", style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", ...style }}>
    <path d="M24 44 H76 V80 Q76 88 68 88 H32 Q24 88 24 80 Z" {...base(sw)} />
    <g transform={`rotate(${-34 * abre} 22 40) translate(0 ${-6 * abre})`}>
      <rect x="20" y="31" width="60" height="10" rx="3" {...base(sw)} />
    </g>
    <text x="50" y="74" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight={700} fontSize="20" fill={INK}>{meses}</text>
  </svg>
);

// Coelhinho (não testado em animais). `traco` 0→1 desenha o contorno.
export const IconCoelho: React.FC<P & { traco?: number; orelha?: number }> = ({ size, sw = 5, traco = 1, orelha = 0, style }) => {
  const d = (len: number) => ({ strokeDasharray: len, strokeDashoffset: len * (1 - traco) });
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", ...style }}>
      <circle cx="50" cy="50" r="45" {...base(sw * 0.7)} style={d(290)} />
      <g transform={`rotate(${orelha * -8} 44 46)`}><path d="M44 46 C34 30 34 12 40 10 C46 9 48 28 47 44" {...base(sw)} style={d(90)} /></g>
      <g transform={`rotate(${orelha * 8} 56 46)`}><path d="M53 44 C52 28 56 9 62 10 C68 12 66 30 56 46" {...base(sw)} style={d(90)} /></g>
      <path d="M50 44 C33 44 27 56 30 66 C32 74 40 80 50 80 C60 80 68 74 70 66 C73 56 67 44 50 44 Z" {...base(sw)} style={d(150)} />
      <circle cx="43" cy="60" r="2.8" fill={INK} opacity={traco} />
      <circle cx="57" cy="60" r="2.8" fill={INK} opacity={traco} />
      <path d="M47 68 Q50 71 53 68" {...base(sw * 0.7)} style={d(10)} />
    </svg>
  );
};

// Triângulo de reciclagem com o código do material. `giro` em graus.
export const IconTriangulo: React.FC<P & { giro?: number; num?: number; cod?: string }> = ({ size, sw = 5, giro = 0, num = 1, cod = "PP", style }) => {
  const A = [50, 10], B = [90, 80], C = [10, 80];
  const lado = (p: number[], r: number[], k: number) => {
    const a = [p[0] + (r[0] - p[0]) * 0.16, p[1] + (r[1] - p[1]) * 0.16], b = [p[0] + (r[0] - p[0]) * 0.84, p[1] + (r[1] - p[1]) * 0.84];
    const ang = Math.atan2(r[1] - p[1], r[0] - p[0]);
    const h1 = [b[0] - 11 * Math.cos(ang - 0.55), b[1] - 11 * Math.sin(ang - 0.55)], h2 = [b[0] - 11 * Math.cos(ang + 0.55), b[1] - 11 * Math.sin(ang + 0.55)];
    return <g key={k}><path d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} {...base(sw)} /><path d={`M${h1[0]} ${h1[1]} L${b[0]} ${b[1]} L${h2[0]} ${h2[1]}`} {...base(sw)} /></g>;
  };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", ...style }}>
      <g transform={`rotate(${giro} 50 57)`}>{[lado(A, B, 0), lado(B, C, 1), lado(C, A, 2)]}</g>
      <text x="50" y="69" textAnchor="middle" fontFamily="Inter" fontWeight={800} fontSize="26" fill={INK} opacity={num}>5</text>
      <text x="50" y="99" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight={700} fontSize="15" fill={INK} opacity={num}>{cod}</text>
    </svg>
  );
};

// Ampulheta (validade definida). `areia` 0→1 escoa de cima para baixo.
export const IconAmpulheta: React.FC<P & { areia?: number }> = ({ size, sw = 5, areia = 0.5, style }) => {
  const a = Math.max(0, Math.min(1, areia));
  const topY = 22 + 22 * a; // superfície da areia de cima desce
  const pile = 84 - 22 * a;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", ...style }}>
      <defs>
        <clipPath id="cimaAmp"><path d="M32 14 C32 38 47 44 47 50 L53 50 C53 44 68 38 68 14 Z" /></clipPath>
        <clipPath id="baixoAmp"><path d="M47 50 C47 56 32 62 32 86 L68 86 C68 62 53 56 53 50 Z" /></clipPath>
      </defs>
      <rect x="20" y={topY} width="60" height="40" fill="#E7B7C2" clipPath="url(#cimaAmp)" />
      <path d={`M30 86 Q50 ${pile} 70 86 Z`} fill="#E7B7C2" clipPath="url(#baixoAmp)" />
      {a > 0.02 && a < 0.98 && <line x1="50" y1="50" x2="50" y2={pile + 2} stroke="#E7B7C2" strokeWidth="2.4" />}
      <path d="M26 12 H74 M26 88 H74" {...base(sw)} />
      <path d="M32 14 C32 38 47 44 47 50 C47 56 32 62 32 86 M68 14 C68 38 53 44 53 50 C53 56 68 62 68 86" {...base(sw)} />
    </svg>
  );
};

// Ponto Verde (duas setas entrelaçadas em círculo). `giro` em graus.
export const IconPontoVerde: React.FC<P & { giro?: number }> = ({ size, sw = 5, giro = 0, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", ...style }}>
    <circle cx="50" cy="50" r="45" {...base(sw * 0.7)} />
    <g transform={`rotate(${giro} 50 50)`}>
      <path d="M50 18 A32 32 0 0 0 46 81" {...base(sw * 1.25)} />
      <path d="M38 73 L47 82 L37 89" {...base(sw * 1.1)} />
      <path d="M50 82 A32 32 0 0 0 54 19" {...base(sw * 1.25)} />
      <path d="M62 27 L53 18 L63 11" {...base(sw * 1.1)} />
    </g>
  </svg>
);

export const ICONES = [IconPAO, IconCoelho, IconTriangulo, IconAmpulheta, IconPontoVerde];

// Ícones de apoio.
export const Frasco: React.FC<P> = ({ size, sw = 5, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", ...style }}>
    <path d="M40 10 H60 M43 10 V38 L22 80 Q18 90 28 90 H72 Q82 90 78 80 L57 38 V10" {...base(sw)} />
    <path d="M30 68 H70" {...base(sw * 0.7)} />
  </svg>
);
export const Predio: React.FC<P> = ({ size, sw = 5, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", ...style }}>
    <path d="M14 90 V40 L38 26 V40 L62 26 V40 L86 26 V90 Z" {...base(sw)} />
    <path d="M28 58 H36 M46 58 H54 M64 58 H72 M28 72 H36 M46 72 H54 M64 72 H72" {...base(sw * 0.8)} />
  </svg>
);
export const Moeda: React.FC<P> = ({ size, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", ...style }}>
    <circle cx="50" cy="50" r="42" fill="#F2C94C" stroke={INK} strokeWidth="6" />
    <circle cx="50" cy="50" r="30" fill="none" stroke={INK} strokeWidth="3" opacity="0.35" />
    <text x="50" y="64" textAnchor="middle" fontFamily="Inter" fontWeight={800} fontSize="40" fill={INK}>$</text>
  </svg>
);
export const Salvar: React.FC<P & { cheio?: number }> = ({ size, sw = 6, cheio = 1, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", ...style }}>
    <path d="M26 10 H74 Q80 10 80 16 V90 L50 70 L20 90 V16 Q20 10 26 10 Z" fill="#E7B7C2" fillOpacity={cheio} stroke={INK} strokeWidth={sw} strokeLinejoin="round" />
  </svg>
);
