import { createSelector } from 'reselect';
import { computeLinePoints } from '../../cartesian/Line';
import { selectChartDataWithIndexesIfNotInPanorama } from './dataSelectors';
import { selectChartLayout } from '../../context/chartLayoutContext';
import { selectAxisWithScale, selectTicksOfGraphicalItem, selectUnfilteredCartesianItems } from './axisSelectors';
import { getBandSizeOfAxis, isCategoricalAxis } from '../../util/ChartUtils';
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
var pickLineSettings = (_state, _xAxisId, _yAxisId, _isPanorama, lineSettings) => lineSettings;

/*
 * There is a race condition problem because we read some data from props and some from the state.
 * The state is updated through a dispatch and is one render behind,
 * and so we have this weird one tick render where the displayedData in one selector have the old dataKey
 * but the new dataKey in another selector.
 *
 * A proper fix is to either move everything into the state, or read the dataKey always from props
 * - but this is a smaller change.
 */
var selectSynchronisedLineSettings = createSelector([selectUnfilteredCartesianItems, pickLineSettings], (graphicalItems, lineSettingsFromProps) => {
  if (graphicalItems.some(cgis => cgis.type === 'line' && lineSettingsFromProps.dataKey === cgis.dataKey && lineSettingsFromProps.data === cgis.data)) {
    /*
     * now, at least one of the lines has the same dataKey as the one in props.
     * Is this a perfect match? Maybe not because we could theoretically have two different Lines with the same dataKey
     * and the same stackId and the same data but still different lines, yes,
     * but the chances of that happening are ... lowish.
     *
     * A proper fix would be to store the lineSettings in a state too, and compare references directly instead of enumerating the properties.
     */
    return lineSettingsFromProps;
  }
  return undefined;
});
export var selectLinePoints = createSelector([selectChartLayout, selectXAxisWithScale, selectYAxisWithScale, selectXAxisTicks, selectYAxisTicks, selectSynchronisedLineSettings, selectBandSize, selectChartDataWithIndexesIfNotInPanorama], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks, lineSettings, bandSize, _ref) => {
  var {
    chartData,
    dataStartIndex,
    dataEndIndex
  } = _ref;
  if (lineSettings == null || xAxis == null || yAxis == null || xAxisTicks == null || yAxisTicks == null || xAxisTicks.length === 0 || yAxisTicks.length === 0 || bandSize == null) {
    return undefined;
  }
  var {
    dataKey,
    data
  } = lineSettings;
  var displayedData;
  if (data != null && data.length > 0) {
    displayedData = data;
  } else {
    displayedData = chartData === null || chartData === void 0 ? void 0 : chartData.slice(dataStartIndex, dataEndIndex + 1);
  }
  if (displayedData == null) {
    return undefined;
  }
  return computeLinePoints({
    layout,
    xAxis,
    yAxis,
    xAxisTicks,
    yAxisTicks,
    dataKey,
    bandSize,
    displayedData
  });
});