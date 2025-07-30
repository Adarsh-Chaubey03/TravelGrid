'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const mean = require('./mean.js');

function meanBy(items, getValue) {
    const nums = items.map(x => getValue(x));
    return mean.mean(nums);
}

exports.meanBy = meanBy;
