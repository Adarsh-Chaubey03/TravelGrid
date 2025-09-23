"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mouseMoveMiddleware = exports.mouseMoveAction = exports.mouseClickMiddleware = exports.mouseClickAction = void 0;
var _toolkit = require("@reduxjs/toolkit");
var _tooltipSlice = require("./tooltipSlice");
var _selectActivePropsFromChartPointer = require("./selectors/selectActivePropsFromChartPointer");
var _selectTooltipEventType = require("./selectors/selectTooltipEventType");
var _getChartPointer = require("../util/getChartPointer");
var mouseClickAction = exports.mouseClickAction = (0, _toolkit.createAction)('mouseClick');
var mouseClickMiddleware = exports.mouseClickMiddleware = (0, _toolkit.createListenerMiddleware)();

// TODO: there's a bug here when you click the chart the activeIndex resets to zero
mouseClickMiddleware.startListening({
  actionCreator: mouseClickAction,
  effect: (action, listenerApi) => {
    var mousePointer = action.payload;
    var activeProps = (0, _selectActivePropsFromChartPointer.selectActivePropsFromChartPointer)(listenerApi.getState(), (0, _getChartPointer.getChartPointer)(mousePointer));
    if ((activeProps === null || activeProps === void 0 ? void 0 : activeProps.activeIndex) != null) {
      listenerApi.dispatch((0, _tooltipSlice.setMouseClickAxisIndex)({
        activeIndex: activeProps.activeIndex,
        activeDataKey: undefined,
        activeCoordinate: activeProps.activeCoordinate
      }));
    }
  }
});
var mouseMoveAction = exports.mouseMoveAction = (0, _toolkit.createAction)('mouseMove');
var mouseMoveMiddleware = exports.mouseMoveMiddleware = (0, _toolkit.createListenerMiddleware)();
mouseMoveMiddleware.startListening({
  actionCreator: mouseMoveAction,
  effect: (action, listenerApi) => {
    var mousePointer = action.payload;
    var state = listenerApi.getState();
    var tooltipEventType = (0, _selectTooltipEventType.selectTooltipEventType)(state, state.tooltip.settings.shared);
    var activeProps = (0, _selectActivePropsFromChartPointer.selectActivePropsFromChartPointer)(state, (0, _getChartPointer.getChartPointer)(mousePointer));

    // this functionality only applies to charts that have axes
    if (tooltipEventType === 'axis') {
      if ((activeProps === null || activeProps === void 0 ? void 0 : activeProps.activeIndex) != null) {
        listenerApi.dispatch((0, _tooltipSlice.setMouseOverAxisIndex)({
          activeIndex: activeProps.activeIndex,
          activeDataKey: undefined,
          activeCoordinate: activeProps.activeCoordinate
        }));
      } else {
        // this is needed to clear tooltip state when the mouse moves out of the inRange (svg - offset) function, but not yet out of the svg
        listenerApi.dispatch((0, _tooltipSlice.mouseLeaveChart)());
      }
    }
  }
});