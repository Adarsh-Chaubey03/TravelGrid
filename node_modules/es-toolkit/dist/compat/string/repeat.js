'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const isIterateeCall = require('../_internal/isIterateeCall.js');
const toInteger = require('../util/toInteger.js');
const toString = require('../util/toString.js');

function repeat(str, n, guard) {
    if (guard ? isIterateeCall.isIterateeCall(str, n, guard) : n === undefined) {
        n = 1;
    }
    else {
        n = toInteger.toInteger(n);
    }
    return toString.toString(str).repeat(n);
}

exports.repeat = repeat;
