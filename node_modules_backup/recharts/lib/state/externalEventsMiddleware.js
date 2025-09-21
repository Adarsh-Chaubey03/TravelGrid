"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.externalEventsMiddleware = exports.externalEventAction = void 0;
var _toolkit = require("@reduxjs/toolkit");
var _tooltipSelectors = require("./selectors/tooltipSelectors");
var externalEventAction = exports.externalEventAction = (0, _toolkit.createAction)('externalEvent');
var externalEventsMiddleware = exports.externalEventsMiddleware = (0, _toolkit.createListenerMiddleware)();
externalEventsMiddleware.startListening({
  actionCreator: externalEventAction,
  effect: (action, listenerApi) => {
    if (action.payload.handler == null) {
      return;
    }
    var state = listenerApi.getState();
    var nextState = {
      activeCoordinate: (0, _tooltipSelectors.selectActiveTooltipCoordinate)(state),
      activeDataKey: (0, _tooltipSelectors.selectActiveTooltipDataKey)(state),
      activeIndex: (0, _tooltipSelectors.selectActiveTooltipIndex)(state),
      activeLabel: (0, _tooltipSelectors.selectActiveLabel)(state),
      activeTooltipIndex: (0, _tooltipSelectors.selectActiveTooltipIndex)(state),
      isTooltipActive: (0, _tooltipSelectors.selectIsTooltipActive)(state)
    };
    action.payload.handler(nextState, action.payload.reactEvent);
  }
});