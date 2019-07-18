// https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/

"use strict";
import LOGGER from "./js/logger/SimpleLogger.js";

const CONTEXT = self;

if ('serviceWorker' in CONTEXT.navigator) {
    CONTEXT.navigator.serviceWorker
        .register('./service-worker.js', {scope: '.'})
        .then((registration) => {
            LOGGER.info('ServiceWorker registration successful with scope: ', registration.scope);
        }, (error) => {
            LOGGER.error('ServiceWorker registration failed: ', error);
        });
}

const OFFLINE_PAGE = "./offline.html";
// Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v1';
// Add list of files to cache here.
const FILES_TO_CACHE = [
    OFFLINE_PAGE
];

CONTEXT.addEventListener('install', (event) => {
    LOGGER.info('[ServiceWorker] Install');
    // Precache static resources here.
    event.waitUntil(
        CONTEXT.caches.open(CACHE_NAME)
            .then((cache) => {
                    LOGGER.info('[ServiceWorker] Pre-caching offline page');
                    return cache.addAll(FILES_TO_CACHE);
                }
            ));
    return CONTEXT.skipWaiting();
});

CONTEXT.addEventListener('activate', (event) => {
    LOGGER.info('[ServiceWorker] Activate');
    // Remove previous cached data from disk.
    return CONTEXT.clients.claim();
});

CONTEXT.addEventListener('fetch', (event) => {
    LOGGER.info('[ServiceWorker] Fetch', event.request.url);
    // Add fetch event handler here.
    if (event.request.mode !== 'navigate') {
        // Not a page navigation, bail.
        return;
    }
    event.respondWith(
        fetch(event.request)
            .catch(() => {
                return CONTEXT.caches.open(CACHE_NAME)
                    .then((cache) => {
                        return cache.match(OFFLINE_PAGE);
                    });
            })
    );
});