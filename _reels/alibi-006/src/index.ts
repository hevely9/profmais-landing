import { continueRender, delayRender, registerRoot, staticFile } from "remotion";
import { Root } from "./Root";

const fonts: [string, string, string, string][] = [
  ["Playfair", "fonts/playfair-display-latin-900-normal.woff2", "900", "normal"],
  ["Playfair", "fonts/playfair-display-latin-700-italic.woff2", "700", "italic"],
  ["Elite", "fonts/special-elite-latin-400-normal.woff2", "400", "normal"],
  ["Inter", "fonts/inter-latin-600-normal.woff2", "600", "normal"],
  ["Inter", "fonts/inter-latin-800-normal.woff2", "800", "normal"],
  ["Mont", "fonts/montserrat-latin-800-normal.woff2", "800", "normal"],
  ["Mont", "fonts/montserrat-latin-300-normal.woff2", "300", "normal"],
  ["Courier", "fonts/courier-prime-latin-400-normal.woff2", "400", "normal"],
  ["Courier", "fonts/courier-prime-latin-700-normal.woff2", "700", "normal"],
];
const h = delayRender("fonts");
Promise.all(fonts.map(([fam, file, w, st]) => new FontFace(fam, `url(${staticFile(file)}) format("woff2")`, { weight: w, style: st }).load().then((f) => document.fonts.add(f))))
  .then(() => continueRender(h));
registerRoot(Root);
