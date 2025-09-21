import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { setChartSize, setMargin } from '../state/layoutSlice';
import { selectChartOffsetInternal, selectChartViewBox } from '../state/selectors/selectChartOffsetInternal';
import { selectChartHeight, selectChartWidth } from '../state/selectors/containerSelectors';
import { useIsPanorama } from './PanoramaContext';
import { selectBrushDimensions, selectBrushSettings } from '../state/selectors/brushSelectors';
export var useViewBox = () => {
  var _useAppSelector;
  var panorama = useIsPanorama();
  var rootViewBox = useAppSelector(selectChartViewBox);
  var brushDimensions = useAppSelector(selectBrushDimensions);
  var brushPadding = (_useAppSelector = useAppSelector(selectBrushSettings)) === null || _useAppSelector === void 0 ? void 0 : _useAppSelector.padding;
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
export var useOffsetInternal = () => {
  var _useAppSelector2;
  return (_useAppSelector2 = useAppSelector(selectChartOffsetInternal)) !== null && _useAppSelector2 !== void 0 ? _useAppSelector2 : manyComponentsThrowErrorsIfOffsetIsUndefined;
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
export var useChartWidth = () => {
  return useAppSelector(selectChartWidth);
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
export var useChartHeight = () => {
  return useAppSelector(selectChartHeight);
};
var manyComponentsThrowErrorsIfMarginIsUndefined = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
export var useMargin = () => {
  var _useAppSelector3;
  return (_useAppSelector3 = useAppSelector(state => state.layout.margin)) !== null && _useAppSelector3 !== void 0 ? _useAppSelector3 : manyComponentsThrowErrorsIfMarginIsUndefined;
};
export var selectChartLayout = state => state.layout.layoutType;
export var useChartLayout = () => useAppSelector(selectChartLayout);
export var ReportChartSize = props => {
  var dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setChartSize(props));
  }, [dispatch, props]);
  return null;
};
export var ReportChartMargin = _ref => {
  var {
    margin
  } = _ref;
  var dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setMargin(margin));
  }, [dispatch, margin]);
  return null;
};