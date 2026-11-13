import { continueRender, delayRender, registerRoot, staticFile } from "remotion";
import { Root } from "./Root";

// Fonts load from local files (no network at render time); rendering waits for them.
const fonts: [string, string, string][] = [
  ["Montserrat", "fonts/montserrat-latin-900-normal.woff2", "900"],
  ["Montserrat", "fonts/montserrat-latin-800-normal.woff2", "800"],
  ["Lato", "fonts/lato-latin-400-normal.woff2", "400"],
  ["Lato", "fonts/lato-latin-700-normal.woff2", "700"],
  ["JetBrains Mono", "fonts/jetbrains-mono-latin-500-normal.woff2", "500"],
  ["JetBrains Mono", "fonts/jetbrains-mono-latin-700-normal.woff2", "700"],
];
const handle = delayRender("fonts");
Promise.all(fonts.map(([fam, file, w]) =>
  new FontFace(fam, `url(${staticFile(file)}) format("woff2")`, { weight: w }).load().then((f) => document.fonts.add(f)),
)).then(() => continueRender(handle));

registerRoot(Root);
