"use strict";

import LOGGER from "./logger/ConsoleLogger.js";
import STATION_MANAGER from "./StationManager.js";

export default class Engine {


    start() {
        STATION_MANAGER.addStationProvider({});
        LOGGER.info("test info message");
    }
}