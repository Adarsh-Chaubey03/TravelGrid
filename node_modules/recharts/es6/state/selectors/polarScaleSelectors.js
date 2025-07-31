import { createSelector } from 'reselect';
import { combineAxisTicks, combineCategoricalDomain, combineGraphicalItemTicks, combineScaleFunction, selectAxisSettings, selectDuplicateDomain, selectRealScaleType } from './axisSelectors';
import { selectAngleAxis, selectAngleAxisRangeWithReversed, selectRadiusAxis, selectRadiusAxisRangeWithReversed } from './polarAxisSelectors';
import { selectChartLayout } from '../../context/chartLayoutContext';
import { selectPolarAppliedValues, selectPolarAxisDomainIncludingNiceTicks, selectPolarNiceTicks } from './polarSelectors';
import { pickAxisType } from './pickAxisType';
export var selectPolarAxis = (state, axisType, axisId) => {
  switch (axisType) {
    case 'angleAxis':
      {
        return selectAngleAxis(state, axisId);
      }
    case 'radiusAxis':
      {
        return selectRadiusAxis(state, axisId);
      }
    default:
      {
        throw new Error("Unexpected axis type: ".concat(axisType));
      }
  }
};
var selectPolarAxisRangeWithReversed = (state, axisType, axisId) => {
  switch (axisType) {
    case 'angleAxis':
      {
        return selectAngleAxisRangeWithReversed(state, axisId);
      }
    case 'radiusAxis':
      {
        return selectRadiusAxisRangeWithReversed(state, axisId);
      }
    default:
      {
        throw new Error("Unexpected axis type: ".concat(axisType));
      }
  }
};
export var selectPolarAxisScale = createSelector([selectPolarAxis, selectRealScaleType, selectPolarAxisDomainIncludingNiceTicks, selectPolarAxisRangeWithReversed], combineScaleFunction);
export var selectPolarCategoricalDomain = createSelector([selectChartLayout, selectPolarAppliedValues, selectAxisSettings, pickAxisType], combineCategoricalDomain);
export var selectPolarAxisTicks = createSelector([selectChartLayout, selectPolarAxis, selectRealScaleType, selectPolarAxisScale, selectPolarNiceTicks, selectPolarAxisRangeWithReversed, selectDuplicateDomain, selectPolarCategoricalDomain, pickAxisType], combineAxisTicks);
export var selectPolarGraphicalItemAxisTicks = createSelector([selectChartLayout, selectPolarAxis, selectPolarAxisScale, selectPolarAxisRangeWithReversed, selectDuplicateDomain, selectPolarCategoricalDomain, pickAxisType], combineGraphicalItemTicks);