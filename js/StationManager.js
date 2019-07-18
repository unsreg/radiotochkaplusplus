"use strict";

class StationManager {
    static #instance;

    stationProviders = {};

    constructor() {
        if (!StationManager.#instance) {
            StationManager.#instance = this;
        }
        return StationManager.#instance;
    }

    addStationProvider(stationProvider) {
        if (this.stationProviders[stationProvider.getName()]) {
            throw "This provider is already added";
        } else {
            this.stationProviders[stationProvider.getName()] = stationProvider;
        }
    }
}

const STATION_MANAGER = new StationManager();
Object.freeze(STATION_MANAGER);

export default STATION_MANAGER;
