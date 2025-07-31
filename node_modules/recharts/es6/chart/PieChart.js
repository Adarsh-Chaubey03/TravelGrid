import * as React from 'react';
import { forwardRef } from 'react';
import { arrayTooltipSearcher } from '../state/optionsSlice';
import { PolarChart } from './PolarChart';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
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
export var PieChart = /*#__PURE__*/forwardRef((props, ref) => {
  var propsWithDefaults = resolveDefaultProps(props, defaultProps);
  return /*#__PURE__*/React.createElement(PolarChart, {
    chartName: "PieChart",
    defaultTooltipEventType: "item",
    validateTooltipEventTypes: allowedTooltipTypes,
    tooltipPayloadSearcher: arrayTooltipSearcher,
    categoricalChartProps: propsWithDefaults,
    ref: ref
  });
});