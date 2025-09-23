function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
export var rectWithPoints = (_ref, _ref2) => {
  var {
    x: x1,
    y: y1
  } = _ref;
  var {
    x: x2,
    y: y2
  } = _ref2;
  return {
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1)
  };
};

/**
 * Compute the x, y, width, and height of a box from two reference points.
 * @param  {Object} coords     x1, x2, y1, and y2
 * @return {Object} object
 */
export var rectWithCoords = _ref3 => {
  var {
    x1,
    y1,
    x2,
    y2
  } = _ref3;
  return rectWithPoints({
    x: x1,
    y: y1
  }, {
    x: x2,
    y: y2
  });
};
export class ScaleHelper {
  static create(obj) {
    return new ScaleHelper(obj);
  }
  constructor(scale) {
    this.scale = scale;
  }
  get domain() {
    return this.scale.domain;
  }
  get range() {
    return this.scale.range;
  }
  get rangeMin() {
    return this.range()[0];
  }
  get rangeMax() {
    return this.range()[1];
  }
  get bandwidth() {
    return this.scale.bandwidth;
  }
  apply(value) {
    var {
      bandAware,
      position
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (value === undefined) {
      return undefined;
    }
    if (position) {
      switch (position) {
        case 'start':
          {
            return this.scale(value);
          }
        case 'middle':
          {
            var offset = this.bandwidth ? this.bandwidth() / 2 : 0;
            return this.scale(value) + offset;
          }
        case 'end':
          {
            var _offset = this.bandwidth ? this.bandwidth() : 0;
            return this.scale(value) + _offset;
          }
        default:
          {
            return this.scale(value);
          }
      }
    }
    if (bandAware) {
      var _offset2 = this.bandwidth ? this.bandwidth() / 2 : 0;
      return this.scale(value) + _offset2;
    }
    return this.scale(value);
  }
  isInRange(value) {
    var range = this.range();
    var first = range[0];
    var last = range[range.length - 1];
    return first <= last ? value >= first && value <= last : value >= last && value <= first;
  }
}
_defineProperty(ScaleHelper, "EPS", 1e-4);
export var createLabeledScales = options => {
  var scales = Object.keys(options).reduce((res, key) => _objectSpread(_objectSpread({}, res), {}, {
    [key]: ScaleHelper.create(options[key])
  }), {});
  return _objectSpread(_objectSpread({}, scales), {}, {
    apply(coord) {
      var {
        bandAware,
        position
      } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return Object.fromEntries(Object.entries(coord).map(_ref4 => {
        var [label, value] = _ref4;
        return [label, scales[label].apply(value, {
          bandAware,
          position
        })];
      }));
    },
    isInRange(coord) {
      return Object.keys(coord).every(label => scales[label].isInRange(coord[label]));
    }
  });
};

/** Normalizes the angle so that 0 <= angle < 180.
 * @param {number} angle Angle in degrees.
 * @return {number} the normalized angle with a value of at least 0 and never greater or equal to 180. */
export function normalizeAngle(angle) {
  return (angle % 180 + 180) % 180;
}

/** Calculates the width of the largest horizontal line that fits inside a rectangle that is displayed at an angle.
 * @param {Object} size Width and height of the text in a horizontal position.
 * @param {number} angle Angle in degrees in which the text is displayed.
 * @return {number} The width of the largest horizontal line that fits inside a rectangle that is displayed at an angle.
 */
export var getAngledRectangleWidth = function getAngledRectangleWidth(_ref5) {
  var {
    width,
    height
  } = _ref5;
  var angle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Ensure angle is >= 0 && < 180
  var normalizedAngle = normalizeAngle(angle);
  var angleRadians = normalizedAngle * Math.PI / 180;

  /* Depending on the height and width of the rectangle, we may need to use different formulas to calculate the angled
   * width. This threshold defines when each formula should kick in. */
  var angleThreshold = Math.atan(height / width);
  var angledWidth = angleRadians > angleThreshold && angleRadians < Math.PI - angleThreshold ? height / Math.sin(angleRadians) : width / Math.cos(angleRadians);
  return Math.abs(angledWidth);
};