import { continueRender, delayRender, registerRoot, staticFile } from "remotion";
import { Root } from "./Root";

const fonts: [string, string, string][] = [
  ["Montserrat", "fonts/montserrat-latin-900-normal.woff2", "900"],
  ["Montserrat", "fonts/montserrat-latin-800-normal.woff2", "800"],
  ["Lato", "fonts/lato-latin-900-normal.woff2", "900"],
  ["Lato", "fonts/lato-latin-700-normal.woff2", "700"],
];
const h = delayRender("fonts");
Promise.all(fonts.map(([fam, file, w]) => new FontFace(fam, `url(${staticFile(file)}) format("woff2")`, { weight: w }).load().then((f) => document.fonts.add(f))))
  .then(() => continueRender(h));
registerRoot(Root);
