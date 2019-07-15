"use strict";

import SimpleLogger from "./logger/SimpleLogger.js";
import StationManager from "./StationManager.js";

export default class Engine {
    logger = new SimpleLogger();
    stationManager = new StationManager();

    start() {
        this.logger.info("test info message");
    }
}