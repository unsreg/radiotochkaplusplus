"use strict";

class Constants {
    constructor() {
        Object.freeze(this.APP);
    }

    APP = {
        APP_NAME: "RadioTochkaPlusPlus",
        APP_SIMPLE_NAME: "RadioTochka++",
        APP_SHORT_NAME: "rtpp"
    }
}

const constants = new Constants();
Object.freeze(constants);

export const CONSTANTS = constants;