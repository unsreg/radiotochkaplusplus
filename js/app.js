"use strict";

// init service-worker
import "../service-worker.js";

import {LOGGER} from "./logger/SimpleLogger.js";

import {STATION_MANAGER} from "./StationManager.js";
import StaticStationProvider from "./station_provider/StaticStationProvider.js";

LOGGER.info("Start application");
const stationProvider = new StaticStationProvider();
STATION_MANAGER.addStationProvider(stationProvider);
