"use strict";

import ConsoleLogger from "./ConsoleLogger.js";

const SINGLETON = class LoggerFactory {
    static #INSTANCE;
    static #LOGGER;

    constructor() {
        if (!SINGLETON.#INSTANCE) {
            SINGLETON.#INSTANCE = this;
        }
        return SINGLETON.#INSTANCE;
    }

    getLogger(level) {
        if (!LoggerFactory.#LOGGER) {
            LoggerFactory.#LOGGER = new ConsoleLogger(level);
        }
        return LoggerFactory.#LOGGER;
    }
};

const LOGGER_FACTORY = new SINGLETON();
Object.freeze(LOGGER_FACTORY);

export default LOGGER_FACTORY;