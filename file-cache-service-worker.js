// source - https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/prefetch/service-worker.js

"use strict";

extendCacheAddMissingChrome40Functionality();

// This polyfill provides Cache.add(), Cache.addAll(), and CacheStorage.match(),
// which are not implemented in Chrome 40.
importScripts('./cache/cache-list.js');

// While overkill for this specific sample in which there is only one cache,
// this is one best practice that can be followed in general to keep track of
// multiple caches used by a given service worker, and keep them all versioned.
// It maps a shorthand identifier for a cache to a specific, versioned cache name.

// Note that since global state is discarded in between service worker restarts, these
// variables will be reinitialized each time the service worker handles an event, and you
// should not attempt to change their values inside an event handler. (Treat them as constants.)

// If at any point you want to force pages that use this service worker to start using a fresh
// cache, then increment the CACHE_VERSION value. It will kick off the service worker update
// flow and the old cache(s) will be purged as part of the activate event handler when the
// updated service worker is activated.

const CACHE_VERSION = 5;
const CURRENT_CACHES = {
    prefetch: 'prefetch-cache-v' + CACHE_VERSION
};

self.addEventListener('install', (event) => {
    debugger;

    const now = Date.now();
    for (const propertyName in cacheList) {
        const urlsToPrefetch = cacheList[propertyName];
        event.waitUntil(
            caches.open(CURRENT_CACHES.prefetch).then((cache) => {
                const cachePromises = urlsToPrefetch.map((urlToPrefetch) => {
                    // This constructs a new URL object using the service worker's script location as the base
                    // for relative URLs.
                    const url = new URL(urlToPrefetch, location.href);
                    // Append a cache-bust=TIMESTAMP URL parameter to each URL's query string.
                    // This is particularly important when pre-caching resources that are later used in the
                    // fetch handler as responses directly, without consulting the network (i.e. cache-first).
                    // If we were to get back a response from the HTTP browser cache for this pre-caching request
                    // then that stale response would be used indefinitely, or at least until the next time
                    // the service worker script changes triggering the install flow.
                    url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;

                    // It's very important to use {mode: 'no-cors'} if there is any chance that
                    // the resources being fetched are served off of a server that doesn't support
                    // CORS (http://en.wikipedia.org/wiki/Cross-origin_resource_sharing).
                    // In this example, www.chromium.org doesn't support CORS, and the fetch()
                    // would fail if the default mode of 'cors' was used for the fetch() request.
                    // The drawback of hardcoding {mode: 'no-cors'} is that the response from all
                    // cross-origin hosts will always be opaque
                    // (https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#cross-origin-resources)
                    // and it is not possible to determine whether an opaque response represents a success or failure
                    // (https://github.com/whatwg/fetch/issues/14).
                    const request = new Request(url.toString(), {mode: 'no-cors'});
                    return fetch(request).then((response) => {
                        if (response.status >= 400) {
                            throw new Error('request for ' + urlToPrefetch + ' failed with status ' + response.statusText);
                        }
                        // Use the original URL without the cache-busting parameter as the key for cache.put().
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

self.addEventListener('activate', (event) => {
    // Delete all caches that aren't named in CURRENT_CACHES.
    // While there is only one cache in this example, the same logic will handle the case where
    // there are multiple versioned caches.
    const expectedCacheNames = Object.keys(CURRENT_CACHES).map((key) => {
        return CURRENT_CACHES[key];
    });
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    debugger;
                    if (expectedCacheNames.indexOf(cacheName) === -1) {
                        // If this cache name isn't present in the array of "expected" cache names, then delete it.
                        console.log('Deleting out of date cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    console.log('Handling fetch event for', event.request.url);
    event.respondWith(
        // caches.match() will look for a cache entry in all of the caches available to the service worker.
        // It's an alternative to first opening a specific named cache and then matching on that.
        caches.match(event.request).then((response) => {
            if (response) {
                console.log('Found response in cache:', response);
                return response;
            }
            console.log('No response found in cache. About to fetch from network...');
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

    if (!Cache.prototype.add) {
        Cache.prototype.add = function add(request) {
            return this.addAll([request]);
        };
    }
    if (!Cache.prototype.addAll) {
        Cache.prototype.addAll = (requests) => {
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
    if (!CacheStorage.prototype.match) {
        // This is probably vulnerable to race conditions (removing caches etc)
        CacheStorage.prototype.match = (request, opts) => {
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