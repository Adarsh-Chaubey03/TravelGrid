"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bar = void 0;
exports.computeBarRectangles = computeBarRectangles;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _clsx = require("clsx");
var _Layer = require("../container/Layer");
var _ErrorBar = require("./ErrorBar");
var _Cell = require("../component/Cell");
var _LabelList = require("../component/LabelList");
var _DataUtils = require("../util/DataUtils");
var _ReactUtils = require("../util/ReactUtils");
var _Global = require("../util/Global");
var _ChartUtils = require("../util/ChartUtils");
var _types = require("../util/types");
var _BarUtils = require("../util/BarUtils");
var _tooltipContext = require("../context/tooltipContext");
var _SetTooltipEntrySettings = require("../state/SetTooltipEntrySettings");
var _ReportBar = require("../state/ReportBar");
var _CartesianGraphicalItemContext = require("../context/CartesianGraphicalItemContext");
var _GraphicalItemClipPath = require("./GraphicalItemClipPath");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _barSelectors = require("../state/selectors/barSelectors");
var _hooks = require("../state/hooks");
var _PanoramaContext = require("../context/PanoramaContext");
var _tooltipSelectors = require("../state/selectors/tooltipSelectors");
var _SetLegendPayload = require("../state/SetLegendPayload");
var _useAnimationId = require("../util/useAnimationId");
var _resolveDefaultProps = require("../util/resolveDefaultProps");
var _Animate = require("../animation/Animate");
var _excluded = ["onMouseEnter", "onMouseLeave", "onClick"],
  _excluded2 = ["value", "background", "tooltipPosition"],
  _excluded3 = ["onMouseEnter", "onClick", "onMouseLeave"];
/**
 * @fileOverview Render a group of bar
 */
// eslint-disable-next-line max-classes-per-file
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
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
    value: (0, _ChartUtils.getTooltipNameProp)(name, dataKey),
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
      name: (0, _ChartUtils.getTooltipNameProp)(name, dataKey),
      hide,
      type: props.tooltipType,
      color: props.fill,
      unit
    }
  };
}
function BarBackground(props) {
  var activeIndex = (0, _hooks.useAppSelector)(_tooltipSelectors.selectActiveTooltipIndex);
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
  var onMouseEnterFromContext = (0, _tooltipContext.useMouseEnterItemDispatch)(onMouseEnterFromProps, dataKey);
  var onMouseLeaveFromContext = (0, _tooltipContext.useMouseLeaveItemDispatch)(onMouseLeaveFromProps);
  var onClickFromContext = (0, _tooltipContext.useMouseClickItemDispatch)(onItemClickFromProps, dataKey);
  if (!backgroundFromProps || data == null) {
    return null;
  }
  var backgroundProps = (0, _ReactUtils.filterProps)(backgroundFromProps, false);
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
    }, backgroundFromDataEntry), backgroundProps), (0, _types.adaptEventsOfChild)(restOfAllOtherProps, entry, i)), {}, {
      onMouseEnter,
      onMouseLeave,
      onClick,
      dataKey,
      index: i,
      className: 'recharts-bar-background-rectangle'
    });
    return /*#__PURE__*/React.createElement(_BarUtils.BarRectangle, _extends({
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
  var baseProps = (0, _ReactUtils.filterProps)(props, false);
  var {
    shape,
    dataKey,
    activeBar
  } = props;
  var activeIndex = (0, _hooks.useAppSelector)(_tooltipSelectors.selectActiveTooltipIndex);
  var activeDataKey = (0, _hooks.useAppSelector)(_tooltipSelectors.selectActiveTooltipDataKey);
  var {
      onMouseEnter: onMouseEnterFromProps,
      onClick: onItemClickFromProps,
      onMouseLeave: onMouseLeaveFromProps
    } = props,
    restOfAllOtherProps = _objectWithoutProperties(props, _excluded3);
  var onMouseEnterFromContext = (0, _tooltipContext.useMouseEnterItemDispatch)(onMouseEnterFromProps, dataKey);
  var onMouseLeaveFromContext = (0, _tooltipContext.useMouseLeaveItemDispatch)(onMouseLeaveFromProps);
  var onClickFromContext = (0, _tooltipContext.useMouseClickItemDispatch)(onItemClickFromProps, dataKey);
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
    return /*#__PURE__*/React.createElement(_Layer.Layer, _extends({
      className: "recharts-bar-rectangle"
    }, (0, _types.adaptEventsOfChild)(restOfAllOtherProps, entry, i), {
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
    }), /*#__PURE__*/React.createElement(_BarUtils.BarRectangle, barRectangleProps));
  }), showLabels && _LabelList.LabelList.renderCallByParent(props, data));
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
  var animationId = (0, _useAnimationId.useAnimationId)(props, 'recharts-bar-');
  var [isAnimating, setIsAnimating] = (0, _react.useState)(false);
  var handleAnimationEnd = (0, _react.useCallback)(() => {
    if (typeof onAnimationEnd === 'function') {
      onAnimationEnd();
    }
    setIsAnimating(false);
  }, [onAnimationEnd]);
  var handleAnimationStart = (0, _react.useCallback)(() => {
    if (typeof onAnimationStart === 'function') {
      onAnimationStart();
    }
    setIsAnimating(true);
  }, [onAnimationStart]);
  return /*#__PURE__*/React.createElement(_Animate.Animate, {
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
        var interpolatorX = (0, _DataUtils.interpolateNumber)(prev.x, entry.x);
        var interpolatorY = (0, _DataUtils.interpolateNumber)(prev.y, entry.y);
        var interpolatorWidth = (0, _DataUtils.interpolateNumber)(prev.width, entry.width);
        var interpolatorHeight = (0, _DataUtils.interpolateNumber)(prev.height, entry.height);
        return _objectSpread(_objectSpread({}, entry), {}, {
          x: interpolatorX(t),
          y: interpolatorY(t),
          width: interpolatorWidth(t),
          height: interpolatorHeight(t)
        });
      }
      if (layout === 'horizontal') {
        var _interpolatorHeight = (0, _DataUtils.interpolateNumber)(0, entry.height);
        var h = _interpolatorHeight(t);
        return _objectSpread(_objectSpread({}, entry), {}, {
          y: entry.y + entry.height - h,
          height: h
        });
      }
      var interpolator = (0, _DataUtils.interpolateNumber)(0, entry.width);
      var w = interpolator(t);
      return _objectSpread(_objectSpread({}, entry), {}, {
        width: w
      });
    });
    if (t > 0) {
      // eslint-disable-next-line no-param-reassign
      previousRectanglesRef.current = stepData;
    }
    return /*#__PURE__*/React.createElement(_Layer.Layer, null, /*#__PURE__*/React.createElement(BarRectangles, {
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
  var previousRectanglesRef = (0, _react.useRef)(null);
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
    errorVal: (0, _ChartUtils.getValueByDataKey)(dataPoint, dataKey)
  };
};
class BarWithState extends _react.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "id", (0, _DataUtils.uniqueId)('recharts-bar-'));
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
    var layerClass = (0, _clsx.clsx)('recharts-bar', className);
    var clipPathId = (0, _DataUtils.isNullish)(id) ? this.id : id;
    return /*#__PURE__*/React.createElement(_Layer.Layer, {
      className: layerClass
    }, needClip && /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement(_GraphicalItemClipPath.GraphicalItemClipPath, {
      clipPathId: clipPathId,
      xAxisId: xAxisId,
      yAxisId: yAxisId
    })), /*#__PURE__*/React.createElement(_Layer.Layer, {
      className: "recharts-bar-rectangles",
      clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : null
    }, /*#__PURE__*/React.createElement(BarBackground, {
      data: data,
      dataKey: dataKey,
      background: background,
      allOtherBarProps: this.props
    }), /*#__PURE__*/React.createElement(RenderRectangles, this.props)), /*#__PURE__*/React.createElement(_ErrorBar.SetErrorBarPreferredDirection, {
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
  isAnimationActive: !_Global.Global.isSsr,
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
  } = (0, _resolveDefaultProps.resolveDefaultProps)(props, defaultBarProps);
  var {
    needClip
  } = (0, _GraphicalItemClipPath.useNeedsClip)(xAxisId, yAxisId);
  var layout = (0, _chartLayoutContext.useChartLayout)();
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  var barSettings = (0, _react.useMemo)(() => ({
    barSize: props.barSize,
    data: undefined,
    dataKey: props.dataKey,
    maxBarSize: props.maxBarSize,
    minPointSize,
    stackId: (0, _ChartUtils.getNormalizedStackId)(props.stackId)
  }), [props.barSize, props.dataKey, props.maxBarSize, minPointSize, props.stackId]);
  var cells = (0, _ReactUtils.findAllByType)(props.children, _Cell.Cell);
  var rects = (0, _hooks.useAppSelector)(state => (0, _barSelectors.selectBarRectangles)(state, xAxisId, yAxisId, isPanorama, barSettings, cells));
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
  return /*#__PURE__*/React.createElement(_CartesianGraphicalItemContext.SetErrorBarContext, {
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
function computeBarRectangles(_ref4) {
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
  var baseValue = (0, _ChartUtils.getBaseValueOfBar)({
    numericAxis
  });
  return displayedData.map((entry, index) => {
    var value, x, y, width, height, background;
    if (stackedData) {
      // we don't need to use dataStartIndex here, because stackedData is already sliced from the selector
      value = (0, _ChartUtils.truncateByDomain)(stackedData[index], stackedDomain);
    } else {
      value = (0, _ChartUtils.getValueByDataKey)(entry, dataKey);
      if (!Array.isArray(value)) {
        value = [baseValue, value];
      }
    }
    var minPointSize = (0, _BarUtils.minPointSizeCallback)(minPointSizeProp, defaultMinPointSize)(value[1], index);
    if (layout === 'horizontal') {
      var _ref5;
      var [baseValueScale, currentValueScale] = [yAxis.scale(value[0]), yAxis.scale(value[1])];
      x = (0, _ChartUtils.getCateCoordinateOfBar)({
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
      height = (0, _DataUtils.isNan)(computedHeight) ? 0 : computedHeight;
      background = {
        x,
        y: offset.top,
        width,
        height: offset.height
      };
      if (Math.abs(minPointSize) > 0 && Math.abs(height) < Math.abs(minPointSize)) {
        var delta = (0, _DataUtils.mathSign)(height || minPointSize) * (Math.abs(minPointSize) - Math.abs(height));
        y -= delta;
        height += delta;
      }
    } else {
      var [_baseValueScale, _currentValueScale] = [xAxis.scale(value[0]), xAxis.scale(value[1])];
      x = _baseValueScale;
      y = (0, _ChartUtils.getCateCoordinateOfBar)({
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
        var _delta = (0, _DataUtils.mathSign)(width || minPointSize) * (Math.abs(minPointSize) - Math.abs(width));
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
class Bar extends _react.PureComponent {
  render() {
    // Report all props to Redux store first, before calling any hooks, to avoid circular dependencies.
    return /*#__PURE__*/React.createElement(_CartesianGraphicalItemContext.CartesianGraphicalItemContext, {
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
    }, /*#__PURE__*/React.createElement(_ReportBar.ReportBar, null), /*#__PURE__*/React.createElement(_SetLegendPayload.SetLegendPayload, {
      legendPayload: computeLegendPayloadFromBarData(this.props)
    }), /*#__PURE__*/React.createElement(_SetTooltipEntrySettings.SetTooltipEntrySettings, {
      fn: getTooltipEntrySettings,
      args: this.props
    }), /*#__PURE__*/React.createElement(BarImpl, this.props));
  }
}
exports.Bar = Bar;
_defineProperty(Bar, "displayName", 'Bar');
_defineProperty(Bar, "defaultProps", defaultBarProps);