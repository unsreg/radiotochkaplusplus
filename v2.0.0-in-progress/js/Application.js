"use strict";

import STATION_MANAGER from "./StationManager.js";
import DefaultStationProvider from "./station-provider/DefaultStationProvider.js";
import {STATIONS} from "./stations/stations.js";
import LOGGER_FACTORY from "./logger/LoggerFactory.js";

const CONTEXT = self;
const LOGGER = LOGGER_FACTORY.getLogger();

class Application {
    static #INSTANCE;

    constructor() {
        if (!Application.#INSTANCE) {
            Application.#INSTANCE = this;
        }
        return Application.#INSTANCE;
    }

    start() {
        LOGGER.info("Start application");
        const stationProvider = new DefaultStationProvider(STATIONS);
        STATION_MANAGER.addStationProvider(stationProvider);
    }
}

const APPLICATION = new Application();
Object.freeze(APPLICATION);

export default APPLICATION;