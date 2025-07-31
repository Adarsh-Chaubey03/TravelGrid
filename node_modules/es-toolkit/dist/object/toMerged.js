'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const cloneDeep = require('./cloneDeep.js');
const merge = require('./merge.js');

function toMerged(target, source) {
    return merge.merge(cloneDeep.cloneDeep(target), source);
}

exports.toMerged = toMerged;
