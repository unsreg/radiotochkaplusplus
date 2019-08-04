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

const CONSTANTS = new Constants();
Object.freeze(CONSTANTS);

export default CONSTANTS;