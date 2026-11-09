/* Service worker: deixa o portal utilizável em conexões lentas ou instáveis.
   Páginas e dados: rede primeiro, cache como reserva. Arquivos estáticos: cache primeiro.
   PDFs são guardados depois de abertos uma vez. */
const VERSION = "v2026-11-09a";
const SHELL = `shell-${VERSION}`, DATA = `data-${VERSION}`, DOCS = "docs-v1";
const BASE = new URL(self.registration.scope).pathname;
const PRECACHE = ["", "index.html", "projetos.html", "projeto.html", "deputado.html",
  "assets/css/site.css", "assets/js/site.js", "assets/img/favicon.svg", "assets/img/retrato-480.webp", "assets/img/retrato-800.webp",
  "assets/fonts/inter-latin-400-normal.woff2", "assets/fonts/inter-latin-600-normal.woff2", "assets/fonts/inter-latin-700-normal.woff2",
  "assets/fonts/bricolage-grotesque-latin-700-normal.woff2", "assets/fonts/bricolage-grotesque-latin-800-normal.woff2",
  "data/projetos.json", "data/deputado.json", "data/config.json"].map((p) => BASE + p);

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => ![SHELL, DATA, DOCS].includes(k)).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || !url.pathname.startsWith(BASE)) return;
  if (url.pathname.endsWith("admin.html") || url.pathname.includes("/assets/js/admin") || url.pathname.includes("/assets/vendor/")) return;

  const isData = url.pathname.includes("/data/") || req.mode === "navigate" || url.pathname.endsWith(".html");
  const isDoc = url.pathname.includes("/documentos/");

  if (isData) {
    e.respondWith(fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(isData && url.pathname.includes("/data/") ? DATA : SHELL).then((c) => c.put(req, copy)); }
      return res;
    }).catch(async () => (await caches.match(req)) || (req.mode === "navigate" ? caches.match(BASE + "index.html") : Response.error())));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
    if (res.ok && (isDoc || url.pathname.includes("/assets/"))) { const copy = res.clone(); caches.open(isDoc ? DOCS : SHELL).then((c) => c.put(req, copy)); }
    return res;
  })));
});
