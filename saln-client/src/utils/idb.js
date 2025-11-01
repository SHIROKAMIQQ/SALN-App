const DB_NAME = "salnIDB"
const DB_VERSION = 1;
const STORE_NAME = "salnForms"

export function openIDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {keyPath: "salnID"});
        store.createIndex("salnID", "salnID", {unique: true});
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

export async function saveFormToIDB(formData) {
  const db = await openIDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(formData);
    request.onsuccess = () => resolve(formData);
    request.onerror = (event) => reject(event.target.error);
  });
}

export async function getAllFormsFromIDB() {
  const db = await openIDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getFormFromIDB(salnID) {
  const db = await openIDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(salnID);
    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

export async function deleteFormFromIDB(salnID) {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("salnForms", "readwrite");
    const store = tx.objectStore("salnForms");
    store.delete(salnID);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}