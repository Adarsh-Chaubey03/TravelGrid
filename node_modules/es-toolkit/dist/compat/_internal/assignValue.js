'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const eq = require('../util/eq.js');

const assignValue = (object, key, value) => {
    const objValue = object[key];
    if (!(Object.hasOwn(object, key) && eq.eq(objValue, value)) || (value === undefined && !(key in object))) {
        object[key] = value;
    }
};

exports.assignValue = assignValue;
