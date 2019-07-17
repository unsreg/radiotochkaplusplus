"use strict";

class StationManager {
    stationProviders = {};

    constructor() {
    }

    addStationProvider(stationProvider) {
        if (this.stationProviders[stationProvider.id.toString()]) {
            throw "This provider is already added";
        } else {
            this.stationProviders[stationProvider.id.toString()] = stationProvider;
        }
    }
}

const STATION_MANAGER = new StationManager();
Object.freeze(STATION_MANAGER);

export default STATION_MANAGER;
