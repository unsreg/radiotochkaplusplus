"use strict";

import STATION_MANAGER from "./StationManager.js";
import DefaultStationProvider from "./station-provider/DefaultStationProvider.js";
import {STATIONS} from "./stations/stations.js";
import LOGGER_FACTORY from "./logger/LoggerFactory.js";

let CONTEXT = self;
const LOGGER = LOGGER_FACTORY.getLogger();

LOGGER.info("Start application");

const stationProvider = new DefaultStationProvider(STATIONS);
STATION_MANAGER.addStationProvider(stationProvider);

