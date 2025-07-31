"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorBar = void 0;
exports.SetErrorBarPreferredDirection = SetErrorBarPreferredDirection;
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _Layer = require("../container/Layer");
var _ReactUtils = require("../util/ReactUtils");
var _CartesianGraphicalItemContext = require("../context/CartesianGraphicalItemContext");
var _hooks = require("../hooks");
var _resolveDefaultProps = require("../util/resolveDefaultProps");
var _Animate = require("../animation/Animate");
var _excluded = ["direction", "width", "dataKey", "isAnimationActive", "animationBegin", "animationDuration", "animationEasing"];
/**
 * @fileOverview Render a group of error bar
 */
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
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
  var svgProps = (0, _ReactUtils.filterProps)(others, false);
  var {
    data,
    dataPointFormatter,
    xAxisId,
    yAxisId,
    errorBarOffset: offset
  } = (0, _CartesianGraphicalItemContext.useErrorBarContext)();
  var xAxis = (0, _hooks.useXAxis)(xAxisId);
  var yAxis = (0, _hooks.useYAxis)(yAxisId);
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
    return /*#__PURE__*/React.createElement(_Layer.Layer, _extends({
      className: "recharts-errorBar",
      key: "bar-".concat(lineCoordinates.map(c => "".concat(c.x1, "-").concat(c.x2, "-").concat(c.y1, "-").concat(c.y2)))
    }, svgProps), lineCoordinates.map(coordinates => {
      var lineStyle = isAnimationActive ? {
        transformOrigin: "".concat(coordinates.x1 - 5, "px")
      } : undefined;
      return /*#__PURE__*/React.createElement(_Animate.Animate, {
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
  return /*#__PURE__*/React.createElement(_Layer.Layer, {
    className: "recharts-errorBars"
  }, errorBars);
}
var ErrorBarPreferredDirection = /*#__PURE__*/(0, _react.createContext)(undefined);
function useErrorBarDirection(directionFromProps) {
  var preferredDirection = (0, _react.useContext)(ErrorBarPreferredDirection);
  if (directionFromProps != null) {
    return directionFromProps;
  }
  if (preferredDirection != null) {
    return preferredDirection;
  }
  return 'x';
}
function SetErrorBarPreferredDirection(_ref) {
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
  } = (0, _resolveDefaultProps.resolveDefaultProps)(props, errorBarDefaultProps);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_CartesianGraphicalItemContext.ReportErrorBarSettings, {
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
class ErrorBar extends _react.Component {
  render() {
    return /*#__PURE__*/React.createElement(ErrorBarInternal, this.props);
  }
}
exports.ErrorBar = ErrorBar;
_defineProperty(ErrorBar, "defaultProps", errorBarDefaultProps);
_defineProperty(ErrorBar, "displayName", 'ErrorBar');