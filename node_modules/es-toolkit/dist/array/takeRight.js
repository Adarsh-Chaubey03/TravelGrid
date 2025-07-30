'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const toInteger = require('../compat/util/toInteger.js');

function takeRight(arr, count = 1, guard) {
    count = guard || count === undefined ? 1 : toInteger.toInteger(count);
    if (count <= 0 || arr == null || arr.length === 0) {
        return [];
    }
    return arr.slice(-count);
}

exports.takeRight = takeRight;
