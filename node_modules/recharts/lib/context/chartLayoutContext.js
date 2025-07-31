"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useViewBox = exports.useOffsetInternal = exports.useMargin = exports.useChartWidth = exports.useChartLayout = exports.useChartHeight = exports.selectChartLayout = exports.ReportChartSize = exports.ReportChartMargin = void 0;
var _react = require("react");
var _hooks = require("../state/hooks");
var _layoutSlice = require("../state/layoutSlice");
var _selectChartOffsetInternal = require("../state/selectors/selectChartOffsetInternal");
var _containerSelectors = require("../state/selectors/containerSelectors");
var _PanoramaContext = require("./PanoramaContext");
var _brushSelectors = require("../state/selectors/brushSelectors");
var useViewBox = () => {
  var _useAppSelector;
  var panorama = (0, _PanoramaContext.useIsPanorama)();
  var rootViewBox = (0, _hooks.useAppSelector)(_selectChartOffsetInternal.selectChartViewBox);
  var brushDimensions = (0, _hooks.useAppSelector)(_brushSelectors.selectBrushDimensions);
  var brushPadding = (_useAppSelector = (0, _hooks.useAppSelector)(_brushSelectors.selectBrushSettings)) === null || _useAppSelector === void 0 ? void 0 : _useAppSelector.padding;
  if (!panorama || !brushDimensions || !brushPadding) {
    return rootViewBox;
  }
  return {
    width: brushDimensions.width - brushPadding.left - brushPadding.right,
    height: brushDimensions.height - brushPadding.top - brushPadding.bottom,
    x: brushPadding.left,
    y: brushPadding.top
  };
};
exports.useViewBox = useViewBox;
var manyComponentsThrowErrorsIfOffsetIsUndefined = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  width: 0,
  height: 0,
  brushBottom: 0
};
/**
 * For internal use only. If you want this information, `import { useOffset } from 'recharts'` instead.
 *
 * Returns the offset of the chart in pixels.
 *
 * @returns {ChartOffsetInternal} The offset of the chart in pixels, or a default value if not in a chart context.
 */
var useOffsetInternal = () => {
  var _useAppSelector2;
  return (_useAppSelector2 = (0, _hooks.useAppSelector)(_selectChartOffsetInternal.selectChartOffsetInternal)) !== null && _useAppSelector2 !== void 0 ? _useAppSelector2 : manyComponentsThrowErrorsIfOffsetIsUndefined;
};

/**
 * Returns the width of the chart in pixels.
 *
 * If you are using chart with hardcoded `width` prop, then the width returned will be the same
 * as the `width` prop on the main chart element.
 *
 * If you are using a chart with a `ResponsiveContainer`, the width will be the size of the chart
 * as the ResponsiveContainer has decided it would be.
 *
 * If the chart has any axes or legend, the `width` will be the size of the chart
 * including the axes and legend. Meaning: adding axes and legend will not change the width.
 *
 * The dimensions do not scale, meaning as user zoom in and out, the width number will not change
 * as the chart gets visually larger or smaller.
 *
 * Returns `undefined` if used outside a chart context.
 *
 * @returns {number | undefined} The width of the chart in pixels, or `undefined` if not in a chart context.
 */
exports.useOffsetInternal = useOffsetInternal;
var useChartWidth = () => {
  return (0, _hooks.useAppSelector)(_containerSelectors.selectChartWidth);
};

/**
 * Returns the height of the chart in pixels.
 *
 * If you are using chart with hardcoded `height` props, then the height returned will be the same
 * as the `height` prop on the main chart element.
 *
 * If you are using a chart with a `ResponsiveContainer`, the height will be the size of the chart
 * as the ResponsiveContainer has decided it would be.
 *
 * If the chart has any axes or legend, the `height` will be the size of the chart
 * including the axes and legend. Meaning: adding axes and legend will not change the height.
 *
 * The dimensions do not scale, meaning as user zoom in and out, the height number will not change
 * as the chart gets visually larger or smaller.
 *
 * Returns `undefined` if used outside a chart context.
 *
 * @returns {number | undefined} The height of the chart in pixels, or `undefined` if not in a chart context.
 */
exports.useChartWidth = useChartWidth;
var useChartHeight = () => {
  return (0, _hooks.useAppSelector)(_containerSelectors.selectChartHeight);
};
exports.useChartHeight = useChartHeight;
var manyComponentsThrowErrorsIfMarginIsUndefined = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
var useMargin = () => {
  var _useAppSelector3;
  return (_useAppSelector3 = (0, _hooks.useAppSelector)(state => state.layout.margin)) !== null && _useAppSelector3 !== void 0 ? _useAppSelector3 : manyComponentsThrowErrorsIfMarginIsUndefined;
};
exports.useMargin = useMargin;
var selectChartLayout = state => state.layout.layoutType;
exports.selectChartLayout = selectChartLayout;
var useChartLayout = () => (0, _hooks.useAppSelector)(selectChartLayout);
exports.useChartLayout = useChartLayout;
var ReportChartSize = props => {
  var dispatch = (0, _hooks.useAppDispatch)();
  (0, _react.useEffect)(() => {
    dispatch((0, _layoutSlice.setChartSize)(props));
  }, [dispatch, props]);
  return null;
};
exports.ReportChartSize = ReportChartSize;
var ReportChartMargin = _ref => {
  var {
    margin
  } = _ref;
  var dispatch = (0, _hooks.useAppDispatch)();
  (0, _react.useEffect)(() => {
    dispatch((0, _layoutSlice.setMargin)(margin));
  }, [dispatch, margin]);
  return null;
};
exports.ReportChartMargin = ReportChartMargin;