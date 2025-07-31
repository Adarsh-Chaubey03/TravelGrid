"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectRadiusAxisRangeWithReversed = exports.selectRadiusAxisRange = exports.selectRadiusAxis = exports.selectPolarViewBox = exports.selectPolarOptions = exports.selectOuterRadius = exports.selectMaxRadius = exports.selectAngleAxisRangeWithReversed = exports.selectAngleAxisRange = exports.selectAngleAxis = exports.implicitRadiusAxis = exports.implicitRadialBarRadiusAxis = exports.implicitRadialBarAngleAxis = exports.implicitAngleAxis = void 0;
var _reselect = require("reselect");
var _containerSelectors = require("./containerSelectors");
var _selectChartOffsetInternal = require("./selectChartOffsetInternal");
var _PolarUtils = require("../../util/PolarUtils");
var _DataUtils = require("../../util/DataUtils");
var _defaultPolarAngleAxisProps = require("../../polar/defaultPolarAngleAxisProps");
var _defaultPolarRadiusAxisProps = require("../../polar/defaultPolarRadiusAxisProps");
var _combineAxisRangeWithReverse = require("./combiners/combineAxisRangeWithReverse");
var _chartLayoutContext = require("../../context/chartLayoutContext");
var implicitAngleAxis = exports.implicitAngleAxis = {
  allowDataOverflow: false,
  allowDecimals: false,
  allowDuplicatedCategory: false,
  // defaultPolarAngleAxisProps.allowDuplicatedCategory has it set to true but the actual axis rendering ignores the prop because reasons,
  dataKey: undefined,
  domain: undefined,
  id: _defaultPolarAngleAxisProps.defaultPolarAngleAxisProps.angleAxisId,
  includeHidden: false,
  name: undefined,
  reversed: _defaultPolarAngleAxisProps.defaultPolarAngleAxisProps.reversed,
  scale: _defaultPolarAngleAxisProps.defaultPolarAngleAxisProps.scale,
  tick: _defaultPolarAngleAxisProps.defaultPolarAngleAxisProps.tick,
  tickCount: undefined,
  ticks: undefined,
  type: _defaultPolarAngleAxisProps.defaultPolarAngleAxisProps.type,
  unit: undefined
};
var implicitRadiusAxis = exports.implicitRadiusAxis = {
  allowDataOverflow: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.allowDataOverflow,
  allowDecimals: false,
  allowDuplicatedCategory: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.allowDuplicatedCategory,
  dataKey: undefined,
  domain: undefined,
  id: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.radiusAxisId,
  includeHidden: false,
  name: undefined,
  reversed: false,
  scale: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.scale,
  tick: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.tick,
  tickCount: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.tickCount,
  ticks: undefined,
  type: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.type,
  unit: undefined
};
var implicitRadialBarAngleAxis = exports.implicitRadialBarAngleAxis = {
  allowDataOverflow: false,
  allowDecimals: false,
  allowDuplicatedCategory: _defaultPolarAngleAxisProps.defaultPolarAngleAxisProps.allowDuplicatedCategory,
  dataKey: undefined,
  domain: undefined,
  id: _defaultPolarAngleAxisProps.defaultPolarAngleAxisProps.angleAxisId,
  includeHidden: false,
  name: undefined,
  reversed: false,
  scale: _defaultPolarAngleAxisProps.defaultPolarAngleAxisProps.scale,
  tick: _defaultPolarAngleAxisProps.defaultPolarAngleAxisProps.tick,
  tickCount: undefined,
  ticks: undefined,
  type: 'number',
  unit: undefined
};
var implicitRadialBarRadiusAxis = exports.implicitRadialBarRadiusAxis = {
  allowDataOverflow: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.allowDataOverflow,
  allowDecimals: false,
  allowDuplicatedCategory: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.allowDuplicatedCategory,
  dataKey: undefined,
  domain: undefined,
  id: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.radiusAxisId,
  includeHidden: false,
  name: undefined,
  reversed: false,
  scale: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.scale,
  tick: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.tick,
  tickCount: _defaultPolarRadiusAxisProps.defaultPolarRadiusAxisProps.tickCount,
  ticks: undefined,
  type: 'category',
  unit: undefined
};
var selectAngleAxis = (state, angleAxisId) => {
  if (state.polarAxis.angleAxis[angleAxisId] != null) {
    return state.polarAxis.angleAxis[angleAxisId];
  }
  if (state.layout.layoutType === 'radial') {
    return implicitRadialBarAngleAxis;
  }
  return implicitAngleAxis;
};
exports.selectAngleAxis = selectAngleAxis;
var selectRadiusAxis = (state, radiusAxisId) => {
  if (state.polarAxis.radiusAxis[radiusAxisId] != null) {
    return state.polarAxis.radiusAxis[radiusAxisId];
  }
  if (state.layout.layoutType === 'radial') {
    return implicitRadialBarRadiusAxis;
  }
  return implicitRadiusAxis;
};
exports.selectRadiusAxis = selectRadiusAxis;
var selectPolarOptions = state => state.polarOptions;
exports.selectPolarOptions = selectPolarOptions;
var selectMaxRadius = exports.selectMaxRadius = (0, _reselect.createSelector)([_containerSelectors.selectChartWidth, _containerSelectors.selectChartHeight, _selectChartOffsetInternal.selectChartOffsetInternal], _PolarUtils.getMaxRadius);
var selectInnerRadius = (0, _reselect.createSelector)([selectPolarOptions, selectMaxRadius], (polarChartOptions, maxRadius) => {
  if (polarChartOptions == null) {
    return undefined;
  }
  return (0, _DataUtils.getPercentValue)(polarChartOptions.innerRadius, maxRadius, 0);
});
var selectOuterRadius = exports.selectOuterRadius = (0, _reselect.createSelector)([selectPolarOptions, selectMaxRadius], (polarChartOptions, maxRadius) => {
  if (polarChartOptions == null) {
    return undefined;
  }
  return (0, _DataUtils.getPercentValue)(polarChartOptions.outerRadius, maxRadius, maxRadius * 0.8);
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
var selectAngleAxisRange = exports.selectAngleAxisRange = (0, _reselect.createSelector)([selectPolarOptions], combineAngleAxisRange);
var selectAngleAxisRangeWithReversed = exports.selectAngleAxisRangeWithReversed = (0, _reselect.createSelector)([selectAngleAxis, selectAngleAxisRange], _combineAxisRangeWithReverse.combineAxisRangeWithReverse);
var selectRadiusAxisRange = exports.selectRadiusAxisRange = (0, _reselect.createSelector)([selectMaxRadius, selectInnerRadius, selectOuterRadius], (maxRadius, innerRadius, outerRadius) => {
  if (maxRadius == null || innerRadius == null || outerRadius == null) {
    return undefined;
  }
  return [innerRadius, outerRadius];
});
var selectRadiusAxisRangeWithReversed = exports.selectRadiusAxisRangeWithReversed = (0, _reselect.createSelector)([selectRadiusAxis, selectRadiusAxisRange], _combineAxisRangeWithReverse.combineAxisRangeWithReverse);
var selectPolarViewBox = exports.selectPolarViewBox = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectPolarOptions, selectInnerRadius, selectOuterRadius, _containerSelectors.selectChartWidth, _containerSelectors.selectChartHeight], (layout, polarOptions, innerRadius, outerRadius, width, height) => {
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
    cx: (0, _DataUtils.getPercentValue)(cx, width, width / 2),
    cy: (0, _DataUtils.getPercentValue)(cy, height, height / 2),
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    clockWise: false
  };
});