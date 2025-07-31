"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectTooltipGraphicalItemsData = exports.selectTooltipDisplayedData = exports.selectTooltipCategoricalDomain = exports.selectTooltipAxisType = exports.selectTooltipAxisTicks = exports.selectTooltipAxisScale = exports.selectTooltipAxisRealScaleType = exports.selectTooltipAxisRangeWithReverse = exports.selectTooltipAxisId = exports.selectTooltipAxisDomainIncludingNiceTicks = exports.selectTooltipAxisDomain = exports.selectTooltipAxis = exports.selectIsTooltipActive = exports.selectAllUnfilteredGraphicalItems = exports.selectAllGraphicalItemsSettings = exports.selectActiveTooltipPayload = exports.selectActiveTooltipIndex = exports.selectActiveTooltipDataPoints = exports.selectActiveTooltipDataKey = exports.selectActiveTooltipCoordinate = exports.selectActiveLabel = void 0;
var _reselect = require("reselect");
var _axisSelectors = require("./axisSelectors");
var _chartLayoutContext = require("../../context/chartLayoutContext");
var _ChartUtils = require("../../util/ChartUtils");
var _dataSelectors = require("./dataSelectors");
var _rootPropsSelectors = require("./rootPropsSelectors");
var _DataUtils = require("../../util/DataUtils");
var _combineAxisRangeWithReverse = require("./combiners/combineAxisRangeWithReverse");
var _selectTooltipEventType = require("./selectTooltipEventType");
var _combineActiveLabel = require("./combiners/combineActiveLabel");
var _selectTooltipSettings = require("./selectTooltipSettings");
var _combineTooltipInteractionState = require("./combiners/combineTooltipInteractionState");
var _combineActiveTooltipIndex = require("./combiners/combineActiveTooltipIndex");
var _combineCoordinateForDefaultIndex = require("./combiners/combineCoordinateForDefaultIndex");
var _containerSelectors = require("./containerSelectors");
var _selectChartOffsetInternal = require("./selectChartOffsetInternal");
var _combineTooltipPayloadConfigurations = require("./combiners/combineTooltipPayloadConfigurations");
var _selectTooltipPayloadSearcher = require("./selectTooltipPayloadSearcher");
var _selectTooltipState = require("./selectTooltipState");
var _combineTooltipPayload = require("./combiners/combineTooltipPayload");
var selectTooltipAxisType = state => {
  var layout = (0, _chartLayoutContext.selectChartLayout)(state);
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
exports.selectTooltipAxisType = selectTooltipAxisType;
var selectTooltipAxisId = state => state.tooltip.settings.axisId;
exports.selectTooltipAxisId = selectTooltipAxisId;
var selectTooltipAxis = state => {
  var axisType = selectTooltipAxisType(state);
  var axisId = selectTooltipAxisId(state);
  return (0, _axisSelectors.selectAxisSettings)(state, axisType, axisId);
};
exports.selectTooltipAxis = selectTooltipAxis;
var selectTooltipAxisRealScaleType = exports.selectTooltipAxisRealScaleType = (0, _reselect.createSelector)([selectTooltipAxis, _chartLayoutContext.selectChartLayout, _axisSelectors.selectHasBar, _rootPropsSelectors.selectChartName, selectTooltipAxisType], _axisSelectors.combineRealScaleType);
var selectAllUnfilteredGraphicalItems = exports.selectAllUnfilteredGraphicalItems = (0, _reselect.createSelector)([state => state.graphicalItems.cartesianItems, state => state.graphicalItems.polarItems], (cartesianItems, polarItems) => [...cartesianItems, ...polarItems]);
var selectTooltipAxisPredicate = (0, _reselect.createSelector)([selectTooltipAxisType, selectTooltipAxisId], _axisSelectors.itemAxisPredicate);
var selectAllGraphicalItemsSettings = exports.selectAllGraphicalItemsSettings = (0, _reselect.createSelector)([selectAllUnfilteredGraphicalItems, selectTooltipAxis, selectTooltipAxisPredicate], _axisSelectors.combineGraphicalItemsSettings);
var selectTooltipGraphicalItemsData = exports.selectTooltipGraphicalItemsData = (0, _reselect.createSelector)([selectAllGraphicalItemsSettings], _axisSelectors.combineGraphicalItemsData);

/**
 * Data for tooltip always use the data with indexes set by a Brush,
 * and never accept the isPanorama flag:
 * because Tooltip never displays inside the panorama anyway
 * so we don't need to worry what would happen there.
 */
var selectTooltipDisplayedData = exports.selectTooltipDisplayedData = (0, _reselect.createSelector)([selectTooltipGraphicalItemsData, _dataSelectors.selectChartDataWithIndexes], _axisSelectors.combineDisplayedData);
var selectAllTooltipAppliedValues = (0, _reselect.createSelector)([selectTooltipDisplayedData, selectTooltipAxis, selectAllGraphicalItemsSettings], _axisSelectors.combineAppliedValues);
var selectTooltipAxisDomainDefinition = (0, _reselect.createSelector)([selectTooltipAxis], _axisSelectors.getDomainDefinition);
var selectTooltipStackGroups = (0, _reselect.createSelector)([selectTooltipDisplayedData, selectAllGraphicalItemsSettings, _rootPropsSelectors.selectStackOffsetType], _axisSelectors.combineStackGroups);
var selectTooltipDomainOfStackGroups = (0, _reselect.createSelector)([selectTooltipStackGroups, _dataSelectors.selectChartDataWithIndexes, selectTooltipAxisType], _axisSelectors.combineDomainOfStackGroups);
var selectTooltipItemsSettingsExceptStacked = (0, _reselect.createSelector)([selectAllGraphicalItemsSettings], _axisSelectors.filterGraphicalNotStackedItems);
var selectTooltipAllAppliedNumericalValuesIncludingErrorValues = (0, _reselect.createSelector)([selectTooltipDisplayedData, selectTooltipAxis, selectTooltipItemsSettingsExceptStacked, selectTooltipAxisType], _axisSelectors.combineAppliedNumericalValuesIncludingErrorValues);
var selectReferenceDotsByTooltipAxis = (0, _reselect.createSelector)([_axisSelectors.selectReferenceDots, selectTooltipAxisType, selectTooltipAxisId], _axisSelectors.filterReferenceElements);
var selectTooltipReferenceDotsDomain = (0, _reselect.createSelector)([selectReferenceDotsByTooltipAxis, selectTooltipAxisType], _axisSelectors.combineDotsDomain);
var selectReferenceAreasByTooltipAxis = (0, _reselect.createSelector)([_axisSelectors.selectReferenceAreas, selectTooltipAxisType, selectTooltipAxisId], _axisSelectors.filterReferenceElements);
var selectTooltipReferenceAreasDomain = (0, _reselect.createSelector)([selectReferenceAreasByTooltipAxis, selectTooltipAxisType], _axisSelectors.combineAreasDomain);
var selectReferenceLinesByTooltipAxis = (0, _reselect.createSelector)([_axisSelectors.selectReferenceLines, selectTooltipAxisType, selectTooltipAxisId], _axisSelectors.filterReferenceElements);
var selectTooltipReferenceLinesDomain = (0, _reselect.createSelector)([selectReferenceLinesByTooltipAxis, selectTooltipAxisType], _axisSelectors.combineLinesDomain);
var selectTooltipReferenceElementsDomain = (0, _reselect.createSelector)([selectTooltipReferenceDotsDomain, selectTooltipReferenceLinesDomain, selectTooltipReferenceAreasDomain], _axisSelectors.mergeDomains);
var selectTooltipNumericalDomain = (0, _reselect.createSelector)([selectTooltipAxis, selectTooltipAxisDomainDefinition, selectTooltipDomainOfStackGroups, selectTooltipAllAppliedNumericalValuesIncludingErrorValues, selectTooltipReferenceElementsDomain], _axisSelectors.combineNumericalDomain);
var selectTooltipAxisDomain = exports.selectTooltipAxisDomain = (0, _reselect.createSelector)([selectTooltipAxis, _chartLayoutContext.selectChartLayout, selectTooltipDisplayedData, selectAllTooltipAppliedValues, _rootPropsSelectors.selectStackOffsetType, selectTooltipAxisType, selectTooltipNumericalDomain], _axisSelectors.combineAxisDomain);
var selectTooltipNiceTicks = (0, _reselect.createSelector)([selectTooltipAxisDomain, selectTooltipAxis, selectTooltipAxisRealScaleType], _axisSelectors.combineNiceTicks);
var selectTooltipAxisDomainIncludingNiceTicks = exports.selectTooltipAxisDomainIncludingNiceTicks = (0, _reselect.createSelector)([selectTooltipAxis, selectTooltipAxisDomain, selectTooltipNiceTicks, selectTooltipAxisType], _axisSelectors.combineAxisDomainWithNiceTicks);
var selectTooltipAxisRange = state => {
  var axisType = selectTooltipAxisType(state);
  var axisId = selectTooltipAxisId(state);
  var isPanorama = false; // Tooltip never displays in panorama so this is safe to assume
  return (0, _axisSelectors.selectAxisRange)(state, axisType, axisId, isPanorama);
};
var selectTooltipAxisRangeWithReverse = exports.selectTooltipAxisRangeWithReverse = (0, _reselect.createSelector)([selectTooltipAxis, selectTooltipAxisRange], _combineAxisRangeWithReverse.combineAxisRangeWithReverse);
var selectTooltipAxisScale = exports.selectTooltipAxisScale = (0, _reselect.createSelector)([selectTooltipAxis, selectTooltipAxisRealScaleType, selectTooltipAxisDomainIncludingNiceTicks, selectTooltipAxisRangeWithReverse], _axisSelectors.combineScaleFunction);
var selectTooltipDuplicateDomain = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectAllTooltipAppliedValues, selectTooltipAxis, selectTooltipAxisType], _axisSelectors.combineDuplicateDomain);
var selectTooltipCategoricalDomain = exports.selectTooltipCategoricalDomain = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectAllTooltipAppliedValues, selectTooltipAxis, selectTooltipAxisType], _axisSelectors.combineCategoricalDomain);
var combineTicksOfTooltipAxis = (layout, axis, realScaleType, scale, range, duplicateDomain, categoricalDomain, axisType) => {
  if (!axis) {
    return undefined;
  }
  var {
    type
  } = axis;
  var isCategorical = (0, _ChartUtils.isCategoricalAxis)(layout, axisType);
  if (!scale) {
    return undefined;
  }
  var offsetForBand = realScaleType === 'scaleBand' && scale.bandwidth ? scale.bandwidth() / 2 : 2;
  var offset = type === 'category' && scale.bandwidth ? scale.bandwidth() / offsetForBand : 0;
  offset = axisType === 'angleAxis' && range != null && (range === null || range === void 0 ? void 0 : range.length) >= 2 ? (0, _DataUtils.mathSign)(range[0] - range[1]) * 2 * offset : offset;

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
var selectTooltipAxisTicks = exports.selectTooltipAxisTicks = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectTooltipAxis, selectTooltipAxisRealScaleType, selectTooltipAxisScale, selectTooltipAxisRange, selectTooltipDuplicateDomain, selectTooltipCategoricalDomain, selectTooltipAxisType], combineTicksOfTooltipAxis);
var selectTooltipEventType = (0, _reselect.createSelector)([_selectTooltipEventType.selectDefaultTooltipEventType, _selectTooltipEventType.selectValidateTooltipEventTypes, _selectTooltipSettings.selectTooltipSettings], (defaultTooltipEventType, validateTooltipEventType, settings) => (0, _selectTooltipEventType.combineTooltipEventType)(settings.shared, defaultTooltipEventType, validateTooltipEventType));
var selectTooltipTrigger = state => state.tooltip.settings.trigger;
var selectDefaultIndex = state => state.tooltip.settings.defaultIndex;
var selectTooltipInteractionState = (0, _reselect.createSelector)([_selectTooltipState.selectTooltipState, selectTooltipEventType, selectTooltipTrigger, selectDefaultIndex], _combineTooltipInteractionState.combineTooltipInteractionState);
var selectActiveTooltipIndex = exports.selectActiveTooltipIndex = (0, _reselect.createSelector)([selectTooltipInteractionState, selectTooltipDisplayedData], _combineActiveTooltipIndex.combineActiveTooltipIndex);
var selectActiveLabel = exports.selectActiveLabel = (0, _reselect.createSelector)([selectTooltipAxisTicks, selectActiveTooltipIndex], _combineActiveLabel.combineActiveLabel);
var selectActiveTooltipDataKey = exports.selectActiveTooltipDataKey = (0, _reselect.createSelector)([selectTooltipInteractionState], tooltipInteraction => {
  if (!tooltipInteraction) {
    return undefined;
  }
  return tooltipInteraction.dataKey;
});
var selectTooltipPayloadConfigurations = (0, _reselect.createSelector)([_selectTooltipState.selectTooltipState, selectTooltipEventType, selectTooltipTrigger, selectDefaultIndex], _combineTooltipPayloadConfigurations.combineTooltipPayloadConfigurations);
var selectTooltipCoordinateForDefaultIndex = (0, _reselect.createSelector)([_containerSelectors.selectChartWidth, _containerSelectors.selectChartHeight, _chartLayoutContext.selectChartLayout, _selectChartOffsetInternal.selectChartOffsetInternal, selectTooltipAxisTicks, selectDefaultIndex, selectTooltipPayloadConfigurations, _selectTooltipPayloadSearcher.selectTooltipPayloadSearcher], _combineCoordinateForDefaultIndex.combineCoordinateForDefaultIndex);
var selectActiveTooltipCoordinate = exports.selectActiveTooltipCoordinate = (0, _reselect.createSelector)([selectTooltipInteractionState, selectTooltipCoordinateForDefaultIndex], (tooltipInteractionState, defaultIndexCoordinate) => {
  if (tooltipInteractionState !== null && tooltipInteractionState !== void 0 && tooltipInteractionState.coordinate) {
    return tooltipInteractionState.coordinate;
  }
  return defaultIndexCoordinate;
});
var selectIsTooltipActive = exports.selectIsTooltipActive = (0, _reselect.createSelector)([selectTooltipInteractionState], tooltipInteractionState => tooltipInteractionState.active);
var selectActiveTooltipPayload = exports.selectActiveTooltipPayload = (0, _reselect.createSelector)([selectTooltipPayloadConfigurations, selectActiveTooltipIndex, _dataSelectors.selectChartDataWithIndexes, selectTooltipAxis, selectActiveLabel, _selectTooltipPayloadSearcher.selectTooltipPayloadSearcher, selectTooltipEventType], _combineTooltipPayload.combineTooltipPayload);
var selectActiveTooltipDataPoints = exports.selectActiveTooltipDataPoints = (0, _reselect.createSelector)([selectActiveTooltipPayload], payload => {
  if (payload == null) {
    return undefined;
  }
  var dataPoints = payload.map(p => p.payload).filter(p => p != null);
  return Array.from(new Set(dataPoints));
});