import * as React from 'react';
import { forwardRef } from 'react';
import { arrayTooltipSearcher } from '../state/optionsSlice';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { PolarChart } from './PolarChart';
var allowedTooltipTypes = ['axis'];
var defaultProps = {
  layout: 'centric',
  startAngle: 90,
  endAngle: -270,
  cx: '50%',
  cy: '50%',
  innerRadius: 0,
  outerRadius: '80%'
};
export var RadarChart = /*#__PURE__*/forwardRef((props, ref) => {
  var propsWithDefaults = resolveDefaultProps(props, defaultProps);
  return /*#__PURE__*/React.createElement(PolarChart, {
    chartName: "RadarChart",
    defaultTooltipEventType: "axis",
    validateTooltipEventTypes: allowedTooltipTypes,
    tooltipPayloadSearcher: arrayTooltipSearcher,
    categoricalChartProps: propsWithDefaults,
    ref: ref
  });
});