var _excluded = ["onMouseEnter", "onClick", "onMouseLeave", "shape", "activeShape"],
  _excluded2 = ["stroke", "fill", "legendType", "hide", "isAnimationActive", "animationBegin", "animationDuration", "animationEasing", "nameKey", "lastShapeType"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/* eslint-disable max-classes-per-file */
import * as React from 'react';
import { PureComponent, useCallback, useMemo, useRef, useState } from 'react';
import omit from 'es-toolkit/compat/omit';
import { clsx } from 'clsx';
import { selectActiveIndex } from '../state/selectors/selectors';
import { useAppSelector } from '../state/hooks';
import { Layer } from '../container/Layer';
import { LabelList } from '../component/LabelList';
import { Global } from '../util/Global';
import { interpolateNumber, isNumber } from '../util/DataUtils';
import { getValueByDataKey } from '../util/ChartUtils';
import { adaptEventsOfChild } from '../util/types';
import { FunnelTrapezoid } from '../util/FunnelUtils';
import { useMouseClickItemDispatch, useMouseEnterItemDispatch, useMouseLeaveItemDispatch } from '../context/tooltipContext';
import { SetTooltipEntrySettings } from '../state/SetTooltipEntrySettings';
import { selectFunnelTrapezoids } from '../state/selectors/funnelSelectors';
import { filterProps, findAllByType } from '../util/ReactUtils';
import { Cell } from '../component/Cell';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { Animate } from '../animation/Animate';
import { usePlotArea } from '../hooks';

/**
 * Internal props, combination of external props + defaultProps + private Recharts state
 */

/**
 * External props, intended for end users to fill in
 */

function getTooltipEntrySettings(props) {
  var {
    dataKey,
    nameKey,
    stroke,
    strokeWidth,
    fill,
    name,
    hide,
    tooltipType,
    data
  } = props;
  return {
    dataDefinedOnItem: data,
    positions: props.trapezoids.map(_ref => {
      var {
        tooltipPosition
      } = _ref;
      return tooltipPosition;
    }),
    settings: {
      stroke,
      strokeWidth,
      fill,
      dataKey,
      name,
      nameKey,
      hide,
      type: tooltipType,
      color: fill,
      unit: '' // Funnel does not have unit, why?
    }
  };
}
function FunnelTrapezoids(props) {
  var {
    trapezoids,
    allOtherFunnelProps,
    showLabels
  } = props;
  var activeItemIndex = useAppSelector(state => selectActiveIndex(state, 'item', state.tooltip.settings.trigger, undefined));
  var {
      onMouseEnter: onMouseEnterFromProps,
      onClick: onItemClickFromProps,
      onMouseLeave: onMouseLeaveFromProps,
      shape,
      activeShape
    } = allOtherFunnelProps,
    restOfAllOtherProps = _objectWithoutProperties(allOtherFunnelProps, _excluded);
  var onMouseEnterFromContext = useMouseEnterItemDispatch(onMouseEnterFromProps, allOtherFunnelProps.dataKey);
  var onMouseLeaveFromContext = useMouseLeaveItemDispatch(onMouseLeaveFromProps);
  var onClickFromContext = useMouseClickItemDispatch(onItemClickFromProps, allOtherFunnelProps.dataKey);
  return /*#__PURE__*/React.createElement(React.Fragment, null, trapezoids.map((entry, i) => {
    var isActiveIndex = activeShape && activeItemIndex === String(i);
    var trapezoidOptions = isActiveIndex ? activeShape : shape;
    var trapezoidProps = _objectSpread(_objectSpread({}, entry), {}, {
      option: trapezoidOptions,
      isActive: isActiveIndex,
      stroke: entry.stroke
    });
    return /*#__PURE__*/React.createElement(Layer, _extends({
      className: "recharts-funnel-trapezoid"
    }, adaptEventsOfChild(restOfAllOtherProps, entry, i), {
      // @ts-expect-error the types need a bit of attention
      onMouseEnter: onMouseEnterFromContext(entry, i)
      // @ts-expect-error the types need a bit of attention
      ,
      onMouseLeave: onMouseLeaveFromContext(entry, i)
      // @ts-expect-error the types need a bit of attention
      ,
      onClick: onClickFromContext(entry, i),
      key: "trapezoid-".concat(entry === null || entry === void 0 ? void 0 : entry.x, "-").concat(entry === null || entry === void 0 ? void 0 : entry.y, "-").concat(entry === null || entry === void 0 ? void 0 : entry.name, "-").concat(entry === null || entry === void 0 ? void 0 : entry.value)
    }), /*#__PURE__*/React.createElement(FunnelTrapezoid, trapezoidProps));
  }), showLabels && LabelList.renderCallByParent(allOtherFunnelProps, trapezoids));
}
var latestId = 0;

/**
 * This hook will return a unique animation id for the given reference.
 * The ID increments every time the reference changes.
 * @param reference The reference to track
 * @returns The unique animation ID
 */
function useAnimationId(reference) {
  var idRef = useRef(latestId);
  var ref = useRef(reference);
  if (ref.current !== reference) {
    idRef.current += 1;
    latestId = idRef.current;
    ref.current = reference;
  }
  return idRef.current;
}
function TrapezoidsWithAnimation(_ref2) {
  var {
    previousTrapezoidsRef,
    props
  } = _ref2;
  var {
    trapezoids,
    isAnimationActive,
    animationBegin,
    animationDuration,
    animationEasing,
    onAnimationEnd,
    onAnimationStart
  } = props;
  var prevTrapezoids = previousTrapezoidsRef.current;
  var [isAnimating, setIsAnimating] = useState(true);
  var animationId = useAnimationId(trapezoids);
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
    key: animationId,
    onAnimationStart: handleAnimationStart,
    onAnimationEnd: handleAnimationEnd
  }, _ref3 => {
    var {
      t
    } = _ref3;
    var stepData = t === 1 ? trapezoids : trapezoids.map((entry, index) => {
      var prev = prevTrapezoids && prevTrapezoids[index];
      if (prev) {
        var _interpolatorX = interpolateNumber(prev.x, entry.x);
        var _interpolatorY = interpolateNumber(prev.y, entry.y);
        var _interpolatorUpperWidth = interpolateNumber(prev.upperWidth, entry.upperWidth);
        var _interpolatorLowerWidth = interpolateNumber(prev.lowerWidth, entry.lowerWidth);
        var _interpolatorHeight = interpolateNumber(prev.height, entry.height);
        return _objectSpread(_objectSpread({}, entry), {}, {
          x: _interpolatorX(t),
          y: _interpolatorY(t),
          upperWidth: _interpolatorUpperWidth(t),
          lowerWidth: _interpolatorLowerWidth(t),
          height: _interpolatorHeight(t)
        });
      }
      var interpolatorX = interpolateNumber(entry.x + entry.upperWidth / 2, entry.x);
      var interpolatorY = interpolateNumber(entry.y + entry.height / 2, entry.y);
      var interpolatorUpperWidth = interpolateNumber(0, entry.upperWidth);
      var interpolatorLowerWidth = interpolateNumber(0, entry.lowerWidth);
      var interpolatorHeight = interpolateNumber(0, entry.height);
      return _objectSpread(_objectSpread({}, entry), {}, {
        x: interpolatorX(t),
        y: interpolatorY(t),
        upperWidth: interpolatorUpperWidth(t),
        lowerWidth: interpolatorLowerWidth(t),
        height: interpolatorHeight(t)
      });
    });
    if (t > 0) {
      // eslint-disable-next-line no-param-reassign
      previousTrapezoidsRef.current = stepData;
    }
    return /*#__PURE__*/React.createElement(Layer, null, /*#__PURE__*/React.createElement(FunnelTrapezoids, {
      trapezoids: stepData,
      allOtherFunnelProps: props,
      showLabels: !isAnimating
    }));
  });
}
function RenderTrapezoids(props) {
  var {
    trapezoids,
    isAnimationActive
  } = props;
  var previousTrapezoidsRef = useRef(null);
  var prevTrapezoids = previousTrapezoidsRef.current;
  if (isAnimationActive && trapezoids && trapezoids.length && (!prevTrapezoids || prevTrapezoids !== trapezoids)) {
    return /*#__PURE__*/React.createElement(TrapezoidsWithAnimation, {
      props: props,
      previousTrapezoidsRef: previousTrapezoidsRef
    });
  }
  return /*#__PURE__*/React.createElement(FunnelTrapezoids, {
    trapezoids: trapezoids,
    allOtherFunnelProps: props,
    showLabels: true
  });
}
var getRealWidthHeight = (customWidth, offset) => {
  var {
    width,
    height,
    left,
    right,
    top,
    bottom
  } = offset;
  var realHeight = height;
  var realWidth = width;
  if (isNumber(customWidth)) {
    realWidth = customWidth;
  } else if (typeof customWidth === 'string') {
    realWidth = realWidth * parseFloat(customWidth) / 100;
  }
  return {
    realWidth: realWidth - left - right - 50,
    realHeight: realHeight - bottom - top,
    offsetX: (width - realWidth) / 2,
    offsetY: (height - realHeight) / 2
  };
};
export class FunnelWithState extends PureComponent {
  render() {
    var {
      className
    } = this.props;
    var layerClass = clsx('recharts-trapezoids', className);
    return /*#__PURE__*/React.createElement(Layer, {
      className: layerClass
    }, /*#__PURE__*/React.createElement(RenderTrapezoids, this.props));
  }
}
var defaultFunnelProps = {
  stroke: '#fff',
  fill: '#808080',
  legendType: 'rect',
  hide: false,
  isAnimationActive: !Global.isSsr,
  animationBegin: 400,
  animationDuration: 1500,
  animationEasing: 'ease',
  nameKey: 'name',
  lastShapeType: 'triangle'
};
function FunnelImpl(props) {
  var {
    height,
    width
  } = usePlotArea();
  var _resolveDefaultProps = resolveDefaultProps(props, defaultFunnelProps),
    {
      stroke,
      fill,
      legendType,
      hide,
      isAnimationActive,
      animationBegin,
      animationDuration,
      animationEasing,
      nameKey,
      lastShapeType
    } = _resolveDefaultProps,
    everythingElse = _objectWithoutProperties(_resolveDefaultProps, _excluded2);
  var presentationProps = filterProps(props, false);
  var cells = findAllByType(props.children, Cell);
  var funnelSettings = useMemo(() => ({
    dataKey: props.dataKey,
    nameKey,
    data: props.data,
    tooltipType: props.tooltipType,
    lastShapeType,
    reversed: props.reversed,
    customWidth: props.width,
    cells,
    presentationProps
  }), [props.dataKey, nameKey, props.data, props.tooltipType, lastShapeType, props.reversed, props.width, cells, presentationProps]);
  var {
    trapezoids
  } = useAppSelector(state => selectFunnelTrapezoids(state, funnelSettings));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SetTooltipEntrySettings, {
    fn: getTooltipEntrySettings,
    args: _objectSpread(_objectSpread({}, props), {}, {
      trapezoids
    })
  }), hide ? null : /*#__PURE__*/React.createElement(FunnelWithState, _extends({}, everythingElse, {
    stroke: stroke,
    fill: fill,
    nameKey: nameKey,
    lastShapeType: lastShapeType,
    animationBegin: animationBegin,
    animationDuration: animationDuration,
    animationEasing: animationEasing,
    isAnimationActive: isAnimationActive,
    hide: hide,
    legendType: legendType,
    height: height,
    width: width,
    trapezoids: trapezoids
  })));
}
export function computeFunnelTrapezoids(_ref4) {
  var {
    dataKey,
    nameKey,
    displayedData,
    tooltipType,
    lastShapeType,
    reversed,
    offset,
    customWidth
  } = _ref4;
  var {
    left,
    top
  } = offset;
  var {
    realHeight,
    realWidth,
    offsetX,
    offsetY
  } = getRealWidthHeight(customWidth, offset);
  var maxValue = Math.max.apply(null, displayedData.map(entry => getValueByDataKey(entry, dataKey, 0)));
  var len = displayedData.length;
  var rowHeight = realHeight / len;
  var parentViewBox = {
    x: offset.left,
    y: offset.top,
    width: offset.width,
    height: offset.height
  };
  var trapezoids = displayedData.map((entry, i) => {
    var rawVal = getValueByDataKey(entry, dataKey, 0);
    var name = getValueByDataKey(entry, nameKey, i);
    var val = rawVal;
    var nextVal;
    if (i !== len - 1) {
      nextVal = getValueByDataKey(displayedData[i + 1], dataKey, 0);
      if (nextVal instanceof Array) {
        [nextVal] = nextVal;
      }
    } else if (rawVal instanceof Array && rawVal.length === 2) {
      [val, nextVal] = rawVal;
    } else if (lastShapeType === 'rectangle') {
      nextVal = val;
    } else {
      nextVal = 0;
    }

    // @ts-expect-error getValueByDataKey does not validate the output type
    var x = (maxValue - val) * realWidth / (2 * maxValue) + top + 25 + offsetX;
    var y = rowHeight * i + left + offsetY;
    // @ts-expect-error getValueByDataKey does not validate the output type
    var upperWidth = val / maxValue * realWidth;
    var lowerWidth = nextVal / maxValue * realWidth;
    var tooltipPayload = [{
      name,
      value: val,
      payload: entry,
      dataKey,
      type: tooltipType
    }];
    var tooltipPosition = {
      x: x + upperWidth / 2,
      y: y + rowHeight / 2
    };
    return _objectSpread(_objectSpread({
      x,
      y,
      width: Math.max(upperWidth, lowerWidth),
      upperWidth,
      lowerWidth,
      height: rowHeight,
      // @ts-expect-error getValueByDataKey does not validate the output type
      name,
      val,
      tooltipPayload,
      tooltipPosition
    }, omit(entry, ['width'])), {}, {
      payload: entry,
      parentViewBox,
      labelViewBox: {
        x: x + (upperWidth - lowerWidth) / 4,
        y,
        width: Math.abs(upperWidth - lowerWidth) / 2 + Math.min(upperWidth, lowerWidth),
        height: rowHeight
      }
    });
  });
  if (reversed) {
    trapezoids = trapezoids.map((entry, index) => {
      var newY = entry.y - index * rowHeight + (len - 1 - index) * rowHeight;
      return _objectSpread(_objectSpread({}, entry), {}, {
        upperWidth: entry.lowerWidth,
        lowerWidth: entry.upperWidth,
        x: entry.x - (entry.lowerWidth - entry.upperWidth) / 2,
        y: entry.y - index * rowHeight + (len - 1 - index) * rowHeight,
        tooltipPosition: _objectSpread(_objectSpread({}, entry.tooltipPosition), {}, {
          y: newY + rowHeight / 2
        }),
        labelViewBox: _objectSpread(_objectSpread({}, entry.labelViewBox), {}, {
          y: newY
        })
      });
    });
  }
  return {
    trapezoids,
    data: displayedData
  };
}
export class Funnel extends PureComponent {
  render() {
    return /*#__PURE__*/React.createElement(FunnelImpl, this.props);
  }
}
_defineProperty(Funnel, "displayName", 'Funnel');
_defineProperty(Funnel, "defaultProps", defaultFunnelProps);