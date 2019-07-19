"use strict";

let cacheList = {};

importScripts('./cache/cache-list-img.js');
cacheList["images"] = cacheListImg;

importScripts('./cache/cache-list-css.js');
cacheList["styles"] = cacheListCss;

importScripts('./cache/cache-list-js.js');
cacheList["scripts"] = cacheListJs;

importScripts('./cache/cache-list-html.js');
cacheList["pages"] = cacheListHtml;