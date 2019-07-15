"use strict";

import {Logger} from "./Logger.js"

export class SimpleLogger extends Logger {

    info(message) {
        console.info(message);
    }

    warn(message) {
        console.warn(message);
    }

    error(message) {
        console.error(message);
    }
}