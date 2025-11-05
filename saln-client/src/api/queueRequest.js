// src/queueRequest.js

export async function queueRequest(url, options) {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open("requestQueue", 1);

    open.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("requests")) {
        db.createObjectStore("requests", { keyPath: "id", autoIncrement: true });
      }
    };

    open.onsuccess = async (event) => {
      const db = event.target.result;
      const tx = db.transaction("requests", "readwrite");
      tx.objectStore("requests").add({
        url,
        options,
        timestamp: Date.now(),
      });
      console.log("[API] Queued request:", url);

      // Register background sync
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        try {
          const reg = await navigator.serviceWorker.ready;
          await reg.sync.register("sync-requests");
          console.log("[API] Background sync registered");
        } catch (err) {
          console.warn("[API] Failed to register sync:", err);
        }
      }

      resolve();
    };

    open.onerror = reject;
  });
}
