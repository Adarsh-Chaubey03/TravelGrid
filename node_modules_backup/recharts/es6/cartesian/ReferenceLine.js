function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * @fileOverview Reference Line
 */
import * as React from 'react';
import { Component, useEffect } from 'react';
import { clsx } from 'clsx';
import { Layer } from '../container/Layer';
import { Label } from '../component/Label';
import { isNan, isNumOrStr } from '../util/DataUtils';
import { createLabeledScales, rectWithCoords } from '../util/CartesianUtils';
import { filterProps } from '../util/ReactUtils';
import { useViewBox } from '../context/chartLayoutContext';
import { addLine, removeLine } from '../state/referenceElementsSlice';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { selectAxisScale, selectXAxisSettings, selectYAxisSettings } from '../state/selectors/axisSelectors';
import { useIsPanorama } from '../context/PanoramaContext';
import { useClipPathId } from '../container/ClipPathProvider';

/**
 * This excludes `viewBox` prop from svg for two reasons:
 * 1. The components wants viewBox of object type, and svg wants string
 *    - so there's a conflict, and the component will throw if it gets string
 * 2. Internally the component calls `filterProps` which filters the viewBox away anyway
 */

var renderLine = (option, props) => {
  var line;
  if (/*#__PURE__*/React.isValidElement(option)) {
    line = /*#__PURE__*/React.cloneElement(option, props);
  } else if (typeof option === 'function') {
    line = option(props);
  } else {
    line = /*#__PURE__*/React.createElement("line", _extends({}, props, {
      className: "recharts-reference-line-line"
    }));
  }
  return line;
};
// TODO: ScaleHelper
export var getEndPoints = (scales, isFixedX, isFixedY, isSegment, viewBox, position, xAxisOrientation, yAxisOrientation, props) => {
  var {
    x,
    y,
    width,
    height
  } = viewBox;
  if (isFixedY) {
    var {
      y: yCoord
    } = props;
    var coord = scales.y.apply(yCoord, {
      position
    });
    // don't render the line if the scale can't compute a result that makes sense
    if (isNan(coord)) return null;
    if (props.ifOverflow === 'discard' && !scales.y.isInRange(coord)) {
      return null;
    }
    var points = [{
      x: x + width,
      y: coord
    }, {
      x,
      y: coord
    }];
    return yAxisOrientation === 'left' ? points.reverse() : points;
  }
  if (isFixedX) {
    var {
      x: xCoord
    } = props;
    var _coord = scales.x.apply(xCoord, {
      position
    });
    // don't render the line if the scale can't compute a result that makes sense
    if (isNan(_coord)) return null;
    if (props.ifOverflow === 'discard' && !scales.x.isInRange(_coord)) {
      return null;
    }
    var _points = [{
      x: _coord,
      y: y + height
    }, {
      x: _coord,
      y
    }];
    return xAxisOrientation === 'top' ? _points.reverse() : _points;
  }
  if (isSegment) {
    var {
      segment
    } = props;
    var _points2 = segment.map(p => scales.apply(p, {
      position
    }));
    if (props.ifOverflow === 'discard' && _points2.some(p => !scales.isInRange(p))) {
      return null;
    }
    return _points2;
  }
  return null;
};
function ReportReferenceLine(props) {
  var dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(addLine(props));
    return () => {
      dispatch(removeLine(props));
    };
  });
  return null;
}
function ReferenceLineImpl(props) {
  var {
    x: fixedX,
    y: fixedY,
    segment,
    xAxisId,
    yAxisId,
    shape,
    className,
    ifOverflow
  } = props;
  var isPanorama = useIsPanorama();
  var clipPathId = useClipPathId();
  var xAxis = useAppSelector(state => selectXAxisSettings(state, xAxisId));
  var yAxis = useAppSelector(state => selectYAxisSettings(state, yAxisId));
  var xAxisScale = useAppSelector(state => selectAxisScale(state, 'xAxis', xAxisId, isPanorama));
  var yAxisScale = useAppSelector(state => selectAxisScale(state, 'yAxis', yAxisId, isPanorama));
  var viewBox = useViewBox();
  var isFixedX = isNumOrStr(fixedX);
  var isFixedY = isNumOrStr(fixedY);
  if (!clipPathId || !viewBox || xAxis == null || yAxis == null || xAxisScale == null || yAxisScale == null) {
    return null;
  }
  var scales = createLabeledScales({
    x: xAxisScale,
    y: yAxisScale
  });
  var isSegment = segment && segment.length === 2;
  var endPoints = getEndPoints(scales, isFixedX, isFixedY, isSegment, viewBox, props.position, xAxis.orientation, yAxis.orientation, props);
  if (!endPoints) {
    return null;
  }
  var [{
    x: x1,
    y: y1
  }, {
    x: x2,
    y: y2
  }] = endPoints;
  var clipPath = ifOverflow === 'hidden' ? "url(#".concat(clipPathId, ")") : undefined;
  var lineProps = _objectSpread(_objectSpread({
    clipPath
  }, filterProps(props, true)), {}, {
    x1,
    y1,
    x2,
    y2
  });
  return /*#__PURE__*/React.createElement(Layer, {
    className: clsx('recharts-reference-line', className)
  }, renderLine(shape, lineProps), Label.renderCallByParent(props, rectWithCoords({
    x1,
    y1,
    x2,
    y2
  })));
}
function ReferenceLineSettingsDispatcher(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ReportReferenceLine, {
    yAxisId: props.yAxisId,
    xAxisId: props.xAxisId,
    ifOverflow: props.ifOverflow,
    x: props.x,
    y: props.y
  }), /*#__PURE__*/React.createElement(ReferenceLineImpl, props));
}

// eslint-disable-next-line react/prefer-stateless-function
export class ReferenceLine extends Component {
  render() {
    return /*#__PURE__*/React.createElement(ReferenceLineSettingsDispatcher, this.props);
  }
}
_defineProperty(ReferenceLine, "displayName", 'ReferenceLine');
_defineProperty(ReferenceLine, "defaultProps", {
  ifOverflow: 'discard',
  xAxisId: 0,
  yAxisId: 0,
  fill: 'none',
  stroke: '#ccc',
  fillOpacity: 1,
  strokeWidth: 1,
  position: 'middle'
});