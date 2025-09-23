"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XAxis = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _clsx = require("clsx");
var _CartesianAxis = require("./CartesianAxis");
var _hooks = require("../state/hooks");
var _cartesianAxisSlice = require("../state/cartesianAxisSlice");
var _axisSelectors = require("../state/selectors/axisSelectors");
var _selectChartOffsetInternal = require("../state/selectors/selectChartOffsetInternal");
var _PanoramaContext = require("../context/PanoramaContext");
var _excluded = ["children"],
  _excluded2 = ["dangerouslySetInnerHTML", "ticks"];
/**
 * @fileOverview X Axis
 */
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function SetXAxisSettings(props) {
  var dispatch = (0, _hooks.useAppDispatch)();
  var settings = (0, _react.useMemo)(() => {
    var {
        children
      } = props,
      rest = _objectWithoutProperties(props, _excluded);
    return rest;
  }, [props]);
  var synchronizedSettings = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectXAxisSettings)(state, settings.id));
  var settingsAreSynchronized = settings === synchronizedSettings;
  (0, _react.useEffect)(() => {
    dispatch((0, _cartesianAxisSlice.addXAxis)(settings));
    return () => {
      dispatch((0, _cartesianAxisSlice.removeXAxis)(settings));
    };
  }, [settings, dispatch]);
  if (settingsAreSynchronized) {
    return props.children;
  }
  return null;
}
var XAxisImpl = props => {
  var {
    xAxisId,
    className
  } = props;
  var viewBox = (0, _hooks.useAppSelector)(_selectChartOffsetInternal.selectAxisViewBox);
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  var axisType = 'xAxis';
  var scale = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectAxisScale)(state, axisType, xAxisId, isPanorama));
  var cartesianTickItems = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectTicksOfAxis)(state, axisType, xAxisId, isPanorama));
  var axisSize = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectXAxisSize)(state, xAxisId));
  var position = (0, _hooks.useAppSelector)(state => (0, _axisSelectors.selectXAxisPosition)(state, xAxisId));
  if (axisSize == null || position == null) {
    return null;
  }
  var {
      dangerouslySetInnerHTML,
      ticks
    } = props,
    allOtherProps = _objectWithoutProperties(props, _excluded2);
  return /*#__PURE__*/React.createElement(_CartesianAxis.CartesianAxis, _extends({}, allOtherProps, {
    scale: scale,
    x: position.x,
    y: position.y,
    width: axisSize.width,
    height: axisSize.height,
    className: (0, _clsx.clsx)("recharts-".concat(axisType, " ").concat(axisType), className),
    viewBox: viewBox,
    ticks: cartesianTickItems
  }));
};
var XAxisSettingsDispatcher = props => {
  var _props$interval, _props$includeHidden, _props$angle, _props$minTickGap, _props$tick;
  return /*#__PURE__*/React.createElement(SetXAxisSettings, {
    interval: (_props$interval = props.interval) !== null && _props$interval !== void 0 ? _props$interval : 'preserveEnd',
    id: props.xAxisId,
    scale: props.scale,
    type: props.type,
    padding: props.padding,
    allowDataOverflow: props.allowDataOverflow,
    domain: props.domain,
    dataKey: props.dataKey,
    allowDuplicatedCategory: props.allowDuplicatedCategory,
    allowDecimals: props.allowDecimals,
    tickCount: props.tickCount,
    includeHidden: (_props$includeHidden = props.includeHidden) !== null && _props$includeHidden !== void 0 ? _props$includeHidden : false,
    reversed: props.reversed,
    ticks: props.ticks,
    height: props.height,
    orientation: props.orientation,
    mirror: props.mirror,
    hide: props.hide,
    unit: props.unit,
    name: props.name,
    angle: (_props$angle = props.angle) !== null && _props$angle !== void 0 ? _props$angle : 0,
    minTickGap: (_props$minTickGap = props.minTickGap) !== null && _props$minTickGap !== void 0 ? _props$minTickGap : 5,
    tick: (_props$tick = props.tick) !== null && _props$tick !== void 0 ? _props$tick : true,
    tickFormatter: props.tickFormatter
  }, /*#__PURE__*/React.createElement(XAxisImpl, props));
};

// eslint-disable-next-line react/prefer-stateless-function
class XAxis extends _react.Component {
  render() {
    return /*#__PURE__*/React.createElement(XAxisSettingsDispatcher, this.props);
  }
}
exports.XAxis = XAxis;
_defineProperty(XAxis, "displayName", 'XAxis');
_defineProperty(XAxis, "defaultProps", {
  allowDataOverflow: _axisSelectors.implicitXAxis.allowDataOverflow,
  allowDecimals: _axisSelectors.implicitXAxis.allowDecimals,
  allowDuplicatedCategory: _axisSelectors.implicitXAxis.allowDuplicatedCategory,
  height: _axisSelectors.implicitXAxis.height,
  hide: false,
  mirror: _axisSelectors.implicitXAxis.mirror,
  orientation: _axisSelectors.implicitXAxis.orientation,
  padding: _axisSelectors.implicitXAxis.padding,
  reversed: _axisSelectors.implicitXAxis.reversed,
  scale: _axisSelectors.implicitXAxis.scale,
  tickCount: _axisSelectors.implicitXAxis.tickCount,
  type: _axisSelectors.implicitXAxis.type,
  xAxisId: 0
});