'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const unset = require('./unset.js');
const cloneDeep = require('../../object/cloneDeep.js');

function omit(obj, ...keysArr) {
    if (obj == null) {
        return {};
    }
    const result = cloneDeep.cloneDeep(obj);
    for (let i = 0; i < keysArr.length; i++) {
        let keys = keysArr[i];
        switch (typeof keys) {
            case 'object': {
                if (!Array.isArray(keys)) {
                    keys = Array.from(keys);
                }
                for (let j = 0; j < keys.length; j++) {
                    const key = keys[j];
                    unset.unset(result, key);
                }
                break;
            }
            case 'string':
            case 'symbol':
            case 'number': {
                unset.unset(result, keys);
                break;
            }
        }
    }
    return result;
}

exports.omit = omit;
