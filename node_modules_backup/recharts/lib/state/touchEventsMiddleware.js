"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.touchEventMiddleware = exports.touchEventAction = void 0;
var _toolkit = require("@reduxjs/toolkit");
var _tooltipSlice = require("./tooltipSlice");
var _selectActivePropsFromChartPointer = require("./selectors/selectActivePropsFromChartPointer");
var _getChartPointer = require("../util/getChartPointer");
var _selectTooltipEventType = require("./selectors/selectTooltipEventType");
var _Constants = require("../util/Constants");
var _touchSelectors = require("./selectors/touchSelectors");
var touchEventAction = exports.touchEventAction = (0, _toolkit.createAction)('touchMove');
var touchEventMiddleware = exports.touchEventMiddleware = (0, _toolkit.createListenerMiddleware)();
touchEventMiddleware.startListening({
  actionCreator: touchEventAction,
  effect: (action, listenerApi) => {
    var touchEvent = action.payload;
    var state = listenerApi.getState();
    var tooltipEventType = (0, _selectTooltipEventType.selectTooltipEventType)(state, state.tooltip.settings.shared);
    if (tooltipEventType === 'axis') {
      var activeProps = (0, _selectActivePropsFromChartPointer.selectActivePropsFromChartPointer)(state, (0, _getChartPointer.getChartPointer)({
        clientX: touchEvent.touches[0].clientX,
        clientY: touchEvent.touches[0].clientY,
        currentTarget: touchEvent.currentTarget
      }));
      if ((activeProps === null || activeProps === void 0 ? void 0 : activeProps.activeIndex) != null) {
        listenerApi.dispatch((0, _tooltipSlice.setMouseOverAxisIndex)({
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
      var itemIndex = target.getAttribute(_Constants.DATA_ITEM_INDEX_ATTRIBUTE_NAME);
      var dataKey = (_target$getAttribute = target.getAttribute(_Constants.DATA_ITEM_DATAKEY_ATTRIBUTE_NAME)) !== null && _target$getAttribute !== void 0 ? _target$getAttribute : undefined;
      var coordinate = (0, _touchSelectors.selectTooltipCoordinate)(listenerApi.getState(), itemIndex, dataKey);
      listenerApi.dispatch((0, _tooltipSlice.setActiveMouseOverItemIndex)({
        activeDataKey: dataKey,
        activeIndex: itemIndex,
        activeCoordinate: coordinate
      }));
    }
  }
});