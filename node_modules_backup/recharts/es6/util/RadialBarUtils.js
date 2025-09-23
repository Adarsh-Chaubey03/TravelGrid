function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { Shape } from './ActiveShapeUtils';
export function parseCornerRadius(cornerRadius) {
  if (typeof cornerRadius === 'string') {
    return parseInt(cornerRadius, 10);
  }
  return cornerRadius;
}

// Sector props is expecting cx, cy as numbers.
// When props are being spread in from a user defined component in RadialBar,
// the prop types of an SVGElement have these typed as string | number.
// This function will return the passed in props along with cx, cy as numbers.
export function typeGuardSectorProps(option, props) {
  var cxValue = "".concat(props.cx || option.cx);
  var cx = Number(cxValue);
  var cyValue = "".concat(props.cy || option.cy);
  var cy = Number(cyValue);
  return _objectSpread(_objectSpread(_objectSpread({}, props), option), {}, {
    cx,
    cy
  });
}
export function RadialBarSector(props) {
  return /*#__PURE__*/React.createElement(Shape, _extends({
    shapeType: "sector",
    propTransformer: typeGuardSectorProps
  }, props));
}