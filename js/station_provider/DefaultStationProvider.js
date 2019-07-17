"use strict";

import StationProvider from "./StationProvider.js"

export default class DefaultStationProvider extends StationProvider {
    staticStations = [];

    constructor(stations) {
        super();
        this.staticStations = stations;
    }

    getStations() {
        return this.staticStations;
    }

    getStationById(id) {
        return this.staticStations.find(value => value.id.toString().eq(id.toString()));
    }

    getId() {
        return super.id;
    }
}