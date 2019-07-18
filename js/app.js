"use strict";

import STATION_MANAGER from "./StationManager.js";
import DefaultStationProvider from "./station_provider/DefaultStationProvider.js";
import {STATIONS} from "./stations/stations.js";
import LOGGER_FACTORY from "./logger/LoggerFactory.js";

let CONTEXT = self;
const LOGGER = LOGGER_FACTORY.getLogger();

LOGGER.info("Start application");
unregisterServiceWorker();
registerServiceworker();

//=================================================
const stationProvider = new DefaultStationProvider(STATIONS);
STATION_MANAGER.addStationProvider(stationProvider);

function registerServiceworker() {
    if ('serviceWorker' in CONTEXT.navigator) {
        CONTEXT.navigator.serviceWorker
            .register('./service-worker.js', {scope: '.'})
            .then((registration) => {
                LOGGER.info('ServiceWorker registration successful with scope: ' + registration.scope);
            }, (error) => {
                LOGGER.info('ServiceWorker registration failed: ' + error);
            });
    }
}

function unregisterServiceWorker() {
    CONTEXT.navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
            registrations.forEach((registration) => {
                registration
                    .unregister()
                    .then(() => {
                        LOGGER.info('ServiceWorker unregistered successfully');
                    });
            });
        });
}