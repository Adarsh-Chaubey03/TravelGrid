var _excluded = ["onMouseEnter", "onMouseLeave", "onClick"],
  _excluded2 = ["value", "background", "tooltipPosition"],
  _excluded3 = ["onMouseEnter", "onClick", "onMouseLeave"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * @fileOverview Render a group of bar
 */
// eslint-disable-next-line max-classes-per-file
import * as React from 'react';
import { PureComponent, useCallback, useMemo, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { Layer } from '../container/Layer';
import { SetErrorBarPreferredDirection } from './ErrorBar';
import { Cell } from '../component/Cell';
import { LabelList } from '../component/LabelList';
import { interpolateNumber, isNan, isNullish, mathSign, uniqueId } from '../util/DataUtils';
import { filterProps, findAllByType } from '../util/ReactUtils';
import { Global } from '../util/Global';
import { getBaseValueOfBar, getCateCoordinateOfBar, getNormalizedStackId, getTooltipNameProp, getValueByDataKey, truncateByDomain } from '../util/ChartUtils';
import { adaptEventsOfChild } from '../util/types';
import { BarRectangle, minPointSizeCallback } from '../util/BarUtils';
import { useMouseClickItemDispatch, useMouseEnterItemDispatch, useMouseLeaveItemDispatch } from '../context/tooltipContext';
import { SetTooltipEntrySettings } from '../state/SetTooltipEntrySettings';
import { ReportBar } from '../state/ReportBar';
import { CartesianGraphicalItemContext, SetErrorBarContext } from '../context/CartesianGraphicalItemContext';
import { GraphicalItemClipPath, useNeedsClip } from './GraphicalItemClipPath';
import { useChartLayout } from '../context/chartLayoutContext';
import { selectBarRectangles } from '../state/selectors/barSelectors';
import { useAppSelector } from '../state/hooks';
import { useIsPanorama } from '../context/PanoramaContext';
import { selectActiveTooltipDataKey, selectActiveTooltipIndex } from '../state/selectors/tooltipSelectors';
import { SetLegendPayload } from '../state/SetLegendPayload';
import { useAnimationId } from '../util/useAnimationId';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { Animate } from '../animation/Animate';
var computeLegendPayloadFromBarData = props => {
  var {
    dataKey,
    name,
    fill,
    legendType,
    hide
  } = props;
  return [{
    inactive: hide,
    dataKey,
    type: legendType,
    color: fill,
    value: getTooltipNameProp(name, dataKey),
    payload: props
  }];
};
function getTooltipEntrySettings(props) {
  var {
    dataKey,
    stroke,
    strokeWidth,
    fill,
    name,
    hide,
    unit
  } = props;
  return {
    dataDefinedOnItem: undefined,
    positions: undefined,
    settings: {
      stroke,
      strokeWidth,
      fill,
      dataKey,
      nameKey: undefined,
      name: getTooltipNameProp(name, dataKey),
      hide,
      type: props.tooltipType,
      color: props.fill,
      unit
    }
  };
}
function BarBackground(props) {
  var activeIndex = useAppSelector(selectActiveTooltipIndex);
  var {
    data,
    dataKey,
    background: backgroundFromProps,
    allOtherBarProps
  } = props;
  var {
      onMouseEnter: onMouseEnterFromProps,
      onMouseLeave: onMouseLeaveFromProps,
      onClick: onItemClickFromProps
    } = allOtherBarProps,
    restOfAllOtherProps = _objectWithoutProperties(allOtherBarProps, _excluded);
  var onMouseEnterFromContext = useMouseEnterItemDispatch(onMouseEnterFromProps, dataKey);
  var onMouseLeaveFromContext = useMouseLeaveItemDispatch(onMouseLeaveFromProps);
  var onClickFromContext = useMouseClickItemDispatch(onItemClickFromProps, dataKey);
  if (!backgroundFromProps || data == null) {
    return null;
  }
  var backgroundProps = filterProps(backgroundFromProps, false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, data.map((entry, i) => {
    var {
        value,
        background: backgroundFromDataEntry,
        tooltipPosition
      } = entry,
      rest = _objectWithoutProperties(entry, _excluded2);
    if (!backgroundFromDataEntry) {
      return null;
    }

    // @ts-expect-error BarRectangleItem type definition says it's missing properties, but I can see them present in debugger!
    var onMouseEnter = onMouseEnterFromContext(entry, i);
    // @ts-expect-error BarRectangleItem type definition says it's missing properties, but I can see them present in debugger!
    var onMouseLeave = onMouseLeaveFromContext(entry, i);
    // @ts-expect-error BarRectangleItem type definition says it's missing properties, but I can see them present in debugger!
    var onClick = onClickFromContext(entry, i);
    var barRectangleProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({
      option: backgroundFromProps,
      isActive: String(i) === activeIndex
    }, rest), {}, {
      // @ts-expect-error BarRectangle props do not accept `fill` property.
      fill: '#eee'
    }, backgroundFromDataEntry), backgroundProps), adaptEventsOfChild(restOfAllOtherProps, entry, i)), {}, {
      onMouseEnter,
      onMouseLeave,
      onClick,
      dataKey,
      index: i,
      className: 'recharts-bar-background-rectangle'
    });
    return /*#__PURE__*/React.createElement(BarRectangle, _extends({
      key: "background-bar-".concat(i)
    }, barRectangleProps));
  }));
}
function BarRectangles(_ref) {
  var {
    data,
    props,
    showLabels
  } = _ref;
  var baseProps = filterProps(props, false);
  var {
    shape,
    dataKey,
    activeBar
  } = props;
  var activeIndex = useAppSelector(selectActiveTooltipIndex);
  var activeDataKey = useAppSelector(selectActiveTooltipDataKey);
  var {
      onMouseEnter: onMouseEnterFromProps,
      onClick: onItemClickFromProps,
      onMouseLeave: onMouseLeaveFromProps
    } = props,
    restOfAllOtherProps = _objectWithoutProperties(props, _excluded3);
  var onMouseEnterFromContext = useMouseEnterItemDispatch(onMouseEnterFromProps, dataKey);
  var onMouseLeaveFromContext = useMouseLeaveItemDispatch(onMouseLeaveFromProps);
  var onClickFromContext = useMouseClickItemDispatch(onItemClickFromProps, dataKey);
  if (!data) {
    return null;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, data.map((entry, i) => {
    /*
     * Bars support stacking, meaning that there can be multiple bars at the same x value.
     * With Tooltip shared=false we only want to highlight the currently active Bar, not all.
     *
     * Also, if the tooltip is shared, we want to highlight all bars at the same x value
     * regardless of the dataKey.
     *
     * With shared Tooltip, the activeDataKey is undefined.
     */
    var isActive = activeBar && String(i) === activeIndex && (activeDataKey == null || dataKey === activeDataKey);
    var option = isActive ? activeBar : shape;
    var barRectangleProps = _objectSpread(_objectSpread(_objectSpread({}, baseProps), entry), {}, {
      isActive,
      option,
      index: i,
      dataKey
    });
    return /*#__PURE__*/React.createElement(Layer, _extends({
      className: "recharts-bar-rectangle"
    }, adaptEventsOfChild(restOfAllOtherProps, entry, i), {
      // @ts-expect-error BarRectangleItem type definition says it's missing properties, but I can see them present in debugger!
      onMouseEnter: onMouseEnterFromContext(entry, i)
      // @ts-expect-error BarRectangleItem type definition says it's missing properties, but I can see them present in debugger!
      ,
      onMouseLeave: onMouseLeaveFromContext(entry, i)
      // @ts-expect-error BarRectangleItem type definition says it's missing properties, but I can see them present in debugger!
      ,
      onClick: onClickFromContext(entry, i)
      // https://github.com/recharts/recharts/issues/5415
      // eslint-disable-next-line react/no-array-index-key
      ,
      key: "rectangle-".concat(entry === null || entry === void 0 ? void 0 : entry.x, "-").concat(entry === null || entry === void 0 ? void 0 : entry.y, "-").concat(entry === null || entry === void 0 ? void 0 : entry.value, "-").concat(i)
    }), /*#__PURE__*/React.createElement(BarRectangle, barRectangleProps));
  }), showLabels && LabelList.renderCallByParent(props, data));
}
function RectanglesWithAnimation(_ref2) {
  var {
    props,
    previousRectanglesRef
  } = _ref2;
  var {
    data,
    layout,
    isAnimationActive,
    animationBegin,
    animationDuration,
    animationEasing,
    onAnimationEnd,
    onAnimationStart
  } = props;
  var prevData = previousRectanglesRef.current;
  var animationId = useAnimationId(props, 'recharts-bar-');
  var [isAnimating, setIsAnimating] = useState(false);
  var handleAnimationEnd = useCallback(() => {
    if (typeof onAnimationEnd === 'function') {
      onAnimationEnd();
    }
    setIsAnimating(false);
  }, [onAnimationEnd]);
  var handleAnimationStart = useCallback(() => {
    if (typeof onAnimationStart === 'function') {
      onAnimationStart();
    }
    setIsAnimating(true);
  }, [onAnimationStart]);
  return /*#__PURE__*/React.createElement(Animate, {
    begin: animationBegin,
    duration: animationDuration,
    isActive: isAnimationActive,
    easing: animationEasing,
    from: {
      t: 0
    },
    to: {
      t: 1
    },
    onAnimationEnd: handleAnimationEnd,
    onAnimationStart: handleAnimationStart,
    key: animationId
  }, _ref3 => {
    var {
      t
    } = _ref3;
    var stepData = t === 1 ? data : data.map((entry, index) => {
      var prev = prevData && prevData[index];
      if (prev) {
        var interpolatorX = interpolateNumber(prev.x, entry.x);
        var interpolatorY = interpolateNumber(prev.y, entry.y);
        var interpolatorWidth = interpolateNumber(prev.width, entry.width);
        var interpolatorHeight = interpolateNumber(prev.height, entry.height);
        return _objectSpread(_objectSpread({}, entry), {}, {
          x: interpolatorX(t),
          y: interpolatorY(t),
          width: interpolatorWidth(t),
          height: interpolatorHeight(t)
        });
      }
      if (layout === 'horizontal') {
        var _interpolatorHeight = interpolateNumber(0, entry.height);
        var h = _interpolatorHeight(t);
        return _objectSpread(_objectSpread({}, entry), {}, {
          y: entry.y + entry.height - h,
          height: h
        });
      }
      var interpolator = interpolateNumber(0, entry.width);
      var w = interpolator(t);
      return _objectSpread(_objectSpread({}, entry), {}, {
        width: w
      });
    });
    if (t > 0) {
      // eslint-disable-next-line no-param-reassign
      previousRectanglesRef.current = stepData;
    }
    return /*#__PURE__*/React.createElement(Layer, null, /*#__PURE__*/React.createElement(BarRectangles, {
      props: props,
      data: stepData,
      showLabels: !isAnimating
    }));
  });
}
function RenderRectangles(props) {
  var {
    data,
    isAnimationActive
  } = props;
  var previousRectanglesRef = useRef(null);
  if (isAnimationActive && data && data.length && (previousRectanglesRef.current == null || previousRectanglesRef.current !== data)) {
    return /*#__PURE__*/React.createElement(RectanglesWithAnimation, {
      previousRectanglesRef: previousRectanglesRef,
      props: props
    });
  }
  return /*#__PURE__*/React.createElement(BarRectangles, {
    props: props,
    data: data,
    showLabels: true
  });
}
var defaultMinPointSize = 0;
var errorBarDataPointFormatter = (dataPoint, dataKey) => {
  /**
   * if the value coming from `selectBarRectangles` is an array then this is a stacked bar chart.
   * arr[1] represents end value of the bar since the data is in the form of [startValue, endValue].
   * */
  var value = Array.isArray(dataPoint.value) ? dataPoint.value[1] : dataPoint.value;
  return {
    x: dataPoint.x,
    y: dataPoint.y,
    value,
    // @ts-expect-error getValueByDataKey does not validate the output type
    errorVal: getValueByDataKey(dataPoint, dataKey)
  };
};
class BarWithState extends PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "id", uniqueId('recharts-bar-'));
  }
  render() {
    var {
      hide,
      data,
      dataKey,
      className,
      xAxisId,
      yAxisId,
      needClip,
      background,
      id,
      layout
    } = this.props;
    if (hide) {
      return null;
    }
    var layerClass = clsx('recharts-bar', className);
    var clipPathId = isNullish(id) ? this.id : id;
    return /*#__PURE__*/React.createElement(Layer, {
      className: layerClass
    }, needClip && /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement(GraphicalItemClipPath, {
      clipPathId: clipPathId,
      xAxisId: xAxisId,
      yAxisId: yAxisId
    })), /*#__PURE__*/React.createElement(Layer, {
      className: "recharts-bar-rectangles",
      clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : null
    }, /*#__PURE__*/React.createElement(BarBackground, {
      data: data,
      dataKey: dataKey,
      background: background,
      allOtherBarProps: this.props
    }), /*#__PURE__*/React.createElement(RenderRectangles, this.props)), /*#__PURE__*/React.createElement(SetErrorBarPreferredDirection, {
      direction: layout === 'horizontal' ? 'y' : 'x'
    }, this.props.children));
  }
}
var defaultBarProps = {
  activeBar: false,
  animationBegin: 0,
  animationDuration: 400,
  animationEasing: 'ease',
  hide: false,
  isAnimationActive: !Global.isSsr,
  legendType: 'rect',
  minPointSize: defaultMinPointSize,
  xAxisId: 0,
  yAxisId: 0
};
function BarImpl(props) {
  var {
    xAxisId,
    yAxisId,
    hide,
    legendType,
    minPointSize,
    activeBar,
    animationBegin,
    animationDuration,
    animationEasing,
    isAnimationActive
  } = resolveDefaultProps(props, defaultBarProps);
  var {
    needClip
  } = useNeedsClip(xAxisId, yAxisId);
  var layout = useChartLayout();
  var isPanorama = useIsPanorama();
  var barSettings = useMemo(() => ({
    barSize: props.barSize,
    data: undefined,
    dataKey: props.dataKey,
    maxBarSize: props.maxBarSize,
    minPointSize,
    stackId: getNormalizedStackId(props.stackId)
  }), [props.barSize, props.dataKey, props.maxBarSize, minPointSize, props.stackId]);
  var cells = findAllByType(props.children, Cell);
  var rects = useAppSelector(state => selectBarRectangles(state, xAxisId, yAxisId, isPanorama, barSettings, cells));
  if (layout !== 'vertical' && layout !== 'horizontal') {
    return null;
  }
  var errorBarOffset;
  var firstDataPoint = rects === null || rects === void 0 ? void 0 : rects[0];
  if (firstDataPoint == null || firstDataPoint.height == null || firstDataPoint.width == null) {
    errorBarOffset = 0;
  } else {
    errorBarOffset = layout === 'vertical' ? firstDataPoint.height / 2 : firstDataPoint.width / 2;
  }
  return /*#__PURE__*/React.createElement(SetErrorBarContext, {
    xAxisId: xAxisId,
    yAxisId: yAxisId,
    data: rects,
    dataPointFormatter: errorBarDataPointFormatter,
    errorBarOffset: errorBarOffset
  }, /*#__PURE__*/React.createElement(BarWithState, _extends({}, props, {
    layout: layout,
    needClip: needClip,
    data: rects,
    xAxisId: xAxisId,
    yAxisId: yAxisId,
    hide: hide,
    legendType: legendType,
    minPointSize: minPointSize,
    activeBar: activeBar,
    animationBegin: animationBegin,
    animationDuration: animationDuration,
    animationEasing: animationEasing,
    isAnimationActive: isAnimationActive
  })));
}
export function computeBarRectangles(_ref4) {
  var {
    layout,
    barSettings: {
      dataKey,
      minPointSize: minPointSizeProp
    },
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
  } = _ref4;
  var numericAxis = layout === 'horizontal' ? yAxis : xAxis;
  // @ts-expect-error this assumes that the domain is always numeric, but doesn't check for it
  var stackedDomain = stackedData ? numericAxis.scale.domain() : null;
  var baseValue = getBaseValueOfBar({
    numericAxis
  });
  return displayedData.map((entry, index) => {
    var value, x, y, width, height, background;
    if (stackedData) {
      // we don't need to use dataStartIndex here, because stackedData is already sliced from the selector
      value = truncateByDomain(stackedData[index], stackedDomain);
    } else {
      value = getValueByDataKey(entry, dataKey);
      if (!Array.isArray(value)) {
        value = [baseValue, value];
      }
    }
    var minPointSize = minPointSizeCallback(minPointSizeProp, defaultMinPointSize)(value[1], index);
    if (layout === 'horizontal') {
      var _ref5;
      var [baseValueScale, currentValueScale] = [yAxis.scale(value[0]), yAxis.scale(value[1])];
      x = getCateCoordinateOfBar({
        axis: xAxis,
        ticks: xAxisTicks,
        bandSize,
        offset: pos.offset,
        entry,
        index
      });
      y = (_ref5 = currentValueScale !== null && currentValueScale !== void 0 ? currentValueScale : baseValueScale) !== null && _ref5 !== void 0 ? _ref5 : undefined;
      width = pos.size;
      var computedHeight = baseValueScale - currentValueScale;
      height = isNan(computedHeight) ? 0 : computedHeight;
      background = {
        x,
        y: offset.top,
        width,
        height: offset.height
      };
      if (Math.abs(minPointSize) > 0 && Math.abs(height) < Math.abs(minPointSize)) {
        var delta = mathSign(height || minPointSize) * (Math.abs(minPointSize) - Math.abs(height));
        y -= delta;
        height += delta;
      }
    } else {
      var [_baseValueScale, _currentValueScale] = [xAxis.scale(value[0]), xAxis.scale(value[1])];
      x = _baseValueScale;
      y = getCateCoordinateOfBar({
        axis: yAxis,
        ticks: yAxisTicks,
        bandSize,
        offset: pos.offset,
        entry,
        index
      });
      width = _currentValueScale - _baseValueScale;
      height = pos.size;
      background = {
        x: offset.left,
        y,
        width: offset.width,
        height
      };
      if (Math.abs(minPointSize) > 0 && Math.abs(width) < Math.abs(minPointSize)) {
        var _delta = mathSign(width || minPointSize) * (Math.abs(minPointSize) - Math.abs(width));
        width += _delta;
      }
    }
    var barRectangleItem = _objectSpread(_objectSpread({}, entry), {}, {
      x,
      y,
      width,
      height,
      value: stackedData ? value : value[1],
      payload: entry,
      background,
      tooltipPosition: {
        x: x + width / 2,
        y: y + height / 2
      }
    }, cells && cells[index] && cells[index].props);
    return barRectangleItem;
  });
}
export class Bar extends PureComponent {
  render() {
    // Report all props to Redux store first, before calling any hooks, to avoid circular dependencies.
    return /*#__PURE__*/React.createElement(CartesianGraphicalItemContext, {
      type: "bar"
      // Bar does not allow setting data directly on the graphical item (why?)
      ,
      data: null,
      xAxisId: this.props.xAxisId,
      yAxisId: this.props.yAxisId,
      zAxisId: 0,
      dataKey: this.props.dataKey,
      stackId: this.props.stackId,
      hide: this.props.hide,
      barSize: this.props.barSize
    }, /*#__PURE__*/React.createElement(ReportBar, null), /*#__PURE__*/React.createElement(SetLegendPayload, {
      legendPayload: computeLegendPayloadFromBarData(this.props)
    }), /*#__PURE__*/React.createElement(SetTooltipEntrySettings, {
      fn: getTooltipEntrySettings,
      args: this.props
    }), /*#__PURE__*/React.createElement(BarImpl, this.props));
  }
}
_defineProperty(Bar, "displayName", 'Bar');
_defineProperty(Bar, "defaultProps", defaultBarProps);