'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const keysIn = require('./keysIn.js');
const eq = require('../util/eq.js');

function assignIn(object, ...sources) {
    for (let i = 0; i < sources.length; i++) {
        assignInImpl(object, sources[i]);
    }
    return object;
}
function assignInImpl(object, source) {
    const keys = keysIn.keysIn(source);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (!(key in object) || !eq.eq(object[key], source[key])) {
            object[key] = source[key];
        }
    }
}

exports.assignIn = assignIn;
