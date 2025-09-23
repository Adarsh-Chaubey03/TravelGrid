var _excluded = ["width", "height"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { forwardRef } from 'react';
import { RechartsStoreProvider } from '../state/RechartsStoreProvider';
import { ChartDataContextProvider } from '../context/chartDataContext';
import { ReportMainChartProps } from '../state/ReportMainChartProps';
import { ReportChartProps } from '../state/ReportChartProps';
import { CategoricalChart } from './CategoricalChart';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { isPositiveNumber } from '../util/isWellBehavedNumber';
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

export var CartesianChart = /*#__PURE__*/forwardRef(function CartesianChart(props, ref) {
  var _categoricalChartProp;
  var rootChartProps = resolveDefaultProps(props.categoricalChartProps, defaultProps);
  var {
      width,
      height
    } = rootChartProps,
    otherCategoricalProps = _objectWithoutProperties(rootChartProps, _excluded);
  if (!isPositiveNumber(width) || !isPositiveNumber(height)) {
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
  return /*#__PURE__*/React.createElement(RechartsStoreProvider, {
    preloadedState: {
      options
    },
    reduxStoreName: (_categoricalChartProp = categoricalChartProps.id) !== null && _categoricalChartProp !== void 0 ? _categoricalChartProp : chartName
  }, /*#__PURE__*/React.createElement(ChartDataContextProvider, {
    chartData: categoricalChartProps.data
  }), /*#__PURE__*/React.createElement(ReportMainChartProps, {
    width: width,
    height: height,
    layout: rootChartProps.layout,
    margin: rootChartProps.margin
  }), /*#__PURE__*/React.createElement(ReportChartProps, {
    accessibilityLayer: rootChartProps.accessibilityLayer,
    barCategoryGap: rootChartProps.barCategoryGap,
    maxBarSize: rootChartProps.maxBarSize,
    stackOffset: rootChartProps.stackOffset,
    barGap: rootChartProps.barGap,
    barSize: rootChartProps.barSize,
    syncId: rootChartProps.syncId,
    syncMethod: rootChartProps.syncMethod,
    className: rootChartProps.className
  }), /*#__PURE__*/React.createElement(CategoricalChart, _extends({}, otherCategoricalProps, {
    width: width,
    height: height,
    ref: ref
  })));
});