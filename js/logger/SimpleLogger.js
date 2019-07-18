"use strict";

import Logger from "./Logger.js"

class SimpleLogger extends Logger {
    static #instance;

    constructor() {
        super();
        if (!SimpleLogger.#instance) {
            SimpleLogger.#instance = this;
        }
        return SimpleLogger.#instance;
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
}

const LOGGER = new SimpleLogger();
Object.freeze(LOGGER);

export default LOGGER;