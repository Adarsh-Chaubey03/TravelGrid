import { createSelector } from 'reselect';
import { selectChartHeight, selectChartWidth } from './containerSelectors';
import { selectChartOffsetInternal } from './selectChartOffsetInternal';
import { getMaxRadius } from '../../util/PolarUtils';
import { getPercentValue } from '../../util/DataUtils';
import { defaultPolarAngleAxisProps } from '../../polar/defaultPolarAngleAxisProps';
import { defaultPolarRadiusAxisProps } from '../../polar/defaultPolarRadiusAxisProps';
import { combineAxisRangeWithReverse } from './combiners/combineAxisRangeWithReverse';
import { selectChartLayout } from '../../context/chartLayoutContext';
export var implicitAngleAxis = {
  allowDataOverflow: false,
  allowDecimals: false,
  allowDuplicatedCategory: false,
  // defaultPolarAngleAxisProps.allowDuplicatedCategory has it set to true but the actual axis rendering ignores the prop because reasons,
  dataKey: undefined,
  domain: undefined,
  id: defaultPolarAngleAxisProps.angleAxisId,
  includeHidden: false,
  name: undefined,
  reversed: defaultPolarAngleAxisProps.reversed,
  scale: defaultPolarAngleAxisProps.scale,
  tick: defaultPolarAngleAxisProps.tick,
  tickCount: undefined,
  ticks: undefined,
  type: defaultPolarAngleAxisProps.type,
  unit: undefined
};
export var implicitRadiusAxis = {
  allowDataOverflow: defaultPolarRadiusAxisProps.allowDataOverflow,
  allowDecimals: false,
  allowDuplicatedCategory: defaultPolarRadiusAxisProps.allowDuplicatedCategory,
  dataKey: undefined,
  domain: undefined,
  id: defaultPolarRadiusAxisProps.radiusAxisId,
  includeHidden: false,
  name: undefined,
  reversed: false,
  scale: defaultPolarRadiusAxisProps.scale,
  tick: defaultPolarRadiusAxisProps.tick,
  tickCount: defaultPolarRadiusAxisProps.tickCount,
  ticks: undefined,
  type: defaultPolarRadiusAxisProps.type,
  unit: undefined
};
export var implicitRadialBarAngleAxis = {
  allowDataOverflow: false,
  allowDecimals: false,
  allowDuplicatedCategory: defaultPolarAngleAxisProps.allowDuplicatedCategory,
  dataKey: undefined,
  domain: undefined,
  id: defaultPolarAngleAxisProps.angleAxisId,
  includeHidden: false,
  name: undefined,
  reversed: false,
  scale: defaultPolarAngleAxisProps.scale,
  tick: defaultPolarAngleAxisProps.tick,
  tickCount: undefined,
  ticks: undefined,
  type: 'number',
  unit: undefined
};
export var implicitRadialBarRadiusAxis = {
  allowDataOverflow: defaultPolarRadiusAxisProps.allowDataOverflow,
  allowDecimals: false,
  allowDuplicatedCategory: defaultPolarRadiusAxisProps.allowDuplicatedCategory,
  dataKey: undefined,
  domain: undefined,
  id: defaultPolarRadiusAxisProps.radiusAxisId,
  includeHidden: false,
  name: undefined,
  reversed: false,
  scale: defaultPolarRadiusAxisProps.scale,
  tick: defaultPolarRadiusAxisProps.tick,
  tickCount: defaultPolarRadiusAxisProps.tickCount,
  ticks: undefined,
  type: 'category',
  unit: undefined
};
export var selectAngleAxis = (state, angleAxisId) => {
  if (state.polarAxis.angleAxis[angleAxisId] != null) {
    return state.polarAxis.angleAxis[angleAxisId];
  }
  if (state.layout.layoutType === 'radial') {
    return implicitRadialBarAngleAxis;
  }
  return implicitAngleAxis;
};
export var selectRadiusAxis = (state, radiusAxisId) => {
  if (state.polarAxis.radiusAxis[radiusAxisId] != null) {
    return state.polarAxis.radiusAxis[radiusAxisId];
  }
  if (state.layout.layoutType === 'radial') {
    return implicitRadialBarRadiusAxis;
  }
  return implicitRadiusAxis;
};
export var selectPolarOptions = state => state.polarOptions;
export var selectMaxRadius = createSelector([selectChartWidth, selectChartHeight, selectChartOffsetInternal], getMaxRadius);
var selectInnerRadius = createSelector([selectPolarOptions, selectMaxRadius], (polarChartOptions, maxRadius) => {
  if (polarChartOptions == null) {
    return undefined;
  }
  return getPercentValue(polarChartOptions.innerRadius, maxRadius, 0);
});
export var selectOuterRadius = createSelector([selectPolarOptions, selectMaxRadius], (polarChartOptions, maxRadius) => {
  if (polarChartOptions == null) {
    return undefined;
  }
  return getPercentValue(polarChartOptions.outerRadius, maxRadius, maxRadius * 0.8);
});
var combineAngleAxisRange = polarOptions => {
  if (polarOptions == null) {
    return [0, 0];
  }
  var {
    startAngle,
    endAngle
  } = polarOptions;
  return [startAngle, endAngle];
};
export var selectAngleAxisRange = createSelector([selectPolarOptions], combineAngleAxisRange);
export var selectAngleAxisRangeWithReversed = createSelector([selectAngleAxis, selectAngleAxisRange], combineAxisRangeWithReverse);
export var selectRadiusAxisRange = createSelector([selectMaxRadius, selectInnerRadius, selectOuterRadius], (maxRadius, innerRadius, outerRadius) => {
  if (maxRadius == null || innerRadius == null || outerRadius == null) {
    return undefined;
  }
  return [innerRadius, outerRadius];
});
export var selectRadiusAxisRangeWithReversed = createSelector([selectRadiusAxis, selectRadiusAxisRange], combineAxisRangeWithReverse);
export var selectPolarViewBox = createSelector([selectChartLayout, selectPolarOptions, selectInnerRadius, selectOuterRadius, selectChartWidth, selectChartHeight], (layout, polarOptions, innerRadius, outerRadius, width, height) => {
  if (layout !== 'centric' && layout !== 'radial' || polarOptions == null || innerRadius == null || outerRadius == null) {
    return undefined;
  }
  var {
    cx,
    cy,
    startAngle,
    endAngle
  } = polarOptions;
  return {
    cx: getPercentValue(cx, width, width / 2),
    cy: getPercentValue(cy, height, height / 2),
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    clockWise: false
  };
});