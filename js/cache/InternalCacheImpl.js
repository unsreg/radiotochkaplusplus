"use strict";

import {LOGGER} from "../logger/SimpleLogger.js";
import InternalCache from "./InternalCache.js";

export default class InternalCacheImpl extends InternalCache {
    #GLOBAL_CONTEXT = self;
    #cache = {};

    constructor(cacheName) {
        super(cacheName);
    }

    put(key, dataProviderCallback, ttl, durable) {
        let result = null;
        const savedItem = {
            key: key,
            dataProviderCallback: dataProviderCallback,
            ttl: ttl,
            loadTime: new Date().getTime()
        };
        if (durable === true) {
            result = this.#saveGlobal(savedItem);
            LOGGER.info("Cache saved with global key (" + savedItem.key + ")")
        } else {
            result = this.#saveLocal(savedItem);
            LOGGER.info("Cache saved with local key (" + savedItem.key + ")")
        }
        return result;
    }

    get(key) {
        let result = this.#getLocal(key);
        if (!result) {
            result = this.#getGlobal(key);
        }
        return result;
    }

    remove(key) {
    }

    getKeys() {
    }

    getValues() {
    }

    isEmpty() {
    }

    size() {
    }

    invalidate(key) {
    }

    invalidateAll() {
    }

    #getLocal(key) {
        let result = null;
        if (this.#cache[key]) {
            let cachedItem = this.#cache[key];
            if (cachedItem.data) {
                const timeDelta = (new Date().getTime() - cachedItem.loadTime) / 1000;
                if(timeDelta > cachedItem.ttl) {

                }
            } else {
                cachedItem.data = cachedItem.dataProviderCallback();
                cachedItem.loadTime = new Date().getTime();
            }
            this.#cache[key] = cachedItem;
            result = cachedItem.data;
        } else {
            LOGGER.warn("Local cache doesn't have this key: (" + key + ")");
        }
        return result;
    }

    #getGlobal(key) {

    }

    #saveLocal(savedItem) {
        savedItem.let
        result = null;
        if (this.#cache[savedItem.key]) {
            result = this.#cache[savedItem.key].data;
        } else {
            this.#cache[savedItem.key] = savedItem;
        }
        return result;
    }

    #saveGlobal(savedItem) {
        let result = null;
        const storage = this.#GLOBAL_CONTEXT.localStorage;
        let storedItem;
        if (storage.getItem(this.getName())) {
            storedItem = JSON.parse(storage.getItem(this.getName()));
        } else {
            storedItem = {};
        }
        if (storedItem[savedItem.key]) {
            result = storedItem[savedItem.key].data;
        }
        storedItem[savedItem.key] = savedItem;
        storage.setItem(this.getName(), JSON.stringify(storedItem));
        return result;
    }
}
