// source - https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/prefetch/service-worker.js

"use strict";

const CONTEXT = self;
const CONTEXT_NAME = Object.prototype.toString.call(CONTEXT).slice(8, -1);

if (CONTEXT_NAME.toLowerCase() === "Window".toLowerCase()) {
    registerServiceWorker();
}

if (CONTEXT_NAME.toLowerCase() === "ServiceWorkerGlobalScope".toLowerCase()) {
    extendCacheAddMissingChrome40Functionality();

    importScripts('./cache/cache-list.js');
    registerListeners();
}

function registerServiceWorker() {
    if ('serviceWorker' in CONTEXT.navigator) {
        CONTEXT.navigator.serviceWorker
            .register('./file-cache-service-worker.js', {scope: '.'})
            .then((registration) => {
                console.info('ServiceWorker registration successful with scope: ' + registration.scope);
            }, (error) => {
                console.info('ServiceWorker registration failed: ' + error);
            });
    }
}

function registerListeners() {
    CONTEXT.addEventListener('install', (event) => {
        const now = Date.now();

        for (const propertyName in CACHE_LISTS) {
            const CACHE_LIST = CACHE_LISTS[propertyName];
            const CACHE_NAME = CACHE_LIST["name"] + "_v" + CACHE_VERSION;
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
    });
    CONTEXT.addEventListener('activate', (event) => {
        event.waitUntil(deleteOldCaches());
    });

    CONTEXT.addEventListener('fetch', (event) => {
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

    function deleteOldCaches() {
        const expectedCacheNames = [];
        for (const propertyName in CACHE_LISTS) {
            const CACHE_LIST = CACHE_LISTS[propertyName];
            const CACHE_NAME = CACHE_LIST["name"] + "_v" + CACHE_VERSION;
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

function extendCacheAddMissingChrome40Functionality() {
    // source - https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/serviceworker-cache-polyfill.js

    // Via https://github.com/coonsta/cache-polyfill/blob/master/dist/serviceworker-cache-polyfill.js
    // Adds in some functionality missing in Chrome 40.

    // Since DOMExceptions are not constructable:
    function NetworkError(message) {
        this.name = 'NetworkError';
        this.code = 19;
        this.message = message;
    }

    NetworkError.prototype = Object.create(Error.prototype);

    if (!CONTEXT.Cache.prototype.add) {
        CONTEXT.Cache.prototype.add = function add(request) {
            return this.addAll([request]);
        };
    }
    if (!CONTEXT.Cache.prototype.addAll) {
        CONTEXT.Cache.prototype.addAll = (requests) => {
            const cache = this;
            return Promise.resolve().then(() => {
                if (arguments.length < 1) {
                    throw new TypeError();
                }
                // Simulate sequence<(Request or USVString)> binding:
                // var sequence = [];
                requests = requests.map((request) => {
                    if (request instanceof Request) {
                        return request;
                    } else {
                        return String(request); // may throw TypeError
                    }
                });
                return Promise.all(
                    requests.map((request) => {
                        if (typeof request === 'string') {
                            request = new Request(request);
                        }
                        const scheme = new URL(request.url).protocol;
                        if (scheme !== 'http:' && scheme !== 'https:') {
                            throw new NetworkError("Invalid scheme");
                        }
                        return fetch(request.clone());
                    })
                );
            }).then((responses) => {
                // TODO: check that requests don't overwrite one another
                // (don't think this is possible to polyfill due to opaque responses)
                return Promise.all(
                    responses.map((response, i) => {
                        return cache.put(requests[i], response);
                    })
                );
            }).then(() => {
                return undefined;
            });
        };
    }
    if (!CONTEXT.CacheStorage.prototype.match) {
        // This is probably vulnerable to race conditions (removing caches etc)
        CONTEXT.CacheStorage.prototype.match = (request, opts) => {
            const caches = this;
            return this.keys().then((cacheNames) => {
                let match;
                return cacheNames.reduce((chain, cacheName) => {
                        return chain.then(() => {
                            return match || caches
                                .open(cacheName)
                                .then((cache) => {
                                    return cache.match(request, opts);
                                }).then((response) => {
                                    match = response;
                                    return match;
                                });
                        });
                    },
                    Promise.resolve());
            });
        };
    }
}