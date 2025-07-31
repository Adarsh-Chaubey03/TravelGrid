var _excluded = ["direction", "width", "dataKey", "isAnimationActive", "animationBegin", "animationDuration", "animationEasing"];
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * @fileOverview Render a group of error bar
 */
import * as React from 'react';
import { Component, createContext, useContext } from 'react';
import { Layer } from '../container/Layer';
import { filterProps } from '../util/ReactUtils';
import { ReportErrorBarSettings, useErrorBarContext } from '../context/CartesianGraphicalItemContext';
import { useXAxis, useYAxis } from '../hooks';
import { resolveDefaultProps } from '../util/resolveDefaultProps';
import { Animate } from '../animation/Animate';

/**
 * So usually the direction is decided by the chart layout.
 * Horizontal layout means error bars are vertical means direction=y
 * Vertical layout means error bars are horizontal means direction=x
 *
 * Except! In Scatter chart, error bars can go both ways.
 *
 * So this property is only ever used in Scatter chart, and ignored elsewhere.
 */

/**
 * External ErrorBar props, visible for users of the library
 */

/**
 * Props after defaults, and required props have been applied.
 */

function ErrorBarImpl(props) {
  var {
      direction,
      width,
      dataKey,
      isAnimationActive,
      animationBegin,
      animationDuration,
      animationEasing
    } = props,
    others = _objectWithoutProperties(props, _excluded);
  var svgProps = filterProps(others, false);
  var {
    data,
    dataPointFormatter,
    xAxisId,
    yAxisId,
    errorBarOffset: offset
  } = useErrorBarContext();
  var xAxis = useXAxis(xAxisId);
  var yAxis = useYAxis(yAxisId);
  if ((xAxis === null || xAxis === void 0 ? void 0 : xAxis.scale) == null || (yAxis === null || yAxis === void 0 ? void 0 : yAxis.scale) == null || data == null) {
    return null;
  }

  // ErrorBar requires type number XAxis, why?
  if (direction === 'x' && xAxis.type !== 'number') {
    return null;
  }
  var errorBars = data.map(entry => {
    var {
      x,
      y,
      value,
      errorVal
    } = dataPointFormatter(entry, dataKey, direction);
    if (!errorVal) {
      return null;
    }
    var lineCoordinates = [];
    var lowBound, highBound;
    if (Array.isArray(errorVal)) {
      [lowBound, highBound] = errorVal;
    } else {
      lowBound = highBound = errorVal;
    }
    if (direction === 'x') {
      // error bar for horizontal charts, the y is fixed, x is a range value
      var {
        scale
      } = xAxis;
      var yMid = y + offset;
      var yMin = yMid + width;
      var yMax = yMid - width;
      var xMin = scale(value - lowBound);
      var xMax = scale(value + highBound);

      // the right line of |--|
      lineCoordinates.push({
        x1: xMax,
        y1: yMin,
        x2: xMax,
        y2: yMax
      });
      // the middle line of |--|
      lineCoordinates.push({
        x1: xMin,
        y1: yMid,
        x2: xMax,
        y2: yMid
      });
      // the left line of |--|
      lineCoordinates.push({
        x1: xMin,
        y1: yMin,
        x2: xMin,
        y2: yMax
      });
    } else if (direction === 'y') {
      // error bar for horizontal charts, the x is fixed, y is a range value
      var {
        scale: _scale
      } = yAxis;
      var xMid = x + offset;
      var _xMin = xMid - width;
      var _xMax = xMid + width;
      var _yMin = _scale(value - lowBound);
      var _yMax = _scale(value + highBound);

      // the top line
      lineCoordinates.push({
        x1: _xMin,
        y1: _yMax,
        x2: _xMax,
        y2: _yMax
      });
      // the middle line
      lineCoordinates.push({
        x1: xMid,
        y1: _yMin,
        x2: xMid,
        y2: _yMax
      });
      // the bottom line
      lineCoordinates.push({
        x1: _xMin,
        y1: _yMin,
        x2: _xMax,
        y2: _yMin
      });
    }
    var transformOrigin = "".concat(x + offset, "px ").concat(y + offset, "px");
    return /*#__PURE__*/React.createElement(Layer, _extends({
      className: "recharts-errorBar",
      key: "bar-".concat(lineCoordinates.map(c => "".concat(c.x1, "-").concat(c.x2, "-").concat(c.y1, "-").concat(c.y2)))
    }, svgProps), lineCoordinates.map(coordinates => {
      var lineStyle = isAnimationActive ? {
        transformOrigin: "".concat(coordinates.x1 - 5, "px")
      } : undefined;
      return /*#__PURE__*/React.createElement(Animate, {
        from: {
          transform: 'scaleY(0)',
          transformOrigin
        },
        to: {
          transform: 'scaleY(1)',
          transformOrigin
        },
        begin: animationBegin,
        easing: animationEasing,
        isActive: isAnimationActive,
        duration: animationDuration,
        key: "line-".concat(coordinates.x1, "-").concat(coordinates.x2, "-").concat(coordinates.y1, "-").concat(coordinates.y2)
        // @ts-expect-error TODO - fix the type error
        ,
        style: {
          transformOrigin
        }
      }, /*#__PURE__*/React.createElement("line", _extends({}, coordinates, {
        style: lineStyle
      })));
    }));
  });
  return /*#__PURE__*/React.createElement(Layer, {
    className: "recharts-errorBars"
  }, errorBars);
}
var ErrorBarPreferredDirection = /*#__PURE__*/createContext(undefined);
function useErrorBarDirection(directionFromProps) {
  var preferredDirection = useContext(ErrorBarPreferredDirection);
  if (directionFromProps != null) {
    return directionFromProps;
  }
  if (preferredDirection != null) {
    return preferredDirection;
  }
  return 'x';
}
export function SetErrorBarPreferredDirection(_ref) {
  var {
    direction,
    children
  } = _ref;
  return /*#__PURE__*/React.createElement(ErrorBarPreferredDirection.Provider, {
    value: direction
  }, children);
}
var errorBarDefaultProps = {
  stroke: 'black',
  strokeWidth: 1.5,
  width: 5,
  offset: 0,
  isAnimationActive: true,
  animationBegin: 0,
  animationDuration: 400,
  animationEasing: 'ease-in-out'
};
function ErrorBarInternal(props) {
  var realDirection = useErrorBarDirection(props.direction);
  var {
    width,
    isAnimationActive,
    animationBegin,
    animationDuration,
    animationEasing
  } = resolveDefaultProps(props, errorBarDefaultProps);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ReportErrorBarSettings, {
    dataKey: props.dataKey,
    direction: realDirection
  }), /*#__PURE__*/React.createElement(ErrorBarImpl, _extends({}, props, {
    direction: realDirection,
    width: width,
    isAnimationActive: isAnimationActive,
    animationBegin: animationBegin,
    animationDuration: animationDuration,
    animationEasing: animationEasing
  })));
}

// eslint-disable-next-line react/prefer-stateless-function
export class ErrorBar extends Component {
  render() {
    return /*#__PURE__*/React.createElement(ErrorBarInternal, this.props);
  }
}
_defineProperty(ErrorBar, "defaultProps", errorBarDefaultProps);
_defineProperty(ErrorBar, "displayName", 'ErrorBar');