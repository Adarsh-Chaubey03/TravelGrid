var _excluded = ["onMouseEnter", "onClick", "onMouseLeave"],
  _excluded2 = ["animationBegin", "animationDuration", "animationEasing", "hide", "isAnimationActive", "legendType", "lineJointType", "lineType", "shape", "xAxisId", "yAxisId", "zAxisId"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { Component, useCallback, useMemo, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { Layer } from '../container/Layer';
import { LabelList } from '../component/LabelList';
import { filterProps, findAllByType } from '../util/ReactUtils';
import { Global } from '../util/Global';
import { ZAxis } from './ZAxis';
import { Curve } from '../shape/Curve';
import { Cell } from '../component/Cell';
import { getLinearRegression, interpolateNumber, isNullish, uniqueId } from '../util/DataUtils';
import { getCateCoordinateOfLine, getTooltipNameProp, getValueByDataKey } from '../util/ChartUtils';
import { adaptEventsOfChild } from '../util/types';
import { ScatterSymbol } from '../util/ScatterUtils';
import { useMouseClickItemDispatch, useMouseEnterItemDispatch, useMouseLeaveItemDispatch } from '../context/tooltipContext';
import { SetTooltipEntrySettings } from '../state/SetTooltipEntrySettings';
import { CartesianGraphicalItemContext, SetErrorBarContext } from '../context/CartesianGraphicalItemContext';
import { GraphicalItemClipPath, useNeedsClip } from './GraphicalItemClipPath';
import { selectScatterPoints } from '../state/selectors/scatterSelectors';
import { useAppSelector } from '../state/hooks';
import { useIsPanorama } from '../context/PanoramaContext';
import { selectActiveTooltipIndex } from '../state/selectors/tooltipSelectors';
import { SetLegendPayload } from '../state/SetLegendPayload';
import { DATA_ITEM_DATAKEY_ATTRIBUTE_NAME, DATA_ITEM_INDEX_ATTRIBUTE_NAME } from '../util/Constants';
import { useAnimationId } from '../util/useAnimationId';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { Animate } from '../animation/Animate';

/**
 * Internal props, combination of external props + defaultProps + private Recharts state
 */

/**
 * External props, intended for end users to fill in
 */

/**
 * Because of naming conflict, we are forced to ignore certain (valid) SVG attributes.
 */

var computeLegendPayloadFromScatterProps = props => {
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
function ScatterLine(_ref) {
  var {
    points,
    props
  } = _ref;
  var {
    line,
    lineType,
    lineJointType
  } = props;
  if (!line) {
    return null;
  }
  var scatterProps = filterProps(props, false);
  var customLineProps = filterProps(line, false);
  var linePoints, lineItem;
  if (lineType === 'joint') {
    linePoints = points.map(entry => ({
      x: entry.cx,
      y: entry.cy
    }));
  } else if (lineType === 'fitting') {
    var {
      xmin,
      xmax,
      a,
      b
    } = getLinearRegression(points);
    var linearExp = x => a * x + b;
    linePoints = [{
      x: xmin,
      y: linearExp(xmin)
    }, {
      x: xmax,
      y: linearExp(xmax)
    }];
  }
  var lineProps = _objectSpread(_objectSpread(_objectSpread({}, scatterProps), {}, {
    fill: 'none',
    stroke: scatterProps && scatterProps.fill
  }, customLineProps), {}, {
    points: linePoints
  });
  if (/*#__PURE__*/React.isValidElement(line)) {
    lineItem = /*#__PURE__*/React.cloneElement(line, lineProps);
  } else if (typeof line === 'function') {
    lineItem = line(lineProps);
  } else {
    lineItem = /*#__PURE__*/React.createElement(Curve, _extends({}, lineProps, {
      type: lineJointType
    }));
  }
  return /*#__PURE__*/React.createElement(Layer, {
    className: "recharts-scatter-line",
    key: "recharts-scatter-line"
  }, lineItem);
}
function ScatterSymbols(props) {
  var {
    points,
    showLabels,
    allOtherScatterProps
  } = props;
  var {
    shape,
    activeShape,
    dataKey
  } = allOtherScatterProps;
  var baseProps = filterProps(allOtherScatterProps, false);
  var activeIndex = useAppSelector(selectActiveTooltipIndex);
  var {
      onMouseEnter: onMouseEnterFromProps,
      onClick: onItemClickFromProps,
      onMouseLeave: onMouseLeaveFromProps
    } = allOtherScatterProps,
    restOfAllOtherProps = _objectWithoutProperties(allOtherScatterProps, _excluded);
  var onMouseEnterFromContext = useMouseEnterItemDispatch(onMouseEnterFromProps, allOtherScatterProps.dataKey);
  var onMouseLeaveFromContext = useMouseLeaveItemDispatch(onMouseLeaveFromProps);
  var onClickFromContext = useMouseClickItemDispatch(onItemClickFromProps, allOtherScatterProps.dataKey);
  if (points == null) {
    return null;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ScatterLine, {
    points: points,
    props: allOtherScatterProps
  }), points.map((entry, i) => {
    var isActive = activeShape && activeIndex === String(i);
    var option = isActive ? activeShape : shape;
    var symbolProps = _objectSpread(_objectSpread(_objectSpread({
      key: "symbol-".concat(i)
    }, baseProps), entry), {}, {
      [DATA_ITEM_INDEX_ATTRIBUTE_NAME]: i,
      [DATA_ITEM_DATAKEY_ATTRIBUTE_NAME]: String(dataKey)
    });
    return /*#__PURE__*/React.createElement(Layer, _extends({
      className: "recharts-scatter-symbol"
    }, adaptEventsOfChild(restOfAllOtherProps, entry, i), {
      // @ts-expect-error the types need a bit of attention
      onMouseEnter: onMouseEnterFromContext(entry, i)
      // @ts-expect-error the types need a bit of attention
      ,
      onMouseLeave: onMouseLeaveFromContext(entry, i)
      // @ts-expect-error the types need a bit of attention
      ,
      onClick: onClickFromContext(entry, i)
      // eslint-disable-next-line react/no-array-index-key
      ,
      key: "symbol-".concat(entry === null || entry === void 0 ? void 0 : entry.cx, "-").concat(entry === null || entry === void 0 ? void 0 : entry.cy, "-").concat(entry === null || entry === void 0 ? void 0 : entry.size, "-").concat(i)
    }), /*#__PURE__*/React.createElement(ScatterSymbol, _extends({
      option: option,
      isActive: isActive
    }, symbolProps)));
  }), showLabels && LabelList.renderCallByParent(allOtherScatterProps, points));
}
function SymbolsWithAnimation(_ref2) {
  var {
    previousPointsRef,
    props
  } = _ref2;
  var {
    points,
    isAnimationActive,
    animationBegin,
    animationDuration,
    animationEasing
  } = props;
  var prevPoints = previousPointsRef.current;
  var animationId = useAnimationId(props, 'recharts-scatter-');
  var [isAnimating, setIsAnimating] = useState(false);
  var handleAnimationEnd = useCallback(() => {
    // Scatter doesn't have onAnimationEnd prop, and if we want to add it we do it here
    // if (typeof onAnimationEnd === 'function') {
    //   onAnimationEnd();
    // }
    setIsAnimating(false);
  }, []);
  var handleAnimationStart = useCallback(() => {
    // Scatter doesn't have onAnimationStart prop, and if we want to add it we do it here
    // if (typeof onAnimationStart === 'function') {
    //   onAnimationStart();
    // }
    setIsAnimating(true);
  }, []);
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
    var stepData = t === 1 ? points : points.map((entry, index) => {
      var prev = prevPoints && prevPoints[index];
      if (prev) {
        var interpolatorCx = interpolateNumber(prev.cx, entry.cx);
        var interpolatorCy = interpolateNumber(prev.cy, entry.cy);
        var interpolatorSize = interpolateNumber(prev.size, entry.size);
        return _objectSpread(_objectSpread({}, entry), {}, {
          cx: interpolatorCx(t),
          cy: interpolatorCy(t),
          size: interpolatorSize(t)
        });
      }
      var interpolator = interpolateNumber(0, entry.size);
      return _objectSpread(_objectSpread({}, entry), {}, {
        size: interpolator(t)
      });
    });
    if (t > 0) {
      // eslint-disable-next-line no-param-reassign
      previousPointsRef.current = stepData;
    }
    return /*#__PURE__*/React.createElement(Layer, null, /*#__PURE__*/React.createElement(ScatterSymbols, {
      points: stepData,
      allOtherScatterProps: props,
      showLabels: !isAnimating
    }));
  });
}
function RenderSymbols(props) {
  var {
    points,
    isAnimationActive
  } = props;
  var previousPointsRef = useRef(null);
  var prevPoints = previousPointsRef.current;
  if (isAnimationActive && points && points.length && (!prevPoints || prevPoints !== points)) {
    return /*#__PURE__*/React.createElement(SymbolsWithAnimation, {
      props: props,
      previousPointsRef: previousPointsRef
    });
  }
  return /*#__PURE__*/React.createElement(ScatterSymbols, {
    points: points,
    allOtherScatterProps: props,
    showLabels: true
  });
}
function getTooltipEntrySettings(props) {
  var {
    dataKey,
    points,
    stroke,
    strokeWidth,
    fill,
    name,
    hide,
    tooltipType
  } = props;
  return {
    dataDefinedOnItem: points === null || points === void 0 ? void 0 : points.map(p => p.tooltipPayload),
    positions: points === null || points === void 0 ? void 0 : points.map(p => p.tooltipPosition),
    settings: {
      stroke,
      strokeWidth,
      fill,
      nameKey: undefined,
      dataKey,
      name: getTooltipNameProp(name, dataKey),
      hide,
      type: tooltipType,
      color: fill,
      unit: '' // why doesn't Scatter support unit?
    }
  };
}
export function computeScatterPoints(_ref4) {
  var {
    displayedData,
    xAxis,
    yAxis,
    zAxis,
    scatterSettings,
    xAxisTicks,
    yAxisTicks,
    cells
  } = _ref4;
  var xAxisDataKey = isNullish(xAxis.dataKey) ? scatterSettings.dataKey : xAxis.dataKey;
  var yAxisDataKey = isNullish(yAxis.dataKey) ? scatterSettings.dataKey : yAxis.dataKey;
  var zAxisDataKey = zAxis && zAxis.dataKey;
  var defaultRangeZ = zAxis ? zAxis.range : ZAxis.defaultProps.range;
  var defaultZ = defaultRangeZ && defaultRangeZ[0];
  var xBandSize = xAxis.scale.bandwidth ? xAxis.scale.bandwidth() : 0;
  var yBandSize = yAxis.scale.bandwidth ? yAxis.scale.bandwidth() : 0;
  return displayedData.map((entry, index) => {
    var x = getValueByDataKey(entry, xAxisDataKey);
    var y = getValueByDataKey(entry, yAxisDataKey);
    var z = !isNullish(zAxisDataKey) && getValueByDataKey(entry, zAxisDataKey) || '-';
    var tooltipPayload = [{
      // @ts-expect-error name prop should not have dataKey in it
      name: isNullish(xAxis.dataKey) ? scatterSettings.name : xAxis.name || xAxis.dataKey,
      unit: xAxis.unit || '',
      // @ts-expect-error getValueByDataKey does not validate the output type
      value: x,
      payload: entry,
      dataKey: xAxisDataKey,
      type: scatterSettings.tooltipType
    }, {
      // @ts-expect-error name prop should not have dataKey in it
      name: isNullish(yAxis.dataKey) ? scatterSettings.name : yAxis.name || yAxis.dataKey,
      unit: yAxis.unit || '',
      // @ts-expect-error getValueByDataKey does not validate the output type
      value: y,
      payload: entry,
      dataKey: yAxisDataKey,
      type: scatterSettings.tooltipType
    }];
    if (z !== '-') {
      tooltipPayload.push({
        // @ts-expect-error name prop should not have dataKey in it
        name: zAxis.name || zAxis.dataKey,
        unit: zAxis.unit || '',
        // @ts-expect-error getValueByDataKey does not validate the output type
        value: z,
        payload: entry,
        dataKey: zAxisDataKey,
        type: scatterSettings.tooltipType
      });
    }
    var cx = getCateCoordinateOfLine({
      axis: xAxis,
      ticks: xAxisTicks,
      bandSize: xBandSize,
      entry,
      index,
      dataKey: xAxisDataKey
    });
    var cy = getCateCoordinateOfLine({
      axis: yAxis,
      ticks: yAxisTicks,
      bandSize: yBandSize,
      entry,
      index,
      dataKey: yAxisDataKey
    });
    var size = z !== '-' ? zAxis.scale(z) : defaultZ;
    var radius = Math.sqrt(Math.max(size, 0) / Math.PI);
    return _objectSpread(_objectSpread({}, entry), {}, {
      cx,
      cy,
      x: cx - radius,
      y: cy - radius,
      width: 2 * radius,
      height: 2 * radius,
      size,
      node: {
        x,
        y,
        z
      },
      tooltipPayload,
      tooltipPosition: {
        x: cx,
        y: cy
      },
      payload: entry
    }, cells && cells[index] && cells[index].props);
  });
}
var errorBarDataPointFormatter = (dataPoint, dataKey, direction) => {
  return {
    x: dataPoint.cx,
    y: dataPoint.cy,
    value: direction === 'x' ? +dataPoint.node.x : +dataPoint.node.y,
    // @ts-expect-error getValueByDataKey does not validate the output type
    errorVal: getValueByDataKey(dataPoint, dataKey)
  };
};
function ScatterWithId(props) {
  var idRef = useRef(uniqueId('recharts-scatter-'));
  var {
    hide,
    points,
    className,
    needClip,
    xAxisId,
    yAxisId,
    id,
    children
  } = props;
  if (hide) {
    return null;
  }
  var layerClass = clsx('recharts-scatter', className);
  var clipPathId = isNullish(id) ? idRef.current : id;
  return /*#__PURE__*/React.createElement(Layer, {
    className: layerClass,
    clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : null
  }, needClip && /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement(GraphicalItemClipPath, {
    clipPathId: clipPathId,
    xAxisId: xAxisId,
    yAxisId: yAxisId
  })), /*#__PURE__*/React.createElement(SetErrorBarContext, {
    xAxisId: xAxisId,
    yAxisId: yAxisId,
    data: points,
    dataPointFormatter: errorBarDataPointFormatter,
    errorBarOffset: 0
  }, children), /*#__PURE__*/React.createElement(Layer, {
    key: "recharts-scatter-symbols"
  }, /*#__PURE__*/React.createElement(RenderSymbols, props)));
}
var defaultScatterProps = {
  xAxisId: 0,
  yAxisId: 0,
  zAxisId: 0,
  legendType: 'circle',
  lineType: 'joint',
  lineJointType: 'linear',
  data: [],
  shape: 'circle',
  hide: false,
  isAnimationActive: !Global.isSsr,
  animationBegin: 0,
  animationDuration: 400,
  animationEasing: 'linear'
};
function ScatterImpl(props) {
  var _resolveDefaultProps = resolveDefaultProps(props, defaultScatterProps),
    {
      animationBegin,
      animationDuration,
      animationEasing,
      hide,
      isAnimationActive,
      legendType,
      lineJointType,
      lineType,
      shape,
      xAxisId,
      yAxisId,
      zAxisId
    } = _resolveDefaultProps,
    everythingElse = _objectWithoutProperties(_resolveDefaultProps, _excluded2);
  var {
    needClip
  } = useNeedsClip(xAxisId, yAxisId);
  var cells = useMemo(() => findAllByType(props.children, Cell), [props.children]);
  var scatterSettings = useMemo(() => ({
    name: props.name,
    tooltipType: props.tooltipType,
    data: props.data,
    dataKey: props.dataKey
  }), [props.data, props.dataKey, props.name, props.tooltipType]);
  var isPanorama = useIsPanorama();
  var points = useAppSelector(state => {
    return selectScatterPoints(state, xAxisId, yAxisId, zAxisId, scatterSettings, cells, isPanorama);
  });
  if (needClip == null) {
    return null;
  }
  /*
   * Do not check if points is null here!
   * It is important that the animation component receives `null` as points
   * so that it can reset its internal state and start animating to new positions.
   */
  // if (points == null)
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SetTooltipEntrySettings, {
    fn: getTooltipEntrySettings,
    args: _objectSpread(_objectSpread({}, props), {}, {
      points
    })
  }), /*#__PURE__*/React.createElement(ScatterWithId, _extends({}, everythingElse, {
    xAxisId: xAxisId,
    yAxisId: yAxisId,
    zAxisId: zAxisId,
    lineType: lineType,
    lineJointType: lineJointType,
    legendType: legendType,
    shape: shape,
    hide: hide,
    isAnimationActive: isAnimationActive,
    animationBegin: animationBegin,
    animationDuration: animationDuration,
    animationEasing: animationEasing,
    points: points,
    needClip: needClip
  })));
}

// eslint-disable-next-line react/prefer-stateless-function
export class Scatter extends Component {
  render() {
    // Report all props to Redux store first, before calling any hooks, to avoid circular dependencies.
    return /*#__PURE__*/React.createElement(CartesianGraphicalItemContext, {
      type: "scatter",
      data: this.props.data,
      xAxisId: this.props.xAxisId,
      yAxisId: this.props.yAxisId,
      zAxisId: this.props.zAxisId,
      dataKey: this.props.dataKey
      // scatter doesn't stack
      ,
      stackId: undefined,
      hide: this.props.hide,
      barSize: undefined
    }, /*#__PURE__*/React.createElement(SetLegendPayload, {
      legendPayload: computeLegendPayloadFromScatterProps(this.props)
    }), /*#__PURE__*/React.createElement(ScatterImpl, this.props));
  }
}
_defineProperty(Scatter, "displayName", 'Scatter');
_defineProperty(Scatter, "defaultProps", defaultScatterProps);