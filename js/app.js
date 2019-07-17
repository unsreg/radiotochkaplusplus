"use strict";

// init service-worker
import "../service-worker.js";

import LOGGER from "./logger/SimpleLogger.js";

import STATION_MANAGER from "./StationManager.js";
import DefaultStationProvider from "./station_provider/DefaultStationProvider.js";
import {STATIONS} from "./stations/stations.js";

LOGGER.info("Start application");
const stationProvider = new DefaultStationProvider(STATIONS);
STATION_MANAGER.addStationProvider(stationProvider);
