import { createSelector } from 'reselect';
import sortBy from 'es-toolkit/compat/sortBy';
import { useAppSelector } from '../hooks';
import { calculateActiveTickIndex, calculateTooltipPos, getActiveCoordinate, inRange } from '../../util/ChartUtils';
import { selectChartDataWithIndexes } from './dataSelectors';
import { selectTooltipAxis, selectTooltipAxisTicks, selectTooltipDisplayedData } from './tooltipSelectors';
import { selectChartName } from './rootPropsSelectors';
import { selectChartLayout } from '../../context/chartLayoutContext';
import { selectChartOffsetInternal } from './selectChartOffsetInternal';
import { selectChartHeight, selectChartWidth } from './containerSelectors';
import { combineActiveLabel } from './combiners/combineActiveLabel';
import { combineTooltipInteractionState } from './combiners/combineTooltipInteractionState';
import { combineActiveTooltipIndex } from './combiners/combineActiveTooltipIndex';
import { combineCoordinateForDefaultIndex } from './combiners/combineCoordinateForDefaultIndex';
import { combineTooltipPayloadConfigurations } from './combiners/combineTooltipPayloadConfigurations';
import { selectTooltipPayloadSearcher } from './selectTooltipPayloadSearcher';
import { selectTooltipState } from './selectTooltipState';
import { combineTooltipPayload } from './combiners/combineTooltipPayload';
export var useChartName = () => {
  return useAppSelector(selectChartName);
};
var pickTooltipEventType = (_state, tooltipEventType) => tooltipEventType;
var pickTrigger = (_state, _tooltipEventType, trigger) => trigger;
var pickDefaultIndex = (_state, _tooltipEventType, _trigger, defaultIndex) => defaultIndex;
export var selectOrderedTooltipTicks = createSelector(selectTooltipAxisTicks, ticks => sortBy(ticks, o => o.coordinate));
export var selectTooltipInteractionState = createSelector([selectTooltipState, pickTooltipEventType, pickTrigger, pickDefaultIndex], combineTooltipInteractionState);
export var selectActiveIndex = createSelector([selectTooltipInteractionState, selectTooltipDisplayedData], combineActiveTooltipIndex);
export var selectTooltipDataKey = (state, tooltipEventType, trigger) => {
  if (tooltipEventType == null) {
    return undefined;
  }
  var tooltipState = selectTooltipState(state);
  if (tooltipEventType === 'axis') {
    if (trigger === 'hover') {
      return tooltipState.axisInteraction.hover.dataKey;
    }
    return tooltipState.axisInteraction.click.dataKey;
  }
  if (trigger === 'hover') {
    return tooltipState.itemInteraction.hover.dataKey;
  }
  return tooltipState.itemInteraction.click.dataKey;
};
export var selectTooltipPayloadConfigurations = createSelector([selectTooltipState, pickTooltipEventType, pickTrigger, pickDefaultIndex], combineTooltipPayloadConfigurations);
export var selectCoordinateForDefaultIndex = createSelector([selectChartWidth, selectChartHeight, selectChartLayout, selectChartOffsetInternal, selectTooltipAxisTicks, pickDefaultIndex, selectTooltipPayloadConfigurations, selectTooltipPayloadSearcher], combineCoordinateForDefaultIndex);
export var selectActiveCoordinate = createSelector([selectTooltipInteractionState, selectCoordinateForDefaultIndex], (tooltipInteractionState, defaultIndexCoordinate) => {
  var _tooltipInteractionSt;
  return (_tooltipInteractionSt = tooltipInteractionState.coordinate) !== null && _tooltipInteractionSt !== void 0 ? _tooltipInteractionSt : defaultIndexCoordinate;
});
export var selectActiveLabel = createSelector(selectTooltipAxisTicks, selectActiveIndex, combineActiveLabel);
export var selectTooltipPayload = createSelector([selectTooltipPayloadConfigurations, selectActiveIndex, selectChartDataWithIndexes, selectTooltipAxis, selectActiveLabel, selectTooltipPayloadSearcher, pickTooltipEventType], combineTooltipPayload);
export var selectIsTooltipActive = createSelector([selectTooltipInteractionState], tooltipInteractionState => {
  return {
    isActive: tooltipInteractionState.active,
    activeIndex: tooltipInteractionState.index
  };
});
export var combineActiveProps = (chartEvent, layout, polarViewBox, tooltipAxisType, tooltipAxisRange, tooltipTicks, orderedTooltipTicks, offset) => {
  if (!chartEvent || !layout || !tooltipAxisType || !tooltipAxisRange || !tooltipTicks) {
    return undefined;
  }
  var rangeObj = inRange(chartEvent.chartX, chartEvent.chartY, layout, polarViewBox, offset);
  if (!rangeObj) {
    return undefined;
  }
  var pos = calculateTooltipPos(rangeObj, layout);
  var activeIndex = calculateActiveTickIndex(pos, orderedTooltipTicks, tooltipTicks, tooltipAxisType, tooltipAxisRange);
  var activeCoordinate = getActiveCoordinate(layout, tooltipTicks, activeIndex, rangeObj);
  return {
    activeIndex: String(activeIndex),
    activeCoordinate
  };
};