import { createSelector } from 'reselect';
import { selectChartDataAndAlwaysIgnoreIndexes } from './dataSelectors';
import { combineAppliedValues, combineAxisDomain, combineAxisDomainWithNiceTicks, combineDisplayedData, combineGraphicalItemsData, combineGraphicalItemsSettings, combineNiceTicks, combineNumericalDomain, itemAxisPredicate, selectBaseAxis, selectDomainDefinition, selectRealScaleType } from './axisSelectors';
import { selectChartLayout } from '../../context/chartLayoutContext';
import { getValueByDataKey } from '../../util/ChartUtils';
import { pickAxisType } from './pickAxisType';
import { pickAxisId } from './pickAxisId';
import { selectStackOffsetType } from './rootPropsSelectors';
export var selectUnfilteredPolarItems = state => state.graphicalItems.polarItems;
var selectAxisPredicate = createSelector([pickAxisType, pickAxisId], itemAxisPredicate);
export var selectPolarItemsSettings = createSelector([selectUnfilteredPolarItems, selectBaseAxis, selectAxisPredicate], combineGraphicalItemsSettings);
var selectPolarGraphicalItemsData = createSelector([selectPolarItemsSettings], combineGraphicalItemsData);
export var selectPolarDisplayedData = createSelector([selectPolarGraphicalItemsData, selectChartDataAndAlwaysIgnoreIndexes], combineDisplayedData);
export var selectPolarAppliedValues = createSelector([selectPolarDisplayedData, selectBaseAxis, selectPolarItemsSettings], combineAppliedValues);
export var selectAllPolarAppliedNumericalValues = createSelector([selectPolarDisplayedData, selectBaseAxis, selectPolarItemsSettings], (data, axisSettings, items) => {
  if (items.length > 0) {
    return data.flatMap(entry => {
      return items.flatMap(item => {
        var _axisSettings$dataKey;
        var valueByDataKey = getValueByDataKey(entry, (_axisSettings$dataKey = axisSettings.dataKey) !== null && _axisSettings$dataKey !== void 0 ? _axisSettings$dataKey : item.dataKey);
        return {
          value: valueByDataKey,
          errorDomain: [] // polar charts do not have error bars
        };
      });
    }).filter(Boolean);
  }
  if ((axisSettings === null || axisSettings === void 0 ? void 0 : axisSettings.dataKey) != null) {
    return data.map(item => ({
      value: getValueByDataKey(item, axisSettings.dataKey),
      errorDomain: []
    }));
  }
  return data.map(entry => ({
    value: entry,
    errorDomain: []
  }));
});
var unsupportedInPolarChart = () => undefined;
var selectPolarNumericalDomain = createSelector([selectBaseAxis, selectDomainDefinition, unsupportedInPolarChart, selectAllPolarAppliedNumericalValues, unsupportedInPolarChart], combineNumericalDomain);
export var selectPolarAxisDomain = createSelector([selectBaseAxis, selectChartLayout, selectPolarDisplayedData, selectPolarAppliedValues, selectStackOffsetType, pickAxisType, selectPolarNumericalDomain], combineAxisDomain);
export var selectPolarNiceTicks = createSelector([selectPolarAxisDomain, selectBaseAxis, selectRealScaleType], combineNiceTicks);
export var selectPolarAxisDomainIncludingNiceTicks = createSelector([selectBaseAxis, selectPolarAxisDomain, selectPolarNiceTicks, pickAxisType], combineAxisDomainWithNiceTicks);