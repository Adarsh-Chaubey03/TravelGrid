'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

function uniq(arr) {
    return Array.from(new Set(arr));
}

exports.uniq = uniq;
