import React from "react";

// Personagens em vetor (viewBox 600×900; cabeça em (300, 300)). Braços por ângulo, expressões e piscar.
export type Braco = { ombro: number; cotovelo: number }; // graus: 0 = para baixo, positivo = para fora/cima
export type PessoaProps = {
  pele: string; peleSombra: string; cabelo: string; camisa: string; camisaSombra: string;
  estilo: "maria" | "coque" | "homem";
  humor: number;         // -1 preocupada · 0 neutra · 1 sorrindo
  pisca?: number;        // 1 aberto · 0 fechado
  olhar?: [number, number];
  bracoE?: Braco; bracoD?: Braco;
  boca?: number;         // 0–1 abre a boca (falando)
  detalhe?: React.ReactNode; // estampa / acessório no peito
  inclina?: number;
};

const membro = (ox: number, oy: number, b: Braco, lado: 1 | -1, L1 = 150, L2 = 135) => {
  const a1 = ((b.ombro * lado) * Math.PI) / 180, a2 = (((b.ombro + b.cotovelo) * lado) * Math.PI) / 180;
  const ex = ox + Math.sin(a1) * L1, ey = oy + Math.cos(a1) * L1;
  const hx = ex + Math.sin(a2) * L2, hy = ey + Math.cos(a2) * L2;
  return { ex, ey, hx, hy };
};

export const Pessoa: React.FC<PessoaProps> = ({ pele, peleSombra, cabelo, camisa, camisaSombra, estilo, humor, pisca = 1, olhar = [0, 0],
  bracoE = { ombro: 8, cotovelo: 4 }, bracoD = { ombro: 8, cotovelo: 4 }, boca = 0, detalhe, inclina = 0 }) => {
  const E = membro(196, 560, bracoE, -1), D = membro(404, 560, bracoD, 1);
  const preoc = Math.max(0, -humor), sorri = Math.max(0, humor);
  const brow = (x: number, lado: 1 | -1) => {
    const yIn = 236 - preoc * 16 - sorri * 4, yOut = 240 + preoc * 6 - sorri * 4;
    return <path d={`M${x + 34 * lado} ${yOut} Q${x} ${yIn - 14} ${x - 30 * lado} ${yIn}`} fill="none" stroke={cabelo} strokeWidth={estilo === "homem" ? 15 : 11} strokeLinecap="round" />;
  };
  const bocaY = 392, larg = 46 + 12 * sorri;
  const curva = 26 * sorri - 18 * preoc;
  const braco = (B: typeof E, ox: number) => <g>
    <path d={`M${ox} 560 L${B.ex} ${B.ey} L${B.hx} ${B.hy}`} fill="none" stroke={camisaSombra} strokeWidth="76" strokeLinecap="round" strokeLinejoin="round" />
    <path d={`M${ox} 560 L${B.ex} ${B.ey}`} fill="none" stroke={camisa} strokeWidth="66" strokeLinecap="round" />
    <path d={`M${B.ex} ${B.ey} L${B.hx} ${B.hy}`} fill="none" stroke={pele} strokeWidth="50" strokeLinecap="round" />
    <circle cx={B.hx} cy={B.hy} r="36" fill={pele} stroke={peleSombra} strokeWidth="4" />
  </g>;
  return (
    <svg width={600} height={900} viewBox="0 0 600 900" style={{ overflow: "visible", display: "block" }}>
      <g transform={`rotate(${inclina} 300 560)`}>
        {/* cabelo de trás */}
        {estilo === "maria"
          ? <path d="M150 300 C130 120 230 70 300 70 C380 70 476 120 452 300 C462 470 470 620 438 720 L162 720 C130 620 140 470 150 300 Z" fill={cabelo} />
          : estilo === "coque" ? <><circle cx="300" cy="96" r="70" fill={cabelo} /><path d="M160 300 C150 150 230 110 300 110 C380 110 452 150 440 300 Z" fill={cabelo} /></> : null}
      </g>
      {/* corpo */}
      <path d={estilo === "homem" ? "M96 900 C96 640 170 566 300 552 C430 566 504 640 504 900 Z" : "M120 900 C120 650 180 560 300 548 C420 560 480 650 480 900 Z"} fill={camisa} />
      <path d="M262 520 L338 520 L338 572 Q300 600 262 572 Z" fill={peleSombra} />
      <path d="M262 548 Q300 590 338 548" fill="none" stroke={camisaSombra} strokeWidth="8" />
      {detalhe}
      <g transform={`rotate(${inclina} 300 560)`}>
        <rect x="262" y="440" width="76" height="110" rx="30" fill={peleSombra} />
        <ellipse cx="160" cy="320" rx="26" ry="40" fill={pele} stroke={peleSombra} strokeWidth="4" />
        <ellipse cx="440" cy="320" rx="26" ry="40" fill={pele} stroke={peleSombra} strokeWidth="4" />
        <path d="M156 286 C156 150 230 120 300 120 C370 120 444 150 444 286 C444 410 380 480 300 480 C220 480 156 410 156 286 Z" fill={pele} />
        {/* cabelo da frente */}
        {estilo === "maria"
          ? <>
            <path d="M150 300 C140 150 230 96 310 100 C400 104 460 170 450 300 C438 220 404 182 360 168 C300 200 220 214 172 210 C160 236 152 268 150 300 Z" fill={cabelo} />
            <path d="M172 212 C230 180 290 160 360 168" fill="none" stroke="#3A2A24" strokeWidth="6" opacity="0.6" />
            <path d="M150 300 C146 420 160 520 176 640 L196 640 C178 520 172 420 176 330 Z" fill={cabelo} />
            <path d="M450 300 C456 420 446 520 428 640 L408 640 C424 520 430 420 424 330 Z" fill={cabelo} />
            <circle cx="164" cy="372" r="7" fill="#E9C46A" /><circle cx="436" cy="372" r="7" fill="#E9C46A" />
          </>
          : estilo === "coque" ? <path d="M156 290 C150 160 230 128 300 128 C370 128 450 160 444 290 C420 210 380 186 300 186 C220 186 180 210 156 290 Z" fill={cabelo} />
          : <>
            {/* cabelo curto preto, um pouco ondulado, entradas leves */}
            <path d="M158 270 C146 150 220 96 304 98 C392 100 458 150 444 272 C440 226 428 204 412 196 C402 182 384 176 360 178 C330 180 300 170 270 174 C236 178 214 186 196 200 C178 214 166 238 158 270 Z" fill={cabelo} />
            <path d="M206 150 C250 124 300 120 346 130 M220 172 C262 150 316 148 366 160" fill="none" stroke="#2E241E" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
            {/* barba por fazer e bigode discreto */}
            <path d="M210 380 C214 450 256 482 300 484 C344 482 386 450 390 380 C368 430 340 446 300 446 C260 446 232 430 210 380 Z" fill="#2A1C14" opacity="0.18" />
            <path d="M252 372 C272 360 290 364 300 368 C310 364 328 360 348 372 C330 376 312 376 300 374 C288 376 270 376 252 372 Z" fill="#2A1C14" opacity="0.55" />
            <path d="M206 326 Q222 352 238 360 M394 326 Q378 352 362 360" fill="none" stroke={peleSombra} strokeWidth="5" opacity="0.6" />
          </>}
        <ellipse cx="218" cy="350" rx="30" ry="17" fill="#E8828A" opacity={estilo === "homem" ? 0.12 : 0.35} />
        <ellipse cx="382" cy="350" rx="30" ry="17" fill="#E8828A" opacity={estilo === "homem" ? 0.12 : 0.35} />
        {brow(238, -1)}{brow(362, 1)}
        {[238, 362].map((x) => <g key={x} transform={`translate(${x + olhar[0]} ${294 + olhar[1]}) scale(1 ${pisca})`}>
          <ellipse rx="17" ry="22" fill="#24180F" /><circle cx="-5" cy="-8" r="6" fill="#fff" /></g>)}
        <path d="M300 318 Q288 352 306 356" fill="none" stroke={peleSombra} strokeWidth="7" strokeLinecap="round" />
        {boca > 0.05
          ? <path d={`M${300 - larg} ${bocaY} Q300 ${bocaY + curva + 20 * boca + 8} ${300 + larg} ${bocaY} Q300 ${bocaY + 8} ${300 - larg} ${bocaY} Z`} fill="#8E3B3B" stroke="#8E3B3B" strokeWidth="6" strokeLinejoin="round" />
          : <path d={`M${300 - larg} ${bocaY} Q300 ${bocaY + curva} ${300 + larg} ${bocaY}`} fill="none" stroke="#9C4545" strokeWidth="10" strokeLinecap="round" />}
      </g>
      {braco(E, 196)}{braco(D, 404)}
    </svg>
  );
};

// Estampa da camiseta da Maria Alice (BASA Acredita) + colar com "A".
export const EstampaBasa: React.FC = () => (
  <g>
    <path d="M276 566 Q300 610 324 566" fill="none" stroke="#E9C46A" strokeWidth="3" />
    <text x="300" y="636" textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize="34" fill="#E9C46A">A</text>
    <text x="300" y="740" textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize="56" fill="#FFFFFF" letterSpacing="-1">BASA</text>
    <text x="300" y="790" textAnchor="middle" fontFamily="Caveat" fontWeight={700} fontSize="58" fill="#7DBA3E">acredita</text>
    <path d="M378 700 C410 690 420 660 404 640 C380 650 370 676 378 700 Z" fill="#7DBA3E" />
  </g>
);
// Avental da empreendedora.
export const Avental: React.FC = () => (
  <g>
    <path d="M200 640 L400 640 L420 900 L180 900 Z" fill="#F4E7D4" stroke="#D9C3A2" strokeWidth="5" />
    <path d="M230 640 C240 600 260 576 276 570 M370 640 C360 600 340 576 324 570" fill="none" stroke="#D9C3A2" strokeWidth="9" />
    <rect x="250" y="720" width="100" height="70" rx="12" fill="none" stroke="#D9C3A2" strokeWidth="5" />
  </g>
);

// Camisa amarela com gola V e detalhes pretos (inspirada na foto, sem logotipos).
export const CamisaProfessor: React.FC = () => (
  <g>
    <path d="M246 552 L300 640 L354 552" fill="none" stroke="#1B1B1B" strokeWidth="22" strokeLinejoin="round" />
    <path d="M160 600 C176 640 186 700 188 760" fill="none" stroke="#1B1B1B" strokeWidth="9" opacity="0.85" />
    <path d="M440 600 C424 640 414 700 412 760" fill="none" stroke="#1B1B1B" strokeWidth="9" opacity="0.85" />
    <path d="M462 680 L470 900" stroke="#2BA6A0" strokeWidth="12" opacity="0.8" />
  </g>
);
