// https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/prefetch/service-worker.js
// https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/cache-api
// https://habr.com/ru/company/2gis/blog/345552/

"use strict";

const GLOBAL_CONTEXT = self;
const LOGGER = GLOBAL_CONTEXT.console;

const CACHE_VERSION_FILE = "./cache/cache-version.json";
let currentCacheVersion = null;
let cacheUpdateTime = null;

importScripts('./cache/cache-list.js');
registerListeners();

function getCacheVersion() {
    return new Promise((resolve, reject) => {
        let shouldUpdate = true;
        if (currentCacheVersion && cacheUpdateTime) {
            // every 10 seconds
            if ((new Date().getTime() - cacheUpdateTime) < 10000) {
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

function changeCacheVersion(newCacheVersion) {
    // if (newCacheVersion) {
    //     LOGGER.info("Cache version changed, from (" + currentCacheVersion + ") to (" + newCacheVersion + ")");
    //     currentCacheVersion = newCacheVersion;
    //     updateCache();
    // } else {
    //     LOGGER.warn("(newCacheVersion) is undefined");
    // }
}

function validateCaches() {
    getCacheVersion().then(cacheVersion => {
        GLOBAL_CONTEXT.caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    const nameVersion = cacheName.split("_v");
                    const name = nameVersion[0];
                    const version = nameVersion[1];

                    let newVersion;
                    if (cacheVersion[name]) {
                        newVersion = cacheVersion[name];
                    } else {
                        newVersion = cacheVersion["common"];
                    }

                    if (version !== newVersion) {
                        GLOBAL_CONTEXT.caches.delete(cacheName).then(() => updateCache());
                    }
                    if (!expectedCacheNames.includes(cacheName)) {
                        // If this cache name isn't present in the array of "expected" cache names, then delete it.
                        LOGGER.info('Deleting out of date cache:', cacheName);
                        return GLOBAL_CONTEXT.caches.delete(cacheName);
                    }
                })
            );
        })
    });
}

function updateCache() {
    const DATE_TIME = Date.now();
    getCacheVersion().then(cacheVersion => {
        GLOBAL_CONTEXT.caches.keys().then(cacheNames => {
            cacheNames.map((cacheName) => {
                const nameVersion = cacheName.split("_v");
                const name = nameVersion[0];
                const version = nameVersion[1];
                if (CACHES[name]) {
                    GLOBAL_CONTEXT.caches.delete(cacheName).then(() => {
                        LOGGER.info("Cache is deleted (" + name + ")");
                    });
                } else {

                }

                let newVersion;
                if (cacheVersion[name]) {
                    newVersion = cacheVersion[name];
                } else {
                    newVersion = cacheVersion["common"];
                }

                if (version !== newVersion) {
                    GLOBAL_CONTEXT.caches.delete(cacheName).then(() => updateCache());
                }
                if (!expectedCacheNames.includes(cacheName)) {
                    // If this cache name isn't present in the array of "expected" cache names, then delete it.
                    LOGGER.info('Deleting out of date cache:', cacheName);
                    return GLOBAL_CONTEXT.caches.delete(cacheName);
                }
            });
        });
        for (const cacheName in CACHES) {
            const CACHE_LIST = CACHES[cacheName];
            const CACHE_NAME = cacheName + "_v" + currentCacheVersion;
            // deleteOldCaches();
            GLOBAL_CONTEXT.caches.delete(cacheName);
            GLOBAL_CONTEXT.caches.open(CACHE_NAME).then((cache) => {
                const cachePromises = CACHE_LIST.map((urlToPrefetch) => {
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
        }
    });
}

function deleteOldCaches() {
    if (!currentCacheVersion) {
        return;
    }
    const expectedCacheNames = [];
    for (const propertyName in CACHES) {
        const CACHE_LIST = CACHES[propertyName];
        const CACHE_NAME = CACHE_LIST["name"] + "_v" + currentCacheVersion;
        expectedCacheNames.push(CACHE_NAME);
    }
    return GLOBAL_CONTEXT.caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.map((cacheName) => {
                if (!expectedCacheNames.includes(cacheName)) {
                    // If this cache name isn't present in the array of "expected" cache names, then delete it.
                    LOGGER.info('Deleting out of date cache:', cacheName);
                    return GLOBAL_CONTEXT.caches.delete(cacheName);
                }
            })
        );
    })
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
        if (!currentCacheVersion) {
            LOGGER.warn("Current cache version is undefined");
        }

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

        event.waitUntil(getCacheVersion().then(cacheVersion => {
            LOGGER.info("-------------" + JSON.stringify(cacheVersion));
        }));
//new Promise(() => {
//             fetch(CACHE_VERSION_FILE).then(function (response) {
//                 return response.json().then(value => {
//                     return value["cache-version"];
//                 });
//             }).then(currentCacheVersion => {
//                 if (currentCacheVersion) {
//                     if (currentCacheVersion === currentCacheVersion) {
//                         LOGGER.info("Cache version is the same as current (without changes)");
//                     } else {
//                         LOGGER.info("Cache version is changed, from: " + currentCacheVersion + "; to: " + currentCacheVersion);
//                         currentCacheVersion = currentCacheVersion;
//                     }
//                 } else {
//                     LOGGER.warn("Cache version is undefined");
//                 }
//             });
//         })

        //TODO: load ..."/cache/cache-version.js" only through network

        event.waitUntil(GLOBAL_CONTEXT.skipWaiting());
        // LOGGER.log('Handling fetch event for', event.request.url);

        // if (currentCacheVersion) {
        //     event.respondWith(fromCache(event.request));
        //     event.waitUntil(update(event.request));
        // } else {
        //     event.respondWith(fromNetwork(event.request))
        //         .catch((error) => {
        //             LOGGER.error(error);
        //         });
        // }
        //
        // event.waitUntil(
        //     update(event.request)
        //     // В конце, после получения "свежих" данных от сервера уведомляем всех клиентов.
        //         .then(notifyAllClients)
        // );

        event.respondWith(
            // caches.match() will look for a cache entry in all of the caches available to the service worker.
            // It's an alternative to first opening a specific named cache and then matching on that.
            GLOBAL_CONTEXT.caches.match(event.request).then((response) => {
                if (response) {
                    LOGGER.info('Found response in cache:', response);
                    return response;
                }
                // LOGGER.info('No response found in cache. About to fetch from network...');
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

        if (event.data && event.data["cache-version"]) {
            changeCacheVersion(event.data["cache-version"].toString());
        }
    });
}