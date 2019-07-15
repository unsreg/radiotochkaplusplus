"use strict";

import StationProvider from "./StationProvider.js"

export class StaticStationProvider extends StationProvider {
    staticStations = [];

    constructor(stations) {
        super();
        this.staticStations = stations;
    }

    get stations() {
        return this.staticStations;
    }

    get id() {
        return super.id;
    }
}