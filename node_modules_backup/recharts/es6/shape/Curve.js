function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @fileOverview Curve
 */
import * as React from 'react';
import { line as shapeLine, area as shapeArea, curveBasisClosed, curveBasisOpen, curveBasis, curveBumpX, curveBumpY, curveLinearClosed, curveLinear, curveMonotoneX, curveMonotoneY, curveNatural, curveStep, curveStepAfter, curveStepBefore } from 'victory-vendor/d3-shape';
import { clsx } from 'clsx';
import { adaptEventHandlers } from '../util/types';
import { filterProps } from '../util/ReactUtils';
import { isNumber, upperFirst } from '../util/DataUtils';
import { isWellBehavedNumber } from '../util/isWellBehavedNumber';
var CURVE_FACTORIES = {
  curveBasisClosed,
  curveBasisOpen,
  curveBasis,
  curveBumpX,
  curveBumpY,
  curveLinearClosed,
  curveLinear,
  curveMonotoneX,
  curveMonotoneY,
  curveNatural,
  curveStep,
  curveStepAfter,
  curveStepBefore
};

/**
 * @deprecated use {@link Coordinate} instead
 * Duplicated with `Coordinate` in `util/types.ts`
 */

/**
 * @deprecated use {@link NullableCoordinate} instead
 * Duplicated with `NullableCoordinate` in `util/types.ts`
 */

var defined = p => isWellBehavedNumber(p.x) && isWellBehavedNumber(p.y);
var getX = p => p.x;
var getY = p => p.y;
var getCurveFactory = (type, layout) => {
  if (typeof type === 'function') {
    return type;
  }
  var name = "curve".concat(upperFirst(type));
  if ((name === 'curveMonotone' || name === 'curveBump') && layout) {
    return CURVE_FACTORIES["".concat(name).concat(layout === 'vertical' ? 'Y' : 'X')];
  }
  return CURVE_FACTORIES[name] || curveLinear;
};
/**
 * Calculate the path of curve. Returns null if points is an empty array.
 * @return path or null
 */
export var getPath = _ref => {
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
      lineFunction = shapeArea().y(getY).x1(getX).x0(d => d.base.x);
    } else {
      lineFunction = shapeArea().x(getX).y1(getY).y0(d => d.base.y);
    }
    lineFunction.defined(defined).curve(curveFactory);
    return lineFunction(areaPoints);
  }
  if (layout === 'vertical' && isNumber(baseLine)) {
    lineFunction = shapeArea().y(getY).x1(getX).x0(baseLine);
  } else if (isNumber(baseLine)) {
    lineFunction = shapeArea().x(getX).y1(getY).y0(baseLine);
  } else {
    lineFunction = shapeLine().x(getX).y(getY);
  }
  lineFunction.defined(defined).curve(curveFactory);
  return lineFunction(formatPoints);
};
export var Curve = props => {
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
  return /*#__PURE__*/React.createElement("path", _extends({}, filterProps(props, false), adaptEventHandlers(props), {
    className: clsx('recharts-curve', className),
    d: realPath === null ? undefined : realPath,
    ref: pathRef
  }));
};