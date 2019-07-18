"use strict";

import Logger from "./Logger.js"

const SINGLETON = class SimpleLogger extends Logger {
    static #INSTANCE;

    constructor() {
        super();
        if (!SINGLETON.#INSTANCE) {
            SINGLETON.#INSTANCE = this;
        }
        return SINGLETON.#INSTANCE;
    }

    info(message) {
        if (this.getLevel() === Logger.INFO ||
            this.getLevel() === Logger.WARN ||
            this.getLevel() === Logger.ERROR) {
            console.info(SimpleLogger.#format(Logger.INFO, message));
        }
    }

    warn(message) {
        if (this.getLevel() === Logger.WARN ||
            this.getLevel() === Logger.ERROR) {
            console.warn(SimpleLogger.#format(Logger.WARN, message));
        }
    }

    error(message) {
        if (this.getLevel() === Logger.ERROR) {
            console.error(SimpleLogger.#format(Logger.ERROR, message));
        }
    }

    static #format = function (level, message) {
        return "[" + new Date().toISOString() + "]"
            + "[" + level + "\t]" + "\t" + message + "\n";
    }
};

const SIMPLE_LOGGER = new SINGLETON();
Object.freeze(SIMPLE_LOGGER);

export default SIMPLE_LOGGER;