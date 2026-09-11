// Fynd — jednoduchý service worker pre F1 (základné offline cachovanie app shellu).
// next-pwa/Workbox môže neskôr nahradiť toto ručné riešenie plnohodnotnejšou stratégiou
// (runtime caching pre API, background sync a pod.) — pozri docs/tech-stack.md.

const CACHE_NAME = "fynd-shell-v1";
const APP_SHELL = ["/", "/manifest.json", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

// Network-first pre navigácie (vždy najnovší obsah, keď je pripojenie), s fallbackom na cache offline.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/").then((res) => res || caches.match(request)))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});

// ============================================================
// Web Push — príjem push udalosti a klik na notifikáciu
// (docs/push-notifications.md — payload posiela supabase/functions/send-push)
// ============================================================

self.addEventListener("push", (event) => {
  let data = { title: "Fynd", body: "Máš novú notifikáciu.", url: "/dashboard/notifications" };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {
    // fallback na default, ak payload nie je JSON
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-32.png",
      data: { url: data.url || "/dashboard/notifications" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/dashboard/notifications";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if (client.url.includes(targetUrl) && "focus" in client) return client.focus();
      }
      for (const client of clientsArr) {
        if ("focus" in client && "navigate" in client) {
          client.focus();
          return client.navigate(targetUrl);
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
