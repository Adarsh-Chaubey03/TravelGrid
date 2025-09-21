"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PieChart = void 0;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _optionsSlice = require("../state/optionsSlice");
var _PolarChart = require("./PolarChart");
var _resolveDefaultProps = require("../util/resolveDefaultProps");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
var allowedTooltipTypes = ['item'];
var defaultProps = {
  layout: 'centric',
  startAngle: 0,
  endAngle: 360,
  cx: '50%',
  cy: '50%',
  innerRadius: 0,
  outerRadius: '80%'
};
var PieChart = exports.PieChart = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  var propsWithDefaults = (0, _resolveDefaultProps.resolveDefaultProps)(props, defaultProps);
  return /*#__PURE__*/React.createElement(_PolarChart.PolarChart, {
    chartName: "PieChart",
    defaultTooltipEventType: "item",
    validateTooltipEventTypes: allowedTooltipTypes,
    tooltipPayloadSearcher: _optionsSlice.arrayTooltipSearcher,
    categoricalChartProps: propsWithDefaults,
    ref: ref
  });
});