'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const cloneDeepWith$1 = require('../../object/cloneDeepWith.js');
const tags = require('../_internal/tags.js');

function cloneDeepWith(obj, customizer) {
    return cloneDeepWith$1.cloneDeepWith(obj, (value, key, object, stack) => {
        const cloned = customizer?.(value, key, object, stack);
        if (cloned != null) {
            return cloned;
        }
        if (typeof obj !== 'object') {
            return undefined;
        }
        switch (Object.prototype.toString.call(obj)) {
            case tags.numberTag:
            case tags.stringTag:
            case tags.booleanTag: {
                const result = new obj.constructor(obj?.valueOf());
                cloneDeepWith$1.copyProperties(result, obj);
                return result;
            }
            case tags.argumentsTag: {
                const result = {};
                cloneDeepWith$1.copyProperties(result, obj);
                result.length = obj.length;
                result[Symbol.iterator] = obj[Symbol.iterator];
                return result;
            }
            default: {
                return undefined;
            }
        }
    });
}

exports.cloneDeepWith = cloneDeepWith;
