"use strict";

let cacheList = [];

importScripts('./cache/cache-list-img.js');
cacheList = cacheList.concat(cacheListImg);

importScripts('./cache/cache-list-css.js');
cacheList = cacheList.concat(cacheListCss);

importScripts('./cache/cache-list-js.js');
cacheList = cacheList.concat(cacheListJs);

importScripts('./cache/cache-list-html.js');
cacheList = cacheList.concat(cacheListHtml);