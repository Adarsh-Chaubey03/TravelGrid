'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const sortedIndex = require('./sortedIndex.js');
const eq = require('../util/eq.js');

function sortedIndexOf(array, value) {
    if (!array?.length) {
        return -1;
    }
    const index = sortedIndex.sortedIndex(array, value);
    if (index < array.length && eq.eq(array[index], value)) {
        return index;
    }
    return -1;
}

exports.sortedIndexOf = sortedIndexOf;
