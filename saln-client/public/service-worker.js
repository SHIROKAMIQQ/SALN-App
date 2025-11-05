const CACHE_NAME = "saln-cache-v1";
const OFFLINE_URLS = [
  "/", 
  "/dashboard",
  "/login",
  "/registration",
  "/saln-form",
  "/uploadJSON"
];

self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of OFFLINE_URLS) {
        try {
          await cache.add(url);
          console.log("[SW] Cached:", url);
        } catch (err) {
          console.warn("[SW] Failed to cache:", url, err);
        }
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Don’t try to handle non-GET or chrome-extension requests
  if (request.method !== "GET" || request.url.startsWith("chrome-extension")) return;

  // ⚡ Runtime caching for assets (JS, CSS, PDF)
  if (request.url.includes("/assets/")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        try {
          // Try network first, update cache
          const response = await fetch(request);
          cache.put(request, response.clone());
          return response;
        } catch {
          // Fallback to cached version if offline
          const cached = await cache.match(request);
          if (cached) return cached;
          throw new Error("Asset not available offline");
        }
      })
    );
    return;
  }

  // Default: cache-first for pages
  event.respondWith(
    caches.match(request).then((response) => {
      return response || fetch(request);
    })
  );
});
