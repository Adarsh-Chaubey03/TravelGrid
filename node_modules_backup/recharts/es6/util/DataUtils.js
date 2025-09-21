import get from 'es-toolkit/compat/get';
export var mathSign = value => {
  if (value === 0) {
    return 0;
  }
  if (value > 0) {
    return 1;
  }
  return -1;
};
export var isNan = value => {
  // eslint-disable-next-line eqeqeq
  return typeof value == 'number' && value != +value;
};
export var isPercent = value => typeof value === 'string' && value.indexOf('%') === value.length - 1;
export var isNumber = value => (typeof value === 'number' || value instanceof Number) && !isNan(value);
export var isNumOrStr = value => isNumber(value) || typeof value === 'string';
var idCounter = 0;
export var uniqueId = prefix => {
  var id = ++idCounter;
  return "".concat(prefix || '').concat(id);
};

/**
 * Get percent value of a total value
 * @param {number|string} percent A percent
 * @param {number} totalValue     Total value
 * @param {number} defaultValue   The value returned when percent is undefined or invalid
 * @param {boolean} validate      If set to be true, the result will be validated
 * @return {number} value
 */
export var getPercentValue = function getPercentValue(percent, totalValue) {
  var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var validate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (!isNumber(percent) && typeof percent !== 'string') {
    return defaultValue;
  }
  var value;
  if (isPercent(percent)) {
    if (totalValue == null) {
      return defaultValue;
    }
    var index = percent.indexOf('%');
    value = totalValue * parseFloat(percent.slice(0, index)) / 100;
  } else {
    value = +percent;
  }
  if (isNan(value)) {
    value = defaultValue;
  }
  if (validate && totalValue != null && value > totalValue) {
    value = totalValue;
  }
  return value;
};
export var hasDuplicate = ary => {
  if (!Array.isArray(ary)) {
    return false;
  }
  var len = ary.length;
  var cache = {};
  for (var i = 0; i < len; i++) {
    if (!cache[ary[i]]) {
      cache[ary[i]] = true;
    } else {
      return true;
    }
  }
  return false;
};

/**
 * @deprecated instead use {@link interpolate}
 *  this function returns a function that is called immediately in all use-cases.
 *  Instead, use interpolate which returns a number and skips the anonymous function step.
 *  @param numberA The first number
 *  @param numberB The second number
 *  @return A function that returns the interpolated number
 */
export var interpolateNumber = (numberA, numberB) => {
  if (isNumber(numberA) && isNumber(numberB)) {
    return t => numberA + t * (numberB - numberA);
  }
  return () => numberB;
};
export function interpolate(start, end, t) {
  if (isNumber(start) && isNumber(end)) {
    return start + t * (end - start);
  }
  return end;
}
export function findEntryInArray(ary, specifiedKey, specifiedValue) {
  if (!ary || !ary.length) {
    return undefined;
  }
  return ary.find(entry => entry && (typeof specifiedKey === 'function' ? specifiedKey(entry) : get(entry, specifiedKey)) === specifiedValue);
}

/**
 * The least square linear regression
 * @param {Array} data The array of points
 * @returns {Object} The domain of x, and the parameter of linear function
 */
export var getLinearRegression = data => {
  if (!data || !data.length) {
    return null;
  }
  var len = data.length;
  var xsum = 0;
  var ysum = 0;
  var xysum = 0;
  var xxsum = 0;
  var xmin = Infinity;
  var xmax = -Infinity;
  var xcurrent = 0;
  var ycurrent = 0;
  for (var i = 0; i < len; i++) {
    xcurrent = data[i].cx || 0;
    ycurrent = data[i].cy || 0;
    xsum += xcurrent;
    ysum += ycurrent;
    xysum += xcurrent * ycurrent;
    xxsum += xcurrent * xcurrent;
    xmin = Math.min(xmin, xcurrent);
    xmax = Math.max(xmax, xcurrent);
  }
  var a = len * xxsum !== xsum * xsum ? (len * xysum - xsum * ysum) / (len * xxsum - xsum * xsum) : 0;
  return {
    xmin,
    xmax,
    a,
    b: (ysum - a * xsum) / len
  };
};
/**
 * Checks if the value is null or undefined
 * @param value The value to check
 * @returns true if the value is null or undefined
 */
export var isNullish = value => {
  return value === null || typeof value === 'undefined';
};

/**
 *Uppercase the first letter of a string
 * @param {string} value The string to uppercase
 * @returns {string} The uppercased string
 */
export var upperFirst = value => {
  if (isNullish(value)) {
    return value;
  }
  return "".concat(value.charAt(0).toUpperCase()).concat(value.slice(1));
};