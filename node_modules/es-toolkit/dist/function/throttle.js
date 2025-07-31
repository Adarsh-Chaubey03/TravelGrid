'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const debounce = require('./debounce.js');

function throttle(func, throttleMs, { signal, edges = ['leading', 'trailing'] } = {}) {
    let pendingAt = null;
    const debounced = debounce.debounce(func, throttleMs, { signal, edges });
    const throttled = function (...args) {
        if (pendingAt == null) {
            pendingAt = Date.now();
        }
        else {
            if (Date.now() - pendingAt >= throttleMs) {
                pendingAt = Date.now();
                debounced.cancel();
            }
        }
        debounced(...args);
    };
    throttled.cancel = debounced.cancel;
    throttled.flush = debounced.flush;
    return throttled;
}

exports.throttle = throttle;
