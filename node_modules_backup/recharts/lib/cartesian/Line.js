"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Line = void 0;
exports.computeLinePoints = computeLinePoints;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _clsx = require("clsx");
var _Curve = require("../shape/Curve");
var _Dot = require("../shape/Dot");
var _Layer = require("../container/Layer");
var _LabelList = require("../component/LabelList");
var _ErrorBar = require("./ErrorBar");
var _DataUtils = require("../util/DataUtils");
var _ReactUtils = require("../util/ReactUtils");
var _Global = require("../util/Global");
var _ChartUtils = require("../util/ChartUtils");
var _ActivePoints = require("../component/ActivePoints");
var _SetTooltipEntrySettings = require("../state/SetTooltipEntrySettings");
var _CartesianGraphicalItemContext = require("../context/CartesianGraphicalItemContext");
var _GraphicalItemClipPath = require("./GraphicalItemClipPath");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _PanoramaContext = require("../context/PanoramaContext");
var _lineSelectors = require("../state/selectors/lineSelectors");
var _hooks = require("../state/hooks");
var _SetLegendPayload = require("../state/SetLegendPayload");
var _useAnimationId = require("../util/useAnimationId");
var _resolveDefaultProps2 = require("../util/resolveDefaultProps");
var _Animate = require("../animation/Animate");
var _hooks2 = require("../hooks");
var _excluded = ["type", "layout", "connectNulls", "needClip"],
  _excluded2 = ["activeDot", "animateNewValues", "animationBegin", "animationDuration", "animationEasing", "connectNulls", "dot", "hide", "isAnimationActive", "label", "legendType", "xAxisId", "yAxisId"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } // eslint-disable-next-line max-classes-per-file
/**
 * Internal props, combination of external props + defaultProps + private Recharts state
 */

/**
 * External props, intended for end users to fill in
 */

/**
 * Because of naming conflict, we are forced to ignore certain (valid) SVG attributes.
 */

var computeLegendPayloadFromAreaData = props => {
  var {
    dataKey,
    name,
    stroke,
    legendType,
    hide
  } = props;
  return [{
    inactive: hide,
    dataKey,
    type: legendType,
    color: stroke,
    value: (0, _ChartUtils.getTooltipNameProp)(name, dataKey),
    payload: props
  }];
};
function getTooltipEntrySettings(props) {
  var {
    dataKey,
    data,
    stroke,
    strokeWidth,
    fill,
    name,
    hide,
    unit
  } = props;
  return {
    dataDefinedOnItem: data,
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
      color: props.stroke,
      unit
    }
  };
}
var generateSimpleStrokeDasharray = (totalLength, length) => {
  return "".concat(length, "px ").concat(totalLength - length, "px");
};
function repeat(lines, count) {
  var linesUnit = lines.length % 2 !== 0 ? [...lines, 0] : lines;
  var result = [];
  for (var i = 0; i < count; ++i) {
    result = [...result, ...linesUnit];
  }
  return result;
}
var getStrokeDasharray = (length, totalLength, lines) => {
  var lineLength = lines.reduce((pre, next) => pre + next);

  // if lineLength is 0 return the default when no strokeDasharray is provided
  if (!lineLength) {
    return generateSimpleStrokeDasharray(totalLength, length);
  }
  var count = Math.floor(length / lineLength);
  var remainLength = length % lineLength;
  var restLength = totalLength - length;
  var remainLines = [];
  for (var i = 0, sum = 0; i < lines.length; sum += lines[i], ++i) {
    if (sum + lines[i] > remainLength) {
      remainLines = [...lines.slice(0, i), remainLength - sum];
      break;
    }
  }
  var emptyLines = remainLines.length % 2 === 0 ? [0, restLength] : [restLength];
  return [...repeat(lines, count), ...remainLines, ...emptyLines].map(line => "".concat(line, "px")).join(', ');
};
function renderDotItem(option, props) {
  var dotItem;
  if (/*#__PURE__*/React.isValidElement(option)) {
    dotItem = /*#__PURE__*/React.cloneElement(option, props);
  } else if (typeof option === 'function') {
    dotItem = option(props);
  } else {
    var className = (0, _clsx.clsx)('recharts-line-dot', typeof option !== 'boolean' ? option.className : '');
    dotItem = /*#__PURE__*/React.createElement(_Dot.Dot, _extends({}, props, {
      className: className
    }));
  }
  return dotItem;
}
function shouldRenderDots(points, dot) {
  if (points == null) {
    return false;
  }
  if (dot) {
    return true;
  }
  return points.length === 1;
}
function Dots(_ref) {
  var {
    clipPathId,
    points,
    props
  } = _ref;
  var {
    dot,
    dataKey,
    needClip
  } = props;
  if (!shouldRenderDots(points, dot)) {
    return null;
  }
  var clipDot = (0, _ReactUtils.isClipDot)(dot);
  var lineProps = (0, _ReactUtils.filterProps)(props, false);
  var customDotProps = (0, _ReactUtils.filterProps)(dot, true);
  var dots = points.map((entry, i) => {
    var dotProps = _objectSpread(_objectSpread(_objectSpread({
      key: "dot-".concat(i),
      r: 3
    }, lineProps), customDotProps), {}, {
      index: i,
      cx: entry.x,
      cy: entry.y,
      dataKey,
      value: entry.value,
      payload: entry.payload,
      points
    });
    return renderDotItem(dot, dotProps);
  });
  var dotsProps = {
    clipPath: needClip ? "url(#clipPath-".concat(clipDot ? '' : 'dots-').concat(clipPathId, ")") : null
  };
  return /*#__PURE__*/React.createElement(_Layer.Layer, _extends({
    className: "recharts-line-dots",
    key: "dots"
  }, dotsProps), dots);
}
function StaticCurve(_ref2) {
  var {
    clipPathId,
    pathRef,
    points,
    strokeDasharray,
    props,
    showLabels
  } = _ref2;
  var {
      type,
      layout,
      connectNulls,
      needClip
    } = props,
    others = _objectWithoutProperties(props, _excluded);
  var curveProps = _objectSpread(_objectSpread({}, (0, _ReactUtils.filterProps)(others, true)), {}, {
    fill: 'none',
    className: 'recharts-line-curve',
    clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : null,
    points,
    type,
    layout,
    connectNulls,
    strokeDasharray: strokeDasharray !== null && strokeDasharray !== void 0 ? strokeDasharray : props.strokeDasharray
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, (points === null || points === void 0 ? void 0 : points.length) > 1 && /*#__PURE__*/React.createElement(_Curve.Curve, _extends({}, curveProps, {
    pathRef: pathRef
  })), /*#__PURE__*/React.createElement(Dots, {
    points: points,
    clipPathId: clipPathId,
    props: props
  }), showLabels && _LabelList.LabelList.renderCallByParent(props, points));
}
function getTotalLength(mainCurve) {
  try {
    return mainCurve && mainCurve.getTotalLength && mainCurve.getTotalLength() || 0;
  } catch (_unused) {
    return 0;
  }
}
function CurveWithAnimation(_ref3) {
  var {
    clipPathId,
    props,
    pathRef,
    previousPointsRef,
    longestAnimatedLengthRef
  } = _ref3;
  var {
    points,
    strokeDasharray,
    isAnimationActive,
    animationBegin,
    animationDuration,
    animationEasing,
    animateNewValues,
    width,
    height,
    onAnimationEnd,
    onAnimationStart
  } = props;
  var prevPoints = previousPointsRef.current;
  var animationId = (0, _useAnimationId.useAnimationId)(props, 'recharts-line-');
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
  var totalLength = getTotalLength(pathRef.current);
  /*
   * Here we want to detect if the length animation has been interrupted.
   * For that we keep a reference to the furthest length that has been animated.
   *
   * And then, to keep things smooth, we add to it the current length that is being animated right now.
   *
   * If we did Math.max then it makes the length animation "pause" but we want to keep it smooth
   * so in case we have some "leftover" length from the previous animation we add it to the current length.
   *
   * This is not perfect because the animation changes speed due to easing. The default easing is 'ease' which is not linear
   * and makes it stand out. But it's good enough I suppose.
   * If we want to fix it then we need to keep track of multiple animations and their easing and timings.
   *
   * If you want to see this in action, try to change the dataKey of the line chart while the initial animation is running.
   * The Line begins with zero length and slowly grows to the full length. While this growth is in progress,
   * change the dataKey and the Line will continue growing from where it has grown so far.
   */
  var startingPoint = longestAnimatedLengthRef.current;
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
  }, _ref4 => {
    var {
      t
    } = _ref4;
    var interpolator = (0, _DataUtils.interpolateNumber)(startingPoint, totalLength + startingPoint);
    var curLength = Math.min(interpolator(t), totalLength);
    var currentStrokeDasharray;
    if (strokeDasharray) {
      var lines = "".concat(strokeDasharray).split(/[,\s]+/gim).map(num => parseFloat(num));
      currentStrokeDasharray = getStrokeDasharray(curLength, totalLength, lines);
    } else {
      currentStrokeDasharray = generateSimpleStrokeDasharray(totalLength, curLength);
    }
    if (prevPoints) {
      var prevPointsDiffFactor = prevPoints.length / points.length;
      var stepData = t === 1 ? points : points.map((entry, index) => {
        var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
        if (prevPoints[prevPointIndex]) {
          var prev = prevPoints[prevPointIndex];
          var interpolatorX = (0, _DataUtils.interpolateNumber)(prev.x, entry.x);
          var interpolatorY = (0, _DataUtils.interpolateNumber)(prev.y, entry.y);
          return _objectSpread(_objectSpread({}, entry), {}, {
            x: interpolatorX(t),
            y: interpolatorY(t)
          });
        }

        // magic number of faking previous x and y location
        if (animateNewValues) {
          var _interpolatorX = (0, _DataUtils.interpolateNumber)(width * 2, entry.x);
          var _interpolatorY = (0, _DataUtils.interpolateNumber)(height / 2, entry.y);
          return _objectSpread(_objectSpread({}, entry), {}, {
            x: _interpolatorX(t),
            y: _interpolatorY(t)
          });
        }
        return _objectSpread(_objectSpread({}, entry), {}, {
          x: entry.x,
          y: entry.y
        });
      });
      // eslint-disable-next-line no-param-reassign
      previousPointsRef.current = stepData;
      return /*#__PURE__*/React.createElement(StaticCurve, {
        props: props,
        points: stepData,
        clipPathId: clipPathId,
        pathRef: pathRef,
        showLabels: !isAnimating,
        strokeDasharray: currentStrokeDasharray
      });
    }

    /*
     * Here it is important to wait a little bit with updating the previousPointsRef
     * before the animation has a time to initialize.
     * If we set the previous pointsRef immediately, we set it before the Legend height it calculated
     * and before pathRef is set.
     * If that happens, the Line will re-render again after Legend had reported its height
     * which will start a new animation with the previous points as the starting point
     * which gives the effect of the Line animating slightly upwards (where the animation distance equals the Legend height).
     * Waiting for t > 0 is indirect but good enough to ensure that the Legend height is calculated and animation works properly.
     *
     * Total length similarly is calculated from the pathRef. We should not update the previousPointsRef
     * before the pathRef is set, otherwise we will have a wrong total length.
     */
    if (t > 0 && totalLength > 0) {
      // eslint-disable-next-line no-param-reassign
      previousPointsRef.current = points;
      /*
       * totalLength is set from a ref and is not updated in the first tick of the animation.
       * It defaults to zero which is exactly what we want here because we want to grow from zero,
       * however the same happens when the data change.
       *
       * In that case we want to remember the previous length and continue from there, and only animate the shape.
       *
       * Therefore the totalLength > 0 check.
       *
       * The Animate is about to fire handleAnimationStart which will update the state
       * and cause a re-render and read a new proper totalLength which will be used in the next tick
       * and update the longestAnimatedLengthRef.
       */
      // eslint-disable-next-line no-param-reassign
      longestAnimatedLengthRef.current = curLength;
    }
    return /*#__PURE__*/React.createElement(StaticCurve, {
      props: props,
      points: points,
      clipPathId: clipPathId,
      pathRef: pathRef,
      showLabels: !isAnimating,
      strokeDasharray: currentStrokeDasharray
    });
  });
}
function RenderCurve(_ref5) {
  var {
    clipPathId,
    props
  } = _ref5;
  var {
    points,
    isAnimationActive
  } = props;
  var previousPointsRef = (0, _react.useRef)(null);
  var longestAnimatedLengthRef = (0, _react.useRef)(0);
  var pathRef = (0, _react.useRef)(null);
  var prevPoints = previousPointsRef.current;
  if (isAnimationActive && points && points.length && prevPoints !== points) {
    return /*#__PURE__*/React.createElement(CurveWithAnimation, {
      props: props,
      clipPathId: clipPathId,
      previousPointsRef: previousPointsRef,
      longestAnimatedLengthRef: longestAnimatedLengthRef,
      pathRef: pathRef
    });
  }
  return /*#__PURE__*/React.createElement(StaticCurve, {
    props: props,
    points: points,
    clipPathId: clipPathId,
    pathRef: pathRef,
    showLabels: true
  });
}
var errorBarDataPointFormatter = (dataPoint, dataKey) => {
  return {
    x: dataPoint.x,
    y: dataPoint.y,
    value: dataPoint.value,
    // @ts-expect-error getValueByDataKey does not validate the output type
    errorVal: (0, _ChartUtils.getValueByDataKey)(dataPoint.payload, dataKey)
  };
};
class LineWithState extends _react.Component {
  constructor() {
    super(...arguments);
    _defineProperty(this, "id", (0, _DataUtils.uniqueId)('recharts-line-'));
  }
  render() {
    var _filterProps;
    var {
      hide,
      dot,
      points,
      className,
      xAxisId,
      yAxisId,
      top,
      left,
      width,
      height,
      id,
      needClip,
      layout
    } = this.props;
    if (hide) {
      return null;
    }
    var layerClass = (0, _clsx.clsx)('recharts-line', className);
    var clipPathId = (0, _DataUtils.isNullish)(id) ? this.id : id;
    var {
      r = 3,
      strokeWidth = 2
    } = (_filterProps = (0, _ReactUtils.filterProps)(dot, false)) !== null && _filterProps !== void 0 ? _filterProps : {
      r: 3,
      strokeWidth: 2
    };
    var clipDot = (0, _ReactUtils.isClipDot)(dot);
    var dotSize = r * 2 + strokeWidth;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Layer.Layer, {
      className: layerClass
    }, needClip && /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement(_GraphicalItemClipPath.GraphicalItemClipPath, {
      clipPathId: clipPathId,
      xAxisId: xAxisId,
      yAxisId: yAxisId
    }), !clipDot && /*#__PURE__*/React.createElement("clipPath", {
      id: "clipPath-dots-".concat(clipPathId)
    }, /*#__PURE__*/React.createElement("rect", {
      x: left - dotSize / 2,
      y: top - dotSize / 2,
      width: width + dotSize,
      height: height + dotSize
    }))), /*#__PURE__*/React.createElement(RenderCurve, {
      props: this.props,
      clipPathId: clipPathId
    }), /*#__PURE__*/React.createElement(_ErrorBar.SetErrorBarPreferredDirection, {
      direction: layout === 'horizontal' ? 'y' : 'x'
    }, /*#__PURE__*/React.createElement(_CartesianGraphicalItemContext.SetErrorBarContext, {
      xAxisId: xAxisId,
      yAxisId: yAxisId,
      data: points,
      dataPointFormatter: errorBarDataPointFormatter,
      errorBarOffset: 0
    }, this.props.children))), /*#__PURE__*/React.createElement(_ActivePoints.ActivePoints, {
      activeDot: this.props.activeDot,
      points: points,
      mainColor: this.props.stroke,
      itemDataKey: this.props.dataKey
    }));
  }
}
var defaultLineProps = {
  activeDot: true,
  animateNewValues: true,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
  connectNulls: false,
  dot: true,
  fill: '#fff',
  hide: false,
  isAnimationActive: !_Global.Global.isSsr,
  label: false,
  legendType: 'line',
  stroke: '#3182bd',
  strokeWidth: 1,
  xAxisId: 0,
  yAxisId: 0
};
function LineImpl(props) {
  var _resolveDefaultProps = (0, _resolveDefaultProps2.resolveDefaultProps)(props, defaultLineProps),
    {
      activeDot,
      animateNewValues,
      animationBegin,
      animationDuration,
      animationEasing,
      connectNulls,
      dot,
      hide,
      isAnimationActive,
      label,
      legendType,
      xAxisId,
      yAxisId
    } = _resolveDefaultProps,
    everythingElse = _objectWithoutProperties(_resolveDefaultProps, _excluded2);
  var {
    needClip
  } = (0, _GraphicalItemClipPath.useNeedsClip)(xAxisId, yAxisId);
  var {
    height,
    width,
    x: left,
    y: top
  } = (0, _hooks2.usePlotArea)();
  var layout = (0, _chartLayoutContext.useChartLayout)();
  var isPanorama = (0, _PanoramaContext.useIsPanorama)();
  var lineSettings = (0, _react.useMemo)(() => ({
    dataKey: props.dataKey,
    data: props.data
  }), [props.dataKey, props.data]);
  var points = (0, _hooks.useAppSelector)(state => (0, _lineSelectors.selectLinePoints)(state, xAxisId, yAxisId, isPanorama, lineSettings));
  if (layout !== 'horizontal' && layout !== 'vertical') {
    // Cannot render Line in an unsupported layout
    return null;
  }
  return /*#__PURE__*/React.createElement(LineWithState, _extends({}, everythingElse, {
    connectNulls: connectNulls,
    dot: dot,
    activeDot: activeDot,
    animateNewValues: animateNewValues,
    animationBegin: animationBegin,
    animationDuration: animationDuration,
    animationEasing: animationEasing,
    isAnimationActive: isAnimationActive,
    hide: hide,
    label: label,
    legendType: legendType,
    xAxisId: xAxisId,
    yAxisId: yAxisId,
    points: points,
    layout: layout,
    height: height,
    width: width,
    left: left,
    top: top,
    needClip: needClip
  }));
}
function computeLinePoints(_ref6) {
  var {
    layout,
    xAxis,
    yAxis,
    xAxisTicks,
    yAxisTicks,
    dataKey,
    bandSize,
    displayedData
  } = _ref6;
  return displayedData.map((entry, index) => {
    // @ts-expect-error getValueByDataKey does not validate the output type
    var value = (0, _ChartUtils.getValueByDataKey)(entry, dataKey);
    if (layout === 'horizontal') {
      return {
        x: (0, _ChartUtils.getCateCoordinateOfLine)({
          axis: xAxis,
          ticks: xAxisTicks,
          bandSize,
          entry,
          index
        }),
        y: (0, _DataUtils.isNullish)(value) ? null : yAxis.scale(value),
        value,
        payload: entry
      };
    }
    return {
      x: (0, _DataUtils.isNullish)(value) ? null : xAxis.scale(value),
      y: (0, _ChartUtils.getCateCoordinateOfLine)({
        axis: yAxis,
        ticks: yAxisTicks,
        bandSize,
        entry,
        index
      }),
      value,
      payload: entry
    };
  });
}
class Line extends _react.PureComponent {
  render() {
    // Report all props to Redux store first, before calling any hooks, to avoid circular dependencies.
    return /*#__PURE__*/React.createElement(_CartesianGraphicalItemContext.CartesianGraphicalItemContext, {
      type: "line",
      data: this.props.data,
      xAxisId: this.props.xAxisId,
      yAxisId: this.props.yAxisId,
      zAxisId: 0,
      dataKey: this.props.dataKey
      // line doesn't stack
      ,
      stackId: undefined,
      hide: this.props.hide,
      barSize: undefined
    }, /*#__PURE__*/React.createElement(_SetLegendPayload.SetLegendPayload, {
      legendPayload: computeLegendPayloadFromAreaData(this.props)
    }), /*#__PURE__*/React.createElement(_SetTooltipEntrySettings.SetTooltipEntrySettings, {
      fn: getTooltipEntrySettings,
      args: this.props
    }), /*#__PURE__*/React.createElement(LineImpl, this.props));
  }
}
exports.Line = Line;
_defineProperty(Line, "displayName", 'Line');
_defineProperty(Line, "defaultProps", defaultLineProps);