'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const flattenDepth = require('./flattenDepth.js');
const uniq = require('../../array/uniq.js');
const isArrayLikeObject = require('../predicate/isArrayLikeObject.js');

function union(...arrays) {
    const validArrays = arrays.filter(isArrayLikeObject.isArrayLikeObject);
    const flattened = flattenDepth.flattenDepth(validArrays, 1);
    return uniq.uniq(flattened);
}

exports.union = union;
