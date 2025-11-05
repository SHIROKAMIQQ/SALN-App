const OFFLINE_URLS = [
  "/", 
  "/dashboard",
  "/login",
  "/registration",
  "/saln-form",
  "/uploadJSON"
];

const CACHE_NAME = "saln-cache-v1";
const DB_NAME = "salnIDB";
const STORE_NAME = "pendingRequests";

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

// ✅ Activate: cleanup old caches
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ✅ Intercept API requests
self.addEventListener("fetch", (event) => {
  // Only handle GET requests for caching
  if (event.request.method !== "GET") {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request)
          .then((response) => {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
            return response;
          })
          .catch(() => caches.match("/"))
      );
    })
  );
});

// ✅ Background sync handler
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-requests") {
    console.log("[SW] Sync triggered: sync-requests");
    event.waitUntil(syncPendingRequests());
  }
});

// 🔁 Helper: replay queued requests from IndexedDB
async function syncPendingRequests() {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open("requestQueue", 1);
    open.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("requests"))
        db.createObjectStore("requests", { keyPath: "id", autoIncrement: true });
    };

    open.onsuccess = (e) => {
      const db = e.target.result;
      const tx = db.transaction("requests", "readwrite");
      const store = tx.objectStore("requests");

      store.getAll().onsuccess = async (evt) => {
        const allRequests = evt.target.result || [];
        for (const req of allRequests) {
          try {
            await fetch(req.url, req.options);
            console.log("[SW] Synced request:", req.url);
            store.delete(req.id);
          } catch (err) {
            console.warn("[SW] Sync failed for:", req.url, err);
          }
        }
        resolve();
      };
    };

    open.onerror = reject;
  });
}