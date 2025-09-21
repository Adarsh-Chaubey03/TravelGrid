"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectBarSizeList = exports.selectBarRectangles = exports.selectBarPosition = exports.selectBarCartesianAxisSize = exports.selectBarBandSize = exports.selectAllVisibleBars = exports.selectAllBarPositions = exports.combineStackedData = exports.combineBarSizeList = exports.combineAllBarPositions = void 0;
var _reselect = require("reselect");
var _axisSelectors = require("./axisSelectors");
var _DataUtils = require("../../util/DataUtils");
var _ChartUtils = require("../../util/ChartUtils");
var _Bar = require("../../cartesian/Bar");
var _chartLayoutContext = require("../../context/chartLayoutContext");
var _dataSelectors = require("./dataSelectors");
var _selectChartOffsetInternal = require("./selectChartOffsetInternal");
var _rootPropsSelectors = require("./rootPropsSelectors");
var _isWellBehavedNumber = require("../../util/isWellBehavedNumber");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var pickXAxisId = (_state, xAxisId) => xAxisId;
var pickYAxisId = (_state, _xAxisId, yAxisId) => yAxisId;
var pickIsPanorama = (_state, _xAxisId, _yAxisId, isPanorama) => isPanorama;
var pickBarSettings = (_state, _xAxisId, _yAxisId, _isPanorama, barSettings) => barSettings;
var pickMaxBarSize = (_state, _xAxisId, _yAxisId, _isPanorama, barSettings) => barSettings.maxBarSize;
var pickCells = (_state, _xAxisId, _yAxisId, _isPanorama, _barSettings, cells) => cells;
var getBarSize = (globalSize, totalSize, selfSize) => {
  var barSize = selfSize !== null && selfSize !== void 0 ? selfSize : globalSize;
  if ((0, _DataUtils.isNullish)(barSize)) {
    return undefined;
  }
  return (0, _DataUtils.getPercentValue)(barSize, totalSize, 0);
};
var selectAllVisibleBars = exports.selectAllVisibleBars = (0, _reselect.createSelector)([_chartLayoutContext.selectChartLayout, _axisSelectors.selectUnfilteredCartesianItems, pickXAxisId, pickYAxisId, pickIsPanorama], (layout, allItems, xAxisId, yAxisId, isPanorama) => allItems.filter(i => {
  if (layout === 'horizontal') {
    return i.xAxisId === xAxisId;
  }
  return i.yAxisId === yAxisId;
}).filter(i => i.isPanorama === isPanorama).filter(i => i.hide === false).filter(i => i.type === 'bar'));
var selectBarStackGroups = (state, xAxisId, yAxisId, isPanorama) => {
  var layout = (0, _chartLayoutContext.selectChartLayout)(state);
  if (layout === 'horizontal') {
    return (0, _axisSelectors.selectStackGroups)(state, 'yAxis', yAxisId, isPanorama);
  }
  return (0, _axisSelectors.selectStackGroups)(state, 'xAxis', xAxisId, isPanorama);
};
var selectBarCartesianAxisSize = (state, xAxisId, yAxisId) => {
  var layout = (0, _chartLayoutContext.selectChartLayout)(state);
  if (layout === 'horizontal') {
    return (0, _axisSelectors.selectCartesianAxisSize)(state, 'xAxis', xAxisId);
  }
  return (0, _axisSelectors.selectCartesianAxisSize)(state, 'yAxis', yAxisId);
};

/**
 * Some graphical items allow data stacking. The stacks are optional,
 * so all props here are optional too.
 */

/**
 * Some graphical items allow data stacking.
 * This interface is used to represent the items that are stacked
 * because the user has provided the stackId and dataKey properties.
 */
exports.selectBarCartesianAxisSize = selectBarCartesianAxisSize;
function isStacked(graphicalItem) {
  return graphicalItem.stackId != null && graphicalItem.dataKey != null;
}
var combineBarSizeList = (allBars, globalSize, totalSize) => {
  var initialValue = {};
  var stackedBars = allBars.filter(isStacked);
  var unstackedBars = allBars.filter(b => b.stackId == null);
  var groupByStack = stackedBars.reduce((acc, bar) => {
    if (!acc[bar.stackId]) {
      acc[bar.stackId] = [];
    }
    acc[bar.stackId].push(bar);
    return acc;
  }, initialValue);
  var stackedSizeList = Object.entries(groupByStack).map(_ref => {
    var [stackId, bars] = _ref;
    var dataKeys = bars.map(b => b.dataKey);
    var barSize = getBarSize(globalSize, totalSize, bars[0].barSize);
    return {
      stackId,
      dataKeys,
      barSize
    };
  });
  var unstackedSizeList = unstackedBars.map(b => {
    var dataKeys = [b.dataKey].filter(dk => dk != null);
    var barSize = getBarSize(globalSize, totalSize, b.barSize);
    return {
      stackId: undefined,
      dataKeys,
      barSize
    };
  });
  return [...stackedSizeList, ...unstackedSizeList];
};
exports.combineBarSizeList = combineBarSizeList;
var selectBarSizeList = exports.selectBarSizeList = (0, _reselect.createSelector)([selectAllVisibleBars, _rootPropsSelectors.selectRootBarSize, selectBarCartesianAxisSize], combineBarSizeList);
var selectBarBandSize = (state, xAxisId, yAxisId, isPanorama, barSettings) => {
  var _ref2, _getBandSizeOfAxis;
  var layout = (0, _chartLayoutContext.selectChartLayout)(state);
  var globalMaxBarSize = (0, _rootPropsSelectors.selectRootMaxBarSize)(state);
  var {
    maxBarSize: childMaxBarSize
  } = barSettings;
  var maxBarSize = (0, _DataUtils.isNullish)(childMaxBarSize) ? globalMaxBarSize : childMaxBarSize;
  var axis, ticks;
  if (layout === 'horizontal') {
    axis = (0, _axisSelectors.selectAxisWithScale)(state, 'xAxis', xAxisId, isPanorama);
    ticks = (0, _axisSelectors.selectTicksOfGraphicalItem)(state, 'xAxis', xAxisId, isPanorama);
  } else {
    axis = (0, _axisSelectors.selectAxisWithScale)(state, 'yAxis', yAxisId, isPanorama);
    ticks = (0, _axisSelectors.selectTicksOfGraphicalItem)(state, 'yAxis', yAxisId, isPanorama);
  }
  return (_ref2 = (_getBandSizeOfAxis = (0, _ChartUtils.getBandSizeOfAxis)(axis, ticks, true)) !== null && _getBandSizeOfAxis !== void 0 ? _getBandSizeOfAxis : maxBarSize) !== null && _ref2 !== void 0 ? _ref2 : 0;
};
exports.selectBarBandSize = selectBarBandSize;
var selectAxisBandSize = (state, xAxisId, yAxisId, isPanorama) => {
  var layout = (0, _chartLayoutContext.selectChartLayout)(state);
  var axis, ticks;
  if (layout === 'horizontal') {
    axis = (0, _axisSelectors.selectAxisWithScale)(state, 'xAxis', xAxisId, isPanorama);
    ticks = (0, _axisSelectors.selectTicksOfGraphicalItem)(state, 'xAxis', xAxisId, isPanorama);
  } else {
    axis = (0, _axisSelectors.selectAxisWithScale)(state, 'yAxis', yAxisId, isPanorama);
    ticks = (0, _axisSelectors.selectTicksOfGraphicalItem)(state, 'yAxis', yAxisId, isPanorama);
  }
  return (0, _ChartUtils.getBandSizeOfAxis)(axis, ticks);
};
function getBarPositions(barGap, barCategoryGap, bandSize, sizeList, maxBarSize) {
  var len = sizeList.length;
  if (len < 1) {
    return undefined;
  }
  var realBarGap = (0, _DataUtils.getPercentValue)(barGap, bandSize, 0, true);
  var result;
  var initialValue = [];

  // whether is barSize set by user
  // Okay but why does it check only for the first element? What if the first element is set but others are not?
  if ((0, _isWellBehavedNumber.isWellBehavedNumber)(sizeList[0].barSize)) {
    var useFull = false;
    var fullBarSize = bandSize / len;
    var sum = sizeList.reduce((res, entry) => res + (entry.barSize || 0), 0);
    sum += (len - 1) * realBarGap;
    if (sum >= bandSize) {
      sum -= (len - 1) * realBarGap;
      realBarGap = 0;
    }
    if (sum >= bandSize && fullBarSize > 0) {
      useFull = true;
      fullBarSize *= 0.9;
      sum = len * fullBarSize;
    }
    var offset = (bandSize - sum) / 2 >> 0;
    var prev = {
      offset: offset - realBarGap,
      size: 0
    };
    result = sizeList.reduce((res, entry) => {
      var _entry$barSize;
      var newPosition = {
        stackId: entry.stackId,
        dataKeys: entry.dataKeys,
        position: {
          offset: prev.offset + prev.size + realBarGap,
          size: useFull ? fullBarSize : (_entry$barSize = entry.barSize) !== null && _entry$barSize !== void 0 ? _entry$barSize : 0
        }
      };
      var newRes = [...res, newPosition];
      prev = newRes[newRes.length - 1].position;
      return newRes;
    }, initialValue);
  } else {
    var _offset = (0, _DataUtils.getPercentValue)(barCategoryGap, bandSize, 0, true);
    if (bandSize - 2 * _offset - (len - 1) * realBarGap <= 0) {
      realBarGap = 0;
    }
    var originalSize = (bandSize - 2 * _offset - (len - 1) * realBarGap) / len;
    if (originalSize > 1) {
      originalSize >>= 0;
    }
    var size = (0, _isWellBehavedNumber.isWellBehavedNumber)(maxBarSize) ? Math.min(originalSize, maxBarSize) : originalSize;
    result = sizeList.reduce((res, entry, i) => [...res, {
      stackId: entry.stackId,
      dataKeys: entry.dataKeys,
      position: {
        offset: _offset + (originalSize + realBarGap) * i + (originalSize - size) / 2,
        size
      }
    }], initialValue);
  }
  return result;
}
var combineAllBarPositions = (sizeList, globalMaxBarSize, barGap, barCategoryGap, barBandSize, bandSize, childMaxBarSize) => {
  var maxBarSize = (0, _DataUtils.isNullish)(childMaxBarSize) ? globalMaxBarSize : childMaxBarSize;
  var allBarPositions = getBarPositions(barGap, barCategoryGap, barBandSize !== bandSize ? barBandSize : bandSize, sizeList, maxBarSize);
  if (barBandSize !== bandSize && allBarPositions != null) {
    allBarPositions = allBarPositions.map(pos => _objectSpread(_objectSpread({}, pos), {}, {
      position: _objectSpread(_objectSpread({}, pos.position), {}, {
        offset: pos.position.offset - barBandSize / 2
      })
    }));
  }
  return allBarPositions;
};
exports.combineAllBarPositions = combineAllBarPositions;
var selectAllBarPositions = exports.selectAllBarPositions = (0, _reselect.createSelector)([selectBarSizeList, _rootPropsSelectors.selectRootMaxBarSize, _rootPropsSelectors.selectBarGap, _rootPropsSelectors.selectBarCategoryGap, selectBarBandSize, selectAxisBandSize, pickMaxBarSize], combineAllBarPositions);
var selectXAxisWithScale = (state, xAxisId, _yAxisId, isPanorama) => (0, _axisSelectors.selectAxisWithScale)(state, 'xAxis', xAxisId, isPanorama);
var selectYAxisWithScale = (state, _xAxisId, yAxisId, isPanorama) => (0, _axisSelectors.selectAxisWithScale)(state, 'yAxis', yAxisId, isPanorama);
var selectXAxisTicks = (state, xAxisId, _yAxisId, isPanorama) => (0, _axisSelectors.selectTicksOfGraphicalItem)(state, 'xAxis', xAxisId, isPanorama);
var selectYAxisTicks = (state, _xAxisId, yAxisId, isPanorama) => (0, _axisSelectors.selectTicksOfGraphicalItem)(state, 'yAxis', yAxisId, isPanorama);
var selectBarPosition = exports.selectBarPosition = (0, _reselect.createSelector)([selectAllBarPositions, pickBarSettings], (allBarPositions, barSettings) => {
  if (allBarPositions == null) {
    return undefined;
  }
  var position = allBarPositions.find(p => p.stackId === barSettings.stackId && p.dataKeys.includes(barSettings.dataKey));
  if (position == null) {
    return undefined;
  }
  return position.position;
});
var combineStackedData = (stackGroups, barSettings) => {
  if (!stackGroups || (barSettings === null || barSettings === void 0 ? void 0 : barSettings.dataKey) == null) {
    return undefined;
  }
  var {
    stackId
  } = barSettings;
  if (stackId == null) {
    return undefined;
  }
  var stackGroup = stackGroups[stackId];
  if (!stackGroup) {
    return undefined;
  }
  var {
    stackedData
  } = stackGroup;
  if (!stackedData) {
    return undefined;
  }
  var stack = stackedData.find(sd => sd.key === barSettings.dataKey);
  return stack;
};
exports.combineStackedData = combineStackedData;
var selectSynchronisedBarSettings = (0, _reselect.createSelector)([_axisSelectors.selectUnfilteredCartesianItems, pickBarSettings], (graphicalItems, barSettingsFromProps) => {
  if (graphicalItems.some(cgis => cgis.type === 'bar' && barSettingsFromProps.dataKey === cgis.dataKey && barSettingsFromProps.stackId === cgis.stackId &&
  // barSettingsFromProps.data === cgis.data && // bar doesn't support data and one is undefined and another is null and this condition breaks
  barSettingsFromProps.stackId === cgis.stackId)) {
    return barSettingsFromProps;
  }
  return undefined;
});
var selectStackedDataOfItem = (0, _reselect.createSelector)([selectBarStackGroups, pickBarSettings], combineStackedData);
var selectBarRectangles = exports.selectBarRectangles = (0, _reselect.createSelector)([_selectChartOffsetInternal.selectChartOffsetInternal, selectXAxisWithScale, selectYAxisWithScale, selectXAxisTicks, selectYAxisTicks, selectBarPosition, _chartLayoutContext.selectChartLayout, _dataSelectors.selectChartDataWithIndexesIfNotInPanorama, selectAxisBandSize, selectStackedDataOfItem, selectSynchronisedBarSettings, pickCells], (offset, xAxis, yAxis, xAxisTicks, yAxisTicks, pos, layout, _ref3, bandSize, stackedData, barSettings, cells) => {
  var {
    chartData,
    dataStartIndex,
    dataEndIndex
  } = _ref3;
  if (barSettings == null || pos == null || layout !== 'horizontal' && layout !== 'vertical' || xAxis == null || yAxis == null || xAxisTicks == null || yAxisTicks == null || bandSize == null) {
    return undefined;
  }
  var {
    data
  } = barSettings;
  var displayedData;
  if (data != null && data.length > 0) {
    displayedData = data;
  } else {
    displayedData = chartData === null || chartData === void 0 ? void 0 : chartData.slice(dataStartIndex, dataEndIndex + 1);
  }
  if (displayedData == null) {
    return undefined;
  }
  return (0, _Bar.computeBarRectangles)({
    layout,
    barSettings,
    pos,
    bandSize,
    xAxis,
    yAxis,
    xAxisTicks,
    yAxisTicks,
    stackedData,
    displayedData,
    offset,
    cells
  });
});