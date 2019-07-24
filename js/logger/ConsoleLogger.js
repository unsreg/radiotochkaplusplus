// https://gist.github.com/bgrins/5108712#file-log-full-js-L26-L33

"use strict";

import {Level, Logger} from "./Logger.js"

const GLOBAL_CONTEXT = self;

export default class ConsoleLogger extends Logger {
    #initialized = false;

    constructor(level) {
        super(level);
        this.#initialized = true;
        this.reset();
    }

    reset() {
        // base class calls this method first time
        if (!this.#initialized) {
            return;
        }
        const methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ];
        const console = (GLOBAL_CONTEXT.window.console = GLOBAL_CONTEXT.window.console || {});
        const noop = () => {
        };
        for (const method in methods) {
            // Only stub undefined methods.
            if (!console[method]) {
                console[method] = noop;
            }
        }
        if (Function.prototype.bind) {
            this.info = Function.prototype.bind.call(console.info, console);
            this.warn = Function.prototype.bind.call(console.warn, console);
            this.error = Function.prototype.bind.call(console.error, console);
        } else {
            this.info = () => {
                Function.prototype.apply.call(console.info, console, this.arguments);
            };
            this.warn = () => {
                Function.prototype.apply.call(console.warn, console, this.arguments);
            };
            this.error = () => {
                Function.prototype.apply.call(console.error, console, this.arguments);
            };
        }
        if (this.getLevel() < Level.INFO) {
            this.info = noop;
        }
        if (this.getLevel() < Level.WARN) {
            this.warn = noop;
        }
        if (this.getLevel() < Level.ERROR) {
            this.error = noop;
        }
    }
};