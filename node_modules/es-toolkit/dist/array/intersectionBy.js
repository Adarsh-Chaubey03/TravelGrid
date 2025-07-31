'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

function intersectionBy(firstArr, secondArr, mapper) {
    const mappedSecondSet = new Set(secondArr.map(mapper));
    return firstArr.filter(item => mappedSecondSet.has(mapper(item)));
}

exports.intersectionBy = intersectionBy;
