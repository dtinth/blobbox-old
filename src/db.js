/* global Dexie */
const db = new Dexie("blobbox");
db.version(1).stores({ blobs: "++id" });
export default db;

const changeListeners = new Set();

export function onDbChanged(f) {
  const listener = () => f();
  changeListeners.add(listener);
  return () => {
    changeListeners.delete(listener);
  };
}

export function notifyDbChanges() {
  for (const listener of changeListeners) listener();
}
