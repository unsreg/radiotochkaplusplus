"use strict";

class Logger {
    #level;

    constructor(level) {
        if (level) {
            this.setLevel(level);
        } else {
            this.setLevel(Level.ALL);
        }
    }

    getLevel() {
        return this.#level;
    }

    setLevel(level) {
        if (level < Level.NONE || level > Level.ALL) {
            throw new Error("Logger doesn't support this level (" + level + ")");
        }
        this.#level = level;
        this.reset();
    }

    reset() {
        throw new Error("Method is not implemented");
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

class Level {
    static NONE = 0;
    static ERROR = 1;
    static WARN = 2;
    static INFO = 3;
    static ALL = 4;
}

export {Logger, Level};

