function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DefaultTooltipContent } from './DefaultTooltipContent';
import { TooltipBoundingBox } from './TooltipBoundingBox';
import { Global } from '../util/Global';
import { getUniqPayload } from '../util/payload/getUniqPayload';
import { useViewBox } from '../context/chartLayoutContext';
import { useAccessibilityLayer } from '../context/accessibilityContext';
import { useElementOffset } from '../util/useElementOffset';
import { Cursor } from './Cursor';
import { selectActiveCoordinate, selectActiveLabel, selectIsTooltipActive, selectTooltipPayload } from '../state/selectors/selectors';
import { useTooltipPortal } from '../context/tooltipPortalContext';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { setTooltipSettingsState } from '../state/tooltipSlice';
import { useTooltipChartSynchronisation } from '../synchronisation/useChartSynchronisation';
import { useTooltipEventType } from '../state/selectors/selectTooltipEventType';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
function defaultUniqBy(entry) {
  return entry.dataKey;
}
function renderContent(content, props) {
  if (/*#__PURE__*/React.isValidElement(content)) {
    return /*#__PURE__*/React.cloneElement(content, props);
  }
  if (typeof content === 'function') {
    return /*#__PURE__*/React.createElement(content, props);
  }
  return /*#__PURE__*/React.createElement(DefaultTooltipContent, props);
}
var emptyPayload = [];
var defaultTooltipProps = {
  allowEscapeViewBox: {
    x: false,
    y: false
  },
  animationDuration: 400,
  animationEasing: 'ease',
  axisId: 0,
  contentStyle: {},
  cursor: true,
  filterNull: true,
  isAnimationActive: !Global.isSsr,
  itemSorter: 'name',
  itemStyle: {},
  labelStyle: {},
  offset: 10,
  reverseDirection: {
    x: false,
    y: false
  },
  separator: ' : ',
  trigger: 'hover',
  useTranslate3d: false,
  wrapperStyle: {}
};
export function Tooltip(outsideProps) {
  var props = resolveDefaultProps(outsideProps, defaultTooltipProps);
  var {
    active: activeFromProps,
    allowEscapeViewBox,
    animationDuration,
    animationEasing,
    content,
    filterNull,
    isAnimationActive,
    offset,
    payloadUniqBy,
    position,
    reverseDirection,
    useTranslate3d,
    wrapperStyle,
    cursor,
    shared,
    trigger,
    defaultIndex,
    portal: portalFromProps,
    axisId
  } = props;
  var dispatch = useAppDispatch();
  var defaultIndexAsString = typeof defaultIndex === 'number' ? String(defaultIndex) : defaultIndex;
  useEffect(() => {
    dispatch(setTooltipSettingsState({
      shared,
      trigger,
      axisId,
      active: activeFromProps,
      defaultIndex: defaultIndexAsString
    }));
  }, [dispatch, shared, trigger, axisId, activeFromProps, defaultIndexAsString]);
  var viewBox = useViewBox();
  var accessibilityLayer = useAccessibilityLayer();
  var tooltipEventType = useTooltipEventType(shared);
  var {
    activeIndex,
    isActive
  } = useAppSelector(state => selectIsTooltipActive(state, tooltipEventType, trigger, defaultIndexAsString));
  var payloadFromRedux = useAppSelector(state => selectTooltipPayload(state, tooltipEventType, trigger, defaultIndexAsString));
  var labelFromRedux = useAppSelector(state => selectActiveLabel(state, tooltipEventType, trigger, defaultIndexAsString));
  var coordinate = useAppSelector(state => selectActiveCoordinate(state, tooltipEventType, trigger, defaultIndexAsString));
  var payload = payloadFromRedux;
  var tooltipPortalFromContext = useTooltipPortal();
  /*
   * The user can set `active=true` on the Tooltip in which case the Tooltip will stay always active,
   * or `active=false` in which case the Tooltip never shows.
   *
   * If the `active` prop is not defined then it will show and hide based on mouse or keyboard activity.
   */
  var finalIsActive = activeFromProps !== null && activeFromProps !== void 0 ? activeFromProps : isActive;
  var [lastBoundingBox, updateBoundingBox] = useElementOffset([payload, finalIsActive]);
  var finalLabel = tooltipEventType === 'axis' ? labelFromRedux : undefined;
  useTooltipChartSynchronisation(tooltipEventType, trigger, coordinate, finalLabel, activeIndex, finalIsActive);
  var tooltipPortal = portalFromProps !== null && portalFromProps !== void 0 ? portalFromProps : tooltipPortalFromContext;
  if (tooltipPortal == null) {
    return null;
  }
  var finalPayload = payload !== null && payload !== void 0 ? payload : emptyPayload;
  if (!finalIsActive) {
    finalPayload = emptyPayload;
  }
  if (filterNull && finalPayload.length) {
    finalPayload = getUniqPayload(payload.filter(entry => entry.value != null && (entry.hide !== true || props.includeHidden)), payloadUniqBy, defaultUniqBy);
  }
  var hasPayload = finalPayload.length > 0;
  var tooltipElement = /*#__PURE__*/React.createElement(TooltipBoundingBox, {
    allowEscapeViewBox: allowEscapeViewBox,
    animationDuration: animationDuration,
    animationEasing: animationEasing,
    isAnimationActive: isAnimationActive,
    active: finalIsActive,
    coordinate: coordinate,
    hasPayload: hasPayload,
    offset: offset,
    position: position,
    reverseDirection: reverseDirection,
    useTranslate3d: useTranslate3d,
    viewBox: viewBox,
    wrapperStyle: wrapperStyle,
    lastBoundingBox: lastBoundingBox,
    innerRef: updateBoundingBox,
    hasPortalFromProps: Boolean(portalFromProps)
  }, renderContent(content, _objectSpread(_objectSpread({}, props), {}, {
    // @ts-expect-error renderContent method expects the payload to be mutable, TODO make it immutable
    payload: finalPayload,
    label: finalLabel,
    active: finalIsActive,
    coordinate,
    accessibilityLayer
  })));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/createPortal(tooltipElement, tooltipPortal), finalIsActive && /*#__PURE__*/React.createElement(Cursor, {
    cursor: cursor,
    tooltipEventType: tooltipEventType,
    coordinate: coordinate,
    payload: payload,
    index: activeIndex
  }));
}