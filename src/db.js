/* global Dexie */
const db = new Dexie("blobbox");
db.version(1).stores({ blobs: "++id" });
export default db;
