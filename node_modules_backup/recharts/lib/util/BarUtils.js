"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BarRectangle = BarRectangle;
exports.minPointSizeCallback = void 0;
var React = _interopRequireWildcard(require("react"));
var _tinyInvariant = _interopRequireDefault(require("tiny-invariant"));
var _ActiveShapeUtils = require("./ActiveShapeUtils");
var _DataUtils = require("./DataUtils");
var _excluded = ["x", "y"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
// Rectangle props is expecting x, y, height, width as numbers, name as a string, and radius as a custom type
// When props are being spread in from a user defined component in Bar,
// the prop types of an SVGElement have these typed as something else.
// This function will return the passed in props
// along with x, y, height as numbers, name as a string, and radius as number | [number, number, number, number]
function typeguardBarRectangleProps(_ref, props) {
  var {
      x: xProp,
      y: yProp
    } = _ref,
    option = _objectWithoutProperties(_ref, _excluded);
  var xValue = "".concat(xProp);
  var x = parseInt(xValue, 10);
  var yValue = "".concat(yProp);
  var y = parseInt(yValue, 10);
  var heightValue = "".concat(props.height || option.height);
  var height = parseInt(heightValue, 10);
  var widthValue = "".concat(props.width || option.width);
  var width = parseInt(widthValue, 10);
  return _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, props), option), x ? {
    x
  } : {}), y ? {
    y
  } : {}), {}, {
    height,
    width,
    name: props.name,
    radius: props.radius
  });
}
function BarRectangle(props) {
  return /*#__PURE__*/React.createElement(_ActiveShapeUtils.Shape, _extends({
    shapeType: "rectangle",
    propTransformer: typeguardBarRectangleProps,
    activeClassName: "recharts-active-bar"
  }, props));
}
/**
 * Safely gets minPointSize from the minPointSize prop if it is a function
 * @param minPointSize minPointSize as passed to the Bar component
 * @param defaultValue default minPointSize
 * @returns minPointSize
 */
var minPointSizeCallback = exports.minPointSizeCallback = function minPointSizeCallback(minPointSize) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return (value, index) => {
    if ((0, _DataUtils.isNumber)(minPointSize)) return minPointSize;
    var isValueNumberOrNil = (0, _DataUtils.isNumber)(value) || (0, _DataUtils.isNullish)(value);
    if (isValueNumberOrNil) {
      return minPointSize(value, index);
    }
    !isValueNumberOrNil ? process.env.NODE_ENV !== "production" ? (0, _tinyInvariant.default)(false, "minPointSize callback function received a value with type of ".concat(typeof value, ". Currently only numbers or null/undefined are supported.")) : (0, _tinyInvariant.default)(false) : void 0;
    return defaultValue;
  };
};