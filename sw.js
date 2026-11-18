importScripts("assets/chapter1-art.js");

const PREFIX = "sidari-quest-";
const CACHE = PREFIX + "playtest-v3";
const SHELL = [
  "./", "index.html", "manifest.json", "chapter1.js", "progress.js",
  "icon-180.png", "icon-192.png", "icon-512.png", "assets/chapter1-art.js"
];
const art = [...new Set(["title_bg", "tagline", "logo", ...GAME_ART])]
  .map(name => "assets/" + name + ".webp");

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache =>
    cache.addAll([...SHELL, ...art].map(path => new Request(
      new URL(path, self.registration.scope), {cache: "reload"}
    )))
  ).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys
    .filter(key => key.startsWith(PREFIX) && key !== CACHE)
    .map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || !request.url.startsWith(self.registration.scope)) return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    if (request.mode === "navigate") {
      const url = new URL(request.url);
      const home = new URL(self.registration.scope);
      if ([home.pathname, home.pathname + "index.html"].includes(url.pathname)) {
        return (await cache.match(home)) || fetch(request);
      }
    }
    return (await cache.match(request)) || fetch(request);
  }));
});
