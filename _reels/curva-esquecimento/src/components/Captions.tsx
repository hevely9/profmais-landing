import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { measureText } from "@remotion/layout-utils";
import { SAFE, TL, clamp, theme } from "../theme";

// Karaokê: página inteira na tela, cada palavra acende no quadro em que é falada (já adiantada 2q).
// Lato 900, caixa alta, off-white; palavra-chave acende em laranja. Centro a ~65% da altura.
type Tok = { mostra: string; chave: boolean; t0: number };
type Page = { frase: number; de: number; ate: number; toks: Tok[] };
const MAXW = SAFE.x1 - SAFE.x0, Y = 1248, MAX_FS = 78;

export const Captions: React.FC = () => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const pags = TL.paginas as Page[];
  const idx = pags.findIndex((p) => f >= p.de && f < p.ate);
  if (idx < 0) return null;
  const pg = pags[idx], next = pags[idx + 1];
  const emenda = !!next && next.de <= pg.ate;
  const prevEmenda = idx > 0 && pags[idx - 1].ate >= pg.de;
  const txt = pg.toks.map((t) => t.mostra).join(" ");
  const w100 = measureText({ text: txt, fontFamily: theme.fonts.body, fontWeight: "900", fontSize: 100, letterSpacing: "0.01em" }).width;
  const fs = Math.min(MAX_FS, Math.floor((MAXW / w100) * 100 * 0.97));
  const pin = idx === 0 ? 1 : spring({ frame: f - pg.de, fps, config: theme.spring.snappy });
  const out = emenda ? 0 : interpolate(f, [pg.ate - 3, pg.ate], [0, 1], { ...clamp, easing: theme.ease.in });
  return (
    <div style={{ position: "absolute", left: SAFE.x0, width: MAXW, top: Y - fs * 0.6, display: "flex", justifyContent: "center",
      gap: Math.round(fs * 0.24), fontFamily: theme.fonts.body, fontWeight: 900, fontSize: fs, letterSpacing: "0.01em", lineHeight: 1.1,
      whiteSpace: "nowrap", opacity: (prevEmenda ? 1 : Math.min(1, pin * 1.5)) * (1 - out),
      transform: `translateY(${(1 - pin) * 22 - out * 10}px) scale(${0.96 + 0.04 * pin})` }}>
      {pg.toks.map((t, i) => {
        const q = Math.max(0, Math.round(t.t0 * fps) - 2);
        const lit = q === 0 ? 1 : spring({ frame: f - q, fps, config: theme.spring.snappy });
        const on = f >= q;
        return (
          <span key={i} style={{ display: "inline-block",
            color: on && t.chave ? theme.colors.hero : theme.colors.text,
            opacity: interpolate(lit, [0, 1], [0.32, 1]),
            transform: `scale(${1 + 0.08 * Math.sin(Math.min(1, lit) * Math.PI) * (t.chave ? 2 : 1)})`,
            textShadow: "0 4px 18px rgba(0,0,0,0.55), 0 0 2px rgba(0,0,0,0.6)" }}>{t.mostra}</span>
        );
      })}
    </div>
  );
};
