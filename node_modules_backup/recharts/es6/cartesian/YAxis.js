var _excluded = ["dangerouslySetInnerHTML", "ticks"];
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { Component, useEffect, useRef, useLayoutEffect, isValidElement } from 'react';
import { clsx } from 'clsx';
import { CartesianAxis } from './CartesianAxis';
import { addYAxis, removeYAxis, updateYAxisWidth } from '../state/cartesianAxisSlice';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { implicitYAxis, selectAxisScale, selectTicksOfAxis, selectYAxisPosition, selectYAxisSize } from '../state/selectors/axisSelectors';
import { selectAxisViewBox } from '../state/selectors/selectChartOffsetInternal';
import { useIsPanorama } from '../context/PanoramaContext';
import { getCalculatedYAxisWidth } from '../util/YAxisUtils';
import { isLabelContentAFunction } from '../component/Label';
function SetYAxisSettings(settings) {
  var dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(addYAxis(settings));
    return () => {
      dispatch(removeYAxis(settings));
    };
  }, [settings, dispatch]);
  return null;
}
var YAxisImpl = props => {
  var _cartesianAxisRef$cur;
  var {
    yAxisId,
    className,
    width,
    label
  } = props;
  var cartesianAxisRef = useRef(null);
  var labelRef = useRef(null);
  var viewBox = useAppSelector(selectAxisViewBox);
  var isPanorama = useIsPanorama();
  var dispatch = useAppDispatch();
  var axisType = 'yAxis';
  var scale = useAppSelector(state => selectAxisScale(state, axisType, yAxisId, isPanorama));
  var axisSize = useAppSelector(state => selectYAxisSize(state, yAxisId));
  var position = useAppSelector(state => selectYAxisPosition(state, yAxisId));
  var cartesianTickItems = useAppSelector(state => selectTicksOfAxis(state, axisType, yAxisId, isPanorama));
  useLayoutEffect(() => {
    var _axisComponent$tickRe;
    // No dynamic width calculation is done when width !== 'auto'
    // or when a function/react element is used for label
    if (width !== 'auto' || !axisSize || isLabelContentAFunction(label) || /*#__PURE__*/isValidElement(label)) return;
    var axisComponent = cartesianAxisRef.current;
    var tickNodes = axisComponent === null || axisComponent === void 0 || (_axisComponent$tickRe = axisComponent.tickRefs) === null || _axisComponent$tickRe === void 0 ? void 0 : _axisComponent$tickRe.current;
    var {
      tickSize,
      tickMargin
    } = axisComponent.props;

    // get calculated width based on the label width, ticks etc
    var updatedYAxisWidth = getCalculatedYAxisWidth({
      ticks: tickNodes,
      label: labelRef.current,
      labelGapWithTick: 5,
      tickSize,
      tickMargin
    });

    // if the width has changed, dispatch an action to update the width
    if (Math.round(axisSize.width) !== Math.round(updatedYAxisWidth)) dispatch(updateYAxisWidth({
      id: yAxisId,
      width: updatedYAxisWidth
    }));
  }, [cartesianAxisRef, cartesianAxisRef === null || cartesianAxisRef === void 0 || (_cartesianAxisRef$cur = cartesianAxisRef.current) === null || _cartesianAxisRef$cur === void 0 || (_cartesianAxisRef$cur = _cartesianAxisRef$cur.tickRefs) === null || _cartesianAxisRef$cur === void 0 ? void 0 : _cartesianAxisRef$cur.current, // required to do re-calculation when using brush
  axisSize === null || axisSize === void 0 ? void 0 : axisSize.width, axisSize, dispatch, label, yAxisId, width]);
  if (axisSize == null || position == null) {
    return null;
  }
  var {
      dangerouslySetInnerHTML,
      ticks
    } = props,
    allOtherProps = _objectWithoutProperties(props, _excluded);
  return /*#__PURE__*/React.createElement(CartesianAxis, _extends({}, allOtherProps, {
    ref: cartesianAxisRef,
    labelRef: labelRef,
    scale: scale,
    x: position.x,
    y: position.y,
    width: axisSize.width,
    height: axisSize.height,
    className: clsx("recharts-".concat(axisType, " ").concat(axisType), className),
    viewBox: viewBox,
    ticks: cartesianTickItems
  }));
};
var YAxisSettingsDispatcher = props => {
  var _props$interval, _props$includeHidden, _props$angle, _props$minTickGap, _props$tick;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SetYAxisSettings, {
    interval: (_props$interval = props.interval) !== null && _props$interval !== void 0 ? _props$interval : 'preserveEnd',
    id: props.yAxisId,
    scale: props.scale,
    type: props.type,
    domain: props.domain,
    allowDataOverflow: props.allowDataOverflow,
    dataKey: props.dataKey,
    allowDuplicatedCategory: props.allowDuplicatedCategory,
    allowDecimals: props.allowDecimals,
    tickCount: props.tickCount,
    padding: props.padding,
    includeHidden: (_props$includeHidden = props.includeHidden) !== null && _props$includeHidden !== void 0 ? _props$includeHidden : false,
    reversed: props.reversed,
    ticks: props.ticks,
    width: props.width,
    orientation: props.orientation,
    mirror: props.mirror,
    hide: props.hide,
    unit: props.unit,
    name: props.name,
    angle: (_props$angle = props.angle) !== null && _props$angle !== void 0 ? _props$angle : 0,
    minTickGap: (_props$minTickGap = props.minTickGap) !== null && _props$minTickGap !== void 0 ? _props$minTickGap : 5,
    tick: (_props$tick = props.tick) !== null && _props$tick !== void 0 ? _props$tick : true,
    tickFormatter: props.tickFormatter
  }), /*#__PURE__*/React.createElement(YAxisImpl, props));
};
export var YAxisDefaultProps = {
  allowDataOverflow: implicitYAxis.allowDataOverflow,
  allowDecimals: implicitYAxis.allowDecimals,
  allowDuplicatedCategory: implicitYAxis.allowDuplicatedCategory,
  hide: false,
  mirror: implicitYAxis.mirror,
  orientation: implicitYAxis.orientation,
  padding: implicitYAxis.padding,
  reversed: implicitYAxis.reversed,
  scale: implicitYAxis.scale,
  tickCount: implicitYAxis.tickCount,
  type: implicitYAxis.type,
  width: implicitYAxis.width,
  yAxisId: 0
};

// eslint-disable-next-line react/prefer-stateless-function
export class YAxis extends Component {
  render() {
    return /*#__PURE__*/React.createElement(YAxisSettingsDispatcher, this.props);
  }
}
_defineProperty(YAxis, "displayName", 'YAxis');
_defineProperty(YAxis, "defaultProps", YAxisDefaultProps);