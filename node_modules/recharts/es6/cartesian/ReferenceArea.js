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
import { Label } from '../component/Label';
import { createLabeledScales, rectWithPoints } from '../util/CartesianUtils';
import { isNumOrStr } from '../util/DataUtils';
import { Rectangle } from '../shape/Rectangle';
import { filterProps } from '../util/ReactUtils';
import { addArea, removeArea } from '../state/referenceElementsSlice';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { selectAxisScale } from '../state/selectors/axisSelectors';
import { useIsPanorama } from '../context/PanoramaContext';
import { useClipPathId } from '../container/ClipPathProvider';
var getRect = (hasX1, hasX2, hasY1, hasY2, xAxisScale, yAxisScale, props) => {
  var {
    x1: xValue1,
    x2: xValue2,
    y1: yValue1,
    y2: yValue2
  } = props;
  if (xAxisScale == null || yAxisScale == null) {
    return null;
  }
  var scales = createLabeledScales({
    x: xAxisScale,
    y: yAxisScale
  });
  var p1 = {
    x: hasX1 ? scales.x.apply(xValue1, {
      position: 'start'
    }) : scales.x.rangeMin,
    y: hasY1 ? scales.y.apply(yValue1, {
      position: 'start'
    }) : scales.y.rangeMin
  };
  var p2 = {
    x: hasX2 ? scales.x.apply(xValue2, {
      position: 'end'
    }) : scales.x.rangeMax,
    y: hasY2 ? scales.y.apply(yValue2, {
      position: 'end'
    }) : scales.y.rangeMax
  };
  if (props.ifOverflow === 'discard' && (!scales.isInRange(p1) || !scales.isInRange(p2))) {
    return null;
  }
  return rectWithPoints(p1, p2);
};
var renderRect = (option, props) => {
  var rect;
  if (/*#__PURE__*/React.isValidElement(option)) {
    rect = /*#__PURE__*/React.cloneElement(option, props);
  } else if (typeof option === 'function') {
    rect = option(props);
  } else {
    rect = /*#__PURE__*/React.createElement(Rectangle, _extends({}, props, {
      className: "recharts-reference-area-rect"
    }));
  }
  return rect;
};
function ReportReferenceArea(props) {
  var dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(addArea(props));
    return () => {
      dispatch(removeArea(props));
    };
  });
  return null;
}
function ReferenceAreaImpl(props) {
  var {
    x1,
    x2,
    y1,
    y2,
    className,
    shape,
    xAxisId,
    yAxisId
  } = props;
  var clipPathId = useClipPathId();
  var isPanorama = useIsPanorama();
  var xAxisScale = useAppSelector(state => selectAxisScale(state, 'xAxis', xAxisId, isPanorama));
  var yAxisScale = useAppSelector(state => selectAxisScale(state, 'yAxis', yAxisId, isPanorama));
  if (xAxisScale == null || !yAxisScale == null) {
    return null;
  }
  var hasX1 = isNumOrStr(x1);
  var hasX2 = isNumOrStr(x2);
  var hasY1 = isNumOrStr(y1);
  var hasY2 = isNumOrStr(y2);
  if (!hasX1 && !hasX2 && !hasY1 && !hasY2 && !shape) {
    return null;
  }
  var rect = getRect(hasX1, hasX2, hasY1, hasY2, xAxisScale, yAxisScale, props);
  if (!rect && !shape) {
    return null;
  }
  var isOverflowHidden = props.ifOverflow === 'hidden';
  var clipPath = isOverflowHidden ? "url(#".concat(clipPathId, ")") : undefined;
  return /*#__PURE__*/React.createElement(Layer, {
    className: clsx('recharts-reference-area', className)
  }, renderRect(shape, _objectSpread(_objectSpread({
    clipPath
  }, filterProps(props, true)), rect)), Label.renderCallByParent(props, rect));
}
function ReferenceAreaSettingsDispatcher(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ReportReferenceArea, {
    yAxisId: props.yAxisId,
    xAxisId: props.xAxisId,
    ifOverflow: props.ifOverflow,
    x1: props.x1,
    x2: props.x2,
    y1: props.y1,
    y2: props.y2
  }), /*#__PURE__*/React.createElement(ReferenceAreaImpl, props));
}

// eslint-disable-next-line react/prefer-stateless-function
export class ReferenceArea extends Component {
  render() {
    return /*#__PURE__*/React.createElement(ReferenceAreaSettingsDispatcher, this.props);
  }
}
_defineProperty(ReferenceArea, "displayName", 'ReferenceArea');
_defineProperty(ReferenceArea, "defaultProps", {
  ifOverflow: 'discard',
  xAxisId: 0,
  yAxisId: 0,
  r: 10,
  fill: '#ccc',
  fillOpacity: 0.5,
  stroke: 'none',
  strokeWidth: 1
});