"use strict";

const CACHE_FILES = [
    './cache/cache-list-img.js',
    './cache/cache-list-css.js',
    './cache/cache-list-js.js',
    './cache/cache-list-html.js',
    './cache/cache-list-other.js'
];
const CACHE_LISTS = {};

CACHE_LISTS["cache"] = {
    name: "styles",
    files: CACHE_FILES
};
CACHE_FILES.forEach((cacheFile) => {
    importScripts(cacheFile);
    CACHE_LISTS[cacheList["name"]] = cacheList;
});