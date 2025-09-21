"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectArea = void 0;
var _reselect = require("reselect");
var _Area = require("../../cartesian/Area");
var _axisSelectors = require("./axisSelectors");
var _chartLayoutContext = require("../../context/chartLayoutContext");
var _dataSelectors = require("./dataSelectors");
var _ChartUtils = require("../../util/ChartUtils");
var selectXAxisWithScale = (state, xAxisId, _yAxisId, isPanorama) => (0, _axisSelectors.selectAxisWithScale)(state, 'xAxis', xAxisId, isPanorama);
var selectXAxisTicks = (state, xAxisId, _yAxisId, isPanorama) => (0, _axisSelectors.selectTicksOfGraphicalItem)(state, 'xAxis', xAxisId, isPanorama);
var selectYAxisWithScale = (state, _xAxisId, yAxisId, isPanorama) => (0, _axisSelectors.selectAxisWithScale)(state, 'yAxis', yAxisId, isPanorama);
var selectYAxisTicks = (state, _xAxisId, yAxisId, isPanorama) => (0, _axisSelectors.selectTicksOfGraphicalItem)(state, 'yAxis', yAxisId, isPanorama);
var selectBandSize = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectXAxisWithScale, selectYAxisWithScale, selectXAxisTicks, selectYAxisTicks], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks) => {
  if ((0, _ChartUtils.isCategoricalAxis)(layout, 'xAxis')) {
    return (0, _ChartUtils.getBandSizeOfAxis)(xAxis, xAxisTicks, false);
  }
  return (0, _ChartUtils.getBandSizeOfAxis)(yAxis, yAxisTicks, false);
});
var selectGraphicalItemStackedData = (state, xAxisId, yAxisId, isPanorama, areaSettings) => {
  var _stackGroups$stackId;
  var layout = (0, _chartLayoutContext.selectChartLayout)(state);
  var isXAxisCategorical = (0, _ChartUtils.isCategoricalAxis)(layout, 'xAxis');
  var stackGroups;
  if (isXAxisCategorical) {
    stackGroups = (0, _axisSelectors.selectStackGroups)(state, 'yAxis', yAxisId, isPanorama);
  } else {
    stackGroups = (0, _axisSelectors.selectStackGroups)(state, 'xAxis', xAxisId, isPanorama);
  }
  if (stackGroups == null) {
    return undefined;
  }
  var {
    dataKey,
    stackId
  } = areaSettings;
  if (stackId == null) {
    return undefined;
  }
  var groups = (_stackGroups$stackId = stackGroups[stackId]) === null || _stackGroups$stackId === void 0 ? void 0 : _stackGroups$stackId.stackedData;
  return groups === null || groups === void 0 ? void 0 : groups.find(v => v.key === dataKey);
};
var pickAreaSettings = (_state, _xAxisId, _yAxisId, _isPanorama, areaSettings) => areaSettings;

/*
 * There is a race condition problem because we read some data from props and some from the state.
 * The state is updated through a dispatch and is one render behind,
 * and so we have this weird one tick render where the displayedData in one selector have the old dataKey
 * but the new dataKey in another selector.
 *
 * A proper fix is to either move everything into the state, or read the dataKey always from props
 * - but this is a smaller change.
 */
var selectSynchronisedAreaSettings = (0, _reselect.createSelector)([_axisSelectors.selectUnfilteredCartesianItems, pickAreaSettings], (graphicalItems, areaSettingsFromProps) => {
  if (graphicalItems.some(cgis => cgis.type === 'area' && areaSettingsFromProps.dataKey === cgis.dataKey && (0, _ChartUtils.getNormalizedStackId)(areaSettingsFromProps.stackId) === cgis.stackId && areaSettingsFromProps.data === cgis.data)) {
    /*
     * now, at least one of the areas has the same dataKey as the one in props.
     * Is this a perfect match? Maybe not because we could theoretically have two different Areas with the same dataKey
     * and the same stackId and the same data but still different areas, yes,
     * but the chances of that happening are ... lowish.
     *
     * A proper fix would be to store the areaSettings in a state too, and compare references directly instead of enumerating the properties.
     */
    return areaSettingsFromProps;
  }
  return undefined;
});
var selectArea = exports.selectArea = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, selectXAxisWithScale, selectYAxisWithScale, selectXAxisTicks, selectYAxisTicks, selectGraphicalItemStackedData, _dataSelectors.selectChartDataWithIndexesIfNotInPanorama, selectBandSize, selectSynchronisedAreaSettings], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks, stackedData, _ref, bandSize, areaSettings) => {
  var {
    chartData,
    dataStartIndex,
    dataEndIndex
  } = _ref;
  if (areaSettings == null || layout !== 'horizontal' && layout !== 'vertical' || xAxis == null || yAxis == null || xAxisTicks == null || yAxisTicks == null || xAxisTicks.length === 0 || yAxisTicks.length === 0 || bandSize == null) {
    return undefined;
  }
  var {
    data
  } = areaSettings;
  var displayedData;
  if (data && data.length > 0) {
    displayedData = data;
  } else {
    displayedData = chartData === null || chartData === void 0 ? void 0 : chartData.slice(dataStartIndex, dataEndIndex + 1);
  }
  if (displayedData == null) {
    return undefined;
  }

  // Where is this supposed to come from? No charts have that as a prop.
  var chartBaseValue = undefined;
  return (0, _Area.computeArea)({
    layout,
    xAxis,
    yAxis,
    xAxisTicks,
    yAxisTicks,
    dataStartIndex,
    areaSettings,
    stackedData,
    displayedData,
    chartBaseValue,
    bandSize
  });
});