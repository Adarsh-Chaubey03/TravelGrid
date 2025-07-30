"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SetTooltipEntrySettings = SetTooltipEntrySettings;
var _react = require("react");
var _hooks = require("./hooks");
var _tooltipSlice = require("./tooltipSlice");
var _PanoramaContext = require("../context/PanoramaContext");
function SetTooltipEntrySettings(_ref) {
  var {
    fn,
    args
  } = _ref;
  var dispatch = (0, _hooks.useAppDispatch)();
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  (0, _react.useEffect)(() => {
    if (isPanorama) {
      // Panorama graphical items should never contribute to Tooltip payload.
      return undefined;
    }
    var tooltipEntrySettings = fn(args);
    dispatch((0, _tooltipSlice.addTooltipEntrySettings)(tooltipEntrySettings));
    return () => {
      dispatch((0, _tooltipSlice.removeTooltipEntrySettings)(tooltipEntrySettings));
    };
  }, [fn, args, dispatch, isPanorama]);
  return null;
}