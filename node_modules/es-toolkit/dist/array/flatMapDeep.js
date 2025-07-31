'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const flattenDeep = require('./flattenDeep.js');

function flatMapDeep(arr, iteratee) {
    return flattenDeep.flattenDeep(arr.map((item) => iteratee(item)));
}

exports.flatMapDeep = flatMapDeep;
