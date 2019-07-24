// https://gist.github.com/bgrins/5108712#file-log-full-js-L26-L33

"use strict";

import Logger from "./Logger.js"

const SINGLETON = class ConsoleLogger extends Logger {
    static #INSTANCE;
    static #EMPTY_FUNCTION = () => {
    };

    constructor() {
        super();
        this.#init();
        if (!SINGLETON.#INSTANCE) {
            SINGLETON.#INSTANCE = this;
        }
        return SINGLETON.#INSTANCE;
    }

    #init = () => {
        const thisMethods = ["info", "warn", "error"];
        const methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ];
        const console = (window.console = window.console || {});
        const noop = () => {
        };
        for (const method in methods) {
            // Only stub undefined methods.
            if (!console[method]) {
                console[method] = noop;
            }
        }
        for (const thisMethod in thisMethods) {
            //this[thisMethod] = noop;
            if (Function.prototype.bind) {
                this[thisMethod] = Function.prototype.bind.call(console[thisMethod], console);
            } else {
                this[thisMethod] = () => {
                    Function.prototype.apply.call(console[thisMethod], console, this.arguments);
                };
            }
        }
        // if (Function.prototype.bind) {
        //     this.info = Function.prototype.bind.call(console.info, console);
        //     this.warn = Function.prototype.bind.call(console.warn, console);
        //     this.warn = Function.prototype.bind.call(console.error, console);
        // } else {
        //     this.info = () => {
        //         Function.prototype.apply.call(console.info, console, this.arguments);
        //     };
        //     this.warn = () => {
        //         Function.prototype.apply.call(console.warn, console, this.arguments);
        //     };
        //     this.error = () => {
        //         Function.prototype.apply.call(console.error, console, this.arguments);
        //     };
        // }
    };

    // info = function (CONTEXT) {
    //     if (CONTEXT.getLevel() >= Logger.INFO) {
    //         return console.info.bind(window.console, ConsoleLogger.#format("INFO"));
    //     } else {
    //         return ConsoleLogger.#EMPTY_FUNCTION;
    //     }
    // }(this);
    //
    // warn = function (CONTEXT) {
    //     if (CONTEXT.getLevel() >= Logger.WARN) {
    //         return console.info.bind(window.console, ConsoleLogger.#format("WARN"));
    //     } else {
    //         return ConsoleLogger.#EMPTY_FUNCTION;
    //     }
    // }(this);
    //
    // error = function (CONTEXT) {
    //     if (CONTEXT.getLevel() >= Logger.ERROR) {
    //         return console.info.bind(window.console, ConsoleLogger.#format("ERROR"));
    //     } else {
    //         return ConsoleLogger.#EMPTY_FUNCTION;
    //     }
    // }(this);

    static #format = (level) => {
        return "[" + new Date().toISOString() + "]"
            + "[" + level + "\t]" + "\t%s\n";
    };
};

const SIMPLE_LOGGER = new SINGLETON();
Object.freeze(SIMPLE_LOGGER);

export default SIMPLE_LOGGER;