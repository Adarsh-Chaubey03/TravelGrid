var _excluded = ["layout", "type", "stroke", "connectNulls", "isRange"],
  _excluded2 = ["activeDot", "animationBegin", "animationDuration", "animationEasing", "connectNulls", "dot", "fill", "fillOpacity", "hide", "isAnimationActive", "legendType", "stroke", "xAxisId", "yAxisId"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// eslint-disable-next-line max-classes-per-file
import * as React from 'react';
import { PureComponent, useCallback, useMemo, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { Curve } from '../shape/Curve';
import { Dot } from '../shape/Dot';
import { Layer } from '../container/Layer';
import { LabelList } from '../component/LabelList';
import { Global } from '../util/Global';
import { interpolate, isNan, isNullish, isNumber, uniqueId } from '../util/DataUtils';
import { getCateCoordinateOfLine, getTooltipNameProp, getValueByDataKey } from '../util/ChartUtils';
import { filterProps, isClipDot } from '../util/ReactUtils';
import { ActivePoints } from '../component/ActivePoints';
import { SetTooltipEntrySettings } from '../state/SetTooltipEntrySettings';
import { CartesianGraphicalItemContext } from '../context/CartesianGraphicalItemContext';
import { GraphicalItemClipPath, useNeedsClip } from './GraphicalItemClipPath';
import { selectArea } from '../state/selectors/areaSelectors';
import { useIsPanorama } from '../context/PanoramaContext';
import { useChartLayout } from '../context/chartLayoutContext';
import { useChartName } from '../state/selectors/selectors';
import { SetLegendPayload } from '../state/SetLegendPayload';
import { useAppSelector } from '../state/hooks';
import { useAnimationId } from '../util/useAnimationId';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { isWellBehavedNumber } from '../util/isWellBehavedNumber';
import { Animate } from '../animation/Animate';
import { usePlotArea } from '../hooks';

/**
 * Internal props, combination of external props + defaultProps + private Recharts state
 */

/**
 * External props, intended for end users to fill in
 */

/**
 * Because of naming conflict, we are forced to ignore certain (valid) SVG attributes.
 */

function getLegendItemColor(stroke, fill) {
  return stroke && stroke !== 'none' ? stroke : fill;
}
var computeLegendPayloadFromAreaData = props => {
  var {
    dataKey,
    name,
    stroke,
    fill,
    legendType,
    hide
  } = props;
  return [{
    inactive: hide,
    dataKey,
    type: legendType,
    color: getLegendItemColor(stroke, fill),
    value: getTooltipNameProp(name, dataKey),
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
      name: getTooltipNameProp(name, dataKey),
      hide,
      type: props.tooltipType,
      color: getLegendItemColor(stroke, fill),
      unit
    }
  };
}
var renderDotItem = (option, props) => {
  var dotItem;
  if (/*#__PURE__*/React.isValidElement(option)) {
    dotItem = /*#__PURE__*/React.cloneElement(option, props);
  } else if (typeof option === 'function') {
    dotItem = option(props);
  } else {
    var className = clsx('recharts-area-dot', typeof option !== 'boolean' ? option.className : '');
    dotItem = /*#__PURE__*/React.createElement(Dot, _extends({}, props, {
      className: className
    }));
  }
  return dotItem;
};
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
    needClip,
    dot,
    dataKey
  } = props;
  if (!shouldRenderDots(points, dot)) {
    return null;
  }
  var clipDot = isClipDot(dot);
  var areaProps = filterProps(props, false);
  var customDotProps = filterProps(dot, true);
  var dots = points.map((entry, i) => {
    var dotProps = _objectSpread(_objectSpread(_objectSpread({
      key: "dot-".concat(i),
      r: 3
    }, areaProps), customDotProps), {}, {
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
    clipPath: needClip ? "url(#clipPath-".concat(clipDot ? '' : 'dots-').concat(clipPathId, ")") : undefined
  };
  return /*#__PURE__*/React.createElement(Layer, _extends({
    className: "recharts-area-dots"
  }, dotsProps), dots);
}
function StaticArea(_ref2) {
  var {
    points,
    baseLine,
    needClip,
    clipPathId,
    props,
    showLabels
  } = _ref2;
  var {
      layout,
      type,
      stroke,
      connectNulls,
      isRange
    } = props,
    others = _objectWithoutProperties(props, _excluded);
  return /*#__PURE__*/React.createElement(React.Fragment, null, (points === null || points === void 0 ? void 0 : points.length) > 1 && /*#__PURE__*/React.createElement(Layer, {
    clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : undefined
  }, /*#__PURE__*/React.createElement(Curve, _extends({}, filterProps(others, true), {
    points: points,
    connectNulls: connectNulls,
    type: type,
    baseLine: baseLine,
    layout: layout,
    stroke: "none",
    className: "recharts-area-area"
  })), stroke !== 'none' && /*#__PURE__*/React.createElement(Curve, _extends({}, filterProps(props, false), {
    className: "recharts-area-curve",
    layout: layout,
    type: type,
    connectNulls: connectNulls,
    fill: "none",
    points: points
  })), stroke !== 'none' && isRange && /*#__PURE__*/React.createElement(Curve, _extends({}, filterProps(props, false), {
    className: "recharts-area-curve",
    layout: layout,
    type: type,
    connectNulls: connectNulls,
    fill: "none",
    points: baseLine
  }))), /*#__PURE__*/React.createElement(Dots, {
    points: points,
    props: props,
    clipPathId: clipPathId
  }), showLabels && LabelList.renderCallByParent(props, points));
}
function VerticalRect(_ref3) {
  var {
    alpha,
    baseLine,
    points,
    strokeWidth
  } = _ref3;
  var startY = points[0].y;
  var endY = points[points.length - 1].y;
  if (!isWellBehavedNumber(startY) || !isWellBehavedNumber(endY)) {
    return null;
  }
  var height = alpha * Math.abs(startY - endY);
  var maxX = Math.max(...points.map(entry => entry.x || 0));
  if (isNumber(baseLine)) {
    maxX = Math.max(baseLine, maxX);
  } else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
    maxX = Math.max(...baseLine.map(entry => entry.x || 0), maxX);
  }
  if (isNumber(maxX)) {
    return /*#__PURE__*/React.createElement("rect", {
      x: 0,
      y: startY < endY ? startY : startY - height,
      width: maxX + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1),
      height: Math.floor(height)
    });
  }
  return null;
}
function HorizontalRect(_ref4) {
  var {
    alpha,
    baseLine,
    points,
    strokeWidth
  } = _ref4;
  var startX = points[0].x;
  var endX = points[points.length - 1].x;
  if (!isWellBehavedNumber(startX) || !isWellBehavedNumber(endX)) {
    return null;
  }
  var width = alpha * Math.abs(startX - endX);
  var maxY = Math.max(...points.map(entry => entry.y || 0));
  if (isNumber(baseLine)) {
    maxY = Math.max(baseLine, maxY);
  } else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
    maxY = Math.max(...baseLine.map(entry => entry.y || 0), maxY);
  }
  if (isNumber(maxY)) {
    return /*#__PURE__*/React.createElement("rect", {
      x: startX < endX ? startX : startX - width,
      y: 0,
      width: width,
      height: Math.floor(maxY + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1))
    });
  }
  return null;
}
function ClipRect(_ref5) {
  var {
    alpha,
    layout,
    points,
    baseLine,
    strokeWidth
  } = _ref5;
  if (layout === 'vertical') {
    return /*#__PURE__*/React.createElement(VerticalRect, {
      alpha: alpha,
      points: points,
      baseLine: baseLine,
      strokeWidth: strokeWidth
    });
  }
  return /*#__PURE__*/React.createElement(HorizontalRect, {
    alpha: alpha,
    points: points,
    baseLine: baseLine,
    strokeWidth: strokeWidth
  });
}
function AreaWithAnimation(_ref6) {
  var {
    needClip,
    clipPathId,
    props,
    previousPointsRef,
    previousBaselineRef
  } = _ref6;
  var {
    points,
    baseLine,
    isAnimationActive,
    animationBegin,
    animationDuration,
    animationEasing,
    onAnimationStart,
    onAnimationEnd
  } = props;
  var animationId = useAnimationId(props, 'recharts-area-');
  var [isAnimating, setIsAnimating] = useState(true);
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
  var prevPoints = previousPointsRef.current;
  var prevBaseLine = previousBaselineRef.current;
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
  }, _ref7 => {
    var {
      t
    } = _ref7;
    if (prevPoints) {
      var prevPointsDiffFactor = prevPoints.length / points.length;
      var stepPoints =
      /*
       * Here it is important that at the very end of the animation, on the last frame,
       * we render the original points without any interpolation.
       * This is needed because the code above is checking for reference equality to decide if the animation should run
       * and if we create a new array instance (even if the numbers were the same)
       * then we would break animations.
       */
      t === 1 ? points : points.map((entry, index) => {
        var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
        if (prevPoints[prevPointIndex]) {
          var prev = prevPoints[prevPointIndex];
          return _objectSpread(_objectSpread({}, entry), {}, {
            x: interpolate(prev.x, entry.x, t),
            y: interpolate(prev.y, entry.y, t)
          });
        }
        return entry;
      });
      var stepBaseLine;
      if (isNumber(baseLine)) {
        stepBaseLine = interpolate(prevBaseLine, baseLine, t);
      } else if (isNullish(baseLine) || isNan(baseLine)) {
        stepBaseLine = interpolate(prevBaseLine, 0, t);
      } else {
        stepBaseLine = baseLine.map((entry, index) => {
          var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
          if (Array.isArray(prevBaseLine) && prevBaseLine[prevPointIndex]) {
            var prev = prevBaseLine[prevPointIndex];
            return _objectSpread(_objectSpread({}, entry), {}, {
              x: interpolate(prev.x, entry.x, t),
              y: interpolate(prev.y, entry.y, t)
            });
          }
          return entry;
        });
      }
      if (t > 0) {
        /*
         * We need to keep the refs in the parent component because we need to remember the last shape of the animation
         * even if AreaWithAnimation is unmounted as that happens when changing props.
         *
         * And we need to update the refs here because here is where the interpolation is computed.
         * Eslint doesn't like changing function arguments, but we need it so here is an eslint-disable.
         */
        // eslint-disable-next-line no-param-reassign
        previousPointsRef.current = stepPoints;
        // eslint-disable-next-line no-param-reassign
        previousBaselineRef.current = stepBaseLine;
      }
      return /*#__PURE__*/React.createElement(StaticArea, {
        points: stepPoints,
        baseLine: stepBaseLine,
        needClip: needClip,
        clipPathId: clipPathId,
        props: props,
        showLabels: !isAnimating
      });
    }
    if (t > 0) {
      // eslint-disable-next-line no-param-reassign
      previousPointsRef.current = points;
      // eslint-disable-next-line no-param-reassign
      previousBaselineRef.current = baseLine;
    }
    return /*#__PURE__*/React.createElement(Layer, null, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
      id: "animationClipPath-".concat(clipPathId)
    }, /*#__PURE__*/React.createElement(ClipRect, {
      alpha: t,
      points: points,
      baseLine: baseLine,
      layout: props.layout,
      strokeWidth: props.strokeWidth
    }))), /*#__PURE__*/React.createElement(Layer, {
      clipPath: "url(#animationClipPath-".concat(clipPathId, ")")
    }, /*#__PURE__*/React.createElement(StaticArea, {
      points: points,
      baseLine: baseLine,
      needClip: needClip,
      clipPathId: clipPathId,
      props: props,
      showLabels: true
    })));
  });
}

/*
 * This components decides if the area should be animated or not.
 * It also holds the state of the animation.
 */
function RenderArea(_ref8) {
  var {
    needClip,
    clipPathId,
    props
  } = _ref8;
  var {
    points,
    baseLine,
    isAnimationActive
  } = props;

  /*
   * These two must be refs, not state!
   * Because we want to store the most recent shape of the animation in case we have to interrupt the animation;
   * that happens when user initiates another animation before the current one finishes.
   *
   * If this was a useState, then every step in the animation would trigger a re-render.
   * So, useRef it is.
   */
  var previousPointsRef = useRef(null);
  var previousBaselineRef = useRef();
  var prevPoints = previousPointsRef.current;
  var prevBaseLine = previousBaselineRef.current;
  if (isAnimationActive &&
  /*
   * Here it's important that we unmount of AreaWithAnimation in case points are undefined
   * - this will make sure to interrupt the animation if it's running.
   * We still get to keep the last shape of the animation in the refs above.
   */
  points && points.length && (prevPoints !== points || prevBaseLine !== baseLine)) {
    return /*#__PURE__*/React.createElement(AreaWithAnimation, {
      needClip: needClip,
      clipPathId: clipPathId,
      props: props,
      previousPointsRef: previousPointsRef,
      previousBaselineRef: previousBaselineRef
    });
  }
  return /*#__PURE__*/React.createElement(StaticArea, {
    points: points,
    baseLine: baseLine,
    needClip: needClip,
    clipPathId: clipPathId,
    props: props,
    showLabels: true
  });
}
class AreaWithState extends PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "id", uniqueId('recharts-area-'));
  }
  render() {
    var _filterProps;
    var {
      hide,
      dot,
      points,
      className,
      top,
      left,
      needClip,
      xAxisId,
      yAxisId,
      width,
      height,
      id,
      baseLine
    } = this.props;
    if (hide) {
      return null;
    }
    var layerClass = clsx('recharts-area', className);
    var clipPathId = isNullish(id) ? this.id : id;
    var {
      r = 3,
      strokeWidth = 2
    } = (_filterProps = filterProps(dot, false)) !== null && _filterProps !== void 0 ? _filterProps : {
      r: 3,
      strokeWidth: 2
    };
    var clipDot = isClipDot(dot);
    var dotSize = r * 2 + strokeWidth;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Layer, {
      className: layerClass
    }, needClip && /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement(GraphicalItemClipPath, {
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
    }))), /*#__PURE__*/React.createElement(RenderArea, {
      needClip: needClip,
      clipPathId: clipPathId,
      props: this.props
    })), /*#__PURE__*/React.createElement(ActivePoints, {
      points: points,
      mainColor: getLegendItemColor(this.props.stroke, this.props.fill),
      itemDataKey: this.props.dataKey,
      activeDot: this.props.activeDot
    }), this.props.isRange && Array.isArray(baseLine) && /*#__PURE__*/React.createElement(ActivePoints, {
      points: baseLine,
      mainColor: getLegendItemColor(this.props.stroke, this.props.fill),
      itemDataKey: this.props.dataKey,
      activeDot: this.props.activeDot
    }));
  }
}
var defaultAreaProps = {
  activeDot: true,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
  connectNulls: false,
  dot: false,
  fill: '#3182bd',
  fillOpacity: 0.6,
  hide: false,
  isAnimationActive: !Global.isSsr,
  legendType: 'line',
  stroke: '#3182bd',
  xAxisId: 0,
  yAxisId: 0
};
function AreaImpl(props) {
  var _useAppSelector;
  var _resolveDefaultProps = resolveDefaultProps(props, defaultAreaProps),
    {
      activeDot,
      animationBegin,
      animationDuration,
      animationEasing,
      connectNulls,
      dot,
      fill,
      fillOpacity,
      hide,
      isAnimationActive,
      legendType,
      stroke,
      xAxisId,
      yAxisId
    } = _resolveDefaultProps,
    everythingElse = _objectWithoutProperties(_resolveDefaultProps, _excluded2);
  var layout = useChartLayout();
  var chartName = useChartName();
  var {
    needClip
  } = useNeedsClip(xAxisId, yAxisId);
  var isPanorama = useIsPanorama();
  var areaSettings = useMemo(() => ({
    baseValue: props.baseValue,
    stackId: props.stackId,
    connectNulls,
    data: props.data,
    dataKey: props.dataKey
  }), [props.baseValue, props.stackId, connectNulls, props.data, props.dataKey]);
  var {
    points,
    isRange,
    baseLine
  } = (_useAppSelector = useAppSelector(state => selectArea(state, xAxisId, yAxisId, isPanorama, areaSettings))) !== null && _useAppSelector !== void 0 ? _useAppSelector : {};
  var {
    height,
    width,
    x: left,
    y: top
  } = usePlotArea();
  if (layout !== 'horizontal' && layout !== 'vertical') {
    // Can't render Area in an unsupported layout
    return null;
  }
  if (chartName !== 'AreaChart' && chartName !== 'ComposedChart') {
    // There is nothing stopping us from rendering Area in other charts, except for historical reasons. Do we want to allow that?
    return null;
  }

  /*
   * It is important to NOT have this condition here,
   * because we need the Animate inside to receive an empty state
   * so that it can properly reset its internal state and start a new animation.
   */
  // if (!points || !points.length) {
  //   return null;
  // }

  return /*#__PURE__*/React.createElement(AreaWithState, _extends({}, everythingElse, {
    activeDot: activeDot,
    animationBegin: animationBegin,
    animationDuration: animationDuration,
    animationEasing: animationEasing,
    baseLine: baseLine,
    connectNulls: connectNulls,
    dot: dot,
    fill: fill,
    fillOpacity: fillOpacity,
    height: height,
    hide: hide,
    layout: layout,
    isAnimationActive: isAnimationActive,
    isRange: isRange,
    legendType: legendType,
    needClip: needClip,
    points: points,
    stroke: stroke,
    width: width,
    left: left,
    top: top,
    xAxisId: xAxisId,
    yAxisId: yAxisId
  }));
}
export var getBaseValue = (layout, chartBaseValue, itemBaseValue, xAxis, yAxis) => {
  // The baseValue can be defined both on the AreaChart, and on the Area.
  // The value for the item takes precedence.
  var baseValue = itemBaseValue !== null && itemBaseValue !== void 0 ? itemBaseValue : chartBaseValue;
  if (isNumber(baseValue)) {
    return baseValue;
  }
  var numericAxis = layout === 'horizontal' ? yAxis : xAxis;
  // @ts-expect-error d3scale .domain() returns unknown, Math.max expects number
  var domain = numericAxis.scale.domain();
  if (numericAxis.type === 'number') {
    var domainMax = Math.max(domain[0], domain[1]);
    var domainMin = Math.min(domain[0], domain[1]);
    if (baseValue === 'dataMin') {
      return domainMin;
    }
    if (baseValue === 'dataMax') {
      return domainMax;
    }
    return domainMax < 0 ? domainMax : Math.max(Math.min(domain[0], domain[1]), 0);
  }
  if (baseValue === 'dataMin') {
    return domain[0];
  }
  if (baseValue === 'dataMax') {
    return domain[1];
  }
  return domain[0];
};
export function computeArea(_ref9) {
  var {
    areaSettings: {
      connectNulls,
      baseValue: itemBaseValue,
      dataKey
    },
    stackedData,
    layout,
    chartBaseValue,
    xAxis,
    yAxis,
    displayedData,
    dataStartIndex,
    xAxisTicks,
    yAxisTicks,
    bandSize
  } = _ref9;
  var hasStack = stackedData && stackedData.length;
  var baseValue = getBaseValue(layout, chartBaseValue, itemBaseValue, xAxis, yAxis);
  var isHorizontalLayout = layout === 'horizontal';
  var isRange = false;
  var points = displayedData.map((entry, index) => {
    var value;
    if (hasStack) {
      value = stackedData[dataStartIndex + index];
    } else {
      value = getValueByDataKey(entry, dataKey);
      if (!Array.isArray(value)) {
        value = [baseValue, value];
      } else {
        isRange = true;
      }
    }
    var isBreakPoint = value[1] == null || hasStack && !connectNulls && getValueByDataKey(entry, dataKey) == null;
    if (isHorizontalLayout) {
      return {
        // @ts-expect-error getCateCoordinateOfLine expects chart data to be an object, we allow unknown
        x: getCateCoordinateOfLine({
          axis: xAxis,
          ticks: xAxisTicks,
          bandSize,
          entry,
          index
        }),
        y: isBreakPoint ? null : yAxis.scale(value[1]),
        value,
        payload: entry
      };
    }
    return {
      x: isBreakPoint ? null : xAxis.scale(value[1]),
      // @ts-expect-error getCateCoordinateOfLine expects chart data to be an object, we allow unknown
      y: getCateCoordinateOfLine({
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
  var baseLine;
  if (hasStack || isRange) {
    baseLine = points.map(entry => {
      var x = Array.isArray(entry.value) ? entry.value[0] : null;
      if (isHorizontalLayout) {
        return {
          x: entry.x,
          y: x != null && entry.y != null ? yAxis.scale(x) : null
        };
      }
      return {
        x: x != null ? xAxis.scale(x) : null,
        y: entry.y
      };
    });
  } else {
    baseLine = isHorizontalLayout ? yAxis.scale(baseValue) : xAxis.scale(baseValue);
  }
  return {
    points,
    baseLine,
    isRange
  };
}
export class Area extends PureComponent {
  render() {
    // Report all props to Redux store first, before calling any hooks, to avoid circular dependencies.
    return /*#__PURE__*/React.createElement(CartesianGraphicalItemContext, {
      type: "area",
      data: this.props.data,
      dataKey: this.props.dataKey,
      xAxisId: this.props.xAxisId,
      yAxisId: this.props.yAxisId,
      zAxisId: 0,
      stackId: this.props.stackId,
      hide: this.props.hide,
      barSize: undefined
    }, /*#__PURE__*/React.createElement(SetLegendPayload, {
      legendPayload: computeLegendPayloadFromAreaData(this.props)
    }), /*#__PURE__*/React.createElement(SetTooltipEntrySettings, {
      fn: getTooltipEntrySettings,
      args: this.props
    }), /*#__PURE__*/React.createElement(AreaImpl, this.props));
  }
}
_defineProperty(Area, "displayName", 'Area');
_defineProperty(Area, "defaultProps", defaultAreaProps);