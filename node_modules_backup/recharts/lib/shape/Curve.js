"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPath = exports.Curve = void 0;
var React = _interopRequireWildcard(require("react"));
var _d3Shape = require("victory-vendor/d3-shape");
var _clsx = require("clsx");
var _types = require("../util/types");
var _ReactUtils = require("../util/ReactUtils");
var _DataUtils = require("../util/DataUtils");
var _isWellBehavedNumber = require("../util/isWellBehavedNumber");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @fileOverview Curve
 */
var CURVE_FACTORIES = {
  curveBasisClosed: _d3Shape.curveBasisClosed,
  curveBasisOpen: _d3Shape.curveBasisOpen,
  curveBasis: _d3Shape.curveBasis,
  curveBumpX: _d3Shape.curveBumpX,
  curveBumpY: _d3Shape.curveBumpY,
  curveLinearClosed: _d3Shape.curveLinearClosed,
  curveLinear: _d3Shape.curveLinear,
  curveMonotoneX: _d3Shape.curveMonotoneX,
  curveMonotoneY: _d3Shape.curveMonotoneY,
  curveNatural: _d3Shape.curveNatural,
  curveStep: _d3Shape.curveStep,
  curveStepAfter: _d3Shape.curveStepAfter,
  curveStepBefore: _d3Shape.curveStepBefore
};

/**
 * @deprecated use {@link Coordinate} instead
 * Duplicated with `Coordinate` in `util/types.ts`
 */

/**
 * @deprecated use {@link NullableCoordinate} instead
 * Duplicated with `NullableCoordinate` in `util/types.ts`
 */

var defined = p => (0, _isWellBehavedNumber.isWellBehavedNumber)(p.x) && (0, _isWellBehavedNumber.isWellBehavedNumber)(p.y);
var getX = p => p.x;
var getY = p => p.y;
var getCurveFactory = (type, layout) => {
  if (typeof type === 'function') {
    return type;
  }
  var name = "curve".concat((0, _DataUtils.upperFirst)(type));
  if ((name === 'curveMonotone' || name === 'curveBump') && layout) {
    return CURVE_FACTORIES["".concat(name).concat(layout === 'vertical' ? 'Y' : 'X')];
  }
  return CURVE_FACTORIES[name] || _d3Shape.curveLinear;
};
/**
 * Calculate the path of curve. Returns null if points is an empty array.
 * @return path or null
 */
var getPath = _ref => {
  var {
    type = 'linear',
    points = [],
    baseLine,
    layout,
    connectNulls = false
  } = _ref;
  var curveFactory = getCurveFactory(type, layout);
  var formatPoints = connectNulls ? points.filter(defined) : points;
  var lineFunction;
  if (Array.isArray(baseLine)) {
    var formatBaseLine = connectNulls ? baseLine.filter(base => defined(base)) : baseLine;
    var areaPoints = formatPoints.map((entry, index) => _objectSpread(_objectSpread({}, entry), {}, {
      base: formatBaseLine[index]
    }));
    if (layout === 'vertical') {
      lineFunction = (0, _d3Shape.area)().y(getY).x1(getX).x0(d => d.base.x);
    } else {
      lineFunction = (0, _d3Shape.area)().x(getX).y1(getY).y0(d => d.base.y);
    }
    lineFunction.defined(defined).curve(curveFactory);
    return lineFunction(areaPoints);
  }
  if (layout === 'vertical' && (0, _DataUtils.isNumber)(baseLine)) {
    lineFunction = (0, _d3Shape.area)().y(getY).x1(getX).x0(baseLine);
  } else if ((0, _DataUtils.isNumber)(baseLine)) {
    lineFunction = (0, _d3Shape.area)().x(getX).y1(getY).y0(baseLine);
  } else {
    lineFunction = (0, _d3Shape.line)().x(getX).y(getY);
  }
  lineFunction.defined(defined).curve(curveFactory);
  return lineFunction(formatPoints);
};
exports.getPath = getPath;
var Curve = props => {
  var {
    className,
    points,
    path,
    pathRef
  } = props;
  if ((!points || !points.length) && !path) {
    return null;
  }
  var realPath = points && points.length ? getPath(props) : path;
  return /*#__PURE__*/React.createElement("path", _extends({}, (0, _ReactUtils.filterProps)(props, false), (0, _types.adaptEventHandlers)(props), {
    className: (0, _clsx.clsx)('recharts-curve', className),
    d: realPath === null ? undefined : realPath,
    ref: pathRef
  }));
};
exports.Curve = Curve;