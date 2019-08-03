"use strict";

import ConsoleLogger from "./ConsoleLogger.js";
import Level from "./Level.js";

const SINGLETON = class LoggerFactory {
    static #INSTANCE;
    static #LOGGER;
    static #level = Level.ALL;

    constructor() {
        if (!SINGLETON.#INSTANCE) {
            SINGLETON.#INSTANCE = this;
        }
        return SINGLETON.#INSTANCE;
    }

    getLogger() {
        if (!LoggerFactory.#LOGGER) {
            LoggerFactory.#LOGGER = new ConsoleLogger(LoggerFactory.#level);
        }
        return LoggerFactory.#LOGGER;
    }
};

const LOGGER_FACTORY = new SINGLETON();
Object.freeze(LOGGER_FACTORY);

export default LOGGER_FACTORY;