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

const stationManager = new StationManager();
Object.freeze(stationManager);

export const STATION_MANAGER = stationManager;
