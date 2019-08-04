"use strict";

const CACHES = {};

const CACHE_FILES = [
    './cache/cache-list-img.js',
    './cache/cache-list-css.js',
    './cache/cache-list-js.js',
    './cache/cache-list-html.js',
    './cache/cache-list-other.js'
];

CACHE_FILES.forEach((cacheFile) => {
    importScripts(cacheFile);
});