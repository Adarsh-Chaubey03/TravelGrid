import { createSelector } from 'reselect';
import { computeScatterPoints } from '../../cartesian/Scatter';
import { selectChartDataWithIndexesIfNotInPanorama } from './dataSelectors';
import { selectAxisWithScale, selectZAxisWithScale, selectTicksOfGraphicalItem, selectUnfilteredCartesianItems } from './axisSelectors';
var selectXAxisWithScale = (state, xAxisId, _yAxisId, _zAxisId, _scatterSettings, _cells, isPanorama) => selectAxisWithScale(state, 'xAxis', xAxisId, isPanorama);
var selectXAxisTicks = (state, xAxisId, _yAxisId, _zAxisId, _scatterSettings, _cells, isPanorama) => selectTicksOfGraphicalItem(state, 'xAxis', xAxisId, isPanorama);
var selectYAxisWithScale = (state, _xAxisId, yAxisId, _zAxisId, _scatterSettings, _cells, isPanorama) => selectAxisWithScale(state, 'yAxis', yAxisId, isPanorama);
var selectYAxisTicks = (state, _xAxisId, yAxisId, _zAxisId, _scatterSettings, _cells, isPanorama) => selectTicksOfGraphicalItem(state, 'yAxis', yAxisId, isPanorama);
var selectZAxis = (state, _xAxisId, _yAxisId, zAxisId) => selectZAxisWithScale(state, 'zAxis', zAxisId, false);
var pickScatterSettings = (_state, _xAxisId, _yAxisId, _zAxisId, scatterSettings) => scatterSettings;
var pickCells = (_state, _xAxisId, _yAxisId, _zAxisId, _scatterSettings, cells) => cells;
var scatterChartDataSelector = (state, xAxisId, yAxisId, _zAxisId, _scatterSettings, _cells, isPanorama) => selectChartDataWithIndexesIfNotInPanorama(state, xAxisId, yAxisId, isPanorama);
var selectSynchronisedScatterSettings = createSelector([selectUnfilteredCartesianItems, pickScatterSettings], (graphicalItems, scatterSettingsFromProps) => {
  if (graphicalItems.some(cgis => cgis.type === 'scatter' && scatterSettingsFromProps.dataKey === cgis.dataKey && scatterSettingsFromProps.data === cgis.data)) {
    return scatterSettingsFromProps;
  }
  return undefined;
});
export var selectScatterPoints = createSelector([scatterChartDataSelector, selectXAxisWithScale, selectXAxisTicks, selectYAxisWithScale, selectYAxisTicks, selectZAxis, selectSynchronisedScatterSettings, pickCells], (_ref, xAxis, xAxisTicks, yAxis, yAxisTicks, zAxis, scatterSettings, cells) => {
  var {
    chartData,
    dataStartIndex,
    dataEndIndex
  } = _ref;
  if (scatterSettings == null) {
    return undefined;
  }
  var displayedData;
  if ((scatterSettings === null || scatterSettings === void 0 ? void 0 : scatterSettings.data) != null && scatterSettings.data.length > 0) {
    displayedData = scatterSettings.data;
  } else {
    displayedData = chartData === null || chartData === void 0 ? void 0 : chartData.slice(dataStartIndex, dataEndIndex + 1);
  }
  if (displayedData == null || xAxis == null || yAxis == null || xAxisTicks == null || yAxisTicks == null || (xAxisTicks === null || xAxisTicks === void 0 ? void 0 : xAxisTicks.length) === 0 || (yAxisTicks === null || yAxisTicks === void 0 ? void 0 : yAxisTicks.length) === 0) {
    return undefined;
  }
  return computeScatterPoints({
    displayedData,
    xAxis,
    yAxis,
    zAxis,
    scatterSettings,
    xAxisTicks,
    yAxisTicks,
    cells
  });
});