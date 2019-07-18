"use strict";

import STATION_MANAGER from "./StationManager.js";
import DefaultStationProvider from "./station_provider/DefaultStationProvider.js";
import {STATIONS} from "./stations/stations.js";
import LOGGER_FACTORY from "./logger/LoggerFactory.js";

let CONTEXT = self;
const LOGGER = LOGGER_FACTORY.getLogger();

LOGGER.info("Start application");
registerServiceworker();

//=================================================
const stationProvider = new DefaultStationProvider(STATIONS);
STATION_MANAGER.addStationProvider(stationProvider);

function registerServiceworker() {
    if ('serviceWorker' in CONTEXT.navigator) {
        CONTEXT.navigator.serviceWorker
            .register('./service-worker.js', {scope: '.'})
            .then((registration) => {
                LOGGER.info('ServiceWorker registration successful with scope: ', registration.scope);
            }, (error) => {
                LOGGER.info('ServiceWorker registration failed: ', error);
            });
    }
}

const OFFLINE_PAGE = "./offline.html";
// Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v1';
// Add list of files to cache here.
const FILES_TO_CACHE = [
    OFFLINE_PAGE
];

CONTEXT = CONTEXT.navigator.serviceWorker;
CONTEXT.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install');
    // Precache static resources here.
    event.waitUntil(
        CONTEXT.caches.open(CACHE_NAME)
            .then((cache) => {
                    console.log('[ServiceWorker] Pre-caching offline page');
                    return cache.addAll(FILES_TO_CACHE);
                }
            ));
    return CONTEXT.skipWaiting();
});

CONTEXT.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');
    // Remove previous cached data from disk.
    return CONTEXT.clients.claim();
});

CONTEXT.addEventListener('fetch', (event) => {
    console.log('[ServiceWorker] Fetch', event.request.url);
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