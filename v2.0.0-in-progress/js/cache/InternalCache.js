"use strict";

export default class InternalCache {
    #name;

    constructor(cacheName) {
        if (!cacheName) {
            throw new Error("Cache name is undefined");
        }
        this.#name = cacheName;
    }

    getName() {
        return this.#name;
    }

    put(key, dataProviderCallback, ttl, durable) {
        throw new Error("Method is not implemented");
    }

    get(key) {
        throw new Error("Method is not implemented");
    }

    remove(key) {
        throw new Error("Method is not implemented");
    }

    getKeys() {
        throw new Error("Method is not implemented");
    }

    getValues() {
        throw new Error("Method is not implemented");
    }

    isEmpty() {
        throw new Error("Method is not implemented");
    }

    size() {
        throw new Error("Method is not implemented");
    }

    invalidate(key) {
        throw new Error("Method is not implemented");
    }

    invalidateAll() {
        throw new Error("Method is not implemented");
    }
}