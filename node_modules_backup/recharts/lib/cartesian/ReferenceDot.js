"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReferenceDot = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _clsx = require("clsx");
var _Layer = require("../container/Layer");
var _Dot = require("../shape/Dot");
var _Label = require("../component/Label");
var _DataUtils = require("../util/DataUtils");
var _CartesianUtils = require("../util/CartesianUtils");
var _ReactUtils = require("../util/ReactUtils");
var _referenceElementsSlice = require("../state/referenceElementsSlice");
var _hooks = require("../state/hooks");
var _axisSelectors = require("../state/selectors/axisSelectors");
var _PanoramaContext = require("../context/PanoramaContext");
var _ClipPathProvider = require("../container/ClipPathProvider");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
var useCoordinate = (x, y, xAxisId, yAxisId, ifOverflow) => {
  var isX = (0, _DataUtils.isNumOrStr)(x);
  var isY = (0, _DataUtils.isNumOrStr)(y);
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  var xAxisScale = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisScale)(state, 'xAxis', xAxisId, isPanorama));
  var yAxisScale = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisScale)(state, 'yAxis', yAxisId, isPanorama));
  if (!isX || !isY || xAxisScale == null || yAxisScale == null) {
    return null;
  }
  var scales = (0, _CartesianUtils.createLabeledScales)({
    x: xAxisScale,
    y: yAxisScale
  });
  var result = scales.apply({
    x,
    y
  }, {
    bandAware: true
  });
  if (ifOverflow === 'discard' && !scales.isInRange(result)) {
    return null;
  }
  return result;
};
function ReportReferenceDot(props) {
  var dispatch = (0, _hooks.useAppDispatch)();
  (0, _react.useEffect)(() => {
    dispatch((0, _referenceElementsSlice.addDot)(props));
    return () => {
      dispatch((0, _referenceElementsSlice.removeDot)(props));
    };
  });
  return null;
}
var renderDot = (option, props) => {
  var dot;
  if (/*#__PURE__*/React.isValidElement(option)) {
    dot = /*#__PURE__*/React.cloneElement(option, props);
  } else if (typeof option === 'function') {
    dot = option(props);
  } else {
    dot = /*#__PURE__*/React.createElement(_Dot.Dot, _extends({}, props, {
      cx: props.cx,
      cy: props.cy,
      className: "recharts-reference-dot-dot"
    }));
  }
  return dot;
};
function ReferenceDotImpl(props) {
  var {
    x,
    y,
    r
  } = props;
  var clipPathId = (0, _ClipPathProvider.useClipPathId)();
  var coordinate = useCoordinate(x, y, props.xAxisId, props.yAxisId, props.ifOverflow);
  if (!coordinate) {
    return null;
  }
  var {
    x: cx,
    y: cy
  } = coordinate;
  var {
    shape,
    className,
    ifOverflow
  } = props;
  var clipPath = ifOverflow === 'hidden' ? "url(#".concat(clipPathId, ")") : undefined;
  var dotProps = _objectSpread(_objectSpread({
    clipPath
  }, (0, _ReactUtils.filterProps)(props, true)), {}, {
    cx,
    cy
  });
  return /*#__PURE__*/React.createElement(_Layer.Layer, {
    className: (0, _clsx.clsx)('recharts-reference-dot', className)
  }, renderDot(shape, dotProps), _Label.Label.renderCallByParent(props, {
    x: cx - r,
    y: cy - r,
    width: 2 * r,
    height: 2 * r
  }));
}
function ReferenceDotSettingsDispatcher(props) {
  var {
    x,
    y,
    r,
    ifOverflow,
    yAxisId,
    xAxisId
  } = props;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ReportReferenceDot, {
    y: y,
    x: x,
    r: r,
    yAxisId: yAxisId,
    xAxisId: xAxisId,
    ifOverflow: ifOverflow
  }), /*#__PURE__*/React.createElement(ReferenceDotImpl, props));
}

// eslint-disable-next-line react/prefer-stateless-function
class ReferenceDot extends _react.Component {
  render() {
    return /*#__PURE__*/React.createElement(ReferenceDotSettingsDispatcher, this.props);
  }
}
exports.ReferenceDot = ReferenceDot;
_defineProperty(ReferenceDot, "displayName", 'ReferenceDot');
_defineProperty(ReferenceDot, "defaultProps", {
  ifOverflow: 'discard',
  xAxisId: 0,
  yAxisId: 0,
  r: 10,
  fill: '#fff',
  stroke: '#ccc',
  fillOpacity: 1,
  strokeWidth: 1
});