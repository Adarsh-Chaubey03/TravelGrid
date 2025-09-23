"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReferenceArea = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _clsx = require("clsx");
var _Layer = require("../container/Layer");
var _Label = require("../component/Label");
var _CartesianUtils = require("../util/CartesianUtils");
var _DataUtils = require("../util/DataUtils");
var _Rectangle = require("../shape/Rectangle");
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
var getRect = (hasX1, hasX2, hasY1, hasY2, xAxisScale, yAxisScale, props) => {
  var {
    x1: xValue1,
    x2: xValue2,
    y1: yValue1,
    y2: yValue2
  } = props;
  if (xAxisScale == null || yAxisScale == null) {
    return null;
  }
  var scales = (0, _CartesianUtils.createLabeledScales)({
    x: xAxisScale,
    y: yAxisScale
  });
  var p1 = {
    x: hasX1 ? scales.x.apply(xValue1, {
      position: 'start'
    }) : scales.x.rangeMin,
    y: hasY1 ? scales.y.apply(yValue1, {
      position: 'start'
    }) : scales.y.rangeMin
  };
  var p2 = {
    x: hasX2 ? scales.x.apply(xValue2, {
      position: 'end'
    }) : scales.x.rangeMax,
    y: hasY2 ? scales.y.apply(yValue2, {
      position: 'end'
    }) : scales.y.rangeMax
  };
  if (props.ifOverflow === 'discard' && (!scales.isInRange(p1) || !scales.isInRange(p2))) {
    return null;
  }
  return (0, _CartesianUtils.rectWithPoints)(p1, p2);
};
var renderRect = (option, props) => {
  var rect;
  if (/*#__PURE__*/React.isValidElement(option)) {
    rect = /*#__PURE__*/React.cloneElement(option, props);
  } else if (typeof option === 'function') {
    rect = option(props);
  } else {
    rect = /*#__PURE__*/React.createElement(_Rectangle.Rectangle, _extends({}, props, {
      className: "recharts-reference-area-rect"
    }));
  }
  return rect;
};
function ReportReferenceArea(props) {
  var dispatch = (0, _hooks.useAppDispatch)();
  (0, _react.useEffect)(() => {
    dispatch((0, _referenceElementsSlice.addArea)(props));
    return () => {
      dispatch((0, _referenceElementsSlice.removeArea)(props));
    };
  });
  return null;
}
function ReferenceAreaImpl(props) {
  var {
    x1,
    x2,
    y1,
    y2,
    className,
    shape,
    xAxisId,
    yAxisId
  } = props;
  var clipPathId = (0, _ClipPathProvider.useClipPathId)();
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  var xAxisScale = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisScale)(state, 'xAxis', xAxisId, isPanorama));
  var yAxisScale = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisScale)(state, 'yAxis', yAxisId, isPanorama));
  if (xAxisScale == null || !yAxisScale == null) {
    return null;
  }
  var hasX1 = (0, _DataUtils.isNumOrStr)(x1);
  var hasX2 = (0, _DataUtils.isNumOrStr)(x2);
  var hasY1 = (0, _DataUtils.isNumOrStr)(y1);
  var hasY2 = (0, _DataUtils.isNumOrStr)(y2);
  if (!hasX1 && !hasX2 && !hasY1 && !hasY2 && !shape) {
    return null;
  }
  var rect = getRect(hasX1, hasX2, hasY1, hasY2, xAxisScale, yAxisScale, props);
  if (!rect && !shape) {
    return null;
  }
  var isOverflowHidden = props.ifOverflow === 'hidden';
  var clipPath = isOverflowHidden ? "url(#".concat(clipPathId, ")") : undefined;
  return /*#__PURE__*/React.createElement(_Layer.Layer, {
    className: (0, _clsx.clsx)('recharts-reference-area', className)
  }, renderRect(shape, _objectSpread(_objectSpread({
    clipPath
  }, (0, _ReactUtils.filterProps)(props, true)), rect)), _Label.Label.renderCallByParent(props, rect));
}
function ReferenceAreaSettingsDispatcher(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ReportReferenceArea, {
    yAxisId: props.yAxisId,
    xAxisId: props.xAxisId,
    ifOverflow: props.ifOverflow,
    x1: props.x1,
    x2: props.x2,
    y1: props.y1,
    y2: props.y2
  }), /*#__PURE__*/React.createElement(ReferenceAreaImpl, props));
}

// eslint-disable-next-line react/prefer-stateless-function
class ReferenceArea extends _react.Component {
  render() {
    return /*#__PURE__*/React.createElement(ReferenceAreaSettingsDispatcher, this.props);
  }
}
exports.ReferenceArea = ReferenceArea;
_defineProperty(ReferenceArea, "displayName", 'ReferenceArea');
_defineProperty(ReferenceArea, "defaultProps", {
  ifOverflow: 'discard',
  xAxisId: 0,
  yAxisId: 0,
  r: 10,
  fill: '#ccc',
  fillOpacity: 0.5,
  stroke: 'none',
  strokeWidth: 1
});