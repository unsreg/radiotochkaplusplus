"use strict";

import APPLICATION from "./js/Application.js";
import LOGGER_FACTORY from "./js/logger/LoggerFactory.js";
import CACHE_VERSION from "./cache/cache-version.js";

const CONTEXT = self;
const LOGGER = LOGGER_FACTORY.getLogger();

document.addEventListener("DOMContentLoaded", () => {
    LOGGER.info("Event: DOMContentLoaded");
    registerServiceWorker();

    APPLICATION.start();

    LOGGER.info("Application started with cache-version: " + CACHE_VERSION);
});

function registerServiceWorker() {
    if ('serviceWorker' in CONTEXT.navigator) {
        CONTEXT.navigator.serviceWorker
            .register('./file-cache-service-worker.js', {scope: '.'})
            .then((registration) => {
                LOGGER.info('ServiceWorker registration successful with scope: ' + registration.scope);
            })
            .then(() => {
                CONTEXT.navigator.serviceWorker.ready.then((worker) => {
                    LOGGER.info("ServiceWorker event: ready");
                    return worker.sync.register('syncdata');
                });
            })
            .catch((error) => {
                LOGGER.info('ServiceWorker event: registration failed: ' + error);
            });
    }
}

let checkContextCount = 0;
const checkContextTimer = setInterval(() => {
    if (checkContextCount >= 100) {
        clearInterval(checkContextTimer);
        LOGGER.info("------ 3");
        throw new Error("Controller waiting timeout");
    } else {
        LOGGER.info("------ 1");
        checkContextCount++;
    }
    if (CONTEXT.navigator.serviceWorker.controller) {
        LOGGER.info("------ 2");
        clearInterval(checkContextTimer);
        LOGGER.info("Controller initialized successfully");
        CONTEXT.navigator.serviceWorker.controller.postMessage({'cache-version': CACHE_VERSION});
    }
}, 500);