'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const upperCase$1 = require('../../string/upperCase.js');
const normalizeForCase = require('../_internal/normalizeForCase.js');

function upperCase(str) {
    return upperCase$1.upperCase(normalizeForCase.normalizeForCase(str));
}

exports.upperCase = upperCase;
