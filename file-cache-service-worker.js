// source - https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/prefetch/service-worker.js

"use strict";

const CONTEXT = self;
const CONTEXT_NAME = Object.prototype.toString.call(CONTEXT).slice(8, -1);
const CACHE_ROOT = "./cache";
let CURRENT_CACHE_VERSION = null;

if (CONTEXT_NAME.toLowerCase() === "Window".toLowerCase()) {
    registerServiceWorker();

    let checkContextCount = 0;
    const checkContextTimer = setInterval(() => {
        if (checkContextCount >= 100) {
            clearInterval(checkContextTimer);
            console.log("------ 3");
            throw new Error("Controller waiting timeout");
        } else {
            console.log("------ 1");
            checkContextCount++;
        }
        if (CONTEXT.navigator.serviceWorker.controller) {
            console.log("------ 2");
            clearInterval(checkContextTimer);
            console.log("Controller initialized successfully");
            CONTEXT.navigator.serviceWorker.controller.postMessage({'cache-version': CACHE_VERSION});
        }
    }, 500);
}

if (CONTEXT_NAME.toLowerCase() === "ServiceWorkerGlobalScope".toLowerCase()) {
    importScripts(CACHE_ROOT + '/cache-list.js');
    registerListeners();
}

function changeCacheVersion(newCacheVersion) {
    if (newCacheVersion) {
        console.info("Cache version changed, from (" + CURRENT_CACHE_VERSION + ") to (" + newCacheVersion + ")");
        CURRENT_CACHE_VERSION = newCacheVersion;
    } else {
        console.warn("(newCacheVersion) variable is undefined");
    }
}

function registerServiceWorker() {
    if ('serviceWorker' in CONTEXT.navigator) {
        CONTEXT.navigator.serviceWorker
            .register('./file-cache-service-worker.js', {scope: '.'})
            .then((registration) => {
                console.info('ServiceWorker registration successful with scope: ' + registration.scope);
            })
            .then(() => {
                CONTEXT.navigator.serviceWorker.ready.then((worker) => {
                    return worker.sync.register('syncdata');
                });
            })
            .catch((error) => {
                console.info('ServiceWorker registration failed: ' + error);
            });
    }
}

function registerListeners() {
    CONTEXT.addEventListener('install', (event) => {
        console.info("Service worker: installing");
        const now = Date.now();

        for (const propertyName in CACHE_LISTS) {
            const CACHE_LIST = CACHE_LISTS[propertyName];
            const CACHE_NAME = CACHE_LIST["name"] + "_v" + CURRENT_CACHE_VERSION;
            const urlsToPrefetch = CACHE_LIST["files"];
            event.waitUntil(deleteOldCaches());
            event.waitUntil(
                CONTEXT.caches.open(CACHE_NAME).then((cache) => {
                    const cachePromises = urlsToPrefetch.map((urlToPrefetch) => {
                        const url = new URL(urlToPrefetch, location.href);
                        url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;
                        const request = new Request(url.toString(), {mode: 'no-cors'});
                        return fetch(request).then((response) => {
                            if (response.status >= 400) {
                                throw new Error('request for ' + urlToPrefetch + ' failed with status ' + response.statusText);
                            }
                            return cache.put(urlToPrefetch, response);
                        }).catch((error) => {
                            console.error('Not caching ' + urlToPrefetch + ' due to ' + error);
                        });
                    });
                    return Promise.all(cachePromises).then(() => {
                        console.log('Pre-fetching complete.');
                    });
                }).catch((error) => {
                    console.error('Pre-fetching failed:', error);
                })
            );
        }
        event.waitUntil(CONTEXT.skipWaiting());
    });
    CONTEXT.addEventListener('activate', (event) => {
        console.info("Service worker: activating");

        event.waitUntil(deleteOldCaches());
        event.waitUntil(CONTEXT.skipWaiting());
        event.waitUntil(CONTEXT.clients.claim());
    });

    CONTEXT.addEventListener('fetch', (event) => {
        console.info("Service worker: request to server");

        event.waitUntil(CONTEXT.skipWaiting());
        // console.log('Handling fetch event for', event.request.url);
        event.respondWith(
            // caches.match() will look for a cache entry in all of the caches available to the service worker.
            // It's an alternative to first opening a specific named cache and then matching on that.
            CONTEXT.caches.match(event.request).then((response) => {
                if (response) {
                    console.log('Found response in cache:', response);
                    return response;
                }
                // console.log('No response found in cache. About to fetch from network...');
                // event.request will always have the proper mode set ('cors, 'no-cors', etc.) so we don't
                // have to hardcode 'no-cors' like we do when fetch()ing in the install handler.
                return fetch(event.request).then((response) => {
                    console.log('Response from network is:', response);
                    return response;
                }).catch((error) => {
                    // This catch() will handle exceptions thrown from the fetch() operation.
                    // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
                    // It will return a normal response object that has the appropriate error code set.
                    console.error('Fetching failed:', error);
                    throw error;
                });
            })
        );
    });
    CONTEXT.addEventListener('message', (event) => {
        console.info("Service worker: processing message");

        console.log("Got reply from service worker: " + JSON.stringify(event.data));

        if (event.data && event.data["cache-version"]) {
            changeCacheVersion(event.data["cache-version"].toString());
        }
    });

    function deleteOldCaches() {
        const expectedCacheNames = [];
        for (const propertyName in CACHE_LISTS) {
            const CACHE_LIST = CACHE_LISTS[propertyName];
            const CACHE_NAME = CACHE_LIST["name"] + "_v" + CURRENT_CACHE_VERSION;
            expectedCacheNames.push(CACHE_NAME);
        }
        return CONTEXT.caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!expectedCacheNames.includes(cacheName)) {
                        // If this cache name isn't present in the array of "expected" cache names, then delete it.
                        console.log('Deleting out of date cache:', cacheName);
                        return CONTEXT.caches.delete(cacheName);
                    }
                })
            );
        })
    }
}