/* global self, caches, fetch */
// https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/

'use strict';

const OFFLINE_PAGE = "./offline.html";
// Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v1';
// Add list of files to cache here.
const FILES_TO_CACHE = [
    OFFLINE_PAGE
];

self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install');
    // Precache static resources here.
    event.waitUntil(
            caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[ServiceWorker] Pre-caching offline page');
                return cache.addAll(FILES_TO_CACHE);
            }
            ));
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');
    // Remove previous cached data from disk.
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    console.log('[ServiceWorker] Fetch', event.request.url);
    // Add fetch event handler here.
    if (event.request.mode !== 'navigate') {
        // Not a page navigation, bail.
        return;
    }
    event.respondWith(
            fetch(event.request)
            .catch(() => {
                return caches.open(CACHE_NAME)
                        .then((cache) => {
                            return cache.match(OFFLINE_PAGE);
                        });
            })
            );
});