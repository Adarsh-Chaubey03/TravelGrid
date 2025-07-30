"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CartesianChart = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _RechartsStoreProvider = require("../state/RechartsStoreProvider");
var _chartDataContext = require("../context/chartDataContext");
var _ReportMainChartProps = require("../state/ReportMainChartProps");
var _ReportChartProps = require("../state/ReportChartProps");
var _CategoricalChart = require("./CategoricalChart");
var _resolveDefaultProps = require("../util/resolveDefaultProps");
var _isWellBehavedNumber = require("../util/isWellBehavedNumber");
var _excluded = ["width", "height"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var defaultMargin = {
  top: 5,
  right: 5,
  bottom: 5,
  left: 5
};
var defaultProps = {
  accessibilityLayer: true,
  layout: 'horizontal',
  stackOffset: 'none',
  barCategoryGap: '10%',
  barGap: 4,
  margin: defaultMargin,
  reverseStackOrder: false,
  syncMethod: 'index'
};

/**
 * These are one-time, immutable options that decide the chart's behavior.
 * Users who wish to call CartesianChart may decide to pass these options explicitly,
 * but usually we would expect that they use one of the convenience components like BarChart, LineChart, etc.
 */

var CartesianChart = exports.CartesianChart = /*#__PURE__*/(0, _react.forwardRef)(function CartesianChart(props, ref) {
  var _categoricalChartProp;
  var rootChartProps = (0, _resolveDefaultProps.resolveDefaultProps)(props.categoricalChartProps, defaultProps);
  var {
      width,
      height
    } = rootChartProps,
    otherCategoricalProps = _objectWithoutProperties(rootChartProps, _excluded);
  if (!(0, _isWellBehavedNumber.isPositiveNumber)(width) || !(0, _isWellBehavedNumber.isPositiveNumber)(height)) {
    return null;
  }
  var {
    chartName,
    defaultTooltipEventType,
    validateTooltipEventTypes,
    tooltipPayloadSearcher,
    categoricalChartProps
  } = props;
  var options = {
    chartName,
    defaultTooltipEventType,
    validateTooltipEventTypes,
    tooltipPayloadSearcher,
    eventEmitter: undefined
  };
  return /*#__PURE__*/React.createElement(_RechartsStoreProvider.RechartsStoreProvider, {
    preloadedState: {
      options
    },
    reduxStoreName: (_categoricalChartProp = categoricalChartProps.id) !== null && _categoricalChartProp !== void 0 ? _categoricalChartProp : chartName
  }, /*#__PURE__*/React.createElement(_chartDataContext.ChartDataContextProvider, {
    chartData: categoricalChartProps.data
  }), /*#__PURE__*/React.createElement(_ReportMainChartProps.ReportMainChartProps, {
    width: width,
    height: height,
    layout: rootChartProps.layout,
    margin: rootChartProps.margin
  }), /*#__PURE__*/React.createElement(_ReportChartProps.ReportChartProps, {
    accessibilityLayer: rootChartProps.accessibilityLayer,
    barCategoryGap: rootChartProps.barCategoryGap,
    maxBarSize: rootChartProps.maxBarSize,
    stackOffset: rootChartProps.stackOffset,
    barGap: rootChartProps.barGap,
    barSize: rootChartProps.barSize,
    syncId: rootChartProps.syncId,
    syncMethod: rootChartProps.syncMethod,
    className: rootChartProps.className
  }), /*#__PURE__*/React.createElement(_CategoricalChart.CategoricalChart, _extends({}, otherCategoricalProps, {
    width: width,
    height: height,
    ref: ref
  })));
});