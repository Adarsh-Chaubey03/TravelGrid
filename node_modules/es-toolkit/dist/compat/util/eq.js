'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

function eq(value, other) {
    return value === other || (Number.isNaN(value) && Number.isNaN(other));
}

exports.eq = eq;
