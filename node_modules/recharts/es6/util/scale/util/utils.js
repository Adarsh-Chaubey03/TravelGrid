var identity = i => i;
export var PLACE_HOLDER = {
  '@@functional/placeholder': true
};
var isPlaceHolder = val => val === PLACE_HOLDER;
var curry0 = fn => function _curried() {
  if (arguments.length === 0 || arguments.length === 1 && isPlaceHolder(arguments.length <= 0 ? undefined : arguments[0])) {
    return _curried;
  }
  return fn(...arguments);
};
var curryN = (n, fn) => {
  if (n === 1) {
    return fn;
  }
  return curry0(function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var argsLength = args.filter(arg => arg !== PLACE_HOLDER).length;
    if (argsLength >= n) {
      return fn(...args);
    }
    return curryN(n - argsLength, curry0(function () {
      for (var _len2 = arguments.length, restArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        restArgs[_key2] = arguments[_key2];
      }
      var newArgs = args.map(arg => isPlaceHolder(arg) ? restArgs.shift() : arg);
      return fn(...newArgs, ...restArgs);
    }));
  });
};
export var curry = fn => curryN(fn.length, fn);
export var range = (begin, end) => {
  var arr = [];
  for (var i = begin; i < end; ++i) {
    arr[i - begin] = i;
  }
  return arr;
};
export var map = curry((fn, arr) => {
  if (Array.isArray(arr)) {
    return arr.map(fn);
  }
  return Object.keys(arr).map(key => arr[key]).map(fn);
});
export var compose = function compose() {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }
  if (!args.length) {
    return identity;
  }
  var fns = args.reverse();
  // first function can receive multiply arguments
  var firstFn = fns[0];
  var tailsFn = fns.slice(1);
  return function () {
    return tailsFn.reduce((res, fn) => fn(res), firstFn(...arguments));
  };
};
export var reverse = arr => {
  if (Array.isArray(arr)) {
    return arr.reverse();
  }

  // can be string
  return arr.split('').reverse().join('');
};
export var memoize = fn => {
  var lastArgs = null;
  var lastResult = null;
  return function () {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    if (lastArgs && args.every((val, i) => {
      var _lastArgs;
      return val === ((_lastArgs = lastArgs) === null || _lastArgs === void 0 ? void 0 : _lastArgs[i]);
    })) {
      return lastResult;
    }
    lastArgs = args;
    lastResult = fn(...args);
    return lastResult;
  };
};