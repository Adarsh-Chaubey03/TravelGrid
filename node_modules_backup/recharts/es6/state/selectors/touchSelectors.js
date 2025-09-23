import { createSelector } from 'reselect';
import { selectTooltipPayloadSearcher } from './selectTooltipPayloadSearcher';
import { selectTooltipState } from './selectTooltipState';
var selectAllTooltipPayloadConfiguration = createSelector([selectTooltipState], tooltipState => tooltipState.tooltipItemPayloads);
export var selectTooltipCoordinate = createSelector([selectAllTooltipPayloadConfiguration, selectTooltipPayloadSearcher, (_state, tooltipIndex, _dataKey) => tooltipIndex, (_state, _tooltipIndex, dataKey) => dataKey], (allTooltipConfigurations, tooltipPayloadSearcher, tooltipIndex, dataKey) => {
  var mostRelevantTooltipConfiguration = allTooltipConfigurations.find(tooltipConfiguration => {
    return tooltipConfiguration.settings.dataKey === dataKey;
  });
  if (mostRelevantTooltipConfiguration == null) {
    return undefined;
  }
  var {
    positions
  } = mostRelevantTooltipConfiguration;
  if (positions == null) {
    return undefined;
  }
  // @ts-expect-error tooltipPayloadSearcher is not typed well
  var maybePosition = tooltipPayloadSearcher(positions, tooltipIndex);
  return maybePosition;
});