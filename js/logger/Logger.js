"use strict";

export default class Logger {
    static INFO = 1;
    static WARN = 2;
    static ERROR = 3;

    #level;

    constructor() {
        this.setLevel(Logger.INFO);
    }

    getLevel() {
        return this.#level;
    }

    setLevel(level) {
        if (level < Logger.INFO || level > Logger.ERROR) {
            throw new Error("Logger doesn't support this level (" + level + ")");
        }
        this.#level = level;
    }

    info(message) {
        throw new Error("Method is not implemented");
    }

    warn(message) {
        throw new Error("Method is not implemented");
    }

    error(message) {
        throw new Error("Method is not implemented");
    }
}