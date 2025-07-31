import * as React from 'react';
import { forwardRef } from 'react';
import { arrayTooltipSearcher } from '../state/optionsSlice';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { PolarChart } from './PolarChart';
var allowedTooltipTypes = ['axis', 'item'];
var defaultProps = {
  layout: 'radial',
  startAngle: 0,
  endAngle: 360,
  cx: '50%',
  cy: '50%',
  innerRadius: 0,
  outerRadius: '80%'
};
export var RadialBarChart = /*#__PURE__*/forwardRef((props, ref) => {
  var propsWithDefaults = resolveDefaultProps(props, defaultProps);
  return /*#__PURE__*/React.createElement(PolarChart, {
    chartName: "RadialBarChart",
    defaultTooltipEventType: "axis",
    validateTooltipEventTypes: allowedTooltipTypes,
    tooltipPayloadSearcher: arrayTooltipSearcher,
    categoricalChartProps: propsWithDefaults,
    ref: ref
  });
});