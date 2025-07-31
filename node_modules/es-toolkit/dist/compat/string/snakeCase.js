'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const snakeCase$1 = require('../../string/snakeCase.js');
const normalizeForCase = require('../_internal/normalizeForCase.js');

function snakeCase(str) {
    return snakeCase$1.snakeCase(normalizeForCase.normalizeForCase(str));
}

exports.snakeCase = snakeCase;
