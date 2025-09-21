import { createAction, createListenerMiddleware } from '@reduxjs/toolkit';
import { selectActiveLabel, selectActiveTooltipCoordinate, selectActiveTooltipDataKey, selectActiveTooltipIndex, selectIsTooltipActive } from './selectors/tooltipSelectors';
export var externalEventAction = createAction('externalEvent');
export var externalEventsMiddleware = createListenerMiddleware();
externalEventsMiddleware.startListening({
  actionCreator: externalEventAction,
  effect: (action, listenerApi) => {
    if (action.payload.handler == null) {
      return;
    }
    var state = listenerApi.getState();
    var nextState = {
      activeCoordinate: selectActiveTooltipCoordinate(state),
      activeDataKey: selectActiveTooltipDataKey(state),
      activeIndex: selectActiveTooltipIndex(state),
      activeLabel: selectActiveLabel(state),
      activeTooltipIndex: selectActiveTooltipIndex(state),
      isTooltipActive: selectIsTooltipActive(state)
    };
    action.payload.handler(nextState, action.payload.reactEvent);
  }
});