"use strict";

import SIMPLE_LOGGER from "./SimpleLogger.js";

const SINGLETON = class LoggerFactory {
    static #INSTANCE;

    constructor() {
        if (!SINGLETON.#INSTANCE) {
            SINGLETON.#INSTANCE = this;
        }
        return SINGLETON.#INSTANCE;
    }

    getLogger() {
        return SIMPLE_LOGGER;
    }
};

const LOGGER_FACTORY = new SINGLETON();
Object.freeze(LOGGER_FACTORY);

export default LOGGER_FACTORY;