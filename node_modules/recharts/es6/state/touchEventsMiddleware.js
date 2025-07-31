import { createAction, createListenerMiddleware } from '@reduxjs/toolkit';
import { setActiveMouseOverItemIndex, setMouseOverAxisIndex } from './tooltipSlice';
import { selectActivePropsFromChartPointer } from './selectors/selectActivePropsFromChartPointer';
import { getChartPointer } from '../util/getChartPointer';
import { selectTooltipEventType } from './selectors/selectTooltipEventType';
import { DATA_ITEM_DATAKEY_ATTRIBUTE_NAME, DATA_ITEM_INDEX_ATTRIBUTE_NAME } from '../util/Constants';
import { selectTooltipCoordinate } from './selectors/touchSelectors';
export var touchEventAction = createAction('touchMove');
export var touchEventMiddleware = createListenerMiddleware();
touchEventMiddleware.startListening({
  actionCreator: touchEventAction,
  effect: (action, listenerApi) => {
    var touchEvent = action.payload;
    var state = listenerApi.getState();
    var tooltipEventType = selectTooltipEventType(state, state.tooltip.settings.shared);
    if (tooltipEventType === 'axis') {
      var activeProps = selectActivePropsFromChartPointer(state, getChartPointer({
        clientX: touchEvent.touches[0].clientX,
        clientY: touchEvent.touches[0].clientY,
        currentTarget: touchEvent.currentTarget
      }));
      if ((activeProps === null || activeProps === void 0 ? void 0 : activeProps.activeIndex) != null) {
        listenerApi.dispatch(setMouseOverAxisIndex({
          activeIndex: activeProps.activeIndex,
          activeDataKey: undefined,
          activeCoordinate: activeProps.activeCoordinate
        }));
      }
    } else if (tooltipEventType === 'item') {
      var _target$getAttribute;
      var touch = touchEvent.touches[0];
      var target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (!target || !target.getAttribute) {
        return;
      }
      var itemIndex = target.getAttribute(DATA_ITEM_INDEX_ATTRIBUTE_NAME);
      var dataKey = (_target$getAttribute = target.getAttribute(DATA_ITEM_DATAKEY_ATTRIBUTE_NAME)) !== null && _target$getAttribute !== void 0 ? _target$getAttribute : undefined;
      var coordinate = selectTooltipCoordinate(listenerApi.getState(), itemIndex, dataKey);
      listenerApi.dispatch(setActiveMouseOverItemIndex({
        activeDataKey: dataKey,
        activeIndex: itemIndex,
        activeCoordinate: coordinate
      }));
    }
  }
});