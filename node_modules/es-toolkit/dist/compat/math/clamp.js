'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const clamp$1 = require('../../math/clamp.js');

function clamp(value, bound1, bound2) {
    if (Number.isNaN(bound1)) {
        bound1 = 0;
    }
    if (Number.isNaN(bound2)) {
        bound2 = 0;
    }
    return clamp$1.clamp(value, bound1, bound2);
}

exports.clamp = clamp;
