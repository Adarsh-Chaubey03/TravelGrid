'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const identity = require('../../function/identity.js');
const iteratee = require('../util/iteratee.js');

function find(source, _doesMatch = identity.identity, fromIndex = 0) {
    if (!source) {
        return undefined;
    }
    if (fromIndex < 0) {
        fromIndex = Math.max(source.length + fromIndex, 0);
    }
    const doesMatch = iteratee.iteratee(_doesMatch);
    if (typeof doesMatch === 'function' && !Array.isArray(source)) {
        const keys = Object.keys(source);
        for (let i = fromIndex; i < keys.length; i++) {
            const key = keys[i];
            const value = source[key];
            if (doesMatch(value, key, source)) {
                return value;
            }
        }
        return undefined;
    }
    const values = Array.isArray(source) ? source.slice(fromIndex) : Object.values(source).slice(fromIndex);
    return values.find(doesMatch);
}

exports.find = find;
