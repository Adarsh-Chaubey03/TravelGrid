"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RadialBar = void 0;
exports.computeRadialBarDataItems = computeRadialBarDataItems;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _clsx = require("clsx");
var _RadialBarUtils = require("../util/RadialBarUtils");
var _Layer = require("../container/Layer");
var _ReactUtils = require("../util/ReactUtils");
var _Global = require("../util/Global");
var _LabelList = require("../component/LabelList");
var _Cell = require("../component/Cell");
var _DataUtils = require("../util/DataUtils");
var _ChartUtils = require("../util/ChartUtils");
var _types = require("../util/types");
var _tooltipContext = require("../context/tooltipContext");
var _SetTooltipEntrySettings = require("../state/SetTooltipEntrySettings");
var _ReportBar = require("../state/ReportBar");
var _PolarGraphicalItemContext = require("../context/PolarGraphicalItemContext");
var _radialBarSelectors = require("../state/selectors/radialBarSelectors");
var _hooks = require("../state/hooks");
var _tooltipSelectors = require("../state/selectors/tooltipSelectors");
var _SetLegendPayload = require("../state/SetLegendPayload");
var _useAnimationId = require("../util/useAnimationId");
var _Animate = require("../animation/Animate");
var _excluded = ["shape", "activeShape", "cornerRadius"],
  _excluded2 = ["onMouseEnter", "onClick", "onMouseLeave"],
  _excluded3 = ["value", "background"]; // eslint-disable-next-line max-classes-per-file
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var STABLE_EMPTY_ARRAY = [];
function RadialBarSectors(_ref) {
  var {
    sectors,
    allOtherRadialBarProps,
    showLabels
  } = _ref;
  var {
      shape,
      activeShape,
      cornerRadius
    } = allOtherRadialBarProps,
    others = _objectWithoutProperties(allOtherRadialBarProps, _excluded);
  var baseProps = (0, _ReactUtils.filterProps)(others, false);
  var activeIndex = (0, _hooks.useAppSelector)(_tooltipSelectors.selectActiveTooltipIndex);
  var {
      onMouseEnter: onMouseEnterFromProps,
      onClick: onItemClickFromProps,
      onMouseLeave: onMouseLeaveFromProps
    } = allOtherRadialBarProps,
    restOfAllOtherProps = _objectWithoutProperties(allOtherRadialBarProps, _excluded2);
  var onMouseEnterFromContext = (0, _tooltipContext.useMouseEnterItemDispatch)(onMouseEnterFromProps, allOtherRadialBarProps.dataKey);
  var onMouseLeaveFromContext = (0, _tooltipContext.useMouseLeaveItemDispatch)(onMouseLeaveFromProps);
  var onClickFromContext = (0, _tooltipContext.useMouseClickItemDispatch)(onItemClickFromProps, allOtherRadialBarProps.dataKey);
  if (sectors == null) {
    return null;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, sectors.map((entry, i) => {
    var isActive = activeShape && activeIndex === String(i);
    // @ts-expect-error the types need a bit of attention
    var onMouseEnter = onMouseEnterFromContext(entry, i);
    // @ts-expect-error the types need a bit of attention
    var onMouseLeave = onMouseLeaveFromContext(entry, i);
    // @ts-expect-error the types need a bit of attention
    var onClick = onClickFromContext(entry, i);
    var radialBarSectorProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, baseProps), {}, {
      cornerRadius: (0, _RadialBarUtils.parseCornerRadius)(cornerRadius)
    }, entry), (0, _types.adaptEventsOfChild)(restOfAllOtherProps, entry, i)), {}, {
      onMouseEnter,
      onMouseLeave,
      onClick,
      key: "sector-".concat(i),
      className: "recharts-radial-bar-sector ".concat(entry.className),
      forceCornerRadius: others.forceCornerRadius,
      cornerIsExternal: others.cornerIsExternal,
      isActive,
      option: isActive ? activeShape : shape
    });
    return /*#__PURE__*/React.createElement(_RadialBarUtils.RadialBarSector, radialBarSectorProps);
  }), showLabels && _LabelList.LabelList.renderCallByParent(allOtherRadialBarProps, sectors));
}
function SectorsWithAnimation(_ref2) {
  var {
    props,
    previousSectorsRef
  } = _ref2;
  var {
    data,
    isAnimationActive,
    animationBegin,
    animationDuration,
    animationEasing,
    onAnimationEnd,
    onAnimationStart
  } = props;
  var animationId = (0, _useAnimationId.useAnimationId)(props, 'recharts-radialbar-');
  var prevData = previousSectorsRef.current;
  var [isAnimating, setIsAnimating] = (0, _react.useState)(true);
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
    onAnimationStart: handleAnimationStart,
    onAnimationEnd: handleAnimationEnd,
    key: animationId
  }, _ref3 => {
    var {
      t
    } = _ref3;
    var stepData = t === 1 ? data : (data !== null && data !== void 0 ? data : STABLE_EMPTY_ARRAY).map((entry, index) => {
      var prev = prevData && prevData[index];
      if (prev) {
        var interpolatorStartAngle = (0, _DataUtils.interpolateNumber)(prev.startAngle, entry.startAngle);
        var interpolatorEndAngle = (0, _DataUtils.interpolateNumber)(prev.endAngle, entry.endAngle);
        return _objectSpread(_objectSpread({}, entry), {}, {
          startAngle: interpolatorStartAngle(t),
          endAngle: interpolatorEndAngle(t)
        });
      }
      var {
        endAngle,
        startAngle
      } = entry;
      var interpolator = (0, _DataUtils.interpolateNumber)(startAngle, endAngle);
      return _objectSpread(_objectSpread({}, entry), {}, {
        endAngle: interpolator(t)
      });
    });
    if (t > 0) {
      // eslint-disable-next-line no-param-reassign
      previousSectorsRef.current = stepData !== null && stepData !== void 0 ? stepData : null;
    }
    return /*#__PURE__*/React.createElement(_Layer.Layer, null, /*#__PURE__*/React.createElement(RadialBarSectors, {
      sectors: stepData !== null && stepData !== void 0 ? stepData : STABLE_EMPTY_ARRAY,
      allOtherRadialBarProps: props,
      showLabels: !isAnimating
    }));
  });
}
function RenderSectors(props) {
  var {
    data = [],
    isAnimationActive
  } = props;
  var previousSectorsRef = (0, _react.useRef)(null);
  var prevData = previousSectorsRef.current;
  if (isAnimationActive && data && data.length && (!prevData || prevData !== data)) {
    return /*#__PURE__*/React.createElement(SectorsWithAnimation, {
      props: props,
      previousSectorsRef: previousSectorsRef
    });
  }
  return /*#__PURE__*/React.createElement(RadialBarSectors, {
    sectors: data,
    allOtherRadialBarProps: props,
    showLabels: true
  });
}
function SetRadialBarPayloadLegend(props) {
  var legendPayload = (0, _hooks.useAppSelector)(state => (0, _radialBarSelectors.selectRadialBarLegendPayload)(state, props.legendType));
  return /*#__PURE__*/React.createElement(_SetLegendPayload.SetPolarLegendPayload, {
    legendPayload: legendPayload !== null && legendPayload !== void 0 ? legendPayload : []
  });
}
function getTooltipEntrySettings(props) {
  var {
    dataKey,
    data,
    stroke,
    strokeWidth,
    name,
    hide,
    fill,
    tooltipType
  } = props;
  return {
    dataDefinedOnItem: data,
    positions: undefined,
    settings: {
      stroke,
      strokeWidth,
      fill,
      nameKey: undefined,
      // RadialBar does not have nameKey, why?
      dataKey,
      name: (0, _ChartUtils.getTooltipNameProp)(name, dataKey),
      hide,
      type: tooltipType,
      color: fill,
      unit: '' // Why does RadialBar not support unit?
    }
  };
}
class RadialBarWithState extends _react.PureComponent {
  renderBackground(sectors) {
    if (sectors == null) {
      return null;
    }
    var {
      cornerRadius
    } = this.props;
    var backgroundProps = (0, _ReactUtils.filterProps)(this.props.background, false);
    return sectors.map((entry, i) => {
      var {
          value,
          background
        } = entry,
        rest = _objectWithoutProperties(entry, _excluded3);
      if (!background) {
        return null;
      }
      var props = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({
        cornerRadius: (0, _RadialBarUtils.parseCornerRadius)(cornerRadius)
      }, rest), {}, {
        fill: '#eee'
      }, background), backgroundProps), (0, _types.adaptEventsOfChild)(this.props, entry, i)), {}, {
        index: i,
        key: "sector-".concat(i),
        className: (0, _clsx.clsx)('recharts-radial-bar-background-sector', backgroundProps === null || backgroundProps === void 0 ? void 0 : backgroundProps.className),
        option: background,
        isActive: false
      });
      return /*#__PURE__*/React.createElement(_RadialBarUtils.RadialBarSector, props);
    });
  }
  render() {
    var {
      hide,
      data,
      className,
      background
    } = this.props;
    if (hide) {
      return null;
    }
    var layerClass = (0, _clsx.clsx)('recharts-area', className);
    return /*#__PURE__*/React.createElement(_Layer.Layer, {
      className: layerClass
    }, background && /*#__PURE__*/React.createElement(_Layer.Layer, {
      className: "recharts-radial-bar-background"
    }, this.renderBackground(data)), /*#__PURE__*/React.createElement(_Layer.Layer, {
      className: "recharts-radial-bar-sectors"
    }, /*#__PURE__*/React.createElement(RenderSectors, this.props)));
  }
}
function RadialBarImpl(props) {
  var _useAppSelector;
  var cells = (0, _ReactUtils.findAllByType)(props.children, _Cell.Cell);
  var radialBarSettings = {
    dataKey: props.dataKey,
    minPointSize: props.minPointSize,
    stackId: props.stackId,
    maxBarSize: props.maxBarSize,
    barSize: props.barSize
  };
  var data = (_useAppSelector = (0, _hooks.useAppSelector)(state => (0, _radialBarSelectors.selectRadialBarSectors)(state, props.radiusAxisId, props.angleAxisId, radialBarSettings, cells))) !== null && _useAppSelector !== void 0 ? _useAppSelector : STABLE_EMPTY_ARRAY;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_SetTooltipEntrySettings.SetTooltipEntrySettings, {
    fn: getTooltipEntrySettings,
    args: _objectSpread(_objectSpread({}, props), {}, {
      data
    })
  }), /*#__PURE__*/React.createElement(RadialBarWithState, _extends({}, props, {
    data: data
  })));
}
var defaultRadialBarProps = {
  angleAxisId: 0,
  radiusAxisId: 0,
  minPointSize: 0,
  hide: false,
  legendType: 'rect',
  data: [],
  isAnimationActive: !_Global.Global.isSsr,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
  forceCornerRadius: false,
  cornerIsExternal: false
};
function computeRadialBarDataItems(_ref4) {
  var {
    displayedData,
    stackedData,
    dataStartIndex,
    stackedDomain,
    dataKey,
    baseValue,
    layout,
    radiusAxis,
    radiusAxisTicks,
    bandSize,
    pos,
    angleAxis,
    minPointSize,
    cx,
    cy,
    angleAxisTicks,
    cells,
    startAngle: rootStartAngle,
    endAngle: rootEndAngle
  } = _ref4;
  return (displayedData !== null && displayedData !== void 0 ? displayedData : []).map((entry, index) => {
    var value, innerRadius, outerRadius, startAngle, endAngle, backgroundSector;
    if (stackedData) {
      // @ts-expect-error truncateByDomain expects only numerical domain, but it can received categorical domain too
      value = (0, _ChartUtils.truncateByDomain)(stackedData[dataStartIndex + index], stackedDomain);
    } else {
      value = (0, _ChartUtils.getValueByDataKey)(entry, dataKey);
      if (!Array.isArray(value)) {
        value = [baseValue, value];
      }
    }
    if (layout === 'radial') {
      innerRadius = (0, _ChartUtils.getCateCoordinateOfBar)({
        axis: radiusAxis,
        ticks: radiusAxisTicks,
        bandSize,
        offset: pos.offset,
        entry,
        index
      });
      endAngle = angleAxis.scale(value[1]);
      startAngle = angleAxis.scale(value[0]);
      outerRadius = (innerRadius !== null && innerRadius !== void 0 ? innerRadius : 0) + pos.size;
      var deltaAngle = endAngle - startAngle;
      if (Math.abs(minPointSize) > 0 && Math.abs(deltaAngle) < Math.abs(minPointSize)) {
        var delta = (0, _DataUtils.mathSign)(deltaAngle || minPointSize) * (Math.abs(minPointSize) - Math.abs(deltaAngle));
        endAngle += delta;
      }
      backgroundSector = {
        background: {
          cx,
          cy,
          innerRadius,
          outerRadius,
          startAngle: rootStartAngle,
          endAngle: rootEndAngle
        }
      };
    } else {
      innerRadius = radiusAxis.scale(value[0]);
      outerRadius = radiusAxis.scale(value[1]);
      startAngle = (0, _ChartUtils.getCateCoordinateOfBar)({
        axis: angleAxis,
        ticks: angleAxisTicks,
        bandSize,
        offset: pos.offset,
        entry,
        index
      });
      endAngle = (startAngle !== null && startAngle !== void 0 ? startAngle : 0) + pos.size;
      var deltaRadius = outerRadius - innerRadius;
      if (Math.abs(minPointSize) > 0 && Math.abs(deltaRadius) < Math.abs(minPointSize)) {
        var _delta = (0, _DataUtils.mathSign)(deltaRadius || minPointSize) * (Math.abs(minPointSize) - Math.abs(deltaRadius));
        outerRadius += _delta;
      }
    }
    return _objectSpread(_objectSpread(_objectSpread({}, entry), backgroundSector), {}, {
      payload: entry,
      value: stackedData ? value : value[1],
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle
    }, cells && cells[index] && cells[index].props);
  });
}
class RadialBar extends _react.PureComponent {
  render() {
    var _this$props$hide, _this$props$angleAxis, _this$props$radiusAxi;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_ReportBar.ReportBar, null), /*#__PURE__*/React.createElement(_PolarGraphicalItemContext.PolarGraphicalItemContext
    // TODO: do we need this anymore and is the below comment true? Strict nulls complains about it
    , {
      data: undefined // data prop is injected through generator and overwrites what user passes in
      ,
      dataKey: this.props.dataKey
      // TS is not smart enough to know defaultProps has values due to the explicit Partial type
      ,
      hide: (_this$props$hide = this.props.hide) !== null && _this$props$hide !== void 0 ? _this$props$hide : defaultRadialBarProps.hide,
      angleAxisId: (_this$props$angleAxis = this.props.angleAxisId) !== null && _this$props$angleAxis !== void 0 ? _this$props$angleAxis : defaultRadialBarProps.angleAxisId,
      radiusAxisId: (_this$props$radiusAxi = this.props.radiusAxisId) !== null && _this$props$radiusAxi !== void 0 ? _this$props$radiusAxi : defaultRadialBarProps.radiusAxisId,
      stackId: this.props.stackId,
      barSize: this.props.barSize,
      type: "radialBar"
    }), /*#__PURE__*/React.createElement(SetRadialBarPayloadLegend, this.props), /*#__PURE__*/React.createElement(RadialBarImpl, this.props));
  }
}
exports.RadialBar = RadialBar;
_defineProperty(RadialBar, "displayName", 'RadialBar');
_defineProperty(RadialBar, "defaultProps", defaultRadialBarProps);