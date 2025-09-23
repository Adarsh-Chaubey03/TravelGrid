"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SetLegendPayload = SetLegendPayload;
exports.SetPolarLegendPayload = SetPolarLegendPayload;
var _react = require("react");
var _PanoramaContext = require("../context/PanoramaContext");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _hooks = require("./hooks");
var _legendSlice = require("./legendSlice");
var noop = () => {};
function SetLegendPayload(_ref) {
  var {
    legendPayload
  } = _ref;
  var dispatch = (0, _hooks.useAppDispatch)();
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  (0, _react.useEffect)(() => {
    if (isPanorama) {
      return noop;
    }
    dispatch((0, _legendSlice.addLegendPayload)(legendPayload));
    return () => {
      dispatch((0, _legendSlice.removeLegendPayload)(legendPayload));
    };
  }, [dispatch, isPanorama, legendPayload]);
  return null;
}
function SetPolarLegendPayload(_ref2) {
  var {
    legendPayload
  } = _ref2;
  var dispatch = (0, _hooks.useAppDispatch)();
  var layout = (0, _hooks.useAppSelector)(_chartLayoutContext.selectChartLayout);
  (0, _react.useEffect)(() => {
    if (layout !== 'centric' && layout !== 'radial') {
      return noop;
    }
    dispatch((0, _legendSlice.addLegendPayload)(legendPayload));
    return () => {
      dispatch((0, _legendSlice.removeLegendPayload)(legendPayload));
    };
  }, [dispatch, layout, legendPayload]);
  return null;
}