"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRechartsStore = void 0;
var _toolkit = require("@reduxjs/toolkit");
var _optionsSlice = require("./optionsSlice");
var _tooltipSlice = require("./tooltipSlice");
var _chartDataSlice = require("./chartDataSlice");
var _layoutSlice = require("./layoutSlice");
var _mouseEventsMiddleware = require("./mouseEventsMiddleware");
var _reduxDevtoolsJsonStringifyReplacer = require("./reduxDevtoolsJsonStringifyReplacer");
var _cartesianAxisSlice = require("./cartesianAxisSlice");
var _graphicalItemsSlice = require("./graphicalItemsSlice");
var _referenceElementsSlice = require("./referenceElementsSlice");
var _brushSlice = require("./brushSlice");
var _legendSlice = require("./legendSlice");
var _rootPropsSlice = require("./rootPropsSlice");
var _polarAxisSlice = require("./polarAxisSlice");
var _polarOptionsSlice = require("./polarOptionsSlice");
var _keyboardEventsMiddleware = require("./keyboardEventsMiddleware");
var _externalEventsMiddleware = require("./externalEventsMiddleware");
var _touchEventsMiddleware = require("./touchEventsMiddleware");
var rootReducer = (0, _toolkit.combineReducers)({
  brush: _brushSlice.brushReducer,
  cartesianAxis: _cartesianAxisSlice.cartesianAxisReducer,
  chartData: _chartDataSlice.chartDataReducer,
  graphicalItems: _graphicalItemsSlice.graphicalItemsReducer,
  layout: _layoutSlice.chartLayoutReducer,
  legend: _legendSlice.legendReducer,
  options: _optionsSlice.optionsReducer,
  polarAxis: _polarAxisSlice.polarAxisReducer,
  polarOptions: _polarOptionsSlice.polarOptionsReducer,
  referenceElements: _referenceElementsSlice.referenceElementsReducer,
  rootProps: _rootPropsSlice.rootPropsReducer,
  tooltip: _tooltipSlice.tooltipReducer
});
var createRechartsStore = exports.createRechartsStore = function createRechartsStore(preloadedState) {
  var chartName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Chart';
  return (0, _toolkit.configureStore)({
    reducer: rootReducer,
    // redux-toolkit v1 types are unhappy with the preloadedState type. Remove the `as any` when bumping to v2
    preloadedState: preloadedState,
    // @ts-expect-error redux-toolkit v1 types are unhappy with the middleware array. Remove this comment when bumping to v2
    middleware: getDefaultMiddleware => getDefaultMiddleware({
      serializableCheck: false
    }).concat([_mouseEventsMiddleware.mouseClickMiddleware.middleware, _mouseEventsMiddleware.mouseMoveMiddleware.middleware, _keyboardEventsMiddleware.keyboardEventsMiddleware.middleware, _externalEventsMiddleware.externalEventsMiddleware.middleware, _touchEventsMiddleware.touchEventMiddleware.middleware]),
    devTools: {
      serialize: {
        replacer: _reduxDevtoolsJsonStringifyReplacer.reduxDevtoolsJsonStringifyReplacer
      },
      name: "recharts-".concat(chartName)
    }
  });
};