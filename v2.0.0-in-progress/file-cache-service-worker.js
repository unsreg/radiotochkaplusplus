// https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/prefetch/service-worker.js
// https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/cache-api
// https://habr.com/ru/company/2gis/blog/345552/

"use strict";

const GLOBAL_CONTEXT = self;
const LOGGER = GLOBAL_CONTEXT.console;

const CACHE_VERSION_FILE = "./cache/cache-version.json";
const CACHE_VERSION_TTL = 10000;// 10 seconds
const CACHE_NAME_VERSION_SPLITTER = "_version";

let currentCacheVersion = null;
let cacheUpdateTime = null;

importScripts('./cache/cache-list.js');
registerListeners();

function getCacheVersion() {
    return new Promise((resolve, reject) => {
        let shouldUpdate = true;
        if (currentCacheVersion && cacheUpdateTime) {
            if ((new Date().getTime() - cacheUpdateTime) < CACHE_VERSION_TTL) {
                shouldUpdate = false;
            }
        }
        if (shouldUpdate) {
            fetch(CACHE_VERSION_FILE).then(response => {
                response.json().then(value => {
                    cacheUpdateTime = new Date().getTime();
                    currentCacheVersion = value;
                    resolve(currentCacheVersion);
                });
            }).catch(reason => reject(reason));
        } else {
            resolve(currentCacheVersion);
        }
    });
}

function updateCache() {
    const DATE_TIME = Date.now();
    const CACHE_NAME_TO_ADD = [];
    const CACHE_NAME_WO_CHANGES = [];
    const EXISTING_CACHES = {};
    let actualCacheVersion;
    getCacheVersion().then(cacheVersion => {
        actualCacheVersion = cacheVersion;
    }).then(() => {
        // Collect existing cache names and versions
        GLOBAL_CONTEXT.caches.keys().then(cacheNames => {
            cacheNames.map((cacheName) => {
                const nameVersion = cacheName.split(CACHE_NAME_VERSION_SPLITTER);
                EXISTING_CACHES[nameVersion[0]] = nameVersion[1];
            });
        });
    }).then(() => {
        // Remove unnecessary and outdated caches
        for (const existingCacheName in Object.keys(EXISTING_CACHES)) {
            if (CACHE_FILES[existingCacheName]) {
                let newVersion;
                if (actualCacheVersion[existingCacheName]) {
                    newVersion = actualCacheVersion[existingCacheName];
                } else {
                    newVersion = actualCacheVersion["common"];
                }
                if (newVersion === EXISTING_CACHES[existingCacheName]) {
                    CACHE_NAME_WO_CHANGES.push(existingCacheName);
                } else {
                    CACHE_NAME_TO_ADD.push(existingCacheName);
                    deleteCacheByName(existingCacheName);
                }
            } else {
                deleteCacheByName(existingCacheName);
            }
        }
    }).then(() => {
    }).then(() => {
        // Update caches
        CACHE_NAME_TO_ADD.forEach(cacheNameToAdd => {
            let newVersion;
            if (actualCacheVersion[cacheNameToAdd]) {
                newVersion = actualCacheVersion[cacheNameToAdd];
            } else {
                newVersion = actualCacheVersion["common"];
            }
            const newCacheName = cacheNameToAdd + CACHE_NAME_VERSION_SPLITTER + newVersion;
            GLOBAL_CONTEXT.caches.open(newCacheName).then((cache) => {
                const cachePromises = CACHE_FILES[cacheNameToAdd].map((urlToPrefetch) => {
                    const url = new URL(urlToPrefetch, location.href);
                    url.search += (url.search ? '&' : '?') + 'cache-bust=' + DATE_TIME;
                    const request = new Request(url.toString(), {mode: 'no-cors'});
                    return fetch(request).then((response) => {
                        if (response.status >= 400) {
                            throw new Error('request for ' + urlToPrefetch + ' failed with status ' + response.statusText);
                        }
                        return cache.put(urlToPrefetch, response);
                    }).catch((error) => {
                        LOGGER.error('Not caching ' + urlToPrefetch + ' due to ' + error);
                    });
                });
                return Promise.all(cachePromises).then(() => {
                    LOGGER.info('Pre-fetching complete.');
                });
            }).catch((error) => {
                LOGGER.error('Pre-fetching failed:', error);
            })
        });
    });
}

function deleteCacheByNameVersion(nameVersion) {
    GLOBAL_CONTEXT.caches.delete(nameVersion).then(() => {
        LOGGER.info("Cache is deleted by nameVersion(" + nameVersion + ")");
    });
}

function deleteCacheByName(name) {
    GLOBAL_CONTEXT.caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.map((cacheName) => {
                const nameVersion = cacheName.split("_v");
                if (name === nameVersion[0]) {
                    LOGGER.info('Cache is deleted by name (' + cacheName + ")");
                    return GLOBAL_CONTEXT.caches.delete(cacheName);
                }
            })
        );
    });
}

function deleteCacheByVersion(version) {
    GLOBAL_CONTEXT.caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.map((cacheName) => {
                const nameVersion = cacheName.split("_v");
                if (version === nameVersion[1]) {
                    LOGGER.info('Cache is deleted by version (' + cacheName + ")");
                    return GLOBAL_CONTEXT.caches.delete(cacheName);
                }
            })
        );
    });
}

function fromCache(request) {
    return caches.open(CACHE).then((cache) =>
        cache.match(request).then((matching) =>
            matching || Promise.reject('no-match')
        ));
}

function update(request) {
    return caches.open(CACHE).then((cache) =>
        fetch(request).then((response) =>
            cache.put(request, response.clone()).then(() => response)
        )
    );
}

function notifyAllClients(response) {
    return GLOBAL_CONTEXT.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
            // ETag additional info
            // https://en.wikipedia.org/wiki/HTTP_ETag
            const message = {
                type: 'notifyAllClients',
                url: response.url,
                eTag: response.headers.get('ETag')
            };
            // Notify client
            client.postMessage(JSON.stringify(message));
        });
    });
}

// Временно-ограниченный запрос.
function fromNetwork(request, timeout) {
    return new Promise((fulfill, reject) => {
        const timeoutId = setTimeout(reject, timeout);
        fetch(request).then((response) => {
            clearTimeout(timeoutId);
            fulfill(response);
        }, reject);
    });
}

function registerListeners() {
    GLOBAL_CONTEXT.addEventListener('install', (event) => {
        LOGGER.info("Service worker event: install");
        updateCache();
        event.waitUntil(GLOBAL_CONTEXT.skipWaiting());
    });
    GLOBAL_CONTEXT.addEventListener('activate', (event) => {
        LOGGER.info("Service worker event: activate");
        //event.waitUntil(deleteOldCaches());
        event.waitUntil(GLOBAL_CONTEXT.skipWaiting());
        event.waitUntil(GLOBAL_CONTEXT.clients.claim());
    });
    GLOBAL_CONTEXT.addEventListener('fetch', (event) => {
        LOGGER.info("Service worker event: fetch");
        //event.waitUntil(GLOBAL_CONTEXT.skipWaiting());
        updateCache();
        event.respondWith(
            // caches.match() will look for a cache entry in all of the caches available to the service worker.
            // It's an alternative to first opening a specific named cache and then matching on that.
            GLOBAL_CONTEXT.caches.match(event.request).then((response) => {
                if (response) {
                    LOGGER.info('Found response in cache:', response);
                    return response;
                }
                LOGGER.info('No response found in cache. About to fetch from network...');
                // event.request will always have the proper mode set ('cors, 'no-cors', etc.) so we don't
                // have to hardcode 'no-cors' like we do when fetch()ing in the install handler.
                return fetch(event.request).then((response) => {
                    LOGGER.info('Response from network is:', response);
                    return response;
                }).catch((error) => {
                    // This catch() will handle exceptions thrown from the fetch() operation.
                    // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
                    // It will return a normal response object that has the appropriate error code set.
                    LOGGER.error('Fetching failed:', error);
                    throw error;
                });
            })
        );
    });
    GLOBAL_CONTEXT.addEventListener('message', (event) => {
        LOGGER.info("Service worker event: message (" + JSON.stringify(event.data) + ")");
    });
}