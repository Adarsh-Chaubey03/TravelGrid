'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const isIndex = require('./isIndex.js');
const isArrayLike = require('../predicate/isArrayLike.js');
const isObject = require('../predicate/isObject.js');
const eq = require('../util/eq.js');

function isIterateeCall(value, index, object) {
    if (!isObject.isObject(object)) {
        return false;
    }
    if ((typeof index === 'number' && isArrayLike.isArrayLike(object) && isIndex.isIndex(index) && index < object.length) ||
        (typeof index === 'string' && index in object)) {
        return eq.eq(object[index], value);
    }
    return false;
}

exports.isIterateeCall = isIterateeCall;
