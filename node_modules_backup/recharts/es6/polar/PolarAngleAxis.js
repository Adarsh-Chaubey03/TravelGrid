var _excluded = ["children"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { PureComponent, useEffect, useMemo } from 'react';
import { clsx } from 'clsx';
import { Layer } from '../container/Layer';
import { Dot } from '../shape/Dot';
import { Polygon } from '../shape/Polygon';
import { Text } from '../component/Text';
import { adaptEventsOfChild } from '../util/types';
import { filterProps } from '../util/ReactUtils';
import { getTickClassName, polarToCartesian } from '../util/PolarUtils';
import { addAngleAxis, removeAngleAxis } from '../state/polarAxisSlice';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { selectPolarAxisScale, selectPolarAxisTicks } from '../state/selectors/polarScaleSelectors';
import { selectAngleAxis, selectPolarViewBox } from '../state/selectors/polarAxisSelectors';
import { defaultPolarAngleAxisProps } from './defaultPolarAngleAxisProps';
import { useIsPanorama } from '../context/PanoramaContext';
var RADIAN = Math.PI / 180;
var eps = 1e-5;

/**
 * These are injected from Redux, are required, but cannot be set by user.
 */

var AXIS_TYPE = 'angleAxis';
function SetAngleAxisSettings(props) {
  var dispatch = useAppDispatch();
  var settings = useMemo(() => {
    var {
        children
      } = props,
      rest = _objectWithoutProperties(props, _excluded);
    return rest;
  }, [props]);
  var synchronizedSettings = useAppSelector(state => selectAngleAxis(state, settings.id));
  var settingsAreSynchronized = settings === synchronizedSettings;
  useEffect(() => {
    dispatch(addAngleAxis(settings));
    return () => {
      dispatch(removeAngleAxis(settings));
    };
  }, [dispatch, settings]);
  if (settingsAreSynchronized) {
    return props.children;
  }
  return null;
}

/**
 * Calculate the coordinate of line endpoint
 * @param data The data if there are ticks
 * @param props axis settings
 * @return (x1, y1): The point close to text,
 *         (x2, y2): The point close to axis
 */
var getTickLineCoord = (data, props) => {
  var {
    cx,
    cy,
    radius,
    orientation,
    tickSize
  } = props;
  var tickLineSize = tickSize || 8;
  var p1 = polarToCartesian(cx, cy, radius, data.coordinate);
  var p2 = polarToCartesian(cx, cy, radius + (orientation === 'inner' ? -1 : 1) * tickLineSize, data.coordinate);
  return {
    x1: p1.x,
    y1: p1.y,
    x2: p2.x,
    y2: p2.y
  };
};

/**
 * Get the text-anchor of each tick
 * @param data Data of ticks
 * @param orientation of the axis ticks
 * @return text-anchor
 */
var getTickTextAnchor = (data, orientation) => {
  var cos = Math.cos(-data.coordinate * RADIAN);
  if (cos > eps) {
    return orientation === 'outer' ? 'start' : 'end';
  }
  if (cos < -eps) {
    return orientation === 'outer' ? 'end' : 'start';
  }
  return 'middle';
};
var AxisLine = props => {
  var {
    cx,
    cy,
    radius,
    axisLineType,
    axisLine,
    ticks
  } = props;
  if (!axisLine) {
    return null;
  }
  var axisLineProps = _objectSpread(_objectSpread({}, filterProps(props, false)), {}, {
    fill: 'none'
  }, filterProps(axisLine, false));
  if (axisLineType === 'circle') {
    return /*#__PURE__*/React.createElement(Dot, _extends({
      className: "recharts-polar-angle-axis-line"
    }, axisLineProps, {
      cx: cx,
      cy: cy,
      r: radius
    }));
  }
  var points = ticks.map(entry => polarToCartesian(cx, cy, radius, entry.coordinate));
  return /*#__PURE__*/React.createElement(Polygon, _extends({
    className: "recharts-polar-angle-axis-line"
  }, axisLineProps, {
    points: points
  }));
};
var TickItemText = _ref => {
  var {
    tick,
    tickProps,
    value
  } = _ref;
  if (!tick) {
    return null;
  }
  if (/*#__PURE__*/React.isValidElement(tick)) {
    // @ts-expect-error element cloning makes typescript unhappy and me too
    return /*#__PURE__*/React.cloneElement(tick, tickProps);
  }
  if (typeof tick === 'function') {
    return tick(tickProps);
  }
  return /*#__PURE__*/React.createElement(Text, _extends({}, tickProps, {
    className: "recharts-polar-angle-axis-tick-value"
  }), value);
};
var Ticks = props => {
  var {
    tick,
    tickLine,
    tickFormatter,
    stroke,
    ticks
  } = props;
  var axisProps = filterProps(props, false);
  var customTickProps = filterProps(tick, false);
  var tickLineProps = _objectSpread(_objectSpread({}, axisProps), {}, {
    fill: 'none'
  }, filterProps(tickLine, false));
  var items = ticks.map((entry, i) => {
    var lineCoord = getTickLineCoord(entry, props);
    var textAnchor = getTickTextAnchor(entry, props.orientation);
    var tickProps = _objectSpread(_objectSpread(_objectSpread({
      textAnchor
    }, axisProps), {}, {
      stroke: 'none',
      fill: stroke
    }, customTickProps), {}, {
      index: i,
      payload: entry,
      x: lineCoord.x2,
      y: lineCoord.y2
    });
    return /*#__PURE__*/React.createElement(Layer, _extends({
      className: clsx('recharts-polar-angle-axis-tick', getTickClassName(tick)),
      key: "tick-".concat(entry.coordinate)
    }, adaptEventsOfChild(props, entry, i)), tickLine && /*#__PURE__*/React.createElement("line", _extends({
      className: "recharts-polar-angle-axis-tick-line"
    }, tickLineProps, lineCoord)), /*#__PURE__*/React.createElement(TickItemText, {
      tick: tick,
      tickProps: tickProps,
      value: tickFormatter ? tickFormatter(entry.value, i) : entry.value
    }));
  });
  return /*#__PURE__*/React.createElement(Layer, {
    className: "recharts-polar-angle-axis-ticks"
  }, items);
};
export var PolarAngleAxisWrapper = defaultsAndInputs => {
  var {
    angleAxisId
  } = defaultsAndInputs;
  var viewBox = useAppSelector(selectPolarViewBox);
  var scale = useAppSelector(state => selectPolarAxisScale(state, 'angleAxis', angleAxisId));
  var isPanorama = useIsPanorama();
  var ticks = useAppSelector(state => selectPolarAxisTicks(state, 'angleAxis', angleAxisId, isPanorama));
  if (viewBox == null || !ticks || !ticks.length) {
    return null;
  }
  var props = _objectSpread(_objectSpread(_objectSpread({}, defaultsAndInputs), {}, {
    scale
  }, viewBox), {}, {
    radius: viewBox.outerRadius
  });
  return /*#__PURE__*/React.createElement(Layer, {
    className: clsx('recharts-polar-angle-axis', AXIS_TYPE, props.className)
  }, /*#__PURE__*/React.createElement(AxisLine, _extends({}, props, {
    ticks: ticks
  })), /*#__PURE__*/React.createElement(Ticks, _extends({}, props, {
    ticks: ticks
  })));
};
export class PolarAngleAxis extends PureComponent {
  render() {
    if (this.props.radius <= 0) return null;
    return /*#__PURE__*/React.createElement(SetAngleAxisSettings, {
      id: this.props.angleAxisId,
      scale: this.props.scale,
      type: this.props.type,
      dataKey: this.props.dataKey,
      unit: undefined,
      name: this.props.name,
      allowDuplicatedCategory: false // Ignoring the prop on purpose because axis calculation behaves as if it was false and Tooltip requires it to be true.
      ,
      allowDataOverflow: false,
      reversed: this.props.reversed,
      includeHidden: false,
      allowDecimals: this.props.allowDecimals,
      tickCount: this.props.tickCount
      // @ts-expect-error the type does not match. Is RadiusAxis really expecting what it says?
      ,
      ticks: this.props.ticks,
      tick: this.props.tick,
      domain: this.props.domain
    }, /*#__PURE__*/React.createElement(PolarAngleAxisWrapper, this.props));
  }
}
_defineProperty(PolarAngleAxis, "displayName", 'PolarAngleAxis');
_defineProperty(PolarAngleAxis, "axisType", AXIS_TYPE);
_defineProperty(PolarAngleAxis, "defaultProps", defaultPolarAngleAxisProps);