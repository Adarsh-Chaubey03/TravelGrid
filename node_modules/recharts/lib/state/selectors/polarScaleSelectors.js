"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectPolarGraphicalItemAxisTicks = exports.selectPolarCategoricalDomain = exports.selectPolarAxisTicks = exports.selectPolarAxisScale = exports.selectPolarAxis = void 0;
var _reselect = require("reselect");
var _axisSelectors = require("./axisSelectors");
var _polarAxisSelectors = require("./polarAxisSelectors");
var _chartLayoutContext = require("../../context/chartLayoutContext");
var _polarSelectors = require("./polarSelectors");
var _pickAxisType = require("./pickAxisType");
var selectPolarAxis = (state, axisType, axisId) => {
  switch (axisType) {
    case 'angleAxis':
      {
        return (0, _polarAxisSelectors.selectAngleAxis)(state, axisId);
      }
    case 'radiusAxis':
      {
        return (0, _polarAxisSelectors.selectRadiusAxis)(state, axisId);
      }
    default:
      {
        throw new Error("Unexpected axis type: ".concat(axisType));
      }
  }
};
exports.selectPolarAxis = selectPolarAxis;
var selectPolarAxisRangeWithReversed = (state, axisType, axisId) => {
  switch (axisType) {
    case 'angleAxis':
      {
        return (0, _polarAxisSelectors.selectAngleAxisRangeWithReversed)(state, axisId);
      }
    case 'radiusAxis':
      {
        return (0, _polarAxisSelectors.selectRadiusAxisRangeWithReversed)(state, axisId);
      }
    default:
      {
        throw new Error("Unexpected axis type: ".concat(axisType));
      }
  }
};
var selectPolarAxisScale = exports.selectPolarAxisScale = (0, _reselect.createSelector)([selectPolarAxis, _axisSelectors.selectRealScaleType, _polarSelectors.selectPolarAxisDomainIncludingNiceTicks, selectPolarAxisRangeWithReversed], _axisSelectors.combineScaleFunction);
var selectPolarCategoricalDomain = exports.selectPolarCategoricalDomain = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, _polarSelectors.selectPolarAppliedValues, _axisSelectors.selectAxisSettings, _pickAxisType.pickAxisType], _axisSelectors.combineCategoricalDomain);
var selectPolarAxisTicks = exports.selectPolarAxisTicks = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectPolarAxis, _axisSelectors.selectRealScaleType, selectPolarAxisScale, _polarSelectors.selectPolarNiceTicks, selectPolarAxisRangeWithReversed, _axisSelectors.selectDuplicateDomain, selectPolarCategoricalDomain, _pickAxisType.pickAxisType], _axisSelectors.combineAxisTicks);
var selectPolarGraphicalItemAxisTicks = exports.selectPolarGraphicalItemAxisTicks = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectPolarAxis, selectPolarAxisScale, selectPolarAxisRangeWithReversed, _axisSelectors.selectDuplicateDomain, selectPolarCategoricalDomain, _pickAxisType.pickAxisType], _axisSelectors.combineGraphicalItemTicks);