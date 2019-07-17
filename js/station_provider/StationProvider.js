"use strict";

export default class StationProvider {
    #name;

    constructor(providerName) {
        this.#name = providerName;
    }

    getName() {
        return this.#name;
    }

    getAll() {
        throw new Error("Method is not implemented");
    }

    getById(id) {
        throw new Error("Method is not implemented");
    }
}