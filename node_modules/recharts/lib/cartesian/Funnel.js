"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FunnelWithState = exports.Funnel = void 0;
exports.computeFunnelTrapezoids = computeFunnelTrapezoids;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _omit = _interopRequireDefault(require("es-toolkit/compat/omit"));
var _clsx = require("clsx");
var _selectors = require("../state/selectors/selectors");
var _hooks = require("../state/hooks");
var _Layer = require("../container/Layer");
var _LabelList = require("../component/LabelList");
var _Global = require("../util/Global");
var _DataUtils = require("../util/DataUtils");
var _ChartUtils = require("../util/ChartUtils");
var _types = require("../util/types");
var _FunnelUtils = require("../util/FunnelUtils");
var _tooltipContext = require("../context/tooltipContext");
var _SetTooltipEntrySettings = require("../state/SetTooltipEntrySettings");
var _funnelSelectors = require("../state/selectors/funnelSelectors");
var _ReactUtils = require("../util/ReactUtils");
var _Cell = require("../component/Cell");
var _resolveDefaultProps2 = require("../util/resolveDefaultProps");
var _Animate = require("../animation/Animate");
var _hooks2 = require("../hooks");
var _excluded = ["onMouseEnter", "onClick", "onMouseLeave", "shape", "activeShape"],
  _excluded2 = ["stroke", "fill", "legendType", "hide", "isAnimationActive", "animationBegin", "animationDuration", "animationEasing", "nameKey", "lastShapeType"];
/* eslint-disable max-classes-per-file */
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
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
  var activeItemIndex = (0, _hooks.useAppSelector)(state => (0, _selectors.selectActiveIndex)(state, 'item', state.tooltip.settings.trigger, undefined));
  var {
      onMouseEnter: onMouseEnterFromProps,
      onClick: onItemClickFromProps,
      onMouseLeave: onMouseLeaveFromProps,
      shape,
      activeShape
    } = allOtherFunnelProps,
    restOfAllOtherProps = _objectWithoutProperties(allOtherFunnelProps, _excluded);
  var onMouseEnterFromContext = (0, _tooltipContext.useMouseEnterItemDispatch)(onMouseEnterFromProps, allOtherFunnelProps.dataKey);
  var onMouseLeaveFromContext = (0, _tooltipContext.useMouseLeaveItemDispatch)(onMouseLeaveFromProps);
  var onClickFromContext = (0, _tooltipContext.useMouseClickItemDispatch)(onItemClickFromProps, allOtherFunnelProps.dataKey);
  return /*#__PURE__*/React.createElement(React.Fragment, null, trapezoids.map((entry, i) => {
    var isActiveIndex = activeShape && activeItemIndex === String(i);
    var trapezoidOptions = isActiveIndex ? activeShape : shape;
    var trapezoidProps = _objectSpread(_objectSpread({}, entry), {}, {
      option: trapezoidOptions,
      isActive: isActiveIndex,
      stroke: entry.stroke
    });
    return /*#__PURE__*/React.createElement(_Layer.Layer, _extends({
      className: "recharts-funnel-trapezoid"
    }, (0, _types.adaptEventsOfChild)(restOfAllOtherProps, entry, i), {
      // @ts-expect-error the types need a bit of attention
      onMouseEnter: onMouseEnterFromContext(entry, i)
      // @ts-expect-error the types need a bit of attention
      ,
      onMouseLeave: onMouseLeaveFromContext(entry, i)
      // @ts-expect-error the types need a bit of attention
      ,
      onClick: onClickFromContext(entry, i),
      key: "trapezoid-".concat(entry === null || entry === void 0 ? void 0 : entry.x, "-").concat(entry === null || entry === void 0 ? void 0 : entry.y, "-").concat(entry === null || entry === void 0 ? void 0 : entry.name, "-").concat(entry === null || entry === void 0 ? void 0 : entry.value)
    }), /*#__PURE__*/React.createElement(_FunnelUtils.FunnelTrapezoid, trapezoidProps));
  }), showLabels && _LabelList.LabelList.renderCallByParent(allOtherFunnelProps, trapezoids));
}
var latestId = 0;

/**
 * This hook will return a unique animation id for the given reference.
 * The ID increments every time the reference changes.
 * @param reference The reference to track
 * @returns The unique animation ID
 */
function useAnimationId(reference) {
  var idRef = (0, _react.useRef)(latestId);
  var ref = (0, _react.useRef)(reference);
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
  var [isAnimating, setIsAnimating] = (0, _react.useState)(true);
  var animationId = useAnimationId(trapezoids);
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
        var _interpolatorX = (0, _DataUtils.interpolateNumber)(prev.x, entry.x);
        var _interpolatorY = (0, _DataUtils.interpolateNumber)(prev.y, entry.y);
        var _interpolatorUpperWidth = (0, _DataUtils.interpolateNumber)(prev.upperWidth, entry.upperWidth);
        var _interpolatorLowerWidth = (0, _DataUtils.interpolateNumber)(prev.lowerWidth, entry.lowerWidth);
        var _interpolatorHeight = (0, _DataUtils.interpolateNumber)(prev.height, entry.height);
        return _objectSpread(_objectSpread({}, entry), {}, {
          x: _interpolatorX(t),
          y: _interpolatorY(t),
          upperWidth: _interpolatorUpperWidth(t),
          lowerWidth: _interpolatorLowerWidth(t),
          height: _interpolatorHeight(t)
        });
      }
      var interpolatorX = (0, _DataUtils.interpolateNumber)(entry.x + entry.upperWidth / 2, entry.x);
      var interpolatorY = (0, _DataUtils.interpolateNumber)(entry.y + entry.height / 2, entry.y);
      var interpolatorUpperWidth = (0, _DataUtils.interpolateNumber)(0, entry.upperWidth);
      var interpolatorLowerWidth = (0, _DataUtils.interpolateNumber)(0, entry.lowerWidth);
      var interpolatorHeight = (0, _DataUtils.interpolateNumber)(0, entry.height);
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
    return /*#__PURE__*/React.createElement(_Layer.Layer, null, /*#__PURE__*/React.createElement(FunnelTrapezoids, {
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
  var previousTrapezoidsRef = (0, _react.useRef)(null);
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
  if ((0, _DataUtils.isNumber)(customWidth)) {
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
class FunnelWithState extends _react.PureComponent {
  render() {
    var {
      className
    } = this.props;
    var layerClass = (0, _clsx.clsx)('recharts-trapezoids', className);
    return /*#__PURE__*/React.createElement(_Layer.Layer, {
      className: layerClass
    }, /*#__PURE__*/React.createElement(RenderTrapezoids, this.props));
  }
}
exports.FunnelWithState = FunnelWithState;
var defaultFunnelProps = {
  stroke: '#fff',
  fill: '#808080',
  legendType: 'rect',
  hide: false,
  isAnimationActive: !_Global.Global.isSsr,
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
  } = (0, _hooks2.usePlotArea)();
  var _resolveDefaultProps = (0, _resolveDefaultProps2.resolveDefaultProps)(props, defaultFunnelProps),
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
  var presentationProps = (0, _ReactUtils.filterProps)(props, false);
  var cells = (0, _ReactUtils.findAllByType)(props.children, _Cell.Cell);
  var funnelSettings = (0, _react.useMemo)(() => ({
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
  } = (0, _hooks.useAppSelector)(state => (0, _funnelSelectors.selectFunnelTrapezoids)(state, funnelSettings));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_SetTooltipEntrySettings.SetTooltipEntrySettings, {
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
function computeFunnelTrapezoids(_ref4) {
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
  var maxValue = Math.max.apply(null, displayedData.map(entry => (0, _ChartUtils.getValueByDataKey)(entry, dataKey, 0)));
  var len = displayedData.length;
  var rowHeight = realHeight / len;
  var parentViewBox = {
    x: offset.left,
    y: offset.top,
    width: offset.width,
    height: offset.height
  };
  var trapezoids = displayedData.map((entry, i) => {
    var rawVal = (0, _ChartUtils.getValueByDataKey)(entry, dataKey, 0);
    var name = (0, _ChartUtils.getValueByDataKey)(entry, nameKey, i);
    var val = rawVal;
    var nextVal;
    if (i !== len - 1) {
      nextVal = (0, _ChartUtils.getValueByDataKey)(displayedData[i + 1], dataKey, 0);
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
    }, (0, _omit.default)(entry, ['width'])), {}, {
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
class Funnel extends _react.PureComponent {
  render() {
    return /*#__PURE__*/React.createElement(FunnelImpl, this.props);
  }
}
exports.Funnel = Funnel;
_defineProperty(Funnel, "displayName", 'Funnel');
_defineProperty(Funnel, "defaultProps", defaultFunnelProps);