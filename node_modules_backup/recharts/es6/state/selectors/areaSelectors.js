import { createSelector } from 'reselect';
import { computeArea } from '../../cartesian/Area';
import { selectAxisWithScale, selectStackGroups, selectTicksOfGraphicalItem, selectUnfilteredCartesianItems } from './axisSelectors';
import { selectChartLayout } from '../../context/chartLayoutContext';
import { selectChartDataWithIndexesIfNotInPanorama } from './dataSelectors';
import { getBandSizeOfAxis, getNormalizedStackId, isCategoricalAxis } from '../../util/ChartUtils';
var selectXAxisWithScale = (state, xAxisId, _yAxisId, isPanorama) => selectAxisWithScale(state, 'xAxis', xAxisId, isPanorama);
var selectXAxisTicks = (state, xAxisId, _yAxisId, isPanorama) => selectTicksOfGraphicalItem(state, 'xAxis', xAxisId, isPanorama);
var selectYAxisWithScale = (state, _xAxisId, yAxisId, isPanorama) => selectAxisWithScale(state, 'yAxis', yAxisId, isPanorama);
var selectYAxisTicks = (state, _xAxisId, yAxisId, isPanorama) => selectTicksOfGraphicalItem(state, 'yAxis', yAxisId, isPanorama);
var selectBandSize = createSelector([selectChartLayout, selectXAxisWithScale, selectYAxisWithScale, selectXAxisTicks, selectYAxisTicks], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks) => {
  if (isCategoricalAxis(layout, 'xAxis')) {
    return getBandSizeOfAxis(xAxis, xAxisTicks, false);
  }
  return getBandSizeOfAxis(yAxis, yAxisTicks, false);
});
var selectGraphicalItemStackedData = (state, xAxisId, yAxisId, isPanorama, areaSettings) => {
  var _stackGroups$stackId;
  var layout = selectChartLayout(state);
  var isXAxisCategorical = isCategoricalAxis(layout, 'xAxis');
  var stackGroups;
  if (isXAxisCategorical) {
    stackGroups = selectStackGroups(state, 'yAxis', yAxisId, isPanorama);
  } else {
    stackGroups = selectStackGroups(state, 'xAxis', xAxisId, isPanorama);
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
var selectSynchronisedAreaSettings = createSelector([selectUnfilteredCartesianItems, pickAreaSettings], (graphicalItems, areaSettingsFromProps) => {
  if (graphicalItems.some(cgis => cgis.type === 'area' && areaSettingsFromProps.dataKey === cgis.dataKey && getNormalizedStackId(areaSettingsFromProps.stackId) === cgis.stackId && areaSettingsFromProps.data === cgis.data)) {
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
export var selectArea = createSelector([selectChartLayout, selectXAxisWithScale, selectYAxisWithScale, selectXAxisTicks, selectYAxisTicks, selectGraphicalItemStackedData, selectChartDataWithIndexesIfNotInPanorama, selectBandSize, selectSynchronisedAreaSettings], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks, stackedData, _ref, bandSize, areaSettings) => {
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
  return computeArea({
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