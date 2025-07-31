"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectChartViewBox = exports.selectChartOffsetInternal = exports.selectBrushHeight = exports.selectAxisViewBox = void 0;
var _reselect = require("reselect");
var _get = _interopRequireDefault(require("es-toolkit/compat/get"));
var _legendSelectors = require("./legendSelectors");
var _ChartUtils = require("../../util/ChartUtils");
var _containerSelectors = require("./containerSelectors");
var _selectAllAxes = require("./selectAllAxes");
var _Constants = require("../../util/Constants");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var selectBrushHeight = state => state.brush.height;

/**
 * For internal use only.
 *
 * @param root state
 * @return ChartOffsetInternal
 */
exports.selectBrushHeight = selectBrushHeight;
var selectChartOffsetInternal = exports.selectChartOffsetInternal = (0, _reselect.createSelector)([_containerSelectors.selectChartWidth, _containerSelectors.selectChartHeight, _containerSelectors.selectMargin, selectBrushHeight, _selectAllAxes.selectAllXAxes, _selectAllAxes.selectAllYAxes, _legendSelectors.selectLegendSettings, _legendSelectors.selectLegendSize], (chartWidth, chartHeight, margin, brushHeight, xAxes, yAxes, legendSettings, legendSize) => {
  var offsetH = yAxes.reduce((result, entry) => {
    var {
      orientation
    } = entry;
    if (!entry.mirror && !entry.hide) {
      var width = typeof entry.width === 'number' ? entry.width : _Constants.DEFAULT_Y_AXIS_WIDTH;
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
        [orientation]: (0, _get.default)(result, "".concat(orientation)) + entry.height
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
  offset = (0, _ChartUtils.appendOffsetOfLegend)(offset, legendSettings, legendSize);
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
var selectChartViewBox = exports.selectChartViewBox = (0, _reselect.createSelector)(selectChartOffsetInternal, offset => ({
  x: offset.left,
  y: offset.top,
  width: offset.width,
  height: offset.height
}));
var selectAxisViewBox = exports.selectAxisViewBox = (0, _reselect.createSelector)(_containerSelectors.selectChartWidth, _containerSelectors.selectChartHeight, (width, height) => ({
  x: 0,
  y: 0,
  width,
  height
}));