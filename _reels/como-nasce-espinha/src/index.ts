import { continueRender, delayRender, registerRoot, staticFile } from "remotion";
import { Root } from "./Root";

const fonts: [string, string, string][] = [
  ["Inter", "fonts/inter-latin-800-normal.woff2", "800"],
  ["Inter", "fonts/inter-latin-600-normal.woff2", "600"],
  ["Caveat", "fonts/caveat-latin-700-normal.woff2", "700"],
  ["JetBrains Mono", "fonts/jetbrains-mono-latin-500-normal.woff2", "500"],
  ["JetBrains Mono", "fonts/jetbrains-mono-latin-700-normal.woff2", "700"],
  ["Lato", "fonts/lato-latin-400-normal.woff2", "400"],
  ["Titan One", "fonts/titan-one-latin-400-normal.woff2", "400"],
];
const h = delayRender("fonts");
Promise.all(fonts.map(([fam, file, w]) => new FontFace(fam, `url(${staticFile(file)}) format("woff2")`, { weight: w }).load().then((f) => document.fonts.add(f))))
  .then(() => continueRender(h));
registerRoot(Root);
