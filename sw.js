importScripts("assets/chapter1-art.js");

const PREFIX = "sidari-quest-";
const CACHE = PREFIX + "playtest-v10";
const SHELL = [
  "./", "index.html", "manifest.json", "chapter1.js", "progress.js",
  "icon-180.png", "icon-192.png", "icon-512.png", "assets/chapter1-art.js"
];
const art = [...new Set(["title_bg", "tagline", "logo", ...GAME_ART])]
  .map(name => "assets/" + name + ".webp");

// Recorded Greek, listed in assets/audio/manifest.json (may not exist yet).
const recordingPaths = async cache => {
  try {
    const manifest = new URL("assets/audio/manifest.json", self.registration.scope);
    const response = await fetch(manifest, {cache: "reload"});
    if (!response.ok) return [];
    await cache.put(manifest, response.clone());
    const {lines = {}} = await response.json();
    return [...new Set(Object.values(lines).map(line => "assets/audio/" + line.file))];
  } catch { return []; }
};

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(async cache => {
    await cache.addAll([...SHELL, ...art].map(path => new Request(
      new URL(path, self.registration.scope), {cache: "reload"}
    )));
    // Recordings are a bonus: one failing shouldn't stop the game installing.
    await Promise.all((await recordingPaths(cache)).map(path => cache.add(new URL(path, self.registration.scope)).catch(() => {})));
  }).then(() => self.skipWaiting()));
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
    const saved = await cache.match(request);
    if (saved) return saved;
    const fresh = await fetch(request);
    // New art or recordings get saved the first time they're used, so they work offline after.
    if (fresh.ok && /\.(webp|png|mp3)$/.test(url.pathname)) cache.put(request, fresh.clone());
    return fresh;
  }));
});
