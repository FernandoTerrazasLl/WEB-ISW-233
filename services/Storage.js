// TODO
// Where you should add this storage????
// which Design pattern? singleton

const DB_NAME = "web-isw-233";
const DB_VERSION = 1;
const STORE_NAME = "kv";

let dbPromise;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };
    req.onsuccess = (event) => resolve(event.target.result);
    req.onerror = (event) => reject(event.target.error);
  });
  return dbPromise;
}

async function saveCart(cart) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put({ key: "cart", value: cart });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function loadCart() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get("cart");
    req.onsuccess = () => {
      if (req.result && Array.isArray(req.result.value)) {
        resolve(req.result.value);
      } else {
        resolve([]);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export { saveCart, loadCart };
