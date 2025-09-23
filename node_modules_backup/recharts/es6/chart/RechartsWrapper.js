function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { forwardRef, useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { mouseLeaveChart } from '../state/tooltipSlice';
import { useAppDispatch } from '../state/hooks';
import { mouseClickAction, mouseMoveAction } from '../state/mouseEventsMiddleware';
import { useSynchronisedEventsFromOtherCharts } from '../synchronisation/useChartSynchronisation';
import { focusAction, keyDownAction } from '../state/keyboardEventsMiddleware';
import { useReportScale } from '../util/useReportScale';
import { externalEventAction } from '../state/externalEventsMiddleware';
import { touchEventAction } from '../state/touchEventsMiddleware';
import { TooltipPortalContext } from '../context/tooltipPortalContext';
import { LegendPortalContext } from '../context/legendPortalContext';
export var RechartsWrapper = /*#__PURE__*/forwardRef((_ref, ref) => {
  var {
    children,
    className,
    height,
    onClick,
    onContextMenu,
    onDoubleClick,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    onMouseUp,
    onTouchEnd,
    onTouchMove,
    onTouchStart,
    style,
    width
  } = _ref;
  var dispatch = useAppDispatch();
  var [tooltipPortal, setTooltipPortal] = useState(null);
  var [legendPortal, setLegendPortal] = useState(null);
  useSynchronisedEventsFromOtherCharts();
  var setScaleRef = useReportScale();
  var innerRef = useCallback(node => {
    setScaleRef(node);
    if (typeof ref === 'function') {
      ref(node);
    }
    setTooltipPortal(node);
    setLegendPortal(node);
  }, [setScaleRef, ref, setTooltipPortal, setLegendPortal]);
  var myOnClick = useCallback(e => {
    dispatch(mouseClickAction(e));
    dispatch(externalEventAction({
      handler: onClick,
      reactEvent: e
    }));
  }, [dispatch, onClick]);
  var myOnMouseEnter = useCallback(e => {
    dispatch(mouseMoveAction(e));
    dispatch(externalEventAction({
      handler: onMouseEnter,
      reactEvent: e
    }));
  }, [dispatch, onMouseEnter]);
  var myOnMouseLeave = useCallback(e => {
    dispatch(mouseLeaveChart());
    dispatch(externalEventAction({
      handler: onMouseLeave,
      reactEvent: e
    }));
  }, [dispatch, onMouseLeave]);
  var myOnMouseMove = useCallback(e => {
    dispatch(mouseMoveAction(e));
    dispatch(externalEventAction({
      handler: onMouseMove,
      reactEvent: e
    }));
  }, [dispatch, onMouseMove]);
  var onFocus = useCallback(() => {
    dispatch(focusAction());
  }, [dispatch]);
  var onKeyDown = useCallback(e => {
    dispatch(keyDownAction(e.key));
  }, [dispatch]);
  var myOnContextMenu = useCallback(e => {
    dispatch(externalEventAction({
      handler: onContextMenu,
      reactEvent: e
    }));
  }, [dispatch, onContextMenu]);
  var myOnDoubleClick = useCallback(e => {
    dispatch(externalEventAction({
      handler: onDoubleClick,
      reactEvent: e
    }));
  }, [dispatch, onDoubleClick]);
  var myOnMouseDown = useCallback(e => {
    dispatch(externalEventAction({
      handler: onMouseDown,
      reactEvent: e
    }));
  }, [dispatch, onMouseDown]);
  var myOnMouseUp = useCallback(e => {
    dispatch(externalEventAction({
      handler: onMouseUp,
      reactEvent: e
    }));
  }, [dispatch, onMouseUp]);
  var myOnTouchStart = useCallback(e => {
    dispatch(externalEventAction({
      handler: onTouchStart,
      reactEvent: e
    }));
  }, [dispatch, onTouchStart]);

  /*
   * onTouchMove is special because it behaves different from mouse events.
   * Mouse events have enter + leave combo that notify us when the mouse is over
   * a certain element. Touch events don't have that; touch only gives us
   * start (finger down), end (finger up) and move (finger moving).
   * So we need to figure out which element the user is touching
   * ourselves. Fortunately, there's a convenient method for that:
   * https://developer.mozilla.org/en-US/docs/Web/API/Document/elementFromPoint
   */
  var myOnTouchMove = useCallback(e => {
    dispatch(touchEventAction(e));
    dispatch(externalEventAction({
      handler: onTouchMove,
      reactEvent: e
    }));
  }, [dispatch, onTouchMove]);
  var myOnTouchEnd = useCallback(e => {
    dispatch(externalEventAction({
      handler: onTouchEnd,
      reactEvent: e
    }));
  }, [dispatch, onTouchEnd]);
  return /*#__PURE__*/React.createElement(TooltipPortalContext.Provider, {
    value: tooltipPortal
  }, /*#__PURE__*/React.createElement(LegendPortalContext.Provider, {
    value: legendPortal
  }, /*#__PURE__*/React.createElement("div", {
    className: clsx('recharts-wrapper', className),
    style: _objectSpread({
      position: 'relative',
      cursor: 'default',
      width,
      height
    }, style),
    onClick: myOnClick,
    onContextMenu: myOnContextMenu,
    onDoubleClick: myOnDoubleClick,
    onFocus: onFocus,
    onKeyDown: onKeyDown,
    onMouseDown: myOnMouseDown,
    onMouseEnter: myOnMouseEnter,
    onMouseLeave: myOnMouseLeave,
    onMouseMove: myOnMouseMove,
    onMouseUp: myOnMouseUp,
    onTouchEnd: myOnTouchEnd,
    onTouchMove: myOnTouchMove,
    onTouchStart: myOnTouchStart,
    ref: innerRef
  }, children)));
});