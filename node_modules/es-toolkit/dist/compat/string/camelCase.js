'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const camelCase$1 = require('../../string/camelCase.js');
const normalizeForCase = require('../_internal/normalizeForCase.js');

function camelCase(str) {
    return camelCase$1.camelCase(normalizeForCase.normalizeForCase(str));
}

exports.camelCase = camelCase;
