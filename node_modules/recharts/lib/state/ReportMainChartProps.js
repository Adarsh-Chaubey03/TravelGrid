"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReportMainChartProps = ReportMainChartProps;
var _react = require("react");
var _PanoramaContext = require("../context/PanoramaContext");
var _layoutSlice = require("./layoutSlice");
var _hooks = require("./hooks");
/**
 * "Main" props are props that are only accepted on the main chart,
 * as opposed to the small panorama chart inside a Brush.
 */

function ReportMainChartProps(_ref) {
  var {
    layout,
    width,
    height,
    margin
  } = _ref;
  var dispatch = (0, _hooks.useAppDispatch)();

  /*
   * Skip dispatching properties in panorama chart for two reasons:
   * 1. The root chart should be deciding on these properties, and
   * 2. Brush reads these properties from redux store, and so they must remain stable
   *      to avoid circular dependency and infinite re-rendering.
   */
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  /*
   * useEffect here is required to avoid the "Cannot update a component while rendering a different component" error.
   * https://github.com/facebook/react/issues/18178
   *
   * Reported in https://github.com/recharts/recharts/issues/5514
   */
  (0, _react.useEffect)(() => {
    if (!isPanorama) {
      dispatch((0, _layoutSlice.setLayout)(layout));
      dispatch((0, _layoutSlice.setChartSize)({
        width,
        height
      }));
      dispatch((0, _layoutSlice.setMargin)(margin));
    }
  }, [dispatch, isPanorama, layout, width, height, margin]);
  return null;
}