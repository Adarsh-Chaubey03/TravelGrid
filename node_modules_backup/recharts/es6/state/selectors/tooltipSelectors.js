import { createSelector } from 'reselect';
import { combineAppliedNumericalValuesIncludingErrorValues, combineAppliedValues, combineAreasDomain, combineAxisDomain, combineAxisDomainWithNiceTicks, combineCategoricalDomain, combineDisplayedData, combineDomainOfStackGroups, combineDotsDomain, combineDuplicateDomain, combineGraphicalItemsData, combineGraphicalItemsSettings, combineLinesDomain, combineNiceTicks, combineNumericalDomain, combineRealScaleType, combineScaleFunction, combineStackGroups, filterGraphicalNotStackedItems, filterReferenceElements, getDomainDefinition, itemAxisPredicate, mergeDomains, selectAxisRange, selectAxisSettings, selectHasBar, selectReferenceAreas, selectReferenceDots, selectReferenceLines } from './axisSelectors';
import { selectChartLayout } from '../../context/chartLayoutContext';
import { isCategoricalAxis } from '../../util/ChartUtils';
import { selectChartDataWithIndexes } from './dataSelectors';
import { selectChartName, selectStackOffsetType } from './rootPropsSelectors';
import { mathSign } from '../../util/DataUtils';
import { combineAxisRangeWithReverse } from './combiners/combineAxisRangeWithReverse';
import { combineTooltipEventType, selectDefaultTooltipEventType, selectValidateTooltipEventTypes } from './selectTooltipEventType';
import { combineActiveLabel } from './combiners/combineActiveLabel';
import { selectTooltipSettings } from './selectTooltipSettings';
import { combineTooltipInteractionState } from './combiners/combineTooltipInteractionState';
import { combineActiveTooltipIndex } from './combiners/combineActiveTooltipIndex';
import { combineCoordinateForDefaultIndex } from './combiners/combineCoordinateForDefaultIndex';
import { selectChartHeight, selectChartWidth } from './containerSelectors';
import { selectChartOffsetInternal } from './selectChartOffsetInternal';
import { combineTooltipPayloadConfigurations } from './combiners/combineTooltipPayloadConfigurations';
import { selectTooltipPayloadSearcher } from './selectTooltipPayloadSearcher';
import { selectTooltipState } from './selectTooltipState';
import { combineTooltipPayload } from './combiners/combineTooltipPayload';
export var selectTooltipAxisType = state => {
  var layout = selectChartLayout(state);
  if (layout === 'horizontal') {
    return 'xAxis';
  }
  if (layout === 'vertical') {
    return 'yAxis';
  }
  if (layout === 'centric') {
    return 'angleAxis';
  }
  return 'radiusAxis';
};
export var selectTooltipAxisId = state => state.tooltip.settings.axisId;
export var selectTooltipAxis = state => {
  var axisType = selectTooltipAxisType(state);
  var axisId = selectTooltipAxisId(state);
  return selectAxisSettings(state, axisType, axisId);
};
export var selectTooltipAxisRealScaleType = createSelector([selectTooltipAxis, selectChartLayout, selectHasBar, selectChartName, selectTooltipAxisType], combineRealScaleType);
export var selectAllUnfilteredGraphicalItems = createSelector([state => state.graphicalItems.cartesianItems, state => state.graphicalItems.polarItems], (cartesianItems, polarItems) => [...cartesianItems, ...polarItems]);
var selectTooltipAxisPredicate = createSelector([selectTooltipAxisType, selectTooltipAxisId], itemAxisPredicate);
export var selectAllGraphicalItemsSettings = createSelector([selectAllUnfilteredGraphicalItems, selectTooltipAxis, selectTooltipAxisPredicate], combineGraphicalItemsSettings);
export var selectTooltipGraphicalItemsData = createSelector([selectAllGraphicalItemsSettings], combineGraphicalItemsData);

/**
 * Data for tooltip always use the data with indexes set by a Brush,
 * and never accept the isPanorama flag:
 * because Tooltip never displays inside the panorama anyway
 * so we don't need to worry what would happen there.
 */
export var selectTooltipDisplayedData = createSelector([selectTooltipGraphicalItemsData, selectChartDataWithIndexes], combineDisplayedData);
var selectAllTooltipAppliedValues = createSelector([selectTooltipDisplayedData, selectTooltipAxis, selectAllGraphicalItemsSettings], combineAppliedValues);
var selectTooltipAxisDomainDefinition = createSelector([selectTooltipAxis], getDomainDefinition);
var selectTooltipStackGroups = createSelector([selectTooltipDisplayedData, selectAllGraphicalItemsSettings, selectStackOffsetType], combineStackGroups);
var selectTooltipDomainOfStackGroups = createSelector([selectTooltipStackGroups, selectChartDataWithIndexes, selectTooltipAxisType], combineDomainOfStackGroups);
var selectTooltipItemsSettingsExceptStacked = createSelector([selectAllGraphicalItemsSettings], filterGraphicalNotStackedItems);
var selectTooltipAllAppliedNumericalValuesIncludingErrorValues = createSelector([selectTooltipDisplayedData, selectTooltipAxis, selectTooltipItemsSettingsExceptStacked, selectTooltipAxisType], combineAppliedNumericalValuesIncludingErrorValues);
var selectReferenceDotsByTooltipAxis = createSelector([selectReferenceDots, selectTooltipAxisType, selectTooltipAxisId], filterReferenceElements);
var selectTooltipReferenceDotsDomain = createSelector([selectReferenceDotsByTooltipAxis, selectTooltipAxisType], combineDotsDomain);
var selectReferenceAreasByTooltipAxis = createSelector([selectReferenceAreas, selectTooltipAxisType, selectTooltipAxisId], filterReferenceElements);
var selectTooltipReferenceAreasDomain = createSelector([selectReferenceAreasByTooltipAxis, selectTooltipAxisType], combineAreasDomain);
var selectReferenceLinesByTooltipAxis = createSelector([selectReferenceLines, selectTooltipAxisType, selectTooltipAxisId], filterReferenceElements);
var selectTooltipReferenceLinesDomain = createSelector([selectReferenceLinesByTooltipAxis, selectTooltipAxisType], combineLinesDomain);
var selectTooltipReferenceElementsDomain = createSelector([selectTooltipReferenceDotsDomain, selectTooltipReferenceLinesDomain, selectTooltipReferenceAreasDomain], mergeDomains);
var selectTooltipNumericalDomain = createSelector([selectTooltipAxis, selectTooltipAxisDomainDefinition, selectTooltipDomainOfStackGroups, selectTooltipAllAppliedNumericalValuesIncludingErrorValues, selectTooltipReferenceElementsDomain], combineNumericalDomain);
export var selectTooltipAxisDomain = createSelector([selectTooltipAxis, selectChartLayout, selectTooltipDisplayedData, selectAllTooltipAppliedValues, selectStackOffsetType, selectTooltipAxisType, selectTooltipNumericalDomain], combineAxisDomain);
var selectTooltipNiceTicks = createSelector([selectTooltipAxisDomain, selectTooltipAxis, selectTooltipAxisRealScaleType], combineNiceTicks);
export var selectTooltipAxisDomainIncludingNiceTicks = createSelector([selectTooltipAxis, selectTooltipAxisDomain, selectTooltipNiceTicks, selectTooltipAxisType], combineAxisDomainWithNiceTicks);
var selectTooltipAxisRange = state => {
  var axisType = selectTooltipAxisType(state);
  var axisId = selectTooltipAxisId(state);
  var isPanorama = false; // Tooltip never displays in panorama so this is safe to assume
  return selectAxisRange(state, axisType, axisId, isPanorama);
};
export var selectTooltipAxisRangeWithReverse = createSelector([selectTooltipAxis, selectTooltipAxisRange], combineAxisRangeWithReverse);
export var selectTooltipAxisScale = createSelector([selectTooltipAxis, selectTooltipAxisRealScaleType, selectTooltipAxisDomainIncludingNiceTicks, selectTooltipAxisRangeWithReverse], combineScaleFunction);
var selectTooltipDuplicateDomain = createSelector([selectChartLayout, selectAllTooltipAppliedValues, selectTooltipAxis, selectTooltipAxisType], combineDuplicateDomain);
export var selectTooltipCategoricalDomain = createSelector([selectChartLayout, selectAllTooltipAppliedValues, selectTooltipAxis, selectTooltipAxisType], combineCategoricalDomain);
var combineTicksOfTooltipAxis = (layout, axis, realScaleType, scale, range, duplicateDomain, categoricalDomain, axisType) => {
  if (!axis) {
    return undefined;
  }
  var {
    type
  } = axis;
  var isCategorical = isCategoricalAxis(layout, axisType);
  if (!scale) {
    return undefined;
  }
  var offsetForBand = realScaleType === 'scaleBand' && scale.bandwidth ? scale.bandwidth() / 2 : 2;
  var offset = type === 'category' && scale.bandwidth ? scale.bandwidth() / offsetForBand : 0;
  offset = axisType === 'angleAxis' && range != null && (range === null || range === void 0 ? void 0 : range.length) >= 2 ? mathSign(range[0] - range[1]) * 2 * offset : offset;

  // When axis is a categorical axis, but the type of axis is number or the scale of axis is not "auto"
  if (isCategorical && categoricalDomain) {
    return categoricalDomain.map((entry, index) => ({
      coordinate: scale(entry) + offset,
      value: entry,
      index,
      offset
    }));
  }

  // When axis has duplicated text, serial numbers are used to generate scale
  return scale.domain().map((entry, index) => ({
    coordinate: scale(entry) + offset,
    value: duplicateDomain ? duplicateDomain[entry] : entry,
    index,
    offset
  }));
};
export var selectTooltipAxisTicks = createSelector([selectChartLayout, selectTooltipAxis, selectTooltipAxisRealScaleType, selectTooltipAxisScale, selectTooltipAxisRange, selectTooltipDuplicateDomain, selectTooltipCategoricalDomain, selectTooltipAxisType], combineTicksOfTooltipAxis);
var selectTooltipEventType = createSelector([selectDefaultTooltipEventType, selectValidateTooltipEventTypes, selectTooltipSettings], (defaultTooltipEventType, validateTooltipEventType, settings) => combineTooltipEventType(settings.shared, defaultTooltipEventType, validateTooltipEventType));
var selectTooltipTrigger = state => state.tooltip.settings.trigger;
var selectDefaultIndex = state => state.tooltip.settings.defaultIndex;
var selectTooltipInteractionState = createSelector([selectTooltipState, selectTooltipEventType, selectTooltipTrigger, selectDefaultIndex], combineTooltipInteractionState);
export var selectActiveTooltipIndex = createSelector([selectTooltipInteractionState, selectTooltipDisplayedData], combineActiveTooltipIndex);
export var selectActiveLabel = createSelector([selectTooltipAxisTicks, selectActiveTooltipIndex], combineActiveLabel);
export var selectActiveTooltipDataKey = createSelector([selectTooltipInteractionState], tooltipInteraction => {
  if (!tooltipInteraction) {
    return undefined;
  }
  return tooltipInteraction.dataKey;
});
var selectTooltipPayloadConfigurations = createSelector([selectTooltipState, selectTooltipEventType, selectTooltipTrigger, selectDefaultIndex], combineTooltipPayloadConfigurations);
var selectTooltipCoordinateForDefaultIndex = createSelector([selectChartWidth, selectChartHeight, selectChartLayout, selectChartOffsetInternal, selectTooltipAxisTicks, selectDefaultIndex, selectTooltipPayloadConfigurations, selectTooltipPayloadSearcher], combineCoordinateForDefaultIndex);
export var selectActiveTooltipCoordinate = createSelector([selectTooltipInteractionState, selectTooltipCoordinateForDefaultIndex], (tooltipInteractionState, defaultIndexCoordinate) => {
  if (tooltipInteractionState !== null && tooltipInteractionState !== void 0 && tooltipInteractionState.coordinate) {
    return tooltipInteractionState.coordinate;
  }
  return defaultIndexCoordinate;
});
export var selectIsTooltipActive = createSelector([selectTooltipInteractionState], tooltipInteractionState => tooltipInteractionState.active);
export var selectActiveTooltipPayload = createSelector([selectTooltipPayloadConfigurations, selectActiveTooltipIndex, selectChartDataWithIndexes, selectTooltipAxis, selectActiveLabel, selectTooltipPayloadSearcher, selectTooltipEventType], combineTooltipPayload);
export var selectActiveTooltipDataPoints = createSelector([selectActiveTooltipPayload], payload => {
  if (payload == null) {
    return undefined;
  }
  var dataPoints = payload.map(p => p.payload).filter(p => p != null);
  return Array.from(new Set(dataPoints));
});