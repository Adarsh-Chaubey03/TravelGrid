function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { Component, useEffect } from 'react';
import { clsx } from 'clsx';
import { Layer } from '../container/Layer';
import { Dot } from '../shape/Dot';
import { Label } from '../component/Label';
import { isNumOrStr } from '../util/DataUtils';
import { createLabeledScales } from '../util/CartesianUtils';
import { filterProps } from '../util/ReactUtils';
import { addDot, removeDot } from '../state/referenceElementsSlice';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { selectAxisScale } from '../state/selectors/axisSelectors';
import { useIsPanorama } from '../context/PanoramaContext';
import { useClipPathId } from '../container/ClipPathProvider';
var useCoordinate = (x, y, xAxisId, yAxisId, ifOverflow) => {
  var isX = isNumOrStr(x);
  var isY = isNumOrStr(y);
  var isPanorama = useIsPanorama();
  var xAxisScale = useAppSelector(state => selectAxisScale(state, 'xAxis', xAxisId, isPanorama));
  var yAxisScale = useAppSelector(state => selectAxisScale(state, 'yAxis', yAxisId, isPanorama));
  if (!isX || !isY || xAxisScale == null || yAxisScale == null) {
    return null;
  }
  var scales = createLabeledScales({
    x: xAxisScale,
    y: yAxisScale
  });
  var result = scales.apply({
    x,
    y
  }, {
    bandAware: true
  });
  if (ifOverflow === 'discard' && !scales.isInRange(result)) {
    return null;
  }
  return result;
};
function ReportReferenceDot(props) {
  var dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(addDot(props));
    return () => {
      dispatch(removeDot(props));
    };
  });
  return null;
}
var renderDot = (option, props) => {
  var dot;
  if (/*#__PURE__*/React.isValidElement(option)) {
    dot = /*#__PURE__*/React.cloneElement(option, props);
  } else if (typeof option === 'function') {
    dot = option(props);
  } else {
    dot = /*#__PURE__*/React.createElement(Dot, _extends({}, props, {
      cx: props.cx,
      cy: props.cy,
      className: "recharts-reference-dot-dot"
    }));
  }
  return dot;
};
function ReferenceDotImpl(props) {
  var {
    x,
    y,
    r
  } = props;
  var clipPathId = useClipPathId();
  var coordinate = useCoordinate(x, y, props.xAxisId, props.yAxisId, props.ifOverflow);
  if (!coordinate) {
    return null;
  }
  var {
    x: cx,
    y: cy
  } = coordinate;
  var {
    shape,
    className,
    ifOverflow
  } = props;
  var clipPath = ifOverflow === 'hidden' ? "url(#".concat(clipPathId, ")") : undefined;
  var dotProps = _objectSpread(_objectSpread({
    clipPath
  }, filterProps(props, true)), {}, {
    cx,
    cy
  });
  return /*#__PURE__*/React.createElement(Layer, {
    className: clsx('recharts-reference-dot', className)
  }, renderDot(shape, dotProps), Label.renderCallByParent(props, {
    x: cx - r,
    y: cy - r,
    width: 2 * r,
    height: 2 * r
  }));
}
function ReferenceDotSettingsDispatcher(props) {
  var {
    x,
    y,
    r,
    ifOverflow,
    yAxisId,
    xAxisId
  } = props;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ReportReferenceDot, {
    y: y,
    x: x,
    r: r,
    yAxisId: yAxisId,
    xAxisId: xAxisId,
    ifOverflow: ifOverflow
  }), /*#__PURE__*/React.createElement(ReferenceDotImpl, props));
}

// eslint-disable-next-line react/prefer-stateless-function
export class ReferenceDot extends Component {
  render() {
    return /*#__PURE__*/React.createElement(ReferenceDotSettingsDispatcher, this.props);
  }
}
_defineProperty(ReferenceDot, "displayName", 'ReferenceDot');
_defineProperty(ReferenceDot, "defaultProps", {
  ifOverflow: 'discard',
  xAxisId: 0,
  yAxisId: 0,
  r: 10,
  fill: '#fff',
  stroke: '#ccc',
  fillOpacity: 1,
  strokeWidth: 1
});