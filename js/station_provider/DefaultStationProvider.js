"use strict";

import StationProvider from "./StationProvider.js"

export default class DefaultStationProvider extends StationProvider {
    staticStations = [];

    constructor(stations) {
        super();
        this.staticStations = stations;
    }

    getAll() {
        return this.staticStations;
    }

    getById(id) {
        return this.staticStations.find(value => value.id.toString().eq(id.toString()));
    }
}