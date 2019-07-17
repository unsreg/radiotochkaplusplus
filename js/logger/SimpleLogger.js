"use strict";

import Logger from "./Logger.js"

class SimpleLogger extends Logger {

    info(message) {
        console.info(SimpleLogger.format("INFO", message));
    }

    warn(message) {
        console.warn(SimpleLogger.format("WARNING", message));
    }

    error(message) {
        console.error(SimpleLogger.format("ERROR", message));
    }

    static format(level, message) {
        return "[" + new Date().toISOString() + "]"
            + "[" + level + "\t]" + "\t" + message + "\n";
    }
}

const LOGGER = new SimpleLogger();
Object.freeze(LOGGER);

export default LOGGER;