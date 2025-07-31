import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { optionsReducer } from './optionsSlice';
import { tooltipReducer } from './tooltipSlice';
import { chartDataReducer } from './chartDataSlice';
import { chartLayoutReducer } from './layoutSlice';
import { mouseClickMiddleware, mouseMoveMiddleware } from './mouseEventsMiddleware';
import { reduxDevtoolsJsonStringifyReplacer } from './reduxDevtoolsJsonStringifyReplacer';
import { cartesianAxisReducer } from './cartesianAxisSlice';
import { graphicalItemsReducer } from './graphicalItemsSlice';
import { referenceElementsReducer } from './referenceElementsSlice';
import { brushReducer } from './brushSlice';
import { legendReducer } from './legendSlice';
import { rootPropsReducer } from './rootPropsSlice';
import { polarAxisReducer } from './polarAxisSlice';
import { polarOptionsReducer } from './polarOptionsSlice';
import { keyboardEventsMiddleware } from './keyboardEventsMiddleware';
import { externalEventsMiddleware } from './externalEventsMiddleware';
import { touchEventMiddleware } from './touchEventsMiddleware';
var rootReducer = combineReducers({
  brush: brushReducer,
  cartesianAxis: cartesianAxisReducer,
  chartData: chartDataReducer,
  graphicalItems: graphicalItemsReducer,
  layout: chartLayoutReducer,
  legend: legendReducer,
  options: optionsReducer,
  polarAxis: polarAxisReducer,
  polarOptions: polarOptionsReducer,
  referenceElements: referenceElementsReducer,
  rootProps: rootPropsReducer,
  tooltip: tooltipReducer
});
export var createRechartsStore = function createRechartsStore(preloadedState) {
  var chartName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Chart';
  return configureStore({
    reducer: rootReducer,
    // redux-toolkit v1 types are unhappy with the preloadedState type. Remove the `as any` when bumping to v2
    preloadedState: preloadedState,
    // @ts-expect-error redux-toolkit v1 types are unhappy with the middleware array. Remove this comment when bumping to v2
    middleware: getDefaultMiddleware => getDefaultMiddleware({
      serializableCheck: false
    }).concat([mouseClickMiddleware.middleware, mouseMoveMiddleware.middleware, keyboardEventsMiddleware.middleware, externalEventsMiddleware.middleware, touchEventMiddleware.middleware]),
    devTools: {
      serialize: {
        replacer: reduxDevtoolsJsonStringifyReplacer
      },
      name: "recharts-".concat(chartName)
    }
  });
};