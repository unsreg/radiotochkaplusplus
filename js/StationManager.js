"use strict";

// import StationProvider from "./station_provider/StationProvider.js";

export default class StationManager {
    stationProviders = {};
    instanceExists = false;

    constructor(stationProvider) {
        if (this.instanceExists) {

        }
        // if (!instance) {
        //     //instance = this;
        //     //Object.freeze(this.instance);
        // }
        // return this.instance;
    }

    addStationProvider(stationProvider) {
        if (this.stationProviders[stationProvider.id.toString()]) {
            throw "This provider is already added";
        } else {
            this.stationProviders[stationProvider.id.toString()] = stationProvider;
        }
    }

    static get instance() {
        let instance;
        return function () {
            if (!instance) {
                instance = new StationManager();
                Object.freeze(instance);
            }
            return instance;
        }();
    }

}
