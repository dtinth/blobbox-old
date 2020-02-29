/* eslint-env serviceworker */
/* global workbox, Dexie */

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js",
  "https://unpkg.com/dexie@2.0.4/dist/dexie.js"
);

const {
  routing: { registerRoute, setDefaultHandler },
  strategies: { NetworkFirst }
} = workbox;

const db = new Dexie("blobbox");
db.version(1).stores({ blobs: "++id" });

registerRoute(
  new RegExp("/share"),
  async ({ event, url }) => {
    event.respondWith(
      (async () => {
        const formData = await event.request.formData();
        await db.blobs.add({
          createdAt: new Date().toJSON(),
          files: formData.getAll("file"),
          url: formData.get("url") || null,
          text: formData.get("text") || null,
          title: formData.get("title") || null
        });
        return Response.redirect("/", 303);
      })()
    );
  },
  "POST"
);

setDefaultHandler(new NetworkFirst());
