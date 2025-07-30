'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const isPlainObject = require('../predicate/isPlainObject.js');

function defaultsDeep(target, ...sources) {
    target = Object(target);
    for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        if (source != null) {
            const stack = new WeakMap();
            defaultsDeepRecursive(target, source, stack);
        }
    }
    return target;
}
function defaultsDeepRecursive(target, source, stack) {
    for (const key in source) {
        const sourceValue = source[key];
        const targetValue = target[key];
        const targetHasKey = Object.hasOwn(target, key);
        if (!targetHasKey || targetValue === undefined) {
            if (stack.has(sourceValue)) {
                target[key] = stack.get(sourceValue);
            }
            else if (isPlainObject.isPlainObject(sourceValue)) {
                const newObj = {};
                stack.set(sourceValue, newObj);
                target[key] = newObj;
                defaultsDeepRecursive(newObj, sourceValue, stack);
            }
            else {
                target[key] = sourceValue;
            }
        }
        else if (isPlainObject.isPlainObject(targetValue) && isPlainObject.isPlainObject(sourceValue)) {
            const inStack = stack.has(sourceValue);
            if (!inStack || (inStack && stack.get(sourceValue) !== targetValue)) {
                stack.set(sourceValue, targetValue);
                defaultsDeepRecursive(targetValue, sourceValue, stack);
            }
        }
    }
}

exports.defaultsDeep = defaultsDeep;
