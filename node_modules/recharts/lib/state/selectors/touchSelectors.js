"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectTooltipCoordinate = void 0;
var _reselect = require("reselect");
var _selectTooltipPayloadSearcher = require("./selectTooltipPayloadSearcher");
var _selectTooltipState = require("./selectTooltipState");
var selectAllTooltipPayloadConfiguration = (0, _reselect.createSelector)([_selectTooltipState.selectTooltipState], tooltipState => tooltipState.tooltipItemPayloads);
var selectTooltipCoordinate = exports.selectTooltipCoordinate = (0, _reselect.createSelector)([selectAllTooltipPayloadConfiguration, _selectTooltipPayloadSearcher.selectTooltipPayloadSearcher, (_state, tooltipIndex, _dataKey) => tooltipIndex, (_state, _tooltipIndex, dataKey) => dataKey], (allTooltipConfigurations, tooltipPayloadSearcher, tooltipIndex, dataKey) => {
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