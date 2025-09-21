function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { cloneElement, createElement, isValidElement } from 'react';
import { clsx } from 'clsx';
import { Curve } from '../shape/Curve';
import { Cross } from '../shape/Cross';
import { getCursorRectangle } from '../util/cursor/getCursorRectangle';
import { Rectangle } from '../shape/Rectangle';
import { getRadialCursorPoints } from '../util/cursor/getRadialCursorPoints';
import { Sector } from '../shape/Sector';
import { getCursorPoints } from '../util/cursor/getCursorPoints';
import { filterProps } from '../util/ReactUtils';
import { useChartLayout, useOffsetInternal } from '../context/chartLayoutContext';
import { useTooltipAxisBandSize } from '../context/useTooltipAxis';
import { useChartName } from '../state/selectors/selectors';

/**
 * If set false, no cursor will be drawn when tooltip is active.
 * If set an object, the option is the configuration of cursor.
 * If set a React element, the option is the custom react element of drawing cursor
 */

export function CursorInternal(props) {
  var {
    coordinate,
    payload,
    index,
    offset,
    tooltipAxisBandSize,
    layout,
    cursor,
    tooltipEventType,
    chartName
  } = props;

  // The cursor is a part of the Tooltip, and it should be shown (by default) when the Tooltip is active.
  var activeCoordinate = coordinate;
  var activePayload = payload;
  var activeTooltipIndex = index;
  if (!cursor || !activeCoordinate || chartName !== 'ScatterChart' && tooltipEventType !== 'axis') {
    return null;
  }
  var restProps, cursorComp;
  if (chartName === 'ScatterChart') {
    restProps = activeCoordinate;
    cursorComp = Cross;
  } else if (chartName === 'BarChart') {
    restProps = getCursorRectangle(layout, activeCoordinate, offset, tooltipAxisBandSize);
    cursorComp = Rectangle;
  } else if (layout === 'radial') {
    // @ts-expect-error TODO the state is marked as containing Coordinate but actually in polar charts it contains PolarCoordinate, we should keep the polar state separate
    var {
      cx,
      cy,
      radius,
      startAngle,
      endAngle
    } = getRadialCursorPoints(activeCoordinate);
    restProps = {
      cx,
      cy,
      startAngle,
      endAngle,
      innerRadius: radius,
      outerRadius: radius
    };
    cursorComp = Sector;
  } else {
    restProps = {
      points: getCursorPoints(layout, activeCoordinate, offset)
    };
    cursorComp = Curve;
  }
  var extraClassName = typeof cursor === 'object' && 'className' in cursor ? cursor.className : undefined;
  var cursorProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({
    stroke: '#ccc',
    pointerEvents: 'none'
  }, offset), restProps), filterProps(cursor, false)), {}, {
    payload: activePayload,
    payloadIndex: activeTooltipIndex,
    className: clsx('recharts-tooltip-cursor', extraClassName)
  });
  return /*#__PURE__*/isValidElement(cursor) ? /*#__PURE__*/cloneElement(cursor, cursorProps) : /*#__PURE__*/createElement(cursorComp, cursorProps);
}

/*
 * Cursor is the background, or a highlight,
 * that shows when user mouses over or activates
 * an area.
 *
 * It usually shows together with a tooltip
 * to emphasise which part of the chart does the tooltip refer to.
 */
export function Cursor(props) {
  var tooltipAxisBandSize = useTooltipAxisBandSize();
  var offset = useOffsetInternal();
  var layout = useChartLayout();
  var chartName = useChartName();
  return /*#__PURE__*/React.createElement(CursorInternal, _extends({}, props, {
    coordinate: props.coordinate,
    index: props.index,
    payload: props.payload,
    offset: offset,
    layout: layout,
    tooltipAxisBandSize: tooltipAxisBandSize,
    chartName: chartName
  }));
}