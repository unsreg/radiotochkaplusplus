// source - https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/prefetch/service-worker.js

"use strict";

const GLOBAL_CONTEXT = self;
const LOGGER = console;

let CURRENT_CACHE_VERSION = null;

importScripts('./cache/cache-list.js');
registerListeners();

function changeCacheVersion(newCacheVersion) {
    if (newCacheVersion) {
        LOGGER.info("Cache version changed, from (" + CURRENT_CACHE_VERSION + ") to (" + newCacheVersion + ")");
        CURRENT_CACHE_VERSION = newCacheVersion;
        updateCache();
    } else {
        LOGGER.warn("(newCacheVersion) is undefined");
    }
}

function updateCache() {
    const DATE_TIME = Date.now();

    for (const cacheName in CACHES) {
        const CACHE_LIST = CACHES[cacheName];
        const CACHE_NAME = cacheName + "_v" + CURRENT_CACHE_VERSION;
        event.waitUntil(deleteOldCaches());
        event.waitUntil(
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
        );
    }
}

function deleteOldCaches() {
    if (!CURRENT_CACHE_VERSION) {
        return;
    }
    const expectedCacheNames = [];
    for (const propertyName in CACHES) {
        const CACHE_LIST = CACHES[propertyName];
        const CACHE_NAME = CACHE_LIST["name"] + "_v" + CURRENT_CACHE_VERSION;
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

function registerListeners() {
    GLOBAL_CONTEXT.addEventListener('install', (event) => {
        LOGGER.info("Service worker event: install");
        if (!CURRENT_CACHE_VERSION) {
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

        //TODO: load ..."/cache/cache-version.js" only through network

        event.waitUntil(GLOBAL_CONTEXT.skipWaiting());
        // LOGGER.log('Handling fetch event for', event.request.url);

        // if (CURRENT_CACHE_VERSION) {
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
        //         .then(refresh)
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

    // refresh all clients
    function refresh(response) {
        return GLOBAL_CONTEXT.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
                // Подробнее про ETag можно прочитать тут
                // https://en.wikipedia.org/wiki/HTTP_ETag
                const message = {
                    type: 'refresh',
                    url: response.url,
                    eTag: response.headers.get('ETag')
                };
                // Уведомляем клиент об обновлении данных.
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
}