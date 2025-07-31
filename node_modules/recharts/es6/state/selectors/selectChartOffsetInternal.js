function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { createSelector } from 'reselect';
import get from 'es-toolkit/compat/get';
import { selectLegendSettings, selectLegendSize } from './legendSelectors';
import { appendOffsetOfLegend } from '../../util/ChartUtils';
import { selectChartHeight, selectChartWidth, selectMargin } from './containerSelectors';
import { selectAllXAxes, selectAllYAxes } from './selectAllAxes';
import { DEFAULT_Y_AXIS_WIDTH } from '../../util/Constants';
export var selectBrushHeight = state => state.brush.height;

/**
 * For internal use only.
 *
 * @param root state
 * @return ChartOffsetInternal
 */
export var selectChartOffsetInternal = createSelector([selectChartWidth, selectChartHeight, selectMargin, selectBrushHeight, selectAllXAxes, selectAllYAxes, selectLegendSettings, selectLegendSize], (chartWidth, chartHeight, margin, brushHeight, xAxes, yAxes, legendSettings, legendSize) => {
  var offsetH = yAxes.reduce((result, entry) => {
    var {
      orientation
    } = entry;
    if (!entry.mirror && !entry.hide) {
      var width = typeof entry.width === 'number' ? entry.width : DEFAULT_Y_AXIS_WIDTH;
      return _objectSpread(_objectSpread({}, result), {}, {
        [orientation]: result[orientation] + width
      });
    }
    return result;
  }, {
    left: margin.left || 0,
    right: margin.right || 0
  });
  var offsetV = xAxes.reduce((result, entry) => {
    var {
      orientation
    } = entry;
    if (!entry.mirror && !entry.hide) {
      return _objectSpread(_objectSpread({}, result), {}, {
        [orientation]: get(result, "".concat(orientation)) + entry.height
      });
    }
    return result;
  }, {
    top: margin.top || 0,
    bottom: margin.bottom || 0
  });
  var offset = _objectSpread(_objectSpread({}, offsetV), offsetH);
  var brushBottom = offset.bottom;
  offset.bottom += brushHeight;
  offset = appendOffsetOfLegend(offset, legendSettings, legendSize);
  var offsetWidth = chartWidth - offset.left - offset.right;
  var offsetHeight = chartHeight - offset.top - offset.bottom;
  return _objectSpread(_objectSpread({
    brushBottom
  }, offset), {}, {
    // never return negative values for height and width
    width: Math.max(offsetWidth, 0),
    height: Math.max(offsetHeight, 0)
  });
});
export var selectChartViewBox = createSelector(selectChartOffsetInternal, offset => ({
  x: offset.left,
  y: offset.top,
  width: offset.width,
  height: offset.height
}));
export var selectAxisViewBox = createSelector(selectChartWidth, selectChartHeight, (width, height) => ({
  x: 0,
  y: 0,
  width,
  height
}));