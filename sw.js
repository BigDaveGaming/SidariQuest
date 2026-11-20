importScripts("assets/chapter1-art.js");

const PREFIX = "sidari-quest-";
const CACHE = PREFIX + "playtest-v9";
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

// The game's code and pages come from the network first, so a new version shows up
// straight away when you're online. The saved copy is only used offline.
// Art rarely changes, so it comes from the saved copy first.
const isShell = url => {
  const path = url.pathname.slice(new URL(self.registration.scope).pathname.length);
  return path === "" || /\.(html|js|json)$/.test(path);
};

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || !request.url.startsWith(self.registration.scope)) return;
  const url = new URL(request.url);
  event.respondWith(caches.open(CACHE).then(async cache => {
    const home = new URL(self.registration.scope);
    const isHome = request.mode === "navigate" &&
      [home.pathname, home.pathname + "index.html"].includes(url.pathname);
    if (isHome || isShell(url)) {
      try {
        const fresh = await fetch(request, {cache: "no-cache"});
        if (fresh.ok) cache.put(isHome ? home : request, fresh.clone());
        return fresh;
      } catch (error) {
        return (await cache.match(isHome ? home : request)) || Response.error();
      }
    }
    return (await cache.match(request)) || fetch(request);
  }));
});
